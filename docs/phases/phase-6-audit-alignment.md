---
category: phase
status: active
last-reviewed: 2026-03-21
tags:
  - phase-6
  - audit
  - alignment
  - landing-page
  - home
  - polish
review-trigger: this is the current phase — check before every session
kanban-plugin: board
---

# Phase 6 — Audit & Alignment

## Backlog

- [ ] Visual consistency pass #polish
	- Screenshot each page, compare against design tokens and shared patterns
	- Ensure consistent spacing, typography, colour usage across all pages
	- Verify all pages feel like one product

- [ ] Component and token cleanup #cleanup
	- Audit globals.css for unused/orphan tokens
	- Verify all tokens appear in styleguide
	- Check component inventory is up to date with what's actually built

- [ ] Navigation review #nav
	- Verify labels, ordering, and flows match current strategy
	- Check desktop vs mobile nav consistency
	- Confirm "Find Care" / "Offer Care" CTAs are properly positioned

- [ ] Final doc update pass #docs
	- Ensure all feature docs match what's actually built
	- Update last-reviewed dates across all active docs
	- Verify ROADMAP reflects actual progress


## In Progress


## Done

- [x] Desktop nav: "Offer Care" link added #nav
	- Links to `/profile` where offering services is managed

- [x] Signup flow: removed Role step #signup
	- Flow is now `start → profile → pet → visibility → success`
	- Matches "everyone starts as an owner" principle

- [x] `/explore` redirect #nav
	- Bare `/explore` route now redirects to `/explore/results`

- [x] Home page overhaul #home
	- Personalised greeting with dog names
	- Community-first CTAs (Find a Meet, Explore Care)
	- Neighbourhood highlights section
	- Upcoming meets and suggested connections

- [x] Landing page overhaul #landing-page
	- Hero: photo background, "Your dog's neighbourhood crew" tagline, dual CTAs
	- Emotional hook: "Does your dog have a community?" + trust badges
	- Meet types: photo-based cards (group walks, park hangouts, playdates)
	- How it works: interactive tab switcher (owner/sitter perspectives)
	- Archetypes: two-column layout — text/CTA left, 3 cards with coloured ribbons right (Regular, Connector, Organiser)
	- Care section: "Care from people you already know" with three benefit points + photo
	- Testimonials: three community stories (Eva, Jana, Tomáš)
	- Bottom CTA: "Your dog deserves a crew"
	- Copy direction: dog-first emotional hook, community-then-care narrative

- [x] Feature docs updated #docs
	- meets.md: location flexibility, public→private group progression
	- signup-reference.md: role + provider steps marked archived

- [x] Landing page feature spec created #docs
	- New `docs/features/landing-page.md` documenting section structure, copy decisions, narrative flow

- [x] Product Vision updated #docs
	- Added Brand Voice & Positioning section (tagline, emotional hook, archetype framing)

- [x] Phase 5 marked complete #docs

- [x] ROADMAP updated with Phase 6 progress #docs

- [x] Component inventory updated #docs
	- Added ArchetypeCard, MeetTypeCard, TestimonialCard


## Notes

**Phase goal:** Review everything built in Phases 1–5 against the updated strategy and feature docs. Identify gaps, inconsistencies, and polish opportunities. No new features — refine what exists.

**Exit criteria:**
1. Every page audited against strategy docs — no contradictions
2. Landing page communicates community thesis clearly (dog-first hook, trust narrative, care as outcome)
3. Signup flow matches strategy (no provider role, visibility choice)
4. Visual consistency across all pages
5. Component inventory and token docs up to date
6. All docs current with last-reviewed dates

**Depends on:** Phase 5 (care & profile enhancement) ✓

**Start date:** 2026-03-17
