---
category: feature
status: active
last-reviewed: 2026-03-26
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

- **Pages:** `/meets` now redirects to `/activity?tab=discover`. `/meets/[meetId]` (detail), `/meets/create` (creation form). `/activity` is the new unified discovery + schedule page.
- **Activity tab structure:** `/activity` has three sub-tabs:
  - **Discover** — meet browse with filters (extracted from old `/meets` page)
  - **My Schedule** — upcoming + past personal schedule (extracted from old `/schedule` page)
  - **Bookings** — care arrangements (extracted from old `/schedule` page)
- **Components:** Meet cards, meet detail layout, group chat thread, attendee list, filter panel, TabBar, DiscoverTab, MyScheduleTab, BookingsTab, MeetCardCompact
- **Data:** Mock meets with various types, locations, recurring schedules
- **Status:** Browse, create, detail, group chat, join/leave, recurring meets all functional
- **Discovery paths:** Meets are discoverable both through Communities (upcoming meets in community detail) and through Activity > Discover

Groups need to be designed and built. The existing meet infrastructure becomes the "events within groups" layer.

---

## Groups

### Core concept

A group is a persistent community with:

- **Members** — people who have joined the group
- **Chat** — a persistent conversation for coordination and socialising (eventually: multiple threads)
- **Gallery** — shared photos from meets and group life
- **Events (meets)** — a list of upcoming and past meets

### Visibility: Public vs Private

| Setting | Who can see it | How to join | Who can create meets |
|---------|---------------|-------------|---------------------|
| **Public** | Anyone browsing | Anyone can join directly | Any member (TBD: or only admin?) |
| **Private** | Members only | Added by admin or any member (configurable) | Any member (TBD: or only admin?) |

Public groups are the on-ramp. They're discoverable, low-barrier, and welcoming. Private groups are where the real trust and retention lives — smaller, more personal, higher commitment.

The natural progression: **discover a public group → attend a few meets → get invited to (or create) a private group of regulars.**

### Group management (open questions)

- Who can create groups? Any user? Or does it require a minimum activity level?
- Admin roles: creator-only, or can admins be added?
- Can members invite others to private groups, or only admins?
- Group size limits? Different for public vs private?
- Can a group exist without any upcoming meets (purely social/chat)?

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

## Future

- **Multiple chat threads per group** — general, planning, off-topic, etc.
- **Photo gallery per meet and per group** — shared photos for social proof and engagement
- **Platform-suggested groups** — the app suggests groups based on neighbourhood density and user activity
- **Map-based group/meet discovery** — visual map of nearby groups and upcoming meets
- **Attendance patterns** — "Petra usually comes Tuesdays" visible to group members
- **Group merge/federation** — when two public groups in the same area have overlapping members

---

## Related Docs

- [[Product Vision]] — groups & meets as the core of the community thesis
- [[connections]] — post-meet connect flow
- [[schedule]] — meets appear in the user's schedule
- [[messaging]] — group threads for coordination, direct messages for 1:1
