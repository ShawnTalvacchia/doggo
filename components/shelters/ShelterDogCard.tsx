"use client";

import Link from "next/link";
import { Clock, PawPrint, ShieldCheck } from "@phosphor-icons/react";
import type { PetProfile } from "@/lib/types";

interface ShelterDogCardProps {
  dog: PetProfile;
}

/**
 * Single-column photo-led card for a shelter dog. Used on the shelter
 * Dogs tab roster. Taps land on `/dogs/[id]`. Photo is the visual
 * centerpiece (pet-as-protagonist) — name, breed/age/sex, kennel
 * stats, and tags sit underneath.
 */
export function ShelterDogCard({ dog }: ShelterDogCardProps) {
  const isLongStayer = (dog.daysInKennel ?? 0) >= 30;
  const isPending = dog.adoptionStatus === "pending";

  // Derived tags include any explicit `dog.tags` PLUS an auto Long-stayer
  // chip when `daysInKennel >= 30` and it wasn't already included manually.
  const tagSet = new Set(dog.tags ?? []);
  if (isLongStayer) tagSet.add("Long-stayer");
  const tagList = [...tagSet];

  const sexLabel = dog.sex === "male" ? "Male" : dog.sex === "female" ? "Female" : null;
  const lineParts = [dog.breed, dog.ageLabel, sexLabel].filter(Boolean);

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
        {isPending && (
          <span className="shelter-dog-card-status">Adoption pending</span>
        )}
      </div>

      <div className="shelter-dog-card-body">
        <div className="flex items-baseline justify-between gap-md">
          <h3 className="shelter-dog-card-name">{dog.name}</h3>
          <span className="shelter-dog-card-line">{lineParts.join(" · ")}</span>
        </div>

        <div className="shelter-dog-card-stats">
          <span className="shelter-dog-card-stat">
            <Clock size={12} weight="light" />
            {dog.daysInKennel != null
              ? `${dog.daysInKennel} ${dog.daysInKennel === 1 ? "day" : "days"} in care`
              : "Just arrived"}
          </span>
          <span className="shelter-dog-card-stat">
            <PawPrint size={12} weight="light" />
            {dog.lastWalkedAt ? `Last walked ${formatRelativeDay(dog.lastWalkedAt)}` : "Hasn't been walked yet"}
          </span>
          {dog.soloOnly && (
            <span className="shelter-dog-card-stat shelter-dog-card-stat--policy">
              <ShieldCheck size={12} weight="light" />
              Solo only
            </span>
          )}
        </div>

        {dog.backstory && (
          <p className="shelter-dog-card-backstory">{dog.backstory}</p>
        )}

        {tagList.length > 0 && (
          <div className="shelter-dog-card-tags">
            {tagList.map((tag) => (
              <span
                key={tag}
                className={`shelter-dog-card-tag${tag === "Long-stayer" ? " shelter-dog-card-tag--long" : ""}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────── */

/** Compact relative-day phrasing — "today", "yesterday", "3 days ago". */
function formatRelativeDay(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}
