"use client";

import { CaretRight } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { summarizeAvailability } from "@/lib/volunteerTier";
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
}: {
  open: boolean;
  onClose: () => void;
  shelter: ShelterProfile;
  mentors: MentorListEntry[];
  onPick: (entry: MentorListEntry) => void;
}) {
  return (
    <ModalSheet open={open} onClose={onClose} title={`Mentors at ${shelter.name}`} compact>
      <div className="flex flex-col gap-md p-md">
        <p className="text-sm text-fg-secondary m-0">
          Mentors are Super Volunteers — vetted walkers with a long track
          record here. You pay the mentor directly; the shelter pays nothing.
        </p>
        <div className="flex flex-col">
          {mentors.map((entry) => {
            const name = `${entry.mentor.firstName} ${entry.mentor.lastName}`.trim();
            const availability = summarizeAvailability(entry.mentor.carerProfile?.availability);
            return (
              <button
                key={entry.mentor.id}
                type="button"
                className="mentor-list-row"
                onClick={() => onPick(entry)}
              >
                <img src={entry.mentor.avatarUrl} alt={name} className="mentor-list-row-avatar" />
                <span className="flex flex-col gap-tiny flex-1 min-w-0 text-left">
                  <span className="flex items-center gap-sm flex-wrap">
                    <span className="text-sm font-semibold text-fg-primary">{name}</span>
                    <span className="credential-pill credential-pill--volunteer credential-pill--tier-3">
                      Super Volunteer
                    </span>
                  </span>
                  <span className="text-xs text-fg-tertiary">
                    {entry.service.pricePerSession.toLocaleString()} Kč / session ·{" "}
                    {entry.service.durationMinutes} min
                    {availability ? ` · ${availability}` : ""}
                  </span>
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
