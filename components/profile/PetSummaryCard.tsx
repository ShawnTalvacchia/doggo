"use client";

import Link from "next/link";
import { GenderMale, GenderFemale } from "@phosphor-icons/react";
import type { PetProfile } from "@/lib/types";

interface PetSummaryCardProps {
  pet: PetProfile;
  /**
   * Disabled rendering — used on `/profile` while edit mode is active.
   * Card stays visible (so the owner still sees what dogs they have) but
   * loses its link target + hover; a helper line above the grid points
   * them at the dog page for actual editing.
   */
  disabled?: boolean;
}

/**
 * Photo-led summary tile for an owned dog on profile surfaces. Mirrors the
 * `ShelterDogCard` visual pattern (large square photo + name + meta below)
 * so dog presentation is consistent across the app — same shape on the
 * shelter Dogs tab, the owner profile About tab, and the other-user
 * profile dogs section. Tap → `/dogs/[id]` (the canonical dog profile,
 * shipped in this phase). No expand mechanic; no inline edit body. Dog
 * editing lives on `/dogs/[id]` instead.
 *
 * Differences from `ShelterDogCard`:
 * - No auto-derived chip overlay (Adoption pending / New arrival /
 *   Long-stayer are shelter-only states).
 * - No stat row (no `daysInKennel` / `lastWalkedAt` for owned dogs).
 *
 * Both cards share the `.shelter-dog-card-*` CSS family so visual parity
 * is enforced by stylesheet, not by drift-prone duplication.
 */
export function PetSummaryCard({ pet, disabled = false }: PetSummaryCardProps) {
  const SexIcon = pet.sex === "male" ? GenderMale : pet.sex === "female" ? GenderFemale : null;
  const sexLetter = pet.sex === "male" ? "M" : pet.sex === "female" ? "F" : "";
  const sexAria = pet.sex === "male" ? "Male" : pet.sex === "female" ? "Female" : "";

  const body = (
    <>
      <div
        className="shelter-dog-card-photo"
        style={{ backgroundImage: `url(${pet.imageUrl})` }}
      />
      <div className="shelter-dog-card-body">
        <h3 className="shelter-dog-card-name">{pet.name}</h3>

        <div className="shelter-dog-card-meta">
          {pet.breed && <span>{pet.breed}</span>}
          {pet.ageLabel && (
            <>
              <span aria-hidden="true">·</span>
              <span>{pet.ageLabel}</span>
            </>
          )}
          {SexIcon && (
            <>
              <span aria-hidden="true">·</span>
              <span className="shelter-dog-card-sex" aria-label={sexAria}>
                <SexIcon size={11} weight="bold" />
                {sexLetter}
              </span>
            </>
          )}
          {pet.weightLabel && (
            <>
              <span aria-hidden="true">·</span>
              <span>{pet.weightLabel}</span>
            </>
          )}
        </div>
      </div>
    </>
  );

  if (disabled) {
    // Renders the card chrome without a link target. Profile edit mode
    // uses this — the user sees their dogs but can't navigate away mid-
    // edit; a helper line above the grid points to the dog page for
    // actual editing.
    return (
      <div
        className="shelter-dog-card pet-summary-card--disabled"
        aria-disabled="true"
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/dogs/${pet.id}`}
      className="shelter-dog-card"
      style={{ textDecoration: "none" }}
    >
      {body}
    </Link>
  );
}
