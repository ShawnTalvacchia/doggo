"use client";

import { FeedCard } from "./FeedCard";
import { PostPhotoGrid } from "@/components/posts/PostPhotoGrid";
import { TagPillRow } from "@/components/posts/TagPill";
import type { Post } from "@/lib/types";

export function FeedCommunityPost({ post }: { post: Post }) {
  return (
    <FeedCard
      authorName={post.authorName}
      authorAvatarUrl={post.authorAvatarUrl}
      authorHref={`/profile/${post.authorId}`}
      timestamp={post.createdAt}
      tags={post.tags.length > 0 ? <TagPillRow tags={post.tags} /> : undefined}
      media={<PostPhotoGrid photos={post.photos} />}
      caption={post.caption}
      reactions={post.reactions}
      comments={post.comments}
    />
  );
}
