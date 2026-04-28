"use client";

/**
 * DogsNearYou — horizontal strip of dog avatars shown on the Community feed
 * in new-user mode. Per the meet-card anatomy + dog-forward thesis (see
 * `docs/features/meets.md` → Meet-card anatomy), this section renders dog
 * photos primary, falling back to the owner's avatar only when the dog image
 * can't be resolved. The label is the dog's name — "Rex," "Goldie" — not the
 * owner's.
 */

import { Dog } from "@phosphor-icons/react";
import { mockMeets } from "@/lib/mockMeets";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { getNeighbourhoodStats } from "@/lib/mockNeighbourhoodStats";
import { getDogImageByOwnerAndName } from "@/lib/dogLookup";

interface NearbyDog {
  userId: string;
  userName: string;
  ownerAvatarUrl: string;
  dogName: string;
}

/** Deduplicated list of dogs from all meet attendees (excluding current user). */
function getNeighbourhoodDogs(currentUserId: string): NearbyDog[] {
  const seen = new Set<string>();
  const dogs: NearbyDog[] = [];

  for (const meet of mockMeets) {
    for (const attendee of meet.attendees) {
      if (attendee.userId === currentUserId) continue;
      for (const dogName of attendee.dogNames) {
        const key = `${attendee.userId}-${dogName}`;
        if (seen.has(key)) continue;
        seen.add(key);
        dogs.push({
          userId: attendee.userId,
          userName: attendee.userName,
          ownerAvatarUrl: attendee.avatarUrl,
          dogName,
        });
      }
    }
  }
  return dogs;
}

export function DogsNearYou() {
  const currentUserId = useCurrentUserId();
  const dogs = getNeighbourhoodDogs(currentUserId);
  const stats = getNeighbourhoodStats();

  if (dogs.length === 0) return null;

  return (
    <section className="flex flex-col gap-sm">
      {/* Section header — inset so it respects page padding even though the
          scroll row below bleeds to the edge. */}
      <div className="flex items-center gap-xs px-md">
        <Dog size={14} weight="light" className="text-fg-tertiary" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary m-0">
          {stats.activeDogs} dogs in {stats.neighbourhood}
        </h2>
      </div>

      {/* Horizontal avatar strip — edge-to-edge for a natural scroll. */}
      <div
        className="flex gap-md pb-sm px-md"
        style={{ overflowX: "auto", scrollSnapType: "x mandatory" }}
      >
        {dogs.map((dog) => {
          // Dog-forward: prefer the dog photo, fall back to owner avatar when
          // the dog image can't be resolved (keeps the strip visually full).
          const dogImg = getDogImageByOwnerAndName(dog.userId, dog.dogName);
          const imageUrl = dogImg ?? dog.ownerAvatarUrl;
          return (
            <div
              key={`${dog.userId}-${dog.dogName}`}
              className="flex flex-col items-center gap-xs flex-shrink-0"
              style={{ scrollSnapAlign: "start", width: 72 }}
            >
              <img
                src={imageUrl}
                alt={dogImg ? `${dog.dogName} (${dog.userName}'s dog)` : dog.userName}
                className="rounded-full"
                style={{
                  width: 48,
                  height: 48,
                  objectFit: "cover",
                  border: "2px solid var(--border-light)",
                }}
              />
              <span className="text-xs text-fg-secondary text-center" style={{ lineHeight: 1.2 }}>
                {dog.dogName}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
