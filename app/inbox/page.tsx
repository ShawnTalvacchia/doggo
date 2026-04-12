"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChatCircleDots,
  MagnifyingGlass,
  PawPrint,
} from "@phosphor-icons/react";
import { useConversations } from "@/contexts/ConversationsContext";
import { getConnectionsByState } from "@/lib/mockConnections";
import { PageColumn } from "@/components/layout/PageColumn";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutList } from "@/components/layout/LayoutList";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Conversation, ChatMessage } from "@/lib/types";
import { formatRelativeTime } from "@/lib/dateUtils";

const MY_USER_ID = "shawn";

// ── Helpers ──────────────────────────────────────────────────────

function getLastMessage(conv: Conversation): ChatMessage | null {
  if (!conv.lastMessageId) return null;
  return conv.messages.find((m) => m.id === conv.lastMessageId) ?? conv.messages.at(-1) ?? null;
}

function getPreview(conv: Conversation): string {
  const lastMsg = getLastMessage(conv);
  if (!lastMsg) return "Start a conversation";
  if (lastMsg.type === "booking_proposal") return "Booking proposal";
  if (lastMsg.type === "contract") return "Contract signed";
  if (lastMsg.text) {
    return lastMsg.text.length > 72 ? lastMsg.text.slice(0, 72) + "\u2026" : lastMsg.text;
  }
  return "";
}

function getOtherParty(conv: Conversation) {
  const isCarerPerspective = conv.providerId === MY_USER_ID;
  return isCarerPerspective
    ? { name: conv.ownerName, avatarUrl: conv.ownerAvatarUrl, id: conv.ownerId }
    : { name: conv.providerName, avatarUrl: conv.providerAvatarUrl, id: conv.providerId };
}

// ── Unified row data ─────────────────────────────────────────────

interface InboxRow {
  userId: string;
  name: string;
  avatarUrl: string;
  dogNames: string[];
  preview: string;
  timeAgo: string;
  sortKey: string; // ISO date for sorting
  hasUnread: boolean;
  hasConversation: boolean;
}

// ── Row component ────────────────────────────────────────────────

function InboxUserRow({ row }: { row: InboxRow }) {
  return (
    <Link
      href={`/profile/${row.userId}?tab=chat`}
      className="flex items-center gap-md px-lg py-md border-b border-edge-regular"
    >
      {/* Avatar + unread dot */}
      <div className="relative shrink-0">
        <img
          src={row.avatarUrl}
          alt={row.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {row.hasUnread && (
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-brand-main border-2 border-surface-page" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 gap-xs">
        <div className="flex items-center justify-between gap-sm">
          <span
            className={`text-md leading-snug truncate ${
              row.hasUnread ? "text-fg-primary font-semibold" : "text-fg-primary"
            }`}
          >
            {row.name}
          </span>
          {row.timeAgo && (
            <span className="text-xs text-fg-tertiary shrink-0">{row.timeAgo}</span>
          )}
        </div>
        {row.dogNames.length > 0 && (
          <span className="flex items-center gap-xs text-xs text-fg-tertiary">
            <PawPrint size={11} weight="light" className="shrink-0" />
            {row.dogNames.join(", ")}
          </span>
        )}
        <span
          className={`text-sm leading-snug truncate ${
            row.hasUnread ? "text-fg-secondary font-medium" : "text-fg-tertiary"
          }`}
        >
          {row.preview}
        </span>
      </div>
    </Link>
  );
}

// ── Main page ────────────────────────────────────────────────────

export default function InboxPage() {
  const { conversations } = useConversations();
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const result: InboxRow[] = [];
    const seen = new Set<string>();

    // 1. Add users from existing conversations
    for (const conv of conversations) {
      const other = getOtherParty(conv);
      if (seen.has(other.id)) continue;
      seen.add(other.id);

      const lastMsg = getLastMessage(conv);
      result.push({
        userId: other.id,
        name: other.name,
        avatarUrl: other.avatarUrl,
        dogNames: conv.inquiry?.pets ?? [],
        preview: getPreview(conv),
        timeAgo: lastMsg ? formatRelativeTime(lastMsg.sentAt) : "",
        sortKey: lastMsg?.sentAt ?? "1970-01-01T00:00:00Z",
        hasUnread: conv.unreadCount > 0,
        hasConversation: true,
      });
    }

    // 2. Add connected users who don't have a conversation yet
    const connectedUsers = getConnectionsByState("connected");
    for (const conn of connectedUsers) {
      if (seen.has(conn.userId)) continue;
      seen.add(conn.userId);

      result.push({
        userId: conn.userId,
        name: conn.userName,
        avatarUrl: conn.avatarUrl,
        dogNames: conn.dogNames ?? [],
        preview: "Start chatting",
        timeAgo: "",
        sortKey: conn.updatedAt ?? "1970-01-01T00:00:00Z",
        hasUnread: false,
        hasConversation: false,
      });
    }

    // Sort: unread first, then by most recent message
    result.sort((a, b) => {
      if (a.hasUnread !== b.hasUnread) return a.hasUnread ? -1 : 1;
      return b.sortKey.localeCompare(a.sortKey);
    });

    return result;
  }, [conversations]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.dogNames.some((d) => d.toLowerCase().includes(q))
    );
  }, [rows, search]);

  return (
    <PageColumn title="Inbox">
      <div className="page-column-panel-body">
        {/* Search */}
        <div className="flex items-center gap-sm px-lg py-md border-b border-edge-regular">
          <MagnifyingGlass size={18} weight="light" className="text-fg-tertiary shrink-0" />
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none outline-none text-fg-primary placeholder:text-fg-tertiary"
          />
        </div>

        {/* List */}
        <LayoutList>
          {filtered.length > 0 ? (
            <div className="flex flex-col">
              {filtered.map((row) => (
                <InboxUserRow key={row.userId} row={row} />
              ))}
            </div>
          ) : search.trim() ? (
            <EmptyState
              icon={<MagnifyingGlass size={40} weight="light" />}
              title="No results"
              subtitle={`No people matching "${search}"`}
            />
          ) : (
            <EmptyState
              icon={<ChatCircleDots size={48} weight="light" />}
              title="No conversations yet"
              subtitle="Connect with people at meets and communities to start chatting."
            />
          )}
        </LayoutList>

        <Spacer />
      </div>
    </PageColumn>
  );
}
