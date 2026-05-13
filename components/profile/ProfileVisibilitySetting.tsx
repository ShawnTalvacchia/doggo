"use client";

/**
 * ProfileVisibilitySetting — profile visibility surface.
 *
 * Two render modes:
 *   - **View mode** (`editing: false`): compact summary card showing the
 *     current state — icon + label + description, in the same bordered-
 *     card shape used by the Services tab's "Offering care" summary.
 *   - **Edit mode** (`editing: true`): full-width row picker exposing
 *     both options (Locked / Open) for selection.
 *
 * Originally the picker was always visible (no edit gating). Walked back
 * 2026-05-11 (C-extension) so the About tab feels compact in view mode
 * and full options only surface when the user explicitly enters edit.
 * Mirrors the same change applied to `TagApprovalSetting`.
 *
 * Companion read-only signal in the hero: `ProfileVisibilityChip`.
 */

import { Eye, Lock } from "@phosphor-icons/react";
import type { ProfileVisibility } from "@/lib/types";

interface ProfileVisibilitySettingProps {
  value: ProfileVisibility;
  onChange: (value: ProfileVisibility) => void;
  /** When false (default), render a compact summary of the current
   *  state. When true, render the full picker. */
  editing?: boolean;
}

// Labels: UX copy standardises on **Private** / **Public** (gentler than
// "Locked"/"Open" and matches IG/Threads convention — see Open Q §9 and
// the CLAUDE.md "Private vs Locked" note). Data field stays
// `profileVisibility: "open" | "locked"` for now; only UI strings change.
//
// Description for the locked state surfaces the full visibility rule:
// you (the profile owner) opening your profile to someone via a Familiar
// mark counts. The previous "Only Connected members" copy was incomplete
// and conflicted with the trust model (and with the more-accurate hero
// chip explainer). 2026-05-11.
const OPTIONS: {
  key: ProfileVisibility;
  icon: typeof Lock;
  label: string;
  desc: string;
}[] = [
  {
    key: "locked",
    icon: Lock,
    label: "Private",
    desc: "Only people you've marked Familiar or are Connected with can see your full profile",
  },
  {
    key: "open",
    icon: Eye,
    label: "Public",
    desc: "Anyone using Doggo can see your full profile",
  },
];

export function ProfileVisibilitySetting({
  value,
  onChange,
  editing = false,
}: ProfileVisibilitySettingProps) {
  const current = OPTIONS.find((o) => o.key === value) ?? OPTIONS[0];

  if (!editing) {
    // View mode — compact summary card.
    const Icon = current.icon;
    return (
      <div
        className="flex items-start gap-md rounded-form"
        style={{
          padding: "var(--space-md)",
          background: "var(--surface-top)",
          border: "1px solid var(--border-regular)",
        }}
      >
        <Icon
          size={20}
          weight="fill"
          className="shrink-0"
          style={{ color: "var(--brand-strong)", marginTop: 2 }}
        />
        <div className="flex flex-col gap-xxs">
          <p className="text-sm font-semibold text-fg-primary m-0">
            {current.label}
          </p>
          <p className="text-sm text-fg-secondary m-0 leading-snug">
            {current.desc}
          </p>
        </div>
      </div>
    );
  }

  // Edit mode — full picker.
  return (
    <div className="flex flex-col gap-sm">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className="flex items-center gap-md rounded-panel"
            style={{
              padding: "var(--space-md) var(--space-lg)",
              border: `2px solid ${active ? "var(--brand-main)" : "var(--border-light)"}`,
              background: active ? "var(--brand-subtle)" : "var(--surface-base)",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <Icon
              size={24}
              weight={active ? "fill" : "light"}
              className="shrink-0"
              style={{ color: active ? "var(--brand-main)" : "var(--text-tertiary)" }}
            />
            <div className="flex flex-col gap-tiny min-w-0">
              <span className="text-sm font-semibold text-fg-primary">
                {opt.label}
              </span>
              <span
                className="text-xs text-fg-secondary"
                style={{ lineHeight: 1.4 }}
              >
                {opt.desc}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
