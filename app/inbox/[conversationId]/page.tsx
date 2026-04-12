"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConversations } from "@/contexts/ConversationsContext";

const MY_USER_ID = "shawn";

interface Props {
  params: Promise<{ conversationId: string }>;
}

/**
 * Legacy route: redirects /inbox/[conversationId] to the profile chat tab.
 * Chat now lives on user profiles at /profile/[userId]?tab=chat.
 */
export default function ThreadRedirectPage({ params }: Props) {
  const { conversationId } = use(params);
  const router = useRouter();
  const { getConversation } = useConversations();
  const conversation = getConversation(conversationId);

  useEffect(() => {
    if (!conversation) {
      router.replace("/inbox");
      return;
    }
    // Determine the other party's userId
    const otherUserId =
      conversation.ownerId === MY_USER_ID
        ? conversation.providerId
        : conversation.ownerId;
    router.replace(`/profile/${otherUserId}?tab=chat`);
  }, [conversation, router]);

  return null;
}
