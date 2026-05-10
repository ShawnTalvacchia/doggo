import type { ServiceType } from "@/lib/types";

/**
 * Canonical display labels for the four Care service types. Resolved
 * 2026-05-10 (Care Catalog Taxonomy & Filter Redesign). Use these everywhere
 * instead of freeform titles. See [[Groups & Care Model]] →
 * "Care taxonomy — the four services" for the underlying meaning.
 */
export const SERVICE_LABELS: Record<ServiceType, string> = {
  walks_checkins: "Walks & Check-ins",
  house_sitting: "House sitting",
  day_care: "Day care",
  boarding: "Boarding",
};

/**
 * Canonical short labels for compact surfaces (filter pills, card chips).
 * Same vocabulary, fewer characters.
 */
export const SERVICE_SHORT_LABELS: Record<ServiceType, string> = {
  walks_checkins: "Walks",
  house_sitting: "House sitting",
  day_care: "Day care",
  boarding: "Boarding",
};

/**
 * Display order for the four services across pills, lists, and cards.
 * Outdoor-then-indoor, then day-then-overnight at the carer's home.
 */
export const SERVICE_ORDER: ServiceType[] = [
  "walks_checkins",
  "house_sitting",
  "day_care",
  "boarding",
];

/**
 * Display labels for service rate types (extras).
 * These are the fixed set of rate rows shown under each service.
 */
export const RATE_TYPE_LABELS: Record<string, string> = {
  walk_rate: "Walk rate",
  holiday_rate: "Holiday Rate",
  additional_dog_rate: "Additional Dog Rate",
  puppy_rate: "Puppy Rate",
  cat_care: "Cat Care",
  additional_cat: "Additional Cat",
  extended_care: "Extended Care",
} as const;

/**
 * Sub-services selectable within each main service type. Drives the
 * filter accordion options and inquiry-form sub-service selection.
 *
 * Mapping resolved 2026-05-10 with the four-service taxonomy:
 * - Drop-in visits live under House sitting (short version of the same
 *   shape — carer goes to owner's home, finite duration).
 * - Walks narrows to outdoor activity with the dog.
 * - Day care + Boarding share Special feeding / Medication, since both
 *   shapes hand the dog over to the carer's premises.
 *
 * Price modifiers (Holiday Rate, Additional Dog, Puppy Rate, etc.) are NOT
 * selected by the owner — they are applied by the provider in the booking
 * proposal based on the pets and dates in the inquiry.
 */
export const SUB_SERVICES: Record<ServiceType, string[]> = {
  walks_checkins: ["Solo walk", "Group walk"],
  house_sitting: ["Drop-in visit", "Full-time care", "Special feeding", "Medication"],
  day_care: ["Special feeding", "Medication"],
  boarding: ["Special feeding", "Medication"],
};
