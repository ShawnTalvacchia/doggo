"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
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
import { useCurrentUser, useCurrentUserId, useOperatorShelterId } from "@/hooks/useCurrentUser";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import { countUnreadConversations } from "@/lib/conversationUtils";
import { getShelterById } from "@/lib/mockShelters";
import { SidebarActiveSessionLink } from "@/components/bookings/SidebarActiveSessionLink";

type NavItem = { label: string; href: string; Icon: PhosphorIcon; match: string[] };

const navItems: NavItem[] = [
  { label: "Community", href: "/home", Icon: Users, match: ["/home", "/communities", "/groups"] },
  { label: "Discover", href: "/discover", Icon: MagnifyingGlass, match: ["/discover", "/explore"] },
  { label: "My Schedule", href: "/schedule", Icon: CalendarDots, match: ["/schedule"] },
  { label: "Bookings", href: "/bookings", Icon: Briefcase, match: ["/bookings"] },
  { label: "Inbox", href: "/inbox", Icon: ChatCircleDots, match: ["/inbox"] },
  { label: "Notifications", href: "/notifications", Icon: Bell, match: ["/notifications"] },
  { label: "Profile", href: "/profile", Icon: UserCircle, match: ["/profile"] },
];

/**
 * Operator (shelter) nav — Phase 2 "The Shelter's Side." The app shell adapts
 * when the shelter-operator persona is active: the hub (the shelter page),
 * Schedule (walks — replaces My Schedule), Applications (the walker queue —
 * replaces Bookings), Inbox (stub), Notifications, Profile. Community + Discover
 * drop (consumer concepts a shelter doesn't use).
 */
function operatorNavItems(shelterId: string, shelterName: string): NavItem[] {
  return [
    { label: shelterName, href: `/shelters/${shelterId}`, Icon: House, match: ["/shelters"] },
    { label: "Schedule", href: "/schedule", Icon: CalendarDots, match: ["/schedule"] },
    { label: "Applications", href: "/bookings", Icon: ClipboardText, match: ["/bookings"] },
    { label: "Inbox", href: "/inbox", Icon: ChatCircleDots, match: ["/inbox"] },
    { label: "Notifications", href: "/notifications", Icon: Bell, match: ["/notifications"] },
    { label: "Profile", href: "/profile", Icon: UserCircle, match: ["/profile"] },
  ];
}

export function Sidebar() {
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const { unreadCount } = useNotifications();
  const { conversations } = useConversations();
  const currentUserId = useCurrentUserId();
  // Operator mode swaps the whole nav for the shelter's back-office rail.
  const operatorShelterId = useOperatorShelterId();
  const operatorShelter = operatorShelterId ? getShelterById(operatorShelterId) : undefined;
  const items = operatorShelter
    ? operatorNavItems(operatorShelter.id, operatorShelter.name)
    : navItems;
  // Inbox badge count — viewer-aware via `countUnreadConversations` so
  // it matches the dots displayed inside `/inbox` AND the mobile-nav
  // badge. Earlier inline formula (`c.unreadCount > 0`) used the
  // owner-centric counter, which diverged on provider-side viewers.
  // 2026-05-08.
  const unreadInbox = countUnreadConversations(conversations, currentUserId);

  function isActive(match: string[]) {
    return match.some((m) => pathname === m || pathname.startsWith(m + "/"));
  }

  // /profile/[userId] is someone else's profile — don't highlight any nav item
  const isOtherProfile = pathname.startsWith("/profile/");

  return (
    <aside className="sidebar">
      {/* Logo routes back to the demo's front door (the landing page),
          NOT to /home. The Community tab in the nav below handles the
          home-feed link — the logo is the way out of the persona /
          back to the launcher. */}
      <Link href="/" className="sidebar-brand">
        <img src="/logo.svg" alt="Doggo" />
      </Link>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {items.map(({ label, href, Icon, match }) => {
          const active = isOtherProfile ? false : isActive(match);
          const isProfileTab = href === "/profile";
          const showAvatar = isProfileTab && !!currentUser.avatarUrl;
          // Unread-count badge: Notifications + Inbox rows mirror the mobile
          // icon-row badges, but sit next to the text label since sidebar
          // icons are smaller (22px) and a corner pip would compete
          // visually. Inbox & Notifications follow-up, 2026-05-08.
          const count =
            href === "/notifications"
              ? unreadCount
              : href === "/inbox"
                ? unreadInbox
                : 0;
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-nav-item${active ? " sidebar-nav-item--active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {showAvatar ? (
                <img
                  src={currentUser.avatarUrl}
                  alt=""
                  className="sidebar-nav-avatar"
                />
              ) : (
                <Icon size={22} weight={active ? "fill" : "light"} />
              )}
              {label}
              {count > 0 && (
                <span
                  className="sidebar-nav-count"
                  aria-label={`${count} unread`}
                >
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sits right below the regular nav items with a top-border
          divider when there's an active session for the viewer; absent
          state leaves the regular nav items in their normal positions
          (the card just doesn't render). Bottom-pinning was harder to
          notice — discoverability matters more than positional
          stability here. */}
      <SidebarActiveSessionLink />
    </aside>
  );
}
