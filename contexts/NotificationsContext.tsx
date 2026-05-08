"use client";

import { createContext, useContext, useCallback, useMemo } from "react";
import { mockNotifications } from "@/lib/mockNotifications";
import { usePersistedState } from "@/lib/usePersistedState";
import type { AppNotification } from "@/lib/types";

// ── Types ──────────────────────────────────────────────────────────────────────

/** Input shape for `addNotification`. Caller supplies the meaningful fields;
 *  `id`, `createdAt`, and `read` get sensible defaults if omitted so callers
 *  at firing sites (Start session, Finish session) don't have to mint IDs. */
export type NewNotification = Omit<AppNotification, "id" | "createdAt" | "read"> & {
  id?: string;
  createdAt?: string;
  read?: boolean;
};

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: NewNotification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

// ── Context ────────────────────────────────────────────────────────────────────

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────────────

/** localStorage key. Prefixed `doggo-` so the existing demo-reset path
 *  (`clearDemoLocalStorage` + `resetPersistedState("doggo")`) wipes it
 *  alongside other persisted demo state — no extra wiring needed. */
const STORAGE_KEY = "doggo-notifications";

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = usePersistedState<AppNotification[]>(
    STORAGE_KEY,
    mockNotifications,
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const addNotification = useCallback((n: NewNotification) => {
    const filled: AppNotification = {
      id: n.id ?? `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: n.type,
      title: n.title,
      body: n.body,
      avatarUrl: n.avatarUrl,
      href: n.href,
      createdAt: n.createdAt ?? new Date().toISOString(),
      read: n.read ?? false,
    };
    // Prepend — list is rendered newest-first, matching mockNotifications
    // ordering convention (descending createdAt).
    setNotifications((prev) => [filled, ...prev]);
  }, [setNotifications]);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, [setNotifications]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, addNotification, markRead, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
