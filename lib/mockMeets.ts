import type {
  Meet,
  MeetAttendee,
  MeetEnergyLevel,
  MeetOccurrence,
  WalkPace,
  WalkDistance,
  WalkTerrain,
  ParkAmenity,
  ParkVibe,
  PlaydateAgeRange,
  MeetPlayStyle,
  TrainingSkill,
  TrainingExperienceLevel,
  TrainerType,
} from "./types";
import { daysAgo, daysFromNow } from "./mockDate";
import { getOccurrenceAttendees, nextOccurrenceDates } from "./meetUtils";

export const MEET_TYPE_LABELS: Record<string, string> = {
  walk: "Walk",
  park_hangout: "Park Hangout",
  playdate: "Playdate",
  training: "Training",
};

export const LEASH_LABELS: Record<string, string> = {
  on_leash: "On leash",
  off_leash: "Off leash",
  mixed: "Mixed",
};

export const ENERGY_LABELS: Record<MeetEnergyLevel, string> = {
  calm: "Calm",
  moderate: "Moderate",
  high: "High energy",
  any: "Any energy",
};

export const PACE_LABELS: Record<WalkPace, string> = {
  leisurely: "Leisurely",
  moderate: "Moderate",
  brisk: "Brisk",
};

export const DISTANCE_LABELS: Record<WalkDistance, string> = {
  short: "Short (< 2 km)",
  medium: "Medium (2–4 km)",
  long: "Long (4+ km)",
};

export const TERRAIN_LABELS: Record<WalkTerrain, string> = {
  paved: "Paved paths",
  trails: "Trails",
  mixed: "Mixed terrain",
};

export const AMENITY_LABELS: Record<ParkAmenity, string> = {
  fenced_area: "Fenced area",
  water_available: "Water available",
  shade: "Shade",
  benches: "Benches",
  parking_nearby: "Parking nearby",
};

export const VIBE_LABELS: Record<ParkVibe, string> = {
  casual: "Casual drop-in",
  organised: "Organised meetup",
};

export const AGE_RANGE_LABELS: Record<PlaydateAgeRange, string> = {
  puppy: "Puppies (< 1 yr)",
  young: "Young (1–3 yr)",
  adult: "Adults (3–8 yr)",
  senior: "Seniors (8+ yr)",
  any: "Any age",
};

export const PLAY_STYLE_LABELS: Record<MeetPlayStyle, string> = {
  gentle: "Gentle / calm",
  active: "Active / rough",
  mixed: "Mixed",
};

export const SKILL_LABELS: Record<TrainingSkill, string> = {
  recall: "Recall",
  leash_manners: "Leash manners",
  socialisation: "Socialisation",
  obedience: "Obedience",
  agility: "Agility",
  tricks: "Tricks",
};

export const EXPERIENCE_LABELS: Record<TrainingExperienceLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  all_levels: "All levels",
};

export const TRAINER_TYPE_LABELS: Record<TrainerType, string> = {
  peer: "Peer group (informal)",
  professional: "Professional trainer",
};

