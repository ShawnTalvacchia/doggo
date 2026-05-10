"use client";

import { useState } from "react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";

interface CancelBookingModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  carerName: string;
}

export function CancelBookingModal({ open, onClose, onConfirm, carerName }: CancelBookingModalProps) {
  const [reason, setReason] = useState("");

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title="Cancel booking"
      footer={
        <div className="flex gap-sm w-full">
          <ButtonAction variant="tertiary" size="md" onClick={onClose} className="flex-1">
            Keep booking
          </ButtonAction>
          <ButtonAction
            variant="primary"
            destructive
            size="md"
            onClick={() => onConfirm(reason.trim() || undefined)}
            className="flex-1"
          >
            Cancel booking
          </ButtonAction>
        </div>
      }
    >
      <div className="flex flex-col gap-md p-lg">
        <p className="text-base text-fg-secondary m-0">
          Are you sure you want to cancel your booking with {carerName}? This action cannot be undone.
        </p>

        <div className="input-block">
          {/* Sibling pattern to CancelSessionModal — uses the
              design-system `.textarea` primitive + matching label
              styling (semibold + primary text, tertiary "(Optional)"
              suffix) so all the cancel-flow modals read as one
              language. Was previously inline-styled with surface-base
              bg + lighter border. Aligned 2026-05-08. */}
          <label
            className="inline-flex items-center gap-xs text-sm font-semibold text-fg-primary"
            htmlFor="cancel-booking-reason"
          >
            Reason
            <span className="text-xs font-normal text-fg-tertiary">(Optional)</span>
          </label>
          <textarea
            id="cancel-booking-reason"
            className="textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Let them know why you're cancelling..."
            rows={3}
          />
        </div>
      </div>
    </ModalSheet>
  );
}
