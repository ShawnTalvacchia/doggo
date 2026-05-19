"use client";

import Link from "next/link";
import {
  Tag,
  ArrowsClockwise,
  CalendarDots,
  PawPrint,
  Camera,
  ArrowRight,
  Prohibit,
} from "@phosphor-icons/react";
import type { Booking } from "@/lib/types";
import { bookingServiceLabel } from "@/lib/constants/services";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatShortDate, formatDateRange } from "@/lib/dateUtils";
import { getUserById } from "@/lib/mockUsers";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useViewedReports } from "@/lib/useViewedReports";

/* ── Helpers ── */

function scheduleLabel(booking: Booking): string {
  if (booking.recurringSchedule) {
    // Cadence, not the seeded weekday — the demo anchors upcoming sessions
    // to today regardless of the booking's stored day. Mirrors ScheduleCard.
    return `Every week · ${booking.recurringSchedule.timeLabel}`;
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
  const currentUser = useCurrentUserId();
  const isOwner = booking.ownerId === currentUser;
  const { lastViewedAt } = useViewedReports();
  // Show the OTHER party — the through-line. Owner viewing sees the
  // carer; carer viewing sees the owner. Matches the booking-detail
  // header pattern ("{otherFirstName} · {service}"); avoids the
  // tautological "{my own name}" on My Services.
  const other = isOwner
    ? { name: booking.carerName, avatarUrl: booking.carerAvatarUrl }
    : { name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl };

  const isPast = booking.status === "completed" || booking.status === "cancelled";
  const sessionInfo = activeSessionInfo(booking);
  const isLive = sessionInfo?.live === true;
  const progress = sessionProgress(booking);
  const firstPetName = booking.pets[0] ?? null;
  const firstPetAvatar = firstPetName
    ? getPetAvatarUrl(booking.ownerId, firstPetName)
    : null;

  // Owner-side loop closure: surface a "new visit report" affordance
  // when there's a completed session with a `report.completedAt`
  // newer than the viewer's last Sessions-tab visit. Tap → routes
  // straight to ?tab=sessions (skip the Info detour). Provider side
  // doesn't render this — the report came from them. Sessions &
  // Service Execution A6 walkthrough, 2026-05-05.
  const newReport = isOwner ? findNewReport(booking, lastViewedAt(booking.id)) : null;
  const hasNewReport = newReport !== null;
  // Surface a recent per-occurrence cancellation. Both owner and carer
  // see this — the cancellation is information either side wants to
  // confirm at the list level rather than dig into Sessions for. Fades
  // out naturally via recency window + supersession by a later
  // completed session. F4 walkthrough refinement, 2026-05-08.
  const recentCancellation = findRecentCancellation(booking);
  const todayIso = new Date().toISOString().slice(0, 10);
  // Meet-service bookings route to the linked meet — the meet IS the
  // session detail (Service ↔ Meet Linkage C). Care/Appointment bookings
  // route to the booking-detail page. New-report owners deep-link to the
  // Sessions tab.
  const cardHref = booking.meetBooking
    ? `/meets/${booking.meetBooking.meetId}`
    : hasNewReport
      ? `/bookings/${booking.id}?tab=sessions`
      : `/bookings/${booking.id}`;

  return (
    <Link
      href={cardHref}
      className={`booking-card${isPast ? " booking-card--past" : ""}${isLive ? " booking-card--live" : ""}`}
    >
      {/* Row 1: Avatar combo + name + status */}
      <div className="booking-card-top">
        <div className="booking-card-avatars">
          <img
            src={other.avatarUrl}
            alt={other.name}
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
          <span className="booking-card-name">{other.name}</span>
          <span className="booking-card-pets">
            {booking.pets.join(" & ")}
          </span>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Row 2: Service title */}
      <div className="booking-card-service">
        {booking.subService ?? bookingServiceLabel(booking)}
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

      {/* Row 6a: Recent cancellation indicator. Surfaces above the
          new-report row — most-recent-event-first stack order. Muted
          neutral palette (not error/red) — provider cancellation is
          routine, not a crisis. Shown to both owner and carer. */}
      {recentCancellation && (
        <div className="booking-card-cancelled">
          <Prohibit size={14} weight="bold" className="shrink-0" />
          <span>
            {recentCancellation.date === todayIso
              ? "Cancelled today"
              : `Session cancelled · ${formatShortDate(recentCancellation.date)}`}
          </span>
        </div>
      )}

      {/* Row 6b: New visit report indicator (owner-side only). Shows the
          report's `completedAt` (when the provider sent it) rather than
          the session's scheduled date — they typically match in
          practice but diverge for demo data with future-scheduled
          sessions completed in the present. */}
      {hasNewReport && newReport && (
        <div className="booking-card-new-report">
          <Camera size={14} weight="fill" className="shrink-0" />
          <span>
            New visit report from {other.name.split(" ")[0]} ·{" "}
            {formatShortDate(newReport.completedAt.slice(0, 10))}
          </span>
          <ArrowRight size={14} weight="bold" className="shrink-0" />
        </div>
      )}
    </Link>
  );
}

