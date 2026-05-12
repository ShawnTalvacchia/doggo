"use client";

/**
 * DiscoveryBanner — occasional discovery-nudge card interleaved in the
 * Home feed. Pushes the viewer toward a Discover surface (or a specific
 * meet / group / carer) when their context warrants a nudge.
 *
 * Lightweight by design — does not compete with feed posts for attention;
 * sits between them as a gentle "by the way, here's something" prompt.
 * The Home feed surfaces social activity passively; this is the active
 * discovery counterpart, complementing rather than replacing.
 *
 * Shipped 2026-05-11 (Cross-Cutting Flow Testing — Schedule + Discover IA
 * refresh, "third leg" alongside the Schedule simplification and the
 * Discover Meets "your circle" section).
 *
 * **Trigger logic is currently caller-side.** This component just renders;
 * the parent (e.g. `app/home/page.tsx`) decides whether to insert one based
 * on viewer state. Trigger sophistication (frequency caps, dismiss memory,
 * variant rotation) is filed as a follow-up.
 *
 * Visual: feed-shaped card, brand-subtle wash + 3px brand-main left stripe
 * to differentiate from posts. Same rough silhouette as DogsNearYou — both
 * are non-post "ambient discovery" surfaces in the feed.
 */

import Link from "next/link";
import { CaretRight, type Icon } from "@phosphor-icons/react";

interface DiscoveryBannerProps {
  /** Phosphor icon component to render at the left, ~24px. */
  icon: Icon;
  /** Headline copy — keep short. */
  title: string;
  /** Sub-copy — one sentence, the "why this nudge now" framing. */
  subtitle: string;
  /** Destination — typically a `/discover/...` route or a specific meet/group. */
  href: string;
  /** CTA label on the right. */
  ctaLabel: string;
}

export function DiscoveryBanner({
  icon: Icon,
  title,
  subtitle,
  href,
  ctaLabel,
}: DiscoveryBannerProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-md rounded-panel"
      style={{
        background: "var(--brand-subtle)",
        borderLeft: "3px solid var(--brand-main)",
        padding: "var(--space-md) var(--space-lg)",
        textDecoration: "none",
        marginBottom: "var(--space-md)",
      }}
    >
      <Icon size={24} weight="light" className="text-brand-main shrink-0" />
      <div className="flex flex-col flex-1 min-w-0 gap-tiny">
        <span className="font-heading font-semibold text-fg-primary text-sm">
          {title}
        </span>
        <span className="text-xs text-fg-secondary" style={{ lineHeight: 1.4 }}>
          {subtitle}
        </span>
      </div>
      <div className="flex items-center gap-xs text-sm font-semibold text-brand-main shrink-0">
        {ctaLabel}
        <CaretRight size={14} weight="bold" />
      </div>
    </Link>
  );
}
