---
category: phase
status: complete
last-reviewed: 2026-03-16
tags: [phase-2, nav, landing, home, signup, schedule]
review-trigger: "archived — Phase 2 complete"

kanban-plugin: basic
---

# Phase 2 — App Shell & Navigation

## Backlog


## In Progress


## Done

- [x] Nav restructure: Home | Meets | Schedule | Inbox | Profile (mobile + desktop) #nav
	- Mobile: 5-tab bottom nav (Home, Meets, Schedule, Inbox, Profile)
	- Desktop: centre links (Home, Meets, Schedule) + Find Care / Offer Care CTAs + Bell, Inbox, Avatar icons
	- DOGGO logo links to /home when logged in
	- Existing Explore flow accessible via "Find Care" CTA
	- Bookings icon removed from top nav (Schedule handles this)

- [x] Home feed page (shell + empty states) #home
	- Sections: nearby meets, suggested connections, community highlights — all with empty states
	- Find Care / Offer Care CTAs at top
	- "Browse Meets" CTA in empty state

- [x] Schedule page (shell) #schedule
	- This Week / Coming Up / Past sections with empty states
	- CTAs: Create Meet, Find Care, Offer Care

- [x] Meets page (shell + empty states) #meets
	- Filter pills (All, Walks, Park Hangouts, Playdates, Training)
	- Nearby / Upcoming / Recent sections with empty states
	- Create button in header

- [x] Signup flow cleanup #signup
	- Removed provider-specific steps (care-preferences, walking, hosting, pricing)
	- Simplified flow: start → role → profile → pet → visibility → success
	- New `/signup/visibility` page: Locked/Open card selection with trust model explanation
	- Success page rewritten: community-first CTAs (Go to Home / Browse Meets)
	- Profile page: removed inline visibility toggle (moved to dedicated step)

- [x] Landing page rewrite — community-first angle #landing
	- Hero: "Your dog's neighbourhood crew" — leads with meets, not marketplace
	- Hero card: upcoming meets preview (replaces provider list)
	- CTAs: "Join the community" / "Browse meets"
	- New sections: Ways to meet up, Trust progression (Locked→Familiar→Connected)
	- How it works tabs: "Join the Community" / "Find Care"
	- Removed: service pricing cards, featured carers grid, marketplace language


## Notes

**Phase goal:** Every subsequent feature has a home. Navigation works end-to-end. Landing page communicates the community thesis. Signup captures the right info.

**Exit criteria:**
1. All 5 nav tabs work and route correctly (mobile + desktop)
2. Landing page communicates community-first angle — reviewed with PO
3. Home feed renders with empty states
4. Signup flow collects profile, pet, neighbourhood, visibility — no provider steps
5. Schedule page shell exists with placeholder content
6. Styleguide parity maintained (any new components documented)

**Depends on:** Phase 1 (clean design system to build on) ✓

**Start date:** 2026-03-16
