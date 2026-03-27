import type { Connection } from "./types";

/**
 * Generates contextual relationship text for participant cards, profiles, and feed.
 * Returns an array of signal strings, ordered by relevance.
 */
export function getRelationshipSignals(connection: Connection): string[] {
  const signals: string[] = [];

  // "Connected since [month]"
  if (connection.state === "connected" && connection.firstMetDate) {
    const date = new Date(connection.firstMetDate);
    const month = date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    signals.push(`Connected since ${month}`);
  }

  // "[N]th meet together"
  if (connection.meetsShared && connection.meetsShared > 1) {
    const n = connection.meetsShared;
    const suffix = n === 2 ? "nd" : n === 3 ? "rd" : "th";
    signals.push(`${n}${suffix} meet together`);
  }

  // "[N] mutual connections"
  if (connection.mutualConnections && connection.mutualConnections.length > 0) {
    const names = connection.mutualConnections;
    if (names.length <= 2) {
      signals.push(`You both know ${names.join(" and ")}`);
    } else {
      signals.push(`${names.length} mutual connections`);
    }
  }

  // "Also in [community name]"
  if (connection.sharedGroups && connection.sharedGroups.length > 0) {
    signals.push(`Also in ${connection.sharedGroups[0]}`);
  }

  // "Wants to connect" (they marked us as familiar)
  if (connection.theyMarkedFamiliar && connection.state !== "connected") {
    signals.push("Wants to connect");
  }

  return signals;
}

/**
 * Returns the single most relevant context signal for compact displays (e.g. meet cards).
 */
export function getPrimarySignal(connection: Connection): string | null {
  const signals = getRelationshipSignals(connection);
  return signals[0] ?? null;
}
