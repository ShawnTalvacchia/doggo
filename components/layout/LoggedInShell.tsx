"use client";

import { Sidebar } from "./Sidebar";

export function LoggedInShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="logged-shell">
      <Sidebar />
      <div className="logged-shell-main">
        {children}
      </div>
    </div>
  );
}
