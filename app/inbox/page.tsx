"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChatCircleDots,
  ChatText,
  Handshake,
  UsersThree,
  Heart,
  PawPrint,
  ArrowLeft,
} from "@phosphor-icons/react";
import { useConversations } from "@/contexts/ConversationsContext";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { MasterDetailShell, type MobileView } from "@/components/layout/MasterDetailShell";
import { PanelBody } from "@/components/layout/PanelBody";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutList } from "@/components/layout/LayoutList";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { TabBar } from "@/components/ui/TabBar";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Conversation } from "@/lib/types";

const MY_USER_ID = "shawn";

type InboxFilter = "all" | "care" | "groups";

function formatRelativeTime(isoString: string): string {
  if (!isoString) return "";
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

function getLastMessage(conv: Conversation) {
  if (!conv.lastMessageId) return null;
  return conv.messages.find((m) => m.id === conv.lastMessageId) ?? conv.messages.at(-1) ?? null;
}

function getPreview(conv: Conversation): string {
  const lastMsg = getLastMessage(conv);
  if (!lastMsg) {
    if (conv.conversationType === "direct") return "Start a conversation";
    return conv.inquiry.message ? conv.inquiry.message.slice(0, 72) + "…" : "New conversation";
  }
  if (lastMsg.type === "booking_proposal") return "Booking proposal";
  if (lastMsg.type === "contract") return "Contract signed";
  if (lastMsg.text) {
    return lastMsg.text.length > 72 ? lastMsg.text.slice(0, 72) + "…" : lastMsg.text;
  }
  return "";
}

function getOtherParty(conv: Conversation) {
  const isCarerPerspective = conv.providerId === MY_USER_ID;
  return isCarerPerspective
    ? { name: conv.ownerName, avatarUrl: conv.ownerAvatarUrl, id: conv.ownerId }
    : { name: conv.providerName, avatarUrl: conv.providerAvatarUrl, id: conv.providerId };
}

// ── Conversation row (used in list panel) ──────────────────────────

function ConversationRow({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const isDirect = conv.conversationType === "direct";
  const isCarerPerspective = conv.providerId === MY_USER_ID;
  const other = getOtherParty(conv);
  const lastMsg = getLastMessage(conv);
  const preview = getPreview(conv);
  const timeAgo = lastMsg ? formatRelativeTime(lastMsg.sentAt) : "";
  const hasUnread = conv.unreadCount > 0;

  return (
    <div
      className={`inbox-row${isActive ? " inbox-row--active" : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="inbox-avatar-wrap">
        <img src={other.avatarUrl} alt={other.name} className="inbox-avatar" />
        {hasUnread && <span className="inbox-unread-dot" aria-label="Unread messages" />}
      </div>
      <div className="inbox-row-body">
        <div className="inbox-row-top">
          <span className="inbox-row-name">{other.name}</span>
          <div className="inbox-row-top-right">
            {!isDirect && isCarerPerspective && (
              <span className="inbox-carer-badge">As carer</span>
            )}
            {timeAgo && <span className="inbox-row-time">{timeAgo}</span>}
          </div>
        </div>
        <div className="inbox-row-mid">
          {isDirect ? (
            <span className="inbox-direct-chip">
              <Handshake size={11} weight="fill" />
              Direct message
            </span>
          ) : (
            <>
              <span className="inbox-service-chip">
                {SERVICE_LABELS[conv.inquiry.serviceType]}
              </span>
              {conv.inquiry.dogName && (
                <span className="inbox-row-dog">· {conv.inquiry.dogName}</span>
              )}
            </>
          )}
        </div>
        <p className={`inbox-row-preview${hasUnread ? " inbox-row-preview--unread" : ""}`}>
          {preview}
        </p>
      </div>
    </div>
  );
}

// ── Contact info panel (right column on desktop, Info tab on mobile) ──

function ContactInfoPanel({ conv }: { conv: Conversation }) {
  const other = getOtherParty(conv);
  const isDirect = conv.conversationType === "direct";

  return (
    <div className="flex flex-col gap-lg p-lg">
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-sm">
        <img
          src={other.avatarUrl}
          alt={other.name}
          className="rounded-full object-cover"
          style={{ width: 72, height: 72 }}
        />
        <h3 className="font-heading text-lg font-semibold text-fg-primary m-0">{other.name}</h3>
        <ButtonAction variant="outline" size="sm" href={`/discover/profile/${other.id}`}>
          View profile
        </ButtonAction>
      </div>

      {/* Trust signals */}
      <div className="flex flex-col gap-sm rounded-panel bg-surface-inset p-md">
        <h4 className="text-xs font-semibold text-fg-secondary uppercase tracking-wide m-0">
          Trust signals
        </h4>
        <div className="flex items-center gap-xs text-sm text-fg-secondary">
          <PawPrint size={14} weight="light" />
          <span>3 meets together</span>
        </div>
        <div className="flex items-center gap-xs text-sm text-fg-secondary">
          <UsersThree size={14} weight="light" />
          <span>2 shared groups</span>
        </div>
        <div className="flex items-center gap-xs text-sm text-fg-secondary">
          <Handshake size={14} weight="light" />
          <span>5 mutual connections</span>
        </div>
      </div>

      {/* Care CTA (only for booking conversations) */}
      {!isDirect && (
        <div className="flex flex-col gap-sm rounded-panel bg-surface-top shadow-sm p-md">
          <div className="flex items-center gap-xs">
            <Heart size={16} weight="light" className="text-brand-main" />
            <h4 className="text-sm font-semibold text-fg-primary m-0">Request Care</h4>
          </div>
          <p className="text-xs text-fg-secondary m-0">
            {other.name} offers walking, sitting, and boarding services.
          </p>
          <ButtonAction variant="primary" size="sm" href={`/discover/profile/${other.id}`}>
            View services
          </ButtonAction>
        </div>
      )}
    </div>
  );
}

// ── Main inbox page ────────────────────────────────────────────────

export default function InboxPage() {
  const { conversations } = useConversations();
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  const TABS = [
    { key: "all", label: "All" },
    { key: "care", label: "Care" },
    { key: "groups", label: "Groups" },
  ];

  const sortedConversations = useMemo(() => {
    let filtered = conversations;
    if (filter === "care") {
      filtered = conversations.filter((c) => c.conversationType === "booking");
    } else if (filter === "groups") {
      filtered = conversations.filter((c) => c.conversationType === "direct");
    }
    return filtered.sort((a, b) => {
      const aTime = getLastMessage(a)?.sentAt ?? "";
      const bTime = getLastMessage(b)?.sentAt ?? "";
      return bTime.localeCompare(aTime);
    });
  }, [conversations, filter]);

  const selectedConv = selectedConvId
    ? conversations.find((c) => c.id === selectedConvId)
    : sortedConversations[0] ?? null;

  const mobileView: MobileView = selectedConvId ? "detail" : "list";

  const listContent = (
    <>
      {sortedConversations.length > 0 ? (
        <div className="flex flex-col">
          {sortedConversations.map((conv) => (
            <ConversationRow
              key={conv.id}
              conv={conv}
              isActive={selectedConv?.id === conv.id}
              onClick={() => setSelectedConvId(conv.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ChatCircleDots size={48} weight="light" />}
          title="No conversations yet"
          subtitle="Message someone from their profile or connect at a meet."
        />
      )}
    </>
  );

  const detailContent = selectedConv ? (
    <div className="flex flex-col gap-lg p-lg">
      {/* Mobile back button */}
      <div className="inbox-mobile-back">
        <button
          className="flex items-center gap-xs text-sm text-fg-secondary bg-transparent border-0 p-0"
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedConvId(null)}
        >
          <ArrowLeft size={16} weight="light" />
          Back
        </button>
      </div>
      <div className="flex items-center gap-sm">
        <img
          src={getOtherParty(selectedConv).avatarUrl}
          alt={getOtherParty(selectedConv).name}
          className="rounded-full object-cover shrink-0"
          style={{ width: 40, height: 40 }}
        />
        <div className="flex flex-col">
          <span className="font-heading text-md font-semibold text-fg-primary">
            {getOtherParty(selectedConv).name}
          </span>
          <span className="text-xs text-fg-tertiary">
            {selectedConv.conversationType === "direct"
              ? "Direct message"
              : SERVICE_LABELS[selectedConv.inquiry.serviceType]}
          </span>
        </div>
      </div>

      {/* Message preview */}
      <div className="flex flex-col gap-sm">
        {selectedConv.messages.slice(-5).map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-xs rounded-sm p-sm ${
              (msg.sender === "owner" && selectedConv.ownerId === MY_USER_ID) ||
              (msg.sender === "provider" && selectedConv.providerId === MY_USER_ID)
                ? "bg-brand-50 self-end"
                : "bg-surface-inset self-start"
            }`}
            style={{ maxWidth: "80%" }}
          >
            {msg.text && <p className="text-sm text-fg-primary m-0">{msg.text}</p>}
            <span className="text-xs text-fg-tertiary">
              {new Date(msg.sentAt).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>

      <ButtonAction variant="primary" size="md" href={`/inbox/${selectedConv.id}`}>
        Open full conversation
      </ButtonAction>
    </div>
  ) : (
    <div className="flex items-center justify-center h-full text-fg-tertiary text-sm">
      Select a conversation
    </div>
  );

  return (
    <div className="page-container inbox-page-shell">
      <MasterDetailShell
        mobileView={mobileView}
        listPanel={
          <div className="list-panel">
            <div className="list-panel-header panel-header-desktop">
              <TabBar tabs={TABS} activeKey={filter} onChange={(key) => setFilter(key as InboxFilter)} />
            </div>
            <PanelBody>
              <LayoutList>
                {listContent}
              </LayoutList>
              <Spacer />
            </PanelBody>
          </div>
        }
        detailPanel={
          <div className="detail-panel">
            {selectedConv && (
              <div className="detail-panel-header">
                <span className="font-heading text-base font-semibold text-fg-primary">
                  {getOtherParty(selectedConv).name}
                </span>
              </div>
            )}
            <PanelBody>
              {detailContent}
              <Spacer />
            </PanelBody>
          </div>
        }
        infoPanel={
          selectedConv ? (
            <div className="detail-panel">
              <PanelBody>
                <ContactInfoPanel conv={selectedConv} />
                <Spacer />
              </PanelBody>
            </div>
          ) : undefined
        }
      />
    </div>
  );
}
