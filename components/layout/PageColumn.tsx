"use client";

import type { ReactNode } from "react";

interface PageColumnProps {
  /** Page heading shown above the panel (hidden on mobile — AppNav handles it) */
  title?: string;
  /** Action button in the header row (e.g. "Post", "Create Community") */
  headerAction?: ReactNode;
  /** Hide the header row entirely — for detail pages that render their own header inside the panel */
  hideHeader?: boolean;
  /** Content rendered between the header and the panel (e.g. DetailHeader for drill-down pages) */
  abovePanel?: ReactNode;
  /** Panel content: tabs, lists, cards, etc. */
  children: ReactNode;
  /** Additional class on the outer wrapper */
  className?: string;
}

/**
 * Canonical single-column layout used by every logged-in page.
 *
 * Renders a centered 640px column with an optional page header above
 * a rounded panel card. The panel scrolls its content.
 */
export function PageColumn({
  title,
  headerAction,
  hideHeader = false,
  abovePanel,
  children,
  className,
}: PageColumnProps) {
  return (
    <div className={`page-column${className ? ` ${className}` : ""}`}>
      {!hideHeader && title && (
        <div className="page-column-header">
          <h1 className="page-column-title">{title}</h1>
          {headerAction && (
            <div className="page-column-action">{headerAction}</div>
          )}
        </div>
      )}

      {abovePanel}

      <div className="page-column-panel">{children}</div>
    </div>
  );
}
