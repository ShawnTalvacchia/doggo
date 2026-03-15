"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PaperPlaneTilt,
  CalendarCheck,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import type {
  Conversation,
  ChatMessage,
  MessageSender,
  ServiceType,
} from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { InquiryForm, type InquirySubmitData } from "@/components/messaging/InquiryForm";
import { BookingProposalCard } from "@/components/messaging/BookingProposalCard";
import { InquiryChips } from "@/components/messaging/InquiryChips";
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

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
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

// ── Inquiry form (extracted → components/messaging/InquiryForm.tsx) ────────────

// ── Booking proposal card ──────────────────────────────────────────────────────

// ── Contract card ──────────────────────────────────────────────────────────────

function ContractCard({ msg }: { msg: ChatMessage }) {
  const c = msg.contract!;
  return (
    <div className="inbox-contract-card">
      <div className="inbox-contract-header">
        <CheckCircle size={18} weight="fill" className="inbox-contract-icon" />
        <span className="inbox-contract-label">Contract signed</span>
      </div>
      <div className="inbox-contract-body">
        <p className="inbox-contract-service">
          {SERVICE_LABELS[c.serviceType]}
          {c.subService ? ` · ${c.subService}` : ""}
        </p>
        <p className="inbox-contract-meta">
          {c.pets.join(" & ")} · From {formatShortDate(c.startDate)}
        </p>
        <p className="inbox-contract-meta">With {c.carerName}</p>
      </div>
      <Link href={`/bookings/${c.bookingId}`} className="inbox-contract-link">
        View booking <ArrowRight size={13} weight="bold" />
      </Link>
    </div>
  );
}

// ── Signing modal ──────────────────────────────────────────────────────────────

function SigningModal({
  msg,
  conv,
  open,
  onClose,
  onSign,
}: {
  msg: ChatMessage | null;
  conv: Conversation;
  open: boolean;
  onClose: () => void;
  onSign: (msgId: string) => void;
}) {
  if (!msg?.proposal) return null;
  const p = msg.proposal;

  const scheduleText = p.recurringSchedule
    ? `Every ${p.recurringSchedule.days.join(", ")} · ${p.recurringSchedule.timeLabel}`
    : p.endDate
    ? `${formatShortDate(p.startDate)} – ${formatShortDate(p.endDate)}`
    : `From ${formatShortDate(p.startDate)}`;

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title="Review contract"
      footer={
        <div className="signing-footer-actions">
          <button className="signing-sign-btn" onClick={() => onSign(msg.id)}>
            Sign & Book
          </button>
          <button className="signing-cancel-btn" onClick={onClose}>
            Not yet
          </button>
        </div>
      }
    >
      <div className="signing-body">
        {/* Carer */}
        <div className="signing-carer-row">
          <img
            src={conv.providerAvatarUrl}
            alt={conv.providerName}
            className="signing-carer-avatar"
          />
          <div>
            <p className="signing-carer-name">{conv.providerName}</p>
            <p className="signing-carer-sub">Pet carer</p>
          </div>
        </div>

        {/* Details */}
        <div className="signing-section">
          <div className="signing-row">
            <span className="signing-field">Service</span>
            <span className="signing-value">
              {SERVICE_LABELS[p.serviceType]}
              {p.subService ? ` · ${p.subService}` : ""}
            </span>
          </div>
          <div className="signing-row">
            <span className="signing-field">Pets</span>
            <span className="signing-value">{p.pets.join(", ")}</span>
          </div>
          <div className="signing-row">
            <span className="signing-field">
              {p.recurringSchedule ? "Schedule" : "Dates"}
            </span>
            <span className="signing-value">{scheduleText}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="signing-price-section">
          <p className="signing-price-heading">Pricing</p>
          {p.price.lineItems.map((item, i) => (
            <div key={i} className="signing-price-row">
              <span className="signing-price-label">{item.label}</span>
              <span className="signing-price-amount">
                {item.isModifier ? "+" : ""}
                {item.amount.toLocaleString()} Kč
                <span className="signing-price-unit"> / {item.unit}</span>
              </span>
            </div>
          ))}
          {p.price.lineItems.length > 1 && (
            <>
              <div className="signing-price-divider" />
              <div className="signing-price-row signing-price-total-row">
                <span className="signing-price-label">Total</span>
                <span className="signing-price-amount signing-price-total">
                  {p.price.total.toLocaleString()} Kč
                  {p.price.billingCycle === "per_session"
                    ? " / session"
                    : p.price.billingCycle === "per_night"
                    ? " / night"
                    : ""}
                </span>
              </div>
            </>
          )}
        </div>

        <p className="signing-legal-note">
          By signing, you agree to the contract terms outlined above. You can view your
          booking anytime in the Bookings tab.
        </p>
      </div>
    </ModalSheet>
  );
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
        profileLink: `/explore/profile/${conv.providerId}`,
      };

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

    // Mark proposal accepted
    updateProposalStatus(conv.id, msgId, "accepted");
    setLocalMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.proposal
          ? { ...m, proposal: { ...m.proposal, status: "accepted" } }
          : m
      )
    );

    // Append contract confirmation card
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

  return (
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
          {otherParty.profileLink ? (
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
        {isNew && !isCarerPerspective ? (
          <InquiryForm
            conv={conv}
            initialService={initialService}
            initialStart={initialStart}
            initialEnd={initialEnd}
            onSubmit={handleInquirySubmit}
          />
        ) : (
          <>
            <InquiryChips conv={conv} />
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
          </>
        )}
      </div>

      {/* Compose bar — always visible once thread has messages, or for carer perspective */}
      {(!isNew || isCarerPerspective) && (
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

      {/* Signing modal */}
      <SigningModal
        msg={signingMsg}
        conv={conv}
        open={signingMsgId !== null}
        onClose={() => setSigningMsgId(null)}
        onSign={handleSign}
      />
    </div>
  );
}
