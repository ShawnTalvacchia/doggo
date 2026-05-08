"use client";

import { Sidebar } from "./Sidebar";
import { ActiveSessionBanner } from "@/components/bookings/ActiveSessionBanner";
import { useScrollHideNav } from "@/hooks/useScrollHideNav";

export function LoggedInShell({ children }: { children: React.ReactNode }) {
  useScrollHideNav();

  return (
    <div className="logged-shell">
      <Sidebar />
      <div className="logged-shell-main">
        {/* Active-session banner — sticks to the top of the scrollable
            content area when a session is in_progress for the viewer.
            Sits below the fixed AppNav (mobile) / at the top of the
            right column (desktop). Same component on both viewports —
            sticky positioning anchors it to the scroll container. */}
        <ActiveSessionBanner />
        {children}
      </div>
    </div>
  );
}
