import type { Connection } from "./types";

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
