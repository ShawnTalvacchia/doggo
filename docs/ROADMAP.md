---
category: meta
status: active
last-reviewed: 2026-04-12
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

Profiles & Dogs phase: Unified three separate profile pages (own, other-user, provider) into one PageColumn + TabBar pattern. Own profile rewritten with inline hero on About tab. Other-user profile with DetailHeader, connection-gated CTA pill buttons (Message/Book/Connect/disabled). PetCard expand/collapse with `defaultExpanded` prop. Provider profile route (`/discover/profile/[providerId]`) redirected to `/profile/[userId]` via `userId` bridge field on ProviderCard. Services tab shows provider data from multiple sources. ~200 lines dead CSS removed (old profile shell, header, desktop two-column layout). ProfileHeader and ProfileHeaderOwn components deleted. Deferred: profile completeness indicator, empty state design.

Inbox & Notifications phase: Chat-on-profiles architecture — profiles became the relationship hub with About, Posts, Services, Chat tabs. Conversations collapsed to one thread per user pair (booking + direct merged). Inbox rewritten as connections list with search, linking to `/profile/[userId]?tab=chat`. ThreadClient embedded mode for profile tab. All 13 notification types with distinct icons and specific hrefs. Notification grouping (stacked avatars for same-type/same-href clusters). Booking conversation flow end-to-end: inquiry → provider response → proposal → accept/decline → contract card. Mobile nav search pattern (search icon → input toggle in detail header). Profile subpage pattern (bottom nav hidden, detail header with back). Provider bubble and chat body background fixes. Booking proposal card redesigned with status-info-main header, ButtonAction components.

Full history in `archive/phases/`. Key outcomes:

- **Navigation:** Community | Discover | My Schedule | Bookings | Profile (mobile). 7-item desktop sidebar. Neutral active state (transparent-dark-4). CTA pill buttons for header actions.
- **Layout:** All pages use PageColumn (640px centered single column). DetailHeader for drill-down pages with abovePanel prop.
- **Groups:** Four types (park/neighbor/interest/care) with type-specific detail tabs. Care groups have provider badges, service listings, gallery modes.
- **Meets:** Four types (walk/park hangout/playdate/training) with type-specific fields. Interactive RSVP cycle. Photo gallery on completed meets.
- **Discover:** Three-door hub → results with FilterPillRow + floating Filters button. No more type picker pages.
- **Care:** Provider profiles, booking conversations, payment mock, trust-gated CTAs. "Carer" badge on feed cards.
- **Inbox:** Connections list with search. Chat lives on profiles as a tab. One thread per user pair.
- **Notifications:** 13 types with icons, grouping, stacked avatars, specific navigation hrefs.
- **Schedule:** Unified timeline with accent-border hosting/providing cards, action verb labels, care sub-filter pills (All/Getting Care/Providing), interested auto-populated from groups.
- **Bookings:** Tabbed detail page (Info / Sessions / Chat) for owner and provider. Rolling weekly billing. Session check-in/check-out for providers. Aggregate stats. Redesigned list cards with avatar combos, Tag icons, clean divider-free design.

---

## Current State — Honest Assessment

*(Updated 2026-04-13 after Inbox & Notifications phase)*

The prototype is feature-rich with consistent layout and interactions across all pages. Every page uses PageColumn, has real content, and working interactions. The design system is stable. Chat now lives on profiles as a tab (profiles are the relationship hub). Inbox rewritten as a connections list. Notifications have all 13 types with grouping. Booking conversation flow works end-to-end (inquiry → proposal → accept → contract).

**Works well:** Chat-on-profiles architecture, interactive RSVP, schedule cards, Discover flow, community feed, booking detail with tabbed layout, booking list cards, photo gallery on meets, scroll-to-hide nav, unified profiles with connection-gated CTAs, PetCard expand/collapse, notification grouping, mobile nav search pattern.

**Data layer:** 20 users, 24 meets, 18 groups, 35+ posts, 13 reviews, 10 bookings, 12 connections, 8 conversations, 20 notifications. All cross-referenced and TypeScript-clean.

**Needs deep work (page-by-page):**
- Profiles — About tab thin, Services tab needs richer content, Posts tab missing attribution and corner radius
- Meets — need significant work across the board
- Community feed + groups — feeds need to feel alive for the demo world
- Post composer — modal layout is broken
- Design system — ButtonAction variant system needs rethinking (destructive as modifier, not standalone)

**Known bugs on Polish Log:** See `phases/polish-log.md`

---

## Polish Log (permanent)

`phases/polish-log.md` — running list of UI tweaks and small bugs. Not a phase — lives alongside whatever phase is active. Any session can pull from it.

---

## The Arc

**Where we are:** The full product skeleton exists. Every page renders, has real content, and basic interactions work. But many pages are 60-70% — they tell the story at a glance but don't hold up under scrutiny.

