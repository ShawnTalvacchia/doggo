import { ServiceType } from "@/lib/types";

export const FILTER_RATE_MIN_KC = 150;
export const FILTER_RATE_MAX_KC = 1800;

type RateBounds = {
  min: number;
  max: number;
};

export function getExploreRateBounds(service: ServiceType | null): RateBounds {
  if (service === "walk_checkin") {
    return { min: 150, max: 900 };
  }
  if (service === "inhome_sitting") {
    return { min: 500, max: 1800 };
  }
  if (service === "boarding") {
    return { min: 450, max: 1600 };
  }
  return { min: FILTER_RATE_MIN_KC, max: FILTER_RATE_MAX_KC };
}

/**
 * Legacy prototype data occasionally stored prices as two-digit values
 * (e.g. 29 instead of 290 Kč). Normalize those for UI consistency.
 */
export function normalizeKcPrice(rawPrice: number): number {
  if (!Number.isFinite(rawPrice) || rawPrice <= 0) return rawPrice;
  if (rawPrice < 100) return rawPrice * 10;
  return rawPrice;
}
