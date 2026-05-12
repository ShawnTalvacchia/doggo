"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface PageHeaderState {
  /** Detail title shown in AppNav on mobile when drilling in */
  detailTitle: string | null;
  /** Callback to go back to list view */
  onBack: (() => void) | null;
  /** Optional right-side action (button/link) shown in mobile nav */
  rightAction: ReactNode | null;
  /** Optional avatar/icon rendered between the back button and the title.
   *  Currently used by profile pages to show the subject's avatar. */
  leadingAvatar: ReactNode | null;
  /** Page-declared primary action rendered in the AppNav logged icon row
   *  in place of the default Create (Camera+/CalendarPlus) icon. Cross-viewport
   *  (mobile + desktop) — distinct from the mobile-only detail-header
   *  rightAction. Pages call setPageAction(<Button/>) to claim the slot. */
  pageAction: ReactNode | null;
  /** When true, hides the default Create icon even if no pageAction is set.
   *  Use when the page hosts its primary create action in-panel instead
   *  (e.g. own-profile Posts tab — "+ New post" lives at the top of the panel). */
  suppressCreate: boolean;
  /** When true, hides Bell + Inbox icons in the logged nav. Pairs with a
   *  pageAction containing Cancel/Save controls to give pages a fully
   *  locked-in editing mode (no nav escape until the page commits). */
  navLockedIn: boolean;
}

interface PageHeaderContextValue extends PageHeaderState {
  /** Set mobile detail header. Pass onBack=null to hide the back button (list-view mode). */
  setDetailHeader: (
    title: string,
    onBack: (() => void) | null,
    rightAction?: ReactNode,
    leadingAvatar?: ReactNode,
  ) => void;
  clearDetailHeader: () => void;
  /** Set the AppNav page-action slot. Options control whether the default
   *  Create icon is suppressed and whether Bell/Inbox are hidden for a
   *  locked-in edit mode. */
  setPageAction: (
    action: ReactNode | null,
    options?: { suppressCreate?: boolean; navLockedIn?: boolean },
  ) => void;
  /** Clear the AppNav page-action slot and any associated suppressions. */
  clearPageAction: () => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue>({
  detailTitle: null,
  onBack: null,
  rightAction: null,
  leadingAvatar: null,
  pageAction: null,
  suppressCreate: false,
  navLockedIn: false,
  setDetailHeader: () => {},
  clearDetailHeader: () => {},
  setPageAction: () => {},
  clearPageAction: () => {},
});

export function PageHeaderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PageHeaderState>({
    detailTitle: null,
    onBack: null,
    rightAction: null,
    leadingAvatar: null,
    pageAction: null,
    suppressCreate: false,
    navLockedIn: false,
  });

  const setDetailHeader = useCallback(
    (
      title: string,
      onBack: (() => void) | null,
      rightAction?: ReactNode,
      leadingAvatar?: ReactNode,
    ) => {
      setState((prev) => ({
        ...prev,
        detailTitle: title,
        onBack,
        rightAction: rightAction ?? null,
        leadingAvatar: leadingAvatar ?? null,
      }));
    },
    [],
  );

  const clearDetailHeader = useCallback(() => {
    setState((prev) => ({
      ...prev,
      detailTitle: null,
      onBack: null,
      rightAction: null,
      leadingAvatar: null,
    }));
  }, []);

  const setPageAction = useCallback(
    (
      action: ReactNode | null,
      options?: { suppressCreate?: boolean; navLockedIn?: boolean },
    ) => {
      setState((prev) => ({
        ...prev,
        pageAction: action,
        suppressCreate: options?.suppressCreate ?? false,
        navLockedIn: options?.navLockedIn ?? false,
      }));
    },
    [],
  );

  const clearPageAction = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pageAction: null,
      suppressCreate: false,
      navLockedIn: false,
    }));
  }, []);

  return (
    <PageHeaderContext.Provider
      value={{
        ...state,
        setDetailHeader,
        clearDetailHeader,
        setPageAction,
        clearPageAction,
      }}
    >
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader() {
  return useContext(PageHeaderContext);
}
