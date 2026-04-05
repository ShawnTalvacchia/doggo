"use client";

import { type ReactNode } from "react";

export type MobileView = "list" | "detail" | "info";

interface MasterDetailShellProps {
  /** Content for the left (list) panel */
  listPanel: ReactNode;
  /** Content for the main (detail) panel */
  detailPanel?: ReactNode;
  /** Content for the optional right (info) panel — e.g. Inbox contact info */
  infoPanel?: ReactNode;
  /** Which panel to show on mobile (desktop always shows all) */
  mobileView?: MobileView;
  /** Additional class names on the outer wrapper */
  className?: string;
}

/**
 * Reusable two-or-three column layout used across Home, My Schedule, Inbox, and Discover.
 *
 * Desktop: side-by-side panels (list | detail | optional info).
 * Mobile: only the active panel is visible, controlled by `mobileView`.
 */
export function MasterDetailShell({
  listPanel,
  detailPanel,
  infoPanel,
  mobileView = "list",
  className,
}: MasterDetailShellProps) {
  const hasInfo = !!infoPanel;

  return (
    <div
      className={`md-shell${hasInfo ? " md-shell--three" : ""}${className ? ` ${className}` : ""}`}
      data-mobile-view={mobileView}
    >
      <div className={`md-shell-list${mobileView === "list" ? " md-shell-panel--active" : ""}`}>
        {listPanel}
      </div>

      {detailPanel && (
        <div className={`md-shell-detail${mobileView === "detail" ? " md-shell-panel--active" : ""}`}>
          {detailPanel}
        </div>
      )}

      {infoPanel && (
        <div className={`md-shell-info${mobileView === "info" ? " md-shell-panel--active" : ""}`}>
          {infoPanel}
        </div>
      )}
    </div>
  );
}
