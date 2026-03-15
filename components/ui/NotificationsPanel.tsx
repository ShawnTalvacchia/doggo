"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  ChatCircleDots,
  CheckCircle,
  X,
  BellSlash,
} from "@phosphor-icons/react";
import { useNotifications } from "@/contexts/NotificationsContext";
import type { NotificationType } from "@/lib/types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

function NotifIcon({ type }: { type: NotificationType }) {
  if (type === "session_completed")
    return <CheckCircle size={16} weight="fill" className="notif-type-icon notif-type-icon--done" />;
  if (type === "booking_proposal")
    return <CalendarCheck size={16} weight="fill" className="notif-type-icon notif-type-icon--proposal" />;
  if (type === "booking_confirmed")
    return <CalendarCheck size={16} weight="fill" className="notif-type-icon notif-type-icon--confirmed" />;
  return <ChatCircleDots size={16} weight="fill" className="notif-type-icon notif-type-icon--message" />;
}

// ── Panel ─────────────────────────────────────────────────────────────────────

export function NotificationsPanel({
  open,
  onClose,
  wrapperRef,
}: {
  open: boolean;
  onClose: () => void;
  /** Ref to the wrapper element that includes the trigger button — clicks inside it won't close the panel */
  wrapperRef?: React.RefObject<HTMLElement | null>;
}) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click — exclude the trigger wrapper so the bell toggle works correctly
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      const insidePanel = panelRef.current?.contains(target);
      const insideWrapper = wrapperRef?.current?.contains(target);
      if (!insidePanel && !insideWrapper) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, wrapperRef]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="notif-panel" ref={panelRef} role="dialog" aria-label="Notifications">
      {/* Header */}
      <div className="notif-panel-header">
        <span className="notif-panel-title">
          Notifications
          {unreadCount > 0 && (
            <span className="notif-panel-unread-count">{unreadCount}</span>
          )}
        </span>
        <div className="notif-panel-header-actions">
          {unreadCount > 0 && (
            <button className="notif-mark-all-btn" onClick={markAllRead}>
              Mark all read
            </button>
          )}
          <button className="notif-close-btn" onClick={onClose} aria-label="Close notifications">
            <X size={16} weight="bold" />
          </button>
        </div>
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="notif-empty">
          <BellSlash size={32} weight="light" className="notif-empty-icon" />
          <p className="notif-empty-text">No notifications yet</p>
        </div>
      ) : (
        <ul className="notif-list" role="list">
          {notifications.map((n) => {
            const inner = (
              <>
                <div className="notif-avatar-wrap">
                  {n.avatarUrl ? (
                    <img src={n.avatarUrl} alt="" className="notif-avatar" />
                  ) : (
                    <div className="notif-avatar notif-avatar--placeholder" />
                  )}
                  <NotifIcon type={n.type} />
                </div>
                <div className="notif-body">
                  <p className="notif-title">{n.title}</p>
                  <p className="notif-preview">{n.body}</p>
                  <p className="notif-time">{formatRelativeTime(n.createdAt)}</p>
                </div>
                {!n.read && <span className="notif-unread-dot" aria-label="Unread" />}
              </>
            );

            return (
              <li
                key={n.id}
                className={`notif-row${n.read ? " notif-row--read" : ""}`}
              >
                {n.href ? (
                  <Link
                    href={n.href}
                    className="notif-row-inner"
                    onClick={() => { markRead(n.id); onClose(); }}
                  >
                    {inner}
                  </Link>
                ) : (
                  <div
                    className="notif-row-inner"
                    onClick={() => markRead(n.id)}
                    role="button"
                    tabIndex={0}
                  >
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
