---
category: phase
status: complete
last-reviewed: 2026-03-23
tags:
  - phase-8
  - community
  - empty-states
  - psychology
  - trust
review-trigger: this phase is complete — reference when planning Phase 9
kanban-plugin: board
---

# Phase 8 — Community Feel & Empty States

## Backlog


## In Progress


## Done

- [x] Neighbourhood identity #data
	- `neighbourhood` field on UserProfile and Meet types
	- mockUser neighbourhood = "Vinohrady"
	- All 6 mock meets have neighbourhood (Vinohrady, Holešovice, Letná, Žižkov)
	- Home hero shows neighbourhood instead of city
	- "Your neighbourhood" section uses neighbourhood name

- [x] Neighbourhood stats & social proof #data
	- `mockNeighbourhoodStats.ts` with dogsWalkedThisWeek, meetsThisWeek, activeDogs, topMeetSpot
	- Home highlights: "24 dogs walked in Vinohrady this week", "47 active dogs in your neighbourhood"

- [x] Activity indicators on meets #meets
	- `recentJoinText` and `isPopular` fields on Meet type
	- MeetCard shows activity text with Lightning icon ("Tomáš joined 2h ago")
	- MeetCard shows "Popular" badge in green pill

- [x] Home — new user welcome state #home
	- `DEMO_NEW_USER` toggle in `lib/mockUserState.ts`
	- `HomeWelcome` component: personalised greeting with dog photos, neighbourhood, CTAs
	- `DogsNearYou` component: horizontal scroll of neighbourhood dogs from meet attendees
	- Home page conditionally renders welcome state vs established-user state

- [x] Onboarding payoff step #signup
	- Signup success page shows "What's happening near you" with 2 upcoming MeetCards
	- Shows neighbourhood activity stat ("24 dogs walked in Vinohrady this week")

- [x] Post-meet recap #meets #trust
	- `MeetRecapHeader` component: meet title, date, stats (people · dogs · duration), location
	- `MeetPhotoGallery` component: responsive photo grid + "Add yours" placeholder
	- `photos` field on Meet type, 5 photos on completed meet
	- "Mark all Familiar" bulk action button on connect page
	- Recap integrated into `/meets/[id]/connect` above attendee list

- [x] Trust signal accumulation #trust #profiles
	- `meetsShared`, `firstMetDate`, `lastMetDate` fields on Connection type
	- Trust data on 3 mock connections (5, 3, 2 meets shared)
	- `TrustSignalBadges` component: "Walked together X times", "Known since", "Met at"
	- Badges shown on `/profile/[userId]` below connection state

- [x] Invite/share a meet #meets #growth
	- `ShareMeetModal` component using ModalSheet
	- Meet preview card, copy link with "Copied!" feedback, share-via icons
	- "Invite a friend — their dog will thank you" message
	- Share button on meet detail page


## Notes

**Phase goal:** Make the prototype feel alive for new users and strengthen the psychological hooks that turn one-time visitors into regulars.

**Key principle:** The cold start problem is a design problem as much as a marketing problem. The prototype can't solve the real cold start, but it demonstrates how the product handles low density gracefully.

**New components:**
- `components/home/HomeWelcome.tsx`
- `components/home/DogsNearYou.tsx`
- `components/meets/MeetRecapHeader.tsx`
- `components/meets/MeetPhotoGallery.tsx`
- `components/meets/ShareMeetModal.tsx`
- `components/profile/TrustSignalBadges.tsx`

**New mock data files:**
- `lib/mockNeighbourhoodStats.ts`
- `lib/mockUserState.ts`

**Depends on:** Phase 7 (community-native care) ✓
**Start date:** 2026-03-23
