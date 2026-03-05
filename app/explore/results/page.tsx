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
import { ExploreFilterPanelDesktop } from "@/components/explore/ExploreFilterPanelDesktop";
import { ExploreFilterPanelMobile } from "@/components/explore/ExploreFilterPanelMobile";
import { defaultExploreFilters } from "@/lib/mockData";
import { fetchProviders } from "@/lib/data/providersClient";
import { getExploreRateBounds } from "@/lib/pricing";
import { buildQueryFromFilters, parseFiltersFromQuery } from "@/lib/query";
import { ExploreFilters, ProviderCard, ServiceType } from "@/lib/types";
import { Suspense } from "react";

const serviceNavLabels: Record<ServiceType, string> = {
  walk_checkin: "Walks & Check-ins",
  inhome_sitting: "In-home Sitting",
  boarding: "Boarding",
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
    label: "Walks & Check-ins",
    helper: "Short visits at your home",
    Icon: PersonSimpleWalk,
  },
  {
    value: "inhome_sitting",
    label: "In-home Sitting",
    helper: "Overnight care at your home",
    Icon: House,
  },
  {
    value: "boarding",
    label: "Boarding",
    helper: "Your dog stays with a trusted host",
    Icon: PawPrint,
  },
];

const resultsHeaderCopy: Record<ServiceType, { heading: string; subtitle: string }> = {
  walk_checkin: {
    heading: "Find dog walkers & check-ins",
    subtitle: "Add dates to see who's available for visits.",
  },
  inhome_sitting: {
    heading: "Find in-home sitters",
    subtitle: "Add dates to see sitters available at your home.",
  },
  boarding: {
    heading: "Find boarding hosts",
    subtitle: "Add dates to see hosts who can take your dog.",
  },
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

function ExploreResultsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
    const clampedMin = Math.max(bounds.min, Math.min(filters.minRate, bounds.max));
    const clampedMax = Math.max(clampedMin, Math.min(filters.maxRate, bounds.max));

    if (clampedMin !== filters.minRate || clampedMax !== filters.maxRate) {
      updateFilters({ minRate: clampedMin, maxRate: clampedMax });
    }
  }, [filters.service, filters.minRate, filters.maxRate, updateFilters]);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const serviceMatches = filters.service ? provider.services.includes(filters.service) : true;
      const priceMatches =
        provider.priceFrom >= filters.minRate && provider.priceFrom <= filters.maxRate;
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
                className="left-service-card"
                onClick={() => updateFilters({ service: value })}
              >
                <Icon size={20} weight="duotone" className="left-service-icon" />
                <div className="left-service-copy">
                  <strong>{label}</strong>
                  <span>{helper}</span>
                </div>
                <span className="left-service-caret" aria-hidden>
                  ›
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <section className={`explore-layout${!filters.service ? " explore-layout--landing" : ""}`}>
        {/* Filter sidebar — visible at >= 804px */}
        <div className="explore-filter-col">
          <ExploreFilterPanelDesktop
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
        </div>

        {/* Results list */}
        <div className="panel explore-results-panel">
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

        {/* Map — visible at >= 1024px only */}
        <aside className="panel explore-map-col explore-map-placeholder">
          <div className="explore-map-placeholder-inner">Map Placeholder (Static for V1)</div>
        </aside>
      </section>

      <ExploreFilterPanelMobile
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
