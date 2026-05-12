"use client";

import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import {
  Heart,
  MapPin,
  CaretDown,
  CaretRight,
  SlidersHorizontal,
  MagnifyingGlass,
  PawPrint,
  Footprints,
  House,
  Sun,
  Moon,
  Scissors,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
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
import { useCurrentUser, useCurrentUserId, useIsGuest } from "@/hooks/useCurrentUser";
import { useAuthGate } from "@/contexts/AuthGateContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { usePersistedState } from "@/lib/usePersistedState";
import { SERVICE_LABELS, SUB_SERVICES } from "@/lib/constants/services";
import type {
  CarerCareServiceConfig,
  DayOfWeek,
  HomeType,
  LeashPolicy,
  ProviderCard,
  ServiceType,
  TimeSlot,
  UserProfile,
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
  { key: "walks_checkins", label: "Walks" },
  { key: "house_sitting", label: "House sitting" },
  { key: "day_care", label: "Day care" },
  { key: "boarding", label: "Boarding" },
  { key: "appointment", label: "Appointment" },
];

/**
 * Long-form labels for the in-panel service-type dropdown (Care Catalog
 * Taxonomy 2026-05-11). The TYPE_TABS pill row uses the short "Walks"
 * variant; the dropdown trigger surfaces "Walks & Check-ins" because it's
 * acting as the panel's primary scope selector — full name reads better in
 * a commanding heading-style trigger than the abbreviated pill label.
 */
const TYPE_DROPDOWN_LABELS: Record<FilterPillKey, string> = {
  all: "All services",
  walks_checkins: "Walks & Check-ins",
  house_sitting: "House sitting",
  day_care: "Day care",
  boarding: "Boarding",
  appointment: "Appointment",
};

/**
 * Per-service one-line description that teaches the taxonomy at the moment
 * of choice (2026-05-11). Differentiates the four Care services on the
 * dimensions that actually differ — where (your home vs. carer's home)
 * and when (daytime vs. overnight). House sitting is the only "your home"
 * option, which the subline calls out explicitly; Day care + Boarding
 * share an "at the carer's home" suffix to teach the symmetry, with
 * Daytime/Overnight at the front for fast scan.
 *
 * Drift in the future where these strings need to feel current: re-read
 * the four-service decision in `lib/types.ts:ServiceType` JSDoc to make
 * sure the wording still maps to the underlying meanings.
 */
const TYPE_DROPDOWN_SUBLABELS: Record<FilterPillKey, string> = {
  all: "Show every service",
  walks_checkins: "Out and about with your dog",
  house_sitting: "Carer comes to your home",
  day_care: "Daytime at the carer's home",
  boarding: "Overnight at the carer's home",
  appointment: "Grooming or training visit",
};

/**
 * Service-type icons for the in-panel dropdown trigger + menu items. Each
 * icon evokes the temporal/spatial dimension of the service: outdoor
 * activity (Footprints), visit-at-owner's-home (House), daytime at carer's
 * (Sun), overnight at carer's (Moon), grooming/vet (Scissors), or no
 * scope (PawPrint, catch-all).
 */
const SERVICE_ICONS: Record<FilterPillKey, PhosphorIcon> = {
  all: PawPrint,
  walks_checkins: Footprints,
  house_sitting: House,
  day_care: Sun,
  boarding: Moon,
  appointment: Scissors,
};

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

/** Saved address — keyed entry the address picker offers. The viewer's
 *  primary neighbourhood seeds one entry; further entries arrive from
 *  saved-place plumbing in a future phase. */
interface SavedAddress {
  id: string;
  label: string;
  neighbourhood: string;
}

interface CareFilters {
  /** Pet IDs from the viewer's profile that should be considered for this
   *  booking. Drives the multi-pet capacity predicate (Day care + Boarding
   *  gate on `config.maxDogs`). For Walks + House sitting it's informational
   *  only — flows through to inquiry-form prefill. Care Catalog Taxonomy
   *  & Filter Redesign B1, 2026-05-10. */
  selectedPetIds: string[];
  /** Active address (id of a saved address). Drives the distance signal on
   *  cards and the `from-here` framing in result copy. Care Catalog
   *  Taxonomy B2, 2026-05-10. */
  addressId: string | null;
  /** Selected sub-services per active service. Multi-select inside the
   *  Sub-services accordion. When non-empty, gates carers whose configured
   *  `subServices` overlap with the selection. Care Catalog Taxonomy B3,
   *  2026-05-10. */
  selectedSubServices: string[];
  selectedDays: DayLabel2[];
  /** Coarse availability windows (morning/afternoon/evening). Resolved for
   *  good in Care Catalog Taxonomy B4 (2026-05-10) — the underlying
   *  `CarerAvailabilitySlot.slots` field is `TimeSlot[]` keyed by
   *  morning/afternoon/evening, so any finer-grained band would have to
   *  invent data the carer never entered. */
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
  // Service-aware (Day care / Boarding — at carer's home)
  homeType: HomeType[];
  hasOwnDogs: "any" | "yes" | "no";
  // Service-aware (Boarding only)
  hasYard: "any" | "yes";
}

const DEFAULT_FILTERS: CareFilters = {
  selectedPetIds: [],
  addressId: null,
  selectedSubServices: [],
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

    // Pets capacity gate (B1, 2026-05-10). Only Day care + Boarding configs
    // declare `maxDogs`; for those services, gate carers whose capacity can't
    // hold the viewer's selected pets. Walks + House sitting don't carry a
    // capacity field — selection is informational and flows through to
    // inquiry-form prefill. Treat undefined `maxDogs` as lenient (let
    // through) so unseeded data doesn't accidentally hide carers.
    if (
      filters.selectedPetIds.length > 0 &&
      (activeService === "day_care" || activeService === "boarding")
    ) {
      const cap = config?.maxDogs;
      if (cap !== undefined && cap < filters.selectedPetIds.length) return false;
    }

    // Sub-services gate (B3, 2026-05-10). When the owner has picked at least
    // one sub-service, the carer must offer at least one of those (intersection
    // semantics — picking "Solo walk" + "Group walk" widens, doesn't narrow).
    if (filters.selectedSubServices.length > 0) {
      if (!config) return false;
      const carerSet = new Set(config.subServices);
      const overlaps = filters.selectedSubServices.some((s) => carerSet.has(s));
      if (!overlaps) return false;
    }

    if (activeService === "walks_checkins") {
      if (filters.walkPace.length > 0) {
        if (!config?.pace || !filters.walkPace.includes(config.pace)) return false;
      }
      if (filters.leashPolicy.length > 0) {
        if (!config?.leashPolicy || !filters.leashPolicy.includes(config.leashPolicy)) return false;
      }
    }

    if (activeService === "day_care" || activeService === "boarding") {
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

/** Service-type dropdown — the in-panel scope selector that replaces the
 *  horizontal pill row while the filter panel is open (2026-05-11). The
 *  pill row overflows on narrow viewports with 6 options; inside the panel
 *  the service type is logically just another filter dimension. Sits
 *  under the "Filters" heading as the panel's primary commanding control
 *  (bigger padding + heading-style text + icon vs. the rest of the field
 *  rows) because changing it reshapes the rest of the panel (B6's
 *  service-aware field set). */
function ServiceTypeDropdown({
  selected,
  onSelect,
}: {
  selected: FilterPillKey;
  onSelect: (key: FilterPillKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = SERVICE_ICONS[selected];

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
            const ItemIcon = SERVICE_ICONS[key];
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

/** Saved-address picker dropdown. Closes on selection; selection is the only
 *  state. The map-dropper item is a stub (B2, 2026-05-10) — phase board
 *  acknowledges "even if the map is a stub" — wired to a no-op for now;
 *  a future phase replaces with a real chooser sheet. */
function AddressPicker({
  addresses,
  selectedId,
  onSelect,
}: {
  addresses: SavedAddress[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = addresses.find((a) => a.id === selectedId) ?? addresses[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm w-full text-left"
        style={{ padding: "var(--space-sm) var(--space-md)" }}
      >
        <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0" />
        <span className="font-body text-md text-fg-primary flex-1">
          {selected ? `${selected.label} · ${selected.neighbourhood}` : "Pick a starting point"}
        </span>
        <CaretDown size={16} weight="regular" className="text-fg-tertiary shrink-0" />
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 bg-surface-top border border-edge-stronger rounded-sm shadow-md flex flex-col"
          style={{ top: "100%", marginTop: "var(--space-xs)", zIndex: 20 }}
        >
          {addresses.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => { onSelect(a.id); setOpen(false); }}
              className="flex items-center gap-sm text-left hover:bg-surface-base"
              style={{ padding: "var(--space-sm) var(--space-md)" }}
            >
              <MapPin size={16} weight="light" className="text-fg-tertiary shrink-0" />
              <span className="flex flex-col">
                <span className="font-body text-md text-fg-primary">{a.label}</span>
                <span className="font-body text-sm text-fg-tertiary">{a.neighbourhood}</span>
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex items-center gap-sm text-left text-fg-tertiary border-t border-edge-regular hover:bg-surface-base"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
            title="Map picker is a stub for now (B2 deferred)"
          >
            <MapPin size={16} weight="light" className="shrink-0" />
            <span className="font-body text-md">Pin another place on map…</span>
          </button>
        </div>
      )}
    </div>
  );
}

function CareFilterPanel({
  pill,
  filters,
  onFiltersChange,
  onPillChange,
  viewer,
  isGuest,
}: {
  pill: FilterPillKey;
  filters: CareFilters;
  onFiltersChange: (update: Partial<CareFilters>) => void;
  onPillChange: (key: FilterPillKey) => void;
  viewer: UserProfile;
  /** Guest viewers see empty Pets + Nearby rows with AuthGate-routed CTAs —
   *  the viewer fallback would otherwise leak Tereza's pets and neighbourhood
   *  into the guest preview. D5 2026-05-11. */
  isGuest: boolean;
}) {
  const { requireAuth } = useAuthGate();
  // Rate bounds adapt to the active pill — see `getExploreRateBounds` for
  // per-service bands. When `pill === "all"` or `"appointment"`, we widen to
  // the full FILTER_RATE bounds so the slider doesn't clip.
  const rateBounds =
    pill === "walks_checkins" ||
    pill === "house_sitting" ||
    pill === "day_care" ||
    pill === "boarding"
      ? getExploreRateBounds(pill)
      : { min: FILTER_RATE_MIN_KC, max: FILTER_RATE_MAX_KC };

  // Service-aware visibility flags — drive which field groups render. House
  // sitting (carer goes to OWNER's home) does NOT show carer-home fields;
  // those live on Day care + Boarding (carer's home).
  const showWalkFields = pill === "walks_checkins";
  const showHomeFields = pill === "day_care" || pill === "boarding";
  const showYardField = pill === "boarding";

  // B5 evolved (2026-05-11): the "Filters" heading is now a plain H1; the
  // service scope moved into the ServiceTypeDropdown directly below it.
  // Earlier `{service} · Filters` heading combined two things into a static
  // string; the pill row overflowed on mobile. Folding both into a heading +
  // commanding-trigger pair resolves the overflow and keeps the panel
  // self-contained about its scope. Pill row at the page level hides while
  // the panel is open; reappears on close as the at-a-glance browse-by-
  // service affordance.

  // B3 (2026-05-10): sub-service options come from the canonical SUB_SERVICES
  // map in `lib/constants/services.ts`. Only render the accordion when a
  // specific Care pill is active — under "All" the union would be ambiguous,
  // and Appointment uses a separate category model.
  const subServiceOptions =
    pill === "all" || pill === "appointment" ? null : SUB_SERVICES[pill];

  // B2 (2026-05-10): saved addresses derive from the viewer's seeded
  // neighbourhood for now. Future-state: a saved-places list on the user
  // profile + a map-dropper modal. Keeping the array shape so plumbing
  // doesn't change when more entries arrive.
  const savedAddresses: SavedAddress[] = isGuest
    ? []
    : viewer.neighbourhood
      ? [{ id: "home", label: "Home", neighbourhood: viewer.neighbourhood }]
      : [];

  // Guests don't get the viewer-fallback's pets seeded into the chip row —
  // empty array forces the panel into the Add-a-dog empty state, with the
  // CTA routed below to AuthGate instead of the (Tereza-only) profile editor.
  const visiblePets = isGuest ? [] : viewer.pets;

  return (
    <div className="discover-hub-body" style={{ gap: "var(--space-xxl)" }}>
      <div className="flex flex-col gap-md">
        <h1 className="font-heading font-semibold text-fg-primary m-0" style={{ fontSize: "var(--text-xl)" }}>
          Filters
        </h1>
        <ServiceTypeDropdown selected={pill} onSelect={onPillChange} />
      </div>

      <div className="filter-field">
        <div className="label">Pets</div>
        {visiblePets.length === 0 ? (
          // B1 empty-state CTA (walkthrough B6, 2026-05-11): Inline add-pet
          // would need save plumbing — punted as a CTA to the canonical
          // profile editor. See punch list P65. Guests get the same shape
          // but the click opens AuthGate instead — there's no profile to
          // edit yet (D5 2026-05-11).
          isGuest ? (
            <button
              type="button"
              onClick={() => requireAuth("add your dog")}
              className="bg-surface-top border border-edge-stronger rounded-sm flex items-center gap-sm hover:bg-surface-base text-left"
              style={{ padding: "var(--space-sm) var(--space-md)" }}
            >
              <span className="font-body text-md text-fg-primary flex-1">Sign up to add your dog</span>
              <CaretRight size={16} weight="regular" className="text-brand-strong shrink-0" />
            </button>
          ) : (
            <Link
              href="/profile"
              className="bg-surface-top border border-edge-stronger rounded-sm flex items-center gap-sm hover:bg-surface-base"
              style={{ padding: "var(--space-sm) var(--space-md)" }}
            >
              <span className="font-body text-md text-fg-primary flex-1">Add a dog to your profile</span>
              <CaretRight size={16} weight="regular" className="text-brand-strong shrink-0" />
            </Link>
          )
        ) : (
          <div className="filter-pet-row">
            {visiblePets.map((pet) => (
              <label key={pet.id} className="filter-inline-check">
                <input
                  type="checkbox"
                  checked={filters.selectedPetIds.includes(pet.id)}
                  onChange={() => {
                    const next = filters.selectedPetIds.includes(pet.id)
                      ? filters.selectedPetIds.filter((x) => x !== pet.id)
                      : [...filters.selectedPetIds, pet.id];
                    onFiltersChange({ selectedPetIds: next });
                  }}
                />
                {pet.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter-field">
        <div className="label">Nearby</div>
        {savedAddresses.length === 0 ? (
          // B2 empty-state CTA (walkthrough B6, 2026-05-11): inline location
          // lookup would need geocoding — punted as a CTA to the canonical
          // profile editor. See punch list P65. Guests route through AuthGate
          // instead — there's no profile to edit yet (D5 2026-05-11).
          isGuest ? (
            <button
              type="button"
              onClick={() => requireAuth("set your neighbourhood")}
              className="bg-surface-top border border-edge-stronger rounded-sm flex items-center gap-sm hover:bg-surface-base text-left"
              style={{ padding: "var(--space-sm) var(--space-md)" }}
            >
              <span className="font-body text-md text-fg-primary flex-1">Sign up to set your neighbourhood</span>
              <CaretRight size={16} weight="regular" className="text-brand-strong shrink-0" />
            </button>
          ) : (
            <Link
              href="/profile"
              className="bg-surface-top border border-edge-stronger rounded-sm flex items-center gap-sm hover:bg-surface-base"
              style={{ padding: "var(--space-sm) var(--space-md)" }}
            >
              <span className="font-body text-md text-fg-primary flex-1">Add a neighbourhood to your profile</span>
              <CaretRight size={16} weight="regular" className="text-brand-strong shrink-0" />
            </Link>
          )
        ) : (
          <AddressPicker
            addresses={savedAddresses}
            selectedId={filters.addressId ?? "home"}
            onSelect={(id) => onFiltersChange({ addressId: id })}
          />
        )}
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

      {subServiceOptions && subServiceOptions.length > 0 && (
        <MultiChipFilter
          label="Sub-services"
          ariaLabel={`${SERVICE_LABELS[pill as ServiceType]} sub-services`}
          options={subServiceOptions.map((s) => ({ value: s, label: s }))}
          selected={filters.selectedSubServices}
          onChange={(next) => onFiltersChange({ selectedSubServices: next })}
        />
      )}

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
            <div className="label">Other dogs at home</div>
            <MultiSelectSegmentBar
              ariaLabel="Other dogs at carer's home"
              options={[
                { value: "yes", label: "With other dogs" },
                { value: "no", label: "Just my dog" },
              ]}
              selectedValues={filters.hasOwnDogs === "any" ? [] : [filters.hasOwnDogs]}
              onToggle={(value) => {
                // Single-select toggle — picking the active one deselects
                // back to the "any" default. Picking the other one switches.
                // Re-frames the original two-checkbox tri-state (any/yes/no)
                // as a single 2-option chip group + implicit default; matches
                // the other selectors' visual rhythm. Care Catalog walkthrough
                // 2026-05-11.
                onFiltersChange({
                  hasOwnDogs:
                    filters.hasOwnDogs === value ? "any" : (value as "yes" | "no"),
                });
              }}
              variant="filter"
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
  const isGuest = useIsGuest();

  const results = useMemo(() => {
    return providers.filter((p) => {
      // Hide the viewer's own card — you don't book yourself. Klára
      // viewing /discover/care shouldn't see Klára as a result. Surfaced
      // walkthrough C7, 2026-05-10.
      // Guests have no real identity — skip the self-exclude so Tereza's
      // card (the read-only fallback persona) still appears for guests.
      if (!isGuest && (p.userId ?? p.id) === currentUserId) return false;
      return applyAllFilters(p, filters, pill);
    });
  }, [pill, filters, currentUserId, isGuest]);

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
    // Guests have no circle — every card renders as marketplace. Reading
    // Tereza's connections (the read-only fallback) here would leak her
    // circle into the guest preview. D5 2026-05-11.
    if (isGuest) {
      return { inCircle, otherCarers: results };
    }
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
  }, [results, currentUserId, getConnection, isGuest]);

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
          <ResultsSectionHeader label="Carers in your circle" count={inCircle.length} variant="in-circle" />
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
  const viewer = useCurrentUser();
  const currentUserId = viewer.id;
  const isGuestVisitor = useIsGuest();
  const [activeType, setActiveType] = useState<FilterPillKey>("all");
  // Filters persist per-viewer (B1, 2026-05-10). Pets + address selection
  // are user-tied prefs that should survive refresh; service-context fields
  // (sub-services, day, time, etc.) ride along for free since they reset
  // with the pill anyway.
  const [filters, setFilters] = usePersistedState<CareFilters>(
    `doggo-care-filters-${currentUserId}`,
    DEFAULT_FILTERS,
  );
  const [showFilters, setShowFilters] = useState(false);

  // Resets the filters to defaults when the active pill changes — service-aware
  // fields from the previous pill don't make sense under a new one. Keeps pets,
  // address, days, and time-of-day across pills (those are universal context).
  // Sub-services reset because each service has its own SUB_SERVICES set
  // (B3, 2026-05-10).
  //
  // `closePanel` controls whether the filter panel auto-closes on change. The
  // page-level pill row passes `true` (tap a pill → see results); the in-panel
  // ServiceTypeDropdown passes `false` (changing scope keeps the user in the
  // filtering flow). Split 2026-05-11.
  const updateActiveType = (next: FilterPillKey, closePanel = true) => {
    setActiveType(next);
    if (closePanel) setShowFilters(false);
    setFilters((prev) => ({
      ...prev,
      selectedSubServices: [],
      walkPace: [],
      leashPolicy: [],
      homeType: [],
      hasOwnDogs: "any",
      hasYard: "any",
      // Reset price range to the new pill's bounds (or full bounds for non-Care pills).
      minRate:
        next === "walks_checkins" || next === "day_care" || next === "boarding"
          ? getExploreRateBounds(next).min
          : FILTER_RATE_MIN_KC,
      maxRate:
        next === "walks_checkins" || next === "day_care" || next === "boarding"
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
        {/* Pill row is the at-a-glance browse-by-service control on the
            results surface. Hidden while the filter panel is open
            (2026-05-11) because (a) it overflows on narrow viewports and
            (b) the ServiceTypeDropdown inside the panel takes over the
            scope-switching role with a more commanding treatment. */}
        {!showFilters && (
          <FilterPillRow
            pills={TYPE_TABS}
            activeKey={activeType}
            onChange={(key) => updateActiveType(key as FilterPillKey)}
          />
        )}

        {showFilters ? (
          <>
            <CareFilterPanel
              pill={activeType}
              filters={filters}
              onFiltersChange={(u) => setFilters((p) => ({ ...p, ...u }))}
              onPillChange={(key) => updateActiveType(key, false)}
              viewer={viewer}
              isGuest={isGuestVisitor}
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
