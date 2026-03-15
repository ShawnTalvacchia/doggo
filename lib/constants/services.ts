import type { ServiceType } from "@/lib/types";

/**
 * Canonical display labels for the three service types.
 * Use these everywhere instead of freeform titles from the database.
 */
export const SERVICE_LABELS: Record<ServiceType, string> = {
  walk_checkin: "Walks & Check-ins",
  inhome_sitting: "In-home Sitting",
  boarding: "Overnight Boarding",
};

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
 * Sub-services selectable within each main service type.
 * These correspond to the filter accordion options in FilterBody and
 * are captured in the inquiry when starting a conversation.
 *
 * Price modifiers (Holiday Rate, Additional Dog, Puppy Rate, etc.) are NOT
 * selected by the owner — they are applied by the provider in the booking proposal
 * based on the pets and dates in the inquiry.
 */
export const SUB_SERVICES: Record<ServiceType, string[]> = {
  walk_checkin: ["Drop-in visit", "Solo walk", "Group walk"],
  inhome_sitting: ["Full-time care", "Special feeding", "Medication", "Walking", "Walking +30 mins"],
  boarding: ["Day care", "Overnight"],
};
