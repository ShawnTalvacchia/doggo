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
import { SessionsPetHeader } from "@/components/bookings/SessionsPetHeader";
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
import type { Booking, BookingSession, PetProfile } from "@/lib/types";

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
  if (booking.serviceType === "walks_checkins") return "walking";
  if (booking.serviceType === "house_sitting") return "sitting for";
  if (booking.serviceType === "day_care") return "minding";
  if (booking.serviceType === "boarding") return "hosting";
  return "caring for";
}

function getServiceNoun(booking: Booking): string {
  const sub = booking.subService?.toLowerCase() ?? "";
  if (sub.includes("walk")) return "walks";
  if (sub.includes("sitting") || sub.includes("visit")) return "visits";
  if (sub.includes("overnight") || sub.includes("boarding")) return "nights";
  if (sub.includes("training") || sub.includes("session")) return "sessions";
  if (booking.serviceType === "walks_checkins") return "walks";
  if (booking.serviceType === "house_sitting") return "visits";
  if (booking.serviceType === "day_care") return "visits";
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
            variant="tertiary"
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
                      // Branch on `r` so we never list `photos` twice in
                      // the same object literal — TS2783 fires on the
                      // duplicate-via-spread pattern (Vercel strict
                      // build fails it). Existing report: preserve all
                      // its fields, override notes + editedAt. No prior
                      // report: synthesize a minimal one with the
                      // required `photos: []`.
                      report: r
                        ? { ...r, notes, editedAt: new Date().toISOString() }
                        : { photos: [], notes, editedAt: new Date().toISOString() },
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
      // Provider's most-frequent path post-Start is the engagement
      // surface. Route them onto the active-session sub-page directly
      // so they're not stuck on the chronicle. Cross-app banner +
      // Schedule quick-start follow the same pattern. 2026-05-08.
      router.push(`/bookings/${bookingId}/active`);
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
            {/* Compact "Active session" link card — when a session is
                in progress on this booking, links DOWN into the
                focused sub-page at `/bookings/[id]/active`. Replaces
                the inline ActiveSessionPanel that used to sit at the
                top of the tab. Lets the Sessions tab stay focused on
                chronicle (past + upcoming) while live engagement gets
                its own surface. Visual grammar mirrors the cross-app
                banner: live-pulse dot + label + chevron. 2026-05-08. */}
            {booking.status !== "cancelled" && activeSession && (
              <Link
                href={`/bookings/${booking.id}/active`}
                className="flex items-center gap-md w-full rounded-panel no-underline"
                style={{
                  padding: "var(--space-md) var(--space-lg)",
                  background: "var(--warning-50)",
                  border: "1px solid var(--warning-100)",
                  color: "inherit",
                }}
              >
                <span className="live-pulse-dot" role="img" aria-label="Live" />
                <span className="flex flex-col flex-1 min-w-0 gap-xs">
                  <span className="text-sm font-semibold text-fg-primary">
                    Active session
                  </span>
                  <span className="text-xs text-fg-tertiary">
                    Tap for live updates
                  </span>
                </span>
                <CaretRight size={14} weight="bold" className="text-fg-tertiary shrink-0" />
              </Link>
            )}
            {/* Inline review prompt — surfaces on the Sessions tab when
                the owner has at least one sealed visit report and no
                review yet. Mirrors the Info-tab "Leave a review" CTA
                without forcing a tab flip; G3 walkthrough finding,
                2026-05-08. Suppressed on cancelled bookings (the
                banner below already sets the read-only frame). */}
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
                is dead; everything below is read-only history. */}
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
            {/* Chronicle — empty state OR upcoming + past sessions list.
                The active-session panel previously sat at the top of
                this list; as of 2026-05-08 it lives at the dedicated
                sub-page `/bookings/[id]/active`. The slim "Active
                session" link card rendered above is the entry point. */}
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center gap-md p-xl text-center">
                <CalendarDots size={32} weight="light" className="text-fg-tertiary" />
                <p className="text-fg-secondary m-0">No sessions yet.</p>
              </div>
            ) : (
              <>
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
