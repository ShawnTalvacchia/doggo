"use client";

/**
 * DogsNearYou — horizontal strip of dog avatars shown on the Community feed
 * in new-user mode. Per the meet-card anatomy + dog-forward thesis (see
 * `docs/features/meets.md` → Meet-card anatomy), this section renders dog
 * photos primary, falling back to the owner's avatar only when the dog image
 * can't be resolved. The label is the dog's name — "Rex," "Goldie" — not the
 * owner's.
 *
 * Locality-aware. The strip shows dogs whose owners live in the viewer's
 * neighbourhood (filtered via `UserProfile.neighbourhood`). For the new-user
 * persona (no neighbourhood set), defaults to "Vinohrady" — the demo's anchor
 * locality. Stats (count + neighbourhood label) come from
 * `getNeighbourhoodStats(neighbourhood)` which derives the dog count from
 * `mockUsers` rather than a hardcoded magic value. Closes data side of P10.
 */

import { Dog } from "@phosphor-icons/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getNeighbourhoodStats } from "@/lib/mockNeighbourhoodStats";
import { getDogImageByOwnerAndName } from "@/lib/dogLookup";
import { allUsers } from "@/lib/mockUsers";

interface NearbyDog {
  userId: string;
  userName: string;
  ownerAvatarUrl: string;
  dogName: string;
}

/**
 * Dogs whose owners live in the target neighbourhood. Pulled from
 * `mockUsers` (the source of truth for user-neighbourhood mapping) rather
 * than scraping meet attendees regardless of locality.
 */
function getNeighbourhoodDogs(
  neighbourhood: string,
  currentUserId: string,
): NearbyDog[] {
  const dogs: NearbyDog[] = [];
  for (const user of allUsers) {
    if (user.id === currentUserId) continue;
    if (user.neighbourhood !== neighbourhood) continue;
    for (const pet of user.pets) {
      dogs.push({
        userId: user.id,
        userName: user.firstName,
        ownerAvatarUrl: user.avatarUrl,
        dogName: pet.name,
      });
    }
  }
  return dogs;
}

const FALLBACK_NEIGHBOURHOOD = "Vinohrady";

export function DogsNearYou() {
  const viewer = useCurrentUser();
  // New-user persona has no `neighbourhood` set — default to the demo's
  // anchor locality so the strip has something to show.
  const neighbourhood = viewer.neighbourhood ?? FALLBACK_NEIGHBOURHOOD;
  const dogs = getNeighbourhoodDogs(neighbourhood, viewer.id);
  const stats = getNeighbourhoodStats(neighbourhood);

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
