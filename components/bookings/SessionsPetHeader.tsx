"use client";

/**
 * Dog header for the booking Sessions tab and the focused active-session
 * sub-route. Two variants (Rule B: dogs are rounded squares, people are
 * circles):
 *  - `compact` — avatar-left (140px rounded square) + name/meta to the
 *    right, like the dog-profile header. Used on BOTH the Sessions tab and
 *    the active/live sub-route (2026-06-22), so hitting "Start session"
 *    keeps the header stable and only the body content changes. Also keeps
 *    the live page's working actions (Log GPS / Add a note / Finish) above
 *    the fold and avoids stretching the landscape photo into a thin band.
 *  - `full` — full-width rounded photo + 24px name + meta line (the original
 *    pet-as-protagonist hero). Currently unused; retained as the alternative
 *    (revises the CLAUDE.md "pet-as-protagonist on the Sessions tab"
 *    convention — if compact-everywhere sticks, `full` can be removed).
 *
 * Walkthrough surfaced that the dog's name was nowhere on the Sessions
 * tab; testers had to hunt through note text to confirm. The full hero
 * also nudges owners toward better photo hygiene — your dog gets
 * rendered at scale, you tend to upload a good photo.
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
  variant = "full",
}: {
  pets: PetProfile[];
  variant?: "full" | "compact";
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

  // Compact: avatar-left + info-right (dog-profile header shape).
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-xl">
        <img
          src={primary.imageUrl}
          alt={primary.name}
          className="rounded-panel object-cover bg-surface-inset shrink-0"
          style={{ width: 140, height: 140 }}
        />
        <div className="flex flex-col gap-xs min-w-0">
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
