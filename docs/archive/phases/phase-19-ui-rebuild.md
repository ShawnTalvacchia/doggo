---
category: phase
status: complete
last-reviewed: 2026-04-04
tags: [phase-19, ui-rebuild, layout, groups, feed, navigation, reusable-components]
review-trigger: "when modifying page layouts, navigation, feed content, or core layout components"
---

# Phase 19 — UI Rebuild & Groups Foundation

**Goal:** Rebuild the app's UI around a reusable layout system derived from the new designs. Implement the groups strategy (three archetypes: Park, People, Help). Rethink the home feed as a photo-focused stream tied to groups and connections. Align all docs to new strategy decisions.

**Depends on:** Phase 18 (IA restructure complete), new strategy docs (Groups Strategy, Content Visibility Model)

**New strategy docs created this session:**
- `docs/strategy/Groups Strategy.md` — three group archetypes, user journeys, provider groups, friendship-meets-contract model
- `docs/strategy/Content Visibility Model.md` — two-gate visibility system (context gate + relationship gate), tagging privacy rules

---

## Doc Audit — What's Misaligned

This section captures everything that's drifted based on today's strategy and UI decisions. Updates happen in Workstream G.

### Navigation (Information Architecture.md + phase-18)

| Current doc says | New UI shows | Change needed |
|---|---|---|
| Mobile bottom: Home, Discover, My Schedule, Bookings (4 tabs) | Home, Discover, My Schedule, Bookings, Profile (5 tabs) | Profile moves from header to bottom nav |
| Mobile header: logo + Inbox icon + avatar | Logo area + "+" create button + notifications bell + chat/inbox icon | Header becomes create + notifications + messaging |
| Desktop sidebar: Home, Discover, My Schedule, Bookings, Inbox, Profile (6 items) | Home, Discover, My Schedule, Bookings, Inbox, Notifications, Profile (7 items) | Add Notifications as separate sidebar item |
| Discover tabs: Meets \| Care | Discover entry: Meets / Groups / Dog Care (three doors, not tabs) | Discover becomes a hub with three category cards, not a tabbed page |
| Home feed: greeting + upcoming strip + 11-card social feed + FAB | My Groups panel (desktop left) + photo feed (right). Mobile: Feed \| Groups tabs, no upcoming strip | Major home page restructure |

### Home Feed (Phase 10 spec, meets.md, profiles.md)

| Current doc says | New direction | Change needed |
|---|---|---|
| 11 feed card types (personal post, community post, meet recap, upcoming meet, connection activity, connection nudge, care prompt, milestone, dog moment, care review) | Photo moments from connections + joined groups as primary content. Possibly upcoming meet cards. No connection activity, nudges, milestones, care prompts in feed. | Dramatically simplify feed card types |
| FAB "+" creates posts | "+" in header is universal create (meet or moment) | Change create action location and scope |
| "Add Post" button in greeting header | "Want to share a moment?" bar with Post CTA | Restyle share prompt |
| Upcoming strip on mobile Home | Upcoming lives in My Schedule only | Remove upcoming strip from Home |
| Desktop: upcoming side panel | Desktop: My Groups panel on left | Replace side panel content |

### My Schedule (schedule.md)

| Current doc says | New direction | Change needed |
|---|---|---|
| Upcoming / History toggle + type filter pills (All/Walks/Park Hangouts/Playdates/Training) | Joining / Invited / Care filters + search bar | Replace toggle and filters |
| Desktop: single-column timeline | Desktop: master-detail (list left, meet detail right) | Add detail panel |

### Discover (explore-and-care.md, meets.md)

| Current doc says | New direction | Change needed |
|---|---|---|
| Two tabs: Meets \| Care | Three entry cards: Meets, Groups, Dog Care | Restructure as hub with category navigation |
| Care tab is flat provider list | Care drills into: Walks & check-ins, In-home sitting, Boarding (subcategories) | Add care type selection step |
| Groups discovery only in Home > Groups tab | Groups also discoverable through Discover | Add Groups as Discover category |

### Groups (meets.md)

