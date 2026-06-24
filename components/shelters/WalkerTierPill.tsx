/**
 * WalkerTierPill — the volunteer credential pill, reusable wherever a walker's
 * standing should read on a list (handover board, schedule, applications,
 * walker pool). Phase 2 "The Shelter's Side" — surfacing the vouched
 * progression everywhere a walker appears. Uses the shared `.credential-pill`
 * family (violet volunteer ramp); see [[implementation/badges]].
 */

import type { WalkerTier } from "@/lib/types";

const TIER_LABEL: Record<WalkerTier, string> = {
  vetted: "Volunteer",
  experienced: "Volunteer",
  trusted: "Super Volunteer",
};

const TIER_CLASS: Record<WalkerTier, string> = {
  vetted: "credential-pill--tier-1",
  experienced: "credential-pill--tier-2",
  trusted: "credential-pill--tier-3",
};

export function WalkerTierPill({
  tier,
  className,
}: {
  tier: WalkerTier;
  className?: string;
}) {
  return (
    <span
      className={`credential-pill credential-pill--volunteer ${TIER_CLASS[tier]}${className ? ` ${className}` : ""}`}
    >
      {TIER_LABEL[tier]}
    </span>
  );
}
