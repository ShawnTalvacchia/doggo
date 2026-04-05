---
category: meta
status: active
last-reviewed: 2026-04-04
tags: [roadmap, phases, planning]
review-trigger: "at the start and end of every phase"
---

# Doggo — Product Roadmap

Phases for the interactive prototype. Each phase has a kanban board in `phases/`.

**Priority:** Demo-quality prototype for user testing and investment. Build horizontally — get the full product story demoable, not one feature deep.

---

## Phase 1 — Design System & Foundation ✓

**Goal:** Clean CSS foundation, documented tokens, Tailwind v4 integrated, styleguide as source of truth.

**Status:** Complete. All CSS audited, 61 dead classes removed, 409 raw values tokenized, Tailwind v4 set up, styleguide parity verified.

**Board:** [[phase-1-design-system]]

---

## Phase 2 — App Shell & Navigation ✓

**Goal:** Restructure the app so every subsequent feature has a home. New nav, new landing page, cleaned-up signup, home feed shell.

**Status:** Complete. Nav restructured (5-tab mobile + desktop links/CTAs), landing page rewritten community-first, home/meets/schedule page shells built, signup simplified (start → profile → pet → visibility → success, role step removed in Phase 6), provider steps deferred to Profile.

**Board:** [[phase-2-app-shell]]

---

## Phase 3 — Community Core ✓

**Goal:** Build the features that make Doggo a community product — meets, connections, and the trust layer.

**Status:** Complete. Meets (browse, create, detail, group chat), connections (none → familiar → pending → connected), post-meet connect prompts, home feed (nearby meets, suggested connections, highlights), schedule populated, meet group threads.

**Board:** [[phase-3-community-core]]

---

## Phase 4 — Polish & UX ✓

**Goal:** Styling consistency, responsive refinement, interaction details, visual polish. Make the prototype feel cohesive.

**Status:** Complete. Navbar simplified, modal pattern formalised, shadow softened, create meet form flattened, status page consolidated, profile page demo nav, logo link fix.

---

## Phase 5 — Care & Profile Enhancement ✓

**Goal:** Polish the existing care/booking flows and make profiles fully functional. Complete the demo story: meets → trust → care.

**Status:** Complete. Booking detail page (status flow, pricing, reviews), profile edit mode (bio, pets, visibility), unified profile layout (own + explore share structure), provider trust signals (connection badges, relationship-aware CTAs), explore interactive map (Leaflet + price markers), 1:1 direct messaging (conversation types, split inbox), enhanced pet profiles (energy, play styles, socialisation, vet info, photo gallery).

**Board:** [[phase-5-care-profile]]

---

## Phase 6 — Audit & Alignment ✓

**Goal:** Review everything built in Phases 1–5 against the updated strategy and feature docs. Identify gaps, inconsistencies, and polish opportunities. No new features — refine what exists.

**Key outcomes:**
- Audit every page against updated strategy docs and feature specs
- Home page overhaul — more welcoming, more photos, community-focused, features-forward
- Landing page review — does it communicate the community thesis clearly?
- Signup flow review — does it match current strategy (no provider role, visibility choice)?
- Visual consistency pass — do all pages feel like one product?
- Navigation review — do labels, ordering, and flows match the strategy?
- Component and token cleanup — any drift or dead code from Phases 1–5?
- Final doc update pass — ensure all docs match what's actually built

**Progress (March 2026):**
- ✅ Desktop nav: added "Offer Care" link to `/profile`
- ✅ Signup: removed Role step, flow is now `start → profile → pet → visibility → success`
- ✅ `/explore` redirect: bare route now redirects to `/explore/results`
- ✅ Home page overhaul: personalised greeting, dog photos, community-first CTAs, neighbourhood highlights
- ✅ Landing page overhaul: hero photo with "Your dog's neighbourhood crew" tagline, "Does your dog have a community?" emotional hook, photo-based meet cards, how-it-works tabs, archetype two-column section (Regular/Connector/Organiser), care-from-community section, testimonials, bottom CTA. Dog-first copy direction throughout.
- ✅ Feature docs: updated meets.md, signup-reference.md; created landing-page.md feature spec
- ✅ Product Vision: added Brand Voice & Positioning section
- ✅ Phase 5 board marked complete
- ✅ Component inventory updated with new landing components
- ✅ CONTRIBUTING.md updated with reviews doc category
- Remaining: visual consistency pass, component/token cleanup, navigation review

**Board:** [[phase-6-audit-alignment]]

