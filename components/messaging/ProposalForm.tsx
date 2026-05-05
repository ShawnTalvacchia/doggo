"use client";

import { useEffect, useMemo, useState } from "react";
import { PencilSimple, Warning } from "@phosphor-icons/react";
import type {
  Conversation,
  BookingPrice,
  BookingProposal,
  InquiryDetails,
  CarerCareServiceConfig,
} from "@/lib/types";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { formatShortDate } from "@/lib/dateUtils";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { computeQuote, quotesMatch } from "@/lib/pricing";
import { getUserById } from "@/lib/mockUsers";

const PLATFORM_FEE_PERCENT = 12;

/**
 * Provider-side proposal builder.
 *
 * Default state is **read-only** — the auto-pricing engine
 * (`computeQuote(config, inquiry, today)`) generates a quote from the
 * provider's per-service config (base rate + modifiers) and the owner's
 * inquiry details, and the provider just confirms it. This structurally
 * enforces the no-bargaining principle: the system computes the right
 * number, the provider doesn't compose it.
 *
 * Override mode is available via "Adjust this quote." When the provider
 * deviates, the line items become editable and the proposal is flagged
 * `isOverride: true` with an optional `overrideReason` so the owner can
 * see a deviation happened — deviations stay possible (real providers
 * need exceptions) but they're visible, not silent.
 *
 * Pricing & Proposals, 2026-05-04. Replaces the earlier "compose price
 * freely" pattern from Discover & Care G3.
 */
