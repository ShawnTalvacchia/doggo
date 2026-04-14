---
status: active
last-reviewed: 2026-04-14
review-trigger: When any task is completed or blocked
---

# Meets Deep Pass

**Goal:** Meets are the core trust-building mechanic in the product. A meet detail page should make a hesitant new owner like Daniel actually *want* to attend — and make a regular like Tereza feel like the host she's joining is someone she'd already trust with her dog. Every meet surface (detail page, card, creation flow, post-meet flow) should feel like the most considered surface in the app.

**Depends on:** Profiles & Dogs (done), Inbox & Notifications (done), Bookings & Care Provider Flow (done). Profiles Deep Pass is paused — we'll fold its remaining content work into Mock World Building.

**Refs:** [[meets]], [[Trust & Connection Model]], [[Content Visibility Model]], [[Groups & Care Model]], [[design-system]]

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs
- [ ] Review Open Questions log — flag anything affecting this phase
- [ ] Walk through `/meets` (list/feed) — does the entry point sell attending?
- [ ] Walk through every meet detail variant — walk, park hangout, playdate, training, care-group meet, completed (with photos), upcoming, full
- [ ] Review meet card variants — community feed, schedule timeline, group detail, search results
- [ ] Check meet creation flow end-to-end (if it exists) — what's missing for a real flow?
- [ ] Check post-meet review/connect flow against Trust & Connection Model (Familiar trigger)
- [ ] Audit mock meet data — do meets have rich enough metadata to drive the new detail page (cover photos, attendees with dogs, host trust signals, type-specific fields)?
- [ ] Update any referenced docs with `last-reviewed` older than 2 weeks
- [ ] Confirm scope — flag any tasks that belong to a different phase

---

## Tasks

### Meet Detail Page — Make It Inviting

Initial redesign landed (cover photo hero, info strip, attendees, rules, organiser, sticky RSVP). Iterating from user feedback.

| # | Description | Status |
|---|-------------|--------|
| A1 | Initial redesign — cover photo hero with overlay, glassmorphism badges, info strip (date + location), "Who's coming" with dogs, "People you know" social proof, urgency warning, type-specific details, rules grid, what-to-bring, organiser card, sticky mobile RSVP, photos section | done |
| A2 | Iterate on hero — sizing, overlay treatment, badge placement, fallback covers per meet type | in_progress |
| A3 | "Who's coming" section — does the dog social proof feel right? Visibility rules per Content Visibility Model (familiar/connected) | todo |
| A4 | "People you know" — overlap math, copy ("3 of your connections going" vs avatar stack), empty state for new users | todo |
| A5 | Type-specific detail blocks (walk route, park, playdate notes, training agenda) — content depth and visual treatment | todo |
| A6 | Rules grid + what-to-bring — are the items the right ones? Could they be combined or rethought? | todo |
| A7 | Organiser card — trust signals, link to profile, "X meets hosted" stat, connection state | todo |
| A8 | Care-group meets — service CTA placement, "this is a paid offering" framing, booking entry point | todo |
| A9 | Completed meets — photo gallery treatment, share-photos prompt, "tag who came" affordance, post-meet review entry | todo |
| A10 | RSVP states — Going / Maybe / Can't / Full / Past. Sticky bar (mobile) and inline (desktop) parity | todo |
| A11 | Empty/edge states — meet cancelled, meet at capacity, host left, you're banned from group | todo |
| A12 | Mobile responsiveness sweep — overflow, truncation, tap targets, sticky RSVP behaviour with keyboard | todo |

### Meet Cards — Across Surfaces

| # | Description | Status |
|---|-------------|--------|
| B1 | Community feed meet card — does it tell enough story to drive a tap? | todo |
| B2 | Schedule timeline meet card — action verb labels, hosting/providing accents (review against current schedule cards) | todo |
| B3 | Group detail meet list card — fits the group context? | todo |
| B4 | Search/Discover results card — does it differentiate from groups and providers? | todo |
| B5 | Card-to-detail visual continuity — cover photo, title, key info match. No jarring transitions | todo |

### Meet Creation Flow

| # | Description | Status |
|---|-------------|--------|
| C1 | Audit current creation flow — what exists, what's missing, where it lives | todo |
| C2 | Type picker (walk / park hangout / playdate / training) — different fields per type | todo |
| C3 | Required vs optional fields — what's the minimum viable meet? | todo |
| C4 | Group/visibility choice — public, group-only, friends-only | todo |
| C5 | Cover photo upload (mock) — fallback covers per type | todo |
| C6 | Repeat/series option — for regular walks (Tereza's morning Stromovka) | todo |
| C7 | Confirmation + share — "your meet is live, here's the link" flow | todo |

### Post-Meet Flow (Familiar Trigger)

This is the most important Familiar trigger in the Trust & Connection Model. It currently barely exists.

| # | Description | Status |
|---|-------------|--------|
| D1 | Post-meet prompt entry — when does it appear? Notification? Schedule card state? Both? | todo |
| D2 | "Who did you meet?" review screen — list attendees with dogs, mark as Familiar (silent) | todo |
| D3 | Optional: rate the meet, leave a note for the host, share a photo | todo |
| D4 | Connection escalation prompt — "You marked Tereza as familiar — want to connect?" (only after multiple meets, per model) | todo |
| D5 | Host-side post-meet — see who came, optional thanks, reattendance signals | todo |

### Mock Data Quality

Meets need to be rich enough to demo. Many meets are still thin.

| # | Description | Status |
|---|-------------|--------|
| E1 | Cover photos for every meet (or strong type-fallback) — partial; meet-1, 2, 3, 6, care-1, care-3 done | in_progress |
| E2 | Attendee lists — every meet should have realistic attendees (with dogs) reflecting the group it's in | todo |
| E3 | Type-specific fields — every walk needs route, every training needs agenda, etc. | todo |
| E4 | "People you know" plausibility — connections graph should support overlap on most meets | todo |
| E5 | A few completed meets with photos for the photo gallery state | todo |

### Cross-Cutting

| # | Description | Status |
|---|-------------|--------|
| X1 | Visibility rules — meets respect the two-gate model (group context + relationship gate). Audit against Content Visibility Model | todo |
| X2 | Meet → Profile transitions — tapping an attendee, host, or dog goes to the right place feeling | todo |
| X3 | Meet → Group transitions — group chip in detail header links cleanly | todo |
| X4 | Meet → Booking transition (care-group meets) — does the service CTA feel like a natural extension, not a marketplace pivot? | todo |

---

## Acceptance Criteria

- [ ] Meet detail page makes a tester say "I'd actually go to this"
- [ ] All four meet types render distinctively and tell the right story
- [ ] Meet cards across surfaces feel like one family
- [ ] Meet creation flow exists end-to-end and is pleasant
- [ ] Post-meet flow drives Familiar marking per Trust & Connection Model
- [ ] Mock meet data is rich enough that randomly opening any meet feels real
- [ ] Care-group meets connect cleanly to the booking flow
- [ ] Visibility rules respected (context gate + relationship gate)
- [ ] TypeScript compiles clean
- [ ] Feature docs updated (`docs/features/meets.md`)

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions log — close resolved, add new
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [ ] Review Punch List changes since phase open
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived)
- [ ] Check next phase scope (Community & Groups Deep Pass) for conflicts
