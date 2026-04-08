---
category: feature
status: built
last-reviewed: 2026-04-08T19:00
tags: [messaging, inbox, chat, booking]
review-trigger: "when modifying inbox, threads, or conversation types"
---

# Messaging

Direct messages, booking conversations, and meet coordination chat.

---

## Overview

Messaging is the coordination layer for both community and care. The core philosophy is "message first, book when ready" — chat is the primary trust-building mechanism, not a form submission.

**Three messaging surfaces, each with a clear purpose:**

| Surface | Purpose | Where it lives |
|---------|---------|---------------|
| **Inbox** | Private 1:1 conversations (direct + booking) | `/inbox` — top-level page |
| **Feed comments** | Async group discussion on posts | Group detail → Feed tab (built — flat comments with local-state add) |
| **Meet chat** | Real-time event coordination | Meet detail → Chat tab |

---

## Inbox

### Conversation types

The Inbox contains two conversation types sharing one UI:

| Type | Purpose | Entry point | UI differences |
|------|---------|-------------|----------------|
| **Direct** | 1:1 chat between Connected users | Profile → "Message" CTA | No inquiry form, "Connected" badge |
| **Booking** | Care arrangement discussion | Provider profile → "Contact" / "Book care" | Inquiry form, service chip, booking proposal cards |

**Architecture note:** `ConversationType` in types.ts is `"booking" | "direct"`. Group messages use a separate `GroupMessage` interface — they are NOT instances of `Conversation`. The Inbox "Groups" filter tab surfaces group threads but they're stored/accessed differently.

### Inbox layout

Tab-based filtering: **All** · **Care** · **Groups**

**Desktop:** Three-column via MasterDetailShell — conversation list (left), active thread (center), contact info panel (right).

**Mobile:** Conversation list → tap → thread detail with back button.

### Booking proposal flow

In a booking conversation, one party proposes terms → `BookingProposalCard` appears in thread (dates, price, dog, service) → other party: Accept / Counter / Decline → accepted creates a booking in Schedule.

---

## Meet Chat

Event-scoped coordination thread on the meet detail page (Chat tab). Time-bound and focused — "running late", "on my way", "great walk today!"

- Requires RSVP to see and send messages
- Uses `MeetMessage` type (separate from `Conversation` and `GroupMessage`)
- Stored in `mockMeetMessages.ts`

---

## Feed Comments (Planned)

Group feed posts will have flat comments for async discussion. This replaces the previous group Chat tab. Not yet built — currently Feed posts have no comment UI.

---

## Key Decisions

1. **"Message first, book when ready"** — booking proposals happen inline in conversation, not through a separate form.
2. **Contact requires Connected status** — direct messaging only between Connected users. Core trust/safety gate.
3. **No group Chat tab.** Three surfaces (Inbox, Feed comments, Meet chat) cover all use cases without overlap.
4. **Architecture: mock now, Supabase later** — local state and mock data, designed for Supabase Realtime swap.

---

## Not Yet Built

- **Feed comments** — flat comments on group feed posts (replaces group Chat tab)
- **Message requests** — for Open/Familiar contacts not yet Connected
- **Read receipts / typing indicators**
- **Media sharing** in conversations
- **Notification strategy** for messages

---

## Related Docs

- [[connections]] — contact gates based on connection state
- [[explore-and-care]] — booking conversation entry from provider profiles
- [[meets]] — meet chat, group feed
