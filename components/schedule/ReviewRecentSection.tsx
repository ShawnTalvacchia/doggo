"use client";

/**
 * ReviewRecentSection — the "Review recent meets" block on the Schedule
 * Upcoming tab. Cross-type ready: accepts a mixed list of meet + care
 * review items sorted by recency. Today only meets render — care items
 * defer to Schedule & Bookings phase (see
 * `docs/phases/schedule-bookings-deep-pass.md`).
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
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { ScheduleMeetCard } from "@/components/schedule/ScheduleCard";
import { useDismissedReviews, makeDismissId } from "@/lib/dismissedReviews";
import type { Meet } from "@/lib/types";
import type { MeetRole } from "@/components/meets/CardMeet";

/** A single reviewable item — currently meet-only; session variant lives
 *  here as a placeholder for the Schedule & Bookings deep pass.
 *
 *  `date` is the specific occurrence date (ISO YYYY-MM-DD). For one-off
 *  meets it equals `meet.date`; for recurring meets it identifies which
 *  past occurrence is being reviewed. Used to scope dismissals so
 *  hiding one occurrence doesn't hide the rest of the series. */
export type ReviewItem =
  | { kind: "meet"; meet: Meet; role: MeetRole; date: string; sortKey: string };
// Future: | { kind: "session"; booking: Booking; session: BookingSession; sortKey: string };

export function ReviewRecentSection({ items }: { items: ReviewItem[] }) {
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

  return (
    <div className="flex flex-col">
      <div className="sched-review-section-header">
        <span className="sched-date-group sched-date-group--inline">
          Review recent meets
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
              isRecent
              onDismiss={() => dismiss(reviewItemDismissId(item))}
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
 *  caller doesn't need to know the key shape — useful when adding session
 *  items later. The meet-id-plus-date encoding scopes dismissals to a
 *  specific occurrence (recurring series produce multiple review items
 *  over time). */
function reviewItemDismissId(item: ReviewItem) {
  if (item.kind === "meet") return makeDismissId("meet", `${item.meet.id}::${item.date}`);
  // exhaustive — TS will yell if a new kind is added without a case here
  const _exhaustive: never = item.kind;
  throw new Error(`Unhandled review item kind: ${_exhaustive}`);
}
