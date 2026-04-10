"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ChatCircle, PaperPlaneTilt, HandHeart } from "@phosphor-icons/react";
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
  headerContext,
  connectionContext,
  caption,
  media,
  tags,
  reactions,
  comments,
  children,
  isCareProvider,
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

  /* ── Threads-style layout: avatar + two-row header, then content ── */
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
            {/* Row 2: Timestamp (secondary) */}
            {timestamp && (
              <span className="feed-card-timestamp">{formatRelativeDate(timestamp)}</span>
            )}

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
                <button type="button" className="feed-card-action">
                  <ChatCircle size={18} weight="light" />
                  {commentCount > 0 && <span>{commentCount}</span>}
                </button>
                <button type="button" className="feed-card-action">
                  <PaperPlaneTilt size={18} weight="light" />
                </button>
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
