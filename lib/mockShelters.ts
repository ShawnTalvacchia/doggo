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
 * Avatar Rule B: shelter logo renders as a circle (institutional entity,
 * same as user profiles + communities). Dogs are rounded-panel squares.
 *
 * Image assets: shelter-specific banners, logos, and dog portraits
 * generated 2026-06-08 per the shelter image enrichment pass
 * (prompts archived at `docs/archive/image-prompts/image-prompts-shelters.md`).
 * Each shelter has its own banner + logo; each dog has a purpose-shot
 * portrait anchored in its home shelter's facility context.
 */

import type {
  PetProfile,
  Post,
  ShelterProfile,
  ShelterSupporter,
  ShelterWalker,
  WalkerTier,
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
    imageUrl: "/images/generated/shelter-dog-tonda-portrait.jpeg",
    daysInKennel: 27,
    lastWalkedAt: daysAgoIso(5, "08:30"),
    backstory:
      "Found wandering near the Hloubětín tram stop. Goofy, friendly, and absolutely thinks every walk is a special occasion just for him.",
    personalityTags: ["loves-walks", "good-with-strangers"],
    adoptionStatus: "available",
    intakeDate: daysAgo(27),
    energyLevel: "high",
    vetInfo: {
      vaccinations: [
        { type: "rabies", lastGivenAt: "2026-04-12", confidence: "self-declared" },
        { type: "parvovirus", lastGivenAt: "2026-04-12", confidence: "self-declared" },
        { type: "distemper", lastGivenAt: "2026-04-12", confidence: "self-declared" },
        { type: "hepatitis", lastGivenAt: "2026-04-12", confidence: "self-declared" },
        { type: "parainfluenza", lastGivenAt: "2026-04-12", confidence: "self-declared" },
      ],
      vaccinationsAcknowledgedAt: "2026-05-08",
      spayedNeutered: true,
    },
  },
  {
    id: "shelter-dog-maja",
    name: "Maja",
    breed: "Border collie cross",
    weightLabel: "16 kg",
    ageLabel: "6 years",
    sex: "female",
    imageUrl: "/images/generated/shelter-dog-maja-portrait.jpeg",
    daysInKennel: 45,
    lastWalkedAt: daysAgoIso(3, "16:00"),
    backstory:
      "Surrendered when her family moved abroad. Sharp and quick to learn. Would thrive with someone who likes a thinking partner.",
    personalityTags: ["smart", "reactive-on-leash"],
    adoptionStatus: "available",
    intakeDate: daysAgo(45),
    // Reactive-on-leash is a management/training need — the trainer-led
    // group walk is the socialization path for it — NOT a reason to lock a
    // dog to solo walks. soloOnly is reserved for genuine no-other-dogs
    // cases (see Berta). Doggo's stance is to socialise, not avoid; blanket
    // solo-only conservatism is the anti-pattern (Product Vision →
    // Trainer-Led Walks; Cold-Start Playbook). See Open Questions.
    energyLevel: "very_high",
  },
  {
    id: "shelter-dog-simon",
    name: "Šimon",
    breed: "German shepherd",
    weightLabel: "34 kg",
    ageLabel: "8 years",
    sex: "male",
    imageUrl: "/images/generated/shelter-dog-simon-portrait.jpeg",
    daysInKennel: 91,
    lastWalkedAt: daysAgoIso(8, "10:00"),
    backstory:
      "Older gentleman who lost his person to illness. Calm, steady, gets along with everyone. Just wants a sofa and a soft voice.",
    /* Long-stayer is auto-derived from daysInKennel; Senior stays manual
       (age-derivation deferred — ageLabel is free-text). */
    personalityTags: ["senior"],
    adoptionStatus: "available",
    intakeDate: daysAgo(91),
    // No handler gate: a calm low-energy senior who "gets along with
    // everyone" is exactly the kind of dog a mentored newcomer can walk.
    // experiencedHandlersOnly is reserved for genuinely difficult dogs
    // (see Berta) — the mentor path is how newcomers become competent.
    energyLevel: "low",
    vetInfo: {
      vaccinations: [
        { type: "rabies", lastGivenAt: "2025-12-10", confidence: "self-declared" },
        { type: "parvovirus", lastGivenAt: "2025-12-10", confidence: "self-declared" },
        { type: "distemper", lastGivenAt: "2025-12-10", confidence: "self-declared" },
        { type: "hepatitis", lastGivenAt: "2025-12-10", confidence: "self-declared" },
        { type: "parainfluenza", lastGivenAt: "2025-12-10", confidence: "self-declared" },
      ],
      vaccinationsAcknowledgedAt: "2026-03-05",
      spayedNeutered: true,
    },
  },
  {
    id: "shelter-dog-liza",
    name: "Líza",
    breed: "Staffordshire cross",
    weightLabel: "20 kg",
    ageLabel: "3 years",
    sex: "female",
    imageUrl: "/images/generated/shelter-dog-liza-portrait.jpeg",
    daysInKennel: 8,
    lastWalkedAt: daysAgoIso(0, "11:30"),
    backstory:
      "Came in with her brother (already adopted!). Bubbly, affectionate, would do well with a confident handler who can match her energy.",
    personalityTags: ["affectionate", "reactive-on-leash"],
    adoptionStatus: "available",
    intakeDate: daysAgo(8),
    // Reactive-on-leash → group-walk with management (trainer-led), not a
    // solo lock. soloOnly reserved for no-other-dogs cases (see Berta).
    energyLevel: "high",
  },
  {
    id: "shelter-dog-edda",
    name: "Edda",
    breed: "Terrier mix",
    weightLabel: "9 kg",
    ageLabel: "2 years",
    sex: "female",
    imageUrl: "/images/generated/shelter-dog-edda-portrait.jpeg",
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
    imageUrl: "/images/generated/shelter-dog-kata-portrait.jpeg",
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
    imageUrl: "/images/generated/shelter-dog-berta-portrait.jpeg",
    daysInKennel: 120,
    // Never walked through Doggo yet — sorts to the top of "Needs walks now."
    lastWalkedAt: undefined,
    backstory:
      "Came from a rural municipal pound after her owner died. Wary of new people but loyal once she trusts you. Needs a quiet home with no other dogs.",
    /* Long-stayer auto-derives from daysInKennel; "Solo only" derives
       from `soloOnly: true` via `derivePolicyChips` and renders below.
       Berta is the ONE genuine soloOnly case in the seed world: "needs a
       quiet home with no other dogs" — a real no-other-dogs constraint, not
       blanket conservatism. The reactive-on-leash dogs (Maja, Líza) were
       deliberately NOT made soloOnly — that's a management need the
       trainer-led group walk addresses, per Doggo's socialise-don't-avoid
       stance. See Open Questions (shelter solo-only defaults research gap). */
    personalityTags: ["wary-of-strangers"],
    adoptionStatus: "available",
    intakeDate: daysAgo(120),
    soloOnly: true,
    experiencedHandlersOnly: true,
    energyLevel: "low",
    vetInfo: {
      vaccinations: [
        { type: "rabies", lastGivenAt: "2026-02-04", confidence: "self-declared" },
        { type: "parvovirus", lastGivenAt: "2026-02-04", confidence: "self-declared" },
        { type: "distemper", lastGivenAt: "2026-02-04", confidence: "self-declared" },
        { type: "hepatitis", lastGivenAt: "2026-02-04", confidence: "self-declared" },
        { type: "parainfluenza", lastGivenAt: "2026-02-04", confidence: "self-declared" },
      ],
      vaccinationsAcknowledgedAt: "2026-02-04",
      spayedNeutered: true,
    },
  },
  {
    id: "shelter-dog-theo",
    name: "Theo",
    breed: "Labrador puppy",
    weightLabel: "11 kg",
    ageLabel: "5 months",
    sex: "male",
    imageUrl: "/images/generated/shelter-dog-theo-portrait.jpeg",
    daysInKennel: 3,
    lastWalkedAt: daysAgoIso(0, "13:00"),
    backstory:
      "Just arrived! Brought in with two siblings from an unplanned litter. All the puppy energy you'd expect.",
    /* "New arrival" auto-derives from daysInKennel <= 7. */
    personalityTags: ["puppy", "needs-basics"],
    adoptionStatus: "available",
    intakeDate: daysAgo(3),
    energyLevel: "very_high",
    vetInfo: {
      /* Theo's a 5-month puppy — only the first puppy-series round
         is done (parvo + distemper at ~8 weeks). Rabies, hepatitis,
         parainfluenza come with the booster series later. Realistic
         "vaccinations in progress" demo case. */
      vaccinations: [
        { type: "parvovirus", lastGivenAt: "2026-05-01", confidence: "self-declared" },
        { type: "distemper", lastGivenAt: "2026-05-01", confidence: "self-declared" },
      ],
      vaccinationsAcknowledgedAt: "2026-06-01",
      spayedNeutered: false,
    },
  },
  {
    // The Adoption-Curious Journey focal dog (2026-06-12). A gentle,
    // newcomer-walkable long-stayer — deliberately NOT soloOnly /
    // experiencedHandlersOnly, so a freshly-vouched walker (Eliška) can
    // take her. She's the research's advocacy archetype made concrete:
    // wonderful on a walk, overlooked at the kennel, so the walk recap is
    // exactly what gets her adopted. Both adoption endings hang off her —
    // the network adopts her after a recap surfaces (primary), or the
    // walker does (secondary). Placeholder portrait copied from Mila's
    // pending the image-enrichment pass (own file slot).
    id: "shelter-dog-nora",
    name: "Nora",
    breed: "Mixed breed",
    weightLabel: "18 kg",
    ageLabel: "5 years",
    sex: "female",
    imageUrl: "/images/generated/shelter-dog-nora-portrait.jpeg",
    daysInKennel: 71,
    lastWalkedAt: daysAgoIso(2, "09:30"),
    backstory:
      "Came in when her elderly owner went into care. She shrinks to the back of the kennel when people walk past, so she gets passed over again and again — but ten minutes into a walk she's a different dog, leaning into every scratch behind the ear. She just needs someone to see her outside these walls.",
    personalityTags: ["gentle", "affectionate", "good-with-strangers", "good-with-dogs", "loves-walks"],
    adoptionStatus: "available",
    intakeDate: daysAgo(71),
    energyLevel: "moderate",
    vetInfo: {
      vaccinations: [
        { type: "rabies", lastGivenAt: "2026-04-08", confidence: "self-declared" },
        { type: "parvovirus", lastGivenAt: "2026-04-08", confidence: "self-declared" },
        { type: "distemper", lastGivenAt: "2026-04-08", confidence: "self-declared" },
        { type: "hepatitis", lastGivenAt: "2026-04-08", confidence: "self-declared" },
        { type: "parainfluenza", lastGivenAt: "2026-04-08", confidence: "self-declared" },
      ],
      vaccinationsAcknowledgedAt: "2026-04-08",
      spayedNeutered: true,
    },
  },
];

