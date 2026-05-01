"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  ChatCircleDots,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { useConversations } from "@/contexts/ConversationsContext";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { getConnectionsByState, getConnectionState } from "@/lib/mockConnections";
import { getUserById } from "@/lib/mockUsers";
import { PageColumn } from "@/components/layout/PageColumn";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutList } from "@/components/layout/LayoutList";
import { LayoutSection } from "@/components/layout/LayoutSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonIcon } from "@/components/ui/ButtonIcon";
import { PersonRow } from "@/components/people/PersonRow";
import type { Conversation, ChatMessage, ConnectionState } from "@/lib/types";
import { formatRelativeTime } from "@/lib/dateUtils";

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

function getOtherParty(conv: Conversation, currentUserId: string) {
  const isCarerPerspective = conv.providerId === currentUserId;
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
  sortKey: string;
  hasUnread: boolean;
  hasConversation: boolean;
  connectionState: ConnectionState;
  theyMarkedFamiliar?: boolean;
  profileOpen?: boolean;
}

// ── Search input for mobile nav header ───────────────────────────

function NavSearchInput({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus when search mode activates
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  return (
    <div className="inbox-nav-search">
      <MagnifyingGlass size={16} weight="light" className="text-fg-tertiary shrink-0" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search people..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="inbox-nav-search-input"
      />
      {value && (
        <button type="button" onClick={onClear} className="inbox-nav-search-clear">
          <X size={14} weight="bold" />
        </button>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────

export default function InboxPage() {
  const { conversations } = useConversations();
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const currentUserId = useCurrentUserId();
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const startSearch = useCallback(() => setIsSearching(true), []);
  const cancelSearch = useCallback(() => {
    setIsSearching(false);
    setSearch("");
  }, []);

  // Set mobile nav header: "Inbox" + search icon, or search input
  useEffect(() => {
    if (isSearching) {
      setDetailHeader(
        "",
        cancelSearch,
        <NavSearchInput value={search} onChange={setSearch} onClear={() => setSearch("")} />
      );
    } else {
      setDetailHeader(
        "Inbox",
        null,
        <ButtonIcon label="Search" onClick={startSearch}>
          <MagnifyingGlass size={24} weight="light" />
        </ButtonIcon>
      );
    }
    return () => clearDetailHeader();
  }, [isSearching, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = useMemo(() => {
    const result: InboxRow[] = [];
    const seen = new Set<string>();

    // 1. Add users from existing conversations
    for (const conv of conversations) {
      const other = getOtherParty(conv, currentUserId);
      if (seen.has(other.id)) continue;
      seen.add(other.id);

      const lastMsg = getLastMessage(conv);
      const conn = getConnectionState(other.id, currentUserId);
      // Inbox row dog names: prefer the booking's pets (relevant when the
      // conversation is about a specific dog), fall back to the partner's
      // own dogs from their profile (relevant for direct/social
      // conversations where pets is empty). P35 — Mock World Building C5.
      const inquiryPets = conv.inquiry?.pets ?? [];
      const partnerDogs = inquiryPets.length > 0
        ? inquiryPets
        : (getUserById(other.id)?.pets.map((p) => p.name) ?? []);
      result.push({
        userId: other.id,
        name: other.name,
        avatarUrl: other.avatarUrl,
        dogNames: partnerDogs,
        preview: getPreview(conv),
        timeAgo: lastMsg ? formatRelativeTime(lastMsg.sentAt) : "",
        sortKey: lastMsg?.sentAt ?? "1970-01-01T00:00:00Z",
        hasUnread: conv.unreadCount > 0,
        hasConversation: true,
        connectionState: conn?.state ?? "none",
        theyMarkedFamiliar: conn?.theyMarkedFamiliar,
        profileOpen: conn?.profileOpen,
      });
    }

    // 2. Add connected users who don't have a conversation yet
    const connectedUsers = getConnectionsByState("connected", currentUserId);
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
        connectionState: conn.state,
        theyMarkedFamiliar: conn.theyMarkedFamiliar,
        profileOpen: conn.profileOpen,
      });
    }

    // Sort: unread first, then by most recent message
    result.sort((a, b) => {
      if (a.hasUnread !== b.hasUnread) return a.hasUnread ? -1 : 1;
      return b.sortKey.localeCompare(a.sortKey);
    });

    return result;
  }, [conversations, currentUserId]);

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
        {/* Desktop search — hidden on mobile (nav header handles it) */}
        <div className="inbox-desktop-search">
          <MagnifyingGlass size={18} weight="light" className="text-fg-tertiary shrink-0" />
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-fg-primary placeholder:text-fg-tertiary"
            style={{ fontSize: 16 }}
          />
        </div>

        {/* List */}
        {filtered.length > 0 ? (
          <LayoutList>
            <div className="flex flex-col divide-y divide-edge-regular">
              {filtered.map((row) => (
                <PersonRow
                  key={row.userId}
                  variant="inbox-conversation"
                  userId={row.userId}
                  name={row.name}
                  avatarUrl={row.avatarUrl}
                  pets={row.dogNames.map((name) => ({ name }))}
                  connectionState={row.connectionState}
                  theyMarkedFamiliar={row.theyMarkedFamiliar}
                  profileOpen={row.profileOpen}
                  messagePreview={row.preview}
                  timeAgo={row.timeAgo}
                  unreadDot={row.hasUnread}
                />
              ))}
            </div>
          </LayoutList>
        ) : search.trim() ? (
          <LayoutSection>
            <EmptyState
              icon={<MagnifyingGlass size={40} weight="light" />}
              title="No results"
              subtitle={`No people matching "${search}"`}
            />
          </LayoutSection>
        ) : (
          <LayoutSection>
            <EmptyState
              icon={<ChatCircleDots size={48} weight="light" />}
              title="No conversations yet"
              subtitle="Connect with people at meets and communities to start chatting."
            />
          </LayoutSection>
        )}

        <Spacer />
      </div>
    </PageColumn>
  );
}
