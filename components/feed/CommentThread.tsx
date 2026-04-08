"use client";

import { useState } from "react";
import Link from "next/link";
import { ChatCircle, PaperPlaneRight } from "@phosphor-icons/react";
import type { PostComment } from "@/lib/types";

function formatCommentTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date("2026-03-23T12:00:00Z");
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

interface CommentThreadProps {
  comments: PostComment[];
  /** Whether to show the compose input (member-only) */
  canComment?: boolean;
}

export function CommentThread({ comments, canComment = true }: CommentThreadProps) {
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const hasComments = comments.length > 0;
  const previewCount = 2;
  const visibleComments = expanded ? comments : comments.slice(-previewCount);
  const hiddenCount = comments.length - previewCount;

  return (
    <div className="flex flex-col gap-sm">
      {/* Toggle / count */}
      {hasComments && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-xs text-xs text-fg-tertiary bg-transparent border-0 p-0 cursor-pointer hover:text-fg-secondary"
        >
          <ChatCircle size={14} weight="light" />
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
          {!expanded && hiddenCount > 0 && (
            <span className="text-fg-tertiary">· View all</span>
          )}
        </button>
      )}

      {/* Comment list */}
      {(hasComments || canComment) && (expanded || hasComments) && (
        <div className="flex flex-col gap-sm">
          {visibleComments.map((comment) => (
            <div key={comment.id} className="flex gap-sm">
              <img
                src={comment.authorAvatarUrl}
                alt={comment.authorName}
                className="w-6 h-6 rounded-full shrink-0 object-cover"
                style={{ marginTop: 2 }}
              />
              <div className="flex flex-col gap-0 min-w-0">
                <div className="flex items-baseline gap-xs flex-wrap">
                  <Link
                    href={`/profile/${comment.authorId}`}
                    className="text-xs font-semibold text-fg-primary"
                    style={{ textDecoration: "none" }}
                  >
                    {comment.authorName}
                  </Link>
                  <span className="text-xs text-fg-secondary" style={{ lineHeight: "18px" }}>
                    {comment.text}
                  </span>
                </div>
                <span className="text-xs text-fg-tertiary">{formatCommentTime(comment.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compose */}
      {canComment && (
        <div className="flex items-center gap-sm">
          <input
            className="input flex-1 text-sm"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ height: 32, fontSize: "13px" }}
          />
          {newComment.trim() && (
            <button
              type="button"
              onClick={() => setNewComment("")}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-main text-white border-0 cursor-pointer shrink-0"
            >
              <PaperPlaneRight size={14} weight="bold" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
