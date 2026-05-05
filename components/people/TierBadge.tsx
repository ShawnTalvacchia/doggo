"use client";

/**
 * TierBadge — Helper / Provider tier pill with a tap-tooltip explainer.
 *
 * Helper-tier visibility is the consumer's job to gate (only render when
 * the viewer is Connected to the subject) — TierBadge doesn't enforce it,
 * just renders what's passed. Privacy rule lives in
 * `docs/implementation/badges.md`.
 *
 * The pill itself is the trigger: tap → tooltip explainer + link to
 * `/help/privacy#tier`. Same visual chrome as the previous span-based
 * pills (`.person-row-pill--helper` / `--provider`); only difference is
 * the wrapping button + popover.
 *
 * Onboarding & In-Product Communication phase, 2026-05-04.
 * Strategy ref: Open Questions §4 → "Helper vs Carer terminology" +
 * `Trust & Connection Model.md` → tier mechanics.
 */

import Link from "next/link";
import { TapTooltip } from "@/components/ui/TapTooltip";

interface TierBadgeProps {
  tier: "helper" | "provider";
  /** Name of the subject — used to personalise the explainer copy. */
  subjectName: string;
}

export function TierBadge({ tier, subjectName }: TierBadgeProps) {
  const triggerClass = `person-row-pill person-row-pill--${tier}`;
  const label = tier === "helper" ? "Helper" : "Provider";

  const explainer =
    tier === "helper" ? (
      <>
        <strong>Helper</strong> — {subjectName} keeps services casual,
        between people they already know. Connected? You can ask them.
        <Link href="/help/privacy#tier">How tiers work →</Link>
      </>
    ) : (
      <>
        <strong>Provider</strong> — {subjectName} offers care as a published
        service. Anyone can ask about it.
        <Link href="/help/privacy#tier">How tiers work →</Link>
      </>
    );

  return (
    <TapTooltip
      ariaLabel={`${label} tier — explain`}
      triggerClassName={triggerClass}
      body={explainer}
    >
      {label}
    </TapTooltip>
  );
}
