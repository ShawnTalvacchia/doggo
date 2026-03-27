"use client";

import {
  Handshake,
  Eye,
  Check,
  GlobeSimple,
} from "@phosphor-icons/react";
import type { ConnectionState } from "@/lib/types";

interface ConnectionIconProps {
  /** Connection state from the viewer's perspective */
  state: ConnectionState;
  /** Whether this person has marked us as Familiar (shows eye icon instead of check) */
  theyMarkedFamiliar?: boolean;
  /** Whether this user's profile is Open (shows globe when state is "none") */
  profileOpen?: boolean;
  /** Icon size in pixels (default: 16) */
  size?: number;
  /** Show label text next to the icon */
  showLabel?: boolean;
}

const STATE_CONFIG: Record<
  string,
  { icon: typeof Handshake; label: string; color: string; bg: string }
> = {
  connected: {
    icon: Handshake,
    label: "Connected",
    color: "var(--brand-strong)",
    bg: "var(--brand-subtle)",
  },
  familiar_them: {
    icon: Eye,
    label: "Wants to connect",
    color: "var(--text-secondary)",
    bg: "var(--surface-gray)",
  },
  familiar_you: {
    icon: Check,
    label: "Familiar",
    color: "var(--text-secondary)",
    bg: "var(--surface-gray)",
  },
  open: {
    icon: GlobeSimple,
    label: "Open profile",
    color: "var(--text-tertiary)",
    bg: "transparent",
  },
};

export function ConnectionIcon({
  state,
  theyMarkedFamiliar,
  profileOpen,
  size = 16,
  showLabel = false,
}: ConnectionIconProps) {
  let configKey: string | null = null;

  if (state === "connected") {
    configKey = "connected";
  } else if (state === "familiar") {
    configKey = theyMarkedFamiliar ? "familiar_them" : "familiar_you";
  } else if (state === "pending") {
    configKey = "familiar_you"; // reuse check icon for pending
  } else if (state === "none" && profileOpen) {
    configKey = "open";
  }

  if (!configKey) return null;

  const config = STATE_CONFIG[configKey];
  const Icon = config.icon;

  if (showLabel) {
    return (
      <span
        className="inline-flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium"
        style={{ background: config.bg, color: config.color }}
      >
        <Icon size={size} weight="light" />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center"
      title={config.label}
      style={{ color: config.color }}
    >
      <Icon size={size} weight="light" />
    </span>
  );
}
