"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { LoggedInShell } from "./LoggedInShell";

export function GuestLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGuestRoute =
    pathname === "/" || pathname === "/signin" || pathname.startsWith("/signup");
  const isSignupRoute = pathname.startsWith("/signup");

  // Standalone routes render without AppNav, Sidebar, or BottomNav —
  // they're their own little world (unlock gate + demo hub).
  const isStandaloneRoute =
    pathname === "/unlock" || pathname.startsWith("/pages");

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
