"use client";

/**
 * GroupVisibilityChip — visibility chip for a group with a tap-tooltip
 * explainer.
 *
 * Renders nothing for `open` groups (the absence of a chip IS the signal
 * that anyone can see + join). For `approval` and `private`, the label
 * combines visibility + join requirement so each chip carries the full
 * meaning at a glance; the tap-tooltip provides the one-sentence
 * "what does this mean" explainer.
 *
 * Two visual variants:
 *   - "panel"   — solid fill, used inside group detail panel/page headers
 *                 (matches the existing `bg-surface-base text-fg-secondary`
 *                 chip pattern in GroupDetailPanel + app/communities/[id])
 *   - "card"    — neutral fill, used on group cards (matches existing
 *                 `card-schedule-chip` pattern in CardGroup)
 *
 * Onboarding & In-Product Communication phase, 2026-05-04.
 * Strategy ref: Open Questions §3 → "Group visibility chip clarity."
 */

import { Lock, ShieldCheck } from "@phosphor-icons/react";
import { TapTooltip } from "@/components/ui/TapTooltip";
import type { GroupVisibility } from "@/lib/types";

interface GroupVisibilityChipProps {
  visibility: GroupVisibility;
  variant?: "panel" | "card";
}

const COPY: Record<
  Exclude<GroupVisibility, "open">,
  { label: string; explainer: string }
> = {
  approval: {
    label: "Approval to join",
    explainer: "Anyone can see this group. Joining requires admin approval.",
  },
  private: {
    label: "Private · approval to join",
    explainer: "Hidden from non-members. Joining requires admin approval.",
  },
};

const ICON: Record<Exclude<GroupVisibility, "open">, typeof Lock> = {
  approval: ShieldCheck,
  private: Lock,
};

export function GroupVisibilityChip({
  visibility,
  variant = "panel",
}: GroupVisibilityChipProps) {
  if (visibility === "open") return null;

  const { label, explainer } = COPY[visibility];
  const Icon = ICON[visibility];

  const chipClass =
    variant === "card"
      ? "card-schedule-chip"
      : "flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium bg-surface-base text-fg-secondary";

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
