"use client";

import { FeedCard } from "./FeedCard";
import { PostPhotoGrid } from "@/components/posts/PostPhotoGrid";
import { TagPillRow } from "@/components/posts/TagPill";
import { PostKebabMenu } from "@/components/posts/PostKebabMenu";
import type { Post } from "@/lib/types";

export function FeedPersonalPost({
  post,
  connectionContext,
  collection,
}: {
  post: Post;
  connectionContext?: string;
  collection?: Post[];
}) {
  return (
    <FeedCard
      authorName={post.authorName}
      authorAvatarUrl={post.authorAvatarUrl}
      authorHref={`/profile/${post.authorId}`}
      timestamp={post.createdAt}
      connectionContext={connectionContext}
      tags={post.tags.length > 0 ? <TagPillRow tags={post.tags} /> : undefined}
      media={<PostPhotoGrid photos={post.photos} postId={post.id} collection={collection} />}
      caption={post.caption}
      reactions={post.reactions}
      comments={post.comments}
      headerMenu={<PostKebabMenu post={post} />}
    />
  );
}
