"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  X,
  CaretLeft,
  CaretRight,
  Heart,
  ChatCircle,
  PaperPlaneTilt,
  HandHeart,
} from "@phosphor-icons/react";
import { CommentThread } from "@/components/feed/CommentThread";
import { TagPillRow } from "@/components/posts/TagPill";
import { PostKebabMenu } from "@/components/posts/PostKebabMenu";
import { resolveAuthorHref, resolveAuthorAvatarUrl } from "@/components/feed/MomentCard";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { getUserById } from "@/lib/mockUsers";
import type { Post } from "@/lib/types";

interface PostLightboxProps {
  post: Post;
  /** When provided, ←/→ navigation moves between posts in this list.
   *  Without a collection, the lightbox shows just one post with no
   *  cross-post nav (only the close × surfaces). */
  collection?: Post[];
  onClose: () => void;
  /** Called when the user navigates to a different post in the
   *  collection — lets the parent context update its tracked active
   *  post id so the modal state survives parent re-renders. */
  onNavigate?: (postId: string) => void;
}

/**
 * Photo-led lightbox for a single post. Replaces the centered
 * ModalSheet treatment with a full-viewport overlay: dark backdrop,
 * photo dominant on the left (full-bleed on mobile, ~62% on
 * desktop), sidebar on the right with author + caption + tags +
 * reactions + comments. The PostKebabMenu sits in the sidebar header
 * so all per-post actions remain available.
 *
 * Navigation:
 *  - ← / → arrow keys (and on-screen prev/next buttons when in a
 *    multi-post collection) navigate between posts.
 *  - Esc closes.
 *  - Multi-photo posts get a small in-photo prev/next + a "1/4"
 *    counter overlay; otherwise just the main photo.
 *
 * Photos & Galleries phase, 2026-06-04.
 */
