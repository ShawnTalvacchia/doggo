"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CalendarDots, Plus } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useMeetComposer } from "@/contexts/MeetComposerContext";
import { EmptyState } from "@/components/ui/EmptyState";
import { TabBar } from "@/components/ui/TabBar";
import { PageColumn } from "@/components/layout/PageColumn";
import { ScheduleMeetCard, ScheduleCareCard, ScheduleBookingCard } from "@/components/schedule/ScheduleCard";
import { ReviewRecentSection, type ReviewItem } from "@/components/schedule/ReviewRecentSection";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutSection } from "@/components/layout/LayoutSection";
import { FilterPillRow } from "@/components/ui/FilterPillRow";
import { getUserMeetInstances, getFollowedSeries, mockMeets } from "@/lib/mockMeets";
import { getUserGroups } from "@/lib/mockGroups";
import { getMeetRole, getMeetOccurrences, isMeetVisibleTo } from "@/lib/meetUtils";
import { useBookings } from "@/contexts/BookingsContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useDismissedReviews, makeDismissId } from "@/lib/dismissedReviews";
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

function formatPastDateHeader(dateStr: string): string {
  // For History → "Earlier" — show month/year so older items group sensibly
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

/* ── Tab + sub-pill model ──
   F1 + F7 restructure (2026-04-25): four top-level tabs, with sub-pills
   under Meets and Care. Upcoming is the streamlined cross-type committed
   view. Meets / Care are the typed deep-dives. History is the past
   surface — pending reviews + older chronicle. */
type ScheduleTab = "upcoming" | "meets" | "care" | "history";
type MeetsSubFilter = "going" | "interested";
type CareSubFilter = "all" | "getting" | "providing";

function getBookingNextDate(booking: Booking): string | null {
  if (booking.sessions) {
    const next = booking.sessions.find((s) => s.status === "upcoming");
    return next?.date ?? null;
  }
  return booking.startDate;
}

type ScheduleItem =
  | { kind: "meet"; meet: Meet; role: MeetRole; date: string; sortKey: string }
  | { kind: "session"; booking: Booking; session: BookingSession; sortKey: string }
  | { kind: "booking"; booking: Booking; perspective: "owner" | "carer"; sortKey: string };

/**
 * Encode an occurrence-aware dismiss ID. With the recurrence model, a meet
 * has multiple reviewable occurrences — dismissing one shouldn't dismiss
 * them all, so the date is part of the key.
 */
function meetOccurrenceDismissId(meetId: string, date: string) {
  return makeDismissId("meet", `${meetId}::${date}`);
}

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
  const { openComposer: openMeetComposer } = useMeetComposer();
  const { dismissed } = useDismissedReviews();
  const CURRENT_USER = useCurrentUserId();

  // Tab + sub-pill state (URL-backed for the top tab; local for sub-pills).
  // Old `view=interested` URLs land on Meets → Interested for backwards compat.
  const rawView = searchParams.get("view");
  const tab: ScheduleTab =
    rawView === "meets" || rawView === "care" || rawView === "history" ? rawView
    : rawView === "interested" ? "meets"
    : "upcoming";
  const [meetsSubFilter, setMeetsSubFilter] = useState<MeetsSubFilter>(
    rawView === "interested" ? "interested" : "going"
  );
  const [careSubFilter, setCareSubFilter] = useState<CareSubFilter>("all");

  // Per-occurrence instances (one entry per (meet, date) where the user
  // has an RSVP). Drives every meet-side surface on this page so the
  // Schedule actually reflects "what dates am I committed to" rather than
  // "what series do I belong to."
  const myInstances = getUserMeetInstances(CURRENT_USER);
  const { bookings } = useBookings();
  const todayIso = new Date().toISOString().slice(0, 10);
  // Cancelled meets DO appear in Upcoming — silently disappearing from
  // the schedule is worse than showing them with a clear cancelled
  // marker. Calendar apps universally render cancelled events with
  // strikethrough/muted styling rather than removing them; same
  // principle here. They fall off naturally when their date passes
  // (the `occ.date >= todayIso` filter handles that).
  const upcomingInstances = myInstances.filter(
    (occ) => occ.date >= todayIso,
  );

  // Recent past occurrences the user attended (last 14 days) — review-eligible.
  // Filtered by `occ.date < todayIso` (per-instance pastness) rather than
  // `meet.status === "completed"` (which is series-level and unreliable on
  // recurring meets — a long-running weekly series may carry a legacy
  // "completed" status while still having upcoming occurrences).
  const recentCutoffIso = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().slice(0, 10);
  })();
  const recentReviewItems = useMemo<ReviewItem[]>(() => {
    return myInstances
      .filter((occ) =>
        occ.meet.status !== "cancelled" &&
        occ.date >= recentCutoffIso &&
        occ.date < todayIso,
      )
      .filter((occ) => {
        const role = getMeetRole(occ.meet, CURRENT_USER, occ.date);
        return role === "joining" || role === "hosting";
      })
      .map((occ) => ({
        kind: "meet" as const,
        meet: occ.meet,
        role: getMeetRole(occ.meet, CURRENT_USER, occ.date),
        date: occ.date,
        sortKey: occ.date,
      }));
  }, [myInstances, recentCutoffIso, todayIso, CURRENT_USER]);

  // Pending count = recent items that haven't been dismissed. Drives the
  // History tab badge. Date is part of the dismiss key so dismissing one
  // occurrence doesn't dismiss every other occurrence of the same series.
  const pendingReviewCount = useMemo(() => {
    return recentReviewItems.filter(
      (it) => !dismissed.has(meetOccurrenceDismissId(it.meet.id, it.date)),
    ).length;
  }, [recentReviewItems, dismissed]);

  // "Earlier" — past occurrences the user attended, beyond the review window
  // OR dismissed-recent that fell out of the top section. Grouped
  // chronologically, most recent first.
  const earlierMeets = useMemo<{ meet: Meet; role: MeetRole; date: string; sortKey: string }[]>(() => {
    return myInstances
      .filter((occ) => occ.meet.status !== "cancelled" && occ.date < todayIso)
      .filter((occ) => {
        const role = getMeetRole(occ.meet, CURRENT_USER, occ.date);
        return role === "joining" || role === "hosting";
      })
      .filter((occ) => {
        // Excluded from "Earlier" only if it's still pending in the top section.
        const inRecentWindow = occ.date >= recentCutoffIso;
        const isPending =
          inRecentWindow &&
          !dismissed.has(meetOccurrenceDismissId(occ.meet.id, occ.date));
        return !isPending;
      })
      .map((occ) => ({
        meet: occ.meet,
        role: getMeetRole(occ.meet, CURRENT_USER, occ.date),
        date: occ.date,
        sortKey: occ.date,
      }))
      .sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  }, [myInstances, todayIso, recentCutoffIso, dismissed, CURRENT_USER]);

  const activeOwnerBookings = bookings.filter(
    (b) => b.ownerId === CURRENT_USER && (b.status === "active" || b.status === "upcoming")
  );
  const activeCarerBookings = bookings.filter(
    (b) => b.carerId === CURRENT_USER && (b.status === "active" || b.status === "upcoming")
  );

  const TABS = [
    { key: "upcoming", label: "Upcoming" },
    { key: "meets", label: "Meets" },
    { key: "care", label: "Care" },
    { key: "history", label: "History", badge: pendingReviewCount },
  ];

  const handleTabChange = (key: string) => {
    if (key === "upcoming") {
      router.replace("/schedule", { scroll: false });
    } else {
      router.replace(`/schedule?view=${key}`, { scroll: false });
    }
  };

  const filteredItems = useMemo((): ScheduleItem[] => {
    if (tab === "care") {
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

    if (tab === "meets") {
      if (meetsSubFilter === "interested") {
        // 1. Explicitly interested per-occurrence (instance-level "maybe").
        const interestedItems: ScheduleItem[] = upcomingInstances
          .filter((occ) => getMeetRole(occ.meet, CURRENT_USER, occ.date) === "interested")
          .map((occ) => ({
            kind: "meet" as const,
            meet: occ.meet,
            role: "interested" as MeetRole,
            date: occ.date,
            sortKey: `${occ.date}T${occ.meet.time}`,
          }));

        // 2. Followed series — series-level subscription. Surfaces here as
        // discovery aid alongside per-instance Interested. Render the next
        // upcoming occurrence so the date is realistic; conflated under the
        // "interested" role (the recurring pill differentiates a followed
        // series from a one-off Interested in the card chrome).
        const myInstanceMeetDateKeys = new Set(
          upcomingInstances.map((occ) => `${occ.meet.id}::${occ.date}`),
        );
        const followingItems: ScheduleItem[] = getFollowedSeries(CURRENT_USER)
          .flatMap((meet) => {
            const next = getMeetOccurrences(meet, 1)[0];
            if (!next) return [];
            // Don't double-list a series the user is already RSVP'd to on
            // its next occurrence — that would surface twice.
            if (myInstanceMeetDateKeys.has(`${meet.id}::${next.date}`)) return [];
            return [{
              kind: "meet" as const,
              meet,
              role: "interested" as MeetRole,
              date: next.date,
              sortKey: `${next.date}T${meet.time}`,
            }];
          });

        // 3. Auto-populated: upcoming meets from joined groups where the
        // user has no RSVP at all. Carried forward from the pre-recurrence
        // model — meet-level (not instance-level) since these are
        // not-yet-on-your-radar suggestions, and de-duped against any meet
        // the user already has an instance on.
        const myGroupIds = new Set(getUserGroups(CURRENT_USER).map((g) => g.id));
        const myMeetIds = new Set(upcomingInstances.map((occ) => occ.meet.id));
        const suggestedItems: ScheduleItem[] = mockMeets
          .filter((m) =>
            m.status === "upcoming" &&
            m.groupId &&
            myGroupIds.has(m.groupId) &&
            !myMeetIds.has(m.id) &&
            isMeetVisibleTo(m, CURRENT_USER),
          )
          .map((m) => {
            // For recurring meets, surface the next upcoming date; for one-off,
            // the meet's own date.
            const next = getMeetOccurrences(m, 1)[0];
            const date = next?.date ?? m.date;
            return {
              kind: "meet" as const,
              meet: m,
              role: "interested" as MeetRole,
              date,
              sortKey: `${date}T${m.time}`,
            };
          });

        return [...interestedItems, ...followingItems, ...suggestedItems]
          .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
      }

      // Going (default): occurrences where the user is joining or hosting.
      // One card per (meet, date) — the user goes to multiple weeks of the
      // same series, they see multiple cards.
      return upcomingInstances
        .filter((occ) => {
          const role = getMeetRole(occ.meet, CURRENT_USER, occ.date);
          return role === "joining" || role === "hosting";
        })
        .map((occ) => ({
          kind: "meet" as const,
          meet: occ.meet,
          role: getMeetRole(occ.meet, CURRENT_USER, occ.date),
          date: occ.date,
          sortKey: `${occ.date}T${occ.meet.time}`,
        }))
        .sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    }

    if (tab === "history") {
      // History tab renders its own sections (review-recent + earlier);
      // the date-grouped list below is unused here.
      return [];
    }

    // Upcoming = confirmed occurrences + individual care sessions, sorted by
    // date — the streamlined cross-type committed view. Per-instance like
    // Going, so a recurring weekly walk shows up as its own card per week.
    const meetItems: ScheduleItem[] = upcomingInstances
      .filter((occ) => {
        const role = getMeetRole(occ.meet, CURRENT_USER, occ.date);
        return role === "joining" || role === "hosting";
      })
      .map((occ) => ({
        kind: "meet" as const,
        meet: occ.meet,
        role: getMeetRole(occ.meet, CURRENT_USER, occ.date),
        date: occ.date,
        sortKey: `${occ.date}T${occ.meet.time}`,
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
  }, [tab, meetsSubFilter, careSubFilter, upcomingInstances, activeOwnerBookings, activeCarerBookings, todayIso, CURRENT_USER]);

  return (
    <PageColumn
      title="My Schedule"
      headerAction={
        <ButtonAction
          variant="primary"
          size="sm"
          cta
          leftIcon={<Plus size={14} weight="bold" />}
          onClick={() => openMeetComposer()}
        >
          Create
        </ButtonAction>
      }
    >
      {/* ── Scrollable body (tabs sticky inside for glassmorphism) ── */}
      <div className="page-column-panel-body">
        <div className="page-column-panel-tabs">
          <TabBar tabs={TABS} activeKey={tab} onChange={handleTabChange} />
        </div>

        {/* Sub-pill rows — Meets gets Going/Interested, Care gets All/Getting/Providing. */}
        {tab === "meets" && (
          <FilterPillRow
            pills={[
              { key: "going", label: "Going" },
              { key: "interested", label: "Interested" },
            ]}
            activeKey={meetsSubFilter}
            onChange={(key) => setMeetsSubFilter(key as MeetsSubFilter)}
          />
        )}
        {tab === "care" && (
          <FilterPillRow
            pills={[
              { key: "all", label: "All" },
              { key: "getting", label: "Getting Care" },
              { key: "providing", label: "Providing" },
            ]}
            activeKey={careSubFilter}
            onChange={(key) => setCareSubFilter(key as CareSubFilter)}
          />
        )}

        {/* History tab — review section on top, earlier chronicle below. */}
        {tab === "history" && (
          <>
            <ReviewRecentSection items={recentReviewItems} />

            {earlierMeets.length > 0 ? (
              <div className="flex flex-col">
                {earlierMeets.map((item, idx) => {
                  const dateKey = getDateKey(item.sortKey);
                  const prevDateKey = idx > 0 ? getDateKey(earlierMeets[idx - 1].sortKey) : null;
                  // Show a date header on the first item AND whenever the
                  // date changes between siblings. No "Earlier" category
                  // header — History tab + muted card styling already
                  // establish the chronicle frame.
                  const showDateHeader = idx === 0 || dateKey !== prevDateKey;

                  const card = (
                    <ScheduleMeetCard
                      key={`${item.meet.id}-${item.date}`}
                      meet={item.meet}
                      role={item.role}
                      isPast
                    />
                  );

                  if (showDateHeader) {
                    return (
                      <div key={`group-${dateKey}`}>
                        <div className="sched-date-group">{formatPastDateHeader(dateKey)}</div>
                        {card}
                      </div>
                    );
                  }
                  return card;
                })}
              </div>
            ) : pendingReviewCount === 0 ? (
              <LayoutSection>
                <EmptyState
                  icon={<CalendarDots size={48} weight="light" />}
                  title="No history yet."
                  subtitle="Past meets and care sessions will show up here."
                />
              </LayoutSection>
            ) : null}
          </>
        )}

        {/* Date-grouped list — Upcoming / Meets / Care tabs only. */}
        {tab !== "history" && (
          filteredItems.length > 0 ? (
            <div className="flex flex-col">
              {filteredItems.map((item, idx) => {
                const dateKey = getDateKey(item.sortKey);
                const prevDateKey = idx > 0 ? getDateKey(filteredItems[idx - 1].sortKey) : null;
                const showDateHeader = dateKey !== prevDateKey;

                const card =
                  item.kind === "meet" ? (
                    <ScheduleMeetCard
                      key={`${item.meet.id}-${item.date}`}
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
            <LayoutSection>
              <EmptyState
                icon={<CalendarDots size={48} weight="light" />}
                title={emptyTitle(tab, meetsSubFilter)}
                subtitle={emptySubtitle(tab, meetsSubFilter)}
                action={
                  <ButtonAction
                    variant="primary"
                    size="sm"
                    href={tab === "care" ? "/discover/care" : "/discover/meets"}
                  >
                    {tab === "care" ? "Find Care" : "Browse meets"}
                  </ButtonAction>
                }
              />
            </LayoutSection>
          )
        )}

        <Spacer />
      </div>
    </PageColumn>
  );
}

/* ── Empty-state copy helpers ── */

function emptyTitle(tab: ScheduleTab, meetsSub: MeetsSubFilter): string {
  if (tab === "care") return "No care bookings yet.";
  if (tab === "meets") return meetsSub === "interested" ? "Nothing saved yet." : "No meets coming up.";
  return "Nothing coming up yet.";
}

function emptySubtitle(tab: ScheduleTab, meetsSub: MeetsSubFilter): string {
  if (tab === "care") return "Find care from people you trust.";
  if (tab === "meets") return meetsSub === "interested" ? "Meets you're interested in will show up here." : "RSVP to a meet and it'll show up here.";
  return "Browse meets near you and RSVP.";
}
