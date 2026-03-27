import type {
  Meet,
  MeetEnergyLevel,
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
    type: "walk",
    groupId: "group-1",
    title: "Morning walk — Riegrovy sady",
    description:
      "Relaxed morning walk through the park. We usually do a loop around the upper path and let the dogs sniff around. All sizes welcome.",
    location: "Riegrovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0785,
    lng: 14.4416,
    date: "2026-03-18",
    time: "08:00",
    durationMinutes: 60,
    recurring: true,
    maxAttendees: 8,
    dogSizeFilter: "any",
    leashRule: "mixed",
    status: "upcoming",
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
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    attendees: [
      {
        userId: "shawn",
        userName: "Shawn",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Spot", "Goldie"],
      },
      {
        userId: "jana",
        userName: "Jana",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Rex"],
      },
      {
        userId: "tomas",
        userName: "Tomáš",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Bella"],
      },
    ],
    recentJoinText: "Tomáš joined 2h ago",
    createdAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "meet-2",
    type: "park_hangout",
    groupId: "group-2",
    title: "Weekend hangout — Stromovka",
    description:
      "Casual Saturday hangout in the big field by the pond. Bring a ball, bring treats. Dogs play, owners chat.",
    location: "Stromovka, Prague 7",
    neighbourhood: "Holešovice",
    lat: 50.1055,
    lng: 14.4175,
    date: "2026-03-21",
    time: "10:00",
    durationMinutes: 90,
    recurring: false,
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
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    attendees: [
      {
        userId: "jana",
        userName: "Jana",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Rex"],
      },
      {
        userId: "shawn",
        userName: "Shawn",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Spot"],
      },
      {
        userId: "eva",
        userName: "Eva",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Luna", "Max"],
      },
      {
        userId: "martin",
        userName: "Martin",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Charlie"],
      },
    ],
    createdAt: "2026-03-12T14:30:00Z",
  },
  {
    id: "meet-3",
    type: "training",
    groupId: "group-4",
    title: "Recall practice — Letná",
    description:
      "Small group recall training session. Ideal for dogs that need work on coming back when called. Bring high-value treats!",
    location: "Letenské sady, Prague 7",
    neighbourhood: "Letná",
    lat: 50.0968,
    lng: 14.4244,
    date: "2026-03-22",
    time: "09:00",
    durationMinutes: 45,
    recurring: false,
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
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    attendees: [
      {
        userId: "eva",
        userName: "Eva",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Luna"],
      },
      {
        userId: "tomas",
        userName: "Tomáš",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Bella"],
      },
    ],
    createdAt: "2026-03-14T09:00:00Z",
  },
  {
    id: "meet-4",
    type: "playdate",
    title: "Puppy socialisation — Havlíčkovy sady",
    description:
      "Small playdate for puppies under 1 year. Calm, supervised play so young dogs can build confidence. Small dogs preferred.",
    location: "Havlíčkovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0725,
    lng: 14.4405,
    date: "2026-03-23",
    time: "14:00",
    durationMinutes: 60,
    recurring: true,
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
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    attendees: [
      {
        userId: "martin",
        userName: "Martin",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Charlie"],
      },
    ],
    createdAt: "2026-03-15T11:00:00Z",
  },
  {
    id: "meet-5",
    type: "walk",
    title: "Evening stroll — Vítkov",
    description:
      "After-work walk along the ridge with great city views. Medium pace, about 45 minutes. On-leash until we reach the open area.",
    location: "Vítkov, Prague 3",
    neighbourhood: "Žižkov",
    lat: 50.0838,
    lng: 14.4490,
    date: "2026-03-19",
    time: "17:30",
    durationMinutes: 45,
    recurring: true,
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
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    attendees: [
      {
        userId: "tomas",
        userName: "Tomáš",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Bella"],
      },
      {
        userId: "shawn",
        userName: "Shawn",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Goldie"],
      },
    ],
    createdAt: "2026-03-13T16:00:00Z",
  },
  // A completed meet (for post-meet connect prompts later)
  {
    id: "meet-6",
    type: "walk",
    title: "Sunday morning walk — Riegrovy sady",
    description: "Our regular Sunday morning group walk. Great turnout this week!",
    location: "Riegrovy sady, Prague 2",
    neighbourhood: "Vinohrady",
    lat: 50.0785,
    lng: 14.4416,
    date: "2026-03-16",
    time: "09:00",
    durationMinutes: 60,
    recurring: true,
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
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    attendees: [
      {
        userId: "shawn",
        userName: "Shawn",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Spot", "Goldie"],
      },
      {
        userId: "jana",
        userName: "Jana",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Rex"],
      },
      {
        userId: "eva",
        userName: "Eva",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
        dogNames: ["Luna"],
      },
    ],
    createdAt: "2026-03-09T08:00:00Z",
    photos: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80",
    ],
  },
];

/** Helper: get meets the current user has joined */
export function getUserMeets(userId: string): Meet[] {
  return mockMeets.filter((m) =>
    m.attendees.some((a) => a.userId === userId)
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
