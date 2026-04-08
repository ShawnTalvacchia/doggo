---
category: strategy
status: active
last-reviewed: 2026-04-04
tags: [ia, navigation, structure, sitemap]
review-trigger: "before adding new top-level pages, changing navigation, or restructuring routes"
---

# Doggo — Information Architecture

Defines the app's page structure, navigation, and how users move between sections. This is the source of truth for routing, nav components, and page-level layout decisions.

---

## Design Principles

1. **Community first, care second.** The nav should make social features feel primary and care features feel like a natural extension — never the other way around.
2. **Every page earns its spot.** Top-level nav slots are precious (especially mobile). A page needs daily-use potential or strategic importance to justify one.
3. **Hub pages orient, detail pages focus.** Hubs show nav and help you decide what to do. Detail pages remove nav and let you focus on one thing.
4. **Desktop can breathe, mobile must prioritise.** The sidebar has room for 7 items. The bottom nav has 5. The mobile header adds 3 more (Create, Notifications, Inbox). Design for mobile constraints first.

---

## Navigation Structure

### Mobile

```
┌──────────────────────────────────────────────────────────┐
│  DOGGO                   [Create +] [🔔 Notifs] [💬 Inbox]│  ← top bar (hub pages only)
├──────────────────────────────────────────────────────────┤
│                                                          │
│                     Page content                         │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  Home | Discover | My Schedule | Bookings | Profile      │  ← bottom nav (hub pages only)
└──────────────────────────────────────────────────────────┘
```

**Bottom nav (5 tabs):**

| Slot | Label | Icon | Route | Purpose |
|------|-------|------|-------|---------|
| 1 | Home | House | `/home` | Feed + Groups (master-detail on desktop, tabbed on mobile) |
| 2 | Discover | MagnifyingGlass | `/discover` | Three-door hub: Meets, Groups, Dog Care |
| 3 | My Schedule | CalendarDots | `/schedule` | Your upcoming meets + bookings timeline |
| 4 | Bookings | Briefcase | `/bookings` | Care management (as owner + as provider) |
| 5 | Profile | UserCircle | `/profile` | Your profile, dogs, settings, provider dial |

**Top bar (3 icons):**

| Position | Element | Action |
|----------|---------|--------|
| Left | DOGGO logo | Link to `/home` |
| Right 1 | Create (+) button (Plus icon) | Opens post composer |
| Right 2 | Notifications bell (Bell icon) | Link to `/notifications`, unread badge |
| Right 3 | Inbox chat icon (ChatCircleDots) | Link to `/inbox`, unread badge |

**Why this arrangement:** 5 bottom nav + 3 header icons = 8 access points. Home uses MasterDetailShell (groups panel + feed on desktop, Feed | Groups tabs on mobile). Discover is a three-door hub (Meets, Groups, Dog Care) — not a tabbed layout. Groups lives under both Home and Discover because browsing groups is infrequent — users join a few then interact within them from the feed. Schedule stays top-level because it bridges digital engagement into real-world action (meets + care bookings). Profile moves to the bottom nav for easier access. Create, Notifications, and Inbox live in the header — always visible and one tap away.

### Desktop

```
┌───────────────┬──────────────────────────────────────┐
│  DOGGO        │                                      │
│               │                                      │
│  Home         │          Page content                │
│  Discover     │     (max-width constrained)          │
│  My Schedule  │                                      │
│  Bookings     │                                      │
│  Inbox        │                                      │
│  Notifications│                                      │
│  Profile      │                                      │
│               │                                      │
└───────────────┴──────────────────────────────────────┘
```

Desktop sidebar shows all 7 items (200px). Groups is accessed via Home > Groups panel or Discover > Groups card.

---

## Page Inventory

### Hub Pages

Hub pages show the full navigation (bottom nav + top bar on mobile, sidebar on desktop). They're orientation pages — "where am I, what can I do?"

