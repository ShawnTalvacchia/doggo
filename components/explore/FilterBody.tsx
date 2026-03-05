"use client";

import { useState, type CSSProperties } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { ExploreFilters, ServiceType } from "@/lib/types";

// ─── Constants ────────────────────────────────────────────────────────────────

export const RATE_MIN = 1;
export const RATE_MAX = 2500;

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
        <CaretDown size={16} weight="bold" className="accordion-caret" />
      </button>
      <div className={`left-accordion-body${open ? " open" : ""}`}>{children}</div>
    </div>
  );
}

// ─── FilterBody ───────────────────────────────────────────────────────────────

export type FilterBodyProps = {
  filters: ExploreFilters;
  onMinRateChange: (value: number) => void;
  onMaxRateChange: (value: number) => void;
  onTimeToggle: (value: "6-11" | "11-15" | "15-22") => void;
  /** Pass dual-thumb slider style from parent (desktop only). Omit for simple stacked sliders. */
  rangeRowStyle?: CSSProperties;
  dualSlider?: boolean;
};

export function FilterBody({
  filters,
  onMinRateChange,
  onMaxRateChange,
  onTimeToggle,
  rangeRowStyle,
  dualSlider = false,
}: FilterBodyProps) {
  const [visitMode, setVisitMode] = useState<"one_time" | "repeat">("one_time");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const service = filters.service;
  const isWalk = !service || service === "walk_checkin";
  const unit = rateUnit(service);

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
          <input className="input" placeholder="Select date range" readOnly />
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
            <input className="input" placeholder="Select start date" readOnly />
          </div>
        </>
      )}

      {/* ── Date range (Sitting & Boarding) ──────────────────────────────── */}
      {!isWalk && (
        <div className="left-field">
          <div className="label">Dates</div>
          <input className="input" placeholder="Select date range" readOnly />
        </div>
      )}

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
          <span>{filters.minRate} Kč</span>
          <span>{filters.maxRate} Kč</span>
        </div>
        {dualSlider ? (
          <div className="left-range-row left-range-row-dual" style={rangeRowStyle}>
            <input
              className="left-range-input left-range-input-min"
              type="range"
              min={RATE_MIN}
              max={RATE_MAX}
              step={50}
              value={filters.minRate}
              onChange={(e) => {
                const nextMin = Number(e.target.value) || RATE_MIN;
                onMinRateChange(Math.min(nextMin, filters.maxRate));
              }}
            />
            <input
              className="left-range-input left-range-input-max"
              type="range"
              min={RATE_MIN}
              max={RATE_MAX}
              step={50}
              value={filters.maxRate}
              onChange={(e) => {
                const nextMax = Number(e.target.value) || RATE_MAX;
                onMaxRateChange(Math.max(nextMax, filters.minRate));
              }}
            />
          </div>
        ) : (
          <div className="left-range-row">
            <input
              type="range"
              min={RATE_MIN}
              max={RATE_MAX}
              step={50}
              value={filters.minRate}
              onChange={(e) => onMinRateChange(Number(e.target.value) || RATE_MIN)}
            />
            <input
              type="range"
              min={RATE_MIN}
              max={RATE_MAX}
              step={50}
              value={filters.maxRate}
              onChange={(e) => onMaxRateChange(Number(e.target.value) || RATE_MAX)}
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
            value={filters.minRate}
            onChange={(e) => onMinRateChange(Number(e.target.value) || RATE_MIN)}
          />
        </div>
        <div className="left-field">
          <div className="label">Max. {unit}</div>
          <input
            className="input"
            type="number"
            value={filters.maxRate}
            onChange={(e) => onMaxRateChange(Number(e.target.value) || RATE_MAX)}
          />
        </div>
      </div>

      {/* ── Services accordion (all services) ───────────────────────────── */}
      <Accordion title="Services">
        {(isWalk
          ? WALK_SERVICES
          : service === "inhome_sitting"
            ? SITTING_SERVICES
            : BOARDING_SERVICES
        ).map((s) => (
          <label key={s} className="left-inline-check">
            <input type="checkbox" /> {s}
          </label>
        ))}
      </Accordion>

      {/* ── Boarding-only accordions ─────────────────────────────────────── */}
      {service === "boarding" && (
        <>
          <Accordion title="Home features">
            {BOARDING_HOME_FEATURES.map((f) => (
              <label key={f} className="left-inline-check">
                <input type="checkbox" /> {f}
              </label>
            ))}
          </Accordion>
          <Accordion title="Type of home">
            {BOARDING_HOME_TYPES.map((t) => (
              <label key={t} className="left-inline-check">
                <input type="checkbox" /> {t}
              </label>
            ))}
          </Accordion>
        </>
      )}
    </>
  );
}
