"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { useNavigationMemory } from "@/contexts/NavigationMemoryContext";
import { Spacer } from "@/components/layout/Spacer";
import { TabBar } from "@/components/ui/TabBar";
import {
  MapPin,
  CalendarDots,
  Clock,
  Users,
  PawPrint,
  PersonSimpleWalk,
  Tree,
  Target,
  ArrowsClockwise,
  ChatCircleDots,
  PaperPlaneRight,
  ShareNetwork,
  UsersThree,
  Lightning,
  Path,
  Mountains,
  Ruler,
  FlagBanner,
  Park,
  Dog,
  GraduationCap,
  Chalkboard,
  Backpack,
  ShieldCheck,
  Heartbeat,
  Storefront,
  Star,
  Check,
  SignOut,
  Camera,
  CaretRight,
  CaretDown,
  UserPlus,
  Warning,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShareMeetModal } from "@/components/meets/ShareMeetModal";
import { ServiceBookingSheet } from "@/components/meets/ServiceBookingSheet";
import { BookSessionSheet } from "@/components/meets/BookSessionSheet";
import { LinkedCareCallout } from "@/components/meets/LinkedCareCallout";
import { LinkedWalkBookingSheet } from "@/components/meets/LinkedWalkBookingSheet";
import { getLinkedServicesForMeet } from "@/lib/meetUtils";
import { CancelOccurrenceModal } from "@/components/meets/CancelOccurrenceModal";
import { ParticipantList } from "@/components/meets/ParticipantList";
import { MeetPhotoGallery } from "@/components/meets/MeetPhotoGallery";
import { LayoutSection } from "@/components/layout/LayoutSection";
import { FilterPillRow } from "@/components/ui/FilterPillRow";
import { formatMeetDate } from "@/lib/dateUtils";
import { useDismissedReviews, makeDismissId } from "@/lib/dismissedReviews";
import { getConnectionState as getConnState } from "@/lib/mockConnections";
import {
  getAttendeeTier,
  getKnownAttendees,
  recurrenceLabel,
  isRecurring,
  getMeetOccurrences,
  getOccurrenceAttendees,
  getSeriesAttendees,
  nextOccurrenceDates,
  getOccurrenceCancellation,
} from "@/lib/meetUtils";
import { useCurrentUser, useCurrentUserId, useIsGuest } from "@/hooks/useCurrentUser";
import { useAuthGate } from "@/contexts/AuthGateContext";
import { useBookings } from "@/contexts/BookingsContext";
import { getDogImageByOwnerAndName } from "@/lib/dogLookup";
import { getUserById, getServiceById } from "@/lib/mockUsers";
import { getGroupById } from "@/lib/mockGroups";
import {
  mockMeets,
  setMeetRsvp,
  setOccurrenceCancellation,
  getSeriesFollowers,
  MEET_TYPE_LABELS,
  LEASH_LABELS,
  ENERGY_LABELS,
  PACE_LABELS,
  DISTANCE_LABELS,
  TERRAIN_LABELS,
  AMENITY_LABELS,
  VIBE_LABELS,
  AGE_RANGE_LABELS,
  PLAY_STYLE_LABELS,
  SKILL_LABELS,
  EXPERIENCE_LABELS,
  TRAINER_TYPE_LABELS,
  getMeetTypeSummary,
} from "@/lib/mockMeets";
import { getMessagesForMeet } from "@/lib/mockMeetMessages";
import type {
  Meet,
  MeetType,
  MeetMessage,
  CarerMeetServiceConfig,
  CarerCareServiceConfig,
  UserProfile,
} from "@/lib/types";

/* ── Constants ── */

const MEET_ICONS: Record<MeetType, React.ReactNode> = {
  walk: <PersonSimpleWalk size={16} weight="light" />,
  park_hangout: <Tree size={16} weight="light" />,
  playdate: <PawPrint size={16} weight="light" />,
  training: <Target size={16} weight="light" />,
};

const MEET_TABS = [
  { key: "details", label: "Details" },
  { key: "people", label: "People" },
  { key: "chat", label: "Chat" },
];

/** Fallback cover photos per meet type when no cover is set */
const TYPE_FALLBACK_COVERS: Record<MeetType, string> = {
  walk: "/images/generated/group-walk-stromovka.jpeg",
  park_hangout: "/images/generated/park-hangout-riegrovy.jpeg",
  playdate: "/images/generated/puppy-socialization.jpeg",
  training: "/images/generated/training-session.jpeg",
};

