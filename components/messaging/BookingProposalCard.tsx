import { CalendarCheck } from "@phosphor-icons/react";
import type { ChatMessage, BookingProposalStatus } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/constants/services";

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BookingProposalCard({
  msg,
  canRespond,
  onAccept,
  onDecline,
}: {
  msg: ChatMessage;
  canRespond: boolean;
  onAccept: (msgId: string) => void;
  onDecline: (msgId: string) => void;
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

  return (
    <div className={`inbox-proposal-card inbox-proposal-card--${p.status}`}>
      <div className="inbox-proposal-header">
        <CalendarCheck size={18} weight="regular" className="inbox-proposal-icon" />
        <span className="inbox-proposal-label">Booking proposal</span>
        <span className="inbox-proposal-type-badge">
          {p.bookingType === "ongoing" ? "Ongoing" : "One time"}
        </span>
      </div>

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
            <span className="inbox-proposal-field">{item.label}</span>
            <span className="inbox-proposal-value inbox-proposal-price">
              {item.isModifier ? "+" : ""}
              {item.amount.toLocaleString()} Kč
              <span className="inbox-proposal-unit"> / {item.unit}</span>
            </span>
          </div>
        ))}
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
      </div>

      <div className="inbox-proposal-footer">
        {p.status === "pending" && canRespond ? (
          <div className="inbox-proposal-actions">
            <button
              className="inbox-proposal-btn inbox-proposal-btn--accept"
              onClick={() => onAccept(msg.id)}
            >
              Review & sign
            </button>
            <button
              className="inbox-proposal-btn inbox-proposal-btn--decline"
              onClick={() => onDecline(msg.id)}
            >
              Decline
            </button>
          </div>
        ) : (
          <span className={`inbox-proposal-status inbox-proposal-status--${p.status}`}>
            {statusLabel[p.status]}
          </span>
        )}
      </div>
    </div>
  );
}
