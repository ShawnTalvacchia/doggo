---
category: meta
status: active
last-reviewed: 2026-04-08
tags: [roadmap, phases, planning]
review-trigger: "at the start and end of every phase"
---

# Doggo — Product Roadmap

**Priority:** Demo-quality prototype for user testing and investment. Build horizontally — get the full product story demoable, not one feature deep.

**Process:** Each phase follows the lifecycle in CONTRIBUTING.md — open with doc review and conflict check, close with doc updates and acceptance verification. Phase boards live in `phases/` while active, then move to `archive/phases/` when complete.

---

## Completed Work (Phases 1–30)

30 phases shipped covering: design system, app shell, community core (meets + connections), care & booking flows, profile system, home feed & social posts, layout redesign (sidebar + master-detail), schedule & bookings polish, component consolidation, group taxonomy (park/neighbor/interest/care), and Community tab with category sub-tabs.

Full history in `archive/phases/`. Key outcomes:

- **Navigation:** Community | Discover | My Schedule | Bookings | Profile (mobile). 7-item desktop sidebar.
- **Groups:** Four types (park/neighbor/interest/care) with type-specific detail tabs. Care groups have provider badges, service listings, gallery modes.
- **Meets:** Four types (walk/park hangout/playdate/training) with type-specific fields. RSVP with Going/Interested states.
- **Discover:** Three-door hub (Meets, Groups, Dog Care) with filter panels per door.
- **Care:** Provider profiles, booking conversations, payment mock, trust-gated CTAs.
- **Inbox:** Direct + booking conversations, tab filtering, three-column desktop layout.
- **Schedule:** Unified timeline of meets + care sessions, filter tabs, master-detail.

---

## Current State — Honest Assessment

*(Updated 2026-04-08 after Content Completion + Demo Data & Richness phases)*

The prototype is structurally complete and has a rich mock data layer. Every page has content, working interactions, and realistic data.

**Works well:** Group list + detail (with feed comments), meet cards + tabbed detail (Details · People · Chat), schedule with Upcoming/Interested/Care tabs and meet vs care card differentiation, notifications (20+ items), navigation across breakpoints, provider profiles, Discover filtering (Meets, Groups, Care all functional), Bookings (owner + provider views), Inbox (8 conversations — direct + booking + compose), Community feed with four-gate visibility model and category filtering.

**Data layer:** 20 users with full profiles, 24 meets (8 completed + 16 upcoming), 18 groups with 5-8 members each, 35 posts distributed across all group types, 13 reviews, 10 bookings, 12 connections with trust signals, 3 rich group message threads. All cross-referenced and TypeScript-clean.

**Needs review pass:** UI polish, visual consistency, interaction details, edge cases. Image assets still using Unsplash placeholders (generated images in progress).

**Not yet built:**
- Persona switching (Tereza, Klára, Daniel views — data exists, UI doesn't)
- Demo entry page
- Generated image integration (prompts ready, generation in progress)

---

## Completed Phases

### Content Completion ✓

**Completed:** 2026-04-08

Structural changes (group Chat tab removal, Feed flat comments, meet detail tabs), critical wiring (Discover filters, provider cards, Bookings My Services, Inbox compose), content fill (posts, galleries, events, notifications), and schedule polish (card differentiation, tab rename, redundant element removal). All 19 tasks done, D5 (UI tweaks backlog) deferred to Review & Polish.

### Demo Data & Richness ✓

**Completed:** 2026-04-08

Built central user registry (20 users), expanded all mock data files (24 meets, 35 posts, 13 reviews, 10 bookings, 12 connections, 8 conversations, 3 group message threads), cross-reference audit (fixed 6 inconsistencies), TypeScript verified clean. All 16 tasks done.

---

## Current Phase

### Review & Polish

**Goal:** Walk through the entire prototype, identify and fix visual issues, interaction bugs, content gaps, and UX rough edges. This phase is user-driven — Shawn reviews, raises issues, and they get fixed before moving to Demo Presentation.

**Phase board:** `phases/review-and-polish.md`

---

## Upcoming Phases

### Demo Presentation

**Goal:** Make the prototype presentable to someone who's never seen it. A demo entry page that provides context, lets the viewer choose a persona, and guides them through the product story.

**Key work:**

Demo entry page:
- Context header explaining what Doggo is (1-2 sentences)
- 3 persona cards (Tereza, Klára, Daniel) with photo, description, what they'll see
- "Enter as [name]" → logged in as that user with their data
- Option to view the landing page (public, not logged in)

User switching:
- Mechanism to switch between users without leaving the app
- Each user sees their own groups, schedule, connections, inbox, notifications
- State management for multi-user mock data

Guided elements (optional):
- First-time hints or tooltips highlighting key features per persona
- Or: a brief "what to explore" card on the Community page per user

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
