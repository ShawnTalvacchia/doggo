"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CalendarDots,
  Briefcase,
  ArrowLeft,
} from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TabBar } from "@/components/ui/TabBar";
import { CardMeet, type MeetRole } from "@/components/meets/CardMeet";
import { MeetDetailPanel } from "@/components/meets/MeetDetailPanel";
import { SessionRow } from "@/components/schedule/SessionRow";
import { SessionDetailContent } from "@/components/schedule/SessionDetailContent";
import { MasterDetailShell } from "@/components/layout/MasterDetailShell";
import { PanelBody } from "@/components/layout/PanelBody";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutList } from "@/components/layout/LayoutList";
import { getUserMeets } from "@/lib/mockMeets";
import { getMeetRole } from "@/lib/meetUtils";
import { formatMeetDate } from "@/lib/dateUtils";
import { useBookings } from "@/contexts/BookingsContext";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import type { Meet, Booking, BookingSession } from "@/lib/types";

const CURRENT_USER = "shawn";

type ScheduleFilter = "upcoming" | "interested" | "care";

type Selection =
  | { type: "meet"; meetId: string }
  | { type: "session"; bookingId: string; sessionId: string }
  | null;

function getBookingNextDate(booking: Booking): string | null {
  if (booking.sessions) {
    const next = booking.sessions.find((s) => s.status === "upcoming");
    return next?.date ?? null;
  }
  return booking.startDate;
}


type ScheduleItem =
  | { kind: "meet"; meet: Meet; role: MeetRole; sortKey: string }
  | { kind: "session"; booking: Booking; session: BookingSession; sortKey: string }
  | { kind: "booking"; booking: Booking; perspective: "owner" | "carer"; sortKey: string };

// ── Booking block (used in Care tab for contract-level view) ──

function BookingBlock({
  booking,
  perspective,
}: {
  booking: Booking;
  perspective: "owner" | "carer";
}) {
  const other =
    perspective === "owner"
      ? { name: booking.carerName, avatarUrl: booking.carerAvatarUrl }
      : { name: booking.ownerName, avatarUrl: booking.ownerAvatarUrl };

  const nextDate = getBookingNextDate(booking);
  const nextDateLabel = nextDate ? formatMeetDate(nextDate) : null;

  return (
    <Link
      href="/bookings"
      className="card-booking-block"
      style={{ textDecoration: "none" }}
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
          {SERVICE_LABELS[booking.serviceType]}{" "}
          <span className="font-normal text-fg-secondary">with {other.name}</span>
        </span>
        {(nextDateLabel || booking.pets.length > 0) && (
          <span className="text-xs text-fg-tertiary truncate">
            {nextDateLabel && (
              <>
                {nextDateLabel}
                {booking.recurringSchedule && ` · ${booking.recurringSchedule.timeLabel}`}
              </>
            )}
            {booking.pets.length > 0 && ` · ${booking.pets.join(", ")}`}
          </span>
        )}
      </div>
      <StatusBadge status={booking.status} />
    </Link>
  );
}

// ── Main page ──

