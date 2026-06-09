import type { CarerCredentials, UserProfile } from "./types";
import { getConnectionsForViewer } from "./mockConnections";
import { mockMeets } from "./mockMeets";
import { mockBookings } from "./mockBookings";
import { getUserById } from "./mockUsers";

/**
 * Trust badge MVP — Discover & Care D3 (2026-05-02).
 *
 * Six badges across three categories. The full taxonomy lives in
 * `Competitive Research - Prague Dog Care Scene.md`; this file ships the
 * subset wired to actual data so the prototype can demonstrate the trust
 * layer without overrunning every card with pills.
 *
 * Display priority (when trimming to top N): community-earned > credential
 * > platform.
 *
 * See [[implementation/badges]] for surface-by-surface display rules.
 */

export type TrustBadgeKind =
  // Community-earned
  | "carer-portfolio"        // aggregate engagement count (credentialing-moat phase)
  | "community-regular"
  | "trusted-by-network"
  | "repeat-clients"
  // Credential (self-declared)
  | "certified-trainer"
  | "vet-degree"
  | "years-experience"
  // Platform
  | "verified-identity";

export type TrustBadgeCategory = "community" | "credential" | "platform";

export interface TrustBadge {
  kind: TrustBadgeKind;
  category: TrustBadgeCategory;
  label: string;
  /** Longer text shown on tap/hover. */
  detail?: string;
  /** Carer Portfolio only: tier metadata used by the credential-pill renderer. */
  tier?: 1 | 2 | 3;
  /** Carer Portfolio only: total engagement count for the subtitle on profile hero. */
  sessionCount?: number;
}

/** Priority weight — lower number renders first. Carer Portfolio leads
 *  because it's the aggregate headline credential; the others are
 *  supporting trust signals. */
const PRIORITY: Record<TrustBadgeKind, number> = {
  "carer-portfolio": 0,
  "trusted-by-network": 1,
  "community-regular": 2,
  "repeat-clients": 3,
  "certified-trainer": 4,
  "vet-degree": 4,
  "years-experience": 5,
  "verified-identity": 6,
};

const COMMUNITY_REGULAR_THRESHOLD_DAYS = 90;
const COMMUNITY_REGULAR_MIN_MEETS = 3;
const REPEAT_CLIENTS_MIN = 3;

/** Carer Portfolio tier thresholds — resolved at §8 / 2026-06-01:
 *  3-9 sessions → Tier 1, 10-24 → Tier 2, 25+ → Tier 3, below 3 → no badge. */
const CARER_PORTFOLIO_MIN = 3;
const CARER_PORTFOLIO_T2_THRESHOLD = 10;
const CARER_PORTFOLIO_T3_THRESHOLD = 25;

/** Count meets the user attended (Going) within the last N days. */
function countRecentMeets(userId: string, withinDays: number): number {
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  let count = 0;
  for (const meet of mockMeets) {
    if (meet.cadence === "one_off") {
      const went = meet.attendees.some(
        (a) => a.userId === userId && (a.rsvpStatus ?? "going") === "going",
      );
      if (!went) continue;
      const meetMs = new Date(`${meet.date}T${meet.time}`).getTime();
      if (meetMs >= cutoff && meetMs <= Date.now()) count++;
      continue;
    }
    const byDate = meet.attendeesByDate ?? {};
    for (const [date, list] of Object.entries(byDate)) {
      const occMs = new Date(`${date}T${meet.time}`).getTime();
      if (occMs < cutoff || occMs > Date.now()) continue;
      const went = list.some(
        (a) => a.userId === userId && (a.rsvpStatus ?? "going") === "going",
      );
      if (went) count++;
    }
  }
  return count;
}

/**
 * Carer Portfolio engagement counter (A1).
 *
 * Counts verifiable engagement records for `userId`:
 *   - Bookings where `status === "completed"` AND `carerId === userId`
 *   - Past meet occurrences hosted by `userId` (one-off in the past;
 *     recurring with at least one past occurrence date)
 *   - Plus any `carerProfile.seededCompletedSessions` topped up for
 *     demo purposes (same precedent as `repeatClients`; production
 *     derives the full count from booking + meet history)
 *
 * Returns `{ bookings, sessions }` where `sessions = bookings + hosted
 * meet occurrences + seeded`. Per §8 (2026-06-01), the aggregate
 * combines bookings and meets because both are two-sided ground-truth
 * engagement (owner engaged → carer delivered → record exists).
 */
