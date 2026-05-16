"use client";

/**
 * TagApprovalSetting — tagging-preferences surface.
 *
 * Two render modes (matching `ProfileVisibilitySetting`):
 *   - **View mode** (`editing: false`): compact summary card showing the
 *     current state — icon + label + description in a bordered card.
 *   - **Edit mode** (`editing: true`): full-width row picker exposing
 *     all three options (Auto-approve / Review first / Don't allow).
 *
 * Originally always-visible; gated by edit mode 2026-05-11 to condense
 * the About tab in view mode.
 */

import { CheckCircle, Clock, Prohibit } from "@phosphor-icons/react";
import type { TagApproval } from "@/lib/types";

interface TagApprovalSettingProps {
  value: TagApproval;
  onChange: (value: TagApproval) => void;
  /** When false (default), render a compact summary of the current
   *  state. When true, render the full picker. */
  editing?: boolean;
}

const OPTIONS: { key: TagApproval; icon: typeof CheckCircle; label: string; desc: string }[] = [
  {
    key: "auto",
    icon: CheckCircle,
    label: "Auto-approve",
    desc: "Tags appear immediately",
  },
  {
    key: "approve",
    icon: Clock,
    label: "Review first",
    desc: "You approve each tag",
  },
  {
    key: "none",
    icon: Prohibit,
    label: "Don't allow",
    desc: "Others can't tag you",
  },
];

export function TagApprovalSetting({ value, onChange, editing = false }: TagApprovalSettingProps) {
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
        <div className="flex flex-col gap-xs">
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

  // Edit mode — full picker. Column-stacked, icon-left, full-width rows
  // (replaced the original 3-column tile grid 2026-05-11 — labels were
  // truncating).
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
              <span className="text-xs text-fg-secondary" style={{ lineHeight: 1.4 }}>
                {opt.desc}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
