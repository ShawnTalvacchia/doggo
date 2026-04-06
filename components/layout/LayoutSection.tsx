"use client";

import { type ReactNode } from "react";

type PaddingY = "lg" | "xl";

interface LayoutSectionProps {
  /** Vertical padding variant: lg (16px) or xl (24px) */
  py?: PaddingY;
  /** Fill remaining vertical space instead of hugging content */
  fill?: boolean;
  /** The section content */
  children: ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Padded content block inside a PanelBody.
 * Provides consistent 16px horizontal padding.
 * Use for any content that isn't edge-to-edge cards.
 *
 * Usage:
 *   <LayoutSection py="lg">
 *     <h2>Section title</h2>
 *     <p>Content with consistent padding</p>
 *   </LayoutSection>
 */
export function LayoutSection({ py, fill, children, className }: LayoutSectionProps) {
  const classes = [
    "layout-section",
    py && `layout-section--py-${py}`,
    fill && "layout-section--fill",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
