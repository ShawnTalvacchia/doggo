"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CaretLeft,
  House,
  PawPrint,
  PersonSimpleWalk,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import { CardExploreResult } from "@/components/explore/CardExploreResult";
import MapView from "@/components/explore/MapView";
import { FilterPanelDesktop } from "@/components/explore/FilterPanelDesktop";
import { FilterPanelMobile } from "@/components/explore/FilterPanelMobile";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { defaultExploreFilters } from "@/lib/mockData";
import { fetchProviders } from "@/lib/data/providersClient";
import { getExploreRateBounds } from "@/lib/pricing";
import { buildQueryFromFilters, parseFiltersFromQuery } from "@/lib/query";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { ExploreFilters, ProviderCard, ServiceType } from "@/lib/types";
import { Suspense } from "react";
import { getCommunityCarers, getConnectionState } from "@/lib/mockConnections";
import Link from "next/link";
import { Handshake } from "@phosphor-icons/react";

const serviceNavLabels: Record<ServiceType, string> = {
  walk_checkin: SERVICE_LABELS.walk_checkin,
  inhome_sitting: SERVICE_LABELS.inhome_sitting,
  boarding: SERVICE_LABELS.boarding,
};

// Service options for the mobile landing chooser
const mobileServiceOptions: {
  value: ServiceType;
  label: string;
  helper: string;
  Icon: typeof PersonSimpleWalk;
}[] = [
  {
    value: "walk_checkin",
    label: SERVICE_LABELS.walk_checkin,
    helper: "Short visits at your home",
    Icon: PersonSimpleWalk,
  },
  {
    value: "inhome_sitting",
    label: SERVICE_LABELS.inhome_sitting,
    helper: "Overnight care at your home",
    Icon: House,
  },
  {
    value: "boarding",
    label: SERVICE_LABELS.boarding,
    helper: "Your dog stays with a trusted host",
    Icon: PawPrint,
  },
];

const resultsHeaderCopy: Record<ServiceType, { heading: string; subtitle: string }> = {
  walk_checkin: {
    heading: "Find dog walkers & check-ins",
    subtitle: "Add date filters to see who's available for visits",
  },
  inhome_sitting: {
    heading: "Find in-home sitters",
    subtitle: "Add date filters to see who's available for visits",
  },
  boarding: {
    heading: "Find boarding hosts",
    subtitle: "Add date filters to see who's available for visits",
  },
};

const expectedPriceUnitByService: Record<ServiceType, ProviderCard["priceUnit"]> = {
  walk_checkin: "per_walk",
  inhome_sitting: "per_night",
  boarding: "per_night",
};

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="results-empty-state">
      <PawPrint size={44} weight="duotone" className="results-empty-icon" />
      <p className="results-empty-heading">No providers found</p>
      <p className="results-empty-body">
        Try widening your price range or removing time filters to see more providers.
      </p>
      <button className="btn btn-secondary results-empty-cta" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}

function ResultCardSkeleton() {
  return (
    <div className="result-card result-card-skeleton" aria-hidden>
      <div className="result-head">
        <div className="skeleton skeleton-circle result-skeleton-avatar" />
        <div className="result-skeleton-main">
          <div className="skeleton skeleton-text result-skeleton-line-52" />
          <div className="skeleton skeleton-text result-skeleton-line-36" />
          <div className="skeleton skeleton-text result-skeleton-line-24" />
        </div>
        <div className="result-skeleton-price">
          <div className="skeleton skeleton-text result-skeleton-line-36px" />
          <div className="skeleton skeleton-text result-skeleton-line-72px" />
          <div className="skeleton skeleton-text result-skeleton-line-48px" />
        </div>
      </div>
      <div className="skeleton skeleton-text result-skeleton-line-88" />
    </div>
  );
}

function withMergedFilters(current: URLSearchParams): ExploreFilters {
  const parsed = parseFiltersFromQuery(current);
  return {
    ...defaultExploreFilters,
    ...parsed,
    minRate: parsed.minRate ?? defaultExploreFilters.minRate,
    maxRate: parsed.maxRate ?? defaultExploreFilters.maxRate,
    service: parsed.service ?? defaultExploreFilters.service,
    times: parsed.times ?? defaultExploreFilters.times,
  };
}

