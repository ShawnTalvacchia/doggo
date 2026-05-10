"use client";

import { Suspense, useState, useMemo } from "react";
import {
  Heart,
  MapPin,
  Dog,
  SlidersHorizontal,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { Spacer } from "@/components/layout/Spacer";
import { FilterPillRow } from "@/components/ui/FilterPillRow";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { Slider } from "@/components/ui/Slider";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { CardExploreResult } from "@/components/explore/CardExploreResult";
import { ResultsSectionHeader } from "@/components/discover/ResultsSectionHeader";
import { getExploreRateBounds, FILTER_RATE_MIN_KC, FILTER_RATE_MAX_KC } from "@/lib/pricing";
import { providers } from "@/lib/mockData";
import { getUserById } from "@/lib/mockUsers";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useConnections } from "@/contexts/ConnectionsContext";
import type {
  CarerCareServiceConfig,
  DayOfWeek,
  HomeType,
  LeashPolicy,
  ProviderCard,
  ServiceType,
  TimeSlot,
  WalkPace,
} from "@/lib/types";

/* ── Filter pill row ─────────────────────────────────────────────────────── */

/**
 * Filter pill keys. `"all"` plus every `ServiceType` member, plus
 * `"appointment"` (Discover Refinement D1, 2026-05-10) for vet/grooming
 * offerings that don't fit the Care `ServiceType` enum. Future expansion
 * could split Appointment into Vet/Grooming pills once we have more than
 * a handful of vet-only providers.
 */
type FilterPillKey = "all" | ServiceType | "appointment";

const TYPE_TABS: { key: FilterPillKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "walk_checkin", label: "Walks" },
  { key: "inhome_sitting", label: "Sitting" },
  { key: "boarding", label: "Boarding" },
  { key: "appointment", label: "Appointment" },
];

/* ── Day + slot maps ─────────────────────────────────────────────────────── */

// Two-letter codes used in the day chip row, mapped to 3-letter `DayOfWeek`
// values stored on `CarerAvailabilitySlot`. Sunday-first ordering matches
// existing UI convention. `DAY_LABELS_2` powers the chip labels; `DAY_TO_DOW`
// powers predicate evaluation.
const DAY_LABELS_2 = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
type DayLabel2 = typeof DAY_LABELS_2[number];

const DAY_TO_DOW: Record<DayLabel2, DayOfWeek> = {
  Su: "Sun", Mo: "Mon", Tu: "Tue", We: "Wed", Th: "Thu", Fr: "Fri", Sa: "Sat",
};

const TIME_SLOTS: { value: TimeSlot; label: string }[] = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

/* ── Service-aware filter dimensions ─────────────────────────────────────── */

const PACE_OPTIONS: { value: WalkPace; label: string }[] = [
  { value: "leisurely", label: "Leisurely" },
  { value: "moderate", label: "Moderate" },
  { value: "brisk", label: "Brisk" },
];

const LEASH_OPTIONS: { value: LeashPolicy; label: string }[] = [
  { value: "always", label: "Always on leash" },
  { value: "off_leash_areas", label: "Off-leash areas OK" },
  { value: "case_by_case", label: "Case by case" },
];

const HOME_OPTIONS: { value: HomeType; label: string }[] = [
  { value: "flat", label: "Flat" },
  { value: "house", label: "House" },
  { value: "ground_floor_with_garden", label: "Ground floor + garden" },
];

/* ── Filter state ────────────────────────────────────────────────────────── */

interface CareFilters {
  selectedDays: DayLabel2[];
  /** Coarse availability windows (morning/afternoon/evening). Discover
   *  Refinement E2, 2026-05-10. */
  selectedSlots: TimeSlot[];
  /** Inquiry-shape preset: a one-off booking vs a repeat weekly arrangement.
   *  Doesn't restrict the carer list (most carers do both); flows through
   *  to inquiry-form prefill when an inquiry opens from this page. */
  visitMode: "one_time" | "repeat";
  minRate: number;
  maxRate: number;
  // Service-aware (Walks)
  walkPace: WalkPace[];
  leashPolicy: LeashPolicy[];
  // Service-aware (Sitting / Boarding)
  homeType: HomeType[];
  hasOwnDogs: "any" | "yes" | "no";
  // Service-aware (Boarding only)
  hasYard: "any" | "yes";
}

