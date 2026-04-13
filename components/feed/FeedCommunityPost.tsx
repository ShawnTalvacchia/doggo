"use client";

import { FeedCard } from "./FeedCard";
import { buildHeaderContext } from "./MomentCard";
import { PostPhotoGrid } from "@/components/posts/PostPhotoGrid";
import { TagPillRow } from "@/components/posts/TagPill";
import { getUserById } from "@/lib/mockUsers";
import type { Post } from "@/lib/types";

export function FeedCommunityPost({ post }: { post: Post }) {
  const { headerContext, remainingTags } = buildHeaderContext(
    post.tags,
    post.groupName,
    post.groupId,
  );
  const authorUser = getUserById(post.authorId);
  const isCareProvider = !!(authorUser?.carerProfile?.publicProfile);

  return (
    <FeedCard
      authorName={post.authorName}
      authorAvatarUrl={post.authorAvatarUrl}
      authorHref={`/profile/${post.authorId}`}
      timestamp={post.createdAt}
      headerContext={headerContext}
      isCareProvider={isCareProvider}
      tags={remainingTags.length > 0 ? <TagPillRow tags={remainingTags} /> : undefined}
      media={<PostPhotoGrid photos={post.photos} />}
      caption={post.caption}
      reactions={post.reactions}
      comments={post.comments}
    />
  );
}