export function ProposalForm({
  conv,
  open,
  onClose,
  onSubmit,
  inquiry,
  initialPrice,
}: {
  conv: Conversation;
  open: boolean;
  onClose: () => void;
  onSubmit: (proposal: BookingProposal) => void;
  /** Override the inquiry source — used when responding to a specific
   *  InquiryCard message (G3) or composing a counter (G4). Defaults to
   *  `conv.inquiry`. */
  inquiry?: InquiryDetails;
  /** Pre-fill the price (counter flow). Otherwise auto-calculates from
   *  the carer config via `computeQuote`. */
  initialPrice?: BookingPrice;
}) {
  // Derive the source inquiry. When the caller passes an InquiryCard's data
  // explicitly, we prefer that; otherwise fall back to the conv-level shape
  // for backward compat with the legacy templated-text path.
  const sourceInquiry: InquiryDetails = useMemo(() => {
    if (inquiry) return inquiry;
    return {
      bookingType: conv.inquiry.bookingType,
      serviceType: conv.inquiry.serviceType,
      subService: conv.inquiry.subService,
      pets: conv.inquiry.pets,
      startDate: conv.inquiry.startDate,
      endDate: conv.inquiry.endDate,
      recurringSchedule: conv.inquiry.recurringSchedule,
      notes: conv.inquiry.message?.trim() || undefined,
      status: "pending",
    };
  }, [inquiry, conv.inquiry]);

  const ownerFirst = conv.ownerName.split(" ")[0];
  const todayISO = new Date().toISOString().slice(0, 10);

  // Look up the provider's actual Care config for the inquired service.
  const provider = getUserById(conv.providerId);
  const careService: CarerCareServiceConfig | undefined = provider?.carerProfile?.services?.find(
    (s): s is CarerCareServiceConfig =>
      s.kind === "care" && s.serviceType === sourceInquiry.serviceType,
  );

  // System quote — the canonical answer. If the carer has no config for
  // this service (shouldn't happen in practice; would mean the inquiry was
  // sent to someone who doesn't offer it), fall back to a 0-Kč skeleton
  // that the provider must override.
  const systemQuote: BookingPrice = useMemo(() => {
    if (!careService) {
      return {
        lineItems: [
          {
            label: SERVICE_LABELS[sourceInquiry.serviceType],
            amount: 0,
            unit: "per session",
          },
        ],
        total: 0,
        currency: "Kč",
        billingCycle: "per_session",
      };
    }
    return computeQuote(careService, sourceInquiry, todayISO);
  }, [careService, sourceInquiry, todayISO]);

  // Working price — what the provider will send. Starts from the system
  // quote (or the initialPrice in counter flow). Edits in override mode
  // mutate this; we compare against `systemQuote` to detect deviations.
  const [price, setPrice] = useState<BookingPrice>(initialPrice ?? systemQuote);
  const [editing, setEditing] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");

  // Re-seed local state each time the modal opens. The component stays
  // mounted across open/close cycles (ModalSheet portals away when closed
  // but ProposalForm itself doesn't unmount), so without this effect the
  // initial useState values stick across openings — counter flow would
  // show stale price + read-only mode instead of the source proposal's
  // price in editing mode. Pricing & Proposals walkthrough 2026-05-05.
  useEffect(() => {
    if (!open) return;
    const startPrice = initialPrice ?? systemQuote;
    setPrice(startPrice);
    setOverrideReason("");
    setEditing(initialPrice ? !quotesMatch(initialPrice, systemQuote) : false);
  }, [open, initialPrice, systemQuote]);

  // Counter flow: if the caller passed `initialPrice` and it doesn't match
  // the engine's output, we're starting from a pre-existing override —
  // open in editing mode so the provider can see/adjust the deviation.
  const isOverride = !quotesMatch(price, systemQuote);

  const platformFee = Math.round((price.total * PLATFORM_FEE_PERCENT) / 100);
  const ownerTotal = price.total + platformFee;
  const isWeekly = price.billingCycle === "weekly";
  const cycleLabel = isWeekly ? " / week" : "";
  const canSubmit = price.total > 0;

  function updateLineItem(idx: number, patch: Partial<BookingPrice["lineItems"][number]>) {
    const next = price.lineItems.map((li, i) => (i === idx ? { ...li, ...patch } : li));
    setPrice({ ...price, lineItems: next, total: next.reduce((s, li) => s + li.amount, 0) });
  }

  function resetToSystemQuote() {
    setPrice(systemQuote);
    setOverrideReason("");
    setEditing(false);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    const reason = overrideReason.trim();
    const proposal: BookingProposal = {
      bookingType: sourceInquiry.bookingType,
      serviceType: sourceInquiry.serviceType,
      subService: sourceInquiry.subService,
      pets: sourceInquiry.pets.length > 0 ? sourceInquiry.pets : ["Pet"],
      startDate: sourceInquiry.startDate ?? new Date().toISOString().slice(0, 10),
      endDate: sourceInquiry.bookingType === "one_off" ? sourceInquiry.endDate : null,
      recurringSchedule:
        sourceInquiry.bookingType === "ongoing" ? sourceInquiry.recurringSchedule : undefined,
      price,
      status: "pending",
      isOverride,
      overrideReason: isOverride && reason.length > 0 ? reason : undefined,
    };
    onSubmit(proposal);
  }

  // Render a one-line summary of the inquiry — what they asked for.
  const summaryLine = [
    SERVICE_LABELS[sourceInquiry.serviceType],
    sourceInquiry.subService,
    sourceInquiry.pets.length > 0 ? sourceInquiry.pets.join(" & ") : null,
    sourceInquiry.bookingType === "ongoing" ? "Ongoing" : "One-off",
  ]
    .filter(Boolean)
    .join(" · ");

  const scheduleLine = sourceInquiry.recurringSchedule
    ? `Every ${sourceInquiry.recurringSchedule.days.join(", ")} · ${sourceInquiry.recurringSchedule.timeLabel}`
    : sourceInquiry.startDate && sourceInquiry.endDate
      ? `${formatShortDate(sourceInquiry.startDate)} – ${formatShortDate(sourceInquiry.endDate)}`
      : sourceInquiry.startDate
        ? `From ${formatShortDate(sourceInquiry.startDate)}`
        : null;

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title={`Proposal for ${ownerFirst}`}
      footer={
        <div className="flex gap-sm justify-end">
          <ButtonAction variant="outline" size="md" onClick={onClose}>
            Cancel
          </ButtonAction>
          <ButtonAction variant="primary" size="md" onClick={handleSubmit} disabled={!canSubmit}>
            Send proposal
          </ButtonAction>
        </div>
      }
    >
      <div className="proposal-form">
        {/* Inquiry summary */}
        <section className="proposal-form-section">
          <h4 className="proposal-form-eyebrow">{ownerFirst}&apos;s inquiry</h4>
          <p className="proposal-form-summary">{summaryLine}</p>
          {scheduleLine && <p className="proposal-form-schedule">{scheduleLine}</p>}
          {sourceInquiry.notes && (
            <p className="proposal-form-notes">&ldquo;{sourceInquiry.notes}&rdquo;</p>
          )}
        </section>

        {/* Price — auto-calculated from carer config + inquiry */}
        <section className="proposal-form-section">
          <div className="proposal-form-price-header">
            <h4 className="proposal-form-eyebrow">
              {editing ? "Adjusted quote" : "System quote"}
            </h4>
            {!editing && (
              <button
                type="button"
                className="proposal-form-adjust-btn"
                onClick={() => setEditing(true)}
              >
                <PencilSimple size={14} weight="regular" />
                Adjust this quote
              </button>
            )}
          </div>

          {!editing ? (
            // ── Read-only quote (default) ──
            <div className="proposal-form-quote-list">
              {price.lineItems.map((item, idx) => (
                <div key={idx} className="proposal-form-quote-row">
                  <div className="proposal-form-quote-label-col">
                    <span className="proposal-form-quote-label">{item.label}</span>
                    {item.triggerNote && (
                      <span className="proposal-form-quote-note">{item.triggerNote}</span>
                    )}
                  </div>
                  <span className="proposal-form-quote-amount">
                    {item.isModifier ? "+ " : ""}
                    {item.amount.toLocaleString()} Kč
                  </span>
                </div>
              ))}
            </div>
          ) : (
            // ── Editable mode (override) ──
            <>
              <div className="proposal-form-price-list">
                {price.lineItems.map((item, idx) => {
                  const original = systemQuote.lineItems[idx];
                  const deviates =
                    !original ||
                    original.label !== item.label ||
                    original.amount !== item.amount;
                  return (
                    <div
                      key={idx}
                      className={`proposal-form-price-row${
                        deviates ? " proposal-form-price-row--deviates" : ""
                      }`}
                    >
                      <input
                        className="proposal-form-price-label"
                        value={item.label}
                        onChange={(e) => updateLineItem(idx, { label: e.target.value })}
                        aria-label="Line item label"
                      />
                      <div className="proposal-form-price-amount">
                        <input
                          type="number"
                          min={0}
                          value={item.amount}
                          onChange={(e) =>
                            // Clamp to 0+ — line items REPLACE the original
                            // amount (they don't subtract), so negative
                            // values would invert the math without warning.
                            // `min={0}` blocks the spinner; the clamp
                            // defends against paste / manual entry.
                            // Pricing & Proposals walkthrough 2026-05-05.
                            updateLineItem(idx, {
                              amount: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          aria-label="Line item amount"
                        />
                        <span className="proposal-form-price-unit">Kč</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {isOverride && (
                <div className="proposal-form-override-callout">
                  <Warning size={16} weight="fill" className="proposal-form-override-icon" />
                  <div className="proposal-form-override-body">
                    <p className="proposal-form-override-title">
                      You&apos;re sending a custom quote
                    </p>
                    <p className="proposal-form-override-sub">
                      This deviates from your configured pricing. {ownerFirst} will see it
                      flagged as a custom quote.
                    </p>
                    <input
                      type="text"
                      className="proposal-form-override-reason"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="Optional: why? e.g. repeat client, intro rate"
                      aria-label="Override reason"
                    />
                    <button
                      type="button"
                      className="proposal-form-override-reset"
                      onClick={resetToSystemQuote}
                    >
                      Reset to system quote
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="proposal-form-price-summary">
            <div className="proposal-form-price-line">
              <span>Subtotal</span>
              <span>{price.total.toLocaleString()} Kč{cycleLabel}</span>
            </div>
            <div className="proposal-form-price-line proposal-form-price-line--muted">
              <span>Platform fee ({PLATFORM_FEE_PERCENT}%) — added at checkout</span>
              <span>+ {platformFee.toLocaleString()} Kč</span>
            </div>
            <div className="proposal-form-price-line proposal-form-price-line--total">
              <span>Owner pays</span>
              <span>{ownerTotal.toLocaleString()} Kč{cycleLabel}</span>
            </div>
          </div>
        </section>
      </div>
    </ModalSheet>
  );
}
