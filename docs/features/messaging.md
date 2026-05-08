---
category: feature
status: built
last-reviewed: 2026-05-08
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
- Name, with dog name(s) inline next to it (PawPrint icon + dog name(s)). Booking conversations also append the service name (e.g. `🐾 Bára · Reactive dog session`); direct/social rows show the dog only.
- Last message preview or "Start chatting" for empty conversations
- Relative timestamp
- Tapping navigates to `/profile/[userId]?tab=chat`

### Row sources

1. Users from existing conversations (via ConversationsContext) — **filtered to threads where the current persona is provider OR owner**, so each persona only sees their own conversations.
2. Connected users without conversations yet (via `getConnectionsByState("connected")`)

Sorted: unread first, then by most recent message.

### Route redirects

`/inbox/[conversationId]` → redirects to `/profile/[userId]?tab=chat` by resolving the conversation's other party. Falls back to `/inbox` if not found.

---

## Booking Conversation Flow

Booking proposals happen inline in chat. The full lifecycle:

```
Provider profile → "Book care" CTA → InquiryFormModal (service, dates, dogs)
                                     ↳ live engine estimate above Send
→ InquiryCard posts in thread (artifact + persistent estimate, both sides)
→ Provider: Decline (with optional reason) OR Respond with proposal
→ ProposalForm opens with read-only System quote
                  ↳ "Adjust this quote" → editable, override flagged + reason
→ BookingProposalCard appears in thread (header + body rows + line items + total)
                       ↳ Custom-quote callout in body when isOverride
→ Owner: Not now / Suggest changes (counter) / Review & sign
→ Sign → ContractCard + booking flips proposed → upcoming
→ Both sides become mutually Connected
```

**Cards collapse on response.** Once an InquiryCard is responded/declined and once a BookingProposalCard is countered/declined/accepted, the body collapses to header + service line. The footer carries the truth — for accepted proposals the footer is a link to the live booking record. Decline reason callouts persist through the collapse since they're the substance of the declined state.

### Booking message components

| Component | Purpose | Styling |
|-----------|---------|---------|
| `InquiryCard` | Structured inquiry artifact (replaces templated text). Renders engine estimate + provider Decline/Respond actions when pending. Collapses post-response. | `inbox-message-wrap--full`, surface-top bg, radius-panel |
| `BookingProposalCard` | Proposal display. Three-action footer when pending (Not now / Suggest changes / Review & sign). Body collapses post-response; footer flips to status text or "View booking →" link. | 100% width, surface-top bg, radius-panel |
| `ContractCard` | Signed contract confirmation. Links to `/bookings/{bookingId}` | — |
| `PaymentCard` | Payment summary | Standard card styling |
| `SigningModal` | Proposal acceptance flow | Modal overlay |
| `ProposalForm` | Provider creates proposal. Default read-only System quote; "Adjust this quote" reveals editable mode with deviation flagging and override-reason capture. | Form modal |
| `InquiryForm` | Owner builds inquiry. Live engine estimate appears above Send once form is sendable. | Form modal |

### No-bargaining principle

The auto-pricing engine (`computeQuote(config, inquiry, today)` in `lib/pricing.ts`) is the canonical source of truth for proposal prices. Engine output is visible at three surfaces so both parties see the same number through the lifecycle:

1. **InquiryForm** — live estimate updates as the owner fills in fields
2. **InquiryCard** — same estimate persists on the chat artifact, both sides
3. **ProposalForm "System quote"** — what the provider reviews + sends

Override is available but visibly flagged. Provider cannot silently undercut or inflate — the system shows what the configured pricing produces, and any deviation surfaces as a "Custom quote" callout on the owner's BookingProposalCard with the optional reason inline.

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

- **NotificationsPanel** — dropdown from bell icon in nav (desktop). Shows recent notifications with type-specific overlay icons on avatars. Unread indicator: dot on the right edge.
- **Notifications page** — `/notifications`. Full page with mark-all-read, grouped rendering. Sessions & Service Execution refresh (2026-05-08): unread indicator moved from a left-side dot column to a corner pip on the avatar (`.notif-unread-badge` — brand-tinted, surface-bordered so it overlaps the edge). Category label moved from a third body line to a small uppercase letter-spaced tag on the top row, paired with the timestamp via `·`. Pattern: `{title}                              CARE · 7d ago` / `{body line}`.

### Visit-report indicator

Owner-side `/bookings` cards surface a "New visit report from {carer} · {date} →" strip when there's a completed session with a sealed report newer than the viewer's last Sessions-tab visit. Tapping the card routes straight to `?tab=sessions` (skipping Info). After viewing, navigate elsewhere and return — the indicator is gone.

**Recency window (Sessions & Service Execution, 2026-05-08):** the indicator only fires for reports sealed within the last 5 days. Older completed reports stop counting as "new" even if unviewed — the framing implies "fresh from a recent session," not "this booking has had reports at some point." Pre-seeded mock reports (kd-5 dated `daysAgo(7)`) sit safely outside the window so a fresh demo state doesn't false-trigger. Implemented in `findNewReport` in `components/ui/BookingRow.tsx`.

---

## Key Decisions

1. **Chat lives on profiles** — conversations are accessed via `/profile/[userId]?tab=chat`, not standalone thread pages. The inbox is a connections list that links there.
2. **One conversation per user pair** — no separate direct/booking threads. Booking proposals inline with casual messages.
3. **"Message first, book when ready"** — booking proposals happen inline in conversation, not through a separate form.
4. **Contact requires Connected status** — direct messaging only between Connected users. Core trust/safety gate.
5. **No group Chat tab.** Three surfaces (Profile Chat, Feed comments, Meet chat) cover all use cases without overlap.
6. **Architecture: mock now, Supabase later** — local state and mock data, designed for Supabase Realtime swap.
7. **Auto-priced proposals (Pricing & Proposals, 2026-05-05).** Provider configures pricing once; engine produces the quote; provider reviews and sends. Override stays available but is visibly flagged on the owner's card. See "No-bargaining principle" above.
8. **Inquiry decline path (Pricing & Proposals).** Inquiries can be declined inline with an optional reason. Counter-suggestion at the inquiry stage was deliberately skipped — negotiation happens at the proposal stage via "Suggest changes."

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
