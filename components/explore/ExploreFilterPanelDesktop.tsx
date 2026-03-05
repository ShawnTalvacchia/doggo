"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { PawPrint, PersonSimpleWalk, House, CaretDown } from "@phosphor-icons/react";
import { ExploreFilters, ServiceType } from "@/lib/types";
import { FilterBody, RATE_MIN, RATE_MAX } from "./FilterBody";

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

function serviceLabel(service: ServiceType | null) {
  if (service === "inhome_sitting") return "In-home Sitting";
  if (service === "boarding") return "Boarding";
  return "Walks & Check-ins";
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

  useEffect(() => {
    if (!filters.service) setPanelView("service");
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
        {/* ── Service chooser page ──────────────────────────────────────── */}
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
                  type="button"
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

        {/* ── Filters page ─────────────────────────────────────────────── */}
        <section className="left-panel-page">
          <div className="panel-content">
            {/* Service switcher pill */}
            <button
              type="button"
              className="left-service-pill"
              onClick={() => setPanelView("service")}
            >
              <ServiceIcon service={selectedService} />
              <span>{serviceLabel(selectedService)}</span>
              <CaretDown size={14} weight="bold" />
            </button>

            {/* Service-aware filter fields */}
            <FilterBody
              filters={filters}
              onMinRateChange={onMinRateChange}
              onMaxRateChange={onMaxRateChange}
              onTimeToggle={onTimeToggle}
              rangeRowStyle={rangeRowStyle}
              dualSlider
            />
          </div>
        </section>
      </div>
    </aside>
  );
}