const DEFAULT_FILTERS: CareFilters = {
  selectedDays: [],
  selectedSlots: [],
  visitMode: "repeat",
  minRate: FILTER_RATE_MIN_KC,
  maxRate: FILTER_RATE_MAX_KC,
  walkPace: [],
  leashPolicy: [],
  homeType: [],
  hasOwnDogs: "any",
  hasYard: "any",
};

/* ── Filter predicates ───────────────────────────────────────────────────── */

function matchesPillFilter(provider: ProviderCard, key: FilterPillKey): boolean {
  if (key === "all") return true;
  if (key === "appointment") return (provider.appointmentTypes?.length ?? 0) > 0;
  return provider.services.includes(key);
}

/** Resolve the price the card will display under the active filter — same
 *  logic as `CardExploreResult.resolveDisplayPrice` but ahead-of-render so
 *  the price-range filter compares against the same number the user sees. */
function resolveListedPrice(provider: ProviderCard, activeService: ServiceType | null): number {
  if (!activeService) return provider.priceFrom;
  const seeded = provider.pricesByService?.[activeService];
  if (seeded) return seeded.priceFrom;
  if (provider.userId) {
    const user = getUserById(provider.userId);
    const match = user?.carerProfile?.services?.find(
      (s): s is CarerCareServiceConfig => s.kind === "care" && s.serviceType === activeService,
    );
    if (match) return match.pricePerUnit;
  }
  return provider.priceFrom;
}

/** Look up the service-aware Care config for the active service pill on a
 *  carer's bridged UserProfile. Returns null when not applicable (no bridge,
 *  no matching service, or active service isn't a Care subtype). */
function carerServiceConfig(
  provider: ProviderCard,
  service: ServiceType,
): CarerCareServiceConfig | null {
  if (!provider.userId) return null;
  const user = getUserById(provider.userId);
  const match = user?.carerProfile?.services?.find(
    (s): s is CarerCareServiceConfig => s.kind === "care" && s.serviceType === service,
  );
  return match ?? null;
}

function applyAllFilters(
  provider: ProviderCard,
  filters: CareFilters,
  pill: FilterPillKey,
): boolean {
  // Pill filter (top of the page) — already exists.
  if (!matchesPillFilter(provider, pill)) return false;

  const activeService: ServiceType | null =
    pill === "all" || pill === "appointment" ? null : pill;

  // Price range — compare against the displayed price under the active pill.
  const price = resolveListedPrice(provider, activeService);
  if (price < filters.minRate || price > filters.maxRate) return false;

  // Days / slots — compare against bridged availability. When the carer
  // has no bridged UserProfile (synthesis fallback), skip these predicates
  // (no data to filter on; treat as eligible). The bridge is now complete
  // for every directory entry, so this fallback should never fire today.
  const user = provider.userId ? getUserById(provider.userId) : undefined;
  const availability = user?.carerProfile?.availability ?? [];

  if (filters.selectedDays.length > 0 && availability.length > 0) {
    const wantDays = new Set(filters.selectedDays.map((d) => DAY_TO_DOW[d]));
    const hasMatchingDay = availability.some((slot) => wantDays.has(slot.day));
    if (!hasMatchingDay) return false;
  }

  if (filters.selectedSlots.length > 0 && availability.length > 0) {
    const wantSlots = new Set(filters.selectedSlots);
    const hasMatchingSlot = availability.some((slot) =>
      slot.slots.some((s) => wantSlots.has(s)),
    );
    if (!hasMatchingSlot) return false;
  }

  // Service-aware predicates only apply when a specific Care pill is active
  // and the carer has a config for that service.
  if (activeService) {
    const config = carerServiceConfig(provider, activeService);

    if (activeService === "walk_checkin") {
      if (filters.walkPace.length > 0) {
        if (!config?.pace || !filters.walkPace.includes(config.pace)) return false;
      }
      if (filters.leashPolicy.length > 0) {
        if (!config?.leashPolicy || !filters.leashPolicy.includes(config.leashPolicy)) return false;
      }
    }

    if (activeService === "inhome_sitting" || activeService === "boarding") {
      if (filters.homeType.length > 0) {
        if (!config?.homeType || !filters.homeType.includes(config.homeType)) return false;
      }
      if (filters.hasOwnDogs !== "any") {
        const wantOwnDogs = filters.hasOwnDogs === "yes";
        if (config?.hasOwnDogs !== wantOwnDogs) return false;
      }
    }

    if (activeService === "boarding") {
      if (filters.hasYard === "yes") {
        if (config?.hasYard !== true) return false;
      }
    }
  }

  return true;
}

