"use client";

import {
  PawPrint,
  Users,
  Repeat,
  GraduationCap,
  Stethoscope,
  Clock,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";
import type { TrustBadge, TrustBadgeKind } from "@/lib/trustBadges";

const ICON: Record<Exclude<TrustBadgeKind, "carer-portfolio">, React.ReactNode> = {
  "community-regular": <PawPrint size={12} weight="fill" />,
  "trusted-by-network": <Users size={12} weight="fill" />,
  "repeat-clients": <Repeat size={12} weight="fill" />,
  "certified-trainer": <GraduationCap size={12} weight="fill" />,
  "vet-degree": <Stethoscope size={12} weight="fill" />,
  "years-experience": <Clock size={12} weight="fill" />,
  "verified-identity": <ShieldCheck size={12} weight="fill" />,
};

interface Props {
  badges: TrustBadge[];
  /** Cap rendered count. Cards trim to 2-3; profile hero shows all. */
  limit?: number;
  /** Compact = card density. Standard = profile hero density. */
  variant?: "compact" | "standard";
}

/**
 * Renders a horizontal strip of trust badges. Sorted by display priority
 * upstream — caller passes the array as-is. See [[implementation/badges]]
 * for surface-by-surface rules and `lib/trustBadges.ts` for the catalogue.
 *
 * Visual treatment by variant:
 * - `standard` (profile hero): all badges render uniformly neutral. The
 *   profile is consideration-stage — the viewer's already deep in; the
 *   info should read as informational, not promotional. No brand tint.
 * - `compact` (Discover cards): community-earned badges keep brand-tint
 *   to compete for attention before the user has clicked in.
 *
 * Discover & Care D3 / 2026-05-04 visual refresh.
 */
export function TrustBadgeStrip({ badges, limit, variant = "standard" }: Props) {
  if (badges.length === 0) return null;
  const visible = limit ? badges.slice(0, limit) : badges;
  const compact = variant === "compact";
  return (
    <div className="flex items-center gap-xs flex-wrap">
      {visible.map((badge) => {
        // Carer Portfolio uses the shared credential-pill family
        // (credentialing-moat phase B4 / 2026-06-09). Tier metadata
        // resolves the `--tier-N` modifier; Sparkle icon appears at
        // Tier 2 (regular weight) and Tier 3 (fill weight); Tier 1
        // renders with no icon. The aggregate session count surfaces
        // via the `detail` field on hover/tap; profile-hero callers
        // can also render a subtitle line below the strip (B5+).
        if (badge.kind === "carer-portfolio" && badge.tier) {
          const tierClass = `credential-pill--tier-${badge.tier}`;
          const iconWeight = badge.tier === 3 ? "fill" : "regular";
          return (
            <span
              key={badge.kind}
              title={badge.detail}
              className={`credential-pill credential-pill--carer ${tierClass}`}
            >
              {badge.tier >= 2 && <Sparkle size={14} weight={iconWeight} />}
              {badge.label}
            </span>
          );
        }

        const tinted = compact && badge.category === "community";
        // `title` (tooltip) dropped 2026-06-09 — tooltips don't work on
        // mobile and aren't discoverable on desktop. The badge labels
        // carry the meaning; specific counts are surfaced where they
        // matter (carer-portfolio gets the "47 sessions" subtitle on
        // profile hero per the credentialing-moat walkthrough).
        //
        // Sizing aligned to .credential-pill (2026-06-09): same 3px 10px
        // padding + 12px font + 1px border matching the fill (invisible
        // outline; preserves consistent height). Previously rendered
        // ~8px taller than the credential pill on profile hero — visual
        // mismatch across the same row.
        return (
          <span
            key={badge.kind}
            className="flex items-center gap-xs rounded-pill"
            style={{
              background: tinted ? "var(--brand-subtle)" : "var(--surface-base)",
              color: tinted ? "var(--brand-strong)" : "var(--text-secondary)",
              fontSize: 12,
              fontWeight: 600,
              padding: "3px 10px",
              lineHeight: 1.2,
              border: tinted ? "1px solid var(--brand-subtle)" : "1px solid var(--surface-base)",
            }}
          >
            {/* carer-portfolio returned early above, so the index is safe —
                TS just can't see the narrowing through the early return. */}
            {ICON[badge.kind as Exclude<TrustBadgeKind, "carer-portfolio">]}
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}
