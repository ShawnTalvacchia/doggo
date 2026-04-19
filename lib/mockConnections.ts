import type { Connection, ServiceType } from "./types";

export const CONNECTION_STATE_LABELS: Record<string, string> = {
  none: "Not connected",
  familiar: "Familiar",
  pending: "Request sent",
  connected: "Connected",
};

/**
 * All connections from Shawn's perspective.
 *
 * Target density (from mock-data-plan):
 *   Connected: 4-5 | Familiar: 3-4 | Pending: 1-2 | None (visible): a few
 *   Total: 8-12
 */
export const mockConnections: Connection[] = [
  /* ═══ CONNECTED ═══════════════════════════════════════════════════════ */
  {
    id: "conn-jana",
    userId: "jana",
    userName: "Jana",
    avatarUrl: "/images/generated/jana-profile.jpeg",
    dogNames: ["Rex"],
    location: "Prague 2",
    state: "connected",
    metAt: "meet-1",
    updatedAt: "2026-03-16T10:00:00Z",
    meetsShared: 5,
    firstMetDate: "2025-11-10",
    lastMetDate: "2026-03-16",
    mutualConnections: ["Eva", "Tereza"],
    sharedGroups: ["Vinohrady Morning Crew", "Riegrovy Sady Dog Walks"],
    dogBreed: "Labrador Retriever",
    neighbourhood: "Vinohrady",
    profileOpen: true,
  },
  {
    id: "conn-klara",
    userId: "klara",
    userName: "Klára",
    avatarUrl: "/images/generated/klara-profile.jpeg",
    dogNames: ["Eda"],
    location: "Prague 7",
    state: "connected",
    metAt: "meet-11",
    updatedAt: "2026-03-01T09:00:00Z",
    meetsShared: 3,
    firstMetDate: "2026-02-15",
    lastMetDate: "2026-03-01",
    mutualConnections: ["Jana", "Eva"],
    sharedGroups: ["Klára's Calm Dog Sessions", "Stromovka Off-Leash Club"],
    dogBreed: "Border Collie",
    neighbourhood: "Holešovice",
    profileOpen: true,
  },
  {
    id: "conn-marek",
    userId: "marek",
    userName: "Marek",
    avatarUrl: "/images/generated/marek-profile.jpeg",
    dogNames: ["Benny"],
    location: "Prague 2",
    state: "connected",
    metAt: "meet-7",
    updatedAt: "2026-02-20T08:30:00Z",
    meetsShared: 4,
    firstMetDate: "2026-01-22",
    lastMetDate: "2026-03-01",
    mutualConnections: ["Tereza", "Jana", "Lucie"],
    sharedGroups: ["Vinohrady Morning Crew", "Riegrovy Sady Dog Walks", "Vinohrady Evening Walkers"],
    dogBreed: "Cocker Spaniel",
    neighbourhood: "Vinohrady",
    profileOpen: true,
  },
  {
    id: "conn-nikola",
    userId: "nikola",
    userName: "Nikola",
    avatarUrl: "/images/generated/nikola-profile.jpeg",
    dogNames: [],
    location: "Prague 7",
    state: "connected",
    updatedAt: "2026-01-15T10:00:00Z",
    mutualConnections: ["Jana"],
    sharedGroups: [],
    neighbourhood: "Letná",
    profileOpen: true,
  },

  /* ═══ FAMILIAR ════════════════════════════════════════════════════════ */
  {
    id: "conn-tereza",
    userId: "tereza",
    userName: "Tereza",
    avatarUrl: "/images/generated/tereza-profile.jpeg",
    dogNames: ["Franta"],
    location: "Prague 2",
    state: "familiar",
    metAt: "meet-7",
    updatedAt: "2026-02-10T18:00:00Z",
    meetsShared: 4,
    firstMetDate: "2026-01-22",
    lastMetDate: "2026-03-01",
    mutualConnections: ["Jana", "Marek"],
    sharedGroups: ["Vinohrady Morning Crew", "Riegrovy Sady Dog Walks", "Vinohrady Evening Walkers"],
    theyMarkedFamiliar: true,
    dogBreed: "Beagle",
    neighbourhood: "Vinohrady",
    profileOpen: true,
  },
  {
    id: "conn-eva",
    userId: "eva",
    userName: "Eva",
    avatarUrl: "/images/generated/eva-profile.jpeg",
    dogNames: ["Luna", "Max"],
    location: "Prague 7",
    state: "familiar",
    metAt: "meet-9",
    updatedAt: "2026-03-16T10:00:00Z",
    meetsShared: 3,
    firstMetDate: "2026-01-15",
    lastMetDate: "2026-03-16",
    mutualConnections: ["Jana", "Klára"],
    sharedGroups: ["Stromovka Off-Leash Club", "Prague Reactive Dog Support"],
    theyMarkedFamiliar: true,
    dogBreed: "Border Collie mix",
    neighbourhood: "Holešovice",
    profileOpen: true,
  },
  {
    id: "conn-lucie",
    userId: "lucie",
    userName: "Lucie",
    avatarUrl: "/images/generated/lucie-profile.jpeg",
    dogNames: ["Pepík"],
    location: "Prague 2",
    state: "familiar",
    metAt: "meet-7",
    updatedAt: "2026-02-05T08:30:00Z",
    meetsShared: 3,
    firstMetDate: "2026-01-22",
    lastMetDate: "2026-03-01",
    mutualConnections: ["Tereza", "Marek"],
    sharedGroups: ["Vinohrady Morning Crew", "Riegrovy Sady Dog Walks"],
    dogBreed: "Dachshund",
    neighbourhood: "Vinohrady",
    profileOpen: true,
  },
  {
    id: "conn-martin",
    userId: "martin",
    userName: "Martin",
    avatarUrl: "/images/generated/martin-profile.jpeg",
    dogNames: ["Charlie"],
    location: "Prague 7",
    state: "familiar",
    updatedAt: "2026-03-14T09:00:00Z",
    meetsShared: 1,
    sharedGroups: ["Žižkov Dog Parents"],
    dogBreed: "French Bulldog",
    neighbourhood: "Holešovice",
    profileOpen: true,
  },

  /* ═══ PENDING ═════════════════════════════════════════════════════════ */
  {
    id: "conn-tomas",
    userId: "tomas",
    userName: "Tomáš",
    avatarUrl: "/images/generated/tomas-profile.jpeg",
    dogNames: ["Hugo"],
    location: "Prague 8",
    state: "pending",
    metAt: "meet-1",
    updatedAt: "2026-03-15T14:00:00Z",
    meetsShared: 2,
    firstMetDate: "2026-02-20",
    lastMetDate: "2026-03-18",
    sharedGroups: ["Vinohrady Morning Crew"],
    dogBreed: "Labrador Retriever",
    neighbourhood: "Karlín",
    profileOpen: false,
  },
  {
    id: "conn-zuzana",
    userId: "zuzana",
    userName: "Zuzana",
    avatarUrl: "/images/generated/zuzana-profile.jpeg",
    dogNames: ["Mia"],
    location: "Prague 2",
    state: "pending",
    updatedAt: "2026-03-20T15:00:00Z",
    meetsShared: 0,
    sharedGroups: ["Vinohrady Evening Walkers"],
    dogBreed: "Miniature Poodle",
    neighbourhood: "Vinohrady",
    profileOpen: false,
  },

  /* ═══ NONE (visible in explore/meet context) ═════════════════════════ */
  {
    id: "conn-daniel",
    userId: "daniel",
    userName: "Daniel",
    avatarUrl: "/images/generated/daniel-profile.jpeg",
    dogNames: ["Bára"],
    location: "Prague 5",
    state: "none",
    updatedAt: "2026-03-14T09:00:00Z",
    meetsShared: 1,
    sharedGroups: ["Prague Reactive Dog Support", "Klára's Calm Dog Sessions"],
    dogBreed: "Mixed breed rescue",
    neighbourhood: "Smíchov",
    profileOpen: false,
  },
  {
    id: "conn-filip",
    userId: "filip",
    userName: "Filip",
    avatarUrl: "/images/generated/filip-profile.jpeg",
    dogNames: ["Toby"],
    location: "Prague 7",
    state: "none",
    updatedAt: "2026-03-14T09:00:00Z",
    sharedGroups: ["Klára's Calm Dog Sessions"],
    dogBreed: "Jack Russell Terrier",
    neighbourhood: "Holešovice",
    profileOpen: false,
  },
];

