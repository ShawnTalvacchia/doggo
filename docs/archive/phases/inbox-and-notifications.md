---
status: archived
last-reviewed: 2026-04-13
review-trigger: When any task is completed or blocked
---

# Inbox & Notifications

**Goal:** Make the inbox feel like a real messaging experience and notifications feel actionable. Complete the booking conversation flow (proposal → accept → booking created) deferred from Bookings phase. Make both pages demo-ready.

**Depends on:** Profiles & Dogs (done — unified profiles, connection-gated CTAs), Bookings & Care Provider Flow (done — booking detail, session management).

**Refs:** [[messaging]], [[connections]], [[explore-and-care]], [[profiles]]

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — flag anything affecting this phase
- [x] Audit current inbox page (`/inbox`) and thread page (`/inbox/[conversationId]`)
- [x] Audit current notifications page (`/notifications`)
- [x] Review messaging feature doc and booking proposal flow
- [x] Confirm scope — no tasks that belong in a different phase

---

## Tasks

### Inbox Polish

| # | Description | Status |
|---|-------------|--------|
| I1 | Inbox list redesign — rewritten as connections list with avatars, names, dog names, last message preview, timestamps, unread dots. Tapping navigates to `/profile/[userId]?tab=chat` | done |
| I2 | Inbox PageColumn consistency — follows page-column-panel-body pattern. Tab filtering replaced with search (desktop inline, mobile nav-header toggle) | done |
| I3 | Empty state — shows encouraging CTA for zero conversations and no-results search state | done |
| I4 | Thread polish — message bubbles, timestamps, date separators. Review spacing, typography, and bubble styling against design system tokens | done |

### Chat-on-Profiles Architecture (emerged from I1–I3)

| # | Description | Status |
|---|-------------|--------|
| C1 | Merge conversation data — collapsed Jana's two conversations, normalized provider IDs to user IDs, renamed conversation IDs | done |
| C2 | `getConversationForUser(userId)` — new context function to find conversation by other-party userId | done |
| C3 | ThreadClient embedded mode — `embedded` prop hides header, flex layout for profile tab embedding | done |
| C4 | ProfileChatTab component — renders ThreadClient embedded or conversation-starter empty state | done |
| C5 | Chat tab on profile pages — conditional on connected state or existing conversation. Message/Book Care CTAs navigate to `?tab=chat` | done |
| C6 | Inbox rewrite as connections list — search, unread indicators, profile-based navigation | done |
| C7 | Route redirects — `/inbox/[conversationId]` redirects to `/profile/[userId]?tab=chat`. All links updated | done |
| C8 | Mobile nav search — inbox uses `setDetailHeader` for search icon → search input toggle. Hides notification/messages buttons | done |
| C9 | Profile subpage mobile pattern — detail header with name + back, bottom nav hidden | done |

### Booking Conversation Flow (deferred from Bookings phase)

| # | Description | Status |
|---|-------------|--------|
| B1 | Inquiry form review — the InquiryForm component exists but needs audit. Does the flow from provider profile → new conversation → inquiry form feel smooth? | done |
| B2 | Provider inbox experience — InquiryResponseCard uses Tailwind utilities, max-w-md, ButtonAction components. Clean layout | done |
| B3 | Booking proposal card polish — BookingProposalCard width 100%/max-width 320px, surface-top bg, radius-panel, semibold buttons | done |
| B4 | Contract + payment cards — ContractCard links to specific booking via `c.bookingId`. PaymentCard reviewed | done |
| B5 | Signing modal — SigningModal exists for proposal acceptance. Reviewed, functional for demo | done |

### Notifications

| # | Description | Status |
|---|-------------|--------|
| N1 | Notification page redesign — PageColumn consistency, tap-to-navigate, mark-as-read, Tailwind cleanup | done |
| N2 | Notification types audit — all 13 types have distinct icons, mock examples, specific hrefs. Panel icon map aligned with page. `meet_rsvp` uses UserPlus | done |
| N3 | Notification actions — tap → navigate to relevant page via `<Link>` with `notification.href` | done |
| N4 | Notification grouping — same-type + same-href notifications cluster with stacked avatars. meet_rsvp and group_activity are groupable | done |
| N5 | Unread state and badge — unread count badge on nav icon, `markRead` on tap, "Mark all as read" bar | done |

### Cross-cutting

| # | Description | Status |
|---|-------------|--------|
| X1 | Inbox ↔ Notification connection — message notifications link to `/profile/[userId]?tab=chat` | done |
| X2 | Profile link consistency — all avatar/name mentions link to `/profile/[userId]` | done |

### Incidental Polish (done alongside tasks above)

| # | Description | Status |
|---|-------------|--------|
| P1 | Group page tab overflow — switched to `flex: 1 0 auto` (grow to fill, scroll when cramped) | done |
| P2 | Group page camera button icon size — matched to nav icon (28px) | done |
| P3 | Profile PostsTab — rewritten to use FeedCommunityPost (same card layout as Community feed) | done |
| P4 | Panel tab corners — fixed glassmorphism background causing corner bleed | done |
| P5 | Inbox badge styling — matched to Schedule badge pattern (pill shape, brand-subtle colors) | done |
| P6 | Klara booking proposal — added missing `proposal` object to mock data (was crashing BookingProposalCard) | done |

---

## Acceptance Criteria

- [x] Inbox conversation list has clear visual hierarchy with avatars, previews, timestamps, unread dots
- [x] Opening a conversation thread shows smooth message flow with proper date grouping
- [x] Booking conversation lifecycle works end-to-end: inquiry → provider response → proposal → accept/decline → contract card
- [x] Notifications page shows clear, actionable items with proper icons and copy
- [x] Tapping a notification navigates to the relevant page
- [x] Unread badge shows on nav icon
- [x] Empty states exist for both inbox (no conversations) and notifications (no notifications)
- [x] Both pages follow PageColumn pattern
- [x] TypeScript compiles clean
- [x] Feature docs updated

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [x] Walk through every acceptance criterion against the running app
- [x] Update all affected feature docs in `docs/features/` — messaging.md rewritten, profiles.md updated with Chat tab
- [x] Update Open Questions log — updated trust model resolved items, added post-meet timing question
- [x] Update ROADMAP.md — marked phase complete, rewrote with deep-pass phase structure
- [x] Review CLAUDE.md — updated current phase, strategic context, key decisions
- [x] Archive this phase board (copy to `archive/phases/`, mark status: archived)
- [x] Check next phase scope for conflicts with what was just built — Profiles Deep Pass builds on chat-on-profiles architecture, no conflicts
