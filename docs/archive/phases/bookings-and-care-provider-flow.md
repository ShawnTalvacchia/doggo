---
status: archived
last-reviewed: 2026-04-12
review-trigger: When any task is completed or blocked
---

# Bookings & Care Provider Flow

**Goal:** Make the booking detail page functional for both owner and provider perspectives. Design what a provider sees across schedule, inbox, and profile. Build the booking lifecycle from inquiry to completion.

**Depends on:** Page Content & Interactions (done), Layout Unification (done).

**Refs:** [[explore-and-care]], [[messaging]], [[schedule]], [[profiles]]

---

## Opening Checklist

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — flag anything affecting this phase
- [x] Audit booking detail page (`/bookings/[bookingId]`) current state
- [x] Audit booking list page current state (recently redesigned cards)
- [x] Review booking mock data structure and conversation threading
- [x] Confirm scope — no tasks that belong in a different phase

---

## Tasks

### Booking Detail Page

| # | Description | Status |
|---|-------------|--------|
| B1 | Owner view — booking summary, session timeline, carer info, actions (message, cancel) | done |
| B2 | Provider view — same structure but from provider perspective, session check-in actions | done |
| B3 | Session timeline — visual progress through completed/upcoming sessions with notes | done |
| B4 | Booking status flow UI — active/upcoming/completed/cancelled states with appropriate CTAs | done |

### Provider Experience

| # | Description | Status |
|---|-------------|--------|
| P1 | Provider schedule — how provider bookings appear in My Schedule (already partially done) | done |
| P2 | Provider inbox — booking inquiry conversations, accept/decline actions | deferred → Inbox & Notifications |
| P3 | Provider profile section — how services and availability appear to others | deferred → Profiles & Dogs |
| P4 | "My Services" tab on Bookings page — provider's active clients and upcoming sessions | done |

### Booking Lifecycle

| # | Description | Status |
|---|-------------|--------|
| L1 | Booking proposal card in conversation — accept/counter/decline UI | deferred → Inbox & Notifications |
| L2 | Session check-in/check-out flow — provider marks session started/completed | done |
| L3 | Post-booking review prompt — encourage reviews after completed bookings | stub — "Leave a review" button exists, no review form |
| L4 | Care history — past bookings with session notes and reviews | done |

### Additional Work (not on original board)

| # | Description | Status |
|---|-------------|--------|
| X1 | Rolling weekly billing model — recurring bookings generate sessions weekly, no fixed count | done |
| X2 | Chat tab — embedded conversation thread from ConversationsContext | done |
| X3 | Owner/carer notes on bookings — care instructions and provider observations | done |
| X4 | Aggregate stats — sessions completed, relationship duration, next session | done |
| X5 | BookingRow card improvements — Tag icon, divider removal, service hierarchy | done |
| X6 | Success color palette — shifted from neon mint to muted sea green | done |

---

## Acceptance Criteria

- [x] Booking detail page works for both owner and provider perspectives
- [x] Session timeline shows progress with completed/upcoming visual distinction
- [x] At least one booking lifecycle action works (check-in, complete, cancel)
- [x] Provider can see their clients and upcoming sessions in "My Services" tab
- [ ] ~~Booking conversation shows proposal card with accept/decline~~ → deferred to Inbox & Notifications
- [x] TypeScript compiles clean
- [ ] Feature docs updated for any changed behavior ← closing checklist

---

## Closing Checklist

- [x] Walk through every acceptance criterion against the running app
- [x] Update all affected feature docs in `docs/features/`
- [x] Update Open Questions log — close resolved, add new
- [x] Update ROADMAP.md — mark phase complete with summary
- [x] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [x] Archive this phase board (copy to `archive/phases/`, mark status: archived)
- [x] Check next phase scope for conflicts with what was just built
