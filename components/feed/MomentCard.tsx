"use client";

import Link from "next/link";
import { FeedCard } from "./FeedCard";
import { PostPhotoGrid } from "@/components/posts/PostPhotoGrid";
import { TagPillRow } from "@/components/posts/TagPill";
import { getDogById, getUserById } from "@/lib/mockUsers";
import { getGroupById } from "@/lib/mockGroups";
import { getShelterById, findShelterWalker } from "@/lib/mockShelters";
import { PostKebabMenu } from "@/components/posts/PostKebabMenu";
import type { Post, PostTag, PostReaction, PostComment } from "@/lib/types";

/**
 * Resolve where the author's name should link to. Posts can be authored
 * by users (profile route), shelters (shelter detail), or directory-style
 * walkers (no profile yet — return undefined so the name renders as plain
 * text). Shelter Foundation, 2026-06-01.
 */
export function resolveAuthorHref(authorId: string): string | undefined {
  if (getShelterById(authorId)) return `/shelters/${authorId}`;
  if (getUserById(authorId)) return `/profile/${authorId}`;
  return undefined;
}

/**
 * Resolve the author's avatar URL. The walker record is the source of
 * truth for its avatar — denormalized `Post.authorAvatarUrl` values
 * fall out of sync as we iterate on walker portraits. Falls back to
 * the post's denormalized value for non-walker authors.
 */
export function resolveAuthorAvatarUrl(authorId: string, fallback: string): string {
  const walker = findShelterWalker(authorId);
  if (walker?.avatarUrl) return walker.avatarUrl;
  return fallback;
}

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
  /** Optional kebab menu (Untag / Report / Block) — wired by
   *  MomentCardFromPost when a Post object is available. */
  kebabMenu?: React.ReactNode;
  /** Post id — when set, photos in the body become tap-targets that
   *  open the post in the global lightbox (see PostPhotoGrid). */
  postId?: string;
  /** Optional collection — passed through to the lightbox so the
   *  viewer can swipe / arrow-key through neighbouring posts. */
  collection?: Post[];
}

/**
 * Build the header context and filter tags that are "consumed" by the header.
 *
 * Priority: group ("in") > place ("at") > dogs ("with")
 * Whatever appears in the header gets removed from the tag pills.
 */
export function buildHeaderContext(
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
  kebabMenu,
  postId,
  collection,
}: MomentCardProps) {
  const { headerContext, remainingTags } = buildHeaderContext(tags, groupName, groupId);
  const authorUser = getUserById(authorId);
  const isCareProvider = !!(authorUser?.carerProfile?.publicProfile);

  // Group admin? Look up the post's group and check whether the author
  // is in the admins list. Renders as a small "Admin" badge next to the
  // name. Mock World Building 2026-04-30.
  const group = groupId ? getGroupById(groupId) : undefined;
  const isGroupAdmin = !!group?.members.some(
    (m) => m.userId === authorId && m.role === "admin",
  );

  return (
    <FeedCard
      authorName={authorName}
      authorAvatarUrl={authorAvatarUrl}
      authorHref={resolveAuthorHref(authorId)}
      timestamp={createdAt}
      headerContext={headerContext}
      connectionContext={connectionContext}
      isCareProvider={isCareProvider}
      isGroupAdmin={isGroupAdmin}
      caption={caption}
      media={
        photos.length > 0 ? (
          <PostPhotoGrid photos={photos} postId={postId} collection={collection} />
        ) : undefined
      }
      tags={remainingTags.length > 0 ? <TagPillRow tags={remainingTags} /> : undefined}
      reactions={reactions}
      comments={comments}
      headerMenu={kebabMenu}
    />
  );
}

/** Convenience: create a MomentCard from a Post object */
export function MomentCardFromPost({
  post,
  connectionContext,
  collection,
}: {
  post: Post;
  connectionContext?: string;
  collection?: Post[];
}) {
  return (
    <MomentCard
      authorName={post.authorName}
      authorAvatarUrl={resolveAuthorAvatarUrl(post.authorId, post.authorAvatarUrl)}
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
      kebabMenu={<PostKebabMenu post={post} />}
      postId={post.id}
      collection={collection}
    />
  );
}
