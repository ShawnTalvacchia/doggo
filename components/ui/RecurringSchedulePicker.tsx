"use client";

import type { DayOfWeek, RecurringSchedule } from "@/lib/types";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";

// ── Constants ──────────────────────────────────────────────────────────────────

// Sun-first ordering matches the Discover filter convention so the day-of-
// week affordance reads identically across surfaces. Labels are sliced to
// 2 letters at render time ("Sun" → "Su", etc.).
const DAYS: DayOfWeek[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIME_OPTIONS: { value: string; label: string }[] = [
  { value: "07:00", label: "7:00–8:00am" },
  { value: "08:00", label: "8:00–9:00am" },
  { value: "09:00", label: "9:00–10:00am" },
  { value: "10:00", label: "10:00–11:00am" },
  { value: "11:00", label: "11:00am–12:00pm" },
  { value: "12:00", label: "12:00–1:00pm" },
  { value: "13:00", label: "1:00–2:00pm" },
  { value: "14:00", label: "2:00–3:00pm" },
  { value: "15:00", label: "3:00–4:00pm" },
  { value: "16:00", label: "4:00–5:00pm" },
  { value: "17:00", label: "5:00–6:00pm" },
  { value: "18:00", label: "6:00–7:00pm" },
];

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  value: RecurringSchedule;
  onChange: (schedule: RecurringSchedule) => void;
}

/**
 * RecurringSchedulePicker — paired day + time picker for ongoing booking
 * inquiries. Days use the shared `MultiSelectSegmentBar` (same component
 * Discover's "For which days?" filter uses) so the affordance is identical
 * across surfaces. Time is a stacked label-above-select.
 *
 * G3 alignment 2026-05-04 — replaced bespoke `.rsp-day-chip` markup with
 * the shared segment bar, dropped horizontal Time row in favour of the
 * standard stacked label pattern.
 */
export function RecurringSchedulePicker({ value, onChange }: Props) {
  function toggleDay(day: DayOfWeek) {
    const next = value.days.includes(day)
      ? value.days.filter((d) => d !== day)
      : [...value.days, day];
    onChange({ ...value, days: next });
  }

  function handleTimeChange(time: string) {
    const found = TIME_OPTIONS.find((t) => t.value === time);
    const timeLabel = found ? found.label : time;
    onChange({ ...value, time, timeLabel });
  }

  return (
    <div className="rsp-root">
      {/* Days — same MultiSelectSegmentBar pattern as Discover. */}
      <div className="filter-field">
        <div className="label">For which days?</div>
        <MultiSelectSegmentBar
          ariaLabel="Repeat weekly days"
          options={DAYS.map((day) => ({ value: day, label: day.slice(0, 2) }))}
          selectedValues={value.days}
          onToggle={toggleDay}
          variant="filter"
        />
      </div>

      {/* Time — stacked label-above-select, matches the rest of the form. */}
      <div className="filter-field">
        <div className="label">Time</div>
        <select
          className="rsp-time-select"
          value={value.time}
          onChange={(e) => handleTimeChange(e.target.value)}
          aria-label="Time slot"
        >
          {TIME_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
