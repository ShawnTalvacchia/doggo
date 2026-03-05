"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { PawPrint, PersonSimpleWalk, House, CaretDown } from "@phosphor-icons/react";
import { ExploreFilters, ServiceType } from "@/lib/types";

type ExploreFilterPanelDesktopProps = {
  filters: ExploreFilters;
  onServiceChange: (service: ServiceType) => void;
  onMinRateChange: (value: number) => void;
  onMaxRateChange: (value: number) => void;
  onTimeToggle: (value: "6-11" | "11-15" | "15-22") => void;
};

type PanelView = "service" | "filters";

const serviceOptions: {
  value: ServiceType;
  label: string;
  helper: string;
  CardIcon: typeof PersonSimpleWalk;
}[] = [
  {
    value: "walk_checkin",
    label: "Walks & Check-ins",
    helper: "Short visits at your home",
    CardIcon: PersonSimpleWalk,
  },
  {
    value: "inhome_sitting",
    label: "In-home Sitting",
    helper: "Overnight care at your home",
    CardIcon: House,
  },
  {
    value: "boarding",
    label: "Boarding",
    helper: "Your dog stays with a trusted host",
    CardIcon: PawPrint,
  },
];

const timeOptions: Array<"6-11" | "11-15" | "15-22"> = ["6-11", "11-15", "15-22"];
const RATE_MIN = 1;
const RATE_MAX = 2500;

function serviceLabel(service: ServiceType | null) {
  if (service === "inhome_sitting") return "In-home Sitting";
  if (service === "boarding") return "Boarding";
  return "Walks & Check-ins"; // walk_checkin default
}

function ServiceIcon({ service }: { service: ServiceType }) {
  if (service === "inhome_sitting") return <House size={16} weight="bold" />;
  if (service === "boarding") return <PawPrint size={16} weight="bold" />;
  return <PersonSimpleWalk size={16} weight="bold" />;
}

export function ExploreFilterPanelDesktop({
  filters,
  onServiceChange,
  onMinRateChange,
  onMaxRateChange,
  onTimeToggle,
}: ExploreFilterPanelDesktopProps) {
  const [panelView, setPanelView] = useState<PanelView>(filters.service ? "filters" : "service");
  const [visitMode, setVisitMode] = useState<"one_time" | "repeat">("one_time");

  useEffect(() => {
    if (!filters.service) {
      setPanelView("service");
    }
  }, [filters.service]);

  const selectedService = useMemo(() => filters.service || "walk_checkin", [filters.service]);
  const rangeRowStyle = useMemo(() => {
    const span = RATE_MAX - RATE_MIN;
    const minPct = ((filters.minRate - RATE_MIN) / span) * 100;
    const maxPct = ((filters.maxRate - RATE_MIN) / span) * 100;
    return {
      "--min-pct": `${Math.max(0, Math.min(100, minPct))}%`,
      "--max-pct": `${Math.max(0, Math.min(100, maxPct))}%`,
    } as CSSProperties;
  }, [filters.minRate, filters.maxRate]);

  return (
    <aside className="panel explore-left-panel" aria-label="Explore left panel">
      <div
        className={`left-panel-track ${panelView === "service" ? "show-service" : "show-filters"}`}
        role="region"
        aria-live="polite"
      >
        <section className="left-panel-page">
          <div className="panel-content">
            <h2
              className="left-panel-title"
              style={{ fontFamily: "var(--font-heading), sans-serif" }}
            >
              Choose how care is provided
            </h2>
            <div className="left-service-list">
              {serviceOptions.map((option) => (
                <button
                  key={option.value}
                  className="left-service-card"
                  onClick={() => {
                    onServiceChange(option.value);
                    setPanelView("filters");
                  }}
                >
                  <option.CardIcon size={20} weight="duotone" className="left-service-icon" />
                  <div className="left-service-copy">
                    <strong>{option.label}</strong>
                    <span>{option.helper}</span>
                  </div>
                  <span className="left-service-caret" aria-hidden>
                    ›
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="left-panel-page">
          <div className="panel-content">
            <button className="left-service-pill" onClick={() => setPanelView("service")}>
              <ServiceIcon service={selectedService} />
              <span>{serviceLabel(selectedService)}</span>
              <CaretDown size={14} weight="bold" />
            </button>

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

            <div className="left-field">
              <div className="label">Address</div>
              <input
                className="input"
                placeholder="Your location"
                value={filters.address}
                readOnly
              />
            </div>

            <div className="left-field">
              <div className="label">How often do you need visits?</div>
              <div className="left-visit-row">
                <button
                  className={`left-option-card ${visitMode === "one_time" ? "active" : ""}`}
                  onClick={() => setVisitMode("one_time")}
                >
                  <strong>One Time</strong>
                  <span>Daily visits for a short period</span>
                </button>
                <button
                  className={`left-option-card ${visitMode === "repeat" ? "active" : ""}`}
                  onClick={() => setVisitMode("repeat")}
                >
                  <strong>Repeat Weekly</strong>
                  <span>Ongoing weekly schedule</span>
                </button>
              </div>
            </div>

            <div className="left-field">
              <div className="label">Dates you need visits</div>
              <input className="input" placeholder="Select date range" readOnly />
            </div>

            <div className="left-field">
              <div className="label">Available times</div>
              <div className="left-time-row">
                {timeOptions.map((option) => (
                  <button
                    key={option}
                    className={`left-time-pill ${filters.times.includes(option) ? "active" : ""}`}
                    onClick={() => onTimeToggle(option)}
                  >
                    {option === "6-11" ? "6am-11am" : option === "11-15" ? "11am-3pm" : "3pm-10pm"}
                  </button>
                ))}
              </div>
            </div>

            <div className="left-field">
              <div className="label">Rate per visit</div>
              <div className="left-range-labels">
                <span>{filters.minRate} Kč</span>
                <span>{filters.maxRate} Kč</span>
              </div>
              <div className="left-range-row left-range-row-dual" style={rangeRowStyle}>
                <input
                  className="left-range-input left-range-input-min"
                  type="range"
                  min={RATE_MIN}
                  max={RATE_MAX}
                  step={50}
                  value={filters.minRate}
                  onChange={(event) => {
                    const nextMin = Number(event.target.value) || RATE_MIN;
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
                  onChange={(event) => {
                    const nextMax = Number(event.target.value) || RATE_MAX;
                    onMaxRateChange(Math.max(nextMax, filters.minRate));
                  }}
                />
              </div>
            </div>

            <div className="left-minmax-row">
              <div className="left-field">
                <div className="label">Min. per visit</div>
                <input
                  className="input"
                  type="number"
                  value={filters.minRate}
                  onChange={(event) => onMinRateChange(Number(event.target.value) || 1)}
                />
              </div>
              <div className="left-field">
                <div className="label">Max. per visit</div>
                <input
                  className="input"
                  type="number"
                  value={filters.maxRate}
                  onChange={(event) => onMaxRateChange(Number(event.target.value) || 2500)}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