| Page | Route | Tabs / Sections | Notes |
|------|-------|-----------------|-------|
| **Home** | `/home` | Feed \| Groups (mobile tabs) or Groups panel + Feed (desktop MasterDetailShell) | **Master-detail hub.** Feed shows MomentCards + occasional upcoming meet. Groups panel/tab for browse and manage. |
| **Discover** | `/discover` | Three doors: Meets, Groups, Dog Care | **Restructured (Phase 19).** Hub with three illustrated cards linking to sub-pages (`/discover/meets`, `/discover/groups`, `/discover/care`). Not a tabbed layout. |
| **My Schedule** | `/schedule` | Upcoming \| History | **Moved.** Personal timeline of meets + bookings |
| **Bookings** | `/bookings` | My Care \| My Services | **Restructured.** Both sides of care arrangements |
| **Inbox** | `/inbox` | Messages \| Booking Inquiries | Conversation list (hub on mobile too, accessed via header icon) |
| **Profile** | `/profile` | About \| Posts \| Services | Your profile, dogs, settings, provider dial |

### Detail Pages

Detail pages replace the nav with a focused header: `← Back | Page Title | (optional action)`. On mobile, no bottom nav. On desktop, the sidebar remains but the content area takes focus.

| Page | Route | Back target | Notes |
|------|-------|-------------|-------|
| **Group detail** | `/communities/[id]` | `/home?tab=groups` | Group feed, members, meets, chat |
| **Group chat** | `/communities/[id]` (chat tab) | Group detail | Real-time group messaging |
| **Create group** | `/communities/create` | `/communities` | Multi-step form |
| **Meet detail** | `/meets/[id]` | Previous page | Attendees, details, RSVP |
| **Create meet** | `/meets/create` | Previous page | Multi-step form |
| **Post-meet connections** | `/meets/[id]/connect` | Meet detail | Reveal + connect flow |
| **Message thread** | `/inbox/[conversationId]` | `/inbox` | Individual conversation |
| **Booking detail** | `/bookings/[id]` | `/bookings` | **Enhanced.** Dashboard with contract, sessions, chat link |
| **Booking checkout** | `/bookings/[id]/checkout` | Booking detail | Payment mock |
| **Provider profile** | `/discover/profile/[id]` | Discover > Care | Provider info, services, reviews |
| **Other user profile** | `/profile/[userId]` | Previous page | Public profile view |
| **Create post** | `/posts/create` | Previous page | Photo + caption composer |
| **Share link** | `/connect/[code]` | — | Deep link landing |

### Guest Pages (no logged-in nav)

| Page | Route | Notes |
|------|-------|-------|
| Landing | `/` | Marketing page |
| Sign in | `/signin` | Auth |
| Signup flow | `/signup/*` | Multi-step onboarding |

---

## Key Page Definitions

### Home (master-detail — Groups + Feed)

**Route:** `/home`
**Desktop:** Groups panel (left, via ListPanel) + Feed (right, via DetailPanel) using MasterDetailShell
**Mobile:** Feed | Groups tabs

The user's daily hub. "What's happening in my world?"

**Feed** (`/home` or `/home?tab=feed` on mobile)
- Personalised greeting with dog avatars
- MomentCard as primary content type (photo moments with captions, tags, reactions)
- Occasional upcoming meet cards
- Content sourced via two-gate visibility model (context gate + relationship gate)

**Groups** (`/home?tab=groups` on mobile, left panel on desktop)
- Browse and manage groups (replaces standalone `/communities` page)
- Filter pills: All, Your Groups, Open, Approval, Private
- "Your groups" section + "Discover" section for public groups
- GroupCard with type badges (Park, Hosted)
- Create group CTA

**Why groups live here:** Browsing groups is an infrequent action — users join a few, then interact within them from the feed. Groups don't earn a permanent bottom nav slot. Moving them into Home keeps the nav focused on daily-use pages while keeping groups one tap + one tab away. Groups are also accessible via Discover hub > Groups card.

### Discover (three-door hub)

**Route:** `/discover`
**Layout:** Three illustrated cards (not tabs)

