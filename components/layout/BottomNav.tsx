"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Briefcase,
  CalendarDots,
  House,
  MagnifyingGlass,
  UsersThree,
} from "@phosphor-icons/react";

const tabs = [
  { label: "Home", href: "/home", Icon: House },
  { label: "Groups", href: "/communities", Icon: UsersThree },
  { label: "Discover", href: "/discover", Icon: MagnifyingGlass },
  { label: "My Schedule", href: "/schedule", Icon: CalendarDots },
  { label: "Bookings", href: "/bookings", Icon: Briefcase },
] as const;

/** Routes that show the bottom nav (logged-in hub pages) */
const hubPrefixes = ["/home", "/communities", "/groups", "/discover", "/schedule", "/bookings", "/inbox", "/profile"];

/** Routes that are detail pages — hide bottom nav even though they're logged-in */
const detailPatterns = [
  /^\/communities\/.+/,   // group detail, create
  /^\/groups\/.+/,        // group detail (legacy)
  /^\/discover\/profile/, // provider profile
  /^\/meets\/.+/,         // meet detail, create
  /^\/inbox\/.+/,         // message thread
  /^\/bookings\/.+/,      // booking detail, checkout
  /^\/profile\/.+/,       // other user's profile
  /^\/posts\/.+/,         // create post
  /^\/explore\/.*/,       // legacy explore routes
  /^\/connect\/.+/,       // share link
];

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Only show on logged-in routes
  const isLoggedRoute = hubPrefixes.some((p) =>
    pathname === p || pathname.startsWith(p + "/")
  );
  if (!isLoggedRoute) return null;

  // Hide on styleguide
  if (pathname.startsWith("/styleguide")) return null;

  // Hide on detail pages
  if (detailPatterns.some((pattern) => pattern.test(pathname))) return null;

  // Determine active tab
  const activeHref = pathname.startsWith("/home")
    ? "/home"
    : pathname.startsWith("/communities") || pathname.startsWith("/groups")
    ? "/communities"
    : pathname.startsWith("/discover") || pathname.startsWith("/explore")
    ? "/discover"
    : pathname.startsWith("/schedule")
    ? "/schedule"
    : pathname.startsWith("/bookings")
    ? "/bookings"
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
            <Icon size={24} weight={isActive ? "fill" : "regular"} />
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
