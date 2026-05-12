"use client";

/**
 * GroupVisibilityChip — visibility chip for a group with a tap-tooltip
 * explainer.
 *
 * **Tri-state treatment** (2026-05-11, Cross-Cutting Flow Testing): all
 * three visibility states render a chip with parallel structure (icon +
 * single-word label + tap-tooltip explainer). The earlier "Open = no chip"
 * pattern relied on absence-as-signal — fine in isolation but it meant
 * users only learned the system after seeing a non-open group first.
 * Showing the Open chip closes that learnability loop and gives the three
 * states visual parity on cards + hero placements.
 *
 * Copy choices (2026-05-11):
 *   - `open` → "Open" + Users icon — anyone can see + join.
 *   - `approval` → "Approval-only" + ShieldCheck — anyone can see, joining
 *     gated. Was "Approval to join" — that read as a CTA / instruction
 *     ("you need approval") rather than as a descriptor of group state.
 *   - `private` → "Private" + Lock — hidden from non-members, joining gated.
 *     Was "Private · approval to join" — collapsed because "private" alone
 *     already implies the stronger gate; the approval mechanic is in the
 *     explainer.
 *
 * Two visual variants:
 *   - "panel"   — solid fill, used inside group detail panel/page headers
 *                 (matches the existing `bg-surface-base text-fg-secondary`
 *                 chip pattern in GroupDetailPanel + app/communities/[id])
 *   - "card"    — neutral fill, used on group cards (matches existing
 *                 `card-schedule-chip` pattern in CardGroup)
 *
 * Onboarding & In-Product Communication phase, 2026-05-04. Tri-state
 * refresh during Cross-Cutting Flow Testing walkthrough, 2026-05-11.
 * Strategy ref: Open Questions §3 → "Group visibility chip clarity."
 */

import { Lock, ShieldCheck, Users } from "@phosphor-icons/react";
import { TapTooltip } from "@/components/ui/TapTooltip";
import type { GroupVisibility } from "@/lib/types";

interface GroupVisibilityChipProps {
  visibility: GroupVisibility;
  variant?: "panel" | "card";
}

const COPY: Record<GroupVisibility, { label: string; explainer: string }> = {
  open: {
    label: "Open",
    explainer: "Anyone can see this group and join instantly.",
  },
  approval: {
    label: "Approval-only",
    explainer: "Anyone can see this group. Joining requires admin approval.",
  },
  private: {
    label: "Private",
    explainer: "Hidden from non-members. Joining requires admin approval.",
  },
};

const ICON: Record<GroupVisibility, typeof Lock> = {
  open: Users,
  approval: ShieldCheck,
  private: Lock,
};

export function GroupVisibilityChip({
  visibility,
  variant = "panel",
}: GroupVisibilityChipProps) {
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
