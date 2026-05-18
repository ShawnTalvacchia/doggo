---
category: meta
status: active
last-reviewed: 2026-05-17
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

No phase is currently open. **Demo Narrative V2 — Walker-Trainer Story** is the next phase (see Upcoming Phases) — a re-author of the guided demo around the walker-trainer hybrid framing, drafted 2026-05-18.

### Earlier closes (archive index)

- Guided Walkthrough Build closed 2026-05-18 — `archive/phases/guided-walkthrough-build.md`
- Demo Narrative & Personas closed 2026-05-18 — `archive/phases/demo-narrative-and-personas.md`
- Service ↔ Meet Linkage closed 2026-05-17 — `archive/phases/service-meet-linkage.md`
- Profiles Deep Pass closed 2026-05-14 — `archive/phases/profiles-deep-pass.md`
- Cross-Cutting Flow Testing closed 2026-05-14 — `archive/phases/cross-cutting-flow-testing.md`
- Demo Presentation retired 2026-05-14 — `archive/phases/demo-presentation.md` (workstreams A/B/C/D/F shipped; E pending; superseded by Demo Narrative & Personas)
- Care Catalog Taxonomy & Filter Redesign closed 2026-05-11 — `archive/phases/care-catalog-taxonomy-and-filter-redesign.md`
- Design System Cleanup closed 2026-05-11 — `archive/phases/design-system-cleanup.md`
- Discover Refinement closed 2026-05-10 — `archive/phases/discover-refinement.md`
- Inbox & Notifications closed 2026-05-10 — `archive/phases/inbox-and-notifications-deep-pass.md`

---

## Upcoming Phases

Reorganized 2026-05-04 around the principle that **services are the core functionality** — the actual transactional loop (provider pricing → inquiry → proposal → contract → sessions → payment) needs to sing before community surrounds get more polish. Inbox & Notifications and Onboarding shrink in scope because most of the service-flow comms and pricing-setup teaching now belong inside the service phases that come first.

| Phase | Goal | Key refs |
|-------|------|----------|
| **Demo Narrative V2 — Walker-Trainer Story** *(next — phase board drafted 2026-05-18)* | Re-author the guided demo as a polished narrated concept story. Walker-trainer hybrid framing (the cold-start engine, per the 2026-05-15 PO briefing); a tighter 3-beat structure (Klára → Daniel → Magda); pre-loaded content fired off in steps (posts, messages); richer interstitials (persona handoff / time-passage / feature explainer); the private-group mutual-care concept unpacked carefully. Mock-data + character reshaping, not new product surface. | `phases/demo-narrative-v2.md`, `docs/meetings/po-briefing-2026-05-15.md`, `Demo Narrative.md`, `Cold-Start Playbook.md` |
| **Design System Cleanup** *(sized 2026-05-14 from Profiles Deep Pass close)* | Consolidation pile is real: Section shell component (FC4), IdentityChip (FC5), the recurring `flex-1 + white-space:nowrap` CTA pattern, P67 component-consolidation audit, and the bundle-wrapper pattern applied 3+ times during PDP. Doing this before the next deep page-pass makes everything that follows cheaper. Not yet drafted — would absorb the FC items, P67, and a sweep of accreted patterns. | `Future Considerations.md` FC4/FC5, `phases/punch-list.md` P67, `docs/implementation/design-system.md` |
| **Config #2 meet-side link authoring** *(follow-on from Service ↔ Meet Linkage — sized 2026-05-17)* | Config #2's owner-facing side shipped *in* the Service ↔ Meet Linkage phase (Workstream H — drop-off-Care callout + booking; the link is seeded). This follow-on builds the **authoring** surface: a **meet-side** editor where a meet declares which drop-off Care services run on it. That's the right home — it keeps the Care service card clean (no "link a meet" affordance, which read as a confusing peer of "Session offering"), and it naturally handles **multi-carer** linking (a host advertising *other* carers' services). Needs a **meet-edit screen** — none exists today (`MeetComposer` is create-only), so a meet-edit surface is a prerequisite. | `Open Questions §13` (config #2 correction note), `archive/phases/service-meet-linkage.md` (Workstream H4) |
| **Onboarding & In-Product Communication** *(paused — after CCFT + DSC + Service ↔ Meet Linkage)* | Trust model + Carer audience + privacy mechanics + Carer pricing setup tutorials. Paused until surface stability — too much core flow still changing for tutorial work to invest in. Profile-side teaching (Familiar explainer card, Private/Public copy) already landed in PDP, which thinned this phase's scope. | `phases/onboarding-and-communication.md`, `Trust & Connection Model.md`, `Open Questions §2 + §3 + §4` |
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