**Where we're going:** A world that feels real. When a tester sits down with a persona, they should forget they're looking at a prototype. The data, the interactions, the visual quality, the flow between pages — all of it should feel like a product people actually use.

**The demo is the finish line, not the next step.** Between now and then: deep page-by-page passes, design system maturation, mock world building, cross-cutting flow testing, and finally the demo presentation layer.

---

## Current Phase

### Profiles Deep Pass

**Status:** Phase board created, opening checklist pending.

**Phase board:** `phases/profiles-deep-pass.md`

---

## Upcoming Phases

Phases are deep passes — each one takes a major surface and makes it the best it can be. Not just polish: rethink content, fix visual issues, consider what's missing, add depth to mock data.

### Profiles Deep Pass

**Goal:** Make profiles feel like real people with real lives. The profile is the relationship hub — About, Posts, Services, Chat — it needs to be the strongest page in the app.

**Key work:**
- About tab — richer content, better layout, trust signals that tell a story
- Services tab — fuller content (user has a detailed list to provide)
- Posts tab — fix corner radius, add group/meet/care attribution to post headers, add link matching main feed
- Own profile — review edit flows, provider setup experience
- Post composer — fix broken modal layout
- Consider: what makes someone look at a profile and think "I'd trust this person with my dog"?

### Meets Deep Pass

**Goal:** Meets are the core trust-building mechanic. They need to feel compelling — like events you'd actually want to attend.

**Key work:**
- Meet detail page review — does it make you want to go?
- Meet creation flow
- Post-meet review flow (Familiar marking — see Trust & Connection Model)
- Photo gallery and social proof
- Attendee list with connection-aware visibility
- Consider: what information would you want before deciding to attend?

### Community & Groups Deep Pass

**Goal:** The daily experience. Groups and feeds need to feel alive and useful.

**Key work:**
- Group feeds — enough content to feel like real communities
- Group detail pages — do they communicate what the group is about?
- Community feed composition — what appears and why
- Group creation and management flows
- Consider: would Daniel lurk here for two weeks? Would Tomáš post an emergency request?

### Discover & Care Deep Pass

**Goal:** The monetization story. Finding care from people you know should feel natural, not transactional.

**Key work:**
- Provider discovery flow — from Discover hub through to booking
- Provider profile → services → booking CTA flow
- Care group detail with booking CTAs on meets
- Filter and search refinement
- Consider: does this feel like community-wrapped service, or a marketplace?

### Schedule & Bookings Deep Pass

**Goal:** The operational backbone. Where trust becomes action.

**Key work:**
- Booking detail review
- Session management polish
- Schedule timeline — does it feel useful as a daily tool?
- Care history and continuity signals

### Design System Maturation

**Goal:** Clean up design debt accumulated across passes.

**Key work:**
- ButtonAction variant system — destructive as modifier, not standalone
- Component audit — are we using our own components consistently?
- Token audit — any orphans or inconsistencies?
- Tab bar and glassmorphism refinement
- Runs alongside other phases, not a standalone block

### Mock World Building

**Goal:** Create a coherent world where the four personas (Tereza, Daniel, Klára, Tomáš) have rich, interconnected lives.

**Key work:**
- Plan which users have which dogs, attend which meets, are in which groups
- Map the cross-connections (Daniel books Klára, Tomáš books Petra, etc.)
- Image generation plan — coordinated so the same dogs/people appear across contexts
- Enough group feed content that communities feel alive
- Posts, reviews, booking histories that tell stories

### Cross-Cutting Flow Testing

**Goal:** Every journey from the User Journeys deck should work end-to-end.

**Key work:**
- Walk each persona's journey through the app
- Tereza: park group → neighbourhood group → casual care listing
- Daniel: interest group → lurking → meets → booking Klára
- Klára: service group creation → meets with booking CTAs → client growth
- Tomáš: park groups → neighbourhood group → emergency booking
- Fix dead ends, missing links, awkward transitions

### Demo Presentation

**Goal:** The final layer. Make the prototype presentable to someone who's never seen it.

**Key work:**
- Demo landing page (separate from app landing page)
- Persona selection — introduce the user, log them in, orient them
- Guided tour or scripted scenarios per persona
- Four personas: Tereza, Daniel, Klára, Tomáš (aligned with User Journeys deck)
- The world should be rich enough that free exploration is also rewarding

**Refs:** [[User Archetypes]], [[Product Vision]], [[mock-data-plan]]

---

## Beyond the Demo

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
3. **Build the best version, not the fastest.** Take time to consider what could improve the product. Quality over speed.
4. **Think like a user.** Every page should pass the test: would a real person find this useful, clear, and trustworthy?
5. **Continuously review and improve.** Don't just build forward — look back at what exists and find ways to make it better.
6. **The demo is the finish line, not the next step.** Every phase between now and demo makes the world richer and more convincing.
