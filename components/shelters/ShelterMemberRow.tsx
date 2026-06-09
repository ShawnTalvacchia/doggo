"use client";

import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { Plant, Tree } from "@phosphor-icons/react";
import type { ShelterSupporter, ShelterWalker, WalkerTier } from "@/lib/types";

/**
 * A single row on the shelter Members tab.
 *
 * Walkers carry a tier-labeled credential pill via the shared
 * `.credential-pill` family (violet variant). Tier escalation rides
 * three signals stacked: surface saturation (neutral → soft → dark),
 * icon presence (none → Plant → Tree fill), and label distinction
 * (T1 and T2 both read "Volunteer"; T3 distinguishes as "Super
 * Volunteer"). Same mechanic as the Carer aggregate badge in the
 * credentialing-moat phase — see credential-pill in /styleguide/components.
 *
 * Supporters carry no chip; the walker badge is the differentiator.
 */
interface ShelterMemberRowProps {
  entry:
    | { kind: "walker"; data: ShelterWalker; sortAt: string }
    | { kind: "supporter"; data: ShelterSupporter; sortAt: string };
  shelterName?: string;
}

// T1 and T2 share the short label "Volunteer" — the style escalation
// (saturation + icon) does the work between them; only T3 earns a
// distinguishing word. "Regular Volunteer" was dropped during the
// credentialing-moat walkthrough (O1) because it didn't read as a step
// up from "Volunteer" — could even read as "regular/not special."
const TIER_LABEL: Record<WalkerTier, string> = {
  vetted: "Volunteer",
  experienced: "Volunteer",
  trusted: "Super Volunteer",
};

// T1 has NO icon (escalation starts adding signals at T2). Growth
// metaphor at T2+T3 — Plant (growing) → Tree (established). Tree at
// T3 uses weight="fill" for the strongest jump (paired with the dark
// surface flip).
const TIER_ICON: Record<WalkerTier, typeof Plant | null> = {
  vetted: null,
  experienced: Plant,
  trusted: Tree,
};

const TIER_CLASS: Record<WalkerTier, string> = {
  vetted: "credential-pill--tier-1",
  experienced: "credential-pill--tier-2",
  trusted: "credential-pill--tier-3",
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
            const iconWeight = data.tier === "trusted" ? "fill" : "regular";
            return (
              <span className={`credential-pill credential-pill--volunteer ${TIER_CLASS[data.tier]}`}>
                {TierIcon && <TierIcon size={14} weight={iconWeight} />}
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
