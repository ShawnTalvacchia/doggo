"use client";

/**
 * Walker application state — apply → invited → vouched (I, 2026-06-09).
 *
 * Mirrors `ReviewsContext` / `BookingsContext` shape — a thin persisted
 * store + helpers. State advance happens through the hidden demo
 * affordance (O4 resolution) — a per-shelter "Advance state" toggle on
 * the application status view.
 *
 * Once an application reaches `vouched`, helpers elsewhere can treat
 * the user as a vetted Volunteer at the shelter even if they aren't
 * pre-seeded in the static roster (see lib/mockShelters.ts).
 */

import { createContext, useContext, useCallback } from "react";
import { usePersistedState } from "@/lib/usePersistedState";
import type { WalkerApplication, WalkerApplicationState, WalkerTier } from "@/lib/types";

/**
 * Derive a WalkerTier from accumulated walkCount per the Shelter
 * Foundation D1 thresholds:
 *   0-9   → vetted (Volunteer)
 *   10-24 → experienced (Volunteer)
 *   25+   → trusted (Super Volunteer)
 *
 * Trusted tier is also gated on coordinator sign-off in production;
 * the demo treats the walk-count threshold as sufficient for the
 * narrative arc. Static walkers (seeded in mockShelters) keep their
 * authored tier rather than deriving from walkCount.
 */
export function deriveWalkerTier(walkCount: number): WalkerTier {
  if (walkCount >= 25) return "trusted";
  if (walkCount >= 10) return "experienced";
  return "vetted";
}

const APPLICATIONS_SEED_VERSION = 1;
const STORAGE_KEY = "doggo-walker-applications";

interface WalkerApplicationsContextValue {
  applications: WalkerApplication[];
  /** Returns the application for (userId, shelterId), or undefined. */
  getApplication: (userId: string, shelterId: string) => WalkerApplication | undefined;
  /** Create a new applied application. No-op if one already exists. */
  apply: (userId: string, shelterId: string, message: string) => void;
  /** Advance to the next state. No-op at terminal "vouched." */
  advance: (userId: string, shelterId: string) => void;
  /** Withdraw / drop the application entirely. */
  withdraw: (userId: string, shelterId: string) => void;
  /** Increment walkCount for the vouched walker. No-op when not vouched. */
  logWalk: (userId: string, shelterId: string) => void;
}

const WalkerApplicationsContext = createContext<WalkerApplicationsContextValue | undefined>(undefined);

export function WalkerApplicationsProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = usePersistedState<WalkerApplication[]>(
    STORAGE_KEY,
    [],
    { seedVersion: APPLICATIONS_SEED_VERSION },
  );

  const getApplication = useCallback(
    (userId: string, shelterId: string) =>
      applications.find((a) => a.userId === userId && a.shelterId === shelterId),
    [applications],
  );

  const apply = useCallback(
    (userId: string, shelterId: string, message: string) => {
      setApplications((prev) => {
        if (prev.some((a) => a.userId === userId && a.shelterId === shelterId)) {
          return prev;
        }
        return [
          ...prev,
          {
            id: `app-${userId}-${shelterId}-${Date.now()}`,
            userId,
            shelterId,
            state: "applied" as WalkerApplicationState,
            message,
            appliedAt: new Date().toISOString(),
          },
        ];
      });
    },
    [setApplications],
  );

  const advance = useCallback(
    (userId: string, shelterId: string) => {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.userId !== userId || a.shelterId !== shelterId) return a;
          if (a.state === "applied") return { ...a, state: "invited", invitedAt: new Date().toISOString() };
          if (a.state === "invited") return { ...a, state: "vouched", vouchedAt: new Date().toISOString() };
          return a;
        }),
      );
    },
    [setApplications],
  );

  const withdraw = useCallback(
    (userId: string, shelterId: string) => {
      setApplications((prev) => prev.filter((a) => !(a.userId === userId && a.shelterId === shelterId)));
    },
    [setApplications],
  );

  const logWalk = useCallback(
    (userId: string, shelterId: string) => {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.userId !== userId || a.shelterId !== shelterId) return a;
          if (a.state !== "vouched") return a;
          return { ...a, walkCount: (a.walkCount ?? 0) + 1 };
        }),
      );
    },
    [setApplications],
  );

  return (
    <WalkerApplicationsContext.Provider value={{ applications, getApplication, apply, advance, withdraw, logWalk }}>
      {children}
    </WalkerApplicationsContext.Provider>
  );
}

export function useWalkerApplications(): WalkerApplicationsContextValue {
  const ctx = useContext(WalkerApplicationsContext);
  if (!ctx) throw new Error("useWalkerApplications must be used within WalkerApplicationsProvider");
  return ctx;
}
