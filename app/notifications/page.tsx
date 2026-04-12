"use client";

import Link from "next/link";
import {
  Bell,
  CalendarBlank,
  ChatCircle,
  Handshake,
  HandsClapping,
  UsersThree,
  Briefcase,
  Star,
  EnvelopeSimple,
  CheckCircle,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { LayoutList } from "@/components/layout/LayoutList";
import { useNotifications } from "@/contexts/NotificationsContext";
import type { AppNotification } from "@/lib/types";
import type { NotificationType } from "@/lib/types";
import { formatRelativeTime } from "@/lib/dateUtils";

/* ── Icon + label maps ── */

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  meet_invite: CalendarBlank,
  meet_reminder: CalendarBlank,
  connection_request: Handshake,
  connection_accepted: HandsClapping,
  group_activity: UsersThree,
  booking_proposal: Briefcase,
  booking_confirmed: CheckCircle,
  session_completed: CheckCircle,
  care_review: Star,
  new_message: EnvelopeSimple,
  booking_message: EnvelopeSimple,
  meet_rsvp: CalendarBlank,
  post_comment: ChatCircle,
};

const TYPE_LABELS: Record<NotificationType, string> = {
  meet_invite: "Meet",
  meet_reminder: "Meet",
  connection_request: "Connection",
  connection_accepted: "Connection",
  group_activity: "Group",
  booking_proposal: "Booking",
  booking_confirmed: "Booking",
  session_completed: "Care",
  care_review: "Review",
  new_message: "Message",
  booking_message: "Message",
  meet_rsvp: "Meet",
  post_comment: "Comment",
};

/* ── Notification row ── */

function NotificationRow({
  notification,
  onTap,
}: {
  notification: AppNotification;
  onTap: () => void;
}) {
  const TypeIcon = TYPE_ICONS[notification.type] || Bell;
  const label = TYPE_LABELS[notification.type] || "Notification";

  const inner = (
    <div
      className={`flex items-start gap-md w-full p-lg border-b border-edge-regular${
        !notification.read ? " bg-surface-popout" : ""
      }`}
    >
      {/* Unread dot */}
      <div className="flex items-center shrink-0 w-2 pt-1.5">
        {!notification.read && (
          <div className="w-2 h-2 rounded-full bg-brand-main" />
        )}
      </div>

      {/* Avatar */}
      {notification.avatarUrl ? (
        <img
          src={notification.avatarUrl}
          alt=""
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-surface-inset flex items-center justify-center shrink-0">
          <TypeIcon size={20} weight="light" className="text-fg-tertiary" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 gap-xs">
        <div className="flex items-center justify-between gap-sm">
          <span
            className={`text-md leading-snug truncate ${
              notification.read ? "text-fg-secondary" : "text-fg-primary font-semibold"
            }`}
          >
            {notification.title}
          </span>
          <span className="text-xs text-fg-tertiary shrink-0">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
        <span className="text-sm text-fg-tertiary leading-snug line-clamp-2">
          {notification.body}
        </span>
        <span className="text-xs text-fg-tertiary mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );

  if (notification.href) {
    return (
      <Link href={notification.href} onClick={onTap} className="block">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onTap} className="block w-full text-left">
      {inner}
    </button>
  );
}

/* ── Page ── */

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  const handleTap = (id: string) => {
    markRead(id);
  };

  return (
    <PageColumn title="Notifications">
      <div className="page-column-panel-body">
        {/* Mark all read header */}
        {unreadCount > 0 && (
          <div className="flex items-center justify-between px-lg py-md border-b border-edge-regular">
            <span className="text-sm text-fg-secondary">
              {unreadCount} unread
            </span>
            <button
              type="button"
              onClick={markAllRead}
              className="text-sm font-semibold text-brand-main"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notification list */}
        <LayoutList>
          {notifications.map((notif) => (
            <NotificationRow
              key={notif.id}
              notification={notif}
              onTap={() => handleTap(notif.id)}
            />
          ))}
        </LayoutList>

        {/* Empty state */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center gap-md py-xxxl px-lg text-center">
            <Bell size={40} weight="light" className="text-fg-tertiary" />
            <p className="text-md text-fg-secondary">No notifications yet</p>
            <p className="text-sm text-fg-tertiary">
              When people invite you to meets, send connection requests, or message you, you&apos;ll see it here.
            </p>
          </div>
        )}
      </div>
    </PageColumn>
  );
}
