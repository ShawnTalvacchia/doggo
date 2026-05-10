"use client";

/**
 * CancelSessionModal — provider cancels a single occurrence of a
 * recurring booking ("this Wednesday is rained out") without ending the
 * booking itself. Captures optional reason. Sessions & Service Execution
 * F2, 2026-05-05.
 */

import { useState } from "react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";

export type CancelSessionModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  sessionDateLabel: string;
};

export function CancelSessionModal({
  open,
  onClose,
  onConfirm,
  sessionDateLabel,
}: CancelSessionModalProps) {
  const [reason, setReason] = useState("");

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title="Cancel this session"
      footer={
        <div className="flex gap-sm w-full">
          <ButtonAction
            variant="tertiary"
            size="md"
            onClick={onClose}
            className="flex-1"
          >
            Keep session
          </ButtonAction>
          <ButtonAction
            variant="primary"
            destructive
            size="md"
            onClick={() => {
              onConfirm(reason.trim() || undefined);
              setReason("");
            }}
            className="flex-1"
          >
            Cancel session
          </ButtonAction>
        </div>
      }
    >
      <div className="flex flex-col gap-md p-lg">
        <p className="text-base text-fg-secondary m-0">
          Cancel just the <strong>{sessionDateLabel}</strong> session. The rest of
          the booking stays in place.
        </p>

        <div className="input-block">
          {/* Label + textarea use the design-system `.label` /
              `.textarea` primitives so the styling matches the rest of
              the app's forms (white surface, brand-strong focus border,
              standard placeholder color). Was previously inline-styled
              with surface-base bg + lighter border, which read as a
              one-off and didn't match other inputs. */}
          <label
            className="inline-flex items-center gap-xs text-sm font-semibold text-fg-primary"
            htmlFor="cancel-session-reason"
          >
            Reason
            <span className="text-xs font-normal text-fg-tertiary">(Optional)</span>
          </label>
          <textarea
            id="cancel-session-reason"
            className="textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Stromovka closed for the marathon, can't make Wednesday"
            rows={3}
          />
        </div>
      </div>
    </ModalSheet>
  );
}
