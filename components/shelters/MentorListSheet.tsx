"use client";

import { CaretRight } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { MENTOR_SESSION_DEFAULT_MINIMUM } from "@/lib/constants/services";
import type {
  CarerMentorSessionServiceConfig,
  ShelterProfile,
  UserProfile,
} from "@/lib/types";

/**
 * MentorListSheet — the neutral mentor-discovery surface for a shelter
 * (mentor-discovery rework, 2026-06-11).
 *
 * The shelter's mentor CTA must NOT feature a specific mentor — a
 * shelter page spotlighting one provider's paid offering reads as the
 * shelter advertising a favorite (the Playbook framing principle). The
 * CTA opens THIS list instead: every Super Volunteer mentoring at this
 * shelter, with their own price and availability. Picking one opens the
 * booking sheet locked to this shelter.
 *
 * Availability renders as the coarse day/slot summary every other
 * booking surface uses — the slots-calendar version is the production
 * direction (FC17), not prototype scope.
 */
export interface MentorListEntry {
  mentor: UserProfile;
  service: CarerMentorSessionServiceConfig;
}

export function MentorListSheet({
  open,
  onClose,
  shelter,
  mentors,
  onPick,
  dogName,
}: {
  open: boolean;
  onClose: () => void;
  shelter: ShelterProfile;
  mentors: MentorListEntry[];
  onPick: (entry: MentorListEntry) => void;
  /** When the list was opened from a dog's profile, the dog the mentee
   *  is working toward — surfaced so the adoption-funnel anchor stays
   *  visible through mentor selection (2026-06-11). */
  dogName?: string;
}) {
  const minimum = shelter.policy.mentorSessionMinimum ?? MENTOR_SESSION_DEFAULT_MINIMUM;
  const sessionWord = `${numberWord(minimum)} time${minimum === 1 ? "" : "s"}`;
  return (
    <ModalSheet open={open} onClose={onClose} title={`Mentors at ${shelter.name}`} compact>
      <div className="flex flex-col gap-md p-md">
        <p className="text-sm text-fg-secondary m-0">
          {dogName ? (
            <>Want to walk {dogName}? Get certified by walking with a mentor {sessionWord}. </>
          ) : (
            <>Get certified to volunteer by walking with a mentor {sessionWord}. </>
          )}
          Mentor walkers are experienced handlers who know {shelter.name}&rsquo;s dogs
          and routines — they&rsquo;ll get you ready to walk on your own.
        </p>
        <div className="flex flex-col gap-xs">
          {mentors.map((entry) => {
            const name = `${entry.mentor.firstName} ${entry.mentor.lastName}`.trim();
            const availability = entry.service.availabilityLabel;
            return (
              <button
                key={entry.mentor.id}
                type="button"
                className="mentor-list-row"
                onClick={() => onPick(entry)}
              >
                <img src={entry.mentor.avatarUrl} alt={name} className="mentor-list-row-avatar" />
                <span className="flex flex-col gap-tiny flex-1 min-w-0 text-left">
                  <span className="text-sm font-semibold text-fg-primary">{name}</span>
                  <span className="text-xs text-fg-tertiary">
                    {entry.service.pricePerSession.toLocaleString()} Kč / session ·{" "}
                    {entry.service.durationMinutes} min
                  </span>
                  {availability && (
                    <span className="text-xs text-fg-tertiary">{availability}</span>
                  )}
                </span>
                <CaretRight size={14} weight="bold" className="text-fg-tertiary shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </ModalSheet>
  );
}

/** Small whole numbers read better spelled out in prose ("three times"
 *  not "3 times"). Falls back to the digit past the handful we'd ever
 *  set as a session minimum. */
function numberWord(n: number): string {
  return ["zero", "one", "two", "three", "four", "five", "six"][n] ?? String(n);
}
