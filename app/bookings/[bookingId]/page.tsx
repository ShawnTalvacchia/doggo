"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  CalendarDots,
  PawPrint,
  ChatCircleDots,
  Tag,
  CheckCircle,
  XCircle,
  Circle,
  Timer,
  Prohibit,
  HandHeart,
  Star,
  CalendarCheck,
  Footprints,
  CaretDown,
  CaretRight,
  Play,
  Pill,
  Ruler,
  Clock,
  Camera,
  MapPin,
  NotePencil,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CancelBookingModal } from "@/components/bookings/CancelBookingModal";
import { CancelSessionModal } from "@/components/bookings/CancelSessionModal";
import { CareReviewSheet } from "@/components/bookings/CareReviewSheet";
import { OwnerDogAvatar } from "@/components/people/OwnerDogAvatar";
import { SigningModal } from "@/components/messaging/SigningModal";
import { useBookings } from "@/contexts/BookingsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useViewedReports } from "@/lib/useViewedReports";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { getUserById } from "@/lib/mockUsers";
import { SERVICE_LABELS } from "@/lib/constants/services";
import {
  buildSessionStartedNotification,
  buildSessionCompletedNotification,
} from "@/lib/notificationBuilders";
import { formatShortDate, formatDateRange } from "@/lib/dateUtils";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import type { Booking, BookingSession, ChatMessage, PetProfile, ServiceType, VisitReport } from "@/lib/types";

const TABS = [
  { key: "info", label: "Info" },
  { key: "sessions", label: "Sessions" },
];

/* ── Helpers ── */

function scheduleLabel(booking: Booking): string {
  if (booking.recurringSchedule) {
    const { days, timeLabel } = booking.recurringSchedule;
    return `${days.join(" · ")} · ${timeLabel}`;
  }
  return formatDateRange(booking.startDate, booking.endDate);
}

function perSessionPrice(booking: Booking): string {
  const first = booking.price.lineItems[0];
  if (!first) return `${booking.price.total.toLocaleString()} Kč`;
  return `${first.amount.toLocaleString()} Kč / ${first.unit}`;
}

function getServiceVerb(booking: Booking): string {
  const sub = booking.subService?.toLowerCase() ?? "";
  if (sub.includes("walk")) return "walking";
  if (sub.includes("sitting") || sub.includes("visit")) return "minding";
  if (sub.includes("overnight") || sub.includes("boarding")) return "hosting";
  if (sub.includes("training") || sub.includes("session")) return "training";
  if (booking.serviceType === "walk_checkin") return "walking";
  if (booking.serviceType === "inhome_sitting") return "minding";
  if (booking.serviceType === "boarding") return "hosting";
  return "caring for";
}

function getServiceNoun(booking: Booking): string {
  const sub = booking.subService?.toLowerCase() ?? "";
  if (sub.includes("walk")) return "walks";
  if (sub.includes("sitting") || sub.includes("visit")) return "visits";
  if (sub.includes("overnight") || sub.includes("boarding")) return "nights";
  if (sub.includes("training") || sub.includes("session")) return "sessions";
  if (booking.serviceType === "walk_checkin") return "walks";
  if (booking.serviceType === "inhome_sitting") return "visits";
  if (booking.serviceType === "boarding") return "nights";
  return "sessions";
}

function getPetAvatarUrl(ownerId: string, petName: string): string | null {
  const user = getUserById(ownerId);
  if (!user) return null;
  const pet = user.pets.find((p) => p.name.toLowerCase() === petName.toLowerCase());
  return pet?.imageUrl ?? null;
}

/* ── Session icon ── */

function SessionIcon({ status }: { status: BookingSession["status"] }) {
  if (status === "completed")
    return <CheckCircle size={20} weight="fill" className="text-[var(--status-success-main)]" />;
  if (status === "cancelled")
    return <XCircle size={20} weight="fill" className="text-[var(--status-error-main)]" />;
  if (status === "in_progress")
    return <Timer size={20} weight="fill" className="text-[var(--status-warning-main)]" />;
  return <Circle size={20} weight="regular" className="text-fg-tertiary" />;
}

/* ── Visit report inline rendering ── */

