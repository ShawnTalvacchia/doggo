import { useCallback } from "react";
import { usePersistedState } from "./usePersistedState";

type UntagMap = Record<string, string[]>; // postId → [dogId, dogId, ...]

/**
 * Per-viewer "untag my dog" state for the per-post three-dots menu
 * (Photos & Galleries D1).
 *
 * Scoped to the viewer because the source-of-truth mutation (removing
 * the tag from `Post.tags`) needs an editable post store, which the
 * prototype doesn't have. Instead we record "viewer X untagged dog D
 * from post P" and apply it at the consumption layer (the dog auto-
 * album, and — once we have an editable post store — the post chrome
 * itself).
 *
 * Persists per viewer in localStorage; resets with /demo data reset.
 *
 * Photos & Galleries phase, 2026-06-04.
 */
export function useUntagStore(viewerId: string) {
  const [map, setMap] = usePersistedState<UntagMap>(
    `post:untagged-dogs:${viewerId}`,
    {},
  );

  const isUntagged = useCallback(
    (postId: string, dogId: string) => (map[postId] ?? []).includes(dogId),
    [map],
  );

  const getUntaggedDogs = useCallback(
    (postId: string) => map[postId] ?? [],
    [map],
  );

  const untagDog = useCallback(
    (postId: string, dogId: string) => {
      setMap((prev) => {
        const existing = prev[postId] ?? [];
        if (existing.includes(dogId)) return prev;
        return { ...prev, [postId]: [...existing, dogId] };
      });
    },
    [setMap],
  );

  const retagDog = useCallback(
    (postId: string, dogId: string) => {
      setMap((prev) => {
        const existing = prev[postId] ?? [];
        if (!existing.includes(dogId)) return prev;
        const next = existing.filter((id) => id !== dogId);
        const out = { ...prev };
        if (next.length === 0) delete out[postId];
        else out[postId] = next;
        return out;
      });
    },
    [setMap],
  );

  return { isUntagged, getUntaggedDogs, untagDog, retagDog };
}
