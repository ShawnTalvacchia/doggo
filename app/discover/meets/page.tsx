"use client";

import { Suspense, useState, useMemo } from "react";
import {
  PawPrint,
  MapPin,
  CaretUp,
  CaretDown,
  SlidersHorizontal,
  MagnifyingGlass,
  Path,
  Tree,
  GameController,
  GraduationCap,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { FilterPillRow } from "@/components/ui/FilterPillRow";
import { CardMeet } from "@/components/meets/CardMeet";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { Slider } from "@/components/ui/Slider";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { ResultsSectionHeader } from "@/components/discover/ResultsSectionHeader";
import {
  mockMeets,
  getUserMeets,
  getFollowedSeries,
} from "@/lib/mockMeets";
import { getUserGroups } from "@/lib/mockGroups";
import { isMeetVisibleTo, getMeetOccurrences } from "@/lib/meetUtils";
import { useCurrentUserId, useIsGuest } from "@/hooks/useCurrentUser";
import type { Meet, MeetType } from "@/lib/types";

/* ── Constants ── */

// Type pills — categorical filter by meet type. The earlier "Following"
// pill (added when Schedule's Interested lane was the canonical home for
// soft-interest) was retired 2026-05-11 alongside the Schedule IA refresh:
// followed series + group-member meets now surface in the elevated
// "Meets from your circle" section at the top of this surface, mirroring
// the Discover Care "Carers in your circle" pattern.
// "puppies" is a cross-type lens, not a MeetType — it picks playdates
// with puppy ageRange + training meets with a puppy linkedService. Added
// 2026-06-02 (P71) from PO interviews. See `isPuppyMeet` in this file.
const TYPE_TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "walk", label: "Walks" },
  { key: "park_hangout", label: "Hangouts" },
  { key: "playdate", label: "Playdates" },
  { key: "training", label: "Training" },
  { key: "puppies", label: "Puppies" },
];

// Type dropdown content — icon + heading + sub-label per meet type.
// Surfaces inside the filter panel (mirrors Discover Care's
// ServiceTypeDropdown pattern). Sub-labels teach the distinction between
// types in one line each.
const TYPE_ICONS: Record<string, typeof Path> = {
  all: PawPrint,
  walk: Path,
  park_hangout: Tree,
  playdate: GameController,
  training: GraduationCap,
  puppies: PawPrint,
};

const TYPE_DROPDOWN_LABELS: Record<string, string> = {
  all: "All meets",
  walk: "Walks",
  park_hangout: "Park hangouts",
  playdate: "Playdates",
  training: "Training",
  puppies: "Puppies",
};

