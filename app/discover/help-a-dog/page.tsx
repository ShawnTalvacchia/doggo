"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  HandHeart,
  MapPin,
  Check,
  CaretDown,
  CaretUp,
  SlidersHorizontal,
  MagnifyingGlass,
  PawPrint,
  X,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { FilterPillRow } from "@/components/ui/FilterPillRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { ShelterDogCard } from "@/components/shelters/ShelterDogCard";
import { DiscoverShelterCard } from "@/components/shelters/DiscoverShelterCard";
import {
  getAllShelters,
  getAllShelterDogs,
} from "@/lib/mockShelters";
import { PERSONALITY_TAG_LABELS } from "@/lib/constants/dogs";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { usePersistedState } from "@/lib/usePersistedState";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { useAdoptionStore } from "@/lib/useAdoptionStore";
import { getConnectionsForViewer } from "@/lib/mockConnections";
import type {
  EnergyLevel,
  PersonalityTag,
  PetProfile,
  ShelterProfile,
} from "@/lib/types";

/* ── View toggle ─────────────────────────────────────────────────────────── */

type ViewKey = "dogs" | "shelters";

/* ── Dogs view: sort + filters ───────────────────────────────────────────── */

type DogsSortKey = "needs-walks" | "longest" | "smallest" | "alpha";

const SORT_OPTIONS: { value: DogsSortKey; label: string }[] = [
  { value: "needs-walks", label: "Needs walks now" },
  { value: "longest", label: "Longest in care" },
  { value: "smallest", label: "Smallest first" },
  { value: "alpha", label: "A–Z" },
];

const SIZE_OPTIONS = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Med" },
  { value: "large", label: "Large" },
  { value: "any", label: "Any" },
];

const ENERGY_OPTIONS = [
  { value: "low", label: "Calm" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "Active" },
  { value: "very_high", label: "High" },
  { value: "any", label: "Any" },
];

/**
 * Personality filter subset — picked from the broader vocabulary as the
 * tags an adopter/walker actually shops by. Skipping
 * `affectionate / smart / shy / playful / independent` (too generic to
 * filter usefully), and the policy/eligibility-flavored tags
 * (`reactive-on-leash / wary-of-strangers / selective-with-dogs` — those
 * are walker-eligibility signals, not adopter lenses; surfacing them as
 * filters would invite the wrong question). Extend cautiously.
 */
const PERSONALITY_PICKS: PersonalityTag[] = [
  "gentle",
  "good-with-strangers",
  "good-with-dogs",
  "good-with-kids",
  "loves-walks",
  "puppy",
  "senior",
  "calm",
];

const ADOPTION_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "pending", label: "Pending adoption" },
];

interface DogsFilters {
  selectedSize: string[];
  selectedEnergy: string[];
  selectedPersonality: PersonalityTag[];
  selectedAdoption: string[];
}

const DEFAULT_FILTERS: DogsFilters = {
  selectedSize: ["any"],
  selectedEnergy: ["any"],
  selectedPersonality: [],
  selectedAdoption: [],
};

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Parse a weight label like "22 kg" → 22. Falls back to Infinity for
 *  unknown weights so they sort to the end of "smallest first." Mirrors
 *  the helper inlined in app/shelters/[id]/page.tsx — a candidate for
 *  consolidation alongside the SortMenu below. */
function parseWeight(label: string | undefined): number {
  if (!label) return Number.POSITIVE_INFINITY;
  const m = label.match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : Number.POSITIVE_INFINITY;
}

/** Bin weight into size category. Small <10kg, medium 10-25, large 25+. */
function sizeBucket(weight: number): "small" | "medium" | "large" | "unknown" {
  if (!Number.isFinite(weight)) return "unknown";
  if (weight < 10) return "small";
  if (weight < 25) return "medium";
  return "large";
}

/** "Needs walks now" ranks never-walked first, then oldest lastWalkedAt
 *  first. Mirrors the shelter-page helper's sort intent (longest-since-
 *  walked surfaces first) but works across multiple shelters' dogs. */