export function PostLightbox({
  post,
  collection,
  onClose,
  onNavigate,
}: PostLightboxProps) {
  const viewerId = useCurrentUserId();

  // Index within the collection (or 0 when no collection).
  const collectionIndex = useMemo(() => {
    if (!collection) return -1;
    return collection.findIndex((p) => p.id === post.id);
  }, [collection, post.id]);
  const hasPrevPost =
    !!collection && collectionIndex > 0;
  const hasNextPost =
    !!collection && collectionIndex >= 0 && collectionIndex < collection.length - 1;

  // Within-post photo navigation.
  const [photoIdx, setPhotoIdx] = useState(0);
  // Reset photo index when the post changes.
  useEffect(() => setPhotoIdx(0), [post.id]);

  const photoCount = post.photos.length;
  const hasPrevPhoto = photoIdx > 0;
  const hasNextPhoto = photoIdx < photoCount - 1;

  const goPrevPost = () => {
    if (!hasPrevPost) return;
    onNavigate?.(collection![collectionIndex - 1].id);
  };
  const goNextPost = () => {
    if (!hasNextPost) return;
    onNavigate?.(collection![collectionIndex + 1].id);
  };

  // Keyboard navigation. Esc closes; ←/→ navigates posts when in a
  // collection. Photo-level (within-post) navigation lives on the
  // photo's overlay buttons only — we don't bind keys to it because
  // it would conflict with the post-level nav.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrevPost) goPrevPost();
      else if (e.key === "ArrowRight" && hasNextPost) goNextPost();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [hasPrevPost, hasNextPost, collectionIndex]);

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Touch-swipe → cross-post navigation. Scoped to the photo area so
  // scrolling the sidebar (comments etc.) doesn't accidentally switch
  // posts. Threshold + axis-dominance rule (|dx| > |dy|) prevents
  // diagonal/vertical scrolls from triggering. 2026-06-04.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const SWIPE_THRESHOLD = 48;

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (Math.abs(dx) < Math.abs(dy)) return; // vertical scroll wins
    if (dx > 0) {
      // swipe right → previous post
      if (hasPrevPost) goPrevPost();
    } else {
      // swipe left → next post
      if (hasNextPost) goNextPost();
    }
  };

  if (typeof document === "undefined") return null;

  const authorHref = resolveAuthorHref(post.authorId);
  const authorAvatarUrl = resolveAuthorAvatarUrl(post.authorId, post.authorAvatarUrl);
  const authorUser = getUserById(post.authorId);
  const isCareProvider = !!authorUser?.carerProfile?.publicProfile;

  const visibleTags = post.tags.filter((t) => t.type !== "community");

  return createPortal(
    <div className="post-lightbox-overlay" role="dialog" aria-modal>
      <button
        type="button"
        className="post-lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={20} weight="bold" />
      </button>

      {hasPrevPost && (
        <button
          type="button"
          className="post-lightbox-post-nav post-lightbox-post-nav--prev"
          onClick={goPrevPost}
          aria-label="Previous post"
        >
          <CaretLeft size={24} weight="bold" />
        </button>
      )}
      {hasNextPost && (
        <button
          type="button"
          className="post-lightbox-post-nav post-lightbox-post-nav--next"
          onClick={goNextPost}
          aria-label="Next post"
        >
          <CaretRight size={24} weight="bold" />
        </button>
      )}

      <div className="post-lightbox-frame">
        <div
          className="post-lightbox-photo-area"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={post.photos[photoIdx]}
            alt={post.caption ?? `Post by ${post.authorName}`}
            className="post-lightbox-photo"
          />
          {photoCount > 1 && (
            <>
              {hasPrevPhoto && (
                <button
                  type="button"
                  className="post-lightbox-photo-nav post-lightbox-photo-nav--prev"
                  onClick={() => setPhotoIdx((i) => i - 1)}
                  aria-label="Previous photo"
                >
                  <CaretLeft size={18} weight="bold" />
                </button>
              )}
              {hasNextPhoto && (
                <button
                  type="button"
                  className="post-lightbox-photo-nav post-lightbox-photo-nav--next"
                  onClick={() => setPhotoIdx((i) => i + 1)}
                  aria-label="Next photo"
                >
                  <CaretRight size={18} weight="bold" />
                </button>
              )}
              <div className="post-lightbox-photo-counter">
                {photoIdx + 1} / {photoCount}
              </div>
            </>
          )}
        </div>

        <aside className="post-lightbox-sidebar">
          <header className="post-lightbox-sidebar-header">
            <div className="post-lightbox-sidebar-author">
              {authorAvatarUrl ? (
                <img
                  src={authorAvatarUrl}
                  alt={post.authorName}
                  className="post-lightbox-sidebar-avatar"
                />
              ) : (
                <DefaultAvatar name={post.authorName} size={40} />
              )}
              <div className="flex flex-col" style={{ minWidth: 0 }}>
                <div className="flex items-center gap-xs">
                  {authorHref ? (
                    <Link
                      href={authorHref}
                      className="feed-card-author-name"
                      style={{ textDecoration: "none" }}
                    >
                      {post.authorName}
                    </Link>
                  ) : (
                    <span className="feed-card-author-name">{post.authorName}</span>
                  )}
                  {isCareProvider && (
                    <span className="feed-card-provider-badge">
                      <HandHeart size={12} weight="fill" />
                      Carer
                    </span>
                  )}
                </div>
                {post.groupName && post.groupId && (
                  <Link
                    href={`/communities/${post.groupId}`}
                    className="text-xs text-fg-tertiary"
                    style={{ textDecoration: "none" }}
                  >
                    in {post.groupName}
                  </Link>
                )}
              </div>
            </div>
            <PostKebabMenu post={post} />
          </header>

          <div className="post-lightbox-sidebar-body">
            {post.caption && (
              <p className="post-lightbox-caption">{post.caption}</p>
            )}
            {visibleTags.length > 0 && (
              <div className="post-lightbox-tags">
                <TagPillRow tags={visibleTags} />
              </div>
            )}
            <div className="post-lightbox-actions">
              <button type="button" className="feed-card-action">
                <Heart size={18} weight="light" />
                {post.reactions.length > 0 && <span>{post.reactions.length}</span>}
              </button>
              <button type="button" className="feed-card-action">
                <ChatCircle size={18} weight="light" />
                {post.comments.length > 0 && <span>{post.comments.length}</span>}
              </button>
              <button type="button" className="feed-card-action">
                <PaperPlaneTilt size={18} weight="light" />
              </button>
            </div>
            {post.comments.length > 0 ? (
              <div className="post-lightbox-comments">
                <CommentThread comments={post.comments} canComment={false} />
              </div>
            ) : (
              <p className="text-sm text-fg-tertiary" style={{ marginTop: "var(--space-md)" }}>
                No comments yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>,
    document.body,
  );
}
