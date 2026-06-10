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
  mentorshipHistory,
  isSuperVolunteer,
}: {
  open: boolean;
  shelter: ShelterProfile;
  onClose: () => void;
  onConfirm: (message: string) => void;
  /** Applicant's mentor-session history across shelters. At a
   *  non-accepting shelter it renders as the "Mentor-recommended"
   *  credibility line (Cross-Shelter Mentor Network D2 fallback /
   *  ASSUMPTION A10) — mentor work strengthens the standard
   *  application even where the vouch isn't binding. */
  mentorshipHistory?: { totalSessions: number; mentorNames: string[] };
  /** Applicant holds the platform Super Volunteer tier — the portable
   *  credential (D3 / ASSUMPTION A3). The shelter sees it arrive on the
   *  application; their own waiver + orientation still apply. */
  isSuperVolunteer?: boolean;
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
        {/* Portable-credential recognition (D3): the platform tier travels
            with the applicant; the shelter's own waiver + orientation walk
            still apply — recognition shortens trust-building, it doesn't
            skip the shelter's process. */}
        {isSuperVolunteer && (
          <p className="text-sm text-fg-secondary m-0">
            Your <strong>Super Volunteer</strong> status goes with your
            application — {shelter.name} will still ask for their own waiver
            and an orientation walk with their dogs.
          </p>
        )}
        {/* Mentor-recommended credibility (D2 fallback): rendered at
            shelters that DON'T accept mentor-vouches. The mentor work
            still counts as documented experience. */}
        {!shelter.policy.acceptsMentorVouches &&
          mentorshipHistory &&
          mentorshipHistory.totalSessions > 0 && (
            <p className="text-sm text-fg-secondary m-0">
              <strong>Mentor-recommended</strong> ·{" "}
              {mentorshipHistory.totalSessions}{" "}
              {mentorshipHistory.totalSessions === 1 ? "session" : "sessions"} with{" "}
              {mentorshipHistory.mentorNames.join(", ")} — included with your
              application. {shelter.name} reviews every walker directly.
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
