---
category: meta
status: active
last-reviewed: 2026-04-27
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

**Recurrence model landed (2026-04-27):** the recurring-meet RSVP model is now per-occurrence. Going / Skip per date + a series-level Interested toggle replaces the legacy "RSVP to the whole series" pattern. See `archive/phases/meet-recurrence-model.md` for the record.

### Trust & Visibility Pass — Parallel

Opened 2026-04-27, runs **in parallel** with Meets Deep Pass. Standardizes how the app renders people and gates access to their content. Builds a shared `PersonRow` component used across meet detail People tab, group Members tab, inbox conversation list, and post-meet review. Enforces a Meta-style action matrix (locked-to-locked = silent; mark Familiar to invite contact). Absorbs punch-list items P19 (Familiar copy + tier-logic audit) and P25 (content visibility audit on meet detail).

**Phase board:** `phases/trust-visibility-pass.md`

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
| **Schedule & Bookings** | Operational backbone. Visit report cards, session updates, provider in-session UI. Care review sheets + provider close-out flow. IA scaffolding + review-recent pattern landed early during Meets Deep Pass — see `phases/schedule-bookings-deep-pass.md` for pre-loaded deferred scope. | `phases/schedule-bookings-deep-pass.md`, `features/schedule.md`, `features/explore-and-care.md`, `Competitive Research - Time To Pet.md` |
| **Mock World Building** | Coherent world for the four journey personas with rich cross-connections, images, and content. **Unblocked by Persona & Demo Mode Wiring (closed 2026-04-26)** — switcher infrastructure lets curated per-persona data show through. Specific gaps to backfill: per-persona `mockConnections`, conversations seeded for non-Shawn personas, broader post authorship, `shareCode` per persona, plus the unresolved provider-userId pattern (punch-list P4). | `mock-data-plan.md`, `User Archetypes.md`, `features/demo-mode.md` |
| **Cross-Cutting Flow Testing** | Every persona journey works end-to-end. Trust signals accumulate. No dead ends. | `User Journeys.pptx`, `Trust & Connection Model.md` |
| **Demo Presentation** | Landing page redesign, persona selection presentation, guided tours. Free exploration also rewarding. The `/demo` route from Persona Wiring is the technical foundation; presentation framing is the open work. | `Product Vision.md`, `User Archetypes.md`, `features/demo-mode.md` |

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
