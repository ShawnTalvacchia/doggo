import { ExploreFilters, ProviderCard, SignupDraft } from "@/lib/types";
import { FILTER_RATE_MAX_KC, FILTER_RATE_MIN_KC } from "@/lib/pricing";

export const defaultSignupDraft: SignupDraft = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  roles: [],
  bio: "",
  location: "",
  publicProfile: false,
  pet: {
    name: "",
    breed: "",
    size: "",
    age: "",
    temperament: "",
    goodWithDogs: false,
    goodWithKids: false,
    healthNotes: "",
  },
  // Dogs you can care for
  dogSizes: [],
  dogAges: [],
  dogTemperamentsExcluded: [],
  dogSpecialNotes: "",
  dogsCanCareFor: [],
  // Walking service setup
  walkingRadius: 5,
  walkingDays: [],
  walkingTimes: [],
  // Hosting service setup
  hostDays: [],
  hostTimes: [],
  homeType: "",
  outdoorSpace: "",
  dogStayArea: "",
  // Pricing — set in /signup/pricing
  prices: {
    walks_checkins: null,
    house_sitting: null,
    day_care: null,
    boarding: null,
  },
  acceptTos: false,
  acceptPrivacy: false,
};

export const defaultExploreFilters: ExploreFilters = {
  service: null,
  address: "",
  dateRange: { start: null, end: null },
  startDate: null,
  times: [],
  minRate: FILTER_RATE_MIN_KC,
  maxRate: FILTER_RATE_MAX_KC,
  pets: ["Spot", "Goldie"],
};

export const dogsCareOptions = [
  "Small dogs (under 10kg)",
  "Medium dogs (10kg - 25kg)",
  "Large dogs (25kg+)",
  "Puppies",
  "Senior dogs",
  "High-energy breeds",
];

/**
 * Provider directory.
 *
 * **Provider ↔ User bridge contract** (Mock World Building A1, 2026-04-30):
 *
 * **Bridge contract (Discover Refinement B, 2026-05-10):** every entry
 * in this array now carries a `userId` field bridging to a real
 * `UserProfile` in `lib/mockUsers.ts`. The earlier "directory-only"
 * pattern (ProviderCard with no UserProfile counterpart) was retired
 * during Discover Refinement — every Carer in `/discover/care` is now a
 * real user, and per-viewer signals like connection state, trust badges,
 * and per-service pricing all resolve through the bridge.
 *
 * Rules:
 * 1. **Bookings, conversations, meet attendees** that reference a Carer
 *    (e.g. `carerId: "olga-m"`) should still snapshot the display fields
 *    they need (`carerName`, `carerAvatarUrl`, etc.) on the surrounding
 *    object — that pattern survives the bridge and is the right shape
 *    for a future Supabase migration where joins are explicit.
 * 2. **Bridge field.** Every ProviderCard's `userId` matches an entry in
 *    `mockUsers.allUsers`. The IDs typically match (e.g. `jana-k` ↔
 *    `jana-k`), but `klara-h` → `klara`, `nikola-r` → `nikola`,
 *    `lenka-n` → `lenka-vet` because those bridge to journey-persona
 *    user IDs that pre-existed.
 * 3. **Profile navigation** (`/profile/[userId]`) uses
 *    `getUserOrProvider(id)` from `lib/mockUsers.ts`, which prefers the
 *    bridged `UserProfile`. The synthesis fallback exists for safety but
 *    no live ProviderCard hits it post-bridge.
 * 4. **Per-service data** (per-service pricing, modifier configs,
 *    credentials, repeat-client counts) lives on the bridged
 *    `UserProfile.carerProfile.*`. ProviderCard's legacy single-price
 *    fields (`priceFrom` + `priceUnit`) remain as a fallback when no
 *    active service filter is set; per-service prices resolve through
 *    `CardExploreResult.resolveDisplayPrice` → bridged services array.
 *
 * Carers with `publicProfile: false` (services for the Connected circle
 * only) live as full `UserProfile` entries in `lib/mockUsers.ts` and do
 * NOT appear here — they don't surface in `/discover/care`. The Discover
 * Refinement community-first ordering surfaces those Carers from the
 * viewer's connection graph above this directory.
 */