export default function SchedulePage() {
  const [filter, setFilter] = useState<ScheduleFilter>("upcoming");
  const [selection, setSelection] = useState<Selection>(null);

  const myMeets = getUserMeets(CURRENT_USER);
  const { bookings, updateSession } = useBookings();
  const upcomingMeets = myMeets.filter((m) => m.status === "upcoming");

  const activeOwnerBookings = bookings.filter(
    (b) => b.ownerId === CURRENT_USER && (b.status === "active" || b.status === "upcoming")
  );

  const TABS = [
    { key: "upcoming", label: "Upcoming" },
    { key: "interested", label: "Interested" },
    { key: "care", label: "Care" },
  ];

  const filteredItems = useMemo((): ScheduleItem[] => {
    if (filter === "care") {
      return activeOwnerBookings
        .map((b) => ({
          kind: "booking" as const,
          booking: b,
          perspective: "owner" as const,
          sortKey: getBookingNextDate(b) ?? b.startDate,
        }))
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    }

    if (filter === "interested") {
      return upcomingMeets
        .filter((m) => getMeetRole(m, CURRENT_USER) === "interested")
        .map((m) => ({
          kind: "meet" as const,
          meet: m,
          role: "interested" as MeetRole,
          sortKey: `${m.date}T${m.time}`,
        }))
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    }

    // Upcoming = confirmed meets + individual care sessions, sorted by date
    const meetItems: ScheduleItem[] = upcomingMeets
      .filter((m) => {
        const role = getMeetRole(m, CURRENT_USER);
        return role === "joining" || role === "hosting";
      })
      .map((m) => ({
        kind: "meet" as const,
        meet: m,
        role: getMeetRole(m, CURRENT_USER),
        sortKey: `${m.date}T${m.time}`,
      }));

    // Flatten booking sessions into individual schedule items
    const sessionItems: ScheduleItem[] = activeOwnerBookings.flatMap((b) => {
      if (!b.sessions) {
        // One-off booking without sessions — show as single session-like item
        return [{
          kind: "session" as const,
          booking: b,
          session: { id: `${b.id}-oneoff`, date: b.startDate, status: "upcoming" as const },
          sortKey: b.startDate,
        }];
      }
      return b.sessions
        .filter((s) => s.status === "upcoming" || s.status === "in_progress")
        .map((s) => ({
          kind: "session" as const,
          booking: b,
          session: s,
          sortKey: s.date + (b.recurringSchedule?.time ? `T${b.recurringSchedule.time}` : ""),
        }));
    });

    return [...meetItems, ...sessionItems].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [filter, upcomingMeets, activeOwnerBookings]);

  // Resolve selection to actual data
  const selectedMeet = selection?.type === "meet"
    ? myMeets.find((m) => m.id === selection.meetId) ?? null
    : null;

  const selectedSession = selection?.type === "session"
    ? (() => {
        const b = bookings.find((bk) => bk.id === selection.bookingId);
        if (!b) return null;
        const s = b.sessions?.find((ss) => ss.id === selection.sessionId)
          ?? (selection.sessionId.endsWith("-oneoff") ? { id: selection.sessionId, date: b.startDate, status: "upcoming" as const } : null);
        return s ? { booking: b, session: s } : null;
      })()
    : null;

  // Auto-select first item if nothing selected
  const autoSelectedMeet = !selection
    ? (() => {
        const first = filteredItems.find((item) => item.kind === "meet");
        return first?.kind === "meet" ? first.meet : null;
      })()
    : null;

  const autoSelectedSession = !selection && !autoSelectedMeet
    ? (() => {
        const first = filteredItems.find((item) => item.kind === "session");
        return first?.kind === "session" ? { booking: first.booking, session: first.session } : null;
      })()
    : null;

  const activeMeet = selectedMeet ?? autoSelectedMeet;
  const activeSession = selectedSession ?? autoSelectedSession;
  const hasSelection = activeMeet || activeSession;

  const mobileView = selection ? "detail" as const : "list" as const;

  const listContent = (
    <>
      {/* Timeline */}
      {filteredItems.length > 0 ? (
        <div className="flex flex-col">
          {filteredItems.map((item) => {
            if (item.kind === "meet") {
              const isActive = activeMeet?.id === item.meet.id;
              return (
                <div
                  key={item.meet.id}
                  onClick={() => setSelection({ type: "meet", meetId: item.meet.id })}
                  style={{ cursor: "pointer" }}
                >
                  <CardMeet meet={item.meet} variant="schedule" role={item.role} />
                </div>
              );
            }
            if (item.kind === "session") {
              const isActive = activeSession?.session.id === item.session.id;
              return (
                <SessionRow
                  key={`${item.booking.id}-${item.session.id}`}
                  booking={item.booking}
                  session={item.session}
                  isActive={isActive}
                  hideStatus={filter === "upcoming"}
                  onClick={() => setSelection({ type: "session", bookingId: item.booking.id, sessionId: item.session.id })}
                />
              );
            }
            return (
              <BookingBlock
                key={item.booking.id}
                booking={item.booking}
                perspective={item.perspective}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarDots size={48} weight="light" />}
          title={filter === "care" ? "No care bookings yet." : filter === "interested" ? "Nothing saved yet." : "Nothing coming up yet."}
          subtitle={filter === "care" ? "Find care from people you trust." : filter === "interested" ? "Meets you're interested in will show up here." : "Browse meets near you and RSVP."}
          action={
            <ButtonAction
              variant="primary"
              size="sm"
              href={filter === "care" ? "/discover/care" : "/discover/meets"}
            >
              {filter === "care" ? "Find Care" : "Browse meets"}
            </ButtonAction>
          }
        />
      )}
    </>
  );

  // ── Compose detail panel content ──
  const detailContent = activeMeet
    ? <MeetDetailPanel meet={activeMeet} currentUserId={CURRENT_USER} />
    : activeSession
    ? <SessionDetailContent booking={activeSession.booking} session={activeSession.session} onUpdateSession={updateSession} />
    : (
      <div
        className="flex flex-col items-center justify-center flex-1 gap-md"
        style={{ padding: "var(--space-xxxl)" }}
      >
        <CalendarDots size={48} weight="light" className="text-fg-tertiary" />
        <span className="text-md text-fg-tertiary">
          Select an item to see details
        </span>
      </div>
    );

  const detailTitle = activeMeet
    ? activeMeet.title
    : activeSession
    ? `${SERVICE_LABELS[activeSession.booking.serviceType]} · ${formatMeetDate(activeSession.session.date)}`
    : null;

  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const handleBack = useCallback(() => setSelection(null), []);

  useEffect(() => {
    if (selection && detailTitle) {
      setDetailHeader(detailTitle, handleBack);
    } else {
      clearDetailHeader();
    }
    return () => clearDetailHeader();
  }, [selection, detailTitle, setDetailHeader, clearDetailHeader, handleBack]);

  return (
    <div className="page-container schedule-page-shell">
      {/* TabBar — visible on collapsed/mobile, hidden on desktop */}
      <div className="panel-tabbar" data-view={mobileView}>
        <div className="panel-tabbar-list">
          <div className="panel-tabbar-title">My Schedule</div>
          <div className="panel-tabbar-tabs">
            <TabBar tabs={TABS} activeKey={filter} onChange={(key) => setFilter(key as ScheduleFilter)} />
          </div>
        </div>
        <div className="panel-tabbar-detail">
          <button type="button" className="panel-tabbar-back" onClick={() => setSelection(null)}>
            <ArrowLeft size={20} weight="light" />
          </button>
          <span className="panel-tabbar-detail-title">{detailTitle}</span>
        </div>
      </div>

      <MasterDetailShell
        mobileView={mobileView}
        listPanel={
          <div className="list-panel">
            <div className="list-panel-header panel-header-desktop">
              <h2 className="font-heading text-lg font-bold text-fg-primary m-0">My Schedule</h2>
            </div>
            <div className="list-panel-filters panel-header-desktop">
              <TabBar tabs={TABS} activeKey={filter} onChange={(key) => setFilter(key as ScheduleFilter)} />
            </div>
            <PanelBody>
              <LayoutList>
                {listContent}
              </LayoutList>
              <Spacer />
            </PanelBody>
          </div>
        }
        detailPanel={
          <div className="detail-panel">
            {detailTitle && (
              <div className="detail-panel-header">
                <span className="font-heading text-base font-semibold text-fg-primary">{detailTitle}</span>
              </div>
            )}
            <PanelBody>
              {detailContent}
              <Spacer />
            </PanelBody>
          </div>
        }
      />
    </div>
  );
}