/* ── Walker roster ───────────────────────────────────────────────────────── */

// Walker avatars reuse supporting-cast portraits. Same face appearing
// across multiple demo contexts is a known visual trade-off — picked
// over initials-only because the prototype reads materially richer with
// real portraits, and the bridges to real personas will be wired in
// the credentialing-moat phase. See FC9.
const UTULEK_WALKERS: ShelterWalker[] = [
  // Trusted — 2 walkers, deeply embedded
  {
    // Klára — the keystone trainer-walker (Cross-Shelter Mentor Network
    // F3, 2026-06-09). Her Super Volunteer status is the BOOTSTRAP case:
    // she walked at Útulek for years before Doggo existed, so the shelter
    // credited 60 historical walks (creditedWalkCount) when she joined —
    // reputational skin in the game per ASSUMPTION A7. The split is a
    // data-layer audit fact (surfaces show the plain "64 walks" total —
    // PO call 2026-06-10); only 4 are platform-logged. This is what
    // unlocks her mentor-session offering (platform Super Volunteer gate).
    userId: "klara",
    displayName: "Klára H.",
    avatarUrl: "/images/generated/klara-profile.jpeg",
    tier: "trusted",
    vouchedAt: daysAgo(95),
    walkCount: 64,
    creditedWalkCount: 60,
    lastWalkedAt: daysAgoIso(2, "07:45"),
  },
  {
    // Bridged walker (G, 2026-06-09) — pavel-d is a real UserProfile
    // already in the supporting cast (carer-side bridged provider).
    // Name click on Members tab now routes to /profile/pavel-d.
    userId: "pavel-d",
    displayName: "Pavel D.",
    avatarUrl: "/images/generated/marek-profile.jpeg",
    tier: "trusted",
    vouchedAt: daysAgo(420),
    walkCount: 87,
    lastWalkedAt: daysAgoIso(1, "09:30"),
  },
  // Experienced — 3 walkers
  {
    // Bridged walker (G, 2026-06-09) — marie is a real UserProfile in
    // the supporting cast. Name click routes to /profile/marie.
    userId: "marie",
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
    // Bridged walker (G, 2026-06-09) — jakub is a real UserProfile in
    // the supporting cast. Name click routes to /profile/jakub.
    userId: "jakub",
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
  // Eliška — the adoption-curious persona. Bridged to her real UserProfile
  // (userId "eliska"), so her Members-tab row links to her profile. She
  // followed Útulek recently as her first step in; her journey escalates
  // from here (Supporter → group walk → mentored → vouched Walker).
  // Adoption-Curious Journey, 2026-06-12.
  { userId: "eliska", displayName: "Eliška D.", avatarUrl: "/images/generated/eliska-profile.jpeg", since: daysAgo(12) },
];

/* ── Pes v nouzi (thin shelter) ──────────────────────────────────────────── */

/**
 * Thin shelter seed for the Help a Dog Discover door (added 2026-06-08).
 * Five dogs, no walker roster, no supporter roster, single shelter-authored
 * post. Renders /shelters/pes-v-nouzi with the same chrome, but Members tab
 * empty-states and Feed is sparse. Content quality is intentionally thin
 * per the demo-content-iteration feedback — enrichment pass later.
 */
const PES_V_NOUZI_DOGS: PetProfile[] = [
  {
    id: "pvn-dog-cira",
    name: "Círa",
    breed: "Beagle mix",
    weightLabel: "14 kg",
    ageLabel: "3 years",
    sex: "female",
    imageUrl: "/images/generated/shelter-dog-cira-portrait.jpeg",
    daysInKennel: 18,
    lastWalkedAt: daysAgoIso(2, "11:00"),
    backstory:
      "Surrendered when her family moved into a no-pets building. Curious, friendly, would suit an active home.",
    personalityTags: ["affectionate", "loves-walks", "good-with-dogs"],
    adoptionStatus: "available",
    intakeDate: daysAgo(18),
    energyLevel: "moderate",
  },
  {
    id: "pvn-dog-baron",
    name: "Baron",
    breed: "German shepherd mix",
    weightLabel: "30 kg",
    ageLabel: "6 years",
    sex: "male",
    imageUrl: "/images/generated/shelter-dog-baron-portrait.jpeg",
    daysInKennel: 52,
    lastWalkedAt: daysAgoIso(4, "14:00"),
    backstory:
      "Came in after his owner passed away. Calm, devoted, gets along with everyone once introduced.",
    personalityTags: ["gentle", "calm", "senior"],
    adoptionStatus: "available",
    intakeDate: daysAgo(52),
    // No handler gate — a gentle calm senior, walkable by a mentored
    // newcomer. (experiencedHandlersOnly reserved for genuinely hard dogs.)
    energyLevel: "low",
  },
  {
    id: "pvn-dog-rosa",
    name: "Rosa",
    breed: "Pinscher",
    weightLabel: "6 kg",
    ageLabel: "4 years",
    sex: "female",
    imageUrl: "/images/generated/shelter-dog-rosa-portrait.jpeg",
    daysInKennel: 9,
    lastWalkedAt: daysAgoIso(0, "10:00"),
    backstory:
      "Small but bossy. Likes long sniffy walks and a sunny windowsill.",
    personalityTags: ["independent", "smart"],
    adoptionStatus: "available",
    intakeDate: daysAgo(9),
    energyLevel: "moderate",
  },
  {
    id: "pvn-dog-archie",
    name: "Archie",
    breed: "Mixed breed",
    weightLabel: "20 kg",
    ageLabel: "2 years",
    sex: "male",
    imageUrl: "/images/generated/shelter-dog-archie-portrait.jpeg",
    daysInKennel: 38,
    lastWalkedAt: daysAgoIso(1, "16:00"),
    backstory:
      "Found wandering in Holešovice. High-energy, would thrive with someone who runs or bikes.",
    personalityTags: ["playful", "loves-walks", "good-with-strangers"],
    adoptionStatus: "available",
    intakeDate: daysAgo(38),
    energyLevel: "very_high",
  },
  {
    id: "pvn-dog-tina",
    name: "Tina",
    breed: "Spaniel cross",
    weightLabel: "11 kg",
    ageLabel: "8 months",
    sex: "female",
    imageUrl: "/images/generated/shelter-dog-tina-portrait.jpeg",
    daysInKennel: 5,
    lastWalkedAt: daysAgoIso(0, "13:30"),
    backstory:
      "Puppy from an unplanned litter. Sweet, social, ready to learn everything.",
    personalityTags: ["puppy", "playful", "affectionate"],
    adoptionStatus: "available",
    intakeDate: daysAgo(5),
    energyLevel: "high",
  },
];

/* ── Druhá šance (thin shelter) ──────────────────────────────────────────── */

const DRUHA_SANCE_DOGS: PetProfile[] = [
  {
    id: "ds-dog-jasper",
    name: "Jasper",
    breed: "Labrador mix",
    weightLabel: "25 kg",
    ageLabel: "5 years",
    sex: "male",
    imageUrl: "/images/generated/shelter-dog-jasper-portrait.jpeg",
    daysInKennel: 22,
    lastWalkedAt: daysAgoIso(3, "09:30"),
    backstory:
      "Surrendered after his family moved abroad. Loyal, food-motivated, would do well with kids.",
    personalityTags: ["affectionate", "good-with-kids", "good-with-strangers"],
    adoptionStatus: "available",
    intakeDate: daysAgo(22),
    energyLevel: "moderate",
  },
  {
    id: "ds-dog-mila",
    name: "Mila",
    breed: "Mixed breed",
    weightLabel: "15 kg",
    ageLabel: "7 years",
    sex: "female",
    imageUrl: "/images/generated/shelter-dog-mila-portrait.jpeg",
    daysInKennel: 75,
    lastWalkedAt: daysAgoIso(6, "12:00"),
    backstory:
      "A long-stayer the team has come to love. Gentle, quiet, and waiting for someone to notice her.",
    personalityTags: ["gentle", "calm", "shy"],
    adoptionStatus: "available",
    intakeDate: daysAgo(75),
    // Shy + gentle is a reason to socialise gently, not to lock solo —
    // a calm group with the right handler is exactly what helps her.
    energyLevel: "low",
  },
  {
    id: "ds-dog-bruno",
    name: "Bruno",
    breed: "Boxer mix",
    weightLabel: "27 kg",
    ageLabel: "4 years",
    sex: "male",
    imageUrl: "/images/generated/shelter-dog-bruno-portrait.jpeg",
    daysInKennel: 11,
    lastWalkedAt: daysAgoIso(1, "08:00"),
    backstory:
      "Bouncy, playful, and very keen on tennis balls. Looking for an active family.",
    personalityTags: ["playful", "loves-walks", "good-with-dogs"],
    adoptionStatus: "available",
    intakeDate: daysAgo(11),
    energyLevel: "high",
  },
  {
    id: "ds-dog-vera",
    name: "Věra",
    breed: "Terrier mix",
    weightLabel: "8 kg",
    ageLabel: "9 years",
    sex: "female",
    imageUrl: "/images/generated/shelter-dog-vera-portrait.jpeg",
    daysInKennel: 4,
    lastWalkedAt: daysAgoIso(0, "11:30"),
    backstory:
      "An older lady who just wants a quiet sofa. Knows her routines.",
    personalityTags: ["senior", "calm", "gentle"],
    adoptionStatus: "pending",
    intakeDate: daysAgo(4),
    energyLevel: "low",
  },
];

/* ── The shelters ────────────────────────────────────────────────────────── */

export const mockShelters: ShelterProfile[] = [
  {
    id: "utulek-liben",
    name: "Útulek Liběň",
    logoUrl: "/images/generated/shelter-utulek-liben-logo.jpeg",
    bannerUrl: "/images/generated/shelter-utulek-liben-banner.jpeg",
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
      // Group walks permitted (FC18 host shelter, Adoption-Curious Journey
      // 2026-06-12). Útulek runs a trainer-led group walk where vouched
      // walkers each take a dog — the socialise-don't-avoid stance in
      // practice. Per-dog overrides still gate the genuinely-difficult dogs
      // (Berta stays solo); strictest rule wins at the eligibility check.
      groupWalksPermitted: true,
      minimumTier: "vetted",
      vouchingNote:
        "First-time walkers come in for a 30-minute intro visit so we can match you with the right dog. Once you're vouched you can join our trainer-led group walk too — most of our dogs do better, not worse, in good company.",
      workingLanguages: ["cs", "en"],
      // Mentor-vouching pilot shelter (Cross-Shelter Mentor Network D2).
      // Accepts the mentor path at the platform-suggested 3-session
      // minimum — the demo's primary graduation arc runs here.
      acceptsMentorVouches: true,
      mentorSessionMinimum: 3,
    },
    dogs: UTULEK_DOGS,
    walkers: UTULEK_WALKERS,
    supporters: UTULEK_SUPPORTERS,
    // Shared-credential-only operation in V1 — no linked staff.
    team: [],
  },
  /* ── Pes v nouzi (thin) ────────────────────────────────────────────── */
  {
    id: "pes-v-nouzi",
    name: "Pes v nouzi",
    logoUrl: "/images/generated/shelter-pes-v-nouzi-logo.jpeg",
    bannerUrl: "/images/generated/shelter-pes-v-nouzi-banner.jpeg",
    location: "Holešovice, Prague 7",
    neighbourhood: "Holešovice",
    bio:
      "A small private rescue in Holešovice. We focus on dogs who slipped through cracks — abandonments, surrenders, late-in-life loss of an owner. Working with a handful of volunteer walkers and foster families.",
    establishedYear: 2014,
    website: "",
    socialLinks: {
      email: "info@pesvnouzi.cz",
    },
    tagApproval: "auto",
    policy: {
      groupWalksPermitted: false,
      minimumTier: "vetted",
      vouchingNote:
        "We meet every volunteer for a short walk-along before the first solo outing.",
      workingLanguages: ["cs"],
      // Accepts mentor-vouches but overrides the minimum upward (5 — a
      // small rescue wanting more supervised time). Demonstrates the
      // per-shelter override per D2; ASSUMPTION A6.
      acceptsMentorVouches: true,
      mentorSessionMinimum: 5,
    },
    dogs: PES_V_NOUZI_DOGS,
    walkers: [],
    supporters: [],
    team: [],
  },
  /* ── Druhá šance (thin) ────────────────────────────────────────────── */
  {
    id: "druha-sance",
    name: "Druhá šance",
    logoUrl: "/images/generated/shelter-druha-sance-logo.jpeg",
    bannerUrl: "/images/generated/shelter-druha-sance-banner.jpeg",
    location: "Karlín, Prague 8",
    neighbourhood: "Karlín",
    bio:
      "A community-run rescue helping seniors and special-needs dogs find homes. We're small by design — every dog gets a careful match.",
    establishedYear: 2018,
    website: "",
    socialLinks: {
      email: "ahoj@druhasance.cz",
    },
    tagApproval: "auto",
    policy: {
      groupWalksPermitted: false,
      minimumTier: "vetted",
      vouchingNote:
        "Walkers join after a coordinator-led intro session. Solo walks only for our seniors.",
      workingLanguages: ["cs", "en"],
      // Does NOT accept mentor-vouches — the demo's non-accepting
      // contrast case (D2 + C3). Completed mentor sessions elsewhere
      // surface as a "Mentor-recommended" credibility line on the
      // standard apply path; the coordinator still gates. ASSUMPTION A10
      // (resistance may be about control, not trust) — this posture has
      // to be first-class, not a fallback.
      acceptsMentorVouches: false,
    },
    dogs: DRUHA_SANCE_DOGS,
    walkers: [],
    supporters: [],
    team: [],
  },
];

