"use client";

import { createContext, useContext, useCallback, useMemo } from "react";
import { mockNotifications } from "@/lib/mockNotifications";
import { usePersistedState } from "@/lib/usePersistedState";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import type { AppNotification } from "@/lib/types";

// ── Types ──────────────────────────────────────────────────────────────────────

/** Input shape for `addNotification`. Caller supplies the meaningful fields;
 *  `id`, `createdAt`, and `read` get sensible defaults if omitted so callers
 *  at firing sites (Start session, Finish session) don't have to mint IDs.
 *  `recipientId` IS required — the principle is that every notification has
 *  a target person; without it, an actor (carer triggering Start) would get
 *  notified about events they themselves caused. */
export type NewNotification = Omit<AppNotification, "id" | "createdAt" | "read"> & {
  id?: string;
  createdAt?: string;
  read?: boolean;
};

interface NotificationsContextValue {
  /** Filtered to the current viewer (`recipientId === currentUserId`). */
  notifications: AppNotification[];
  /** Filtered unread count for the current viewer. */
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
  // Internal store holds the FULL multi-persona notification stream so a
  // persona switch reveals each user's slice from the same persisted
  // data. The public API filters to the current viewer.
  const [allNotifications, setAllNotifications] = usePersistedState<AppNotification[]>(
    STORAGE_KEY,
    mockNotifications,
  );
  const currentUserId = useCurrentUserId();

  const notifications = useMemo(
    () => allNotifications.filter((n) => n.recipientId === currentUserId),
    [allNotifications, currentUserId],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  /** Add or replace by id. If the caller passes an explicit `id` that
   *  matches an existing notification, it's replaced in place (hoisted
   *  to the top, marked unread again, with a fresh `createdAt`) — the
   *  "lifecycle update" pattern: a `session_started` notification
   *  transforms into `session_completed` rather than spawning a second
   *  row, mirroring how iOS / ride-share apps handle paired status
   *  notifications. If `id` is omitted (or doesn't match), the new
   *  notification prepends as before. Inbox & Notifications walkthrough
   *  refinement, 2026-05-08. */
  const addNotification = useCallback((n: NewNotification) => {
    const filled: AppNotification = {
      id: n.id ?? `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: n.type,
      recipientId: n.recipientId,
      actorId: n.actorId,
      title: n.title,
      body: n.body,
      avatarUrl: n.avatarUrl,
      href: n.href,
      createdAt: n.createdAt ?? new Date().toISOString(),
      read: n.read ?? false,
    };
    setAllNotifications((prev) => {
      const existingIdx = prev.findIndex((existing) => existing.id === filled.id);
      if (existingIdx >= 0) {
        // Upsert — drop old position, prepend the replacement.
        // Re-prepending carries the "this just transformed, pay
        // attention again" semantic naturally.
        const next = [...prev];
        next.splice(existingIdx, 1);
        return [filled, ...next];
      }
      return [filled, ...prev];
    });
  }, [setAllNotifications]);

  const markRead = useCallback((id: string) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, [setAllNotifications]);

  // Mark-all-read scoped to the CURRENT viewer's notifications — without
  // this filter, switching to Klára and tapping Mark all read would also
  // clear Daniel's unread state (they share the persisted store).
  const markAllRead = useCallback(() => {
    setAllNotifications((prev) =>
      prev.map((n) =>
        n.recipientId === currentUserId ? { ...n, read: true } : n
      ),
    );
  }, [setAllNotifications, currentUserId]);

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
