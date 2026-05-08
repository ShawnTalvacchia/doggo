import type { Meet, MeetAttendee, MeetOccurrence } from "@/lib/types";
import type { MeetRole } from "@/components/meets/CardMeet";
import { getConnectionState } from "@/lib/mockConnections";

// ── Recurrence helpers ────────────────────────────────────────────────────────
//
// Doggo's recurrence model (see `docs/phases/meet-recurrence-model.md`):
//   - `cadence === "one_off"` → non-recurring meet; attendees live on `meet.attendees`.
//   - `cadence !== "one_off"` → recurring series; per-date attendees live on
//     `meet.attendeesByDate[ISO]`; series-level subscription on `meet.followers`.
//
// Strategy is sparse: `attendeesByDate` only contains keys where someone has
// RSVP'd or where mock data seeded an occurrence. `nextOccurrenceDates` derives
// upcoming dates from `(date, cadence)` at render time. Higher-level surfaces
// (Schedule, Discover, meet detail) should read via the Workstream-C helpers
// rather than poking at these fields directly.

/** Convenience: is this meet a recurring series? */
export function isRecurring(meet: Meet): boolean {
  return meet.cadence !== "one_off";
}

/**
 * True iff `viewerId` is allowed to see this meet at all. Source-of-truth for
 * the `participants_only` visibility level — filters contracted/package-booked
 * instances (e.g. Hana's 8-session 1-on-1 with Klára) from group Meets tabs,
 * Discover, and Schedule's suggested lane. The creator and the booked roster
 * always pass through.
 *
 * `public` and `group_only` always return true here — those visibilities are
 * gated by the *parent group*'s membership, not by this helper.
 */
export function isMeetVisibleTo(meet: Meet, viewerId: string | null | undefined): boolean {
  if (meet.visibility !== "participants_only") return true;
  if (!viewerId) return false;
  if (meet.creatorId === viewerId) return true;
  return getSeriesAttendees(meet).some((a) => a.userId === viewerId);
}

/**
 * Human-readable label for a meet's cadence — used on cards and the meet
 * detail badge row. Returns `null` for one-off meets so the caller can
 * skip rendering the chip entirely.
 */
export function recurrenceLabel(meet: Meet): string | null {
  switch (meet.cadence) {
    case "weekly":
      return "Weekly";
    case "biweekly":
      return "Biweekly";
    case "monthly":
      return "Monthly";
    case "one_off":
    default:
      return null;
  }
}

/**
 * Parse a YYYY-MM-DD string as a local-date `Date`. Avoids the UTC-shift
 * pitfall of `new Date("2026-04-27")` (which parses as 00:00 UTC and can
 * land on 04-26 in negative-offset locales).
 */
function parseLocalISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Format a `Date` back to YYYY-MM-DD using its local-time fields. */
function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfLocalDay(d: Date): Date {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  return s;
}

/**
 * Compute the next `count` occurrence dates for a recurring meet, anchored to
 * `(meet.date, meet.cadence)`. Returns ISO YYYY-MM-DD strings in chronological
 * order, only including dates `>= from` (defaults to today). Honors
 * `seriesEndDate` if set — stops generating after that date.
 *
 * Returns `[]` for `cadence: "one_off"` meets — use `meet.date` directly.
 *
 * Cadence semantics:
 *   - `"weekly"`    → +7 days
 *   - `"biweekly"`  → +14 days
 *   - `"monthly"`   → same calendar day next month (JS Date rollover handles
 *                     short months naturally — e.g. Jan 31 → Mar 3).
 */
