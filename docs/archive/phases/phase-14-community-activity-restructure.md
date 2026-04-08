---
category: phase
status: active
last-reviewed: 2026-03-26
tags: [phase-14, communities, activity, navigation, chat, group-chat]
review-trigger: "when modifying navigation, communities, activity page, or group chat"
---

# Phase 14 — Community & Activity Restructure

**Goal:** Elevate communities as a first-class navigation concept, consolidate meets + schedule into a unified "Activity" tab, and add group chat enhancements (join-gated empty states, auto-generated activity, event card strip) that reinforce community engagement.

**Depends on:** Phase 12 (demo-ready polish), Phase 13 (meet type enrichment).

---

## Why

Communities (groups) exist but are invisible — no nav entry, only reachable through deep links or meet card badges. Meets and Schedule are separate tabs when they're two views of the same concept: "what's happening." This restructure aligns navigation with the community-first thesis and draws inspiration from Reclub's club-centric model. The group chat enhancements make communities feel alive and create clear participation incentives.

**Key decisions:**
- Mobile nav: Home | Communities | Activity | Inbox | Profile (5 tabs)
- Activity icon: Compass
- User-facing term: "Community/Communities" (routes use `/communities`)
- Internal code (components, types, mock data): stays `group`/`Group`
- Existing `/meets/[id]` and `/meets/create` routes remain unchanged

---

## Workstream A — Navigation & Route Restructure

### A1 · Update BottomNav tabs

Replace Meets + Schedule with Communities + Activity. Update `loggedPrefixes` and `activeHref` logic.

**Files:** `components/layout/BottomNav.tsx`

### A2 · Update AppNav desktop links

Change desktop nav links to Communities + Activity. Keep "Find Care" CTA.

**Files:** `components/layout/AppNav.tsx`

### A3 · Move group pages to /communities route

Move `app/groups/` page files to `app/communities/`. Add redirects at old `/groups` paths. Update all user-facing text from "group" to "community" in moved pages.

**Files:** `app/groups/page.tsx` → `app/communities/page.tsx`, `app/groups/[id]/page.tsx` → `app/communities/[id]/page.tsx`, `app/groups/create/page.tsx` → `app/communities/create/page.tsx`

### A4 · Create /activity page with tabs

New page at `/activity` with three tabs (Discover, My Schedule, Bookings) using `?tab=` search param. Extract content from existing meets and schedule pages.

**New components:** `app/activity/page.tsx`, `components/ui/TabBar.tsx`, `components/activity/DiscoverTab.tsx`, `components/activity/MyScheduleTab.tsx`, `components/activity/BookingsTab.tsx`

### A5 · Redirects for old routes

`/meets` → `/activity?tab=discover`, `/schedule` → `/activity?tab=schedule`. Detail and create routes stay.

**Files:** `app/meets/page.tsx`, `app/schedule/page.tsx`

### A6 · Update all internal links

Grep for `href="/meets"`, `href="/schedule"`, `href="/groups"` and update across codebase.

### A7 · Update user-facing text

Audit all pages for "group" → "community" in headers, buttons, descriptions.

---

## Workstream B — Join-Gated Chat

### B1 · Gate community chat behind membership

Show EmptyState instead of chat when user hasn't joined the community. Include "Join community" CTA.

**Files:** `app/communities/[id]/page.tsx`

### B2 · Gate meet chat behind RSVP

Show EmptyState instead of chat when user hasn't RSVP'd to the meet. Include "Join this meet" CTA.

**Files:** `app/meets/[id]/page.tsx`

### B3 · Always show chat toggle

Show chat toggle button for non-members (currently hidden when no messages). Motivates joining.

**Files:** `app/communities/[id]/page.tsx`, `app/meets/[id]/page.tsx`

---

## Workstream C — Auto-Generated Activity & Event Card Strip

### C1 · Add system message type

Extend `GroupMessage` with `type` ("user" | "system") and `activityType` ("member_joined" | "meet_posted" | "rsvp_milestone").

**Files:** `lib/types.ts`

### C2 · Add mock system messages

Intersperse system messages in mock group message data.

