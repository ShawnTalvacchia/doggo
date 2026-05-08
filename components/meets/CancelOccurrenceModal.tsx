"use client";

import { useState } from "react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";

interface CancelOccurrenceModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with the host's reason (required — empty strings are blocked). */
  onConfirm: (reason: string) => void;
  /** Pre-formatted human label for the date being cancelled, e.g. "Wed, 13 May". */
  dateLabel: string;
  /** Meet title — surfaces in the body so the host can confirm what they're acting on. */
  meetTitle: string;
}

/**
 * Host-side per-occurrence cancellation. One specific date of a recurring
 * meet — the series stays alive. Reason is required because attendees see it
 * on their Schedule + the meet detail row, and "this is gone, here's why" is
 * the whole point of cancelling-not-deleting.
 *
 * Fork of the booking-side cancel pattern; copy is meet-specific (attendees
 * vs. owner, occurrence vs. session). Keep the two modals separate — the
 * shapes converge but the words don't.
 */
export function CancelOccurrenceModal({
  open,
  onClose,
  onConfirm,
  dateLabel,
  meetTitle,
}: CancelOccurrenceModalProps) {
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();
  const canSubmit = trimmed.length > 0;

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleConfirm = () => {
    if (!canSubmit) return;
    onConfirm(trimmed);
    setReason("");
  };

  return (
    <ModalSheet
      open={open}
      onClose={handleClose}
      title="Cancel this date"
      footer={
        <div className="flex gap-sm w-full">
          <ButtonAction variant="tertiary" size="md" onClick={handleClose} className="flex-1">
            Keep date
          </ButtonAction>
          <ButtonAction
            variant="destructive"
            size="md"
            disabled={!canSubmit}
            onClick={handleConfirm}
            className="flex-1"
          >
            Cancel date
          </ButtonAction>
        </div>
      }
    >
      <div className="flex flex-col gap-md p-lg">
        <p className="text-base text-fg-secondary m-0">
          Cancel <strong className="text-fg-primary">{meetTitle}</strong> on{" "}
          <strong className="text-fg-primary">{dateLabel}</strong>? Attendees will see this date
          marked cancelled with your reason. Future occurrences in this series stay scheduled.
        </p>

        <div className="input-block">
          {/* Aligned to the cancel-modal family vocabulary
              (CancelSessionModal, CancelBookingModal). 2026-05-08. */}
          <label
            className="inline-flex items-center gap-xs text-sm font-semibold text-fg-primary"
            htmlFor="cancel-occurrence-reason"
          >
            Reason
            <span className="text-xs font-normal text-fg-tertiary">(Required)</span>
          </label>
          <textarea
            id="cancel-occurrence-reason"
            className="textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Heavy rain forecast, will be back next week"
            rows={3}
          />
        </div>
      </div>
    </ModalSheet>
  );
}
