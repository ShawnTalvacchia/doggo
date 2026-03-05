"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CalendarDots, ChatCircleDots, MagnifyingGlass, UserCircle } from "@phosphor-icons/react";

const tabs = [
  { label: "Explore", href: "/explore/results", Icon: MagnifyingGlass },
  { label: "Calendar", href: "/calendar", Icon: CalendarDots },
  { label: "Inbox", href: "/inbox", Icon: ChatCircleDots },
  { label: "Profile", href: "/profile", Icon: UserCircle },
] as const;

function BottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Bottom nav is for logged-in explore experience only.
  if (!pathname.startsWith("/explore")) return null;

  // Hide on styleguide (uses top nav only at all viewports)
  if (pathname.startsWith("/styleguide")) return null;

  // Hide on provider profile page (has its own back nav)
  if (pathname.startsWith("/explore/profile")) return null;

  // Hide once user has selected a service (they're in the sub-flow)
  if (pathname === "/explore/results" && searchParams.get("service")) return null;

  // Determine active tab: treat all /explore/* as the Explore tab
  const activeHref = pathname.startsWith("/explore") ? "/explore/results" : pathname;

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
