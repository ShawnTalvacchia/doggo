"use client";

/**
 * TapTooltip — a small tap-to-open explainer popover.
 *
 * Mobile-first: tap the trigger to toggle, tap-away or Escape to close.
 * Used to teach subtle product mechanics in-context without forcing copy
 * into every label (e.g. group visibility chip explainer, tier badge
 * "what does Helper / Provider mean" explainer).
 *
 * The trigger renders inside a button so it's keyboard-focusable. The
 * caller passes the visual content as `children`; the tooltip body is
 * whatever ReactNode you pass as `body` (paragraph + link, copy alone, etc).
 *
 * Anchors to the trigger via `position: absolute`. Width capped to keep
 * sentences from sprawling. Two placements supported:
 *  - "below" (default) — tooltip below the trigger, left-aligned
 *  - "above"           — tooltip above the trigger, right-aligned (use
 *                        when the trigger is near the bottom of the viewport)
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

interface TapTooltipProps {
  /** What renders inside the trigger button (chip text, badge, etc.) */
  children: ReactNode;
  /** Tooltip content — paragraph, link, etc. */
  body: ReactNode;
  /** Accessible label for the trigger (defaults to "More information") */
  ariaLabel?: string;
  /** Override the trigger's class name (e.g. to inherit chip styling) */
  triggerClassName?: string;
  /** Tooltip placement relative to trigger. Default "below". */
  placement?: "below" | "above";
}

export function TapTooltip({
  children,
  body,
  ariaLabel = "More information",
  triggerClassName,
  placement = "below",
}: TapTooltipProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="tap-tooltip-wrap">
      <button
        type="button"
        className={triggerClassName ?? "tap-tooltip-trigger"}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {children}
      </button>
      {open && (
        <span
          className={`tap-tooltip-body tap-tooltip-body--${placement}`}
          role="dialog"
        >
          {body}
        </span>
      )}
    </span>
  );
}