/** Window for the "new visit report" indicator. Reports older than this
 *  no longer count as "new" even if the viewer hasn't opened the
 *  Sessions tab — the framing implies "fresh from a recent session,"
 *  and a multi-week-old report doesn't fit that even if it's the
 *  user's first visit. Pre-seeded mock reports (e.g. kd-5 at
 *  daysAgo(7)) sit safely outside this window so a fresh demo state
 *  doesn't false-trigger the indicator. 2026-05-08. */
const NEW_REPORT_RECENCY_DAYS = 5;

/** Returns the most-recent completed session with a sealed visit report
 *  whose `completedAt` is newer than `lastViewedAt` AND within the
 *  recency window. Returns null if the owner is up to date (no unseen
 *  reports), if no reports exist, or if the latest unseen report is
 *  too old to count as "new." */
function findNewReport(
  booking: Booking,
  lastViewedAt: string | null,
): { completedAt: string } | null {
  const sessions = booking.sessions ?? [];
  const cutoffMs = Date.now() - NEW_REPORT_RECENCY_DAYS * 24 * 60 * 60 * 1000;
  let latest: { completedAt: string } | null = null;
  for (const s of sessions) {
    if (s.status !== "completed" || !s.report?.completedAt) continue;
    if (lastViewedAt && s.report.completedAt <= lastViewedAt) continue;
    // Recency check: must be within the window even if unviewed.
    if (new Date(s.report.completedAt).getTime() < cutoffMs) continue;
    if (!latest || s.report.completedAt > latest.completedAt) {
      latest = { completedAt: s.report.completedAt };
    }
  }
  return latest;
}

const CANCELLATION_RECENCY_DAYS = 14;

/** Returns the most-recently-cancelled session if (a) the cancellation
 *  happened within the last `CANCELLATION_RECENCY_DAYS` days and (b) no
 *  later completed session has superseded it (once a session on or
 *  after the cancelled date completes, the owner has moved on and the
 *  list-card indicator stops earning its space). Cancelled session has
 *  `status === "cancelled"` + a matching entry in
 *  `booking.cancelledDates` keyed by date. */
function findRecentCancellation(
  booking: Booking,
): { date: string; cancelledAt: string } | null {
  const sessions = booking.sessions ?? [];
  const cancelledDates = booking.cancelledDates ?? {};
  let latest: { date: string; cancelledAt: string } | null = null;
  for (const s of sessions) {
    if (s.status !== "cancelled") continue;
    const meta = cancelledDates[s.date];
    if (!meta) continue;
    if (!latest || meta.cancelledAt > latest.cancelledAt) {
      latest = { date: s.date, cancelledAt: meta.cancelledAt };
    }
  }
  if (!latest) return null;
  // Recency gate.
  const cutoff = Date.now() - CANCELLATION_RECENCY_DAYS * 24 * 60 * 60 * 1000;
  if (new Date(latest.cancelledAt).getTime() < cutoff) return null;
  // Supersession gate — owner has moved past it.
  const supersededBy = sessions.find(
    (s) => s.status === "completed" && s.date >= latest!.date,
  );
  if (supersededBy) return null;
  return latest;
}
