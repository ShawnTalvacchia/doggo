"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ChatCircle, PaperPlaneTilt, HandHeart, Star } from "@phosphor-icons/react";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { DefaultAvatar } from "@/components/ui/DefaultAvatar";
import { CommentThread } from "./CommentThread";
import type { PostReaction, PostComment } from "@/lib/types";

interface FeedCardProps {
  authorName?: string;
  authorAvatarUrl?: string;
  authorHref?: string;
  timestamp?: string;
  /** Context string for header row 1, e.g. "in Stromovka Morning Crew" or "at Letná" */
  headerContext?: React.ReactNode;
  connectionContext?: string;
  /** Show a care provider badge next to the author name */
  isCareProvider?: boolean;
  /** Show an admin badge — the post author is an admin of the group it
   *  was posted in. Reads as "this is from the admin." */
  isGroupAdmin?: boolean;
  /** Caption text */
  caption?: string;
  /** Photo/media content */
  media?: React.ReactNode;
  /** Tag pills — rendered between caption and photos */
  tags?: React.ReactNode;
  /** Reactions data — presence enables the action row */
  reactions?: PostReaction[];
  /** Comments data for the Comment count */
  comments?: PostComment[];
  /** Generic children for non-post cards (activity, nudges, etc.) */
  children?: React.ReactNode;
  /** Optional kebab menu node rendered top-right of the card. Used
   *  by post surfaces for the per-post three-dots menu
   *  (Untag / Report / Block — Photos & Galleries D1). */
  headerMenu?: React.ReactNode;
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function FeedCard({
  authorName,
  authorAvatarUrl,
  authorHref,
  timestamp,
  headerContext,
  connectionContext,
  caption,
  media,
  tags,
  reactions,
  comments,
  children,
  isCareProvider,
  isGroupAdmin,
  headerMenu,
}: FeedCardProps) {
  const currentUserId = useCurrentUserId();
  const [localReactions, setLocalReactions] = useState(reactions ?? []);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const hasLiked = localReactions.some((r) => r.userId === currentUserId);
  const likeCount = localReactions.length;
  const commentCount = comments?.length ?? 0;
  const showActions = reactions !== undefined;

  function toggleLike() {
    if (hasLiked) {
      setLocalReactions(localReactions.filter((r) => r.userId !== currentUserId));
    } else {
      setLocalReactions([...localReactions, { userId: currentUserId, userName: "You" }]);
    }
  }

  /* ── Threads-style layout: avatar + two-row header, then content ── */
  // Authors without an avatar URL (e.g. directory-style shelter walkers) still
  // get the full layout — we render initials via DefaultAvatar instead of
  // falling through to the no-author fallback.
  if (authorName) {
    return (
      <article className="feed-card">
        {headerMenu && <div className="feed-card-menu-slot">{headerMenu}</div>}
        <div className="feed-card-body">
          {/* Left column: avatar */}
          <div className="feed-card-col-avatar">
            {authorAvatarUrl ? (
              <img
                src={authorAvatarUrl}
                alt={authorName}
                className="feed-card-avatar"
              />
            ) : (
              <DefaultAvatar name={authorName} size={40} className="feed-card-avatar" />
            )}
          </div>

          {/* Right column: header + content */}
          <div className="feed-card-col-content">
            {/* Row 1: Name + provider badge + context (primary) */}
            <div className="feed-card-header-primary">
              {authorHref ? (
                <Link href={authorHref} className="feed-card-author-name" style={{ textDecoration: "none" }}>
                  {authorName}
                </Link>
              ) : (
                <span className="feed-card-author-name">{authorName}</span>
              )}
              {isCareProvider && (
                <span className="feed-card-provider-badge">
                  <HandHeart size={12} weight="fill" />
                  Carer
                </span>
              )}
              {headerContext}
              {connectionContext && (
                <span className="feed-card-context-text">{connectionContext}</span>
              )}
            </div>
            {/* Row 2: Admin badge (post-context metadata, not identity) +
                timestamp. Admin lives here rather than next to the name
                because being an admin is contextual to THIS group, not
                a property of the author in general (unlike the Carer
                badge above). Mock World Building 2026-04-30. */}
            <div className="feed-card-meta-row">
              {isGroupAdmin && (
                <span className="feed-card-admin-badge">
                  <Star size={11} weight="fill" />
                  Admin
                </span>
              )}
              {timestamp && (
                <span className="feed-card-timestamp">{formatRelativeDate(timestamp)}</span>
              )}
            </div>

            {/* Content: caption, tags, photos, actions */}
            {caption && <p className="feed-card-caption">{caption}</p>}
            {tags && <div className="feed-card-tags">{tags}</div>}
            {media}
            {showActions && (
              <div className="feed-card-actions">
                <button
                  type="button"
                  className={`feed-card-action${hasLiked ? " feed-card-action--active" : ""}`}
                  onClick={toggleLike}
                >
                  <Heart size={18} weight={hasLiked ? "fill" : "light"} />
                  {likeCount > 0 && <span>{likeCount}</span>}
                </button>
                {/* Comment-count action — toggles the inline thread.
                    Threads-style: collapsed by default, tap to expand.
                    Icon flips weight (light → fill) when open, mirroring
                    the heart toggle. Disabled when no comments. */}
                <button
                  type="button"
                  className={`feed-card-action${commentsOpen ? " feed-card-action--active" : ""}`}
                  onClick={() => setCommentsOpen(!commentsOpen)}
                  disabled={commentCount === 0}
                  aria-expanded={commentsOpen}
                  aria-label={
                    commentCount === 0
                      ? "No comments"
                      : commentsOpen
                        ? "Hide comments"
                        : `Show ${commentCount} comments`
                  }
                >
                  <ChatCircle size={18} weight={commentsOpen ? "fill" : "light"} />
                  {commentCount > 0 && <span>{commentCount}</span>}
                </button>
                <button type="button" className="feed-card-action">
                  <PaperPlaneTilt size={18} weight="light" />
                </button>
              </div>
            )}
            {/* Inline comment thread — renders when the user opens it via
                the comment-count button. CommentThread handles its own
                expand/collapse for long threads. Mock World Building 2026-04-30. */}
            {commentsOpen && comments && comments.length > 0 && (
              <div className="feed-card-comments">
                <CommentThread comments={comments} canComment={false} />
              </div>
            )}
            {children && <div className="feed-card-children">{children}</div>}
          </div>
        </div>
      </article>
    );
  }

  /* ── Fallback: no-author cards (upcoming meets, nudges, etc.) ── */
  return (
    <article className="feed-card">
      <div className="feed-card-body feed-card-body--simple">
        {children && <div className="feed-card-children">{children}</div>}
      </div>
    </article>
  );
}
