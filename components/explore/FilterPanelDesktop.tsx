"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { PawPrint, PersonSimpleWalk, House, CaretLeft } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { ExploreFilters, ServiceType } from "@/lib/types";
import { getExploreRateBounds } from "@/lib/pricing";
import { FilterBody } from "./FilterBody";
import { FilterPanelShell } from "./FilterPanelShell";
import { type DateRange } from "@/components/ui/DatePicker";

type FilterPanelDesktopProps = {
  filters: ExploreFilters;
  onServiceChange: (service: ServiceType) => void;
  onMinRateChange: (value: number) => void;
  onMaxRateChange: (value: number) => void;
  onTimeToggle: (value: "6-11" | "11-15" | "15-22") => void;
  onDateRangeChange: (range: DateRange) => void;
  onStartDateChange: (iso: string | null) => void;
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
    label: SERVICE_LABELS.walk_checkin,
    helper: "Short visits at your home",
    CardIcon: PersonSimpleWalk,
  },
  {
    value: "inhome_sitting",
    label: SERVICE_LABELS.inhome_sitting,
    helper: "Overnight care at your home",
    CardIcon: House,
  },
  {
    value: "boarding",
    label: SERVICE_LABELS.boarding,
    helper: "Your dog stays with a trusted host",
    CardIcon: PawPrint,
  },
];

function serviceLabel(service: ServiceType | null) {
  if (!service) return "";
  return SERVICE_LABELS[service];
}

function ServiceIcon({ service }: { service: ServiceType }) {
  if (service === "inhome_sitting") return <House size={16} weight="bold" />;
  if (service === "boarding") return <PawPrint size={16} weight="bold" />;
  return <PersonSimpleWalk size={16} weight="bold" />;
}

export function FilterPanelDesktop({
  filters,
  onServiceChange,
  onMinRateChange,
  onMaxRateChange,
  onTimeToggle,
  onDateRangeChange,
  onStartDateChange,
}: FilterPanelDesktopProps) {
  const [panelView, setPanelView] = useState<PanelView>(filters.service ? "filters" : "service");

  useEffect(() => {
    if (!filters.service) setPanelView("service");
  }, [filters.service]);

  const selectedService = useMemo(() => filters.service || "walk_checkin", [filters.service]);
  const rateBounds = useMemo(() => getExploreRateBounds(filters.service), [filters.service]);

  const rangeRowStyle = useMemo(() => {
    const span = rateBounds.max - rateBounds.min;
    const clampedMin = Math.max(rateBounds.min, Math.min(filters.minRate, rateBounds.max));
    const clampedMax = Math.max(clampedMin, Math.min(filters.maxRate, rateBounds.max));
    const minPct = ((clampedMin - rateBounds.min) / span) * 100;
    const maxPct = ((clampedMax - rateBounds.min) / span) * 100;
    return {
      "--min-pct": `${Math.max(0, Math.min(100, minPct))}%`,
      "--max-pct": `${Math.max(0, Math.min(100, maxPct))}%`,
    } as CSSProperties;
  }, [filters.minRate, filters.maxRate, rateBounds]);

  return (
    <aside className="panel explore-left-panel" aria-label="Explore left panel">
      <div
        className={`filter-panel-track ${panelView === "service" ? "show-service" : "show-filters"}`}
        role="region"
        aria-live="polite"
      >
        {/* ── Service chooser page ──────────────────────────────────────── */}
        <section className="filter-panel-page">
          <div className="panel-content">
            <h2 className="filter-panel-title">Choose how care is provided</h2>
            <div className="filter-service-list">
              {serviceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="filter-service-card"
                  onClick={() => {
                    onServiceChange(option.value);
                    setPanelView("filters");
                  }}
                >
                  <option.CardIcon size={20} weight="duotone" className="filter-service-icon" />
                  <div className="filter-service-copy">
                    <strong>{option.label}</strong>
                    <span>{option.helper}</span>
                  </div>
                  <span className="filter-service-caret" aria-hidden>
                    ›
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Filters page ─────────────────────────────────────────────── */}
        <section className="filter-panel-page filter-panel-page--filters">
          <FilterPanelShell
            header={
              <div className="filter-header">
                {/* Service switcher: ← label [icon] — navigates back to service chooser */}
                <ButtonAction
                  variant="outline"
                  size="md"
                  leftIcon={<CaretLeft size={14} weight="bold" />}
                  rightIcon={<ServiceIcon service={selectedService} />}
                  onClick={() => setPanelView("service")}
                  style={{ color: "var(--text-primary)" }}
                >
                  {serviceLabel(selectedService)}
                </ButtonAction>
              </div>
            }
          >
            <div className="filter-scroll">
              {/* Service-aware filter fields */}
              <FilterBody
                filters={filters}
                onMinRateChange={onMinRateChange}
                onMaxRateChange={onMaxRateChange}
                onTimeToggle={onTimeToggle}
                onDateRangeChange={onDateRangeChange}
                onStartDateChange={onStartDateChange}
                rangeRowStyle={rangeRowStyle}
                dualSlider
              />
            </div>
          </FilterPanelShell>
        </section>
      </div>
    </aside>
  );
}
