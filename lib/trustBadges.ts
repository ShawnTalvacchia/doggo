import type { CarerCredentials, UserProfile } from "./types";
import { getConnectionsForViewer } from "./mockConnections";
import { mockMeets } from "./mockMeets";

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
}

/** Priority weight — lower number renders first. */
const PRIORITY: Record<TrustBadgeKind, number> = {
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
}

/** Adapter: extract a TrustSubject from a UserProfile (preferred path
 *  when a real user account exists). */
export function userProfileToTrustSubject(user: UserProfile): TrustSubject {
  return {
    id: user.id,
    firstName: user.firstName,
    credentials: user.carerProfile?.credentials,
    repeatClients: user.carerProfile?.repeatClients,
  };
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
