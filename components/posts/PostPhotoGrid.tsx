"use client";

import { usePostDetail } from "@/contexts/PostDetailContext";
import type { Post } from "@/lib/types";

interface PostPhotoGridProps {
  photos: string[];
  /** When set, each photo becomes a tap-target that opens the post in
   *  the global lightbox. Pass the parent post's id from any caller
   *  that renders a feed post (MomentCard / FeedCommunityPost /
   *  FeedPersonalPost). 2026-06-04. */
  postId?: string;
  /** Optional collection — passed through to the lightbox so cross-post
   *  swipe / ← → nav traverses the surrounding posts. PostsCollectionView
   *  passes the visible-posts list; feed surfaces can omit. */
  collection?: Post[];
  /** Legacy prop — ignored */
  fullBleed?: boolean;
}

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' fill='%23e8e8e8'%3E%3Crect width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14' fill='%23999'%3EPhoto%3C/text%3E%3C/svg%3E";

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = PLACEHOLDER;
}

/**
 * Threads-style photo grid inside a feed-card. Single horizontal row,
 * each image individually rounded; shorter/wider proportions with a
 * visible gap.
 *
 * When `postId` is set, each photo is wrapped in a tap-target that
 * opens the post in the lightbox via `usePostDetail.openPost`. List-
 * view in PostsCollectionView passes both `postId` and `collection`
 * so cross-post swipe nav works the same as it does from grid view.
 * Callers that omit `postId` render plain `<img>`s (legacy behavior).
 */
export function PostPhotoGrid({ photos, postId, collection }: PostPhotoGridProps) {
  const { openPost } = usePostDetail();
  if (photos.length === 0) return null;

  const count = Math.min(photos.length, 4);
  const height = count === 1 ? 320 : 240;
  const width = count === 1 ? "100%" : 200;
  const sized = {
    width,
    minWidth: typeof width === "number" ? width : undefined,
    height,
  };

  return (
    <div className="post-photo-grid">
      {photos.slice(0, 4).map((url, i) =>
        postId ? (
          <button
            key={i}
            type="button"
            className="post-photo-grid-tap"
            onClick={() =>
              openPost(postId, {
                ...(collection ? { collection } : {}),
                photoIndex: i,
              })
            }
            aria-label="Open post"
            style={sized}
          >
            <img
              src={url}
              alt=""
              className="post-photo-grid-img"
              onError={handleImgError}
              style={{ width: "100%", height: "100%" }}
            />
          </button>
        ) : (
          <img
            key={i}
            src={url}
            alt=""
            className="post-photo-grid-img"
            onError={handleImgError}
            style={sized}
          />
        ),
      )}
    </div>
  );
}
