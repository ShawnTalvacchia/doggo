---
category: feature
status: active
last-reviewed: 2026-04-04
tags: [meets, groups, community, social]
review-trigger: "when modifying meets, groups, group chat, or meet discovery"
---

# Groups & Meets

Organised dog social activities — the core community feature that drives trust and engagement.

---

## Overview

Groups are persistent communities. Meets are events within them.

A group is an ongoing thing — "the Tuesday morning Letna crew," "Petra's reactive dog circle," "Vinohrady weekend walkers." It has members, a chat (eventually multiple threads), a gallery, and a list of events (meets). Being a member doesn't mean attending every meet. It means you're part of that community.

Meets are individual events within a group — a specific walk on a specific day. You RSVP to meets, not to the group itself (though joining a group is the gateway to seeing its meets).

This distinction matters because **meets alone aren't enough.** Without a persistent home, the conversations between events have nowhere to live, the social graph has no container, and recurring groups default back to WhatsApp. Groups are what make Doggo the place people organise, not just attend.

---

## Current State (prototype)

The prototype currently has standalone meets without a group layer:

- **Pages:** `/discover?tab=meets` (Meets tab within Discover page), `/meets/[meetId]` (detail), `/meets/create` (creation form)
- **Discover page:** `/discover` is now a three-door hub:
  - **Meets** — `/discover/meets` — meet browse with filters
  - **Groups** — `/discover/groups` — group browse with filters (new in Phase 19)
  - **Dog Care** — `/discover/care` — provider search with filters + map
- **Schedule:** My Schedule is now a top-level page at `/schedule` (moved from `/activity?tab=schedule`)
- **Components:** Meet cards, meet detail layout, group chat thread, attendee list, filter panel, TabBar, DiscoverTab, MyScheduleTab, MeetCardCompact
- **Data:** Mock meets with various types, locations, recurring schedules
- **Status:** Browse, create, detail, group chat, join/leave, recurring meets all functional
- **Discovery paths:** Meets are discoverable through Discover > Meets (`/discover/meets`, global browse), through Groups (Home > Groups tab → group detail → upcoming meets), and through Discover > Groups (`/discover/groups`)
- **Groups:** Accessible via Home (Feed | Groups tabs on mobile, groups panel on desktop) and via Discover > Groups door (`/discover/groups`)

Phase 19 defines three group archetypes (Park, Community, Service) and builds group browse into the Discover hub. The existing meet infrastructure becomes the "events within groups" layer.

---

## Groups

### Core concept

A group is a persistent community with:

- **Members** — people who have joined the group
- **Chat** — a persistent conversation for coordination and socialising (eventually: multiple threads)
- **Gallery** — shared photos from meets and group life (core feature — moments from meets/groups drive the Home feed)
- **Events (meets)** — a list of upcoming and past meets

### Three group archetypes

| Archetype | `groupType` | Visibility | Admin | How created | Key traits |
|-----------|-------------|------------|-------|-------------|------------|
| **Park** | `"park"` | Open (public) | None — no admin | Auto-generated at launch | Tied to a physical park. Anyone can join. No moderation needed. Seeded parks: Letna, Stromovka, Riegrovy Sady, Ladronka, Vitkov, Kampa. |
| **Community** | `"community"` | Defaults private (creator can set public) | Creator is admin | User-created | Interest/neighbourhood groups. Creator manages membership and meets. The "private crew of regulars" pattern. |
| **Service** | `"service"` | Public | Provider is admin | Provider-created | Attached to a care provider. Has `hostedBy` and `hostedByName` fields. Meets can carry a `serviceCTA` with `label`, `href`, `price`, and `spotsLeft`. Used for training classes, group walks, etc. |

Park groups are the lowest-barrier on-ramp — they exist before any user action. Community groups are where trust and retention live. Service groups bridge community and care by giving providers a group home for their offerings.

The natural progression: **join a park group → attend meets → get invited to (or create) a community group of regulars.** Service groups run in parallel, discoverable through `/discover/groups`.

### Visibility: Public vs Private

| Setting | Who can see it | How to join | Who can create meets |
|---------|---------------|-------------|---------------------|
| **Public** | Anyone browsing | Anyone can join directly | Any member (Community), provider only (Service) |
| **Private** | Members only | Added by admin or invited by member | Admin or any member (configurable) |

### Group management (resolved)

- **Park groups:** No admin. No moderation. Open to all. Auto-generated.
- **Community groups:** Creator is admin. Admins can invite members to private groups. Members can also invite (configurable by admin).
- **Service groups:** Provider is admin. Provider controls meets and service CTAs.
- **Group creation:** Any user can create a Community group. Only providers can create Service groups. Park groups are system-generated.
- **Groups without meets:** Yes — a group can exist purely for chat/gallery. Meets are optional.

---

## Meets (Events)

### Core concept

A meet is an event within a group. It inherits the group's context but has its own:

