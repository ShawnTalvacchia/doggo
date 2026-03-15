"use client";

import type { ReactNode } from "react";

type FilterPanelShellProps = {
  /**
   * Sticky header slot — service trigger button, panel title + close button, etc.
   * Renders at the top; the body scrolls beneath it.
   */
  header?: ReactNode;
  /**
   * Scrollable body slot — filter fields, content lists, etc.
   */
  children: ReactNode;
  /**
   * Sticky footer slot — primary action button, apply/reset bar, etc.
   * Renders at the bottom, outside the scroll area. Optional.
   */
  footer?: ReactNode;
  /** Additional class on the shell wrapper (for size/bg overrides per context). */
  className?: string;
};

/**
 * FilterPanelShell
 *
 * Layout-only shell for filter / detail panels.
 * Provides a three-zone flex column: sticky header → scrollable body → sticky footer.
 *
 * Usage:
 *   <FilterPanelShell
 *     header={<div className="filter-header"><ButtonAction …/></div>}
 *     footer={<ButtonAction variant="primary" …>View Results</ButtonAction>}
 *   >
 *     <FilterBody … />
 *   </FilterPanelShell>
 */
export function FilterPanelShell({ header, children, footer, className }: FilterPanelShellProps) {
  const cls = ["filter-panel-shell", className].filter(Boolean).join(" ");
  return (
    <div className={cls}>
      {header != null && <div className="filter-panel-shell-header">{header}</div>}
      <div className="filter-panel-shell-body">{children}</div>
      {footer != null && <div className="filter-panel-shell-footer">{footer}</div>}
    </div>
  );
}
