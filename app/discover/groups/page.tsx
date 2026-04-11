"use client";

import { Suspense, useState, useMemo } from "react";
import {
  UsersThree,
  MapPin,
  CaretUp,
  SlidersHorizontal,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { TabBar } from "@/components/ui/TabBar";
import { CardGroup } from "@/components/groups/CardGroup";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { Slider } from "@/components/ui/Slider";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { getAllPublicGroups, getUserGroups } from "@/lib/mockGroups";
import type { Group, GroupType } from "@/lib/types";

/* ── Constants ── */

const TYPE_TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "park", label: "Parks" },
  { key: "neighbor", label: "Neighbors" },
  { key: "interest", label: "Interest" },
  { key: "care", label: "Care" },
];

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

const NEIGHBOURHOODS = ["Vinohrady", "Žižkov", "Holešovice", "Letná", "Karlín", "Břevnov", "Malá Strana"];

/* ── Filter state ── */

interface GroupFilters {
  selectedVisibility: string[];
  maxMembers: number;
  selectedNeighbourhoods: string[];
}

const DEFAULT_FILTERS: GroupFilters = {
  selectedVisibility: [],
  maxMembers: 50,
  selectedNeighbourhoods: [],
};

/* ── Filter logic ── */

function applyFilters(groups: Group[], type: string, filters: GroupFilters): Group[] {
  return groups.filter((group) => {
    if (type !== "all" && group.groupType !== type) return false;
    if (filters.selectedVisibility.length > 0 && !filters.selectedVisibility.includes(group.visibility)) return false;
    if (filters.maxMembers < 50 && group.members.length > filters.maxMembers) return false;
    if (filters.selectedNeighbourhoods.length > 0 && !filters.selectedNeighbourhoods.includes(group.neighbourhood)) return false;
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

/* ── Filter panel ── */

function GroupsFilterPanel({
  filters,
  onFiltersChange,
}: {
  filters: GroupFilters;
  onFiltersChange: (update: Partial<GroupFilters>) => void;
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

  return (
    <div className="discover-hub-body" style={{ gap: "var(--space-xxl)" }}>
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
        <Slider min={2} max={50} step={1} value={filters.maxMembers} onChange={(v) => onFiltersChange({ maxMembers: v })} />
        <span className="text-sm text-fg-tertiary">{filters.maxMembers >= 50 ? "No limit" : `Up to ${filters.maxMembers} members`}</span>
      </div>

      <div className="filter-field">
        <div className="label">Dog size</div>
        <MultiSelectSegmentBar ariaLabel="Dog size" options={DOG_SIZE_OPTIONS} selectedValues={selectedDogSizes} onToggle={(val) => setSelectedDogSizes((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val])} variant="filter" />
      </div>

      <div className="filter-accordion-stack">
        <div className="filter-accordion">
          <button type="button" className={`filter-accordion-btn${focusOpen ? " open" : ""}`} onClick={() => setFocusOpen((o) => !o)}>
            Focus
            <span className="accordion-caret"><CaretUp size={24} weight="regular" /></span>
          </button>
          <div className={`filter-accordion-body${focusOpen ? " open" : ""}`}>
            <div className="filter-accordion-inner">
              {FOCUS_AREAS.map((name) => <CheckboxRow key={name} label={name} checked={false} onChange={() => {}} placement="right" />)}
            </div>
          </div>
        </div>
      </div>

      <div className="filter-accordion-stack">
        <div className="filter-accordion">
          <button type="button" className={`filter-accordion-btn${neighbourhoodsOpen ? " open" : ""}`} onClick={() => setNeighbourhoodsOpen((o) => !o)}>
            Neighbourhoods
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

  const userGroupIds = useMemo(() => new Set(getUserGroups("shawn").map((g) => g.id)), []);
  const allGroups = useMemo(() => getAllPublicGroups().filter((g) => !userGroupIds.has(g.id)), [userGroupIds]);
  const results = useMemo(() => applyFilters(allGroups, activeType, filters), [allGroups, activeType, filters]);

  return (
    <PageColumn hideHeader abovePanel={<DetailHeader backHref="/discover" title="Groups" />}>
      <div className="page-column-panel-body" style={{ position: "relative" }}>
        <div className="page-column-panel-tabs">
          <TabBar tabs={TYPE_TABS} activeKey={activeType} onChange={(key) => { setActiveType(key); setShowFilters(false); }} />
        </div>

        {showFilters ? (
          <>
            <GroupsFilterPanel filters={filters} onFiltersChange={(u) => setFilters((p) => ({ ...p, ...u }))} />
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

export default function DiscoverGroupsPage() {
  return <Suspense fallback={null}><DiscoverGroupsInner /></Suspense>;
}
