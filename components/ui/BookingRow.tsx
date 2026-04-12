"use client";

import Link from "next/link";
import {
  Tag,
  ArrowsClockwise,
  CalendarDots,
  PawPrint,
} from "@phosphor-icons/react";
import type { Booking } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatShortDate, formatDateRange } from "@/lib/dateUtils";
import { getUserById } from "@/lib/mockUsers";

/* ── Helpers ── */

function scheduleLabel(booking: Booking): string {
  if (booking.recurringSchedule) {
    const { days, timeLabel } = booking.recurringSchedule;
    return `${days.join(" · ")} · ${timeLabel}`;
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

function sessionProgress(booking: Booking): { completed: number; total: number } | null {
  const sessions = booking.sessions;
  if (!sessions || sessions.length === 0) return null;
  const completed = sessions.filter((s) => s.status === "completed").length;
  return { completed, total: sessions.length };
}

function priceLabel(booking: Booking): string {
  const { total, billingCycle } = booking.price;
  if (billingCycle === "weekly") return `${total.toLocaleString()} Kč / week`;
  if (billingCycle === "per_session") return `${total.toLocaleString()} Kč / session`;
  if (billingCycle === "per_night") return `${total.toLocaleString()} Kč / night`;
  if (billingCycle === "monthly_est") return `~${total.toLocaleString()} Kč / month`;
  return `${total.toLocaleString()} Kč total`;
}

function getPetAvatarUrl(ownerId: string, petName: string): string | null {
  const user = getUserById(ownerId);
  if (!user) return null;
  const pet = user.pets.find(
    (p) => p.name.toLowerCase() === petName.toLowerCase()
  );
  return pet?.imageUrl ?? null;
}

/* ── Component ── */

export function BookingRow({ booking }: { booking: Booking }) {
  const sessionInfo = activeSessionInfo(booking);
  const progress = sessionProgress(booking);
  const firstPetName = booking.pets[0] ?? null;
  const firstPetAvatar = firstPetName
    ? getPetAvatarUrl(booking.ownerId, firstPetName)
    : null;

  return (
    <Link href={`/bookings/${booking.id}`} className="booking-card">
      {/* Row 1: Avatar combo + name + status */}
      <div className="booking-card-top">
        <div className="booking-card-avatars">
          <img
            src={booking.carerAvatarUrl}
            alt={booking.carerName}
            className="booking-card-avatar-person"
          />
          {firstPetAvatar ? (
            <img
              src={firstPetAvatar}
              alt={firstPetName ?? ""}
              className="booking-card-avatar-pet"
            />
          ) : (
            <span className="booking-card-avatar-pet booking-card-avatar-pet--fallback">
              <PawPrint size={12} weight="fill" />
            </span>
          )}
        </div>
        <div className="booking-card-identity">
          <span className="booking-card-name">{booking.carerName}</span>
          <span className="booking-card-pets">
            {booking.pets.join(" & ")}
          </span>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Row 2: Service title */}
      <div className="booking-card-service">
        {booking.subService ?? SERVICE_LABELS[booking.serviceType]}
      </div>

      {/* Row 3: Schedule + price */}
      <div className="booking-card-details">
        <div className="booking-card-detail-row">
          {booking.recurringSchedule ? (
            <ArrowsClockwise size={14} weight="light" className="text-fg-tertiary shrink-0" />
          ) : (
            <CalendarDots size={14} weight="light" className="text-fg-tertiary shrink-0" />
          )}
          <span>{scheduleLabel(booking)}</span>
        </div>
        <div className="booking-card-detail-row">
          <Tag size={14} weight="light" className="text-fg-tertiary shrink-0" />
          <span>{priceLabel(booking)}</span>
        </div>
      </div>

      {/* Row 4: Progress bar for one-off bookings with sessions only */}
      {progress && progress.total > 1 && booking.type === "one_off" && (
        <div className="booking-card-progress">
          <div className="booking-card-progress-bar">
            <div
              className="booking-card-progress-fill"
              style={{ width: `${(progress.completed / progress.total) * 100}%` }}
            />
          </div>
          <span className="booking-card-progress-label">
            {progress.completed} of {progress.total} sessions
          </span>
        </div>
      )}

      {/* Row 5: Next session or action hint */}
      {sessionInfo && (
        <div className={`booking-card-next ${sessionInfo.live ? "booking-card-next--live" : ""}`}>
          {sessionInfo.live ? (
            <span className="booking-card-live-dot" />
          ) : null}
          <span>{sessionInfo.label}</span>
        </div>
      )}
    </Link>
  );
}
