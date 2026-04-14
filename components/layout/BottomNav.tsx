"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Briefcase,
  CalendarDots,
  Users,
  MagnifyingGlass,
  UserCircle,
} from "@phosphor-icons/react";

const tabs = [
  { label: "Community", href: "/home", Icon: Users },
  { label: "Discover", href: "/discover", Icon: MagnifyingGlass },
  { label: "My Schedule", href: "/schedule", Icon: CalendarDots },
  { label: "Bookings", href: "/bookings", Icon: Briefcase },
  { label: "Profile", href: "/profile", Icon: UserCircle },
] as const;

/**
 * Bottom nav shows ONLY on main hub routes (the 5 tab destinations + top-level sub-sections).
 * All detail/subpages hide it — users navigate back via the header back button
 * or native browser swipe-back gesture.
 */
const hubRoutes = [
  /^\/home$/,
  /^\/home\?/,               // home with query params (view=groups etc.)
  /^\/discover$/,
  /^\/discover\?/,           // discover with query params
  /^\/schedule$/,
  /^\/bookings$/,
  /^\/profile$/,
  /^\/inbox$/,
  /^\/notifications$/,
];

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build the full path with search params for matching
  const search = searchParams.toString();
  const fullPath = search ? `${pathname}?${search}` : pathname;

  // Only show on hub routes — all subpages/detail pages hide bottom nav
  const isHubRoute = hubRoutes.some((pattern) => pattern.test(fullPath));
  if (!isHubRoute) return null;

  // Determine active tab — communities routes map to Home
  // /profile/[userId] is someone else's profile — don't highlight any nav item
  const activeHref = pathname.startsWith("/profile/")
    ? null
    : pathname.startsWith("/home") || pathname.startsWith("/communities") || pathname.startsWith("/groups")
    ? "/home"
    : pathname.startsWith("/discover") || pathname.startsWith("/explore")
    ? "/discover"
    : pathname.startsWith("/schedule")
    ? "/schedule"
    : pathname.startsWith("/bookings")
    ? "/bookings"
    : pathname === "/profile"
    ? "/profile"
    : pathname;

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map(({ label, href, Icon }) => {
        const isActive = activeHref === href;
        return (
          <Link
            key={href}
            href={href}
            className={`bottom-nav-tab${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={24} weight={isActive ? "fill" : "light"} />
            <span className="bottom-nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function BottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavInner />
    </Suspense>
  );
}
