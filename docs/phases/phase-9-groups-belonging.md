---
category: phase
status: complete
last-reviewed: 2026-03-23
tags:
  - phase-9
  - groups
  - communities
  - belonging
review-trigger: reference when planning Phase 10
kanban-plugin: board
---

# Phase 9 — Groups & Belonging ("Communities")

## Backlog


## In Progress


## Done

- [x] Types & data model #data
	- Group, GroupMember, GroupMessage, GroupVisibility, GroupMemberRole types
	- `groupId?: string` on Meet interface
	- GroupMessage mirrors MeetMessage pattern

- [x] Mock data #data
	- 4 groups: Vinohrady Morning Crew (public), Stromovka Off-Leash Club (public), Reactive Dog Support (private), Letná Recall Training (public)
	- Group members mapped from existing mock users
	- 3 meets linked to groups via groupId
	- Group chat messages for 2 groups
	- Helpers: getUserGroups, getGroupById, getAllPublicGroups, getGroupMeets, getNextGroupMeet

- [x] GroupCard component #ui
	- Cover photo stripe, name, neighbourhood, member count + avatar stack
	- Private badge, next meet date
	- Links to /groups/[id]

- [x] Communities browse page /groups #page
	- "Communities" heading + Create button
	- Filter pills: All, Your Communities, Public, Private
	- "Your communities" section + "Discover" section
	- Empty state for private filter

- [x] Community detail page /groups/[id] #page
	- Cover photo, name, description, neighbourhood, visibility badge
	- Actions: admin badge / join-leave, Invite, Chat toggle
	- Members list with Admin badges + connection state badges
	- Upcoming meets section with MeetCards + "Create meet" CTA
	- Toggle-able community chat using shared MessageBubble
	- Photo gallery reusing MeetPhotoGallery

- [x] Create community form /groups/create #page
	- Name (required), Description, Neighbourhood selector, Visibility cards (Public/Private)
	- Cover photo placeholder
	- FormHeader/FormFooter pattern from meet create

- [x] "Your communities" section on Home #integration
	- Between "Upcoming meets" and "People you've met"
	- Compact inline cards with avatar stack, name, member count, next meet
	- "See all" links to /groups

- [x] Meet-group cross-links #integration
	- MeetCard: community name badge below type badge (UsersThree icon)
	- Meet detail: "Part of [Community Name]" link in header
	- Both link to /groups/[groupId]

- [x] Shared MessageBubble component #refactor
	- Extracted from meet detail into components/chat/MessageBubble.tsx
	- Used by both meet detail group chat and community chat


## Notes

**Phase goal:** Build persistent communities (groups) that turn meets from one-off events into ongoing belonging.

**Naming:** User-facing text says "Communities". Code uses `group` internally.

**New routes:**
- `/groups` — browse communities
- `/groups/[id]` — community detail
- `/groups/create` — create form

**New components:**
- `components/groups/GroupCard.tsx`
- `components/chat/MessageBubble.tsx` (extracted)

**New mock data files:**
- `lib/mockGroups.ts`
- `lib/mockGroupMessages.ts`

**Depends on:** Phase 8 (community feel) ✓
**Start date:** 2026-03-23
