"use client";

/**
 * AuthGateContext — global "sign-up-or-try-demo" prompt for guest visitors.
 *
 * Demo Presentation phase D2, 2026-05-05.
 *
 * Pattern: any action handler on a logged-out surface that would normally
 * mutate state (RSVP, send message, join group, post, contact provider)
 * checks `useIsGuest()` first. If true, instead of mutating, it calls
 * `useAuthGate().requireAuth(actionLabel)`. That opens a modal sheet
 * explaining the action requires an account, with two CTAs:
 *
 *   - "Sign up to {action}" — stub. In the prototype this is a no-op
 *     button or routes to /signup/start (which is itself stubbed).
 *   - "Try the demo →" — routes to `/`, the landing page / demo launcher.
 *     The realistic path for a tester.
 *
 * Mounted globally in `app/layout.tsx`. Surfaces consume via the hook;
 * they don't render the component themselves.
 *
 * Future: a third `actionContext` field could carry richer copy ("Sign up
 * to RSVP for *Riegrovy morning walk*") if `actionLabel` proves too thin.
 * Defer until copy needs surface in real use.
 */

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, SignIn } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/overlays/ModalSheet";

type AuthGateContextValue = {
  /** Open the AuthGate prompt for a given action (e.g. "RSVP", "join this group"). */
  requireAuth: (actionLabel: string) => void;
};

const AuthGateContext = createContext<AuthGateContextValue | undefined>(undefined);

export function AuthGateProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [actionLabel, setActionLabel] = useState<string>("continue");
  const router = useRouter();

  const requireAuth = useCallback((label: string) => {
    setActionLabel(label || "continue");
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const handleTryDemo = useCallback(() => {
    setOpen(false);
    router.push("/");
  }, [router]);

  const value = useMemo<AuthGateContextValue>(() => ({ requireAuth }), [requireAuth]);

  return (
    <AuthGateContext.Provider value={value}>
      {children}
      <ModalSheet
        open={open}
        onClose={close}
        title="Sign up to continue"
      >
        <div className="auth-gate-body">
          <p className="auth-gate-headline">
            Sign up to <strong>{actionLabel}</strong>
          </p>
          <p className="auth-gate-sub">
            This is a private prototype — the full sign-up flow isn&apos;t
            wired up yet. To experience this action and the rest of the
            product, jump into the demo as one of the personas we&apos;ve
            built out.
          </p>
          <div className="auth-gate-actions">
            <button
              type="button"
              className="auth-gate-btn auth-gate-btn--primary"
              onClick={handleTryDemo}
            >
              Try the demo
              <ArrowRight size={14} weight="bold" />
            </button>
            <Link
              href="/signup/start"
              onClick={close}
              className="auth-gate-btn auth-gate-btn--secondary"
            >
              <SignIn size={14} weight="bold" />
              Sign up
            </Link>
          </div>
          <p className="auth-gate-footnote">
            The demo lets you experience the product as Tereza (a Vinohrady
            regular), Daniel (anxious new owner), Klára (trainer), or Tomáš
            (busy professional) — each with their own connections, meets,
            and care arrangements.
          </p>
        </div>
      </ModalSheet>
    </AuthGateContext.Provider>
  );
}

/**
 * Trigger the AuthGate prompt. Returns a function that takes a short action
 * label and opens the modal. Use directly in onClick handlers:
 *
 *   const { requireAuth } = useAuthGate();
 *   const isGuest = useIsGuest();
 *   const onJoin = () => isGuest ? requireAuth("join this group") : doJoin();
 */
export function useAuthGate(): AuthGateContextValue {
  const ctx = useContext(AuthGateContext);
  if (!ctx) {
    throw new Error("useAuthGate must be used within AuthGateProvider");
  }
  return ctx;
}