export function getCompletedEngagements(userId: string): { bookings: number; sessions: number } {
  const bookings = mockBookings.filter(
    (b) => b.status === "completed" && b.carerId === userId,
  ).length;

  let hostedOccurrences = 0;
  const now = Date.now();
  for (const meet of mockMeets) {
    if (meet.creatorId !== userId) continue;
    if (meet.cadence === "one_off") {
      const meetMs = new Date(`${meet.date}T${meet.time}`).getTime();
      if (meetMs <= now) hostedOccurrences++;
      continue;
    }
    const byDate = meet.attendeesByDate ?? {};
    for (const date of Object.keys(byDate)) {
      const occMs = new Date(`${date}T${meet.time}`).getTime();
      if (occMs <= now) hostedOccurrences++;
    }
  }

  const seeded = getUserById(userId)?.carerProfile?.seededCompletedSessions ?? 0;
  return { bookings, sessions: bookings + hostedOccurrences + seeded };
}

/** Map a session count to the Carer Portfolio tier (1/2/3) or null
 *  when below the entry threshold. */
export function getCarerPortfolioTier(sessions: number): 1 | 2 | 3 | null {
  if (sessions < CARER_PORTFOLIO_MIN) return null;
  if (sessions < CARER_PORTFOLIO_T2_THRESHOLD) return 1;
  if (sessions < CARER_PORTFOLIO_T3_THRESHOLD) return 2;
  return 3;
}

/** Per-circle-member booking trail used by the Discover-card row and the
 *  profile "Booked by people you know" section (Workstream E). */
export interface CircleAttributionMember {
  /** Owner's userId. */
  reviewerId: string;
  /** One of their completed bookings with the provider — `bookingId` is
   *  the anchor for surfacing a review excerpt later in F. */
  bookingId: string;
}

export interface CircleAttribution {
  /** Distinct Connected-to-viewer owners with at least one completed
   *  booking against `providerId`. Empty array (NOT null) when none —
   *  caller renders silent absence at count===0 per E5. */
  count: number;
  members: CircleAttributionMember[];
}

/**
 * Circle attribution helper (E1).
 *
 * Returns the subset of `viewer`'s Connected connections who have a
 * completed Booking with `providerId` as the carer. Privacy: only
 * surfaces members the viewer is Connected to — no Familiar leakage,
 * no inference about other Connected-Connected relationships beyond
 * what the viewer can already see.
 *
 * Caller decides surface: Discover Card renders count only ("{N} in
 * your circle have booked them"); provider profile renders the named
 * PersonRow stack for Connected members (review excerpt comes later
 * via F's BookingReview model).
 */
export function getCircleAttribution(
  viewerId: string | null | undefined,
  providerId: string,
): CircleAttribution {
  if (!viewerId || viewerId === providerId) {
    return { count: 0, members: [] };
  }
  const connectedIds = new Set(
    getConnectionsForViewer(viewerId)
      .filter((c) => c.state === "connected")
      .map((c) => c.userId),
  );
  if (connectedIds.size === 0) return { count: 0, members: [] };
  const seen = new Set<string>();
  const members: CircleAttributionMember[] = [];
  for (const b of mockBookings) {
    if (b.status !== "completed") continue;
    if (b.carerId !== providerId) continue;
    if (!connectedIds.has(b.ownerId)) continue;
    if (seen.has(b.ownerId)) continue;
    seen.add(b.ownerId);
    members.push({ reviewerId: b.ownerId, bookingId: b.id });
  }
  return { count: members.length, members };
}

/** How many of viewer's Connected connections are also Connected to subject. */
function countMutualConnections(viewerId: string, subjectId: string): number {
  if (!viewerId || viewerId === subjectId) return 0;
  const viewerConns = getConnectionsForViewer(viewerId).filter(
    (c) => c.state === "connected",
  );
  let count = 0;
  for (const conn of viewerConns) {
    const theirs = getConnectionsForViewer(conn.userId);
    if (
      theirs.some(
        (other) => other.userId === subjectId && other.state === "connected",
      )
    ) {
      count++;
    }
  }
  return count;
}

/**
 * Minimal subject shape for badge derivation. Both UserProfile (via the
 * `userProfileToTrustSubject` adapter) and ProviderCard (directory-only
 * listings) can map to this shape, so badges work uniformly across both
 * provider sources.
 */
export interface TrustSubject {
  id: string;
  firstName: string;
  credentials?: CarerCredentials;
  repeatClients?: number;
  /** Carrier of subject's Carer audience setting — feeds the
   *  carer-portfolio privacy gate (circle-Carers' aggregate hides
   *  from non-Connected viewers, mirroring `getCarerIdentity`). */
  carerPublicProfile?: boolean;
}

