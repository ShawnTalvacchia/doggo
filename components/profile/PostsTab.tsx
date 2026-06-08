"use client";

import { useMemo, useState } from "react";
import { Camera } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PostsCollectionView } from "@/components/posts/PostsCollectionView";
import { HighlightsStrip } from "@/components/photos/HighlightsStrip";
import { EditHighlightsModal } from "@/components/photos/EditHighlightsModal";
import { usePostComposer } from "@/contexts/PostComposerContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { getPostsByUser } from "@/lib/mockPosts";
import { isPostVisibleTo } from "@/lib/postVisibility";
import { getUserById } from "@/lib/mockUsers";
import { usePhotoAlbumOverrides } from "@/lib/usePhotoAlbumOverrides";

interface PostsTabProps {
  userId: string;
  isOwnProfile?: boolean;
}

/**
 * Posts tab on profile surfaces. Renders two contained sections
 * (`.dog-profile-section`) matching the dog page's chrome — Highlights
 * + Posts. Same shape, same surface, same divider between them across
 * both surfaces so users see consistent affordances when browsing a
 * person's wall vs a dog's wall. 2026-06-04 unification.
 *
 * Composer affordance lives in the page-action slot, NOT in-panel —
 * matches the Communities pattern (outline Post button next to the
 * header). ShareMomentBar was retired from this surface 2026-06-04.
 *
 * Photos & Galleries phase, 2026-06-04.
 */
export function PostsTab({ userId, isOwnProfile = false }: PostsTabProps) {
  const { openComposer } = usePostComposer();
  const viewerId = useCurrentUserId();
  const isOwnerView = isOwnProfile && viewerId === userId;

  const user = getUserById(userId);
  const subjectLabel = user?.firstName ?? "this user";

  const allByAuthor = getPostsByUser(userId);
  const visiblePosts = useMemo(
    () => allByAuthor.filter((p) => isPostVisibleTo(p, viewerId)),
    [allByAuthor, viewerId],
  );

  const overrides = usePhotoAlbumOverrides(userId, user?.highlights ?? []);
  const [editOpen, setEditOpen] = useState(false);

  const urlBase = isOwnProfile ? "/profile" : `/profile/${userId}`;

  const hasAnything = visiblePosts.length > 0 || overrides.highlights.length > 0;

  if (!hasAnything) {
    return (
      <div
        className="flex flex-col items-center gap-lg text-center"
        style={{ padding: "var(--space-jumbo-1) var(--space-xl)" }}
      >
        <Camera size={48} weight="light" className="text-fg-tertiary" />
        <p className="text-sm text-fg-secondary m-0">
          {isOwnProfile ? "Share your first dog moment" : "No posts yet"}
        </p>
        {isOwnProfile && (
          <div style={{ marginTop: "var(--space-sm)" }}>
            <ButtonAction
              variant="primary"
              size="md"
              onClick={() => openComposer()}
              leftIcon={<Camera size={16} weight="light" />}
            >
              Share a moment
            </ButtonAction>
          </div>
        )}
      </div>
    );
  }

  // Apply owner-side hide filter (own-profile only — non-owners never
  // see the hide list).
  const surfacedPosts = isOwnerView
    ? visiblePosts.filter((p) => !overrides.hiddenPostIds.has(p.id))
    : visiblePosts;

  return (
    <div className="flex flex-col">
      <HighlightsStrip
        highlights={overrides.highlights}
        subjectLabel={subjectLabel}
        isOwnerView={isOwnerView}
        onEdit={() => setEditOpen(true)}
        collection={surfacedPosts}
      />

      <div className="dog-profile-section">
        <h2 className="dog-profile-section-title">Posts</h2>
        <PostsCollectionView
          posts={surfacedPosts}
          subjectLabel={subjectLabel}
          urlBase={urlBase}
        />
      </div>

      <EditHighlightsModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        subjectLabel={subjectLabel}
        highlights={overrides.highlights}
        onReorder={overrides.reorderHighlights}
        onUnpin={overrides.unpinHighlight}
      />
    </div>
  );
}
