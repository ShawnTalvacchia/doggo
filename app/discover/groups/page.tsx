"use client";

import { Suspense, useState, useMemo } from "react";
import {
  UsersThree,
  MapPin,
  CaretUp,
  CaretDown,
  SlidersHorizontal,
  MagnifyingGlass,
  Tree,
  House,
  Sparkle,
  Heart,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { FilterPillRow } from "@/components/ui/FilterPillRow";
import { CardGroup } from "@/components/groups/CardGroup";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { Slider } from "@/components/ui/Slider";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { getAllPublicGroups, getUserGroups } from "@/lib/mockGroups";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import type { Group, GroupType } from "@/lib/types";

/* ── Constants ── */

const TYPE_TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "park", label: "Parks" },
  { key: "neighbor", label: "Neighbors" },
  { key: "interest", label: "Interest" },
  { key: "care", label: "Care" },
];

// Type dropdown content — icon + heading + sub-label per group type.
// Surfaces inside the filter panel (mirrors Discover Care + Discover
// Meets dropdowns). Sub-labels teach the four group types in one line each.
const TYPE_ICONS: Record<string, typeof UsersThree> = {
  all: UsersThree,
  park: Tree,
  neighbor: House,
  interest: Sparkle,
  care: Heart,
};

const TYPE_DROPDOWN_LABELS: Record<string, string> = {
  all: "All groups",
  park: "Parks",
  neighbor: "Neighbors",
  interest: "Interest",
  care: "Care",
};

const TYPE_DROPDOWN_SUBLABELS: Record<string, string> = {
  all: "Show every group",
  park: "Open crews anchored to a park",
  neighbor: "Hyperlocal groups organised around where you live",
  interest: "Groups around a shared characteristic or activity",
  care: "Provider-hosted communities wrapping a service",
};

const VISIBILITY_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "approval", label: "Approval required" },
];

const DOG_SIZE_OPTIONS = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const FOCUS_AREAS = ["Socialisation", "Exercise", "Training", "Puppy play", "Senior dogs", "Reactive dogs"];

// Keyword bag per focus area — used to match against a group's name +
// description while Group has no first-class `focusAreas` field. Adding a
// structured field is the right long-term move; this keyword set lets the
// filter ship functionally now without a schema change. Update entries
// here when new focus areas land or seeded groups use new phrasing.
const FOCUS_KEYWORDS: Record<string, string[]> = {
  Socialisation: ["socialis", "social", "meet other", "friendly"],
  Exercise: ["exercise", "play", "off-leash", "run", "walk"],
  Training: ["train", "recall", "obedience", "skill", "loose-leash", "command"],
  "Puppy play": ["puppy", "puppies", "young dog"],
  "Senior dogs": ["senior", "older dog", "calm"],
  "Reactive dogs": ["reactive", "anxious", "fearful", "threshold"],
};

function groupMatchesAnyFocus(group: Group, focusAreas: string[]): boolean {
  if (focusAreas.length === 0) return true;
  const haystack = `${group.name} ${group.description}`.toLowerCase();
  return focusAreas.some((area) =>
    (FOCUS_KEYWORDS[area] ?? []).some((kw) => haystack.includes(kw)),
  );
}

const NEIGHBOURHOODS = ["Vinohrady", "Žižkov", "Holešovice", "Letná", "Karlín", "Břevnov", "Malá Strana"];

/* ── Filter state ── */

// Slider's right-end position is the "no upper limit" state — some groups
// are genuinely unlimited (open park communities, large interest groups),
// so the slider needs a way to NOT cap. The constant doubles as the slider
// max and the sentinel: at this value the filter short-circuits. Pulling
// it out so the filter logic + label + slider config can't drift. P2.
const GROUP_SIZE_MIN = 2;
const GROUP_SIZE_NO_LIMIT = 50;

interface GroupFilters {
  selectedVisibility: string[];
  maxMembers: number;
  selectedNeighbourhoods: string[];
  selectedFocusAreas: string[];
}

const DEFAULT_FILTERS: GroupFilters = {
  selectedVisibility: [],
  maxMembers: GROUP_SIZE_NO_LIMIT,
  selectedNeighbourhoods: [],
  selectedFocusAreas: [],
};

/* ── Filter logic ── */

