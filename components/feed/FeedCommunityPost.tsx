"use client";

import { FeedCard } from "./FeedCard";
import { buildHeaderContext } from "./MomentCard";
import { PostPhotoGrid } from "@/components/posts/PostPhotoGrid";
import { TagPillRow } from "@/components/posts/TagPill";
import { PostKebabMenu } from "@/components/posts/PostKebabMenu";
import { getUserById } from "@/lib/mockUsers";
import { getGroupById } from "@/lib/mockGroups";
import type { Post } from "@/lib/types";

export function FeedCommunityPost({ post }: { post: Post }) {
  const { headerContext, remainingTags } = buildHeaderContext(
    post.tags,
    post.groupName,
    post.groupId,
  );
  const authorUser = getUserById(post.authorId);
  const isCareProvider = !!(authorUser?.carerProfile?.publicProfile);

  // Group admin? Look up the post's group and check whether the author
  // is in the admins list. Renders as a small "Admin" badge next to the
  // name. Mock World Building 2026-04-30.
  const group = post.groupId ? getGroupById(post.groupId) : undefined;
  const isGroupAdmin = !!group?.members.some(
    (m) => m.userId === post.authorId && m.role === "admin",
  );

  return (
    <FeedCard
      authorName={post.authorName}
      authorAvatarUrl={post.authorAvatarUrl}
      authorHref={`/profile/${post.authorId}`}
      timestamp={post.createdAt}
      headerContext={headerContext}
      isCareProvider={isCareProvider}
      isGroupAdmin={isGroupAdmin}
      tags={remainingTags.length > 0 ? <TagPillRow tags={remainingTags} /> : undefined}
      media={<PostPhotoGrid photos={post.photos} />}
      caption={post.caption}
      reactions={post.reactions}
      comments={post.comments}
      headerMenu={<PostKebabMenu post={post} />}
    />
  );
}
