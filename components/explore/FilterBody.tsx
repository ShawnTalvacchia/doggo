"use client";

import { useState, type CSSProperties } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { ExploreFilters, ServiceType } from "@/lib/types";
import { FILTER_RATE_MAX_KC, FILTER_RATE_MIN_KC, getExploreRateBounds } from "@/lib/pricing";
import { DatePicker, DateTrigger, type DateRange } from "@/components/ui/DatePicker";

// ─── Constants ────────────────────────────────────────────────────────────────

export const RATE_MIN = FILTER_RATE_MIN_KC;
export const RATE_MAX = FILTER_RATE_MAX_KC;

const TIME_OPTIONS: Array<"6-11" | "11-15" | "15-22"> = ["6-11", "11-15", "15-22"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const WALK_SERVICES = ["Drop-in visit", "Group walk", "Solo walk"];
const SITTING_SERVICES = [
  "Sitter home full-time",
  "Special feeding",
  "Medication",
  "Walking",
  "Walking +30 mins",
];
const BOARDING_SERVICES = ["Day care", "Overnight"];
const BOARDING_HOME_FEATURES = ["Fenced garden", "No other dogs", "No kids"];
const BOARDING_HOME_TYPES = ["House", "Apartment", "Farm"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rateUnit(service: ServiceType | null): string {
  return service === "inhome_sitting" || service === "boarding" ? "per night" : "per visit";
}

function addressPlaceholder(service: ServiceType | null): string {
  return service === "walk_checkin" ? "Pick up location" : "Your location";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="left-accordion">
      <button
        type="button"
        className={`left-accordion-btn${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        <CaretDown size={14} weight="regular" className="accordion-caret" />
      </button>
      <div className={`left-accordion-body${open ? " open" : ""}`}>{children}</div>
    </div>
  );
}

function AccordionOption({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      type="button"
      className={`left-accordion-option${checked ? " active" : ""}`}
      onClick={() => setChecked((v) => !v)}
      aria-pressed={checked}
    >
      <span className="left-accordion-option-label">{label}</span>
      <span className="left-accordion-option-check" aria-hidden>
        {checked ? <Check size={12} weight="bold" color="white" /> : null}
      </span>
    </button>
  );
}

// ─── FilterBody ───────────────────────────────────────────────────────────────

export type FilterBodyProps = {
  filters: ExploreFilters;
  onMinRateChange: (value: number) => void;
  onMaxRateChange: (value: number) => void;
  onTimeToggle: (value: "6-11" | "11-15" | "15-22") => void;
  onDateRangeChange: (range: DateRange) => void;
  onStartDateChange: (iso: string | null) => void;
  /** Pass dual-thumb slider style from parent (desktop only). Omit for simple stacked sliders. */
  rangeRowStyle?: CSSProperties;
  dualSlider?: boolean;
};

export function FilterBody({
  filters,
  onMinRateChange,
  onMaxRateChange,
  onTimeToggle,
  onDateRangeChange,
  onStartDateChange,
  rangeRowStyle,
  dualSlider = false,
}: FilterBodyProps) {
  const [visitMode, setVisitMode] = useState<"one_time" | "repeat">("one_time");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [datePickerOpen, setDatePickerOpen] = useState<"range" | "start" | null>(null);

  const service = filters.service;
  const isWalk = !service || service === "walk_checkin";
  const unit = rateUnit(service);
  const rateBounds = getExploreRateBounds(service);
  const minRateValue = Math.max(rateBounds.min, Math.min(filters.minRate, rateBounds.max));
  const maxRateValue = Math.max(minRateValue, Math.min(filters.maxRate, rateBounds.max));

  const toggleDay = (day: string) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  return (
    <>
      {/* ── Your Pets ────────────────────────────────────────────────────── */}
      <div className="left-field">
        <div className="label">Your Pets</div>
        <div className="left-pet-row">
          <label className="left-inline-check">
            <input type="checkbox" defaultChecked /> Spot
          </label>
          <label className="left-inline-check">
            <input type="checkbox" defaultChecked /> Goldie
          </label>
        </div>
      </div>

      {/* ── Address ──────────────────────────────────────────────────────── */}
      <div className="left-field">
        <div className="label">Address</div>
        <input
          className="input"
          placeholder={addressPlaceholder(service)}
          value={filters.address}
          readOnly
        />
      </div>

      {/* ── How often? (Walks only) ───────────────────────────────────────── */}
      {isWalk && (
        <div className="left-field">
          <div className="label">How often?</div>
          <div className="left-visit-row">
            <button
              type="button"
              className={`left-option-card${visitMode === "one_time" ? " active" : ""}`}
              onClick={() => setVisitMode("one_time")}
            >
              <strong>One Time</strong>
              <span>Daily visits for a short period</span>
            </button>
            <button
              type="button"
              className={`left-option-card${visitMode === "repeat" ? " active" : ""}`}
              onClick={() => setVisitMode("repeat")}
            >
              <strong>Repeat Weekly</strong>
              <span>Ongoing weekly schedule</span>
            </button>
          </div>
        </div>
      )}

      {/* ── One-time date range (Walks, One Time mode) ────────────────────── */}
      {isWalk && visitMode === "one_time" && (
        <div className="left-field">
          <div className="label">Dates you need visits</div>
          <DateTrigger
            label="Select date range"
            value={filters.dateRange}
            onClick={() => setDatePickerOpen("range")}
          />
        </div>
      )}

      {/* ── Day-of-week + start date (Walks, Repeat Weekly mode) ──────────── */}
      {isWalk && visitMode === "repeat" && (
        <>
          <div className="left-field">
            <div className="label">For which days?</div>
            <div className="left-dow-bar">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`left-dow-pill${selectedDays.includes(day) ? " active" : ""}`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div className="left-field">
            <div className="label">Start Date</div>
            <DateTrigger
              label="Select start date"
              value={filters.startDate}
              onClick={() => setDatePickerOpen("start")}
            />
          </div>
        </>
      )}

      {/* ── Date range (Sitting & Boarding) ──────────────────────────────── */}
      {!isWalk && (
        <div className="left-field">
          <div className="label">Dates</div>
          <DateTrigger
            label="Select date range"
            value={filters.dateRange}
            onClick={() => setDatePickerOpen("range")}
          />
        </div>
      )}

      {/* ── Date pickers (portal-rendered modals / bottom sheets) ─────────── */}
      <DatePicker
        mode="range"
        open={datePickerOpen === "range"}
        onClose={() => setDatePickerOpen(null)}
        value={filters.dateRange}
        onChange={(range) => {
          onDateRangeChange(range);
          setDatePickerOpen(null);
        }}
        title={isWalk ? "Dates you need visits" : "Dates"}
      />
      <DatePicker
        mode="single"
        open={datePickerOpen === "start"}
        onClose={() => setDatePickerOpen(null)}
        value={filters.startDate}
        onChange={(iso) => {
          onStartDateChange(iso);
          setDatePickerOpen(null);
        }}
        title="Start Date"
      />

      {/* ── Available times (Walks only) ─────────────────────────────────── */}
      {isWalk && (
        <div className="left-field">
          <div className="label">Available times</div>
          <div className="left-time-row">
            {TIME_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`left-time-pill${filters.times.includes(option) ? " active" : ""}`}
                onClick={() => onTimeToggle(option)}
              >
                {option === "6-11" ? "6am–11am" : option === "11-15" ? "11am–3pm" : "3pm–10pm"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Rate slider ──────────────────────────────────────────────────── */}
      <div className="left-field">
        <div className="label">Rate {unit}</div>
        <div className="left-range-labels">
          <span>{minRateValue} Kč</span>
          <span>{maxRateValue} Kč</span>
        </div>
        {dualSlider ? (
          <div className="left-range-row left-range-row-dual" style={rangeRowStyle}>
            <input
              className="left-range-input left-range-input-min"
              type="range"
              min={rateBounds.min}
              max={rateBounds.max}
              step={50}
              value={minRateValue}
              onChange={(e) => {
                const nextMin = Number(e.target.value) || rateBounds.min;
                onMinRateChange(Math.min(Math.max(nextMin, rateBounds.min), maxRateValue));
              }}
            />
            <input
              className="left-range-input left-range-input-max"
              type="range"
              min={rateBounds.min}
              max={rateBounds.max}
              step={50}
              value={maxRateValue}
              onChange={(e) => {
                const nextMax = Number(e.target.value) || rateBounds.max;
                onMaxRateChange(Math.max(Math.min(nextMax, rateBounds.max), minRateValue));
              }}
            />
          </div>
        ) : (
          <div className="left-range-row">
            <input
              type="range"
              min={rateBounds.min}
              max={rateBounds.max}
              step={50}
              value={minRateValue}
              onChange={(e) =>
                onMinRateChange(
                  Math.min(
                    Math.max(Number(e.target.value) || rateBounds.min, rateBounds.min),
                    maxRateValue,
                  ),
                )
              }
            />
            <input
              type="range"
              min={rateBounds.min}
              max={rateBounds.max}
              step={50}
              value={maxRateValue}
              onChange={(e) =>
                onMaxRateChange(
                  Math.max(
                    Math.min(Number(e.target.value) || rateBounds.max, rateBounds.max),
                    minRateValue,
                  ),
                )
              }
            />
          </div>
        )}
      </div>

      {/* ── Min / Max inputs ─────────────────────────────────────────────── */}
      <div className="left-minmax-row">
        <div className="left-field">
          <div className="label">Min. {unit}</div>
          <input
            className="input"
            type="number"
            min={rateBounds.min}
            max={rateBounds.max}
            value={minRateValue}
            onChange={(e) => {
              const nextMin = Number(e.target.value) || rateBounds.min;
              onMinRateChange(Math.min(Math.max(nextMin, rateBounds.min), maxRateValue));
            }}
          />
        </div>
        <div className="left-field">
          <div className="label">Max. {unit}</div>
          <input
            className="input"
            type="number"
            min={rateBounds.min}
            max={rateBounds.max}
            value={maxRateValue}
            onChange={(e) => {
              const nextMax = Number(e.target.value) || rateBounds.max;
              onMaxRateChange(Math.max(Math.min(nextMax, rateBounds.max), minRateValue));
            }}
          />
        </div>
      </div>

      <div className="left-accordion-stack">
        {/* ── Services accordion (all services) ───────────────────────────── */}
        <Accordion title="Services">
          {(isWalk
            ? WALK_SERVICES
            : service === "inhome_sitting"
              ? SITTING_SERVICES
              : BOARDING_SERVICES
          ).map((s) => (
            <AccordionOption
              key={s}
              label={s}
              defaultChecked={service === "inhome_sitting" && s === "Walking"}
            />
          ))}
        </Accordion>

        {/* ── Boarding-only accordions ─────────────────────────────────────── */}
        {service === "boarding" && (
          <>
            <Accordion title="Home features">
              {BOARDING_HOME_FEATURES.map((f) => (
                <AccordionOption key={f} label={f} />
              ))}
            </Accordion>
            <Accordion title="Type of home">
              {BOARDING_HOME_TYPES.map((t) => (
                <AccordionOption key={t} label={t} />
              ))}
            </Accordion>
          </>
        )}
      </div>
    </>
  );
}
