import type { Post } from "./types";
import { mockPosts } from "./mockPosts";
import { getOwnedDogWithOwner } from "./mockUsers";
import { isPostVisibleTo } from "./postVisibility";

/**
 * All posts that tag a given dog, filtered to what `viewerId` can see.
 *
 * Owner viewing their own dog sees EVERY tagged post regardless of the
 * poster's relationship to the owner — the owner is the dog's authority
 * (Open Questions §12 resolution, 2026-06-01). Non-owner viewers see
 * only posts that pass the two-gate visibility model (see
 * `isPostVisibleTo` + `Content Visibility Model.md`).
 *
 * Shelter dogs: there's no single "owner user" to bypass for, so the
 * viewer-gated view applies. The shelter's `tagApproval` setting is
 * enforced upstream when tags are written; this resolver doesn't
 * re-check it. Shelter operator UI is deferred to V3+.
 *
 * Posts are returned newest-first. Hide-from-album state is intentionally
 * NOT applied here — consumers filter their own hide list at the album
 * surface so the resolver stays canonical.
 *
 * Replaces the dog-agnostic `getDogPosts` previously in `lib/mockShelters.ts`.
 */
export function getPostsByDog(
  dogId: string,
  viewerId: string | null | undefined,
): Post[] {
  const ownedDog = getOwnedDogWithOwner(dogId);
  const isOwnerView = !!viewerId && ownedDog?.owner.id === viewerId;

  return mockPosts
    .filter((p) => p.tags.some((t) => t.type === "dog" && t.id === dogId))
    .filter((p) => isOwnerView || isPostVisibleTo(p, viewerId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
