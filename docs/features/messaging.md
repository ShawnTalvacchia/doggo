---
category: feature
status: built
last-reviewed: 2026-03-17
tags: [messaging, inbox, chat, booking]
review-trigger: "when modifying inbox, threads, or conversation types"
---

# Messaging

All conversation types — direct messages between connected users, booking conversations for care arrangements, and group threads for meet coordination.

---

## Overview

Messaging is the coordination layer for both community and care. The inbox contains three conversation types, each serving a different purpose but sharing the same UI patterns. The core philosophy is "message first, book when ready" — chat is the primary trust-building mechanism, not a form submission.

---

## Current State

- **Pages:** `/inbox` (conversation list), `/inbox/[conversationId]` (thread view)
- **Components:** ConversationRow, InquiryForm, InquiryChips, BookingProposalCard, compose bar
- **Data:** `lib/mockConversations.ts` — mock conversations with `conversationType` discriminator
- **Status:** Built — direct messages, booking conversations, and conversation list with section headers

### Conversation types

| Type | Purpose | Entry point | UI differences |
|------|---------|-------------|----------------|
| **Direct** | 1:1 chat between Connected users | Profile → "Message" CTA | No inquiry form, "Connected" badge, Handshake icon |
| **Booking** | Care arrangement discussion | Provider profile → "Contact" / "Book care" | Inquiry form, service chip, booking proposal cards |
| **Group** | Meet coordination thread | Meet detail page → group chat | Contextual to the meet (built as part of meets feature) |

### Inbox layout

The inbox list is split into two sections:
- **Messages** — direct conversations (Handshake icon, "Direct message" chip)
- **Booking inquiries** — care-related conversations (service chip, status indicators)

Both sections sorted by most recent message.

---

## Key Decisions

1. **"Message first, book when ready"** — chat is primary. Booking proposals happen inline in conversation, not through a separate booking form.

2. **Two conversation types share one UI** — direct and booking conversations use the same thread component with minor differences (badges, chips, inquiry form presence). This keeps the codebase simple.

3. **Contact requires Connected status** — direct messaging is only available between Connected users. This is a core trust/safety gate. See [[Trust & Connection Model]].

4. **Booking proposals are in-chat cards** — dates, price, dog details displayed as a card in the conversation. Accept/Counter/Decline inline. No separate booking management page needed for the initial flow.

5. **Architecture: mock now, Supabase later** — current implementation uses local state and mock data, designed to swap in Supabase Realtime without rebuilding the UI layer. See `docs/decisions/chat-design.md`.

---

## User Flows

### Start a direct message

```
View Connected user's profile → "Message [name]" CTA
→ Opens thread (or creates new if first message)
→ Compose and send → appears in Inbox under "Messages"
```

### Start a booking conversation

```
Provider profile → "Contact [name]" or "Book care"
→ Light 2-step sheet: context (service, dates) + message
→ Thread created with pre-filled inquiry card
→ Appears in Inbox under "Booking inquiries"
```

### Booking proposal flow

```
In a booking conversation → one party proposes terms
→ BookingProposalCard appears in thread (dates, price, dog, service)
→ Other party: Accept / Counter / Decline
→ Accepted → booking created, appears in Schedule
```

---

## Future

- **Message requests** — for Open/Familiar contacts who aren't yet Connected, a request flow where the recipient can accept or ignore before a thread opens
- **Read receipts / typing indicators** — lightweight presence signals
- **Meet group threads** — already built as part of meets, but could be better integrated into inbox
- **Notification strategy** — what triggers push notifications for messages vs. quiet delivery
- **Media sharing** — photos in conversations (especially useful post-meet)

---

## Related Docs

- [[connections]] — contact gates based on connection state
- [[explore-and-care]] — booking conversation entry from provider profiles
- [[meets]] — group threads for meet coordination
- `docs/decisions/chat-design.md` — architecture decisions and Supabase migration plan
