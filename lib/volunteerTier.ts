/**
 * volunteerTier.ts — cross-shelter volunteer tier resolution + mentor
 * helpers (Cross-Shelter Mentor Network, 2026-06-09).
 *
 * Per-shelter tiers (vetted / experienced / trusted) stay per-shelter —
 * they gate what a walker may do at THAT shelter. The platform-level
 * **Super Volunteer** tier is the portable credential layered on top:
 * recognized at every participating shelter, it's what unlocks offering
 * mentor sessions and what a new shelter sees on an incoming application
 * ("Super Volunteer · 87 walks at Útulek · …").
 *
 * Demo resolution rule: platform Super Volunteer = cross-shelter walk
 * total ≥ 25 AND at least one affiliation at `trusted` tier (the
 * per-shelter coordinator sign-off carries into the platform tier).
 * Production rule per the Cold-Start Playbook is "real walks at any
 * participating shelter + ≥2 trainer vouches" — the demo substitutes the
 * trusted-affiliation check for the vouch count because vouch records
 * aren't modeled yet. ASSUMPTION A3 (portability is the load-bearing
 * claim; shelters may insist on per-shelter earning).
 *
 * All helpers are pure — dynamic state (WalkerApplications, Bookings)
 * is passed in by callers, matching the `getUserShelterAffiliations`
 * convention in lib/mockShelters.ts.
 */

import type {
  Booking,
  CarerMentorSessionServiceConfig,
  UserProfile,
  WalkerApplication,
} from "./types";
import { allUsers } from "./mockUsers";
import { getUserShelterAffiliations } from "./mockShelters";

export interface PlatformVolunteerStatus {
  /** True when the user holds the platform-level Super Volunteer tier. */
  isSuperVolunteer: boolean;
  /** Cross-shelter walk total (platform-logged + shelter-credited). */
  totalWalks: number;
  /** Number of shelters the user is a vouched walker at. */
  affiliationCount: number;
}

/** Map vouched WalkerApplications into the dynamic-affiliations shape
 *  `getUserShelterAffiliations` consumes. Pass `bookings` to fold
 *  completed shelter-walk Bookings into the per-shelter counts (G3 —
 *  real walks feed tier escalation; derived at read time). */
export function toDynamicVouched(
  userId: string,
  applications: WalkerApplication[],
  bookings: Booking[] = [],
): { shelterId: string; walkCount: number; vouchedAt: string; creditedWalkCount?: number }[] {
  return applications
    .filter((a) => a.userId === userId && a.state === "vouched")
    .map((a) => ({
      shelterId: a.shelterId,
      walkCount:
        (a.walkCount ?? 0) + countCompletedShelterWalks(userId, a.shelterId, bookings),
      vouchedAt: a.vouchedAt ?? a.appliedAt,
      creditedWalkCount: a.creditedWalkCount,
    }));
}

/** Resolve the platform-level volunteer tier for a user. */
export function getPlatformVolunteerTier(
  userId: string,
  applications: WalkerApplication[],
  bookings: Booking[] = [],
): PlatformVolunteerStatus {
  const affiliations = getUserShelterAffiliations(
    userId,
    toDynamicVouched(userId, applications, bookings),
  );
  const totalWalks = affiliations.reduce((sum, a) => sum + a.walkCount, 0);
  const hasTrustedAffiliation = affiliations.some((a) => a.tier === "trusted");
  return {
    isSuperVolunteer: totalWalks >= 25 && hasTrustedAffiliation,
    totalWalks,
    affiliationCount: affiliations.length,
  };
}

/**
 * Mentors offering mentor sessions at a given shelter — scans seeded
 * carer profiles for enabled `mentor_session` services whose `shelterIds`
 * include the shelter. Single-mentor demo world: returns Klára for
 * Útulek + Pes v nouzi, empty for Druhá šance (non-accepting).
 */
export function getMentorsForShelter(
  shelterId: string,
): { mentor: UserProfile; service: CarerMentorSessionServiceConfig }[] {
  const out: { mentor: UserProfile; service: CarerMentorSessionServiceConfig }[] = [];
  for (const user of allUsers) {
    const services = user.carerProfile?.services ?? [];
    for (const svc of services) {
      if (
        svc.kind === "mentor_session" &&
        svc.enabled &&
        !svc.softDeletedAt &&
        svc.shelterIds.includes(shelterId)
      ) {
        out.push({ mentor: user, service: svc });
      }
    }
  }
  return out;
}

/**
 * The user's mentorship history across ALL shelters — feeds the
 * "Mentor-recommended · N sessions with {mentor}" credibility line on
 * standard applications at non-accepting shelters (D2 fallback /
 * ASSUMPTION A10): mentor work is never wasted even where the vouch
 * isn't binding.
 */
export function getMentorshipHistory(
  userId: string,
  applications: WalkerApplication[],
): { totalSessions: number; mentorNames: string[] } {
  const mine = applications.filter(
    (a) => a.userId === userId && a.mentorship && a.mentorship.sessionsCompleted > 0,
  );
  const names = new Set<string>();
  let total = 0;
  for (const a of mine) {
    total += a.mentorship!.sessionsCompleted;
    names.add(a.mentorship!.mentorName);
  }
  return { totalSessions: total, mentorNames: [...names] };
}

/**
 * Completed shelter-walk bookings by this walker at this shelter —
 * real walks flow into the tier math alongside the application's
 * `walkCount` (which the "Log walk (demo)" toggle drives for
 * walkthrough speed). Derived at read time; no cross-context syncing.
 */
export function countCompletedShelterWalks(
  userId: string,
  shelterId: string,
  bookings: Booking[],
): number {
  return bookings.filter(
    (b) =>
      b.ownerKind === "shelter" &&
      b.ownerId === shelterId &&
      b.carerId === userId &&
      b.status === "completed",
  ).length;
}