The "what's out there?" page. Three doors, each linking to a dedicated sub-page.

**Meets card** → `/discover/meets`
- Browse all upcoming meets
- Filter by type (Walk, Park Hangout, Playdate, Training), neighbourhood, date
- Map view showing meet locations
- Cards link to meet detail pages
- "Create a Meet" CTA

**Groups card** → `/discover/groups`
- Browse all groups
- Filter by archetype (Park, Community, Service), neighbourhood
- GroupCard with type badges

**Dog Care card** → `/discover/care`
- Browse care providers (current `/explore/results` content)
- Filter by service type, price, availability, distance
- Map view showing provider locations
- Cards link to provider profile pages
- Community carers section (connected users who offer care)

**Why three doors:** Discover covers three distinct intents (social events, persistent communities, paid care). A hub page with clear doors orients users better than tabs — each door has its own browse/filter experience behind it.

**What moves here:**
- Activities > Discover tab content → Discover > Meets card
- `/explore/results` content → Discover > Dog Care card
- "Find Care" sidebar item → Discover (Dog Care card)
- Groups browse → Discover > Groups card (in addition to Home > Groups tab)

### My Schedule (elevated to top-level)

**Route:** `/schedule`
**Nav label:** "My Schedule"
**Toggle:** Upcoming | History
**Filters:** All / Walks / Park Hangouts / Playdates / Training

Your personal timeline. "What am I doing this week? What have I done?"

Merges meets and care bookings into a single chronological view. Uses CardMyMeet for meets (with role badges) and BookingBlock for bookings. This is the current `MyScheduleTab` content, promoted from a sub-tab to a full page.

**What moves here:**
- Activities > My Schedule tab → `/schedule` (top-level page)

### Bookings (restructured as top-level)

**Route:** `/bookings`
**Tabs:** My Care | My Services

The care arrangement management hub. Both sides of the coin.

**My Care tab** (`/bookings?tab=care`)
"What care am I receiving?"
- Active bookings where you're the owner
- Past/completed bookings
- "Find Care" CTA when empty
- Each booking links to its detail page

**My Services tab** (`/bookings?tab=services`)
"What care am I providing?"
- Current `ServicesTab` content: visibility status, stats, service cards, requests, active bookings
- Each booking links to its detail page
- Service config links to profile

**What moves here:**
- Activities > Services tab → Bookings > My Services
- Owner bookings (previously inline in schedule) → Bookings > My Care
- Booking detail pages remain at `/bookings/[id]`

### Booking Detail Page (enhanced)

**Route:** `/bookings/[id]`

Currently a basic info page. Should become a proper dashboard for managing an individual care arrangement:

- **Status header** — booking status, next session date
- **Contract summary** — service type, schedule, price, terms
- **Sessions** — upcoming and past session list
- **Chat preview / link** — recent messages + "Open conversation" link
- **Actions** — modify, cancel, message, leave review
- **Care notes** (future) — per-session notes from the carer

This is where the "service panel" concept lands. On desktop, the detail page could show the contract/session info alongside the chat. On mobile, the chat is a tap away via the conversation link.

---

## Route Migration Map

| Current Route | New Route | Change |
|---------------|-----------|--------|
| `/activity` | `/discover` | Renamed. Discover tab content moves here. |
| `/activity?tab=discover` | `/discover?tab=meets` | Tab within new Discover page |
| `/activity?tab=schedule` | `/schedule` | Promoted to top-level |
| `/activity?tab=services` | `/bookings?tab=services` | Moved under Bookings |
| `/explore/results` | `/discover/care` | Merged into Discover |
| `/explore/profile/[id]` | `/discover/profile/[id]` | Moved under Discover |
| `/discover?tab=meets` | `/discover/meets` | Tabs → sub-pages (Phase 19) |
| `/discover?tab=care` | `/discover/care` | Tabs → sub-pages (Phase 19) |
| `/bookings` | `/bookings` | Stays, gains tabs |
| `/bookings/[id]` | `/bookings/[id]` | Stays, gets enhanced |
| `/schedule` (old redirect) | `/schedule` | Now the real page |