- **Date and time** (specific occurrence)
- **Location** (can differ from group's usual spot)
- **Attendee list** (subset of group members, plus potentially non-members for public meets)
- **Type** — Walk, Park hangout, Playdate, Training session, Outing
- **Rules** — dog size, energy level, max group size

### Visibility: Public vs Private (per meet)

Meets have their own visibility setting, independent of the group:

| Group type | Meet setting | Who can see & RSVP |
|-----------|-------------|-------------------|
| Public group | Public meet | Anyone |
| Public group | Private meet | Group members only |
| Private group | Private meet (default) | Group members only |
| Private group | Public meet | Unusual but possible — group admin decides |

This flexibility matters. A public group might run mostly public meets but occasionally do a members-only event. A private group is private by default but might open a specific event to attract new members.

### Meet types

Four types, each with type-specific creation fields and display:

1. **Walk** — pace (leisurely/moderate/brisk), distance (short/medium/long), terrain (paved/trails/mixed), route notes
2. **Park hangout** — drop-in window toggle + end time, amenities (fenced area, water, shade, benches, parking), vibe (casual/organised)
3. **Playdate** — dog age range (puppy/young/adult/senior/any), play style (gentle/active/mixed), fenced area, max dogs per person
4. **Training** — skill focus multi-select (recall, leash manners, socialisation, obedience, agility, tricks), experience level (beginner/intermediate/advanced/all levels), led by (peer/professional), trainer name, equipment needed

All types also share three enhancement fields:
- **Energy level** — calm, moderate, high, any (as important as size for compatibility)
- **What to bring** — suggested items (e.g. treats, long lead, water bottle)
- **Accessibility notes** — terrain/access info for humans and dogs

Type-specific fields show conditionally in the creation form, as summary pills on MeetCards, and as a dedicated section on the detail page.

**Note:** Outing type (destination, logistics) is specced but not yet implemented.

### Post-meet connection

After a meet, attendees see who else attended and get prompts to connect. This remains the highest-intent moment for building relationships. With groups, this is even more powerful — you're not connecting with random strangers, you're connecting with people from *your* group.

---

## Key Decisions (carried forward)

1. **Public meets remain the default entry point** — low barrier for new users.
2. **Group threads are persistent** — not just per-meet coordination. The group has an ongoing conversation.
3. **Post-meet connect prompts** — still the primary connection trigger, now within group context.
4. **Location flexibility** — meet creators set their own meeting point. No system-enforced boundaries.
5. **Recurring meets** — weekly on the same day/time. Each occurrence has its own attendee list.

---

## User Flows

### Discover and join a group

```
Explore groups → Browse public groups (filtered by neighbourhood/type/size)
             → Tap a group card → Group page (members, upcoming meets, chat preview)
             → "Join" → Member. See full chat, all meets, gallery.
```

### Attend a meet within a group

```
Group page → Upcoming meets list → Tap a meet → Meet detail (attendees, dogs, location, rules)
          → "RSVP" → Added to attendee list
```

### Create a group

```
"Create Group" → Name, description, neighbourhood, public/private
              → Group page live. Creator is admin.
              → Create first meet from group page.
```

### Progression: public → private

```
User joins public group → attends several meets → recognises regulars
    → One regular creates a private group for the core crew
    → Invites the regulars → Private group with its own meets and chat
```

---

## Tiered Participant List (Phase 15)

Meet attendee lists are redesigned as a social discovery surface, sorted by relationship proximity:

**Tier 1 — Connected users (full cards)**
- Avatar, name, dog name + breed, neighbourhood
- Relationship context: "Connected since January", "3rd meet together"
- Mutual connections: "You both know Jana and Tomáš"
- Subtle care provider indicator if applicable

**Tier 2 — Familiar / Open profiles (actionable cards)**
- Avatar, name, dog name + breed, neighbourhood
- Context signal: "Also in Vinohrady Dog Owners", "Attended Stromovka walk last week"
- Connect action (small button at card edge)
- If they marked you Familiar: warmer framing ("Wants to connect")

**Tier 3 — Hidden / collapsed**
- Locked users with no relationship not shown individually
- Instead: "N other attendees" count at bottom
- Post-meet prompt surfaces them with Familiar/Connect/Skip actions

### Going / Interested RSVP

Third RSVP state alongside Going and Not Going:

- **Going** = committed, counted toward capacity
- **Interested** = social signal, not counted toward capacity
- Creates lower commitment bar, more social proof ("12 going, 5 interested")

### Post-meet participant reveal

After a meet ends, users who were in Tier 3 (hidden/locked) get surfaced:

- "You met N new people at today's walk"
- Each person shown with basic info (name, dog, neighbourhood)
- Actions: "Mark as Familiar" / "Connect" / "Skip"
- Bulk action: "Mark all as Familiar"

---

## Future

- **Multiple chat threads per group** — general, planning, off-topic, etc.
- **Platform-suggested groups** — the app suggests groups based on neighbourhood density and user activity
- **Map-based group/meet discovery** — visual map of nearby groups and upcoming meets
- **Attendance patterns** — "Petra usually comes Tuesdays" visible to group members
- **Group merge/federation** — when two public groups in the same area have overlapping members

---

## Related Docs

- [[Product Vision]] — groups & meets as the core of the community thesis
- [[connections]] — post-meet connect flow
- [[schedule]] — meets appear in the user's schedule
- [[Content Visibility Model]] — two-gate system controlling content visibility in feeds and groups
- [[Groups Strategy]] — three group archetypes (Park, Community, Service)
- [[messaging]] — group threads for coordination, direct messages for 1:1
