---
category: feature
status: built
last-reviewed: 2026-04-13
tags: [messaging, inbox, chat, booking, notifications]
review-trigger: "when modifying inbox, threads, conversation types, or notifications"
---

# Messaging

Direct messages, booking conversations, and meet coordination chat.

---

## Overview

Messaging is the coordination layer for both community and care. The core philosophy is "message first, book when ready" — chat is the primary trust-building mechanism, not a form submission.

**Three messaging surfaces, each with a clear purpose:**

| Surface | Purpose | Where it lives |
|---------|---------|---------------|
| **Profile Chat tab** | Private 1:1 conversations (direct + booking) | `/profile/[userId]?tab=chat` — embedded in profile page |
| **Feed comments** | Async group discussion on posts | Group detail → Feed tab (built — flat comments with local-state add, replaces group Chat tab) |
| **Meet chat** | Real-time event coordination | Meet detail → Chat tab |

---

## Chat on Profiles

Chat lives on user profile pages as a tab, not in a standalone thread page. Profiles are the relationship hub — About, Posts, Services, Chat.

### Architecture

- **One conversation per user pair.** No separate direct/booking conversations. Booking proposals live inline with casual messages.
- **Chat tab on profiles** — conditional on connected state or existing conversation. Uses `getConversationForUser(userId)` from ConversationsContext.
- **ProfileChatTab component** — renders ThreadClient in `embedded` mode (hides header, flex layout) or shows a conversation-starter empty state.
- **Embedded ThreadClient** — `embedded` prop hides the thread header, uses `inbox-thread-embedded` CSS for flex layout within the profile tab.
- **No chat on own profile.**

### Key components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ProfileChatTab` | `components/profile/ProfileChatTab.tsx` | Wrapper that resolves conversation and renders embedded thread or starter |
| `ThreadClient` | `app/inbox/[conversationId]/ThreadClient.tsx` | Full thread renderer — messages, composer, booking cards. `embedded` prop for profile use |
| `ConversationStarter` | Inside ProfileChatTab | Empty state with "Say hello" button when no messages exist |

---

## Inbox

The inbox is a **connections list**, not a thread list. It shows all users you can message (conversations + connected users without messages yet).

### Layout

**Route:** `/inbox`

**Desktop:** PageColumn with inline search bar at top.

**Mobile:** PageColumn with mobile nav-header search. Tap search icon → header transforms into full-width search input. Back button cancels search.

### Inbox rows

Each row represents a user, not a conversation:
- Avatar with unread dot
- Name, dog names (PawPrint icon)
- Last message preview or "Start chatting" for empty conversations
- Relative timestamp
- Tapping navigates to `/profile/[userId]?tab=chat`

### Row sources

1. Users from existing conversations (via ConversationsContext)
2. Connected users without conversations yet (via `getConnectionsByState("connected")`)

Sorted: unread first, then by most recent message.

### Route redirects

`/inbox/[conversationId]` → redirects to `/profile/[userId]?tab=chat` by resolving the conversation's other party. Falls back to `/inbox` if not found.

---

## Booking Conversation Flow

Booking proposals happen inline in chat. The full lifecycle:

```
Provider profile → "Book care" CTA → ?tab=chat
→ InquiryForm (service, dates, dogs)
→ Provider sees InquiryResponseCard (Send proposal / Decline / Suggest changes)
→ BookingProposalCard appears in thread (dates, price, service)
→ Owner: Accept → SigningModal → ContractCard
→ PaymentCard (summary)
```

### Booking message components

| Component | Purpose | Styling |
|-----------|---------|---------|
| `InquiryResponseCard` | Provider actions on new inquiry | Tailwind utilities, max-w-md, rounded-panel |
| `BookingProposalCard` | Proposal display with accept/decline | 100% width, max-width 320px, surface-top bg, radius-panel |
| `ContractCard` | Signed contract confirmation | Links to `/bookings/{bookingId}` |
| `PaymentCard` | Payment summary | Standard card styling |
| `SigningModal` | Proposal acceptance flow | Modal overlay |
| `ProposalForm` | Provider creates proposal | Form with service/price/schedule fields |

---

## Meet Chat

Event-scoped coordination thread on the meet detail page (Chat tab). Time-bound and focused — "running late", "on my way", "great walk today!"

- Requires RSVP to see and send messages
- Uses `MeetMessage` type (separate from `Conversation` and `GroupMessage`)
- Stored in `mockMeetMessages.ts`

---

## Feed Comments (Built)

Group feed posts have flat comments for async discussion. This replaces the previous group Chat tab. Comments are local-state with an add-comment UI. Built during Content Completion phase.

---

## Notifications

### Types

13 notification types, each with distinct icon, label, and action:

| Type | Icon | Label | Example action |
|------|------|-------|---------------|
| `meet_invite` | CalendarBlank | Meet | → `/meets/[meetId]` |
| `meet_reminder` | CalendarBlank | Meet | → `/meets/[meetId]` |
| `meet_rsvp` | UserPlus | Meet | → `/meets/[meetId]` |
| `connection_request` | Handshake | Connection | → `/profile/[userId]` |
| `connection_accepted` | HandsClapping | Connection | → `/profile/[userId]` |
| `group_activity` | UsersThree | Group | → `/communities/[groupId]` |
| `booking_proposal` | Briefcase | Booking | → `/profile/[userId]?tab=chat` |
| `booking_confirmed` | CheckCircle | Booking | → `/bookings/[bookingId]` |
| `booking_message` | EnvelopeSimple | Message | → `/profile/[userId]?tab=chat` |
| `new_message` | EnvelopeSimple | Message | → `/profile/[userId]?tab=chat` |
| `session_completed` | CheckCircle | Care | → `/bookings/[bookingId]` |
| `care_review` | Star | Review | → `/profile` |
| `post_comment` | ChatCircle | Comment | → `/communities/[groupId]` |

### Notification grouping

Same-type + same-href notifications cluster into groups with stacked avatars. Groupable types: `meet_rsvp`, `group_activity`. Groups show summary titles like "3 people are going to your meet".

### Surfaces

- **NotificationsPanel** — dropdown from bell icon in nav (desktop). Shows recent notifications with type-specific overlay icons on avatars.
- **Notifications page** — `/notifications`. Full page with mark-all-read, grouped rendering.

---

## Key Decisions

1. **Chat lives on profiles** — conversations are accessed via `/profile/[userId]?tab=chat`, not standalone thread pages. The inbox is a connections list that links there.
2. **One conversation per user pair** — no separate direct/booking threads. Booking proposals inline with casual messages.
3. **"Message first, book when ready"** — booking proposals happen inline in conversation, not through a separate form.
4. **Contact requires Connected status** — direct messaging only between Connected users. Core trust/safety gate.
5. **No group Chat tab.** Three surfaces (Profile Chat, Feed comments, Meet chat) cover all use cases without overlap.
6. **Architecture: mock now, Supabase later** — local state and mock data, designed for Supabase Realtime swap.

---

## Not Yet Built

- **Message requests** — for Open/Familiar contacts not yet Connected
- **Read receipts / typing indicators**
- **Media sharing** in conversations
- **Push notifications**

---

## Related Docs

- [[connections]] — contact gates based on connection state
- [[profiles]] — Chat tab on profiles, connection-gated CTAs
- [[explore-and-care]] — booking conversation entry from provider profiles
- [[meets]] — meet chat, group feed
