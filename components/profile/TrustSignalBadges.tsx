"use client";

import { useState } from "react";
import { Footprints, UsersThree, HandsClapping } from "@phosphor-icons/react";
import type { Connection } from "@/lib/types";

const VISIBLE_LIMIT = 3;

/**
 * Trust signals on a profile page. Three pills max — kept tight to avoid
 * a wall of overlapping evidence. Earlier versions also showed
 * "Met at <meet>" and "Known since <date>" pills; both got cut as
 * lower-value and (for "Known since") semantically ambiguous —
 * `firstMetDate` is the first shared meet, but the word "Known" reads
 * like "Connected since," which it isn't. Cut by Mock World Building
 * 2026-04-30.
 *
 * If we want a richer signal set later (e.g. on a "relationship detail"
 * screen), the truncate-and-expand pattern is still in place — just
 * push more entries into `badges` and they'll wind through the +N more
 * affordance.
 */
export function TrustSignalBadges({ connection }: { connection: Connection }) {
  const [expanded, setExpanded] = useState(false);

  // Ordered by rhetorical strength: frequency → mutual people → shared community.
  const badges: { icon: React.ReactNode; text: string }[] = [];

  if (connection.meetsShared && connection.meetsShared > 0) {
    badges.push({
      icon: <Footprints size={12} weight="light" />,
      text: `Walked together ${connection.meetsShared} times`,
    });
  }

  if (connection.mutualConnections && connection.mutualConnections.length > 0) {
    const names = connection.mutualConnections;
    const text = names.length === 1
      ? `You both know ${names[0]}`
      : names.length === 2
      ? `You both know ${names[0]} and ${names[1]}`
      : `${names.length} mutual connections`;
    badges.push({
      icon: <UsersThree size={12} weight="light" />,
      text,
    });
  }

  if (connection.sharedGroups && connection.sharedGroups.length > 0) {
    const groups = connection.sharedGroups;
    const text = groups.length === 1
      ? `Both in ${groups[0]}`
      : `${groups.length} shared groups`;
    badges.push({
      icon: <HandsClapping size={12} weight="light" />,
      text,
    });
  }

  if (badges.length === 0) return null;

  // Show all if expanded, OR if hiding only 1 (a "+1 more" pill takes the
  // same space as the actual pill — it's pointless friction at N=1).
  const wouldHide = badges.length - VISIBLE_LIMIT;
  const showAll = expanded || wouldHide <= 1;
  const visible = showAll ? badges : badges.slice(0, VISIBLE_LIMIT);
  const hiddenCount = badges.length - visible.length;

  return (
    <div className="flex items-center gap-xs flex-wrap justify-center">
      {visible.map((badge, i) => (
        <span
          key={i}
          className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs text-fg-secondary"
          style={{ background: "var(--surface-base)" }}
        >
          {badge.icon}
          {badge.text}
        </span>
      ))}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-xs rounded-pill px-sm py-xs text-xs text-fg-secondary cursor-pointer hover:text-fg-primary"
          style={{ background: "var(--surface-base)", border: "none" }}
        >
          + {hiddenCount} more
        </button>
      )}
    </div>
  );
}
