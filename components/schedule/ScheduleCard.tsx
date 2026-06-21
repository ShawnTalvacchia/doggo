"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PersonSimpleWalk,
  Tree,
  PawPrint,
  Target,
  MapPin,
  ArrowsClockwise,
  Briefcase,
  Clock,
  CalendarDots,
  CaretRight,
  X,
  Timer,
  Prohibit,
  Play,
} from "@phosphor-icons/react";
import type { Meet, MeetType, Booking, BookingSession } from "@/lib/types";
import { MEET_TYPE_LABELS } from "@/lib/mockMeets";
import { bookingServiceLabel } from "@/lib/constants/services";
import { getUserById } from "@/lib/mockUsers";
import { formatShortDate } from "@/lib/dateUtils";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useBookings } from "@/contexts/BookingsContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { buildSessionStartedNotification } from "@/lib/notificationBuilders";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { recurrenceLabel, getOccurrenceCancellation } from "@/lib/meetUtils";
import type { MeetRole } from "@/components/meets/CardMeet";

/* ── Icons ─────────────────────────────────────────────────────── */

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={13} weight="light" />,
  park_hangout: <Tree size={13} weight="light" />,
  playdate: <PawPrint size={13} weight="light" />,
  training: <Target size={13} weight="light" />,
};

const ROLE_LABELS: Record<MeetRole, string> = {
  hosting: "Hosting",
  joining: "Joining",
  interested: "Interested",
};

const PAST_ROLE_LABELS: Record<MeetRole, string> = {
  hosting: "Hosted",
  joining: "Attended",
  interested: "Was interested",
};

/* ── Helpers ───────────────────────────────────────────────────── */

function formatTime(time: string): string {
  return time.slice(0, 5);
}

/** Look up a pet's avatar from the owner's user profile */
function getPetAvatarUrl(ownerId: string, petName: string): string | null {
  const user = getUserById(ownerId);
  if (!user) return null;
  const pet = user.pets.find(
    (p) => p.name.toLowerCase() === petName.toLowerCase()
  );
  return pet?.imageUrl ?? null;
}

/** Map sub-service / service type to an action verb */
function getServiceVerb(booking: Booking): string {
  const sub = booking.subService?.toLowerCase() ?? "";
  if (sub.includes("walk")) return "walking";
  if (sub.includes("sitting") || sub.includes("visit")) return "minding";
  if (sub.includes("overnight") || sub.includes("boarding")) return "hosting";
  if (sub.includes("training") || sub.includes("session")) return "training";

  // Fallback by service type
  if (booking.serviceType === "walks_checkins") return "walking";
  if (booking.serviceType === "house_sitting") return "sitting for";
  if (booking.serviceType === "day_care") return "minding";
  if (booking.serviceType === "boarding") return "hosting";
  return "caring for";
}

/** Build a descriptive label for the care relationship */
function buildCareLabel(booking: Booking, isOwner: boolean): string {
  const petNames = booking.pets.join(" & ");
  const verb = getServiceVerb(booking);

  if (isOwner) {
    // "Olga walking Spot"
    return `${booking.carerName} ${verb} ${petNames}`;
  }
  // "Walking Spot for Marie"
  const capitalVerb = verb.charAt(0).toUpperCase() + verb.slice(1);
  return `${capitalVerb} ${petNames} for ${booking.ownerName}`;
}

/* ── Avatar combo: person + dog overlapping ──────────────────── */

function AvatarCombo({
  personUrl,
  personName,
  petUrl,
  petName,
}: {
  personUrl: string;
  personName: string;
  petUrl: string | null;
  petName: string;
}) {
  return (
    <div className="sched-avatar-combo">
      <img
        src={personUrl}
        alt={personName}
        className="sched-avatar-person"
      />
      {petUrl ? (
        <img
          src={petUrl}
          alt={petName}
          className="sched-avatar-pet"
        />
      ) : (
        <span className="sched-avatar-pet sched-avatar-pet--fallback">
          <PawPrint size={12} weight="fill" />
        </span>
      )}
    </div>
  );
}

