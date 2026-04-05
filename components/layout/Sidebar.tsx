"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Briefcase,
  CalendarDots,
  ChatCircleDots,
  House,
  MagnifyingGlass,
  UserCircle,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

const navItems: { label: string; href: string; Icon: PhosphorIcon; match: string[] }[] = [
  { label: "Home", href: "/home", Icon: House, match: ["/home", "/communities", "/groups"] },
  { label: "Discover", href: "/discover", Icon: MagnifyingGlass, match: ["/discover", "/explore"] },
  { label: "My Schedule", href: "/schedule", Icon: CalendarDots, match: ["/schedule"] },
  { label: "Bookings", href: "/bookings", Icon: Briefcase, match: ["/bookings"] },
  { label: "Inbox", href: "/inbox", Icon: ChatCircleDots, match: ["/inbox"] },
  { label: "Notifications", href: "/notifications", Icon: Bell, match: ["/notifications"] },
  { label: "Profile", href: "/profile", Icon: UserCircle, match: ["/profile"] },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(match: string[]) {
    return match.some((m) => pathname === m || pathname.startsWith(m + "/"));
  }

  return (
    <aside className="sidebar">
      <Link href="/home" className="sidebar-brand">
        DOGGO
      </Link>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map(({ label, href, Icon, match }) => {
          const active = isActive(match);
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-nav-item${active ? " sidebar-nav-item--active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={24} weight={active ? "fill" : "light"} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
