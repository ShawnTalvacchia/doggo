"use client";

/**
 * dismissedReviews — localStorage-backed store for "I've seen this, hide it"
 * dismissals.
 *
 * Used by:
 *  - Schedule → History → review-recent: dismiss a completed-occurrence card
 *    so it falls into the past chronicle. Kind: `"meet"`, id: `${meetId}::${date}`.
 *  - Meet detail → Upcoming dates → Skip: mark an upcoming occurrence as
 *    "not this one" without changing your relationship to the series. Kind:
 *    `"meet-skip"`, id: `${meetId}::${date}`. Renders the row muted with an
 *    inline Undo affordance.
 *
 * Demo-grade: no backend, no cross-device sync. State is keyed by
 * `${kind}:${id}` so different surfaces share the same plumbing without
 * colliding.
 *
 * Two patterns:
 *  - `useDismissedReviews()` — React hook returning {dismissed, dismiss,
 *    dismissMany, undismiss, clear}. The set is reactive: changing it via
 *    the returned helpers re-renders all subscribers in the same tab.
 *  - `getDismissedReviews()` — synchronous read for non-React contexts
 *    (rare; mostly here for completeness).
 *
 * Persistence happens on every mutation. Reads on mount hydrate from
 * localStorage, falling back to an empty Set when storage is unavailable
 * (SSR or sandboxed iframes).
 */

import { useCallback, useEffect, useState } from "react";

// Hyphen-snake to match the rest of the project's `doggo-*` localStorage
// convention (P57, 2026-06-02). Both the key prefix and the event name
// migrated in lockstep so any cross-tab/cross-component listeners stay
// wired without a transitional alias. `clearDemoStorage` already prefix-
// wipes `doggo*` so demo-reset paths catch the new key automatically.
const STORAGE_KEY = "doggo-dismissed-reviews";
const EVENT_NAME = "doggo-dismissed-reviews-change";

export type DismissKind = "meet" | "session" | "meet-skip";
export type DismissId = `${DismissKind}:${string}`;

export function makeDismissId(kind: DismissKind, id: string): DismissId {
  return `${kind}:${id}` as DismissId;
}

function readFromStorage(): Set<DismissId> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((s): s is DismissId => typeof s === "string"));
    }
  } catch {
    // ignore — corrupted state, treat as empty
  }
  return new Set();
}

function writeToStorage(ids: Set<DismissId>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
    // Notify same-tab subscribers — `storage` event only fires across tabs.
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // Storage may be disabled (private browsing, sandbox); no-op.
  }
}

/** Synchronous read for non-React contexts. */
export function getDismissedReviews(): Set<DismissId> {
  return readFromStorage();
}

/** React hook — reactive across component instances in the same tab. */
export function useDismissedReviews() {
  const [dismissed, setDismissed] = useState<Set<DismissId>>(() => new Set());

  // Hydrate on mount (SSR-safe — initial state is empty, then we sync)
  useEffect(() => {
    setDismissed(readFromStorage());

    function handleChange() {
      setDismissed(readFromStorage());
    }
    window.addEventListener(EVENT_NAME, handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(EVENT_NAME, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  const dismiss = useCallback((id: DismissId) => {
    const next = new Set(readFromStorage());
    next.add(id);
    writeToStorage(next);
    setDismissed(next);
  }, []);

  const dismissMany = useCallback((ids: DismissId[]) => {
    const next = new Set(readFromStorage());
    ids.forEach((id) => next.add(id));
    writeToStorage(next);
    setDismissed(next);
  }, []);

  const undismiss = useCallback((id: DismissId) => {
    const next = new Set(readFromStorage());
    next.delete(id);
    writeToStorage(next);
    setDismissed(next);
  }, []);

  const clear = useCallback(() => {
    writeToStorage(new Set());
    setDismissed(new Set());
  }, []);

  return { dismissed, dismiss, dismissMany, undismiss, clear };
}
