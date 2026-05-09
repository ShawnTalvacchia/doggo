import type { ChatMessage, Conversation } from "@/lib/types";

/** The message that drives a conversation's inbox preview row + unread
 *  state. Prefers the explicit `lastMessageId` pointer when set, falls
 *  back to the last message in the array. Falls back even when the
 *  pointer is empty so newly-added inquiries (which sometimes don't
 *  update the pointer immediately) sort correctly in the inbox.
 *  Mirrors the helper that previously lived inline in `app/inbox/page.tsx`
 *  and was duplicated by mobile-nav / sidebar inbox-badge counts that
 *  used the (owner-centric) `unreadCount` field instead and consequently
 *  diverged from the inbox's own dot rendering. */
export function getLastMessage(conv: Conversation): ChatMessage | null {
  if (conv.messages.length === 0) return null;
  if (conv.lastMessageId) {
    const found = conv.messages.find((m) => m.id === conv.lastMessageId);
    if (found) return found;
  }
  return conv.messages.at(-1) ?? null;
}

/** True when the conversation carries a viewer-perceived unread —
 *  i.e. the most recent message is from the OTHER party in this thread.
 *  Used by both the inbox row's unread dot AND the inbox-badge counts
 *  on the mobile AppNav + desktop Sidebar so all three signals agree.
 *
 *  The previous nav-badge formula (`c.unreadCount > 0`) read from the
 *  owner-centric counter (`addMessage` only increments it for
 *  `sender: "provider"`), which mis-flagged provider-side viewers'
 *  threads — Klára seeing inbox dots that the badge ignored, etc.
 *  Direction-of-last-message is the right semantic for "this thread
 *  needs my reply." */
export function isConversationUnread(
  conv: Conversation,
  viewerId: string,
): boolean {
  const isParticipant =
    conv.providerId === viewerId || conv.ownerId === viewerId;
  if (!isParticipant) return false;
  const lastMsg = getLastMessage(conv);
  if (!lastMsg) return false;
  return (
    (viewerId === conv.ownerId && lastMsg.sender === "provider") ||
    (viewerId === conv.providerId && lastMsg.sender === "owner")
  );
}

/** Count of conversations with viewer-perceived unread. Drives the
 *  inbox-bubble badges on AppNav (mobile) + Sidebar (desktop). */
export function countUnreadConversations(
  conversations: Conversation[],
  viewerId: string,
): number {
  return conversations.filter((c) => isConversationUnread(c, viewerId)).length;
}
