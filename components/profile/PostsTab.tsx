"use client";

import { Camera } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { FeedCommunityPost } from "@/components/feed/FeedCommunityPost";
import { ShareMomentBar } from "@/components/feed/ShareMomentBar";
import { usePostComposer } from "@/contexts/PostComposerContext";
import { getPostsByUser } from "@/lib/mockPosts";

interface PostsTabProps {
  userId: string;
  isOwnProfile?: boolean;
}

export function PostsTab({ userId, isOwnProfile = false }: PostsTabProps) {
  const { openComposer } = usePostComposer();
  const posts = getPostsByUser(userId);

  return (
    <div className="flex flex-col">
      {/* In-panel compose prompt — full-width "section strip" at the top
          of the panel, matching the post-card rhythm below: same
          `--surface-top` background and `--border-regular` separator
          weight as `.feed-card`, but bookended with top + bottom borders
          so the strip reads as its own block before the post list. The
          ShareMomentBar pill inside uses `--surface-inset` so it reads
          as a sunken input on the white strip. AppNav Camera+ is
          suppressed on own-profile Posts via
          PageHeaderContext.suppressCreate — the action lives here. 2026-05-11. */}
      {isOwnProfile && posts.length > 0 && (
        <div
          className="px-md py-md"
          style={{
            background: "var(--surface-top)",
            borderTop: "1px solid var(--border-regular)",
            borderBottom: "1px solid var(--border-regular)",
          }}
        >
          <ShareMomentBar />
        </div>
      )}

      {posts.length === 0 ? (
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
      ) : (
        <div className="flex flex-col">
          {posts.map((post) => (
            <FeedCommunityPost key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
