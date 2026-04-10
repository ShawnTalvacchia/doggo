"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  UsersThree,
  MapPin,
  CaretRight,
  CaretUp,
  Tree,
  UsersFour,
  Storefront,
  House,
  PawPrint,
  Dog,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { Spacer } from "@/components/layout/Spacer";
import { TabBar } from "@/components/ui/TabBar";
import { CardGroup } from "@/components/groups/CardGroup";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { Slider } from "@/components/ui/Slider";
import { getAllPublicGroups, getUserGroups } from "@/lib/mockGroups";
import type { Group, GroupType } from "@/lib/types";

const GROUP_TYPES = [
  {
    key: "park" as GroupType,
    label: "Parks",
    description: "Auto-created for local dog parks",
    icon: Tree,
  },
  {
    key: "neighbor" as GroupType,
    label: "Neighbors",
    description: "Hyperlocal groups for your block or street",
    icon: House,
  },
  {
    key: "interest" as GroupType,
    label: "Interest",
    description: "Breed, activity, and need-based communities",
    icon: PawPrint,
  },
  {
    key: "care" as GroupType,
    label: "Care",
    description: "Provider-run service groups",
    icon: Storefront,
  },
] as const;

const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  park: "Park Groups",
  neighbor: "Neighborhood Groups",
  interest: "Interest Groups",
  care: "Care Groups",
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

const FOCUS_AREAS = [
  "Socialisation",
  "Exercise",
  "Training",
  "Puppy play",
  "Senior dogs",
  "Reactive dogs",
];

const NEIGHBOURHOODS = [
  "Vinohrady",
  "Žižkov",
  "Holešovice",
  "Letná",
  "Karlín",
  "Břevnov",
  "Malá Strana",
];

/* ── Shared filter state ── */

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

function applyFilters(groups: Group[], filters: GroupFilters): Group[] {
  return groups.filter((group) => {
    // Visibility filter
    if (filters.selectedVisibility.length > 0) {
      if (!filters.selectedVisibility.includes(group.visibility)) return false;
    }

    // Max members
    if (filters.maxMembers < 50 && group.members.length > filters.maxMembers) return false;

    // Neighbourhood filter
    if (filters.selectedNeighbourhoods.length > 0) {
      if (!filters.selectedNeighbourhoods.includes(group.neighbourhood)) return false;
    }

    return true;
  });
}

