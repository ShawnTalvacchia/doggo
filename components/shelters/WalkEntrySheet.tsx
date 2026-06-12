"use client";

import { GraduationCap, PawPrint, CaretRight } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { MENTOR_SESSION_DEFAULT_MINIMUM } from "@/lib/constants/services";
import type { ShelterProfile } from "@/lib/types";

/**
 * WalkEntrySheet — the single smart entry for an UNVERIFIED walker
 * (2026-06-11). Replaces the old two-competing-CTAs problem ("Walk a
 * dog" vs "See mentors" forked the journey before the user understood
 * either). "Walk a dog" now lands here and offers the two real paths to
 * getting verified, mentored-first but never forced:
 *
 *  1. **Start with a mentor** — the credentialing path (paid supervised
 *     sessions → vouched). Primary; only shown when the shelter accepts
 *     mentor-vouches AND a mentor serves it.
 *  2. **Apply directly** — the shelter's own intake (the free-text
 *     application), for people who've walked shelter dogs before.
 *
 * Verified walkers never see this — they book straight away.
 */
export function WalkEntrySheet({
  open,
  onClose,
  shelter,
  dogName,
  showMentorOption,
  fromPrice,
  onChooseMentor,
  onChooseApply,
}: {
  open: boolean;
  onClose: () => void;
  shelter: ShelterProfile;
  /** Set when the entry came from a specific dog's page — frames the
   *  motivation ("Want to walk {dog}?") without locking anything. */
  dogName?: string;
  /** Whether to surface the mentored path (shelter accepts vouches +
   *  a mentor serves it). When false, only direct apply shows. */
  showMentorOption: boolean;
  /** Cheapest mentor session price, for the option subline. */
  fromPrice?: number;
  onChooseMentor: () => void;
  onChooseApply: () => void;
}) {
  const minimum = shelter.policy.mentorSessionMinimum ?? MENTOR_SESSION_DEFAULT_MINIMUM;
  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title={dogName ? `Walk ${dogName}` : "Walk dogs here"}
      compact
    >
      <div className="flex flex-col gap-md p-md">
        <p className="text-sm text-fg-secondary m-0">
          {dogName ? `Want to walk ${dogName}? ` : ""}
          To walk {shelter.name}&rsquo;s dogs on your own, you&rsquo;ll first get
          verified as a walker here. Two ways in:
        </p>

        {showMentorOption && (
          <button type="button" className="walk-entry-option walk-entry-option--primary" onClick={onChooseMentor}>
            <span className="walk-entry-option-icon">
              <GraduationCap size={22} weight="light" />
            </span>
            <span className="flex flex-col gap-tiny flex-1 min-w-0 text-left">
              <span className="text-sm font-semibold text-fg-primary">New to shelter walking?</span>
              <span className="text-xs text-fg-secondary">
                Walk with a mentor — {minimum} sessions and the shelter vouches you to
                walk solo.
                {fromPrice ? ` From ${fromPrice.toLocaleString()} Kč / session.` : ""}
              </span>
            </span>
            <CaretRight size={16} weight="bold" className="text-fg-tertiary shrink-0" />
          </button>
        )}

        <button type="button" className="walk-entry-option" onClick={onChooseApply}>
          <span className="walk-entry-option-icon">
            <PawPrint size={22} weight="light" />
          </span>
          <span className="flex flex-col gap-tiny flex-1 min-w-0 text-left">
            <span className="text-sm font-semibold text-fg-primary">
              {showMentorOption ? "Walked shelter dogs before?" : "Apply to walk"}
            </span>
            <span className="text-xs text-fg-secondary">
              Apply directly — {shelter.name} reviews your experience and sets up an
              intro walk.
            </span>
          </span>
          <CaretRight size={16} weight="bold" className="text-fg-tertiary shrink-0" />
        </button>
      </div>
    </ModalSheet>
  );
}
