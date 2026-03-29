"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  UsersThree,
  CalendarDots,
  ChatCircleDots,
  MagnifyingGlass,
  UserCircle,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

const navItems: { label: string; href: string; Icon: PhosphorIcon; match: string[] }[] = [
  { label: "Home", href: "/home", Icon: House, match: ["/home"] },
  { label: "Groups", href: "/communities", Icon: UsersThree, match: ["/communities", "/groups"] },
  { label: "Activities", href: "/activity", Icon: CalendarDots, match: ["/activity", "/meets", "/schedule", "/bookings"] },
  { label: "Inbox", href: "/inbox", Icon: ChatCircleDots, match: ["/inbox"] },
  { label: "Find Care", href: "/explore/results", Icon: MagnifyingGlass, match: ["/explore"] },
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
              <Icon size={32} weight={active ? "fill" : "light"} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
