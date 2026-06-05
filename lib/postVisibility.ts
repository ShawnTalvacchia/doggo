import type { Post } from "./types";
import { getGroupById } from "./mockGroups";
import { getUserById } from "./mockUsers";
import { getConnectionState } from "./mockConnections";

/**
 * Two-gate visibility check for a single post.
 *
 * Source of truth: `docs/strategy/Content Visibility Model.md`. The model
 * defines two independent gates that must BOTH pass:
 *
 *   1. **Context gate** — for community-attached posts (`post.groupId` set),
 *      group membership controls visibility (open groups → public,
 *      private/approval groups → members only).
 *   2. **Relationship gate** — for personal posts (no `groupId`), the
 *      author's profile visibility (Open/Locked) combined with the
 *      viewer-author connection state controls visibility.
 *
 * **Tags never expand audience** (Content Visibility Model.md line 183).
 * Even if `post.tags` includes the viewer or one of their dogs, that
 * doesn't grant visibility — the viewer must already pass the gate above
 * via group membership or relationship.
 *
 * Author-owned posts: the author always sees their own posts.
 *
 * Unknown authors (shelter ids, walker bridge ids not in the user
 * registry) are treated as visible. Shelter-authored posts are
 * institutional voice; walker posts that aren't bridged to a user
 * default to public — consistent with how the shelter feed surfaces
 * them today.
 */
export function isPostVisibleTo(
  post: Post,
  viewerId: string | null | undefined,
): boolean {
  if (viewerId && post.authorId === viewerId) return true;

  // Context gate — community posts.
  if (post.groupId) {
    const group = getGroupById(post.groupId);
    if (!group) return true;
    if (group.visibility === "open") return true;
    if (!viewerId) return false;
    return group.members.some((m) => m.userId === viewerId);
  }

  // Relationship gate — personal posts.
  const author = getUserById(post.authorId);
  if (!author) return true; // shelter / unbridged-walker → public

  if (author.profileVisibility !== "locked") return true;

  if (!viewerId) return false;
  const conn = getConnectionState(post.authorId, viewerId);
  if (!conn) return false;
  if (conn.state === "connected") return true;
  // Author marked viewer Familiar → author granted visibility.
  // Per Content Visibility Model table 3: viewer marking author Familiar
  // alone does NOT grant access (that direction is one-sided trust from
  // the viewer's side, not author-granted visibility).
  if (conn.theyMarkedFamiliar) return true;
  return false;
}
