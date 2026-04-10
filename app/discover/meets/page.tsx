"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  PawPrint,
  MapPin,
  CaretRight,
  CaretUp,
  Path,
  TreePalm,
  Dog,
  Barbell,
  CalendarBlank,
  Lightning,
  Users,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { TabBar } from "@/components/ui/TabBar";
import { CardMeet } from "@/components/meets/CardMeet";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { Slider } from "@/components/ui/Slider";
import {
  mockMeets,
  getUserMeets,
  ENERGY_LABELS,
  LEASH_LABELS,
  PACE_LABELS,
  DISTANCE_LABELS,
  TERRAIN_LABELS,
  AMENITY_LABELS,
  VIBE_LABELS,
  AGE_RANGE_LABELS,
  PLAY_STYLE_LABELS,
  SKILL_LABELS,
  EXPERIENCE_LABELS,
  TRAINER_TYPE_LABELS,
} from "@/lib/mockMeets";
import type { Meet, MeetType } from "@/lib/types";

const MEET_TYPES = [
  {
    key: "walk" as MeetType,
    label: "Walks",
    description: "Leashed neighbourhood walks",
    icon: Path,
  },
  {
    key: "park_hangout" as MeetType,
    label: "Park Hangouts",
    description: "Off-leash play at local parks",
    icon: TreePalm,
  },
  {
    key: "playdate" as MeetType,
    label: "Playdates",
    description: "Small group dog dates",
    icon: Dog,
  },
  {
    key: "training" as MeetType,
    label: "Training",
    description: "Group training sessions",
    icon: Barbell,
  },
] as const;

const MEET_TYPE_LABELS: Record<MeetType, string> = {
  walk: "Walks",
  park_hangout: "Park Hangouts",
  playdate: "Playdates",
  training: "Training",
};

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

/* ── Type-specific filter options ── */

const WALK_FILTERS = {
  pace: Object.entries(PACE_LABELS).map(([k, v]) => v),
  distance: Object.entries(DISTANCE_LABELS).map(([k, v]) => v),
  terrain: Object.entries(TERRAIN_LABELS).map(([k, v]) => v),
};

const PARK_FILTERS = {
  amenities: Object.entries(AMENITY_LABELS).map(([k, v]) => v),
  vibe: Object.entries(VIBE_LABELS).map(([k, v]) => v),
};

const PLAYDATE_FILTERS = {
  ageRange: Object.entries(AGE_RANGE_LABELS).map(([k, v]) => v),
  playStyle: Object.entries(PLAY_STYLE_LABELS).map(([k, v]) => v),
};

const TRAINING_FILTERS = {
  skills: Object.entries(SKILL_LABELS).map(([k, v]) => v),
  experience: Object.entries(EXPERIENCE_LABELS).map(([k, v]) => v),
  trainerType: Object.entries(TRAINER_TYPE_LABELS).map(([k, v]) => v),
};

/* ── Shared filter state ── */

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

function applyFilters(meets: Meet[], filters: MeetFilters): Meet[] {
  return meets.filter((meet) => {
    // Day filter
    if (filters.selectedDays.length > 0) {
      const meetDay = new Date(meet.date).getDay();
      const selectedDayIndices = filters.selectedDays.map((d) => DAY_INDEX[d]);
      if (!selectedDayIndices.includes(meetDay)) return false;
    }

    // Energy filter
    if (filters.selectedEnergy.length > 0 && !filters.selectedEnergy.includes("any")) {
      const meetEnergy = meet.energyLevel ?? "any";
      if (meetEnergy !== "any" && !filters.selectedEnergy.includes(meetEnergy)) return false;
    }

    // Leash filter
    if (filters.selectedLeash.length > 0) {
      if (!filters.selectedLeash.includes(meet.leashRule)) return false;
    }

    // Max group size filter
    if (meet.maxAttendees > filters.maxGroup) return false;

    return true;
  });
}

/** Hub panel — meet type picker (no type selected yet) */
function MeetsPickerPanel() {
  return (
    <>
      <div className="discover-hub-body">
        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            Near
          </span>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-tertiary">Vinohrady</span>
          </div>
        </div>

        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            What kind of meet?
          </span>
          <div className="flex flex-col gap-lg">
            {MEET_TYPES.map((mt) => (
              <Link
                key={mt.key}
                href={`/discover/meets?type=${mt.key}`}
                className="bg-surface-top border border-edge-stronger flex items-center gap-md rounded-sm"
                style={{
                  textDecoration: "none",
                  padding: "var(--space-lg)",
                  overflow: "hidden",
                }}
              >
                <mt.icon size={32} weight="regular" className="text-fg-secondary shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-body font-semibold text-md text-fg-secondary">
                    {mt.label}
                  </span>
                  <span className="text-sm text-fg-secondary" style={{ lineHeight: "20px" }}>
                    {mt.description}
                  </span>
                </div>
                <CaretRight size={20} weight="light" className="text-fg-secondary shrink-0" />
              </Link>
            ))}
          </div>
        </div>
        <Spacer size="sm" />
      </div>
    </>
  );
}

