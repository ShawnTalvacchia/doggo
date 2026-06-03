/**
 * mockShelters.ts — Demo shelter accounts (Shelter Foundation, 2026-06-01).
 *
 * Shelters are top-level entities parallel to UserProfile, NOT a Group type.
 * See [[features/shelters]] and [[strategy/Open Questions & Assumptions Log]]
 * §14 for the strategic rationale.
 *
 * Demo seeds one shelter — Útulek Liběň — with a roster of 8 non-owned dogs,
 * 8 vouched walkers across all three tiers, 12 supporters. Walkers and
 * supporters are directory-style entries (no `UserProfile` bridge) per the
 * Shelter Foundation scope decisions — bridging to demo personas waits for
 * the merged Carer Portfolio + Shelter Walker Credentialing phase.
 *
 * Dog dates use relative helpers (`daysAgo`, `daysAgoIso`) so the
 * "Needs walks now" sort always finds something to surface and long-stayer
 * tags stay accurate against the demo clock.
 *
 * Avatar Rule B: shelter logo renders as a rounded-panel square
 * (institutional, not a person). Dogs are rounded-panel squares.
 *
 * Image placeholders: lacking shelter-specific assets, the demo reuses
 * existing community-cover and dog-portrait images. A real production
 * seed pass should generate `shelter-utulek-liben-logo.jpeg` and
 * `shelter-utulek-liben-banner.jpeg`.
 */

import type {
  PetProfile,
  Post,
  ShelterProfile,
  ShelterSupporter,
  ShelterWalker,
} from "./types";
import { daysAgo, daysAgoIso } from "./mockDate";
import { mockPosts } from "./mockPosts";

/* ── Shelter dog roster ──────────────────────────────────────────────────── */

/**
 * 8 dogs with varied `daysInKennel` + `lastWalkedAt` to exercise the
 * "Needs walks now" sort, long-stayer chip (>=30 days), and tag rendering.
 *
 * Distribution (ordered by daysInKennel ascending):
 *   - Theo: 3 days (newest)
 *   - Líza: 8 days
 *   - Edda: 14 days
 *   - Tonda: 27 days (about to flip into long-stayer)
 *   - Maja: 45 days (long-stayer)
 *   - Káťa: 62 days (long-stayer)
 *   - Šimon: 91 days (long-stayer, 3 months in)
 *   - Berta: 120 days (long-stayer, never walked yet via Doggo)
 */
