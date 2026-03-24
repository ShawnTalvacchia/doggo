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
            variant="destructive"
            size="md"
            onClick={() => onConfirm(reason.trim() || undefined)}
            className="flex-1"
          >
            Cancel booking
          </ButtonAction>
        </div>
      }
    >
      <div className="flex flex-col gap-md">
        <p className="text-sm text-fg-secondary m-0">
          Are you sure you want to cancel your booking with {carerName}? This action cannot be undone.
        </p>

        <div className="flex flex-col gap-xs">
          <label className="text-sm font-medium text-fg-primary">
            Reason <span className="text-fg-tertiary font-normal">(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Let them know why you're cancelling..."
            rows={3}
            className="rounded-form px-md py-sm text-sm"
            style={{
              border: "1px solid var(--border-regular)",
              background: "var(--surface-base)",
              resize: "vertical",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>
      </div>
    </ModalSheet>
  );
}
