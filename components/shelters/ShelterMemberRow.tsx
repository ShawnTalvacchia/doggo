"use client";

import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { PawPrint } from "@phosphor-icons/react";
import type { ShelterSupporter, ShelterWalker, WalkerTier } from "@/lib/types";

/**
 * A single row on the shelter Members tab.
 *
 * Walkers carry a tier-labeled chip ("Vetted Walker" / "Experienced
 * Walker" / "Trusted Handler") — the chip IS the tier signal. The
 * subline carries the activity stat ("18 walks").
 *
 * Supporters get NO chip — the whole tab is supporters by default; the
 * walker chip is the differentiator. Supporter rows just show
 * "Following since Mon Year" in the subline.
 *
 * Tier-coded visual intensification (outlined → filled → filled+ring)
 * is deferred to the credentialing-moat phase per FC9. V1 ships the
 * tier label inside a uniform chip style.
 */
interface ShelterMemberRowProps {
  entry:
    | { kind: "walker"; data: ShelterWalker; sortAt: string }
    | { kind: "supporter"; data: ShelterSupporter; sortAt: string };
  // shelterName is kept on the prop type for forward-compat (a future
  // multi-shelter walker badge could render shelter context); unused
  // today because the chip is implicit-shelter on the shelter's own
  // Members tab.
  shelterName?: string;
}

// Working titles — see FC9. The pattern is consistent ("[modifier] Walker")
// so the chip family reads as one taxonomy across shelters: change the
// modifier, the affiliation stays.
const TIER_LABEL: Record<WalkerTier, string> = {
  vetted: "New Walker",
  experienced: "Regular Walker",
  trusted: "Trusted Walker",
};

// Tier escalation is carried by the paw icon weight — light → bold →
// fill. One icon, three weights reads as a coherent progression
// without leaderboard / points-system framing. Chip style stays
// identical across tiers (Regular Walker baseline) so the family reads
// as "walker affiliation" first; the weight nudge is the tier nuance.
// See FC9 for the future credentialing-moat treatment.
const TIER_ICON_WEIGHT: Record<WalkerTier, "light" | "bold" | "fill"> = {
  vetted: "light",
  experienced: "bold",
  trusted: "fill",
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
          {kind === "walker" && (
            <span className="shelter-member-chip shelter-member-chip--walker">
              <PawPrint size={11} weight={TIER_ICON_WEIGHT[data.tier]} />
              {TIER_LABEL[data.tier]}
            </span>
          )}
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