/* ── Filter panel ────────────────────────────────────────────────────────── */

/**
 * Generic multi-select chip group built from `MultiSelectSegmentBar`. Used
 * for Pace, Leash, Home type — repeats the same shape three times in the
 * service-aware section.
 */
function MultiChipFilter<T extends string>({
  label,
  ariaLabel,
  options,
  selected,
  onChange,
}: {
  label: string;
  ariaLabel: string;
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  return (
    <div className="filter-field">
      <div className="label">{label}</div>
      <MultiSelectSegmentBar
        ariaLabel={ariaLabel}
        options={options as { value: string; label: string }[]}
        selectedValues={selected}
        onToggle={(value) => {
          const v = value as T;
          onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
        }}
        variant="filter"
      />
    </div>
  );
}

function CareFilterPanel({
  pill,
  filters,
  onFiltersChange,
}: {
  pill: FilterPillKey;
  filters: CareFilters;
  onFiltersChange: (update: Partial<CareFilters>) => void;
}) {
  // Rate bounds adapt to the active pill — Walks are 150–900, Sitting
  // 500–1800, Boarding 450–1600. When `pill === "all"` or `"appointment"`,
  // we widen to the full FILTER_RATE bounds so the slider doesn't clip.
  const rateBounds =
    pill === "walk_checkin" || pill === "inhome_sitting" || pill === "boarding"
      ? getExploreRateBounds(pill)
      : { min: FILTER_RATE_MIN_KC, max: FILTER_RATE_MAX_KC };

  // Service-aware visibility flags — drive which field groups render.
  const showWalkFields = pill === "walk_checkin";
  const showHomeFields = pill === "inhome_sitting" || pill === "boarding";
  const showYardField = pill === "boarding";

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
          options={DAY_LABELS_2.map((day) => ({ value: day, label: day }))}
          selectedValues={filters.selectedDays}
          onToggle={(day) => {
            const d = day as DayLabel2;
            onFiltersChange({
              selectedDays: filters.selectedDays.includes(d)
                ? filters.selectedDays.filter((x) => x !== d)
                : [...filters.selectedDays, d],
            });
          }}
          variant="filter"
        />
      </div>

      <MultiChipFilter
        label="Time of day"
        ariaLabel="Availability windows"
        options={TIME_SLOTS}
        selected={filters.selectedSlots}
        onChange={(next) => onFiltersChange({ selectedSlots: next })}
      />

      <div className="filter-field">
        <div className="label">Price range</div>
        <Slider
          dual
          min={rateBounds.min}
          max={rateBounds.max}
          step={50}
          minValue={filters.minRate}
          maxValue={filters.maxRate}
          onMinChange={(v) => onFiltersChange({ minRate: v })}
          onMaxChange={(v) => onFiltersChange({ maxRate: v })}
        />
        <div className="filter-minmax-row">
          <div className="filter-field">
            <div className="label">Min. per session</div>
            <input
              className="input"
              type="number"
              min={rateBounds.min}
              max={rateBounds.max}
              value={filters.minRate}
              onChange={(e) => {
                const v = Math.min(
                  Math.max(Number(e.target.value) || rateBounds.min, rateBounds.min),
                  filters.maxRate,
                );
                onFiltersChange({ minRate: v });
              }}
            />
          </div>
          <div className="filter-field">
            <div className="label">Max. per session</div>
            <input
              className="input"
              type="number"
              min={rateBounds.min}
              max={rateBounds.max}
              value={filters.maxRate}
              onChange={(e) => {
                const v = Math.max(
                  Math.min(Number(e.target.value) || rateBounds.max, rateBounds.max),
                  filters.minRate,
                );
                onFiltersChange({ maxRate: v });
              }}
            />
          </div>
        </div>
      </div>

      {/* Service-aware section (Discover Refinement E3, 2026-05-10).
          Field set changes with the active pill so the trust dimensions
          for each service type teach themselves through the UI. */}
      {showWalkFields && (
        <>
          <MultiChipFilter
            label="Walk pace"
            ariaLabel="Walk pace"
            options={PACE_OPTIONS}
            selected={filters.walkPace}
            onChange={(next) => onFiltersChange({ walkPace: next })}
          />
          <MultiChipFilter
            label="Leash policy"
            ariaLabel="Leash policy"
            options={LEASH_OPTIONS}
            selected={filters.leashPolicy}
            onChange={(next) => onFiltersChange({ leashPolicy: next })}
          />
        </>
      )}

      {showHomeFields && (
        <>
          <MultiChipFilter
            label="Home setting"
            ariaLabel="Home setting"
            options={HOME_OPTIONS}
            selected={filters.homeType}
            onChange={(next) => onFiltersChange({ homeType: next })}
          />
          <div className="filter-field">
            <CheckboxRow
              label="Carer has their own dogs"
              checked={filters.hasOwnDogs === "yes"}
              onChange={(checked) =>
                onFiltersChange({ hasOwnDogs: checked ? "yes" : "any" })
              }
              placement="right"
            />
            <CheckboxRow
              label="No own dogs (your dog is the only one)"
              checked={filters.hasOwnDogs === "no"}
              onChange={(checked) =>
                onFiltersChange({ hasOwnDogs: checked ? "no" : "any" })
              }
              placement="right"
            />
          </div>
        </>
      )}

      {showYardField && (
        <div className="filter-field">
          <CheckboxRow
            label="Has a yard or garden"
            checked={filters.hasYard === "yes"}
            onChange={(checked) =>
              onFiltersChange({ hasYard: checked ? "yes" : "any" })
            }
            placement="right"
          />
        </div>
      )}

      <Spacer size="sm" />
    </div>
  );
}

