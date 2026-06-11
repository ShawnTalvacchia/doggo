"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { ArrowDown, ArrowUp, ClockCounterClockwise, DotsThree, Plant, Tree } from "@phosphor-icons/react";
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
 * real surface is FC16's walker pool management. The row renders the
 * RESULT only (tier pill + walk total) — no provenance annotations;
 * credited-vs-logged and override-vs-derived live in the data and
 * render on the admin surface when it exists.
 */
interface ShelterMemberRowProps {
  entry:
    | { kind: "walker"; data: ShelterWalker; sortAt: string }
    | { kind: "supporter"; data: ShelterSupporter; sortAt: string };
  shelterName?: string;
  /** Operator-stub tier controls — present only for walker rows when the
   *  consuming surface wires them. Hidden per direction at the ladder
   *  ends (no promote at trusted, no demote at vetted). Labels carry no
   *  "(demo)" suffix (PO call 2026-06-10) — Promote/Demote act for real
   *  and their effect is immediately visible; Credit walks fires the
   *  stub-feature toast (the real version needs a count form on the
   *  operator surface). */
  onPromote?: () => void;
  onDemote?: () => void;
  /** "Credit walks" item — consumer decides behavior (currently the
   *  stub-feature toast; see MembersTab). */
  onCreditWalks?: () => void;
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

export function ShelterMemberRow({
  entry,
  onPromote,
  onDemote,
  onCreditWalks,
}: ShelterMemberRowProps) {
  const { kind, data } = entry;
  const displayName = data.displayName;
  // Walker → UserProfile bridge (G). When data.userId resolves to a
  // real UserProfile, the row links to their profile. Directory-style
  // walkers (fabricated slug ids that don't resolve) stay non-clickable.
  const bridgedUser = getUserById(data.userId);
  const profileHref = bridgedUser ? `/profile/${data.userId}` : undefined;

  const hasTierControls = kind === "walker" && (onPromote || onDemote || onCreditWalks);
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
            // Plain total — no provenance annotations (PO call,
            // 2026-06-10): viewers shouldn't audit each row ("how many
            // credited? is the tier shelter-set?"). The credited/override
            // split stays in the DATA (A7's audit trail) and renders on
            // the future admin surface (FC16), not here. Trust the
            // number; trust the badge.
            <span>
              {data.walkCount} {data.walkCount === 1 ? "walk" : "walks"}
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
                  Promote
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
                  Demote
                </button>
              )}
              {onCreditWalks && (
                <button
                  type="button"
                  className="dropdown-menu-item"
                  onClick={() => {
                    onCreditWalks();
                    setMenuOpen(false);
                  }}
                >
                  <ClockCounterClockwise size={16} weight="light" />
                  Credit walks
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
