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
      {/* In-panel compose prompt — `ShareMomentBar` is self-contained
          (avatar + input + tag shortcuts, `--surface-top` strip chrome
          with top + bottom borders). AppNav Camera+ is suppressed on
          own-profile Posts via `PageHeaderContext.suppressCreate` — the
          action lives here. Redesigned 2026-05-13 from a sunken-input
          pill to the richer 3-part strip that surfaces the tag taxonomy
          (Photo / Dog / Location / Group) as affordances. */}
      {isOwnProfile && posts.length > 0 && <ShareMomentBar />}

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
