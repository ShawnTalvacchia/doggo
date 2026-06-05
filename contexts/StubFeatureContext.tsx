"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert } from "@/components/ui/Alert";

interface StubNoticeRequest {
  /** User-facing name of the feature (sentence-case). Shown as toast title. */
  feature: string;
  /**
   * Optional one-line explanation of what we're waiting on. Falls back
   * to a generic line when absent. Doubles as a team-bookmark — when a
   * stub fires the toast lists what blocks it.
   */
  note?: string;
}

interface ActiveToast extends StubNoticeRequest {
  id: number;
}

interface StubFeatureContextValue {
  notify: (req: StubNoticeRequest) => void;
}

const StubFeatureContext = createContext<StubFeatureContextValue | null>(null);

const TOAST_DURATION_MS = 6000;

/**
 * Global "demo placeholder" toast host. Stub actions across the app
 * call `useStubNotice().notify({ feature, note })` instead of silently
 * closing — a non-modal toast slides in from the top-right (top on
 * mobile) explaining that the action isn't wired up yet and what it's
 * blocked on. Dismiss × always present; auto-dismiss after ~6s.
 *
 * Purpose:
 *  - **For demo viewers:** clear signal that the action is
 *    intentionally inert, not broken. Non-blocking so they can keep
 *    exploring.
 *  - **For the team:** a self-documenting bookmark while walking the
 *    app — every stub announces itself.
 *
 * One host at the app root. Stubs anywhere call into the same surface.
 *
 * Photos & Galleries phase, 2026-06-04 (toast variant — replaced the
 * initial modal treatment the same day).
 */
export function StubFeatureProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ActiveToast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idCounterRef = useRef(0);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const notify = useCallback((req: StubNoticeRequest) => {
    clearTimer();
    const id = ++idCounterRef.current;
    setActive({ ...req, id });
    timerRef.current = setTimeout(() => {
      setActive((curr) => (curr?.id === id ? null : curr));
    }, TOAST_DURATION_MS);
  }, []);

  useEffect(() => () => clearTimer(), []);

  const dismiss = () => {
    clearTimer();
    setActive(null);
  };

  return (
    <StubFeatureContext.Provider value={{ notify }}>
      {children}
      {active && (
        <div className="toast-host" aria-live="polite">
          <Alert
            key={active.id}
            kind="info"
            title={`${active.feature} — demo placeholder`}
            description={
              active.note ??
              "We've marked this as a follow-up — when the underlying work lands, this action will do what you'd expect."
            }
            onDismiss={dismiss}
          />
        </div>
      )}
    </StubFeatureContext.Provider>
  );
}

export function useStubNotice(): StubFeatureContextValue {
  const ctx = useContext(StubFeatureContext);
  if (!ctx) {
    throw new Error(
      "useStubNotice must be used within a StubFeatureProvider — wrap the app root in <StubFeatureProvider>.",
    );
  }
  return ctx;
}