/* ── Lookups ─────────────────────────────────────────────────────────────── */

export function getShelterById(id: string): ShelterProfile | undefined {
  return mockShelters.find((s) => s.id === id);
}

/**
 * All seeded shelters. Powers the Help a Dog Discover door's cross-shelter
 * surfaces (Shelters pill list + flat shelter-dog feed). Named explicitly
 * so the eventual `OrgProfile` generalization (see Open Questions §14
 * "ShelterProfile → OrgProfile generalization") is mechanical when the
 * second institutional type lands — a future `getAllOrgs()` is a clear
 * follow-on, not a quiet rename.
 */
export function getAllShelters(): ShelterProfile[] {
  return mockShelters;
}

/**
 * All shelters where `userId` is a walker — combines static roster
 * entries (mockShelters.walkers) with vouched WalkerApplication
 * records (callers pass those in, since this helper is sync mock).
 *
 * Returns a per-shelter entry with the walker's tier + walk count for
 * the "Volunteer work" section on user profiles (L per O6).
 */
export function getUserShelterAffiliations(
  userId: string,
  dynamicVouchedShelters: { shelterId: string; walkCount: number; vouchedAt: string; creditedWalkCount?: number }[] = [],
  /** Shelter promote/demote calls, keyed `${shelterId}::${userId}` (O4
   *  resolution 2026-06-10) — the shelter's explicit tier wins over both
   *  the seeded static tier and the walk-count derivation. */
  tierOverrides: Record<string, WalkerTier> = {},
): { shelter: ShelterProfile; tier: WalkerTier; walkCount: number; creditedWalkCount?: number }[] {
  const out: { shelter: ShelterProfile; tier: WalkerTier; walkCount: number; creditedWalkCount?: number }[] = [];
  for (const shelter of mockShelters) {
    const override = tierOverrides[`${shelter.id}::${userId}`];
    const dyn = dynamicVouchedShelters.find((d) => d.shelterId === shelter.id);
    // Static roster — seeded mockShelters entry. Dynamic activity
    // (logged walks, shelter credits) accrues ON TOP of the seeded
    // history — a static walker who gets credited 25 more walks shows
    // the sum, not the frozen seed. 2026-06-10.
    const staticEntry = shelter.walkers.find((w) => w.userId === userId);
    if (staticEntry) {
      out.push({
        shelter,
        tier: override ?? staticEntry.tier,
        walkCount: staticEntry.walkCount + (dyn?.walkCount ?? 0),
        creditedWalkCount:
          (staticEntry.creditedWalkCount ?? 0) + (dyn?.creditedWalkCount ?? 0) || undefined,
      });
      continue;
    }
    // Dynamic — from a vouched WalkerApplication.
    if (dyn) {
      // Derive tier from walkCount per D1 thresholds; can't import the
      // helper here without a circular dep, so duplicate the rule.
      const derived: WalkerTier =
        dyn.walkCount >= 25 ? "trusted" : dyn.walkCount >= 10 ? "experienced" : "vetted";
      out.push({
        shelter,
        tier: override ?? derived,
        walkCount: dyn.walkCount,
        creditedWalkCount: dyn.creditedWalkCount,
      });
    }
  }
  return out;
}

