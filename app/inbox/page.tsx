"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { getUserById } from "@/lib/mockUsers";
import { getConnectionState, CONNECTION_STATE_LABELS } from "@/lib/mockConnections";
import { getUserGroups } from "@/lib/mockGroups";
import { getUserMeets } from "@/lib/mockMeets";
import {
  ChatCircleDots,
  Handshake,
  UsersThree,
  Heart,
  PawPrint,
  ArrowLeft,
  PaperPlaneTilt,
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
import { formatRelativeTime } from "@/lib/dateUtils";
import { usePageHeader } from "@/contexts/PageHeaderContext";

const MY_USER_ID = "shawn";

type InboxFilter = "all" | "care" | "groups";

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
  const user = getUserById(other.id);
  const connection = getConnectionState(other.id);

  // Compute shared groups
  const myGroups = getUserGroups("shawn");
  const theirGroups = getUserGroups(other.id);
  const sharedGroups = myGroups.filter((g) => theirGroups.some((tg) => tg.id === g.id));

  // Compute shared meets
  const myMeets = getUserMeets("shawn");
  const theirMeets = getUserMeets(other.id);
  const sharedMeets = myMeets.filter((m) => theirMeets.some((tm) => tm.id === m.id));

  // Dogs from the user profile
  const dogs = user?.pets ?? [];

  return (
    <div className="inbox-contact-panel">
      {/* ── Profile header ── */}
      <div className="inbox-contact-header">
        <img
          src={other.avatarUrl}
          alt={other.name}
          className="rounded-full object-cover"
          style={{ width: 80, height: 80 }}
        />
        <h3 className="font-heading text-lg font-semibold text-fg-primary m-0">
          {user ? `${user.firstName} ${user.lastName}` : other.name}
        </h3>
        {user?.neighbourhood && (
          <span className="text-sm text-fg-secondary">{user.neighbourhood}</span>
        )}
        {connection && (
          <span className={`inbox-contact-badge inbox-contact-badge--${connection.state}`}>
            {CONNECTION_STATE_LABELS[connection.state] ?? connection.state}
          </span>
        )}
        {user?.memberSince && (
          <span className="text-xs text-fg-tertiary">
            Member since {new Date(user.memberSince + "-01").toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </span>
        )}
        <ButtonAction variant="outline" size="sm" href={`/discover/profile/${other.id}`}>
          View profile
        </ButtonAction>
      </div>

      {/* ── Dogs ── */}
      {dogs.length > 0 && (
        <div className="inbox-contact-section">
          <h4 className="inbox-contact-section-title">
            <PawPrint size={14} weight="light" />
            {dogs.length === 1 ? "Dog" : "Dogs"}
          </h4>
          <div className="flex flex-col gap-sm">
            {dogs.map((dog) => (
              <div key={dog.name} className="inbox-contact-dog">
                {dog.imageUrl && (
                  <img
                    src={dog.imageUrl}
                    alt={dog.name}
                    className="rounded-full object-cover shrink-0"
                    style={{ width: 40, height: 40 }}
                  />
                )}
                <div className="flex flex-col" style={{ gap: 2 }}>
                  <span className="text-sm font-semibold text-fg-primary">{dog.name}</span>
                  <span className="text-xs text-fg-secondary">
                    {[dog.breed, dog.ageLabel, dog.weightLabel].filter(Boolean).join(" · ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Relationship context ── */}
      <div className="inbox-contact-section">
        <h4 className="inbox-contact-section-title">
          <Handshake size={14} weight="light" />
          Relationship
        </h4>
        <div className="flex flex-col gap-xs">
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <PawPrint size={14} weight="light" className="shrink-0" />
            <span>{sharedMeets.length} meet{sharedMeets.length !== 1 ? "s" : ""} together</span>
          </div>
          <div className="flex items-center gap-xs text-sm text-fg-secondary">
            <UsersThree size={14} weight="light" className="shrink-0" />
            <span>{sharedGroups.length} shared group{sharedGroups.length !== 1 ? "s" : ""}</span>
          </div>
          {connection?.mutualConnections && connection.mutualConnections.length > 0 && (
            <div className="flex items-center gap-xs text-sm text-fg-secondary">
              <Handshake size={14} weight="light" className="shrink-0" />
              <span>{connection.mutualConnections.length} mutual: {connection.mutualConnections.join(", ")}</span>
            </div>
          )}
          {connection?.firstMetDate && (
            <div className="flex items-center gap-xs text-sm text-fg-tertiary">
              <span>First met {new Date(connection.firstMetDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Shared groups list ── */}
      {sharedGroups.length > 0 && (
        <div className="inbox-contact-section">
          <h4 className="inbox-contact-section-title">
            <UsersThree size={14} weight="light" />
            Groups in common
          </h4>
          <div className="flex flex-col gap-xs">
            {sharedGroups.map((g) => (
              <div key={g.id} className="inbox-contact-group-row">
                {g.coverPhotoUrl && (
                  <img
                    src={g.coverPhotoUrl}
                    alt={g.name}
                    className="rounded-sm object-cover shrink-0"
                    style={{ width: 36, height: 36 }}
                  />
                )}
                <div className="flex flex-col" style={{ gap: 1 }}>
                  <span className="text-sm font-semibold text-fg-primary">{g.name}</span>
                  <span className="text-xs text-fg-tertiary capitalize">{g.groupType} group · {g.neighbourhood}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Upcoming shared meets ── */}
      {sharedMeets.filter((m) => m.status === "upcoming").length > 0 && (
        <div className="inbox-contact-section">
          <h4 className="inbox-contact-section-title">
            <PawPrint size={14} weight="light" />
            Upcoming meets together
          </h4>
          <div className="flex flex-col gap-xs">
            {sharedMeets
              .filter((m) => m.status === "upcoming")
              .slice(0, 3)
              .map((m) => (
                <div key={m.id} className="inbox-contact-meet-row">
                  <div className="flex flex-col" style={{ gap: 1 }}>
                    <span className="text-sm font-semibold text-fg-primary">{m.title}</span>
                    <span className="text-xs text-fg-tertiary">
                      {new Date(m.date).toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" })} · {m.time}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Booking context (care conversations only) ── */}
      {!isDirect && (
        <div className="inbox-contact-section inbox-contact-booking">
          <h4 className="inbox-contact-section-title">
            <Heart size={14} weight="light" className="text-brand-main" />
            Booking details
          </h4>
          <div className="flex flex-col gap-xs text-sm">
            <div className="flex justify-between">
              <span className="text-fg-secondary">Service</span>
              <span className="text-fg-primary font-semibold">{SERVICE_LABELS[conv.inquiry.serviceType]}</span>
            </div>
            {conv.inquiry.dogName && (
              <div className="flex justify-between">
                <span className="text-fg-secondary">Dog</span>
                <span className="text-fg-primary">{conv.inquiry.dogName}</span>
              </div>
            )}
            {conv.inquiry.startDate && (
              <div className="flex justify-between">
                <span className="text-fg-secondary">Date</span>
                <span className="text-fg-primary">
                  {new Date(conv.inquiry.startDate).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
                  {conv.inquiry.endDate && ` – ${new Date(conv.inquiry.endDate).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}`}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-fg-secondary">Status</span>
              <span className="inbox-contact-status">{conv.status}</span>
            </div>
          </div>
          <ButtonAction variant="primary" size="sm" href={`/discover/profile/${other.id}`} style={{ marginTop: "var(--space-sm)" }}>
            View services
          </ButtonAction>
        </div>
      )}

      {/* ── Bio ── */}
      {user?.bio && (
        <div className="inbox-contact-section">
          <h4 className="inbox-contact-section-title">About</h4>
          <p className="text-sm text-fg-secondary m-0">{user.bio}</p>
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

  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const handleBack = useCallback(() => setSelectedConvId(null), []);
  const detailName = selectedConv ? getOtherParty(selectedConv).name : null;

  useEffect(() => {
    if (selectedConvId && detailName) {
      setDetailHeader(detailName, handleBack);
    } else {
      clearDetailHeader();
    }
    return () => clearDetailHeader();
  }, [selectedConvId, detailName, setDetailHeader, clearDetailHeader, handleBack]);

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
    <>
      {/* Messages — scrollable area */}
      <div className="inbox-messages">
        {selectedConv.messages.map((msg) => {
          const isMe =
            (msg.sender === "owner" && selectedConv.ownerId === MY_USER_ID) ||
            (msg.sender === "provider" && selectedConv.providerId === MY_USER_ID);

          if (msg.type === "booking_proposal") {
            return (
              <div key={msg.id} className="inbox-msg inbox-msg--system">
                <div className="inbox-msg-booking">
                  <span className="text-xs font-semibold text-brand-main uppercase tracking-wide">
                    Booking proposal
                  </span>
                  {msg.text && <p className="text-sm text-fg-primary m-0">{msg.text}</p>}
                  <span className="text-xs text-fg-tertiary">
                    {new Date(msg.sentAt).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`inbox-msg ${isMe ? "inbox-msg--mine" : "inbox-msg--theirs"}`}
            >
              <div className={`inbox-msg-bubble ${isMe ? "inbox-msg-bubble--mine" : "inbox-msg-bubble--theirs"}`}>
                {msg.text && <p className="text-sm text-fg-primary m-0">{msg.text}</p>}
                <span className="text-xs text-fg-tertiary">
                  {new Date(msg.sentAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="inbox-composer">
        <input
          type="text"
          placeholder="Type a message…"
          className="inbox-composer-input"
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
        <button type="button" className="inbox-composer-send" aria-label="Send">
          <PaperPlaneTilt size={20} weight="light" />
        </button>
      </div>
    </>
  ) : (
    <div className="flex items-center justify-center h-full text-fg-tertiary text-sm">
      Select a conversation
    </div>
  );

  return (
    <div className="page-container inbox-page-shell">
      {/* TabBar — visible on collapsed/mobile, hidden on desktop */}
      <div className="panel-tabbar" data-view={selectedConvId ? "detail" : "list"}>
        <div className="panel-tabbar-list">
          <div className="panel-tabbar-title">Inbox</div>
          <div className="panel-tabbar-tabs">
            <TabBar tabs={TABS} activeKey={filter} onChange={(key) => setFilter(key as InboxFilter)} />
          </div>
        </div>
        <div className="panel-tabbar-detail">
          <button type="button" className="panel-tabbar-back" onClick={() => setSelectedConvId(null)}>
            <ArrowLeft size={20} weight="light" />
          </button>
          <span className="panel-tabbar-detail-title">
            {selectedConv ? getOtherParty(selectedConv).name : ""}
          </span>
        </div>
      </div>

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
          <div className="detail-panel inbox-detail">
            {selectedConv && (
              <div className="detail-panel-header">
                <img
                  src={getOtherParty(selectedConv).avatarUrl}
                  alt={getOtherParty(selectedConv).name}
                  className="rounded-full object-cover shrink-0"
                  style={{ width: 32, height: 32 }}
                />
                <div className="flex flex-col" style={{ gap: 2 }}>
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
            )}
            {detailContent}
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
