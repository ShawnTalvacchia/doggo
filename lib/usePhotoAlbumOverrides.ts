import { useCallback } from "react";
import { usePersistedState } from "./usePersistedState";

/**
 * Owner overrides on a photo-album surface — works for both per-dog
 * (`/dogs/[id]`) and per-user (`/profile/[id]` Posts tab) collections.
 *
 *  - `hiddenPostIds` — posts the owner has hidden from the auto-album.
 *    The post stays elsewhere; tags stay on the post. Just suppressed
 *    on THIS owner's album surface for THIS subject.
 *  - `highlights` — the owner-managed list of curated photo URLs
 *    (Instagram-style "pinned"). Initial value comes from the seeded
 *    `PetProfile.highlights` (dog subject) or `UserProfile.highlights`
 *    (user subject); once the owner touches it (pin / unpin / reorder),
 *    the persisted list becomes authoritative.
 *
 * `subjectId` namespaces the localStorage keys — pass `dog.id` or
 * `user.id`. PROTOTYPE: real persistence back to the seed record wires
 * up when the editable-pets / editable-user context lands; until then,
 * owner edits live in localStorage scoped to the active persona.
 *
 * Photos & Galleries phase, 2026-06-04. Generalized 2026-06-04 from
 * dog-only to dog OR user subject when the Posts/Photos pattern unified.
 */
export function usePhotoAlbumOverrides(subjectId: string, seededHighlights: string[]) {
  const [hiddenList, setHiddenList] = usePersistedState<string[]>(
    `photos:hidden:${subjectId}`,
    [],
  );
  const [highlights, setHighlights] = usePersistedState<string[]>(
    `photos:highlights:${subjectId}`,
    seededHighlights,
  );

  const hiddenPostIds = new Set(hiddenList);
  const pinnedUrls = new Set(highlights);

  const hidePost = useCallback(
    (postId: string) => {
      setHiddenList((prev) => (prev.includes(postId) ? prev : [...prev, postId]));
    },
    [setHiddenList],
  );

  const unhidePost = useCallback(
    (postId: string) => {
      setHiddenList((prev) => prev.filter((id) => id !== postId));
    },
    [setHiddenList],
  );

  const clearHidden = useCallback(() => setHiddenList([]), [setHiddenList]);

  const pinHighlight = useCallback(
    (photoUrl: string) => {
      setHighlights((prev) => (prev.includes(photoUrl) ? prev : [...prev, photoUrl]));
    },
    [setHighlights],
  );

  const unpinHighlight = useCallback(
    (photoUrl: string) => {
      setHighlights((prev) => prev.filter((url) => url !== photoUrl));
    },
    [setHighlights],
  );

  const reorderHighlights = useCallback(
    (next: string[]) => setHighlights(next),
    [setHighlights],
  );

  const clearHighlights = useCallback(() => setHighlights([]), [setHighlights]);

  return {
    hiddenPostIds,
    highlights,
    pinnedUrls,
    hidePost,
    unhidePost,
    clearHidden,
    pinHighlight,
    unpinHighlight,
    reorderHighlights,
    clearHighlights,
  };
}
