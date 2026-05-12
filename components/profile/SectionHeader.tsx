"use client";

import type { ReactNode } from "react";

/**
 * SectionHeader — `.profile-card-subtitle` h3 plus an optional
 * right-aligned action slot.
 *
 * Bridges the two heading shapes that recur across profile-style
 * surfaces: a bare heading (most sections) and a heading paired with
 * a small action button (e.g. "My dogs" + "Add dog" in edit mode).
 * Without the wrapper, the two cases produced inconsistent header
 * heights and gaps (a bare h3 sat at the text's natural line-height
 * while a flex-wrapped h3 picked up an additional ~12px from the
 * h3's bottom margin).
 *
 * Pairs with the `.profile-card-subtitle` CSS update on 2026-05-11:
 * the h3 is now a 32px-tall flex container that centers its text,
 * margin: 0. Sections inside `.profile-tab-stack` and `.profile-info-card`
 * are flex-column with `gap-md` so the natural gap-below-header
 * spacing is provided by the container, not the h3 itself.
 *
 * Future: this is a candidate for promotion to `components/ui/` —
 * the pattern recurs beyond profile pages. See punch list P67.
 */

interface SectionHeaderProps {
  title: ReactNode;
  /** Optional right-aligned action (typically a small ButtonAction
   *  like `Add dog`). When present, the h3 + action sit on one row,
   *  vertically centered. */
  action?: ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  if (!action) {
    return <h3 className="profile-card-subtitle">{title}</h3>;
  }
  return (
    <div className="flex items-center justify-between">
      <h3 className="profile-card-subtitle">{title}</h3>
      {action}
    </div>
  );
}
