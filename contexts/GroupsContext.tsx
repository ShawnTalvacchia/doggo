"use client";

/**
 * GroupsContext — session-scoped mutation layer over `mockGroups`.
 *
 * Built 2026-06-02 (P43) so the Join Community / Leave / Request actions
 * actually mutate state. Before this, the community-detail page used
 * local `useState` flags (`joinRequested`, `joinedOpenOptimistic`) that
 * reset on every page reload AND didn't propagate to other surfaces
 * (Discover Groups, Home recommendations, the post composer's group
 * picker) — joining a group "worked" visually on the detail page and
 * was invisible everywhere else.
 *
 * **Scope:** session-only, persisted to localStorage. Membership marks
 * reset on /demo Reset. Across persona switches, the override stays
 * mapped to (userId, groupId) — Daniel joining a group still appears
 * if you switch to Klára and back to Daniel.
 *
 * **What this is NOT:** real backend membership. Joining a group as
 * Daniel doesn't make Daniel appear in the group's `members[]` for OTHER
 * users viewing the same group — the simulated grant is only visible
 * from the joiner's own perspective. This is fine for the demo: each
 * persona's view is what we test.
 *
 * **Resolver semantics.** The override beats the seed via a small
 * precedence rule, mirroring ConnectionsContext:
 *   - override "member"          → member (covers seed or non-seed)
 *   - override "pending"         → pending join request
 *   - override "none" + cleared  → not a member (overrides a seed
 *                                  membership for leave)
 *   - no override                → seed (member if in `group.members[]`)
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { getGroupById, getUserGroups as getSeedUserGroups } from "@/lib/mockGroups";
import { usePersistedState } from "@/lib/usePersistedState";

export type GroupMembershipState = "member" | "pending" | "none";

interface GroupOverride {
  state: GroupMembershipState;
  /** When the override was applied. */
  markedAt: string;
  /** Deliberate down-mark — `state: "none"` with `cleared: true` overrides
   *  a seeded membership for a leave action. Without this, the resolver
   *  treats a "none" override as a no-op against a seeded "member" base. */
  cleared?: boolean;
}

interface GroupsContextValue {
  /** Resolve the (userId, groupId) membership, overlaying overrides on seed. */
  getMembershipState: (userId: string, groupId: string) => GroupMembershipState;
  /** Convenience boolean — true if state === "member". */
  isMember: (userId: string, groupId: string) => boolean;
  /** Convenience boolean — true if state === "pending". */
  hasRequestedJoin: (userId: string, groupId: string) => boolean;
  /** Add `userId` to `groupId` (instant, no approval). Open/invited path. */
  joinGroup: (userId: string, groupId: string) => void;
  /** Request to join an approval-required group. Sets "pending". */
  requestJoin: (userId: string, groupId: string) => void;
  /** Withdraw a pending join request. Clears the override. */
  cancelJoinRequest: (userId: string, groupId: string) => void;
  /** Leave a group. Sets "none" + cleared to override a seeded membership. */
  leaveGroup: (userId: string, groupId: string) => void;
  /** Convenience — joined-group IDs for a user (seed + overrides, minus left). */
  getUserGroupIds: (userId: string) => Set<string>;
  /** Raw override map. Mostly for debugging. */
  overrides: Record<string, GroupOverride>;
}

const noopContext: GroupsContextValue = {
  getMembershipState: (userId, groupId) => {
    const group = getGroupById(groupId);
    return group?.members.some((m) => m.userId === userId) ? "member" : "none";
  },
  isMember: (userId, groupId) => {
    const group = getGroupById(groupId);
    return !!group?.members.some((m) => m.userId === userId);
  },
  hasRequestedJoin: () => false,
  joinGroup: () => {},
  requestJoin: () => {},
  cancelJoinRequest: () => {},
  leaveGroup: () => {},
  getUserGroupIds: (userId) => new Set(getSeedUserGroups(userId).map((g) => g.id)),
  overrides: {},
};

const GroupsContext = createContext<GroupsContextValue>(noopContext);

function key(userId: string, groupId: string): string {
  return `${userId}::${groupId}`;
}

export function GroupsProvider({ children }: { children: ReactNode }) {
  // Persisted so a join in one tab survives navigation. Override map
  // is small (a few entries per persona at most) — well under any quota.
  const [overrides, setOverrides] = usePersistedState<Record<string, GroupOverride>>(
    "doggo-group-overrides",
    {},
  );

  const getMembershipState = useCallback(
    (userId: string, groupId: string): GroupMembershipState => {
      const k = key(userId, groupId);
      const override = overrides[k];
      const group = getGroupById(groupId);
      const seedMember = !!group?.members.some((m) => m.userId === userId);

      if (override) {
        // Cleared "none" wins against a seeded member base (leave).
        if (override.state === "none" && override.cleared) return "none";
        // "member" or "pending" override wins outright.
        if (override.state === "member" || override.state === "pending") {
          return override.state;
        }
      }
      return seedMember ? "member" : "none";
    },
    [overrides],
  );

  const isMember = useCallback(
    (userId: string, groupId: string) => getMembershipState(userId, groupId) === "member",
    [getMembershipState],
  );

  const hasRequestedJoin = useCallback(
    (userId: string, groupId: string) => getMembershipState(userId, groupId) === "pending",
    [getMembershipState],
  );

  const joinGroup = useCallback(
    (userId: string, groupId: string) => {
      const k = key(userId, groupId);
      setOverrides((prev) => ({
        ...prev,
        [k]: { state: "member", markedAt: new Date().toISOString() },
      }));
    },
    [],
  );

  const requestJoin = useCallback(
    (userId: string, groupId: string) => {
      const k = key(userId, groupId);
      setOverrides((prev) => ({
        ...prev,
        [k]: { state: "pending", markedAt: new Date().toISOString() },
      }));
    },
    [],
  );

  const cancelJoinRequest = useCallback(
    (userId: string, groupId: string) => {
      const k = key(userId, groupId);
      setOverrides((prev) => {
        if (!prev[k]) return prev;
        const next = { ...prev };
        delete next[k];
        return next;
      });
    },
    [],
  );

  const leaveGroup = useCallback(
    (userId: string, groupId: string) => {
      const k = key(userId, groupId);
      setOverrides((prev) => ({
        ...prev,
        [k]: { state: "none", markedAt: new Date().toISOString(), cleared: true },
      }));
    },
    [],
  );

  const getUserGroupIds = useCallback(
    (userId: string): Set<string> => {
      // Start with the seeded membership; apply overrides on top.
      const ids = new Set(getSeedUserGroups(userId).map((g) => g.id));
      for (const [k, override] of Object.entries(overrides)) {
        const [overrideUserId, groupId] = k.split("::");
        if (overrideUserId !== userId) continue;
        if (override.state === "member") {
          ids.add(groupId);
        } else if (override.state === "none" && override.cleared) {
          ids.delete(groupId);
        }
        // "pending" doesn't make them a member yet — not added to the set.
      }
      return ids;
    },
    [overrides],
  );

  const value = useMemo(
    () => ({
      getMembershipState,
      isMember,
      hasRequestedJoin,
      joinGroup,
      requestJoin,
      cancelJoinRequest,
      leaveGroup,
      getUserGroupIds,
      overrides,
    }),
    [
      getMembershipState,
      isMember,
      hasRequestedJoin,
      joinGroup,
      requestJoin,
      cancelJoinRequest,
      leaveGroup,
      getUserGroupIds,
      overrides,
    ],
  );

  return <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>;
}

export function useGroups() {
  return useContext(GroupsContext);
}
