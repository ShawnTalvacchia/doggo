"use client";

import { FeedCard } from "./FeedCard";
import { PostPhotoGrid } from "@/components/posts/PostPhotoGrid";
import { TagPillRow } from "@/components/posts/TagPill";
import { PawReaction } from "@/components/posts/PawReaction";
import type { Post } from "@/lib/types";

export function FeedCommunityPost({ post }: { post: Post }) {
  return (
    <FeedCard
      authorName={post.authorName}
      authorAvatarUrl={post.authorAvatarUrl}
      authorHref={`/profile/${post.authorId}`}
      timestamp={post.createdAt}
      groupName={post.groupName}
      groupId={post.groupId}
      tags={<TagPillRow tags={post.tags} />}
      media={<PostPhotoGrid photos={post.photos} fullBleed />}
      caption={post.caption}
      action={<PawReaction reactions={post.reactions} />}
    />
  );
}
