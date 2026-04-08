/**
 * Shared date/time formatting utilities.
 *
 * Canonical implementations — import from here instead of defining locally.
 */

/**
 * Format a meet date + time: "Wed 18 Mar, 08:00"
 * Used on meet cards and meet detail panels.
 */
export function formatMeetDateTime(date: string, time: string): string {
  const d = new Date(`${date}T${time}`);
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  const day = d.getDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  return `${weekday} ${day} ${month}, ${time}`;
}

/**
 * Format a date-only string: "Wed 18 Mar"
 * Used for schedule list items, session dates, etc.
 */
export function formatMeetDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Format a date with year: "18 Mar 2026"
 * Used for booking dates, proposals, contracts, etc.
 */
export function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format a date range: "18 Mar 2026 – 25 Mar 2026" or "From 18 Mar 2026"
 */
export function formatDateRange(start: string, end: string | null): string {
  if (!end) return `From ${formatShortDate(start)}`;
  return `${formatShortDate(start)} – ${formatShortDate(end)}`;
}

/**
 * Format a compact weekday + time: "Wed 08:00"
 * Used for upcoming strips and compact meet previews.
 */
export function formatCompactDateTime(date: string, time: string): string {
  const d = new Date(`${date}T${time}`);
  const weekday = d.toLocaleDateString("en-GB", { weekday: "short" });
  return `${weekday} ${time}`;
}

/**
 * Format an ISO timestamp as relative time: "5m ago", "3h ago", "Yesterday", "4d ago"
 * Returns empty string for falsy input.
 */
export function formatRelativeTime(isoString: string): string {
  if (!isoString) return "";
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}
