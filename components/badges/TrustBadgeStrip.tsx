"use client";

import {
  PawPrint,
  Users,
  Repeat,
  GraduationCap,
  Stethoscope,
  Clock,
  ShieldCheck,
} from "@phosphor-icons/react";
import type { TrustBadge, TrustBadgeKind } from "@/lib/trustBadges";

const ICON: Record<TrustBadgeKind, React.ReactNode> = {
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
        const tinted = compact && badge.category === "community";
        return (
          <span
            key={badge.kind}
            title={badge.detail}
            className={`flex items-center gap-xs rounded-pill ${compact ? "px-xs py-xs" : "px-sm py-xs"}`}
            style={{
              background: tinted ? "var(--brand-subtle)" : "var(--surface-base)",
              color: tinted ? "var(--brand-strong)" : "var(--text-secondary)",
              fontSize: compact ? 10 : 11,
              fontWeight: 600,
              border: tinted ? "none" : "1px solid var(--border-regular)",
            }}
          >
            {ICON[badge.kind]}
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}
