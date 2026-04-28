"use client";

import { createContext, useCallback, useContext, useState } from "react";

/**
 * MeetComposerContext — lets any entry point open the meet-creation sheet
 * with optional group pre-selection. Mirrors `PostComposerContext`.
 */
interface MeetComposerContextValue {
  isOpen: boolean;
  /** Pre-selected group ID when opening from a group detail page */
  preselectedGroupId?: string;
  openComposer: (opts?: { groupId?: string }) => void;
  closeComposer: () => void;
}

const MeetComposerContext = createContext<MeetComposerContextValue>({
  isOpen: false,
  openComposer: () => {},
  closeComposer: () => {},
});

export function MeetComposerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedGroupId, setPreselectedGroupId] = useState<string | undefined>();

  const openComposer = useCallback((opts?: { groupId?: string }) => {
    setPreselectedGroupId(opts?.groupId);
    setIsOpen(true);
  }, []);

  const closeComposer = useCallback(() => {
    setIsOpen(false);
    setPreselectedGroupId(undefined);
  }, []);

  return (
    <MeetComposerContext.Provider value={{ isOpen, preselectedGroupId, openComposer, closeComposer }}>
      {children}
    </MeetComposerContext.Provider>
  );
}

export function useMeetComposer() {
  return useContext(MeetComposerContext);
}
