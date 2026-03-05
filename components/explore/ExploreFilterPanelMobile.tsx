"use client";

import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import { ExploreFilters, ServiceType } from "@/lib/types";
import { ButtonAction } from "@/components/ui/ButtonAction";

function serviceLabel(service: ServiceType | null) {
  if (service === "inhome_sitting") return "In-home sitting";
  if (service === "boarding") return "Boarding";
  return "Walks & Check-ins";
}

const timeOptions: Array<"6-11" | "11-15" | "15-22"> = ["6-11", "11-15", "15-22"];

type ExploreFilterPanelMobileProps = {
  open: boolean;
  onClose: () => void;
  filters: ExploreFilters;
  onServiceChange: (service: ExploreFilters["service"]) => void;
  onMinRateChange: (value: number) => void;
  onMaxRateChange: (value: number) => void;
  onTimeToggle: (value: "6-11" | "11-15" | "15-22") => void;
};

export function ExploreFilterPanelMobile({
  open,
  onClose,
  filters,
  onMinRateChange,
  onMaxRateChange,
  onTimeToggle,
}: ExploreFilterPanelMobileProps) {
  const [visitMode, setVisitMode] = useState<"one_time" | "repeat">("one_time");

  // Lock body scroll while panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`mobile-slide-panel${open ? " open" : ""}`}
      aria-modal={open}
      aria-hidden={!open}
    >
      {/* Header */}
      <div className="mobile-slide-header">
        <span className="mobile-slide-title">
          {serviceLabel(filters.service)}
          <span className="mobile-slide-title-sep"> • </span>
          Filters
        </span>
        <button className="mobile-slide-close" onClick={onClose} aria-label="Close filters">
          <X size={20} weight="bold" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="mobile-slide-body">
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
          <input className="input" placeholder="Your location" value={filters.address} readOnly />
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
                className={`left-time-pill${filters.times.includes(option) ? " active" : ""}`}
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
          <div className="left-range-row">
            <input
              type="range"
              min={1}
              max={2500}
              step={50}
              value={filters.minRate}
              onChange={(e) => onMinRateChange(Number(e.target.value) || 1)}
            />
            <input
              type="range"
              min={1}
              max={2500}
              step={50}
              value={filters.maxRate}
              onChange={(e) => onMaxRateChange(Number(e.target.value) || 2500)}
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
              onChange={(e) => onMinRateChange(Number(e.target.value) || 1)}
            />
          </div>
          <div className="left-field">
            <div className="label">Max. per visit</div>
            <input
              className="input"
              type="number"
              value={filters.maxRate}
              onChange={(e) => onMaxRateChange(Number(e.target.value) || 2500)}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mobile-slide-footer">
        <ButtonAction variant="primary" cta onClick={onClose}>
          View Results
        </ButtonAction>
      </div>
    </div>
  );
}
