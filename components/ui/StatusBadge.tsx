import type { ContractStatus } from "@/lib/types";

export type BadgeStatus = ContractStatus | "in_progress";

const STATUS_LABELS: Record<BadgeStatus, string> = {
  upcoming: "Upcoming",
  active: "Active",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  paused: "Paused",
};

/** Maps badge status to the CSS modifier class. */
const STATUS_CSS: Record<BadgeStatus, string> = {
  upcoming: "upcoming",
  active: "active",
  in_progress: "active",
  completed: "completed",
  cancelled: "cancelled",
  paused: "paused",
};

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return (
    <span className={`booking-status-badge booking-status-badge--${STATUS_CSS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
