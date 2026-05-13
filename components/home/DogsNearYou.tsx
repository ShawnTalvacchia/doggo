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

import { Dog, User } from "@phosphor-icons/react";
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

  // Conditional subheader copy — anchors the section's intent so users
  // don't read it as "dogs up for adoption?" or some other ambiguous
  // frame. Speaks to the user's own pet(s) when present (more inviting),
  // falls back to a meet-context line when there are no pets seeded.
  // 2026-05-11 walkthrough B5.1 iteration.
  const petNames = viewer.pets.map((p) => p.name);
  const subheaderText =
    petNames.length === 0
      ? "Some of the dogs you'll see at meets near you"
      : petNames.length === 1
        ? `Dogs in your area for ${petNames[0]} to make friends with`
        : `Dogs in your area for ${petNames[0]} and ${petNames[1]} to make friends with`;

  if (dogs.length === 0) return null;

  return (
    <section
      className="flex flex-col gap-md py-xl border-edge-regular"
      style={{ borderTopWidth: 1, borderBottomWidth: 1 }}
    >
      {/* Section header — promoted from quiet `uppercase tertiary` label to a
          proper heading-scale title (CCFT walkthrough B5.1, 2026-05-11). The
          old label-style header undersold the section; this is a real
          neighbourhood-discovery moment for new users + low-engagement
          viewers. `px-lg` keeps content alignment with the card-row inset. */}
      <div className="flex flex-col gap-tiny" style={{ paddingLeft: "var(--space-xl)", paddingRight: "var(--space-xl)" }}>
        <div className="flex items-center gap-xs">
          <Dog size={18} weight="light" className="text-fg-secondary" />
          <h2 className="font-heading text-lg font-semibold text-fg-primary m-0">
            {stats.activeDogs} dogs in {stats.neighbourhood}
          </h2>
        </div>
        <p className="text-sm text-fg-secondary m-0">
          {subheaderText}
        </p>
      </div>

      {/* Horizontal card strip — dog photo primary, owner avatar overlap
          carries the relationship.
          ── Layout decision (CCFT B5.1, 2026-05-11):
          The earlier strip rendered dogs disconnected from owners (dog
          photo + dog name, no owner cue). Felt off vs the community-
          first thesis — people-around-you matters as much as
          dogs-around-you. Inverted the `OwnerDogAvatar` shape: large
          dog photo (160px rounded-square per Rule B) + small owner
          circle (44px) overlapping bottom-right with a surface-ring to
          pop. Two stacked labels (dog primary + owner secondary)
          confirm the relationship for accessibility + casual scrollers.
          Inlined for now; extract to `DogOwnerAvatar` if a second
          consumer surfaces. */}
      <div
        className="dogs-near-you-strip flex"
        style={{
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          // No `gap` on the flex container — spacing is handled by
          // explicit margin-right on each card + leading/trailing
          // spacer divs (below). Multiple earlier iterations tried
          // padding-left on the scroll container and CSS-class
          // first-child rules; none landed visibly. The spacer-div
          // approach is dumb but bulletproof — there's literally an
          // element taking up width before the first card.
          paddingBottom: "var(--space-xs)",
        }}
      >
        {/* Leading spacer — guarantees the first card sits 20px from
            the strip's left edge regardless of any flex/overflow quirk. */}
        <div
          aria-hidden="true"
          style={{ flexShrink: 0, width: "var(--space-xl)" }}
        />
        {dogs.map((dog, idx) => {
          // Dog-forward: prefer the dog photo, fall back to owner avatar when
          // the dog image can't be resolved (keeps the strip visually full).
          const dogImg = getDogImageByOwnerAndName(dog.userId, dog.dogName);
          const imageUrl = dogImg ?? dog.ownerAvatarUrl;
          return (
            <div
              key={`${dog.userId}-${dog.dogName}`}
              className="flex flex-col items-start gap-md flex-shrink-0"
              style={{
                scrollSnapAlign: "start",
                width: 160,
                // `marginRight` on every card serves as the gap between
                // cards. On the last card it doubles as the trailing
                // inset so the rightmost card doesn't sit hard against
                // the panel edge when scrolled all the way right.
                marginRight: "var(--space-xl)",
              }}
            >
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={dogImg ? `${dog.dogName} (${dog.userName}'s dog)` : dog.userName}
                  /* Rule B: dogs render as rounded squares; owner-fallback
                     stays a circle. Discover Refinement F sweep,
                     2026-05-10. */
                  className={dogImg ? "rounded-md" : "rounded-full"}
                  style={{
                    width: 160,
                    height: 160,
                    objectFit: "cover",
                    border: "1px solid var(--border-light)",
                  }}
                />
                {/* Owner avatar overlap — only renders when the main image
                    is the dog (else the main IS the owner and a second
                    overlap is redundant). 3px surface-base ring pops the
                    overlap off the dog photo edge. Sized 64px (was 44px
                    in v1) for more presence; positioned -10px on bottom
                    + right so it breaks the dog-photo edge cleanly.
                    Tweaked 2026-05-11 walkthrough iteration. */}
                {dogImg && (
                  <img
                    src={dog.ownerAvatarUrl}
                    alt={dog.userName}
                    className="rounded-full absolute object-cover"
                    style={{
                      width: 64,
                      height: 64,
                      bottom: -10,
                      right: -10,
                      border: "3px solid var(--surface-base)",
                    }}
                  />
                )}
              </div>
              <div className="flex flex-col gap-tiny min-w-0">
                <span className="text-sm font-semibold text-fg-primary truncate">
                  {dog.dogName}
                </span>
                {/* User icon before the owner name disambiguates the
                    secondary label — without it, "Jana" alone reads as
                    "another dog?" given the dog-name is right above.
                    Asymmetric (no icon on the dog name) because the
                    dog name is already disambiguated by the large dog
                    photo above. 2026-05-11 walkthrough iteration. */}
                <span className="flex items-center gap-xs text-xs text-fg-tertiary min-w-0">
                  <User size={11} weight="light" className="shrink-0" />
                  <span className="truncate">{dog.userName}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