export const mockMeets: Meet[] = [
  {
    id: "meet-1",
    visibility: "group_only",
    type: "walk",
    groupId: "group-1",
    title: "Morning walk — Riegrovy sady",
    coverPhotoUrl: "/images/generated/group-walk-stromovka.jpeg",
    description:
      "Relaxed morning walk through the park. We usually do a loop around the upper path and let the dogs sniff around. All sizes welcome.",
    location: "Riegrovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0785,
    lng: 14.4416,
    date: daysAgo(2),
    time: "08:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 8,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "completed",
    energyLevel: "moderate",
    whatToBring: ["Water bottle", "Poo bags", "Treats"],
    accessibilityNotes: "Paved paths throughout, stroller-friendly",
    walk: {
      pace: "leisurely",
      distance: "medium",
      terrain: "paved",
      routeNotes: "Start at the upper gate near Mánesova, loop past the beer garden, end at the playground.",
    },
    creatorId: "shawn",
    creatorName: "Shawn",
    creatorAvatarUrl:
      "/images/generated/shawn-profile.jpg",
    attendees: [
      {
        userId: "shawn",
        userName: "Shawn",
        avatarUrl:
          "/images/generated/shawn-profile.jpg",
        dogNames: ["Spot", "Goldie"],
        neighbourhood: "Vinohrady",
        dogBreed: "Dalmatian Mix",
        profileOpen: true,
      },
      {
        userId: "jana",
        userName: "Jana",
        avatarUrl:
          "/images/generated/jana-profile.jpeg",
        dogNames: ["Rex"],
        neighbourhood: "Vinohrady",
        dogBreed: "German Shepherd",
      },
      {
        userId: "tomas",
        userName: "Tomáš",
        avatarUrl:
          "/images/generated/tomas-profile.jpeg",
        dogNames: ["Hugo"],
        neighbourhood: "Karlín",
        dogBreed: "Labrador Retriever",
      },
    ],
    recentJoinText: "Tomáš joined 2h ago",
    createdAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "meet-2",
    visibility: "public",
    type: "park_hangout",
    groupId: "group-2",
    title: "Weekend hangout — Stromovka",
    coverPhotoUrl: "/images/generated/park-hangout-riegrovy.jpeg",
    description:
      "Casual Saturday hangout in the big field by the pond. Bring a ball, bring treats. Dogs play, owners chat.",
    location: "Stromovka, Prague 7",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: daysFromNow(1),
    time: "10:00",
    durationMinutes: 90,
    cadence: "one_off",
    maxAttendees: 12,
    dogSizeFilter: "any",
    leashRule: "off_leash",
    status: "upcoming",
    isPopular: true,
    recentJoinText: "3 people joined today",
    energyLevel: "any",
    whatToBring: ["Ball", "Treats", "Blanket to sit on"],
    accessibilityNotes: "Flat grass field, easy access from tram stop",
    parkHangout: {
      dropIn: true,
      endTime: "12:00",
      amenities: ["shade", "benches", "water_available"],
      vibe: "casual",
    },
    creatorId: "jana",
    creatorName: "Jana",
    creatorAvatarUrl:
      "/images/generated/jana-profile.jpeg",
    attendees: [
      {
        userId: "jana",
        userName: "Jana",
        avatarUrl:
          "/images/generated/jana-profile.jpeg",
        dogNames: ["Rex"],
        neighbourhood: "Vinohrady",
        dogBreed: "German Shepherd",
      },
      {
        userId: "eva",
        userName: "Eva",
        avatarUrl:
          "/images/generated/eva-profile.jpeg",
        dogNames: ["Luna", "Max"],
        neighbourhood: "Letná",
        dogBreed: "Border Collie",
        profileOpen: true,
      },
      {
        userId: "martin",
        userName: "Martin",
        avatarUrl:
          "/images/generated/martin-profile.jpeg",
        dogNames: ["Charlie"],
        neighbourhood: "Holešovice",
        dogBreed: "French Bulldog",
      },
      // Interested attendees (social signal, not counted toward capacity)
      {
        userId: "nikola-r",
        userName: "Nikola R.",
        avatarUrl:
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80",
        dogNames: ["Rex"],
        rsvpStatus: "interested",
        neighbourhood: "Vinohrady",
      },
      {
        userId: "olga-m",
        userName: "Olga M.",
        avatarUrl: "/images/generated/lucie-profile.jpeg",
        dogNames: ["Mila"],
        rsvpStatus: "interested",
        neighbourhood: "Smíchov",
        dogBreed: "Cavalier King Charles",
      },
      // Locked/hidden attendees (tier 3 — shown as count)
      {
        userId: "petr-v",
        userName: "Petr V.",
        avatarUrl: "",
        dogNames: ["Brok"],
        neighbourhood: "Holešovice",
        dogBreed: "Mixed",
      },
      {
        userId: "simona-v",
        userName: "Simona V.",
        avatarUrl:
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80",
        dogNames: ["Daisy"],
        neighbourhood: "Karlín",
      },
    ],
    createdAt: "2026-03-12T14:30:00Z",
  },
  {
    id: "meet-3",
    visibility: "public",
    type: "training",
    groupId: "group-4",
    title: "Recall practice — Letná",
    coverPhotoUrl: "/images/generated/training-session.jpeg",
    description:
      "Small group recall training session. Ideal for dogs that need work on coming back when called. Bring high-value treats!",
    location: "Letenské sady, Prague 7",
    neighbourhood: "Letná",
    lat: 50.0968,
    lng: 14.4244,
    date: daysFromNow(2),
    time: "09:00",
    durationMinutes: 45,
    cadence: "one_off",
    maxAttendees: 5,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
    energyLevel: "moderate",
    whatToBring: ["High-value treats", "Long lead (5m)", "Treat pouch"],
    accessibilityNotes: "Open grass area, some gentle slopes",
    training: {
      skillFocus: ["recall"],
      experienceLevel: "beginner",
      ledBy: "peer",
      equipmentNeeded: ["High-value treats", "Long lead (5m)", "Treat pouch"],
    },
    creatorId: "eva",
    creatorName: "Eva",
    creatorAvatarUrl:
      "/images/generated/eva-profile.jpeg",
    attendees: [
      {
        userId: "eva",
        userName: "Eva",
        avatarUrl:
          "/images/generated/eva-profile.jpeg",
        dogNames: ["Luna"],
      },
      {
        userId: "tomas",
        userName: "Tomáš",
        avatarUrl:
          "/images/generated/tomas-profile.jpeg",
        dogNames: ["Hugo"],
      },
    ],
    createdAt: "2026-03-14T09:00:00Z",
  },
  {
    id: "meet-4",
    visibility: "group_only",
    type: "playdate",
    groupId: "group-1",
    title: "Puppy socialisation — Havlíčkovy sady",
    coverPhotoUrl: "/images/generated/puppy-socialization.jpeg",
    description:
      "Small playdate for puppies under 1 year. Calm, supervised play so young dogs can build confidence. Small dogs preferred.",
    location: "Havlíčkovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0725,
    lng: 14.4405,
    date: daysFromNow(4),
    time: "14:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 6,
    dogSizeFilter: "small",
    leashRule: "off_leash",
    status: "upcoming",
    energyLevel: "calm",
    whatToBring: ["Treats", "Water bowl", "Favourite toy"],
    accessibilityNotes: "Fenced dog park area with benches for owners",
    playdate: {
      ageRange: "puppy",
      playStyle: "gentle",
      fencedArea: true,
      maxDogsPerPerson: 1,
    },
    creatorId: "martin",
    creatorName: "Martin",
    creatorAvatarUrl:
      "/images/generated/martin-profile.jpeg",
    attendees: [
      {
        userId: "martin",
        userName: "Martin",
        avatarUrl:
          "/images/generated/martin-profile.jpeg",
        dogNames: ["Charlie"],
        neighbourhood: "Holešovice",
        dogBreed: "French Bulldog",
      },
      {
        userId: "lucie",
        userName: "Lucie",
        avatarUrl:
          "/images/generated/lucie-profile.jpeg",
        dogNames: ["Pepík"],
        neighbourhood: "Vinohrady",
        dogBreed: "Dachshund",
      },
      {
        userId: "zuzana",
        userName: "Zuzana",
        avatarUrl:
          "/images/generated/zuzana-profile.jpeg",
        dogNames: ["Mia"],
        neighbourhood: "Vinohrady",
        dogBreed: "Miniature Poodle",
      },
      {
        userId: "filip",
        userName: "Filip",
        avatarUrl:
          "/images/generated/filip-profile.jpeg",
        dogNames: ["Toby"],
        rsvpStatus: "interested",
        neighbourhood: "Holešovice",
        dogBreed: "Jack Russell Terrier",
      },
    ],
    recentJoinText: "Zuzana joined 4h ago",
    createdAt: "2026-03-15T11:00:00Z",
  },
  {
    id: "meet-5",
    visibility: "group_only",
    type: "walk",
    groupId: "group-5",
    title: "Evening stroll — Vítkov",
    coverPhotoUrl: "/images/generated/post-sunset-vitkov.jpeg",
    description:
      "After-work walk along the ridge with great city views. Medium pace, about 45 minutes. On-leash until we reach the open area.",
    location: "Vítkov, Prague 3",
    neighbourhood: "Žižkov",
    lat: 50.0838,
    lng: 14.4490,
    date: daysFromNow(4),
    time: "17:30",
    durationMinutes: 45,
    cadence: "weekly",
    maxAttendees: 6,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "upcoming",
    energyLevel: "moderate",
    whatToBring: ["Water bottle", "Reflective gear (it gets dark)"],
    accessibilityNotes: "Some steep sections on the ridge path, not stroller-friendly",
    walk: {
      pace: "moderate",
      distance: "short",
      terrain: "mixed",
      routeNotes: "Meet at the monument, walk the ridge east toward the TV tower, loop back via the south path.",
    },
    creatorId: "tomas",
    creatorName: "Tomáš",
    creatorAvatarUrl:
      "/images/generated/tomas-profile.jpeg",
    attendees: [
      {
        userId: "tomas",
        userName: "Tomáš",
        avatarUrl:
          "/images/generated/tomas-profile.jpeg",
        dogNames: ["Hugo"],
        neighbourhood: "Karlín",
        dogBreed: "Labrador Retriever",
      },
      {
        userId: "adela",
        userName: "Adéla",
        avatarUrl:
          "/images/generated/adela-profile.jpeg",
        dogNames: ["Číča"],
        neighbourhood: "Karlín",
        dogBreed: "Mixed",
      },
      {
        userId: "ondrej",
        userName: "Ondřej",
        avatarUrl:
          "/images/generated/ondrej-profile.jpeg",
        dogNames: ["Rocky"],
        neighbourhood: "Karlín",
        dogBreed: "Staffordshire Terrier",
      },
      {
        userId: "vitek",
        userName: "Vítek",
        avatarUrl:
          "/images/generated/vitek-profile.jpeg",
        dogNames: ["Sam"],
        rsvpStatus: "interested",
        neighbourhood: "Žižkov",
      },
    ],
    recentJoinText: "Ondřej joined yesterday",
    createdAt: "2026-03-13T16:00:00Z",
  },
  // A completed meet (for post-meet connect prompts later)
  {
    id: "meet-6",
    visibility: "public",
    type: "walk",
    groupId: "park-3",
    coverPhotoUrl: "/images/generated/group-walk-stromovka.jpeg",
    title: "Sunday morning walk — Riegrovy sady",
    description: "Our regular Sunday morning group walk. Great turnout this week!",
    location: "Riegrovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0785,
    lng: 14.4416,
    date: "2026-03-16",
    time: "09:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 8,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "completed",
    energyLevel: "moderate",
    whatToBring: ["Water bottle", "Poo bags"],
    walk: {
      pace: "leisurely",
      distance: "medium",
      terrain: "paved",
    },
    creatorId: "shawn",
    creatorName: "Shawn",
    creatorAvatarUrl:
      "/images/generated/shawn-profile.jpg",
    attendees: [
      {
        userId: "shawn",
        userName: "Shawn",
        avatarUrl:
          "/images/generated/shawn-profile.jpg",
        dogNames: ["Spot", "Goldie"],
      },
      {
        userId: "jana",
        userName: "Jana",
        avatarUrl:
          "/images/generated/jana-profile.jpeg",
        dogNames: ["Rex"],
      },
      {
        userId: "eva",
        userName: "Eva",
        avatarUrl:
          "/images/generated/eva-profile.jpeg",
        dogNames: ["Luna"],
      },
    ],
    createdAt: "2026-03-09T08:00:00Z",
    photos: [
      "/images/generated/group-walk-stromovka.jpeg",
      "/images/generated/park-hangout-riegrovy.jpeg",
      "/images/generated/spot-park-walk.jpeg",
      "/images/generated/evening-walk-group.jpeg",
      "/images/generated/meet-greeting.jpeg",
    ],
  },

  // ── Care group events (Phase 31) ─────────────────────────────────────────
  {
    id: "meet-care-1",
    visibility: "public",
    type: "training",
    groupId: "group-klara-training",
    title: "Calm Dog Group Session — Stromovka",
    coverPhotoUrl: "/images/generated/spot-park-walk.jpeg",
    description:
      "Small-group training focused on calm greetings and loose-leash walking. Max 6 dogs. All levels welcome.",
    location: "Stromovka, Prague 7",
    neighbourhood: "Holešovice",
    lat: 50.1062,
    lng: 14.4212,
    date: daysFromNow(3),
    time: "10:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 6,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "upcoming",
    energyLevel: "moderate",
    whatToBring: ["Treats", "Leash", "Water"],
    training: {
      skillFocus: ["socialisation", "leash_manners"],
      experienceLevel: "all_levels",
      ledBy: "professional",
      trainerName: "Klára",
    },
    serviceCTA: {
      label: "Book this session",
      href: "/bookings",
      price: "350 Kč",
      spotsLeft: 3,
    },
    creatorId: "klara",
    creatorName: "Klára",
    creatorAvatarUrl: "/images/generated/klara-profile.jpeg",
    attendees: [
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"] },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"] },
    ],
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "meet-care-2",
    visibility: "public",
    type: "walk",
    groupId: "group-pawel-walks",
    title: "Morning Pack Walk — Riegrovy sady",
    coverPhotoUrl: "/images/generated/care-dog-walking.jpeg",
    description:
      "Daily group walk through Riegrovy sady. Max 6 dogs per walk. Pickup available in Vinohrady.",
    location: "Riegrovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0785,
    lng: 14.4410,
    date: daysFromNow(5),
    time: "09:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 6,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
    energyLevel: "moderate",
    walk: {
      pace: "moderate",
      distance: "medium",
      terrain: "mixed",
    },
    serviceCTA: {
      label: "Book a spot",
      href: "/bookings",
      price: "250 Kč",
      spotsLeft: 2,
    },
    creatorId: "pawel",
    creatorName: "Pawel",
    creatorAvatarUrl: "/images/generated/marek-profile.jpeg",
    attendees: [
      { userId: "pawel", userName: "Pawel", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: [] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"] },
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"] },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"] },
    ],
    createdAt: "2026-04-01T08:00:00Z",
  },
  {
    id: "meet-care-3",
    visibility: "public",
    type: "park_hangout",
    groupId: "group-cafe-letka",
    title: "Puppy Social Hour at Café Letka",
    coverPhotoUrl: "/images/generated/meet-greeting.jpeg",
    description:
      "Weekly puppy meetup at Café Letka's dog-friendly terrace. Puppies under 1 year welcome. Free dog treat with every coffee!",
    location: "Café Letka, Letná, Prague 7",
    neighbourhood: "Letná",
    lat: 50.0990,
    lng: 14.4230,
    date: daysFromNow(6),
    time: "11:00",
    durationMinutes: 90,
    cadence: "weekly",
    maxAttendees: 15,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "upcoming",
    energyLevel: "calm",
    parkHangout: {
      dropIn: true,
      endTime: "12:30",
      amenities: ["water_available", "shade", "benches"],
      vibe: "casual",
    },
    creatorId: "cafe_letka",
    creatorName: "Café Letka",
    creatorAvatarUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    attendees: [
      { userId: "cafe_letka", userName: "Café Letka", avatarUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80", dogNames: [] },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"] },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna"] },
    ],
    createdAt: "2026-04-02T10:00:00Z",
  },
  {
    // One-off paid care meet — workshop format. Exists so the meet detail
    // page's "one-off paid" rendering path (Book CTA on the service info
    // card, RSVP dropdown suppressed, no per-occurrence rows) has real
    // mock data to verify against. Also adds variety to the care surface:
    // not every paid offering is a weekly recurring class — workshops,
    // intensives, special outings are a real and underrepresented format.
    id: "meet-care-workshop-1",
    visibility: "public",
    type: "training",
    groupId: "group-klara-training",
    title: "Reactive Dog Workshop — Saturday Intensive",
    coverPhotoUrl: "/images/generated/training-session.jpeg",
    description:
      "A 2-hour intensive workshop for owners of reactive dogs. Small group (max 4), focus on practical desensitization techniques and an at-home practice plan you can start the next day.",
    location: "Stromovka, Prague 7",
    neighbourhood: "Holešovice",
    lat: 50.1062,
    lng: 14.4212,
    date: daysFromNow(10),
    time: "13:00",
    durationMinutes: 120,
    cadence: "one_off",
    maxAttendees: 4,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "upcoming",
    energyLevel: "calm",
    whatToBring: ["High-value treats", "Leash", "Notebook"],
    training: {
      skillFocus: ["socialisation"],
      experienceLevel: "all_levels",
      ledBy: "professional",
      trainerName: "Klára",
    },
    serviceCTA: {
      label: "Book a spot",
      href: "/bookings",
      price: "850 Kč",
      spotsLeft: 2,
    },
    creatorId: "klara",
    creatorName: "Klára",
    creatorAvatarUrl: "/images/generated/klara-profile.jpeg",
    // Two seats taken (Klára host + Daniel) so non-host personas (Shawn,
    // Tereza, Tomáš) can still book a fresh slot when testing. Daniel is
    // a story-fit attendee — runs the Prague Reactive Dog Support group
    // with anxious Bára; the workshop is exactly the kind of paid
    // intervention his archetype would seek out.
    attendees: [
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"] },
    ],
    createdAt: "2026-04-15T10:00:00Z",
  },

  // ── EDGE-STATE MEETS (full + cancelled) ────────────────────────────────────
  // Real mock data for the meet detail page's edge-state rendering paths.
  // Both have ambient hosts (not switchable personas) so any persona can
  // view them as a non-host non-attendee and see the edge state cleanly.

  {
    // Full meet — small-dog playdate at capacity. Tests the full-state UI:
    //   • Type-row "Meet is full" warning chip on the Who's-coming section
    //   • RSVP dropdown disabled with copy "Meet is full"
    //   • Going option in dropdown disabled
    // The 4 attendees are all ambient characters (Eva, Jana, Anežka, Hana)
    // so personas (Shawn, Tereza, Daniel, Tomáš, Klára) view it as Full,
    // not as Going.
    id: "meet-full-playdate",
    visibility: "public",
    type: "playdate",
    groupId: "park-2", // Stromovka Morning Crew
    title: "Small dog playdate — Stromovka fenced area",
    coverPhotoUrl: "/images/generated/puppy-socialization.jpeg",
    description:
      "Small dogs only (under 10kg). Fenced area, supervised play. Limited to 4 dogs for a calm, controlled experience — this fills up most weeks.",
    location: "Stromovka, Prague 7 — small-dog fenced area",
    neighbourhood: "Holešovice",
    lat: 50.1062,
    lng: 14.4212,
    date: daysFromNow(2),
    time: "15:00",
    durationMinutes: 60,
    cadence: "one_off",
    maxAttendees: 4,
    dogSizeFilter: "small",
    leashRule: "off_leash",
    status: "upcoming",
    energyLevel: "moderate",
    playdate: {
      ageRange: "any",
      playStyle: "gentle",
      fencedArea: true,
      maxDogsPerPerson: 1,
    },
    creatorId: "eva",
    creatorName: "Eva",
    creatorAvatarUrl: "/images/generated/eva-profile.jpeg",
    attendees: [
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna"] },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"] },
      { userId: "anezka", userName: "Anežka", avatarUrl: "/images/generated/anezka-profile.jpeg", dogNames: ["Nela"] },
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"] },
    ],
    createdAt: "2026-04-22T10:00:00Z",
  },
  {
    // Cancelled meet — recently cancelled walk. Tests:
    //   • Type-row "Cancelled" pill in the badge row
    //   • Strike-through title
    //   • RSVP block hidden entirely
    //   • Schedule excludes it from upcoming (filter: status !== "cancelled")
    // Cancellation reason lives in the description so testers see context
    // without needing a dedicated cancellationReason field. Tereza is the
    // host so viewing as Tereza tests "your own cancelled meet" — others
    // see the standard cancelled view.
    id: "meet-cancelled-walk",
    visibility: "public",
    type: "walk",
    groupId: "park-3", // Riegrovy Sady Dog Walks
    title: "Saturday morning walk — Riegrovy",
    coverPhotoUrl: "/images/generated/group-walk-stromovka.jpeg",
    // Original description preserved — the cancellation context lives in
    // `cancellationReason` (renders as a banner above the description on
    // the meet detail page).
    description:
      "Easy-paced loop around Riegrovy. Coffee at the kiosk after for anyone who wants to stick around. All dogs welcome — leashed or off-leash depending on the area.",
    location: "Riegrovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0785,
    lng: 14.4416,
    date: daysFromNow(3),
    time: "09:00",
    durationMinutes: 60,
    cadence: "one_off",
    maxAttendees: 8,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "cancelled",
    cancellationReason: "Heavy rain forecast for Saturday morning. Will reschedule for the following weekend — check the group for the new date.",
    // Daniel added 2026-04-27 so a switchable persona (besides Tereza
    // the host) experiences the cancelled-meet view on their Schedule.
    // Plausible attendee — runs the reactive dog group, lives in
    // Vinohrady, Saturday Riegrovy walk fits his archetype.
    energyLevel: "moderate",
    walk: {
      pace: "leisurely",
      distance: "medium",
      terrain: "paved",
    },
    creatorId: "tereza",
    creatorName: "Tereza",
    creatorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    attendees: [
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"] },
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"] },
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"] },
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Mila"] },
    ],
    createdAt: "2026-04-23T08:00:00Z",
  },

  // ── COMPLETED MEETS (8) ────────────────────────────────────────────────────

  {
    // Demo-optimized completed meet for the post-meet review walkthrough.
    // Daniel attended a community-scale reactive-dog gathering — a natural
    // larger-format event vs. his small weekly walks (meet-10). Attendee
    // mix is curated so reviewing as Daniel populates all four sections
    // of the Make Connections step:
    //   - Connected:   Hana, Klára (already in his connections)
    //   - Familiar:    Vítek (already marked familiar by Daniel)
    //   - Not Familiar: Marek, Lucie, Petra (open profiles, no connection)
    //   - Locked:      Jakub, Zuzana (locked profiles, no connection)
    // Spring monthly meetup framing makes the larger size plausible —
    // unlike meet-10's small-group walk where extra attendees would
    // contradict the description.
    id: "meet-reactive-spring",
    visibility: "public",
    type: "walk",
    groupId: "group-reactive-dogs",
    title: "Spring reactive dog community walk",
    coverPhotoUrl: "/images/generated/post-reactive-walk.jpeg",
    description:
      "Monthly community gathering — a slow-paced walk where reactive dog owners can meet, swap notes, and let the dogs work at their own distance. Bring a long lead and high-value treats; we keep groups loose so everyone can manage space.",
    location: "Stromovka, Prague 7 — quiet east side",
    neighbourhood: "Holešovice",
    lat: 50.1075,
    lng: 14.4250,
    date: daysAgo(6),
    time: "10:00",
    durationMinutes: 75,
    cadence: "one_off",
    maxAttendees: 12,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "completed",
    energyLevel: "calm",
    whatToBring: ["High-value treats", "Long lead", "Water"],
    walk: {
      pace: "leisurely",
      distance: "short",
      terrain: "paved",
    },
    creatorId: "daniel",
    creatorName: "Daniel",
    creatorAvatarUrl: "/images/generated/daniel-profile.jpeg",
    attendees: [
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"] },
      // Already Connected — populates the Connected section in Daniel's review.
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"] },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      // Already Familiar (Daniel marked Vítek) — populates the Familiar section.
      { userId: "vitek", userName: "Vítek", avatarUrl: "/images/generated/vitek-profile.jpeg", dogNames: ["Sam"] },
      // Open profile + no connection → Not Familiar (top action target).
      // `profileOpen: true` is required on the attendee record — without
      // it `getAttendeeTier` falls back to tier 3 (locked) and they'd
      // land in the wrong section. The MeetAttendee shape doesn't
      // auto-derive from UserProfile; for ambient (non-persona)
      // attendees we have to mirror profileVisibility manually.
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"], profileOpen: true },
      { userId: "lucie", userName: "Lucie", avatarUrl: "/images/generated/lucie-profile.jpeg", dogNames: ["Pepík"], profileOpen: true },
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Daisy"], profileOpen: true },
      // Locked profile + no connection → Locked section (quiet bottom).
      { userId: "jakub", userName: "Jakub", avatarUrl: "/images/generated/jakub-profile.jpeg", dogNames: ["Aron"] },
      { userId: "zuzana", userName: "Zuzana", avatarUrl: "/images/generated/zuzana-profile.jpeg", dogNames: ["Mia"] },
    ],
    photos: [
      "/images/generated/post-reactive-walk.jpeg",
      "/images/generated/group-walk-stromovka.jpeg",
    ],
    createdAt: "2026-04-15T08:00:00Z",
  },
  {
    id: "meet-7",
    visibility: "public",
    type: "walk",
    groupId: "park-3",
    title: "Thursday morning walk — Riegrovy sady",
    coverPhotoUrl: "/images/generated/post-franta-stick.jpeg",
    description: "Regular Thursday morning walk through Riegrovy sady. Leisurely pace, great for socialisation.",
    location: "Riegrovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0785,
    lng: 14.4416,
    date: "2026-01-22",
    time: "08:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 8,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "completed",
    energyLevel: "moderate",
    whatToBring: ["Water bottle", "Poo bags", "Treats"],
    walk: {
      pace: "leisurely",
      distance: "medium",
      terrain: "paved",
    },
    creatorId: "tereza",
    creatorName: "Tereza",
    creatorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    attendees: [
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"] },
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"] },
      { userId: "lucie", userName: "Lucie", avatarUrl: "/images/generated/lucie-profile.jpeg", dogNames: ["Pepík"] },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"] },
    ],
    createdAt: "2026-01-15T08:00:00Z",
    photos: [
      "/images/generated/post-franta-stick.jpeg",
      "/images/generated/park-hangout-riegrovy.jpeg",
      "/images/generated/meet-greeting.jpeg",
      "/images/generated/spot-park-walk.jpeg",
    ],
  },

  {
    id: "meet-8",
    visibility: "public",
    type: "walk",
    groupId: "park-3",
    title: "Thursday morning walk — Riegrovy sady",
    coverPhotoUrl: "/images/generated/park-hangout-riegrovy.jpeg",
    description: "Regular Thursday morning walk. Same crew, same route.",
    location: "Riegrovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0785,
    lng: 14.4416,
    date: "2026-02-05",
    time: "08:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 8,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "completed",
    energyLevel: "moderate",
    whatToBring: ["Water bottle", "Poo bags", "Treats"],
    walk: {
      pace: "leisurely",
      distance: "medium",
      terrain: "paved",
    },
    creatorId: "tereza",
    creatorName: "Tereza",
    creatorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    attendees: [
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"] },
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"] },
      { userId: "jakub", userName: "Jakub", avatarUrl: "/images/generated/jakub-profile.jpeg", dogNames: ["Aron"] },
    ],
    createdAt: "2026-01-29T08:00:00Z",
  },

  {
    id: "meet-9",
    visibility: "public",
    type: "walk",
    groupId: "group-2",
    title: "Saturday Stromovka off-leash",
    coverPhotoUrl: "/images/generated/post-stromovka-saturday.jpeg",
    description: "High energy Saturday walk through Stromovka with off-leash play in the open field.",
    location: "Stromovka, Prague 7",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: daysAgo(5),
    time: "09:00",
    durationMinutes: 90,
    cadence: "weekly",
    maxAttendees: 12,
    dogSizeFilter: "any",
    leashRule: "off_leash",
    status: "completed",
    energyLevel: "high",
    whatToBring: ["Treats", "Water", "Ball for play"],
    walk: {
      pace: "moderate",
      distance: "long",
      terrain: "trails",
    },
    creatorId: "jana",
    creatorName: "Jana",
    creatorAvatarUrl: "/images/generated/jana-profile.jpeg",
    attendees: [
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"] },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"] },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna", "Max"] },
      { userId: "filip", userName: "Filip", avatarUrl: "/images/generated/filip-profile.jpeg", dogNames: ["Toby"] },
    ],
    createdAt: "2026-02-01T09:00:00Z",
    photos: [
      "/images/generated/post-stromovka-saturday.jpeg",
      "/images/generated/group-walk-stromovka.jpeg",
      "/images/generated/goldie-playing.jpeg",
      "/images/generated/goldie-leash.jpeg",
      "/images/generated/evening-walk-group.jpeg",
    ],
  },

  {
    id: "meet-10",
    visibility: "group_only",
    type: "training",
    groupId: "group-reactive-dogs",
    title: "Reactive dog small-group walk",
    coverPhotoUrl: "/images/generated/post-reactive-walk.jpeg",
    description: "Small calm group for reactive dogs. Max 4 dogs. Slow introductions and focus on managing distance.",
    location: "Havlíčkovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0732,
    lng: 14.4370,
    date: daysAgo(8),
    time: "10:00",
    durationMinutes: 45,
    cadence: "weekly",
    maxAttendees: 4,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "completed",
    energyLevel: "calm",
    whatToBring: ["High-value treats", "Long lead"],
    training: {
      skillFocus: ["socialisation", "leash_manners"],
      experienceLevel: "beginner",
      ledBy: "peer",
    },
    creatorId: "daniel",
    creatorName: "Daniel",
    creatorAvatarUrl: "/images/generated/daniel-profile.jpeg",
    attendees: [
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"] },
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"] },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
    ],
    createdAt: "2026-01-21T10:00:00Z",
    photos: [
      "/images/generated/post-reactive-walk.jpeg",
      "/images/generated/bara-portrait.jpeg",
      "/images/generated/runa-portrait.jpeg",
    ],
  },

  {
    id: "meet-11",
    visibility: "public",
    type: "training",
    groupId: "group-klara-training",
    title: "Klára's group training — recall focus",
    coverPhotoUrl: "/images/generated/post-training-recall.jpeg",
    description: "Professional training group focused on recall. All levels welcome.",
    location: "Stromovka, Prague 7",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: "2026-02-15",
    time: "09:30",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 6,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "completed",
    energyLevel: "moderate",
    whatToBring: ["Treats", "Leash"],
    training: {
      skillFocus: ["recall"],
      experienceLevel: "all_levels",
      ledBy: "professional",
      trainerName: "Klára",
    },
    serviceCTA: {
      label: "Book a spot",
      href: "/bookings",
      price: "350 Kč",
      spotsLeft: 2,
    },
    creatorId: "klara",
    creatorName: "Klára",
    creatorAvatarUrl: "/images/generated/klara-profile.jpeg",
    attendees: [
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"] },
      { userId: "filip", userName: "Filip", avatarUrl: "/images/generated/filip-profile.jpeg", dogNames: ["Toby"] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"] },
    ],
    createdAt: "2026-02-08T09:30:00Z",
    photos: [
      "/images/generated/post-training-recall.jpeg",
      "/images/generated/care-klara-training.jpeg",
      "/images/generated/training-session.jpeg",
      "/images/generated/eda-portrait.jpeg",
    ],
  },

  {
    id: "meet-12",
    visibility: "public",
    type: "park_hangout",
    groupId: "park-karlin",
    title: "Karlín morning coffee walk",
    coverPhotoUrl: "/images/generated/post-karlin-morning.jpeg",
    description: "Casual morning walk along the Karlín riverfront. Come for coffee, stay for the dogs.",
    location: "Karlín riverfront, Prague 8",
    neighbourhood: "Karlín",
    lat: 50.0920,
    lng: 14.4510,
    date: "2026-02-18",
    time: "07:30",
    durationMinutes: 45,
    cadence: "weekly",
    maxAttendees: 6,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "completed",
    energyLevel: "moderate",
    whatToBring: ["Water bottle", "Poo bags"],
    parkHangout: {
      dropIn: true,
      endTime: "08:30",
      amenities: ["benches", "water_available"],
      vibe: "casual",
    },
    creatorId: "petra",
    creatorName: "Petra",
    creatorAvatarUrl: "/images/generated/petra-profile.jpeg",
    attendees: [
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Daisy"] },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"] },
      { userId: "ondrej", userName: "Ondřej", avatarUrl: "/images/generated/ondrej-profile.jpeg", dogNames: ["Rocky"] },
    ],
    createdAt: "2026-02-11T07:30:00Z",
    photos: [
      "/images/generated/post-karlin-morning.jpeg",
      "/images/generated/dogs-cafe-terrace.jpeg",
      "/images/generated/rocky-portrait.jpeg",
    ],
  },

  {
    id: "meet-13",
    visibility: "group_only",
    type: "walk",
    groupId: "group-tereza-neighbourhood",
    title: "Evening stroll — Vinohrady",
    coverPhotoUrl: "/images/generated/evening-walk-group.jpeg",
    description: "Relaxed evening walk through Vinohrady. On-leash, casual pace.",
    location: "Vinohrady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0755,
    lng: 14.4380,
    date: daysAgo(10),
    time: "18:00",
    durationMinutes: 45,
    cadence: "weekly",
    maxAttendees: 6,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "completed",
    energyLevel: "calm",
    whatToBring: ["Water bottle", "Poo bags"],
    walk: {
      pace: "leisurely",
      distance: "short",
      terrain: "paved",
    },
    creatorId: "tereza",
    creatorName: "Tereza",
    creatorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    attendees: [
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"] },
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"] },
      { userId: "lucie", userName: "Lucie", avatarUrl: "/images/generated/lucie-profile.jpeg", dogNames: ["Pepík"] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"] },
    ],
    createdAt: "2026-02-22T18:00:00Z",
  },

  {
    id: "meet-14",
    visibility: "public",
    type: "playdate",
    groupId: "park-3",
    title: "Small dog playdate — Havlíčkovy sady",
    coverPhotoUrl: "/images/generated/playdate-small-group.jpeg",
    description: "Gentle playdate for small dogs in a fenced area with supervised introductions.",
    location: "Havlíčkovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0732,
    lng: 14.4370,
    date: "2026-03-05",
    time: "15:00",
    durationMinutes: 60,
    cadence: "one_off",
    maxAttendees: 6,
    dogSizeFilter: "small",
    leashRule: "off_leash",
    status: "completed",
    energyLevel: "moderate",
    whatToBring: ["Treats", "Water bowl"],
    playdate: {
      ageRange: "any",
      playStyle: "gentle",
      fencedArea: true,
      maxDogsPerPerson: 1,
    },
    creatorId: "lucie",
    creatorName: "Lucie",
    creatorAvatarUrl: "/images/generated/lucie-profile.jpeg",
    attendees: [
      { userId: "lucie", userName: "Lucie", avatarUrl: "/images/generated/lucie-profile.jpeg", dogNames: ["Pepík"] },
      { userId: "zuzana", userName: "Zuzana", avatarUrl: "/images/generated/zuzana-profile.jpeg", dogNames: ["Mia"] },
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Daisy"] },
    ],
    createdAt: "2026-02-26T15:00:00Z",
  },

  // ── UPCOMING MEETS (7) ────────────────────────────────────────────────────

  {
    id: "meet-15",
    visibility: "public",
    type: "walk",
    groupId: "park-3",
    title: "Thursday morning — Riegrovy sady",
    coverPhotoUrl: "/images/generated/group-walk-stromovka.jpeg",
    description: "Regular Thursday morning walk. Recurring instance.",
    location: "Riegrovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0785,
    lng: 14.4416,
    date: daysFromNow(1),
    time: "08:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 8,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
    energyLevel: "moderate",
    whatToBring: ["Water bottle", "Poo bags", "Treats"],
    walk: {
      pace: "leisurely",
      distance: "medium",
      terrain: "paved",
    },
    creatorId: "tereza",
    creatorName: "Tereza",
    creatorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    attendees: [
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"] },
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"], rsvpStatus: "going" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot", "Goldie"], rsvpStatus: "going" },
    ],
    recentJoinText: "Marek joined yesterday",
    createdAt: "2026-04-03T08:00:00Z",
  },

  {
    id: "meet-16",
    visibility: "public",
    type: "walk",
    groupId: "group-2",
    title: "Saturday Stromovka off-leash",
    coverPhotoUrl: "/images/generated/post-stromovka-saturday.jpeg",
    description: "High energy Saturday walk with off-leash play.",
    location: "Stromovka, Prague 7",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: daysFromNow(3),
    time: "09:00",
    durationMinutes: 90,
    cadence: "weekly",
    maxAttendees: 12,
    dogSizeFilter: "any",
    leashRule: "off_leash",
    status: "upcoming",
    energyLevel: "high",
    whatToBring: ["Treats", "Water", "Ball for play"],
    walk: {
      pace: "moderate",
      distance: "long",
      terrain: "trails",
    },
    creatorId: "jana",
    creatorName: "Jana",
    creatorAvatarUrl: "/images/generated/jana-profile.jpeg",
    attendees: [
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"] },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], rsvpStatus: "interested" },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna", "Max"] },
    ],
    recentJoinText: "Eva joined 3h ago",
    createdAt: "2026-04-05T09:00:00Z",
  },

  {
    id: "meet-17",
    visibility: "group_only",
    type: "training",
    groupId: "group-reactive-dogs",
    title: "Reactive dog walk — Stromovka quiet zone",
    coverPhotoUrl: "/images/generated/post-reactive-walk.jpeg",
    description: "Small calm group for reactive dogs. Stromovka quiet paths.",
    location: "Stromovka, Prague 7",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: daysFromNow(6),
    time: "10:00",
    durationMinutes: 45,
    cadence: "weekly",
    maxAttendees: 4,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "upcoming",
    energyLevel: "calm",
    whatToBring: ["High-value treats", "Long lead"],
    training: {
      skillFocus: ["socialisation", "leash_manners"],
      experienceLevel: "beginner",
      ledBy: "peer",
    },
    creatorId: "daniel",
    creatorName: "Daniel",
    creatorAvatarUrl: "/images/generated/daniel-profile.jpeg",
    attendees: [
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"] },
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"] },
      { userId: "vitek", userName: "Vítek", avatarUrl: "/images/generated/vitek-profile.jpeg", dogNames: ["Sam"] },
    ],
    createdAt: "2026-04-07T10:00:00Z",
  },

  {
    id: "meet-18",
    visibility: "public",
    type: "training",
    groupId: "group-klara-training",
    title: "Klára's group training — socialisation",
    coverPhotoUrl: "/images/generated/care-klara-training.jpeg",
    description: "Professional training focused on socialisation and recall.",
    location: "Stromovka, Prague 7",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: daysFromNow(5),
    time: "09:30",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 6,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
    energyLevel: "moderate",
    whatToBring: ["Treats", "Leash"],
    training: {
      skillFocus: ["socialisation", "recall"],
      experienceLevel: "all_levels",
      ledBy: "professional",
      trainerName: "Klára",
    },
    serviceCTA: {
      label: "Book a spot",
      href: "/bookings",
      price: "350 Kč",
      spotsLeft: 3,
    },
    creatorId: "klara",
    creatorName: "Klára",
    creatorAvatarUrl: "/images/generated/klara-profile.jpeg",
    attendees: [
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "filip", userName: "Filip", avatarUrl: "/images/generated/filip-profile.jpeg", dogNames: ["Toby"] },
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"], rsvpStatus: "interested" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], rsvpStatus: "interested" },
    ],
    createdAt: "2026-04-09T09:30:00Z",
  },

  {
    id: "meet-19",
    visibility: "public",
    type: "park_hangout",
    groupId: "park-karlin",
    title: "Karlín riverside hangout",
    coverPhotoUrl: "/images/generated/dogs-cafe-terrace.jpeg",
    description: "Casual hangout along the Karlín riverfront. Off-leash play area.",
    location: "Karlín riverfront, Prague 8",
    neighbourhood: "Karlín",
    lat: 50.0920,
    lng: 14.4510,
    date: daysFromNow(8),
    time: "10:00",
    durationMinutes: 90,
    cadence: "one_off",
    maxAttendees: 10,
    dogSizeFilter: "any",
    leashRule: "off_leash",
    status: "upcoming",
    energyLevel: "moderate",
    whatToBring: ["Water bottle", "Treats", "Ball"],
    parkHangout: {
      dropIn: true,
      endTime: "11:30",
      amenities: ["benches", "water_available"],
      vibe: "casual",
    },
    creatorId: "tomas",
    creatorName: "Tomáš",
    creatorAvatarUrl: "/images/generated/tomas-profile.jpeg",
    attendees: [
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"] },
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Daisy"] },
      { userId: "ondrej", userName: "Ondřej", avatarUrl: "/images/generated/ondrej-profile.jpeg", dogNames: ["Rocky"] },
      { userId: "adela", userName: "Adéla", avatarUrl: "/images/generated/adela-profile.jpeg", dogNames: ["Číča"] },
    ],
    createdAt: "2026-04-06T10:00:00Z",
  },

  {
    id: "meet-20",
    visibility: "group_only",
    type: "walk",
    groupId: "group-tereza-neighbourhood",
    title: "Evening walkers — Vinohrady",
    coverPhotoUrl: "/images/generated/evening-walk-group.jpeg",
    description: "Relaxed evening walk through Vinohrady. Recurring instance.",
    location: "Vinohrady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0755,
    lng: 14.4380,
    date: daysAgo(3),
    time: "18:00",
    durationMinutes: 45,
    cadence: "weekly",
    maxAttendees: 6,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "completed",
    energyLevel: "calm",
    whatToBring: ["Water bottle", "Poo bags"],
    walk: {
      pace: "leisurely",
      distance: "short",
      terrain: "paved",
    },
    creatorId: "tereza",
    creatorName: "Tereza",
    creatorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    attendees: [
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"] },
      { userId: "zuzana", userName: "Zuzana", avatarUrl: "/images/generated/zuzana-profile.jpeg", dogNames: ["Mia"] },
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"] },
    ],
    createdAt: "2026-04-04T18:00:00Z",
  },

  {
    id: "meet-21",
    visibility: "public",
    type: "playdate",
    groupId: "group-2",
    title: "Puppy socialisation morning",
    // No coverPhotoUrl — exercises the playdate type-fallback cover.
    description: "Gentle puppy playdate for building confidence and early socialisation.",
    location: "Stromovka, Prague 7",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: daysFromNow(2),
    time: "10:00",
    durationMinutes: 60,
    cadence: "one_off",
    maxAttendees: 8,
    dogSizeFilter: "any",
    leashRule: "off_leash",
    status: "upcoming",
    energyLevel: "moderate",
    whatToBring: ["Treats", "Water bowl"],
    playdate: {
      ageRange: "puppy",
      playStyle: "gentle",
      fencedArea: false,
      maxDogsPerPerson: 1,
    },
    creatorId: "eva",
    creatorName: "Eva",
    creatorAvatarUrl: "/images/generated/eva-profile.jpeg",
    attendees: [
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna"] },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Goldie"] },
    ],
    recentJoinText: "Shawn joined 1h ago",
    createdAt: "2026-04-08T10:00:00Z",
  },

  /* ════════════════════════════════════════════════════════════════════════
     Mock World Building meets backfill (2026-04-26).
     Each meet ties to a specific feature we want to demo. See
     `docs/phases/mock-world-building.md` for the matrix.
     MOCK_NOW = 2026-04-12. All dates are after that to count as upcoming.
     ════════════════════════════════════════════════════════════════════════ */

  // ── (#1) Vinohrady Evening Walkers — Tereza's recurring Thursday walk ─────
  // Demos: recurring meet pattern + group-creator host POV + neighbour group.
  {
    id: "meet-30",
    visibility: "group_only",
    type: "walk",
    groupId: "group-tereza-neighbourhood",
    title: "Thursday evening loop",
    coverPhotoUrl: "/images/generated/evening-walk-group.jpeg",
    description:
      "Our weekly slow loop around the back of Riegrovy. Aim for 7pm, leashes on through the gate, off-leash once we reach the slope. Skipping it if it rains hard.",
    location: "Riegrovy sady — Mánesova entrance",
    neighbourhood: "Vinohrady",
    lat: 50.0780,
    lng: 14.4416,
    date: daysFromNow(7),
    time: "19:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 12,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
    energyLevel: "any",
    whatToBring: ["Water", "Poo bags"],
    walk: {
      pace: "leisurely",
      distance: "short",
      terrain: "mixed",
    },
    creatorId: "tereza",
    creatorName: "Tereza",
    creatorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    attendees: [
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"] },
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"] },
      { userId: "lucie", userName: "Lucie", avatarUrl: "/images/generated/lucie-profile.jpeg", dogNames: ["Pepík"] },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"] },
      { userId: "zuzana", userName: "Zuzana", avatarUrl: "/images/generated/zuzana-profile.jpeg", dogNames: ["Mia"] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], rsvpStatus: "interested" },
    ],
    recentJoinText: "Marek joined yesterday",
    createdAt: "2026-04-10T20:30:00Z",
  },

  // ── (#2) Riegrovy Sady — Saturday park walk, regular cadence ────────────
  // Demos: park group regular activity + cross-attendee trust signals.
  {
    id: "meet-31",
    visibility: "public",
    type: "walk",
    groupId: "park-3",
    title: "Saturday morning loop",
    coverPhotoUrl: "/images/generated/group-walk-stromovka.jpeg",
    description: "Our usual Saturday morning slow walk. Bring coffee. Beer garden after if anyone's up for it.",
    location: "Riegrovy sady",
    neighbourhood: "Vinohrady",
    lat: 50.0780,
    lng: 14.4416,
    date: daysFromNow(8),
    time: "09:00",
    durationMinutes: 75,
    cadence: "weekly",
    maxAttendees: 15,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
    energyLevel: "moderate",
    whatToBring: ["Water", "Poo bags"],
    walk: { pace: "leisurely", distance: "medium", terrain: "mixed" },
    creatorId: "marek",
    creatorName: "Marek",
    creatorAvatarUrl: "/images/generated/marek-profile.jpeg",
    attendees: [
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"] },
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"] },
      { userId: "lucie", userName: "Lucie", avatarUrl: "/images/generated/lucie-profile.jpeg", dogNames: ["Pepík"] },
      { userId: "jana", userName: "Jana", avatarUrl: "/images/generated/jana-profile.jpeg", dogNames: ["Rex"] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot", "Goldie"] },
    ],
    createdAt: "2026-04-09T09:00:00Z",
  },

  // ── (#3) Stromovka — Saturday park hangout, multi-attendee ──────────────
  // Demos: park group breadth + Stromovka crew (Klára non-pro mode).
  {
    id: "meet-32",
    visibility: "public",
    type: "park_hangout",
    groupId: "park-2",
    title: "Saturday hangout — big field",
    coverPhotoUrl: "/images/generated/park-hangout-riegrovy.jpeg",
    description:
      "Off-leash field. Drop in any time between 10 and 12. There's a tennis ball that lives in Eda's mouth.",
    location: "Stromovka — open field by pond",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: daysFromNow(9),
    time: "10:00",
    durationMinutes: 120,
    cadence: "one_off",
    maxAttendees: 20,
    dogSizeFilter: "any",
    leashRule: "off_leash",
    status: "upcoming",
    energyLevel: "any",
    parkHangout: {
      dropIn: true,
      endTime: "12:00",
      amenities: ["shade", "benches", "water_available"],
    },
    creatorId: "eva",
    creatorName: "Eva",
    creatorAvatarUrl: "/images/generated/eva-profile.jpeg",
    attendees: [
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna", "Max"] },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"] },
      { userId: "filip", userName: "Filip", avatarUrl: "/images/generated/filip-profile.jpeg", dogNames: ["Toby"] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Goldie"], rsvpStatus: "interested" },
    ],
    createdAt: "2026-04-12T08:00:00Z",
  },

  // ── (#4) Letná — Sunday walk, small ────────────────────────────────────
  // Demos: smaller park group, Sunday cadence.
  {
    id: "meet-33",
    visibility: "public",
    type: "walk",
    groupId: "park-1",
    title: "Sunday stroll — Letenské sady",
    coverPhotoUrl: "/images/generated/group-walk-stromovka.jpeg",
    description: "Quiet Sunday morning loop. Slow pace. Coffee at the kiosk after if anyone's keen.",
    location: "Letenské sady",
    neighbourhood: "Letná",
    lat: 50.0962,
    lng: 14.4253,
    date: daysFromNow(10),
    time: "09:30",
    durationMinutes: 60,
    cadence: "one_off",
    maxAttendees: 8,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
    energyLevel: "moderate",
    walk: { pace: "leisurely", distance: "medium", terrain: "mixed" },
    creatorId: "martin",
    creatorName: "Martin",
    creatorAvatarUrl: "/images/generated/martin-profile.jpeg",
    attendees: [
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"] },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna"] },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
    ],
    createdAt: "2026-04-11T11:00:00Z",
  },

  // ── (#5) Karlín Walks — Tomáš's daily morning walk, recurring ──────────
  // Demos: daily routine pattern, Tomáš host POV, weekday cadence.
  {
    id: "meet-34",
    visibility: "public",
    type: "walk",
    groupId: "park-karlin",
    title: "Morning riverside loop",
    coverPhotoUrl: "/images/generated/post-karlin-morning.jpeg",
    description: "Daily morning walk along the Vltava. Most days I'm out by 7. Drop in if you're up.",
    location: "Karlín riverfront",
    neighbourhood: "Karlín",
    lat: 50.0935,
    lng: 14.4470,
    date: daysFromNow(2),
    time: "07:00",
    durationMinutes: 45,
    cadence: "weekly",
    maxAttendees: 10,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "upcoming",
    energyLevel: "moderate",
    walk: { pace: "brisk", distance: "medium", terrain: "paved" },
    creatorId: "tomas",
    creatorName: "Tomáš",
    creatorAvatarUrl: "/images/generated/tomas-profile.jpeg",
    attendees: [
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"] },
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Daisy"] },
      { userId: "ondrej", userName: "Ondřej", avatarUrl: "/images/generated/ondrej-profile.jpeg", dogNames: ["Rocky"] },
    ],
    createdAt: "2026-04-09T20:00:00Z",
  },

  // ── (#6) Karlín Dog Neighbors — weekend hangout, hosted by Petra ───────
  // Demos: neighborhood community group activity, weekend gathering.
  {
    id: "meet-35",
    visibility: "group_only",
    type: "park_hangout",
    groupId: "group-karlin-neighbours",
    title: "Sunday hangout — Vítkov field",
    coverPhotoUrl: "/images/generated/park-hangout-riegrovy.jpeg",
    description:
      "Members-only weekend hangout. Bring a blanket. Hugo will steal your tennis ball.",
    location: "Vítkov — south meadow",
    neighbourhood: "Karlín",
    lat: 50.0838,
    lng: 14.4490,
    date: daysFromNow(11),
    time: "11:00",
    durationMinutes: 120,
    cadence: "one_off",
    maxAttendees: 10,
    dogSizeFilter: "any",
    leashRule: "off_leash",
    status: "upcoming",
    energyLevel: "any",
    parkHangout: {
      dropIn: true,
      endTime: "13:00",
      amenities: ["shade", "benches"],
    },
    creatorId: "petra",
    creatorName: "Petra",
    creatorAvatarUrl: "/images/generated/petra-profile.jpeg",
    attendees: [
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Daisy"] },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"] },
      { userId: "ondrej", userName: "Ondřej", avatarUrl: "/images/generated/ondrej-profile.jpeg", dogNames: ["Rocky"] },
      { userId: "adela", userName: "Adéla", avatarUrl: "/images/generated/adela-profile.jpeg", dogNames: ["Číča"] },
    ],
    createdAt: "2026-04-12T19:00:00Z",
  },

  // ── (#7) Reactive Dog Support — small careful walk, Daniel hosting ─────
  // Demos: approval-gate group meet, small careful pace, locked-profile host.
  {
    id: "meet-36",
    visibility: "group_only",
    type: "walk",
    groupId: "group-reactive-dogs",
    title: "Quiet Sunday walk — Smíchov",
    coverPhotoUrl: "/images/generated/post-reactive-walk.jpeg",
    description:
      "Small careful walk for reactive dogs. Quiet route along the river, away from the markets. Max 5 dogs, please don't bring +1 unannounced. Reach out before joining if your dog is new to the group.",
    location: "Náplavka — south end (away from market)",
    neighbourhood: "Smíchov",
    lat: 50.0700,
    lng: 14.4080,
    date: daysFromNow(12),
    time: "08:00",
    durationMinutes: 50,
    cadence: "one_off",
    maxAttendees: 5,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "upcoming",
    energyLevel: "calm",
    whatToBring: ["High-value treats", "Long line if needed", "Spacing — 5m between dogs"],
    accessibilityNotes: "Flat, paved. We keep dogs spread out — let me know if you need extra distance.",
    walk: { pace: "leisurely", distance: "short", terrain: "paved" },
    creatorId: "daniel",
    creatorName: "Daniel",
    creatorAvatarUrl: "/images/generated/daniel-profile.jpeg",
    attendees: [
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"] },
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"] },
      { userId: "vitek", userName: "Vítek", avatarUrl: "/images/generated/vitek-profile.jpeg", dogNames: ["Sam"] },
      { userId: "anezka", userName: "Anežka", avatarUrl: "/images/generated/anezka-profile.jpeg", dogNames: ["Nela"] },
    ],
    createdAt: "2026-04-11T18:00:00Z",
  },

  // ── (#8) Klára's Calm Dog Sessions — Wed group training, paid session ──
  // Demos: care group bookable session, spots-left signal, Klára's recurring.
  {
    id: "meet-care-4",
    visibility: "public",
    type: "training",
    groupId: "group-klara-training",
    title: "Group training — calm & focus",
    coverPhotoUrl: "/images/generated/training-session.jpeg",
    description:
      "Weekly group session. Working on calm under stimulation, focus around distractions, and parallel walking. Suitable for reactive and overstimulated dogs. Eda will be there as the demo dog.",
    location: "Stromovka — training area east of pond",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: daysFromNow(7),
    time: "10:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 6,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "upcoming",
    energyLevel: "calm",
    isPopular: true,
    whatToBring: ["High-value treats", "Standard leash (no flexi)", "Water"],
    training: {
      skillFocus: ["recall", "leash_manners", "socialisation"],
      experienceLevel: "all_levels",
      ledBy: "professional",
      trainerName: "Klára Horáčková",
      equipmentNeeded: ["Standard leash", "High-value treats"],
    },
    creatorId: "klara",
    creatorName: "Klára",
    creatorAvatarUrl: "/images/generated/klara-profile.jpeg",
    attendees: [
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"] },
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"] },
      { userId: "filip", userName: "Filip", avatarUrl: "/images/generated/filip-profile.jpeg", dogNames: ["Toby"] },
    ],
    recentJoinText: "Filip joined 3d ago",
    createdAt: "2026-03-15T12:00:00Z",
  },

  // ── (#9) Klára's Calm Dog Sessions — Saturday group session ────────────
  // Demos: mixed RSVP states (going + interested) on a care group meet.
  {
    id: "meet-care-5",
    visibility: "public",
    type: "training",
    groupId: "group-klara-training",
    title: "Saturday recall practice",
    coverPhotoUrl: "/images/generated/post-training-recall.jpeg",
    description:
      "Saturday group session focused on recall. Long-line work, distance gradually increasing. Good for dogs with no recall, or recall that falls apart in distractions.",
    location: "Stromovka — open field",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: daysFromNow(9),
    time: "11:00",
    durationMinutes: 60,
    cadence: "one_off",
    maxAttendees: 6,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
    energyLevel: "moderate",
    whatToBring: ["Long line (5m+)", "High-value treats", "Standard leash"],
    training: {
      skillFocus: ["recall"],
      experienceLevel: "all_levels",
      ledBy: "professional",
      trainerName: "Klára Horáčková",
      equipmentNeeded: ["Long line", "High-value treats"],
    },
    creatorId: "klara",
    creatorName: "Klára",
    creatorAvatarUrl: "/images/generated/klara-profile.jpeg",
    attendees: [
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "filip", userName: "Filip", avatarUrl: "/images/generated/filip-profile.jpeg", dogNames: ["Toby"] },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna"] },
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"], rsvpStatus: "interested" },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], rsvpStatus: "interested" },
    ],
    createdAt: "2026-04-08T09:00:00Z",
  },

  // ── (#10) Vítkov — Saturday hangout, small park ────────────────────────
  // Demos: park breadth (less-used park), Karlín crew cross-pollinating.
  {
    id: "meet-37",
    visibility: "public",
    type: "park_hangout",
    groupId: "park-5",
    title: "Saturday afternoon hangout",
    coverPhotoUrl: "/images/generated/post-sunset-vitkov.jpeg",
    description: "Casual afternoon hangout on the south meadow. Drop in.",
    location: "Vítkov — south meadow",
    neighbourhood: "Žižkov",
    lat: 50.0838,
    lng: 14.4490,
    date: daysFromNow(0),
    time: "15:00",
    durationMinutes: 90,
    cadence: "one_off",
    maxAttendees: 12,
    dogSizeFilter: "any",
    leashRule: "off_leash",
    status: "upcoming",
    energyLevel: "any",
    parkHangout: {
      dropIn: true,
      endTime: "16:30",
      amenities: ["shade", "benches"],
    },
    creatorId: "adela",
    creatorName: "Adéla",
    creatorAvatarUrl: "/images/generated/adela-profile.jpeg",
    attendees: [
      { userId: "adela", userName: "Adéla", avatarUrl: "/images/generated/adela-profile.jpeg", dogNames: ["Číča"] },
      { userId: "ondrej", userName: "Ondřej", avatarUrl: "/images/generated/ondrej-profile.jpeg", dogNames: ["Rocky"] },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"], rsvpStatus: "interested" },
    ],
    createdAt: "2026-04-12T14:00:00Z",
  },

  /* ════════════════════════════════════════════════════════════════════════
     PERSONA ROUTINE BACKFILL (2026-04-26).
     Each persona's Upcoming should reflect their archetype's daily/weekly
     beat. "Tereza is a Routine Owner" should mean her schedule LOOKS like a
     routine, not three random events. See archetypes in
     `docs/strategy/User Archetypes.md`.
     ════════════════════════════════════════════════════════════════════════ */

  // ── Tereza routine — Tuesday morning Riegrovy ──────────────────────────
  // Demos: weekday morning routine, recurring meet, attended by Vinohrady regulars.
  {
    id: "meet-38",
    visibility: "public",
    type: "walk",
    groupId: "park-3",
    title: "Tuesday morning Riegrovy",
    coverPhotoUrl: "/images/generated/spot-park-walk.jpeg",
    description: "Quick weekday morning loop before work. Fast pace, on-leash through the gate then off-leash on the slope.",
    location: "Riegrovy sady — Mánesova entrance",
    neighbourhood: "Vinohrady",
    lat: 50.0780,
    lng: 14.4416,
    date: daysFromNow(13),
    time: "07:30",
    durationMinutes: 45,
    cadence: "weekly",
    maxAttendees: 10,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
    energyLevel: "moderate",
    walk: { pace: "brisk", distance: "short", terrain: "mixed" },
    creatorId: "lucie",
    creatorName: "Lucie",
    creatorAvatarUrl: "/images/generated/lucie-profile.jpeg",
    attendees: [
      { userId: "lucie", userName: "Lucie", avatarUrl: "/images/generated/lucie-profile.jpeg", dogNames: ["Pepík"] },
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"] },
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"] },
    ],
    createdAt: "2026-04-10T07:00:00Z",
  },

  // ── Tereza routine — Sunday morning Riegrovy + coffee ──────────────────
  // Demos: weekend social routine, beer-garden tail.
  {
    id: "meet-39",
    visibility: "public",
    type: "walk",
    groupId: "park-3",
    title: "Sunday slow walk + coffee",
    coverPhotoUrl: "/images/generated/post-franta-stick.jpeg",
    description: "Easy Sunday morning loop. Whoever's around comes back to the beer garden after for coffee.",
    location: "Riegrovy sady — main path",
    neighbourhood: "Vinohrady",
    lat: 50.0780,
    lng: 14.4416,
    date: daysFromNow(14),
    time: "10:00",
    durationMinutes: 90,
    cadence: "one_off",
    maxAttendees: 12,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
    energyLevel: "any",
    walk: { pace: "leisurely", distance: "medium", terrain: "mixed" },
    creatorId: "tereza",
    creatorName: "Tereza",
    creatorAvatarUrl: "/images/generated/tereza-profile.jpeg",
    attendees: [
      { userId: "tereza", userName: "Tereza", avatarUrl: "/images/generated/tereza-profile.jpeg", dogNames: ["Franta"] },
      { userId: "marek", userName: "Marek", avatarUrl: "/images/generated/marek-profile.jpeg", dogNames: ["Benny"] },
      { userId: "lucie", userName: "Lucie", avatarUrl: "/images/generated/lucie-profile.jpeg", dogNames: ["Pepík"] },
      { userId: "shawn", userName: "Shawn", avatarUrl: "/images/generated/shawn-profile.jpg", dogNames: ["Spot"], rsvpStatus: "interested" },
    ],
    createdAt: "2026-04-12T08:30:00Z",
  },

  // ── Klára routine — 1-on-1 home session with Hana mid-week ──────────────
  // Demos: provider 1-on-1 session, recurring weekly Thursday at client location.
  {
    id: "meet-care-6",
    visibility: "group_only",
    type: "training",
    groupId: "group-klara-training",
    title: "1-on-1 — Runa, threshold work",
    coverPhotoUrl: "/images/generated/training-session.jpeg",
    description: "Recurring 1-on-1 session at the quiet end of Vítkov. Long-line, threshold building. Booked through Hana's package.",
    location: "Vítkov — quiet south meadow",
    neighbourhood: "Žižkov",
    lat: 50.0838,
    lng: 14.4490,
    date: daysFromNow(11),
    time: "11:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 2,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "upcoming",
    energyLevel: "calm",
    training: {
      skillFocus: ["socialisation"],
      experienceLevel: "all_levels",
      ledBy: "professional",
      trainerName: "Klára Horáčková",
      equipmentNeeded: ["Long line", "High-value treats"],
    },
    creatorId: "klara",
    creatorName: "Klára",
    creatorAvatarUrl: "/images/generated/klara-profile.jpeg",
    attendees: [
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"] },
    ],
    createdAt: "2026-03-15T10:00:00Z",
  },

  // ── Klára routine — non-pro Stromovka morning walk ──────────────────────
  // Demos: provider also-as-regular, off-duty mode.
  {
    id: "meet-40",
    visibility: "public",
    type: "walk",
    groupId: "park-2",
    title: "Wednesday morning Stromovka",
    coverPhotoUrl: "/images/generated/group-walk-stromovka.jpeg",
    description: "Just the regulars. No training, no pressure. Eda chases his ball, the rest of us drink coffee.",
    location: "Stromovka — north entrance",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: daysFromNow(11),
    time: "08:00",
    durationMinutes: 60,
    cadence: "weekly",
    maxAttendees: 10,
    dogSizeFilter: "any",
    leashRule: "off_leash",
    status: "upcoming",
    energyLevel: "moderate",
    walk: { pace: "leisurely", distance: "medium", terrain: "mixed" },
    creatorId: "martin",
    creatorName: "Martin",
    creatorAvatarUrl: "/images/generated/martin-profile.jpeg",
    attendees: [
      { userId: "martin", userName: "Martin", avatarUrl: "/images/generated/martin-profile.jpeg", dogNames: ["Charlie"] },
      { userId: "klara", userName: "Klára", avatarUrl: "/images/generated/klara-profile.jpeg", dogNames: ["Eda"] },
      { userId: "eva", userName: "Eva", avatarUrl: "/images/generated/eva-profile.jpeg", dogNames: ["Luna", "Max"] },
      { userId: "filip", userName: "Filip", avatarUrl: "/images/generated/filip-profile.jpeg", dogNames: ["Toby"] },
    ],
    createdAt: "2026-04-10T07:00:00Z",
  },

  // ── Tomáš routine — Saturday Karlín hangout (going) ─────────────────────
  // Demos: weekend social routine for daily walker.
  {
    id: "meet-41",
    visibility: "public",
    type: "park_hangout",
    groupId: "park-karlin",
    title: "Saturday morning hangout — Karlín riverfront",
    coverPhotoUrl: "/images/generated/park-hangout-riegrovy.jpeg",
    description: "Casual hangout on the grass below the bridge. Bring a coffee. Hugo will try to share yours.",
    location: "Karlín riverfront — near Negrelli",
    neighbourhood: "Karlín",
    lat: 50.0935,
    lng: 14.4470,
    date: daysFromNow(13),
    time: "09:30",
    durationMinutes: 90,
    cadence: "one_off",
    maxAttendees: 12,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
    energyLevel: "any",
    parkHangout: {
      dropIn: true,
      endTime: "11:00",
      amenities: ["shade", "water_available"],
    },
    creatorId: "ondrej",
    creatorName: "Ondřej",
    creatorAvatarUrl: "/images/generated/ondrej-profile.jpeg",
    attendees: [
      { userId: "ondrej", userName: "Ondřej", avatarUrl: "/images/generated/ondrej-profile.jpeg", dogNames: ["Rocky"] },
      { userId: "tomas", userName: "Tomáš", avatarUrl: "/images/generated/tomas-profile.jpeg", dogNames: ["Hugo"] },
      { userId: "petra", userName: "Petra", avatarUrl: "/images/generated/petra-profile.jpeg", dogNames: ["Daisy"] },
      { userId: "adela", userName: "Adéla", avatarUrl: "/images/generated/adela-profile.jpeg", dogNames: ["Číča"] },
    ],
    createdAt: "2026-04-11T20:00:00Z",
  },

  // ── Daniel — Klára Sat session (interested only) ───────────────────────
  // Already added as attendee on meet-care-5 above. (No new meet needed.)
  // Plus: a small reactive-group hangout he's interested in but hasn't committed.
  {
    id: "meet-42",
    visibility: "group_only",
    type: "park_hangout",
    groupId: "group-reactive-dogs",
    title: "Members-only meet — Petřín quiet corner",
    coverPhotoUrl: "/images/generated/post-reactive-walk.jpeg",
    description:
      "Members-only social hangout. Quiet corner of Petřín, far from the main paths. No new dogs without Hana's intro first. Drop in.",
    location: "Petřín — quiet corner near observatory",
    neighbourhood: "Smíchov",
    lat: 50.0833,
    lng: 14.3950,
    date: daysFromNow(0),
    time: "14:00",
    durationMinutes: 90,
    cadence: "one_off",
    maxAttendees: 6,
    dogSizeFilter: "any",
    leashRule: "on_leash",
    status: "upcoming",
    energyLevel: "calm",
    parkHangout: {
      dropIn: true,
      endTime: "15:30",
      amenities: ["shade"],
    },
    creatorId: "hana",
    creatorName: "Hana",
    creatorAvatarUrl: "/images/generated/hana-profile.jpeg",
    attendees: [
      { userId: "hana", userName: "Hana", avatarUrl: "/images/generated/hana-profile.jpeg", dogNames: ["Runa"] },
      { userId: "anezka", userName: "Anežka", avatarUrl: "/images/generated/anezka-profile.jpeg", dogNames: ["Nela"] },
      { userId: "vitek", userName: "Vítek", avatarUrl: "/images/generated/vitek-profile.jpeg", dogNames: ["Sam"] },
      { userId: "daniel", userName: "Daniel", avatarUrl: "/images/generated/daniel-profile.jpeg", dogNames: ["Bára"], rsvpStatus: "interested" },
    ],
    createdAt: "2026-04-12T19:00:00Z",
  },
];

