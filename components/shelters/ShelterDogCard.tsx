"use client";

import Link from "next/link";
import {
  Clock,
  PawPrint,
  GenderMale,
  GenderFemale,
} from "@phosphor-icons/react";
import type { PetProfile } from "@/lib/types";

interface ShelterDogCardProps {
  dog: PetProfile;
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
export function ShelterDogCard({ dog }: ShelterDogCardProps) {
  const chip = pickAutoChip(dog);

  const SexIcon = dog.sex === "male" ? GenderMale : dog.sex === "female" ? GenderFemale : null;
  const sexLabel = dog.sex === "male" ? "Male" : dog.sex === "female" ? "Female" : "";

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
        <div className="shelter-dog-card-header">
          <h3 className="shelter-dog-card-name">{dog.name}</h3>
          {SexIcon && (
            <SexIcon
              size={14}
              weight="light"
              className="shelter-dog-card-sex"
              aria-label={sexLabel}
            />
          )}
        </div>

        <div className="shelter-dog-card-meta">
          {[dog.breed, dog.ageLabel].filter(Boolean).join(" · ")}
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
      </div>
    </Link>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────── */

type AutoChip = { label: string; tone: "pending" | "new" | "long" };

function pickAutoChip(dog: PetProfile): AutoChip | null {
  if (dog.adoptionStatus === "pending") {
    return { label: "Adoption pending", tone: "pending" };
  }
  const days = dog.daysInKennel ?? 0;
  if (days <= 7) return { label: "New arrival", tone: "new" };
  if (days >= 30) return { label: "Long-stayer", tone: "long" };
  return null;
}

/** Compact relative-day phrasing — "today", "yesterday", "3d ago". */
function formatRelativeDay(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}
