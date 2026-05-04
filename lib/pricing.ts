import type { ServiceType, BookingPrice, PaymentSummary, InquiryDetails } from "@/lib/types";

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

// ── Platform fee ─────────────────────────────────────────────────────────────

const PLATFORM_FEE_PERCENT = 12;

/**
 * Build a default `BookingPrice` for a proposal, given an inquiry and the
 * provider's per-unit rate. The fee is added at checkout via
 * `calculatePaymentSummary` — the proposal itself reflects the gross
 * service total only. Provider can override the line items in the form.
 *
 * Discover & Care G3, 2026-05-02.
 */
export function buildProposalPrice(
  inquiry: InquiryDetails,
  baseRate: number,
  priceUnit: "per_visit" | "per_night",
  serviceLabel: string,
): BookingPrice {
  const unitWord = priceUnit === "per_visit" ? "visit" : "night";

  if (inquiry.bookingType === "one_off") {
    let days = 1;
    if (inquiry.startDate && inquiry.endDate) {
      const start = new Date(inquiry.startDate).getTime();
      const end = new Date(inquiry.endDate).getTime();
      days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
    }
    const total = baseRate * days;
    const countLabel = `${days} ${days === 1 ? unitWord : `${unitWord}s`}`;
    return {
      lineItems: [
        {
          label: `${serviceLabel} × ${countLabel}`,
          amount: total,
          unit: `per ${unitWord}`,
        },
      ],
      total,
      currency: "Kč",
      billingCycle: priceUnit === "per_night" ? "per_night" : "per_session",
    };
  }

  // ongoing — bill weekly using the recurring schedule
  const visitsPerWeek = inquiry.recurringSchedule?.days.length ?? 1;
  const weeklyTotal = baseRate * visitsPerWeek;
  return {
    lineItems: [
      {
        label: `${serviceLabel} × ${visitsPerWeek} ${visitsPerWeek === 1 ? unitWord : `${unitWord}s`}/week`,
        amount: weeklyTotal,
        unit: "per week",
      },
    ],
    total: weeklyTotal,
    currency: "Kč",
    billingCycle: "weekly",
  };
}

/** Calculate payment summary with platform fee from a booking price */
export function calculatePaymentSummary(price: BookingPrice): PaymentSummary {
  const platformFeeAmount = Math.round(price.total * (PLATFORM_FEE_PERCENT / 100));
  return {
    lineItems: price.lineItems,
    platformFeePercent: PLATFORM_FEE_PERCENT,
    platformFeeAmount,
    total: price.total + platformFeeAmount,
    currency: "Kč",
    status: "pending",
  };
}