// ── Recurring-meet seeding ────────────────────────────────────────────────────
//
// At module load, materialise `attendeesByDate` for every recurring meet that
// hasn't been hand-seeded. Each recurring meet's existing `attendees` list is
// treated as the canonical "anchor occurrence" attendee set; the next 3
// upcoming occurrences (computed via `nextOccurrenceDates`) are seeded with
// subsetted lists (100% → 70% → 55% → 45%) to give the demo a believable
// rhythm of regulars-plus-occasionals across consecutive dates.
//
// We seed the canonical *upcoming* dates rather than naively `meet.date + N*step`
// so that meets with anchors deep in the past (e.g. meet-7's 2026-01-22 weekly)
// still get populated next-3 lists when the UI calls `nextOccurrenceDates`.
// We additionally key `meet.date` itself if it's not already in the next-3 set
// (i.e. when the anchor is in the past) so History views can read the
// "most recent historical occurrence" without re-deriving it.
//
// `attendees` stays populated as the representative list for legacy callsites
// (cards, summaries) — see Meet.attendees doc-comment in `lib/types.ts`. The
// authoritative per-date data lives on `attendeesByDate`.

(function seedRecurringAttendeesByDate() {
  for (const meet of mockMeets) {
    if (meet.cadence === "one_off") continue;
    if (meet.attendeesByDate) continue; // hand-seeded — leave alone

    const anchor = meet.attendees;
    const upcoming = nextOccurrenceDates(meet, 3);

    // Subset by stable slice (not random) so the demo data is reproducible.
    const subset = (ratio: number) =>
      anchor.slice(0, Math.max(1, Math.floor(anchor.length * ratio)));

    const byDate: Record<string, typeof anchor> = {};
    // Always include meet.date as the historical anchor so History views have
    // something to read. If meet.date happens to be the first upcoming date
    // (future-anchor meet), it gets the full anchor list anyway via the
    // upcoming loop below.
    byDate[meet.date] = anchor;
    // Subsetting ratios for the upcoming occurrences. Index 0 is the next
    // upcoming date — gets the full list (most recent commitment is freshest).
    const ratios = [1.0, 0.7, 0.55];
    for (let i = 0; i < upcoming.length; i++) {
      byDate[upcoming[i]] = subset(ratios[i] ?? 0.45);
    }

    meet.attendeesByDate = byDate;
  }
})();