/** All shelter dogs across all seeded shelters, with shelter context attached
 *  for surfaces that need attribution (Discover dog card). Stable across
 *  re-renders; no sort applied — callers sort by the user's selected key. */
export function getAllShelterDogs(): { dog: PetProfile; shelter: ShelterProfile }[] {
  const out: { dog: PetProfile; shelter: ShelterProfile }[] = [];
  for (const shelter of mockShelters) {
    for (const dog of shelter.dogs) {
      out.push({ dog, shelter });
    }
  }
  return out;
}

/**
 * Find a shelter dog by display name within one shelter. Booking records
 * carry pet NAMES (not ids) in `Booking.pets`, so shelter-walk surfaces
 * resolve the dog's portrait/profile through this. Case-insensitive.
 * Cross-Shelter Mentor Network G, 2026-06-09.
 */
export function getShelterDogByName(
  shelterId: string,
  name: string,
): PetProfile | undefined {
  const shelter = getShelterById(shelterId);
  return shelter?.dogs.find((d) => d.name.toLowerCase() === name.toLowerCase());
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

/**
 * All posts tagged with the given dog, ungated. Use only for surfaces
 * that don't apply viewer visibility — e.g. the shelter-dog RecentWalkers
 * card (walker activity surfaces public-ish; the shelter profile itself
 * is the privacy boundary).
 *
 * For viewer-gated reads (auto-album, profile photo grid), call
 * `getPostsByDog(dogId, viewerId)` in `lib/dogPosts.ts` — it layers the
 * two-gate Content Visibility Model on top, plus the owner-bypass rule
 * (owner sees ALL tagged posts on their own dog).
 *
 * Sorted newest-first.
 */
export function getDogPosts(dogId: string): Post[] {
  return mockPosts
    .filter((p) => p.tags.some((t) => t.type === "dog" && t.id === dogId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
