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
  dogsWalkedThisWeek: 24,
  meetsThisWeek: 12,
  activeDogs: 47,
  newMembersThisMonth: 8,
  topMeetSpot: "Riegrovy sady",
};

export function getNeighbourhoodStats(): NeighbourhoodStats {
  return neighbourhoodStats;
}