// ── Follower seeding ─────────────────────────────────────────────────────────
//
// Series-level subscriptions ("Follow this series"). Each entry is a userId.
// Following surfaces the series in Discover and opts the user in to upcoming-date
// notifications without implying a per-occurrence RSVP. We seed each of the
// four journey personas (and Shawn) following at least one recurring series so
// every persona's Discover/feed shows non-empty Follow state at demo time.

const SEED_FOLLOWERS: Record<string, string[]> = {
  // meet-1: Vinohrady morning walk — Shawn's neighbourhood crew, plus Tereza (anchor).
  "meet-1": ["shawn", "tereza"],
  // meet-5: a second weekly walk — Daniel (anxious new owner) lurks before committing.
  "meet-5": ["daniel"],
  // meet-12: Karlín morning coffee walk — Tomáš (busy professional) follows the
  // casual park-hangout option that fits before his workday.
  "meet-12": ["tomas"],
  // meet-care-1: Klára's weekly training — she follows her own recurring care meet.
  "meet-care-1": ["klara"],
  // meet-7: popular Thursday morning Vinohrady walk — cross-persona overlap.
  "meet-7": ["shawn", "daniel", "tereza"],
};

(function seedFollowers() {
  for (const meet of mockMeets) {
    if (meet.cadence === "one_off") continue;
    const seeded = SEED_FOLLOWERS[meet.id];
    if (seeded && !meet.followers) {
      meet.followers = seeded;
    }
  }
})();

