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
import { DiscoverShell } from "@/components/discover/DiscoverShell";
import { Spacer } from "@/components/layout/Spacer";
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
import type { MeetType } from "@/lib/types";

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

/** Hub panel — meet type picker (no type selected yet) */
function MeetsPickerPanel() {
  return (
    <>
      <div className="list-panel-header panel-header-desktop">
        <Link
          href="/discover"
          className="flex items-center gap-sm"
          style={{ textDecoration: "none" }}
        >
          <ArrowLeft size={20} weight="regular" className="text-fg-primary" />
          <h2 className="font-heading text-lg font-bold text-fg-primary m-0">
            Meets
          </h2>
        </Link>
      </div>
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
function MeetsFilterPanel({ activeType }: { activeType: MeetType }) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedEnergy, setSelectedEnergy] = useState<string[]>(["any"]);
  const [selectedLeash, setSelectedLeash] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string[]>(["any"]);
  const [maxGroup, setMaxGroup] = useState(12);
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

  return (
    <>
      <div className="list-panel-header panel-header-desktop">
        <Link
          href="/discover/meets"
          className="flex items-center gap-sm"
          style={{ textDecoration: "none" }}
        >
          <ArrowLeft size={20} weight="regular" className="text-fg-primary" />
          <h2 className="font-heading text-lg font-bold text-fg-primary m-0">
            Meets
          </h2>
        </Link>
      </div>
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
            selectedValues={selectedDays}
            onToggle={(day) =>
              setSelectedDays((prev) =>
                prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
              )
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
            selectedValues={selectedEnergy}
            onToggle={(val) =>
              setSelectedEnergy((prev) =>
                prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
              )
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
            selectedValues={selectedLeash}
            onToggle={(val) =>
              setSelectedLeash((prev) =>
                prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
              )
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
            selectedValues={selectedSize}
            onToggle={(val) =>
              setSelectedSize((prev) =>
                prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
              )
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
            value={maxGroup}
            onChange={(v) => setMaxGroup(v)}
          />
          <div className="flex items-center gap-sm">
            <span className="text-sm text-fg-tertiary">Up to {maxGroup} people</span>
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

function MeetsResultsList({ activeType }: { activeType: MeetType | null }) {
  const allUpcoming = mockMeets
    .filter((m) => m.status === "upcoming")
    .filter((m) => !activeType || m.type === activeType)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  const userMeetIds = new Set(
    getUserMeets("shawn")
      .filter((m) => m.status === "upcoming")
      .map((m) => m.id)
  );

  return (
    <>
      {allUpcoming.map((meet) => (
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

  if (isValidType) {
    const typeInfo = MEET_TYPES.find((t) => t.key === meetType);
    return (
      <DiscoverShell
        hubPanel={<MeetsFilterPanel activeType={meetType} />}
        resultsTitle={MEET_TYPE_LABELS[meetType]}
        resultsIcon={
          typeInfo
            ? (() => {
                const Ico = typeInfo.icon;
                return <Ico size={20} weight="regular" className="text-fg-primary" />;
              })()
            : undefined
        }
        resultsContent={<MeetsResultsList activeType={meetType} />}
        mobileShowResults
      />
    );
  }

  return (
    <DiscoverShell
      hubPanel={<MeetsPickerPanel />}
      resultsTitle="Find your pack"
      resultsIcon={<PawPrint size={20} weight="regular" className="text-fg-primary" />}
      resultsContent={<MeetsResultsList activeType={null} />}
    />
  );
}

export default function DiscoverMeetsPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverMeetsInner />
    </Suspense>
  );
}
