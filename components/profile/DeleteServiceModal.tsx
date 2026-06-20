"use client";

import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";

interface DeleteServiceModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** Human name of the service being removed — service-type label or title. */
  serviceLabel: string;
  /** Kind kicker for context — "Care service" / "Session offering" / "Appointment". */
  kindLabel: string;
  /** True when removal soft-archives (the service has bookings / RSVPs in
   *  progress) rather than hard-deleting. Drives the copy + button label. */
  willArchive: boolean;
}

/**
 * Confirm before removing a service from the carer's catalogue. The Services
 * edit list packs Care / Session / Appointment cards close together, each with
 * its own red trash — a confirm step lets the carer double-check they tapped
 * the right one before anything is gone.
 *
 * The modal also surfaces the archive-vs-delete distinction: a service with
 * bookings or RSVPs in progress is *archived* (hidden, restorable, existing
 * bookings keep running) rather than deleted. Service ↔ Meet Linkage
 * walkthrough B6, 2026-05-16.
 */
export function DeleteServiceModal({
  open,
  onClose,
  onConfirm,
  serviceLabel,
  kindLabel,
  willArchive,
}: DeleteServiceModalProps) {
  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      compact
      title={willArchive ? "Archive this service?" : "Remove this service?"}
      footer={
        <div className="flex flex-wrap gap-sm w-full">
          <ButtonAction
            variant="secondary"
            size="md"
            onClick={onClose}
            className="grow basis-[140px]"
          >
            Keep it
          </ButtonAction>
          <ButtonAction
            variant="primary"
            destructive
            size="md"
            onClick={onConfirm}
            className="grow basis-[140px]"
          >
            {willArchive ? "Archive service" : "Remove service"}
          </ButtonAction>
        </div>
      }
    >
      <div className="flex flex-col gap-md p-lg">
        {/* Name the exact service so the carer can confirm they tapped the
            right trash before anything happens. */}
        <div
          className="flex flex-col gap-tiny rounded-sm"
          style={{
            padding: "var(--space-md)",
            background: "var(--surface-inset)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <span className="text-xs font-semibold text-fg-tertiary uppercase tracking-wide">
            {kindLabel}
          </span>
          <span className="text-base font-semibold text-fg-primary">
            {serviceLabel}
          </span>
        </div>

        <p className="text-base text-fg-secondary m-0">
          {willArchive ? (
            <>
              This service has bookings or RSVPs in progress. Archiving hides
              it from your profile and Discover —{" "}
              <strong className="text-fg-primary">
                existing bookings keep running
              </strong>
              , and you can restore it any time.
            </>
          ) : (
            <>
              This removes the service from your profile. You can add it again
              later.
            </>
          )}
        </p>
      </div>
    </ModalSheet>
  );
}