const UTULEK_DOGS: PetProfile[] = [
  {
    id: "shelter-dog-tonda",
    name: "Tonda",
    breed: "Mixed breed",
    weightLabel: "22 kg",
    ageLabel: "4 years",
    sex: "male",
    imageUrl: "/images/generated/max-portrait.jpeg",
    daysInKennel: 27,
    lastWalkedAt: daysAgoIso(5, "08:30"),
    backstory:
      "Found wandering near the Hloubětín tram stop. Goofy, friendly, and absolutely thinks every walk is a special occasion just for him.",
    personalityTags: ["loves-walks", "good-with-strangers"],
    adoptionStatus: "available",
    intakeDate: daysAgo(27),
    energyLevel: "high",
  },
  {
    id: "shelter-dog-maja",
    name: "Maja",
    breed: "Border collie cross",
    weightLabel: "16 kg",
    ageLabel: "6 years",
    sex: "female",
    imageUrl: "/images/generated/luna-portrait.jpeg",
    daysInKennel: 45,
    lastWalkedAt: daysAgoIso(3, "16:00"),
    backstory:
      "Surrendered when her family moved abroad. Sharp and quick to learn. Would thrive with someone who likes a thinking partner.",
    personalityTags: ["smart", "reactive-on-leash"],
    adoptionStatus: "available",
    intakeDate: daysAgo(45),
    soloOnly: true,
    energyLevel: "very_high",
  },
  {
    id: "shelter-dog-simon",
    name: "Šimon",
    breed: "German shepherd",
    weightLabel: "34 kg",
    ageLabel: "8 years",
    sex: "male",
    imageUrl: "/images/generated/eda-portrait.jpeg",
    daysInKennel: 91,
    lastWalkedAt: daysAgoIso(8, "10:00"),
    backstory:
      "Older gentleman who lost his person to illness. Calm, steady, gets along with everyone. Just wants a sofa and a soft voice.",
    /* Long-stayer is auto-derived from daysInKennel; Senior stays manual
       (age-derivation deferred — ageLabel is free-text). */
    personalityTags: ["senior"],
    adoptionStatus: "available",
    intakeDate: daysAgo(91),
    experiencedHandlersOnly: true,
    energyLevel: "low",
  },
  {
    id: "shelter-dog-liza",
    name: "Líza",
    breed: "Staffordshire cross",
    weightLabel: "20 kg",
    ageLabel: "3 years",
    sex: "female",
    imageUrl: "/images/generated/mia-portrait.jpeg",
    daysInKennel: 8,
    lastWalkedAt: daysAgoIso(0, "11:30"),
    backstory:
      "Came in with her brother (already adopted!). Bubbly, affectionate, would do well with a confident handler who can match her energy.",
    personalityTags: ["affectionate", "reactive-on-leash"],
    adoptionStatus: "available",
    intakeDate: daysAgo(8),
    soloOnly: true,
    energyLevel: "high",
  },
  {
    id: "shelter-dog-edda",
    name: "Edda",
    breed: "Terrier mix",
    weightLabel: "9 kg",
    ageLabel: "2 years",
    sex: "female",
    imageUrl: "/images/generated/nela-portrait.jpeg",
    daysInKennel: 14,
    lastWalkedAt: daysAgoIso(1, "09:00"),
    backstory:
      "Small but mighty. Loves a brisk walk and a stick. Has decided opinions about cats.",
    /* Personality tags intentionally empty — "Small" was the only manual
       entry and size already drives the Dogs-tab "Smallest first" sort, so
       it adds noise as a chip. Auto-derived energy chip ("Active") still
       surfaces via `deriveAutoTags`. */
    adoptionStatus: "available",
    intakeDate: daysAgo(14),
    energyLevel: "high",
  },
  {
    id: "shelter-dog-kata",
    name: "Káťa",
    breed: "Mixed breed",
    weightLabel: "12 kg",
    ageLabel: "5 years",
    sex: "female",
    imageUrl: "/images/generated/runa-portrait.jpeg",
    daysInKennel: 62,
    lastWalkedAt: daysAgoIso(4, "14:00"),
    backstory:
      "Shy at first, gold once she warms up. Looking for a patient adopter who can let her take her time.",
    personalityTags: ["shy", "gentle"],
    adoptionStatus: "pending",
    intakeDate: daysAgo(62),
    energyLevel: "moderate",
  },
  {
    id: "shelter-dog-berta",
    name: "Berta",
    breed: "Czech wolfdog mix",
    weightLabel: "28 kg",
    ageLabel: "7 years",
    sex: "female",
    imageUrl: "/images/generated/daisy-portrait.jpeg",
    daysInKennel: 120,
    // Never walked through Doggo yet — sorts to the top of "Needs walks now."
    lastWalkedAt: undefined,
    backstory:
      "Came from a rural municipal pound after her owner died. Wary of new people but loyal once she trusts you. Needs a quiet home with no other dogs.",
    /* Long-stayer auto-derives from daysInKennel; "Solo only" derives
       from `soloOnly: true` via `derivePolicyChips` and renders below. */
    personalityTags: ["wary-of-strangers"],
    adoptionStatus: "available",
    intakeDate: daysAgo(120),
    soloOnly: true,
    experiencedHandlersOnly: true,
    energyLevel: "low",
  },
  {
    id: "shelter-dog-theo",
    name: "Theo",
    breed: "Labrador puppy",
    weightLabel: "11 kg",
    ageLabel: "5 months",
    sex: "male",
    imageUrl: "/images/generated/toby-portrait.jpeg",
    daysInKennel: 3,
    lastWalkedAt: daysAgoIso(0, "13:00"),
    backstory:
      "Just arrived! Brought in with two siblings from an unplanned litter. All the puppy energy you'd expect.",
    /* "New arrival" auto-derives from daysInKennel <= 7. */
    personalityTags: ["puppy", "needs-basics"],
    adoptionStatus: "available",
    intakeDate: daysAgo(3),
    energyLevel: "very_high",
  },
];

/* ── Walker roster ───────────────────────────────────────────────────────── */

