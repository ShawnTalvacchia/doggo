"use client";

/**
 * ActiveSessionBanner — mobile-only floating mini-banner that signals
 * a live care session above the bottom nav. Hidden on desktop, where
 * `<SidebarActiveSessionLink>` provides the equivalent affordance
 * inside the sidebar nav. Shared data via `useActiveSession`.
 *
 * Layout (2026-05-08 walkthrough — pulse dot replaces text pill):
 *   ●(pulsing)  🏠 Sitting Bára · 24 min     ›
 *
 * The pulsing red dot reads as "this is live right now" — same visual
 * grammar as live-recording / live-broadcast indicators across the
 * web. Vertical padding scales with viewport (clamp) so the banner
 * grows slightly taller on wider mobile widths instead of staying
 * uniformly slim and feeling cramped at 600–768px.
 *
 * Sessions & Service Execution A3, 2026-05-05.
 */

import Link from "next/link";
import { CaretRight, HandHeart, House, Bed } from "@phosphor-icons/react";
import { useActiveSession } from "@/lib/useActiveSession";
import type { ServiceType } from "@/lib/types";

function serviceIcon(serviceType: ServiceType): React.ReactNode {
  if (serviceType === "boarding") return <Bed size={14} weight="fill" />;
  if (serviceType === "inhome_sitting") return <House size={14} weight="fill" />;
  return <HandHeart size={14} weight="fill" />;
}

export function ActiveSessionBanner() {
  const active = useActiveSession();
  if (!active) return null;

  return (
    <Link
      href={active.href}
      className="active-session-banner"
      aria-label={`${active.copy} — tap to view session`}
    >
      <div className="active-session-banner-content">
        <span className="live-pulse-dot" role="img" aria-label="Live" />
        <span className="active-session-banner-copy">
          {serviceIcon(active.booking.serviceType)}
          <span className="active-session-banner-copy-text">{active.copy}</span>
          {active.elapsed && (
            <span className="active-session-banner-elapsed"> · {active.elapsed}</span>
          )}
        </span>
        <CaretRight size={12} weight="bold" className="active-session-banner-chevron" />
      </div>
    </Link>
  );
}
