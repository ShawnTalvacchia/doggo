/**
 * Czech public holidays for the demo window. Used by `computeQuote` to
 * apply the holiday surcharge modifier when a booking falls on (or
 * spans) one of these dates.
 *
 * Hardcoded for 2026/2027 — sufficient for prototype demo. Production
 * would compute Easter Monday algorithmically (Computus) and refresh
 * the table per year.
 *
 * Pricing & Proposals, 2026-05-04.
 */

export interface CzechHoliday {
  date: string; // ISO YYYY-MM-DD
  name: string;
}

export const CZECH_HOLIDAYS: CzechHoliday[] = [
  // 2026
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-04-06", name: "Easter Monday" },
  { date: "2026-05-01", name: "Labour Day" },
  { date: "2026-05-08", name: "Liberation Day" },
  { date: "2026-07-05", name: "Saints Cyril and Methodius Day" },
  { date: "2026-07-06", name: "Jan Hus Day" },
  { date: "2026-09-28", name: "Czech Statehood Day" },
  { date: "2026-10-28", name: "Independent Czechoslovak State Day" },
  { date: "2026-11-17", name: "Struggle for Freedom and Democracy Day" },
  { date: "2026-12-24", name: "Christmas Eve" },
  { date: "2026-12-25", name: "Christmas Day" },
  { date: "2026-12-26", name: "St. Stephen's Day" },
  // 2027
  { date: "2027-01-01", name: "New Year's Day" },
  { date: "2027-03-26", name: "Good Friday" },
  { date: "2027-03-29", name: "Easter Monday" },
  { date: "2027-05-01", name: "Labour Day" },
  { date: "2027-05-08", name: "Liberation Day" },
  { date: "2027-07-05", name: "Saints Cyril and Methodius Day" },
  { date: "2027-07-06", name: "Jan Hus Day" },
  { date: "2027-09-28", name: "Czech Statehood Day" },
  { date: "2027-10-28", name: "Independent Czechoslovak State Day" },
  { date: "2027-11-17", name: "Struggle for Freedom and Democracy Day" },
  { date: "2027-12-24", name: "Christmas Eve" },
  { date: "2027-12-25", name: "Christmas Day" },
  { date: "2027-12-26", name: "St. Stephen's Day" },
];

/**
 * Returns every Czech public holiday whose date falls in `[startISO, endISO]`
 * (inclusive). Both bounds are ISO YYYY-MM-DD strings; `endISO` may be null
 * for one-off bookings without an end date — we treat it as "same day."
 */
export function holidaysInRange(
  startISO: string | null,
  endISO: string | null,
): CzechHoliday[] {
  if (!startISO) return [];
  const end = endISO ?? startISO;
  return CZECH_HOLIDAYS.filter((h) => h.date >= startISO && h.date <= end);
}

/**
 * True if any of the dates in `[startISO, endISO]` is a Saturday or
 * Sunday. Used by the weekend modifier evaluator.
 */
export function rangeIncludesWeekend(
  startISO: string | null,
  endISO: string | null,
): boolean {
  if (!startISO) return false;
  const end = endISO ?? startISO;
  // Walk day-by-day. The demo window is short (single bookings rarely
  // span > 14 days), so this is fine without optimisation.
  const startMs = new Date(startISO + "T00:00:00").getTime();
  const endMs = new Date(end + "T00:00:00").getTime();
  for (let t = startMs; t <= endMs; t += 24 * 60 * 60 * 1000) {
    const d = new Date(t).getDay(); // 0 = Sun, 6 = Sat
    if (d === 0 || d === 6) return true;
  }
  return false;
}

/**
 * Days between `todayISO` and `startISO`. Negative if start is in the
 * past. Used by the last-minute modifier evaluator.
 */
export function daysBetween(todayISO: string, startISO: string): number {
  const a = new Date(todayISO + "T00:00:00").getTime();
  const b = new Date(startISO + "T00:00:00").getTime();
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}
