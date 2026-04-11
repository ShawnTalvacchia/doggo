"use client";

import { Suspense, useState, useMemo } from "react";
import {
  PawPrint,
  MapPin,
  CaretUp,
  SlidersHorizontal,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { TabBar } from "@/components/ui/TabBar";
import { CardMeet } from "@/components/meets/CardMeet";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { Slider } from "@/components/ui/Slider";
import { ButtonAction } from "@/components/ui/ButtonAction";
import {
  mockMeets,
  getUserMeets,
} from "@/lib/mockMeets";
import type { Meet, MeetType } from "@/lib/types";

/* ── Constants ── */

const TYPE_TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "walk", label: "Walks" },
  { key: "park_hangout", label: "Hangouts" },
  { key: "playdate", label: "Playdates" },
  { key: "training", label: "Training" },
];

const DOG_SIZE_OPTIONS = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Med" },
  { value: "large", label: "Large" },
  { value: "any", label: "Any" },
];

const ENERGY_OPTIONS = [
  { value: "calm", label: "Calm" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
  { value: "any", label: "Any" },
];

const LEASH_OPTIONS = [
  { value: "on_leash", label: "On leash" },
  { value: "off_leash", label: "Off leash" },
  { value: "mixed", label: "Mixed" },
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const DAY_INDEX: Record<string, number> = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 };

/* ── Filter state ── */

interface MeetFilters {
  selectedDays: string[];
  selectedEnergy: string[];
  selectedLeash: string[];
  selectedSize: string[];
  maxGroup: number;
}

const DEFAULT_FILTERS: MeetFilters = {
  selectedDays: [],
  selectedEnergy: ["any"],
  selectedLeash: [],
  selectedSize: ["any"],
  maxGroup: 20,
};

/* ── Filter logic ── */

function applyFilters(meets: Meet[], type: string, filters: MeetFilters): Meet[] {
  return meets.filter((meet) => {
    if (type !== "all" && meet.type !== type) return false;

    if (filters.selectedDays.length > 0) {
      const meetDay = new Date(meet.date).getDay();
      const selectedDayIndices = filters.selectedDays.map((d) => DAY_INDEX[d]);
      if (!selectedDayIndices.includes(meetDay)) return false;
    }

    if (filters.selectedEnergy.length > 0 && !filters.selectedEnergy.includes("any")) {
      const meetEnergy = meet.energyLevel ?? "any";
      if (meetEnergy !== "any" && !filters.selectedEnergy.includes(meetEnergy)) return false;
    }

    if (filters.selectedLeash.length > 0) {
      if (!filters.selectedLeash.includes(meet.leashRule)) return false;
    }

    if (meet.maxAttendees > filters.maxGroup) return false;

    return true;
  });
}

/* ── Results list ── */

function MeetsResultsList({ results }: { results: Meet[] }) {
  const userMeetIds = new Set(
    getUserMeets("shawn")
      .filter((m) => m.status === "upcoming")
      .map((m) => m.id)
  );

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-md p-xl text-center">
        <PawPrint size={40} weight="light" className="text-fg-tertiary" />
        <p className="text-sm text-fg-secondary m-0">No meets match your filters. Try adjusting your criteria.</p>
      </div>
    );
  }

  return (
    <>
      {results.map((meet) => (
        <CardMeet
          key={meet.id}
          meet={meet}
          variant="discover"
          role={userMeetIds.has(meet.id) ? "joining" : undefined}
        />
      ))}
    </>
  );
}

/* ── Filter panel ── */

