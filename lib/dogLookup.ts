/**
 * Dog lookup helpers — bridge between MeetAttendee records and PetProfile data.
 *
 * `MeetAttendee.dogNames: string[]` carries dog names as strings to keep
 * attendee payloads lightweight, but cards and detail pages often need the
 * actual Pet record (image, breed, energy). These helpers resolve a
 * `(userId, dogName)` pair to a `PetProfile` by joining back to the owner's
 * profile via `getUserById`.
 *
 * Returns `undefined` if the user isn't found or has no dog by that name —
 * callers should degrade gracefully (fall back to owner avatar, etc.).
 */

import type { PetProfile } from "./types";
import { getUserById } from "./mockUsers";

/** Find a dog (PetProfile) by its owner's userId and its display name. */
export function getDogByOwnerAndName(
  userId: string,
  dogName: string
): PetProfile | undefined {
  const user = getUserById(userId);
  if (!user) return undefined;
  return user.pets.find((p) => p.name === dogName);
}

/** Shorthand: get just the image URL for a dog, or undefined if unknown. */
export function getDogImageByOwnerAndName(
  userId: string,
  dogName: string
): string | undefined {
  return getDogByOwnerAndName(userId, dogName)?.imageUrl;
}

/**
 * Resolve all dogs for a given attendee-like record (userId + dogNames).
 * Unknown dogs are dropped from the result rather than returning placeholders,
 * since the card fallback (owner avatar) should kick in for those cases.
 */
export function getDogsForAttendee(
  userId: string,
  dogNames: string[]
): PetProfile[] {
  return dogNames
    .map((name) => getDogByOwnerAndName(userId, name))
    .filter((p): p is PetProfile => p != null);
}
