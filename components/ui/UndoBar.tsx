"use client";

/**
 * UndoBar — a transient "X happened · Undo" strip for reversible actions.
 *
 * Shared primitive (first used by the operator's application queue, then the
 * handover board). Render it conditionally while an undo is available; it
 * auto-dismisses after `durationMs`. The `token` prop is the re-arm trigger —
 * pass a value that changes on each new undo event (e.g. the undo-state object
 * or a nonce) so the timer restarts when a fresh action replaces an older one.
 */

import { useEffect } from "react";
import { ArrowCounterClockwise, X } from "@phosphor-icons/react";

const DEFAULT_DURATION_MS = 6000;

export function UndoBar({
  token,
  message,
  onUndo,
  onDismiss,
  durationMs = DEFAULT_DURATION_MS,
}: {
  /** Changes per undo event — restarts the auto-dismiss timer. */
  token: unknown;
  message: React.ReactNode;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [token, onDismiss, durationMs]);

  return (
    <div className="flex items-center gap-sm rounded-panel border border-edge-regular bg-surface-inset px-md py-sm">
      <span className="flex-1 truncate text-sm text-fg-secondary">{message}</span>
      <button
        type="button"
        onClick={onUndo}
        className="flex flex-shrink-0 cursor-pointer items-center gap-tiny text-sm font-semibold text-fg-primary hover:underline"
      >
        <ArrowCounterClockwise size={14} weight="bold" /> Undo
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="flex flex-shrink-0 cursor-pointer items-center text-fg-tertiary"
      >
        <X size={14} weight="bold" />
      </button>
    </div>
  );
}
