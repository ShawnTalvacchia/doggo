---
category: meta
status: active
last-reviewed: 2026-06-16
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

The full product skeleton exists — every page renders with real content and working interactions. Many surfaces are still 60-70%: they tell the story at a glance but don't hold up under scrutiny. The track to the demo: deep page-by-page passes → world-building → demo packaging.

**Current phase:** Service Options & Booking Clarity — built; in walkthrough.

Build history lives in `archive/phases/` (this roadmap is a compass, not a changelog — it doesn't recap what shipped). The punch list (`planning/punch-list.md`) runs alongside whatever phase is active.

---

## What's Next

The forward track toward the demo. Phase boards are created when a phase opens — that's where detailed tasks live; the research docs referenced below feed each board.

| Phase | Goal | Key refs |
|-------|------|----------|
| **Design-System Audit + Cleanup** *(next)* | Lead with a broad design-system audit — sweep for inconsistency + accumulated debt now that the shelter / Dog Profile / Carer Portfolio / Mentor Network surfaces have landed — feeding the punch list and scoping the cleanup. Then consolidate: Section shell (FC4), IdentityChip (FC5), `SortMenu` (FC15), the `flex-1 + nowrap` CTA pattern, P67/P76/P78, and promote the inlined violet hex to a real `--volunteer-*` token family. Late by design: clean once, after the surfaces settle. | `Future Considerations` FC4/FC5/FC15, `punch-list` P67/P76/P78, `implementation/design-system.md` |
| **Multi-Path Demo & Guided Walkthroughs (FC17)** | Wrap the built demo arcs (Daniel→Klára, shelter-mentor, adoption-curious) in a guided-UI layer: interstitial/step-card registry, per-arc staging, the `/` launcher doorway, "cut each path tighter." Wrap, don't redesign — each arc's beats are already a clean handoff. | `features/demo-mode.md`, `strategy/Demo Narrative.md`, `Future Considerations` FC17 |
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
