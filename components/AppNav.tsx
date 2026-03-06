"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonIcon } from "@/components/ui/ButtonIcon";
import { ButtonAction } from "@/components/ui/ButtonAction";
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
      <Link href="/signin" className="app-nav-link">
        Sign In
      </Link>
      <Link href="/signup/start" className="app-nav-link app-nav-link--primary">
        Sign Up
      </Link>
      <Link href="/profile" className="app-nav-dev-trigger" aria-label="Open menu" title="Menu">
        ···
      </Link>
    </div>
  );
}

function SignupNavLinks() {
  return (
    <div className="app-nav-right" aria-label="Signup navigation">
      <Link
        href="/profile"
        className="app-nav-dev-trigger"
        aria-label="Open menu"
        title="Menu"
      >
        <DotsThree size={24} weight="bold" />
      </Link>
    </div>
  );
}

function LoggedNavLinks() {
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
        <ButtonIcon label="Notifications" showBadge>
          <Bell size={32} weight="light" />
        </ButtonIcon>
        <ButtonIcon label="Messages">
          <ChatCircleDots size={32} weight="light" />
        </ButtonIcon>
        <ButtonIcon label="Calendar">
          <CalendarDots size={32} weight="light" />
        </ButtonIcon>
        <Link href="/profile" className="app-nav-avatar-trigger" aria-label="Open menu" title="Menu">
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
  const mode = pathname.startsWith("/explore") ? "logged" : "guest";
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
        <Link
          href="/"
          className="app-nav-brand"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          DOGGO
        </Link>
      </div>
      <div className="app-nav-mode">
        {mode === "guest" ? (isSignupRoute || isStyleguideRoute ? <SignupNavLinks /> : <GuestNavLinks />) : <LoggedNavLinks />}
      </div>
    </>
  );

  return (
    <header
      className={`app-nav-shell${
        isSignupRoute ? " app-nav-shell--signup" : ""
      }${isStyleguideRoute ? " app-nav-shell--styleguide" : ""}`}
    >
      <nav className={`app-nav${isContainedNav ? " app-nav--contained" : ""}`}>
        {isContainedNav ? (
          <div className="app-nav-inner">{navContent}</div>
        ) : (
          navContent
        )}
      </nav>
    </header>
  );
}
