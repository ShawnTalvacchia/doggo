"use client";

/**
 * ProfileVisibilityChip — visibility chip for the user's own profile hero.
 *
 * Mirrors `GroupVisibilityChip` (icon + single-word label + tap-tooltip
 * explainer) so the privacy-disclosure pattern is consistent across the
 * app: groups have a chip, profiles have a chip, the user learns the
 * system once and reads it everywhere.
 *
 * **Self-view only.** Renders on `ProfileAboutTab`'s hero — the own-
 * profile route. Other-user profiles (`/profile/[userId]`) communicate
 * the locked/open state through full-card-vs-placeholder rendering, not
 * via a chip; surfacing a "this person is Locked" badge to the viewer
 * would leak the subject's setting in a way the deniability rule
 * dis-recommends. The chip's purpose is to answer "what does my profile
 * look like to others?" from the owner's perspective.
 *
 * Cross-Cutting Flow Testing walkthrough 2026-05-11. See
 * `Trust & Connection Model.md` → Profile visibility for the underlying
 * binary semantics and `implementation/design-system.md` → Principle 11
 * (header-action convention) for placement / chip rhythm.
 */

import { Eye, Lock } from "@phosphor-icons/react";
import { TapTooltip } from "@/components/ui/TapTooltip";
import type { ProfileVisibility } from "@/lib/types";

interface ProfileVisibilityChipProps {
  visibility: ProfileVisibility;
}

const COPY: Record<ProfileVisibility, { label: string; explainer: string }> = {
  open: {
    label: "Open profile",
    explainer:
      "Anyone using Doggo can see your full profile, posts, and dogs.",
  },
  locked: {
    label: "Locked profile",
    explainer:
      "Only Connected members see your full profile. Others see a placeholder until you mark them Familiar or accept a Connect.",
  },
};

const ICON: Record<ProfileVisibility, typeof Lock> = {
  open: Eye,
  locked: Lock,
};

export function ProfileVisibilityChip({ visibility }: ProfileVisibilityChipProps) {
  const { label, explainer } = COPY[visibility];
  const Icon = ICON[visibility];

  // Same chrome as GroupVisibilityChip's "panel" variant — solid neutral
  // pill that pairs with the surrounding hero typography without
  // competing for attention.
  const chipClass =
    "flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-surface-base text-fg-secondary";

  return (
    <TapTooltip
      ariaLabel={`${label} — explain`}
      triggerClassName={chipClass}
      body={<span>{explainer}</span>}
    >
      <Icon size={10} weight="fill" />
      {label}
    </TapTooltip>
  );
}