/* ── Meet schedule card ────────────────────────────────────────── */

export function ScheduleMeetCard({
  meet,
  role,
  date,
  isRecent = false,
  isPast = false,
  onDismiss,
}: {
  meet: Meet;
  role: MeetRole;
  /** ISO YYYY-MM-DD of the specific occurrence this card represents. Used for
   *  per-occurrence cancellation lookup on recurring meets — without it we
   *  couldn't tell "this Wednesday is rained out" apart from any other
   *  Wednesday in the series. Optional for surfaces that legitimately render
   *  series-level (e.g. "Suggested" lane); when omitted the card falls back
   *  to series-level cancellation only. */
  date?: string;
  /** Recent completed meet — links to connect page, shows brand-fill Review CTA. */
  isRecent?: boolean;
  /** Past meet not eligible for review (older than 14 days, or already dismissed/reviewed).
   *  Same card shape as the standard upcoming meet, but role labels flip to past tense
   *  ("Joining" → "Attended"), and the card links to the meet detail page only. */
  isPast?: boolean;
  /** When set on a recent card, renders a × button that calls this instead of
   *  navigating. The handler prevents the wrapping link from firing. */
  onDismiss?: () => void;
}) {
  const goingCount = meet.attendees.filter(
    (a) => (a.rsvpStatus ?? "going") === "going"
  ).length;

  const href = isRecent ? `/meets/${meet.id}/connect` : `/meets/${meet.id}`;

  // Recent (review) cards diverge from upcoming-meet cards — different job,
  // different content priorities. Identification work happens via the brand
  // left stripe (inherited from `.sched-card--meet`); the body stays
  // surface-top so it doesn't shout. Urgency communication is owned by the
  // History tab's notification badge, so the card itself can stay calm.
  // Two rows: title + meta (in body), then a footer action bar with Skip
  // + Review. The wrapping <Link> is the click target — the action
  // buttons stop propagation so they don't double-fire navigation.
  if (isRecent) {
    return (
      <Link
        href={href}
        className="sched-card sched-card--meet sched-card--recent"
        style={{ textDecoration: "none" }}
      >
        {/* Body: title + meta. Padding lives here so the footer's tinted
            background can clip cleanly to the card's rounded corners. */}
        <div className="sched-card-recent-body">
          <h3 className="sched-card-title">{meet.title}</h3>

          <div className="sched-card-meta sched-card-meta--review">
            <span className="inline-flex items-center gap-xs shrink-0">
              {MEET_ICONS[meet.type]}
              {MEET_TYPE_LABELS[meet.type]}
            </span>
            <span className="sched-card-dot">·</span>
            <span className="shrink-0">{formatTime(meet.time)}</span>
            <span className="sched-card-dot">·</span>
            <MapPin size={14} weight="light" className="shrink-0" />
            <span className="truncate">{meet.location}</span>
            <span className="sched-card-dot">·</span>
            <span className="shrink-0">{goingCount}/{meet.maxAttendees}</span>
          </div>
        </div>

        {/* Footer action bar — Skip (tertiary) + Review (brand). Skip is a
            real <button> that stops propagation so it doesn't fire the
            wrapping <Link>; Review is a styled <span> since the link IS
            the navigation. */}
        <div className="sched-card-recent-footer">
          {onDismiss ? (
            <button
              type="button"
              className="sched-card-recent-action"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDismiss();
              }}
            >
              <X size={12} weight="bold" />
              Skip
            </button>
          ) : (
            <span className="sched-card-recent-action" aria-hidden />
          )}
          <span className="sched-card-recent-action sched-card-recent-action--primary">
            Review
            <CaretRight size={14} weight="bold" />
          </span>
        </div>
      </Link>
    );
  }

  const roleLabels = isPast ? PAST_ROLE_LABELS : ROLE_LABELS;
  // Cancelled treatment — strikethrough title + "Cancelled" pill replaces
  // role pill + muted card. Card stays tappable so the user can land on
  // the meet detail and see the cancellation reason.
  //
  // Two paths to cancelled:
  //   - Series-level (`meet.status === "cancelled"`): the whole meet is
  //     dead; one-off meets and cancelled recurring series both use this.
  //   - Per-occurrence (`meet.cancelledDates[date]`): just this date is
  //     dead; the rest of the series is still active. `getOccurrenceCancellation`
  //     returns the right thing for either path when a date is provided.
  const occCancellation = date ? getOccurrenceCancellation(meet, date) : null;
  const isCancelled = meet.status === "cancelled" || occCancellation !== null;
  const cancellationReason = occCancellation?.reason ?? meet.cancellationReason;

  return (
    <Link
      href={href}
      className={`sched-card sched-card--meet${isPast ? " sched-card--past" : ""}${isCancelled ? " sched-card--cancelled" : ""}`}
      style={{ textDecoration: "none" }}
    >
      {/* Row 1: Time + recurring (left, your-perspective metadata) ·
          single corner pill (right).
          The corner pill carries the viewer's role (Hosting / Joining /
          Interested) — filled brand when hosting, lighter brand when
          attending. The meet-type icon stays as the pill's glyph so the
          categorical type (walk / hangout / playdate / training) is still
          legible without a second competing badge. This collapses the old
          two-badge row (role chip left + type pill right — the eye
          ricocheted between corners) into one pill, mirroring the care
          card's single Providing/Care pill.
          For cancelled meets, the pill flips to a "Cancelled" label using
          error-toned styling — that becomes the most important state to
          communicate, more than whether the user was Going. */}
      <div className="sched-card-top">
        <span className="sched-card-time">
          <Clock size={14} weight="light" />
          {formatTime(meet.time)}
        </span>
        {recurrenceLabel(meet) && (
          <span className="sched-card-recurring">
            <ArrowsClockwise size={12} weight="light" />
            {recurrenceLabel(meet)}
          </span>
        )}
        <span className="flex-1" />
        {isCancelled ? (
          <span
            className="flex items-center gap-xs text-sm font-semibold shrink-0"
            style={{ color: "var(--status-error-strong)" }}
          >
            <X size={11} weight="bold" />
            Cancelled
          </span>
        ) : (
          <span
            className="flex items-center gap-xs text-sm font-semibold shrink-0"
            style={{ color: "var(--brand-main)" }}
          >
            {MEET_ICONS[meet.type]}
            {roleLabels[role]}
          </span>
        )}
      </div>

      {/* Row 2: Title — strike-through when cancelled. */}
      <h3 className={`sched-card-title${isCancelled ? " line-through" : ""}`}>{meet.title}</h3>

      {/* Cancellation reason caption — only when cancelled and a reason is
          set. Sits between title and the standard meta row so the "why"
          lands right next to the strikethrough title rather than mixed in
          with location / count. */}
      {isCancelled && cancellationReason && (
        <span className="text-xs text-fg-tertiary">{cancellationReason}</span>
      )}

      {/* Row 3: Location · going count · price (if paid). Role used to
          live here in the right slot — moved to row 1 (see top-row
          comment). Price surfaces last on care-group meets so users
          can tell at a glance which scheduled items are paid — without
          it, a free meet and a paid one looked identical on Schedule
          until you tap in. Stronger weight + secondary color makes the
          price the visual anchor of the line; standard info (location,
          count) reads as supporting context. */}
      <div className="sched-card-meta">
        <MapPin size={14} weight="light" className="shrink-0" />
        <span className="truncate">{meet.location}</span>
        <span className="sched-card-dot">·</span>
        <span>{goingCount}/{meet.maxAttendees}</span>
        {meet.serviceCTA?.price && (
          <>
            <span className="sched-card-dot">·</span>
            <span className="font-semibold text-fg-secondary">
              {meet.serviceCTA.price}
            </span>
          </>
        )}
      </div>
    </Link>
  );
}

