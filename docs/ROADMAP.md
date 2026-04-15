---
category: meta
status: active
last-reviewed: 2026-04-15
tags: [roadmap, phases, planning]
review-trigger: "at the start and end of every phase"
---

# Doggo — Product Roadmap

**Goal:** A demo-quality prototype that makes testers forget they're looking at a prototype. When someone sits down with a persona, the world should feel real — the data, the interactions, the flow between pages.

**Process:** Phase lifecycle in `CONTRIBUTING.md`. Phase boards in `phases/`. Archive in `archive/phases/`.

---

## Principles

1. **Build the best version, not the fastest.** Quality over speed.
2. **Think like a user.** Every page should feel useful, clear, and trustworthy.
3. **No phase ships without working content.** Empty tabs and placeholder text are bugs.
4. **Each phase starts and ends with a doc review.** Read referenced docs, update stale ones, check open questions.
5. **The demo is the finish line.** Every phase makes the world richer and more convincing.

---

## Where We Are

The full product skeleton exists. Every page renders with real content and working interactions. But many surfaces are 60-70% — they tell the story at a glance but don't hold up under scrutiny. The path forward is deep page-by-page passes, then world-building, then demo packaging.

**30+ phases completed.** Full history in `archive/phases/`.

**Punch list:** `phases/punch-list.md` — runs alongside whatever phase is active.

---

## Current Phase

### Meets Deep Pass

Meets are the core trust-building mechanic. They need to feel compelling — like events you'd actually want to attend.

**Phase board:** `phases/meets-deep-pass.md`

### Profiles Deep Pass — Paused

Paused 2026-04-14. Trust signals, post composer, and post attribution shipped. Remaining content enrichment folded into Mock World Building.

**Phase board:** `phases/profiles-deep-pass.md`

---

## Upcoming Phases

Each phase takes a major surface and makes it the best it can be — rethink content, fix visual issues, add depth to mock data.

| Phase | Goal | Key refs |
|-------|------|----------|
| **Community & Groups** | Groups and feeds feel alive. Daniel lurks, Tomáš posts emergencies. | `features/meets.md`, `Groups & Care Model.md` |
| **Discover & Care** | Care discovery feels like community, not marketplace. Trust badges, matching, intro sessions. | `features/explore-and-care.md`, `Competitive Research - Prague Dog Care Scene.md`, `Competitive Research - Fluv.md` |
| **Schedule & Bookings** | Operational backbone. Visit report cards, session updates, provider in-session UI. | `features/schedule.md`, `features/explore-and-care.md`, `Competitive Research - Time To Pet.md` |
| **Mock World Building** | Coherent world for four personas with rich cross-connections, images, and content. | `mock-data-plan.md`, `User Archetypes.md` |
| **Cross-Cutting Flow Testing** | Every persona journey works end-to-end. Trust signals accumulate. No dead ends. | `User Journeys.pptx`, `Trust & Connection Model.md` |
| **Demo Presentation** | Landing page, persona selection, guided tours. Free exploration also rewarding. | `Product Vision.md`, `User Archetypes.md` |

Phase boards are created when a phase opens — that's where detailed tasks live. The research docs referenced above contain specific action items and open questions that feed into each phase's board.

---

## Key Considerations

Things to keep in mind across phases. Not tasks — lenses.

**Trust badges for providers.** Three-tier system (community-earned, credential, platform) that reinforces but doesn't replace the community trust model. Designed from how Prague providers actually build trust today. → `Competitive Research - Prague Dog Care Scene.md`

**Cold-start seeding.** Providers use meets/groups as a client acquisition channel, solving both sides of the marketplace simultaneously. Meets generate trust signals organically. → `Competitive Research - Prague Dog Care Scene.md`

**Session experience.** Visit report cards, real-time updates, and a focused provider in-session UI are table stakes for care confidence. → `Competitive Research - Time To Pet.md`

**Hybrid trust model.** Community trust is the primary mechanism, but lightweight signals (verified ID, network overlap, intro sessions) bridge the gap for users who haven't built deep connections yet. → `Competitive Research - Fluv.md`

---

## Beyond the Demo

Not yet planned, but will become relevant:

- Real backend (Supabase data model, auth, real-time messaging)
- Cold-start seeding execution (recruit providers, test the meets→clients loop)
- Production design pass
- User testing
- Insurance & dispute resolution
- Credential verification (self-declared → platform-verified)
- Live GPS during sessions (requires Supabase Realtime)
- Mobile native (React Native or PWA)

See `Open Questions & Assumptions Log.md` for the full list of unresolved questions.
