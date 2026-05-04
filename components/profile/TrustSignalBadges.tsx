"use client";

import { Footprints, UsersThree, HandsClapping } from "@phosphor-icons/react";
import type { Connection } from "@/lib/types";

/**
 * Relationship trust signals — what the viewer and this person have in
 * common. Renders as a horizontal row of icon+text items that wraps to
 * additional lines if there isn't space (not pills), so they read as
 * context the platform is sharing rather than achievement labels on the
 * provider. Distinct vocabulary from the `TrustBadgeStrip` (which carries
 * credential / community-earned / platform badges *about* the person, in
 * pills). Discover & Care 2026-05-04.
 *
 * Ordered by rhetorical strength: frequency → mutual people → shared community.
 */
export function TrustSignalBadges({ connection }: { connection: Connection }) {
  const rows: { icon: React.ReactNode; text: string }[] = [];

  if (connection.meetsShared && connection.meetsShared > 0) {
    rows.push({
      icon: <Footprints size={14} weight="light" />,
      text: `You've walked together ${connection.meetsShared} times`,
    });
  }

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

  if (connection.sharedGroups && connection.sharedGroups.length > 0) {
    const groups = connection.sharedGroups;
    const text = groups.length === 1
      ? `Both in ${groups[0]}`
      : `${groups.length} shared groups`;
    rows.push({
      icon: <HandsClapping size={14} weight="light" />,
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
