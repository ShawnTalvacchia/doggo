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
  ChatCircleDots,
  DotsThree,
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
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifWrapRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Communities", href: "/communities" },
    { label: "Activity", href: "/activity" },
    { label: "Find Care", href: "/explore/results" },
  ];

  return (
    <div className="app-nav-logged" aria-label="Logged-in navigation">
      {/* Desktop links: Home | Meets | Schedule | Find Care */}
      <div className="app-nav-main-links">
        {navLinks.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`app-nav-centre-link${pathname.startsWith(href) ? " app-nav-centre-link--active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right icon row: Bell, Inbox, Avatar */}
      <div className="app-nav-icon-row">
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

const loggedRoutes = ["/home", "/communities", "/groups", "/activity", "/meets", "/schedule", "/explore", "/inbox", "/bookings", "/profile"];

export function AppNav() {
  const pathname = usePathname();
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
        <Link href={mode === "logged" ? "/home" : "/"} className="app-nav-brand">
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
