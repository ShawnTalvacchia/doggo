---
category: feature
status: built
last-reviewed: 2026-06-08
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

Sorted: pure recency descending (most recent activity first). Inbox & Notifications, 2026-05-08 — was previously "unread first, then recency," which pinned 85-day-old unread threads above 2-day-old active ones and read as broken. Same shape as iMessage / Slack: ordering is recency, the unread dot remains as the visual cue.

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
→ Sign → BookingProposalCard footer flips to "Signed HH:MM · View booking →" + booking flips proposed → upcoming
→ Both sides become mutually Connected
```

**Cards collapse on response.** Once an InquiryCard is responded/declined and once a BookingProposalCard is countered/declined/accepted, the body collapses to header + service line. The footer carries the truth — for accepted proposals the footer is a link to the live booking record. Decline reason callouts persist through the collapse since they're the substance of the declined state.

### Booking message components

| Component | Purpose | Styling |
|-----------|---------|---------|
| `InquiryCard` | Structured inquiry artifact (replaces templated text). Renders engine estimate + provider Decline/Respond actions when pending. Collapses post-response. | `inbox-message-wrap--full`, surface-top bg, radius-panel |
| `BookingProposalCard` | Proposal display. Three-action footer when pending (Not now / Suggest changes / Review & sign). Body collapses post-response; footer flips to status text or "View booking →" link. Accepted proposals carry an inline `Signed HH:MM · View booking →` footer link — the contract confirmation lives on the proposal card itself, not a separate artifact. | 100% width, surface-top bg, radius-panel |
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

15 notification types, each with distinct icon, label, and action:

| Type | Icon | Label | Example action |
|------|------|-------|---------------|
| `meet_invite` | CalendarBlank | Meet | → `/meets/[meetId]` |
| `meet_reminder` | CalendarBlank | Meet | → `/meets/[meetId]` |
| `meet_rsvp` | UserPlus | Meet | → `/meets/[meetId]` |
| `connection_request` | Handshake | Connection | Inline **Accept** / **Decline** |
| `connection_accepted` | HandsClapping | Connection | → `/profile/[userId]` |
| `group_invite` | UsersThree | Group | → `/communities/[groupId]` |
| `group_activity` | UsersThree | Group | → `/communities/[groupId]` |
| `booking_proposal` | Briefcase | Booking | → `/profile/[userId]?tab=chat` |
| `booking_confirmed` | CheckCircle | Booking | → `/bookings/[bookingId]` |
| `booking_message` | EnvelopeSimple | Message | → `/profile/[userId]?tab=chat` |
| `new_message` | EnvelopeSimple | Message | → `/profile/[userId]?tab=chat` |
| `session_started` | PlayCircle | Care | → `/bookings/[bookingId]?tab=sessions` |
| `session_completed` | CheckCircle | Care | → `/bookings/[bookingId]?tab=sessions` |
| `care_review` | Star | Review | → `/profile` |
| `post_comment` | ChatCircle | Comment | → `/communities/[groupId]` |

### Connection requests — inline accept

`connection_request` notification rows host inline **Accept** / **Decline** buttons rather than navigating to a profile (there's no accept affordance on a profile — a `pending` connection renders there as a disabled "Request sent"). **Accept** calls `markConnected` in both directions via `ConnectionsContext` (mutual Connected) and the row resolves to a "Connected" confirmation; **Decline** resolves the row quietly with no connection change. The row reads its resolved state from `getConnection`, so an accepted request still reads as accepted after a reload. The request sender is carried on the notification's optional `actorId` field so the handler resolves the connection without parsing `href`. Added 2026-05-17 for the Guided Walkthrough's Beat 3 (Magda accepts Daniel's request); the request itself is seeded statically (`notif-magda-connect-daniel` in `mockNotifications.ts`).

### Recipient targeting

Each `AppNotification` carries a required `recipientId`. The bell list is filtered per-viewer in `NotificationsContext` so a notification only appears for the user it's addressed to. The actor of an event (e.g. carer pressing Start) does not self-notify — `recipientId` resolves to `booking.ownerId` for session lifecycle events. Pre-Inbox & Notifications (2026-05-08), notifications were a global list and the carer who triggered Start would see their own notification fire.

### Lifecycle update pattern (session_started → session_completed)

The notification builders (`lib/notificationBuilders.ts`) issue a deterministic id `notif-session-${session.id}` for both events. `addNotification` upserts by id, so the second event overwrites the first row in place — the bell shows **one evolving notification per session**, not two. This mirrors iOS / ride-share notification grammar (the same banner updates from "Driver is on the way" to "Driver has arrived"). The shape is reusable for any future event pair where a state change should refresh an existing row rather than spawn a duplicate.

### Cross-surface unread counts

Mobile bell, desktop sidebar, and inbox dots all read the same viewer-aware helper `countUnreadConversations(conversations, viewerId)` from `lib/conversationUtils.ts`. Pre-Inbox & Notifications (2026-05-08), the AppNav bell counted via `c.unreadCount > 0` (owner-centric counter) while the inbox itself filtered with viewer-aware logic, so a provider-side viewer would see divergent counts on different surfaces. Single helper resolves the divergence. The desktop sidebar surfaces unread badges next to the Notifications + Inbox labels using the same numbers.

### Notification grouping

Same-type + same-href notifications cluster into groups with stacked avatars. Groupable types: `meet_rsvp`, `group_activity`. Groups show summary titles like "3 people are going to your meet".

### Surfaces

- **`/notifications`** — single canonical surface on every device. Full page with mark-all-read, grouped rendering. Bell icon in AppNav uses `ButtonIcon{href="/notifications"}` — same pattern as the inbox link. The desktop dropdown panel (`NotificationsPanel.tsx`) was retired in Inbox & Notifications C1 (2026-05-08) — one rendering path to maintain. Unread indicator is a corner pip on the avatar (`.notif-unread-badge` — brand-tinted, surface-bordered so it overlaps the edge). Category label sits as a small uppercase letter-spaced tag on the top row paired with the timestamp via `·`. Pattern: `{title}                              CARE · 7d ago` / `{body line}`.

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
9. **Timestamp pattern: trailing/separator (Inbox & Notifications E1, 2026-05-08).** Chat stream keeps the current pattern — date dividers (`.inbox-date-sep`) carry day labels; per-message trailing timestamps (`.inbox-message-time`) sit below each bubble + structured card. Considered a switch to WhatsApp-style inline corner timestamps inside text bubbles but rejected: proposal / inquiry / payment cards already have internal structure, and a per-card footer timestamp would compete with their existing footers (`Awaiting response` / `View booking →`). The uniform trailing pattern reads better across the mixed surface (text + structured cards + system messages). Revisit if user testing surfaces concrete confusion.
10. **First message in non-Connected conversation → mutual Familiar (Inbox & Notifications B1, 2026-05-08).** `ThreadClient.handleSend` checks current connection state via `getConnection`; if state is `none` and `theyMarkedFamiliar` is false, fires `markFamiliar` both directions. Idempotent on already-Familiar pairs; no-op on already-Connected via the state-rank merge in ConnectionsContext. Closes the Appointment-flow "Ask about this" path which doesn't go through the structured inquiry form. See [[Trust & Connection Model]] → "Inquiry-driven transitions" for the full four-rule model.
11. **Single notification surface (Inbox & Notifications C1, 2026-05-08).** Bell icon now routes to `/notifications` on every device. The desktop dropdown panel (`NotificationsPanel.tsx`) was retired — one canonical surface, one rendering path to maintain.
12. **Edit-after-submit on visit reports (Inbox & Notifications E2, 2026-05-08).** Provider can edit a sealed report's notes for up to 24h after `completedAt` OR until the owner views the report (whichever comes first). Last-write-wins — `editedAt` field on `VisitReport` records the most-recent save; no chronicle of prior versions. Owner sees a quiet `edited` tag on the report card; no notification, no chat system message. Designed for typo fixes; chronicle versioning was deliberately skipped as overengineering for the demo.
13. **Superseded proposal cards subdue + expand-on-click (Inbox & Notifications E3, 2026-05-08).** Countered / declined / accepted proposal cards collapse to header + service title and dim (lower opacity, muted header background, lower-contrast icon + label). Tapping the collapsed body expands the full chronicle inline; "Show less" returns to compact. Chronicle stays inspectable on demand without scrolling away from the active card. Pending proposals retain their full vivid header.
14. **Inbox sort: pure recency descending (Inbox & Notifications D, 2026-05-08).** Was unread-first then recency — surfaced 85d-old unread threads above 2d-old active ones and read as broken. Same shape as iMessage / Slack. Unread dot stays as visual cue.
15. **Cross-surface unread counts share `countUnreadConversations(conversations, viewerId)` (Inbox & Notifications D, 2026-05-08).** Mobile bell, desktop sidebar, and inbox dots all read the same viewer-aware helper. Earlier owner-centric counter caused divergent counts on provider-side viewers vs the inbox itself.
16. **Notifications carry `recipientId`; bell filters per-viewer (Inbox & Notifications A, 2026-05-08).** Actor of an event no longer self-notifies. See "Recipient targeting" above.
17. **Lifecycle update pattern via deterministic id (Inbox & Notifications A, 2026-05-08).** `session_started` → `session_completed` upsert the same notification row via id `notif-session-${session.id}`. iOS / ride-share grammar; one evolving row per lifecycle. See "Lifecycle update pattern" above.

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
