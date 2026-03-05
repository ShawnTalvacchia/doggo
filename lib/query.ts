import { defaultExploreFilters } from "@/lib/mockData";
import { ExploreFilters, ServiceType } from "@/lib/types";

const SERVICE_VALUES = new Set<ServiceType>(["walk_checkin", "inhome_sitting", "boarding"]);

const TIME_VALUES = new Set<"6-11" | "11-15" | "15-22">(["6-11", "11-15", "15-22"]);

// Stale-value thresholds. The old dollar-based pricing ran 1–250.
// Any minRate below 1 or maxRate at or below 250 is a legacy value and is discarded.
const MIN_VALID_MIN_RATE = 1;
const MIN_VALID_MAX_RATE = 251; // old default max was 250

export function parseFiltersFromQuery(searchParams: URLSearchParams): Partial<ExploreFilters> {
  const serviceRaw = searchParams.get("service");
  const service =
    serviceRaw && SERVICE_VALUES.has(serviceRaw as ServiceType)
      ? (serviceRaw as ServiceType)
      : null;
  const minRateRaw = Number(searchParams.get("minRate"));
  const maxRateRaw = Number(searchParams.get("maxRate"));
  const timesRaw = searchParams.get("times") || "";
  const times = timesRaw
    .split(",")
    .filter((item): item is "6-11" | "11-15" | "15-22" =>
      TIME_VALUES.has(item as "6-11" | "11-15" | "15-22"),
    );

  // Discard stale values from the old $-based schema (max was capped at 250).
  const minRate =
    Number.isFinite(minRateRaw) && minRateRaw >= MIN_VALID_MIN_RATE ? minRateRaw : undefined;
  const maxRate =
    Number.isFinite(maxRateRaw) && maxRateRaw >= MIN_VALID_MAX_RATE ? maxRateRaw : undefined;

  return { service, minRate, maxRate, times };
}

export function buildQueryFromFilters(filters: ExploreFilters): string {
  const params = new URLSearchParams();

  if (filters.service) params.set("service", filters.service);

  // Only write price params when they differ from defaults — keeps URLs clean
  // and prevents stale values surviving across sessions.
  if (filters.minRate !== defaultExploreFilters.minRate) {
    params.set("minRate", String(filters.minRate));
  }
  if (filters.maxRate !== defaultExploreFilters.maxRate) {
    params.set("maxRate", String(filters.maxRate));
  }

  if (filters.times.length) params.set("times", filters.times.join(","));

  return params.toString();
}
