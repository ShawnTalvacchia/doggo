"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface PageHeaderState {
  /** Detail title shown in AppNav on mobile when drilling in */
  detailTitle: string | null;
  /** Callback to go back to list view */
  onBack: (() => void) | null;
}

interface PageHeaderContextValue extends PageHeaderState {
  setDetailHeader: (title: string, onBack: () => void) => void;
  clearDetailHeader: () => void;
}

const PageHeaderContext = createContext<PageHeaderContextValue>({
  detailTitle: null,
  onBack: null,
  setDetailHeader: () => {},
  clearDetailHeader: () => {},
});

export function PageHeaderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PageHeaderState>({ detailTitle: null, onBack: null });

  const setDetailHeader = useCallback((title: string, onBack: () => void) => {
    setState({ detailTitle: title, onBack });
  }, []);

  const clearDetailHeader = useCallback(() => {
    setState({ detailTitle: null, onBack: null });
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