/** Hub panel — group type picker (no type selected yet) */
function GroupsPickerPanel() {
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
            Type of group
          </span>
          <div className="flex flex-col gap-lg">
            {GROUP_TYPES.map((gt) => (
              <Link
                key={gt.key}
                href={`/discover/groups?type=${gt.key}`}
                className="bg-surface-top border border-edge-stronger flex items-center gap-md rounded-sm"
                style={{
                  textDecoration: "none",
                  padding: "var(--space-lg)",
                  overflow: "hidden",
                }}
              >
                <gt.icon size={32} weight="regular" className="text-fg-secondary shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-body font-semibold text-md text-fg-secondary">
                    {gt.label}
                  </span>
                  <span className="text-sm text-fg-secondary" style={{ lineHeight: "20px" }}>
                    {gt.description}
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

/** Checkbox row with local state */
function AccordionCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return <CheckboxRow label={label} checked={checked} onChange={onChange} placement="right" />;
}

/** Hub panel — filter form (group type selected) */
function GroupsFilterPanel({
  activeType,
  filters,
  onFiltersChange,
}: {
  activeType: GroupType;
  filters: GroupFilters;
  onFiltersChange: (update: Partial<GroupFilters>) => void;
}) {
  const [selectedDogSizes, setSelectedDogSizes] = useState<string[]>([]);
  const [focusOpen, setFocusOpen] = useState(false);
  const [neighbourhoodsOpen, setNeighbourhoodsOpen] = useState(true);

  const label = GROUP_TYPE_LABELS[activeType];
  const typeInfo = GROUP_TYPES.find((t) => t.key === activeType);

  const toggleNeighbourhood = (name: string) => {
    const current = filters.selectedNeighbourhoods;
    const next = current.includes(name)
      ? current.filter((n) => n !== name)
      : [...current, name];
    onFiltersChange({ selectedNeighbourhoods: next });
  };

  return (
    <>
      <div className="discover-hub-body" style={{ gap: "var(--space-xxl)" }}>
        {/* Group type */}
        <div className="filter-field">
          <div className="label">Group type</div>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            {typeInfo && <typeInfo.icon size={20} weight="regular" className="text-fg-tertiary shrink-0" />}
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

        {/* Visibility — single-select (Open vs Approval required) */}
        {activeType !== "park" && (
          <div className="filter-field">
            <div className="label">Visibility</div>
            <MultiSelectSegmentBar
              ariaLabel="Group visibility"
              options={VISIBILITY_OPTIONS}
              selectedValues={filters.selectedVisibility}
              onToggle={(val) => onFiltersChange({ selectedVisibility: [val] })}
              variant="filter"
            />
          </div>
        )}

        {/* Max members — 50 = no limit */}
        <div className="filter-field">
          <div className="label">Group size</div>
          <Slider
            min={2}
            max={50}
            step={1}
            value={filters.maxMembers}
            onChange={(v) => onFiltersChange({ maxMembers: v })}
          />
          <div className="flex items-center gap-sm">
            <span className="text-sm text-fg-tertiary">
              {filters.maxMembers >= 50 ? "No limit" : `Up to ${filters.maxMembers} members`}
            </span>
          </div>
        </div>

        {/* Dog size */}
        <div className="filter-field">
          <div className="label">Dog size</div>
          <MultiSelectSegmentBar
            ariaLabel="Dog size"
            options={DOG_SIZE_OPTIONS}
            selectedValues={selectedDogSizes}
            onToggle={(val) =>
              setSelectedDogSizes((prev) =>
                prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
              )
            }
            variant="filter"
          />
        </div>

        {/* Focus accordion */}
        <div className="filter-accordion-stack">
          <div className="filter-accordion">
            <button
              type="button"
              className={`filter-accordion-btn${focusOpen ? " open" : ""}`}
              onClick={() => setFocusOpen((o) => !o)}
            >
              Focus
              <span className="accordion-caret">
                <CaretUp size={24} weight="regular" />
              </span>
            </button>
            <div className={`filter-accordion-body${focusOpen ? " open" : ""}`}>
              <div className="filter-accordion-inner">
                {FOCUS_AREAS.map((name) => (
                  <AccordionCheckbox
                    key={name}
                    label={name}
                    checked={false}
                    onChange={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Neighbourhoods accordion */}
        <div className="filter-accordion-stack">
          <div className="filter-accordion">
            <button
              type="button"
              className={`filter-accordion-btn${neighbourhoodsOpen ? " open" : ""}`}
              onClick={() => setNeighbourhoodsOpen((o) => !o)}
            >
              Neighbourhoods
              <span className="accordion-caret">
                <CaretUp size={24} weight="regular" />
              </span>
            </button>
            <div className={`filter-accordion-body${neighbourhoodsOpen ? " open" : ""}`}>
              <div className="filter-accordion-inner">
                {NEIGHBOURHOODS.map((name) => (
                  <AccordionCheckbox
                    key={name}
                    label={name}
                    checked={filters.selectedNeighbourhoods.includes(name)}
                    onChange={() => toggleNeighbourhood(name)}
                  />
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

function GroupsResultsList({ activeType, filters }: { activeType: GroupType | null; filters: GroupFilters }) {
  const userGroups = getUserGroups("shawn");
  const userGroupIds = new Set(userGroups.map((g) => g.id));
  let results = getAllPublicGroups()
    .filter((g) => !userGroupIds.has(g.id))
    .filter((g) => !activeType || g.groupType === activeType);

  if (activeType) {
    results = applyFilters(results, filters);
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-md p-xl text-center">
        <UsersThree size={40} weight="light" className="text-fg-tertiary" />
        <p className="text-sm text-fg-secondary m-0">No groups match your filters. Try broadening your search.</p>
      </div>
    );
  }

  return (
    <>
      {results.map((group) => (
        <CardGroup key={group.id} group={group} variant="discover" />
      ))}
    </>
  );
}

function DiscoverGroupsInner() {
  const searchParams = useSearchParams();
  const groupType = searchParams.get("type") as GroupType | null;
  const isValidType = groupType && ["park", "neighbor", "interest", "care"].includes(groupType);
  const [filters, setFilters] = useState<GroupFilters>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<"results" | "filters">("results");

  const handleFiltersChange = (update: Partial<GroupFilters>) => {
    setFilters((prev) => ({ ...prev, ...update }));
  };

  if (isValidType) {
    const TABS = [
      { key: "results", label: "Results" },
      { key: "filters", label: "Filters" },
    ];

    return (
      <PageColumn hideHeader>
        <div className="page-column-panel-body">
          <div
            className="flex items-center gap-sm"
            style={{
              padding: "var(--space-md) var(--space-lg)",
              borderBottom: "1px solid var(--border-regular)",
            }}
          >
            <Link
              href="/discover/groups"
              className="flex items-center gap-xs text-fg-secondary"
              style={{ textDecoration: "none" }}
            >
              <ArrowLeft size={20} weight="light" />
              <span className="text-md font-medium">Groups</span>
            </Link>
            <span className="text-fg-tertiary text-sm" style={{ marginLeft: "auto" }}>
              {GROUP_TYPE_LABELS[groupType]}
            </span>
          </div>
          <div className="page-column-panel-tabs">
            <TabBar
              tabs={TABS}
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as "results" | "filters")}
            />
          </div>
          {activeTab === "results" ? (
            <div className="flex flex-col">
              <GroupsResultsList activeType={groupType} filters={filters} />
            </div>
          ) : (
            <GroupsFilterPanel
              activeType={groupType}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          )}
          <Spacer size="sm" />
        </div>
      </PageColumn>
    );
  }

  return (
    <PageColumn hideHeader>
      <div className="page-column-panel-body">
        <div
          className="flex items-center gap-sm"
          style={{
            padding: "var(--space-md) var(--space-lg)",
            borderBottom: "1px solid var(--border-regular)",
          }}
        >
          <Link
            href="/discover"
            className="flex items-center gap-xs text-fg-secondary"
            style={{ textDecoration: "none" }}
          >
            <ArrowLeft size={20} weight="light" />
            <span className="text-md font-medium">Discover</span>
          </Link>
          <span className="text-fg-tertiary text-sm" style={{ marginLeft: "auto" }}>
            Groups
          </span>
        </div>
        <GroupsPickerPanel />
      </div>
    </PageColumn>
  );
}

export default function DiscoverGroupsPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverGroupsInner />
    </Suspense>
  );
}