/** Community carers — connections who offer care services */
export interface CommunityCarer {
  userId: string;
  services: ServiceType[];
  priceFrom: number;
  priceUnit: "per_visit" | "per_night";
  meetsShared: number;
}

export const communityCarers: CommunityCarer[] = [
  {
    userId: "jana",
    services: ["walk_checkin"],
    priceFrom: 240,
    priceUnit: "per_visit",
    meetsShared: 8,
  },
  {
    userId: "klara",
    services: ["walk_checkin", "inhome_sitting"],
    priceFrom: 300,
    priceUnit: "per_visit",
    meetsShared: 3,
  },
  {
    userId: "tereza",
    services: ["inhome_sitting"],
    priceFrom: 150,
    priceUnit: "per_visit",
    meetsShared: 4,
  },
  {
    userId: "nikola",
    services: ["boarding"],
    priceFrom: 480,
    priceUnit: "per_night",
    meetsShared: 0,
  },
  {
    userId: "petra",
    services: ["inhome_sitting"],
    priceFrom: 120,
    priceUnit: "per_visit",
    meetsShared: 0,
  },
];

/** Get connection state for a specific user */
export function getConnectionState(userId: string): Connection | undefined {
  return mockConnections.find((c) => c.userId === userId);
}

/** Get all connections by state */
export function getConnectionsByState(state: string): Connection[] {
  return mockConnections.filter((c) => c.state === state);
}

/** Get connections who offer care, enriched with carer data */
export function getCommunityCarers() {
  return communityCarers
    .map((cc) => {
      const conn = mockConnections.find((c) => c.userId === cc.userId);
      if (!conn) return null;
      return { ...conn, ...cc };
    })
    .filter(Boolean) as (Connection & CommunityCarer)[];
}
