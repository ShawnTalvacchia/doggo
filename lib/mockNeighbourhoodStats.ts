export interface NeighbourhoodStats {
  neighbourhood: string;
  dogsWalkedThisWeek: number;
  meetsThisWeek: number;
  activeDogs: number;
  newMembersThisMonth: number;
  topMeetSpot: string;
}

export const neighbourhoodStats: NeighbourhoodStats = {
  neighbourhood: "Vinohrady",
  dogsWalkedThisWeek: 38,
  meetsThisWeek: 16,
  activeDogs: 52,
  newMembersThisMonth: 6,
  topMeetSpot: "Riegrovy sady",
};

export function getNeighbourhoodStats(): NeighbourhoodStats {
  return neighbourhoodStats;
}
