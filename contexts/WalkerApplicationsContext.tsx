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
 *
 * Cross-Shelter Mentor Network (2026-06-09) adds:
 *  - the mentor-vouched path (`beginMentorship` / `completeMentorSession`)
 *    — sessions at an accepting shelter graduate the mentee to `vouched`
 *    without the shelter's own intake (ASSUMPTION A1);
 *  - shelter-credited historical walks (`creditWalks`) — the bootstrap
 *    affordance, provenance-split from platform-logged walks (A7);
 *  - the two waiver layers (platform baseline signed once per user;
 *    per-shelter waiver on the application record) (A2).
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
const PLATFORM_WAIVER_KEY = "doggo-platform-waiver";
const TIER_OVERRIDES_KEY = "doggo-walker-tier-overrides";

/** Key for the per-(shelter, walker) tier-override map. */
export function tierOverrideKey(shelterId: string, userId: string): string {
  return `${shelterId}::${userId}`;
}

/**
 * Effective tier = the shelter's explicit call when one exists, else the
 * walk-count derivation. O4 resolution (2026-06-10): thresholds are
 * SUGGESTIONS — auto-promotion is the zero-admin default, but the tier
 * is ultimately the shelter's judgment, so shelters promote/demote
 * freely and their call wins. Because the platform Super Volunteer tier
 * requires a trusted affiliation, the shelter's lever transitively
 * controls platform status and mentor eligibility too.
 */
export function effectiveWalkerTier(
  walkCount: number,
  override: WalkerTier | undefined,
): WalkerTier {
  return override ?? deriveWalkerTier(walkCount);
}

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
  /**
   * Start the mentor-vouched path at a shelter — upserts an application
   * carrying a `mentorship` ref. Called when the mentee books their first
   * mentor session. Existing non-mentorship applications gain the ref
   * (the two paths converge on one record per (user, shelter)).
   */
  beginMentorship: (
    userId: string,
    shelterId: string,
    mentor: { id: string; name: string },
    /** The dog the mentee is working toward, when the flow started from
     *  a dog's profile. Anchors the adoption funnel (mentor-discovery
     *  rework, 2026-06-11). Set on first booking; not overwritten by
     *  later sessions. */
    dog?: { id: string; name: string },
  ) => void;
  /**
   * Record a completed mentor session. When the shelter accepts
   * mentor-vouches and the new count reaches `minimum`, the application
   * auto-advances to `vouched` with `vouchedVia: "mentor"` — the
   * graduation moment (D2). Caller detects graduation by comparing
   * sessionsCompleted before/after against the minimum.
   */
  completeMentorSession: (
    userId: string,
    shelterId: string,
    policy: { acceptsMentorVouches: boolean; minimum: number },
  ) => void;
  /**
   * Bootstrap affordance (D5, operator stub): the shelter credits
   * historical real-world walks. Upserts a vouched application with the
   * credited count provenance-split from platform-logged walks. A user
   * with no application is vouched in the same act — crediting IS the
   * shelter staking its reputation on the walker (A7).
   */
  creditWalks: (userId: string, shelterId: string, count: number) => void;
  /** Sign this shelter's specific waiver (layer 2 of D4). Updates the
   *  existing application; no-op when none exists yet. */
  signShelterWaiver: (userId: string, shelterId: string) => void;
  /** ISO timestamp the user signed the platform baseline waiver (layer 1
   *  of D4 — identity + emergency contact + general liability, signed
   *  ONCE, carried across shelters). Undefined = not signed. */
  getPlatformWaiverSignedAt: (userId: string) => string | undefined;
  signPlatformWaiver: (userId: string) => void;
  /**
   * Per-(shelter, walker) tier overrides — the shelter's explicit
   * promote/demote calls (O4 resolution, 2026-06-10). Keyed by
   * `tierOverrideKey(shelterId, userId)`. Applies to static-roster AND
   * dynamic walkers; readers resolve via `effectiveWalkerTier`. Demo
   * surface: the "(demo)" promote/demote dropdown on Members-tab rows —
   * an operator stub per scope discipline 2; the real home is FC16's
   * walker pool management.
   */
  tierOverrides: Record<string, WalkerTier>;
  setTierOverride: (shelterId: string, userId: string, tier: WalkerTier) => void;
}

const WalkerApplicationsContext = createContext<WalkerApplicationsContextValue | undefined>(undefined);

