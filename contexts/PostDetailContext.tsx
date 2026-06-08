"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { PostLightbox } from "@/components/posts/PostLightbox";
import { getPostById } from "@/lib/mockPosts";
import type { Post } from "@/lib/types";

interface OpenPostOptions {
  /** When provided, the lightbox enables ←/→ navigation between
   *  posts in this collection. Without it, only one post is shown
   *  (with no cross-post nav — close × is the only exit). */
  collection?: Post[];
  /** Optional starting photo within a multi-photo post (zero-indexed).
   *  Lets a click on photo #3 in a list view open the lightbox at #3
   *  instead of always resetting to the first photo. */
  photoIndex?: number;
}

interface PostDetailContextValue {
  /** Open a post in the global lightbox. Optionally pass the
   *  collection the post was opened from so the viewer can navigate
   *  to neighbouring posts. */
  openPost: (postId: string, opts?: OpenPostOptions) => void;
  closePost: () => void;
}

const PostDetailContext = createContext<PostDetailContextValue | null>(null);

/**
 * Global "view a single post" surface — renders a photo-led lightbox
 * (`PostLightbox`) overlaying the app. Any caller — PhotoGrid tile,
 * tag-pending notification, future search result, in-chat post link —
 * calls `usePostDetail().openPost(postId, { collection? })` and the
 * lightbox renders at root.
 *
 * Doggo doesn't have a `/posts/[id]` route by design — comments aren't
 * a primary platform thread, so a modal-scoped lightbox is sufficient
 * and keeps "tap → see → close" consistent across surfaces. When a
 * collection is passed, ←/→ keys + on-screen prev/next traverse the
 * collection in lightbox mode.
 *
 * Photos & Galleries phase, 2026-06-04.
 */
export function PostDetailProvider({ children }: { children: React.ReactNode }) {
  const [postId, setPostId] = useState<string | null>(null);
  const [collection, setCollection] = useState<Post[] | undefined>(undefined);
  const [initialPhotoIndex, setInitialPhotoIndex] = useState<number | undefined>(undefined);

  const openPost = useCallback(
    (id: string, opts?: OpenPostOptions) => {
      setPostId(id);
      setCollection(opts?.collection);
      setInitialPhotoIndex(opts?.photoIndex);
    },
    [],
  );

  const closePost = useCallback(() => {
    setPostId(null);
    setCollection(undefined);
    setInitialPhotoIndex(undefined);
  }, []);

  const post = postId ? getPostById(postId) : undefined;

  return (
    <PostDetailContext.Provider value={{ openPost, closePost }}>
      {children}
      {post && (
        <PostLightbox
          post={post}
          collection={collection}
          initialPhotoIndex={initialPhotoIndex}
          onClose={closePost}
          onNavigate={(nextId) => {
            setPostId(nextId);
            // Reset photo index when navigating to a new post — the
            // initialPhotoIndex only applies to the post the user
            // opened from outside, not to subsequent navigation.
            setInitialPhotoIndex(undefined);
          }}
        />
      )}
    </PostDetailContext.Provider>
  );
}

export function usePostDetail(): PostDetailContextValue {
  const ctx = useContext(PostDetailContext);
  if (!ctx) {
    throw new Error(
      "usePostDetail must be used within a PostDetailProvider — wrap the app root in <PostDetailProvider>.",
    );
  }
  return ctx;
}
