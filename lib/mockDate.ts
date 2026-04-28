/**
 * Relative-date helpers for mock data.
 *
 * Mock data with hardcoded dates ("2026-04-15") drifts out of useful windows
 * as the system date moves forward — meets fall off the Schedule, bookings
 * stop showing as upcoming, conversations look stale. These helpers compute
 * dates relative to "now" so a small set of dates always lands in the right
 * window for the demo.
 *
 * Conventions:
 *  - Use `daysAgo(N)` for things that should always look "recently past"
 *    (review-eligible meets, recently-completed bookings, recent chat
 *    timestamps).
 *  - Use `daysFromNow(N)` for things that should always look "soon"
 *    (upcoming meets, scheduled care sessions, upcoming bookings).
 *  - Use sparingly — only data that needs to track today. Deeper history
 *    (long-term context) and far-future placeholder dates can stay static.
 *
 * Output is YYYY-MM-DD ISO date (no time component). For ISO datetime,
 * append `T${time}` at the callsite.
 *
 * Evaluated once at module load — values are stable for the page session.
 */

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Same as daysFromNow but returns the full ISO datetime. Optional `time`
 *  param sets the time-of-day component (default "00:00"). */
export function daysFromNowIso(n: number, time: string = "00:00"): string {
  return `${daysFromNow(n)}T${time}:00Z`;
}

/** Same as daysAgo but returns the full ISO datetime. Optional `time` param
 *  sets the time-of-day component (default "00:00"). */
export function daysAgoIso(n: number, time: string = "00:00"): string {
  return `${daysAgo(n)}T${time}:00Z`;
}
