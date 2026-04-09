"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ChatCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import type { PostReaction, PostComment } from "@/lib/types";

interface FeedCardProps {
  authorName?: string;
  authorAvatarUrl?: string;
  authorHref?: string;
  timestamp?: string;
  groupName?: string;
  groupId?: string;
  connectionContext?: string;
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
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date("2026-03-23T12:00:00Z");
  const diffMs = now.getTime() - date.getTime();
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
  groupName,
  groupId,
  connectionContext,
  caption,
  media,
  tags,
  reactions,
  comments,
  children,
}: FeedCardProps) {
  const [localReactions, setLocalReactions] = useState(reactions ?? []);
  const hasLiked = localReactions.some((r) => r.userId === "shawn");
  const likeCount = localReactions.length;
  const commentCount = comments?.length ?? 0;
  const showActions = reactions !== undefined;

  function toggleLike() {
    if (hasLiked) {
      setLocalReactions(localReactions.filter((r) => r.userId !== "shawn"));
    } else {
      setLocalReactions([...localReactions, { userId: "shawn", userName: "You" }]);
    }
  }

  /* ── Two-column Threads layout: avatar | content ── */
  if (authorName && authorAvatarUrl) {
    return (
      <article className="feed-card">
        <div className="feed-card-body">
          {/* Left column: avatar */}
          <div className="feed-card-col-avatar">
            <img
              src={authorAvatarUrl}
              alt={authorName}
              className="feed-card-avatar"
            />
          </div>

          {/* Right column: all content */}
          <div className="feed-card-col-content">
            {/* Author name + timestamp */}
            <div className="feed-card-author-row">
              {authorHref ? (
                <Link href={authorHref} className="feed-card-author-name" style={{ textDecoration: "none" }}>
                  {authorName}
                </Link>
              ) : (
                <span className="feed-card-author-name">{authorName}</span>
              )}
              {timestamp && (
                <span className="feed-card-timestamp">{formatRelativeDate(timestamp)}</span>
              )}
            </div>

            {/* Group / connection context */}
            {(groupName || connectionContext) && (
              <div className="feed-card-context">
                {groupName && groupId && (
                  <Link href={`/communities/${groupId}`} className="feed-card-context-link" style={{ textDecoration: "none" }}>
                    {groupName}
                  </Link>
                )}
                {connectionContext && <span>{connectionContext}</span>}
              </div>
            )}

            {/* Caption */}
            {caption && <p className="feed-card-caption">{caption}</p>}

            {/* Tags */}
            {tags && <div className="feed-card-tags">{tags}</div>}

            {/* Photos */}
            {media}

            {/* Action row */}
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
                <button type="button" className="feed-card-action">
                  <ChatCircle size={18} weight="light" />
                  {commentCount > 0 && <span>{commentCount}</span>}
                </button>
                <button type="button" className="feed-card-action">
                  <PaperPlaneTilt size={18} weight="light" />
                </button>
              </div>
            )}

            {/* Children slot */}
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
