"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface PageHeaderState {
  /** Detail title shown in AppNav on mobile when drilling in */
  detailTitle: string | null;
  /** Callback to go back to list view */
  onBack: (() => void) | null;
  /** Optional right-side action (button/link) shown in mobile nav */
  rightAction: ReactNode | null;
}

interface PageHeaderContextValue extends PageHeaderState {
  /** Set mobile detail header. Pass onBack=null to hide the back button (list-view mode). */
  setDetailHeader: (title: string, onBack: (() => void) | null, rightAction?: ReactNode) => void;
  clearDetailHeader: () => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue>({
  detailTitle: null,
  onBack: null,
  rightAction: null,
  setDetailHeader: () => {},
  clearDetailHeader: () => {},
});

export function PageHeaderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PageHeaderState>({ detailTitle: null, onBack: null, rightAction: null });

  const setDetailHeader = useCallback((title: string, onBack: (() => void) | null, rightAction?: ReactNode) => {
    setState({ detailTitle: title, onBack, rightAction: rightAction ?? null });
  }, []);

  const clearDetailHeader = useCallback(() => {
    setState({ detailTitle: null, onBack: null, rightAction: null });
  }, []);

  return (
    <PageHeaderContext.Provider value={{ ...state, setDetailHeader, clearDetailHeader }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader() {
  return useContext(PageHeaderContext);
}
