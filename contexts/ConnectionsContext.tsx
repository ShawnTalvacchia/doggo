"use client";

/**
 * ConnectionsContext — session-scoped mutation layer over `mockConnections`.
 *
 * Built during Mock World Building (2026-04-30) to make the Familiar pill
 * on profile pages actually do something. Earlier surfaces (post-meet
 * review sheet, PersonRow mark-state ladder) used local component state
 * for marks; that worked in isolation but didn't unify with the profile
 * page's pill, so testers tapping "+Familiar" on a profile saw no effect.
 *
 * **Scope:** session-only. Marks reset on page reload. Across persona
 * switches, the override stays mapped to (viewer, target) — which means
 * Daniel marking Jana Familiar persists if you switch to Klára and back.
 * That's correct: it's *Daniel's* relationship state, not Klára's.
 *
 * **What this is NOT:** multi-user persistence. If Daniel marks Jana
 * Familiar, Jana's view doesn't reflect it (out of scope per Mock World
 * Building "Not in scope"). The receiving side of a Familiar grant is
 * still computed from the static `mockConnections.theyMarkedFamiliar`
 * field — the only thing this context simulates is the *viewer*'s
 * outbound state changes.
 *
 * **Migration plan:** the post-meet review sheet's `setMark` and the
 * PersonRow mark-state ladder still use local state. They should migrate
 * to this context so a Familiar marked in one place reflects everywhere.
 * Tracked separately on the punch list — not blocking demo today.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Connection, ConnectionState } from "@/lib/types";
import { getConnectionState as getStaticConnectionState } from "@/lib/mockConnections";
import { getUserById } from "@/lib/mockUsers";

interface ConnectionsContextValue {
  /**
   * Resolve the connection for (target, viewer), overlaying any session
   * overrides on top of the static `mockConnections` lookup.
   */
  getConnection: (targetUserId: string, viewerUserId: string) => Connection | undefined;
  /** Mark `targetUserId` as Familiar from `viewerUserId`'s perspective. */
  markFamiliar: (viewerUserId: string, targetUserId: string) => void;
  /** Reverse a Familiar mark — drops back to "none" (no relationship). */
  unmarkFamiliar: (viewerUserId: string, targetUserId: string) => void;
  /** Convenience: read the override map (mostly useful in tests / debugging). */
  overrides: Record<string, ConnectionOverride>;
}

interface ConnectionOverride {
  state: ConnectionState;
  /** When the override was applied (lets us show "Just marked Familiar" later if needed). */
  markedAt: string;
}

const noopContext: ConnectionsContextValue = {
  getConnection: getStaticConnectionState,
  markFamiliar: () => {},
  unmarkFamiliar: () => {},
  overrides: {},
};

const ConnectionsContext = createContext<ConnectionsContextValue>(noopContext);

function key(viewerId: string, targetId: string): string {
  return `${viewerId}::${targetId}`;
}

/**
 * Synthesize a minimal Connection for cases where the viewer marks a target
 * Familiar but had no static record before (e.g. Daniel marking Jana, who
 * isn't in his static roster). Pulls display fields from `getUserById` so
 * inbox / list surfaces have something to render.
 */
function synthesizeConnection(
  targetUserId: string,
  state: ConnectionState,
  markedAt: string,
): Connection {
  const user = getUserById(targetUserId);
  return {
    id: `synth-${targetUserId}`,
    userId: targetUserId,
    userName: user?.firstName ?? targetUserId,
    avatarUrl: user?.avatarUrl ?? "",
    dogNames: user?.pets.map((p) => p.name) ?? [],
    location: user?.location ?? "",
    state,
    updatedAt: markedAt,
    profileOpen: user?.profileVisibility === "open",
    neighbourhood: user?.neighbourhood,
  };
}

export function ConnectionsProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, ConnectionOverride>>({});

  const getConnection = useCallback(
    (targetUserId: string, viewerUserId: string): Connection | undefined => {
      const override = overrides[key(viewerUserId, targetUserId)];
      const base = getStaticConnectionState(targetUserId, viewerUserId);

      if (!override) return base;

      // Merge: override.state wins. Other fields come from base if it
      // exists (preserve mutual connections, shared groups, etc.) or
      // from a synthesized minimal Connection if not.
      if (base) {
        return { ...base, state: override.state, updatedAt: override.markedAt };
      }
      return synthesizeConnection(targetUserId, override.state, override.markedAt);
    },
    [overrides],
  );

  const markFamiliar = useCallback(
    (viewerUserId: string, targetUserId: string) => {
      const k = key(viewerUserId, targetUserId);
      setOverrides((prev) => ({
        ...prev,
        [k]: { state: "familiar", markedAt: new Date().toISOString() },
      }));
    },
    [],
  );

  const unmarkFamiliar = useCallback(
    (viewerUserId: string, targetUserId: string) => {
      const k = key(viewerUserId, targetUserId);
      setOverrides((prev) => {
        if (!prev[k]) return prev;
        const next = { ...prev };
        delete next[k];
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ getConnection, markFamiliar, unmarkFamiliar, overrides }),
    [getConnection, markFamiliar, unmarkFamiliar, overrides],
  );

  return <ConnectionsContext.Provider value={value}>{children}</ConnectionsContext.Provider>;
}

export function useConnections() {
  return useContext(ConnectionsContext);
}