| Current doc says | New direction | Change needed |
|---|---|---|
| Two visibility types: Public, Private | Three archetypes: Park (auto-generated, open), People (user-created, defaults private), Help (provider-created, service CTAs) | Major expansion of group model |
| Open questions about admin, creation rights, size limits | Resolved: Park groups have no admin, People groups have creator as admin, Help groups have provider as admin | Update with resolved decisions |
| No mention of auto-generated groups | Auto-generated park groups at launch | Add concept |
| No mention of service CTAs on meets | Provider groups can attach service CTAs (booking link, pricing, spots) to meets | Add service group mechanics |
| Photo gallery listed as "future" | Photo gallery is core (moments from meets/groups drive the feed) | Elevate from future to current |

### Profiles (profiles.md)

| Current doc says | New direction | Change needed |
|---|---|---|
| Posts tab shows photo grid | Profile gallery should be a filtered view of all content the viewer is allowed to see (personal + shared groups + shared meets) | Update profile gallery concept |
| Personal posts visible to connections + tagged communities | Content visibility governed by two-gate model (Content Visibility Model.md) | Reference new visibility model |
| Tag approval setting: auto/review/don't allow | Tags also filtered per-viewer by relationship gate (new tagging privacy rules) | Add tag visibility rules |

### Inbox (messaging.md)

| Current doc says | New direction | Change needed |
|---|---|---|
| Tabs: Messages \| Booking Inquiries | Tabs: All \| Care \| Groups | Update inbox filtering model |
| Desktop: two-column (list + thread) | Desktop: three-column (list + thread + contact info panel with trust signals + care CTA) | Add contact info panel |
| Mobile: list → thread | Mobile: list → Chat/Info tabs within thread | Add Info tab to mobile thread view |

### CLAUDE.md

| Current says | Update needed |
|---|---|
| Current Phase: 18 — IA Restructure | Update to Phase 19 — UI Rebuild & Groups Foundation |
| Nav: Home \| Discover \| My Schedule \| Bookings (4 tabs) | Update to reflect 5 mobile tabs + new header |
| Groups under Home as tab | Groups also in Discover; group strategy expanded |

---

## Workstream Overview

| Workstream | What | Effort |
|---|---|---|
| **A — Reusable layout system** | Master-detail shell, panel components, responsive collapse pattern | High — foundation for everything |
| **B — Navigation update** | 5-tab mobile nav, new header (create + notifications + inbox), 7-item sidebar | Medium |
| **C — Home rebuild** | Desktop: groups panel + feed. Mobile: Feed \| Groups tabs. Photo-focused feed. | High |
| **D — Discover restructure** | Three-door hub (Meets, Groups, Dog Care). Care subcategories. | Medium |
| **E — My Schedule update** | New filters (Joining/Invited/Care), master-detail layout, search | Medium |
| **F — Inbox update** | All/Care/Groups tabs, three-column desktop, Chat/Info mobile tabs | Medium |
| **G — Doc alignment** | Update all misaligned docs per audit above | Medium |
| **H — Groups data model** | Three group archetypes, auto-generated groups, service group properties | Medium |

---

## Workstream A — Reusable Layout System

The new UI uses a consistent master-detail pattern across Home, My Schedule, Inbox, and Discover. Build it once, reuse everywhere.

### A1 — MasterDetailShell component

A layout component that provides the two-panel (or three-panel) pattern:

```
Desktop:
┌─────────────┬──────────────────────────┐
│  List Panel  │     Detail Panel         │
│  (fixed w)   │     (flex grow)          │
│              │                          │
└─────────────┴──────────────────────────┘

Desktop (three-column, e.g. Inbox):
┌──────────┬──────────────────┬──────────┐
│  List    │   Content        │  Info    │
│  Panel   │   Panel          │  Panel   │
└──────────┴──────────────────┴──────────┘

Mobile:
Stacked views — list is the default, tapping an item
pushes to detail (via routing or state).
```

**Props:**
- `listPanel` — React node for the left panel content
- `detailPanel` — React node for the right panel content (optional third via `infoPanel`)
- `mobileView` — "list" | "detail" | "info" to control which panel shows on mobile
- Responsive breakpoint handling built in

