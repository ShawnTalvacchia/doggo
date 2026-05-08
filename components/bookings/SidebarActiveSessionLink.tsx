"use client";

/**
 * SidebarActiveSessionLink — desktop sidebar's equivalent of the mobile
 * `ActiveSessionBanner`. Renders as a small amber card right below the
 * regular nav items when a session is in_progress for the viewer.
 * Hidden on mobile (sidebar itself is hidden there); the in-content
 * banner takes over.
 *
 * Text-only — no pet thumbnail. The amber chrome is doing the visual
 * heavy lifting; the avatar would still crowd the sidebar width (now
 * 240px since 2026-05-07; was 180px when this comment was first written)
 * and doesn't add information the user can't get from the booking detail
 * page itself. Sessions & Service Execution A3, 2026-05-05.
 */

import Link from "next/link";
import { Timer, HandHeart, House, Bed } from "@phosphor-icons/react";
import { useActiveSession } from "@/lib/useActiveSession";
import type { ServiceType } from "@/lib/types";

function serviceIcon(serviceType: ServiceType): React.ReactNode {
  if (serviceType === "boarding") return <Bed size={12} weight="fill" />;
  if (serviceType === "inhome_sitting") return <House size={12} weight="fill" />;
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
      <div className="sidebar-active-session-text">
        <span className="sidebar-active-session-status">
          <Timer size={11} weight="fill" />
          Active now
          {active.elapsed && (
            <span className="sidebar-active-session-elapsed"> · {active.elapsed}</span>
          )}
        </span>
        <span className="sidebar-active-session-copy">
          {serviceIcon(active.booking.serviceType)}
          {active.copy}
        </span>
      </div>
    </Link>
  );
}
