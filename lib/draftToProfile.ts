/**
 * draftToProfile.ts
 *
 * Converts a completed SignupDraft into a ProviderProfileContent-shaped object.
 * This is the single source of truth for how signup fields map to public profile data.
 *
 * Used in:
 *   - Signup success page profile preview (client-side)
 *   - Eventually: POST /api/providers (when we write to Supabase on signup complete)
 *
 * Field mapping:
 *   draft.bio              → aboutBody
 *   draft.firstName        → aboutHeading, name
 *   draft.location         → district / neighborhood (raw string until geocoded)
 *   draft.dogSizes         → careExperience[] (size chips)
 *   draft.dogAges          → careExperience[] (age chips)
 *   draft.homeType         → homeEnvironment[]
 *   draft.outdoorSpace     → homeEnvironment[]
 *   draft.dogStayArea      → homeEnvironment[]
 *   draft.pet              → pets[]
 *   draft.roles            → services[]
 *   draft.prices           → services[].priceFrom (real Kč values from pricing step)
 *   draft.walkingDays/Times → services[].shortDescription (walk_checkin)
 *   draft.hostDays/Times   → services[].shortDescription (boarding / inhome_sitting)
 *   draft.walkingRadius    → services[].shortDescription (walk_checkin)
 *
 *   NOT on public profile:
 *   draft.dogTemperamentsExcluded  — internal matching only
 *   draft.dogSpecialNotes          — internal matching only
 */

import { DEFAULT_ABOUT_BANNER_URL } from "@/lib/data/providerContent";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { SignupDraft } from "@/lib/types";
import { ProviderProfileContent, ProviderServiceOffering } from "@/lib/types";

// ── Size label helpers ─────────────────────────────────────────────────────────

const SIZE_LABELS: Record<string, string> = {
  "0–5": "Tiny dogs (under 5 kg)",
  "5–10": "Small dogs (5–10 kg)",
  "10–25": "Medium dogs (10–25 kg)",
  "25–45": "Large dogs (25–45 kg)",
  "45+": "Giant breeds (45+ kg)",
};

const AGE_LABELS: Record<string, string> = {
  Puppy: "Puppies (0–1 yr)",
  Adult: "Adult dogs (1–7 yrs)",
  Senior: "Senior dogs (7+ yrs)",
};

// ── Fallback price used only if the pricing step was somehow skipped ───────────
const FALLBACK_PRICE = 450;

// ── About title logic ──────────────────────────────────────────────────────────

function buildAboutTitle(draft: SignupDraft): string {
  const isWalker = draft.roles.includes("walker");
  const isHost = draft.roles.includes("host");
  if (isWalker && isHost) return `Walks, sitting & boarding in ${draft.location || "Prague"}.`;
  if (isWalker) return `Dog walker & check-ins in ${draft.location || "Prague"}.`;
  if (isHost) return `Dog hosting in ${draft.location || "Prague"}.`;
  return `Dog lover in ${draft.location || "Prague"}.`;
}

// ── Care experience ────────────────────────────────────────────────────────────

function buildCareExperience(draft: SignupDraft): string[] {
  const items: string[] = [];

  // Sizes the provider can handle
  for (const s of draft.dogSizes) {
    const label = SIZE_LABELS[s];
    if (label) items.push(label);
  }

  // Age groups the provider can handle
  for (const a of draft.dogAges) {
    const label = AGE_LABELS[a];
    if (label) items.push(label);
  }

  return items;
}

// ── Home environment ───────────────────────────────────────────────────────────

function buildHomeEnvironment(draft: SignupDraft): string[] {
  const items: string[] = [];

  if (draft.homeType) items.push(draft.homeType);
  if (draft.outdoorSpace) items.push(draft.outdoorSpace);
  if (draft.dogStayArea) items.push(draft.dogStayArea);

  return items;
}

// ── Services — uses real prices from the pricing step ─────────────────────────

function buildServices(draft: SignupDraft): ProviderServiceOffering[] {
  const services: ProviderServiceOffering[] = [];
  let index = 0;

  if (draft.roles.includes("walker")) {
    const daysLabel = draft.walkingDays.join(", ") || "days TBD";
    const timesLabel = draft.walkingTimes.join(", ") || "times TBD";
    services.push({
      id: `draft-service-${index++}`,
      providerId: "draft",
      serviceType: "walk_checkin",
      title: SERVICE_LABELS.walk_checkin,
      shortDescription: `Available ${daysLabel} · ${timesLabel} · within ${draft.walkingRadius} km.`,
      priceFrom: draft.prices.walk_checkin ?? FALLBACK_PRICE,
      priceUnit: "per_visit" as const,
    });
  }

  if (draft.roles.includes("host")) {
    const daysLabel = draft.hostDays.join(", ") || "days TBD";
    services.push({
      id: `draft-service-${index++}`,
      providerId: "draft",
      serviceType: "inhome_sitting",
      title: SERVICE_LABELS.inhome_sitting,
      shortDescription:
        `Overnight care in your home. Available ${daysLabel} · ${draft.homeType || ""}.`.trim(),
      priceFrom: draft.prices.inhome_sitting ?? FALLBACK_PRICE,
      priceUnit: "per_night" as const,
    });
    services.push({
      id: `draft-service-${index++}`,
      providerId: "draft",
      serviceType: "boarding",
      title: SERVICE_LABELS.boarding,
      shortDescription:
        `Your dog stays with me. ${draft.homeType || ""} · ${draft.outdoorSpace || ""}.`.trim(),
      priceFrom: draft.prices.boarding ?? FALLBACK_PRICE,
      priceUnit: "per_night" as const,
    });
  }

  return services;
}

// ── Pets ───────────────────────────────────────────────────────────────────────

function buildPets(draft: SignupDraft) {
  const p = draft.pet;
  if (!p.name) return [];
  return [
    {
      id: "draft-pet-1",
      name: p.name,
      breed: p.breed || "Mixed breed",
      weightLabel: p.size ? `${p.size} kg` : "Unknown weight",
      ageLabel: p.age || "Unknown age",
      imageUrl: "/images/generated/spot-portrait.jpeg",
    },
  ];
}

// ── Main export ────────────────────────────────────────────────────────────────

export function draftToProfile(draft: SignupDraft): ProviderProfileContent {
  return {
    providerId: "draft",
    aboutTitle: buildAboutTitle(draft),
    aboutHeading: `About ${draft.firstName || "You"}`,
    aboutBody: draft.bio || "Add a short bio so owners know who you are.",
    photoMainUrl: DEFAULT_ABOUT_BANNER_URL,
    photoSideUrl: "/images/generated/spot-park-walk.jpeg",
    photoCountLabel: "(0 photos)",
    careExperience: buildCareExperience(draft),
    medicalCare: [], // populated in Option B when we add a medical handling step
    homeEnvironment: buildHomeEnvironment(draft),
    pets: buildPets(draft),
    services: buildServices(draft),
    reviews: [], // always empty for a new provider
  };
}
