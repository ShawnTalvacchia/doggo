import { allUsers } from "./mockUsers";

export interface NeighbourhoodStats {
  neighbourhood: string;
  dogsWalkedThisWeek: number;
  meetsThisWeek: number;
  activeDogs: number;
  newMembersThisMonth: number;
  topMeetSpot: string;
}

/**
 * Per-neighbourhood stats. The dog count is computed from `mockUsers` —
 * sum of dogs across users whose `neighbourhood` matches. Other counters
 * (walks, meets, new members) are still mocked since the platform doesn't
 * track those signals yet; values are tuned per neighbourhood for the
 * Vinohrady-centric demo. Future: derive these from actual booking +
 * meet attendance data.
 *
 * Pass the target neighbourhood — defaults to "Vinohrady" since the
 * demo's data is densest there. Used by the new-user `DogsNearYou` strip
 * to surface real attendance numbers per locality.
 */
const STATIC_PER_NEIGHBOURHOOD: Record<
  string,
  Omit<NeighbourhoodStats, "activeDogs" | "neighbourhood">
> = {
  Vinohrady: {
    dogsWalkedThisWeek: 38,
    meetsThisWeek: 16,
    newMembersThisMonth: 6,
    topMeetSpot: "Riegrovy sady",
  },
  Karlín: {
    dogsWalkedThisWeek: 22,
    meetsThisWeek: 9,
    newMembersThisMonth: 4,
    topMeetSpot: "Kaizlovy sady",
  },
  Holešovice: {
    dogsWalkedThisWeek: 29,
    meetsThisWeek: 12,
    newMembersThisMonth: 5,
    topMeetSpot: "Stromovka",
  },
  Letná: {
    dogsWalkedThisWeek: 31,
    meetsThisWeek: 14,
    newMembersThisMonth: 5,
    topMeetSpot: "Letenské sady",
  },
};

const DEFAULT_FALLBACK: Omit<NeighbourhoodStats, "activeDogs" | "neighbourhood"> = {
  dogsWalkedThisWeek: 18,
  meetsThisWeek: 7,
  newMembersThisMonth: 3,
  topMeetSpot: "Letná",
};

export function getNeighbourhoodStats(
  neighbourhood: string = "Vinohrady",
): NeighbourhoodStats {
  // Active dogs = total pets across all users who list this neighbourhood as
  // their home. Real number from the mock-world source of truth, not a
  // hardcoded magic value.
  const activeDogs = allUsers
    .filter((u) => u.neighbourhood === neighbourhood)
    .reduce((sum, u) => sum + u.pets.length, 0);

  const staticPart =
    STATIC_PER_NEIGHBOURHOOD[neighbourhood] ?? DEFAULT_FALLBACK;

  return {
    neighbourhood,
    activeDogs,
    ...staticPart,
  };
}