**Files:** `lib/mockGroupMessages.ts`

### C3 · Create SystemMessage component

Centered, muted text display for system/activity messages. No avatar, no bubble.

**New component:** `components/chat/SystemMessage.tsx`

### C4 · Update chat rendering

Check `message.type` in group chat rendering. Use `<SystemMessage>` for system messages, `<MessageBubble>` for user messages.

**Files:** `app/communities/[id]/page.tsx`

### C5 · Create MeetCardCompact component

Compact horizontal card (~200px wide) for event strip. Shows type icon, title, date, attendee count.

**New component:** `components/meets/MeetCardCompact.tsx`

### C6 · Add event card strip to community chat

Horizontal scrollable row of upcoming meets at top of community chat section.

**Files:** `app/communities/[id]/page.tsx`

---

## Workstream D — Documentation

### D1 · Create phase board

This file.

### D2 · Update ROADMAP.md

Add Phase 14 entry.

### D3 · Update Product Vision nav section

Update mobile and desktop nav diagrams.

### D4 · Update meets feature doc

Document Activity tab (Discover / My Schedule / Bookings), meet discovery changes.

### D5 · Update messaging feature doc

Add join-gated chat, system messages, event card strip sections.

### D6 · Update flow docs

Update `docs/flows/groups.md` and `docs/flows/meet-discovery.md`.

### D7 · Update component inventory

Add TabBar, DiscoverTab, MyScheduleTab, BookingsTab, SystemMessage, MeetCardCompact.

---

## Execution Order

1. D1 + D2 + D3 — Docs first (phase board, roadmap, vision nav)
2. A1 + A2 — Nav changes (BottomNav + AppNav)
3. A3 — Move group pages to `/communities`
4. A4 — Create `/activity` page + TabBar + tab components
5. A5 — Redirects for `/meets` and `/schedule`
6. A6 + A7 — Update internal links + user-facing text
7. B1 + B2 + B3 — Join-gated chat
8. C1 + C2 — System message types + mock data
9. C3 + C4 — SystemMessage component + chat rendering
10. C5 + C6 — MeetCardCompact + event card strip
11. D4 + D5 + D6 + D7 — Remaining doc updates

---

## Verification

- [ ] Mobile bottom nav: Home | Communities | Activity | Inbox | Profile
- [ ] Desktop nav: Home | Communities | Activity | Find Care | icons
- [ ] Activity icon is Compass
- [ ] Communities tab → `/communities` browse page (header says "Communities")
- [ ] Activity tab → `/activity` with Discover tab active by default
- [ ] Three working tabs: Discover, My Schedule, Bookings
- [ ] Discover = same meet browse + filter as old `/meets`
- [ ] My Schedule = This Week + Coming Up + Past
- [ ] Bookings = owner bookings + incoming requests + carer services
- [ ] `/meets` redirects to `/activity?tab=discover`
- [ ] `/schedule` redirects to `/activity?tab=schedule`
- [ ] `/groups` redirects to `/communities`
- [ ] `/meets/[id]` detail page works, back link goes to `/activity`
- [ ] `/meets/create` works, completion goes to `/activity`
- [ ] All user-facing text says "community" not "group"
- [ ] Non-member sees EmptyState with Join CTA instead of chat (community page)
- [ ] Non-RSVP user sees EmptyState with Join CTA instead of chat (meet page)
- [ ] Chat toggle visible even for non-members
- [ ] System messages render centered/muted in community chat
- [ ] Event card strip shows at top of community chat with upcoming meets
- [ ] MeetCardCompact cards link to `/meets/[id]`
- [ ] No dead links to old `/meets`, `/schedule`, or `/groups` pages
- [ ] Component inventory updated

---

## Out of Scope

- Renaming internal code (components, types, mock files) from `group` → `community`
- Renaming `/meets/[id]` → `/activity/meets/[id]`
- Real-time chat / WebSocket
- Push notifications
- Community creation wizard redesign
- Connections view in Inbox (discussed, separate phase)
- Meet filtering by neighbourhood
- Counter-proposal loop in bookings
