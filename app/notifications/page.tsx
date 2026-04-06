"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarBlank,
  Handshake,
  HandsClapping,
  UsersThree,
  Briefcase,
  Star,
  EnvelopeSimple,
  CheckCircle,
  ArrowLeft,
} from "@phosphor-icons/react";
import { MasterDetailShell, type MobileView } from "@/components/layout/MasterDetailShell";
import { PanelBody } from "@/components/layout/PanelBody";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutList } from "@/components/layout/LayoutList";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { mockNotifications, type AppNotification } from "@/lib/mockNotifications";
import type { NotificationType } from "@/lib/types";

/* ── Helpers ── */

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

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
};

const TYPE_LABELS: Record<NotificationType, string> = {
  meet_invite: "Meet Invite",
  meet_reminder: "Reminder",
  connection_request: "Connection Request",
  connection_accepted: "Connection",
  group_activity: "Group Activity",
  booking_proposal: "Booking",
  booking_confirmed: "Booking",
  session_completed: "Care",
  care_review: "Review",
  new_message: "Message",
};

/* ── List item ── */

function NotificationRow({
  notification,
  isActive,
  onClick,
}: {
  notification: AppNotification;
  isActive: boolean;
  onClick: () => void;
}) {
  const TypeIcon = TYPE_ICONS[notification.type] || Bell;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-md w-full text-left${isActive ? " bg-surface-inset" : ""}`}
      style={{
        padding: "var(--space-lg)",
        borderBottom: "1px solid var(--border-regular)",
        cursor: "pointer",
        background: isActive ? "var(--surface-inset)" : undefined,
      }}
    >
      {/* Unread dot */}
      <div className="flex items-center shrink-0" style={{ width: 8, paddingTop: 6 }}>
        {!notification.read && (
          <div
            className="rounded-full"
            style={{
              width: 8,
              height: 8,
              background: "var(--brand-main)",
            }}
          />
        )}
      </div>

      {/* Avatar */}
      {notification.avatarUrl ? (
        <img
          src={notification.avatarUrl}
          alt=""
          className="rounded-full object-cover shrink-0"
          style={{ width: 40, height: 40 }}
        />
      ) : (
        <div
          className="rounded-full bg-surface-inset flex items-center justify-center shrink-0"
          style={{ width: 40, height: 40 }}
        >
          <TypeIcon size={20} weight="light" className="text-fg-tertiary" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 gap-xs">
        <span
          className={`text-md ${notification.read ? "text-fg-secondary" : "text-fg-primary font-semibold"}`}
          style={{ lineHeight: "20px" }}
        >
          {notification.title}
        </span>
        <span className="text-sm text-fg-tertiary" style={{ lineHeight: "18px" }}>
          {notification.body}
        </span>
        <span className="text-xs text-fg-tertiary" style={{ marginTop: 2 }}>
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>
    </button>
  );
}

/* ── Detail panel ── */

function NotificationDetail({
  notification,
  onBack,
}: {
  notification: AppNotification;
  onBack: () => void;
}) {
  const TypeIcon = TYPE_ICONS[notification.type] || Bell;
  const typeLabel = TYPE_LABELS[notification.type] || "Notification";

  return (
    <>
        <div className="flex flex-col items-center gap-lg" style={{ padding: "var(--space-xxxl) var(--space-lg)" }}>
          {/* Avatar */}
          {notification.avatarUrl ? (
            <img
              src={notification.avatarUrl}
              alt=""
              className="rounded-full object-cover"
              style={{ width: 64, height: 64 }}
            />
          ) : (
            <div
              className="rounded-full bg-surface-inset flex items-center justify-center"
              style={{ width: 64, height: 64 }}
            >
              <TypeIcon size={28} weight="light" className="text-fg-tertiary" />
            </div>
          )}

          {/* Type badge */}
          <span
            className="text-xs font-semibold rounded-pill"
            style={{
              padding: "2px 10px",
              background: "var(--surface-inset)",
              color: "var(--text-secondary)",
            }}
          >
            {typeLabel}
          </span>

          {/* Title */}
          <h3
            className="font-heading font-bold text-fg-primary text-center"
            style={{ fontSize: "var(--text-xl)", lineHeight: 1.3, margin: 0 }}
          >
            {notification.title}
          </h3>

          {/* Body */}
          <p
            className="text-md text-fg-secondary text-center"
            style={{ lineHeight: "24px", margin: 0, maxWidth: 400 }}
          >
            {notification.body}
          </p>

          {/* Timestamp */}
          <span className="text-sm text-fg-tertiary">
            {formatRelativeTime(notification.createdAt)}
          </span>

          {/* Action button */}
          {notification.href && (
            <ButtonAction
              variant="primary"
              size="md"
              href={notification.href}
              style={{ marginTop: "var(--space-md)" }}
            >
              {notification.type === "meet_invite" && "View Meet"}
              {notification.type === "meet_reminder" && "View Meet"}
              {notification.type === "connection_request" && "View Profile"}
              {notification.type === "connection_accepted" && "View Profile"}
              {notification.type === "group_activity" && "View Group"}
              {notification.type === "booking_confirmed" && "View Booking"}
              {notification.type === "booking_proposal" && "View Booking"}
              {notification.type === "session_completed" && "View Booking"}
              {notification.type === "care_review" && "View Review"}
              {notification.type === "new_message" && "View Message"}
            </ButtonAction>
          )}
        </div>
    </>
  );
}

/* ── Page ── */

export default function NotificationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId
    ? mockNotifications.find((n) => n.id === selectedId) ?? null
    : null;

  const mobileView: MobileView = selected ? "detail" : "list";

  return (
    <div className="page-container notifications-page-shell">
    <MasterDetailShell
      mobileView={mobileView}
      listPanel={
        <div className="list-panel">
          <div className="list-panel-header panel-header-desktop">
            <h2 className="font-heading text-lg font-bold text-fg-primary m-0">
              Notifications
            </h2>
          </div>
          <PanelBody>
            <LayoutList>
              {mockNotifications.map((notif) => (
                <NotificationRow
                  key={notif.id}
                  notification={notif}
                  isActive={notif.id === selectedId}
                  onClick={() => setSelectedId(notif.id)}
                />
              ))}
            </LayoutList>
            <Spacer />
          </PanelBody>
        </div>
      }
      detailPanel={
        <div className="detail-panel">
          {selected && (
            <div className="detail-panel-header">
              <span className="font-heading text-base font-semibold text-fg-primary">
                {selected.title}
              </span>
            </div>
          )}
          <PanelBody>
            {selected ? (
              <NotificationDetail
                notification={selected}
                onBack={() => setSelectedId(null)}
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center flex-1 gap-md"
                style={{ padding: "var(--space-xxxl)" }}
              >
                <Bell size={48} weight="light" className="text-fg-tertiary" />
                <span className="text-md text-fg-tertiary">
                  Select a notification to see details
                </span>
              </div>
            )}
            <Spacer />
          </PanelBody>
        </div>
      }
    />
    </div>
  );
}
