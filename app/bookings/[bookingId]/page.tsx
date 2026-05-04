"use client";

import { useState, useEffect, useCallback } from "react";
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
  Play,
  NoteBlank,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CancelBookingModal } from "@/components/bookings/CancelBookingModal";
import { SigningModal } from "@/components/messaging/SigningModal";
import { useBookings } from "@/contexts/BookingsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { getUserById } from "@/lib/mockUsers";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { formatShortDate, formatDateRange } from "@/lib/dateUtils";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import type { Booking, BookingSession, ChatMessage } from "@/lib/types";

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

/* ── Session row ── */

function SessionRow({
  session,
  isLast,
  canAct,
  onUpdate,
  bookingId,
}: {
  session: BookingSession;
  isLast: boolean;
  canAct?: boolean;
  onUpdate?: (bookingId: string, sessionId: string, update: Partial<BookingSession>) => void;
  bookingId?: string;
}) {
  const [noteText, setNoteText] = useState(session.note ?? "");
  const [showNoteInput, setShowNoteInput] = useState(false);

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
            {formatShortDate(session.date)}
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
        {session.note && (
          <p className="text-sm text-fg-secondary m-0">{session.note}</p>
        )}

        {/* Provider actions */}
        {canAct && onUpdate && bookingId && (
          <div className="flex flex-wrap gap-xs" style={{ marginTop: "var(--space-xs)" }}>
            {session.status === "upcoming" && (
              <ButtonAction variant="primary" size="sm"
                leftIcon={<Play size={14} weight="fill" />}
                onClick={() => onUpdate(bookingId, session.id, {
                  status: "in_progress",
                  checkedInAt: new Date().toISOString(),
                })}>
                Start session
              </ButtonAction>
            )}
            {session.status === "in_progress" && (
              <ButtonAction variant="primary" size="sm"
                leftIcon={<CheckCircle size={14} weight="fill" />}
                onClick={() => onUpdate(bookingId, session.id, {
                  status: "completed",
                  note: noteText || undefined,
                })}>
                Complete
              </ButtonAction>
            )}
            {(session.status === "in_progress" || session.status === "completed") && !session.note && !showNoteInput && (
              <ButtonAction variant="outline" size="sm"
                leftIcon={<NoteBlank size={14} weight="light" />}
                onClick={() => setShowNoteInput(true)}>
                Add note
              </ButtonAction>
            )}
            {showNoteInput && (
              <div className="flex flex-col gap-xs w-full">
                <textarea
                  className="text-sm text-fg-primary bg-surface-inset rounded-sm border border-edge-regular resize-none"
                  style={{ padding: "var(--space-sm) var(--space-md)", minHeight: 56, fontFamily: "var(--font-body)" }}
                  placeholder="How did the session go?"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <ButtonAction variant="outline" size="sm"
                  onClick={() => {
                    onUpdate(bookingId, session.id, { note: noteText });
                    setShowNoteInput(false);
                  }}>
                  Save note
                </ButtonAction>
              </div>
            )}
          </div>
        )}
      </div>
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
    createBooking,
    getBookingByConversation,
  } = useBookings();
  const { conversations, updateProposalStatus, addMessage } = useConversations();
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const CURRENT_USER = useCurrentUserId();
  const [showCancel, setShowCancel] = useState(false);
  const [signingOpen, setSigningOpen] = useState(false);

  const activeTab = searchParams.get("tab") ?? "info";

  const handleTabChange = useCallback((key: string) => {
    router.replace(`/bookings/${params.bookingId}?tab=${key}`, { scroll: false });
  }, [router, params.bookingId]);

  const booking = bookings.find((b) => b.id === params.bookingId);
  const isOwner = booking?.ownerId === CURRENT_USER;
  const isProvider = booking?.carerId === CURRENT_USER;

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

    updateProposalStatus(conv.id, msgId, "accepted");

    const contractMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      sender: "owner",
      type: "contract",
      contract: {
        bookingId,
        serviceType: p.serviceType,
        subService: p.subService,
        carerName: conv.providerName,
        pets: p.pets,
        startDate: p.startDate,
      },
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(conv.id, contractMsg);

    setSigningOpen(false);
  }

  const petNames = booking.pets.join(" & ");
  const verb = getServiceVerb(booking);
  const serviceNoun = getServiceNoun(booking);
  const firstPetAvatar = booking.pets[0] ? getPetAvatarUrl(booking.ownerId, booking.pets[0]) : null;
  const sessions = booking.sessions ?? [];
  const upcomingSessions = sessions.filter((s) => s.status === "upcoming" || s.status === "in_progress");
  const pastSessions = sessions.filter((s) => s.status === "completed" || s.status === "cancelled");
  const completedSessions = sessions.filter((s) => s.status === "completed");

  // Header title carries relationship + service: "{otherFirstName} · {service}".
  // Same shape used for the mobile AppNav header above (in setDetailHeader).
  const headerTitle = `${other.name.split(" ")[0]} · ${booking.subService ?? SERVICE_LABELS[booking.serviceType]}`;

  // Next upcoming session for aggregate stats
  const nextSession = [...upcomingSessions].sort((a, b) => a.date.localeCompare(b.date))[0];

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
                  to the partner's profile (universal name/avatar pattern). */}
              <div className="flex items-center gap-md">
                <Link
                  href={profileHref}
                  className="flex items-center gap-md flex-1 min-w-0"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ position: "relative", width: 56, height: 44, flexShrink: 0 }}>
                    <img
                      src={other.avatarUrl}
                      alt={other.name}
                      className="rounded-full object-cover"
                      style={{ width: 44, height: 44, position: "absolute", left: 0, top: 0, border: "2px solid var(--surface-popout)", zIndex: 1 }}
                    />
                    {firstPetAvatar ? (
                      <img
                        src={firstPetAvatar}
                        alt={booking.pets[0]}
                        className="rounded-full object-cover"
                        style={{ width: 28, height: 28, position: "absolute", left: 28, bottom: 0, border: "2px solid var(--surface-popout)", zIndex: 2 }}
                      />
                    ) : (
                      <span
                        className="rounded-full flex items-center justify-center"
                        style={{ width: 28, height: 28, position: "absolute", left: 28, bottom: 0, border: "2px solid var(--surface-popout)", zIndex: 2, background: "var(--surface-inset)" }}
                      >
                        <PawPrint size={14} weight="fill" className="text-fg-tertiary" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-base font-semibold text-fg-primary">{other.name}</span>
                    <span className="text-sm text-fg-tertiary">
                      {isOwner
                        ? `${other.name} ${verb} ${petNames}`
                        : `${verb.charAt(0).toUpperCase() + verb.slice(1)} ${petNames} for ${other.name}`}
                    </span>
                  </div>
                </Link>
                <StatusBadge status={booking.status} />
              </div>

              {isProvider && (
                <span className="inline-flex items-center gap-xs self-start px-sm py-xs text-xs font-semibold rounded-pill"
                  style={{ background: "var(--status-info-main)", color: "white", marginTop: "calc(-1 * var(--space-sm))" }}>
                  <HandHeart size={12} weight="fill" />
                  You&apos;re providing
                </span>
              )}

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
                    <ButtonAction variant="secondary" size="md" cta className="flex-1"
                      leftIcon={<Star size={16} weight="light" />}>
                      Leave a review
                    </ButtonAction>
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
                    <div key={i} className="flex justify-between items-center">
                      <span className={`text-sm ${item.isModifier ? "text-fg-tertiary" : "text-fg-secondary"}`}>
                        {item.isModifier ? `+ ${item.label}` : item.label}
                      </span>
                      <span className="text-sm text-fg-primary font-medium">
                        {item.amount.toLocaleString()} Kč <span className="text-fg-tertiary font-normal">/ {item.unit}</span>
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
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center gap-md p-xl text-center">
                <CalendarDots size={32} weight="light" className="text-fg-tertiary" />
                <p className="text-fg-secondary m-0">No sessions yet.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-fg-tertiary">
                    {upcomingSessions.length > 0
                      ? `${upcomingSessions.length} upcoming · ${completedSessions.length} completed`
                      : `${completedSessions.length} completed`}
                  </span>
                </div>

                {/* Upcoming sessions */}
                {upcomingSessions.length > 0 && (
                  <>
                    <span className="text-xs font-semibold text-fg-tertiary uppercase tracking-wide">
                      Upcoming
                    </span>
                    <div className="flex flex-col rounded-panel border border-edge-regular overflow-hidden">
                      {[...upcomingSessions]
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .map((session, i) => (
                          <SessionRow
                            key={session.id}
                            session={session}
                            isLast={i === upcomingSessions.length - 1}
                            canAct={isProvider}
                            onUpdate={updateSession}
                            bookingId={booking.id}
                          />
                        ))}
                    </div>
                  </>
                )}

                {/* Past sessions */}
                {pastSessions.length > 0 && (
                  <>
                    <span className="text-xs font-semibold text-fg-tertiary uppercase tracking-wide">
                      Past
                    </span>
                    <div className="flex flex-col rounded-panel border border-edge-regular overflow-hidden">
                      {[...pastSessions]
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((session, i) => (
                          <SessionRow
                            key={session.id}
                            session={session}
                            isLast={i === pastSessions.length - 1}
                            canAct={isProvider}
                            onUpdate={updateSession}
                            bookingId={booking.id}
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
    </PageColumn>
  );
}
