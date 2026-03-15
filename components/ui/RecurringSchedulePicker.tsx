"use client";

import type { DayOfWeek, RecurringSchedule } from "@/lib/types";

// ── Constants ──────────────────────────────────────────────────────────────────

const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
      {/* Day chips */}
      <div className="rsp-days">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            className={`rsp-day-chip${value.days.includes(day) ? " active" : ""}`}
            onClick={() => toggleDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Time selector */}
      <div className="rsp-time-row">
        <span className="rsp-time-label">Time</span>
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
