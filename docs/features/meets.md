---
category: feature
status: active
last-reviewed: 2026-04-12
tags: [meets, groups, community, social]
review-trigger: "when modifying meets, groups, group detail tabs, or meet discovery"
---

# Groups & Meets

Organised dog social activities — the core community feature that drives trust and engagement.

---

## Overview

Groups are persistent communities. Meets are events within them.

A group is an ongoing thing — "the Tuesday morning Letná crew," "Prague Reactive Dog Support," "Klára's Calm Dog Sessions." It has members, a feed (posts with comments), and events (meets). Being a member doesn't mean attending every meet — it means you're part of that community.

Meets are individual events within a group — a specific walk on a specific day. You RSVP to meets, not to groups. Joining a group is the gateway to seeing its meets and participating in event chat.

This distinction matters because meets alone aren't enough. Without a persistent home, the conversations between events have nowhere to live, the social graph has no container, and recurring groups default to WhatsApp. Groups are what make Doggo the place people organise, not just attend.

---

## Groups

### Four group types

| Type | `groupType` | Visibility | Admin | How created | Primary value |
|------|-------------|------------|-------|-------------|---------------|
| **Park** | `"park"` | Open | None (community-moderated) | Auto-generated | Discovery, coordination. Lowest-barrier entry. |
| **Neighbor** | `"neighbor"` | Default private | Creator | User-created | Mutual aid, hyperlocal trust. Small (5–20). |
| **Interest** | `"interest"` | Open or private | Creator | User-created | Shared interest, knowledge. Medium (10–100+). |
| **Care** | `"care"` | Provider chooses | Provider | Provider-created | Service delivery, client community. Provider badge. |

The natural progression: **join a park group → attend meets → get invited to (or create) a neighborhood group of regulars.** Care groups run in parallel, discoverable through `/discover/groups`.

### Group detail tabs

Tabs vary by group type. No Chat tab on any group — async discussion lives in Feed (posts with flat comments). Real-time coordination lives in meet-level chat.

| Group type | Tabs |
|-----------|------|
| Park | Feed · Meets · Members |
| Neighbor | Feed · Meets · Members |
| Interest | Feed · Meets · Members |
| Care | Feed · Events · Services · Members · Gallery |

**Feed tab:** Posts with photos, captions, tags, paw reactions, and flat comments. Who can post varies by type: any member for Park/Neighbor/Interest, provider/admin only for Care groups (members comment and react).

**Meets/Events tab:** Upcoming meets rendered via CardMeet with "Create meet" CTA. Care groups label this "Events" (same data, different framing).

**Members tab:** Member list with avatars, dog names, roles (admin badge), and connection state indicators.

**Services tab (Care only):** Provider's service menu with titles, descriptions, pricing, and "Book" CTAs.

**Gallery tab (Care only):** Three display modes — standard (grid), portfolio (before/after pairs), updates (date-grouped chronological). Mode is set per care group based on provider category.

### Visibility

| Setting | Who can see | How to join | Who can post meets |
|---------|------------|-------------|-------------------|
| **Open** | Anyone browsing | Join directly | Any member (Park/Neighbor/Interest), provider only (Care) |
| **Private** | Members only | Invited or request approval | Admin or any member |

### Care group configuration

Care groups have additional configuration. See [[Groups & Care Model]] for full provider type mapping and config defaults.

Key fields: `careCategory` (training/walking/grooming/boarding/rehab/venue/vet), `hostedBy`/`hostedByName` (provider link), `serviceListings` (service menu), `galleryMode`, `locationFixed`, `capacityEnabled`, `careConfig` (full config object).

---

## Meets (Events)

### Core concept

A meet is an event within a group. It has its own date/time, location, attendee list, type, and rules. Meets link to their parent group via `groupId`.

### Meet detail view

Meet detail uses a tabbed layout:

