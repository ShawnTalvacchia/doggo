"use client";

import { type ReactNode } from "react";

interface ListPanelProps {
  /** Optional header content (title, action buttons) */
  header?: ReactNode;
  /** Optional search bar */
  search?: ReactNode;
  /** Optional filter tabs or pill group below search */
  filters?: ReactNode;
  /** The scrollable list content */
  children: ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Reusable left-panel wrapper for master-detail layouts.
 * Provides optional search, filter tabs, and a scrollable list area.
 *
 * Used by: Home (groups list), My Schedule (meets list), Inbox (conversations), Discover results.
 */
export function ListPanel({
  header,
  search,
  filters,
  children,
  className,
}: ListPanelProps) {
  return (
    <div className={`list-panel${className ? ` ${className}` : ""}`}>
      {header && <div className="list-panel-header">{header}</div>}
      {search && <div className="list-panel-search">{search}</div>}
      {filters && <div className="list-panel-filters">{filters}</div>}
      <div className="list-panel-scroll">{children}</div>
    </div>
  );
}
