"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonIcon } from "@/components/ui/ButtonIcon";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { NotificationsPanel } from "@/components/ui/NotificationsPanel";
import { useNotifications } from "@/contexts/NotificationsContext";
import {
  Bell,
  CalendarDots,
  ChatCircleDots,
  DotsThree,
  MagnifyingGlass,
  Sparkle,
} from "@phosphor-icons/react";

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

function LoggedNavLinks() {
  const { unreadCount } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifWrapRef = useRef<HTMLDivElement>(null);

  return (
    <div className="app-nav-logged" aria-label="Logged-in navigation">
      <div className="app-nav-main-links">
        <ButtonAction
          href="/explore/results"
          variant="tertiary"
          size="md"
          leftIcon={<MagnifyingGlass size={24} weight="light" />}
          className="app-nav-action-btn"
        >
          Search
        </ButtonAction>
        <ButtonAction
          href="/signup/start"
          variant="tertiary"
          size="md"
          leftIcon={<Sparkle size={24} weight="light" />}
          className="app-nav-action-btn"
        >
          Offer Care
        </ButtonAction>
      </div>
      <div className="app-nav-icon-row">
        {/* Bell — toggles NotificationsPanel */}
        <div className="app-nav-notif-wrap" ref={notifWrapRef}>
          <ButtonIcon
            label="Notifications"
            showBadge={unreadCount > 0}
            badgeCount={unreadCount}
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell size={32} weight={notifOpen ? "fill" : "light"} />
          </ButtonIcon>
          <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} wrapperRef={notifWrapRef} />
        </div>
        <ButtonIcon label="Messages" href="/inbox">
          <ChatCircleDots size={32} weight="light" />
        </ButtonIcon>
        <ButtonIcon label="Bookings" href="/bookings">
          <CalendarDots size={32} weight="light" />
        </ButtonIcon>
        <Link
          href="/profile"
          className="app-nav-avatar-trigger"
          aria-label="Open menu"
          title="Menu"
        >
          <img
            className="app-nav-avatar-img"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
            alt="Menu"
          />
        </Link>
      </div>
    </div>
  );
}

export function AppNav() {
  const pathname = usePathname();
  const loggedRoutes = ["/explore", "/inbox", "/bookings", "/profile"];
  const mode = loggedRoutes.some((r) => pathname.startsWith(r)) ? "logged" : "guest";
  const isSignupRoute = pathname.startsWith("/signup");
  const isStyleguideRoute = pathname.startsWith("/styleguide");
  const isContainedNav =
    pathname === "/" ||
    pathname === "/signin" ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/styleguide");
  const navContent = (
    <>
      <div className="app-nav-brand-wrap">
        <Link href="/" className="app-nav-brand">
          DOGGO
        </Link>
      </div>
      <div className="app-nav-mode">
        {mode === "guest" ? (
          isSignupRoute || isStyleguideRoute ? (
            <SignupNavLinks />
          ) : (
            <GuestNavLinks />
          )
        ) : (
          <LoggedNavLinks />
        )}
      </div>
    </>
  );

  return (
    <header
      className={`app-nav-shell${
        isSignupRoute ? " app-nav-shell--signup" : ""
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