// Walker avatars reuse supporting-cast portraits. Same face appearing
// across multiple demo contexts is a known visual trade-off — picked
// over initials-only because the prototype reads materially richer with
// real portraits, and the bridges to real personas will be wired in
// the credentialing-moat phase. See FC9.
const UTULEK_WALKERS: ShelterWalker[] = [
  // Trusted — 1 walker, deeply embedded
  {
    userId: "walker-pavel-d",
    displayName: "Pavel D.",
    avatarUrl: "/images/generated/marek-profile.jpeg",
    tier: "trusted",
    vouchedAt: daysAgo(420),
    walkCount: 87,
    lastWalkedAt: daysAgoIso(1, "09:30"),
  },
  // Experienced — 3 walkers
  {
    userId: "walker-marie-b",
    displayName: "Marie B.",
    avatarUrl: "/images/generated/marie-profile.jpeg",
    tier: "experienced",
    vouchedAt: daysAgo(240),
    walkCount: 32,
    lastWalkedAt: daysAgoIso(2, "08:00"),
  },
  {
    userId: "walker-lukas-p",
    displayName: "Lukáš P.",
    avatarUrl: "/images/generated/vitek-profile.jpeg",
    tier: "experienced",
    vouchedAt: daysAgo(180),
    walkCount: 22,
    lastWalkedAt: daysAgoIso(4, "16:00"),
  },
  {
    userId: "walker-helena-s",
    displayName: "Helena S.",
    avatarUrl: "/images/generated/eva-profile.jpeg",
    tier: "experienced",
    vouchedAt: daysAgo(140),
    walkCount: 18,
    lastWalkedAt: daysAgoIso(0, "11:00"),
  },
  // Vetted — 4 walkers, mix of newer and recent
  {
    userId: "walker-anna-k",
    displayName: "Anna K.",
    avatarUrl: "/images/generated/hana-profile.jpeg",
    tier: "vetted",
    vouchedAt: daysAgo(85),
    walkCount: 9,
    lastWalkedAt: daysAgoIso(3, "10:00"),
  },
  {
    userId: "walker-jakub-v",
    displayName: "Jakub V.",
    avatarUrl: "/images/generated/jakub-profile.jpeg",
    tier: "vetted",
    vouchedAt: daysAgo(60),
    walkCount: 6,
    lastWalkedAt: daysAgoIso(7, "08:30"),
  },
  {
    userId: "walker-petr-h",
    displayName: "Petr H.",
    avatarUrl: "/images/generated/ondrej-profile.jpeg",
    tier: "vetted",
    vouchedAt: daysAgo(28),
    walkCount: 3,
    lastWalkedAt: daysAgoIso(5, "17:00"),
  },
  {
    userId: "walker-karolina-m",
    displayName: "Karolína M.",
    avatarUrl: "/images/generated/adela-profile.jpeg",
    tier: "vetted",
    vouchedAt: daysAgo(14),
    walkCount: 2,
    lastWalkedAt: daysAgoIso(2, "09:00"),
  },
];

/* ── Supporters roster ───────────────────────────────────────────────────── */

// Supporter avatars also reuse supporting-cast portraits (same trade-off
// as walkers, see comment on UTULEK_WALKERS).
const UTULEK_SUPPORTERS: ShelterSupporter[] = [
  { userId: "supporter-andrea-k", displayName: "Andrea K.", avatarUrl: "/images/generated/nikola-profile.jpeg", since: daysAgo(380) },
  { userId: "supporter-marta-r", displayName: "Marta R.", avatarUrl: "/images/generated/zuzana-profile.jpeg", since: daysAgo(310) },
  { userId: "supporter-vojta-l", displayName: "Vojtěch L.", avatarUrl: "/images/generated/martin-profile.jpeg", since: daysAgo(245) },
  { userId: "supporter-iveta-p", displayName: "Iveta P.", avatarUrl: "/images/generated/petra-profile.jpeg", since: daysAgo(190) },
  { userId: "supporter-radek-s", displayName: "Radek S.", avatarUrl: "/images/generated/filip-profile.jpeg", since: daysAgo(170) },
  { userId: "supporter-nela-d", displayName: "Nela D.", avatarUrl: "/images/generated/jana-profile.jpeg", since: daysAgo(130) },
  { userId: "supporter-michal-h", displayName: "Michal H.", avatarUrl: "/images/generated/jakub-profile.jpeg", since: daysAgo(95) },
  { userId: "supporter-eva-z", displayName: "Eva Ž.", avatarUrl: "/images/generated/anezka-profile.jpeg", since: daysAgo(72) },
  { userId: "supporter-david-c", displayName: "David Č.", avatarUrl: "/images/generated/marek-profile.jpeg", since: daysAgo(48) },
  { userId: "supporter-katerina-v", displayName: "Kateřina V.", avatarUrl: "/images/generated/lucie-profile.jpeg", since: daysAgo(31) },
  { userId: "supporter-stepan-m", displayName: "Štěpán M.", avatarUrl: "/images/generated/ondrej-profile.jpeg", since: daysAgo(18) },
  { userId: "supporter-alena-t", displayName: "Alena T.", avatarUrl: "/images/generated/adela-profile.jpeg", since: daysAgo(6) },
];

/* ── The shelter ─────────────────────────────────────────────────────────── */