/* ── Helpers ── */

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}min` : `${h}h`;
}

function formatShortDate(dateStr: string): { weekday: string; day: string; month: string } {
  const d = new Date(dateStr + "T12:00:00");
  return {
    weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
    day: d.getDate().toString(),
    month: d.toLocaleDateString("en-GB", { month: "short" }),
  };
}

/** Flat date label for the cancel-occurrence modal body, e.g. "Wed, 13 May". */
function formatCancelDateLabel(dateStr: string): string {
  const { weekday, day, month } = formatShortDate(dateStr);
  return `${weekday}, ${day} ${month}`;
}

function formatMessageTime(sentAt: string): string {
  const d = new Date(sentAt);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** Whether MeetTypeDetails will render any content for this meet */
function hasMeetTypeDetails(meet: Meet): boolean {
  if (meet.type === "walk" && meet.walk) {
    const w = meet.walk;
    return Boolean(w.pace || w.distance || w.terrain || w.routeNotes);
  }
  if (meet.type === "park_hangout" && meet.parkHangout) {
    const p = meet.parkHangout;
    return Boolean(p.dropIn || p.amenities?.length || p.vibe);
  }
  if (meet.type === "playdate" && meet.playdate) {
    const pd = meet.playdate;
    return Boolean(pd.ageRange || pd.playStyle || pd.fencedArea !== undefined || pd.maxDogsPerPerson);
  }
  if (meet.type === "training" && meet.training) {
    const t = meet.training;
    return Boolean(t.skillFocus?.length || t.experienceLevel || t.ledBy || t.equipmentNeeded?.length);
  }
  return false;
}

/* getAttendeeTier + getKnownAttendees now live in `lib/meetUtils.ts` (canonical). */

/* ── Sub-components ── */

function MessageBubble({ message, isOwn }: { message: MeetMessage; isOwn: boolean }) {
  return (
    <div className={`flex gap-sm ${isOwn ? "flex-row-reverse" : ""}`}>
      {!isOwn && (
        <img
          src={message.senderAvatarUrl}
          alt={message.senderName}
          className="w-7 h-7 rounded-full shrink-0 object-cover"
        />
      )}
      <div
        className={`flex flex-col gap-xs rounded-lg px-md py-sm ${isOwn ? "bg-brand-subtle" : "bg-surface-top border border-edge-light"}`}
        style={{ maxWidth: "75%" }}
      >
        {!isOwn && (
          <span className="text-xs font-medium text-fg-primary">{message.senderName}</span>
        )}
        <span className="text-sm text-fg-primary">{message.text}</span>
        <span className={`text-xs text-fg-tertiary ${isOwn ? "self-start" : "self-end"}`}>
          {formatMessageTime(message.sentAt)}
        </span>
      </div>
    </div>
  );
}

/* ── Page (with Suspense boundary for useSearchParams) ── */

export default function MeetDetailPage() {
  return (
    <Suspense>
      <MeetDetailInner />
    </Suspense>
  );
}

function MeetDetailInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "details";
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const { lastListPath } = useNavigationMemory();
  const currentUser = useCurrentUser();
  const currentUserId = currentUser.id;
  const isGuest = useIsGuest();
  const { requireAuth } = useAuthGate();

  const meet = mockMeets.find((m) => m.id === params.id);
  const [showShare, setShowShare] = useState(false);
  // Booking sheet state — open + which occurrence date is being booked.
  // For one-off care meets the date is `meet.date`; for recurring it's the
  // tapped occurrence date from the Upcoming dates row. `null` = sheet closed.
  const [bookingDate, setBookingDate] = useState<string | null>(null);
  // Linked-walk booking sheet (config #2) — open/closed. A free meet that
  // links a Walks & Check-ins Care service offers this *separate* paid path
  // (book ≠ attend). Walk Service Delivery rename, 2026-05-20.
  const [linkedWalkOpen, setLinkedWalkOpen] = useState(false);
  // Cancel-this-occurrence modal state — host-only, recurring meets only.
  // `null` = closed; otherwise the ISO date being cancelled.
  const [cancelOccDate, setCancelOccDate] = useState<string | null>(null);
  // Bumps a render counter when we mutate `meet.cancelledDates` so the page
  // re-renders. mockMeets is mutated in place by `setOccurrenceCancellation`,
  // and React doesn't observe object-identity changes on a captured ref.
  const [, setMutationTick] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  // One-off RSVP — single state value. For recurring meets the equivalent
  // state lives on `rsvpByDate` below.
  const [rsvpStatus, setRsvpStatus] = useState<"none" | "going" | "interested">("none");
  // Per-occurrence RSVP for recurring meets, keyed by ISO YYYY-MM-DD. Each
  // row in the "Upcoming dates" section drives one entry. Series-level
  // following (subscription, separate from per-occurrence RSVP) is the
  // adjacent `following` state.
  const [rsvpByDate, setRsvpByDate] = useState<Record<string, "none" | "going" | "interested">>({});
  const [following, setFollowing] = useState(false);

  if (!meet) {
    return (
      <div className="flex flex-col items-center gap-md p-xl">
        <p className="text-fg-secondary">Meet not found.</p>
        <ButtonAction variant="secondary" size="sm" onClick={() => router.push("/home")}>
          Back to Home
        </ButtonAction>
      </div>
    );
  }

  // Guests have no identity on a meet — they aren't creator, attendee, or
  // follower of anything. Forcing `isCreator` false collapses the role-aware
  // hosting / attending / following UI to the inactive-browse variant, where
  // every action button drops into the AuthGate handler below. D4 2026-05-11.
  const isCreator = !isGuest && meet.creatorId === currentUserId;
  const recurring = isRecurring(meet);

  // Service ↔ Meet Linkage C4 — resolve the meet's linked Meet-type service
  // (if any) so the Book CTA routes through `BookSessionSheet` (real Booking
  // record + roster entry) rather than the legacy `ServiceBookingSheet`.
  const linkedServiceRef = getLinkedServicesForMeet(meet)[0];
  const meetCarer = getUserById(meet.creatorId);
  const linkedService: CarerMeetServiceConfig | undefined =
    linkedServiceRef && meetCarer
      ? meetCarer.carerProfile?.services.find(
          (s): s is CarerMeetServiceConfig =>
            s.kind === "meet" && s.id === linkedServiceRef.serviceId,
        )
      : undefined;

  // Service ↔ Meet Linkage config #2 — a free meet can advertise a drop-off
  // **Care** service (book ≠ attend). `getServiceById` scans all carers, so
  // a host advertising another carer's service resolves too. Required-link
  // (`serviceCTA`) meets don't use this — they're the "About this service"
  // card path.
  const linkedCareService: { service: CarerCareServiceConfig; carer: UserProfile } | undefined =
    !meet.serviceCTA
      ? (() => {
          for (const ref of getLinkedServicesForMeet(meet)) {
            const r = getServiceById(ref.serviceId);
            if (r && r.service.kind === "care") {
              return { service: r.service, carer: r.carer };
            }
          }
          return undefined;
        })()
      : undefined;

  // Derive RSVP from mock data on first render. For one-off meets that's a
  // single status; for recurring meets it's the per-occurrence map keyed by
  // each seeded date the user appears in.
  const myAttendee = recurring ? null : meet.attendees.find((a) => a.userId === currentUserId);

  useEffect(() => {
    if (recurring) {
      const byDate: Record<string, "going" | "interested"> = {};
      const attendeesByDate = meet.attendeesByDate ?? {};
      for (const [date, list] of Object.entries(attendeesByDate)) {
        const me = list.find((a) => a.userId === currentUserId);
        if (me) byDate[date] = me.rsvpStatus === "interested" ? "interested" : "going";
      }
      setRsvpByDate(byDate);
      setFollowing((meet.followers ?? []).includes(currentUserId));
      // Hosting is a series-level role for recurring meets — surfaces in the
      // creator banner regardless of per-occurrence RSVPs.
      if (isCreator) setRsvpStatus("going");
    } else if (isCreator) {
      setRsvpStatus("going");
    } else if (myAttendee) {
      setRsvpStatus(myAttendee.rsvpStatus === "interested" ? "interested" : "going");
    }
  }, [meet.id, recurring, currentUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Compute the next 3 occurrences for recurring meets — drives the
  // "Upcoming dates" section and supplies the default occurrence for the
  // "Who's coming" / People tab.
  const occurrences = recurring ? getMeetOccurrences(meet, 3) : [];
  // Default occurrence used by the "Who's coming" summary, the People tab,
  // and the chat tab join-gate. For recurring meets that's the next upcoming
  // date; for one-off it's the meet itself.
  const focusDate = recurring ? (occurrences[0]?.date ?? meet.date) : meet.date;
  const focusAttendees = getOccurrenceAttendees(meet, focusDate);

  // Joined-state for the chat tab. Recurring: any per-occurrence going; one-off: rsvpStatus.
  const isJoined = isCreator
    || (!recurring && rsvpStatus === "going")
    || (recurring && Object.values(rsvpByDate).some((s) => s === "going"));

  const goingAttendees = focusAttendees.filter((a) => (a.rsvpStatus ?? "going") === "going");
  const interestedCount = focusAttendees.filter((a) => a.rsvpStatus === "interested").length;
  const totalDogs = focusAttendees.reduce((sum, a) => sum + a.dogNames.length, 0);
  const spotsLeft = meet.maxAttendees - goingAttendees.length;
  const messages = getMessagesForMeet(meet.id);

  function handleRsvpDateChange(date: string, status: "none" | "going" | "interested") {
    if (isGuest) {
      requireAuth("RSVP to this meet");
      return;
    }
    setRsvpByDate((prev) => {
      const next = { ...prev };
      if (status === "none") delete next[date];
      else next[date] = status;
      return next;
    });
    // Propagate to mockMeets so the Schedule page (which reads from
    // `getUserMeetInstances` → `meet.attendeesByDate`) reflects the
    // commitment. Without this the user sees their UI flip but the
    // Schedule stays empty until reload — and even then, mockMeets is the
    // source of truth, so the local state would drift.
    if (meet) setMeetRsvp(meet, currentUser, date, status);
  }

  // One-off RSVP wrapper — same propagation pattern as the recurring
  // per-occurrence handler above. The standard `setRsvpStatus` only
  // updates local component state; this wrapper additionally pushes to
  // `meet.attendees` so Schedule picks it up.
  function handleRsvpChange(status: "none" | "going" | "interested") {
    if (isGuest) {
      requireAuth("RSVP to this meet");
      return;
    }
    setRsvpStatus(status);
    if (meet) setMeetRsvp(meet, currentUser, meet.date, status);
  }

  function handleFollowingChange(next: boolean) {
    if (isGuest) {
      requireAuth("follow this series");
      return;
    }
    setFollowing(next);
  }

  function handleShareClick() {
    if (isGuest) {
      requireAuth("share this meet");
      return;
    }
    setShowShare(true);
  }

  function handleBookClick(date: string) {
    if (isGuest) {
      requireAuth("book this session");
      return;
    }
    setBookingDate(date);
  }

  // Confirm-from-modal handler. Mutates `meet.cancelledDates` via the
  // mockMeets helper, then nudges a re-render so the row + Schedule pick
  // up the change immediately.
  function handleConfirmCancelOccurrence(reason: string) {
    if (!meet || !cancelOccDate) return;
    setOccurrenceCancellation(meet, cancelOccDate, reason);
    setCancelOccDate(null);
    setMutationTick((t) => t + 1);
  }

  // Host-side restore — clears `meet.cancelledDates[date]`. No modal: the
  // host already saw the cancellation, undoing it shouldn't require a
  // confirmation gauntlet. Same mutation-tick re-render path as confirm.
  function handleRestoreOccurrence(date: string) {
    if (!meet) return;
    setOccurrenceCancellation(meet, date, null);
    setMutationTick((t) => t + 1);
  }

  // Right action changes per tab. Guests don't get a Share affordance in the
  // header — every share path requires an authenticated identity.
  // Header-action convention (2026-05-11, Cross-Cutting Flow Testing):
  // outline + sm + leftIcon + text, no `cta` (rectangular). See
  // `design-system.md` → "Header actions."
  const headerAction = activeTab === "details" && !isGuest ? (
    <ButtonAction
      variant="outline"
      size="sm"
      leftIcon={<ShareNetwork size={14} weight="bold" />}
      onClick={handleShareClick}
    >
      Share
    </ButtonAction>
  ) : undefined;

  // Grouped meets always walk up to their group's Meets tab (tree —
  // the meet belongs to the group regardless of how the viewer arrived).
  // Standalone meets are source-aware: walk back to wherever the viewer
  // was last on a list surface (home, schedule, discover/meets, etc.),
  // falling back to /schedule (or / for guests).
  const parentHref = meet.groupId
    ? `/communities/${meet.groupId}?tab=meets`
    : lastListPath ?? (isGuest ? "/" : "/schedule");

  useEffect(() => {
    setDetailHeader(meet.title, () => router.push(parentHref), headerAction);
    return () => clearDetailHeader();
  }, [meet.title, activeTab, isGuest, parentHref]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (key: string) => {
    if (key === "details") {
      router.replace(`/meets/${meet.id}`, { scroll: false });
    } else {
      router.replace(`/meets/${meet.id}?tab=${key}`, { scroll: false });
    }
  };

  return (
    <div className="meet-detail-page">
      <DetailHeader backLabel="Back" title={meet.title} rightAction={headerAction} backHref={parentHref} />

      <div className="meet-detail-panel">
        <div className={`meet-detail-body${activeTab === "chat" ? " meet-detail-body--chat" : ""}`}>
          <div className="detail-tabs detail-tabs--fill">
            <TabBar tabs={MEET_TABS} activeKey={activeTab} onChange={handleTabChange} />
          </div>

          {activeTab === "details" && (
            <DetailsTab
              meet={meet}
              linkedService={linkedService}
              linkedCareService={linkedCareService}
              onBookLinkedWalk={() => setLinkedWalkOpen(true)}
              focusAttendees={focusAttendees}
              goingAttendees={goingAttendees}
              interestedCount={interestedCount}
              totalDogs={totalDogs}
              spotsLeft={spotsLeft}
              isCreator={isCreator}
              rsvpStatus={rsvpStatus}
              onRsvpChange={handleRsvpChange}
              occurrences={occurrences}
              rsvpByDate={rsvpByDate}
              onRsvpDateChange={handleRsvpDateChange}
              following={following}
              onFollowingChange={handleFollowingChange}
              onShare={handleShareClick}
              onBook={handleBookClick}
              onCancelOccurrence={(date) => setCancelOccDate(date)}
              onRestoreOccurrence={handleRestoreOccurrence}
            />
          )}

          {activeTab === "people" && (
            <PeopleTab meet={meet} />
          )}

          {activeTab === "chat" && (
            <ChatTab
              meet={meet}
              messages={messages}
              isJoined={isJoined}
              newMessage={newMessage}
              onNewMessageChange={setNewMessage}
            />
          )}

          {/* Spacer prevents the bottom of scrollable content from being clipped by
              panel border-radius — but on the chat tab the body itself doesn't scroll
              (the chat manages its own scroll + docked input footer). */}
          {activeTab !== "chat" && <Spacer />}
        </div>
      </div>

      <ShareMeetModal meet={meet} open={showShare} onClose={() => setShowShare(false)} />
      <CancelOccurrenceModal
        open={cancelOccDate !== null}
        onClose={() => setCancelOccDate(null)}
        onConfirm={handleConfirmCancelOccurrence}
        dateLabel={cancelOccDate ? formatCancelDateLabel(cancelOccDate) : ""}
        meetTitle={meet.title}
      />
      {/* Service ↔ Meet Linkage C4 — meets with a resolvable linked
          Meet-type service book through BookSessionSheet (creates a real
          Booking + roster entry). Legacy serviceCTA-only meets keep the
          ServiceBookingSheet path until serviceCTA is fully retired. */}
      {linkedService && meetCarer ? (
        <BookSessionSheet
          open={bookingDate !== null}
          onClose={() => setBookingDate(null)}
          service={linkedService}
          carer={{
            id: meetCarer.id,
            name: meetCarer.firstName,
            avatarUrl: meetCarer.avatarUrl,
          }}
          preselectedMeetId={meet.id}
          preselectedDate={bookingDate ?? undefined}
          onBooked={(_meetId, date) => {
            // Sync the page's local RSVP state so the row flips to Going
            // immediately (the sheet already mutated mockMeets).
            if (recurring) {
              handleRsvpDateChange(date, "going");
            } else {
              handleRsvpChange("going");
            }
          }}
        />
      ) : (
        <ServiceBookingSheet
          meet={meet}
          occurrenceDate={bookingDate ?? meet.date}
          open={bookingDate !== null}
          onClose={() => setBookingDate(null)}
          onConfirmed={(date) => {
            // Flip the row / status to a committed (Booked / Going) state
            // and propagate to mockMeets so the Schedule page picks up the
            // booking. Recurring uses per-occurrence; one-off uses the
            // single rsvpStatus. Both wrappers handle the propagation
            // internally.
            if (recurring) {
              handleRsvpDateChange(date, "going");
            } else {
              handleRsvpChange("going");
            }
          }}
        />
      )}
      {/* Config #2 — linked-care Walk booking. Creates a Care Booking; the
          owner is NOT added to the meet roster (book ≠ attend). The owner
          picks delivery (pickup vs drop-off) inside the sheet. */}
      {linkedCareService && (
        <LinkedWalkBookingSheet
          open={linkedWalkOpen}
          onClose={() => setLinkedWalkOpen(false)}
          service={linkedCareService.service}
          carer={{
            id: linkedCareService.carer.id,
            name: `${linkedCareService.carer.firstName} ${linkedCareService.carer.lastName}`,
            avatarUrl: linkedCareService.carer.avatarUrl,
          }}
          meet={meet}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Details tab — redesigned
   ═══════════════════════════════════════════════════════════════ */

function DetailsTab({
  meet,
  linkedService,
  linkedCareService,
  onBookLinkedWalk,
  focusAttendees,
  goingAttendees,
  interestedCount,
  totalDogs,
  spotsLeft,
  isCreator,
  rsvpStatus,
  onRsvpChange,
  occurrences,
  rsvpByDate,
  onRsvpDateChange,
  following,
  onFollowingChange,
  onShare,
  onBook,
  onCancelOccurrence,
  onRestoreOccurrence,
}: {
  meet: Meet;
  /** The Meet-type service this meet links (resolved by the parent), if any.
   *  Drives the "About this service" card heading copy. */
  linkedService?: CarerMeetServiceConfig;
  /** A Walks & Check-ins Care service this free meet advertises
   *  (config #2 — linked-care booking, book ≠ attend). Renders the
   *  `LinkedCareCallout` — the separate "book a carer to walk your dog"
   *  path. */
  linkedCareService?: { service: CarerCareServiceConfig; carer: UserProfile };
  /** Opens the linked-walk booking sheet. */
  onBookLinkedWalk: () => void;
  /**
   * Attendees for the focus occurrence — i.e. the next upcoming date for
   * recurring meets, or the only date for one-off. Used to drive "Who's
   * coming," dog-count, etc. — surfaces that need a single attendee list.
   */
  focusAttendees: Meet["attendees"];
  goingAttendees: Meet["attendees"];
  interestedCount: number;
  // Note: currentUser sourced via hook below — easier than threading through
  // every prop. DetailsTab is a React component so this is fine.
  totalDogs: number;
  spotsLeft: number;
  isCreator: boolean;
  rsvpStatus: "none" | "going" | "interested";
  onRsvpChange: (status: "none" | "going" | "interested") => void;
  /**
   * Next N occurrences for recurring meets — drives the per-date Going /
   * Interested rows. Empty for one-off meets (caller passes []).
   */
  occurrences: ReturnType<typeof getMeetOccurrences>;
  rsvpByDate: Record<string, "none" | "going" | "interested">;
  onRsvpDateChange: (date: string, status: "none" | "going" | "interested") => void;
  following: boolean;
  onFollowingChange: (next: boolean) => void;
  onShare: () => void;
  /**
   * Open the ServiceBookingSheet for a specific date. Used by the
   * one-off Book CTA on the service info card and by the per-row Book
   * buttons on the Upcoming dates section for recurring care meets.
   */
  onBook: (date: string) => void;
  /**
   * Open the host-side cancel-this-date modal for a specific occurrence.
   * Host-only — gated in `RecurringUpcomingDates` by `isCreator`. Wired
   * into the page's `cancelOccDate` state.
   */
  onCancelOccurrence: (date: string) => void;
  /**
   * Host-side undo for a previously cancelled occurrence. Clears the
   * `cancelledDates[date]` entry directly — no confirmation modal.
   */
  onRestoreOccurrence: (date: string) => void;
}) {
  const currentUser = useCurrentUser();
  const currentUserId = currentUser.id;
  const recurring = isRecurring(meet);
  const group = meet.groupId ? getGroupById(meet.groupId) : null;

  // Config #2 — drop-off Care bookings the viewer made on THIS meet, keyed
  // by occurrence date → booking id. Lets the Upcoming dates rows show
  // "Drop-off booked" in place of Join / Skip. Because book ≠ attend, the
  // booking never touched the meet roster — the meet page surfaces it from
  // the booking record itself (`Booking.dropoffMeetId`).
  const { bookings } = useBookings();
  const dropoffByDate: Record<string, string> = {};
  for (const b of bookings) {
    if (b.ownerId === currentUserId && b.dropoffMeetId === meet.id) {
      dropoffByDate[b.startDate] = b.id;
    }
  }
  const coverUrl = meet.coverPhotoUrl || meet.photos?.[0] || TYPE_FALLBACK_COVERS[meet.type];
  // Tier helpers operate on the focus occurrence's attendee list — for
  // recurring meets that's the next upcoming date's roster; for one-off,
  // the only roster.
  const knownAttendees = getKnownAttendees(focusAttendees, currentUserId);
  const shortDate = formatShortDate(meet.date);
  const typeSummary = getMeetTypeSummary(meet);
  const [rsvpMenuOpen, setRsvpMenuOpen] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    if (!rsvpMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".meet-rsvp-menu-wrap")) setRsvpMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [rsvpMenuOpen]);

  return (
    <>
      {/* ── Hero cover photo (no overlays / no badges) ── */}
      <div
        className="meet-hero"
        style={{ backgroundImage: `url(${coverUrl})` }}
      />

      {/* ── Title, description, info card, RSVP actions (mirrors .group-detail-info) ── */}
      <div className="meet-detail-info">
        {/* Type badge — at the top, light brand coloring. A8 adds a "Paid
            session" badge for care-group meets so providers' offerings read
            as services, not peer meets. */}
        <div className="flex items-center gap-sm flex-wrap">
          <span className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-brand-subtle text-brand-strong">
            {MEET_ICONS[meet.type]}
            {MEET_TYPE_LABELS[meet.type]}
          </span>
          {meet.serviceCTA && (
            <span
              className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-semibold"
              style={{ background: "var(--status-info-100, #e3e8ff)", color: "var(--status-info-700, #3a4c9f)" }}
              title="This is a paid service offered by a provider"
            >
              <Storefront size={10} weight="bold" /> Paid session
            </span>
          )}
          {recurrenceLabel(meet) && (
            <span className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-surface-base text-fg-secondary">
              <ArrowsClockwise size={10} weight="bold" /> {recurrenceLabel(meet)}
            </span>
          )}
          {meet.status === "completed" && !recurring && (
            <span className="flex items-center gap-xs px-xs text-xs font-medium text-fg-secondary">
              <Check size={12} weight="bold" />
              Completed
            </span>
          )}
        </div>

        {/* Title — match group exactly via Tailwind utilities */}
        <h1 className="font-heading text-2xl font-medium text-fg-primary m-0">
          {meet.title}
        </h1>

        {/* Parent-group eyebrow link — quick path back up to the parent
            community without scrolling to the "Organised by" section.
            Small + light because it's pure navigation; the host trust
            card lower down does the heavier work of "who's running this." */}
        {group && (
          <Link href={`/communities/${group.id}`} className="meet-parent-group-link">
            <UsersThree size={13} weight="fill" />
            <span>{group.name}</span>
            <CaretRight size={11} weight="bold" />
          </Link>
        )}

        {/* Cancellation banner — surfaces above the description so the
            cancellation context lands first, with the original meet info
            visible below (the description is no longer rewritten on
            cancellation; cancellationReason carries the why). */}
        {meet.status === "cancelled" && meet.cancellationReason && (
          <div className="meet-cancelled-banner">
            <div className="meet-cancelled-banner-text">
              <span className="meet-cancelled-banner-title">
                <Warning size={14} weight="fill" />
                This meet has been cancelled
              </span>
              <span className="meet-cancelled-banner-reason">{meet.cancellationReason}</span>
            </div>
          </div>
        )}

        {/* Description */}
        {meet.description && (
          <p className="meet-description">{meet.description}</p>
        )}

        {/* When + where — side-by-side row card */}
        <div className="meet-info-card">
          <div className="meet-info-row">
            <CalendarDots size={16} weight="light" />
            <span>
              <strong>{shortDate.weekday}, {shortDate.day} {shortDate.month}</strong>
              {" · "}
              {meet.time}
              {" "}
              <span className="text-fg-tertiary">({formatDuration(meet.durationMinutes)})</span>
            </span>
          </div>
          <div className="meet-info-row">
            <MapPin size={16} weight="light" />
            <span>
              <strong>{meet.location}</strong>
              {" · "}
              <span className="text-fg-tertiary">{LEASH_LABELS[meet.leashRule]}</span>
            </span>
          </div>
        </div>

        {/* Config #2 — a free walk that also advertises a drop-off Care
            service. The callout is the separate "book a carer to walk your
            dog" path; the free RSVP below stays untouched (book ≠ attend). */}
        {linkedCareService && meet.status !== "cancelled" && (
          /* Small extra margin-bottom — the section `gap-md` alone reads
             tighter below the callout (against the RSVP buttons) than
             above it, so a nudge evens the optical spacing. */
          <div className="mb-xs">
            <LinkedCareCallout
              service={linkedCareService.service}
              carer={{
                name: linkedCareService.carer.firstName,
                avatarUrl: linkedCareService.carer.avatarUrl,
              }}
              onBook={onBookLinkedWalk}
            />
          </div>
        )}

        {/* RSVP action row.
            One-off meets: single Going/Interested dropdown + Invite (legacy).
            Recurring meets: series-level "Interested" toggle (subscription —
            data lives on `Meet.followers`) + an Upcoming Dates section
            rendered below with per-row Going / Skip. The Invite button
            stays on the meet level either way — you invite people to the
            series, not a specific occurrence.

            **One-off paid (care-group) meets** skip this row entirely —
            booking is the only commitment path and lives on the service
            info card just below the title (the Book CTA there carries the
            action). Showing both an RSVP dropdown and a Book CTA on the
            same page would invite the question "do I RSVP first or book
            first?" — the answer is just "book." Invite still makes sense,
            but is folded into the service info card rather than a
            standalone row. */}
        {meet.status === "upcoming" && !recurring && !meet.serviceCTA && (
          <div className="group-action-buttons">
            {isCreator ? (
              <ButtonAction variant="outline" size="md" cta leftIcon={<Check size={16} weight="bold" />} disabled>
                Hosting
              </ButtonAction>
            ) : (
              <div className="meet-rsvp-menu-wrap dropdown-menu-wrap">
                <ButtonAction
                  // FB-style toggle pattern (2026-04-27 v3): inactive is
                  // quiet (neutral fill); active is brand-celebrated
                  // (brand-subtle). Brand color appears only when committed,
                  // never on inactive — otherwise the brand presence on
                  // both states competes and "active" loses its identity.
                  // Going vs Interested distinguished by icon (Check vs
                  // filled Star) and label, not color.
                  variant={rsvpStatus === "none" ? "neutral" : "brand-subtle"}
                  size="md"
                  cta
                  leftIcon={
                    rsvpStatus === "going" ? (
                      <Check size={16} weight="bold" />
                    ) : rsvpStatus === "interested" ? (
                      <Star size={16} weight="fill" />
                    ) : undefined
                  }
                  rightIcon={<CaretDown size={12} weight="bold" />}
                  disabled={rsvpStatus === "none" && spotsLeft === 0}
                  onClick={() => setRsvpMenuOpen((v) => !v)}
                >
                  {rsvpStatus === "going"
                    ? "Going"
                    : rsvpStatus === "interested"
                    ? "Interested"
                    : spotsLeft > 0
                    ? "Join this meet"
                    : "Meet is full"}
                </ButtonAction>

                {rsvpMenuOpen && (
                  <div className="dropdown-menu" role="menu">
                    {/* All menu icons use weight="light" for visual
                        consistency. Active item is signaled by brand
                        color on text+icon (no background fill). */}
                    <button
                      type="button"
                      className={`dropdown-menu-item${rsvpStatus === "going" ? " is-active" : ""}`}
                      onClick={() => { onRsvpChange("going"); setRsvpMenuOpen(false); }}
                      disabled={spotsLeft === 0 && rsvpStatus !== "going"}
                    >
                      <Check size={16} weight="light" /> Going
                    </button>
                    <button
                      type="button"
                      className={`dropdown-menu-item${rsvpStatus === "interested" ? " is-active" : ""}`}
                      onClick={() => { onRsvpChange("interested"); setRsvpMenuOpen(false); }}
                    >
                      <Star size={16} weight="light" /> Interested
                    </button>
                    {rsvpStatus !== "none" && (
                      <button
                        type="button"
                        className="dropdown-menu-item dropdown-menu-item--destructive"
                        onClick={() => { onRsvpChange("none"); setRsvpMenuOpen(false); }}
                      >
                        <SignOut size={16} weight="light" /> Not going
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Invite disabled when full — no point inviting to something
                they can't join. One-off only; recurring meets keep Invite
                enabled because future occurrences may have capacity (the
                Invite shares the series, not a specific date). */}
            <ButtonAction
              variant="outline"
              size="md"
              cta
              leftIcon={<UserPlus size={16} weight="bold" />}
              onClick={onShare}
              disabled={spotsLeft === 0}
            >
              Invite
            </ButtonAction>
          </div>
        )}

        {/* Recurring meets: series-level Interested toggle + Invite. The
            per-date Going / Skip rows live in their own section below.
            Hosting users implicitly host every occurrence — they don't
            mark their own series as Interested.

            "Interested" is the user-facing label for series-level
            subscription. Internally the data lives on `Meet.followers`
            (see types.ts) — the rename is purely UX, picking the more
            familiar verb that the app already uses for soft commitment
            elsewhere.

            Status check is `!== "cancelled"` (not `=== "upcoming"`) — some
            mock meets carry legacy `status: "completed"` from before the
            recurrence model split series-status from occurrence-status. A
            weekly walk with a recent past anchor is still an active series. */}
        {meet.status !== "cancelled" && recurring && (
          <div className="group-action-buttons">
            {isCreator ? (
              <ButtonAction variant="outline" size="md" cta leftIcon={<FlagBanner size={16} weight="fill" />} disabled>
                Hosting series
              </ButtonAction>
            ) : (
              <ButtonAction
                // FB-style toggle: active = brand-subtle (celebrated);
                // inactive = neutral (quiet — no brand presence). Star
                // icon weight (fill vs light) carries the within-state
                // signal alongside the bg-fill swap.
                variant={following ? "brand-subtle" : "neutral"}
                size="md"
                cta
                leftIcon={
                  following ? <Star size={16} weight="fill" /> : <Star size={16} weight="light" />
                }
                onClick={() => onFollowingChange(!following)}
              >
                Interested
              </ButtonAction>
            )}

            <ButtonAction variant="outline" size="md" cta leftIcon={<UserPlus size={16} weight="bold" />} onClick={onShare}>
              Invite
            </ButtonAction>
          </div>
        )}
      </div>

      {/* ── Content sections ── */}
      <div className="meet-detail-content">

      {/* ── Service offering section (care-group meets) ──
          Moved here from the bottom on 2026-04-27. Booking is the primary
          action on paid sessions, so the card now sits above all other
          content sections.

          Two render modes:
          - One-off (`!recurring`): Book CTA renders inline on the card.
            Tapping it opens `ServiceBookingSheet` for `meet.date`.
          - Recurring: card renders as info-only (provider + price + spots
            context). Per-occurrence Book buttons live on the Upcoming
            dates rows below — bookings are always to a specific date,
            and the recurring card would otherwise duplicate or contradict
            the per-row CTAs.

          The framed style + colour tokens preserve the prior "this is a
          paid offering, not a peer meet" visual cue. */}
      {meet.serviceCTA && (
        <section className="meet-section">
          <h2 className="meet-section-title">
            {recurring ? "About this service" : "Book this session"}
          </h2>
          {recurring ? (
            /* Recurring required-link service — one tappable card
               (avatar · title + description · price + caret). Tapping it
               opens BookSessionSheet, whose picker shows the full
               occurrence list; the per-date rows below stay as the quick
               path. Layout mirrors the config #2 LinkedCareCallout so the
               two service surfaces read as one family. The carer's
               profile link moved into the sheet (no nested interactive
               element inside this button). */
            <button
              type="button"
              onClick={() => onBook(meet.date)}
              className="flex items-start gap-md rounded-panel w-full text-left"
              style={{
                background: "var(--status-info-50, #f4f6ff)",
                border: "1px solid var(--status-info-200, #ccd6ff)",
                padding: "var(--space-md)",
                cursor: "pointer",
              }}
            >
              {group?.providers?.[0]?.avatarUrl && (
                <img
                  src={group.providers[0].avatarUrl}
                  alt={group.providers[0].name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              )}
              {/* Avatar is its own column; title + description and the
                  price·caret row stack in the content column (price on
                  its own row so it isn't squeezed by wrapping copy).
                  Mirrors the config #2 LinkedCareCallout. */}
              <span className="flex flex-col flex-1 min-w-0 gap-sm">
                <span className="flex flex-col gap-tiny">
                  <span className="text-sm font-semibold text-fg-primary">
                    {linkedService?.title ?? meet.serviceCTA.label}
                  </span>
                  {linkedService?.notes?.trim() && (
                    <span className="text-xs text-fg-tertiary">
                      {linkedService.notes}
                    </span>
                  )}
                </span>
                <span className="flex items-center justify-between gap-xs">
                  <span className="text-sm font-semibold text-info-strong">
                    {meet.serviceCTA.price}
                  </span>
                  <CaretRight
                    size={16}
                    weight="bold"
                    className="text-info-strong shrink-0"
                  />
                </span>
              </span>
            </button>
          ) : (
            <div
              className="flex flex-col gap-sm rounded-panel p-md"
              style={{
                background: "var(--status-info-50, #f4f6ff)",
                border: "1px solid var(--status-info-200, #ccd6ff)",
              }}
            >
              {group?.providers && group.providers[0] && (
                <div className="flex items-center gap-sm">
                  {group.providers[0].avatarUrl && (
                    <img
                      src={group.providers[0].avatarUrl}
                      alt={group.providers[0].name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-semibold text-fg-primary">
                      {group.providers[0].name}
                      {group.providers.length > 1 && ` + ${group.providers.length - 1}`}
                    </span>
                    {/* Links to the provider's profile — their full service
                        catalogue. The group is already linked prominently
                        under the meet header, so re-linking it here was
                        redundant; "About this service" is provider context.
                        Service ↔ Meet Linkage walkthrough A3, 2026-05-16. */}
                    <Link
                      href={`/profile/${group.providers[0].userId}`}
                      className="text-xs text-fg-tertiary"
                      style={{ textDecoration: "none" }}
                    >
                      View profile →
                    </Link>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-sm">
                <div className="flex flex-col gap-xs flex-1 min-w-0">
                  {/* Name the service — the resolved linked-service title,
                      not the legacy `serviceCTA.label` (a CTA string).
                      Falls back to the label for legacy `serviceCTA`-only
                      meets with no resolvable linked service. */}
                  <span className="text-sm font-semibold text-fg-primary">
                    {linkedService?.title ?? meet.serviceCTA.label}
                  </span>
                  {(() => {
                    // One-off paid meet — "spots left" is meaningful here
                    // (there IS one date). Recurring meets render the
                    // tappable card above instead.
                    const showSpots = meet.serviceCTA.spotsLeft != null;
                    if (!meet.serviceCTA.price && !showSpots) return null;
                    return (
                      <span className="text-xs text-fg-tertiary">
                        {meet.serviceCTA.price}
                        {meet.serviceCTA.price && showSpots && " · "}
                        {showSpots && `${meet.serviceCTA.spotsLeft} spots left`}
                      </span>
                    );
                  })()}
                </div>
                {/* Inline Book CTA + Invite. Three states for the
                    right-hand button:
                    - Host (`isCreator`): disabled "Hosting" indicator.
                    - Already booked (`rsvpStatus === "going"`): disabled
                      "Booked" indicator.
                    - Otherwise: primary Book CTA. */}
                <div className="flex items-center gap-xs shrink-0">
                  <ButtonAction
                    variant="outline"
                    size="sm"
                    cta
                    leftIcon={<UserPlus size={14} weight="bold" />}
                    onClick={onShare}
                    disabled={spotsLeft === 0}
                  >
                    Invite
                  </ButtonAction>
                  {isCreator ? (
                    <ButtonAction
                      variant="outline"
                      size="sm"
                      cta
                      leftIcon={<FlagBanner size={14} weight="fill" />}
                      disabled
                    >
                      Hosting
                    </ButtonAction>
                  ) : rsvpStatus === "going" ? (
                    <ButtonAction
                      variant="secondary"
                      size="sm"
                      cta
                      leftIcon={<Check size={14} weight="bold" />}
                      disabled
                    >
                      Booked
                    </ButtonAction>
                  ) : (
                    <ButtonAction
                      variant="primary"
                      size="sm"
                      cta
                      onClick={() => onBook(meet.date)}
                    >
                      Book
                    </ButtonAction>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Upcoming dates (recurring only) ──
          Per-occurrence Going + Skip. Going commits you to that specific
          date; Skip explicitly marks "not this one" without changing your
          relationship to the series (the series-level Interested toggle in
          the top action row handles that). Skipped rows render muted in
          place with an inline Undo so the affordance is reversible.

          Skip persistence uses the shared `useDismissedReviews` hook with
          `kind: "meet-skip"` — same plumbing as Schedule history dismissals,
          different namespace. Surviving page reloads matters: a tester
          Skips a date, comes back later, the Skip should hold. */}
      {recurring && meet.status !== "cancelled" && occurrences.length > 0 && (
        <RecurringUpcomingDates
          meet={meet}
          occurrences={occurrences}
          rsvpByDate={rsvpByDate}
          onRsvpDateChange={onRsvpDateChange}
          isCreator={isCreator}
          onBook={onBook}
          dropoffByDate={dropoffByDate}
          onCancelOccurrence={onCancelOccurrence}
          onRestoreOccurrence={onRestoreOccurrence}
        />
      )}

      {/* ── Hosted by + group context (combined card) ──
          A7 (2026-04-25): organiser row now carries trust signals —
          meets-hosted count, neighbourhood, and connection state badge
          (for non-self viewers). "X meets hosted" is a concrete warmth
          signal for hesitant newcomers; connection state tells regulars
          at a glance whether this is a stranger or a known face. */}
      {(() => {
        const isSelf = meet.creatorId === currentUserId;
        const organiserProfile = isSelf ? currentUser : getUserById(meet.creatorId);
        const organiserConn = isSelf ? null : getConnState(meet.creatorId, currentUserId);
        const meetsHosted = mockMeets.filter((m) => m.creatorId === meet.creatorId).length;
        const organiserNeighbourhood = organiserProfile?.neighbourhood;

        const connLabel =
          organiserConn?.state === "connected" ? "Connected"
          : organiserConn?.state === "familiar" ? "Familiar"
          : organiserConn?.state === "pending" ? "Request sent"
          : null;

        return (
          <section className="meet-section">
            <h2 className="meet-section-title">Organised by</h2>
            <div className="meet-context-card">
              <Link
                href={isSelf ? "/profile" : `/profile/${meet.creatorId}`}
                className="meet-context-row"
                style={{ textDecoration: "none" }}
              >
                <img src={meet.creatorAvatarUrl} alt={meet.creatorName} className="meet-organiser-avatar" />
                <div className="flex flex-col flex-1 gap-xs">
                  <div className="flex items-center gap-xs flex-wrap">
                    <span className="text-sm font-semibold text-fg-primary">{meet.creatorName}</span>
                    {connLabel && (
                      <span
                        className="text-xs font-semibold rounded-pill px-xs"
                        style={{
                          background: "var(--brand-subtle)",
                          color: "var(--brand-strong)",
                          padding: "2px 8px",
                        }}
                      >
                        {connLabel}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-fg-tertiary">
                    {isSelf ? (
                      "That's you!"
                    ) : (
                      <>
                        Organiser
                        {organiserNeighbourhood && ` · ${organiserNeighbourhood}`}
                        {meetsHosted > 1 && ` · ${meetsHosted} meets hosted`}
                      </>
                    )}
                  </span>
                </div>
                <CaretRight size={16} weight="bold" className="text-fg-tertiary" />
              </Link>
              {/* The group row that used to live here was removed 2026-04-27 —
                  redundant with the parent-group eyebrow link near the title.
                  This section now focuses solely on host trust info. */}
        </div>
      </section>
        );
      })()}

      {/* ── Who's coming (summary card with avatar pile + trust signal) ──
          Visibility rules: tier 1/2 attendees lead the avatar stack and
          name-checks; tier 3 (Locked + None) is never surfaced by face or
          name. Dog names from the going list are used as the warmth signal
          when the viewer knows nobody yet. See Trust & Connection Model. */}
      <section className="meet-section">
        <div className="meet-section-header">
          <h2 className="meet-section-title">
            {meet.status === "completed" ? "Who came" : "Who's coming"}
          </h2>
          <Link
            href={`/meets/${meet.id}?tab=people`}
            className="text-xs font-medium text-brand-main"
            style={{ textDecoration: "none" }}
          >
            View all
          </Link>
        </div>

        <div className="meet-summary-card">
          {goingAttendees.length === 0 ? (
            <div className="meet-summary-row">
              <div className="meet-summary-meta">
                <span className="meet-summary-count">
                  {meet.status === "completed"
                    ? "No one made it — still counts as a walk"
                    : "No one's going yet"}
                </span>
                <span className="meet-summary-trust">
                  {meet.status !== "completed" &&
                    (interestedCount > 0
                      ? `${interestedCount} interested so far. Be the first to commit.`
                      : "Be the first to RSVP — someone has to start.")}
                </span>
              </div>
            </div>
          ) : (
            <div className="meet-summary-row">
              <div className="meet-summary-avatars">
                {(() => {
                  // Rank by tier (1→2→3), stable within tier; take the first 4.
                  const ranked = [...goingAttendees].sort(
                    (a, b) => getAttendeeTier(a, currentUserId) - getAttendeeTier(b, currentUserId)
                  );
                  // If we have ≥4 tier 1/2, never show a tier 3 face in the preview.
                  const safe = ranked.filter((a) => getAttendeeTier(a, currentUserId) <= 2);
                  const preview = safe.length >= 4 ? safe : ranked;
                  return preview.slice(0, 4).map((a) => {
                    // Dog-forward per meet-card anatomy — resolve the attendee's
                    // primary dog image; fall back to the owner avatar when the
                    // dog can't be resolved so the stack stays visually full.
                    const primaryDog = a.dogNames[0];
                    const dogImg = primaryDog
                      ? getDogImageByOwnerAndName(a.userId, primaryDog)
                      : undefined;
                    return (
                      <img
                        key={a.userId}
                        src={dogImg ?? a.avatarUrl}
                        alt={dogImg && primaryDog ? `${primaryDog} (${a.userName}'s dog)` : a.userName}
                        // Rule B: dogs render as rounded squares; owner-fallback
                        // stays a circle. Discover Refinement F sweep, 2026-05-10.
                        className={`meet-summary-avatar${dogImg ? " meet-summary-avatar--dog" : ""}`}
                      />
                    );
                  });
                })()}
              </div>
              <div className="meet-summary-meta">
                <span className="meet-summary-count">
                  {goingAttendees.length} {meet.status === "completed" ? "attended" : "going"}
                  {interestedCount > 0 && meet.status !== "completed"
                    ? ` · ${interestedCount} interested`
                    : ""}
                </span>
                <span className="meet-summary-trust">
                  {(() => {
                    // Exclude the viewer from the social-proof count — seeing
                    // "you're joining" as a trust signal is silly.
                    const knownOthers = knownAttendees.filter(
                      (a) => (a.rsvpStatus ?? "going") === "going"
                    );
                    const verb = meet.status === "completed" ? "came" : "joining";

                    // People-first copy when the viewer knows someone.
                    if (knownOthers.length === 1) {
                      return `${knownOthers[0].userName} ${verb === "joining" ? "is joining" : "came"}`;
                    }
                    if (knownOthers.length === 2) {
                      return `${knownOthers[0].userName} and ${knownOthers[1].userName} ${verb}`;
                    }
                    if (knownOthers.length === 3) {
                      return `${knownOthers[0].userName}, ${knownOthers[1].userName} and ${knownOthers[2].userName} ${verb}`;
                    }
                    if (knownOthers.length > 3) {
                      return `${knownOthers[0].userName} + ${knownOthers.length - 1} people you know ${verb}`;
                    }

                    // Dog-first fallback — pick the first two dog names
                    // from going attendees (tier 1/2 preferred, then tier 3).
                    const orderedForDogs = [...goingAttendees].sort(
                      (a, b) => getAttendeeTier(a, currentUserId) - getAttendeeTier(b, currentUserId)
                    );
                    const dogNames = orderedForDogs.flatMap((a) => a.dogNames);
                    if (dogNames.length === 0) {
                      // Rare edge — meet has attendees but no dogs listed. Framed
                      // as a warm first-time signal for Daniel-type newcomers.
                      return verb === "joining"
                        ? "You don't know anyone going yet — that's how most meets start."
                        : "No one you know came this time.";
                    }
                    if (totalDogs <= 2) {
                      return `${dogNames.join(" and ")} ${verb === "joining" ? "expected" : "came"}`;
                    }
                    const [first, second] = dogNames;
                    const more = totalDogs - 2;
                    return `${first}, ${second} + ${more} more dog${more !== 1 ? "s" : ""}`;
                  })()}
                </span>
              </div>
            </div>
          )}
        </div>

        {spotsLeft === 0 && meet.status === "upcoming" && (
          <div className="meet-spots-warning">
            <Lightning size={14} weight="fill" className="text-warning-main" />
            <span className="text-xs font-medium text-fg-primary">
              This meet is full
            </span>
          </div>
        )}
        {spotsLeft <= 3 && spotsLeft > 0 && (
          <div className="meet-spots-warning">
            <Lightning size={14} weight="fill" className="text-warning-main" />
            <span className="text-xs font-medium text-fg-primary">
              Only {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
            </span>
          </div>
        )}
      </section>

      {/* ── Type-specific details (with inline summary if available) ── */}
      {typeSummary && !hasMeetTypeDetails(meet) && (
        <section className="meet-section">
          <h2 className="meet-section-title">{MEET_TYPE_LABELS[meet.type]} details</h2>
          <div className="flex items-center gap-sm">
            {MEET_ICONS[meet.type]}
            <span className="text-sm text-fg-primary">{typeSummary}</span>
          </div>
        </section>
      )}
      <MeetTypeDetails meet={meet} />

      {/* ── Good to know (stat grid subcard) ──
          Audit (A6, 2026-04-25): show leash rule + energy (when set) + dog
          size (when filtered) as the top stat row; what-to-bring and
          accessibility are full-width rows below because they're prose.
          Max-attendees removed — already shown in the going/max count line
          on the summary card above. */}
      {(meet.energyLevel || meet.dogSizeFilter !== "any" || meet.whatToBring?.length || meet.accessibilityNotes) && (() => {
        // Count narrow (non-full-width) stat cells so the grid template can
        // size them evenly. With a fixed 3-col grid, two cells render as
        // 1/3 + 1/3 and leave a phantom third column making Energy look
        // weirdly wide. Switching to a 2-col grid for the 2-cell case makes
        // them an even 50/50. Bring/Accessibility full-width cells always
        // span all columns via `grid-column: 1 / -1` so they don't care.
        const narrowCount =
          1 +
          (meet.energyLevel && meet.energyLevel !== "any" ? 1 : 0) +
          (meet.dogSizeFilter && meet.dogSizeFilter !== "any" ? 1 : 0);
        const gridModifier = narrowCount === 2 ? "meet-stat-grid--2" : "meet-stat-grid--3";
        return (
        <section className="meet-section">
          <h2 className="meet-section-title">Good to know</h2>
          <div className={`meet-stat-grid ${gridModifier}`}>
            <StatCell icon={<PawPrint size={16} weight="light" />} label="Leash rule" value={LEASH_LABELS[meet.leashRule]} />
            {meet.energyLevel && meet.energyLevel !== "any" && (
              <StatCell icon={<Heartbeat size={16} weight="light" />} label="Energy" value={ENERGY_LABELS[meet.energyLevel]} />
            )}
            {meet.dogSizeFilter && meet.dogSizeFilter !== "any" && (
              <StatCell
                icon={<Dog size={16} weight="light" />}
                label="Dog size"
                value={`${meet.dogSizeFilter.charAt(0).toUpperCase()}${meet.dogSizeFilter.slice(1)} dogs only`}
              />
            )}
            {meet.whatToBring && meet.whatToBring.length > 0 && (
              <StatCell
                icon={<Backpack size={16} weight="light" />}
                label="Bring"
                value={meet.whatToBring.join(", ")}
                full
              />
            )}
            {meet.accessibilityNotes && (
              <StatCell
                icon={<ShieldCheck size={16} weight="light" />}
                label="Accessibility"
                value={meet.accessibilityNotes}
                full
              />
            )}
          </div>
        </section>
        );
      })()}

      {/* Service-offering section moved 2026-04-27 — was rendered here at
          the bottom (post-A8). Reasoning: for paid sessions, Book is the
          primary action. Burying it below content sections inverted the
          information hierarchy. The section now renders near the top
          (between the meet info and Upcoming dates / Hosted by sections).
          Recurring care meets render the section info-only (no Book CTA);
          per-occurrence Book buttons live on each Upcoming dates row.
          One-off care meets render the section with the Book CTA. See
          the new placement just above the meet-detail-content close. */}

      {/* ── Photos (completed meets) — Trust & Visibility C1 gate ──
       * Open group + public meet         → full gallery (already publicly browsable)
       * Open group + group_only meet     → 1 hero photo + "Join [Group] to see all" tease
       * Private/approval group           → no photos, no tease
       * Standalone (no group)            → attendees only
       * Attendees and members always see the full gallery regardless. */}
      {(() => {
        if (!meet.photos || meet.photos.length === 0) return null;
        const isAttendee = rsvpStatus !== "none";
        const isMember = group?.members.some((m) => m.userId === currentUserId) ?? false;
        const groupOpen = group?.visibility === "open";
        const photoGate: "full" | "tease" | "none" =
          isAttendee || isMember
            ? "full"
            : !group
              ? "none"
              : groupOpen && meet.visibility === "public"
                ? "full"
                : groupOpen && meet.visibility === "group_only"
                  ? "tease"
                  : "none";
        if (photoGate === "none") return null;
        if (photoGate === "full") {
          return (
            <section className="meet-section">
              <h2 className="meet-section-title">Photos</h2>
              <MeetPhotoGallery photos={meet.photos} />
            </section>
          );
        }
        // Tease: 1 hero photo + Join CTA. Renders an invitation, not a paywall.
        return (
          <section className="meet-section">
            <h2 className="meet-section-title">Photos</h2>
            <div className="flex flex-col gap-md">
              <div className="rounded-panel overflow-hidden bg-surface-inset">
                <img
                  src={meet.photos[0]}
                  alt=""
                  className="w-full h-auto block object-cover"
                  style={{ aspectRatio: "16 / 9" }}
                />
              </div>
              {group && (
                <Link
                  href={`/communities/${group.id}`}
                  className="text-sm text-fg-secondary text-center no-underline hover:underline"
                >
                  Join {group.name} to see all {meet.photos.length} photos
                </Link>
              )}
            </div>
          </section>
        );
      })()}

      {/* ── Share prompt for completed meets ── */}
      {meet.status === "completed" && rsvpStatus === "going" && !(meet.photos && meet.photos.length > 0) && (
        <div className="meet-share-photos-prompt">
          <Camera size={28} weight="light" className="text-fg-tertiary shrink-0" />
          <div className="flex flex-col gap-xs">
            <span className="text-sm font-semibold text-fg-primary">Share photos from this meet</span>
            <span className="text-xs text-fg-tertiary">Add your moments — attendees will see them here.</span>
          </div>
        </div>
      )}

      {/* Post-meet review CTA was here — dropped 2026-04-26. The detail page
          already supports adding photos and clicking through to attendees;
          the guided review walkthrough lives in History (Schedule tab) where
          its prompt earns its keep. Removing it from the detail page avoids
          the redundant entry point and the post-Skip weirdness. */}
      </div>{/* end .meet-detail-content */}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Recurring meets — Upcoming dates section
   ═══════════════════════════════════════════════════════════════ */

/**
 * Per-occurrence RSVP rows for recurring meets. Each row is independent —
 * the user can be Going to next Wednesday, Skip the one after, and ignore
 * the third without those decisions touching each other.
 *
 * Skip state is persisted via `useDismissedReviews` with the `"meet-skip"`
 * kind (separate namespace from review-recent dismissals). The row renders
 * muted in place with an inline Undo so the affordance stays reversible.
 *
 * Series-level subscription ("Interested in this series") is a separate
 * affordance in the top action row — see the parent DetailsTab.
 */
function RecurringUpcomingDates({
  meet,
  occurrences,
  rsvpByDate,
  onRsvpDateChange,
  isCreator,
  onBook,
  dropoffByDate,
  onCancelOccurrence,
  onRestoreOccurrence,
}: {
  meet: Meet;
  occurrences: ReturnType<typeof getMeetOccurrences>;
  rsvpByDate: Record<string, "none" | "going" | "interested">;
  onRsvpDateChange: (date: string, status: "none" | "going" | "interested") => void;
  isCreator: boolean;
  /**
   * Open the booking sheet for a specific date. Only invoked when the
   * meet has a `serviceCTA` (paid session); the per-row primary action
   * becomes Book instead of Join in that case.
   */
  onBook: (date: string) => void;
  /**
   * Config #2 — occurrence date → drop-off Care booking id, for dates the
   * viewer has booked a drop-off walk on. Those rows show "Drop-off booked"
   * (book ≠ attend) instead of the Join / Skip RSVP controls.
   */
  dropoffByDate: Record<string, string>;
  /**
   * Open the host-side cancel modal for a specific date. Host-only —
   * rendered as a quiet inline link in the row's right slot when
   * `isCreator`, alongside the Hosting pill. Confirmed cancellations
   * mutate `meet.cancelledDates` via the page's setter.
   */
  onCancelOccurrence: (date: string) => void;
  /** Host-side undo — clears the cancelled state for a specific date. */
  onRestoreOccurrence: (date: string) => void;
}) {
  const { dismissed, dismiss, undismiss } = useDismissedReviews();
  const skipId = (date: string) => makeDismissId("meet-skip", `${meet.id}::${date}`);

  // For paid (care-group) recurring meets, the per-row primary CTA is Book
  // instead of Join. Booking semantics also flip the supporting copy:
  // "going" → "booked", price renders in the row meta line, and the
  // committed-state pill reads "Booked" rather than "Joined". Skip is
  // preserved (a user might skip a week without booking it) and Hosting
  // stays unchanged.
  const isPaidSession = !!meet.serviceCTA;
  const goingVerb = isPaidSession ? "booked" : "going";
  const committedLabel = isPaidSession ? "Booked" : "Joined";
  const primaryLabel = isPaidSession ? "Book" : "Join";

  return (
    <section className="meet-section">
      <h2 className="meet-section-title">Upcoming dates</h2>
      <div
        className="rounded-panel border border-edge-regular bg-surface-top overflow-hidden"
      >
        {occurrences.map((occ) => {
          const date = formatShortDate(occ.date);
          const occGoing = occ.attendees.filter((a) => (a.rsvpStatus ?? "going") === "going").length;
          const occSpotsLeft = meet.maxAttendees - occGoing;
          const myStatus = rsvpByDate[occ.date] ?? "none";
          const isFull = occSpotsLeft <= 0 && myStatus !== "going";
          const skipped = dismissed.has(skipId(occ.date));
          const joined = myStatus === "going";
          // Config #2 — viewer booked a drop-off Care walk for this date.
          const dropoffBookingId = dropoffByDate[occ.date];
          const cancellation = getOccurrenceCancellation(meet, occ.date);
          const isCancelled = cancellation !== null;
          // Click handler for the primary action varies by mode. Paid
          // sessions open the booking sheet (terminal commitment, payment-
          // backed). Free sessions toggle the per-occurrence going status
          // directly — no confirmation step needed for an RSVP.
          const handlePrimary = isPaidSession
            ? () => onBook(occ.date)
            : () => onRsvpDateChange(occ.date, "going");

          // Cancelled rows: muted body, strikethrough title, reason caption,
          // single right-slot affordance (Cancelled pill for attendees,
          // Restore for the host). All other actions suppressed — there's
          // no Going/Booking a date the host has killed. Skip is also
          // suppressed; cancellation supersedes per-user opt-out.
          if (isCancelled) {
            return (
              <div
                key={occ.date}
                className="flex items-center justify-between gap-md p-md border-b border-edge-strong last:border-b-0 opacity-60"
              >
                <div className="flex flex-col gap-xs min-w-0">
                  <span className="text-sm font-semibold text-fg-primary line-through">
                    {date.weekday}, {date.day} {date.month}
                  </span>
                  <span className="text-xs text-fg-tertiary">
                    {meet.time}
                    {cancellation.reason ? <> · {cancellation.reason}</> : null}
                  </span>
                </div>
                <div className="flex items-center gap-xs shrink-0">
                  {isCreator ? (
                    <button
                      type="button"
                      className="text-xs font-semibold text-fg-primary underline underline-offset-2"
                      onClick={() => onRestoreOccurrence(occ.date)}
                    >
                      Restore
                    </button>
                  ) : (
                    <span
                      className="inline-flex items-center gap-xs text-xs font-semibold rounded-pill px-sm py-xs"
                      style={{
                        background: "var(--status-error-light)",
                        color: "var(--status-error-strong)",
                      }}
                    >
                      <X size={11} weight="bold" />
                      Cancelled
                    </span>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={occ.date}
              className={`flex items-center justify-between gap-md p-md border-b border-edge-strong last:border-b-0 ${skipped ? "opacity-60" : ""}`}
            >
              <div className="flex flex-col gap-xs min-w-0">
                <span
                  className={`text-sm font-semibold text-fg-primary ${skipped ? "line-through" : ""}`}
                >
                  {date.weekday}, {date.day} {date.month}
                </span>
                <span className="text-xs text-fg-tertiary">
                  {meet.time}
                  {isPaidSession && meet.serviceCTA?.price && (
                    <> · {meet.serviceCTA.price}</>
                  )}
                  {" · "}
                  {occGoing}/{meet.maxAttendees} {goingVerb}
                  {!skipped && occSpotsLeft > 0 && occSpotsLeft <= 5 && (
                    <> · {occSpotsLeft} spot{occSpotsLeft === 1 ? "" : "s"} left</>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-xs shrink-0">
                {isCreator ? (
                  // Hosting pill + a quiet inline Cancel for the host. Cancel
                  // is rendered as an underlined link rather than a button —
                  // the host doesn't need to be tempted to cancel; the
                  // affordance just needs to be reachable when they do.
                  <>
                    <span className="text-xs font-semibold rounded-pill px-sm py-xs bg-brand-subtle text-brand-strong">
                      Hosting
                    </span>
                    <button
                      type="button"
                      className="text-xs font-medium text-fg-tertiary underline underline-offset-2 hover:text-fg-secondary"
                      onClick={() => onCancelOccurrence(occ.date)}
                    >
                      Cancel
                    </button>
                  </>
                ) : dropoffBookingId ? (
                  // Config #2 — viewer booked a linked-care walk for this
                  // date. Book ≠ attend, so this is NOT a roster Join: the
                  // pill states the commitment and links to the Care
                  // booking. It supersedes Join / Skip — you can't both
                  // hand the dog off and walk it yourself on the same
                  // occurrence. "Walk booked" copy retired the previous
                  // "Drop-off booked" — see Walk Service Delivery Q6.
                  <Link
                    href={`/bookings/${dropoffBookingId}`}
                    className="inline-flex items-center gap-xs text-xs font-semibold rounded-pill px-sm py-xs"
                    style={{
                      background: "var(--status-info-light)",
                      color: "var(--status-info-strong)",
                      textDecoration: "none",
                    }}
                  >
                    <Check size={11} weight="bold" />
                    Walk booked
                  </Link>
                ) : skipped ? (
                  // Muted-in-place: replaces the action buttons with a label +
                  // inline Undo so the user can reverse a Skip without hunting.
                  <div className="flex items-center gap-sm">
                    <span className="text-xs font-medium text-fg-tertiary">Skipped</span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-fg-primary underline underline-offset-2"
                      onClick={() => undismiss(skipId(occ.date))}
                    >
                      Undo
                    </button>
                  </div>
                ) : joined ? (
                  // Once committed (Joined or Booked), Skip is hidden — the
                  // two states are mutually exclusive and showing both invites
                  // accidentally clearing the commitment. For free sessions
                  // the button toggles back to Join when clicked again. For
                  // paid sessions clicking Booked is a no-op (cancellation
                  // flow is heavier than a tap-toggle and lives elsewhere).
                  //
                  // Variant `secondary` (white bg, brand border, brand text)
                  // is the canonical active/committed treatment — `outline`
                  // would read as neutral until hover, which doesn't carry
                  // the "you've made a positive choice" signal a selected
                  // state needs.
                  <ButtonAction
                    variant="secondary"
                    size="sm"
                    cta
                    leftIcon={<Check size={14} weight="bold" />}
                    onClick={
                      isPaidSession ? undefined : () => onRsvpDateChange(occ.date, "none")
                    }
                    disabled={isPaidSession}
                  >
                    {committedLabel}
                  </ButtonAction>
                ) : (
                  <>
                    {/* Skip on the left (neutral, no chroma — it's a soft
                        decline, not a brand-loaded action). Primary CTA
                        on the right (Join for free meets, Book for paid).
                        Order matches the user's reading priority: the
                        affirmative action sits where the eye lands last. */}
                    <ButtonAction
                      variant="neutral"
                      size="sm"
                      cta
                      onClick={() => dismiss(skipId(occ.date))}
                    >
                      Skip
                    </ButtonAction>
                    <ButtonAction
                      variant="primary"
                      size="sm"
                      cta
                      disabled={isFull}
                      onClick={handlePrimary}
                    >
                      {isFull ? "Full" : primaryLabel}
                    </ButtonAction>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   People tab
   ═══════════════════════════════════════════════════════════════ */

function PeopleTab({ meet }: { meet: Meet }) {
  const recurring = isRecurring(meet);

  // For recurring meets, the People tab has lenses: "All" (series community —
  // union of past + upcoming attendees + series followers) plus a pill per
  // upcoming date for per-occurrence rosters. Default lens = first upcoming
  // date pill (most actionable: "who's coming next"). Past-only series with no
  // upcoming dates fall through to "all" as default.
  //
  // Per-date past drill-down is intentionally NOT provided — frequency / regular
  // treatment within the All view is filed as P34 (badges for frequent
  // attendees). The All lens already aggregates the regulars; "Past" as a
  // separate pill would be redundant.
  const upcomingDates = recurring ? nextOccurrenceDates(meet, 3) : [];
  const defaultLens: "all" | string = upcomingDates[0] ?? "all";
  const [lens, setLens] = useState<"all" | string>(defaultLens);

  // One-off meets: skip the pill row, render the single roster as today.
  if (!recurring) {
    return (
      <div className="meet-detail-content">
        <LayoutSection>
          <ParticipantList
            meet={meet}
            attendees={meet.attendees}
            isCompleted={meet.status === "completed"}
          />
        </LayoutSection>
      </div>
    );
  }

  // Recurring: resolve roster + followers based on selected lens.
  const isAllLens = lens === "all";
  const lensRoster = isAllLens
    ? getSeriesAttendees(meet)
    : getOccurrenceAttendees(meet, lens);
  const lensFollowers = isAllLens ? getSeriesFollowers(meet) : [];

  // Date-specific lens: treat as completed if the date is in the past
  // (drives "Who attended" vs "Who's going" heading). All lens uses a
  // series-aware heading.
  const isDateInPast = !isAllLens && new Date(lens) < new Date(new Date().toDateString());
  const heading = isAllLens ? "Series community" : undefined;

  const pills = [
    { key: "all", label: "All" },
    ...upcomingDates.map((date) => ({ key: date, label: formatMeetDate(date) })),
  ];

  // FilterPillRow sits OUTSIDE meet-detail-content so it's a direct sibling
  // of the tab wrapper — same structure as Schedule's sub-pill row under the
  // Meets/Care tabs. meet-detail-content's `padding-top: space-md` would
  // otherwise add 8px above the pill row that the Schedule pattern doesn't
  // have. The pill row has its own internal padding + bottom border.
  return (
    <>
      <FilterPillRow
        pills={pills}
        activeKey={lens}
        onChange={(key) => setLens(key)}
      />
      <div className="meet-detail-content">
        <LayoutSection>
          <ParticipantList
            meet={meet}
            attendees={lensRoster}
            followers={lensFollowers}
            isCompleted={isDateInPast}
            headingOverride={heading}
          />
        </LayoutSection>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Chat tab
   ═══════════════════════════════════════════════════════════════ */

function ChatTab({
  meet,
  messages,
  isJoined,
  newMessage,
  onNewMessageChange,
}: {
  meet: Meet;
  messages: MeetMessage[];
  isJoined: boolean;
  newMessage: string;
  onNewMessageChange: (val: string) => void;
}) {
  const currentUserId = useCurrentUserId();
  return (
    <div className="meet-chat-tab">
      <div className="meet-chat-scroll">
        {!isJoined ? (
          <LayoutSection>
            <EmptyState
              icon={<ChatCircleDots size={48} weight="light" />}
              title="RSVP to see the conversation"
              subtitle="Join this meet to chat with other attendees."
              action={
                <ButtonAction variant="primary" size="sm">
                  Join this meet
                </ButtonAction>
              }
            />
          </LayoutSection>
        ) : messages.length === 0 ? (
          <LayoutSection>
            <EmptyState
              icon={<ChatCircleDots size={48} weight="light" />}
              title="No messages yet"
              subtitle="Start the conversation — say hello or ask a question about the meet."
            />
          </LayoutSection>
        ) : (
          <div className="meet-chat-messages">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === currentUserId} />
            ))}
          </div>
        )}
      </div>
      {isJoined && (
        // Reuse the inbox compose styles so the meet chat input matches the
        // canonical chat input pattern app-wide. Single source of truth.
        <div className="inbox-thread-footer">
          <textarea
            className="inbox-compose-input"
            placeholder="Message…"
            rows={1}
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            aria-label="Message input"
          />
          <button
            className="inbox-compose-send"
            disabled={!newMessage.trim()}
            onClick={() => onNewMessageChange("")}
            aria-label="Send message"
          >
            <PaperPlaneRight size={20} weight="fill" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Type-specific detail sections
   ═══════════════════════════════════════════════════════════════ */

function StatCell({
  icon,
  label,
  value,
  full,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`meet-stat-cell${full ? " meet-stat-cell--full" : ""}`}>
      {icon}
      <div className="meet-stat-cell-text">
        <span className="meet-stat-cell-label">{label}</span>
        <span className="meet-stat-cell-value">{value}</span>
      </div>
    </div>
  );
}

function PillList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-xs">
      {items.map((item) => (
        <span key={item} className="meet-bring-pill">
          {item}
        </span>
      ))}
    </div>
  );
}

/** A5: short, static narrative per type — sets the scene before the stat grid.
 *  Copy echoes the creation-flow type descriptions so there's a mental rhyme
 *  between where a meet is posted and where attendees read about it. */
const TYPE_INTROS: Record<MeetType, string> = {
  walk: "A shared route through a park or neighbourhood — pace and terrain set by the host.",
  park_hangout: "Casual time at a local spot — dogs roam, owners chat, come and go.",
  playdate: "Supervised play matched to age and style — small group, curated energy.",
  training: "A focused practice block — skill work with a group that's all in.",
};

function MeetTypeDetails({ meet }: { meet: Meet }) {
  if (meet.type === "walk" && meet.walk) {
    const w = meet.walk;
    if (!(w.pace || w.distance || w.terrain || w.routeNotes)) return null;
    return (
      <section className="meet-section">
        <h2 className="meet-section-title">Walk details</h2>
        <p className="text-sm text-fg-secondary mb-sm mt-0">{TYPE_INTROS.walk}</p>
        <div className="meet-stat-grid meet-stat-grid--3">
          {w.pace && <StatCell icon={<PersonSimpleWalk size={16} weight="light" />} label="Pace" value={PACE_LABELS[w.pace]} />}
          {w.distance && <StatCell icon={<Ruler size={16} weight="light" />} label="Distance" value={DISTANCE_LABELS[w.distance]} />}
          {w.terrain && <StatCell icon={<Mountains size={16} weight="light" />} label="Terrain" value={TERRAIN_LABELS[w.terrain]} />}
          {w.routeNotes && (
            <StatCell icon={<Path size={16} weight="light" />} label="Route" value={w.routeNotes} full />
          )}
        </div>
      </section>
    );
  }

  if (meet.type === "park_hangout" && meet.parkHangout) {
    const p = meet.parkHangout;
    if (!(p.dropIn || p.amenities?.length || p.vibe)) return null;
    return (
      <section className="meet-section">
        <h2 className="meet-section-title">Hangout details</h2>
        <p className="text-sm text-fg-secondary mb-sm mt-0">{TYPE_INTROS.park_hangout}</p>
        <div className="meet-stat-grid meet-stat-grid--2">
          {p.dropIn && p.endTime && (
            <StatCell icon={<Clock size={16} weight="light" />} label="Drop-in" value={`${meet.time}–${p.endTime}`} />
          )}
          {p.vibe && (
            <StatCell icon={<FlagBanner size={16} weight="light" />} label="Vibe" value={VIBE_LABELS[p.vibe]} />
          )}
          {p.amenities && p.amenities.length > 0 && (
            <div className="meet-stat-cell meet-stat-cell--full">
              <Park size={16} weight="light" />
              <div className="meet-stat-cell-text">
                <span className="meet-stat-cell-label">Amenities</span>
                <div className="flex flex-wrap gap-xs mt-xs">
                  <PillList items={p.amenities.map((a) => AMENITY_LABELS[a])} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (meet.type === "playdate" && meet.playdate) {
    const pd = meet.playdate;
    if (!(pd.ageRange || pd.playStyle || pd.fencedArea !== undefined || pd.maxDogsPerPerson)) return null;
    return (
      <section className="meet-section">
        <h2 className="meet-section-title">Playdate details</h2>
        <p className="text-sm text-fg-secondary mb-sm mt-0">{TYPE_INTROS.playdate}</p>
        <div className="meet-stat-grid meet-stat-grid--2">
          {pd.ageRange && <StatCell icon={<Dog size={16} weight="light" />} label="Age range" value={AGE_RANGE_LABELS[pd.ageRange]} />}
          {pd.playStyle && <StatCell icon={<PawPrint size={16} weight="light" />} label="Play style" value={PLAY_STYLE_LABELS[pd.playStyle]} />}
          {pd.fencedArea !== undefined && (
            <StatCell icon={<Park size={16} weight="light" />} label="Fenced area" value={pd.fencedArea ? "Yes" : "No"} />
          )}
          {pd.maxDogsPerPerson && pd.maxDogsPerPerson > 0 && (
            <StatCell icon={<Users size={16} weight="light" />} label="Max per person" value={`${pd.maxDogsPerPerson} dog${pd.maxDogsPerPerson === 1 ? "" : "s"}`} />
          )}
        </div>
      </section>
    );
  }

  if (meet.type === "training" && meet.training) {
    const t = meet.training;
    if (!(t.skillFocus?.length || t.experienceLevel || t.ledBy || t.equipmentNeeded?.length)) return null;
    return (
      <section className="meet-section">
        <h2 className="meet-section-title">Training details</h2>
        <p className="text-sm text-fg-secondary mb-sm mt-0">{TYPE_INTROS.training}</p>
        <div className="meet-stat-grid meet-stat-grid--2">
          {t.experienceLevel && <StatCell icon={<GraduationCap size={16} weight="light" />} label="Level" value={EXPERIENCE_LABELS[t.experienceLevel]} />}
          {t.ledBy && (
            <StatCell
              icon={<Chalkboard size={16} weight="light" />}
              label="Led by"
              value={`${TRAINER_TYPE_LABELS[t.ledBy]}${t.ledBy === "professional" && t.trainerName ? ` — ${t.trainerName}` : ""}`}
            />
          )}
          {t.skillFocus && t.skillFocus.length > 0 && (
            <div className="meet-stat-cell meet-stat-cell--full">
              <Target size={16} weight="light" />
              <div className="meet-stat-cell-text">
                <span className="meet-stat-cell-label">Skills covered</span>
                <div className="flex flex-wrap gap-xs mt-xs">
                  <PillList items={t.skillFocus.map((s) => SKILL_LABELS[s])} />
                </div>
              </div>
            </div>
          )}
          {t.equipmentNeeded && t.equipmentNeeded.length > 0 && (
            <div className="meet-stat-cell meet-stat-cell--full">
              <Backpack size={16} weight="light" />
              <div className="meet-stat-cell-text">
                <span className="meet-stat-cell-label">Equipment needed</span>
                <div className="flex flex-wrap gap-xs mt-xs">
                  <PillList items={t.equipmentNeeded} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return null;
}
