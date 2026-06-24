"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Briefcase,
  CalendarDots,
  ChatCircleDots,
  ClipboardText,
  House,
  Users,
  MagnifyingGlass,
  UserCircle,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { useCurrentUser, useOperatorShelterId } from "@/hooks/useCurrentUser";
import { getShelterById } from "@/lib/mockShelters";

type BottomTab = { label: string; href: string; Icon: PhosphorIcon };

const tabs: readonly BottomTab[] = [
  { label: "Community", href: "/home", Icon: Users },
  { label: "Discover", href: "/discover", Icon: MagnifyingGlass },
  { label: "My Schedule", href: "/schedule", Icon: CalendarDots },
  { label: "Bookings", href: "/bookings", Icon: Briefcase },
  { label: "Profile", href: "/profile", Icon: UserCircle },
];

/** Operator (shelter) mobile tabs — Phase 2 "The Shelter's Side." */
function operatorTabs(shelterId: string, shelterName: string): BottomTab[] {
  return [
    { label: shelterName, href: `/shelters/${shelterId}`, Icon: House },
    { label: "Schedule", href: "/schedule", Icon: CalendarDots },
    { label: "Applications", href: "/bookings", Icon: ClipboardText },
    { label: "Inbox", href: "/inbox", Icon: ChatCircleDots },
    { label: "Profile", href: "/profile", Icon: UserCircle },
  ];
}

/**
 * Bottom nav shows ONLY on main hub routes (the 5 tab destinations + top-level
 * sub-sections). All detail/subpages hide it — users navigate back via the
 * header back button or native browser swipe-back gesture.
 *
 * Each route's `(\?.*)?` allows query params so tab state inside a hub page
 * (e.g. `/schedule?view=meets`, `/profile?tab=posts`, `/bookings?tab=services`)
 * still counts as a hub route. Without this, picking a sub-tab inside a hub
 * page hides the bottom nav — which is wrong, the page is still first-layer.
 */
const hubRoutes = [
  /^\/home(\?.*)?$/,
  /^\/discover(\?.*)?$/,
  /^\/schedule(\?.*)?$/,
  /^\/bookings(\?.*)?$/,
  /^\/profile(\?.*)?$/,
  /^\/inbox(\?.*)?$/,
  /^\/notifications(\?.*)?$/,
];

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUser = useCurrentUser();
  // Operator mode swaps the tabs for the shelter back-office set and makes the
  // shelter hub page a hub route (it's a detail page for everyone else).
  const operatorShelterId = useOperatorShelterId();
  const operatorShelter = operatorShelterId ? getShelterById(operatorShelterId) : undefined;
  const navTabs = operatorShelter
    ? operatorTabs(operatorShelter.id, operatorShelter.name)
    : tabs;

  // Build the full path with search params for matching
  const search = searchParams.toString();
  const fullPath = search ? `${pathname}?${search}` : pathname;

  // Only show on hub routes — all subpages/detail pages hide bottom nav. In
  // operator mode the shelter hub page counts as a hub route.
  const routes = operatorShelter
    ? [...hubRoutes, /^\/shelters\/[^/]+(\?.*)?$/]
    : hubRoutes;
  const isHubRoute = routes.some((pattern) => pattern.test(fullPath));
  if (!isHubRoute) return null;

  // Determine active tab. /profile/[userId] is someone else's profile — don't
  // highlight any nav item. Match each tab by its route family.
  const activeHref = pathname.startsWith("/profile/")
    ? null
    : (navTabs.find((t) => {
        if (t.href.startsWith("/shelters")) return pathname.startsWith("/shelters");
        if (t.href === "/home")
          return (
            pathname.startsWith("/home") ||
            pathname.startsWith("/communities") ||
            pathname.startsWith("/groups")
          );
        if (t.href === "/discover")
          return pathname.startsWith("/discover") || pathname.startsWith("/explore");
        if (t.href === "/profile") return pathname === "/profile";
        return pathname.startsWith(t.href);
      })?.href ?? pathname);

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navTabs.map(({ label, href, Icon }) => {
        const isActive = activeHref === href;
        const isProfileTab = href === "/profile";
        const showAvatar = isProfileTab && !!currentUser.avatarUrl;
        return (
          <Link
            key={href}
            href={href}
            className={`bottom-nav-tab${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {showAvatar ? (
              <img
                src={currentUser.avatarUrl}
                alt=""
                className="bottom-nav-avatar"
              />
            ) : (
              <Icon size={24} weight={isActive ? "fill" : "light"} />
            )}
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