**Key:** This replaces the need for custom two-column layouts on every page. Home, My Schedule, Inbox, and Discover's results views all use it.

**New files:** `components/layout/MasterDetailShell.tsx`

### A2 — ListPanel component

Reusable wrapper for the left panel in master-detail layouts. Provides:
- Optional search bar at top
- Optional filter tabs/pills below search
- Scrollable list area
- Active item highlighting

Used by: Home (groups list), My Schedule (meets list), Inbox (conversations list), Discover results.

**New files:** `components/layout/ListPanel.tsx`

### A3 — DetailPanel component

Reusable wrapper for the right panel. Provides:
- Header area (title, actions)
- Scrollable content area
- Optional fixed footer

Used by: Home (feed or group feed), My Schedule (meet detail), Inbox (conversation), Discover (results + map).

**New files:** `components/layout/DetailPanel.tsx`

### A4 — Card system audit

Identify all current card components and consolidate where possible. The new UI uses fewer, more consistent card patterns:

- **MeetCard** — used in My Schedule list, group detail, feed upcoming cards
- **GroupCard** — used in Home groups panel, Discover groups results
- **ProviderCard** — used in Discover care results
- **MomentCard** — used in home feed (photo post with context tags)
- **ConversationCard** — used in Inbox list

Each should follow a consistent structure: media area + content area + metadata row + action area. Avoid one-off card components.

---

## Workstream B — Navigation Update

### B1 — Mobile bottom nav (5 tabs)

Update from current 4 tabs to 5:

| Slot | Label | Icon | Route |
|---|---|---|---|
| 1 | Home | House | `/home` |
| 2 | Discover | MagnifyingGlass | `/discover` |
| 3 | My Schedule | CalendarDots | `/schedule` |
| 4 | Bookings | Briefcase | `/bookings` |
| 5 | Profile | UserCircle (or avatar) | `/profile` |

### B2 — Mobile header redesign

Replace current header (logo + inbox + avatar) with:

```
[DOGGO logo]            [+ create] [🔔 notifications] [💬 inbox]
```

- "+" icon: opens create menu (new meet, share a moment)
- Bell: notifications with badge count, links to `/notifications`
- Chat bubble: links to `/inbox` with unread badge

### B3 — Desktop sidebar (7 items)

```
DOGGO
Home
Discover
My Schedule
Bookings
Inbox
Notifications
Profile
```

Remove: old "Find Care" item. Add: Notifications as separate item.

---

## Workstream C — Home Rebuild

### C1 — Desktop home: groups panel + feed

Replace current home page with master-detail layout:
- **Left panel (ListPanel):** "My Groups" header, list of user's groups as GroupCards. Clicking a group highlights it and loads that group's feed into the right panel.
- **Right panel (DetailPanel):** When no group selected, shows the unified feed (moments from all groups + connections). When a group is selected, shows that group's feed.
- **"Share a moment" bar** at top of feed panel.

### C2 — Mobile home: Feed | Groups tabs

- **Feed tab:** "Share a moment" bar, then photo feed (no upcoming strip, no greeting header)
- **Groups tab:** Group list with filter pills

### C3 — Feed content simplification

Replace the 11-card-type feed with a focused set:

**Primary (always present):**
- **MomentCard** — photo post with caption, author, group/meet context, location and dog tags, like button. This replaces FeedPersonalPost, FeedCommunityPost, and FeedMeetRecap as one unified component.

**Contextual (appears when relevant):**
- **UpcomingMeetCard** — optional, only if a joined/invited meet is very soon (next 24h). Lightweight, not a strip.

**Removed from feed:**
- FeedConnectionActivity, FeedConnectionNudge, FeedCarePrompt, FeedMilestone, FeedDogMoment, FeedCareReview → move relevant ones to Notifications

### C4 — Feed visibility logic

Implement feed content sourcing per Content Visibility Model:
- Moments from groups user has joined (context gate)
- Moments from connections (relationship gate for profile-origin content)
- Moments from open groups in user's neighbourhood (discovery mechanism)
- Moments from open groups that user's connections are in

---

