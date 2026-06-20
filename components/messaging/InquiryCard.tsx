"use client";

import { useMemo, useState } from "react";
import { PawPrint, Calendar, Repeat } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { InquiryDetails, CarerCareServiceConfig, CarerAppointmentServiceConfig } from "@/lib/types";
import { serviceLabelFor } from "@/lib/constants/services";
import { formatShortDate } from "@/lib/dateUtils";
import { getUserById } from "@/lib/mockUsers";
import { computeQuote, computeAppointmentQuote } from "@/lib/pricing";

/**
 * InquiryCard — structured artifact owners send when tapping "Book a session"
 * on a service card. Replaces the templated text-message format with a
 * legible card the provider can read at a glance.
 *
 * Provider variant carries two CTAs when status is `pending`:
 *   - "Respond with proposal" (primary) — opens ProposalForm
 *   - "Decline" (tertiary) — opens an inline decline form with optional
 *     reason. Clean refusal without negotiation; counter-suggestion lives
 *     at the proposal stage via "Suggest changes." Pricing & Proposals
 *     walkthrough 2026-05-05.
 *
 * Discover & Care G2 + G3, 2026-05-02. See `Groups & Care Model.md` →
 * Services as Catalog.
 */
export function InquiryCard({
  inquiry,
  ownerName,
  providerId,
  notes,
  variant = "owner",
  onSendProposal,
  onDecline,
}: {
  inquiry: InquiryDetails;
  ownerName: string;
  /** Provider's user id. Used to look up the carer config and compute
   *  the engine estimate displayed on the card. Pricing & Proposals
   *  walkthrough 2026-05-05. */
  providerId: string;
  /** Optional free-text the owner added alongside the inquiry. */
  notes?: string;
  /** Which side is reading. Affects header copy + status framing. */
  variant?: "owner" | "provider";
  /** Provider-only: callback to open ProposalForm. Renders the Send
   *  proposal CTA when present + status === "pending". */
  onSendProposal?: () => void;
  /** Provider-only: callback fired with optional reason text when the
   *  provider declines. Updates inquiry.status to "declined" and posts
   *  a system message in the thread. */
  onDecline?: (reason: string) => void;
}) {
  const [decliningOpen, setDecliningOpen] = useState(false);
  const [reason, setReason] = useState("");

  const serviceLabel = serviceLabelFor(inquiry);
  const petText = inquiry.pets.length > 0 ? inquiry.pets.join(" & ") : null;
  // For ongoing recurring bookings, append the start date when set.
  // "Every Mon, Wed, Fri · 8:00am · Starting May 12". Pricing & Proposals
  // walkthrough 2026-05-05.
  const scheduleText = inquiry.recurringSchedule
    ? `Every ${inquiry.recurringSchedule.days.join(", ")}${inquiry.recurringSchedule.timeLabel ? ` · ${inquiry.recurringSchedule.timeLabel}` : ""}${inquiry.startDate ? ` · Starting ${formatShortDate(inquiry.startDate)}` : ""}`
    : inquiry.startDate && inquiry.endDate
      ? `${formatShortDate(inquiry.startDate)} – ${formatShortDate(inquiry.endDate)}`
      : inquiry.startDate
        ? // Appointments are a single fixed slot — show the bare date, not
          // the open-ended "From …" used for ongoing Care start dates.
          inquiry.appointment
          ? formatShortDate(inquiry.startDate)
          : `From ${formatShortDate(inquiry.startDate)}`
        : null;

  const header = variant === "owner"
    ? `You sent an inquiry`
    : `Inquiry from ${ownerName.split(" ")[0]}`;

  const statusLabel =
    inquiry.status === "pending"
      ? "Awaiting response"
      : inquiry.status === "responded"
        ? "Responded"
        : inquiry.status === "declined"
          ? "Declined"
          : "Withdrawn";

  // Estimate — same engine the provider's ProposalForm runs. Surfaces the
  // engine output as a stable artifact on the inquiry card so both parties
  // see the same number throughout. Pricing & Proposals walkthrough
  // 2026-05-05.
  const provider = getUserById(providerId);
  const careConfig = provider?.carerProfile?.services?.find(
    (s): s is CarerCareServiceConfig =>
      s.kind === "care" && s.serviceType === inquiry.serviceType,
  );
  // Appointment inquiries price off the flat appointment config, not the
  // Care engine. Appointment booking flow, 2026-05-22.
  const apptConfig = inquiry.appointment
    ? provider?.carerProfile?.services?.find(
        (s): s is CarerAppointmentServiceConfig =>
          s.kind === "appointment" && s.id === inquiry.appointment!.serviceId,
      )
    : undefined;
  const todayISO = new Date().toISOString().slice(0, 10);
  const estimate = useMemo(() => {
    if (apptConfig) return computeAppointmentQuote(apptConfig);
    if (!careConfig) return null;
    return computeQuote(careConfig, inquiry, todayISO);
  }, [apptConfig, careConfig, inquiry, todayISO]);
  const triggeredModifiers = estimate?.lineItems.filter((li) => li.isModifier) ?? [];
  const cycleLabel = estimate?.billingCycle === "weekly" ? "/ week" : "";

  // Once the inquiry is no longer awaiting a response, the proposal card
  // (or decline reason) carries the current truth. The inquiry artifact
  // collapses to its eyebrow + title — still visible as the kickoff but
  // doesn't compete for attention or risk reading as stale info.
  // Pricing & Proposals walkthrough 2026-05-05.
  const isCollapsed = inquiry.status !== "pending";

  function handleDeclineConfirm() {
    if (!onDecline) return;
    onDecline(reason.trim());
    setDecliningOpen(false);
    setReason("");
  }

  return (
    <div className="inquiry-card">
      <div className="inquiry-card-header">
        <span className="inquiry-card-eyebrow">{header}</span>
        <span className={`inquiry-card-status inquiry-card-status--${inquiry.status}`}>
          {statusLabel}
        </span>
      </div>

      <h4 className="inquiry-card-title">
        {serviceLabel}
        {inquiry.subService && (
          <span className="inquiry-card-sub"> · {inquiry.subService}</span>
        )}
      </h4>

      {!isCollapsed && (
        <>
          <ul className="inquiry-card-rows">
            {petText && (
              <li>
                <PawPrint size={14} weight="fill" />
                <span>{petText}</span>
              </li>
            )}
            {scheduleText && (
              <li>
                <Calendar size={14} weight="fill" />
                <span>{scheduleText}</span>
              </li>
            )}
            <li>
              <Repeat size={14} weight="fill" />
              <span>{inquiry.bookingType === "ongoing" ? "Ongoing" : "One-off"}</span>
            </li>
          </ul>

          {/* Estimate — same engine output the provider sees on the
              ProposalForm. Visible on both owner + provider sides; reinforces
              the no-bargaining principle (the price is computed; provider
              reviews not composes). Pricing & Proposals walkthrough 2026-05-05. */}
          {estimate && estimate.total > 0 && (
            <div className="inquiry-card-estimate">
              <div className="inquiry-card-estimate-row">
                <span className="inquiry-card-estimate-label">Estimate</span>
                <span className="inquiry-card-estimate-total">
                  {estimate.total.toLocaleString()} Kč
                  {cycleLabel && (
                    <span className="inquiry-card-estimate-cycle"> {cycleLabel}</span>
                  )}
                </span>
              </div>
              {triggeredModifiers.length > 0 && (
                <div className="inquiry-card-estimate-modifiers">
                  {triggeredModifiers.map((m, i) => (
                    <span key={i} className="inquiry-card-estimate-modifier">
                      {m.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {notes && <p className="inquiry-card-notes">{notes}</p>}
        </>
      )}

      {/* Declined state: keep the provider's reason visible even when
          collapsed — it's the substance of the declined state, not noise.
          Other terminal states (responded, withdrawn) collapse fully and
          the proposal card / system message carries the context. */}
      {inquiry.status === "declined" && inquiry.declineReason && (
        <p className="inquiry-card-notes inquiry-card-decline-reason">
          {inquiry.declineReason}
        </p>
      )}

      {variant === "provider" && inquiry.status === "pending" && onSendProposal && (
        <>
          {!decliningOpen ? (
            <div className="inquiry-card-actions">
              {onDecline && (
                <ButtonAction
                  variant="tertiary"
                  size="sm"
                  onClick={() => setDecliningOpen(true)}
                >
                  Decline
                </ButtonAction>
              )}
              <ButtonAction variant="primary" size="sm" onClick={onSendProposal}>
                Respond with proposal
              </ButtonAction>
            </div>
          ) : (
            <div className="inquiry-card-decline-form">
              <label className="inquiry-card-decline-label" htmlFor="decline-reason">
                Help {ownerName.split(" ")[0]} understand
                <span className="inquiry-card-decline-optional"> (Optional)</span>
              </label>
              <textarea
                id="decline-reason"
                className="inquiry-card-decline-input"
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Fully booked those dates, but available the following week."
              />
              <div className="inquiry-card-actions">
                <ButtonAction
                  variant="tertiary"
                  size="sm"
                  onClick={() => {
                    setDecliningOpen(false);
                    setReason("");
                  }}
                >
                  Cancel
                </ButtonAction>
                <ButtonAction
                  variant="primary"
                  size="sm"
                  onClick={handleDeclineConfirm}
                >
                  Send decline
                </ButtonAction>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
