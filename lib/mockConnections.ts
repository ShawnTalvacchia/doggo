import type { Connection, ServiceType } from "./types";

export const CONNECTION_STATE_LABELS: Record<string, string> = {
  none: "Not connected",
  familiar: "Familiar",
  pending: "Request sent",
  connected: "Connected",
};

export const mockConnections: Connection[] = [
  // ── People connections (shown on own profile) ──
  {
    id: "conn-1",
    userId: "jana",
    userName: "Jana",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    dogNames: ["Rex"],
    location: "Prague 2",
    state: "connected",
    metAt: "meet-6",
    updatedAt: "2026-03-16T10:00:00Z",
    meetsShared: 5,
    firstMetDate: "2025-11-10",
    lastMetDate: "2026-03-16",
    mutualConnections: ["Eva", "Tomáš"],
    sharedGroups: ["Vinohrady Morning Crew"],
    dogBreed: "German Shepherd",
    neighbourhood: "Vinohrady",
    profileOpen: false,
  },
  {
    id: "conn-2",
    userId: "eva",
    userName: "Eva",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    dogNames: ["Luna", "Max"],
    location: "Prague 7",
    state: "familiar",
    metAt: "meet-6",
    updatedAt: "2026-03-16T10:00:00Z",
    meetsShared: 3,
    firstMetDate: "2026-01-15",
    lastMetDate: "2026-03-16",
    mutualConnections: ["Jana"],
    sharedGroups: ["Stromovka Off-Leash Club"],
    theyMarkedFamiliar: true,
    dogBreed: "Border Collie",
    neighbourhood: "Letná",
    profileOpen: true,
  },
  {
    id: "conn-3",
    userId: "tomas",
    userName: "Tomáš",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    dogNames: ["Bella"],
    location: "Prague 3",
    state: "pending",
    metAt: "meet-1",
    updatedAt: "2026-03-15T14:00:00Z",
    meetsShared: 2,
    firstMetDate: "2026-02-20",
    lastMetDate: "2026-03-18",
    sharedGroups: ["Vinohrady Morning Crew"],
    dogBreed: "French Bulldog",
    neighbourhood: "Žižkov",
    profileOpen: false,
  },
  {
    id: "conn-4",
    userId: "martin",
    userName: "Martin",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    dogNames: ["Charlie"],
    location: "Prague 2",
    state: "none",
    updatedAt: "2026-03-14T09:00:00Z",
    dogBreed: "Labrador Retriever",
    neighbourhood: "Vinohrady",
    profileOpen: false,
  },
  // ── Provider connections (used for trust signals on explore profiles) ──
  {
    id: "conn-5",
    userId: "jana-k",
    userName: "Jana K.",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    dogNames: [],
    location: "Prague 6",
    state: "connected",
    metAt: "meet-6",
    updatedAt: "2026-03-16T10:00:00Z",
    neighbourhood: "Dejvice",
    profileOpen: true,
  },
  {
    id: "conn-6",
    userId: "nikola-r",
    userName: "Nikola R.",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    dogNames: ["Rex"],
    location: "Prague 2",
    state: "familiar",
    metAt: "meet-6",
    updatedAt: "2026-03-15T08:00:00Z",
    neighbourhood: "Vinohrady",
    profileOpen: false,
  },
  {
    id: "conn-7",
    userId: "olga-m",
    userName: "Olga M.",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    dogNames: ["Mila"],
    location: "Prague 5",
    state: "pending",
    metAt: "meet-1",
    updatedAt: "2026-03-14T12:00:00Z",
    dogBreed: "Cavalier King Charles",
    neighbourhood: "Smíchov",
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
    userId: "jana-k",
    services: ["walk_checkin", "inhome_sitting"],
    priceFrom: 240,
    priceUnit: "per_visit",
    meetsShared: 5,
  },
  {
    userId: "tomas",
    services: ["walk_checkin", "boarding"],
    priceFrom: 200,
    priceUnit: "per_visit",
    meetsShared: 3,
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