## Workstream D — Discover Restructure

### D1 — Discover hub page

Replace tabbed Meets | Care with a hub layout:

```
Near: [Vinohrady]  [📍]

What are you interested in?
┌──────────────────────┐
│ 🐕 Meets             │
│ Short text about that │ →
├──────────────────────┤
│ 👥 Groups            │
│ Some text about that │ →
├──────────────────────┤
│ ❤️ Dog Care          │
│ Some short text      │ →
└──────────────────────┘
```

Each card navigates to a sub-page within Discover.

### D2 — Discover > Meets

Keep existing meet browse with filters + map. Route: `/discover/meets`

### D3 — Discover > Groups

New groups browse page within Discover. Route: `/discover/groups`
- Browse open groups near you
- Filter by park/neighbourhood
- Shows group cards with member count, weekly events, location

### D4 — Discover > Dog Care

Replace flat provider list with care type selection, then results:

**Step 1 — Care type selection** (`/discover/care`):
- Walks & check-ins — "Short visits at your home"
- In-home sitting — "Overnight care at your home"
- Boarding — "Your dog stays with a trusted host"

**Step 2 — Results** (`/discover/care/[type]`):
- Results / Filters tabs
- Provider cards with photo, location, rating, price, tagline
- Desktop: results + map side by side
- Filters: service type, dogs, location, date range, rate range, services, home features

---

## Workstream E — My Schedule Update

### E1 — Filter update

Replace Upcoming/History toggle + type pills with:

| Filter | Shows |
|---|---|
| Joining | Meets you've RSVP'd to |
| Invited | Meets/events you've been invited to (actionable) |
| Care | Care bookings (as owner) |

Add search bar above filters.

### E2 — Master-detail layout

Desktop: meet list on left (ListPanel), meet detail on right (DetailPanel). Clicking a meet loads its detail in the right panel. Matches the pattern from Home and Inbox.

Mobile: meet list → tap → meet detail page (existing routing).

---

## Workstream F — Inbox Update

### F1 — Inbox filter tabs

Replace Messages | Booking Inquiries with: All | Care | Groups

### F2 — Desktop three-column

Inbox uses MasterDetailShell with three panels:
- Left: conversation list (ListPanel)
- Center: active conversation (DetailPanel)
- Right: contact info panel (new InfoPanel component)

Contact info panel shows:
- Profile photo, name
- Trust signals (X meets together, Y connections, shared groups)
- If provider: "Request Care" card with service types and starting price

### F3 — Mobile Chat/Info tabs

Within a conversation, add Chat | Info tab bar:
- Chat tab: conversation messages
- Info tab: contact info panel content (same as desktop right panel)

---

## Workstream G — Doc Alignment

Update all docs per the audit table above. Each doc update follows the same pattern: update content, bump `last-reviewed` to 2026-04-04, verify cross-references.

### G1 — Strategy docs
- **Information Architecture.md** — new nav structure (5 mobile tabs, new header, 7 sidebar items), Discover as hub with three doors, home as master-detail
- **CLAUDE.md** — Phase 19, updated nav description, reference new strategy docs
- **Product Vision.md** — nav structure section

### G2 — Feature docs
- **meets.md** — three group archetypes, auto-generated groups, service groups, resolved open questions, photo gallery elevated from future
- **schedule.md** — new filters (Joining/Invited/Care), master-detail layout
- **profiles.md** — profile gallery as filtered view, reference Content Visibility Model, tag visibility rules
- **messaging.md** — All/Care/Groups tabs, three-column desktop, Chat/Info mobile tabs
- **explore-and-care.md** — Discover hub with three doors, care subcategories

### G3 — Flow docs
- Update entry points in care-discovery.md, meet-discovery.md, groups.md
- Add groups-to-Discover pathway

### G4 — Implementation docs
- **component-inventory.md** — new layout components (MasterDetailShell, ListPanel, DetailPanel), updated card inventory
- **ROADMAP.md** — close Phase 18, add Phase 19

---

## Workstream H — Groups Data Model

### H1 — Group type property

Add `groupType` to group data model: `"park" | "community" | "service"`

