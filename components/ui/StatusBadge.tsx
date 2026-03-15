import { ContractStatus } from "@/lib/types";

const STATUS_LABELS: Record<ContractStatus, string> = {
  upcoming: "Upcoming",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled",
  paused: "Paused",
};

export function StatusBadge({ status }: { status: ContractStatus }) {
  return (
    <span className={`booking-status-badge booking-status-badge--${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
