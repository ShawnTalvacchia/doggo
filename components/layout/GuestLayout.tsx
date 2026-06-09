"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LoggedInShell } from "./LoggedInShell";

export function GuestLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGuestRoute =
    pathname === "/signin" || pathname.startsWith("/signup");
  const isSignupRoute = pathname.startsWith("/signup");

  // Standalone routes render without AppNav, Sidebar, or BottomNav —
  // they're their own little world: the landing page (the demo launcher),
  // the unlock gate, and the /pages dev hub.
  const isStandaloneRoute =
    pathname === "/" ||
    pathname === "/unlock" ||
    pathname.startsWith("/pages");

  // Styleguide gets AppNav at the top + its own sg-layout chrome below,
  // but no Sidebar and no BottomNav. styleguide.css computes content
  // height as `calc(100vh - var(--nav-height))` and expects AppNav to be
  // the only outer chrome. Without this branch the route fell through to
  // the logged-in case below and rendered a second logo via Sidebar.
  const isStyleguideRoute = pathname.startsWith("/styleguide");

  useEffect(() => {
    document.body.classList.toggle("guest-route", isGuestRoute);
    document.body.classList.toggle("standalone-route", isStandaloneRoute);
    return () => {
      document.body.classList.remove("guest-route");
      document.body.classList.remove("standalone-route");
    };
  }, [isGuestRoute, isStandaloneRoute]);

  const arr = React.Children.toArray(children);
  const [nav, mainContent, bottom] = arr;

  if (isStandaloneRoute) {
    // Pure content — no global chrome.
    return <>{mainContent}</>;
  }

  if (isStyleguideRoute) {
    // AppNav at top + styleguide layout below. No Sidebar (that's the
    // duplicate-logo bug), no BottomNav. Bottom-nav arg dropped silently.
    return (
      <>
        {nav}
        {mainContent}
      </>
    );
  }

  if (!isGuestRoute) {
    // Logged-in: sidebar (desktop) + top bar (mobile) + bottom nav (mobile)
    return (
      <>
        {nav}
        <LoggedInShell>{mainContent}</LoggedInShell>
        {bottom}
      </>
    );
  }

  return (
    <div className="guest-layout">
      {nav}
      <main className={`guest-main${isSignupRoute ? " guest-main--noscroll" : ""}`}>
        {mainContent}
      </main>
      {bottom}
    </div>
  );
}
