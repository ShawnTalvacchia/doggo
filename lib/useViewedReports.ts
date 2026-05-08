"use client";

/**
 * useViewedReports — tracks when the viewer last opened the Sessions tab
 * for each booking. Used to surface a "new visit report" indicator on
 * the BookingRow when a provider has sent a report the owner hasn't
 * seen yet, so the owner-side loop-closure is one tap away from
 * `/bookings`.
 *
 * Storage shape: `Record<bookingId, ISO timestamp>`. Persisted via
 * `usePersistedState` (key `doggo-viewed-reports`); resets via the
 * existing `/demo` clear helper.
 *
 * Sessions & Service Execution A6 walkthrough, 2026-05-05.
 */

import { useCallback } from "react";
import { usePersistedState } from "@/lib/usePersistedState";

export function useViewedReports() {
  const [viewed, setViewed] = usePersistedState<Record<string, string>>(
    "doggo-viewed-reports",
    {},
  );

  const lastViewedAt = useCallback(
    (bookingId: string): string | null => viewed[bookingId] ?? null,
    [viewed],
  );

  const markViewed = useCallback(
    (bookingId: string) => {
      setViewed((prev) => ({ ...prev, [bookingId]: new Date().toISOString() }));
    },
    [setViewed],
  );

  return { lastViewedAt, markViewed };
}
