"use client";

import Link from "next/link";
import { CaretRight, PawPrint } from "@phosphor-icons/react";
import type { ShelterProfile } from "@/lib/types";
import { countDogsNeedingWalks } from "@/lib/mockShelters";

interface DiscoverShelterCardProps {
  shelter: ShelterProfile;
}

/**
 * Shelter row on the Help a Dog Discover surface (Shelters pill view).
 *
 * Banner thumbnail + circular logo + name + meta line (location · dogs in
 * care · X need walks now) + tail caret. Tap routes to /shelters/[id].
 *
 * Avatar Rule B: shelter logo is a circle (institutional entity, like
 * communities and user profiles). The dogs are squares elsewhere; only
 * the logo on this card is circular.
 */
export function DiscoverShelterCard({ shelter }: DiscoverShelterCardProps) {
  const dogCount = shelter.dogs.length;
  const needWalks = countDogsNeedingWalks(shelter);

  return (
    <Link
      href={`/shelters/${shelter.id}`}
      className="discover-shelter-card"
      style={{ textDecoration: "none" }}
    >
      <div
        className="discover-shelter-card-banner"
        style={{ backgroundImage: `url(${shelter.bannerUrl})` }}
      >
        <span
          className="discover-shelter-card-logo"
          style={{ backgroundImage: `url(${shelter.logoUrl})` }}
          aria-hidden="true"
        />
      </div>
      <div className="discover-shelter-card-body">
        <div className="discover-shelter-card-headline">
          <h3 className="discover-shelter-card-name">{shelter.name}</h3>
          <CaretRight size={18} weight="light" className="text-fg-tertiary shrink-0" />
        </div>
        <div className="discover-shelter-card-meta">
          <span>{shelter.location}</span>
          <span aria-hidden="true">·</span>
          <span className="discover-shelter-card-meta-dogs">
            <PawPrint size={12} weight="light" />
            {dogCount} {dogCount === 1 ? "dog" : "dogs"} in care
          </span>
          {needWalks > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="discover-shelter-card-meta-need">
                {needWalks} need {needWalks === 1 ? "a walk" : "walks"} now
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