export function nextOccurrenceDates(
  meet: Meet,
  count: number,
  from: Date = new Date(),
): string[] {
  if (meet.cadence === "one_off") return [];

  const fromTime = startOfLocalDay(from).getTime();
  const endTime = meet.seriesEndDate
    ? startOfLocalDay(parseLocalISODate(meet.seriesEndDate)).getTime()
    : null;

  const step = (d: Date): Date => {
    const next = new Date(d);
    if (meet.cadence === "weekly") next.setDate(next.getDate() + 7);
    else if (meet.cadence === "biweekly") next.setDate(next.getDate() + 14);
    else if (meet.cadence === "monthly") next.setMonth(next.getMonth() + 1);
    return next;
  };

  let cursor = parseLocalISODate(meet.date);
  while (cursor.getTime() < fromTime) {
    cursor = step(cursor);
    if (endTime !== null && cursor.getTime() > endTime) return [];
  }

  const out: string[] = [];
  while (out.length < count) {
    if (endTime !== null && cursor.getTime() > endTime) break;
    out.push(toLocalISODate(cursor));
    cursor = step(cursor);
  }
  return out;
}

/**
 * Resolve the attendee list for a meet at a specific date.
 *
 * - One-off (`cadence: "one_off"`): returns `meet.attendees`. The `date` arg
 *   is ignored (callers may pass `meet.date` for symmetry).
 * - Recurring: returns `meet.attendeesByDate?.[date] ?? []`. Dates with no
 *   recorded RSVPs come back empty, never undefined.
 *
 * This is the single primitive other helpers and UI surfaces should use to
 * read per-occurrence attendees. Don't poke at `attendeesByDate` directly —
 * callers can forget the one-off fallback.
 */
export function getOccurrenceAttendees(meet: Meet, date: string): MeetAttendee[] {
  if (meet.cadence === "one_off") return meet.attendees;
  return meet.attendeesByDate?.[date] ?? [];
}

/**
 * The single date a card-style summary should display for this meet.
 *
 * - One-off: `meet.date`.
 * - Recurring with at least one upcoming occurrence: the next upcoming date.
 * - Recurring with no upcoming occurrences (series ended via `seriesEndDate`,
 *   or anchored entirely in the past with no further dates): falls back to
 *   `meet.date` so the card has *something* to render.
 *
 * Use this for surfaces that show a single date — Discover cards, group-detail
 * Meets-tab cards, the chat-context compact strip. Surfaces that render
 * multiple occurrences (Schedule, recurring-meet detail Upcoming Dates section)
 * should call `getMeetOccurrences` directly instead.
 */
export function getDisplayDate(meet: Meet): string {
  if (meet.cadence === "one_off") return meet.date;
  const next = nextOccurrenceDates(meet, 1);
  return next[0] ?? meet.date;
}

/**
 * True iff a specific occurrence of a recurring meet has been cancelled by
 * the host. Series-level cancellation (`meet.status === "cancelled"`) is a
 * separate concept — that kills the whole series.
 *
 * For one-off meets the per-occurrence concept doesn't apply; falls back to
 * the series-level cancellation flag so callers can use one helper for both
 * shapes when they need to ask "is this (meet, date) cancelled."
 */
export function isOccurrenceCancelled(meet: Meet, date: string): boolean {
  if (meet.cadence === "one_off") return meet.status === "cancelled";
  return Boolean(meet.cancelledDates?.[date]);
}

/**
 * Reason a specific occurrence was cancelled, if any. Mirrors
 * `isOccurrenceCancelled` — returns the series-level cancellation reason for
 * one-off meets, the per-date reason for recurring.
 */
export function getOccurrenceCancellation(
  meet: Meet,
  date: string,
): { reason: string; cancelledAt: string } | null {
  if (meet.cadence === "one_off") {
    if (meet.status !== "cancelled") return null;
    return {
      reason: meet.cancellationReason ?? "",
      cancelledAt: meet.createdAt,
    };
  }
  return meet.cancelledDates?.[date] ?? null;
}

/**
 * Resolve the next `count` occurrences of a meet, with attendees pre-attached.
 *
 * - One-off: returns a single occurrence at `meet.date` with `meet.attendees`.
 * - Recurring: derives the next `count` dates from `(meet.date, meet.cadence)`
 *   via `nextOccurrenceDates`, then attaches `attendeesByDate[date] ?? []` to
 *   each. `from` defaults to today and skips any past occurrences.
 *
 * This is the canonical read path for "what's coming up for this meet?"
 * surfaces — meet detail's Upcoming Dates section, Discover's "Next: [date]"
 * label, group detail's Meets tab when listing series.
 */