export const providers: ProviderCard[] = [
  {
    id: "olga-m",
    name: "Olga M.",
    district: "Prague 5",
    neighborhood: "Smichov",
    rating: 4.8,
    reviewCount: 12,
    priceFrom: 390,
    priceUnit: "per_visit",
    blurb: "Clean, fun & safe home for your pup",
    avatarUrl:
      "/images/generated/lucie-profile.jpeg",
    services: ["walks_checkins", "house_sitting", "day_care"],
    availableTimes: ["6-11", "11-15"],
    distanceKm: 0.8,
    neighbourhoodMatch: true,
    mutualConnections: 2,
    lat: 50.0757,
    lng: 14.402,
    userId: "olga-m",
  },
  {
    id: "klara-h",
    name: "Klára Horáčková",
    district: "Prague 7",
    neighborhood: "Holešovice",
    rating: 4.9,
    reviewCount: 31,
    priceFrom: 300,
    priceUnit: "per_walk",
    blurb: "Force-free trainer · group sessions at Stromovka + 1-on-1s",
    avatarUrl: "/images/generated/klara-profile.jpeg",
    services: ["walks_checkins"],
    // Klára's `klara-1on1` is an Appointment with `appointmentCategory: "training"`
    // (authoritative source on her bridged carerProfile.services). Tagging the
    // directory card matches her against the "Appointment" + "Training" pills.
    appointmentTypes: ["training"],
    availableTimes: ["6-11", "11-15", "15-22"],
    distanceKm: 1.5,
    neighbourhoodMatch: false,
    mutualConnections: 3,
    lat: 50.1041,
    lng: 14.4246,
    userId: "klara",
  },
  {
    id: "lenka-n",
    name: "Lenka Nováková",
    district: "Prague 2",
    neighborhood: "Vinohrady",
    rating: 4.9,
    reviewCount: 24,
    priceFrom: 500,
    priceUnit: "per_visit",
    blurb: "Salon groomer · calm-handling, force-free methods for anxious dogs",
    avatarUrl: "/images/generated/zuzana-profile.jpeg",
    // Care `services` stay empty — appointments aren't a Care subtype.
    // Grooming surfaces via the Appointment filter pill driven by
    // `appointmentTypes`; the authoritative offering data lives on the
    // bridged `lenkaVet.carerProfile.services` (kind: "appointment").
    // Discover Refinement D1, 2026-05-10. Lenka was originally seeded as
    // a vet (Discover & Care C3); repurposed as a groomer in the
    // walkthrough D1 to match the strategic call (Open Q §6) to sunset
    // vets from the demo arc.
    services: [],
    appointmentTypes: ["grooming"],
    availableTimes: ["6-11", "11-15"],
    distanceKm: 2.0,
    neighbourhoodMatch: false,
    mutualConnections: 1,
    lat: 50.0755,
    lng: 14.4378,
    userId: "lenka-vet",
  },
  {
    id: "nikola-r",
    name: "Nikola R.",
    district: "Prague 2",
    neighborhood: "Vinohrady",
    rating: 4.9,
    reviewCount: 20,
    priceFrom: 470,
    priceUnit: "per_walk",
    blurb: "Structured walks and calm routines",
    avatarUrl:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80",
    services: ["walks_checkins", "boarding"],
    availableTimes: ["11-15", "15-22"],
    distanceKm: 2.3,
    neighbourhoodMatch: false,
    mutualConnections: 1,
    lat: 50.0748,
    lng: 14.4369,
    userId: "nikola",
  },
  {
    id: "jana-k",
    name: "Jana K.",
    district: "Prague 6",
    neighborhood: "Dejvice",
    rating: 4.7,
    reviewCount: 9,
    priceFrom: 330,
    priceUnit: "per_visit",
    blurb: "Patient care for shy and senior dogs",
    avatarUrl:
      "/images/generated/eva-profile.jpeg",
    services: ["walks_checkins", "house_sitting", "day_care", "boarding"],
    availableTimes: ["6-11", "15-22"],
    distanceKm: 3.7,
    neighbourhoodMatch: false,
    mutualConnections: 0,
    lat: 50.101,
    lng: 14.3888,
    userId: "jana-k",
  },
  {
    id: "tomas-b",
    name: "Tomáš B.",
    district: "Prague 3",
    neighborhood: "Žižkov",
    rating: 4.6,
    reviewCount: 7,
    priceFrom: 520,
    priceUnit: "per_walk",
    blurb: "Solo walks with a trainer's touch",
    avatarUrl:
      "/images/generated/shawn-profile.jpg",
    services: ["walks_checkins"],
    availableTimes: ["6-11", "15-22"],
    distanceKm: 1.5,
    neighbourhoodMatch: false,
    mutualConnections: 0,
    lat: 50.0834,
    lng: 14.451,
    userId: "tomas-b",
  },
  {
    id: "marketa-h",
    name: "Markéta H.",
    district: "Prague 1",
    neighborhood: "Staré Město",
    rating: 5.0,
    reviewCount: 34,
    priceFrom: 600,
    priceUnit: "per_visit",
    blurb: "Premium full-service care in the heart of Prague",
    avatarUrl:
      "/images/generated/tereza-profile.jpeg",
    services: ["walks_checkins", "day_care", "boarding"],
    availableTimes: ["11-15"],
    distanceKm: 3.2,
    neighbourhoodMatch: false,
    mutualConnections: 1,
    lat: 50.088,
    lng: 14.4189,
    userId: "marketa-h",
  },
  {
    id: "pavel-d",
    name: "Pavel D.",
    district: "Prague 8",
    neighborhood: "Karlín",
    rating: 4.5,
    reviewCount: 15,
    priceFrom: 440,
    priceUnit: "per_walk",
    blurb: "Family home, sociable dogs very welcome",
    avatarUrl:
      "/images/generated/daniel-profile.jpeg",
    services: ["walks_checkins", "boarding"],
    availableTimes: ["6-11", "11-15"],
    distanceKm: 4.1,
    neighbourhoodMatch: false,
    mutualConnections: 0,
    lat: 50.0944,
    lng: 14.45,
    userId: "pavel-d",
  },
  {
    id: "simona-v",
    name: "Simona V.",
    district: "Prague 4",
    neighborhood: "Nusle",
    rating: 4.8,
    reviewCount: 22,
    priceFrom: 350,
    priceUnit: "per_visit",
    blurb: "Calm, attentive home sitter — always available",
    avatarUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
    services: ["day_care", "boarding"],
    availableTimes: ["11-15"],
    distanceKm: 2.0,
    neighbourhoodMatch: false,
    mutualConnections: 3,
    lat: 50.062,
    lng: 14.428,
    userId: "simona-v",
  },
  {
    id: "martin-k",
    name: "Martin K.",
    district: "Prague 7",
    neighborhood: "Holešovice",
    rating: 4.7,
    reviewCount: 11,
    priceFrom: 480,
    priceUnit: "per_walk",
    blurb: "Active walks and reliable boarding by the river",
    avatarUrl:
      "/images/generated/martin-profile.jpeg",
    services: ["walks_checkins", "boarding"],
    availableTimes: ["6-11", "15-22"],
    distanceKm: 1.8,
    neighbourhoodMatch: false,
    mutualConnections: 1,
    lat: 50.1022,
    lng: 14.4342,
    userId: "martin-k",
  },
  {
    id: "lenka-s",
    name: "Lenka S.",
    district: "Prague 10",
    neighborhood: "Vršovice",
    rating: 4.6,
    reviewCount: 8,
    priceFrom: 310,
    priceUnit: "per_visit",
    blurb: "Affordable care for all dogs — walks and overnight",
    avatarUrl:
      "/images/generated/jana-profile.jpeg",
    services: ["walks_checkins", "house_sitting", "day_care", "boarding"],
    availableTimes: ["6-11", "11-15"],
    distanceKm: 2.9,
    neighbourhoodMatch: false,
    mutualConnections: 0,
    lat: 50.0697,
    lng: 14.4503,
    userId: "lenka-s",
  },
  {
    id: "petr-v",
    name: "Petr V.",
    district: "Prague 9",
    neighborhood: "Vysočany",
    rating: 4.9,
    reviewCount: 18,
    priceFrom: 720,
    priceUnit: "per_night",
    blurb: "Home away from home — sitting and boarding only",
    avatarUrl:
      "/images/generated/tomas-profile.jpeg",
    services: ["day_care", "boarding"],
    availableTimes: ["6-11", "11-15", "15-22"],
    distanceKm: 5.2,
    neighbourhoodMatch: false,
    mutualConnections: 0,
    lat: 50.1094,
    lng: 14.4992,
    userId: "petr-v",
  },
];
