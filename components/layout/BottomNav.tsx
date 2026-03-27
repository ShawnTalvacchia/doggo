"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ChatCircleDots,
  Compass,
  House,
  UserCircle,
  UsersThree,
} from "@phosphor-icons/react";

const tabs = [
  { label: "Home", href: "/home", Icon: House },
  { label: "Communities", href: "/communities", Icon: UsersThree },
  { label: "Activity", href: "/activity", Icon: Compass },
  { label: "Inbox", href: "/inbox", Icon: ChatCircleDots },
  { label: "Profile", href: "/profile", Icon: UserCircle },
] as const;

/** Routes that show the bottom nav (logged-in experience) */
const loggedPrefixes = ["/home", "/communities", "/groups", "/activity", "/meets", "/schedule", "/explore", "/inbox", "/bookings", "/profile"];

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLoggedMobileRoute = loggedPrefixes.some((p) =>
    pathname === p || pathname.startsWith(p + "/")
  );

  // Bottom nav is for logged-in experience only.
  if (!isLoggedMobileRoute) return null;

  // Hide on styleguide (uses top nav only at all viewports)
  if (pathname.startsWith("/styleguide")) return null;

  // Hide on provider profile page (has its own back nav)
  if (pathname.startsWith("/explore/profile")) return null;

  // Hide on individual inbox thread page (has its own back nav)
  if (pathname.match(/^\/inbox\/.+/)) return null;

  // Hide once user has selected a service (they're in the sub-flow)
  if (pathname === "/explore/results" && searchParams.get("service")) return null;

  // Determine active tab
  const activeHref = pathname.startsWith("/home")
    ? "/home"
    : pathname.startsWith("/communities") || pathname.startsWith("/groups")
    ? "/communities"
    : pathname.startsWith("/activity") || pathname.startsWith("/meets") || pathname.startsWith("/schedule") || pathname.startsWith("/bookings")
    ? "/activity"
    : pathname.startsWith("/inbox")
    ? "/inbox"
    : pathname.startsWith("/explore")
    ? "/home"
    : pathname.startsWith("/profile")
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