/**
 * Helper: get meets the current user has any RSVP on.
 *
 * Returns the *series* (one entry per Meet record), not per-occurrence —
 * use `getUserMeetInstances` for the instance-aware view that drives
 * schedule timelines and RSVP-by-date surfaces.
 *
 * For one-off meets, "user has an RSVP" means `meet.attendees.some(a => …)`.
 * For recurring meets, it means *any* date in `attendeesByDate` has the user.
 * This shape is appropriate for surfaces that ask "is this person *associated*
 * with this meet" (profile activity, group membership inference) rather than
 * "what dates have they committed to."
 */
export function getUserMeets(userId: string): Meet[] {
  return mockMeets.filter((m) => {
    if (m.cadence === "one_off") {
      return m.attendees.some((a) => a.userId === userId);
    }
    const byDate = m.attendeesByDate ?? {};
    return Object.values(byDate).some((list) =>
      list.some((a) => a.userId === userId),
    );
  });
}

/**
 * Helper: every (meet, occurrenceDate) instance the user has an RSVP on.
 *
 * Drives the per-instance Schedule views (Upcoming, Meets → Going, Meets →
 * Interested, History). For one-off meets returns at most one entry per meet.
 * For recurring meets returns one entry per RSVP'd date — a user Going to
 * "Morning walk" on three consecutive Wednesdays sees three entries.
 *
 * Returns *all* RSVPs (Going + Interested). Caller filters by `rsvpStatus`
 * via the resolved `attendees` list. Returns past instances too — caller
 * filters by date for upcoming-vs-history splits.
 */
