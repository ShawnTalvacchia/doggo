"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  Briefcase,
  CalendarBlank,
  ChatCircle,
  CheckCircle,
  EnvelopeSimple,
  Handshake,
  HandsClapping,
  Star,
  UsersThree,
  UserPlus,
  X,
  BellSlash,
} from "@phosphor-icons/react";
import { useNotifications } from "@/contexts/NotificationsContext";
import type { NotificationType } from "@/lib/types";
import { formatRelativeTime } from "@/lib/dateUtils";

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  meet_invite: CalendarBlank,
  meet_reminder: CalendarBlank,
  meet_rsvp: UserPlus,
  connection_request: Handshake,
  connection_accepted: HandsClapping,
  group_activity: UsersThree,
  booking_proposal: Briefcase,
  booking_confirmed: CheckCircle,
  session_completed: CheckCircle,
  care_review: Star,
  new_message: EnvelopeSimple,
  booking_message: EnvelopeSimple,
  post_comment: ChatCircle,
};

const TYPE_STYLES: Partial<Record<NotificationType, string>> = {
  session_completed: "notif-type-icon--done",
  booking_confirmed: "notif-type-icon--confirmed",
  booking_proposal: "notif-type-icon--proposal",
};

function NotifIcon({ type }: { type: NotificationType }) {
  const Icon = TYPE_ICONS[type] || Bell;
  const style = TYPE_STYLES[type] || "notif-type-icon--message";
  return <Icon size={16} weight="fill" className={`notif-type-icon ${style}`} />;
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
