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

The infrastructure is solid but content is thin. Here's what a demo viewer would see:

**Works well:** Group list + detail, meet cards + detail, schedule, notifications, navigation across breakpoints, provider profiles with service data.

**Thin but passable:** Community feed (sparse items), inbox (read-only, few messages), bookings (owner view works, provider view stubbed), profile (mostly empty Posts/Services tabs).

**Broken or empty:**
- Discover/Care results panel is **completely empty** — no provider cards render
- Discover filter checkboxes are **non-functional** (visual only, don't filter results)
- Bookings "My Services" (provider view) is **mostly stubbed**
- Discover hub descriptions are **placeholder text** ("Short text about that")
- Many group feeds and meet lists are empty due to sparse mock data
- Feed comments don't exist yet (decided feature, not built)
- Meet detail is a single scroll page (decided to restructure to tabs, not built)

---

## Upcoming Phases

### Content Completion

**Goal:** Make every page feel finished. Fix structural issues, wire up interactions, fill content gaps. After this phase, every page should have real content and working interactions — no empty panels, no placeholder text, no non-functional controls.

**Key work:**

Structural changes (from recent decisions):
- Remove group Chat tab from neighbor/interest groups
- Add flat comments to group Feed posts
- Restructure meet detail to tabs (Details · People · Chat)

Critical fixes:
- Wire Discover/Care results — show provider cards from mock data
- Wire Discover filter logic — checkboxes/sliders should actually filter results
- Replace Discover hub placeholder descriptions with real copy
- Build out Bookings provider view ("My Services" tab)
- Make Inbox compose functional (at least local-state send)

Content fill:
- Ensure every group has at least 2-3 feed posts and 1-2 upcoming meets
- Ensure every care group has service listings and gallery content
- Add real content to profile Posts tabs
- Fill notification mock data (15-20 items across all types)

UI polish backlog:
- Feed filtering by category tab on Community right panel
- Any accumulated UI tweaks from development

**Depends on:** Docs aligned (current session work).

**Refs:** [[meets]], [[messaging]], [[explore-and-care]], [[Groups & Care Model]], [[profiles]]

---

### Demo Data & Richness

**Goal:** Build the mock data layer that makes the prototype feel alive. Richer user journeys, realistic content, enough depth that exploring any page reveals real interactions.

**Key work:**

User journeys (build out 3 primary demo users):
- **Tereza** — routine owner, neighborhood anchor, member of park + neighbor groups, casual care provider
- **Klára** — professional trainer, runs a care group, participates in park groups as owner
- **Daniel** — anxious new owner, reactive dog support group member, few connections, exploring

Each user needs:
- Profile with bio, dogs, neighborhood, connections
- Group memberships with role-appropriate content
- Schedule with upcoming meets and (for Klára) care bookings
- Inbox with realistic conversations
- Notification history

Group data enrichment:
- Each of the 7 care groups: realistic events, feed posts with comments, photos (6+ per gallery)
- Park groups: upcoming meets, diverse attendees
- Neighbor/interest groups: feed posts with comments, member interactions

Mock data quality:
- Prague-authentic names, neighborhoods, locations
- Realistic timestamps (not all from the same week)
- Booking history with varied statuses
- Provider reviews and ratings

**Refs:** [[mock-data-plan]], [[Groups & Care Model]], [[User Archetypes]], [[image-generation-prompts]]

---

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
