"use client";

import { Handshake } from "@phosphor-icons/react";
import { useConversations } from "@/contexts/ConversationsContext";
import { ThreadClient } from "@/app/inbox/[conversationId]/ThreadClient";

/**
 * Renders the chat thread for a user inside the profile Chat tab.
 * Looks up the conversation by userId; shows a conversation-starter
 * empty state if none exists yet, then creates one on first message.
 */
export function ProfileChatTab({
  userId,
  userName,
  avatarUrl,
}: {
  userId: string;
  userName: string;
  avatarUrl: string;
}) {
  const { getConversationForUser, getOrCreateDirectConversation } =
    useConversations();

  const conv = getConversationForUser(userId);

  // If a conversation already exists, render the thread in embedded mode
  if (conv) {
    return (
      <div className="profile-chat-tab">
        <ThreadClient conv={conv} embedded />
      </div>
    );
  }

  // No conversation yet — show a starter prompt, create on tap
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
    <div className="flex flex-col items-center justify-center gap-md flex-1 px-lg text-center">
      <Handshake size={36} weight="light" className="text-fg-tertiary" />
      <p className="text-md text-fg-secondary m-0">
        You&apos;re connected with {firstName}
      </p>
      <p className="text-sm text-fg-tertiary m-0">
        Start a conversation to plan meets, discuss care, or just say hi.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-sm px-lg py-sm rounded-pill font-semibold text-sm"
        style={{ background: "var(--brand-main)", color: "var(--on-brand)" }}
      >
        Say hello to {firstName}
      </button>
    </div>
  );
}
