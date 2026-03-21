---
category: phase
status: complete
last-reviewed: 2026-03-16
tags:
  - phase-3
  - meets
  - connections
  - trust
  - messaging
  - home-feed
review-trigger: archived — phase complete
kanban-plugin: board
---

# Phase 3 — Community Core

## Backlog


## In Progress


## Done

- [x] Post-meet connect prompts #connections
	- `/meets/[id]/connect` page with dog-centred framing ("Spot and Rex seemed to get along!")
	- Attendee cards with Familiar/Connect action buttons
	- Existing connection states shown (Connected, Familiar)
	- Trust explainer at bottom, Done/Back to meet CTAs

- [x] Connection system (trust ladder) #connections
	- Types: `ConnectionState` (none → familiar → pending → connected)
	- Mock data: 4 connections across all states (Jana=connected, Eva=familiar, Tomáš=pending, Martin=none)
	- Profile page: Connections section in About tab grouped by state
	- Meet detail: connection badges on attendee list
	- Home feed: suggested connections with Connect buttons

- [x] Meet group threads #messaging
	- Group chat toggle on meet detail page
	- Message bubbles: own messages right-aligned (brand-subtle bg), others left with avatar + name
	- Compose input with Send button
	- Mock messages for 3 meets (meet-1, meet-2, meet-6)
	- Message count shown on button ("Group chat (3)")



- [x] Meet creation flow #meets
	- `/meets/create` form: type selection cards, title, description, location, date/time, duration, max attendees, recurring toggle, leash policy, dog size filter
	- Uses FormHeader/FormFooter/InputField components
	- Demo: navigates back to meets list after "Create Meet"

- [x] Meet detail page #meets
	- `/meets/[id]` dynamic route with mock data lookup
	- Type badge, title, description, details grid (date, duration, location, capacity)
	- Join/leave CTA, organiser section, attendee list with dog names
	- Back navigation, 404 handling

- [x] Meet browsing & discovery #meets
	- Meets page populated with 6 mock meets (walks, park hangouts, playdates, training)
	- MeetCard component: type badge, title, date/location/attendee meta, avatar row, spots left
	- Filter pills functional with state (All, Walks, Park Hangouts, Playdates, Training)
	- Sections: Nearby, Your Upcoming, Recent (completed)

- [x] Home feed content #home
	- Nearby Meets: top 3 upcoming meets as MeetCards with "See all" link
	- Suggested Connections: attendees from completed meet with Connect buttons
	- Community Highlights: completed meet summary + activity stat

- [x] Schedule populated #schedule
	- This Week / Coming Up split based on 7-day window
	- Past section shows completed meets
	- All sections use MeetCard component, user's joined meets only


## Notes

**Phase goal:** Meets are the strategic centrepiece. This phase brings the community thesis to life — people attend meets, build trust, form connections. Without this, Doggo is just another provider search.

**Exit criteria:**
1. Can create a meet and see it on the Meets page
2. Meet detail page shows attendees, location, join/leave
3. Post-meet connect prompt works (mark Familiar or Connect)
4. Connection states visible on profiles (Locked/Open/Familiar/Connected)
5. Home feed shows nearby meets and suggested connections (mock data OK)
6. Schedule shows joined meets
7. At least one meet has a working group thread in Inbox
8. Styleguide parity maintained

**Open considerations:**
- Recurring meet join mechanics: "join all Tuesdays" vs. single occurrence
- Meet discovery: neighbourhood filtering vs. map-based
- Chat infrastructure: build simple or integrate Stream/SendBird
- Notification strategy (not blocking, but worth discussing)

**Depends on:** Phase 2 (nav and page shells exist) ✓

**Start date:** 2026-03-16
