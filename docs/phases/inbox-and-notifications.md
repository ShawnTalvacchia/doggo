---
status: active
last-reviewed: 2026-04-12
review-trigger: When any task is completed or blocked
---

# Inbox & Notifications

**Goal:** Make the inbox feel like a real messaging experience and notifications feel actionable. Complete the booking conversation flow (proposal → accept → booking created) deferred from Bookings phase. Make both pages demo-ready.

**Depends on:** Profiles & Dogs (done — unified profiles, connection-gated CTAs), Bookings & Care Provider Flow (done — booking detail, session management).

**Refs:** [[messaging]], [[connections]], [[explore-and-care]], [[profiles]]

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [ ] Read every task and its referenced docs
- [ ] Review Open Questions log — flag anything affecting this phase
- [ ] Audit current inbox page (`/inbox`) and thread page (`/inbox/[conversationId]`)
- [ ] Audit current notifications page (`/notifications`)
- [ ] Review messaging feature doc and booking proposal flow
- [ ] Confirm scope — no tasks that belong in a different phase

---

## Tasks

### Inbox Polish

| # | Description | Status |
|---|-------------|--------|
| I1 | Inbox list redesign — conversation cards need visual hierarchy: avatar, name, last message preview, timestamp, unread indicator, service chip for booking convos. Match the quality of other list views (BookingRow, ScheduleCard) | todo |
| I2 | Inbox PageColumn consistency — ensure the inbox list follows the same page-column-panel-body pattern as other pages. Check tab filtering (All / Care / Groups) works and feels consistent with other tab patterns | todo |
| I3 | Empty state — what does the inbox look like with zero conversations? Encouraging CTA to "Find someone to connect with" or "Browse care providers" | todo |
| I4 | Thread polish — message bubbles, timestamps, date separators. Review spacing, typography, and bubble styling against design system tokens | todo |

### Booking Conversation Flow (deferred from Bookings phase)

| # | Description | Status |
|---|-------------|--------|
| B1 | Inquiry form review — the InquiryForm component exists but needs audit. Does the flow from provider profile → new conversation → inquiry form feel smooth? | todo |
| B2 | Provider inbox experience — when a provider opens a booking conversation, they see the InquiryResponseCard. Review this flow: respond / send proposal / decline / suggest changes | todo |
| B3 | Booking proposal card polish — BookingProposalCard exists. Review accept/decline flow, visual design, status states (pending/accepted/declined) | todo |
| B4 | Contract + payment cards — ContractCard and PaymentCard exist in thread. Review the full booking-in-chat lifecycle: inquiry → proposal → accept → contract → payment | todo |
| B5 | Signing modal — SigningModal exists for proposal acceptance. Review the flow and visual quality | todo |

### Notifications

| # | Description | Status |
|---|-------------|--------|
| N1 | Notification page redesign — current page has basic list + detail panel. Needs PageColumn consistency, better visual hierarchy, and actionable items | todo |
| N2 | Notification types audit — review all 13 notification types (meet_invite, connection_request, booking_proposal, etc.). Each should have clear icon, copy, and action | todo |
| N3 | Notification actions — tap a notification → navigate to the relevant page (meet detail, inbox thread, profile, booking). Currently notifications show a detail panel but don't link out | todo |
| N4 | Notification grouping — related notifications should cluster (e.g. "3 people RSVPed to your meet" instead of 3 separate items) | todo |
| N5 | Unread state and badge — unread count badge on nav icon, mark-as-read on tap, "Mark all as read" button | todo |

### Cross-cutting

| # | Description | Status |
|---|-------------|--------|
| X1 | Inbox ↔ Notification connection — new message notifications should link to the right conversation thread | todo |
| X2 | Profile link consistency — all avatar/name mentions in inbox and notifications link to `/profile/[userId]` (using new unified profile routes) | todo |

---

## Acceptance Criteria

- [ ] Inbox conversation list has clear visual hierarchy with avatars, previews, timestamps, unread dots
- [ ] Opening a conversation thread shows smooth message flow with proper date grouping
- [ ] Booking conversation lifecycle works end-to-end: inquiry → provider response → proposal → accept/decline → contract card
- [ ] Notifications page shows clear, actionable items with proper icons and copy
- [ ] Tapping a notification navigates to the relevant page
- [ ] Unread badge shows on nav icon
- [ ] Empty states exist for both inbox (no conversations) and notifications (no notifications)
- [ ] Both pages follow PageColumn pattern
- [ ] TypeScript compiles clean
- [ ] Feature docs updated

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions log — close resolved, add new
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived)
- [ ] Check next phase scope for conflicts with what was just built
