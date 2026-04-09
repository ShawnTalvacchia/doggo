"use client";

import { FeedCard } from "./FeedCard";
import { PostPhotoGrid } from "@/components/posts/PostPhotoGrid";
import { TagPillRow } from "@/components/posts/TagPill";
import type { Post, PostTag, PostReaction, PostComment } from "@/lib/types";

interface MomentCardProps {
  authorName: string;
  authorAvatarUrl: string;
  authorId: string;
  caption?: string;
  photos: string[];
  tags: PostTag[];
  reactions: PostReaction[];
  comments: PostComment[];
  createdAt: string;
  /** Group context (if shared to a group) */
  groupName?: string;
  groupId?: string;
  /** Meet context (if from a meet recap) */
  meetTitle?: string;
  meetId?: string;
  /** Connection context label */
  connectionContext?: string;
}

/**
 * Unified photo moment card — replaces FeedPersonalPost, FeedCommunityPost, and FeedMeetRecap
 * as the primary feed content type. Shows photo(s) with caption, author, group/meet context,
 * tags, and LinkedIn-style action bar (Like, Comment, Share).
 */
export function MomentCard({
  authorName,
  authorAvatarUrl,
  authorId,
  caption,
  photos,
  tags,
  reactions,
  comments,
  createdAt,
  groupName,
  groupId,
  connectionContext,
}: MomentCardProps) {
  return (
    <FeedCard
      authorName={authorName}
      authorAvatarUrl={authorAvatarUrl}
      authorHref={`/profile/${authorId}`}
      timestamp={createdAt}
      groupName={groupName}
      groupId={groupId}
      connectionContext={connectionContext}
      caption={caption}
      media={photos.length > 0 ? <PostPhotoGrid photos={photos} /> : undefined}
      tags={tags.length > 0 ? <TagPillRow tags={tags} /> : undefined}
      reactions={reactions}
      comments={comments}
    />
  );
}

/** Convenience: create a MomentCard from a Post object */
export function MomentCardFromPost({
  post,
  connectionContext,
}: {
  post: Post;
  connectionContext?: string;
}) {
  return (
    <MomentCard
      authorName={post.authorName}
      authorAvatarUrl={post.authorAvatarUrl}
      authorId={post.authorId}
      caption={post.caption}
      photos={post.photos}
      tags={post.tags}
      reactions={post.reactions}
      comments={post.comments}
      createdAt={post.createdAt}
      groupName={post.groupName}
      groupId={post.groupId}
      connectionContext={connectionContext}
    />
  );
}
