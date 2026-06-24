"use client";

import { useEffect, useMemo, useState } from "react";
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
import { getUserMeetInstances } from "@/lib/mockMeets";
import { getMeetRole, isOccurrenceCancelled } from "@/lib/meetUtils";
import { useBookings } from "@/contexts/BookingsContext";
import { useReviews } from "@/contexts/ReviewsContext";
import { CareReviewSheet } from "@/components/bookings/CareReviewSheet";
import { useCurrentUserId, useOperatorShelterId } from "@/hooks/useCurrentUser";
import { getShelterById } from "@/lib/mockShelters";
import { ShelterScheduleView } from "@/components/shelters/ShelterScheduleView";
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
   Schedule = commitments only (Cross-Cutting Flow Testing IA refresh,
   2026-05-11). Two top-level tabs — Upcoming + History — with sub-pills
   on Upcoming filtering by item type (All / Meets / Care). The earlier
   Meets + Care tabs were dropped; the Interested concept moved to
   Discover Meets via the "Meets from your circle" elevated section
   (mirroring the Discover Care "Carers in your circle" pattern).
   Followed series + soft-Interested RSVPs surface there now, not here.
   See `strategy/Product Vision.md` → Schedule + Discover IA refresh. */
type ScheduleTab = "upcoming" | "history";
type UpcomingSubFilter = "all" | "meets" | "care";

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
      <ScheduleRouter />
    </Suspense>
  );
}

/** Operator mode (Phase 2): the shelter's Schedule replaces the consumer one
 *  (a shelter doesn't join meets or book care). Branches at the wrapper so the
 *  two surfaces are distinct components (no shared-hook-count issues). */
function ScheduleRouter() {
  const operatorShelterId = useOperatorShelterId();
  if (operatorShelterId) return <OperatorSchedule shelterId={operatorShelterId} />;
  return <ScheduleInner />;
}

function OperatorSchedule({ shelterId }: { shelterId: string }) {
  const shelter = getShelterById(shelterId);
  if (!shelter) return null;
  return (
    <PageColumn title="Schedule">
      <div className="page-column-panel-body">
        <ShelterScheduleView shelter={shelter} />
        <Spacer />
      </div>
    </PageColumn>
  );
}

function ScheduleInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openComposer: openMeetComposer } = useMeetComposer();
  const { dismissed } = useDismissedReviews();
  const CURRENT_USER = useCurrentUserId();

  // Tab + sub-pill state (URL-backed for the top tab; local for sub-pills).
  // Backwards-compat redirects: `view=meets` → upcoming/meets sub-pill;
  // `view=care` → upcoming/care sub-pill; `view=interested` → /discover/meets
  // (Interested-as-Schedule-concept retired 2026-05-11 — followers live on
  // Discover now). The redirect for interested fires inside an effect below.
  const rawView = searchParams.get("view");
  const tab: ScheduleTab = rawView === "history" ? "history" : "upcoming";
  const initialSub: UpcomingSubFilter =
    rawView === "meets" ? "meets" : rawView === "care" ? "care" : "all";
  const [upcomingSubFilter, setUpcomingSubFilter] = useState<UpcomingSubFilter>(initialSub);

  // Redirect legacy `?view=interested` URLs to the new home (Discover Meets).
  useEffect(() => {
    if (rawView === "interested") {
      router.replace("/discover/meets", { scroll: false });
    }
  }, [rawView, router]);

  // Per-occurrence instances (one entry per (meet, date) where the user
  // has an RSVP). Drives every meet-side surface on this page so the
  // Schedule actually reflects "what dates am I committed to" rather than
  // "what series do I belong to."
  const myInstances = getUserMeetInstances(CURRENT_USER);
  const { bookings } = useBookings();
  const { hasReview, addReview } = useReviews();
  // CareReviewSheet state — opened directly from a review-recent card so
  // the user doesn't have to bounce through the booking-detail page just
  // to leave a review. The booking-detail "Leave a review" CTA stays as
  // the alternative path for someone who's there for other reasons.
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
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
    const meetItems: ReviewItem[] = myInstances
      .filter((occ) =>
        // Filter out both series-level (`meet.status`) and per-occurrence
        // (`meet.cancelledDates[date]`) cancellations — neither is a
        // reviewable past meet.
        !isOccurrenceCancelled(occ.meet, occ.date) &&
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

    // Care-side: completed bookings owned by the viewer that haven't been
    // reviewed yet. Also surfaces ongoing bookings where at least one
    // session has been completed — the prompt nudges the owner to leave
    // a review even before the whole arrangement ends. Limited to
    // bookings where the viewer is the owner (carers don't review
    // themselves) and where the most-recent activity is within the same
    // 14-day window the meets use, for consistent recency framing.
    const sessionItems: ReviewItem[] = bookings
      .filter((b) => b.ownerId === CURRENT_USER)
      .filter((b) => {
        if (hasReview(b.id)) return false;
        if (b.status === "completed") return true;
        // Active/ongoing — only surface when a session was completed
        // recently (so reviews get prompted gradually rather than after
        // the booking ends, which may be never for an ongoing weekly).
        // Inclusive of today: a session sealed an hour ago is the
        // strongest moment to ask for a review; the `<=` here was a `<`
        // until Inbox & Notifications G1 (2026-05-08), which dropped
        // today's seals out of the review-recent section and left
        // Daniel's list empty after Klára finished Bára's training.
        const lastCompleted = (b.sessions ?? [])
          .filter((s) => s.status === "completed")
          .map((s) => s.date)
          .sort()
          .reverse()[0];
        return !!lastCompleted && lastCompleted >= recentCutoffIso && lastCompleted <= todayIso;
      })
      .map((b) => {
        const lastSessionDate = (b.sessions ?? [])
          .filter((s) => s.status === "completed")
          .map((s) => s.date)
          .sort()
          .reverse()[0];
        const sortKey = lastSessionDate ?? b.endDate ?? b.startDate;
        return { kind: "session" as const, booking: b, sortKey };
      });

    return [...meetItems, ...sessionItems];
  }, [myInstances, recentCutoffIso, todayIso, CURRENT_USER, bookings, hasReview]);

  // Pending count = recent items that haven't been dismissed. Drives the
  // History tab badge. Date is part of the dismiss key so dismissing one
  // occurrence doesn't dismiss every other occurrence of the same series.
  const pendingReviewCount = useMemo(() => {
    return recentReviewItems.filter((it) => {
      const id = it.kind === "meet"
        ? meetOccurrenceDismissId(it.meet.id, it.date)
        : makeDismissId("session", it.booking.id);
      return !dismissed.has(id);
    }).length;
  }, [recentReviewItems, dismissed]);

  // "Earlier" — past occurrences the user attended, beyond the review window
  // OR dismissed-recent that fell out of the top section. Grouped
  // chronologically, most recent first.
  const earlierMeets = useMemo<{ meet: Meet; role: MeetRole; date: string; sortKey: string }[]>(() => {
    return myInstances
      .filter((occ) => !isOccurrenceCancelled(occ.meet, occ.date) && occ.date < todayIso)
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
    if (tab === "history") {
      // History tab renders its own sections (review-recent + earlier);
      // the date-grouped list below is unused here.
      return [];
    }

    // Upcoming = confirmed occurrences (Going / Hosting) + active care
    // sessions, sorted chronologically. The `upcomingSubFilter` narrows
    // the result by item type:
    //   - "all"   → meets + care interleaved
    //   - "meets" → meets only
    //   - "care"  → care sessions only (both directions; getting/providing
    //               split removed during the 2026-05-11 IA refresh — single
    //               unified Care view; dual-role personas just see mixed)
    // Interested + followed-series are no longer surfaced here — they live
    // on Discover Meets' "Meets from your circle" elevated section.
    const includeMeets = upcomingSubFilter === "all" || upcomingSubFilter === "meets";
    const includeCare = upcomingSubFilter === "all" || upcomingSubFilter === "care";

    const meetItems: ScheduleItem[] = includeMeets
      ? upcomingInstances
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
      : [];

    const allActiveBookings = includeCare ? [...activeOwnerBookings, ...activeCarerBookings] : [];
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
  }, [tab, upcomingSubFilter, upcomingInstances, activeOwnerBookings, activeCarerBookings, todayIso, CURRENT_USER]);

  return (
    <PageColumn
      title="My Schedule"
      headerAction={
        // Header-action convention (2026-05-11): outline + sm + leftIcon +
        // text, no `cta`. See `design-system.md` → "Header actions."
        <ButtonAction
          variant="outline"
          size="sm"
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

        {/* Upcoming sub-pills — filter by item type (All / Meets / Care).
            Replaced the earlier Meets + Care top-level tabs during the
            2026-05-11 IA refresh. No sub-pills on History. */}
        {tab === "upcoming" && (
          <FilterPillRow
            pills={[
              { key: "all", label: "All" },
              { key: "meets", label: "Meets" },
              { key: "care", label: "Care" },
            ]}
            activeKey={upcomingSubFilter}
            onChange={(key) => setUpcomingSubFilter(key as UpcomingSubFilter)}
          />
        )}

        {/* History tab — review section on top, earlier chronicle below. */}
        {tab === "history" && (
          <>
            <ReviewRecentSection
              items={recentReviewItems}
              onReviewSession={(booking) => setReviewBooking(booking)}
            />

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
                      date={item.date}
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
                      date={item.date}
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
                title={emptyTitle(upcomingSubFilter)}
                subtitle={emptySubtitle(upcomingSubFilter)}
                action={
                  <ButtonAction
                    variant="primary"
                    size="sm"
                    href={upcomingSubFilter === "care" ? "/discover/care" : "/discover/meets"}
                  >
                    {upcomingSubFilter === "care" ? "Find Care" : "Browse meets"}
                  </ButtonAction>
                }
              />
            </LayoutSection>
          )
        )}

        <Spacer />
      </div>

      {/* Care review sheet — opened by a review-recent card's Review tap.
          Single instance at the page level; closes on submit / cancel. */}
      <CareReviewSheet
        open={!!reviewBooking}
        onClose={() => setReviewBooking(null)}
        carerName={reviewBooking?.carerName ?? ""}
        onSubmit={(payload) => {
          if (!reviewBooking) return;
          const ownerNameParts = reviewBooking.ownerName.split(" ");
          addReview({
            bookingId: reviewBooking.id,
            authorId: reviewBooking.ownerId,
            authorName:
              ownerNameParts.slice(0, 1).join(" ") +
              " " +
              (ownerNameParts[1]?.[0] ?? "") +
              ".",
            carerName: reviewBooking.carerName,
            carerAvatarUrl: reviewBooking.carerAvatarUrl,
            rating: payload.rating,
            text: payload.text,
            photoUrl: payload.photoUrl,
            wouldBookAgain: payload.wouldBookAgain,
            isPrivate: payload.isPrivate,
          });
          setReviewBooking(null);
        }}
      />
    </PageColumn>
  );
}

/* ── Empty-state copy helpers ── */

function emptyTitle(sub: UpcomingSubFilter): string {
  if (sub === "care") return "No care bookings yet.";
  if (sub === "meets") return "No meets coming up.";
  return "Nothing coming up yet.";
}

function emptySubtitle(sub: UpcomingSubFilter): string {
  if (sub === "care") return "Find care from people you trust.";
  if (sub === "meets") return "RSVP to a meet and it'll show up here.";
  return "Browse meets near you and RSVP.";
}