/* ── Results ─────────────────────────────────────────────────────────────── */

function CareResultsList({
  pill,
  filters,
}: {
  pill: FilterPillKey;
  filters: CareFilters;
}) {
  const currentUserId = useCurrentUserId();
  const { getConnection } = useConnections();

  const results = useMemo(() => {
    return providers.filter((p) => {
      // Hide the viewer's own card — you don't book yourself. Klára
      // viewing /discover/care shouldn't see Klára as a result. Surfaced
      // walkthrough C7, 2026-05-10.
      if ((p.userId ?? p.id) === currentUserId) return false;
      return applyAllFilters(p, filters, pill);
    });
  }, [pill, filters, currentUserId]);

  // Active service drives per-service price resolution + service-tag suppression
  // on `CardExploreResult`. Pricing & Proposals, 2026-05-04. The "appointment"
  // filter pill is its own category (not a Care `ServiceType`); the card's
  // per-service pricing logic falls through to the bridged appointment
  // offering when this is set.
  const activeService: ServiceType | null =
    pill === "all" || pill === "appointment" ? null : pill;
  const activeFilterCategory = pill === "appointment" ? "appointment" : null;

  // Community-first split: Carers in the viewer's circle (Connected or
  // Familiar from viewer→carer direction) render in a top section with
  // softer card chrome; everyone else renders below as the broader
  // marketplace. Discover Refinement C1, 2026-05-10.
  //
  // We resolve through ConnectionsContext.getConnection so session
  // overrides (Familiar marks made during the demo) reflect in the
  // ordering immediately, not just on next page reload.
  const { inCircle, otherCarers } = useMemo(() => {
    const inCircle: ProviderCard[] = [];
    const other: ProviderCard[] = [];
    for (const p of results) {
      const profileId = p.userId ?? p.id;
      const conn = getConnection(profileId, currentUserId);
      if (conn?.state === "connected" || conn?.state === "familiar") {
        inCircle.push(p);
      } else {
        other.push(p);
      }
    }
    return { inCircle, otherCarers: other };
  }, [results, currentUserId, getConnection]);

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-md p-xl text-center">
        <Heart size={40} weight="light" className="text-fg-tertiary" />
        <p className="text-sm text-fg-secondary m-0" style={{ maxWidth: 320 }}>
          No carers in your circle yet for these filters. Find your park, attend a walk, see who&apos;s around — your community is how you find people you can trust.
        </p>
        <div className="flex gap-sm">
          <ButtonAction variant="secondary" size="sm" href="/discover/groups">Find a park</ButtonAction>
          <ButtonAction variant="secondary" size="sm" href="/discover/meets">Browse meets</ButtonAction>
        </div>
      </div>
    );
  }

  // When the viewer has at least one in-circle Carer, render the
  // community-first split. When the circle is empty, fall through to a
  // single flat marketplace list — section headers would just add noise
  // (a header with one section beneath isn't carrying any information).
  const showSplit = inCircle.length > 0;

  return (
    <>
      {showSplit && (
        <>
          <ResultsSectionHeader label="Carers in your circle" count={inCircle.length} />
          {inCircle.map((p) => (
            <CardExploreResult
              key={p.id}
              provider={p}
              activeService={activeService}
              activeFilterCategory={activeFilterCategory}
              variant="in-circle"
            />
          ))}
          {otherCarers.length > 0 && (
            <ResultsSectionHeader label="Other carers" count={otherCarers.length} />
          )}
        </>
      )}
      {otherCarers.map((p) => (
        <CardExploreResult
          key={p.id}
          provider={p}
          activeService={activeService}
          activeFilterCategory={activeFilterCategory}
        />
      ))}
    </>
  );
}

