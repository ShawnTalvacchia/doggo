"use client";

import { Footprints, UsersThree, HandsClapping } from "@phosphor-icons/react";
import type { Connection } from "@/lib/types";

/**
 * Relationship trust signals — what the viewer and this person have in
 * common. Two rows max, each with a single icon + inline text:
 *
 *   1. Shared activity — meets + groups, joined with `·` so the count
 *      reads compactly. Example: "Both in Vinohrady Walkers · 6 shared
 *      meets". Renamed "walked together" → "shared meets" 2026-05-05
 *      so the label generalises beyond walks (training sessions, park
 *      hangouts).
 *   2. Mutual connections — kept distinct because the pronoun shift
 *      ("You both know …") and named-person specificity reads better
 *      on its own line.
 *
 * Distinct vocabulary from `TrustBadgeStrip` (credential / community-
 * earned / platform badges *about* the person, in pills). Discover &
 * Care 2026-05-04 + Punch List P53 2026-05-05.
 */
export function TrustSignalBadges({ connection }: { connection: Connection }) {
  const rows: { icon: React.ReactNode; text: string }[] = [];

  // Row 1 — combined activity line (groups + meets).
  const groups = connection.sharedGroups ?? [];
  const meetsShared = connection.meetsShared ?? 0;
  const activityParts: string[] = [];
  if (groups.length > 0) {
    activityParts.push(
      groups.length === 1 ? `Both in ${groups[0]}` : `${groups.length} shared groups`,
    );
  }
  if (meetsShared > 0) {
    activityParts.push(`${meetsShared} shared meet${meetsShared === 1 ? "" : "s"}`);
  }
  if (activityParts.length > 0) {
    // Footprints icon when meets data exists (more concrete signal); fall
    // back to HandsClapping for groups-only.
    const icon =
      meetsShared > 0
        ? <Footprints size={14} weight="light" />
        : <HandsClapping size={14} weight="light" />;
    rows.push({ icon, text: activityParts.join(" · ") });
  }

  // Row 2 — mutual connections (kept distinct).
  if (connection.mutualConnections && connection.mutualConnections.length > 0) {
    const names = connection.mutualConnections;
    const text = names.length === 1
      ? `You both know ${names[0]}`
      : names.length === 2
      ? `You both know ${names[0]} and ${names[1]}`
      : `${names.length} mutual connections`;
    rows.push({
      icon: <UsersThree size={14} weight="light" />,
      text,
    });
  }

  if (rows.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-x-md gap-y-xs items-center justify-center sm:justify-start text-sm list-none m-0 p-0">
      {rows.map((row, i) => (
        <li key={i} className="flex items-center gap-xs">
          <span className="shrink-0 opacity-70">{row.icon}</span>
          <span>{row.text}</span>
        </li>
      ))}
    </ul>
  );
}