function applyFilters(groups: Group[], type: string, filters: GroupFilters): Group[] {
  return groups.filter((group) => {
    if (type !== "all" && group.groupType !== type) return false;
    if (filters.selectedVisibility.length > 0 && !filters.selectedVisibility.includes(group.visibility)) return false;
    if (filters.maxMembers < GROUP_SIZE_NO_LIMIT && group.members.length > filters.maxMembers) return false;
    if (filters.selectedNeighbourhoods.length > 0 && !filters.selectedNeighbourhoods.includes(group.neighbourhood)) return false;
    if (!groupMatchesAnyFocus(group, filters.selectedFocusAreas)) return false;
    return true;
  });
}

/* ── Results ── */

function GroupsResultsList({ results }: { results: Group[] }) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-md p-xl text-center">
        <UsersThree size={40} weight="light" className="text-fg-tertiary" />
        <p className="text-sm text-fg-secondary m-0">No groups match your filters. Try broadening your search.</p>
      </div>
    );
  }
  return <>{results.map((g) => <CardGroup key={g.id} group={g} variant="discover" />)}</>;
}

/* ── Group type dropdown — top of filter panel ──
 * Mirrors the Discover Care + Discover Meets dropdowns. Sits under the
 * "Filters" heading as the panel's commanding control. 2026-05-11 IA
 * refresh. */