export function getUserMeetInstances(userId: string): MeetOccurrence[] {
  const out: MeetOccurrence[] = [];
  for (const meet of mockMeets) {
    if (meet.cadence === "one_off") {
      const attendees = getOccurrenceAttendees(meet, meet.date);
      if (attendees.some((a) => a.userId === userId)) {
        out.push({ meet, date: meet.date, attendees });
      }
      continue;
    }
    const byDate = meet.attendeesByDate ?? {};
    for (const [date, attendees] of Object.entries(byDate)) {
      if (attendees.some((a) => a.userId === userId)) {
        out.push({ meet, date, attendees });
      }
    }
  }
  return out;
}

/**
 * Demo-only runtime mutation — propagate a UI-side RSVP/booking commit
 * into `mockMeets` so the Schedule page (which reads via
 * `getUserMeetInstances`) sees the user's commitment.
 *
 * Without this, RSVPs and bookings made on the meet detail page only live
 * in local component state and never appear on `/schedule` — you tap
 * Going on a meet, navigate to Schedule, see nothing. With this helper
 * called from the same commit handlers, attendees flow through.
 *
 * Mutates the meet record directly:
 *  - One-off: `meet.attendees` (date is ignored)
 *  - Recurring: `meet.attendeesByDate[date]` (creates the entry if missing)
 *
 * Pass `status: "none"` to remove the user from the list (used when the
 * user clears their RSVP — Going → Not going on the dropdown, or Skip on
 * a per-row commitment that was previously Going).
 *
 * Survives navigation but NOT page reload — `mockMeets` is module-scoped
 * and re-imports cleanly between full reloads. For reload-safe persistence
 * see the Schedule & Bookings Deep Pass (option 3 in that scoping doc).
 */
