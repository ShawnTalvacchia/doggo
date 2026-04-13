"use client";

import { Camera, Plus } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { FeedCommunityPost } from "@/components/feed/FeedCommunityPost";
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
      {/* Header with New Post CTA */}
      {isOwnProfile && (
        <div className="flex items-center justify-between px-lg py-md">
          <h3 className="profile-card-subtitle m-0">Posts</h3>
          <ButtonAction
            variant="primary"
            size="sm"
            onClick={() => openComposer()}
            leftIcon={<Plus size={14} weight="bold" />}
          >
            New post
          </ButtonAction>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-md p-xl text-center">
          <Camera size={48} weight="light" className="text-fg-tertiary" />
          <p className="text-sm text-fg-secondary">
            {isOwnProfile ? "Share your first dog moment" : "No posts yet"}
          </p>
          {isOwnProfile && (
            <ButtonAction
              variant="primary"
              size="md"
              onClick={() => openComposer()}
              leftIcon={<Camera size={16} weight="light" />}
            >
              Share a moment
            </ButtonAction>
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
