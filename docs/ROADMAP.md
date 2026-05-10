---
category: meta
status: active
last-reviewed: 2026-05-10
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

**Care Catalog Taxonomy & Filter Redesign** *(opens after Discover Refinement close)*. Resolve the service taxonomy that drifted (`inhome_sitting` ended up meaning carer-side day care, not the babysitter-metaphor "sitting at owner's home" originally intended) and redesign the Discover Care filter panel against the resolved model. Phase board: `phases/care-catalog-taxonomy-and-filter-redesign.md` *(to be drafted at phase open)*.

Discover Refinement closed 2026-05-10 — full record in `archive/phases/discover-refinement.md`.

Inbox & Notifications closed 2026-05-10 — full record in `archive/phases/inbox-and-notifications-deep-pass.md`.

### Profiles Deep Pass — Paused

Paused 2026-04-14. Trust signals, post composer, and post attribution shipped. Remaining content enrichment folded into Mock World Building (now closed). Pre-loaded scope additions: D7 (Carer audience-setting toggle UI — `publicProfile` circle↔anyone progression + design-system-compliant Toggle component) added 2026-05-05 from Pricing & Proposals walkthrough; reframed 2026-05-10 (Discover Refinement) as the role collapse retired the Helper/Provider tier framing.

**Phase board:** `phases/profiles-deep-pass.md`

---

## Upcoming Phases

Reorganized 2026-05-04 around the principle that **services are the core functionality** — the actual transactional loop (provider pricing → inquiry → proposal → contract → sessions → payment) needs to sing before community surrounds get more polish. Inbox & Notifications and Onboarding shrink in scope because most of the service-flow comms and pricing-setup teaching now belong inside the service phases that come first.

| Phase | Goal | Key refs |
|-------|------|----------|
| **Cross-Cutting Flow Testing** *(after Care Catalog Taxonomy)* | Every persona journey works end-to-end with the now-solid services core. Trust signals accumulate. No dead ends. Pre-loaded with mock-world edge-case seeding + People-tab disclosure model + mock-data hygiene items. | `phases/cross-cutting-flow-testing.md`, `User Journeys.pptx`, `Trust & Connection Model.md` |
| **Onboarding & In-Product Communication** | Trust model + Carer audience + privacy mechanics + Carer pricing setup tutorials. Multiple touchpoints (locked profile lock card, Familiar asymmetry, Carer audience setting, privacy explainer, share-link bypass, group visibility chip, pricing setup walkthrough) share the same root: users need to understand mechanics without being lectured. | `phases/onboarding-and-communication.md`, `Trust & Connection Model.md`, `Open Questions §2 + §3 + §4` |
| **Design System Cleanup** | Resolve accumulated design-system inconsistencies — chip vs button visual collision, ButtonAction variant overlap, ModalSheet footer pattern drift, owner+dog avatar pattern cascade, optional-field label conventions (P51). Audits existing components into a coherent vocabulary; doesn't add new ones. Can run any time; best opened after a content phase. | `phases/design-system-cleanup.md`, `implementation/design-system.md`, Punch List P51 |
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