/** Checkbox row with local state for accordion items */
function AccordionCheckbox({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return <CheckboxRow label={label} checked={checked} onChange={setChecked} placement="right" />;
}

/** Hub panel — filter form (meet type selected) */
function MeetsFilterPanel({
  activeType,
  filters,
  onFiltersChange,
}: {
  activeType: MeetType;
  filters: MeetFilters;
  onFiltersChange: (update: Partial<MeetFilters>) => void;
}) {
  const [detailsOpen, setDetailsOpen] = useState(true);

  const label = MEET_TYPE_LABELS[activeType];
  const svc = MEET_TYPES.find((s) => s.key === activeType);

  /* Get type-specific filter labels */
  const typeFilters = activeType === "walk"
    ? { label: "Walk preferences", items: [...WALK_FILTERS.pace, ...WALK_FILTERS.distance, ...WALK_FILTERS.terrain] }
    : activeType === "park_hangout"
    ? { label: "Park preferences", items: [...PARK_FILTERS.amenities, ...PARK_FILTERS.vibe] }
    : activeType === "playdate"
    ? { label: "Playdate preferences", items: [...PLAYDATE_FILTERS.ageRange, ...PLAYDATE_FILTERS.playStyle] }
    : { label: "Training preferences", items: [...TRAINING_FILTERS.skills, ...TRAINING_FILTERS.experience, ...TRAINING_FILTERS.trainerType] };

  const toggleInArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  return (
    <>
      <div className="discover-hub-body" style={{ gap: "var(--space-xxl)" }}>
        {/* Meet type */}
        <div className="filter-field">
          <div className="label">Meet type</div>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            {svc && <svc.icon size={20} weight="regular" className="text-fg-tertiary shrink-0" />}
            <span className="font-body text-md text-fg-secondary">{label}</span>
          </div>
        </div>

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

        {/* Type-specific details accordion */}
        <div className="filter-accordion-stack">
          <div className="filter-accordion">
            <button
              type="button"
              className={`filter-accordion-btn${detailsOpen ? " open" : ""}`}
              onClick={() => setDetailsOpen((o) => !o)}
            >
              {typeFilters.label}
              <span className="accordion-caret">
                <CaretUp size={24} weight="regular" />
              </span>
            </button>
            <div className={`filter-accordion-body${detailsOpen ? " open" : ""}`}>
              <div className="filter-accordion-inner">
                {typeFilters.items.map((name) => (
                  <AccordionCheckbox key={name} label={name} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Spacer size="sm" />
      </div>
    </>
  );
}

function MeetsResultsList({ activeType, filters }: { activeType: MeetType | null; filters: MeetFilters }) {
  let results = mockMeets
    .filter((m) => m.status === "upcoming")
    .filter((m) => !activeType || m.type === activeType)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  // Apply filters when a type is selected
  if (activeType) {
    results = applyFilters(results, filters);
  }

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

function DiscoverMeetsInner() {
  const searchParams = useSearchParams();
  const meetType = searchParams.get("type") as MeetType | null;
  const isValidType = meetType && ["walk", "park_hangout", "playdate", "training"].includes(meetType);
  const [filters, setFilters] = useState<MeetFilters>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<"results" | "filters">("results");

  const handleFiltersChange = (update: Partial<MeetFilters>) => {
    setFilters((prev) => ({ ...prev, ...update }));
  };

  // When a meet type is selected, show results with a Results/Filters toggle
  if (isValidType) {
    const TABS = [
      { key: "results", label: "Results" },
      { key: "filters", label: "Filters" },
    ];

    return (
      <PageColumn hideHeader abovePanel={<DetailHeader backHref="/discover/meets" title={MEET_TYPE_LABELS[meetType]} />}>
        <div className="page-column-panel-body">
          {/* Results/Filters tabs */}
          <div className="page-column-panel-tabs">
            <TabBar
              tabs={TABS}
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as "results" | "filters")}
            />
          </div>

          {activeTab === "results" ? (
            <div className="flex flex-col">
              <MeetsResultsList activeType={meetType} filters={filters} />
            </div>
          ) : (
            <MeetsFilterPanel
              activeType={meetType}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          )}
          <Spacer size="sm" />
        </div>
      </PageColumn>
    );
  }

  // No type selected — show the meet type picker
  return (
    <PageColumn hideHeader abovePanel={<DetailHeader backHref="/discover" title="Meets" />}>
      <div className="page-column-panel-body">
        <MeetsPickerPanel />
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
