"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CalendarDots } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { EmptyState } from "@/components/ui/EmptyState";
import { TabBar } from "@/components/ui/TabBar";
import { PageColumn } from "@/components/layout/PageColumn";
import { ScheduleMeetCard, ScheduleCareCard, ScheduleBookingCard } from "@/components/schedule/ScheduleCard";
import { Spacer } from "@/components/layout/Spacer";
import { FilterPillRow } from "@/components/ui/FilterPillRow";
import { getUserMeets, mockMeets } from "@/lib/mockMeets";
import { getUserGroups } from "@/lib/mockGroups";
import { getMeetRole } from "@/lib/meetUtils";
import { useBookings } from "@/contexts/BookingsContext";
import type { Meet, Booking, BookingSession } from "@/lib/types";
import type { MeetRole } from "@/components/meets/CardMeet";

/* ── Date grouping helper ── */

function getDateKey(sortKey: string): string {
  // sortKey is "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM"
  return sortKey.slice(0, 10);
}

function formatDateHeader(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.getTime() === today.getTime()) return "Today";
  if (d.getTime() === tomorrow.getTime()) return "Tomorrow";

  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

const CURRENT_USER = "shawn";

type ScheduleFilter = "upcoming" | "interested" | "care";

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

/* ── Page (with Suspense for useSearchParams) ── */

export default function SchedulePage() {
  return (
    <Suspense>
      <ScheduleInner />
    </Suspense>
  );
}

function ScheduleInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = (searchParams.get("view") as ScheduleFilter) || "upcoming";
  const [careSubFilter, setCareSubFilter] = useState<"all" | "getting" | "providing">("all");

  const myMeets = getUserMeets(CURRENT_USER);
  const { bookings } = useBookings();
  const todayIso = new Date().toISOString().slice(0, 10);
  const upcomingMeets = myMeets.filter((m) => m.status === "upcoming" && m.date >= todayIso);

  const activeOwnerBookings = bookings.filter(
    (b) => b.ownerId === CURRENT_USER && (b.status === "active" || b.status === "upcoming")
  );
  const activeCarerBookings = bookings.filter(
    (b) => b.carerId === CURRENT_USER && (b.status === "active" || b.status === "upcoming")
  );

  const TABS = [
    { key: "upcoming", label: "Upcoming" },
    { key: "care", label: "Care" },
    { key: "interested", label: "Interested" },
  ];

  const handleFilterChange = (key: string) => {
    if (key === "upcoming") {
      router.replace("/schedule", { scroll: false });
    } else {
      router.replace(`/schedule?view=${key}`, { scroll: false });
    }
  };

  const filteredItems = useMemo((): ScheduleItem[] => {
    if (filter === "care") {
      const ownerItems = careSubFilter !== "providing" ? activeOwnerBookings.map((b) => ({
        kind: "booking" as const,
        booking: b,
        perspective: "owner" as const,
        sortKey: getBookingNextDate(b) ?? b.startDate,
      })) : [];
      const carerItems = careSubFilter !== "getting" ? activeCarerBookings.map((b) => ({
        kind: "booking" as const,
        booking: b,
        perspective: "carer" as const,
        sortKey: getBookingNextDate(b) ?? b.startDate,
      })) : [];
      return [...ownerItems, ...carerItems].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    }

    if (filter === "interested") {
      // 1. Explicitly interested meets
      const interestedItems = upcomingMeets
        .filter((m) => getMeetRole(m, CURRENT_USER) === "interested")
        .map((m) => ({
          kind: "meet" as const,
          meet: m,
          role: "interested" as MeetRole,
          sortKey: `${m.date}T${m.time}`,
        }));

      // 2. Auto-populated: upcoming meets from joined groups where user hasn't RSVP'd
      const myGroupIds = new Set(getUserGroups(CURRENT_USER).map((g) => g.id));
      const myMeetIds = new Set(myMeets.map((m) => m.id));
      const suggestedItems = mockMeets
        .filter((m) =>
          m.status === "upcoming" &&
          m.groupId &&
          myGroupIds.has(m.groupId) &&
          !myMeetIds.has(m.id)
        )
        .map((m) => ({
          kind: "meet" as const,
          meet: m,
          role: "interested" as MeetRole,
          sortKey: `${m.date}T${m.time}`,
        }));

      return [...interestedItems, ...suggestedItems].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
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

    const allActiveBookings = [...activeOwnerBookings, ...activeCarerBookings];
    const sessionItems: ScheduleItem[] = allActiveBookings.flatMap((b) => {
      if (!b.sessions) {
        return [{
          kind: "session" as const,
          booking: b,
          session: { id: `${b.id}-oneoff`, date: b.startDate, status: "upcoming" as const },
          sortKey: b.startDate,
        }];
      }
      return b.sessions
        .filter((s) => (s.status === "upcoming" || s.status === "in_progress") && s.date >= todayIso)
        .map((s) => ({
          kind: "session" as const,
          booking: b,
          session: s,
          sortKey: s.date + (b.recurringSchedule?.time ? `T${b.recurringSchedule.time}` : ""),
        }));
    });

    return [...meetItems, ...sessionItems].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [filter, careSubFilter, upcomingMeets, activeOwnerBookings, activeCarerBookings]);

  return (
    <PageColumn title="My Schedule">
      {/* ── Scrollable body (tabs sticky inside for glassmorphism) ── */}
      <div className="page-column-panel-body">
        <div className="page-column-panel-tabs">
          <TabBar tabs={TABS} activeKey={filter} onChange={handleFilterChange} />
        </div>
        {filter === "care" && (
          <FilterPillRow
            pills={[
              { key: "all", label: "All" },
              { key: "getting", label: "Getting Care" },
              { key: "providing", label: "Providing" },
            ]}
            activeKey={careSubFilter}
            onChange={(key) => setCareSubFilter(key as "all" | "getting" | "providing")}
          />
        )}
          {filteredItems.length > 0 ? (
            <div className="flex flex-col">
              {filteredItems.map((item, idx) => {
                const dateKey = getDateKey(item.sortKey);
                const prevDateKey = idx > 0 ? getDateKey(filteredItems[idx - 1].sortKey) : null;
                const showDateHeader = dateKey !== prevDateKey;

                const card =
                  item.kind === "meet" ? (
                    <ScheduleMeetCard
                      key={item.meet.id}
                      meet={item.meet}
                      role={item.role}
                    />
                  ) : item.kind === "session" ? (
                    <ScheduleCareCard
                      key={`${item.booking.id}-${item.session.id}`}
                      booking={item.booking}
                      session={item.session}
                    />
                  ) : (
                    <ScheduleBookingCard
                      key={item.booking.id}
                      booking={item.booking}
                      perspective={item.perspective}
                    />
                  );

                if (showDateHeader) {
                  return (
                    <div key={`group-${dateKey}`}>
                      <div className="sched-date-group">{formatDateHeader(dateKey)}</div>
                      {card}
                    </div>
                  );
                }
                return card;
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
          <Spacer />
      </div>
    </PageColumn>
  );
}
