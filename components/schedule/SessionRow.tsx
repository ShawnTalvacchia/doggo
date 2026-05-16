"use client";

import { Briefcase } from "@phosphor-icons/react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatMeetDate } from "@/lib/dateUtils";
import { bookingServiceLabel } from "@/lib/constants/services";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import type { Booking, BookingSession } from "@/lib/types";

export function SessionRow({
  booking,
  session,
  isActive,
  onClick,
  hideStatus = false,
}: {
  booking: Booking;
  session: BookingSession;
  isActive: boolean;
  onClick?: () => void;
  /** When true, suppresses the StatusBadge (e.g. in Upcoming tab where status is implied). */
  hideStatus?: boolean;
}) {
  const CURRENT_USER = useCurrentUserId();
  const isOwner = booking.ownerId === CURRENT_USER;
  const other = isOwner
    ? { name: booking.carerName, avatarUrl: booking.carerAvatarUrl }
    : { name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl };
  const timeLabel = booking.recurringSchedule?.timeLabel;

  return (
    <div
      className={`card-booking-block${isActive ? " card-booking-block--active" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card-booking-block-icon">
        <Briefcase size={16} weight="light" />
      </div>
      <img
        src={other.avatarUrl}
        alt={other.name}
        className="rounded-full shrink-0 object-cover"
        style={{ width: 32, height: 32 }}
      />
      <div className="flex flex-col flex-1 gap-xs min-w-0">
        <span className="text-sm font-semibold text-fg-primary">
          {bookingServiceLabel(booking)}{" "}
          <span className="font-normal text-fg-secondary">with {other.name}</span>
        </span>
        <span className="text-xs text-fg-tertiary truncate">
          {formatMeetDate(session.date)}
          {timeLabel && ` · ${timeLabel}`}
          {booking.pets.length > 0 && ` · ${booking.pets.join(", ")}`}
        </span>
      </div>
      {!hideStatus && <StatusBadge status={session.status} />}
    </div>
  );
}
