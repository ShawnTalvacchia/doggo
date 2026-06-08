"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarBlank,
  CalendarPlus,
  ChatCircle,
  Handshake,
  HandsClapping,
  UsersThree,
  UserPlus,
  Briefcase,
  Star,
  EnvelopeSimple,
  CheckCircle,
  Timer,
  TagSimple,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { LayoutList } from "@/components/layout/LayoutList";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { usePostDetail } from "@/contexts/PostDetailContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { usePendingTagsStore } from "@/lib/usePendingTagsStore";
import { getPostById } from "@/lib/mockPosts";
import type { AppNotification } from "@/lib/types";
import type { NotificationType } from "@/lib/types";
import { formatRelativeTime } from "@/lib/dateUtils";

/* ── Grouping logic ── */

interface NotificationGroup {
  key: string;
  notifications: AppNotification[];
  /** The most recent notification (used for display) */
  latest: AppNotification;
  count: number;
  hasUnread: boolean;
}

/** Types that should be grouped when sharing the same href */
const GROUPABLE_TYPES: Set<NotificationType> = new Set([
  "meet_rsvp",
  "group_activity",
]);

/** Summary text for grouped notifications */
const GROUP_TITLES: Partial<Record<NotificationType, (count: number) => string>> = {
  meet_rsvp: (n) => `${n} people are going to your meet`,
  group_activity: (n) => `${n} updates in this group`,
};

function groupNotifications(notifications: AppNotification[]): NotificationGroup[] {
  const groups: NotificationGroup[] = [];
  const groupMap = new Map<string, NotificationGroup>();

  for (const n of notifications) {
    const canGroup = GROUPABLE_TYPES.has(n.type) && n.href;
    const key = canGroup ? `${n.type}:${n.href}` : n.id;

    const existing = groupMap.get(key);
    if (existing) {
      existing.notifications.push(n);
      existing.count++;
      if (!n.read) existing.hasUnread = true;
    } else {
      const group: NotificationGroup = {
        key,
        notifications: [n],
        latest: n,
        count: 1,
        hasUnread: !n.read,
      };
      groupMap.set(key, group);
      groups.push(group);
    }
  }

  return groups;
}

/* ── Icon + label maps ── */

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  meet_invite: CalendarBlank,
  meet_reminder: CalendarBlank,
  meet_series_update: CalendarPlus,
  post_meet_review: Handshake,
  connection_request: Handshake,
  connection_accepted: HandsClapping,
  group_invite: UsersThree,
  group_activity: UsersThree,
  booking_proposal: Briefcase,
  booking_confirmed: CheckCircle,
  session_started: Timer,
  session_completed: CheckCircle,
  care_review: Star,
  new_message: EnvelopeSimple,
  booking_message: EnvelopeSimple,
  meet_rsvp: UserPlus,
  post_comment: ChatCircle,
  tag_pending: TagSimple,
};

const TYPE_LABELS: Record<NotificationType, string> = {
  meet_invite: "Meet",
  meet_reminder: "Meet",
  meet_series_update: "Series",
  post_meet_review: "Meet",
  connection_request: "Connection",
  connection_accepted: "Connection",
  group_invite: "Group",
  group_activity: "Group",
  booking_proposal: "Booking",
  booking_confirmed: "Booking",
  session_started: "Care",
  session_completed: "Care",
  care_review: "Review",
  new_message: "Message",
  booking_message: "Message",
  meet_rsvp: "Meet",
  post_comment: "Comment",
  tag_pending: "Tag",
};

/* ── Notification row ── */

