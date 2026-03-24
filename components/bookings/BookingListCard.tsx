import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { Booking } from "@/lib/types";

/**
 * Compact booking row card for lists (Schedule, bookings overview).
 * Shows the other party's avatar, name, service, pets, and status.
 */
export function BookingListCard({
  booking,
  perspective,
}: {
  booking: Booking;
  /** Which party are we? Determines whose avatar/name to show. */
  perspective: "owner" | "carer";
}) {
  const other = perspective === "owner"
    ? { name: booking.carerName, avatarUrl: booking.carerAvatarUrl }
    : { name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl };

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="flex items-center gap-md rounded-panel p-md no-underline bg-surface-top border border-edge-light"
    >
      <img
        src={other.avatarUrl}
        alt={other.name}
        className="rounded-full shrink-0 w-10 h-10 object-cover"
      />
      <div className="flex flex-col flex-1 gap-xs">
        <span className="text-sm font-medium text-fg-primary">{other.name}</span>
        <span className="text-xs text-fg-tertiary">
          {SERVICE_LABELS[booking.serviceType]} · {booking.pets.join(", ")}
        </span>
      </div>
      <StatusBadge status={booking.status} />
    </Link>
  );
}
