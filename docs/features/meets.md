---
category: feature
status: active
last-reviewed: 2026-03-18
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

- **Pages:** `/meets` (browse + filters), `/meets/[meetId]` (detail), `/meets/create` (creation form)
- **Components:** Meet cards, meet detail layout, group chat thread, attendee list, filter panel
- **Data:** Mock meets with various types, locations, recurring schedules
- **Status:** Browse, create, detail, group chat, join/leave, recurring meets all functional

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

Five types, each with slightly adapted creation fields:

1. **Walk** — route/pace, start point
2. **Park hangout** — time window, area
3. **Playdate** — dog compatibility rules
4. **Training session** — skill focus, trainer info
5. **Outing** — destination, logistics

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
