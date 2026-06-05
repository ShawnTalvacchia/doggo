import { useCallback } from "react";
import { usePersistedState } from "./usePersistedState";

type DecisionMap = Record<string, "approved" | "rejected">;

function key(postId: string, dogId: string) {
  return `${postId}::${dogId}`;
}

/**
 * Demo carve-out: these `(postId, dogId)` pairs default to **pending**
 * (instead of the grandfathered-approved default below), so the
 * approval queue has concrete items to demo for review-mode owners.
 *
 * Edit this list to curate demo state — add a pair to surface a tag
 * in the queue, remove one to make that tag auto-approved by default.
 * Owner approve/reject decisions persist per-viewer and override these
 * defaults (so once Daniel decides on `post-bara-klara-progress`, the
 * decision sticks across reloads).
 */
export const DEMO_PENDING_TAGS: ReadonlyArray<{ postId: string; dogId: string }> = [
  { postId: "post-bara-klara-progress", dogId: "bara" },
  { postId: "post-franta-hana-meet", dogId: "bara" },
];

function isDemoPending(postId: string, dogId: string): boolean {
  return DEMO_PENDING_TAGS.some((d) => d.postId === postId && d.dogId === dogId);
}

/**
 * Per-viewer record of approve/reject decisions on tags applied to
 * the viewer's owned dogs (Photos & Galleries D4).
 *
 * **Default behavior** for users with `tagApproval === "approve"`:
 * pre-existing dog-tag-on-owned-dog pairs are treated as **approved**
 * (grandfathered — owners shouldn't have to wade through historical
 * tags to review them retroactively). The `DEMO_PENDING_TAGS` carve-
 * out flips specific pairs to **pending** so the queue surface has
 * concrete items to act on for demo purposes.
 *
 * Once the owner explicitly approves or rejects a tag, the persisted
 * decision overrides the default forever — no aging out, no
 * auto-approval from inaction.
 *
 * For users with `tagApproval === "auto"` (default), this store is
 * unused — every tag is treated as approved on render.
 *
 * Photos & Galleries phase, 2026-06-04.
 */
export function usePendingTagsStore(viewerId: string) {
  const [decisions, setDecisions] = usePersistedState<DecisionMap>(
    `tags:decisions:${viewerId}`,
    {},
  );

  const getDecision = useCallback(
    (postId: string, dogId: string): "approved" | "rejected" | "pending" => {
      const persisted = decisions[key(postId, dogId)];
      if (persisted) return persisted;
      // No persisted decision → derive default from the demo carve-out.
      return isDemoPending(postId, dogId) ? "pending" : "approved";
    },
    [decisions],
  );

  const approve = useCallback(
    (postId: string, dogId: string) => {
      setDecisions((prev) => ({ ...prev, [key(postId, dogId)]: "approved" }));
    },
    [setDecisions],
  );

  const reject = useCallback(
    (postId: string, dogId: string) => {
      setDecisions((prev) => ({ ...prev, [key(postId, dogId)]: "rejected" }));
    },
    [setDecisions],
  );

  return { getDecision, approve, reject };
}
