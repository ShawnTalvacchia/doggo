---
category: meta
status: active
last-reviewed: 2026-06-24
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
5. **The demo earns the next step.** It's a validation instrument, not the finish line — make the world convincing enough to put in front of users and shelters, learn, then decide how to build for real. Every phase makes the world richer and more convincing.

---

## Where We Are

The full product skeleton exists — every page renders with real content and working interactions. Many surfaces are still 60-70%: they tell the story at a glance but don't hold up under scrutiny. The track: deep page-by-page passes → world-building → demo packaging → **validation** (put the demo in front of users and shelters, then decide how to build for real).

A June 2026 strategy refresh reframes that track. The demo is now a *validation instrument*, sharpened by: a positioning + give-back model leading with the socialization wedge (`strategy/Doggo_Positioning_and_Three_Worlds.md`), and a competitive refresh showing a more crowded Prague landscape where the moat is integrating the whole funnel, not running a care marketplace (`strategy/Competitive Research - Prague Snapshot (2026-06 refresh).md`).

**Up next:** **The Shelter's Side** (Phase 2 of the two-phase validation arc; see *What's Next*) — the shelter operator experience + the feasibility interview kit. Phase 1 (the three community Worlds + a guided-walkthrough registry) shipped; its shelter path deliberately deferred session execution, the operator view, and the adoption-interest landing to Phase 2 — which now both *builds* those and *revises* the shelter walkthrough's back half against the real surfaces. A design-system code-health backlog runs on the punch list — P82.

Build history lives in `archive/phases/` (this roadmap is a compass, not a changelog — it doesn't recap what shipped). The punch list (`planning/punch-list.md`) runs alongside whatever phase is active.

---

## What's Next

The forward track toward the demo. Phase boards are created when a phase opens — that's where detailed tasks live; the research docs referenced below feed each board.

The **two-phase validation arc** (scope confirmed 2026-06-22). FC17's documented four-path taxonomy was reconciled against the PO's three-audience framing: the three community Worlds were Phase 1 (shipped); the shelter's *own* (operator) view — which existed nowhere as a walkthrough, only faked toggles + FC16 — graduates into Phase 2 (next). Governing interview principle: **desirability before feasibility** (the demo paints an appealing, clear picture first; the hard feasibility questions — insurance, liability, the binding-constraint — come after, in conversation).

| Phase | Goal | Key refs |
|-------|------|----------|
| **The Shelter's Side — operator experience + feasibility kit** — *Phase 2, next* | The shelter's *own* POV — "what do I do, how little work/risk is this": the **handover** (check-out → back-safe check-in, logged), the **vouch/application landing**, **walker-pool** view, **adoption-interest landing**. Built as deep as makes the strongest impression; graduates a defined slice of **FC16**, rest stays faked/future. Completes the shelter pitch (both sides). Ships the **feasibility interview kit** (desirability-first; the questions the demo can't ask). **Also revises the shelter walkthrough's deferred back half** against the real surfaces — the Phase-1 shelter cut narrated (not built) the session execution, the operator side, and the adoption-interest landing, and left the shelter copy/story explicitly unsettled for revision here. The FC18 group-walk *checkout/release* model (Open Questions §FC18-tension-2) is the live shelter-interview question this phase tests. | `Future Considerations` FC16, `strategy/Doggo_Positioning_and_Three_Worlds.md` (§3 + Appendix), `strategy/mentor-network-shelter-demo.md` (the 8-beat live-interview script + A1–A10 crosswalk), `Open Questions §5 / §14 / §6` |
| **Validation → Build decision** *(after the demo + interviews)* | Run the walkthrough paths as interviews (users, trainers, at least one real shelter), synthesize, then make the call the project is ready for: **whether and how to build for real** — backend, who builds it, and the give-back/structure. This is the "get serious" gate. | `strategy/Doggo_Positioning_and_Three_Worlds.md` (§Where this goes next), `Open Questions & Assumptions Log.md` |
| **Onboarding & Communication (rewrite)** *(paused — re-scope when surfaces stabilize)* | Teach the model in-product: the Services/Care/Meet split, the connection gradient, profile visibility, and the multi-doorway personas. Re-scope the archived board against the current world (walker-trainer narrative, four-service taxonomy, mentor-session shape). Expect a significant rewrite. | `archive/phases/onboarding-and-communication.md`, `Trust & Connection Model.md`, `Open Questions §2/§3/§4` |

**Running alongside (not phases):**

- **Config #2 meet-side link authoring** *(small, technical — slot whenever)* — a meet-side editor declaring which drop-off Care services run on a meet. Needs a meet-edit screen (`MeetComposer` is create-only). Not blocking anything strategic. → `archive/phases/service-meet-linkage.md` H4
- **Punch list** — continuous. → `planning/punch-list.md`

---

## Key Considerations

Things to keep in mind across phases. Not tasks — lenses.

**Trust badges for providers.** Three-tier system (community-earned, credential, platform) that reinforces but doesn't replace the community trust model. Designed from how Prague providers actually build trust today. → `Competitive Research - Prague Dog Care Scene.md`

**Cold-start seeding.** Providers use meets/groups as a client acquisition channel, solving both sides of the marketplace simultaneously. Meets generate trust signals organically. → `Competitive Research - Prague Dog Care Scene.md`

**Session experience.** Visit report cards, real-time updates, and a focused provider in-session UI are table stakes for care confidence. → `Competitive Research - Time To Pet.md`

**Hybrid trust model.** The three-tier badge architecture (community-earned > credential > platform) IS the hybrid model in shipped form. Community-built signals (visit reports, post-meet reviews, mutual connections, repeat-client counts) compose with credential signals (KYNOLOG.cz cert, methodology affiliations, shelter walker tier badges, Carer Portfolio aggregate) and platform signals (Verified Identity — taxonomy slot, not yet built). Credentialing layer is the **deliberate strategic moat** (per Open Questions §7 resolution 2026-06-01). → `Open Questions §2 + §7 + §8`, `Cold-Start Playbook.md`

**Competitive landscape — refreshed June 2026.** The Prague care market is more crowded and fragmented than the older research assumed: transactional booking is occupied (Hlídačky, PetBacker, direct operators) and the socialization lane is *not* empty (Hafinder et al.). Doggo's moat is **integrating the whole funnel** — community → trust → care → shelter → give-back — not being a nicer care marketplace; the risk to avoid is positioning-drift toward "book a walker." Plus a name/trademark flag (an existing "DogGO/Doggo" pet app). Supersedes the competitor coverage in `Competitive Research - Prague Dog Care Scene.md` (reconcile). → `Competitive Research - Prague Snapshot (2026-06 refresh).md`

**Positioning & give-back.** Lead with the socialization wedge — "social early and often" as health, since under-socialization drives the behaviour problems behind most relinquishments. Money flows to shelters via a for-profit **give-back** (sponsor-a-dog → fee share, Chewy-style transparency), not a non-profit conversion. → `Doggo_Positioning_and_Three_Worlds.md`

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
