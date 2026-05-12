"use client";

/**
 * RequestToJoinModal — friction-as-trust modal for approval-only group joins.
 *
 * Why this exists: tapping "Request to join" on an approval-gated group
 * used to flip a local boolean without any explainer or context capture.
 * The admin then approves blind — no context, no signal of fit. This modal
 * (a) explains who's reviewing the request and (b) lets the requester add
 * an optional note (their dog, why they want to join) that the admin can
 * read while deciding.
 *
 * Open groups never reach this modal (Join is one-tap). Private groups
 * are typically invite-only, so a non-member rarely reaches the join CTA
 * at all — this modal is the approval-only path.
 *
 * Shipped 2026-05-11 as the second half of the visibility-chip refresh
 * (Cross-Cutting Flow Testing side task → join-flow redesign). See
 * `features/community.md` → "Join flow + privacy disclosure" for the
 * full pattern including the helper line below the CTA.
 */

import { useState } from "react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";

interface RequestToJoinModalProps {
  open: boolean;
  onClose: () => void;
  groupName: string;
  adminName: string;
  /** Called with the optional context note when the user taps "Send request". */
  onSubmit: (note: string) => void;
}

export function RequestToJoinModal({
  open,
  onClose,
  groupName,
  adminName,
  onSubmit,
}: RequestToJoinModalProps) {
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    onSubmit(note.trim());
    setNote("");
  };

  const handleClose = () => {
    setNote("");
    onClose();
  };

  return (
    <ModalSheet
      open={open}
      onClose={handleClose}
      title="Request to join"
      footer={
        <div className="flex gap-sm">
          <ButtonAction variant="tertiary" size="md" onClick={handleClose}>
            Cancel
          </ButtonAction>
          <ButtonAction
            variant="primary"
            size="md"
            onClick={handleSubmit}
            className="flex-1"
          >
            Send request
          </ButtonAction>
        </div>
      }
    >
      <div
        className="flex flex-col gap-md"
        style={{ padding: "var(--space-md)" }}
      >
        <p className="text-sm text-fg-secondary m-0" style={{ lineHeight: 1.5 }}>
          Request to join <strong className="text-fg-primary">{groupName}</strong>.{" "}
          {adminName} will review your request and let you know.
        </p>

        <label className="flex flex-col gap-xs">
          <span className="text-sm font-medium text-fg-primary">
            Tell {adminName} about your dog{" "}
            <span className="text-fg-tertiary font-normal">(optional)</span>
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Hi ${adminName}, my dog Bára is a reactive rescue and I'd love to join…`}
            className="textarea"
            style={{ minHeight: 96 }}
            rows={4}
          />
          <span className="text-xs text-fg-tertiary">
            A short note helps {adminName} understand if the group is a good
            fit for you and your dog.
          </span>
        </label>
      </div>
    </ModalSheet>
  );
}
