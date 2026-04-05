"use client";

import { Sidebar } from "./Sidebar";
import { useScrollHideNav } from "@/hooks/useScrollHideNav";

export function LoggedInShell({ children }: { children: React.ReactNode }) {
  useScrollHideNav();

  return (
    <div className="logged-shell">
      <Sidebar />
      <div className="logged-shell-main">
        {children}
      </div>
    </div>
  );
}
