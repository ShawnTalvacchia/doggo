"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { PostTagType } from "@/lib/types";

interface OpenComposerOptions {
  /** Pre-selected community ID when opening from a group page. */
  groupId?: string;
  /** Auto-open this tag picker when the composer mounts. Used by the
   *  ShareMomentBar tag shortcuts (Dog / Location / Group) so the
   *  shortcut both opens the composer AND drops the user into the
   *  relevant picker — saves an extra tap. 2026-05-13. */
  initialTagPicker?: PostTagType;
}

interface PostComposerContextValue {
  isOpen: boolean;
  preselectedGroupId?: string;
  initialTagPicker?: PostTagType;
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

  const openComposer = useCallback((opts?: OpenComposerOptions) => {
    setPreselectedGroupId(opts?.groupId);
    setInitialTagPicker(opts?.initialTagPicker);
    setIsOpen(true);
  }, []);

  const closeComposer = useCallback(() => {
    setIsOpen(false);
    setPreselectedGroupId(undefined);
    setInitialTagPicker(undefined);
  }, []);

  return (
    <PostComposerContext.Provider
      value={{ isOpen, preselectedGroupId, initialTagPicker, openComposer, closeComposer }}
    >
      {children}
    </PostComposerContext.Provider>
  );
}

export function usePostComposer() {
  return useContext(PostComposerContext);
}