**Approach:**
1. Page-by-page audit: screenshot each page, compare against feature docs, note gaps
2. Prioritise fixes by demo impact (home page and landing page are the biggest opportunities)
3. Implement fixes
4. Final doc update pass

---

## Phase 7 — Community-Native Care ✓

**Goal:** Rethink the booking/care layer through the community/dog-first lens. Provider setup, care discovery, booking conversations, and payment should feel like natural extensions of the community.

**Status:** Complete. Provider onboarding via profile edit mode, community-first care discovery, relationship context in booking conversations, payment mock with platform fee, trust signals throughout booking flow.

**Board:** [[phase-7-community-care]]

---

## Phase 8 — Community Feel & Empty States ✓

**Goal:** Make the prototype feel alive for new users and strengthen the psychological hooks that turn one-time visitors into regulars.

**Status:** Complete. Neighbourhood identity (Vinohrady, Letná, etc.), social proof stats, activity indicators on MeetCards, new-user welcome state on Home (toggle), onboarding payoff step, post-meet recap with photos and bulk connect, trust signal badges on profiles, share/invite modal on meets.

**Key outcomes:**
- Hyper-local neighbourhood identity throughout (not "Prague" — "Vinohrady")
- Home has two states: new-user welcome vs established-user (DEMO_NEW_USER toggle)
- MeetCards show activity indicators ("Jana joined 2h ago") and "Popular" badges
- Post-meet recap: photo gallery, stats summary, "Mark all Familiar" bulk action
- Trust signal badges on profiles ("Walked together 5 times", "Known since Nov 2025")
- Signup success previews nearby meets and neighbourhood activity
- Share/invite modal on meet detail with copy link

**Board:** [[phase-8-community-feel]]

---

## Phase 9 — Groups & Belonging ✓

**Goal:** Build persistent communities (groups) — the feature that turns meets from one-off events into ongoing belonging.

**Status:** Complete. Communities browse page, detail page (members, meets, chat, gallery), create form, "Your communities" on Home, meet-group cross-links, shared MessageBubble component.

**Board:** [[phase-9-groups-belonging]]

---

## Phase 10 — Home Feed & Social Posts ✓

**Goal:** Transform Home into a social feed and introduce user-authored posts (photos + tagging) as a core content type. Rework Profile to surface posts prominently.

**Status:** Complete. Home page rebuilt as social feed (10 card types), personal + community posts with photo grids and tagging (dogs/people/communities/places), paw-print reactions, post composer, tag autocomplete, profile rework (About/Posts/Services tabs with tag approval setting and care CTAs), community model upgraded to three-tier visibility (open/approval/private) with permanent setting and photo policy, FAB + share bar + upcoming strip, new-user feed variant.

**Key outcomes:**
- Home is a scrollable social feed, not a section dashboard
- Two post types: personal (to connections) and community (to members)
- Four tag types (dog, person, community, place) with autocomplete search
- Tag approval per-user setting (auto/approve/none)
- Community visibility: open/approval/private (permanent once created)
- Photo policy per community (encouraged/optional/none)
- Profile tabs: About | Posts | Services (reviews merged into Services)
- 10 feed card types: personal post, community post, meet recap, upcoming meet, connection activity, connection nudge, care prompt, milestone, dog moment, care review
- ~30 new component files, ~11 modified files

**Board:** [[phase-10-home-feed]]

---

## Phase 11 — Booking & Care Polish ✓

**Goal:** Make the booking and care flows demo-ready. Enforce connection-based trust gating, add payment mock, consolidate provider setup, and add booking management actions.

**Status:** Complete. Connection gating enforced (TrustGateBanner + disabled CTAs for non-connected users), payment mock checkout page (price breakdown + 12% platform fee + mock Visa payment), provider setup consolidated (all Offer Care links → /profile?tab=services), owner booking actions (cancel with reason, request modification, message carer), care bookings section on Schedule page.

**Deferred to Phase 12:** Carer-side inbox actions (accept/decline/counter inquiry), provider dashboard/earnings, availability calendar/filtering, explore results redesign.

**Board:** [[phase-11-booking-care-polish]]

---

## Phase 12 — Demo Ready ✓

**Goal:** Close the last functional gap (carer inbox actions), clean up the design system and CSS, extract inlined components, and polish UX consistency — leaving the codebase ready for a Figma design pass.

