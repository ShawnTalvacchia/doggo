"use client";

import type { Post } from "@/lib/types";
import { usePostDetail } from "@/contexts/PostDetailContext";

interface PhotoGridProps {
  posts: Post[];
  /** Used in alt-text. */
  subjectLabel: string;
  /**
   * Optional per-tile menu overlaid on top-right (the kebab pattern).
   * Currently unused — the post detail modal opens via tap and
   * carries the PostKebabMenu via MomentCardFromPost. Kept as an
   * escape hatch for surfaces that want tile-level actions.
   */
  renderTileMenu?: (post: Post) => React.ReactNode;
}

/**
 * Viewer-aware photo grid — one tile per post, first photo only, square
 * crop. Tap → opens the parent post in the global post-detail modal
 * (carries the full MomentCard: caption, author, tags, reactions,
 * comments). The PostKebabMenu inside the modal is the unified surface
 * for pin / unpin / hide / untag / etc.
 *
 * Visibility filtering is the CALLER's responsibility — pass posts
 * already filtered via `getPostsByDog` / `isPostVisibleTo`. This
 * component just renders.
 *
 * Used by:
 *  - `/dogs/[id]` auto-album (Photos & Galleries A2/A3)
 *  - profile Posts tab grid view (B1)
 */
export function PhotoGrid({ posts, subjectLabel, renderTileMenu }: PhotoGridProps) {
  const { openPost } = usePostDetail();

  return (
    <div className="photo-grid">
      {posts.map((post) => {
        const photo = post.photos[0];
        if (!photo) return null;
        return (
          <div key={post.id} className="photo-grid-tile">
            <button
              type="button"
              className="photo-grid-tile-button"
              onClick={() => openPost(post.id, { collection: posts })}
              aria-label={`Open post by ${post.authorName}`}
            >
              <img
                src={photo}
                alt={`Photo of ${subjectLabel} by ${post.authorName}`}
                className="photo-grid-tile-img"
                loading="lazy"
              />
            </button>
            {renderTileMenu && (
              <div className="photo-grid-tile-menu">{renderTileMenu(post)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
