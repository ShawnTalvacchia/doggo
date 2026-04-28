"use client";

import {
  Handshake,
  Check,
  GlobeSimple,
} from "@phosphor-icons/react";
import type { ConnectionState } from "@/lib/types";

interface ConnectionIconProps {
  /** Connection state from the viewer's perspective */
  state: ConnectionState;
  /** Whether this user's profile is Open (shows globe when state is "none") */
  profileOpen?: boolean;
  /** Icon size in pixels (default: 16) */
  size?: number;
  /** Show label text next to the icon */
  showLabel?: boolean;
}

/**
 * NOTE — Trust & Visibility Pass D3 (deniability guardrail):
 * the icon previously varied per-direction (Eye for inbound `theyMarkedFamiliar`,
 * Check for outbound `familiar`). That visual variation revealed *why* a row was
 * elevated and broke the silent-grant principle (the receiver could pinpoint
 * "they marked me Familiar"). Inbound Familiar is now folded into the same
 * "Familiar" rendering as outbound — fewer states, cleaner rule. Inbound is also
 * not signaled with a pill in `PersonRow` (suppressed on `state === "none" +
 * theyMarkedFamiliar`); the actionable card itself is the signal.
 */
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
  familiar: {
    icon: Check,
    label: "Familiar",
    color: "var(--text-secondary)",
    bg: "var(--surface-inset)",
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
  profileOpen,
  size = 16,
  showLabel = false,
}: ConnectionIconProps) {
  let configKey: string | null = null;

  if (state === "connected") {
    configKey = "connected";
  } else if (state === "familiar" || state === "pending") {
    // Pending reuses the Familiar icon (Check) — it's still "you initiated something"
    configKey = "familiar";
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