Each type has different defaults:
- **Park:** open, no admin, any member posts meets
- **Community:** private (default, can be set open), creator is admin, any member posts meets
- **Service:** provider is admin, only admin posts meets (with service CTAs), has "hosted by" section

### H2 — Auto-generated park groups

Create mock data for auto-generated park groups:
- Letná Dog Walks
- Stromovka Morning Crew
- Riegrovy Sady Dog Walks
- Ladronka Off-Leash
- Vítkov Park Dogs
- Kampa Island Walks

### H3 — Service group properties

Add service-specific fields to group model:
- `hostedBy` — provider user ID and profile link
- `serviceCTA` on meets — optional booking link, price, spots available
- Visual treatment: "Hosted by [provider]" section on group detail

### H4 — Mock data for user journeys

Create mock data that supports the four user journeys from Groups Strategy doc (Tereza, Daniel, Klára, Tomáš). Enough to demo each path through the UI.

---

## Implementation Order

```
Phase 19a — Layout system + navigation (foundation)
  A1  MasterDetailShell
  A2  ListPanel
  A3  DetailPanel
  B1  Mobile bottom nav (5 tabs)
  B2  Mobile header redesign
  B3  Desktop sidebar (7 items)

Phase 19b — Home rebuild + groups data
  H1  Group type property
  H2  Auto-generated park groups
  C1  Desktop home (groups + feed)
  C2  Mobile home (Feed | Groups tabs)
  C3  Feed content simplification
  A4  Card system audit

Phase 19c — Schedule + Discover + Inbox
  E1  Schedule filter update
  E2  Schedule master-detail
  D1  Discover hub page
  D2  Discover > Meets (adapt existing)
  D3  Discover > Groups
  D4  Discover > Dog Care (subcategories)
  F1  Inbox filter tabs
  F2  Inbox three-column desktop
  F3  Inbox Chat/Info mobile tabs

Phase 19d — Groups depth + feed logic + polish
  H3  Service group properties
  H4  Mock data for user journeys
  C4  Feed visibility logic
  G*  All doc updates
```

**Why this order:**
- Layout system first — everything depends on MasterDetailShell
- Nav second — establishes the new structure users navigate
- Home is the highest-impact page and validates the layout system
- Schedule/Discover/Inbox can be parallelized since they're independent pages using the same layout system
- Groups depth and feed visibility are the final layer — they need the pages in place first
- Docs last — update once the implementation is settled

---

## Reusable Component Principles

This phase prioritizes building fewer, more flexible components over many specialized ones:

1. **One layout shell, many configurations.** MasterDetailShell handles Home, Schedule, Inbox, and Discover results — same component, different content.
2. **One card base, styled variants.** Cards share structure (media + content + metadata + actions) with variant-specific content, not entirely separate components.
3. **Composition over custom components.** ListPanel + filter tabs + card list is a pattern, not a component. Each piece is independent and recombinable.
4. **Mobile collapse is built into the shell.** Individual pages don't manage their own responsive behavior — MasterDetailShell handles it.

---

## Verification Checklist

- [x] MasterDetailShell renders correctly at all breakpoints
- [x] Mobile: 5 bottom nav tabs work
- [x] Mobile: header shows create + notifications + inbox icons
- [x] Desktop: 7-item sidebar
- [x] Home desktop: groups panel + feed, clicking group loads group feed
- [x] Home mobile: Feed | Groups tabs, no upcoming strip
- [x] Feed shows photo moments from groups + connections (not 11 card types)
- [x] Discover: three-door hub (Meets, Groups, Dog Care)
- [x] Discover > Care: subcategory selection → results
- [x] My Schedule: Joining / Invited / Care filters
- [x] My Schedule desktop: master-detail layout
- [x] Inbox: All / Care / Groups tabs
- [x] Inbox desktop: three-column (list + conversation + contact info)
- [ ] Inbox mobile: Chat / Info tabs within conversation (deferred — inline detail view built instead)
- [x] Groups data model supports park/community/service types
- [x] Auto-generated park group mock data exists
- [x] All docs updated per audit
- [x] CLAUDE.md reflects Phase 19