export function setMeetRsvp(
  meet: Meet,
  user: { id: string; firstName: string; avatarUrl: string; neighbourhood?: string; pets?: { name: string }[]; profileVisibility?: string },
  date: string,
  status: "none" | "going" | "interested",
): void {
  const attendee: MeetAttendee = {
    userId: user.id,
    userName: user.firstName,
    avatarUrl: user.avatarUrl,
    dogNames: (user.pets ?? []).map((p) => p.name),
    neighbourhood: user.neighbourhood,
    profileOpen: user.profileVisibility === "open",
    // Always set explicitly so readers don't have to guess about the
    // (a.rsvpStatus ?? "going") fallback semantics — caller's intent is
    // clear in the data.
    rsvpStatus: status === "none" ? undefined : status,
  };

  if (meet.cadence === "one_off") {
    const idx = meet.attendees.findIndex((a) => a.userId === user.id);
    if (status === "none") {
      if (idx >= 0) meet.attendees.splice(idx, 1);
    } else if (idx >= 0) {
      meet.attendees[idx] = attendee;
    } else {
      meet.attendees.push(attendee);
    }
    return;
  }

  // Recurring: per-date list. Mutate (not replace) the array so any
  // outside references the meet detail might hold stay valid.
  if (!meet.attendeesByDate) meet.attendeesByDate = {};
  const list = meet.attendeesByDate[date] ?? [];
  const idx = list.findIndex((a) => a.userId === user.id);
  if (status === "none") {
    if (idx >= 0) list.splice(idx, 1);
  } else if (idx >= 0) {
    list[idx] = attendee;
  } else {
    list.push(attendee);
  }
  meet.attendeesByDate[date] = list;
}