/* ── Main page ── */

function DiscoverCareInner() {
  const currentUserId = useCurrentUserId();
  const [activeType, setActiveType] = useState<FilterPillKey>("all");
  const [filters, setFilters] = useState<CareFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  // Resets the filters to defaults when the active pill changes — service-aware
  // fields from the previous pill don't make sense under a new one. Keeps days
  // and time-of-day across pills (those are universal).
  const updateActiveType = (next: FilterPillKey) => {
    setActiveType(next);
    setShowFilters(false);
    setFilters((prev) => ({
      ...prev,
      walkPace: [],
      leashPolicy: [],
      homeType: [],
      hasOwnDogs: "any",
      hasYard: "any",
      // Reset price range to the new pill's bounds (or full bounds for non-Care pills).
      minRate:
        next === "walk_checkin" || next === "inhome_sitting" || next === "boarding"
          ? getExploreRateBounds(next).min
          : FILTER_RATE_MIN_KC,
      maxRate:
        next === "walk_checkin" || next === "inhome_sitting" || next === "boarding"
          ? getExploreRateBounds(next).max
          : FILTER_RATE_MAX_KC,
    }));
  };

  const resultCount = useMemo(() => {
    return providers.filter((p) => {
      // Mirror the self-exclusion in `CareResultsList.results` so the
      // floating "View N results" count stays consistent with the actual
      // rendered list.
      if ((p.userId ?? p.id) === currentUserId) return false;
      return applyAllFilters(p, filters, activeType);
    }).length;
  }, [activeType, filters, currentUserId]);

  return (
    <PageColumn hideHeader abovePanel={<DetailHeader backHref="/discover" title="Dog Care" />}>
      <div className="page-column-panel-body" style={{ position: "relative" }}>
        <FilterPillRow
          pills={TYPE_TABS}
          activeKey={activeType}
          onChange={(key) => updateActiveType(key as FilterPillKey)}
        />

        {showFilters ? (
          <>
            <CareFilterPanel
              pill={activeType}
              filters={filters}
              onFiltersChange={(u) => setFilters((p) => ({ ...p, ...u }))}
            />
            <div className="discover-floating-btn">
              <ButtonAction variant="primary" size="md" cta leftIcon={<MagnifyingGlass size={16} weight="bold" />} onClick={() => setShowFilters(false)}>
                View {resultCount} {resultCount === 1 ? "result" : "results"}
              </ButtonAction>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col"><CareResultsList pill={activeType} filters={filters} /></div>
            <div className="discover-floating-btn">
              {/* Primary variant on both states (Filters / View N results)
                  per walkthrough C1 (2026-05-10) — only one floating button
                  is ever on screen at a time, so the old "secondary on
                  results, primary on panel" hierarchy was making the entry
                  point fade into the background without any actual
                  hierarchy benefit. Each state's button is the surface's
                  one primary action. */}
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

export default function DiscoverCarePage() {
  return <Suspense fallback={null}><DiscoverCareInner /></Suspense>;
}
