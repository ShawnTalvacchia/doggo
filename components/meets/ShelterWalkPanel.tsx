"use client";

/**
 * The FC18 group-shelter-walk panel (Adoption-Curious Journey, 2026-06-12;
 * reframed to the mixed-walk model 2026-06-12; sign-up wired 2026-06-22, WS-G).
 *
 * Renders on a Meet's details tab when `meet.shelterWalk` is set. The walk is
 * a MIXED community walk: most people bring their own dog; walkers can also
 * walk one of the linked shelter's dogs. This panel shows the shelter dogs
 * joining (rounded squares, Avatar Rule B) and carries the sign-up CTA — the
 * green→violet funnel boundary:
 *  - a **vouched** walker signs up to walk a shelter dog on the walk;
 *  - an **un-vouched** newcomer gets the **mentored first walk** (the host
 *    trainer gets them started) — the warm top-of-funnel.
 * Both open `GroupWalkSignupSheet`, which creates a real meet-linked
 * shelter-walk booking.
 */

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, PersonSimpleWalk, CaretRight } from "@phosphor-icons/react";
import type { Meet } from "@/lib/types";
import { getShelterById, getShelterDogByName } from "@/lib/mockShelters";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { GroupWalkSignupSheet } from "./GroupWalkSignupSheet";

export function ShelterWalkPanel({ meet }: { meet: Meet }) {
  const shelter = meet.shelterWalk ? getShelterById(meet.shelterWalk.shelterId) : undefined;
  const currentUserId = useCurrentUserId();
  const { getApplication } = useWalkerApplications();
  const [signupOpen, setSignupOpen] = useState(false);

  if (!shelter) return null;

  // Vouched at this shelter? Static roster OR a vouched dynamic application
  // (the demo can advance a walker to vouched via the hidden affordance).
  const isVouched =
    shelter.walkers.some((w) => w.userId === currentUserId) ||
    getApplication(currentUserId, shelter.id)?.state === "vouched";

  // Shelter dogs joining this week — every attendee dog that resolves on the
  // shelter roster (owned dogs don't appear here).
  const shelterDogs = meet.attendees.flatMap((a) =>
    (a.dogNames ?? [])
      .map((name) => getShelterDogByName(shelter.id, name))
      .filter((d): d is NonNullable<typeof d> => !!d),
  );

  // The one conversion CTA — opens the sign-up sheet. Copy + icon vary by tier:
  // vouched signs up directly; a newcomer's first walk is mentored.
  const signupCta = (
    <div className="flex items-center justify-between gap-sm flex-wrap border-t border-edge-light pt-sm">
      <span className="text-sm text-fg-tertiary">
        {isVouched ? "Walking today?" : "New to shelter walking?"}
      </span>
      <button
        type="button"
        onClick={() => setSignupOpen(true)}
        className="shelter-walk-mentor-link"
      >
        {isVouched ? (
          <PersonSimpleWalk size={15} weight="bold" />
        ) : (
          <GraduationCap size={15} weight="bold" />
        )}
        {isVouched ? "Walk a dog on this walk" : "Walk one with a mentor"}
        <CaretRight size={12} weight="bold" />
      </button>
    </div>
  );

  const sheet = (
    <GroupWalkSignupSheet
      open={signupOpen}
      onClose={() => setSignupOpen(false)}
      meet={meet}
      shelter={shelter}
      isVouched={isVouched}
    />
  );

  // No shelter dogs on this occurrence — fall back to a one-line invitation
  // + the CTA (no avatar card to show).
  if (shelterDogs.length === 0) {
    return (
      <>
        <section className="flex flex-col gap-sm mt-sm rounded-panel border border-edge-regular bg-surface-top p-md">
          <p className="text-sm text-fg-secondary m-0">
            Walk one of{" "}
            <Link href={`/shelters/${shelter.id}`} className="font-semibold text-fg-primary underline">
              {shelter.name}
            </Link>
            's dogs along on this walk.
          </p>
          {signupCta}
        </section>
        {sheet}
      </>
    );
  }

  return (
    <>
      <section className="flex flex-col gap-sm mt-sm">
        <div className="meet-section-header">
          <h2 className="meet-section-title">Shelter dogs joining</h2>
          <Link
            href={`/meets/${meet.id}?tab=people`}
            className="text-xs font-medium text-brand-main"
            style={{ textDecoration: "none" }}
          >
            View all
          </Link>
        </div>

        <div className="meet-summary-card">
          <div className="meet-summary-row">
            <div className="meet-summary-avatars">
              {shelterDogs.slice(0, 4).map((dog) => (
                <img
                  key={dog.id}
                  src={dog.imageUrl}
                  alt={dog.name}
                  className="meet-summary-avatar meet-summary-avatar--dog"
                />
              ))}
            </div>
            <div className="meet-summary-meta">
              <span className="meet-summary-count">
                {shelterDogs.length} from {shelter.name}
              </span>
              <span className="meet-summary-trust">
                Out for a walk in good company, with the group and a trainer.
              </span>
            </div>
          </div>

          {signupCta}
        </div>
      </section>
      {sheet}
    </>
  );
}
