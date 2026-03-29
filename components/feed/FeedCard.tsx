"use client";

import Link from "next/link";

interface FeedCardProps {
  authorName?: string;
  authorAvatarUrl?: string;
  authorHref?: string;
  timestamp?: string;
  groupName?: string;
  groupId?: string;
  connectionContext?: string;
  /** Caption text — rendered above photos */
  caption?: string;
  /** Full-bleed content (photos) */
  media?: React.ReactNode;
  /** Tag pills — rendered below photos, in the footer row with action */
  tags?: React.ReactNode;
  /** Action element (like button) — inline with tags in footer */
  action?: React.ReactNode;
  /** Padded content below media (for non-post cards) */
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
  action,
  children,
}: FeedCardProps) {
  return (
    <article className="feed-card">
      {/* Author header */}
      {authorName && (
        <div className="flex flex-col gap-sm" style={{ padding: "var(--padding-small)" }}>
          <div className="flex items-center gap-lg">
            {authorAvatarUrl && (
              <img
                src={authorAvatarUrl}
                alt={authorName}
                className="rounded-full shrink-0"
                style={{ width: 36, height: 36, objectFit: "cover" }}
              />
            )}
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-xs flex-wrap">
                {authorHref ? (
                  <Link href={authorHref} className="text-base font-semibold text-fg-primary" style={{ textDecoration: "none" }}>
                    {authorName}
                  </Link>
                ) : (
                  <span className="text-base font-semibold text-fg-primary">{authorName}</span>
                )}
                {groupName && groupId && (
                  <span className="text-sm text-fg-tertiary">
                    in{" "}
                    <Link href={`/communities/${groupId}`} className="text-fg-tertiary font-medium" style={{ textDecoration: "none" }}>
                      {groupName}
                    </Link>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-xs">
                {timestamp && (
                  <span className="text-sm text-fg-tertiary">{formatRelativeDate(timestamp)}</span>
                )}
                {connectionContext && (
                  <span className="text-sm text-fg-tertiary">· {connectionContext}</span>
                )}
              </div>
            </div>
          </div>

          {/* Caption — below author info, above photos */}
          {caption && (
            <p className="text-base text-fg-secondary m-0" style={{ lineHeight: "20px" }}>
              {caption}
            </p>
          )}
        </div>
      )}

      {/* Media — full bleed */}
      {media}

      {/* Footer: Like button + tags in one flat flex-wrap row */}
      {(tags || action) && (
        <div className="feed-card-footer">
          {action}
          {tags}
        </div>
      )}

      {/* Generic children — padded (for non-post cards like activity updates) */}
      {children && (
        <div className="flex flex-col gap-sm px-lg py-lg">
          {children}
        </div>
      )}
    </article>
  );
}