**Key outcomes:**
- Carer inquiry response flow in inbox (accept/decline/suggest changes)
- Incoming requests on Schedule page for carers
- Component extraction: ThreadClient.tsx (664→<300 lines), profile/page.tsx (1,438→<600 lines)
- Dead CSS audit (globals.css 9,720→<8,000 lines)
- Inline style migration on 5 priority pages
- EmptyState component + ButtonAction adoption pass

**Board:** [[phase-12-demo-ready]]

---

## Phase 13 — Meet Type Enrichment ✓

**Goal:** Flesh out meet types (Walk, Park Hangout, Playdate, Training) with type-specific fields so the demo shows fully differentiated event experiences — not just four labels on the same form.

**Key outcomes:**
- Type-specific data model: Walk (pace/distance/terrain/route), Park Hangout (drop-in window/amenities/vibe), Playdate (age range/play style/fenced/max dogs), Training (skill focus/experience level/trainer info/equipment)
- Shared enhancement fields: energy level, what to bring, accessibility notes
- Conditional creation form sections per type
- MeetCard type summary pills
- Detail page type-specific sections
- All 6 mock meets enriched with type-specific data

**Board:** [[phase-13-meet-type-enrichment]]

---

## Phase 14 — Community & Activity Restructure ✓

**Goal:** Elevate communities as a first-class navigation concept, consolidate meets + schedule into a unified "Activity" tab, and add group chat enhancements (join-gated empty states, auto-generated activity, event card strip).

**Key outcomes:**
- Navigation restructure: Home | Communities | Activity | Inbox | Profile (mobile), Communities + Activity replace Meets + Schedule
- `/communities` route (moved from `/groups`), user-facing term "community" throughout
- `/activity` page with three tabs: Discover (meet browse), My Schedule (upcoming + past), Bookings (care arrangements)
- Join-gated chat: EmptyState with Join CTA when non-member views community or meet chat
- Auto-generated system messages in community chat (member joined, meet posted, RSVP milestones)
- Event card strip: horizontal scroll of upcoming meets at top of community chat

**Board:** [[phase-14-community-activity-restructure]]

---

## Phase 15 — Trust, Connections & Mock Data Quality ✓

**Goal:** Refine the connection model UX, redesign meet participant lists as a social discovery surface, add share-profile linking, and replace all Unsplash mock images with generated assets authentic to Prague.

**Key outcomes:**
- Single visibility toggle governs all content including care services (no separate care setting) + informational banner for locked providers
- Share profile link for direct IRL-to-app connections (`/connect/[code]`)
- Redesigned meet participant list: tiered by relationship (Connected → Familiar/Open → hidden count), rich cards with relationship context and mutual connections
- Going / Interested RSVP states on meets
- Post-meet participant reveal (hidden attendees surfaced with Familiar/Connect actions)
- Locked profile view for non-Familiar viewers (blurred avatar + explanation)
- Connection state icon system (Phosphor icons, not text pills)
- All Unsplash mock images replaced with AI-generated images matching Prague context and mock data characters
- Default avatar component for users without photos

**Board:** [[phase-15-trust-connections-images]]

---

## Phase 16 — Layout Redesign ✓

**Goal:** Replace the top navbar with a desktop sidebar, introduce a centered 640px content shell for all logged-in pages, and rename navigation items ("Groups", "Activities").

**Status:** Complete. Desktop sidebar nav (6 items), LoggedInShell wrapper (640px content + optional side panel), BottomNav updated (5 tabs, Groups/Activities labels, CalendarDots icon), all logged-in pages render inside new shell, doc terminology updated.

**Key outcomes:**
- Desktop sidebar nav (Home, Groups, Activities, Inbox, Find Care, Profile) replaces top AppNav for logged-in users
- LoggedInShell layout: sidebar + max-width container (640px) + optional side panel or spacer
- Mobile bottom nav updated: "Groups" (was Communities), "Activities" (was Activity), CalendarDots icon
- Find Care is desktop-sidebar-only; mobile gets contextual per-page buttons
- All logged-in pages render inside the new shell; un-migrated pages continue working

**Board:** [[phase-16-layout-redesign]]

---

## Phase 17 — Activities Tab Redesign ✓

**Goal:** Redesign the My Schedule and Services (formerly Bookings) tabs within Activities. Evolve card designs per tab context, add Upcoming/History toggle, ensure card differentiation across Discover, My Schedule, and Services.

**Status:** Complete. My Schedule redesigned with Upcoming/History toggle, CardMyMeet component with role badges (Hosting/Joining/Interested), hosting visual distinction (3px brand left border), unified timeline merging meets + bookings via BookingBlock. Bookings tab renamed to Services and rebuilt as provider dashboard (visibility status, stats strip, service cards, incoming requests, active bookings). Cross-tab card differentiation verified.