export const mockShelters: ShelterProfile[] = [
  {
    id: "utulek-liben",
    name: "Útulek Liběň",
    logoUrl: "/images/generated/community-cover-karlin.jpeg",
    bannerUrl: "/images/generated/community-cover-stromovka.jpeg",
    location: "Libeň, Prague 8",
    neighbourhood: "Libeň",
    bio:
      "A small municipal shelter caring for dogs left without homes across Prague 8 and 9. We rehome roughly 80 dogs a year, but we need walkers, supporters, and people who will share these dogs' stories. Útočiště pro psy bez domova v Praze 8.",
    establishedYear: 2007,
    website: "utulekliben.cz",
    socialLinks: {
      facebook: "utulekliben",
      instagram: "utulek_liben",
      email: "info@utulekliben.cz",
    },
    tagApproval: "auto",
    policy: {
      groupWalksPermitted: false,
      minimumTier: "vetted",
      vouchingNote:
        "First-time walkers come in for a 30-minute intro visit so we can match you with the right dog. Walks are solo only. Even our calmest dogs do best one-on-one.",
      workingLanguages: ["cs", "en"],
    },
    dogs: UTULEK_DOGS,
    walkers: UTULEK_WALKERS,
    supporters: UTULEK_SUPPORTERS,
    // Shared-credential-only operation in V1 — no linked staff.
    team: [],
  },
];

/* ── Lookups ─────────────────────────────────────────────────────────────── */

export function getShelterById(id: string): ShelterProfile | undefined {
  return mockShelters.find((s) => s.id === id);
}

/** Find a non-owned dog by id across all shelters. */
export function getShelterDog(
  dogId: string,
): { dog: PetProfile; shelter: ShelterProfile } | undefined {
  for (const shelter of mockShelters) {
    const dog = shelter.dogs.find((d) => d.id === dogId);
    if (dog) return { dog, shelter };
  }
  return undefined;
}

/**
 * Find a walker record by userId across all shelters. The walker is the
 * source of truth for its avatar URL — denormalized fields on post
 * objects (`Post.authorAvatarUrl`) can fall behind seed updates, so
 * MomentCard resolves the live walker avatar through this helper.
 */
export function findShelterWalker(userId: string): ShelterWalker | undefined {
  for (const shelter of mockShelters) {
    const walker = shelter.walkers.find((w) => w.userId === userId);
    if (walker) return walker;
  }
  return undefined;
}

/** Dogs that need a walk now — never walked first, then oldest lastWalkedAt. */
export function getDogsNeedingWalks(shelter: ShelterProfile): PetProfile[] {
  return [...shelter.dogs].sort((a, b) => {
    if (!a.lastWalkedAt && !b.lastWalkedAt) return 0;
    if (!a.lastWalkedAt) return -1;
    if (!b.lastWalkedAt) return 1;
    return a.lastWalkedAt.localeCompare(b.lastWalkedAt);
  });
}

/** How many dogs in this shelter need a walk now (lastWalkedAt >= 2d ago or never).
 *  Drives the "X need walks now" line on the dogs-in-care summary card. */
export function countDogsNeedingWalks(shelter: ShelterProfile): number {
  const twoDaysAgo = daysAgoIso(2, "00:00");
  return shelter.dogs.filter(
    (d) => !d.lastWalkedAt || d.lastWalkedAt < twoDaysAgo,
  ).length;
}

/** How many dogs in this shelter are long-stayers (>= 30 days in kennel). */
export function countLongStayers(shelter: ShelterProfile): number {
  return shelter.dogs.filter((d) => (d.daysInKennel ?? 0) >= 30).length;
}

/**
 * Resolve the shelter's feed — interleaves shelter-authored posts AND any
 * post tagging the shelter or one of its dogs. Sorted newest-first.
 *
 * Resolution rules:
 *  - `post.authorId === shelter.id` (shelter-authored)
 *  - or `post.tags` includes `{ type: "shelter", id: shelter.id }`
 *  - or `post.tags` includes `{ type: "dog", id: <any of shelter.dogs[].id> }`
 *
 * Walker-authored walk recap posts thus flow into the shelter feed
 * automatically via their dog/shelter tags.
 */
export function getShelterFeed(shelter: ShelterProfile): Post[] {
  const dogIds = new Set(shelter.dogs.map((d) => d.id));
  return mockPosts
    .filter((p) => {
      if (p.authorId === shelter.id) return true;
      for (const tag of p.tags) {
        if (tag.type === "shelter" && tag.id === shelter.id) return true;
        if (tag.type === "dog" && dogIds.has(tag.id)) return true;
      }
      return false;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Posts tagged with a specific shelter dog. Sorted newest-first. */
export function getDogPosts(dogId: string): Post[] {
  return mockPosts
    .filter((p) => p.tags.some((t) => t.type === "dog" && t.id === dogId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