function NotificationRow({
  group,
  onTap,
  requestStatus,
  onAccept,
  onDecline,
  tagStatus,
  onTagApprove,
  onTagReject,
  onOpenPost,
}: {
  group: NotificationGroup;
  onTap: (ids: string[]) => void;
  /** For `connection_request` rows — the viewer's resolution, if any. */
  requestStatus?: "accepted" | "declined";
  onAccept?: () => void;
  onDecline?: () => void;
  /** For `tag_pending` rows — the viewer's resolution, if any. */
  tagStatus?: "approved" | "rejected";
  onTagApprove?: () => void;
  onTagReject?: () => void;
  /** For `tag_pending` rows — opens the parent post in the global
   *  post-detail modal. Wraps the avatar+body in a tap target;
   *  Approve/Reject buttons stay independent. */
  onOpenPost?: () => void;
}) {
  const n = group.latest;
  const isGrouped = group.count > 1;
  const isConnReq = n.type === "connection_request";
  const isTagPending = n.type === "tag_pending";
  const TypeIcon = TYPE_ICONS[n.type] || Bell;
  const label = TYPE_LABELS[n.type] || "Notification";
  const title = isGrouped && GROUP_TITLES[n.type]
    ? GROUP_TITLES[n.type]!(group.count)
    : n.title;

  // For grouped items, stack up to 3 avatars
  const avatars = isGrouped
    ? group.notifications.slice(0, 3).map((notif) => notif.avatarUrl).filter(Boolean)
    : [];

  // Connection requests carry inline Accept / Decline — or, once the
  // viewer has acted, the resolved outcome. Rendered below the body
  // inside the content column.
  const connReqFooter = isConnReq ? (
    requestStatus === "accepted" ? (
      <span className="flex items-center gap-xs text-sm font-semibold text-brand-main mt-xs">
        <Handshake size={14} weight="fill" aria-hidden="true" />
        Connected
      </span>
    ) : requestStatus === "declined" ? (
      <span className="text-sm text-fg-tertiary mt-xs">Request declined</span>
    ) : (
      <div className="flex gap-sm mt-sm">
        <ButtonAction variant="primary" size="sm" onClick={onAccept}>
          Accept
        </ButtonAction>
        <ButtonAction variant="outline" size="sm" onClick={onDecline}>
          Decline
        </ButtonAction>
      </div>
    )
  ) : null;

  const tagPendingFooter = isTagPending ? (
    tagStatus === "approved" ? (
      <span className="flex items-center gap-xs text-sm font-semibold text-brand-main mt-xs">
        <CheckCircle size={14} weight="fill" aria-hidden="true" />
        Tag approved
      </span>
    ) : tagStatus === "rejected" ? (
      <span className="text-sm text-fg-tertiary mt-xs">Tag rejected</span>
    ) : (
      // Approve / Reject buttons stop propagation so they don't bubble
      // to the row-level "open post" tap target.
      <div className="flex gap-sm mt-sm" onClick={(e) => e.stopPropagation()}>
        <ButtonAction variant="primary" size="sm" onClick={onTagApprove}>
          Approve
        </ButtonAction>
        <ButtonAction variant="outline" size="sm" onClick={onTagReject}>
          Reject
        </ButtonAction>
      </div>
    )
  ) : null;

  const tappableRow = isTagPending && !!onOpenPost && !tagStatus;

  const inner = (
    <div
      className={`flex items-start gap-md w-full p-lg border-b border-edge-regular${
        group.hasUnread ? " bg-surface-popout" : ""
      }${tappableRow ? " notif-row-tappable" : ""}`}
      onClick={tappableRow ? onOpenPost : undefined}
      role={tappableRow ? "button" : undefined}
      tabIndex={tappableRow ? 0 : undefined}
      onKeyDown={
        tappableRow
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenPost?.();
              }
            }
          : undefined
      }
    >
      {/* Avatar(s) — wrapped in relative so we can corner-badge the
          unread state. Replaces the older left-side dot, which fought
          the avatar for visual real estate. 2026-05-08. */}
      <div className="relative shrink-0">
        {isGrouped && avatars.length > 1 ? (
          <div className="notif-avatar-stack">
            {avatars.map((url, i) => (
              <img
                key={i}
                src={url!}
                alt=""
                className="notif-avatar-stack-item"
                style={{ zIndex: avatars.length - i }}
              />
            ))}
          </div>
        ) : n.avatarUrl ? (
          <img
            src={n.avatarUrl}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-surface-inset flex items-center justify-center">
            <TypeIcon size={20} weight="light" className="text-fg-tertiary" />
          </div>
        )}
        {group.hasUnread && (
          <span
            className="notif-unread-badge"
            aria-label="Unread"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 gap-xs">
        <div className="flex items-center justify-between gap-sm">
          <span
            className={`text-md leading-snug truncate ${
              group.hasUnread ? "text-fg-primary font-semibold" : "text-fg-secondary"
            }`}
          >
            {title}
          </span>
          <span className="flex items-center gap-1.5 shrink-0 text-xs text-fg-tertiary">
            <span className="notif-cat-tag">{label}</span>
            <span aria-hidden="true">·</span>
            <span>{formatRelativeTime(n.createdAt)}</span>
          </span>
        </div>
        <span className="text-sm text-fg-tertiary leading-snug line-clamp-2">
          {n.body}
        </span>
        {connReqFooter}
        {tagPendingFooter}
      </div>

      {/* Tag-pending preview thumbnail — gives the owner a glanceable
          view of the photo they're approving. Matches Instagram /
          Facebook tag-review patterns where you don't need to tap to
          see the image. Same tap target as the row body (opens the
          post in the lightbox). 2026-06-04. */}
      {isTagPending && n.postId && (() => {
        const post = getPostById(n.postId);
        const photo = post?.photos[0];
        if (!photo) return null;
        return (
          <img
            src={photo}
            alt=""
            className="notif-tag-thumb"
            loading="lazy"
          />
        );
      })()}
    </div>
  );

  const allIds = group.notifications.map((notif) => notif.id);

  // Inline-button rows (connection_request, tag_pending) host their own
  // actions, so they can't be wrapped in a Link — render as-is.
  if (isConnReq || isTagPending) {
    return inner;
  }

  if (n.href) {
    return (
      <Link href={n.href} onClick={() => onTap(allIds)} className="block">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => onTap(allIds)} className="block w-full text-left">
      {inner}
    </button>
  );
}

