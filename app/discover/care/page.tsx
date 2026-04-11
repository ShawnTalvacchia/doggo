"use client";

import { Suspense, useState, useMemo } from "react";
import {
  Heart,
  MapPin,
  CaretUp,
  Dog,
  SlidersHorizontal,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { TabBar } from "@/components/ui/TabBar";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { Slider } from "@/components/ui/Slider";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { CardExploreResult } from "@/components/explore/CardExploreResult";
import { getExploreRateBounds } from "@/lib/pricing";
import { providers } from "@/lib/mockData";
import type { ServiceType } from "@/lib/types";

/* ── Constants ── */

const TYPE_TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "walk_checkin", label: "Walks" },
  { key: "inhome_sitting", label: "Sitting" },
  { key: "boarding", label: "Boarding" },
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const WALK_SERVICES = ["Drop-in visit", "Group walk", "Solo walk"];

/* ── Filter state ── */

interface CareFilters {
  selectedDays: string[];
  visitMode: "one_time" | "repeat";
}

const DEFAULT_FILTERS: CareFilters = {
  selectedDays: [],
  visitMode: "repeat",
};

/* ── Filter panel ── */

function CareFilterPanel({
  filters,
  onFiltersChange,
}: {
  filters: CareFilters;
  onFiltersChange: (update: Partial<CareFilters>) => void;
}) {
  const [servicesOpen, setServicesOpen] = useState(true);
  const [minRate, setMinRate] = useState(150);
  const [maxRate, setMaxRate] = useState(950);
  const rateBounds = getExploreRateBounds("walk_checkin");

  return (
    <div className="discover-hub-body" style={{ gap: "var(--space-xxl)" }}>
      <div className="filter-field">
        <div className="label">Pets</div>
        <div className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm" style={{ padding: "var(--space-sm) var(--space-md)" }}>
          <Dog size={20} weight="regular" className="text-fg-tertiary shrink-0" />
          <span className="font-body text-md text-fg-tertiary">Lucy, Spot</span>
        </div>
      </div>

      <div className="filter-field">
        <div className="label">Nearby</div>
        <div className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm" style={{ padding: "var(--space-sm) var(--space-md)" }}>
          <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0" />
          <span className="font-body text-md text-fg-tertiary">Vinohrady</span>
        </div>
      </div>

      <div className="filter-field">
        <div className="label">How often?</div>
        <div className="filter-visit-row">
          <button type="button" className={`filter-option-card${filters.visitMode === "one_time" ? " active" : ""}`} onClick={() => onFiltersChange({ visitMode: "one_time" })}>
            <strong>One Time</strong>
            <span>Daily visits for a short period</span>
          </button>
          <button type="button" className={`filter-option-card${filters.visitMode === "repeat" ? " active" : ""}`} onClick={() => onFiltersChange({ visitMode: "repeat" })}>
            <strong>Repeat Weekly</strong>
            <span>Ongoing weekly schedule</span>
          </button>
        </div>
      </div>

      <div className="filter-field">
        <div className="label">For which days?</div>
        <MultiSelectSegmentBar
          ariaLabel="Repeat weekly days"
          options={DAYS.map((day) => ({ value: day, label: day }))}
          selectedValues={filters.selectedDays}
          onToggle={(day) => onFiltersChange({ selectedDays: filters.selectedDays.includes(day) ? filters.selectedDays.filter((d) => d !== day) : [...filters.selectedDays, day] })}
          variant="filter"
        />
      </div>

      <div className="filter-field">
        <div className="label">Price range</div>
        <Slider dual min={rateBounds.min} max={rateBounds.max} step={50} minValue={minRate} maxValue={maxRate} onMinChange={setMinRate} onMaxChange={setMaxRate} />
        <div className="filter-minmax-row">
          <div className="filter-field">
            <div className="label">Min. per session</div>
            <input className="input" type="number" min={rateBounds.min} max={rateBounds.max} value={minRate} onChange={(e) => setMinRate(Math.min(Math.max(Number(e.target.value) || rateBounds.min, rateBounds.min), maxRate))} />
          </div>
          <div className="filter-field">
            <div className="label">Max. per session</div>
            <input className="input" type="number" min={rateBounds.min} max={rateBounds.max} value={maxRate} onChange={(e) => setMaxRate(Math.max(Math.min(Number(e.target.value) || rateBounds.max, rateBounds.max), minRate))} />
          </div>
        </div>
      </div>

      <div className="filter-accordion-stack">
        <div className="filter-accordion">
          <button type="button" className={`filter-accordion-btn${servicesOpen ? " open" : ""}`} onClick={() => setServicesOpen((o) => !o)}>
            Services
            <span className="accordion-caret"><CaretUp size={24} weight="regular" /></span>
          </button>
          <div className={`filter-accordion-body${servicesOpen ? " open" : ""}`}>
            <div className="filter-accordion-inner">
              {WALK_SERVICES.map((name) => {
                const [checked, setChecked] = useState(false); // eslint-disable-line react-hooks/rules-of-hooks
                return <CheckboxRow key={name} label={name} checked={checked} onChange={setChecked} placement="right" />;
              })}
            </div>
          </div>
        </div>
      </div>
      <Spacer size="sm" />
    </div>
  );
}

/* ── Results ── */

function CareResultsList({ serviceFilter }: { serviceFilter: string }) {
  const results = useMemo(() => {
    if (serviceFilter === "all") return providers;
    return providers.filter((p) => p.services.includes(serviceFilter as ServiceType));
  }, [serviceFilter]);

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-md p-xl text-center">
        <Heart size={40} weight="light" className="text-fg-tertiary" />
        <p className="text-sm text-fg-secondary m-0">No carers match your filters.</p>
      </div>
    );
  }
  return <>{results.map((p) => <CardExploreResult key={p.id} provider={p} />)}</>;
}

/* ── Main page ── */

function DiscoverCareInner() {
  const [activeType, setActiveType] = useState("all");
  const [filters, setFilters] = useState<CareFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const resultCount = useMemo(() => {
    if (activeType === "all") return providers.length;
    return providers.filter((p) => p.services.includes(activeType as ServiceType)).length;
  }, [activeType]);

  return (
    <PageColumn hideHeader abovePanel={<DetailHeader backHref="/discover" title="Dog Care" />}>
      <div className="page-column-panel-body" style={{ position: "relative" }}>
        <div className="page-column-panel-tabs">
          <TabBar tabs={TYPE_TABS} activeKey={activeType} onChange={(key) => { setActiveType(key); setShowFilters(false); }} />
        </div>

        {showFilters ? (
          <>
            <CareFilterPanel filters={filters} onFiltersChange={(u) => setFilters((p) => ({ ...p, ...u }))} />
            <div className="discover-floating-btn">
              <ButtonAction variant="primary" size="md" cta leftIcon={<MagnifyingGlass size={16} weight="bold" />} onClick={() => setShowFilters(false)}>
                View {resultCount} {resultCount === 1 ? "result" : "results"}
              </ButtonAction>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col"><CareResultsList serviceFilter={activeType} /></div>
            <div className="discover-floating-btn">
              <ButtonAction variant="secondary" size="md" cta leftIcon={<SlidersHorizontal size={16} weight="bold" />} onClick={() => setShowFilters(true)}>
                Filters
              </ButtonAction>
            </div>
          </>
        )}
        <Spacer size="sm" />
      </div>
    </PageColumn>
  );
}

export default function DiscoverCarePage() {
  return <Suspense fallback={null}><DiscoverCareInner /></Suspense>;
}
