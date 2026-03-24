"use client";

import { Camera, Plus } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PostPhotoGrid } from "@/components/posts/PostPhotoGrid";
import { TagPillRow } from "@/components/posts/TagPill";
import { PawReaction } from "@/components/posts/PawReaction";
import { getPostsByUser } from "@/lib/mockPosts";

interface PostsTabProps {
  userId: string;
  isOwnProfile?: boolean;
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

export function PostsTab({ userId, isOwnProfile = false }: PostsTabProps) {
  const posts = getPostsByUser(userId);

  return (
    <div className="profile-content-width profile-section-stack">
      {/* Header with New Post CTA */}
      {isOwnProfile && (
        <div className="flex items-center justify-between">
          <h3 className="profile-card-subtitle" style={{ marginBottom: 0 }}>
            Posts
          </h3>
          <ButtonAction
            variant="primary"
            size="sm"
            href="/posts/create"
            leftIcon={<Plus size={14} weight="bold" />}
          >
            New post
          </ButtonAction>
        </div>
      )}

      {posts.length === 0 ? (
        <section className="profile-info-card">
          <div className="flex flex-col items-center gap-md p-xl text-center">
            <Camera size={48} weight="light" className="text-fg-tertiary" />
            <p className="text-sm text-fg-secondary">
              {isOwnProfile
                ? "Share your first dog moment"
                : "No posts yet"}
            </p>
            {isOwnProfile && (
              <ButtonAction
                variant="primary"
                size="md"
                href="/posts/create"
                leftIcon={<Camera size={16} weight="light" />}
              >
                Share a moment
              </ButtonAction>
            )}
          </div>
        </section>
      ) : (
        <div className="flex flex-col gap-lg">
          {posts.map((post) => (
            <section key={post.id} className="profile-info-card">
              {/* Post header */}
              <div className="flex items-center gap-sm" style={{ marginBottom: "var(--space-sm)" }}>
                <span className="text-xs text-fg-tertiary">
                  {formatRelativeDate(post.createdAt)}
                </span>
                {post.groupName && (
                  <span className="text-xs text-fg-tertiary">
                    · in {post.groupName}
                  </span>
                )}
              </div>

              {/* Photos */}
              <PostPhotoGrid photos={post.photos} />

              {/* Caption */}
              {post.caption && (
                <p className="text-sm text-fg-primary" style={{ marginTop: "var(--space-sm)" }}>
                  {post.caption}
                </p>
              )}

              {/* Tags */}
              <div style={{ marginTop: "var(--space-sm)" }}>
                <TagPillRow tags={post.tags} />
              </div>

              {/* Reaction */}
              <div style={{ marginTop: "var(--space-sm)" }}>
                <PawReaction reactions={post.reactions} />
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
