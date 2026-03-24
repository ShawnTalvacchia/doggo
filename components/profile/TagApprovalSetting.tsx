"use client";

import { CheckCircle, Clock, Prohibit } from "@phosphor-icons/react";
import type { TagApproval } from "@/lib/types";

interface TagApprovalSettingProps {
  value: TagApproval;
  onChange: (value: TagApproval) => void;
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

export function TagApprovalSetting({ value, onChange }: TagApprovalSettingProps) {
  return (
    <div className="flex gap-sm">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            className="flex flex-col items-center gap-xs rounded-panel p-sm flex-1"
            style={{
              border: `2px solid ${active ? "var(--brand-main)" : "var(--border-light)"}`,
              background: active ? "var(--brand-subtle)" : "var(--surface-base)",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            <Icon
              size={18}
              weight={active ? "fill" : "light"}
              style={{ color: active ? "var(--brand-main)" : "var(--text-tertiary)" }}
            />
            <span className="text-xs font-medium text-fg-primary">{opt.label}</span>
            <span className="text-xs text-fg-tertiary" style={{ lineHeight: 1.2 }}>{opt.desc}</span>
          </button>
        );
      })}
    </div>
  );
}