function GroupTypeDropdown({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = TYPE_ICONS[selected] ?? UsersThree;

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
            const ItemIcon = TYPE_ICONS[key] ?? UsersThree;
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

function GroupsFilterPanel({
  filters,
  onFiltersChange,
  activeType,
  onActiveTypeChange,
}: {
  filters: GroupFilters;
  onFiltersChange: (update: Partial<GroupFilters>) => void;
  activeType: string;
  onActiveTypeChange: (key: string) => void;
}) {
  const [selectedDogSizes, setSelectedDogSizes] = useState<string[]>([]);
  const [focusOpen, setFocusOpen] = useState(false);
  const [neighbourhoodsOpen, setNeighbourhoodsOpen] = useState(true);

  const toggleNeighbourhood = (name: string) => {
    const current = filters.selectedNeighbourhoods;
    onFiltersChange({
      selectedNeighbourhoods: current.includes(name) ? current.filter((n) => n !== name) : [...current, name],
    });
  };

  const toggleFocusArea = (name: string) => {
    const current = filters.selectedFocusAreas;
    onFiltersChange({
      selectedFocusAreas: current.includes(name) ? current.filter((n) => n !== name) : [...current, name],
    });
  };

  return (
    <div className="discover-hub-body" style={{ gap: "var(--space-xxl)" }}>
      {/* Filters heading + group-type dropdown — mirrors Discover Care + Meets. */}
      <div className="flex flex-col gap-md">
        <h1 className="font-heading font-semibold text-fg-primary m-0" style={{ fontSize: "var(--text-xl)" }}>
          Filters
        </h1>
        <GroupTypeDropdown selected={activeType} onSelect={onActiveTypeChange} />
      </div>

      <div className="filter-field">
        <div className="label">Nearby</div>
        <div className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm" style={{ padding: "var(--space-sm) var(--space-md)" }}>
          <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0" />
          <span className="font-body text-md text-fg-tertiary">Vinohrady</span>
        </div>
      </div>

      <div className="filter-field">
        <div className="label">Visibility</div>
        <MultiSelectSegmentBar ariaLabel="Group visibility" options={VISIBILITY_OPTIONS} selectedValues={filters.selectedVisibility} onToggle={(val) => onFiltersChange({ selectedVisibility: [val] })} variant="filter" />
      </div>

      <div className="filter-field">
        <div className="label">Group size</div>
        <Slider
          min={GROUP_SIZE_MIN}
          max={GROUP_SIZE_NO_LIMIT}
          step={1}
          value={filters.maxMembers}
          onChange={(v) => onFiltersChange({ maxMembers: v })}
        />
        {/* Scale labels under the slider make the "any size" state visible
            at a glance — without them, the right-end "no limit" mode reads
            as "up to 50" which mis-frames groups bigger than that. P2. */}
        <div className="flex items-center justify-between text-xs text-fg-tertiary">
          <span>{GROUP_SIZE_MIN} members</span>
          <span>Any size</span>
        </div>
        <span className="text-sm text-fg-tertiary">
          {filters.maxMembers >= GROUP_SIZE_NO_LIMIT
            ? "Any group size"
            : `Up to ${filters.maxMembers} members`}
        </span>
      </div>

      <div className="filter-field">
        <div className="label">Dog size</div>
        <MultiSelectSegmentBar ariaLabel="Dog size" options={DOG_SIZE_OPTIONS} selectedValues={selectedDogSizes} onToggle={(val) => setSelectedDogSizes((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val])} variant="filter" />
      </div>

      {/* Both accordions share one .filter-accordion-stack so adjacent
          borders collapse and there's no gap between them — matches the
          Discover Care FilterBody pattern. Splitting into two stacks (the
          previous shape) inherited the page-level `gap: xxl` between
          siblings and produced a visible double-divider gap. */}
      <div className="filter-accordion-stack">
        {/* Selection counts in the accordion header — `Title · N` matches
            the shelter Members tab pill convention (`Walkers · 8`). When
            collapsed, the count is the only cue that filters inside are
            active, so it earns its keep on every accordion that holds
            multi-select state. P2-adjacent — surfaced 2026-06-02. */}
        <div className="filter-accordion">
          <button type="button" className={`filter-accordion-btn${focusOpen ? " open" : ""}`} onClick={() => setFocusOpen((o) => !o)}>
            <span>
              Focus
              {filters.selectedFocusAreas.length > 0 && (
                <span className="text-fg-tertiary font-normal">
                  {" · "}{filters.selectedFocusAreas.length}
                </span>
              )}
            </span>
            <span className="accordion-caret"><CaretUp size={24} weight="regular" /></span>
          </button>
          <div className={`filter-accordion-body${focusOpen ? " open" : ""}`}>
            <div className="filter-accordion-inner">
              {FOCUS_AREAS.map((name) => (
                <CheckboxRow
                  key={name}
                  label={name}
                  checked={filters.selectedFocusAreas.includes(name)}
                  onChange={() => toggleFocusArea(name)}
                  placement="right"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="filter-accordion">
          <button type="button" className={`filter-accordion-btn${neighbourhoodsOpen ? " open" : ""}`} onClick={() => setNeighbourhoodsOpen((o) => !o)}>
            <span>
              Neighbourhoods
              {filters.selectedNeighbourhoods.length > 0 && (
                <span className="text-fg-tertiary font-normal">
                  {" · "}{filters.selectedNeighbourhoods.length}
                </span>
              )}
            </span>
            <span className="accordion-caret"><CaretUp size={24} weight="regular" /></span>
          </button>
          <div className={`filter-accordion-body${neighbourhoodsOpen ? " open" : ""}`}>
            <div className="filter-accordion-inner">
              {NEIGHBOURHOODS.map((name) => <CheckboxRow key={name} label={name} checked={filters.selectedNeighbourhoods.includes(name)} onChange={() => toggleNeighbourhood(name)} placement="right" />)}
            </div>
          </div>
        </div>
      </div>
      <Spacer size="sm" />
    </div>
  );
}

/* ── Main page ── */

function DiscoverGroupsInner() {
  const [activeType, setActiveType] = useState("all");
  const [filters, setFilters] = useState<GroupFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const currentUserId = useCurrentUserId();

  const userGroupIds = useMemo(() => new Set(getUserGroups(currentUserId).map((g) => g.id)), [currentUserId]);
  const allGroups = useMemo(() => getAllPublicGroups().filter((g) => !userGroupIds.has(g.id)), [userGroupIds]);
  const results = useMemo(() => applyFilters(allGroups, activeType, filters), [allGroups, activeType, filters]);

  return (
    <PageColumn hideHeader abovePanel={<DetailHeader backHref="/discover" title="Groups" />}>
      <div className="page-column-panel-body" style={{ position: "relative" }}>
        {/* Type filter pills — hidden when the filter panel is open (the
            in-panel GroupTypeDropdown takes over the scope axis). Matches
            Discover Care + Discover Meets. */}
        {!showFilters && (
          <FilterPillRow
            pills={TYPE_TABS}
            activeKey={activeType}
            onChange={(key) => { setActiveType(key); setShowFilters(false); }}
          />
        )}

        {showFilters ? (
          <>
            <GroupsFilterPanel
              filters={filters}
              onFiltersChange={(u) => setFilters((p) => ({ ...p, ...u }))}
              activeType={activeType}
              onActiveTypeChange={setActiveType}
            />
            <div className="discover-floating-btn">
              <ButtonAction variant="primary" size="md" cta leftIcon={<MagnifyingGlass size={16} weight="bold" />} onClick={() => setShowFilters(false)}>
                View {results.length} {results.length === 1 ? "result" : "results"}
              </ButtonAction>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col"><GroupsResultsList results={results} /></div>
            <div className="discover-floating-btn">
              <ButtonAction variant="primary" size="md" cta leftIcon={<SlidersHorizontal size={16} weight="bold" />} onClick={() => setShowFilters(true)}>
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

export default function DiscoverGroupsPage() {
  return <Suspense fallback={null}><DiscoverGroupsInner /></Suspense>;
}
