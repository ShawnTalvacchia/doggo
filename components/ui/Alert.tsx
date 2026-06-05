"use client";

import {
  CheckCircle,
  Info,
  WarningCircle,
  XCircle,
  X,
} from "@phosphor-icons/react";

export type AlertKind = "info" | "success" | "warning" | "error";

interface AlertProps {
  kind: AlertKind;
  title: string;
  description?: string;
  /** When provided, renders a small dismiss × in the top-right. */
  onDismiss?: () => void;
}

const ICON_BY_KIND = {
  info: Info,
  success: CheckCircle,
  warning: WarningCircle,
  error: XCircle,
};

/**
 * Tinted alert card — error / warning / info / success variants.
 * Used for inline page-level callouts and (via the Toast host) for
 * transient slide-in notifications. The visual treatment matches the
 * design-system reference: colored fill + matched-tone border + icon
 * + title + optional description.
 *
 * For transient slide-in usage, see `useStubNotice()` /
 * `<ToastHost>` — those wire the alert into a positioned overlay
 * with auto-dismiss + ×.
 *
 * Photos & Galleries phase, 2026-06-04.
 */
export function Alert({ kind, title, description, onDismiss }: AlertProps) {
  const Icon = ICON_BY_KIND[kind];
  return (
    <div className={`alert alert--${kind}`} role="status">
      <div className="alert-icon">
        <Icon size={20} weight="regular" />
      </div>
      <div className="alert-body">
        <p className="alert-title">{title}</p>
        {description && <p className="alert-description">{description}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          className="alert-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <X size={14} weight="bold" />
        </button>
      )}
    </div>
  );
}
