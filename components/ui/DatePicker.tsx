"use client";

import { useMemo, useState } from "react";
import { CalendarBlank } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "./ButtonAction";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DateRange = { start: string | null; end: string | null };

type DayState =
  | "empty"
  | "past"
  | "open"
  | "selected"
  | "range-start"
  | "range-middle"
  | "range-end";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** ISO date string YYYY-MM-DD (local time, no TZ shift) */
function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayIso(): string {
  return toIso(new Date());
}

/** Returns cells for a calendar month grid (Sun-start, 7 cols). Nulls = empty padding. */
function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(firstDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/** Generate N months starting from the given year/month */
function buildMonths(fromYear: number, fromMonth: number, count: number) {
  const months: { year: number; month: number }[] = [];
  for (let i = 0; i < count; i++) {
    const total = fromMonth + i;
    months.push({ year: fromYear + Math.floor(total / 12), month: total % 12 });
  }
  return months;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

/** Full label used only for aria-labels (better for screen readers) */
function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

/** Short label: "Mar 9" — optionally with year "Mar 9, 2026" */
function formatShortDate(iso: string, includeYear = false): string {
  const [y, m, d] = iso.split("-").map(Number);
  return includeYear ? `${MONTH_SHORT[m - 1]} ${d}, ${y}` : `${MONTH_SHORT[m - 1]} ${d}`;
}

/** Smart range label.
 *  Same year  → "Mar 9 – Mar 13, 2026"
 *  Cross-year → "Dec 28, 2026 – Jan 3, 2027"
 */
function formatRangeLabel(start: string, end: string | null): string {
  if (!end) return formatShortDate(start, true);
  const sy = Number(start.split("-")[0]);
  const ey = Number(end.split("-")[0]);
  if (sy === ey) {
    return `${formatShortDate(start)} – ${formatShortDate(end)}, ${sy}`;
  }
  return `${formatShortDate(start, true)} – ${formatShortDate(end, true)}`;
}

function getDayState(
  iso: string,
  nowIso: string,
  mode: "single" | "range",
  pending: string | null,
  range: DateRange,
): DayState {
  // "today" is rendered as a separate class alongside the state — see
  // Calendar render. Selection state takes precedence for an interactable
  // today cell. Previously the early `iso === nowIso` return swallowed any
  // selection styling on today's cell, so users couldn't see they'd
  // selected today. Discover & Care G3 fix 2026-05-04.
  if (iso < nowIso) return "past";

  if (mode === "single") {
    return iso === pending ? "selected" : "open";
  }

  // Range mode
  const { start, end } = range;

  if (start && end) {
    if (iso === start) return "range-start";
    if (iso === end) return "range-end";
    if (iso > start && iso < end) return "range-middle";
    return "open";
  }

  if (start && !end) {
    return iso === start ? "selected" : "open";
  }

  return "open";
}

// ─── Calendar grid ────────────────────────────────────────────────────────────

type CalendarProps = {
  mode: "single" | "range";
  pending: string | null; // single selection in progress
  range: DateRange;
  onDayClick: (iso: string) => void;
};

function Calendar({ mode, pending, range, onDayClick }: CalendarProps) {
  const now = todayIso();
  const today = new Date();
  const months = useMemo(
    () => buildMonths(today.getFullYear(), today.getMonth(), 12),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      {/* Sticky weekday header */}
      <div className="cal-week-header">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={i} className="cal-weekday">
            {label}
          </div>
        ))}
      </div>

      {/* Scrollable month blocks */}
      <div className="cal-body">
        {months.map(({ year, month }) => {
          const cells = buildMonthGrid(year, month);
          const weeks: (Date | null)[][] = [];
          for (let i = 0; i < cells.length; i += 7) {
            weeks.push(cells.slice(i, i + 7));
          }

          return (
            <div key={`${year}-${month}`} className="cal-month">
              <div className="cal-month-label">
                {MONTH_NAMES[month].toUpperCase()} {year}
              </div>
              {weeks.map((week, wi) => (
                <div key={wi} className="cal-week">
                  {week.map((date, di) => {
                    if (!date) {
                      return <div key={di} className="cal-day empty" />;
                    }
                    const iso = toIso(date);
                    const state = getDayState(iso, now, mode, pending, range);
                    const isToday = iso === now;
                    const isInteractable = state !== "past" && state !== "empty";

                    return (
                      <div
                        key={di}
                        className={`cal-day ${state}${isToday ? " today" : ""}`}
                        onClick={isInteractable ? () => onDayClick(iso) : undefined}
                        aria-label={formatDateLabel(iso)}
                        role={isInteractable ? "button" : undefined}
                        tabIndex={isInteractable ? 0 : undefined}
                        onKeyDown={
                          isInteractable ? (e) => e.key === "Enter" && onDayClick(iso) : undefined
                        }
                      >
                        <div className="cal-day-inner">{date.getDate()}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── DatePicker ───────────────────────────────────────────────────────────────

type SinglePickerProps = {
  mode: "single";
  value: string | null;
  onChange: (iso: string) => void;
};

type RangePickerProps = {
  mode: "range";
  value: DateRange;
  onChange: (range: DateRange) => void;
  /**
   * Minimum span required for a valid range, in days.
   * - `1` (default): single-day selection allowed — clicking the same day
   *   twice locks it in as a single-day range, and Apply works with just a
   *   start set (end auto-fills to start). Use for walks / sitting where
   *   a one-day booking is meaningful.
   * - `2`: multi-day strictly required (end must be > start). Use for
   *   overnight boarding where a single day doesn't make sense (a stay
   *   needs at least one night).
   */
  minRangeDays?: 1 | 2;
};

export type DatePickerProps = (SinglePickerProps | RangePickerProps) & {
  open: boolean;
  onClose: () => void;
  title?: string;
};

export function DatePicker(props: DatePickerProps) {
  const { open, onClose, title = "Select Date" } = props;

  // Local draft state — committed only on "Apply Date"
  const [draftSingle, setDraftSingle] = useState<string | null>(
    props.mode === "single" ? props.value : null,
  );
  const [draftRange, setDraftRange] = useState<DateRange>(() =>
    props.mode === "range"
      ? props.value && typeof props.value === "object" && "start" in props.value
        ? props.value
        : { start: null, end: null }
      : { start: null, end: null },
  );

  // Sync draft when picker opens
  const handleOpen = () => {
    if (props.mode === "single") setDraftSingle(props.value);
    else
      setDraftRange(
        props.value && typeof props.value === "object" && "start" in props.value
          ? props.value
          : { start: null, end: null },
      );
  };

  const minRangeDays = props.mode === "range" ? props.minRangeDays ?? 1 : 1;

  const handleDayClick = (iso: string) => {
    if (props.mode === "single") {
      // Tap same day = deselect. Lets the user clear without changing dates.
      setDraftSingle((prev) => (prev === iso ? null : iso));
    } else {
      const range = draftRange ?? { start: null, end: null };
      const { start, end } = range;
      if (!start) {
        // First tap — set start.
        setDraftRange({ start: iso, end: null });
      } else if (!end) {
        // Have start, no end yet.
        if (iso === start) {
          // Tap same day = deselect. (Apply already works on start-only
          // for minRangeDays=1, so no need to "lock as single-day" here.)
          setDraftRange({ start: null, end: null });
        } else if (iso > start) {
          // Extend to a range.
          setDraftRange({ start, end: iso });
        } else {
          // Earlier day = treat as new start.
          setDraftRange({ start: iso, end: null });
        }
      } else {
        // Full range already set — tap anywhere starts fresh.
        setDraftRange({ start: iso, end: null });
      }
    }
  };

  const handleApply = () => {
    if (props.mode === "single" && draftSingle) {
      props.onChange(draftSingle);
    } else if (props.mode === "range" && draftRange?.start) {
      // Range mode: commit on start+end normally; for minRangeDays=1,
      // also accept start-only (single-day, auto-fill end = start) so the
      // user can pick one day and apply without a second click.
      if (draftRange.end) {
        props.onChange(draftRange);
      } else if (minRangeDays === 1) {
        props.onChange({ start: draftRange.start, end: draftRange.start });
      }
    }
    onClose();
  };

  // Footer label
  const footerLabel = useMemo(() => {
    if (props.mode === "single") {
      return draftSingle ? formatShortDate(draftSingle, true) : "Select a start date";
    }
    const range = draftRange ?? { start: null, end: null };
    const { start, end } = range;
    if (start && end) return formatRangeLabel(start, end);
    if (start) return formatShortDate(start, true);
    return "Select dates";
  }, [props.mode, draftSingle, draftRange]);

  // Apply button enable rules:
  // - single mode: any picked date enables
  // - range mode, minRangeDays=1: start alone enables (Apply commits as
  //   single-day; tapping a second day extends to a range — both work)
  // - range mode, minRangeDays=2: both start AND end required (boarding —
  //   overnight needs ≥1 night)
  const canApply =
    props.mode === "single"
      ? !!draftSingle
      : minRangeDays === 1
        ? !!(draftRange ?? {}).start
        : !!((draftRange ?? {}).start && (draftRange ?? {}).end);

  return (
    <ModalSheet
      open={open}
      onClose={() => {
        handleOpen(); // reset draft on close without applying
        onClose();
      }}
      title={title}
      footer={
        <>
          <span className="modal-sheet-footer-label">{footerLabel}</span>
          <ButtonAction variant="primary" onClick={handleApply} disabled={!canApply}>
            Apply Date
          </ButtonAction>
        </>
      }
    >
      <Calendar
        mode={props.mode}
        pending={
          props.mode === "single" ? draftSingle : (draftRange ?? { start: null, end: null }).start
        }
        range={
          props.mode === "range"
            ? (draftRange ?? { start: null, end: null })
            : { start: null, end: null }
        }
        onDayClick={handleDayClick}
      />
    </ModalSheet>
  );
}

// ─── DateTrigger — the clickable "input" that opens the picker ────────────────

type DateTriggerProps = {
  label: string; // placeholder text
  value: string | null | DateRange;
  onClick: () => void;
};

function formatTriggerValue(value: string | null | DateRange): string | null {
  if (!value) return null;
  if (typeof value === "string") return formatShortDate(value, true);
  const { start, end } = value;
  if (start && end) return formatRangeLabel(start, end);
  if (start) return formatShortDate(start, true);
  return null;
}

export function DateTrigger({ label, value, onClick }: DateTriggerProps) {
  const display = formatTriggerValue(value);
  return (
    <button
      type="button"
      className={`date-trigger${display ? " has-value" : ""}`}
      onClick={onClick}
    >
      <span>{display ?? label}</span>
      <CalendarBlank size={16} />
    </button>
  );
}
