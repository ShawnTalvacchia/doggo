import type { ReactNode } from "react";

/**
 * Standardised empty state pattern used across the app.
 * Icon + title + optional subtitle + optional CTA.
 */
export function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-md rounded-panel p-xl bg-surface-base">
      <div className="text-fg-tertiary">{icon}</div>
      <p className="text-sm font-medium text-fg-secondary text-center m-0">{title}</p>
      {subtitle && (
        <p className="text-xs text-fg-tertiary text-center m-0">{subtitle}</p>
      )}
      {action && <div className="mt-xs">{action}</div>}
    </div>
  );
}
