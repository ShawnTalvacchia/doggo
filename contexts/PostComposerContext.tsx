"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface PostComposerContextValue {
  isOpen: boolean;
  /** Pre-selected community ID when opening from a group page */
  preselectedGroupId?: string;
  openComposer: (groupId?: string) => void;
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

  const openComposer = useCallback((groupId?: string) => {
    setPreselectedGroupId(groupId);
    setIsOpen(true);
  }, []);

  const closeComposer = useCallback(() => {
    setIsOpen(false);
    setPreselectedGroupId(undefined);
  }, []);

  return (
    <PostComposerContext.Provider value={{ isOpen, preselectedGroupId, openComposer, closeComposer }}>
      {children}
    </PostComposerContext.Provider>
  );
}

export function usePostComposer() {
  return useContext(PostComposerContext);
}