export function getMeetOccurrences(
  meet: Meet,
  count: number,
  from: Date = new Date(),
): MeetOccurrence[] {
  if (meet.cadence === "one_off") {
    return [{ meet, date: meet.date, attendees: meet.attendees }];
  }
  return nextOccurrenceDates(meet, count, from).map((date) => ({
    meet,
    date,
    attendees: meet.attendeesByDate?.[date] ?? [],
  }));
}

/**
 * Determine the current user's role in a meet.
 *
 * `date` is optional and only meaningful for recurring meets:
 *   - If provided: role is computed from that specific occurrence's attendee
 *     list (`attendeesByDate[date]`).
 *   - If omitted on a recurring meet: returns the *series-level* role —
 *     "hosting" if the user is the creator, "joining" otherwise. Use the
 *     date form when rendering instance-aware UI (Schedule cards, the
 *     per-occurrence RSVP rows on meet detail).
 *
 * For one-off meets, `date` is ignored — role is read from `meet.attendees`.
 */
export function getMeetRole(meet: Meet, userId: string, date?: string): MeetRole {
  if (meet.creatorId === userId) return "hosting";
  const list =
    meet.cadence === "one_off"
      ? meet.attendees
      : date
        ? meet.attendeesByDate?.[date] ?? []
        : null;
  // No date on a recurring meet → series-level fallback (no attendee list to inspect).
  if (list === null) return "joining";
  const attendee = list.find((a) => a.userId === userId);
  if (attendee?.rsvpStatus === "interested") return "interested";
  return "joining";
}

/**
 * Series-level "All" roster: union of every Going attendee across every
 * occurrence of a recurring meet (past + upcoming), deduped by userId. For
 * one-off meets, returns `meet.attendees` as-is.
 *
 * Drives the People tab "All" lens for recurring meets — the community view
 * that answers "who is this group of people" rather than "who's coming
 * Wednesday." Per-date rosters live behind the date pills via
 * `getOccurrenceAttendees`.
 *
 * Dedup strategy: keep the most recent occurrence's entry per userId. Later
 * occurrences may carry updated avatar/dog data; "most recent" is the
 * freshest snapshot. `rsvpStatus === "interested"` entries are excluded —
 * Interested is a per-occurrence soft signal, not series membership. Series-
 * level Interested followers come from `meet.followers` and are surfaced
 * separately via `getSeriesFollowers` in `lib/mockMeets.ts`.
 *
 * Pure — no I/O.
 */
export function getSeriesAttendees(meet: Meet): MeetAttendee[] {
  if (meet.cadence === "one_off") return meet.attendees;

  const seen = new Map<string, MeetAttendee>();
  const byDate = meet.attendeesByDate ?? {};

  // Sort dates ascending so later occurrences override earlier ones in the
  // dedup map — the freshest snapshot wins.
  const sortedDates = Object.keys(byDate).sort();
  for (const date of sortedDates) {
    const list = byDate[date];
    for (const attendee of list) {
      if ((attendee.rsvpStatus ?? "going") === "going") {
        seen.set(attendee.userId, attendee);
      }
    }
  }

  return Array.from(seen.values());
}

/**
 * True iff the viewer has attended this meet (or any past occurrence of it).
 * Drives the People-tab action gating per the disclosure model — the
 * "earned reward" for showing up is the deepening, not the visibility
 * (`Trust & Connection Model.md` → Meet participant visibility rules).
 *
 * One-off meets: requires `meet.status === "completed"` AND viewer was Going
 *   on `meet.attendees`.
 * Recurring meets: any past occurrence (date < today, local) where viewer
 *   was Going on `attendeesByDate[date]`. For recurring meets, `meet.status`
 *   is unreliable (carries the legacy create-time value); occurrence dates
 *   are the source of truth — see Meets Deep Pass / Meet Recurrence Model
 *   notes.
 *
 * Pure — no I/O. The companion query for "any past meet with this other
 * person" lives in `lib/mockMeets.ts:viewerSharedMeetWith` (needs access
 * to the full meets collection).
 */
