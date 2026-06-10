"use client";

import { useState } from "react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import type { ShelterProfile } from "@/lib/types";

/**
 * Application sheet for the walker journey (I, 2026-06-09). Surfaces
 * from any context that wants to start the apply-to-walk flow:
 *
 *   - Shelter detail page action row → "Walk a dog" CTA
 *   - Dog profile hero → "Walk {dog.name}" button
 *
 * Collects a free-text message (10-char minimum) and calls
 * `onConfirm(message)`. State management (creating the application,
 * advancing through invited → vouched) lives in `WalkerApplicationsContext`;
 * this component is the surface only.
 */
export function WalkApplicationSheet({
  open,
  shelter,
  onClose,
  onConfirm,
}: {
  open: boolean;
  shelter: ShelterProfile;
  onClose: () => void;
  onConfirm: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const canSubmit = message.trim().length >= 10;
  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title="Apply to walk dogs"
      compact
      footer={
        <>
          <ButtonAction variant="tertiary" size="md" onClick={onClose}>
            Not yet
          </ButtonAction>
          <ButtonAction
            variant="primary"
            size="md"
            disabled={!canSubmit}
            onClick={() => {
              onConfirm(message.trim());
              setMessage("");
            }}
          >
            Send application
          </ButtonAction>
        </>
      }
    >
      <div className="flex flex-col gap-md p-md">
        <p className="text-sm text-fg-secondary m-0">
          {shelter.name} pairs new walkers with the right dog through a short
          intro visit at the shelter.
        </p>
        {shelter.policy.vouchingNote && (
          <p className="text-sm text-fg-primary m-0">
            <em>{shelter.policy.vouchingNote}</em>
          </p>
        )}
        <div className="flex flex-col gap-xs">
          <label htmlFor="walker-application-message" className="text-sm font-semibold text-fg-primary">
            Why do you want to walk here?
          </label>
          <textarea
            id="walker-application-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="A few sentences about your experience with dogs and why this shelter."
            className="textarea"
            style={{ resize: "vertical", fontFamily: "inherit" }}
          />
          <span className="text-xs text-fg-tertiary">
            Required — 10 characters minimum.
          </span>
        </div>
      </div>
    </ModalSheet>
  );
}