const TYPE_DROPDOWN_SUBLABELS: Record<string, string> = {
  all: "Show every meet",
  walk: "On-the-move neighbourhood walks",
  park_hangout: "Off-leash play sessions at a park",
  playdate: "Small-group play between matched dogs",
  training: "Skill-focused practice with a trainer",
  puppies: "Meets suitable for puppies under 1 year",
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

// Puppy-lens detector. A meet is "puppy-suitable" when:
//   - It's a playdate with ageRange === "puppy", OR
//   - It's a training meet whose title carries the word "puppy" (covers
//     bridged training cohorts like Klára's "Puppy Basics" without
//     reaching into linkedServices to introspect the carer config).
// Added 2026-06-02 (P71). Free-text title match is intentional — the mock
// world's puppy-targeted training meets all signal it in the title, and
// rejecting non-titled cases keeps us from picking up "calm dogs welcome,
// including puppies" copy that isn't actually puppy-targeted.
function isPuppyMeet(meet: Meet): boolean {
  if (meet.type === "playdate" && meet.playdate?.ageRange === "puppy") return true;
  if (meet.type === "training" && /puppy/i.test(meet.title)) return true;
  return false;
}

function applyFilters(meets: Meet[], type: string, filters: MeetFilters): Meet[] {
  return meets.filter((meet) => {
    if (type === "puppies") {
      if (!isPuppyMeet(meet)) return false;
    } else if (type !== "all" && meet.type !== type) {
      return false;
    }

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

/* ── Results list ──
 *
 * Section split mirrors Discover Care's "Carers in your circle / Other
 * carers" treatment (2026-05-11 IA refresh). Top section surfaces meets
 * the viewer already has a connection to — series they follow, meets in
 * groups they've joined — without requiring an explicit filter toggle.
 * Bottom section is the broader marketplace.
 *
 * In-circle inclusion rule (deduped by meet id):
 *   - Series the viewer is in `meet.followers`
 *   - Meets in groups the viewer is a member of (`meet.groupId` ∈ user groups)
 *
 * When the viewer has no in-circle meets matching the current filter, the
 * split collapses and renders a single flat marketplace list — section
 * headers with one section below them are noise.
 *
 * Guests get the flat list (no in-circle concept exists for them).
 */

function isInCircle(
  meet: Meet,
  userGroupIds: Set<string>,
  followedSeriesIds: Set<string>,
): boolean {
  if (followedSeriesIds.has(meet.id)) return true;
  if (meet.groupId && userGroupIds.has(meet.groupId)) return true;
  return false;
}

function MeetsResultsList({ results }: { results: Meet[] }) {
  const currentUserId = useCurrentUserId();
  const isGuest = useIsGuest();
  // Guests have no committed-meets list; passing an empty Set keeps every
  // card in browse-mode and prevents leaking the Tereza-fallback's joined
  // meets into the preview. D4 prep 2026-05-11.
  const userMeetIds = isGuest
    ? new Set<string>()
    : new Set(
        getUserMeets(currentUserId)
          .filter((m) => m.status === "upcoming")
          .map((m) => m.id),
      );

  // Partition by in-circle vs marketplace. Guests skip the split.
  const { inCircle, otherMeets } = useMemo(() => {
    if (isGuest) {
      return { inCircle: [] as Meet[], otherMeets: results };
    }
    const userGroupIds = new Set(getUserGroups(currentUserId).map((g) => g.id));
    const followedSeriesIds = new Set(
      getFollowedSeries(currentUserId).map((m) => m.id),
    );
    const inCircle: Meet[] = [];
    const otherMeets: Meet[] = [];
    for (const m of results) {
      if (isInCircle(m, userGroupIds, followedSeriesIds)) {
        inCircle.push(m);
      } else {
        otherMeets.push(m);
      }
    }
    return { inCircle, otherMeets };
  }, [results, currentUserId, isGuest]);

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-md p-xl text-center">
        <PawPrint size={40} weight="light" className="text-fg-tertiary" />
        <p className="text-sm text-fg-secondary m-0">No meets match your filters. Try adjusting your criteria.</p>
      </div>
    );
  }

  const showSplit = inCircle.length > 0;

  return (
    <>
      {showSplit && (
        <>
          <ResultsSectionHeader label="Meets from your circle" count={inCircle.length} variant="in-circle" />
          {inCircle.map((meet) => (
            <CardMeet
              key={meet.id}
              meet={meet}
              variant="discover"
              role={userMeetIds.has(meet.id) ? "joining" : undefined}
              inCircle
            />
          ))}
          {otherMeets.length > 0 && (
            <ResultsSectionHeader label="Other meets" count={otherMeets.length} />
          )}
        </>
      )}
      {otherMeets.map((meet) => (
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

/* ── Meet type dropdown — top of filter panel ──
 * Mirrors the Discover Care ServiceTypeDropdown pattern (2026-05-11 IA
 * refresh). The page-level pill row hides when the panel is open; this
 * dropdown takes over the "which type am I scoping to" axis. Bigger
 * padding + heading-style label + icon + sub-label so it reads as the
 * panel's primary commanding control. */
function MeetTypeDropdown({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = TYPE_ICONS[selected] ?? PawPrint;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className="bg-surface-top border border-edge-stronger flex items-center gap-md rounded-sm w-full text-left"
        style={{ padding: "var(--space-md)" }}
      >
        <SelectedIcon size={24} weight="light" className="text-fg-primary shrink-0" />
        <span className="flex-1 flex flex-col">
          <span className="font-heading font-semibold text-fg-primary" style={{ fontSize: "var(--text-lg)" }}>
            {TYPE_DROPDOWN_LABELS[selected]}
          </span>
          <span className="font-body text-sm text-fg-tertiary">
            {TYPE_DROPDOWN_SUBLABELS[selected]}
          </span>
        </span>
        <CaretDown size={18} weight="regular" className="text-fg-tertiary shrink-0" />
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 bg-surface-top border border-edge-stronger rounded-sm shadow-md overflow-hidden flex flex-col"
          style={{ top: "100%", marginTop: "var(--space-xs)", zIndex: 30 }}
        >
          {TYPE_TABS.map(({ key }) => {
            const ItemIcon = TYPE_ICONS[key] ?? PawPrint;
            const isActive = key === selected;
            return (
              <button
                key={key}
                type="button"
                onClick={() => { onSelect(key); setOpen(false); }}
                className={`flex items-center gap-md text-left ${isActive ? "bg-surface-base" : "hover:bg-surface-base"}`}
                style={{ padding: "var(--space-md)" }}
              >
                <ItemIcon size={22} weight="light" className={isActive ? "text-brand-strong shrink-0" : "text-fg-tertiary shrink-0"} />
                <span className="flex flex-col">
                  <span className={`font-body text-md ${isActive ? "text-brand-strong font-semibold" : "text-fg-primary"}`}>
                    {TYPE_DROPDOWN_LABELS[key]}
                  </span>
                  <span className="font-body text-sm text-fg-tertiary">
                    {TYPE_DROPDOWN_SUBLABELS[key]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Filter panel ── */

function MeetsFilterPanel({
  filters,
  onFiltersChange,
  activeType,
  onActiveTypeChange,
}: {
  filters: MeetFilters;
  onFiltersChange: (update: Partial<MeetFilters>) => void;
  activeType: string;
  onActiveTypeChange: (key: string) => void;
}) {
  const toggleInArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  return (
    <div className="discover-hub-body" style={{ gap: "var(--space-xxl)" }}>
      {/* Filters heading + meet-type dropdown — mirrors Discover Care. */}
      <div className="flex flex-col gap-md">
        <h1 className="font-heading font-semibold text-fg-primary m-0" style={{ fontSize: "var(--text-xl)" }}>
          Filters
        </h1>
        <MeetTypeDropdown selected={activeType} onSelect={onActiveTypeChange} />
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

      <Spacer size="sm" />
    </div>
  );
}

/* ── Main page ── */

function DiscoverMeetsInner() {
  const [activeType, setActiveType] = useState("all");
  const [filters, setFilters] = useState<MeetFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const currentUserId = useCurrentUserId();
  const isGuest = useIsGuest();

  const handleFiltersChange = (update: Partial<MeetFilters>) => {
    setFilters((prev) => ({ ...prev, ...update }));
  };

  const allUpcoming = useMemo(() =>
    mockMeets
      .filter((m) => m.status === "upcoming")
      .filter((m) => isMeetVisibleTo(m, currentUserId))
      .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)),
    [currentUserId]
  );

  const results = useMemo(
    () => applyFilters(allUpcoming, activeType, filters),
    [allUpcoming, activeType, filters],
  );

  return (
    <PageColumn hideHeader abovePanel={<DetailHeader backHref="/discover" title="Meets" />}>
      <div className="page-column-panel-body" style={{ position: "relative" }}>
        {/* Type filter pills — scrollable on mobile. Hidden when the filter
            panel is open (the in-panel MeetTypeDropdown takes over the
            scope axis there). Matches the Discover Care pattern. */}
        {!showFilters && (
          <FilterPillRow
            pills={TYPE_TABS}
            activeKey={activeType}
            onChange={(key) => { setActiveType(key); setShowFilters(false); }}
          />
        )}

        {showFilters ? (
          <>
            <MeetsFilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              activeType={activeType}
              onActiveTypeChange={setActiveType}
            />
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
                variant="primary"
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
