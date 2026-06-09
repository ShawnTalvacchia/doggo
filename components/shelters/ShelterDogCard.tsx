"use client";

import Link from "next/link";
import {
  Clock,
  PawPrint,
  GenderMale,
  GenderFemale,
} from "@phosphor-icons/react";
import type { PetProfile, ShelterProfile } from "@/lib/types";
import { deriveAutoTags } from "@/lib/petUtils";

interface ShelterDogCardProps {
  dog: PetProfile;
  /**
   * When provided, render a shelter attribution row at the bottom of the
   * card body (small circular logo + shelter name + neighbourhood). Used
   * on the Help a Dog Discover surface where the same card pattern shows
   * dogs across multiple shelters; the shelter's own Dogs tab leaves this
   * undefined since the shelter context is already established by the
   * page chrome.
   */
  shelter?: ShelterProfile;
}

/**
 * Compact photo-led card for a shelter dog. Tighter than V1: the card now
 * sits inside a 2-up grid on the shelter Dogs tab, so it drops the
 * backstory paragraph and manual tag pills (both belong on the full dog
 * profile at `/dogs/[id]`).
 *
 * The card carries at most ONE auto-derived chip overlaid on the photo,
 * picked by priority: Adoption pending > New arrival (<=7d) >
 * Long-stayer (>=30d) > none. No manual tag entry — these are stable
 * signals computed from the dog's data, so they're always accurate and
 * never need maintenance.
 *
 * Sex renders as a small Mars/Venus icon next to the name; the prior
 * "Male" / "Female" word in the breed/age row was redundant with the
 * universally-understood symbol.
 */
export function ShelterDogCard({ dog, shelter }: ShelterDogCardProps) {
  // The card shows at most one auto-derived chip overlaid on the photo,
  // ordered by priority (Adoption pending > New arrival > Long-stayer).
  // Energy chips never surface here — they live on the full dog profile
  // only. FC8 formalization (Dog Profile phase) routes through the same
  // helper as the profile so chip priority stays in one place.
  const chip = deriveAutoTags(dog, new Date()).find((t) => t.tone !== "energy") ?? null;

  // Sex renders as a Mars/Venus icon paired with the letter "M" / "F" so
  // viewers who don't recognize the symbol still get the meaning. Lives
  // in the meta row beside breed + age, not in the name header.
  const SexIcon = dog.sex === "male" ? GenderMale : dog.sex === "female" ? GenderFemale : null;
  const sexLetter = dog.sex === "male" ? "M" : dog.sex === "female" ? "F" : "";
  const sexAria = dog.sex === "male" ? "Male" : dog.sex === "female" ? "Female" : "";

  return (
    <Link
      href={`/dogs/${dog.id}`}
      className="shelter-dog-card"
      style={{ textDecoration: "none" }}
    >
      <div
        className="shelter-dog-card-photo"
        style={{ backgroundImage: `url(${dog.imageUrl})` }}
      >
        {chip && (
          <span
            className={`shelter-dog-card-chip shelter-dog-card-chip--${chip.tone}`}
          >
            {chip.label}
          </span>
        )}
      </div>

      <div className="shelter-dog-card-body">
        <h3 className="shelter-dog-card-name">{dog.name}</h3>

        <div className="shelter-dog-card-meta">
          {dog.breed && <span>{dog.breed}</span>}
          {dog.ageLabel && (
            <>
              <span aria-hidden="true">·</span>
              <span>{dog.ageLabel}</span>
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
        </div>

        <div className="shelter-dog-card-stats">
          <span className="shelter-dog-card-stat">
            <Clock size={12} weight="light" />
            <span>
              {dog.daysInKennel != null
                ? `${dog.daysInKennel}d in care`
                : "Just arrived"}
            </span>
          </span>
          <span className="shelter-dog-card-stat">
            <PawPrint size={12} weight="light" />
            <span>
              {dog.lastWalkedAt ? formatRelativeDay(dog.lastWalkedAt) : "No walks yet"}
            </span>
          </span>
        </div>

        {shelter && (
          <div className="shelter-dog-card-attribution">
            <span
              className="shelter-dog-card-attribution-logo"
              style={{ backgroundImage: `url(${shelter.logoUrl})` }}
              aria-hidden="true"
            />
            <span className="shelter-dog-card-attribution-text">
              <span className="shelter-dog-card-attribution-name">{shelter.name}</span>
              <span className="shelter-dog-card-attribution-meta">{shelter.location}</span>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────── */

/** Compact relative-day phrasing — "today", "yesterday", "3d ago". */
function formatRelativeDay(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}