export function viewerCanAct(meet: Meet, viewerId: string): boolean {
  if (meet.cadence === "one_off") {
    if (meet.status !== "completed") return false;
    return meet.attendees.some(
      (a) => a.userId === viewerId && (a.rsvpStatus ?? "going") === "going",
    );
  }

  // Recurring: any past occurrence where viewer was Going.
  const todayStart = startOfLocalDay(new Date()).getTime();
  const byDate = meet.attendeesByDate ?? {};
  for (const [date, list] of Object.entries(byDate)) {
    const dateTime = startOfLocalDay(parseLocalISODate(date)).getTime();
    if (dateTime >= todayStart) continue;
    if (list.some((a) => a.userId === viewerId && (a.rsvpStatus ?? "going") === "going")) {
      return true;
    }
  }
  return false;
}

/**
 * Visibility-tier an attendee per the Trust & Connection Model
 * (`docs/strategy/Trust & Connection Model.md` → Meet participant visibility rules):
 *
 *   Tier 1: Connected (includes the viewer themselves)
 *   Tier 2: Familiar (either direction), Pending, Open profiles — fully actionable
 *   Tier 3: Locked + None — minimal rendering, no actions
 *
 * "Familiar (either direction)" — outbound (`state === "familiar"`, viewer marked
 * subject) AND inbound (`conn.theyMarkedFamiliar`, subject marked viewer). The
 * inbound case grants the viewer expanded visibility into the subject, so a
 * tier-3 collapse there would be incorrect — see Trust & Visibility Pass D2.
 * The deniability guardrail (no UI may explain WHY a row was promoted) lives
 * in the consuming surfaces (PersonRow pill suppression, ConnectionIcon collapse).
 *
 * Canonical implementation for attendee tiering. Meet detail (summary card
 * + People tab) and the post-meet review flow both read from here.
 *
 * `currentUserId` is required (no default) so a missed callsite during
 * persona switching surfaces at type-check time rather than silently
 * tiering against Shawn — see persona-wiring.md C3.
 */
export function getAttendeeTier(
  a: MeetAttendee,
  currentUserId: string,
): 1 | 2 | 3 {
  if (a.userId === currentUserId) return 1;
  const conn = getConnectionState(a.userId, currentUserId);
  const state = conn?.state ?? "none";
  const theyMarkedFamiliar = conn?.theyMarkedFamiliar ?? false;
  const isOpen = a.profileOpen ?? conn?.profileOpen ?? false;

  // Tier promotion is about VIEWER visibility into SUBJECT, not the viewer's
  // outbound actions. Outbound state="familiar" (viewer marked subject) is
  // *the marker opening up to the marked* — it doesn't grant the viewer
  // visibility into the subject. So we don't promote on outbound Familiar.
  // Only inbound (`theyMarkedFamiliar`), Open, Pending, and Connected
  // genuinely expose more of the subject to the viewer. See
  // `Trust & Connection Model.md` → "What the Familiar mark does (and does
  // not do)" for the asymmetry.
  if (state === "connected") return 1;
  if (state === "pending" || theyMarkedFamiliar || isOpen) return 2;
  return 3;
}

/**
 * Attendees the viewer "knows" (tier 1 + tier 2), excluding the viewer.
 * Used for "Who's coming" summary cards and similar trust-proof surfaces.
 *
 * `currentUserId` is required — see `getAttendeeTier` rationale.
 */
export function getKnownAttendees(
  attendees: MeetAttendee[],
  currentUserId: string,
): MeetAttendee[] {
  return attendees.filter((a) => {
    if (a.userId === currentUserId) return false;
    return getAttendeeTier(a, currentUserId) <= 2;
  });
}
