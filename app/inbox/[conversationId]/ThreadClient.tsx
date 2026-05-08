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
import { BookingProposalCard } from "@/components/messaging/BookingProposalCard";
import { InquiryCard } from "@/components/messaging/InquiryCard";
import { PaymentCard } from "@/components/messaging/PaymentCard";
import { SigningModal } from "@/components/messaging/SigningModal";
import { InquiryResponseCard } from "@/components/messaging/InquiryResponseCard";
import { ProposalForm } from "@/components/messaging/ProposalForm";
import { useConversations } from "@/contexts/ConversationsContext";
import { useBookings } from "@/contexts/BookingsContext";
import { useConnections } from "@/contexts/ConnectionsContext";
import { useCurrentUserId } from "@/hooks/useCurrentUser";

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
  embedded = false,
  initialDraft,
}: {
  conv: Conversation;
  /** When true, hides the header and uses flex layout (for embedding in profile tabs) */
  embedded?: boolean;
  /** Optional initial textarea content — used when the user arrives with
   *  context that suggests a templated opener (e.g. appointment-card CTA).
   *  Editable by the user before sending. */
  initialDraft?: string;
}) {
  const { addMessage, updateInquiry, updateProposalStatus, updateInquiryStatus, declineInquiry } =
    useConversations();
  const { createBooking, upsertProposedBooking, updateStatus, getBookingByConversation } =
    useBookings();
  const { markConnected } = useConnections();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(conv.messages);
  const [draft, setDraft] = useState(initialDraft ?? "");
  const [signingMsgId, setSigningMsgId] = useState<string | null>(null);
  const [proposalFormOpen, setProposalFormOpen] = useState(false);
  /** When provider taps "Send proposal" on a specific InquiryCard, capture
   *  which inquiry message they're responding to so the form sources from
   *  it (not from the conv-level inquiry, which may be stale across multiple
   *  inquiries in one thread). Discover & Care G3, 2026-05-02. */
  const [respondingToInquiryId, setRespondingToInquiryId] = useState<string | null>(null);
  /** When either side taps "Suggest changes" on a BookingProposalCard, capture
   *  the source proposal id so the new ProposalForm pre-fills with its values
   *  and on submit the source proposal flips to `"countered"`. G4. */
  const [counteringProposalId, setCounteringProposalId] = useState<string | null>(null);
  const [inquiryDeclined, setInquiryDeclined] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Perspective: am I the carer (provider) or the owner in this conversation?
  const MY_USER_ID = useCurrentUserId();
  const isCarerPerspective = conv.providerId === MY_USER_ID;
  const myRole: MessageSender = isCarerPerspective ? "provider" : "owner";

  // Other party info for the thread header
  const otherParty = isCarerPerspective
    ? { name: conv.ownerName, avatarUrl: conv.ownerAvatarUrl, profileLink: null }
    : {
        name: conv.providerName,
        avatarUrl: conv.providerAvatarUrl,
        profileLink: `/profile/${conv.providerId}`,
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

  /**
   * Send a booking proposal — used by both the initial provider response
   * (G3, sender: provider, sourced from an InquiryCard) and the counter
   * flow (G4, sender: either side, sourced from an existing ProposalCard).
   * Side effects:
   *  - Posts a new `booking_proposal` ChatMessage.
   *  - If responding to an InquiryCard: flips that inquiry's status to
   *    `"responded"`.
   *  - If countering a previous proposal: flips that proposal's status to
   *    `"countered"`.
   */
  function handleSendProposal(proposal: BookingProposal) {
    const proposalMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      sender: myRole,
      type: "booking_proposal",
      proposal,
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(conv.id, proposalMsg);
    setLocalMessages((prev) => [...prev, proposalMsg]);

    if (respondingToInquiryId) {
      updateInquiryStatus(conv.id, respondingToInquiryId, "responded");
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === respondingToInquiryId && m.inquiry
            ? { ...m, inquiry: { ...m.inquiry, status: "responded" } }
            : m,
        ),
      );
    }

    if (counteringProposalId) {
      updateProposalStatus(conv.id, counteringProposalId, "countered");
      setLocalMessages((prev) =>
        prev.map((m) =>
          m.id === counteringProposalId && m.proposal
            ? { ...m, proposal: { ...m.proposal, status: "countered" } }
            : m,
        ),
      );
    }

    // Mirror proposal state to the Bookings tab — pipeline view of in-flight
    // arrangements. Counter updates the same Booking; first proposal creates
    // it. Discover & Care G5, 2026-05-02.
    upsertProposedBooking({
      conversationId: conv.id,
      ownerId: conv.ownerId,
      ownerName: conv.ownerName,
      ownerAvatarUrl: conv.ownerAvatarUrl,
      carerId: conv.providerId,
      carerName: conv.providerName,
      carerAvatarUrl: conv.providerAvatarUrl,
      type: proposal.bookingType,
      serviceType: proposal.serviceType,
      subService: proposal.subService,
      pets: proposal.pets,
      startDate: proposal.startDate,
      endDate: proposal.endDate,
      recurringSchedule: proposal.recurringSchedule,
      price: proposal.price,
      status: "proposed",
    });

    setProposalFormOpen(false);
    setRespondingToInquiryId(null);
    setCounteringProposalId(null);
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

  // ── Proposal-response actions (either side, depending on who sent) ──────

  // Accept opens signing modal (only for the receiving side)
  function handleProposalAccept(msgId: string) {
    setSigningMsgId(msgId);
  }

  // Suggest changes — open ProposalForm pre-filled with the source proposal's
  // values. On submit, post a NEW proposal and flip the old one to
  // "countered". Either side can trigger. G4, 2026-05-02.
  function handleProposalCounter(msgId: string) {
    setCounteringProposalId(msgId);
    setProposalFormOpen(true);
  }

  // Decline a proposal — flips proposal status, posts a soft auto-reply,
  // and cancels the mirrored Booking record (G5).
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
      text: "Not for me right now — happy to chat about different dates or pricing if you'd like.",
      sentAt: new Date().toISOString(),
      read: true,
    };
    addMessage(conv.id, declineMsg);
    setLocalMessages((prev) => [...prev, declineMsg]);

    // Cancel the mirrored Booking record. G5, 2026-05-02.
    const booking = getBookingByConversation(conv.id);
    if (booking && booking.status === "proposed") {
      updateStatus(booking.id, "cancelled");
    }
  }

  // Provider declines an inquiry — flips status to "declined", saves the
  // optional reason, and posts a short system message in the thread.
  // Pricing & Proposals walkthrough 2026-05-05.
  function handleInquiryDecline(msgId: string, reason: string) {
    declineInquiry(conv.id, msgId, reason);
    setLocalMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.inquiry
          ? {
              ...m,
              inquiry: {
                ...m.inquiry,
                status: "declined",
                declineReason: reason && reason.length > 0 ? reason : undefined,
              },
            }
          : m,
      ),
    );

    const declineMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: conv.id,
      sender: myRole,
      type: "text",
      text:
        reason && reason.length > 0
          ? `Inquiry declined — ${reason}`
          : "Inquiry declined.",
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

    // Booking record may already exist (mirrored at proposal-send time per
    // G5). If it does, flip its status to "upcoming"; otherwise create one
    // (handles the legacy templated-text path where no proposed booking
    // was pre-created).
    const existing = getBookingByConversation(conv.id);
    let bookingId: string;
    if (existing) {
      updateStatus(existing.id, "upcoming");
      bookingId = existing.id;
    } else {
      bookingId = createBooking({
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
    }

    // Flip proposal → accepted; updateProposalStatus stamps `signedAt`
    // on the proposal itself so the accepted-state footer can render
    // "Signed HH:MM · View booking" inline. The separate ContractCard
    // was redundant with the accepted-state proposal card and added a
    // chronicle event for an action the proposal already represents.
    // Sessions & Service Execution walkthrough, 2026-05-05.
    const signedAt = new Date().toISOString();
    updateProposalStatus(conv.id, msgId, "accepted");
    setLocalMessages((prev) =>
      prev.map((m) =>
        m.id === msgId && m.proposal
          ? { ...m, proposal: { ...m.proposal, status: "accepted", signedAt } }
          : m
      )
    );

    // Inquiry-driven trust transition: contract sign → mutual Connected.
    // The booking IS the connection request — when it's signed, both
    // parties move from Familiar (set on inquiry send) to Connected.
    // Pricing & Proposals walkthrough 2026-05-05; resolves Open Q §2.
    markConnected(conv.ownerId, conv.providerId);
    markConnected(conv.providerId, conv.ownerId);

    setSigningMsgId(null);
  }

  const groups = groupByDate(localMessages);
  const signingMsg = signingMsgId
    ? localMessages.find((m) => m.id === signingMsgId) ?? null
    : null;

  // A proposal can be responded to by whichever side didn't send it. Counter
  // flow (G4) means owners send proposals too — gate on `msg.sender !== myRole`
  // at the call site, not on perspective.

  // Carer: has a proposal already been sent in this thread?
  const hasProposal = localMessages.some((m) => m.type === "booking_proposal");
  // Has a structured InquiryCard message been sent? When yes, the CTA lives
  // ON the card and the legacy floating InquiryResponseCard is redundant.
  // Discover & Care G3, 2026-05-02.
  const hasStructuredInquiry = localMessages.some((m) => m.type === "inquiry");
  // Show InquiryResponseCard for the legacy templated-text inquiry path only
  // (pre-G2 mock data). New inquiries get their CTA on the InquiryCard itself.
  const showInquiryResponse =
    isCarerPerspective &&
    !isDirect &&
    !isNew &&
    !hasProposal &&
    !inquiryDeclined &&
    !hasStructuredInquiry;

  return (
    <div className={embedded ? "inbox-thread-embedded" : "inbox-thread-outer"}>
    <div className={`inbox-thread-shell${embedded ? " inbox-thread-shell--embedded" : ""}`}>
      {/* Header — hidden in embedded mode (profile page shows its own) */}
      {!embedded && (
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
      )}

      {/* Body. The chat is purely a thread now — InquiryForm composing
          happens in `InquiryFormModal` (entered from a service card),
          and the InquiryCard message it produces lands in this thread
          like any other message. Discover & Care 2026-05-03 refactor. */}
      <div className="inbox-thread-body" ref={bodyRef}>
        {(
          <>
            {isNew && (
              <div className="inbox-direct-empty">
                <Handshake size={32} weight="light" className="text-fg-tertiary" />
                <p className="text-fg-secondary text-base m-0">
                  {isDirect
                    ? `You're connected with ${otherParty.name}. Say hello!`
                    : `Start a conversation with ${otherParty.name}.`}
                </p>
              </div>
            )}
            {groups.map((group) => (
              <div key={group.label} className="inbox-date-group">
                <div className="inbox-date-sep">
                  <span className="inbox-date-sep-label">{group.label}</span>
                </div>
                {group.messages.map((msg) => {
                  if (msg.type === "inquiry" && msg.inquiry) {
                    const isProviderViewer = isCarerPerspective;
                    return (
                      <div
                        key={msg.id}
                        className="inbox-message-wrap inbox-message-wrap--full"
                      >
                        <InquiryCard
                          inquiry={msg.inquiry}
                          ownerName={conv.ownerName}
                          providerId={conv.providerId}
                          notes={msg.inquiry.notes}
                          variant={isProviderViewer ? "provider" : "owner"}
                          onSendProposal={
                            isProviderViewer && msg.inquiry.status === "pending"
                              ? () => {
                                  setRespondingToInquiryId(msg.id);
                                  setProposalFormOpen(true);
                                }
                              : undefined
                          }
                          onDecline={
                            isProviderViewer && msg.inquiry.status === "pending"
                              ? (reason: string) => handleInquiryDecline(msg.id, reason)
                              : undefined
                          }
                        />
                        <span className="inbox-message-time">{formatTime(msg.sentAt)}</span>
                      </div>
                    );
                  }
                  if (msg.type === "booking_proposal") {
                    const linkedBooking = getBookingByConversation(conv.id);
                    return (
                      <div
                        key={msg.id}
                        className="inbox-message-wrap inbox-message-wrap--full"
                      >
                        <BookingProposalCard
                          msg={msg}
                          canRespond={msg.sender !== myRole}
                          onAccept={handleProposalAccept}
                          onDecline={handleProposalDecline}
                          onCounter={handleProposalCounter}
                          bookingHref={
                            linkedBooking ? `/bookings/${linkedBooking.id}` : undefined
                          }
                        />
                        <span className="inbox-message-time">{formatTime(msg.sentAt)}</span>
                      </div>
                    );
                  }
                  if (msg.type === "contract") {
                    // Contract messages are no longer rendered in the
                    // stream — the accepted proposal card carries the
                    // signing signal + inline timestamp. Legacy contract
                    // messages on seeded conversations are silently
                    // skipped. Sessions & Service Execution, 2026-05-05.
                    return null;
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

      {/* Proposal form modal. Three entry points:
          1. Provider taps "Send proposal" on an InquiryCard (G3) — sources
             from that inquiry, auto-calculates price.
          2. Either side taps "Suggest changes" on a ProposalCard (G4) —
             pre-fills with the source proposal's values; on submit the source
             flips to "countered".
          3. Legacy InquiryResponseCard (pre-G2 templated text) — falls back
             to conv.inquiry. */}
      <ProposalForm
        conv={conv}
        open={proposalFormOpen}
        onClose={() => {
          setProposalFormOpen(false);
          setRespondingToInquiryId(null);
          setCounteringProposalId(null);
        }}
        onSubmit={handleSendProposal}
        inquiry={(() => {
          if (counteringProposalId) {
            // Counter flow: derive an InquiryDetails-shaped object from the
            // proposal so the form's summary line reads correctly.
            const sourceMsg = localMessages.find((m) => m.id === counteringProposalId);
            const p = sourceMsg?.proposal;
            if (!p) return undefined;
            return {
              bookingType: p.bookingType,
              serviceType: p.serviceType,
              subService: p.subService,
              pets: p.pets,
              startDate: p.startDate,
              endDate: p.endDate,
              recurringSchedule: p.recurringSchedule,
              status: "pending" as const,
            };
          }
          if (respondingToInquiryId) {
            return localMessages.find((m) => m.id === respondingToInquiryId)?.inquiry;
          }
          return undefined;
        })()}
        initialPrice={
          counteringProposalId
            ? localMessages.find((m) => m.id === counteringProposalId)?.proposal?.price
            : undefined
        }
      />
    </div>
    </div>
  );
}