function VisitReportInline({
  session,
  canEdit = false,
  onSaveEdit,
}: {
  session: BookingSession;
  /** Provider-only — within the edit window. Surfaces an `Edit` action
   *  next to the report. Lean defaults from Inbox & Notifications E2:
   *  24h from `completedAt` OR until the owner views the report,
   *  whichever is shorter. Window calculation lives at the SessionRow
   *  level (it has access to the owner's `lastViewedAt`); this
   *  component just renders the affordance when told. */
  canEdit?: boolean;
  /** Save handler — caller merges the new notes into the existing
   *  report and stamps `editedAt`. Last-write-wins; no chronicle of
   *  prior versions per the lean defaults. */
  onSaveEdit?: (notes: string) => void;
}) {
  const r = session.report;
  const [editing, setEditing] = useState(false);
  const [draftNotes, setDraftNotes] = useState(r?.notes ?? "");

  if (!r) {
    if (session.note) {
      return <p className="text-sm text-fg-secondary m-0">{session.note}</p>;
    }
    return null;
  }
  const completedTime = r.completedAt
    ? new Date(r.completedAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  if (editing) {
    return (
      <div className="flex flex-col gap-sm">
        {r.photos.length > 0 && (
          <div className="flex gap-xs flex-wrap">
            {r.photos.map((url, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-md bg-surface-inset"
                style={{ width: 72, height: 72 }}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
        <textarea
          value={draftNotes}
          onChange={(e) => setDraftNotes(e.target.value)}
          rows={4}
          className="textarea"
          aria-label="Edit visit report notes"
        />
        <div className="flex items-center justify-end gap-xs">
          <ButtonAction
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraftNotes(r.notes ?? "");
              setEditing(false);
            }}
          >
            Cancel
          </ButtonAction>
          <ButtonAction
            variant="primary"
            size="sm"
            onClick={() => {
              onSaveEdit?.(draftNotes);
              setEditing(false);
            }}
          >
            Save
          </ButtonAction>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-sm">
      {r.photos.length > 0 && (
        <div className="flex gap-xs flex-wrap">
          {r.photos.map((url, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-md bg-surface-inset"
              style={{ width: 72, height: 72 }}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
      {r.notes && <p className="text-sm text-fg-secondary m-0">{r.notes}</p>}
      {/* Use ternaries (not `&&`) so a 0 value doesn't render bare —
          `{0 && <X/>}` evaluates to `0` which React prints as text. */}
      {r.walkDistanceKm || r.walkDurationMin ? (
        <div className="flex items-center gap-md text-xs text-fg-tertiary">
          {r.walkDistanceKm ? (
            <span className="inline-flex items-center gap-xs">
              <Ruler size={12} weight="light" />
              {r.walkDistanceKm} km
            </span>
          ) : null}
          {r.walkDurationMin ? (
            <span className="inline-flex items-center gap-xs">
              <Clock size={12} weight="light" />
              {r.walkDurationMin} min
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-sm">
        <span className="text-xs text-fg-tertiary">
          {completedTime && <>Completed at {completedTime}</>}
          {/* Silent "edited" tag — no notification, no chat system message;
              just a visible signal that the report has been updated since
              first sealing. E2 lean defaults. */}
          {r.editedAt && (
            <>
              {completedTime ? " · " : ""}
              <em>edited</em>
            </>
          )}
        </span>
        {canEdit && (
          <button
            type="button"
            onClick={() => {
              setDraftNotes(r.notes ?? "");
              setEditing(true);
            }}
            className="text-xs font-semibold text-brand-main underline-offset-2 hover:underline"
            aria-label="Edit visit report"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Session row ── */

function SessionRow({
  session,
  isLast,
  canAct,
  onUpdate,
  onCancelSession,
  bookingId,
  cancelledReason,
  ownerLastViewedAt,
}: {
  session: BookingSession;
  isLast: boolean;
  canAct?: boolean;
  onUpdate?: (bookingId: string, sessionId: string, update: Partial<BookingSession>) => void;
  onCancelSession?: (session: BookingSession) => void;
  bookingId?: string;
  cancelledReason?: string;
  /** ISO timestamp of when the owner last visited the Sessions tab for
   *  this booking, or null if never. Drives the edit-window cutoff —
   *  once the owner has read the report, the provider can no longer
   *  edit it (lean defaults from Inbox & Notifications E2). */
  ownerLastViewedAt?: string | null;
}) {
  // Edit window: provider can edit a sealed report for up to 24h after
  // sealing OR until the owner views it, whichever comes first. Demo
  // window matches the lean defaults from E2 (typo-fix-friendly without
  // letting forever-rewrites pile up).
  const r = session.report;
  const editWindowMs = 24 * 60 * 60 * 1000;
  const canEditReport =
    canAct === true &&
    session.status === "completed" &&
    !!r?.completedAt &&
    Date.now() - new Date(r.completedAt).getTime() < editWindowMs &&
    (!ownerLastViewedAt || ownerLastViewedAt < r.completedAt);
  return (
    <div
      className="flex items-start gap-sm bg-surface-top"
      style={{
        padding: "var(--space-md) var(--space-lg)",
        borderBottom: isLast ? "none" : "1px solid var(--border-subtle)",
      }}
    >
      <SessionIcon status={session.status} />
      <div className="flex flex-col flex-1 gap-xs min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-fg-primary">
            {/* For completed sessions, the row date reflects when the
                session actually happened (= report.completedAt). For
                upcoming / in_progress / cancelled rows we show the
                scheduled session.date — that's the canonical anchor.
                Diverges only for demo data where future-scheduled
                sessions are completed in the present, which doesn't
                happen in production. */}
            {session.status === "completed" && session.report?.completedAt
              ? formatShortDate(session.report.completedAt.slice(0, 10))
              : formatShortDate(session.date)}
          </span>
          <span className={`text-xs font-medium ${
            session.status === "completed" ? "text-[var(--status-success-strong)]" :
            session.status === "in_progress" ? "text-[var(--status-warning-strong)]" :
            session.status === "cancelled" ? "text-[var(--status-error-strong)]" :
            "text-fg-tertiary"
          }`}>
            {session.status === "completed" ? "Done" :
             session.status === "in_progress" ? "In progress" :
             session.status === "cancelled" ? "Cancelled" :
             "Upcoming"}
          </span>
        </div>

        {session.status === "completed" && (
          <VisitReportInline
            session={session}
            canEdit={canEditReport}
            onSaveEdit={
              canEditReport && bookingId && onUpdate
                ? (notes) =>
                    onUpdate(bookingId, session.id, {
                      report: {
                        photos: r?.photos ?? [],
                        ...r,
                        notes,
                        editedAt: new Date().toISOString(),
                      },
                    })
                : undefined
            }
          />
        )}

        {session.status === "cancelled" && cancelledReason && (
          <p className="text-sm text-fg-tertiary m-0 italic">{cancelledReason}</p>
        )}

        {/* Provider actions — only for upcoming sessions. Wrapping the
            inner check around the wrapper itself avoids rendering an
            empty flex div with marginTop on past / cancelled rows
            (which gave them phantom space below). In-progress sessions
            are not rendered in this list at all — they live on the
            Active panel above the upcoming/past sections. */}
        {canAct && onUpdate && bookingId && session.status === "upcoming" && (
          <div className="flex flex-wrap gap-xs" style={{ marginTop: "var(--space-xs)" }}>
            <ButtonAction variant="primary" size="sm"
              leftIcon={<Play size={14} weight="fill" />}
              onClick={() => onUpdate(bookingId, session.id, {
                status: "in_progress",
                checkedInAt: new Date().toISOString(),
              })}>
              Start session
            </ButtonAction>
            {onCancelSession && (
              <ButtonAction variant="outline" size="sm"
                leftIcon={<Prohibit size={14} weight="light" />}
                onClick={() => onCancelSession(session)}>
                Cancel
              </ButtonAction>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Active session panel ── */

function ActiveSessionPanel({
  session,
  serviceType,
  isProvider,
  onUpdateReport,
  onFinish,
  onUndoStart,
}: {
  session: BookingSession;
  serviceType: ServiceType;
  isProvider: boolean;
  /** Apply a partial update to the session's report. Lazy-creates the
   *  report object on first edit so callers don't have to manage
   *  null-vs-existing branching. */
  onUpdateReport: (session: BookingSession, partial: Partial<VisitReport>) => void;
  /** Seal the visit report and flip status to completed. Single-tap
   *  Finish — no preview modal. GPS auto-stops on Finish (simulated
   *  metrics seal into walkDistanceKm / walkDurationMin) so the
   *  provider doesn't have to remember to tap Stop first. */
  onFinish: (session: BookingSession) => void;
  /** Revert an accidental Start tap — flips status back to upcoming and
   *  clears `checkedInAt`. Different from cancel-this-session (which marks
   *  it dead with a reason and notifies the owner); undo is a soft reset
   *  for "oops, didn't mean to tap that." Provider-only. */
  onUndoStart: (session: BookingSession) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notesOpen, setNotesOpen] = useState<boolean>(
    !!session.report?.notes && session.report.notes.length > 0,
  );
  // Per-minute tick to refresh the GPS-sim readout (km / min). Cheap;
  // only runs while the panel is mounted (i.e. while a session is active).
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const startedAt = session.checkedInAt
    ? new Date(session.checkedInAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const photos = session.report?.photos ?? [];
  const latestPhoto = photos[photos.length - 1] ?? null;
  const notes = session.report?.notes ?? "";
  const gpsStartedAt = session.report?.gpsStartedAt;
  const isWalk = serviceType === "walk_checkin";
  // True once Stop has sealed real metrics into the report (we skip the
  // seal for sub-minute Start→Stop, so 0/0 won't trigger this). Drives
  // both the "Walk recorded" pill (visible) and hides the "Log route
  // with GPS" button — re-tracking-and-overriding within one session
  // is deferred (see Open Questions §4 → "Multi-leg tracking").
  const hasRecordedWalkMetrics = !!(
    session.report?.walkDistanceKm || session.report?.walkDurationMin
  );

  // Simulated GPS metrics — rough 3.6 km/hr pet-walking pace. Demo-state;
  // real GPS is deferred. The simulated values get sealed into
  // walkDistanceKm/walkDurationMin on Finish via the modal pre-fill.
  const gpsElapsedMin = gpsStartedAt
    ? Math.max(0, Math.floor((now - new Date(gpsStartedAt).getTime()) / 60_000))
    : 0;
  const gpsDistanceKm = gpsStartedAt
    ? Math.round(gpsElapsedMin * 0.06 * 10) / 10
    : 0;

  // Finish is always enabled — a quiet session where nothing notable
  // happened is valid; the owner gets "Completed at HH:MM" and that's
  // a meaningful confirmation. The "Started by accident? Undo" link
  // below covers the only real failure mode (accidental Start tap).
  // `isEmpty` still drives whether to show the Undo link.
  const isEmpty =
    photos.length === 0 &&
    notes.trim().length === 0 &&
    !gpsStartedAt;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onUpdateReport(session, { photos: [...photos, reader.result] });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function toggleGps() {
    if (gpsStartedAt) {
      // Stop tracking. Seal the simulated metrics into the report only
      // if the provider actually tracked something meaningful (≥1 min).
      // Sub-minute Start→Stop is a non-event — skip the seal so we
      // don't pollute the report with 0 km / 0 min, and so a prior
      // recording (if there was one) isn't overwritten by an accidental
      // restart-then-stop.
      if (gpsElapsedMin > 0) {
        onUpdateReport(session, {
          gpsStartedAt: undefined,
          walkDistanceKm: gpsDistanceKm,
          walkDurationMin: gpsElapsedMin,
        });
      } else {
        onUpdateReport(session, { gpsStartedAt: undefined });
      }
    } else {
      onUpdateReport(session, { gpsStartedAt: new Date().toISOString() });
    }
  }

  return (
    <div
      className="flex flex-col rounded-panel bg-surface-base"
      style={{
        padding: "var(--space-lg)",
        gap: "var(--space-lg)",
        border: "1px solid var(--border-regular)",
        // Amber left stripe carries the "active" signal; keeps the
        // panel surface neutral so it doesn't dominate the page.
        borderLeft: "4px solid var(--status-warning-main)",
      }}
    >
      {/* Header row — status pill + when-it-started + date. flex-wrap
          allows the date to drop to its own line on narrow viewports
          rather than word-wrapping ("8 May 2026" on three lines). The
          pill itself shortened to a pulsing dot + "Live" to free up
          horizontal room — same live-pulse-dot utility as the
          cross-app banners, with `--live-pulse-color` overridden to
          warning-850 so the dot reads as dark on the yellow pill bg.
          2026-05-08 walkthrough refinement. */}
      <div className="flex flex-wrap items-center gap-x-md gap-y-xs">
        <span
          className="inline-flex items-center gap-xs px-sm py-xs text-xs font-semibold rounded-pill"
          style={{
            background: "var(--status-warning-main)",
            color: "var(--warning-850)",
            // Dot color reads as dark on the yellow pill bg; size dialed
            // down from the global 10px since the pill is small and the
            // pulse only needs a quiet presence here. The cross-app
            // banner + sidebar keep the larger global default.
            ["--live-pulse-color" as string]: "var(--warning-850)",
            ["--live-pulse-size" as string]: "8px",
          } as React.CSSProperties}
        >
          <span className="live-pulse-dot" role="img" aria-label="Live" />
          Live
        </span>
        {startedAt && (
          <span className="text-sm text-fg-tertiary whitespace-nowrap">started {startedAt}</span>
        )}
        <span className="text-sm text-fg-tertiary whitespace-nowrap ml-auto">
          {formatShortDate(session.date)}
        </span>
      </div>

      {/* Owner side — calm reassurance, no composition affordances. */}
      {!isProvider && (
        <>
          {latestPhoto && (
            <div
              className="relative overflow-hidden rounded-md bg-surface-inset"
              style={{ aspectRatio: "16 / 9", maxHeight: 200 }}
            >
              <img src={latestPhoto} alt="" className="w-full h-full object-cover" />
              {photos.length > 1 && (
                <span
                  className="absolute bottom-1 right-1 inline-flex items-center gap-xs px-sm py-xs text-xs font-semibold rounded-pill"
                  style={{ background: "var(--transparent-dark-64)", color: "white" }}
                >
                  {photos.length} photos
                </span>
              )}
            </div>
          )}
          {gpsStartedAt && (
            <div
              className="inline-flex items-center gap-xs self-start px-sm py-xs text-sm rounded-pill"
              style={{ background: "var(--surface-inset)", color: "var(--text-secondary)" }}
            >
              <MapPin size={14} weight="fill" />
              On the move · {gpsDistanceKm} km · {gpsElapsedMin} min
            </div>
          )}
          <p className="text-sm text-fg-secondary m-0">
            {latestPhoto
              ? "The session is in progress. You'll get the full visit report when it wraps up."
              : "The session is in progress. You'll get a visit report when it wraps up."}
          </p>
        </>
      )}

      {/* Provider side — quick-add layout. Composition fields update
          `session.report` directly so quitting the page mid-session
          and coming back picks up where the provider left off. Notes
          collapse behind "+ Add a note" since most sessions don't
          need them; care checks stay as a chip row (single-tap).
          GPS is a stub on walks — toggles a sim that ticks km/min
          based on elapsed time. Sessions & Service Execution A3
          walkthrough, 2026-05-05. */}
      {isProvider && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            // `capture="environment"` prompts the rear camera directly on
            // mobile browsers (iOS Safari, Android Chrome, Brave). Falls
            // back to the standard file picker on desktop. One-attribute
            // mobile-native moment for the in-session photo flow.
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />

          {/* Photo (when present) — sits above the structured sections
              so it's the visual anchor of the panel. The "Send a photo
              update" button lives in UPDATES below. */}
          {latestPhoto && (
            <div
              className="relative overflow-hidden rounded-md bg-surface-inset"
              style={{ aspectRatio: "16 / 9", maxHeight: 200 }}
            >
              <img src={latestPhoto} alt="" className="w-full h-full object-cover" />
              {photos.length > 1 && (
                <span
                  className="absolute bottom-1 right-1 inline-flex items-center gap-xs px-sm py-xs text-xs font-semibold rounded-pill"
                  style={{ background: "var(--transparent-dark-64)", color: "white" }}
                >
                  {photos.length} photos
                </span>
              )}
            </div>
          )}

          {/* GPS state row — three states share the same slot:
              (1) tracking active → warning palette + Stop affordance;
              (2) tracking stopped + metrics recorded → success palette
                  confirmation pill (the work was saved);
              (3) idle → nothing here, "Log route with GPS" lives in the
                  UPDATES row below.
              Demo sim — km / min derived from elapsed time. */}
          {isWalk && gpsStartedAt && (
            <div
              className="flex items-center gap-sm rounded-panel"
              style={{
                padding: "var(--space-md)",
                background: "var(--warning-25)",
                border: "1px solid var(--warning-100)",
              }}
            >
              <MapPin size={16} weight="fill" style={{ color: "var(--status-warning-strong)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--warning-850)" }}>
                Tracking route
              </span>
              <span className="text-sm" style={{ color: "var(--warning-850)" }}>
                · {gpsDistanceKm} km · {gpsElapsedMin} min
              </span>
              <span className="flex-1" />
              {/* Stop is a secondary escape hatch — Finish auto-stops GPS,
                  so this is for "stop tracking but keep the session
                  going" (battery, transition to playtime, GPS jitter).
                  Same de-emphasis register as the Undo link below: text
                  only, generous tap area, no icon. */}
              <button
                type="button"
                onClick={toggleGps}
                className="text-xs font-semibold uppercase tracking-wide cursor-pointer rounded-pill transition-colors"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "var(--space-xs) var(--space-sm)",
                  color: "var(--warning-850)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--warning-100)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Stop
              </button>
            </div>
          )}
          {isWalk && !gpsStartedAt && hasRecordedWalkMetrics && (
            <div
              className="flex items-center gap-sm rounded-panel"
              style={{
                padding: "var(--space-md)",
                background: "var(--success-25)",
                border: "1px solid var(--success-100)",
              }}
            >
              <CheckCircle size={16} weight="fill" style={{ color: "var(--status-success-strong)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--success-850)" }}>
                Walk recorded
              </span>
              <span className="text-sm" style={{ color: "var(--success-850)" }}>
                · {session.report?.walkDistanceKm ?? 0} km · {session.report?.walkDurationMin ?? 0} min
              </span>
            </div>
          )}

          {/* Updates — quick-add affordances grouped under one header.
              All three are peers under Finish (which stays the only
              primary-dark CTA). Soft variant tiles them against the
              base-grey panel — lighter fill than the surface, hairline
              border that strengthens on hover. */}
          <div className="flex flex-col gap-xs">
            <span className="text-xs font-semibold text-fg-tertiary uppercase tracking-wide">
              Updates
            </span>
            <div className="flex flex-wrap gap-xs">
              {!notesOpen && (
                <ButtonAction
                  variant="soft"
                  size="sm"
                  leftIcon={<NotePencil size={14} weight="light" />}
                  onClick={() => setNotesOpen(true)}
                  className="flex-1"
                >
                  Add a note
                </ButtonAction>
              )}
              <ButtonAction
                variant="soft"
                size="sm"
                leftIcon={<Camera size={14} weight="light" />}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                {latestPhoto ? "Add another photo" : "Send a photo update"}
              </ButtonAction>
              {isWalk && !gpsStartedAt && !hasRecordedWalkMetrics && (
                <ButtonAction
                  variant="soft"
                  size="sm"
                  leftIcon={<MapPin size={14} weight="light" />}
                  onClick={toggleGps}
                  className="flex-1"
                >
                  Log route with GPS
                </ButtonAction>
              )}
            </div>
          </div>

          {/* Notes — only when expanded. Once opened, stays open for the
              session (no auto-collapse on blur). Provider can still
              clear the textarea; we don't auto-close even when empty
              because re-typing is friction. */}
          {notesOpen && (
            <div className="input-block">
              <label className="label" htmlFor="active-session-notes">
                <span className="label-primary-group">
                  <span>Notes</span>
                </span>
              </label>
              <textarea
                id="active-session-notes"
                className="textarea"
                placeholder="Anything the owner should know."
                value={notes}
                onChange={(e) => onUpdateReport(session, { notes: e.target.value })}
                rows={3}
                autoFocus
              />
            </div>
          )}

          {/* Action footer */}
          <div className="flex flex-col gap-sm">
            <ButtonAction
              variant="primary"
              size="md"
              leftIcon={<CheckCircle size={16} weight="fill" />}
              onClick={() => onFinish(session)}
            >
              Finish session
            </ButtonAction>
            {isEmpty && (
              // Full-width hit area for tappability (escape hatch for an
              // accidental Start), but the visible link stays left-aligned
              // and de-emphasized — link styling makes it read as clickable
              // without competing with Finish.
              <button
                type="button"
                onClick={() => onUndoStart(session)}
                className="w-full text-left text-xs text-fg-tertiary underline underline-offset-2 cursor-pointer hover:text-fg-secondary transition-colors"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  height: 24,
                  lineHeight: "24px",
                }}
              >
                Started by accident? Undo
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Sessions-tab pet header ── */

/**
 * Pet-as-protagonist hero on the Sessions tab — full-width rounded
 * photo (Rule B: dogs are rounded, people are circles) + 28px name
 * heading. No supporting line: the photo + name carry the identity,
 * and the active panel below already surfaces session state.
 *
 * Walkthrough surfaced that the dog's name was nowhere on the Sessions
 * tab; testers had to hunt through note text to confirm. The hero
 * treatment also nudges owners toward better photo hygiene — your dog
 * gets rendered at this scale, you tend to upload a good photo.
 * 2026-05-08.
 *
 * Multi-pet: primary photo + names joined with " & " for now. Full
 * multi-pet treatment lands when a multi-pet booking enters mock data.
 */
function SessionsPetHeader({
  pets,
}: {
  pets: PetProfile[];
}) {
  if (pets.length === 0) return null;
  const primary = pets[0];
  const isMulti = pets.length > 1;
  const petLabel = isMulti
    ? pets.map((p) => p.name).join(" & ")
    : primary.name;
  // Meta line — small, lighter type below the name. Single-pet only:
  // the multi-pet case (Open Q §4) needs its own treatment since which
  // dog's breed/age would we show? Owner name + page-header context
  // already establishes who's involved (page detail header shows "Daniel"
  // for provider view / "Klára" for owner view), so this row stays
  // dog-anchored: breed + age. 2026-05-08 walkthrough refinement.
  const metaParts = isMulti
    ? []
    : [primary.breed, primary.ageLabel].filter((s) => s && s.trim());

  return (
    <div className="flex flex-col gap-md">
      {/* Hero photo — full-width, height clamps with viewport. Floor
          160px, ceiling 240px, scaling at 45vw — tightened to keep
          the active panel above the fold on most viewports. 2026-05-08
          walkthrough refinement. */}
      <div
        className="rounded-panel overflow-hidden bg-surface-inset w-full"
        style={{ maxHeight: "clamp(160px, 45vw, 240px)" }}
      >
        <img
          src={primary.imageUrl}
          alt={primary.name}
          className="block w-full object-cover object-center"
          style={{ maxHeight: "clamp(160px, 45vw, 240px)" }}
        />
      </div>
      {/* Name + meta stacked. Tried inline with items-baseline but the
          font-heading (Poppins) baseline didn't sit right against the
          body-font meta — visual drift was distracting at this size
          difference. Stacked reads cleanly. The image clamp ceiling was
          tightened to compensate for the extra row's vertical cost.
          2026-05-08 walkthrough. */}
      <div className="flex flex-col gap-xs">
        <h2
          className="font-heading font-semibold text-fg-primary m-0"
          style={{ fontSize: "24px", lineHeight: 1.15 }}
        >
          {petLabel}
        </h2>
        {metaParts.length > 0 && (
          <span className="text-sm text-fg-tertiary font-normal">
            {metaParts.join(" · ")}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Pet info section (provider in-session reference) ── */

/**
 * Collapsed by default — provider's stated preference is "nice to have
 * to reference but not needed to see each time." Collapsed state still
 * shows the pet avatar row(s) so the provider has at-a-glance
 * recognition (which dog am I caring for) without burying the session
 * list under a wall of vital info. Tap the header to expand.
 */
function PetInfoSection({ pets }: { pets: PetProfile[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = pets.some(
    (p) =>
      p.vetInfo?.medications ||
      p.vetInfo?.conditions ||
      p.socialisationNotes ||
      p.vetInfo?.clinicName ||
      p.vetInfo?.vetPhone,
  );

  return (
    <div className="flex flex-col gap-sm">
      <span className="text-xs font-semibold text-fg-tertiary uppercase tracking-wide">
        Pet info
      </span>
      <div className="flex flex-col rounded-panel border border-edge-regular overflow-hidden">
        {pets.map((pet, i) => (
          <div
            key={pet.id}
            className="flex flex-col gap-md bg-surface-top"
            style={{
              padding: "var(--space-md) var(--space-lg)",
              borderBottom: i === pets.length - 1 ? "none" : "1px solid var(--border-subtle)",
            }}
          >
            {/* Avatar row IS the toggle — the chevron at the right edge
                signals "tap to expand," matching native Settings-style
                disclosure. Disabled gracefully when there's nothing to
                expand (some pets have only the basic profile). */}
            <button
              type="button"
              onClick={() => hasDetails && setExpanded((v) => !v)}
              disabled={!hasDetails}
              className="flex items-center gap-sm cursor-pointer disabled:cursor-default w-full"
              style={{ background: "transparent", border: "none", padding: 0, textAlign: "left" }}
            >
              {/* Rule B: dogs render as rounded squares (people are circles).
                  Bumped from 36→48 — at 36 it read as utility thumbnail;
                  48 makes the pet the visual centerpiece of the section.
                  2026-05-08 walkthrough refinement. */}
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="rounded-panel object-cover"
                style={{ width: 48, height: 48 }}
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-semibold text-fg-primary">{pet.name}</span>
                <span className="text-xs text-fg-tertiary">
                  {pet.breed} · {pet.weightLabel} · {pet.ageLabel}
                </span>
              </div>
              {hasDetails && (
                <CaretDown
                  size={16}
                  weight="bold"
                  className="text-fg-tertiary"
                  style={{
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 150ms ease",
                    flexShrink: 0,
                  }}
                />
              )}
            </button>

            {expanded && (
              <>
                {pet.vetInfo?.medications && (
                  <PetInfoRow icon={<Pill size={12} weight="light" />} label="Medications">
                    {pet.vetInfo.medications}
                  </PetInfoRow>
                )}
                {pet.vetInfo?.conditions && (
                  <PetInfoRow icon={<HandHeart size={12} weight="light" />} label="Conditions">
                    {pet.vetInfo.conditions}
                  </PetInfoRow>
                )}
                {pet.socialisationNotes && (
                  <PetInfoRow icon={<PawPrint size={12} weight="light" />} label="Around dogs">
                    {pet.socialisationNotes}
                  </PetInfoRow>
                )}
                {(pet.vetInfo?.clinicName || pet.vetInfo?.vetPhone) && (
                  <PetInfoRow icon={<CalendarCheck size={12} weight="light" />} label="Vet">
                    {[pet.vetInfo.clinicName, pet.vetInfo.vetPhone].filter(Boolean).join(" · ")}
                  </PetInfoRow>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PetInfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-xs">
      <span className="inline-flex items-center gap-xs text-xs font-semibold text-fg-tertiary uppercase tracking-wide">
        {icon}
        {label}
      </span>
      <p className="text-sm text-fg-secondary m-0">{children}</p>
    </div>
  );
}

/* ── Page ── */

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    bookings,
    cancelBooking,
    updateSession,
    updateStatus,
    updateBooking,
    createBooking,
    getBookingByConversation,
  } = useBookings();
  const { conversations, updateProposalStatus, addMessage } = useConversations();
  const { markConnected } = useConnections();
  const { hasReview, addReview } = useReviews();
  const { addNotification } = useNotifications();
  const { markViewed, lastViewedAt } = useViewedReports();
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const CURRENT_USER = useCurrentUserId();
  const [showCancel, setShowCancel] = useState(false);
  const [signingOpen, setSigningOpen] = useState(false);
  const [cancelSession, setCancelSession] = useState<BookingSession | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const activeTab = searchParams.get("tab") ?? "info";

  const handleTabChange = useCallback((key: string) => {
    router.replace(`/bookings/${params.bookingId}?tab=${key}`, { scroll: false });
  }, [router, params.bookingId]);

  const booking = bookings.find((b) => b.id === params.bookingId);
  const isOwner = booking?.ownerId === CURRENT_USER;
  const isProvider = booking?.carerId === CURRENT_USER;

  /** Wrap `updateSession` to fire owner-facing notifications on the
   *  upcoming → in_progress and in_progress → completed transitions.
   *  Other status transitions (cancelled, upcoming after Undo Start) and
   *  non-status updates (report photos, notes) flow through unchanged.
   *  Single funnel keeps lifecycle notifications consistent across every
   *  Start / Finish entry point on this page (Sessions tab Start, Active
   *  panel Finish, Active panel Undo, cancellation modal). Inbox &
   *  Notifications A2 + A3, 2026-05-08. */
  function handleUpdateSession(
    bookingId: string,
    sessionId: string,
    partial: Partial<BookingSession>,
  ) {
    updateSession(bookingId, sessionId, partial);
    if (!booking) return;
    const session = (booking.sessions ?? []).find((s) => s.id === sessionId);
    if (!session) return;
    if (partial.status === "in_progress") {
      addNotification(buildSessionStartedNotification(booking, session));
    } else if (partial.status === "completed") {
      // Same id as the started notif → upserts the existing row
      // rather than spawning a duplicate. Owner sees one evolving
      // notification per session, not two.
      addNotification(buildSessionCompletedNotification(booking, session));
    }
  }

  // Feed detail header to mobile AppNav. Format as "{otherFirstName} · {service}"
  // so the header carries the relationship context (the through-line for any
  // booking — same carer over many sessions) alongside what they're providing.
  // Just "Solo walk" leaves the back-chevron with no who-is-this-with context.
  useEffect(() => {
    if (!booking) return;
    const isOwnerView = booking.ownerId === CURRENT_USER;
    const otherFirstName = isOwnerView
      ? booking.carerName.split(" ")[0]
      : booking.ownerName.split(" ")[0];
    const serviceTitle = booking.subService ?? SERVICE_LABELS[booking.serviceType];
    const title = `${otherFirstName} · ${serviceTitle}`;
    setDetailHeader(title, () => router.push("/bookings"));
    return () => clearDetailHeader();
  }, [booking?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mark this booking as "viewed" once the owner opens the Sessions
  // tab — clears the "new visit report" indicator on the BookingRow
  // for this booking. Provider side doesn't need to mark; the
  // indicator is owner-only. Sessions & Service Execution A6.
  //
  // Fires once per mounted booking — `markedBookingRef` gates the effect
  // so persona switches (which re-run this effect because CURRENT_USER
  // is in the deps) don't re-stamp lastViewedAt. Without the gate, the
  // sequence "Klára seals on /bookings/.../?tab=sessions → user switches
  // back to Daniel → effect re-fires → lastViewedAt stamped AFTER the
  // seal" suppressed the strip on /bookings even though the report was
  // genuinely new. Inbox & Notifications G2 fix, 2026-05-08.
  const markedBookingRef = useRef<string | null>(null);
  useEffect(() => {
    if (!booking || activeTab !== "sessions") return;
    if (booking.ownerId !== CURRENT_USER) return;
    if (markedBookingRef.current === booking.id) return;
    markedBookingRef.current = booking.id;
    markViewed(booking.id);
  }, [booking?.id, activeTab, CURRENT_USER, markViewed]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!booking) {
    return (
      <PageColumn title="Booking">
        <div className="page-column-panel-body">
          <div className="flex flex-col items-center gap-md p-xl text-center">
            <p className="text-fg-secondary">Booking not found.</p>
            <ButtonAction variant="secondary" size="sm" onClick={() => router.push("/bookings")}>
              Back to Bookings
            </ButtonAction>
          </div>
        </div>
      </PageColumn>
    );
  }

  const other = isOwner
    ? { id: booking.carerId, name: booking.carerName, avatarUrl: booking.carerAvatarUrl, role: "Carer" }
    : { id: booking.ownerId, name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl, role: "Owner" };

  // Profile link for the partner — booking detail keeps Info + Sessions only;
  // direct messaging lives on the profile chat tab (Mock World Building 2026-04-30).
  const profileHref = `/profile/${other.id}`;
  const messageHref = `${profileHref}?tab=chat`;

  // For proposed bookings, surface the conversation's most recent pending
  // proposal so the owner can Review & sign without digging through chat.
  // Mirrors `ThreadClient.handleSign` so the booking moves pending →
  // upcoming, the proposal flips to "accepted", and a contract message is
  // appended to the thread. Discover & Care G5 close-up 2026-05-04.
  const conv = booking.conversationId
    ? conversations.find((c) => c.id === booking.conversationId)
    : null;
  const pendingProposalMsg =
    booking.status === "proposed" && conv
      ? [...conv.messages]
          .reverse()
          .find((m) => m.type === "booking_proposal" && m.proposal?.status === "pending") ?? null
      : null;

  function handleSign(msgId: string) {
    if (!conv) return;
    const proposalMsg = conv.messages.find((m) => m.id === msgId);
    if (!proposalMsg?.proposal) return;
    const p = proposalMsg.proposal;

    // Booking is the existing record (we're on its detail page) — flip
    // its status. createBooking branch retained for parity with Thread
    // client in case a legacy proposal lacks a pre-mirrored booking.
    const existing = getBookingByConversation(conv.id);
    let bookingId: string;
    if (existing) {
      updateStatus(existing.id, "upcoming");
      bookingId = existing.id;
    } else {
      bookingId = createBooking({
        conversationId: conv.id,
        ownerId: conv.ownerId,
        ownerName: conv.ownerName,
        ownerAvatarUrl: conv.ownerAvatarUrl,
        carerId: conv.providerId,
        carerName: conv.providerName,
        carerAvatarUrl: conv.providerAvatarUrl,
        type: p.bookingType,
        serviceType: p.serviceType,
        subService: p.subService,
        pets: p.pets,
        startDate: p.startDate,
        endDate: p.endDate,
        recurringSchedule: p.recurringSchedule,
        price: p.price,
        status: "upcoming",
        sessions: p.bookingType === "ongoing" ? [] : undefined,
      });
    }

    // Proposal accepted — `updateProposalStatus` stamps `signedAt`
    // on the proposal itself. ContractCard removed (redundant chronicle
    // event; the accepted proposal carries the signing signal + inline
    // timestamp). Sessions & Service Execution walkthrough, 2026-05-05.
    updateProposalStatus(conv.id, msgId, "accepted");

    // Inquiry-driven trust transition: contract sign → mutual Connected.
    // Mirrors `ThreadClient.handleSign`. Pricing & Proposals walkthrough
    // 2026-05-05; resolves Open Q §2.
    markConnected(conv.ownerId, conv.providerId);
    markConnected(conv.providerId, conv.ownerId);

    setSigningOpen(false);
  }

  const petNames = booking.pets.join(" & ");
  const verb = getServiceVerb(booking);
  const serviceNoun = getServiceNoun(booking);
  const firstPetAvatar = booking.pets[0] ? getPetAvatarUrl(booking.ownerId, booking.pets[0]) : null;
  const sessions = booking.sessions ?? [];
  // Upcoming list excludes the in-progress session — it has its own
  // prominent "Active now" panel above; showing it twice (banner +
  // upcoming row) is redundant and reads as confusing duplication.
  const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
  const pastSessions = sessions.filter((s) => s.status === "completed" || s.status === "cancelled");
  const completedSessions = sessions.filter((s) => s.status === "completed");

  // Header title carries relationship + service: "{otherFirstName} · {service}".
  // Same shape used for the mobile AppNav header above (in setDetailHeader).
  const headerTitle = `${other.name.split(" ")[0]} · ${booking.subService ?? SERVICE_LABELS[booking.serviceType]}`;

  // Next upcoming session for aggregate stats
  const nextSession = [...upcomingSessions].sort((a, b) => a.date.localeCompare(b.date))[0];

  // Active session — at most one. When present, both sides surface a
  // prominent "Active now" panel atop the Sessions tab.
  const activeSession = sessions.find((s) => s.status === "in_progress") ?? null;

  // Pet profile lookup. The owner's `pets[]` is the source of truth —
  // booking.pets stores names only. Used by both the Sessions-tab pet
  // header (visible to both sides) and the Pet info section
  // (provider-only — vet info, medications, etc.).
  const ownerForPetLookup = getUserById(booking.ownerId);
  const petsForBooking = ownerForPetLookup
    ? booking.pets
        .map((name) => ownerForPetLookup.pets.find((p) => p.name.toLowerCase() === name.toLowerCase()))
        .filter((p): p is NonNullable<typeof p> => !!p)
    : [];
  const petProfilesForSession = isProvider ? petsForBooking : [];

  return (
    <PageColumn hideHeader abovePanel={<DetailHeader backHref="/bookings" title={headerTitle} />}>
      <div className="page-column-panel-body">

        {/* ── Tabs at top of panel ── */}
        <div className="page-column-panel-tabs">
          <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
        </div>

        {/* ── Tab content ── */}

        {activeTab === "info" && (
          <div className="flex flex-col gap-lg" style={{ padding: "var(--space-lg)" }}>

            {/* Hero + actions wrapper with extra vertical breathing room */}
            <div
              className="flex flex-col gap-lg"
              style={{ paddingTop: "var(--space-md)", paddingBottom: "var(--space-xl)" }}
            >
              {/* Hero section: parties + status. Avatar + name area links
                  to the partner's profile (universal name/avatar pattern).
                  Uses `OwnerDogAvatar` so the avatar combo matches People
                  tab / Members tab / post-meet review (64px owner circle
                  + 32–36px rounded-square dog avatars). Subtitle is just
                  the activity — the name above already identifies who, so
                  "Training Bára for Daniel" would repeat. "You're
                  providing" sits as a soft caption under the subtitle. */}
              <div className="flex items-start gap-md">
                <Link
                  href={profileHref}
                  className="flex items-start gap-md flex-1 min-w-0"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <OwnerDogAvatar
                    userId={booking.ownerId}
                    name={other.name}
                    avatarUrl={other.avatarUrl}
                    dogNames={booking.pets}
                  />
                  <div className="flex flex-col flex-1 min-w-0 gap-xs">
                    <span className="text-base font-semibold text-fg-primary">{other.name}</span>
                    <span className="text-sm text-fg-tertiary">
                      {`${verb.charAt(0).toUpperCase() + verb.slice(1)} ${petNames}`}
                    </span>
                    {isProvider && (
                      <span
                        className="inline-flex items-center gap-xs self-start text-xs font-semibold"
                        style={{ color: "var(--status-info-main)", marginTop: "var(--space-xs)" }}
                      >
                        <HandHeart size={12} weight="fill" />
                        You&apos;re providing
                      </span>
                    )}
                  </div>
                </Link>
                <StatusBadge status={booking.status} />
              </div>

              {/* Action buttons — CTA variants like Groups page.
                  Message routes to the profile chat tab (canonical chat surface).
                  Proposed state surfaces Review & sign as the dominant action
                  for the owner — signing here is the canonical accept path
                  and saves a trip to the chat thread. */}
              <div className="flex gap-sm w-full">
                {booking.status === "completed" ? (
                  <>
                    <ButtonAction variant="primary" size="md" cta className="flex-1"
                      leftIcon={<ChatCircleDots size={16} weight="fill" />}
                      onClick={() => router.push(messageHref)}>
                      Message
                    </ButtonAction>
                    {isOwner && !hasReview(booking.id) && (
                      <ButtonAction
                        variant="secondary"
                        size="md"
                        cta
                        className="flex-1"
                        leftIcon={<Star size={16} weight="fill" />}
                        onClick={() => setReviewOpen(true)}
                      >
                        Leave a review
                      </ButtonAction>
                    )}
                    {isOwner && hasReview(booking.id) && (
                      <span
                        className="flex-1 inline-flex items-center justify-center gap-xs px-md py-sm rounded-pill text-sm font-medium"
                        style={{ background: "var(--surface-inset)", color: "var(--text-secondary)" }}
                      >
                        <Star size={14} weight="fill" className="text-[var(--status-warning-main)]" />
                        Reviewed
                      </span>
                    )}
                  </>
                ) : booking.status === "cancelled" ? (
                  <ButtonAction variant="primary" size="md" cta className="flex-1"
                    leftIcon={<ChatCircleDots size={16} weight="fill" />}
                    onClick={() => router.push(messageHref)}>
                    Message
                  </ButtonAction>
                ) : booking.status === "proposed" ? (
                  isOwner ? (
                    <>
                      <ButtonAction variant="outline" size="md" cta className="flex-1"
                        leftIcon={<ChatCircleDots size={16} weight="fill" />}
                        onClick={() => router.push(messageHref)}>
                        Message
                      </ButtonAction>
                      <ButtonAction variant="primary" size="md" cta className="flex-1"
                        onClick={() => setSigningOpen(true)}
                        disabled={!pendingProposalMsg}>
                        Review & sign
                      </ButtonAction>
                    </>
                  ) : (
                    // Provider sent the proposal — they wait on owner to sign.
                    // Single Message action so they can nudge or clarify.
                    <ButtonAction variant="primary" size="md" cta className="flex-1"
                      leftIcon={<ChatCircleDots size={16} weight="fill" />}
                      onClick={() => router.push(messageHref)}>
                      Message
                    </ButtonAction>
                  )
                ) : (
                  <>
                    <ButtonAction variant="primary" size="md" cta className="flex-1"
                      leftIcon={<ChatCircleDots size={16} weight="fill" />}
                      onClick={() => router.push(messageHref)}>
                      Message
                    </ButtonAction>
                    <ButtonAction variant="outline" size="md" cta className="flex-1"
                      leftIcon={<Prohibit size={16} weight="light" />}
                      rightIcon={<CaretDown size={12} weight="bold" />}
                      onClick={() => setShowCancel(true)}>
                      Cancel
                    </ButtonAction>
                  </>
                )}
              </div>
            </div>

            {/* Aggregate stats — ongoing bookings only */}
            {booking.type === "ongoing" && completedSessions.length > 0 && (
              <div className="grid grid-cols-3 gap-md">
                <div className="flex flex-col items-center gap-xs rounded-panel p-md bg-surface-top border border-edge-regular text-center">
                  <Footprints size={20} weight="light" className="text-brand-main" />
                  <span className="text-lg font-semibold text-fg-primary">{completedSessions.length}</span>
                  <span className="text-xs text-fg-tertiary">{serviceNoun} completed</span>
                </div>
                <div className="flex flex-col items-center gap-xs rounded-panel p-md bg-surface-top border border-edge-regular text-center">
                  <CalendarCheck size={20} weight="light" className="text-brand-main" />
                  <span className="text-lg font-semibold text-fg-primary">
                    {formatShortDate(booking.startDate)}
                  </span>
                  <span className="text-xs text-fg-tertiary">Since</span>
                </div>
                <div className="flex flex-col items-center gap-xs rounded-panel p-md bg-surface-top border border-edge-regular text-center">
                  <CalendarDots size={20} weight="light" className="text-brand-main" />
                  <span className="text-lg font-semibold text-fg-primary">
                    {nextSession ? formatShortDate(nextSession.date) : "—"}
                  </span>
                  <span className="text-xs text-fg-tertiary">Next session</span>
                </div>
              </div>
            )}

            {/* Pet info — provider-only reference (medications, conditions,
                behavior, vet contact). Lives on Info because it's reference
                data tied to "what is this booking" rather than session
                execution; clusters with ownerNotes (care instructions)
                below. Sessions & Service Execution walkthrough call,
                2026-05-05. */}
            {isProvider && petProfilesForSession.length > 0 && (
              <PetInfoSection pets={petProfilesForSession} />
            )}

            {/* Details — vertical list */}
            <div className="flex flex-col rounded-panel border border-edge-regular overflow-hidden">
              <div className="flex items-center gap-md bg-surface-top"
                style={{ padding: "var(--space-md) var(--space-lg)", borderBottom: "1px solid var(--border-subtle)" }}>
                <CalendarDots size={18} weight="light" className="text-fg-tertiary shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium text-fg-primary">{scheduleLabel(booking)}</span>
                  <span className="text-xs text-fg-tertiary">
                    {booking.recurringSchedule ? "Recurring" : booking.endDate ? "Date range" : "Start date"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-md bg-surface-top"
                style={{ padding: "var(--space-md) var(--space-lg)", borderBottom: "1px solid var(--border-subtle)" }}>
                <Tag size={18} weight="light" className="text-fg-tertiary shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium text-fg-primary">{perSessionPrice(booking)}</span>
                  <span className="text-xs text-fg-tertiary">
                    {booking.price.billingCycle === "weekly" ? "Billed weekly" : "Rate"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-md bg-surface-top"
                style={{ padding: "var(--space-md) var(--space-lg)" }}>
                <PawPrint size={18} weight="light" className="text-fg-tertiary shrink-0" />
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium text-fg-primary">{petNames}</span>
                  <span className="text-xs text-fg-tertiary">{booking.pets.length === 1 ? "1 pet" : `${booking.pets.length} pets`}</span>
                </div>
              </div>
            </div>

            {/* Notes / Care instructions */}
            {(booking.ownerNotes || booking.carerNotes) && (
              <div className="flex flex-col gap-sm">
                <h3 className="font-heading text-xs font-medium text-fg-secondary m-0">Care instructions</h3>
                <div className="flex flex-col rounded-panel border border-edge-regular overflow-hidden">
                  {booking.ownerNotes && (
                    <div className="flex flex-col gap-xs bg-surface-top"
                      style={{
                        padding: "var(--space-md) var(--space-lg)",
                        borderBottom: booking.carerNotes ? "1px solid var(--border-subtle)" : "none",
                      }}>
                      <span className="text-xs font-semibold text-fg-tertiary">
                        {isOwner ? "Your notes" : `From ${booking.ownerName.split(" ")[0]}`}
                      </span>
                      <p className="text-sm text-fg-primary m-0">{booking.ownerNotes}</p>
                    </div>
                  )}
                  {booking.carerNotes && (
                    <div className="flex flex-col gap-xs bg-surface-top"
                      style={{ padding: "var(--space-md) var(--space-lg)" }}>
                      <span className="text-xs font-semibold text-fg-tertiary">
                        {isProvider ? "Your notes" : `From ${booking.carerName.split(" ")[0]}`}
                      </span>
                      <p className="text-sm text-fg-primary m-0">{booking.carerNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing breakdown — only for one-off bookings with multiple line items */}
            {booking.type === "one_off" && booking.price.lineItems.length > 1 && (
              <div className="flex flex-col gap-sm">
                <h3 className="font-heading text-xs font-medium text-fg-secondary m-0">Pricing</h3>
                <div className="flex flex-col gap-xs rounded-panel p-md bg-surface-top border border-edge-regular">
                  {booking.price.lineItems.map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <span className={`text-sm flex flex-col gap-xxs ${item.isModifier ? "text-fg-tertiary" : "text-fg-secondary"}`}>
                        <span>{item.isModifier ? `+ ${item.label}` : item.label}</span>
                        {item.triggerNote && (
                          <span className="text-xs text-fg-tertiary italic">{item.triggerNote}</span>
                        )}
                      </span>
                      <span className="text-sm text-fg-primary font-medium whitespace-nowrap">
                        {item.amount.toLocaleString()} Kč
                        {!item.isModifier && (
                          <span className="text-fg-tertiary font-normal"> / {item.unit}</span>
                        )}
                      </span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border-subtle)", margin: "var(--space-xs) 0" }} />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-fg-primary">Total</span>
                    <span className="text-sm font-semibold text-fg-primary">
                      {booking.price.total.toLocaleString()} Kč
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {activeTab === "sessions" && (
          <div className="flex flex-col gap-lg" style={{ padding: "var(--space-lg)" }}>
            {/* Pet header — surfaces who the service is for. Walkthrough
                surfaced that the dog's name was nowhere on the Sessions
                tab; testers had to confirm "which dog is this for" by
                hunting through note text. Visible to both owner +
                provider. 2026-05-08. */}
            {petsForBooking.length > 0 && (
              <SessionsPetHeader pets={petsForBooking} />
            )}
            {/* Inline review prompt — surfaces on the Sessions tab when
                the owner has at least one sealed visit report and no
                review yet. Mirrors the Info-tab "Leave a review" CTA
                without forcing a tab flip; G3 walkthrough finding,
                2026-05-08. Suppressed on cancelled bookings (the banner
                below already sets the read-only frame). */}
            {isOwner &&
              !hasReview(booking.id) &&
              booking.status !== "cancelled" &&
              sessions.some(
                (s) => s.status === "completed" && s.report?.completedAt,
              ) && (
                <button
                  type="button"
                  onClick={() => setReviewOpen(true)}
                  className="flex items-center gap-sm w-full rounded-panel text-left cursor-pointer"
                  style={{
                    padding: "var(--space-md)",
                    background: "var(--brand-subtle)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <Star
                    size={20}
                    weight="fill"
                    style={{ color: "var(--status-warning-main)", flexShrink: 0 }}
                  />
                  <span className="flex flex-col flex-1 min-w-0 gap-xs">
                    <span className="text-sm font-semibold text-fg-primary">
                      Leave a review for {booking.carerName.split(" ")[0]}
                    </span>
                    <span className="text-xs text-fg-tertiary">
                      Helps the community know who to trust.
                    </span>
                  </span>
                  <CaretRight
                    size={14}
                    weight="bold"
                    className="text-fg-tertiary shrink-0"
                  />
                </button>
              )}
            {/* Booking-cancelled banner — sits at the top of the
                Sessions tab regardless of session count. The booking
                is dead; everything below is read-only history. Active
                panel + upcoming-sessions list are suppressed when
                booking is cancelled (gates further down). */}
            {booking.status === "cancelled" && (
              <div
                className="flex items-start gap-sm rounded-panel"
                style={{
                  padding: "var(--space-md)",
                  background: "var(--status-error-light)",
                  border: "1px solid var(--error-100, var(--border-strong))",
                }}
              >
                <Prohibit
                  size={20}
                  weight="fill"
                  style={{ color: "var(--status-error-strong)", flexShrink: 0, marginTop: 2 }}
                />
                <div className="flex flex-col gap-xs flex-1 min-w-0">
                  <span
                    className="text-base font-semibold"
                    style={{ color: "var(--status-error-strong)" }}
                  >
                    This booking was cancelled
                  </span>
                  {booking.cancellationReason && (
                    <p className="text-sm text-fg-secondary m-0">
                      {booking.cancellationReason}
                    </p>
                  )}
                  <p className="text-xs text-fg-tertiary m-0">
                    Past sessions remain below as a record of what
                    happened. No further sessions will run.
                  </p>
                </div>
              </div>
            )}
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center gap-md p-xl text-center">
                <CalendarDots size={32} weight="light" className="text-fg-tertiary" />
                <p className="text-fg-secondary m-0">No sessions yet.</p>
              </div>
            ) : (
              <>
                {/* Active session panel — surfaces only when a session is
                    in_progress. Both sides see it. Provider gets the
                    "Send report" CTA prominently; owner sees status +
                    start time + latest photo (mid-session photos land
                    in C2). Suppressed on cancelled bookings — the top
                    banner already sets the "this is over" frame, and
                    an active panel implies forward action that no
                    longer applies. */}
                {booking.status !== "cancelled" && activeSession && (
                  <ActiveSessionPanel
                    session={activeSession}
                    serviceType={booking.serviceType}
                    isProvider={isProvider}
                    onUpdateReport={(s, partial) =>
                      handleUpdateSession(booking.id, s.id, {
                        report: {
                          // Lazy-init the report on first edit. Empty
                          // photo array forms the floor; partial merges
                          // over it so any field can be the first one set.
                          photos: s.report?.photos ?? [],
                          ...s.report,
                          ...partial,
                        },
                      })
                    }
                    onFinish={(s) => {
                      // Single-tap seal. If GPS is tracking, auto-stop +
                      // simulate the metrics so the report carries them
                      // without the provider needing to tap Stop first.
                      // Sub-minute tracking is treated as a non-event —
                      // skip the seal so we don't print "0 km · 0 min"
                      // on an otherwise-quiet visit report.
                      const existingReport = s.report ?? { photos: [] };
                      let walkDistanceKm = existingReport.walkDistanceKm;
                      let walkDurationMin = existingReport.walkDurationMin;
                      if (existingReport.gpsStartedAt) {
                        const elapsedMin = Math.max(
                          0,
                          Math.floor(
                            (Date.now() - new Date(existingReport.gpsStartedAt).getTime()) / 60_000,
                          ),
                        );
                        if (elapsedMin > 0) {
                          walkDistanceKm = Math.round(elapsedMin * 0.06 * 10) / 10;
                          walkDurationMin = elapsedMin;
                        }
                      }
                      handleUpdateSession(booking.id, s.id, {
                        status: "completed",
                        report: {
                          ...existingReport,
                          ...(walkDistanceKm !== undefined ? { walkDistanceKm } : {}),
                          ...(walkDurationMin !== undefined ? { walkDurationMin } : {}),
                          gpsStartedAt: undefined,
                          completedAt: new Date().toISOString(),
                        },
                      });
                    }}
                    onUndoStart={(s) =>
                      handleUpdateSession(booking.id, s.id, {
                        status: "upcoming",
                        checkedInAt: undefined,
                      })
                    }
                  />
                )}

                {/* Upcoming sessions — suppressed on cancelled bookings;
                    no future sessions will run, so showing them as
                    "Upcoming" would mislead. Past sessions stay below
                    as a record of what happened. */}
                {booking.status !== "cancelled" && upcomingSessions.length > 0 && (
                  <>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold text-fg-tertiary uppercase tracking-wide">
                        Upcoming
                      </span>
                      <span className="text-xs text-fg-tertiary">
                        {upcomingSessions.length}
                      </span>
                    </div>
                    <div className="flex flex-col rounded-panel border border-edge-regular overflow-hidden">
                      {[...upcomingSessions]
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .map((session, i) => (
                          <SessionRow
                            key={session.id}
                            session={session}
                            isLast={i === upcomingSessions.length - 1}
                            canAct={isProvider}
                            onUpdate={handleUpdateSession}
                            onCancelSession={setCancelSession}
                            bookingId={booking.id}
                          />
                        ))}
                    </div>
                  </>
                )}

                {/* Past sessions */}
                {pastSessions.length > 0 && (
                  <>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold text-fg-tertiary uppercase tracking-wide">
                        Past
                      </span>
                      <span className="text-xs text-fg-tertiary">
                        {pastSessions.length}
                      </span>
                    </div>
                    <div className="flex flex-col rounded-panel border border-edge-regular overflow-hidden">
                      {[...pastSessions]
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((session, i) => (
                          <SessionRow
                            key={session.id}
                            session={session}
                            isLast={i === pastSessions.length - 1}
                            canAct={isProvider}
                            onUpdate={handleUpdateSession}
                            bookingId={booking.id}
                            cancelledReason={booking.cancelledDates?.[session.date]?.reason}
                            ownerLastViewedAt={lastViewedAt(booking.id)}
                          />
                        ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        <Spacer />
      </div>

      <CancelBookingModal
        open={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={(reason) => {
          cancelBooking(booking.id, reason);
          setShowCancel(false);
        }}
        carerName={isOwner ? booking.carerName : booking.ownerName}
      />

      {/* Signing modal for proposed bookings — owner-side only. Wraps the
          same SigningModal used in the chat thread (single source of truth
          for the contract review UI). The conv lookup + handleSign mirror
          ThreadClient so signing here produces the same downstream effects
          (proposal flips to accepted, contract message appended). */}
      {conv && pendingProposalMsg && (
        <SigningModal
          msg={pendingProposalMsg}
          conv={conv}
          open={signingOpen}
          onClose={() => setSigningOpen(false)}
          onSign={handleSign}
        />
      )}

      <CancelSessionModal
        open={!!cancelSession}
        onClose={() => setCancelSession(null)}
        sessionDateLabel={cancelSession ? formatShortDate(cancelSession.date) : ""}
        onConfirm={(reason) => {
          if (!cancelSession) return;
          handleUpdateSession(booking.id, cancelSession.id, {
            status: "cancelled",
          });
          updateBooking(booking.id, {
            cancelledDates: {
              ...(booking.cancelledDates ?? {}),
              [cancelSession.date]: {
                reason: reason ?? "",
                cancelledAt: new Date().toISOString(),
              },
            },
          });
          setCancelSession(null);
        }}
      />

      <CareReviewSheet
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        carerName={booking.carerName}
        onSubmit={(payload) => {
          addReview({
            bookingId: booking.id,
            authorId: booking.ownerId,
            authorName: booking.ownerName.split(" ").slice(0, 1).join(" ") +
              " " + (booking.ownerName.split(" ")[1]?.[0] ?? "") + ".",
            carerName: booking.carerName,
            carerAvatarUrl: booking.carerAvatarUrl,
            rating: payload.rating,
            text: payload.text,
            photoUrl: payload.photoUrl,
            wouldBookAgain: payload.wouldBookAgain,
            isPrivate: payload.isPrivate,
          });
          setReviewOpen(false);
        }}
      />

    </PageColumn>
  );
}