export function WalkerApplicationsProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = usePersistedState<WalkerApplication[]>(
    STORAGE_KEY,
    [],
    { seedVersion: APPLICATIONS_SEED_VERSION },
  );
  // Platform baseline waiver — keyed by userId, value is the ISO signing
  // timestamp. Lives here (not on the static UserProfile mock) so the
  // sign-once moment is drivable in the demo and survives reloads.
  const [platformWaivers, setPlatformWaivers] = usePersistedState<Record<string, string>>(
    PLATFORM_WAIVER_KEY,
    {},
  );
  // Shelter tier overrides — covers static-roster walkers too (their
  // seeded records are module constants), so the map lives here rather
  // than as a field on either record shape.
  const [tierOverrides, setTierOverrides] = usePersistedState<Record<string, WalkerTier>>(
    TIER_OVERRIDES_KEY,
    {},
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
          if (a.state === "invited") return { ...a, state: "vouched", vouchedAt: new Date().toISOString(), vouchedVia: "shelter" as const };
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

  const beginMentorship = useCallback(
    (
      userId: string,
      shelterId: string,
      mentor: { id: string; name: string },
      dog?: { id: string; name: string },
    ) => {
      const newMentorship = {
        mentorId: mentor.id,
        mentorName: mentor.name,
        sessionsCompleted: 0,
        ...(dog ? { workingTowardDogId: dog.id, workingTowardDogName: dog.name } : {}),
      };
      setApplications((prev) => {
        const existing = prev.find((a) => a.userId === userId && a.shelterId === shelterId);
        if (existing) {
          if (existing.mentorship) {
            // Mentorship exists — only fill in the working-toward dog if
            // it wasn't anchored yet (the first dog sets the journey).
            if (existing.mentorship.workingTowardDogId || !dog) return prev;
            return prev.map((a) =>
              a === existing
                ? {
                    ...a,
                    mentorship: {
                      ...a.mentorship!,
                      workingTowardDogId: dog.id,
                      workingTowardDogName: dog.name,
                    },
                  }
                : a,
            );
          }
          return prev.map((a) =>
            a === existing ? { ...a, mentorship: newMentorship } : a,
          );
        }
        return [
          ...prev,
          {
            id: `app-${userId}-${shelterId}-${Date.now()}`,
            userId,
            shelterId,
            state: "applied" as WalkerApplicationState,
            message: `Mentor-path application via ${mentor.name}.`,
            appliedAt: new Date().toISOString(),
            mentorship: newMentorship,
          },
        ];
      });
    },
    [setApplications],
  );

  const completeMentorSession = useCallback(
    (
      userId: string,
      shelterId: string,
      policy: { acceptsMentorVouches: boolean; minimum: number },
    ) => {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.userId !== userId || a.shelterId !== shelterId || !a.mentorship) return a;
          const sessionsCompleted = a.mentorship.sessionsCompleted + 1;
          const graduates =
            policy.acceptsMentorVouches &&
            a.state !== "vouched" &&
            sessionsCompleted >= policy.minimum;
          return {
            ...a,
            mentorship: { ...a.mentorship, sessionsCompleted },
            ...(graduates
              ? {
                  state: "vouched" as WalkerApplicationState,
                  vouchedAt: new Date().toISOString(),
                  vouchedVia: "mentor" as const,
                }
              : {}),
          };
        }),
      );
    },
    [setApplications],
  );

  const creditWalks = useCallback(
    (userId: string, shelterId: string, count: number) => {
      setApplications((prev) => {
        const existing = prev.find((a) => a.userId === userId && a.shelterId === shelterId);
        if (existing) {
          return prev.map((a) =>
            a === existing
              ? {
                  ...a,
                  state: "vouched" as WalkerApplicationState,
                  vouchedAt: a.vouchedAt ?? new Date().toISOString(),
                  vouchedVia: a.vouchedVia ?? ("shelter" as const),
                  walkCount: (a.walkCount ?? 0) + count,
                  creditedWalkCount: (a.creditedWalkCount ?? 0) + count,
                }
              : a,
          );
        }
        return [
          ...prev,
          {
            id: `app-${userId}-${shelterId}-${Date.now()}`,
            userId,
            shelterId,
            state: "vouched" as WalkerApplicationState,
            message: "Shelter-credited historical walker (bootstrap).",
            appliedAt: new Date().toISOString(),
            vouchedAt: new Date().toISOString(),
            vouchedVia: "shelter" as const,
            walkCount: count,
            creditedWalkCount: count,
          },
        ];
      });
    },
    [setApplications],
  );

  const signShelterWaiver = useCallback(
    (userId: string, shelterId: string) => {
      setApplications((prev) =>
        prev.map((a) =>
          a.userId === userId && a.shelterId === shelterId && !a.shelterWaiverSignedAt
            ? { ...a, shelterWaiverSignedAt: new Date().toISOString() }
            : a,
        ),
      );
    },
    [setApplications],
  );

  const getPlatformWaiverSignedAt = useCallback(
    (userId: string) => platformWaivers[userId],
    [platformWaivers],
  );

  const signPlatformWaiver = useCallback(
    (userId: string) => {
      setPlatformWaivers((prev) =>
        prev[userId] ? prev : { ...prev, [userId]: new Date().toISOString() },
      );
    },
    [setPlatformWaivers],
  );

  const setTierOverride = useCallback(
    (shelterId: string, userId: string, tier: WalkerTier) => {
      setTierOverrides((prev) => ({
        ...prev,
        [tierOverrideKey(shelterId, userId)]: tier,
      }));
    },
    [setTierOverrides],
  );

  return (
    <WalkerApplicationsContext.Provider
      value={{
        applications,
        getApplication,
        apply,
        advance,
        withdraw,
        logWalk,
        beginMentorship,
        completeMentorSession,
        creditWalks,
        signShelterWaiver,
        getPlatformWaiverSignedAt,
        signPlatformWaiver,
        tierOverrides,
        setTierOverride,
      }}
    >
      {children}
    </WalkerApplicationsContext.Provider>
  );
}

export function useWalkerApplications(): WalkerApplicationsContextValue {
  const ctx = useContext(WalkerApplicationsContext);
  if (!ctx) throw new Error("useWalkerApplications must be used within WalkerApplicationsProvider");
  return ctx;
}
