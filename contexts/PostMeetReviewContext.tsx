"use client";

import { createContext, useCallback, useContext, useState } from "react";

/**
 * PostMeetReviewContext — lets any entry point open the post-meet review sheet
 * for a specific meet. Mirrors the composer-context pattern
 * (see `PostComposerContext`, `MeetComposerContext`).
 *
 * The review sheet is a stepped wizard (welcome → photos → make connections)
 * that lives in `components/meets/PostMeetReviewSheet.tsx` and is mounted
 * once at the app layout level.
 */
interface PostMeetReviewContextValue {
  isOpen: boolean;
  /** The meet being reviewed. */
  meetId?: string;
  openReview: (opts: { meetId: string }) => void;
  closeReview: () => void;
}

const PostMeetReviewContext = createContext<PostMeetReviewContextValue>({
  isOpen: false,
  openReview: () => {},
  closeReview: () => {},
});

export function PostMeetReviewProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [meetId, setMeetId] = useState<string | undefined>();

  const openReview = useCallback((opts: { meetId: string }) => {
    setMeetId(opts.meetId);
    setIsOpen(true);
  }, []);

  const closeReview = useCallback(() => {
    setIsOpen(false);
    setMeetId(undefined);
  }, []);

  return (
    <PostMeetReviewContext.Provider value={{ isOpen, meetId, openReview, closeReview }}>
      {children}
    </PostMeetReviewContext.Provider>
  );
}

export function usePostMeetReview() {
  return useContext(PostMeetReviewContext);
}
