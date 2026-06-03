import type {
  EnergyLevel,
  PetProfile,
  VaccinationRecord,
  VaccinationType,
  VetInfo,
} from "@/lib/types";

/**
 * Human-readable labels for `VaccinationType` enum values. Used by every
 * chip/list surface that renders vaccination records.
 */
export const VACCINATION_LABELS: Record<VaccinationType, string> = {
  rabies: "Rabies",
  parvovirus: "Parvovirus",
  distemper: "Distemper",
  hepatitis: "Hepatitis",
  parainfluenza: "Parainfluenza",
};

/**
 * Canonical order in which vaccinations are displayed (Rabies first because
 * it's legally mandatory in CZ; then the recommended core vaccines).
 */
export const VACCINATION_ORDER: VaccinationType[] = [
  "rabies",
  "parvovirus",
  "distemper",
  "hepatitis",
  "parainfluenza",
];

/**
 * Vaccinations V1 freshness window. An acknowledgement within this many days
 * counts as "current"; older marks the record as stale (the owner should
 * re-confirm). 12 months matches the typical annual booster cadence.
 */
const ACK_FRESHNESS_DAYS = 365;

/**
 * Returns true when the dog's vaccination record is non-empty AND the owner
 * has acknowledged its accuracy within the freshness window. Replaces direct
 * reads of the legacy `vaccinationsUpToDate` boolean.
 *
 * Bridge behaviour (Dog Profile phase only): if the new structured fields are
 * absent but the legacy boolean is true, return true so any consumer reading
 * via this helper before seed migration doesn't flip false. Removed at phase
 * close once all seeds carry structured records.
 */
export function isVaccinationsCurrent(vet: VetInfo | undefined, today: Date): boolean {
  if (!vet) return false;

  if (vet.vaccinations && vet.vaccinations.length > 0 && vet.vaccinationsAcknowledgedAt) {
    const ackMs = new Date(vet.vaccinationsAcknowledgedAt).getTime();
    const ageDays = (today.getTime() - ackMs) / (1000 * 60 * 60 * 24);
    if (ageDays <= ACK_FRESHNESS_DAYS) return true;
  }

  // Legacy bridge — drop at phase close.
  if (vet.vaccinationsUpToDate === true) return true;

  return false;
}

/**
 * Sort vaccinations into the canonical display order (Rabies first, then the
 * recommended core vaccines). Records with unknown types fall to the end.
 */
export function sortVaccinations(records: VaccinationRecord[]): VaccinationRecord[] {
  const orderIndex = (type: VaccinationType): number => {
    const i = VACCINATION_ORDER.indexOf(type);
    return i === -1 ? VACCINATION_ORDER.length : i;
  };
  return [...records].sort((a, b) => orderIndex(a.type) - orderIndex(b.type));
}

/**
 * Short date format for vaccination chips ("Aug 2025"). Month + year only —
 * the day of administration is captured but not surfaced; freshness is the
 * thing that matters at chip-read time, not exact day.
 */
export function formatVaccinationDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// ── Tag taxonomy helpers (FC8 formalization, Dog Profile phase) ──────

/**
 * An auto-derived chip for a dog. Tone drives visual treatment per surface
 * (shelter Dogs-tab card priority chip, dog profile tag row).
 */
export type AutoTag = {
  kind: "adoption-pending" | "new-arrival" | "long-stayer" | "energy";
  label: string;
  tone: "pending" | "new" | "long" | "energy";
};

const ENERGY_LABEL: Record<EnergyLevel, string> = {
  low: "Calm",
  moderate: "Easygoing",
  high: "Active",
  very_high: "High energy",
};

/**
 * Compute the auto-derived chips for a dog. Replaces the inline render-time
 * derivation that lived on `app/dogs/[id]/page.tsx` and
 * `components/shelters/ShelterDogCard.tsx`. Always-accurate, never stored.
 *
 * Order is render-priority — surfaces that show all chips (dog profile)
 * render top-to-bottom in this order; surfaces that show only one (the
 * shelter Dogs-tab card) take the first.
 */
export function deriveAutoTags(dog: PetProfile, today: Date): AutoTag[] {
  const tags: AutoTag[] = [];

  if (dog.adoptionStatus === "pending") {
    tags.push({ kind: "adoption-pending", label: "Adoption pending", tone: "pending" });
  }

  const days = dog.daysInKennel ?? 0;
  if (days > 0 && days <= 7) {
    tags.push({ kind: "new-arrival", label: "New arrival", tone: "new" });
  } else if (days >= 30) {
    tags.push({ kind: "long-stayer", label: "Long-stayer", tone: "long" });
  }

  if (dog.energyLevel) {
    tags.push({
      kind: "energy",
      label: ENERGY_LABEL[dog.energyLevel],
      tone: "energy",
    });
  }

  // `today` reserved for future age-derived chips (Senior / Puppy from
  // structured age). V1 keeps Senior/Puppy in the manual PersonalityTag
  // vocabulary because `ageLabel` is free-text.
  void today;

  return tags;
}

/**
 * A walker-eligibility chip. Visually distinct from personality tags
 * because these gate handling, not disposition.
 */
export type PolicyChip = {
  kind: "solo-only" | "experienced-only";
  label: string;
};

/**
 * Compute policy chips from per-dog policy flags. Shelter dogs only —
 * owned dogs don't carry these fields. Strictest rule wins at the
 * walk-eligibility check; the chips here surface the per-dog inputs to
 * that check.
 */
export function derivePolicyChips(dog: PetProfile): PolicyChip[] {
  const chips: PolicyChip[] = [];
  if (dog.soloOnly) {
    chips.push({ kind: "solo-only", label: "Solo walks only" });
  }
  if (dog.experiencedHandlersOnly) {
    chips.push({ kind: "experienced-only", label: "Experienced handlers only" });
  }
  return chips;
}
