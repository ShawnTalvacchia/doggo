"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonIcon } from "@/components/ui/ButtonIcon";
import { NotificationsPanel } from "@/components/ui/NotificationsPanel";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useConversations } from "@/contexts/ConversationsContext";
import {
  ArrowLeft,
  Bell,
  ChatCircleDots,
  DotsThree,
} from "@phosphor-icons/react";
import { AddPostIcon } from "@/components/icons/AddPostIcon";

function GuestNavLinks() {
  return (
    <div className="app-nav-right" aria-label="Guest navigation">
      <Link href="/signin" className="app-nav-link app-nav-link--hide-mobile">
        Sign In
      </Link>
      <Link href="/signup/start" className="app-nav-link app-nav-link--primary">
        Sign Up
      </Link>
      <Link href="/pages" className="app-nav-dev-trigger" aria-label="Open menu" title="Menu">
        ···
      </Link>
    </div>
  );
}

function SignupNavLinks() {
  return (
    <div className="app-nav-right" aria-label="Signup navigation">
      <Link href="/pages" className="app-nav-dev-trigger" aria-label="Open menu" title="Menu">
        <DotsThree size={24} weight="bold" />
      </Link>
    </div>
  );
}

function LoggedNavLinks({ hideCreate = false }: { hideCreate?: boolean }) {
  const { unreadCount } = useNotifications();
  const { conversations } = useConversations();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifWrapRef = useRef<HTMLDivElement>(null);

  // Count unread conversations for inbox badge
  const unreadInbox = conversations.filter((c) => c.unreadCount > 0).length;

  return (
    <div className="app-nav-logged" aria-label="Logged-in navigation">
      {/* Right icon row: Create, Notifications, Inbox */}
      <div className="app-nav-icon-row">
        {!hideCreate && (
          <ButtonIcon label="Create" href="/posts/create">
            <AddPostIcon size={28} />
          </ButtonIcon>
        )}
        <div className="app-nav-notif-wrap" ref={notifWrapRef}>
          <ButtonIcon
            label="Notifications"
            showBadge={unreadCount > 0}
            badgeCount={unreadCount}
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell size={28} weight={notifOpen ? "fill" : "light"} />
          </ButtonIcon>
          <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} wrapperRef={notifWrapRef} />
        </div>
        <ButtonIcon label="Messages" href="/inbox" showBadge={unreadInbox > 0} badgeCount={unreadInbox}>
          <ChatCircleDots size={28} weight="light" />
        </ButtonIcon>
      </div>
    </div>
  );
}

const loggedRoutes = ["/home", "/communities", "/groups", "/activity", "/discover", "/meets", "/schedule", "/explore", "/inbox", "/notifications", "/bookings", "/profile"];

function getDiscoverTitle(pathname: string) {
  if (pathname.startsWith("/discover/care")) return "Dog Care";
  if (pathname.startsWith("/discover/meets")) return "Meets";
  if (pathname.startsWith("/discover/groups")) return "Groups";
  return "Discover";
}

export function AppNav() {
  const pathname = usePathname();
  const mode = loggedRoutes.some((r) => pathname.startsWith(r)) ? "logged" : "guest";
  const isSignupRoute = pathname.startsWith("/signup");
  const isStyleguideRoute = pathname.startsWith("/styleguide");
  const isDiscoverRoute = pathname.startsWith("/discover");
  const isDiscoverSubpage = isDiscoverRoute && pathname !== "/discover";
  const isContainedNav =
    pathname === "/" ||
    pathname === "/signin" ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/styleguide");
  const navContent = (
    <>
      <div className="app-nav-brand-wrap">
        <Link href={mode === "logged" ? "/home" : "/"} className={`app-nav-brand${isDiscoverRoute ? " app-nav-brand--hide-mobile" : ""}`}>
          DOGGO
        </Link>
        {isDiscoverRoute && (
          <div className="app-nav-page-title">
            {isDiscoverSubpage && (
              <Link href="/discover" className="app-nav-page-title-back">
                <ArrowLeft size={20} weight="regular" />
              </Link>
            )}
            <span>{getDiscoverTitle(pathname)}</span>
          </div>
        )}
      </div>
      <div className="app-nav-mode">
        {mode === "guest" ? (
          isSignupRoute || isStyleguideRoute ? (
            <SignupNavLinks />
          ) : (
            <GuestNavLinks />
          )
        ) : (
          <LoggedNavLinks hideCreate={isDiscoverRoute} />
        )}
      </div>
    </>
  );

  return (
    <header
      className={`app-nav-shell${
        mode === "logged" ? " app-nav-shell--logged" : ""
      }${isSignupRoute ? " app-nav-shell--signup" : ""
      }${isStyleguideRoute ? " app-nav-shell--styleguide" : ""}`}
    >
      <nav
        className={`app-nav${isContainedNav ? " app-nav--contained" : ""}${mode === "logged" ? " app-nav--logged" : ""}`}
      >
        {isContainedNav ? <div className="app-nav-inner">{navContent}</div> : navContent}
      </nav>
    </header>
  );
}