**Board:** [[phase-17-activities-tabs]]

---

## Phase 18 — Information Architecture Restructure ✓

**Goal:** Restructure the app's navigation and page hierarchy. Unify meet and care discovery under a single Discover page, elevate Schedule to top-level, create a proper Bookings hub (owner + provider), move Inbox and Profile to the mobile header bar.

**Status:** Complete. New 4-tab mobile nav (Home, Discover, My Schedule, Bookings), mobile header (logo + Inbox + avatar), 6-item desktop sidebar, unified `/discover` with Meets + Care tabs, `/schedule` as top-level page, `/bookings` hub with My Care + My Services, enhanced booking detail page, DetailHeader component, redirects from all old routes, dead code cleanup. Meets filter panel + map deferred to Phase 19.

**Board:** [[phase-18-ia-restructure]]

---

## Phase 19 — UI Rebuild & Groups Foundation ✓

**Goal:** Rebuild the app's UI around a reusable layout system. Implement the groups strategy. Rethink the home feed. Update navigation. Align all docs.

**Status:** Complete. All 8 workstreams delivered (A–H).

**Key outcomes:**
- MasterDetailShell, ListPanel, DetailPanel — reusable layout components used across Home, Schedule, Inbox
- Navigation: 5-tab mobile bottom nav (+ Profile), mobile header (create + notifications + inbox), 7-item desktop sidebar (+ Notifications)
- Home rebuilt: desktop groups panel + photo feed, mobile Feed | Groups tabs
- Feed simplified: MomentCard as primary content, Content Visibility Model (four-gate sourcing)
- Discover restructured: three-door hub (Meets, Groups, Dog Care) at `/discover`, sub-pages at `/discover/meets`, `/discover/groups`, `/discover/care`
- Schedule: Joining/Invited/Care filters, master-detail layout, search bar
- Inbox: All/Care/Groups tabs, three-column desktop (list + conversation + contact info)
- Groups data model: three archetypes (park/community/service), auto-generated park groups (6), service CTAs on meets, mock data for four user journeys (Tereza, Daniel, Klára, Tomáš)
- Strategy docs: Groups Strategy, Content Visibility Model

**Board:** [[phase-19-ui-rebuild]]

---

## Phase 20 — Polish & Alignment ✓

**Goal:** Capture recent mobile UX fixes, Discover filter rebuild, and component cleanup. Realign docs that drifted during rapid Phase 19 iteration. Audit for dead code and consolidate component inventory.

**Status:** Complete. All workstreams delivered.

**Key work:**
- Document recent fixes: scroll-hide nav, mobile panel layout, feed image caps, care filter rebuild
- Add 5 missing components + 1 hook to component inventory
- Update feature docs (explore-and-care, care-discovery flow) to reflect DiscoverShell and interactive filters
- Component audit: identify and remove orphaned legacy components (DiscoverTab, ServicesTab, CareTab)
- Refresh stale implementation docs (design-tokens, signup-reference)

**Board:** [[phase-20-polish-and-alignment]]

---

## Phase 21 — Pages & Content Build-out (active)

**Goal:** Flesh out inner content across all app pages. Bring Discover Meets and Groups up to the same interactive filter level as Care. Migrate Bookings and Notifications to shared layout system. Build Notifications from scratch.

**Status:** Active.

**Key work:**
- Discover/Meets: interactive filter panel, map, mobile tab switching
- Discover/Groups: interactive filter panel, results filtering
- Notifications: full build-out from stub (notification types, list, detail, mock data)
- Bookings: migrate to MasterDetailShell layout
- Page polish: wire UpcomingPanel, booking detail view, schedule detail enrichment

**Board:** [[phase-21-pages-and-content]]

---

## Out of Scope

Not built, not demoed:
- Real payment processing (Stripe)
- Cross-city expansion / i18n
- Mobile native app
- Real-time location / route tracking
- Algorithmic matching
- Referral programs
- Insurance / liability

---

## Principles for phasing

1. **Each phase starts and ends with a doc review.** Read all docs, update stale ones, archive completed ones, raise new questions in [[Open Questions]].
2. **Tasks reference docs.** Every task card links to the docs it should consult.
3. **No phase ships without styleguide parity.** If a phase adds components or tokens, the styleguide must be updated before the phase closes.
4. **Demo-first.** When in doubt, prioritise what makes the product story more convincing, not what's technically deepest.
