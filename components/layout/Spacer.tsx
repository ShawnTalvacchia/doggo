"use client";

type SpacerSize = "sm" | "md" | "lg";

interface SpacerProps {
  /** Minimum height variant — controls how much bottom space when content fills.
   *  sm: 24px, md: 48px (default), lg: 80px */
  size?: SpacerSize;
  /** Additional class names */
  className?: string;
}

/**
 * Flexible bottom spacer for panel bodies.
 * Fills remaining vertical space with surface-popout background.
 * When content is short, it takes up the rest of the panel.
 * When content fills, it adds a small min-height of empty space.
 */
export function Spacer({ size = "md", className }: SpacerProps) {
  return (
    <div
      className={`panel-spacer panel-spacer--${size}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    />
  );
}
