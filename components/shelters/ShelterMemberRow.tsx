"use client";

import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { PawPrint, Heart } from "@phosphor-icons/react";
import type { ShelterSupporter, ShelterWalker, WalkerTier } from "@/lib/types";

/**
 * A single row on the shelter Members tab. Walkers and Supporters render
 * through this one component — walkers get an affiliation chip + walks-count
 * subline; supporters get a quieter "Supporter" chip.
 *
 * V1 ships a flat affiliation chip ("Walker · {shelter}") with no tier
 * intensification — the credentialing-moat phase upgrades the badge with
 * the visual escalation language (outlined → filled → filled+ring) per the
 * §8 + §14 resolutions. Walker tier is shown here in the subline ("Vetted
 * walker") so the information is visible without needing a tier-styled chip.
 */
interface ShelterMemberRowProps {
  entry:
    | { kind: "walker"; data: ShelterWalker; sortAt: string }
    | { kind: "supporter"; data: ShelterSupporter; sortAt: string };
  shelterName: string;
}

const TIER_LABEL: Record<WalkerTier, string> = {
  vetted: "Vetted walker",
  experienced: "Experienced walker",
  trusted: "Trusted handler",
};

export function ShelterMemberRow({ entry, shelterName }: ShelterMemberRowProps) {
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
          {kind === "walker" ? (
            <span className="shelter-member-chip shelter-member-chip--walker">
              <PawPrint size={11} weight="light" />
              Walker · {shelterName}
            </span>
          ) : (
            <span className="shelter-member-chip shelter-member-chip--supporter">
              <Heart size={11} weight="light" />
              Supporter
            </span>
          )}
        </div>

        <div className="shelter-member-subline">
          {kind === "walker" ? (
            <>
              <span>{TIER_LABEL[data.tier]}</span>
              <span aria-hidden="true">·</span>
              <span>
                {data.walkCount} {data.walkCount === 1 ? "walk" : "walks"}
              </span>
            </>
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
