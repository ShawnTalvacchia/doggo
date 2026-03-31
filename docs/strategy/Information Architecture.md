---
category: strategy
status: active
last-reviewed: 2026-03-31
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
4. **Desktop can breathe, mobile must prioritise.** The sidebar has room for 7+ items. The bottom nav has 5. The mobile header adds 2 more (Inbox, Profile). Design for mobile constraints first.

---

## Navigation Structure

### Mobile

```
┌──────────────────────────────────────────────────┐
│  DOGGO                        [Inbox 🔴] [Avatar]│  ← top bar (hub pages only)
├──────────────────────────────────────────────────┤
│                                                  │
│                  Page content                    │
│                                                  │
├──────────────────────────────────────────────────┤
│  Home  |  Groups  |  Discover  |  Schedule  |  Bookings  │  ← bottom nav (hub pages only)
└──────────────────────────────────────────────────┘
```

**Bottom nav (5 tabs):**

| Slot | Label | Icon | Route | Purpose |
|------|-------|------|-------|---------|
| 1 | Home | House | `/home` | Feed, community highlights, upcoming strip |
| 2 | Groups | UsersThree | `/communities` | Browse and manage groups |
| 3 | Discover | MagnifyingGlass | `/discover` | Unified search: Meets and Care |
| 4 | My Schedule | CalendarDots | `/schedule` | Your upcoming meets + bookings timeline |
| 5 | Bookings | Briefcase | `/bookings` | Care management (as owner + as provider) |

**Top bar (2 icons):**

| Position | Element | Action |
|----------|---------|--------|
| Left | DOGGO logo | Link to `/home` |
| Right 1 | Inbox icon (ChatCircleDots) | Link to `/inbox`, unread badge |
| Right 2 | Profile avatar | Link to `/profile` |

**Why this arrangement:** Inbox and Profile are accessed frequently but don't need spatial orientation the way the main 5 do. Header icons are always visible and one tap away. This pattern is established (Instagram, Airbnb, LinkedIn).

### Desktop

```
┌───────────┬──────────────────────────────────────┐
│  DOGGO    │                                      │
│           │                                      │
│  Home     │          Page content                │
│  Groups   │     (max-width constrained)          │
│  Discover │                                      │
│  Schedule │                                      │
│  Bookings │                                      │
│  Inbox    │                                      │
│  Profile  │                                      │
│           │                                      │
└───────────┴──────────────────────────────────────┘
```

Desktop sidebar shows all 7 items. No need to hide anything — vertical space is abundant.

---

## Page Inventory

### Hub Pages

Hub pages show the full navigation (bottom nav + top bar on mobile, sidebar on desktop). They're orientation pages — "where am I, what can I do?"

| Page | Route | Tabs / Sections | Notes |
|------|-------|-----------------|-------|
| **Home** | `/home` | Feed + upcoming strip | Personalised feed, community highlights, care CTAs |
| **Groups** | `/communities` | Group list | Browse, join, manage groups |
| **Discover** | `/discover` | Meets \| Care | **New.** Unified discovery with shared filter+map pattern |
| **My Schedule** | `/schedule` | Upcoming \| History | **Moved.** Personal timeline of meets + bookings |
| **Bookings** | `/bookings` | My Care \| My Services | **Restructured.** Both sides of care arrangements |
| **Inbox** | `/inbox` | Messages \| Booking Inquiries | Conversation list (hub on mobile too, accessed via header icon) |
| **Profile** | `/profile` | About \| Posts \| Services | Your profile, dogs, settings, provider dial |

### Detail Pages

Detail pages replace the nav with a focused header: `← Back | Page Title | (optional action)`. On mobile, no bottom nav. On desktop, the sidebar remains but the content area takes focus.

| Page | Route | Back target | Notes |
|------|-------|-------------|-------|
| **Group detail** | `/communities/[id]` | `/communities` | Group feed, members, meets, chat |
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

### Discover (new — replaces Activities > Discover + Find Care)

**Route:** `/discover`
**Tabs:** Meets | Care

The unified "what's out there?" page. Both tabs share a similar layout pattern: filter controls + results list + optional map view.

**Meets tab** (`/discover?tab=meets`)
- Browse all upcoming meets
- Filter by type (Walk, Park Hangout, Playdate, Training), neighbourhood, date
- Map view showing meet locations
- Cards link to meet detail pages
- "Create a Meet" CTA

**Care tab** (`/discover?tab=care`)
- Browse care providers (current `/explore/results` content)
- Filter by service type, price, availability, distance
- Map view showing provider locations
- Cards link to provider profile pages
- Community carers section (connected users who offer care)

**Why unified:** Both are "I'm looking for something" flows. The shared filter+map pattern reduces cognitive load and makes care discovery feel like a natural part of the community experience, not a separate marketplace bolted on.

**What moves here:**
- Activities > Discover tab content → Discover > Meets
- `/explore/results` content → Discover > Care
- "Find Care" sidebar item → Discover (Care tab)

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
| `/explore/results` | `/discover?tab=care` | Merged into Discover |
| `/explore/profile/[id]` | `/discover/profile/[id]` | Moved under Discover |
| `/bookings` | `/bookings` | Stays, gains tabs |
| `/bookings/[id]` | `/bookings/[id]` | Stays, gets enhanced |
| `/schedule` (old redirect) | `/schedule` | Now the real page |

**Redirects needed:**
- `/activity` → `/discover`
- `/activity?tab=schedule` → `/schedule`
- `/activity?tab=services` → `/bookings?tab=services`
- `/explore/results` → `/discover?tab=care`
- `/explore/profile/[id]` → `/discover/profile/[id]`

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
[DOGGO logo]                    [Inbox 🔴] [Avatar]
```
Logo links to `/home`. Inbox icon shows unread count badge. Avatar links to `/profile`.

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
