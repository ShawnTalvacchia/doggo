"use client";

import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { Leaf, Plant, Tree } from "@phosphor-icons/react";
import type { ShelterSupporter, ShelterWalker, WalkerTier } from "@/lib/types";

/**
 * A single row on the shelter Members tab.
 *
 * Walkers carry a tier-labeled volunteer badge ("New Volunteer" /
 * "Regular Volunteer" / "Trusted Volunteer"). The chip uses a violet
 * fill ("earned recognition") which sits outside the existing semantic
 * ladder (info = paid care, brand = community) so the badge stays
 * distinct as it appears on more surfaces (user profiles, etc.) in
 * the credentialing-moat phase.
 *
 * Tier escalation reads through icon SHAPE — Leaf → Plant → Tree —
 * not through weight or chip styling. Distinct shapes are far more
 * legible at small sizes than weight progression on a single icon.
 *
 * Supporters carry no chip; the walker badge is the differentiator.
 */
interface ShelterMemberRowProps {
  entry:
    | { kind: "walker"; data: ShelterWalker; sortAt: string }
    | { kind: "supporter"; data: ShelterSupporter; sortAt: string };
  shelterName?: string;
}

// Working titles — see FC9. The ladder is:
//  - Entry: just "Volunteer" (no modifier — the real thing, not a
//    probationary "New" status).
//  - Middle: "Regular Volunteer" — modest, descriptive of cadence.
//  - Top: "Super Volunteer" — praise rather than rank, doesn't imply
//    other tiers are "untrusted" the way "Trusted" did.
// "Volunteer" travels cleanly across shelters; the chip doesn't need
// shelter context appended.
const TIER_LABEL: Record<WalkerTier, string> = {
  vetted: "Volunteer",
  experienced: "Regular Volunteer",
  trusted: "Super Volunteer",
};

// Growth metaphor: leaf (smallest unit of life) → plant (a small thing
// growing) → tree (established, rooted). Reads as time accumulating
// through volunteering, not as a leaderboard rank.
const TIER_ICON: Record<WalkerTier, typeof Leaf> = {
  vetted: Leaf,
  experienced: Plant,
  trusted: Tree,
};

export function ShelterMemberRow({ entry }: ShelterMemberRowProps) {
  const { kind, data } = entry;
  const displayName = data.displayName;

  return (
    <div className="shelter-member-row">
      <div className="shelter-member-avatar">
        {data.avatarUrl ? (
          <img src={data.avatarUrl} alt={displayName} />
        ) : (
          <DefaultAvatar name={displayName} size={40} />
        )}
      </div>

      <div className="shelter-member-body">
        <div className="shelter-member-name-row">
          <span className="shelter-member-name">{displayName}</span>
          {kind === "walker" && (() => {
            const TierIcon = TIER_ICON[data.tier];
            return (
              <span className="shelter-member-chip shelter-member-chip--volunteer">
                <TierIcon size={12} weight="bold" />
                {TIER_LABEL[data.tier]}
              </span>
            );
          })()}
        </div>

        <div className="shelter-member-subline">
          {kind === "walker" ? (
            <span>
              {data.walkCount} {data.walkCount === 1 ? "walk" : "walks"}
            </span>
          ) : (
            <span>Following since {monthYear(data.since)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function monthYear(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}
