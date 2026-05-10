import type {
  ServiceType,
  BookingPrice,
  PaymentSummary,
  InquiryDetails,
  PriceLineItem,
  CarerCareServiceConfig,
  PricingModifier,
  HolidayPricingModifier,
  WeekendPricingModifier,
  MultiPetPricingModifier,
  LastMinutePricingModifier,
} from "@/lib/types";
import { holidaysInRange, rangeIncludesWeekend, daysBetween } from "@/lib/holidays";

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
    // Floor lowered to 300 in Discover Refinement E (2026-05-10) to fit
    // the affordable end of the seeded directory (Lenka S. at 410, Jana K.
    // at 430, Petr V. at 480). The previous 500 floor hid them under the
    // Sitting pill's default min.
    return { min: 300, max: 1800 };
  }
  if (service === "boarding") {
    // Floor lowered to 400 alongside Sitting — matches Lenka S. boarding
    // (640) and the seeded weekend rates without clipping.
    return { min: 400, max: 1600 };
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

// ── Auto-pricing engine (Pricing & Proposals, 2026-05-04) ──────────────────
//
// `computeQuote(config, inquiry, today)` is a pure function that takes the
// provider's per-service config and the owner's inquiry details and emits a
// fully-built `BookingPrice` with one line item per modifier that triggered.
// It replaces the older "build base price + provider edits freely" pattern.
//
// Stacking order:
//   1. Base line item (rate × occurrences)
//   2. Flat-per-unit modifiers (multi-pet) — added to the running subtotal
//   3. Percentage modifiers (holiday, weekend, last-minute) — applied to
//      the *subtotal at the time they evaluate* (which means they compound
//      with each other, not just the base)
//
// Each evaluator returns a `PriceLineItem | null`. Null = modifier didn't
// trigger for this inquiry. The line items are stamped with `isModifier`
// and a human-readable `triggerNote` so the proposal explains itself.
//
// The engine is "today-aware" (last-minute needs to know how far away the
// booking start is) — but the current date is passed in, never pulled
// from `new Date()`, so the function stays pure and testable.

// Unit word derives from `priceUnit` (per_visit / per_night), not
// `serviceType` — `inhome_sitting` can be either a per-visit day sitting
// or a per-night overnight depending on the config.
function unitWordFor(priceUnit: "per_visit" | "per_night"): string {
  return priceUnit === "per_visit" ? "visit" : "night";
}

const SERVICE_BASE_LABEL: Record<ServiceType, string> = {
  walk_checkin: "Walk",
  inhome_sitting: "In-home sitting",
  boarding: "Boarding",
};

function unitsForOneOff(inquiry: InquiryDetails, priceUnit: "per_visit" | "per_night"): number {
  if (!inquiry.startDate) return 1;
  if (priceUnit === "per_visit") {
    // Walks are billed per-visit; one-off walks are typically a single visit.
    return 1;
  }
  // Nights: count nights between start and end (inclusive of the start day).
  if (!inquiry.endDate) return 1;
  const start = new Date(inquiry.startDate + "T00:00:00").getTime();
  const end = new Date(inquiry.endDate + "T00:00:00").getTime();
  return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
}

function evalHoliday(
  mod: HolidayPricingModifier,
  inquiry: InquiryDetails,
  runningSubtotal: number,
): PriceLineItem | null {
  if (!mod.enabled || mod.pct <= 0) return null;
  const matched = holidaysInRange(inquiry.startDate, inquiry.endDate);
  if (matched.length === 0) return null;
  const amount = Math.round(runningSubtotal * (mod.pct / 100));
  if (amount === 0) return null;
  const note =
    matched.length === 1
      ? `${matched[0].name} (${matched[0].date.slice(5)}) falls in this booking`
      : `${matched.length} Czech public holidays fall in this booking`;
  return {
    label: `Holiday surcharge (+${mod.pct}%)`,
    amount,
    unit: "modifier",
    isModifier: true,
    triggerNote: note,
  };
}

function evalWeekend(
  mod: WeekendPricingModifier,
  inquiry: InquiryDetails,
  runningSubtotal: number,
): PriceLineItem | null {
  if (!mod.enabled || mod.pct <= 0) return null;
  let triggered = false;
  let note = "";
  if (inquiry.bookingType === "ongoing" && inquiry.recurringSchedule) {
    const days = inquiry.recurringSchedule.days;
    const weekendDays = days.filter((d) => d === "Sat" || d === "Sun");
    if (weekendDays.length > 0) {
      triggered = true;
      note =
        weekendDays.length === 1
          ? `${weekendDays[0]} is a weekend day`
          : `Includes ${weekendDays.join(" + ")}`;
    }
  } else if (rangeIncludesWeekend(inquiry.startDate, inquiry.endDate)) {
    triggered = true;
    note = "Booking spans a weekend day";
  }
  if (!triggered) return null;
  const amount = Math.round(runningSubtotal * (mod.pct / 100));
  if (amount === 0) return null;
  return {
    label: `Weekend rate (+${mod.pct}%)`,
    amount,
    unit: "modifier",
    isModifier: true,
    triggerNote: note,
  };
}

function evalMultiPet(
  mod: MultiPetPricingModifier,
  inquiry: InquiryDetails,
): PriceLineItem | null {
  if (!mod.enabled || mod.flatPerExtra <= 0) return null;
  const extra = Math.max(0, inquiry.pets.length - 1);
  if (extra === 0) return null;
  const amount = mod.flatPerExtra * extra;
  return {
    label: `Multi-pet (+${mod.flatPerExtra} Kč × ${extra})`,
    amount,
    unit: "modifier",
    isModifier: true,
    triggerNote: extra === 1 ? "1 extra pet" : `${extra} extra pets`,
  };
}

function evalLastMinute(
  mod: LastMinutePricingModifier,
  inquiry: InquiryDetails,
  todayISO: string,
  runningSubtotal: number,
): PriceLineItem | null {
  if (!mod.enabled || mod.pct <= 0 || mod.thresholdDays <= 0) return null;
  if (!inquiry.startDate) return null;
  const days = daysBetween(todayISO, inquiry.startDate);
  if (days < 0 || days >= mod.thresholdDays) return null;
  const amount = Math.round(runningSubtotal * (mod.pct / 100));
  if (amount === 0) return null;
  const note =
    days === 0
      ? "Booking starts today"
      : days === 1
        ? "Booking starts tomorrow"
        : `Booking starts in ${days} days`;
  return {
    label: `Last-minute (+${mod.pct}%)`,
    amount,
    unit: "modifier",
    isModifier: true,
    triggerNote: note,
  };
}

/**
 * Auto-pricing engine. Pure — `today` is passed in.
 *
 * For one-off bookings: applies all modifiers naturally (date-driven holiday,
 * range weekend, count-based multi-pet, time-to-start last-minute).
 *
 * For ongoing bookings: weekly subtotal, weekend modifier reads the recurring
 * `days` array, multi-pet applies always. **Holiday and last-minute do not
 * apply to ongoing bookings in v1** — rolling weekly billing means each
 * week's quote is computed independently, and applying a one-time holiday
 * surcharge to an open-ended weekly subscription is the wrong shape. When
 * Sessions & Service Execution lands per-occurrence pricing, we'll revisit.
 *
 * Returns a `BookingPrice` ready to render in the proposal.
 */
export function computeQuote(
  config: CarerCareServiceConfig,
  inquiry: InquiryDetails,
  todayISO: string,
): BookingPrice {
  const baseLabel = SERVICE_BASE_LABEL[config.serviceType];
  const unitWord = unitWordFor(config.priceUnit);
  const lineItems: PriceLineItem[] = [];
  const modifiers = config.modifiers ?? [];

  // 1. Base line item
  let baseAmount: number;
  let billingCycle: BookingPrice["billingCycle"];
  if (inquiry.bookingType === "one_off") {
    const units = unitsForOneOff(inquiry, config.priceUnit);
    baseAmount = config.pricePerUnit * units;
    const countLabel = `${units} ${units === 1 ? unitWord : `${unitWord}s`}`;
    lineItems.push({
      label: `${baseLabel} × ${countLabel}`,
      amount: baseAmount,
      unit: `per ${unitWord}`,
    });
    billingCycle = config.priceUnit === "per_night" ? "per_night" : "per_session";
  } else {
    const visitsPerWeek = inquiry.recurringSchedule?.days.length ?? 1;
    baseAmount = config.pricePerUnit * visitsPerWeek;
    lineItems.push({
      label: `${baseLabel} × ${visitsPerWeek} ${visitsPerWeek === 1 ? unitWord : `${unitWord}s`}/week`,
      amount: baseAmount,
      unit: "per week",
    });
    billingCycle = "weekly";
  }

  let runningSubtotal = baseAmount;

  // 2. Flat modifiers first — multi-pet adds to the base before percentages
  //    compound. This matches the natural "two pets cost more" intuition
  //    without double-charging on holiday/weekend rates.
  const multiPet = modifiers.find((m): m is MultiPetPricingModifier => m.kind === "multi_pet");
  if (multiPet) {
    const li = evalMultiPet(multiPet, inquiry);
    if (li) {
      lineItems.push(li);
      runningSubtotal += li.amount;
    }
  }

  // 3. Percentage modifiers — applied on the subtotal-so-far, in declaration
  //    order. For ongoing bookings, holiday and last-minute are skipped (see
  //    docstring). Weekend uses the recurring-days path inside its evaluator.
  const isOngoing = inquiry.bookingType === "ongoing";
  for (const mod of modifiers) {
    if (mod.kind === "multi_pet") continue; // already applied above
    let li: PriceLineItem | null = null;
    if (mod.kind === "holiday" && !isOngoing) {
      li = evalHoliday(mod, inquiry, runningSubtotal);
    } else if (mod.kind === "weekend") {
      li = evalWeekend(mod, inquiry, runningSubtotal);
    } else if (mod.kind === "last_minute" && !isOngoing) {
      li = evalLastMinute(mod, inquiry, todayISO, runningSubtotal);
    }
    if (li) {
      lineItems.push(li);
      runningSubtotal += li.amount;
    }
  }

  return {
    lineItems,
    total: runningSubtotal,
    currency: "Kč",
    billingCycle,
  };
}

/**
 * Equality check between two `BookingPrice` shapes. Used to detect when a
 * provider's edited quote matches the auto-computed engine output (so we
 * can clear an `isOverride` flag on counter flow). Compares totals + line
 * items by label/amount; metadata (`triggerNote`, `unit`) doesn't matter
 * for equivalence.
 */
export function quotesMatch(a: BookingPrice, b: BookingPrice): boolean {
  if (a.total !== b.total) return false;
  if (a.lineItems.length !== b.lineItems.length) return false;
  for (let i = 0; i < a.lineItems.length; i++) {
    if (a.lineItems[i].label !== b.lineItems[i].label) return false;
    if (a.lineItems[i].amount !== b.lineItems[i].amount) return false;
  }
  return true;
}

/**
 * @deprecated Pricing & Proposals (2026-05-04) — use `computeQuote(config,
 * inquiry, todayISO)` instead. This thin shim is preserved for any
 * not-yet-migrated callers; safe to delete once `ProposalForm.tsx` is the
 * only consumer of the new path.
 *
 * Build a default `BookingPrice` for a proposal, given an inquiry and the
 * provider's per-unit rate. The fee is added at checkout via
 * `calculatePaymentSummary` — the proposal itself reflects the gross
 * service total only. Provider can override the line items in the form.
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

/** Default modifier set for a freshly-enabled Care service. Reasonable
 *  starting points so providers can opt in with one tap from the edit UI.
 *  Pricing & Proposals, 2026-05-04. */
export function defaultModifiers(): PricingModifier[] {
  return [
    { kind: "holiday", enabled: false, pct: 25 },
    { kind: "weekend", enabled: false, pct: 15 },
    { kind: "multi_pet", enabled: false, flatPerExtra: 100 },
    { kind: "last_minute", enabled: false, pct: 10, thresholdDays: 3 },
  ];
}