function sortByNeedsWalks(dogs: PetProfile[]): PetProfile[] {
  return [...dogs].sort((a, b) => {
    if (!a.lastWalkedAt && b.lastWalkedAt) return -1;
    if (a.lastWalkedAt && !b.lastWalkedAt) return 1;
    if (!a.lastWalkedAt && !b.lastWalkedAt) return 0;
    return (a.lastWalkedAt ?? "").localeCompare(b.lastWalkedAt ?? "");
  });
}

function applyDogsFilters(
  dogs: { dog: PetProfile; shelter: ShelterProfile }[],
  filters: DogsFilters,
): { dog: PetProfile; shelter: ShelterProfile }[] {
  return dogs.filter(({ dog }) => {
    // Size
    if (filters.selectedSize.length > 0 && !filters.selectedSize.includes("any")) {
      const bucket = sizeBucket(parseWeight(dog.weightLabel));
      if (bucket === "unknown") return false;
      if (!filters.selectedSize.includes(bucket)) return false;
    }
    // Energy
    if (filters.selectedEnergy.length > 0 && !filters.selectedEnergy.includes("any")) {
      const lvl: EnergyLevel | undefined = dog.energyLevel;
      if (!lvl || !filters.selectedEnergy.includes(lvl)) return false;
    }
    // Personality — match any selected tag
    if (filters.selectedPersonality.length > 0) {
      const tags = dog.personalityTags ?? [];
      if (!filters.selectedPersonality.some((t) => tags.includes(t))) return false;
    }
    // Adoption — match if any selected; if none selected, no constraint
    if (filters.selectedAdoption.length > 0) {
      if (!filters.selectedAdoption.includes(dog.adoptionStatus ?? "available"))
        return false;
    }
    return true;
  });
}

/* ── Inline SortMenu ─────────────────────────────────────────────────────── *
 * Copied from app/shelters/[id]/page.tsx — same dropdown-menu pattern.
 * Logged as a Decision: consolidate into a shared <SortMenu /> in the
 * Design System Cleanup phase once a third consumer raises the cost of
 * the duplication. Keeping inline here so this phase ships without a
 * cross-cutting refactor.
 */
