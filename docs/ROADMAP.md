---
category: meta
status: active
last-reviewed: 2026-04-13
tags: [roadmap, phases, planning]
review-trigger: "at the start and end of every phase"
---

# Doggo — Product Roadmap

**Priority:** Demo-quality prototype for user testing and investment. Build horizontally — get the full product story demoable, not one feature deep.

**Process:** Each phase follows the lifecycle in CONTRIBUTING.md — open with doc review and conflict check, close with doc updates and acceptance verification. Phase boards live in `phases/` while active, then move to `archive/phases/` when complete.

---

## Completed Work (Phases 1–30 + Review & Polish + Page Content & Layout)

30 build phases shipped covering: design system, app shell, community core (meets + connections), care & booking flows, profile system, home feed & social posts, layout redesign (sidebar + master-detail), schedule & bookings polish, component consolidation, group taxonomy (park/neighbor/interest/care), and Community tab with category sub-tabs.

Review & Polish phase completed user-driven review: feed card redesign (two-column layout with contextual headers), community multi-select filter pills, scroll-to-hide nav rewrite (MutationObserver + direct listeners), sidebar hover states, vertical spacing tightening, page header weight unification, schedule page CSS cleanup (removed incorrect MasterDetailShell collapsed rules). Doc restructure: retired `component-inventory.md` and `frontend-style.md`, created unified `design-system.md`.

Page Content & Interactions phase: interactive RSVP (Going/Interested/Leave cycle), schedule card redesign (action verb labels, accent borders, provider/hosting tag treatments, care sub-filter pills), meet photo gallery + share prompts, care provider "Carer" badge on feed cards, share nudge in community feed, interested tab auto-population from joined groups.

Layout Unification phase: PageColumn component deployed across all pages, MasterDetailShell and DiscoverShell deleted, sidebar tightened (200→180px), all pages use single-column 640px centered layout.

UI Consistency pass: Discover flow refactored (type pickers removed, FilterPillRow + floating action buttons), booking card redesign (avatar combos, progress bars, session info), unified FilterPillRow component, header alignment (DetailHeader + PageColumn matched), CTA pill buttons for primary actions, neutral sidebar nav styling, scroll-to-hide nav restored, CameraPlusFill icon.

Bookings & Care Provider Flow phase: Booking detail page restructured into tabbed layout (Info / Sessions / Chat). Owner view with aggregate stats (sessions completed, duration, next session), CTA pill buttons (Message + Cancel). Provider view with "You're providing" pill, session check-in actions (Start / Complete / Add note). Rolling weekly billing model for recurring bookings — sessions generate one at a time. Care instructions (owner/carer notes). Chat tab with embedded conversation. BookingRow card polish (Tag icon, divider removal, service hierarchy). Success color palette shifted from neon mint to muted sea green. Deferred: booking proposal card in conversation, provider inbox actions, provider profile services section (→ Inbox & Notifications and Profiles & Dogs phases).

Full history in `archive/phases/`. Key outcomes:

- **Navigation:** Community | Discover | My Schedule | Bookings | Profile (mobile). 7-item desktop sidebar. Neutral active state (transparent-dark-4). CTA pill buttons for header actions.
- **Layout:** All pages use PageColumn (640px centered single column). DetailHeader for drill-down pages with abovePanel prop.
- **Groups:** Four types (park/neighbor/interest/care) with type-specific detail tabs. Care groups have provider badges, service listings, gallery modes.
- **Meets:** Four types (walk/park hangout/playdate/training) with type-specific fields. Interactive RSVP cycle. Photo gallery on completed meets.
- **Discover:** Three-door hub → results with FilterPillRow + floating Filters button. No more type picker pages.
- **Care:** Provider profiles, booking conversations, payment mock, trust-gated CTAs. "Carer" badge on feed cards.
- **Inbox:** Direct + booking conversations, PageColumn layout.
- **Schedule:** Unified timeline with accent-border hosting/providing cards, action verb labels, care sub-filter pills (All/Getting Care/Providing), interested auto-populated from groups.
- **Bookings:** Tabbed detail page (Info / Sessions / Chat) for owner and provider. Rolling weekly billing. Session check-in/check-out for providers. Aggregate stats. Redesigned list cards with avatar combos, Tag icons, clean divider-free design.

---

## Current State — Honest Assessment

*(Updated 2026-04-13 after Bookings & Care Provider Flow phase close)*

The prototype is feature-rich with consistent layout and interactions across all pages. Every page uses PageColumn, has real content, and has working interactions. The design system is stable — unified FilterPillRow, consistent header treatment, neutral sidebar nav. Bookings now have a full owner/provider experience with tabbed detail pages, session management, and rolling weekly billing.

**Works well:** Interactive RSVP on meets, schedule cards with descriptive care labels and accent borders, Discover flow (hub → results with filter pills + floating buttons), community feed with care provider badges, booking detail with tabbed layout and session check-in/check-out, booking list with clean card design, photo gallery on completed meets, scroll-to-hide nav on mobile.

**Data layer:** 20 users, 24 meets, 18 groups, 35+ posts, 13 reviews, 10 bookings, 12 connections, 8 conversations, 3 group threads. Session/meet dates updated to April 2026. All cross-referenced and TypeScript-clean.

**Needs significant work:**
- Profiles — both self and other-user (need design thinking)
- Provider profile section (services, availability — deferred from Bookings phase)
- Dog pages/sections (currently minimal)
- Inbox (PageColumn layout done, but conversation flow incomplete, booking proposal card not built)
- Notifications (started, needs more content types)
- Orphan CSS cleanup from Layout Unification (old shell classes still in globals.css)

**Known bugs on Polish Log:**
- Slider "no max" option missing for group size
- Provider ID mismatch between mockData.ts and mockUsers.ts

---

## Polish Log (permanent)

`phases/polish-log.md` — running list of UI tweaks and small bugs. Not a phase — lives alongside whatever phase is active. Any session can pull from it.

---

## Current Phase

### Profiles & Dogs

**Goal:** Design and build comprehensive profile pages (self and other-user) and decide how dogs are surfaced — own pages, sub-sections, or both. Consider how profiles differ for providers vs casual users. Also includes provider profile services section deferred from Bookings phase.

**Key work:**
- Self-profile redesign — tabs, content sections, edit flow
- Other-user profile — relationship-aware content (what you see depends on connection state)
- Dog profiles/sections — own pages, inline sections, or both
- Provider profile elevation — services listing, availability, reviews (deferred P3 from Bookings phase)
- Profile completeness indicators

**Phase board:** `phases/profiles-and-dogs.md`

**Refs:** [[profiles]], [[Trust & Connection Model]], [[User Archetypes]]

---

## Upcoming Phases

### Inbox & Notifications

**Goal:** Fix inbox structure and build a complete messaging experience. Notifications needs more content types and interaction patterns. Includes deferred booking conversation items from Bookings phase.

**Key work:** Inbox conversation flow, message compose, booking proposal card (accept/counter/decline — deferred P2/L1), provider inbox actions, notification types and actions, read states.

**Refs:** [[messaging]], [[connections]], [[explore-and-care]]

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
