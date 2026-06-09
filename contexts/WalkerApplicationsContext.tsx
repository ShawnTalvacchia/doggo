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
import type { WalkerApplication, WalkerApplicationState } from "@/lib/types";

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

  return (
    <WalkerApplicationsContext.Provider value={{ applications, getApplication, apply, advance, withdraw }}>
      {children}
    </WalkerApplicationsContext.Provider>
  );
}

export function useWalkerApplications(): WalkerApplicationsContextValue {
  const ctx = useContext(WalkerApplicationsContext);
  if (!ctx) throw new Error("useWalkerApplications must be used within WalkerApplicationsProvider");
  return ctx;
}
