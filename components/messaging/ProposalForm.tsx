"use client";

import { useMemo, useState } from "react";
import type {
  Conversation,
  BookingPrice,
  BookingProposal,
  InquiryDetails,
} from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { formatShortDate } from "@/lib/dateUtils";
import { buildProposalPrice } from "@/lib/pricing";
import { getUserById } from "@/lib/mockUsers";

const PLATFORM_FEE_PERCENT = 12;

/**
 * Provider-side proposal builder. Pre-fills from the conversation's inquiry
 * (or an explicit `inquiry` prop, used by counter flow), auto-calculates the
 * price using the provider's actual `pricePerUnit` from their carer profile,
 * and shows the platform fee transparently. Provider can edit line items
 * before sending.
 *
 * Discover & Care G3, 2026-05-02. Counter flow (G4) reuses this form
 * pre-filled with the existing proposal's values via `initialPrice`.
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
   *  provider rate. */
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

  // Look up the provider's actual rate for the inquired service.
  const provider = getUserById(conv.providerId);
  const careService = provider?.carerProfile?.services?.find(
    (s) => s.kind === "care" && s.serviceType === sourceInquiry.serviceType,
  );
  const baseRate = careService?.kind === "care" ? careService.pricePerUnit : 0;
  const priceUnit = careService?.kind === "care" ? careService.priceUnit : "per_visit";

  const [price, setPrice] = useState<BookingPrice>(
    initialPrice ??
      buildProposalPrice(
        sourceInquiry,
        baseRate,
        priceUnit,
        SERVICE_LABELS[sourceInquiry.serviceType],
      ),
  );

  const platformFee = Math.round((price.total * PLATFORM_FEE_PERCENT) / 100);
  const ownerTotal = price.total + platformFee;
  const isWeekly = price.billingCycle === "weekly";
  const cycleLabel = isWeekly ? " / week" : "";
  const canSubmit = price.total > 0;

  function updateLineItem(idx: number, patch: Partial<BookingPrice["lineItems"][number]>) {
    const next = price.lineItems.map((li, i) => (i === idx ? { ...li, ...patch } : li));
    setPrice({ ...price, lineItems: next, total: next.reduce((s, li) => s + li.amount, 0) });
  }

  function handleSubmit() {
    if (!canSubmit) return;
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

        {/* Price — auto-calculated from provider rate, editable */}
        <section className="proposal-form-section">
          <h4 className="proposal-form-eyebrow">Price</h4>
          <div className="proposal-form-price-list">
            {price.lineItems.map((item, idx) => (
              <div key={idx} className="proposal-form-price-row">
                <input
                  className="proposal-form-price-label"
                  value={item.label}
                  onChange={(e) => updateLineItem(idx, { label: e.target.value })}
                  aria-label="Line item label"
                />
                <div className="proposal-form-price-amount">
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateLineItem(idx, { amount: Number(e.target.value) || 0 })}
                    aria-label="Line item amount"
                  />
                  <span className="proposal-form-price-unit">Kč</span>
                </div>
              </div>
            ))}
          </div>
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

