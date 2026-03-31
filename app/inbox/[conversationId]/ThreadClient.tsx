"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PaperPlaneTilt,
  Handshake,
} from "@phosphor-icons/react";
import type {
  Conversation,
  ChatMessage,
  MessageSender,
  ServiceType,
  BookingProposal,
} from "@/lib/types";
import { InquiryForm, type InquirySubmitData } from "@/components/messaging/InquiryForm";
import { BookingProposalCard } from "@/components/messaging/BookingProposalCard";
import { InquiryChips } from "@/components/messaging/InquiryChips";
import { RelationshipBanner } from "@/components/messaging/RelationshipBanner";
import { PaymentCard } from "@/components/messaging/PaymentCard";
import { ContractCard } from "@/components/messaging/ContractCard";
import { SigningModal } from "@/components/messaging/SigningModal";
import { InquiryResponseCard } from "@/components/messaging/InquiryResponseCard";
import { ProposalForm } from "@/components/messaging/ProposalForm";
import { useConversations } from "@/contexts/ConversationsContext";
import { useBookings } from "@/contexts/BookingsContext";

const MY_USER_ID = "shawn";

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateLabel(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function groupByDate(messages: ChatMessage[]) {
  const groups: { label: string; messages: ChatMessage[] }[] = [];
  let currentLabel = "";
  for (const msg of messages) {
    const label = formatDateLabel(msg.sentAt);
    if (label !== currentLabel) {
      currentLabel = label;
      groups.push({ label, messages: [] });
    }
    groups[groups.length - 1].messages.push(msg);
  }
  return groups;
}

// ── Main thread client ─────────────────────────────────────────────────────────

export function ThreadClient({
  conv,
  initialService = null,
  initialStart = null,
  initialEnd = null,
}: {
  conv: Conversation;
  initialService?: ServiceType | null;
  initialStart?: string | null;
  initialEnd?: string | null;
}) {
  const { addMessage, updateInquiry, updateProposalStatus } = useConversations();
  const { createBooking } = useBookings();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(conv.messages);
  const [draft, setDraft] = useState("");
  const [signingMsgId, setSigningMsgId] = useState<string | null>(null);
  const [proposalFormOpen, setProposalFormOpen] = useState(false);
  const [inquiryDeclined, setInquiryDeclined] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Perspective: am I the carer (provider) or the owner in this conversation?
  const isCarerPerspective = conv.providerId === MY_USER_ID;
  const myRole: MessageSender = isCarerPerspective ? "provider" : "owner";

  // Other party info for the thread header
  const otherParty = isCarerPerspective
    ? { name: conv.ownerName, avatarUrl: conv.ownerAvatarUrl, profileLink: null }
    : {
        name: conv.providerName,
        avatarUrl: conv.providerAvatarUrl,
        profileLink: `/discover/profile/${conv.providerId}`,
      };

  const isDirect = conv.conversationType === "direct";
  const isNew = localMessages.length === 0;

  useEffect(() => {
    setLocalMessages(conv.messages);
  }, [conv.messages]);

  useEffect(() => {
    if (bodyRef.current && !isNew) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [localMessages, isNew]);

  function handleInquirySubmit(data: InquirySubmitData) {
    updateInquiry(conv.id, {
      bookingType: data.bookingType,
      serviceType: data.service,
      subService: data.subService,
      pets: data.pets,
      dogName: data.pets.join(" & "),
      startDate: data.bookingType === "one_off" ? data.dateRange.start : null,
      endDate: data.bookingType === "one_off" ? data.dateRange.end : null,
      recurringSchedule: data.recurringSchedule ?? undefined,
      message: data.message,
    });

    const firstMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      sender: myRole,
      type: "text",
      text: data.message,
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(conv.id, firstMsg);
    setLocalMessages([firstMsg]);
  }

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      sender: myRole,
      type: "text",
      text,
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(conv.id, newMsg);
    setLocalMessages((prev) => [...prev, newMsg]);
    setDraft("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // ── Carer actions ──────────────────────────────────────────────────────────

  // Carer sends a booking proposal from the ProposalForm modal
  function handleCarerSendProposal(proposal: BookingProposal) {
    const proposalMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      sender: "provider",
      type: "booking_proposal",
      proposal,
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(conv.id, proposalMsg);
    setLocalMessages((prev) => [...prev, proposalMsg]);
    setProposalFormOpen(false);
  }

  // Carer declines the inquiry
  function handleCarerDecline(reason: string) {
    setInquiryDeclined(true);
    const declineText = reason.trim()
      ? `I'm not available for this booking. ${reason.trim()}`
      : "I'm not available for this booking right now. Thanks for reaching out!";
    const declineMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      sender: "provider",
      type: "text",
      text: declineText,
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(conv.id, declineMsg);
    setLocalMessages((prev) => [...prev, declineMsg]);
  }

  // Carer suggests changes — opens compose with pre-filled text
  function handleCarerSuggestChanges() {
    const ownerFirst = conv.ownerName.split(" ")[0];
    setDraft(`Hi ${ownerFirst}, thanks for your inquiry! I'd love to help but would like to suggest a few changes — `);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  // ── Owner actions ────────────────────────────────────────────────────────

  // Accept opens signing modal (only for owner perspective)
  function handleProposalAccept(msgId: string) {
    setSigningMsgId(msgId);
  }

  // Decline immediately (only for owner perspective)
  function handleProposalDecline(msgId: string) {
    updateProposalStatus(conv.id, msgId, "declined");
    setLocalMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.proposal
          ? { ...m, proposal: { ...m.proposal, status: "declined" } }
          : m
      )
    );
    const declineMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      sender: myRole,
      type: "text",
      text: "I've declined the booking proposal. Let me know if you'd like to discuss different dates or pricing.",
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(conv.id, declineMsg);
    setLocalMessages((prev) => [...prev, declineMsg]);
  }

  // Sign & Book — creates Booking, appends ContractCard
  function handleSign(msgId: string) {
    const proposalMsg = localMessages.find((m) => m.id === msgId);
    if (!proposalMsg?.proposal) return;
    const p = proposalMsg.proposal;

    const bookingId = createBooking({
      conversationId: conv.id,
      ownerId: conv.ownerId,
      ownerName: conv.ownerName,
      ownerAvatarUrl: conv.ownerAvatarUrl,
      carerId: conv.providerId,
      carerName: conv.providerName,
      carerAvatarUrl: conv.providerAvatarUrl,
      type: p.bookingType,
      serviceType: p.serviceType,
      subService: p.subService,
      pets: p.pets,
      startDate: p.startDate,
      endDate: p.endDate,
      recurringSchedule: p.recurringSchedule,
      price: p.price,
      status: "upcoming",
      sessions: p.bookingType === "ongoing" ? [] : undefined,
    });

    updateProposalStatus(conv.id, msgId, "accepted");
    setLocalMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.proposal
          ? { ...m, proposal: { ...m.proposal, status: "accepted" } }
          : m
      )
    );

    const contractMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      sender: myRole,
      type: "contract",
      contract: {
        bookingId,
        serviceType: p.serviceType,
        subService: p.subService,
        carerName: conv.providerName,
        pets: p.pets,
        startDate: p.startDate,
      },
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(conv.id, contractMsg);
    setLocalMessages((prev) => [...prev, contractMsg]);

    setSigningMsgId(null);
  }

  const groups = groupByDate(localMessages);
  const signingMsg = signingMsgId
    ? localMessages.find((m) => m.id === signingMsgId) ?? null
    : null;

  // Owner can respond to proposals sent by provider; carer cannot respond to their own
  const canRespondToProposal = !isCarerPerspective;

  // Carer: has a proposal already been sent in this thread?
  const hasProposal = localMessages.some((m) => m.type === "booking_proposal");
  // Show InquiryResponseCard when: carer perspective, booking conv, has messages, no proposal sent yet, not declined
  const showInquiryResponse =
    isCarerPerspective && !isDirect && !isNew && !hasProposal && !inquiryDeclined;

  return (
    <div className="inbox-thread-outer">
    <div className="inbox-thread-shell">
      {/* Header */}
      <div className="inbox-thread-header">
        <Link href="/inbox" className="inbox-thread-back" aria-label="Back to inbox">
          <ArrowLeft size={20} weight="regular" />
        </Link>
        <img
          src={otherParty.avatarUrl}
          alt={otherParty.name}
          className="inbox-thread-avatar"
        />
        <div className="inbox-thread-header-info">
          <div className="inbox-thread-name-row">
            <span className="inbox-thread-name">{otherParty.name}</span>
            {isCarerPerspective && (
              <span className="inbox-carer-badge inbox-carer-badge--thread">As carer</span>
            )}
          </div>
          {isDirect ? (
            <span className="inbox-thread-connection-badge">
              <Handshake size={11} weight="fill" />
              Connected
            </span>
          ) : otherParty.profileLink ? (
            <Link href={otherParty.profileLink} className="inbox-thread-profile-link">
              View profile →
            </Link>
          ) : (
            <span className="inbox-thread-profile-link inbox-thread-profile-link--muted">
              Client
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="inbox-thread-body" ref={bodyRef}>
        {isNew && !isDirect && !isCarerPerspective ? (
          <InquiryForm
            conv={conv}
            initialService={initialService}
            initialStart={initialStart}
            initialEnd={initialEnd}
            onSubmit={handleInquirySubmit}
          />
        ) : (
          <>
            {!isDirect && (
              <RelationshipBanner
                otherUserId={conv.providerId === MY_USER_ID ? conv.ownerId : conv.providerId}
                otherName={otherParty.name}
              />
            )}
            {!isDirect && <InquiryChips conv={conv} />}
            {isNew && isDirect && (
              <div className="inbox-direct-empty">
                <Handshake size={32} weight="light" className="text-fg-tertiary" />
                <p className="text-fg-secondary text-base m-0">
                  You&apos;re connected with {otherParty.name}. Say hello!
                </p>
              </div>
            )}
            {groups.map((group) => (
              <div key={group.label} className="inbox-date-group">
                <div className="inbox-date-sep">
                  <span className="inbox-date-sep-label">{group.label}</span>
                </div>
                {group.messages.map((msg) => {
                  if (msg.type === "booking_proposal") {
                    return (
                      <div
                        key={msg.id}
                        className={`inbox-message-wrap inbox-message-wrap--${msg.sender}`}
                      >
                        <BookingProposalCard
                          msg={msg}
                          canRespond={canRespondToProposal && msg.sender !== myRole}
                          onAccept={handleProposalAccept}
                          onDecline={handleProposalDecline}
                        />
                        <span className="inbox-message-time">{formatTime(msg.sentAt)}</span>
                      </div>
                    );
                  }
                  if (msg.type === "contract") {
                    return (
                      <div
                        key={msg.id}
                        className="inbox-message-wrap inbox-message-wrap--center"
                      >
                        <ContractCard msg={msg} />
                        <span className="inbox-message-time">{formatTime(msg.sentAt)}</span>
                      </div>
                    );
                  }
                  if (msg.type === "payment_summary" || msg.type === "payment_confirmed") {
                    return (
                      <div
                        key={msg.id}
                        className="inbox-message-wrap inbox-message-wrap--center"
                      >
                        <PaymentCard msg={msg} />
                        <span className="inbox-message-time">{formatTime(msg.sentAt)}</span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={msg.id}
                      className={`inbox-message-wrap inbox-message-wrap--${msg.sender}`}
                    >
                      <div className={`inbox-message inbox-message--${msg.sender}`}>
                        {msg.text}
                      </div>
                      <span className="inbox-message-time">{formatTime(msg.sentAt)}</span>
                    </div>
                  );
                })}
              </div>
            ))}
            {/* Carer: inquiry response actions */}
            {showInquiryResponse && (
              <div className="flex justify-center p-md">
                <InquiryResponseCard
                  conv={conv}
                  onSendProposal={() => setProposalFormOpen(true)}
                  onDecline={handleCarerDecline}
                  onSuggestChanges={handleCarerSuggestChanges}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Compose bar */}
      {(isDirect || !isNew || isCarerPerspective) && (
        <div className="inbox-thread-footer">
          <textarea
            ref={inputRef}
            className="inbox-compose-input"
            placeholder="Message…"
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Message input"
          />
          <button
            className="inbox-compose-send"
            onClick={handleSend}
            disabled={!draft.trim()}
            aria-label="Send message"
          >
            <PaperPlaneTilt size={20} weight="fill" />
          </button>
        </div>
      )}

      {/* Signing modal (owner) */}
      <SigningModal
        msg={signingMsg}
        conv={conv}
        open={signingMsgId !== null}
        onClose={() => setSigningMsgId(null)}
        onSign={handleSign}
      />

      {/* Proposal form modal (carer) */}
      <ProposalForm
        conv={conv}
        open={proposalFormOpen}
        onClose={() => setProposalFormOpen(false)}
        onSubmit={handleCarerSendProposal}
      />
    </div>
    </div>
  );
}
