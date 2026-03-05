"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultSignupDraft } from "@/lib/mockData";
import { SignupDraft } from "@/lib/types";

type SignupContextValue = {
  draft: SignupDraft;
  updateDraft: (next: Partial<SignupDraft>) => void;
  resetDraft: () => void;
};

const STORAGE_KEY = "doggo-signup-draft";

const SignupContext = createContext<SignupContextValue | undefined>(undefined);

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<SignupDraft>(defaultSignupDraft);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SignupDraft;
      setDraft((current) => ({ ...current, ...parsed }));
    } catch {
      // Ignore invalid cached state in prototype mode.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const value = useMemo<SignupContextValue>(
    () => ({
      draft,
      updateDraft: (next) => setDraft((prev) => ({ ...prev, ...next })),
      resetDraft: () => setDraft(defaultSignupDraft),
    }),
    [draft],
  );

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignupDraft(): SignupContextValue {
  const context = useContext(SignupContext);
  if (!context) throw new Error("useSignupDraft must be used within SignupProvider");
  return context;
}
