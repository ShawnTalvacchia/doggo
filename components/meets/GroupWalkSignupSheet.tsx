"use client";

/**
 * GroupWalkSignupSheet — sign up to walk a shelter dog ON a trainer-led group
 * walk (FC18, Multi-Path Demo WS-G, 2026-06-22). The appealing on-ramp: a
 * newcomer walks a shelter dog alongside other walkers, with the host trainer
 * making the first visit + pickup easy.
 *
 * Two-tier:
 *  - **Vouched** walker → signs up to walk a dog directly.
 *  - **Un-vouched** newcomer → this IS their mentored first walk: the host
 *    trainer supervises, and signing up begins their mentorship toward a vouch.
 *
 * Either way it creates a real shelter-walk `Booking` (`ownerKind: "shelter"`,
 * volunteer / no charge) linked to the meet occurrence via `dropoffMeetId`
 * (reusing the config-#2 linkage) — so the walk runs on the existing
 * Sessions/Visit-Report rails and is captured for the advocacy loop.
 *
 * Honestly faked (FC18 deferred to shelter interviews): the physical multi-dog
 * checkout/release, mentor-as-responsible-party, and group-context waivers.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, GraduationCap } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useBookings } from "@/contexts/BookingsContext";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getDisplayDate } from "@/lib/meetUtils";
import { formatMeetDateTime } from "@/lib/dateUtils";
import { getMentorsForShelter } from "@/lib/volunteerTier";
import { buildGroupWalkBookingInput } from "@/lib/groupWalkBooking";
import type { Meet, ShelterProfile } from "@/lib/types";

export function GroupWalkSignupSheet({
  open,
  onClose,
  meet,
  shelter,
  isVouched,
}: {
  open: boolean;
  onClose: () => void;
  meet: Meet;
  shelter: ShelterProfile;
  isVouched: boolean;
}) {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { createBooking } = useBookings();
  const { beginMentorship } = useWalkerApplications();

  // Walkable dogs at the shelter (skip any already adopted out).
  const dogs = shelter.dogs.filter((d) => !d.adoptionStatus || d.adoptionStatus !== "adopted");
  const occurrenceDate = getDisplayDate(meet);
  const mentor = { id: meet.creatorId, name: meet.creatorName };
  // A newcomer's group walk is a paid mentored session with the host trainer —
  // their per-session fee (same as a 1-on-1). Vouched walkers walk for free.
  const hostMentorFee = getMentorsForShelter(shelter.id).find(
    (m) => m.mentor.id === meet.creatorId,
  )?.service.pricePerSession;

  const [selectedDogName, setSelectedDogName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setSelectedDogName(null);
    }
  }, [open]);

  const selectedDog = dogs.find((d) => d.name === selectedDogName) ?? null;
  const canSubmit = selectedDog !== null;

  function handleSubmit() {
    if (!selectedDog) return;
    createBooking(
      buildGroupWalkBookingInput({
        meet,
        shelter,
        user: currentUser,
        dogName: selectedDog.name,
        isVouched,
        mentorFee: hostMentorFee
          ? { amount: hostMentorFee, mentorName: mentor.name }
          : undefined,
      }),
    );
    // Un-vouched newcomer: this first walk is mentored by the host — begin the
    // mentorship toward a vouch (idempotent if one already exists).
    if (!isVouched) {
      beginMentorship(currentUser.id, shelter.id, mentor);
    }
    setSubmitted(true);
  }

  return (
    <ModalSheet open={open} onClose={onClose} title="Walk a shelter dog">
      {submitted ? (
        <div className="inquiry-form-success">
          <CheckCircle size={40} weight="fill" className="inquiry-form-success-icon" />
          <p className="inquiry-form-success-title">You're on the walk</p>
          <p className="inquiry-form-success-sub">
            {selectedDog?.name} is on your schedule for {meet.title}.{" "}
            {isVouched
              ? `Check in at ${shelter.name} when you arrive.`
              : `${mentor.name} will meet you there and get you started.`}
          </p>
          <ButtonAction
            variant="primary"
            size="md"
            cta
            className="mt-md"
            rightIcon={<ArrowRight size={16} weight="bold" />}
            onClick={() => {
              onClose();
              router.push("/bookings?tab=volunteering");
            }}
          >
            See your bookings
          </ButtonAction>
        </div>
      ) : (
        <div className="inbox-inquiry-form">
          <div className="flex flex-col gap-xs border-b border-edge-regular pb-md">
            <span className="font-semibold text-fg-primary">{meet.title}</span>
            <span className="text-sm text-fg-tertiary">
              {formatMeetDateTime(occurrenceDate, meet.time)} · with {mentor.name} · {shelter.name}
            </span>
          </div>

          {!isVouched && (
            <div
              className="flex items-start gap-sm rounded-panel p-md"
              style={{ background: "var(--status-volunteer-light)" }}
            >
              <GraduationCap
                size={18}
                weight="bold"
                className="shrink-0"
                style={{ color: "var(--status-volunteer-main)" }}
              />
              <p className="text-sm text-fg-secondary m-0">
                New to shelter walking? This is your <strong>mentored first walk</strong>.{" "}
                {mentor.name} meets you at the shelter, makes the first pickup easy, and you walk
                in a group. After a few, you're vouched to walk on your own.
              </p>
            </div>
          )}

          <div className="filter-field">
            <div className="label">Which dog will you walk?</div>
            <div className="flex flex-col gap-xs">
              {dogs.map((dog) => {
                const active = dog.name === selectedDogName;
                return (
                  <button
                    key={dog.id}
                    type="button"
                    onClick={() => setSelectedDogName(dog.name)}
                    className={`flex items-center gap-md rounded-panel border p-sm text-left transition-colors ${
                      active
                        ? "border-edge-stronger bg-surface-base"
                        : "border-edge-regular bg-surface-top"
                    }`}
                  >
                    <img
                      src={dog.imageUrl}
                      alt={dog.name}
                      className="rounded-dog object-cover shrink-0"
                      style={{ width: 44, height: 44 }}
                    />
                    <span className="flex flex-col min-w-0">
                      <span className="font-semibold text-fg-primary">{dog.name}</span>
                      <span className="text-xs text-fg-tertiary truncate">
                        {[dog.breed, dog.ageLabel].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {!isVouched && hostMentorFee && (
            <div className="inq-estimate">
              <div className="inq-estimate-row">
                <span className="inq-estimate-label">Mentored session</span>
                <span className="inq-estimate-total">{hostMentorFee.toLocaleString()} Kč</span>
              </div>
              <p className="inq-estimate-note">
                Paid to {mentor.name}. The shelter walk itself is volunteer.
              </p>
            </div>
          )}

          <button className="inq-submit" disabled={!canSubmit} onClick={handleSubmit}>
            {isVouched ? "Sign up to walk →" : "Sign up for my first walk →"}
          </button>
        </div>
      )}
    </ModalSheet>
  );
}
