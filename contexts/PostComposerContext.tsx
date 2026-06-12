"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { PostTag, PostTagType } from "@/lib/types";

interface OpenComposerOptions {
  /** Pre-selected community ID when opening from a group page. */
  groupId?: string;
  /** Auto-open this tag picker when the composer mounts. Used by the
   *  ShareMomentBar tag shortcuts (Dog / Location / Group) so the
   *  shortcut both opens the composer AND drops the user into the
   *  relevant picker — saves an extra tap. 2026-05-13. */
  initialTagPicker?: PostTagType;
  /** Pre-fill these tags when the composer mounts. Used by the
   *  walk-finish "Share a moment" advocacy flow to open the composer
   *  already tagged to the dog + shelter (Adoption-Curious Journey,
   *  2026-06-12) — the recap is pre-attributed so the share is one tap.
   *  The user can still add/remove tags afterwards. */
  initialTags?: PostTag[];
}

interface PostComposerContextValue {
  isOpen: boolean;
  preselectedGroupId?: string;
  initialTagPicker?: PostTagType;
  initialTags?: PostTag[];
  openComposer: (opts?: OpenComposerOptions) => void;
  closeComposer: () => void;
}

const PostComposerContext = createContext<PostComposerContextValue>({
  isOpen: false,
  openComposer: () => {},
  closeComposer: () => {},
});

export function PostComposerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedGroupId, setPreselectedGroupId] = useState<string | undefined>();
  const [initialTagPicker, setInitialTagPicker] = useState<PostTagType | undefined>();
  const [initialTags, setInitialTags] = useState<PostTag[] | undefined>();

  const openComposer = useCallback((opts?: OpenComposerOptions) => {
    setPreselectedGroupId(opts?.groupId);
    setInitialTagPicker(opts?.initialTagPicker);
    setInitialTags(opts?.initialTags);
    setIsOpen(true);
  }, []);

  const closeComposer = useCallback(() => {
    setIsOpen(false);
    setPreselectedGroupId(undefined);
    setInitialTagPicker(undefined);
    setInitialTags(undefined);
  }, []);

  return (
    <PostComposerContext.Provider
      value={{ isOpen, preselectedGroupId, initialTagPicker, initialTags, openComposer, closeComposer }}
    >
      {children}
    </PostComposerContext.Provider>
  );
}

export function usePostComposer() {
  return useContext(PostComposerContext);
}