/**
 * Helper: every recurring series this user follows.
 *
 * Following is series-level subscription — separate from per-occurrence RSVP.
 * Drives the Discover "Following" surface and the Schedule Interested tab's
 * Following section. One-off meets are excluded by definition (you don't
 * "follow" a one-shot event).
 */
export function getFollowedSeries(userId: string): Meet[] {
  return mockMeets.filter(
    (m) => m.cadence !== "one_off" && (m.followers ?? []).includes(userId),
  );
}

/** Helper: get upcoming meets sorted by date */
export function getUpcomingMeets(): Meet[] {
  return mockMeets
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
}

/** Helper: get meets by type */
export function getMeetsByType(type: string): Meet[] {
  if (type === "All") return mockMeets;
  const typeMap: Record<string, string> = {
    Walks: "walk",
    "Park Hangouts": "park_hangout",
    Playdates: "playdate",
    Training: "training",
  };
  return mockMeets.filter((m) => m.type === typeMap[type]);
}

/** Helper: build a short type-specific summary line for MeetCard display */
export function getMeetTypeSummary(meet: Meet): string {
  switch (meet.type) {
    case "walk": {
      const parts: string[] = [];
      if (meet.walk?.pace) parts.push(PACE_LABELS[meet.walk.pace]);
      if (meet.walk?.distance) {
        const distShort: Record<string, string> = { short: "< 2 km", medium: "2–4 km", long: "4+ km" };
        parts.push(distShort[meet.walk.distance]);
      }
      if (meet.walk?.terrain && meet.walk.terrain !== "mixed") parts.push(TERRAIN_LABELS[meet.walk.terrain]);
      return parts.join(" · ");
    }
    case "park_hangout": {
      const parts: string[] = [];
      if (meet.parkHangout?.dropIn && meet.parkHangout.endTime) {
        parts.push(`Drop in ${meet.time}–${meet.parkHangout.endTime}`);
      }
      if (meet.parkHangout?.amenities?.includes("fenced_area")) parts.push("Fenced");
      if (meet.parkHangout?.vibe) parts.push(VIBE_LABELS[meet.parkHangout.vibe]);
      return parts.join(" · ");
    }
    case "playdate": {
      const parts: string[] = [];
      if (meet.playdate?.ageRange && meet.playdate.ageRange !== "any") {
        const ageShort: Record<string, string> = { puppy: "Puppies", young: "Young dogs", adult: "Adults", senior: "Seniors" };
        parts.push(ageShort[meet.playdate.ageRange] || "");
      }
      if (meet.playdate?.playStyle) parts.push(PLAY_STYLE_LABELS[meet.playdate.playStyle] + " play");
      if (meet.playdate?.fencedArea) parts.push("Fenced");
      return parts.join(" · ");
    }
    case "training": {
      const parts: string[] = [];
      if (meet.training?.skillFocus?.length) {
        parts.push(meet.training.skillFocus.map((s) => SKILL_LABELS[s]).join(", "));
      }
      if (meet.training?.experienceLevel) parts.push(EXPERIENCE_LABELS[meet.training.experienceLevel]);
      return parts.join(" · ");
    }
    default:
      return "";
  }
}
