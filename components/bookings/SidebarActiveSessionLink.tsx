"use client";

/**
 * SidebarActiveSessionLink — desktop sidebar's equivalent of the mobile
 * `ActiveSessionBanner`. Renders as a small amber row right below the
 * regular nav items when a session is in_progress for the viewer.
 * Hidden on mobile (sidebar itself is hidden there); the in-content
 * banner takes over.
 *
 * Single-line layout (2026-05-08 walkthrough refinement): pulsing live
 * dot + service icon + copy + elapsed. Mirrors the mobile banner so
 * cross-app presence reads the same on both viewports — same visual
 * grammar, same pulse, same word order. Replaced the earlier two-line
 * "ACTIVE NOW · NN min / 🏠 Sitting Bára" treatment.
 *
 * Text-only — no pet thumbnail. The amber chrome is doing the visual
 * heavy lifting; the avatar would still crowd the sidebar width (240px
 * since 2026-05-07) and doesn't add information the user can't get from
 * the booking detail page itself. Sessions & Service Execution A3,
 * 2026-05-05.
 */

import Link from "next/link";
import { HandHeart, House, Bed } from "@phosphor-icons/react";
import { useActiveSession } from "@/lib/useActiveSession";
import type { ServiceType } from "@/lib/types";

function serviceIcon(serviceType: ServiceType): React.ReactNode {
  if (serviceType === "boarding") return <Bed size={12} weight="fill" />;
  if (serviceType === "day_care") return <House size={12} weight="fill" />;
  if (serviceType === "house_sitting") return <House size={12} weight="fill" />;
  return <HandHeart size={12} weight="fill" />;
}

export function SidebarActiveSessionLink() {
  const active = useActiveSession();
  if (!active) return null;

  return (
    <Link
      href={active.href}
      className="sidebar-active-session"
      aria-label={`${active.copy} — view session`}
    >
      <span className="live-pulse-dot" role="img" aria-label="Live" />
      <span className="sidebar-active-session-copy">
        {serviceIcon(active.booking.serviceType)}
        <span className="sidebar-active-session-copy-text">{active.copy}</span>
        {active.elapsed && (
          <span className="sidebar-active-session-elapsed"> · {active.elapsed}</span>
        )}
      </span>
    </Link>
  );
}
