"use client";

import { useEffect } from "react";
import { Handshake } from "@phosphor-icons/react";
import { useConversations } from "@/contexts/ConversationsContext";
import { ThreadClient } from "@/app/inbox/[conversationId]/ThreadClient";
import { ButtonAction } from "@/components/ui/ButtonAction";

/**
 * Renders the chat thread for a user inside the profile Chat tab.
 * Looks up the conversation by userId; shows a conversation-starter
 * empty state if none exists yet, then creates one on first message.
 *
 * Service-context inquiries (Care + Meet) enter via `InquiryFormModal`
 * from a service card "Book a session" CTA — the modal posts the
 * InquiryCard to this thread on submit. Appointment-card inquiries
 * pass an `initialDraft` prop instead: the conv is auto-created and the
 * input pre-filled with a templated opener that the owner can edit or
 * send as-is. Skips the "Say hello" gate when intent is clear.
 * Discover & Care 2026-05-04 refactor.
 */
export function ProfileChatTab({
  userId,
  userName,
  avatarUrl,
  initialDraft,
}: {
  userId: string;
  userName: string;
  avatarUrl: string;
  /** When set (e.g. from an appointment-card CTA), auto-creates the
   *  direct conv on mount and pre-fills the message input with this text. */
  initialDraft?: string;
}) {
  const { getConversationForUser, getOrCreateDirectConversation } =
    useConversations();

  const conv = getConversationForUser(userId);

  // Auto-create the direct conv when arriving with a pre-filled draft —
  // the owner already has intent, no point gating with "Say hello."
  useEffect(() => {
    if (initialDraft && !conv) {
      getOrCreateDirectConversation({ id: userId, name: userName, avatarUrl });
    }
  }, [initialDraft, conv, userId, userName, avatarUrl, getOrCreateDirectConversation]);

  // If a conversation already exists, render the thread in embedded mode
  if (conv) {
    return (
      <div className="profile-chat-tab">
        <ThreadClient conv={conv} embedded initialDraft={initialDraft} />
      </div>
    );
  }

  // No conversation yet — show a starter prompt, create on tap.
  // Suppressed when initialDraft is set (the useEffect above is creating
  // the conv; this render is a transient between mount and re-render).
  if (initialDraft) return <div className="profile-chat-tab" />;
  return (
    <div className="profile-chat-tab">
      <ConversationStarter
        userId={userId}
        userName={userName}
        avatarUrl={avatarUrl}
        onCreate={() => {
          getOrCreateDirectConversation({ id: userId, name: userName, avatarUrl });
        }}
      />
    </div>
  );
}

function ConversationStarter({
  userName,
  onCreate,
}: {
  userId: string;
  userName: string;
  avatarUrl: string;
  onCreate: () => void;
}) {
  const firstName = userName.split(" ")[0];

  return (
    <div className="flex flex-col items-center gap-md px-lg pt-5xl pb-xl text-center">
      <Handshake size={36} weight="light" className="text-fg-tertiary" />
      <p className="text-md text-fg-secondary m-0">
        You&apos;re connected with {firstName}
      </p>
      <p className="text-sm text-fg-tertiary m-0">
        Start a conversation to plan meets, discuss care, or just say hi.
      </p>
      <ButtonAction variant="primary" size="sm" cta onClick={onCreate} className="mt-sm">
        Say hello to {firstName}
      </ButtonAction>
    </div>
  );
}
