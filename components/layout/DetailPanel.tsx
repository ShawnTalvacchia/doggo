"use client";

import { type ReactNode } from "react";

interface DetailPanelProps {
  /** Optional header area (title, back button, actions) */
  header?: ReactNode;
  /** The scrollable main content */
  children: ReactNode;
  /** Optional fixed footer (action bar, buttons) */
  footer?: ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Reusable right-panel wrapper for master-detail layouts.
 * Provides an optional header, scrollable content area, and optional fixed footer.
 *
 * Used by: Home (feed), My Schedule (meet detail), Inbox (conversation), Discover (results + map).
 */
export function DetailPanel({
  header,
  children,
  footer,
  className,
}: DetailPanelProps) {
  return (
    <div className={`detail-panel${className ? ` ${className}` : ""}`}>
      {header && <div className="detail-panel-header">{header}</div>}
      <div className="detail-panel-scroll">{children}</div>
      {footer && <div className="detail-panel-footer">{footer}</div>}
    </div>
  );
}