| Tab | Content |
|-----|---------|
| **Details** | Type badge, date/time, location, duration, description. Type-specific info (pace, terrain, age range, etc.). RSVP actions. Link to parent group. |
| **People** | Attendee list tiered by connection state (Connected → Familiar/Open → hidden count). Post-meet reveal for completed meets. |
| **Photos** | `MeetPhotoGallery` — photo grid wired to mock data for completed meets. For completed meets with no photos, a share prompt (CameraPlusFill icon + "Share your photos from this meet") encourages attendees to add photos. For upcoming meets, tab shows a placeholder. |
| **Chat** | Event-scoped coordination thread. Requires RSVP to participate. Time-bound — "running late", "great walk today!" |

### Meet types

Four types with type-specific creation fields and display:

1. **Walk** — pace, distance, terrain, route notes
2. **Park hangout** — drop-in window, amenities (fenced/water/shade/benches), vibe
3. **Playdate** — dog age range, play style, fenced area, max dogs per person
4. **Training** — skill focus, experience level, led by (peer/professional), trainer name, equipment

All types share enhancement fields: energy level, what to bring, accessibility notes.

**Not yet built:** Outing type (destination, logistics).

### RSVP states

- **Going** — committed, counted toward capacity
- **Interested** — social signal, not counted toward capacity

RSVP is fully interactive: tapping cycles through Going → Interested → Leave with local state updates. The button label and style change per state. Creates lower commitment bar and more social proof ("12 going, 5 interested"). Mock data dates updated to April 2026.

### Visibility (per meet)

Meets have their own visibility, independent of the group:

| Group visibility | Meet setting | Who can see & RSVP |
|-----------------|-------------|-------------------|
| Open group | Public meet | Anyone |
| Open group | Private meet | Group members only |
| Private group | Private meet (default) | Group members only |

### Post-meet connection

After a meet ends, attendees who were hidden (Locked, no relationship) get surfaced: "You met N new people at today's walk." Each shown with name, dog, neighbourhood. Actions: Mark as Familiar / Connect / Skip. Bulk: "Mark all as Familiar."

This remains the highest-intent moment for building relationships — connecting with people from your group after a shared experience.

---

## Key Decisions

1. **No Chat tab on groups.** Feed posts with flat comments handle async discussion. Meet-level chat handles real-time coordination. Inbox handles private messages. Three surfaces, no overlap.
2. **Public meets remain the default entry point** — low barrier for new users.
3. **Post-meet connect prompts** are the primary connection trigger, now within group context.
4. **Location flexibility** — meet creators set their own meeting point.
5. **Recurring meets** — weekly on the same day/time. Each occurrence has its own attendee list.
6. **Care groups use "Events" label** for meets — same data model, different framing.

---

## Routes

| Route | What |
|-------|------|
| `/discover/meets` | Meet browse with filters |
| `/discover/groups` | Group browse with filters |
| `/meets/[meetId]` | Meet detail (Details · People · Chat tabs) |
| `/meets/create` | Meet creation form |
| `/communities/[id]` | Group detail (tabs vary by type) |
| `/home` | Community tab with category sub-tabs (All/Parks/Neighbors/Interest/Care) |
| `/schedule` | My Schedule (top-level, shows meets + care bookings) |

---

## Not Yet Built

- ~~**Meet detail tabs**~~ — **done** (Details · People · Chat)
- ~~**Group Chat tab removal**~~ — **done** (removed from neighbor/interest groups)
- ~~**Feed comments**~~ — **done** (flat comment UI on group Feed posts, local-state add, built in Content Completion A2)
- **Outing meet type** — specced but not built
- **Multiple chat threads per group** — deferred
- **Map-based meet/group discovery** — deferred
- **Attendance patterns** — "Petra usually comes Tuesdays" — deferred
- **Share profile link** — `/connect/[shortcode]` for IRL-to-app connections — deferred

---

## Related Docs

- [[Product Vision]] — community-first thesis, groups as the core
- [[Groups & Care Model]] — group taxonomy, provider types, configuration model, user journeys
- [[connections]] — post-meet connect flow, connection states
- [[schedule]] — meets in the user's schedule
- [[Content Visibility Model]] — two-gate visibility rules for group content
- [[messaging]] — inbox conversations (separate from group feed and meet chat)
