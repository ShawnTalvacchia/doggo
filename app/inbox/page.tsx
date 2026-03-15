"use client";

import Link from "next/link";
import { ChatCircleDots } from "@phosphor-icons/react";
import { useConversations } from "@/contexts/ConversationsContext";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { Conversation } from "@/lib/types";

const MY_USER_ID = "shawn";

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
  if (!lastMsg) return conv.inquiry.message ? conv.inquiry.message.slice(0, 72) + "…" : "New conversation";
  if (lastMsg.type === "booking_proposal") return "📋 Booking proposal";
  if (lastMsg.type === "contract") return "✅ Contract signed";
  if (lastMsg.text) {
    return lastMsg.text.length > 72 ? lastMsg.text.slice(0, 72) + "…" : lastMsg.text;
  }
  return "";
}

export default function InboxPage() {
  const { conversations } = useConversations();

  if (conversations.length === 0) {
    return (
      <main className="inbox-page">
        <div className="inbox-header">
          <h1 className="inbox-heading">Inbox</h1>
        </div>
        <div className="inbox-empty">
          <ChatCircleDots size={40} weight="light" className="inbox-empty-icon" />
          <p className="inbox-empty-text">No conversations yet.</p>
          <p className="inbox-empty-sub">Message a sitter from their profile to get started.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="inbox-page">
      <div className="inbox-header">
        <h1 className="inbox-heading">Inbox</h1>
      </div>
      <ul className="inbox-list" role="list">
        {conversations.map((conv) => {
          const isCarerPerspective = conv.providerId === MY_USER_ID;
          const otherParty = isCarerPerspective
            ? { name: conv.ownerName, avatarUrl: conv.ownerAvatarUrl }
            : { name: conv.providerName, avatarUrl: conv.providerAvatarUrl };

          const lastMsg = getLastMessage(conv);
          const serviceLabel = SERVICE_LABELS[conv.inquiry.serviceType];
          const preview = getPreview(conv);
          const timeAgo = lastMsg ? formatRelativeTime(lastMsg.sentAt) : "";
          const hasUnread = conv.unreadCount > 0;
          const isNew = conv.messages.length === 0;

          return (
            <li key={conv.id}>
              <Link href={`/inbox/${conv.id}`} className="inbox-row">
                <div className="inbox-avatar-wrap">
                  <img
                    src={otherParty.avatarUrl}
                    alt={otherParty.name}
                    className="inbox-avatar"
                  />
                  {hasUnread && (
                    <span className="inbox-unread-dot" aria-label="Unread messages" />
                  )}
                </div>
                <div className="inbox-row-body">
                  <div className="inbox-row-top">
                    <span className="inbox-row-name">{otherParty.name}</span>
                    <div className="inbox-row-top-right">
                      {isCarerPerspective && (
                        <span className="inbox-carer-badge">As carer</span>
                      )}
                      {timeAgo && <span className="inbox-row-time">{timeAgo}</span>}
                    </div>
                  </div>
                  <div className="inbox-row-mid">
                    <span className="inbox-service-chip">{serviceLabel}</span>
                    {conv.inquiry.dogName && (
                      <span className="inbox-row-dog">· {conv.inquiry.dogName}</span>
                    )}
                  </div>
                  <p
                    className={`inbox-row-preview${hasUnread ? " inbox-row-preview--unread" : ""}`}
                  >
                    {isNew ? "Tap to start your inquiry" : preview}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
