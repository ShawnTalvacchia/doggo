"use client";

/**
 * Pet-as-protagonist hero used on the Sessions tab AND the focused
 * active-session sub-route. Full-width rounded photo (Rule B: dogs are
 * rounded, people are circles) + 24px name heading + small meta line
 * (breed · age) for single-pet bookings.
 *
 * Walkthrough surfaced that the dog's name was nowhere on the Sessions
 * tab; testers had to hunt through note text to confirm. The hero
 * treatment also nudges owners toward better photo hygiene — your dog
 * gets rendered at this scale, you tend to upload a good photo.
 *
 * Multi-pet: primary photo + names joined with " & "; meta line skipped
 * (which dog's breed?). Full multi-pet treatment lands when a multi-pet
 * booking enters mock data (Open Q §4).
 *
 * Sessions & Service Execution, 2026-05-08; extracted to shared
 * component 2026-05-08 alongside the active-session sub-route.
 */

import type { PetProfile } from "@/lib/types";

export function SessionsPetHeader({
  pets,
}: {
  pets: PetProfile[];
}) {
  if (pets.length === 0) return null;
  const primary = pets[0];
  const isMulti = pets.length > 1;
  const petLabel = isMulti
    ? pets.map((p) => p.name).join(" & ")
    : primary.name;
  const metaParts = isMulti
    ? []
    : [primary.breed, primary.ageLabel].filter((s) => s && s.trim());

  return (
    // Outer gap matches the active-session page's section rhythm so
    // the dog name reads as its own section below the hero photo
    // rather than crowding the frame. 2026-05-08 walkthrough.
    <div className="flex flex-col gap-xl">
      <div
        className="rounded-panel overflow-hidden bg-surface-inset w-full"
        style={{ maxHeight: "clamp(160px, 45vw, 240px)" }}
      >
        <img
          src={primary.imageUrl}
          alt={primary.name}
          className="block w-full object-cover object-center"
          style={{ maxHeight: "clamp(160px, 45vw, 240px)" }}
        />
      </div>
      <div className="flex flex-col gap-xs">
        <h2
          className="font-heading font-semibold text-fg-primary m-0"
          style={{ fontSize: "24px", lineHeight: 1.15 }}
        >
          {petLabel}
        </h2>
        {metaParts.length > 0 && (
          <span className="text-sm text-fg-tertiary font-normal">
            {metaParts.join(" · ")}
          </span>
        )}
      </div>
    </div>
  );
}
