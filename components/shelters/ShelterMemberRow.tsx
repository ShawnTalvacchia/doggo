"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { ArrowDown, ArrowUp, DotsThree, Plant, Tree } from "@phosphor-icons/react";
import { getUserById } from "@/lib/mockUsers";
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
 *
 * **Shelter tier authority (O4 resolution, 2026-06-10):** walk-count
 * thresholds are suggestions; the shelter promotes/demotes freely. The
 * per-row "(demo)" dropdown is the operator stub for that call — the
 * real surface is FC16's walker pool management. When the shown tier is
 * a shelter override (differs from what the numbers would say), the
 * subline marks it "tier set by shelter" so provenance stays readable.
 */
interface ShelterMemberRowProps {
  entry:
    | { kind: "walker"; data: ShelterWalker; sortAt: string }
    | { kind: "supporter"; data: ShelterSupporter; sortAt: string };
  shelterName?: string;
  /** True when the rendered tier comes from a shelter override rather
   *  than the walk-count derivation / seeded value. */
  tierOverridden?: boolean;
  /** Operator-stub tier controls — present only for walker rows when the
   *  consuming surface wires them. Hidden per direction at the ladder
   *  ends (no promote at trusted, no demote at vetted). */
  onPromote?: () => void;
  onDemote?: () => void;
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

export function ShelterMemberRow({ entry, tierOverridden, onPromote, onDemote }: ShelterMemberRowProps) {
  const { kind, data } = entry;
  const displayName = data.displayName;
  // Walker → UserProfile bridge (G). When data.userId resolves to a
  // real UserProfile, the row links to their profile. Directory-style
  // walkers (fabricated slug ids that don't resolve) stay non-clickable.
  const bridgedUser = getUserById(data.userId);
  const profileHref = bridgedUser ? `/profile/${data.userId}` : undefined;

  const hasTierControls = kind === "walker" && (onPromote || onDemote);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    function onMouseDown(e: MouseEvent) {
      if (!menuWrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [menuOpen]);

  return (
    <div className="shelter-member-row">
      <div className="shelter-member-avatar">
        {profileHref ? (
          <Link href={profileHref} aria-label={`Open ${displayName}'s profile`}>
            {data.avatarUrl ? (
              <img src={data.avatarUrl} alt={displayName} />
            ) : (
              <DefaultAvatar name={displayName} size={40} />
            )}
          </Link>
        ) : data.avatarUrl ? (
          <img src={data.avatarUrl} alt={displayName} />
        ) : (
          <DefaultAvatar name={displayName} size={40} />
        )}
      </div>

      <div className="shelter-member-body">
        <div className="shelter-member-name-row">
          {profileHref ? (
            <Link href={profileHref} className="shelter-member-name" style={{ textDecoration: "none", color: "inherit" }}>
              {displayName}
            </Link>
          ) : (
            <span className="shelter-member-name">{displayName}</span>
          )}
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
              {/* Provenance split (Cross-Shelter Mentor Network D5/A7):
                  shelter-credited bootstrap walks stay distinguishable
                  from platform-logged ones — the audit trail is part of
                  what makes crediting trustworthy. */}
              {data.creditedWalkCount ? ` · ${data.creditedWalkCount} credited by the shelter` : ""}
              {/* Override provenance (O4): the shown tier is the
                  shelter's call, not the walk-count derivation. */}
              {tierOverridden ? " · tier set by shelter" : ""}
            </span>
          ) : (
            <span>Following since {monthYear(data.since)}</span>
          )}
        </div>
      </div>

      {hasTierControls && (
        <div ref={menuWrapRef} className="dropdown-menu-wrap shelter-member-tier-menu-wrap">
          <button
            type="button"
            className="shelter-member-tier-trigger"
            aria-label={`Tier controls for ${displayName} (demo)`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <DotsThree size={18} weight="bold" />
          </button>
          {menuOpen && (
            <div className="dropdown-menu" role="menu">
              {onPromote && (
                <button
                  type="button"
                  className="dropdown-menu-item"
                  onClick={() => {
                    onPromote();
                    setMenuOpen(false);
                  }}
                >
                  <ArrowUp size={16} weight="light" />
                  Promote (demo)
                </button>
              )}
              {onDemote && (
                <button
                  type="button"
                  className="dropdown-menu-item"
                  onClick={() => {
                    onDemote();
                    setMenuOpen(false);
                  }}
                >
                  <ArrowDown size={16} weight="light" />
                  Demote (demo)
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function monthYear(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}
