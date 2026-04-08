---
category: phase
status: complete
last-reviewed: 2026-03-21
tags:
  - phase-5
  - care
  - profile
  - explore
  - messaging
  - bookings
review-trigger: "only if revisiting Phase 5 scope"
kanban-plugin: board
---

# Phase 5 — Care & Profile Enhancement

## Backlog


## In Progress


## Done

- [x] Enhanced pet profiles #profile
	- PetProfile type extended: energyLevel, playStyles[], socialisationNotes, vetInfo{}, photoGallery[]
	- Rich view card: avatar with gallery count badge, energy pill (colour-coded), play style pills, socialisation section, health & vet section (vaccination/spayed tags, conditions, clinic info), scrollable photo gallery
	- Full edit form: energy level dropdown, play style multi-select pills, socialisation textarea, vet fieldset (clinic, phone, last checkup, vaccinations checkbox, spayed checkbox, medications, conditions)
	- Mock data enriched for both Spot and Goldie

- [x] Explore interactive map #explore
	- Already built: Leaflet map with price pill markers, click→popup with provider card, auto-fit bounds
	- 3-column desktop layout (filters | results | map), hidden on tablet/mobile
	- CDN-loaded Leaflet, Carto Positron tiles, all providers have lat/lng

- [x] Messaging: 1:1 between Connected users #messaging
	- Direct message conversation type added alongside booking conversations
	- Inbox split into "Messages" and "Booking inquiries" sections
	- Direct threads: "Connected" badge in header, no inquiry form, compose bar always visible
	- Mock conversations with Jana K. (connected) and Eva (familiar)
	- ConversationsContext extended with `getOrCreateDirectConversation()`

- [x] Unified profile layout + trust signals #profile #explore
	- Own profile rewritten to match explore profile layout (sidebar + panel desktop, condensed mobile)
	- Consistent tabs: About | Services | Reviews
	- Trust signals on provider profiles: connection badge, relationship-aware CTAs
	- Connected → "Message" + "Book care"; Familiar → "Connect"; None → "Contact"
	- Pet edit cards match signup flow (photo, name, breed, size dropdown, age, health notes)

- [x] Profile edit mode #profile
	- Edit bio, pets, visibility settings (local state, persists in session)
	- Add/remove pets with InputField components
	- Visibility toggle on Offering tab
	- Cancel reverts changes, Save persists to local state

- [x] Booking detail page #bookings
	- Already built: session tracking (upcoming → in_progress → completed), start/cancel/complete buttons
	- Price breakdown with line items, billing cycle labels
	- Review section with star picker + comment on completed bookings
	- Contract meta with conversation link


## Notes

**Phase goal:** Polish the existing care/booking flows and make profiles fully functional. Complete the demo story: meets → trust → care.

**Exit criteria:**
1. Booking detail shows session status, price, and review flow
2. Profile has working edit mode for bio and pets
3. Provider profiles show connection status and trust indicators
4. Explore map has interactive pins
5. Connected users can send direct messages
6. Pet profiles have enhanced detail fields

**Open considerations:**
- How deep should booking status flow go for the prototype?
- Should provider trust signals show number of mutual connections?
- Map: use existing Leaflet setup from explore, or different approach?

**Depends on:** Phase 4 (UX polish establishes consistent patterns) ✓

**Start date:** 2026-03-16