function CommunityCarersSection({ service }: { service: ServiceType | null }) {
  const carers = getCommunityCarers().filter(
    (c) => c.state === "connected" && (!service || c.services.includes(service))
  );
  if (carers.length === 0) return null;

  return (
    <div className="p-md" style={{ borderBottom: "1px solid var(--border-light)" }}>
      <h3 className="flex items-center gap-xs text-sm font-semibold text-fg-primary mb-sm">
        <Handshake size={16} weight="light" className="text-brand-main" />
        From your community
      </h3>
      <div className="flex flex-col gap-sm">
        {carers.map((carer) => (
          <Link
            key={carer.userId}
            href={`/profile/${carer.userId}`}
            className="flex items-center gap-md rounded-panel p-sm"
            style={{
              background: "var(--surface-top)",
              textDecoration: "none",
              border: "1px solid var(--border-light)",
            }}
          >
            <img
              src={carer.avatarUrl}
              alt={carer.userName}
              className="rounded-full"
              style={{ width: 40, height: 40, objectFit: "cover" }}
            />
            <div className="flex flex-col flex-1 gap-xs">
              <span className="text-sm font-medium text-fg-primary">{carer.userName}</span>
              <span className="text-xs text-fg-tertiary">
                {carer.meetsShared} meets together · {carer.services.map((s) => SERVICE_LABELS[s]).join(", ")}
              </span>
            </div>
            <span className="text-xs text-fg-tertiary">from {carer.priceFrom} Kč</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ExploreResultsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showResultsPanel, setShowResultsPanel] = useState(false);
  const [providers, setProviders] = useState<ProviderCard[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);

  const filters = useMemo(
    () => withMergedFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const navLabel = filters.service
    ? (serviceNavLabels[filters.service] ?? "Find providers")
    : "Find providers";

  useEffect(() => {
    let cancelled = false;
    const loadProviders = async () => {
      try {
        const data = await fetchProviders();
        if (!cancelled) setProviders(data);
      } catch {
        if (!cancelled) setProviders([]);
      } finally {
        if (!cancelled) setIsLoadingProviders(false);
      }
    };
    loadProviders();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateFilters = useCallback(
    (next: Partial<ExploreFilters>) => {
      const merged = { ...filters, ...next };
      const query = buildQueryFromFilters(merged);
      router.replace(`${pathname}?${query}`);
    },
    [filters, pathname, router],
  );

  useEffect(() => {
    const bounds = getExploreRateBounds(filters.service);
    let nextMin = filters.minRate;
    let nextMax = filters.maxRate;

    if (nextMin < bounds.min || nextMin > bounds.max) nextMin = bounds.min;
    if (nextMax < bounds.min || nextMax > bounds.max) nextMax = bounds.max;

    if (nextMin > nextMax) {
      nextMin = bounds.min;
      nextMax = bounds.max;
    }

    if (nextMin !== filters.minRate || nextMax !== filters.maxRate) {
      updateFilters({ minRate: nextMin, maxRate: nextMax });
    }
  }, [filters.service, filters.minRate, filters.maxRate, updateFilters]);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const serviceMatches = filters.service ? provider.services.includes(filters.service) : true;
      const expectedUnit = filters.service ? expectedPriceUnitByService[filters.service] : null;
      const hasComparablePrice = !expectedUnit || provider.priceUnit === expectedUnit;
      // Keep legacy rows visible when service/price-unit data is inconsistent (e.g. boarding
      // provider with an old per_walk summary price). This prevents empty states caused by
      // stale seed/prototype data while preserving rate filtering for comparable prices.
      const priceMatches = hasComparablePrice
        ? provider.priceFrom >= filters.minRate && provider.priceFrom <= filters.maxRate
        : true;
      const timesMatches =
        filters.times.length === 0 ||
        !provider.availableTimes ||
        filters.times.some((t) => provider.availableTimes!.includes(t));
      return serviceMatches && priceMatches && timesMatches;
    });
  }, [providers, filters]);

  const clearFilters = () => {
    updateFilters({
      minRate: defaultExploreFilters.minRate,
      maxRate: defaultExploreFilters.maxRate,
      times: [],
    });
  };

  const onTimeToggle = (value: "6-11" | "11-15" | "15-22") => {
    if (filters.times.includes(value)) {
      updateFilters({ times: filters.times.filter((t) => t !== value) });
      return;
    }
    updateFilters({ times: [...filters.times, value] });
  };

  return (
    <main className="explore-page">
      {/* ── Mobile sub-nav ── only rendered when a service is selected */}
      {filters.service && (
        <div className="explore-subnav">
          <button className="explore-subnav-back" onClick={() => router.push("/explore/results")}>
            <CaretLeft size={16} weight="bold" />
            <span>{navLabel}</span>
          </button>
          <button className="explore-subnav-filter" onClick={() => setMobileFiltersOpen(true)}>
            Filter <SlidersHorizontal size={14} weight="bold" />
          </button>
        </div>
      )}

      {/* ── Mobile service chooser ── shown at < 804px when no service selected */}
      {!filters.service && (
        <div className="mobile-service-chooser">
          <h2 className="mobile-service-chooser-title">Choose how care is provided</h2>
          <div className="mobile-service-list">
            {mobileServiceOptions.map(({ value, label, helper, Icon }) => (
              <button
                key={value}
                className="filter-service-card"
                onClick={() => updateFilters({ service: value })}
              >
                <Icon size={20} weight="duotone" className="filter-service-icon" />
                <div className="filter-service-copy">
                  <strong>{label}</strong>
                  <span>{helper}</span>
                </div>
                <span className="filter-service-caret" aria-hidden>
                  ›
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <section
        className={[
          "explore-layout",
          !filters.service ? "explore-layout--landing" : "",
          showResultsPanel ? "explore-layout--results" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Filter sidebar */}
        <div className="explore-filter-col">
          <FilterPanelDesktop
            filters={filters}
            onServiceChange={(service) => updateFilters({ service })}
            onMinRateChange={(minRate) => updateFilters({ minRate })}
            onMaxRateChange={(maxRate) => updateFilters({ maxRate })}
            onTimeToggle={onTimeToggle}
            onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
            onStartDateChange={(startDate) =>
              updateFilters({ dateRange: { ...filters.dateRange, start: startDate } })
            }
            footer={
              filters.service ? (
                <div className="explore-view-results-footer">
                  <ButtonAction
                    variant="primary"
                    size="md"
                    onClick={() => setShowResultsPanel(true)}
                  >
                    View Results
                  </ButtonAction>
                </div>
              ) : undefined
            }
          />
        </div>

        {/* Results list */}
        <div className="panel explore-results-panel">
          {/* Back-to-filters button — visible at intermediate breakpoint only */}
          <button
            type="button"
            className="explore-results-back"
            onClick={() => setShowResultsPanel(false)}
          >
            <CaretLeft size={14} weight="bold" />
            <span>Filters</span>
          </button>
          <div className="panel-content explore-results-header">
            <strong>
              {filters.service
                ? resultsHeaderCopy[filters.service].heading
                : "Find dog care in Prague"}
            </strong>
            <span className="explore-results-subtitle">
              {filters.service
                ? resultsHeaderCopy[filters.service].subtitle
                : "Choose a service type to see matching providers."}
            </span>
          </div>
          <div className="results-list">
            {/* Community carers section */}
            <CommunityCarersSection service={filters.service} />
            {isLoadingProviders && (
              <>
                <ResultCardSkeleton />
                <ResultCardSkeleton />
                <ResultCardSkeleton />
              </>
            )}
            {!isLoadingProviders &&
              filteredProviders.map((provider) => (
                <CardExploreResult
                  key={provider.id}
                  provider={provider}
                  activeService={filters.service}
                  returnQuery={searchParams.toString()}
                />
              ))}
            {!isLoadingProviders && filteredProviders.length === 0 && filters.service && (
              <EmptyState onClear={clearFilters} />
            )}
          </div>
        </div>

        {/* Interactive map — visible at >= 1024px only */}
        <aside className="panel explore-map-col">
          <MapView providers={filteredProviders} service={filters.service} />
        </aside>
      </section>

      <FilterPanelMobile
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        onServiceChange={(service) => updateFilters({ service })}
        onMinRateChange={(minRate) => updateFilters({ minRate })}
        onMaxRateChange={(maxRate) => updateFilters({ maxRate })}
        onTimeToggle={onTimeToggle}
        onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
        onStartDateChange={(startDate) =>
          updateFilters({ dateRange: { ...filters.dateRange, start: startDate } })
        }
      />
    </main>
  );
}

export default function ExploreResultsPage() {
  return (
    <Suspense
      fallback={<main className="explore-page explore-loading-fallback">Loading results…</main>}
    >
      <ExploreResultsContent />
    </Suspense>
  );
}
