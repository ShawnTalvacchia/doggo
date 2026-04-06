"use client";

import { type ReactNode } from "react";

interface PanelBodyProps {
  /** The scrollable panel content — LayoutSections, LayoutLists, and a Spacer */
  children: ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Scrollable body area inside a panel.
 * Fills remaining vertical space and provides the only scroll container.
 *
 * Usage:
 *   <PanelBody>
 *     <LayoutSection py="lg">…padded content…</LayoutSection>
 *     <LayoutList>…edge-to-edge cards…</LayoutList>
 *     <Spacer />
 *   </PanelBody>
 */
export function PanelBody({ children, className }: PanelBodyProps) {
  return (
    <div className={`panel-body${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