/* ── Care session schedule card ────────────────────────────────── */

export function ScheduleCareCard({
  booking,
  session,
}: {
  booking: Booking;
  session: BookingSession;
}) {
  const CURRENT_USER = useCurrentUserId();
  const router = useRouter();
  const { updateSession } = useBookings();
  const { addNotification } = useNotifications();
  const isOwner = booking.ownerId === CURRENT_USER;
  const isProviding = !isOwner;
  const other = isOwner
    ? { name: booking.carerName, avatarUrl: booking.carerAvatarUrl }
    : { name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl };
  const timeLabel = booking.recurringSchedule?.timeLabel;
  const isOneOff = !booking.recurringSchedule;
  const isLive = session.status === "in_progress";
  const isCancelled = session.status === "cancelled";
  const cancelReason = booking.cancelledDates?.[session.date]?.reason;

  // Quick-start affordance: when the carer's looking at TODAY's
  // upcoming session, surface a Start button right on the schedule
  // card. Tap → flips status to in_progress + routes to the booking's
  // Sessions tab where the Active panel takes over. Saves the carer
  // ~3 taps on their most-frequent path. Sessions & Service Execution
  // A3 walkthrough refinement, 2026-05-06.
  const today = new Date().toISOString().slice(0, 10);
  const showQuickStart =
    isProviding && session.status === "upcoming" && session.date === today;

  function handleQuickStart() {
    updateSession(booking.id, session.id, {
      status: "in_progress",
      checkedInAt: new Date().toISOString(),
    });
    // Owner-facing notification — fires on every Start path so the bell
    // matches the booking-detail funnel. Inbox & Notifications A2,
    // 2026-05-08.
    addNotification(buildSessionStartedNotification(booking, session));
    // Quick-start lands directly on the active-session sub-page —
    // provider's most-frequent path is "tap Start, do session" so the
    // routing should drop them straight onto the engagement surface
    // (no booking detail flash in between). 2026-05-08.
    router.push(`/bookings/${booking.id}/active`);
  }

  // Operational location hint — *who travels* depends on the booking shape.
  // Walks now carry an explicit `Booking.delivery` (Walk Service Delivery,
  // 2026-05-20): pickup → carer comes to the owner's neighbourhood;
  // drop-off → owner goes to the carer's. Non-walk Care bookings still use
  // the implicit rule (handover at the carer's home / owner's home depending
  // on the service shape — boarding/day_care = carer, house_sitting goes to
  // owner's). Legacy walk bookings without `delivery` default to pickup,
  // matching the pre-2026-05-20 hard-coded rule.
  const isWalk = booking.serviceType === "walks_checkins";
  const walkDelivery = isWalk ? (booking.delivery ?? "pickup") : null;
  const handoverParty =
    isWalk
      ? walkDelivery === "pickup"
        ? getUserById(booking.ownerId)
        : getUserById(booking.carerId)
      : booking.serviceType === "house_sitting"
        ? getUserById(booking.ownerId)
        : getUserById(booking.carerId);
  const handoverNeighbourhood = handoverParty?.neighbourhood;
  // Prefer the booking's specific handoff location when the owner set one
  // (C2/C3, 2026-06-15); fall back to the handover party's neighbourhood.
  const handoverLabel =
    isWalk && booking.deliveryLocation
      ? booking.deliveryLocation
      : handoverNeighbourhood;

  // Get the first pet's avatar for the combo
  const firstPetName = booking.pets[0] ?? null;
  const firstPetAvatar = firstPetName
    ? getPetAvatarUrl(booking.ownerId, firstPetName)
    : null;

  const careLabel = buildCareLabel(booking, isOwner);

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className={`sched-card sched-card--care${isCancelled ? " sched-card--cancelled" : ""}`}
      style={{ textDecoration: "none" }}
    >
      {/* Row 1: Time or date range (left) · recurring days or one-off · pill (right) */}
      <div className="sched-card-top">
        {isLive ? (
          <span
            className="inline-flex items-center gap-xs px-sm py-xs text-xs font-semibold rounded-pill"
            style={{ background: "var(--status-warning-main)", color: "white" }}
          >
            <Timer size={12} weight="fill" />
            Active now
          </span>
        ) : isCancelled ? (
          <span
            className="inline-flex items-center gap-xs px-sm py-xs text-xs font-semibold rounded-pill"
            style={{ background: "var(--surface-inset)", color: "var(--text-tertiary)" }}
          >
            <Prohibit size={12} weight="light" />
            Cancelled
          </span>
        ) : timeLabel ? (
          <span className="sched-card-time">
            <Clock size={14} weight="light" />
            {timeLabel}
          </span>
        ) : isOneOff ? (
          <span className="sched-card-time">
            <CalendarDots size={14} weight="light" />
            {formatShortDate(booking.startDate)}{booking.endDate ? ` – ${formatShortDate(booking.endDate)}` : ""}
          </span>
        ) : null}
        {/* Recurring care — show a cadence chip ("Weekly"), NOT the series
            weekday. This card sits inside a date-group header (TODAY /
            TUESDAY 19 MAY / …), so a weekday label would contradict it
            (the demo anchors upcoming sessions to today regardless of the
            booking's seeded weekday). The weekday stays on the booking
            summary card + detail page, where there's no date-group. */}
        {!isOneOff && !isLive && !isCancelled && (
          <span className="sched-card-recurring">
            <ArrowsClockwise size={12} weight="light" />
            Weekly
          </span>
        )}
        {/* One-off booking chip. Renamed from "Drop-off" in the Walk
            Service Delivery phase (2026-05-20) — that word now names the
            literal delivery method on walks, so the chip had to drop it.
            "One-off" is what the chip actually means: a single discrete
            care event (the recurring counterpart is the Weekly chip
            above). */}
        {isOneOff && !isLive && !isCancelled && (
          <span className="sched-card-recurring">
            One-off
          </span>
        )}
        <span className="flex-1" />
        <span
          className="flex items-center gap-xs text-sm font-semibold shrink-0"
          style={{ color: "var(--status-info-strong)" }}
        >
          <Briefcase size={13} weight="light" />
          {isProviding ? "Providing" : "Care"}
        </span>
      </div>

      {/* Row 2: Service type + sub-service */}
      <h3 className={`sched-card-title${isCancelled ? " line-through" : ""}`}>
        {booking.subService ?? bookingServiceLabel(booking)}
      </h3>

      {/* Row 3: Avatar combo + descriptive relationship text */}
      <div className="sched-card-meta">
        {firstPetName && (
          <AvatarCombo
            personUrl={other.avatarUrl}
            personName={other.name}
            petUrl={firstPetAvatar}
            petName={firstPetName}
          />
        )}
        {!firstPetName && (
          <img
            src={other.avatarUrl}
            alt={other.name}
            className="rounded-full shrink-0 object-cover"
            style={{ width: 28, height: 28 }}
          />
        )}
        <span className="sched-card-names truncate">
          {careLabel}
        </span>
      </div>

      {/* Operational hint — where the handover happens. Skipped for
          cancelled / active so the row can carry status-specific copy.
          Walks read `Booking.delivery` (pickup vs drop-off); other Care
          shapes infer from serviceType. */}
      {!isCancelled && !isLive && handoverLabel && (
        <div className="sched-card-meta">
          <MapPin size={13} weight="light" className="text-fg-tertiary" />
          <span className="sched-card-names truncate text-fg-tertiary">
            {isWalk
              ? walkDelivery === "pickup"
                ? `Pick up at ${handoverLabel}`
                : `Drop off at ${handoverLabel}`
              : booking.serviceType === "house_sitting"
                ? `Visit at ${handoverLabel}`
                : `Drop off in ${handoverLabel}`}
          </span>
        </div>
      )}

      {/* Quick-start button — only shown to the carer for today's
          upcoming session. One-tap to start + jump to the Sessions
          tab. Standard ButtonAction primary so it inherits the
          design-system button styling rather than a one-off class. */}
      {showQuickStart && (
        <div
          className="sched-card-quick-start-wrap"
          onClick={(e) => {
            // Stop the wrapping <Link> from firing default navigation
            // (which would land on the Info tab instead of Sessions).
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <ButtonAction
            variant="primary"
            size="sm"
            leftIcon={<Play size={14} weight="fill" />}
            onClick={handleQuickStart}
          >
            Start session
          </ButtonAction>
        </div>
      )}

      {isCancelled && cancelReason && (
        <div className="sched-card-meta">
          <span className="sched-card-names truncate text-fg-tertiary italic">
            {cancelReason}
          </span>
        </div>
      )}
    </Link>
  );
}

/* ── Care booking card (for Care tab summary view) ─────────────── */

export function ScheduleBookingCard({
  booking,
  perspective,
}: {
  booking: Booking;
  perspective: "owner" | "carer";
}) {
  const isOwner = perspective === "owner";
  const isProviding = !isOwner;
  const other = isOwner
    ? { name: booking.carerName, avatarUrl: booking.carerAvatarUrl }
    : { name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl };
  const timeLabel = booking.recurringSchedule?.timeLabel;
  const days = booking.recurringSchedule?.days;
  const isOneOff = !booking.recurringSchedule;

  const firstPetName = booking.pets[0] ?? null;
  const firstPetAvatar = firstPetName
    ? getPetAvatarUrl(booking.ownerId, firstPetName)
    : null;

  const careLabel = buildCareLabel(booking, isOwner);

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="sched-card sched-card--care"
      style={{ textDecoration: "none" }}
    >
      {/* Row 1: Time or date range (left) · recurring days or one-off · pill (right) */}
      <div className="sched-card-top">
        {timeLabel && (
          <span className="sched-card-time">
            <Clock size={14} weight="light" />
            {timeLabel}
          </span>
        )}
        {!timeLabel && isOneOff && (
          <span className="sched-card-time">
            <CalendarDots size={14} weight="light" />
            {formatShortDate(booking.startDate)}{booking.endDate ? ` – ${formatShortDate(booking.endDate)}` : ""}
          </span>
        )}
        {days && (
          <span className="sched-card-days">
            {days.join(" · ")}
          </span>
        )}
        {isOneOff && (
          <span className="sched-card-recurring">
            One-off
          </span>
        )}
        <span className="flex-1" />
        <span
          className="flex items-center gap-xs text-sm font-semibold shrink-0"
          style={{ color: "var(--status-info-strong)" }}
        >
          <Briefcase size={13} weight="light" />
          {isProviding ? "Providing" : "Care"}
        </span>
      </div>

      {/* Row 2: Sub-service or service type */}
      <h3 className="sched-card-title">
        {booking.subService ?? bookingServiceLabel(booking)}
      </h3>

      {/* Row 3: Avatar combo + descriptive relationship text */}
      <div className="sched-card-meta">
        {firstPetName && (
          <AvatarCombo
            personUrl={other.avatarUrl}
            personName={other.name}
            petUrl={firstPetAvatar}
            petName={firstPetName}
          />
        )}
        {!firstPetName && (
          <img
            src={other.avatarUrl}
            alt={other.name}
            className="rounded-full shrink-0 object-cover"
            style={{ width: 28, height: 28 }}
          />
        )}
        <span className="sched-card-names truncate">
          {careLabel}
        </span>
      </div>
    </Link>
  );
}
