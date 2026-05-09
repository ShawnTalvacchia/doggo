"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Sparkle, ArrowRight, CaretDown, CaretUp } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import type { ChatMessage, BookingProposalStatus } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { formatShortDate } from "@/lib/dateUtils";

export function BookingProposalCard({
  msg,
  canRespond,
  onAccept,
  onDecline,
  onCounter,
  bookingHref,
}: {
  msg: ChatMessage;
  canRespond: boolean;
  onAccept: (msgId: string) => void;
  onDecline: (msgId: string) => void;
  /** Optional counter handler — opens ProposalForm pre-filled with this
   *  proposal's values. Discover & Care G4, 2026-05-02. */
  onCounter?: (msgId: string) => void;
  /** Route to the Bookings detail page for this conversation's booking.
   *  Surfaced in the footer of an `accepted` proposal so the recipient
   *  can jump straight to the live record. Pricing & Proposals
   *  walkthrough 2026-05-05. */
  bookingHref?: string;
}) {
  const p = msg.proposal!;

  const statusLabel: Record<BookingProposalStatus, string> = {
    pending: "Awaiting response",
    accepted: "Accepted",
    declined: "Declined",
    countered: "Countered",
  };

  const scheduleText = p.recurringSchedule
    ? `Every ${p.recurringSchedule.days.join(", ")} · ${p.recurringSchedule.timeLabel}`
    : p.endDate
    ? `${formatShortDate(p.startDate)} – ${formatShortDate(p.endDate)}`
    : `From ${formatShortDate(p.startDate)}`;

  // Once the proposal has a response (countered / declined / accepted) the
  // body collapses — like InquiryCard. The status footer carries the truth;
  // for `accepted`, that footer becomes a link to the live booking record.
  // Pricing & Proposals walkthrough 2026-05-05.
  //
  // Inbox & Notifications E3 (2026-05-08): superseded cards are tappable to
  // expand the full body inline — chronicle still inspectable on demand
  // without scrolling away. CSS subdues the header background + opacity
  // for non-pending states so they don't compete visually with the active
  // proposal sitting above or below.
  const isCollapsed = p.status !== "pending";
  const [expanded, setExpanded] = useState(false);
  const showCollapsedBody = isCollapsed && !expanded;

  return (
    <div className={`inbox-proposal-card inbox-proposal-card--${p.status}`}>
      <div className="inbox-proposal-header">
        <CalendarCheck size={18} weight="regular" className="inbox-proposal-icon" />
        <span className="inbox-proposal-label">Booking proposal</span>
        <span className="inbox-proposal-type-badge">
          {p.bookingType === "ongoing" ? "Ongoing" : "One time"}
        </span>
      </div>

      {showCollapsedBody ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inbox-proposal-body--collapsed inbox-proposal-collapsed-trigger"
          aria-expanded="false"
          aria-label="Expand booking proposal details"
        >
          <h4 className="inbox-proposal-collapsed-title">
            {SERVICE_LABELS[p.serviceType]}
            {p.subService && (
              <span className="inbox-proposal-collapsed-sub"> · {p.subService}</span>
            )}
          </h4>
          <CaretDown
            size={14}
            weight="bold"
            className="inbox-proposal-collapsed-caret"
          />
        </button>
      ) : (
      <div className="inbox-proposal-body">
        <div className="inbox-proposal-row">
          <span className="inbox-proposal-field">Service</span>
          <span className="inbox-proposal-value">
            {SERVICE_LABELS[p.serviceType]}
            {p.subService ? ` · ${p.subService}` : ""}
          </span>
        </div>
        <div className="inbox-proposal-row">
          <span className="inbox-proposal-field">Pets</span>
          <span className="inbox-proposal-value">{p.pets.join(", ")}</span>
        </div>
        <div className="inbox-proposal-row">
          <span className="inbox-proposal-field">
            {p.recurringSchedule ? "Schedule" : "Dates"}
          </span>
          <span className="inbox-proposal-value">{scheduleText}</span>
        </div>
        {p.price.lineItems.map((item, i) => (
          <div key={i} className="inbox-proposal-row">
            <span className="inbox-proposal-field">
              {item.label}
              {item.triggerNote && (
                <span className="inbox-proposal-trigger-note">{item.triggerNote}</span>
              )}
            </span>
            <span className="inbox-proposal-value inbox-proposal-price">
              {item.isModifier ? "+" : ""}
              {item.amount.toLocaleString()} Kč
              {!item.isModifier && (
                <span className="inbox-proposal-unit"> / {item.unit}</span>
              )}
            </span>
          </div>
        ))}
        {/* Custom-quote indicator. When the provider deviated from the
            system quote, this callout sits in the body — always present
            when `isOverride` (even with no written reason), so the deviation
            is surfaced explicitly. The reason text follows the label when
            set; otherwise just the label is shown. Pricing & Proposals
            walkthrough 2026-05-05 — moved out of the header where the
            badge clashed with the blue background. */}
        {p.isOverride && (
          <div className="inbox-proposal-override-callout">
            <div className="inbox-proposal-override-callout-head">
              <Sparkle size={12} weight="fill" />
              <span className="inbox-proposal-override-callout-label">Custom quote</span>
            </div>
            {p.overrideReason && (
              <div className="inbox-proposal-override-callout-reason">
                &ldquo;{p.overrideReason}&rdquo;
              </div>
            )}
          </div>
        )}
        {p.price.lineItems.length > 1 && (
          <div className="inbox-proposal-row inbox-proposal-total-row">
            <span className="inbox-proposal-field">Total</span>
            <span className="inbox-proposal-value inbox-proposal-price inbox-proposal-total">
              {p.price.total.toLocaleString()} Kč
              {p.price.billingCycle === "per_session"
                ? " / session"
                : p.price.billingCycle === "per_night"
                ? " / night"
                : ""}
            </span>
          </div>
        )}
        {/* Show-less affordance — appears only when the user has expanded a
            superseded card. Clicking returns to the compact title view.
            Pending cards never show this since they're never collapsed. */}
        {isCollapsed && expanded && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="inbox-proposal-collapse-toggle"
            aria-expanded="true"
          >
            Show less
            <CaretUp size={12} weight="bold" />
          </button>
        )}
      </div>
      )}

      <div className="inbox-proposal-footer">
        {p.status === "pending" && canRespond ? (
          <div className="inbox-proposal-actions">
            {/* Three-action row, non-CTA variants. CTA pills are reserved
                for page-level commands; these are contextual actions on a
                card inside a thread, so the slight-radius non-CTA register
                matches better. Ordered weakest → strongest:
                Not now (tertiary — transparent, lowest emphasis) on the
                left; Suggest changes (outline) + Review & sign (primary)
                clustered on the right. "Not now" is intentionally softer
                than "Decline" — community-first framing preserves the
                relationship for a future booking. */}
            <ButtonAction variant="tertiary" size="md" onClick={() => onDecline(msg.id)}>
              Not now
            </ButtonAction>
            {onCounter && (
              <ButtonAction variant="outline" size="md" onClick={() => onCounter(msg.id)}>
                Suggest changes
              </ButtonAction>
            )}
            <ButtonAction variant="primary" size="md" onClick={() => onAccept(msg.id)}>
              Review & sign
            </ButtonAction>
          </div>
        ) : p.status === "accepted" && bookingHref ? (
          <Link
            href={bookingHref}
            className="inbox-proposal-status inbox-proposal-status--accepted inbox-proposal-status-link"
          >
            {p.signedAt && (
              <span className="inbox-proposal-signed-stamp">
                Signed {new Date(p.signedAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" · "}
              </span>
            )}
            View booking
            <ArrowRight size={14} weight="bold" />
          </Link>
        ) : (
          <span className={`inbox-proposal-status inbox-proposal-status--${p.status}`}>
            {statusLabel[p.status]}
          </span>
        )}
      </div>
    </div>
  );
}
