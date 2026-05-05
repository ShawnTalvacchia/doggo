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
  type ReactNode,
} from "react";
import type { Connection, ConnectionState } from "@/lib/types";
import { getConnectionState as getStaticConnectionState } from "@/lib/mockConnections";
import { getUserById } from "@/lib/mockUsers";
import { usePersistedState } from "@/lib/usePersistedState";

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
  /** Mark `targetUserId` as Connected from `viewerUserId`'s perspective.
   *  Connected is mutual by definition — callers should invoke this in
   *  both directions on the contract-sign hook. Pricing & Proposals
   *  walkthrough 2026-05-05 (resolves Open Q §2 inquiry-driven trust
   *  transitions for the contract-accept case). */
  markConnected: (viewerUserId: string, targetUserId: string) => void;
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
  markConnected: () => {},
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
  // Persisted across reloads. The override map is small (<<1KB typically)
  // and survives so Familiar/Connected marks made in one session carry
  // forward — important for the Discover & Care inquiry flow which
  // auto-marks Familiar on send. See `lib/usePersistedState.ts`.
  const [overrides, setOverrides] = usePersistedState<Record<string, ConnectionOverride>>(
    "doggo-connection-overrides",
    {},
  );

  const getConnection = useCallback(
    (targetUserId: string, viewerUserId: string): Connection | undefined => {
      // Two override directions matter independently:
      //   - outbound: (viewer → target) — viewer marked target Familiar.
      //     Drives `connection.state` from the viewer's perspective.
      //   - inbound:  (target → viewer) — target marked viewer Familiar.
      //     Drives `connection.theyMarkedFamiliar` — and that field is what
      //     the profile-page lock logic actually reads to decide whether a
      //     locked subject's content is visible to the viewer (per the
      //     trust model, unlocking is the *subject's* choice).
      // Without reading both, the auto-Familiar pair we apply on inquiry
      // send (Discover & Care G3) only updated state, never
      // theyMarkedFamiliar, so Klára kept seeing Tomáš's profile as
      // locked. Discover & Care 2026-05-04.
      const outbound = overrides[key(viewerUserId, targetUserId)];
      const inbound = overrides[key(targetUserId, viewerUserId)];
      const base = getStaticConnectionState(targetUserId, viewerUserId);

      // No overrides at all — pass static through.
      if (!outbound && !inbound) return base;

      const inboundFamiliar = inbound?.state === "familiar";
      const effectiveTheyMarkedFamiliar =
        inboundFamiliar || base?.theyMarkedFamiliar;

      if (base) {
        // State precedence: connected > pending > familiar > none. Take
        // the HIGHER state when merging — never let an override downgrade
        // an existing relationship. Without this rule, the auto-Familiar
        // mark fired on inquiry send (Discover & Care G3) downgraded
        // already-Connected pairs back to Familiar. Pricing & Proposals
        // walkthrough 2026-05-05.
        const STATE_RANK: Record<ConnectionState, number> = {
          none: 0,
          familiar: 1,
          pending: 2,
          connected: 3,
        };
        const overrideState = outbound?.state;
        const resolvedState =
          overrideState && STATE_RANK[overrideState] > STATE_RANK[base.state]
            ? overrideState
            : base.state;
        return {
          ...base,
          state: resolvedState,
          updatedAt: outbound?.markedAt ?? base.updatedAt,
          theyMarkedFamiliar: effectiveTheyMarkedFamiliar,
        };
      }

      // No static base. Synthesize a minimal Connection using whichever
      // override we have (outbound preferred for state).
      const synthState = outbound?.state ?? "none";
      const synthAt = outbound?.markedAt ?? inbound?.markedAt ?? "";
      return {
        ...synthesizeConnection(targetUserId, synthState, synthAt),
        theyMarkedFamiliar: effectiveTheyMarkedFamiliar,
      };
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

  const markConnected = useCallback(
    (viewerUserId: string, targetUserId: string) => {
      const k = key(viewerUserId, targetUserId);
      setOverrides((prev) => ({
        ...prev,
        [k]: { state: "connected", markedAt: new Date().toISOString() },
      }));
    },
    [],
  );

  const value = useMemo(
    () => ({ getConnection, markFamiliar, unmarkFamiliar, markConnected, overrides }),
    [getConnection, markFamiliar, unmarkFamiliar, markConnected, overrides],
  );

  return <ConnectionsContext.Provider value={value}>{children}</ConnectionsContext.Provider>;
}

export function useConnections() {
  return useContext(ConnectionsContext);
}
