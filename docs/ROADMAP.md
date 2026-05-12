---
category: meta
status: active
last-reviewed: 2026-05-11
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

## Current Phases

**Cross-Cutting Flow Testing + Demo Presentation (in parallel)** *(opens 2026-05-11)*. Cross-Cutting closes the end-to-end persona journeys with the data-hygiene fixes pre-loaded on its board (mock-world edge-case seeding, People-tab disclosure model, profile-visibility distribution skew, group↔meet relationship dedupe, MeetAttendee auto-derivation). Demo Presentation resumes from Workstream A/B/C shipped + D/E/F pending — the real product landing, logged-out flow previews, and Tereza-guided-tour updates needed for tester readiness. **Profiles Deep Pass may also run in parallel** on the no-regret mechanical items (Carer audience toggle UI + content enrichment); strategic items (D4 trust-signal prominence, E3 care-CTA funnel copy) wait for PO meeting outcomes. Phase boards: `phases/cross-cutting-flow-testing.md`, `phases/demo-presentation.md`, `phases/profiles-deep-pass.md`.

**Care Catalog Taxonomy & Filter Redesign closed 2026-05-11.** Four-service taxonomy resolved (`walks_checkins` / `house_sitting` / `day_care` / `boarding`) with documented meanings inline + mock-data migration. Filter panel redesigned — `Filters` heading + in-panel service-type dropdown with descriptive sublines teaching where/when axes; Pets + Nearby + Sub-services functional, persisted per-viewer; service-aware fields keyed off active pill. Vet retired from `AppointmentCategory` + `CareCategory` (kept `"grooming" | "training"` going forward). Tereza gained a second pet (Bella) for multi-pet capacity demos. Workstream A residual: 9 drifted sub-service strings normalized to canonical SUB_SERVICES. Cold-Start Playbook strategy doc drafted as by-product (Prague market research + trainer-led-walks framing + credentialing-gap moat). Full record in `archive/phases/care-catalog-taxonomy-and-filter-redesign.md`.

Design System Cleanup closed 2026-05-11 — opened mid-Care-Catalog as a parallel mechanical-cleanup session. Full record in `archive/phases/design-system-cleanup.md`.

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
| **Onboarding & In-Product Communication** *(after Cross-Cutting Flow Testing + Demo Presentation)* | Trust model + Carer audience + privacy mechanics + Carer pricing setup tutorials. Multiple touchpoints (locked profile lock card, Familiar asymmetry, Carer audience setting, privacy explainer, share-link bypass, group visibility chip, pricing setup walkthrough) share the same root: users need to understand mechanics without being lectured. Cross-Cutting Flow Testing surfaces the moments where teaching is most needed — that's the natural feeder into this phase. | `phases/onboarding-and-communication.md`, `Trust & Connection Model.md`, `Open Questions §2 + §3 + §4` |
| **Photos & Galleries** *(draft — sketched 2026-05-11 during Profiles Deep Pass walkthrough B6)* | Per-dog "Photos" auto-album derived from tagged posts; profile-level photo grid; curated Highlights strip; owner moderation (untag, hide, approve queue); cross-cutting privacy walkthrough. Existing Content Visibility Model rules already prescribe the gates — this phase ships the surfaces. **Pre-open block:** moderation + tag-approval Open Questions need resolution first. | `phases/photos-and-galleries.md` (draft), `Content Visibility Model.md`, `Open Questions §12` |
| **Carer Portfolio** *(draft — sketched 2026-05-11, sibling to Photos & Galleries)* | Aggregate trust signal computed from completed engagements (bookings + past meet attendances). Renders in `TrustBadgeStrip` on carer profile hero with priority-rule propagation to PersonRow + Discover cards. Lands the Cold-Start Playbook credentialing-layer thesis — verifiable, hard to fake, accumulates with real work. **Pre-open block:** threshold + copy + time-scope + surface Open Questions need resolution first. **Not in scope:** photo-tag portfolios, dog-level credit (named-dog list), reviews/ratings. Independent from Photos & Galleries — either can open first. | `phases/carer-portfolio.md` (draft), `Cold-Start Playbook.md`, `badges.md`, `Open Questions §8` |

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
