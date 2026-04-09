"use client";

import Link from "next/link";
import { FeedCard } from "./FeedCard";
import { PostPhotoGrid } from "@/components/posts/PostPhotoGrid";
import { TagPillRow } from "@/components/posts/TagPill";
import { getDogById } from "@/lib/mockUsers";
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
  groupName?: string;
  groupId?: string;
  meetTitle?: string;
  meetId?: string;
  connectionContext?: string;
}

/**
 * Build the header context and filter tags that are "consumed" by the header.
 *
 * Priority: group ("in") > place ("at") > dogs ("with")
 * Whatever appears in the header gets removed from the tag pills.
 */
function buildHeaderContext(
  tags: PostTag[],
  groupName?: string,
  groupId?: string,
): { headerContext: React.ReactNode; remainingTags: PostTag[] } {
  const consumedIds = new Set<string>();
  let headerContext: React.ReactNode = null;

  // Priority 1: group context
  if (groupName && groupId) {
    headerContext = (
      <>
        <span className="feed-card-context-text"> in </span>
        <Link
          href={`/communities/${groupId}`}
          className="feed-card-context-link"
          style={{ textDecoration: "none" }}
        >
          {groupName}
        </Link>
      </>
    );
    // Consume matching community tags
    tags.filter((t) => t.type === "community").forEach((t) => consumedIds.add(t.id));
  }

  // Priority 2: place tag (only if no group)
  if (!headerContext) {
    const placeTag = tags.find((t) => t.type === "place");
    if (placeTag) {
      headerContext = (
        <span className="feed-card-context-text"> at {placeTag.label}</span>
      );
      consumedIds.add(placeTag.id);
    }
  }

  // Priority 3: dogs (only if no group and no place — personal "wall" posts)
  if (!headerContext) {
    const dogTags = tags.filter((t) => t.type === "dog");
    if (dogTags.length > 0) {
      const dogNames = dogTags.map((t) => {
        const dog = getDogById(t.id);
        return dog?.name || t.label;
      });
      const nameStr =
        dogNames.length === 1
          ? dogNames[0]
          : dogNames.slice(0, -1).join(", ") + " and " + dogNames[dogNames.length - 1];
      headerContext = (
        <span className="feed-card-context-text"> with {nameStr}</span>
      );
      dogTags.forEach((t) => consumedIds.add(t.id));
    }
  }

  // Also consume community tags even when group context comes from props
  // (the group context from props is the canonical source)
  const remainingTags = tags.filter((t) => {
    if (consumedIds.has(t.id)) return false;
    if (t.type === "community") return false; // always strip — shown in header
    return true;
  });

  return { headerContext, remainingTags };
}

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
  const { headerContext, remainingTags } = buildHeaderContext(tags, groupName, groupId);

  return (
    <FeedCard
      authorName={authorName}
      authorAvatarUrl={authorAvatarUrl}
      authorHref={`/profile/${authorId}`}
      timestamp={createdAt}
      headerContext={headerContext}
      connectionContext={connectionContext}
      caption={caption}
      media={photos.length > 0 ? <PostPhotoGrid photos={photos} /> : undefined}
      tags={remainingTags.length > 0 ? <TagPillRow tags={remainingTags} /> : undefined}
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