/* ── Page ── */

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const { getConnection, markConnected } = useConnections();
  const viewerId = useCurrentUserId();
  const pendingTags = usePendingTagsStore(viewerId);
  const { openPost } = usePostDetail();
  // Session-scoped record of connection requests resolved on this visit —
  // drives each row's post-action state. Accept also writes the real
  // Connected state through ConnectionsContext (persisted), so a reload
  // still reads as accepted via `getConnection` below.
  const [requestState, setRequestState] = useState<
    Record<string, "accepted" | "declined">
  >({});
  // Session-scoped record of tag_pending resolutions, mirroring the
  // connection-request pattern. The persisted decision lives in
  // usePendingTagsStore; this state drives the row's "approved/rejected"
  // confirmation copy for the current session.
  const [tagState, setTagState] = useState<
    Record<string, "approved" | "rejected">
  >({});

  // Suppress tag_pending notifications whose underlying tag has already
  // been decided in the store (cross-session persistence — the decision
  // sticks even if the notification entry stays in the seed).
  const visibleNotifications = useMemo(
    () =>
      notifications.filter((n) => {
        if (n.type !== "tag_pending") return true;
        if (!n.postId || !n.dogId) return true;
        return pendingTags.getDecision(n.postId, n.dogId) === "pending";
      }),
    [notifications, pendingTags],
  );
  const groups = useMemo(() => groupNotifications(visibleNotifications), [visibleNotifications]);

  const handleTap = (ids: string[]) => {
    for (const id of ids) markRead(id);
  };

  const handleTagApprove = (n: AppNotification) => {
    if (n.postId && n.dogId) pendingTags.approve(n.postId, n.dogId);
    setTagState((s) => ({ ...s, [n.id]: "approved" }));
    markRead(n.id);
  };

  const handleTagReject = (n: AppNotification) => {
    if (n.postId && n.dogId) pendingTags.reject(n.postId, n.dogId);
    setTagState((s) => ({ ...s, [n.id]: "rejected" }));
    markRead(n.id);
  };

  // Accept — mutual Connected (both directions) + mark the row resolved.
  const handleAccept = (n: AppNotification) => {
    if (n.actorId) {
      markConnected(viewerId, n.actorId);
      markConnected(n.actorId, viewerId);
    }
    setRequestState((s) => ({ ...s, [n.id]: "accepted" }));
    markRead(n.id);
  };

  // Decline — no connection change; just resolve + read the row.
  const handleDecline = (n: AppNotification) => {
    setRequestState((s) => ({ ...s, [n.id]: "declined" }));
    markRead(n.id);
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
          {groups.map((group) => {
            const n = group.latest;
            // A connection_request resolves to "accepted" either from this
            // session's action or — after a reload — from the persisted
            // Connected state.
            const requestStatus =
              n.type === "connection_request"
                ? requestState[n.id] ??
                  (n.actorId &&
                  getConnection(n.actorId, viewerId)?.state === "connected"
                    ? "accepted"
                    : undefined)
                : undefined;
            const tagStatus =
              n.type === "tag_pending"
                ? tagState[n.id] ??
                  (n.postId &&
                  n.dogId &&
                  pendingTags.getDecision(n.postId, n.dogId) === "approved"
                    ? "approved"
                    : undefined)
                : undefined;
            return (
              <NotificationRow
                key={group.key}
                group={group}
                onTap={handleTap}
                requestStatus={requestStatus}
                onAccept={() => handleAccept(n)}
                onDecline={() => handleDecline(n)}
                tagStatus={tagStatus}
                onTagApprove={() => handleTagApprove(n)}
                onTagReject={() => handleTagReject(n)}
                onOpenPost={
                  n.type === "tag_pending" && n.postId
                    ? () => openPost(n.postId!)
                    : undefined
                }
              />
            );
          })}
        </LayoutList>

        {/* Empty state — narrowed column + generous top padding so the
            empty bell doesn't sit too close to the page header. The
            max-width caps body text at a comfortable line length on
            wide viewports; vertical clamp scales padding with viewport
            so short phones don't get pushed down too far. 2026-05-08. */}
        {notifications.length === 0 && (
          <div
            className="flex flex-col items-center gap-md px-lg pb-xxxl text-center mx-auto max-w-narrow"
            style={{ paddingTop: "clamp(64px, 18vh, 160px)" }}
          >
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
