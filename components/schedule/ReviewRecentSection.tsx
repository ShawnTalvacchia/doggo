"use client";

/**
 * ReviewRecentSection — the "Review recent meets" block on the Schedule
 * Upcoming tab. Cross-type: accepts mixed meet + care review items
 * sorted by recency. Sessions & Service Execution (2026-05-05) wired
 * the care-side branch — meets surface post-meet review prompts;
 * completed-but-unreviewed bookings surface care-review prompts.
 *
 * Mechanics:
 *  - "View N more" toggles a collapsed/expanded list (default collapsed,
 *    shows the most recent one)
 *  - Per-card × dismisses just that item (localStorage via
 *    `useDismissedReviews`)
 *  - Bulk "Dismiss all" clears every visible review item at once
 *  - Section hides itself entirely when nothing is left to review
 */

import { useMemo, useState } from "react";
import { CaretDown, CaretRight, CaretUp, X } from "@phosphor-icons/react";
import { ScheduleMeetCard } from "@/components/schedule/ScheduleCard";
import { useDismissedReviews, makeDismissId } from "@/lib/dismissedReviews";
import type { Booking, Meet } from "@/lib/types";
import type { MeetRole } from "@/components/meets/CardMeet";

/** A single reviewable item.
 *
 *  `date` (meet kind) is the specific occurrence date (ISO YYYY-MM-DD).
 *  For one-off meets it equals `meet.date`; for recurring meets it
 *  identifies which past occurrence is being reviewed. Used to scope
 *  dismissals so hiding one occurrence doesn't hide the rest of the
 *  series.
 *
 *  Session-kind items represent a completed booking (or completed
 *  session within an ongoing booking) the owner hasn't reviewed yet.
 *  Sessions & Service Execution, 2026-05-05. */
export type ReviewItem =
  | { kind: "meet"; meet: Meet; role: MeetRole; date: string; sortKey: string }
  | { kind: "session"; booking: Booking; sortKey: string };

export function ReviewRecentSection({
  items,
  onReviewSession,
}: {
  items: ReviewItem[];
  /** Called when the user taps Review on a session-kind card. Schedule
   *  owns the `<CareReviewSheet>` modal state — opening here saves the
   *  booking-detail navigation step. */
  onReviewSession?: (booking: Booking) => void;
}) {
  const { dismissed, dismiss, dismissMany } = useDismissedReviews();
  const [expanded, setExpanded] = useState(false);

  // Filter out anything the user has dismissed, then sort most-recent-first.
  const visible = useMemo(() => {
    return items
      .filter((it) => !dismissed.has(reviewItemDismissId(it)))
      .sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  }, [items, dismissed]);

  if (visible.length === 0) return null;

  const visibleSlice = expanded ? visible : visible.slice(0, 1);
  const remaining = visible.length - 1;

  // Section-header wording adapts to what's pending: meets only / care
  // only / mixed. Avoids "Review recent meets" appearing above a care
  // card.
  const hasMeet = visible.some((it) => it.kind === "meet");
  const hasSession = visible.some((it) => it.kind === "session");
  const headerLabel = hasMeet && hasSession
    ? "Review recent activity"
    : hasSession
    ? "Review your carer"
    : "Review recent meets";

  return (
    <div className="flex flex-col">
      <div className="sched-review-section-header">
        <span className="sched-date-group sched-date-group--inline">
          {headerLabel}
        </span>
        <button
          type="button"
          className="sched-review-dismiss-all"
          onClick={() => dismissMany(visible.map(reviewItemDismissId))}
        >
          Skip all
        </button>
      </div>

      {visibleSlice.map((item) => {
        if (item.kind === "meet") {
          return (
            <ScheduleMeetCard
              key={`recent-${item.meet.id}-${item.date}`}
              meet={item.meet}
              role={item.role}
              date={item.date}
              isRecent
              onDismiss={() => dismiss(reviewItemDismissId(item))}
            />
          );
        }
        if (item.kind === "session") {
          return (
            <SessionReviewCard
              key={`recent-session-${item.booking.id}`}
              booking={item.booking}
              onDismiss={() => dismiss(reviewItemDismissId(item))}
              onReview={onReviewSession}
            />
          );
        }
        return null;
      })}

      {remaining > 0 && (
        <button
          type="button"
          className="sched-recent-toggle"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <>
              <CaretUp size={14} weight="bold" />
              Show less
            </>
          ) : (
            <>
              <CaretDown size={14} weight="bold" />
              View {remaining} more
            </>
          )}
        </button>
      )}
    </div>
  );
}

/** Map a review item to its localStorage dismiss key. Centralised so the
 *  caller doesn't need to know the key shape. The meet-id-plus-date
 *  encoding scopes dismissals to a specific occurrence (recurring series
 *  produce multiple review items over time). Session items dismiss by
 *  booking id — a booking has at most one care review pending. */
function reviewItemDismissId(item: ReviewItem) {
  if (item.kind === "meet") return makeDismissId("meet", `${item.meet.id}::${item.date}`);
  if (item.kind === "session") return makeDismissId("session", item.booking.id);
  // exhaustive — TS will yell if a new kind is added without a case here
  const _exhaustive: never = item;
  throw new Error(`Unhandled review item kind: ${_exhaustive}`);
}

/** Care review prompt card — surfaced on Schedule when a completed
 *  booking has no review yet. Mirrors `ScheduleMeetCard` (`isRecent`):
 *  Skip + Review footer action bar; tap-anywhere-but-Skip = Review.
 *  Review opens `CareReviewSheet` directly (modal lives at the Schedule
 *  page level); the booking-detail "Leave a review" action is the
 *  alternative path for someone who navigated there for other reasons.
 *  Sessions & Service Execution, 2026-05-05; refactored 2026-05-07. */
function SessionReviewCard({
  booking,
  onDismiss,
  onReview,
}: {
  booking: Booking;
  onDismiss: () => void;
  onReview?: (booking: Booking) => void;
}) {
  function fireReview() {
    onReview?.(booking);
  }
  return (
    // role="button" + keyboard handler mirrors the meet card's <Link>
    // tap-anywhere affordance without nesting buttons (Skip lives inside
    // the footer as a real <button>).
    <div
      className="sched-card sched-card--care sched-card--recent"
      role="button"
      tabIndex={0}
      onClick={fireReview}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          fireReview();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <div className="sched-card-recent-body">
        <h3 className="sched-card-title">{booking.carerName}</h3>
        <div className="sched-card-meta sched-card-meta--review">
          <span>{booking.subService ?? "Care booking"}</span>
        </div>
        <p className="text-sm text-fg-secondary m-0 mt-xs">
          How was it? Your review helps the community know who to trust.
        </p>
      </div>
      <div className="sched-card-recent-footer">
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
        <span className="sched-card-recent-action sched-card-recent-action--primary">
          Review
          <CaretRight size={14} weight="bold" />
        </span>
      </div>
    </div>
  );
}