**Redirects needed:**
- `/activity` → `/discover`
- `/activity?tab=schedule` → `/schedule`
- `/activity?tab=services` → `/bookings?tab=services`
- `/explore/results` → `/discover/care`
- `/explore/profile/[id]` → `/discover/profile/[id]`
- `/discover?tab=meets` → `/discover/meets`
- `/discover?tab=care` → `/discover/care`
- `/communities` → `/home?tab=groups` (eventually — keep page for now, redirect in cleanup)

---

## Hub vs Detail — Decision Framework

A page is a **hub** if:
- It's a top-level nav destination
- Users land here to orient and choose what to do next
- It contains lists, feeds, or tabs that branch to detail pages

A page is a **detail** if:
- Users arrive with a specific intent (view this meet, read this thread)
- The content is focused on one entity
- Back navigation is the primary exit

**Grey area resolution:**
- Inbox list = hub (even though accessed via header icon on mobile)
- Individual thread = detail
- Provider profile = detail (you chose a specific provider)
- Booking detail = detail (you chose a specific booking)

---

## Mobile Top Bar Behaviour

### Hub pages
```
[DOGGO logo]        [Create +] [Notifications 🔔] [Inbox 💬]
```
Logo links to `/home`. Create (+) opens the post composer. Notifications bell links to `/notifications` with unread badge. Inbox icon links to `/inbox` with unread badge.

### Detail pages
```
[← Back]  Page Title            [Action?]
```
Back button returns to the logical parent (not browser back — prevents deep-link confusion). Optional right-side action (share, edit, etc.).

### When to show bottom nav
Bottom nav appears on **hub pages only**. It hides on:
- All detail pages (threads, meet detail, booking detail, create forms, provider profiles)
- Guest pages (landing, signin, signup)
- Styleguide

---

## Empty State Strategy

Since Schedule and Bookings will be empty for new/casual users:

| Page | Empty state message | CTA |
|------|-------------------|-----|
| Schedule (Upcoming) | "Nothing coming up yet." | "Discover meets nearby" → `/discover?tab=meets` |
| Schedule (History) | "No past activity yet." | — |
| Bookings > My Care | "No care bookings yet." | "Find Care" → `/discover?tab=care` |
| Bookings > My Services | "Not offering services yet." | "Set up services" → `/profile?tab=services` |
| Bookings > My Services (no bookings but has services) | "No active bookings yet. Your services are live." | — |

Empty states should feel helpful, not broken. They're signposts that guide users toward the features that will fill these pages.

**Future consideration:** A user setting to hide the Bookings tab entirely if they never intend to use care features. This prevents the app feeling bloated for purely-social users. Not needed for the prototype — we want to show the full story.

---

## Impact on Existing Docs

These docs need updating when this IA is implemented:

| Doc | What changes |
|-----|-------------|
| `Product Vision.md` | Nav structure section (mobile + desktop) |
| `schedule.md` (features) | Route changes, no longer a sub-tab |
| `explore-and-care.md` (features) | Care discovery moves under Discover |
| `meets.md` (features) | Meet discovery moves under Discover |
| `messaging.md` (features) | Inbox access pattern changes |
| `component-inventory.md` | New/updated layout components |
| `CLAUDE.md` | Current phase, nav structure references |
| `MVP Scope Boundaries.md` | Nav restructure status |
| Flow docs (`care-discovery.md`, `meet-discovery.md`, `booking-conversation.md`) | Entry points change |

---

## Related Docs

- [[Product Vision]] — product strategy, nav rationale
- [[User Archetypes]] — behavioural profiles that inform nav priority
- [[Trust & Connection Model]] — connection states referenced in care flows
- [[schedule]] — Schedule feature spec
- [[explore-and-care]] — care discovery and booking flows
- [[meets]] — meet discovery and creation