/** Adapter: extract a TrustSubject from a UserProfile (preferred path
 *  when a real user account exists). */
export function userProfileToTrustSubject(user: UserProfile): TrustSubject {
  return {
    id: user.id,
    firstName: user.firstName,
    credentials: user.carerProfile?.credentials,
    repeatClients: user.carerProfile?.repeatClients,
    carerPublicProfile: user.carerProfile?.publicProfile,
  };
}

/** Whether viewer is Connected to subject. Same pattern as the Identity
 *  badge's privacy gate — used by the carer-portfolio aggregate to
 *  respect circle-Carer privacy. Self always counts as Connected. */
function isViewerConnectedTo(viewerId: string | null | undefined, subjectId: string): boolean {
  if (!viewerId) return false;
  if (viewerId === subjectId) return true;
  return getConnectionsForViewer(viewerId).some(
    (c) => c.userId === subjectId && c.state === "connected",
  );
}

/**
 * Earned trust badges for `subject` from `viewer`'s perspective.
 * Returns sorted by display priority. Caller decides how many to render
 * (cards: top 2-3; profile hero: all).
 */
export function getTrustBadges(
  subject: TrustSubject,
  viewerId: string | null | undefined,
): TrustBadge[] {
  const out: TrustBadge[] = [];

  // ── Carer Portfolio aggregate ──
  // Privacy gate (C1): circle-Carers' aggregate hides from non-Connected
  // viewers — same rule as the Identity badge (see lib/identityBadges.ts).
  // Open-Carers (publicProfile === true) and undefined (non-Carers fall
  // through to the threshold check anyway) skip the gate.
  const isCircleCarer = subject.carerPublicProfile === false;
  const carerVisible = !isCircleCarer || isViewerConnectedTo(viewerId, subject.id);
  if (carerVisible) {
    const engagements = getCompletedEngagements(subject.id);
    const carerTier = getCarerPortfolioTier(engagements.sessions);
    if (carerTier !== null) {
      out.push({
        kind: "carer-portfolio",
        category: "community",
        label: carerTier === 3 ? "Trusted Carer" : "Carer",
        detail: `${engagements.sessions} completed sessions.`,
        tier: carerTier,
        sessionCount: engagements.sessions,
      });
    }
  }

  // ── Community-earned ──
  const recentMeetCount = countRecentMeets(subject.id, COMMUNITY_REGULAR_THRESHOLD_DAYS);
  if (recentMeetCount >= COMMUNITY_REGULAR_MIN_MEETS) {
    out.push({
      kind: "community-regular",
      category: "community",
      label: "Community Regular",
      detail: `Active in ${recentMeetCount} meets in the last ${COMMUNITY_REGULAR_THRESHOLD_DAYS} days.`,
    });
  }

  if (viewerId) {
    const mutual = countMutualConnections(viewerId, subject.id);
    if (mutual >= 1) {
      out.push({
        kind: "trusted-by-network",
        category: "community",
        label: "Trusted by your network",
        detail: `${mutual} of your connections ${mutual === 1 ? "is" : "are"} connected to ${subject.firstName}.`,
      });
    }
  }

  if ((subject.repeatClients ?? 0) >= REPEAT_CLIENTS_MIN) {
    out.push({
      kind: "repeat-clients",
      category: "community",
      label: "Repeat clients",
      detail: `${subject.repeatClients} owners have booked 3+ times.`,
    });
  }

  // ── Credential (self-declared) ──
  const certs = subject.credentials?.certifications ?? [];
  const trainerCert = certs.find((c) => /train/i.test(c));
  if (trainerCert) {
    out.push({
      kind: "certified-trainer",
      category: "credential",
      label: "Certified trainer",
      detail: trainerCert,
    });
  }
  const vetCert = certs.find((c) => /\bvet\b|veterinary|dvm/i.test(c));
  if (vetCert) {
    out.push({
      kind: "vet-degree",
      category: "credential",
      label: "Veterinary degree",
      detail: vetCert,
    });
  }

  const years = subject.credentials?.yearsExperience;
  if (years && years >= 1) {
    out.push({
      kind: "years-experience",
      category: "credential",
      label: `${years} years experience`,
    });
  }

  // ── Platform ──
  if (subject.credentials?.identityVerified) {
    out.push({
      kind: "verified-identity",
      category: "platform",
      label: "Verified identity",
      detail: "Doggo confirmed this person's identity.",
    });
  }

  return out.sort((a, b) => PRIORITY[a.kind] - PRIORITY[b.kind]);
}
