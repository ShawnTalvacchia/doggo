"use client";

import { type ReactNode } from "react";

type Gap = "xs" | "sm" | "md" | "lg";
type Direction = "column" | "row";

interface LayoutListProps {
  /** Gap between items */
  gap?: Gap;
  /** Flex direction — column (default) or row */
  direction?: Direction;
  /** The list content — typically card components */
  children: ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Edge-to-edge list container inside a PanelBody.
 * No horizontal padding — cards go flush to panel edges.
 * Use for GroupCards, NotificationRows, BookingCards, etc.
 *
 * Usage:
 *   <LayoutList>
 *     <GroupCard group={group} />
 *     <GroupCard group={group} />
 *   </LayoutList>
 */
export function LayoutList({ gap, direction, children, className }: LayoutListProps) {
  const classes = [
    "layout-list",
    direction === "row" && "layout-list--row",
    gap && `layout-list--gap-${gap}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
