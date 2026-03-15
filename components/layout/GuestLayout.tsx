"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function GuestLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGuestRoute = pathname === "/" || pathname === "/signin" || pathname.startsWith("/signup");
  const isSignupRoute = pathname.startsWith("/signup");

  useEffect(() => {
    document.body.classList.toggle("guest-route", isGuestRoute);
    return () => document.body.classList.remove("guest-route");
  }, [isGuestRoute]);

  const arr = React.Children.toArray(children);
  const [nav, mainContent, bottom] = arr;

  if (!isGuestRoute) {
    return <>{children}</>;
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