function SortMenu({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onMouseDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [open]);

  const current = options.find((o) => o.value === value);
  return (
    <div ref={wrapRef} className="dropdown-menu-wrap shelter-sort-wrap">
      <button
        type="button"
        className="shelter-sort-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current?.label ?? "Sort"}</span>
        <CaretDown size={12} weight="bold" />
      </button>
      {open && (
        <div className="dropdown-menu" role="listbox">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              className={`dropdown-menu-item${opt.value === value ? " is-active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <Check
                size={14}
                weight="light"
                style={{ opacity: opt.value === value ? 1 : 0 }}
                aria-hidden="true"
              />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Walk-intro card ─────────────────────────────────────────────────────── *
 * The doorway's "explore before you commit" reassurance — the single most-
 * documented friction in the adoption-curious journey (de-couple walking
 * from adoption; see Competitive Research - Adoption-Curious Journeys).
 *
 * Shown only to people still at the doorway: suppressed for active walkers
 * (anyone vouched at a shelter — they're past needing the reassurance) and
 * dismissible by everyone else (persisted, clears on demo reset). The mentor
 * / group-walk on-ramp is named as framing, NOT linked — this is a cross-
 * shelter surface that can't honor a specific mentor booking; that path
 * surfaces once the viewer picks a dog.
 */
function WalkIntroCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="help-a-dog-intro-card">
      <HandHeart
        size={24}
        weight="light"
        className="shrink-0"
        style={{ color: "var(--status-volunteer-main)" }}
      />
      <div className="flex flex-col gap-tiny flex-1 min-w-0">
        <span className="font-heading font-semibold text-fg-primary text-sm">
          Walk a shelter dog — no adoption obligation
        </span>
        <span className="text-xs text-fg-secondary" style={{ lineHeight: 1.45 }}>
          Spend time with the dogs and see how it works. New here? Many people
          start on a group walk or alongside an experienced volunteer, then
          decide in their own time.
        </span>
      </div>
      <button
        type="button"
        className="help-a-dog-intro-dismiss"
        aria-label="Dismiss"
        onClick={onDismiss}
      >
        <X size={16} weight="bold" />
      </button>
    </div>
  );
}

/* ── Filter panel ────────────────────────────────────────────────────────── */

function DogsFilterPanel({
  filters,
  onChange,
}: {
  filters: DogsFilters;
  onChange: (update: Partial<DogsFilters>) => void;
}) {
  const [personalityOpen, setPersonalityOpen] = useState(true);

  // Mutual-exclusivity toggle for rows with an "Any" pill (same shape as
  // Discover Meets' toggleWithAny). Specific selection ejects "any"; the
  // last specific being un-selected falls back to "any" so the row never
  // reads as "no rule applied" by accident.
  const toggleWithAny = (arr: string[], val: string): string[] => {
    if (val === "any") return ["any"];
    const withoutAny = arr.filter((v) => v !== "any");
    if (withoutAny.includes(val)) {
      const next = withoutAny.filter((v) => v !== val);
      return next.length === 0 ? ["any"] : next;
    }
    return [...withoutAny, val];
  };

  const toggleInArray = (arr: string[], val: string): string[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const togglePersonality = (tag: PersonalityTag) => {
    const current = filters.selectedPersonality;
    onChange({
      selectedPersonality: current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
    });
  };

  return (
    <div className="discover-hub-body" style={{ gap: "var(--space-xxl)" }}>
      <div className="flex flex-col gap-md">
        <h1 className="font-heading font-semibold text-fg-primary m-0" style={{ fontSize: "var(--text-xl)" }}>
          Filters
        </h1>
      </div>

      <div className="filter-field">
        <div className="label">Nearby</div>
        <div
          className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
          style={{ padding: "var(--space-sm) var(--space-md)" }}
        >
          <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0" />
          <span className="font-body text-md text-fg-tertiary">Prague</span>
        </div>
      </div>

      <div className="filter-field">
        <div className="label">Dog size</div>
        <MultiSelectSegmentBar
          ariaLabel="Dog size"
          options={SIZE_OPTIONS}
          selectedValues={filters.selectedSize}
          onToggle={(val) => onChange({ selectedSize: toggleWithAny(filters.selectedSize, val) })}
          variant="filter"
        />
      </div>

      <div className="filter-field">
        <div className="label">Energy level</div>
        <MultiSelectSegmentBar
          ariaLabel="Energy level"
          options={ENERGY_OPTIONS}
          selectedValues={filters.selectedEnergy}
          onToggle={(val) => onChange({ selectedEnergy: toggleWithAny(filters.selectedEnergy, val) })}
          variant="filter"
        />
      </div>

      <div className="filter-field">
        <div className="label">Adoption status</div>
        <MultiSelectSegmentBar
          ariaLabel="Adoption status"
          options={ADOPTION_OPTIONS}
          selectedValues={filters.selectedAdoption}
          onToggle={(val) => onChange({ selectedAdoption: toggleInArray(filters.selectedAdoption, val) })}
          variant="filter"
        />
      </div>

      <div className="filter-accordion-stack">
        <div className="filter-accordion">
          <button
            type="button"
            className={`filter-accordion-btn${personalityOpen ? " open" : ""}`}
            onClick={() => setPersonalityOpen((o) => !o)}
          >
            <span>
              Personality
              {filters.selectedPersonality.length > 0 && (
                <span className="text-fg-tertiary font-normal">
                  {" · "}{filters.selectedPersonality.length}
                </span>
              )}
            </span>
            <span className="accordion-caret"><CaretUp size={24} weight="regular" /></span>
          </button>
          <div className={`filter-accordion-body${personalityOpen ? " open" : ""}`}>
            <div className="filter-accordion-inner">
              {PERSONALITY_PICKS.map((tag) => (
                <CheckboxRow
                  key={tag}
                  label={PERSONALITY_TAG_LABELS[tag]}
                  checked={filters.selectedPersonality.includes(tag)}
                  onChange={() => togglePersonality(tag)}
                  placement="right"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Spacer size="sm" />
    </div>
  );
}

/* ── Results lists ───────────────────────────────────────────────────────── */

function DogsResults({
  results,
}: {
  results: { dog: PetProfile; shelter: ShelterProfile }[];
  onResetFilters: () => void;
}) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-md p-xl text-center">
        <PawPrint size={40} weight="light" className="text-fg-tertiary" />
        <p className="text-sm text-fg-secondary m-0">
          No dogs match these filters. Try broadening your search.
        </p>
      </div>
    );
  }

  return (
    <div className="help-a-dog-dogs-grid">
      {results.map(({ dog, shelter }) => (
        <ShelterDogCard key={dog.id} dog={dog} shelter={shelter} />
      ))}
    </div>
  );
}

function SheltersResults({
  shelters,
  elevationByShelterId,
}: {
  shelters: ShelterProfile[];
  elevationByShelterId: Record<string, number>;
}) {
  // Sort by elevation (your-shelter > circle-volunteer > other), stable
  // within each bucket so the default order is preserved per K.
  const sorted = useMemo(() => {
    return [...shelters].sort((a, b) => {
      const ea = elevationByShelterId[a.id] ?? 0;
      const eb = elevationByShelterId[b.id] ?? 0;
      return eb - ea;
    });
  }, [shelters, elevationByShelterId]);
  return (
    <div className="help-a-dog-shelters-list">
      {sorted.map((s) => (
        <DiscoverShelterCard key={s.id} shelter={s} />
      ))}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */

function DiscoverHelpADogInner() {
  const [view, setView] = useState<ViewKey>("dogs");
  const [sortKey, setSortKey] = useState<DogsSortKey>("needs-walks");
  const [filters, setFilters] = useState<DogsFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [introDismissed, setIntroDismissed] = usePersistedState(
    "doggo-helpadog-intro-dismissed",
    false,
  );
  const currentUserId = useCurrentUserId();
  const { applications } = useWalkerApplications();

  const allShelters = useMemo(() => getAllShelters(), []);

  // The doorway reassurance is for people still deciding. Anyone already
  // vouched at a shelter has walked the path — suppress it for them. Vouched
  // status has two sources (mirrors ShelterWalkPanel): the static walker
  // roster (seeded in mockShelters) OR a dynamic vouched application (the
  // demo can advance a walker via the hidden affordance).
  const isActiveWalker = useMemo(() => {
    if (!currentUserId) return false;
    const inRoster = allShelters.some((s) =>
      s.walkers.some((w) => w.userId === currentUserId),
    );
    const hasVouchedApp = applications.some(
      (a) => a.userId === currentUserId && a.state === "vouched",
    );
    return inRoster || hasVouchedApp;
  }, [currentUserId, allShelters, applications]);

  // Adopted dogs leave the walkable roster — they've gone home, so they drop
  // out of the "find a dog to walk" surface entirely (their Happy-endings
  // record lives on the shelter page). Folds in the demo adoption override.
  const { getStage: getAdoptionStage } = useAdoptionStore();
  const allDogs = useMemo(
    () =>
      getAllShelterDogs().filter(
        (e) =>
          getAdoptionStage(e.dog.id)?.stage !== "adopted" &&
          e.dog.adoptionStatus !== "adopted",
      ),
    [getAdoptionStage],
  );

  // Shelter-membership elevation (K, 2026-06-09) — sort priority by:
  //   1. Shelters you walk at (vouched WalkerApplications)
  //   2. Shelters your circle volunteers at (Connected users with
  //      vouched applications)
  //   3. Everything else
  // Computed once per render; per-shelter score keyed by shelter id.
  const elevationByShelterId = useMemo(() => {
    const scores: Record<string, number> = {};
    if (!currentUserId) return scores;
    const yourShelters = new Set(
      applications
        .filter((a) => a.userId === currentUserId && a.state === "vouched")
        .map((a) => a.shelterId),
    );
    const connectedIds = new Set(
      getConnectionsForViewer(currentUserId)
        .filter((c) => c.state === "connected")
        .map((c) => c.userId),
    );
    const circleShelters = new Set(
      applications
        .filter((a) => connectedIds.has(a.userId) && a.state === "vouched")
        .map((a) => a.shelterId),
    );
    for (const s of allShelters) {
      if (yourShelters.has(s.id)) scores[s.id] = 2;
      else if (circleShelters.has(s.id)) scores[s.id] = 1;
      else scores[s.id] = 0;
    }
    return scores;
  }, [currentUserId, applications, allShelters]);

  // Filter + sort the dog list. Sort applies to the filtered subset so
  // counts and ordering stay consistent.
  const filteredDogs = useMemo(
    () => applyDogsFilters(allDogs, filters),
    [allDogs, filters],
  );

  const sortedDogs = useMemo(() => {
    const dogs = filteredDogs.map((e) => e.dog);
    let sortedList: PetProfile[];
    switch (sortKey) {
      case "needs-walks":
        sortedList = sortByNeedsWalks(dogs);
        break;
      case "longest":
        sortedList = [...dogs].sort(
          (a, b) => (b.daysInKennel ?? 0) - (a.daysInKennel ?? 0),
        );
        break;
      case "smallest":
        sortedList = [...dogs].sort(
          (a, b) => parseWeight(a.weightLabel) - parseWeight(b.weightLabel),
        );
        break;
      case "alpha":
        sortedList = [...dogs].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    // Re-attach shelter context (lookups keyed off dog.id)
    const shelterByDog = new Map(filteredDogs.map((e) => [e.dog.id, e.shelter]));
    const attached = sortedList.map((dog) => ({ dog, shelter: shelterByDog.get(dog.id)! }));
    // Apply shelter-membership elevation as a stable secondary sort —
    // dogs from elevated shelters float to the top, preserving the
    // primary sort within each elevation bucket.
    return attached.sort((a, b) => {
      const ea = elevationByShelterId[a.shelter.id] ?? 0;
      const eb = elevationByShelterId[b.shelter.id] ?? 0;
      return eb - ea;
    });
  }, [filteredDogs, sortKey, elevationByShelterId]);

  const dogsCount = allDogs.length;
  const sheltersCount = allShelters.length;

  const VIEW_PILLS = [
    { key: "dogs", label: `Dogs · ${dogsCount}` },
    { key: "shelters", label: `Shelters · ${sheltersCount}` },
  ];

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <PageColumn hideHeader abovePanel={<DetailHeader backHref="/discover" title="Help a Dog" />}>
      <div className="page-column-panel-body" style={{ position: "relative" }}>
        {!showFilters && (
          <FilterPillRow
            pills={VIEW_PILLS}
            activeKey={view}
            onChange={(key) => {
              setView(key as ViewKey);
              setShowFilters(false);
            }}
          />
        )}

        {view === "dogs" && !showFilters && (
          <div className="help-a-dog-toolbar">
            <span className="help-a-dog-toolbar-label">Sort by</span>
            <SortMenu
              value={sortKey}
              options={SORT_OPTIONS}
              onChange={(v) => setSortKey(v as DogsSortKey)}
            />
          </div>
        )}

        {/* De-couple walking from adoption commitment — the single most-
            documented friction in this journey (Adoption-Curious Journey,
            2026-06-13; see Competitive Research - Adoption-Curious Journeys).
            Dynamic doorway reassurance: hidden for active walkers, dismissible
            for everyone else, introducing the roster below. */}
        {view === "dogs" && !showFilters && !isActiveWalker && !introDismissed && (
          <WalkIntroCard onDismiss={() => setIntroDismissed(true)} />
        )}

        {view === "dogs" ? (
          showFilters ? (
            <>
              <DogsFilterPanel filters={filters} onChange={(u) => setFilters((p) => ({ ...p, ...u }))} />
              <div className="discover-floating-btn">
                <ButtonAction
                  variant="primary"
                  size="md"
                  cta
                  leftIcon={<MagnifyingGlass size={16} weight="bold" />}
                  onClick={() => setShowFilters(false)}
                >
                  View {sortedDogs.length} {sortedDogs.length === 1 ? "result" : "results"}
                </ButtonAction>
              </div>
            </>
          ) : (
            <>
              <DogsResults results={sortedDogs} onResetFilters={resetFilters} />
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
          )
        ) : (
          <SheltersResults shelters={allShelters} elevationByShelterId={elevationByShelterId} />
        )}

        <Spacer size="sm" />
      </div>
    </PageColumn>
  );
}

export default function DiscoverHelpADogPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverHelpADogInner />
    </Suspense>
  );
}
