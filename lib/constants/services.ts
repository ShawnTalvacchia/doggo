import type {
  ServiceType,
  Booking,
  AppointmentRef,
  TrainingType,
  AppointmentLocationKind,
} from "@/lib/types";

/**
 * Appointment meeting-location metadata (Workstream B, 2026-06-15; Open Q §17).
 * `label` is the neutral name shown in the carer edit picker AND the owner's
 * booking picker; `ownerLine(carerFirst)` is the natural confirmation sentence
 * shown to the owner (read-only line + booking detail). Curated 4 tuples —
 * each encodes who-travels + where.
 */
export const APPOINTMENT_LOCATION_META: Record<
  AppointmentLocationKind,
  { label: string; ownerLine: (carerFirst: string) => string }
> = {
  carer_to_you: {
    label: "Carer comes to you",
    ownerLine: (c) => `${c} comes to your address`,
  },
  you_to_carer: {
    label: "You bring your dog to the carer",
    ownerLine: (c) => `You bring your dog to ${c}'s place`,
  },
  carer_pickup_public: {
    label: "Carer picks up, meet at a public spot",
    ownerLine: (c) => `${c} picks up your dog and meets you at a public spot`,
  },
  owner_carer_public: {
    label: "Meet at a public spot",
    ownerLine: (c) => `You and ${c} meet at a public spot`,
  },
};

/** Stable render/edit order for the four appointment-location tuples. */
export const APPOINTMENT_LOCATION_ORDER: AppointmentLocationKind[] = [
  "carer_to_you",
  "you_to_carer",
  "carer_pickup_public",
  "owner_carer_public",
];

/**
 * Display labels for the 11 training sub-types Roman flagged in his PO
 * interview (2026-06-02). Use these everywhere a training service surfaces
 * a chip / label / picker option so the wording stays consistent. P73.
 */
export const TRAINING_TYPE_LABELS: Record<TrainingType, string> = {
  obedience: "Obedience",
  manners: "Manners & skills",
  behaviour: "Behaviour",
  agility: "Agility",
  tracking: "Tracking & SAR",
  protection: "Protection",
  therapy: "Therapy dogs",
  service: "Service dogs",
  retriever: "Retriever",
  sports: "Dog sports",
  puppy_socialisation: "Puppy socialisation",
};

/**
 * Picker order — owner-facing demand first (Puppy socialisation, Manners,
 * Behaviour, Obedience are the most common asks per Roman), specialist
 * categories after. Matches the order the chips render in the
 * service-edit picker so trainers see the common types up front.
 */
export const TRAINING_TYPE_PICKER_ORDER: TrainingType[] = [
  "puppy_socialisation",
  "manners",
  "obedience",
  "behaviour",
  "agility",
  "retriever",
  "sports",
  "tracking",
  "therapy",
  "service",
  "protection",
];


/**
 * Platform-recommended price range for mentor sessions, Kč per session
 * (Cross-Shelter Mentor Network D1, 2026-06-09). Mentor sets the actual
 * price on `CarerMentorSessionServiceConfig.pricePerSession`; this range
 * is the platform's suggested band — between a guided shelter intro
 * (~300 Kč) and a 1:1 training session (~600 Kč), signalling "supervised
 * apprenticeship, not a training session." ASSUMPTION A4/A5 (Cold-Start
 * Playbook → Assumptions to validate): the band is an interview probe,
 * not a settled answer.
 */
export const MENTOR_SESSION_PRICE_RANGE = { min: 300, max: 600 } as const;

/**
 * Platform-suggested mentor-session minimum before a mentee graduates to
 * solo walker at an accepting shelter. Shelters override per
 * `ShelterPolicy.mentorSessionMinimum`. ASSUMPTION A6 — it's a guess.
 */
export const MENTOR_SESSION_DEFAULT_MINIMUM = 3;

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
 * Display label for a service carried on an inquiry / proposal / booking.
 * Branches in priority order: Appointment-type (`appointment.title`) →
 * Care `serviceType` (`SERVICE_LABELS`) → a neutral fallback. Use this
 * everywhere a structured-flow artifact's service name is rendered so the
 * appointment path doesn't fall through to `SERVICE_LABELS[undefined]`.
 * Appointment booking flow, 2026-05-22.
 */
export function serviceLabelFor(x: {
  serviceType?: ServiceType;
  appointment?: Pick<AppointmentRef, "title">;
}): string {
  if (x.appointment) return x.appointment.title;
  return x.serviceType ? SERVICE_LABELS[x.serviceType] : "Service";
}

/**
 * Display label for a booking's service. Handles Meet-type service bookings
 * (Service ↔ Meet Linkage C2) — those have no Care `serviceType`, so the
 * label comes from `meetBooking.serviceTitle`. Appointment bookings use
 * `appointment.title`; Care bookings fall back to the Care `SERVICE_LABELS`.
 */
export function bookingServiceLabel(booking: Booking): string {
  if (booking.meetBooking) return booking.meetBooking.serviceTitle;
  if (booking.mentorSession) return booking.mentorSession.serviceTitle;
  if (booking.appointment) return booking.appointment.title;
  if (booking.ownerKind === "shelter") return "Volunteer walk";
  return booking.serviceType ? SERVICE_LABELS[booking.serviceType] : "Service";
}

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
  walks_checkins: ["Solo walk", "Small-group walk"],
  house_sitting: ["Drop-in visit", "Full-time care", "Special feeding", "Medication"],
  day_care: ["Special feeding", "Medication"],
  boarding: ["Special feeding", "Medication"],
};
