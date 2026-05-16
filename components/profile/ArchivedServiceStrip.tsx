"use client";

import { ArrowCounterClockwise } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";

interface ArchivedServiceStripProps {
  /** Service name — the call site falls back to "Untitled …" when blank. */
  title: string;
  /** Restore the service (clears `softDeletedAt`). */
  onUndo: () => void;
}

/**
 * Slim strip standing in for a soft-archived service in the Services edit
 * list. Shared by the Meet + Appointment edit cards.
 *
 * Layout (see `.archived-service-strip` in globals.css): title + status on
 * the left, an Undo button compact on the right. On mobile the button wraps
 * to its own row and grows to full width. 2026-05-16.
 */
export function ArchivedServiceStrip({ title, onUndo }: ArchivedServiceStripProps) {
  return (
    <div className="archived-service-strip">
      <div className="archived-service-strip-main">
        <span className="text-sm font-semibold text-fg-secondary">{title}</span>
        <span className="text-xs text-fg-tertiary">
          Archived — existing bookings keep running.
        </span>
      </div>
      <ButtonAction
        variant="secondary"
        size="sm"
        leftIcon={<ArrowCounterClockwise size={14} weight="bold" />}
        onClick={onUndo}
      >
        Undo
      </ButtonAction>
    </div>
  );
}
