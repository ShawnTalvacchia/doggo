---
category: meta
status: active
last-reviewed: 2026-04-10
tags: [roadmap, phases, planning]
review-trigger: "at the start and end of every phase"
---

# Doggo — Product Roadmap

**Priority:** Demo-quality prototype for user testing and investment. Build horizontally — get the full product story demoable, not one feature deep.

**Process:** Each phase follows the lifecycle in CONTRIBUTING.md — open with doc review and conflict check, close with doc updates and acceptance verification. Phase boards live in `phases/` while active, then move to `archive/phases/` when complete.

---

## Completed Work (Phases 1–30 + Review & Polish)

30 build phases shipped covering: design system, app shell, community core (meets + connections), care & booking flows, profile system, home feed & social posts, layout redesign (sidebar + master-detail), schedule & bookings polish, component consolidation, group taxonomy (park/neighbor/interest/care), and Community tab with category sub-tabs.

Review & Polish phase completed user-driven review: feed card redesign (two-column layout with contextual headers), community multi-select filter pills, scroll-to-hide nav rewrite (MutationObserver + direct listeners), sidebar hover states, vertical spacing tightening, page header weight unification, schedule page CSS cleanup (removed incorrect MasterDetailShell collapsed rules). Doc restructure: retired `component-inventory.md` and `frontend-style.md`, created unified `design-system.md`.

Full history in `archive/phases/`. Key outcomes:

- **Navigation:** Community | Discover | My Schedule | Bookings | Profile (mobile). 7-item desktop sidebar.
- **Groups:** Four types (park/neighbor/interest/care) with type-specific detail tabs. Care groups have provider badges, service listings, gallery modes.
- **Meets:** Four types (walk/park hangout/playdate/training) with type-specific fields. RSVP with Going/Interested states.
- **Discover:** Three-door hub (Meets, Groups, Dog Care) with filter panels per door.
- **Care:** Provider profiles, booking conversations, payment mock, trust-gated CTAs.
- **Inbox:** Direct + booking conversations, tab filtering, three-column desktop layout.
- **Schedule:** Unified timeline of meets + care sessions, filter tabs, single-panel layout.

---

## Current State — Honest Assessment

*(Updated 2026-04-10 after Review & Polish phase close)*

The prototype is structurally complete with rich mock data. Every page has content, working interactions, and realistic data. The design system is stabilizing — Tailwind v4 utilities for new code, semantic tokens throughout, feed cards and community filters recently redesigned.

**Works well:** Community feed with contextual post headers and multi-select category filtering, group list + detail (with feed comments), meet cards + tabbed detail, schedule with filter tabs, navigation across breakpoints, Discover filtering, sidebar with hover states.

**Data layer:** 20 users, 24 meets, 18 groups, 35 posts, 13 reviews, 10 bookings, 12 connections, 8 conversations, 3 group threads. All cross-referenced and TypeScript-clean.

**Needs significant work:**
- Meet page tab content (Details, People, Chat all need fleshing out)
- Booking page (not functional, needs provider vs owner views designed)
- Inbox (structural issues, conversation flow incomplete)
- Profiles — both self and other-user (layout mess, need design thinking)
- Notifications (started, needs more content)
- Create flows (meets, groups, posts) — none exist yet
- Photo sharing and tagging UX
- Provider elevation (cards, schedule differentiation, visibility)
- Dog pages/sections (currently minimal, need to be worked into profiles)
- "Interested" list should be much longer (auto-populated from group events)

**Known bugs on Polish Log:**
- "Any" filter pill logic (still not working correctly)
- Slider "no max" option missing for group size
- Provider ID mismatch between mockData.ts and mockUsers.ts

---

## Polish Log (permanent)

`phases/polish-log.md` — running list of UI tweaks and small bugs. Not a phase — lives alongside whatever phase is active. Any session can pull from it.

---

## Current Phase

### Page Content & Interactions

**Goal:** Build out page content, interaction flows, and provider-focused features. The pages exist structurally but need real content under their tabs, working create flows, and differentiated provider experiences.

**Key work:**
- Meet page: flesh out Details, People, Chat tabs; RSVP states (Going/Interested/Not Going); meet creation flow
- Schedule cards: differentiate provider/host cards visually (solid color, stronger presence)
- Care card headers: add drop-off times, relevant scheduling info
- Create flows: create meet, create group, create post (compose UIs)
- Photo sharing: upload UI, tag-a-dog, tag-a-place, share prompts
- Interested list: expand with auto-populated events from joined groups
- Provider elevation: make provider activity more visible and differentiated

**Phase board:** `phases/page-content-and-interactions.md`

---

## Upcoming Phases

### Bookings & Care Provider Flow

**Goal:** Make the booking page functional and design the provider vs owner experience. What does a provider see on their schedule, inbox, and profile? How does a booking flow from inquiry to completion?

**Key work:** Booking page for both perspectives, provider schedule management, booking status flow, provider inbox actions, care history.

**Refs:** [[explore-and-care]], [[messaging]], [[schedule]]

### Profiles & Dogs

**Goal:** Design and build comprehensive profile pages (self and other-user) and decide how dogs are surfaced — own pages, sub-sections, or both. Consider how profiles differ for providers vs casual users.

**Key work:** Self-profile redesign, other-user profile with relationship-aware content, dog profiles/sections, profile completeness, provider profile elevation.

**Refs:** [[profiles]], [[Trust & Connection Model]], [[User Archetypes]]

### Inbox & Notifications

**Goal:** Fix inbox structure and build a complete messaging experience. Notifications needs more content types and interaction patterns.

**Key work:** Inbox conversation flow, message compose, booking conversation threading, notification types and actions, read states.

**Refs:** [[messaging]], [[connections]]

### Demo Presentation

**Goal:** Make the prototype presentable to someone who's never seen it. Demo entry page, persona switching, guided exploration.

**Key work:**
- Demo entry page with context + 3 persona cards (Tereza, Klára, Daniel)
- User switching mechanism (each user sees their own data)
- Landing page option (public, not logged in)
- Optional guided hints per persona

**Refs:** [[User Archetypes]], [[Product Vision]], [[mock-data-plan]]

---

## Open Questions for Future Phases

These are not yet planned but will become relevant:

- **Real backend** — Supabase data model, auth, real-time messaging
- **Production design pass** — Figma handoff, visual refinement
- **User testing** — what to test, with whom, what metrics
- **Monetization prototype** — payment flow, platform fees, provider dashboard
- **Mobile native** — React Native or PWA decision

See [[Open Questions & Assumptions Log]] for full list.

---

## Principles

1. **Each phase starts and ends with a doc review.** Read all docs, update stale ones, raise concerns, check open questions.
2. **No phase ships without working content.** Empty tabs and placeholder text are bugs, not future work.
3. **Demo-first.** When in doubt, prioritise what makes the product story more convincing.
4. **Horizontal, not deep.** Every page should feel 80% complete before any page goes to 100%.
