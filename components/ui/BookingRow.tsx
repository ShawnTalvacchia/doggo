import Link from "next/link";
import type { Booking } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatShortDate, formatDateRange } from "@/lib/dateUtils";

function scheduleLabel(booking: Booking): string {
  if (booking.recurringSchedule) {
    const { days, timeLabel } = booking.recurringSchedule;
    return `Every ${days.join(", ")} · ${timeLabel}`;
  }
  return formatDateRange(booking.startDate, booking.endDate);
}

function activeSessionInfo(booking: Booking): { label: string; live: boolean } | null {
  const sessions = booking.sessions ?? [];
  const inProgress = sessions.find((s) => s.status === "in_progress");
  if (inProgress) return { label: `In progress · ${formatShortDate(inProgress.date)}`, live: true };
  const upcoming = sessions.find((s) => s.status === "upcoming");
  if (upcoming) return { label: `Next: ${formatShortDate(upcoming.date)}`, live: false };
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BookingRow({ booking }: { booking: Booking }) {
  const sessionInfo = activeSessionInfo(booking);
  const serviceLabel = SERVICE_LABELS[booking.serviceType];

  return (
    <Link href="/bookings" className={`booking-row${sessionInfo?.live ? " booking-row--live" : ""}`}>
      <div className="booking-row-avatar-wrap">
        <img
          src={booking.carerAvatarUrl}
          alt={booking.carerName}
          className="booking-row-avatar"
        />
        {sessionInfo?.live && <span className="booking-row-live-dot" aria-label="Session in progress" />}
      </div>
      <div className="booking-row-body">
        <div className="booking-row-top">
          <span className="booking-row-name">{booking.carerName}</span>
          <StatusBadge status={booking.status} />
        </div>
        <div className="booking-row-chips">
          <span className="tag tag--brand">{serviceLabel}</span>
          {booking.subService && (
            <span className="tag tag--brand">{booking.subService}</span>
          )}
          {booking.pets.map((pet) => (
            <span key={pet} className="tag">
              {pet}
            </span>
          ))}
        </div>
        <p className="booking-row-schedule">{scheduleLabel(booking)}</p>
        <p className={`booking-row-meta${sessionInfo?.live ? " booking-row-meta--live" : ""}`}>
          {sessionInfo ? (
            <>{sessionInfo.label} · </>
          ) : null}
          {booking.price.billingCycle === "per_session"
            ? `${booking.price.total.toLocaleString()} Kč / session`
            : booking.price.billingCycle === "per_night"
            ? `${booking.price.total.toLocaleString()} Kč / night`
            : `${booking.price.total.toLocaleString()} Kč total`}
        </p>
      </div>
    </Link>
  );
}
