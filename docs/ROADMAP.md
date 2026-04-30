---
category: meta
status: active
last-reviewed: 2026-04-29
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

### Between phases

Community & Groups Deep Pass closed 2026-04-29. Next phase opens with **Mock World Building** (recommended) — many UI patterns shipped this pass benefit from richer per-persona seeded data before the next UX-heavy phase. See `archive/phases/community-groups-deep-pass.md` for the record.

### Profiles Deep Pass — Paused

Paused 2026-04-14. Trust signals, post composer, and post attribution shipped. Remaining content enrichment folded into Mock World Building.

**Phase board:** `phases/profiles-deep-pass.md`

---

## Upcoming Phases

Each phase takes a major surface and makes it the best it can be — rethink content, fix visual issues, add depth to mock data.

| Phase | Goal | Key refs |
|-------|------|----------|
| **Mock World Building** | Coherent world for the four journey personas with rich cross-connections, images, and content. **Reordered to next-up 2026-04-29 after Community & Groups Deep Pass closed** — that phase shipped enough UI (section grouping, Helper/Provider visibility, mark-state ladder, DogsNearYou neighborhood-aware, locked chip list) that data variety is now the bigger demo-quality bottleneck. **Unblocked by Persona & Demo Mode Wiring** (closed 2026-04-26). Specific gaps to backfill: per-persona `mockConnections`, conversations seeded for non-Shawn personas, broader post authorship, `shareCode` per persona, the unresolved provider-userId pattern (P4), profile-visibility distribution rebalance to ~70% locked / 30% open (P36), inbox name/dog format normalization (P35), 3+ dogs across multiple attendees (beyond just Shawn at meet-1, P31 follow-up), per-persona connection rosters, and **the deferred E1/E2/E4/E5 walks from Community & Groups** (group feed content per persona, group feed walks per type, Care group walk, community feed cross-persona walk). | `mock-data-plan.md`, `User Archetypes.md`, `features/demo-mode.md` |
| **Discover & Care** | Care discovery feels like community, not marketplace. Trust badges, matching, intro sessions. Inherits the soft-Familiar-indicator question for non-grouped surfaces (P29). Benefits from Mock World Building's data work landing first — provider profiles, care badges, and discovery cards depend on richer variety. | `features/explore-and-care.md`, `Competitive Research - Prague Dog Care Scene.md`, `Competitive Research - Fluv.md` |
| **Inbox & Notifications** | Inbox conversation list visual polish, notification card patterns, badge counts, request-vs-thread distinction, possibly threading model + read state. Surfaced during Community & Groups walkthrough — inbox needs a focused pass rather than piecemeal patches. | `features/messaging.md` (likely), `app/inbox/`, `app/notifications/`, `components/messaging/` |
| **Schedule & Bookings** | Operational backbone. Visit report cards, session updates, provider in-session UI. Care review sheets + provider close-out flow. IA scaffolding + review-recent pattern landed early during Meets Deep Pass — see `phases/schedule-bookings-deep-pass.md` for pre-loaded deferred scope. | `phases/schedule-bookings-deep-pass.md`, `features/schedule.md`, `features/explore-and-care.md`, `Competitive Research - Time To Pet.md` |
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
