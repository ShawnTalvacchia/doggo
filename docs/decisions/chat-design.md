---
category: decisions
status: active
last-reviewed: 2026-03-16
tags: [chat, inbox, messaging, booking, design]
review-trigger: "when touching inbox, messaging, or booking flows"
---

# Chat & Messaging Design Decisions

Extracted from Board.md (March 2026). This captures the design thinking behind the messaging system.

---

## Core philosophy

The product identity is **"message first, book when ready"** — chat is not a support channel, it's the primary trust-building and coordination mechanism. It needs to feel like a real messaging app, not a contact form.

---

## Current state (March 2026)

**Built (mock/local-state):**
- `Conversation`, `ChatMessage`, `BookingProposal` types in `lib/types.ts`
- `lib/mockConversations.ts` — 3 realistic conversations
- `/inbox` — conversation list with avatar, unread dot, service chip, last message preview
- `/inbox/[conversationId]` — full-height thread with inquiry card, date-grouped bubbles, booking proposal card
- Send is local-state only (no persistence — intentional until Supabase auth)

---

## Architecture decision: Hybrid approach (Option C)

Evaluated three options:
- **A — Mock only** — pre-seeded conversations, local-state send. Good for demos.
- **B — Supabase-backed** — real tables, Realtime. Requires auth first.
- **C — Hybrid (chosen)** — realistic UI with mock data, local-state send, schema designed to swap in Supabase Realtime later without rebuilding the UI.

---

## Conversation initiation — light structure

When an owner taps Contact, a 2-step sheet:

1. **Context step** — service type (pre-selected from navigation context) + rough dates + their dog's name (pre-filled if profile exists)
2. **Message step** — editable pre-filled message using the context above

This creates a richer "inquiry card" at the top of the conversation (like Airbnb's booking request summary), which gives the sitter everything they need to respond.

---

## Booking agreement — lightweight in-chat card

Product principle: **no pressure, direct arrangement**. But both parties benefit from a confirmation mechanism.

- Either party can tap "Propose dates" inside a conversation
- Inserts a structured card: service + dates + price + dog
- Other party can "Accept", "Counter", or "Decline" inline
- On Accept: conversation status → "Confirmed" + entry in `/calendar`
- No payment processed, no platform fees — just a confirmed shared record

This keeps it feeling like a direct human agreement, not a platform-mediated transaction.

---

## Surface connections

| Surface | Connection |
|---------|-----------|
| Provider profile → Contact | Opens ConversationStartSheet → lands in `/inbox/[id]` |
| Explore cards → quick contact | Same flow |
| BottomNav Inbox tab | `/inbox` (conversation list) |
| Calendar | Each booking entry links back to its conversation thread |
| Notifications (future) | New message or booking proposal badge on Inbox tab |
