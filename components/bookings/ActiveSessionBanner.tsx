"use client";

/**
 * ActiveSessionBanner — mobile-only floating mini-banner that signals
 * a live care session above the bottom nav. Hidden on desktop, where
 * `<SidebarActiveSessionLink>` provides the equivalent affordance
 * inside the sidebar nav. Shared data via `useActiveSession`.
 *
 * Single-line layout (2026-05-08 walkthrough refinement):
 *   [ACTIVE]  🏠 Sitting Bára · 24 min     ›
 *
 * The dark pill with yellow text contrasts against the amber shell
 * tint so the live state is unmistakable; the rest of the line
 * carries service icon + copy + elapsed inline. Tighter vertical
 * padding too — the banner is meant to be a slim signal, not a tile.
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
        <span className="active-session-banner-pill">Active</span>
        <span className="active-session-banner-copy">
          {serviceIcon(active.booking.serviceType)}
          <span className="active-session-banner-copy-text">{active.copy}</span>
          {active.elapsed && (
            <span className="active-session-banner-elapsed"> · {active.elapsed}</span>
          )}
        </span>
        <CaretRight size={16} weight="bold" className="active-session-banner-chevron" />
      </div>
    </Link>
  );
}
