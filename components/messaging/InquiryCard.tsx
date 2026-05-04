"use client";

import { PawPrint, Calendar, Repeat } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { InquiryDetails } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { formatShortDate } from "@/lib/dateUtils";

/**
 * InquiryCard — structured artifact owners send when tapping "Book a session"
 * on a service card. Replaces the templated text-message format with a
 * legible card the provider can read at a glance.
 *
 * Provider variant carries a "Send proposal" CTA when status is `pending`.
 * Discover & Care G2 + G3, 2026-05-02. See `Groups & Care Model.md` →
 * Services as Catalog.
 */
export function InquiryCard({
  inquiry,
  ownerName,
  notes,
  variant = "owner",
  onSendProposal,
}: {
  inquiry: InquiryDetails;
  ownerName: string;
  /** Optional free-text the owner added alongside the inquiry. */
  notes?: string;
  /** Which side is reading. Affects header copy + status framing. */
  variant?: "owner" | "provider";
  /** Provider-only: callback to open ProposalForm. Renders the Send
   *  proposal CTA when present + status === "pending". */
  onSendProposal?: () => void;
}) {
  const serviceLabel = SERVICE_LABELS[inquiry.serviceType];
  const petText = inquiry.pets.length > 0 ? inquiry.pets.join(" & ") : null;
  const scheduleText = inquiry.recurringSchedule
    ? `Every ${inquiry.recurringSchedule.days.join(", ")}${inquiry.recurringSchedule.timeLabel ? ` · ${inquiry.recurringSchedule.timeLabel}` : ""}`
    : inquiry.startDate && inquiry.endDate
      ? `${formatShortDate(inquiry.startDate)} – ${formatShortDate(inquiry.endDate)}`
      : inquiry.startDate
        ? `From ${formatShortDate(inquiry.startDate)}`
        : null;

  const header = variant === "owner"
    ? `You sent an inquiry`
    : `Inquiry from ${ownerName.split(" ")[0]}`;

  const statusLabel = inquiry.status === "pending"
    ? "Awaiting response"
    : inquiry.status === "responded"
      ? "Responded"
      : "Withdrawn";

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

      {notes && <p className="inquiry-card-notes">{notes}</p>}

      {variant === "provider" && inquiry.status === "pending" && onSendProposal && (
        <div className="inquiry-card-actions">
          <ButtonAction variant="primary" size="sm" cta onClick={onSendProposal}>
            Respond with proposal
          </ButtonAction>
        </div>
      )}
    </div>
  );
}