function MeetsFilterPanel({
  filters,
  onFiltersChange,
}: {
  filters: MeetFilters;
  onFiltersChange: (update: Partial<MeetFilters>) => void;
}) {
  const toggleInArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  return (
    <div className="discover-hub-body" style={{ gap: "var(--space-xxl)" }}>
      {/* Nearby */}
      <div className="filter-field">
        <div className="label">Nearby</div>
        <div
          className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
          style={{ padding: "var(--space-sm) var(--space-md)" }}
        >
          <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0" />
          <span className="font-body text-md text-fg-tertiary">Vinohrady</span>
        </div>
      </div>

      {/* Which days */}
      <div className="filter-field">
        <div className="label">Which days?</div>
        <MultiSelectSegmentBar
          ariaLabel="Meet days"
          options={DAYS.map((day) => ({ value: day, label: day }))}
          selectedValues={filters.selectedDays}
          onToggle={(day) =>
            onFiltersChange({ selectedDays: toggleInArray(filters.selectedDays, day) })
          }
          variant="filter"
        />
      </div>

      {/* Energy level */}
      <div className="filter-field">
        <div className="label">Energy level</div>
        <MultiSelectSegmentBar
          ariaLabel="Energy level"
          options={ENERGY_OPTIONS}
          selectedValues={filters.selectedEnergy}
          onToggle={(val) =>
            onFiltersChange({ selectedEnergy: toggleInArray(filters.selectedEnergy, val) })
          }
          variant="filter"
        />
      </div>

      {/* Leash rule */}
      <div className="filter-field">
        <div className="label">Leash rule</div>
        <MultiSelectSegmentBar
          ariaLabel="Leash rule"
          options={LEASH_OPTIONS}
          selectedValues={filters.selectedLeash}
          onToggle={(val) =>
            onFiltersChange({ selectedLeash: toggleInArray(filters.selectedLeash, val) })
          }
          variant="filter"
        />
      </div>

      {/* Dog size */}
      <div className="filter-field">
        <div className="label">Dog size</div>
        <MultiSelectSegmentBar
          ariaLabel="Dog size"
          options={DOG_SIZE_OPTIONS}
          selectedValues={filters.selectedSize}
          onToggle={(val) =>
            onFiltersChange({ selectedSize: toggleInArray(filters.selectedSize, val) })
          }
          variant="filter"
        />
      </div>

      {/* Max group size */}
      <div className="filter-field">
        <div className="label">Max group size</div>
        <Slider
          min={2}
          max={20}
          step={1}
          value={filters.maxGroup}
          onChange={(v) => onFiltersChange({ maxGroup: v })}
        />
        <div className="flex items-center gap-sm">
          <span className="text-sm text-fg-tertiary">Up to {filters.maxGroup} people</span>
        </div>
      </div>

      <Spacer size="sm" />
    </div>
  );
}

/* ── Main page ── */

function DiscoverMeetsInner() {
  const [activeType, setActiveType] = useState("all");
  const [filters, setFilters] = useState<MeetFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const handleFiltersChange = (update: Partial<MeetFilters>) => {
    setFilters((prev) => ({ ...prev, ...update }));
  };

  const allUpcoming = useMemo(() =>
    mockMeets
      .filter((m) => m.status === "upcoming")
      .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)),
    []
  );

  const results = useMemo(() => applyFilters(allUpcoming, activeType, filters), [allUpcoming, activeType, filters]);

  return (
    <PageColumn hideHeader abovePanel={<DetailHeader backHref="/discover" title="Meets" />}>
      <div className="page-column-panel-body" style={{ position: "relative" }}>
        {/* Type tabs — always visible */}
        <div className="page-column-panel-tabs">
          <TabBar
            tabs={TYPE_TABS}
            activeKey={activeType}
            onChange={(key) => { setActiveType(key); setShowFilters(false); }}
          />
        </div>

        {showFilters ? (
          <>
            <MeetsFilterPanel filters={filters} onFiltersChange={handleFiltersChange} />
            <div className="discover-floating-btn">
              <ButtonAction
                variant="primary"
                size="md"
                cta
                leftIcon={<MagnifyingGlass size={16} weight="bold" />}
                onClick={() => setShowFilters(false)}
              >
                View {results.length} {results.length === 1 ? "result" : "results"}
              </ButtonAction>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col">
              <MeetsResultsList results={results} />
            </div>
            <div className="discover-floating-btn">
              <ButtonAction
                variant="secondary"
                size="md"
                cta
                leftIcon={<SlidersHorizontal size={16} weight="bold" />}
                onClick={() => setShowFilters(true)}
              >
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

export default function DiscoverMeetsPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverMeetsInner />
    </Suspense>
  );
}
