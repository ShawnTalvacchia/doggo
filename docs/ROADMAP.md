---
category: meta
status: active
last-reviewed: 2026-06-02
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

## Upcoming Phases

Reorganized 2026-06-01 to reflect three strategic shifts: (a) **shelter direction graduated** from pre-roadmap exploration to an active strategic thread (PO pursuing real Prague shelter conversations) and lands as a real phase built in code — not preempted by mockups; **Shelter Foundation shipped 2026-06-02**, archived board in `archive/phases/`, (b) **Dog Profile is next** — picks up directly from the minimal version Shelter Foundation shipped, with the shared spine already partially in place, (c) **Carer Portfolio and Shelter Walker Credentialing merge** into one credentialing-moat phase — same engagement-aggregation thesis applied to two domains (per §8 + §7 Open Questions resolutions 2026-06-01). Open Questions resolution pass completed 2026-06-01 — Photos & Galleries unblocked (§12), Carer Portfolio threshold/display resolved (§8), marketplace-vs-community fork retired as false binary (§7), full shelter scope codified (§14).

| Phase | Goal | Key refs |
|-------|------|----------|
| **Dog Profile** *(next — sized 2026-06-01, scope refined 2026-06-02 with vaccines V1 + pet-level standing preferences per PO interviews; Shelter Foundation shipped the shared-spine minimum)* | Deepens the minimal shelter dog profile from Shelter Foundation AND introduces the owned-dog profile (which doesn't exist anywhere yet — owned dogs are just PetCards today). Shared spine already partially in place (hero, name, breed/age/sex/weight, backstory, tags, kennel stats, recent walkers, posts about this dog, shelter backlink); this phase fills the owned-dog side (owner attribution, vet info, daily routine, household notes), the photo-gallery surface (placeholder slot from Shelter Foundation), and the new V1 fields. **Vaccines V1** *(added 2026-06-02 from PO interviews)*: replaces the boolean `VetInfo.vaccinationsUpToDate` with a structured per-vaccine record (type — Rabies / Parvovirus / Distemper / Hepatitis / Parainfluenza — + dates), an explicit acknowledgement-of-accuracy framing, and a display surface on the dog profile. **No gating in V1** — verification + meet-gating belong to OQ §15 + §16 (Vets as a Credentialing Layer). **Pet-level standing preferences** *(added 2026-06-02 from PO interviews)*: structured fields for things-the-dog-likes / dislikes / triggers / play preferences — visible to anyone who books this pet, so the carer doesn't need it re-explained every booking. Per-booking overrides ("solo today," "longer today") are deferred to the third-comms-surface decision (see `features/explore-and-care.md` Key Decision #8). Hookup points for Photos & Galleries (per-dog photo gallery surface). Tag taxonomy formalization (FC8) lands here. | `Open Questions §14 + §15`, `features/shelters.md`, `features/profiles.md` (PetCard), `Cold-Start Playbook.md`, `meetings/po-briefing-2026-06-02.md`, FC8 |
| **Photos & Galleries** *(unblocked 2026-06-01 — §12 resolved)* | Per-dog "Photos" auto-album derived from tagged posts; profile-level photo grid; curated Highlights strip; owner moderation (untag via per-post menu / hide-from-album + pin-to-Highlights via long-press / per-dog settings); cross-pet households (per-dog albums on each PetCard). Tag-approval inherits from owner (per-dog override deferred). Dog Profile phase (above) gives this its landing surfaces. | `phases/photos-and-galleries.md` (draft), `Content Visibility Model.md`, `Open Questions §12` |
| **Carer Portfolio + Shelter Walker Credentialing (merged credentialing-moat phase)** *(sized 2026-06-01)* | One phase, two domains. **Carer Portfolio side:** aggregate "{tier} · {N} sessions" badge — Carer (3–9) / Experienced Carer (10–24) / Trusted Carer (25+) — visually escalating (outlined → filled → filled+ring), rendered in `TrustBadgeStrip` with priority-rule propagation to PersonRow + Discover cards. **Shelter Walker side:** per-shelter institutional tiers (Vetted Walker / Experienced Walker / Trusted Handler) gating real permissions; per-shelter policy + per-dog overrides; vouching state machine; walker tier badges sharing the visual escalation language with Carer Portfolio. Lands the credentialing-as-deliberate-moat thesis (per §7). Walker journey (booking a shelter dog walk, active session, visit report attaching back to dog) lives here too. | `Open Questions §8 + §14`, `Cold-Start Playbook.md` → "The credentialing-gap moat" + "Walker credentialing as a shelter trust layer", `badges.md` |
| **Service Options & Booking Clarity** *(draft, sized 2026-06-02 from PO interviews)* | Three workstreams of booking-flow transparency: A) Day-care half-day SKU via `durationOptions` mirror; B) Appointment meeting-options (where does training happen?) — carries the generalise-vs-separate + curated-vs-free-form design Qs as Pre-build scope calls; C) Walks pickup/drop-off address specificity. Generalises the Walk Service Delivery pattern across walks + appointments + day-care duration. | `meetings/po-briefing-2026-06-02.md`, `phases/service-options-and-booking-clarity.md`, `Open Questions §17` |
| **Onboarding & Communication (rewrite)** *(paused — needs re-scope when surfaces stabilize)* | With shelter direction landed and Carer Portfolio shipped, the onboarding question is finally well-posed. Re-scope from the archived 2026-05-04 board against the V2 walker-trainer narrative + shelter entry-point persona (someone joining to walk shelter dogs, not to manage their own pet) + Photos & Galleries gates + four-service Care taxonomy. **Pre-open block:** original board needs full re-read + reassessment; expect significant rewrite. | `archive/phases/onboarding-and-communication.md`, `Trust & Connection Model.md`, `Open Questions §2 + §3 + §4` |
| **Design System Cleanup** *(sized 2026-05-14; intentionally late in the arc)* | Consolidation pass before demo polish. Section shell component (FC4), IdentityChip (FC5), the recurring `flex-1 + white-space:nowrap` CTA pattern, P67 component-consolidation audit, the bundle-wrapper pattern applied 3+ times during PDP. Originally proposed earlier in the queue; deferred 2026-06-01 because by the time it runs there'll be additional shelter + Dog Profile + Carer Portfolio surfaces with new consolidation opportunities — cleaning up everything at once is higher leverage than a clean-then-make-mess-again cycle. | `Future Considerations.md` FC4/FC5, `phases/punch-list.md` P67, `docs/implementation/design-system.md` |

**Side tasks running alongside (not phases):**

- **Config #2 meet-side link authoring** *(small, technical — slot whenever)* — A meet-side editor declaring which drop-off Care services run on a meet. Needs a meet-edit screen (`MeetComposer` is create-only). Not blocking anything strategic; palate-cleanser between bigger phases. See `archive/phases/service-meet-linkage.md` Workstream H4.
- **Punch list** — Continuous. `phases/punch-list.md`.

Phase boards are created when a phase opens — that's where detailed tasks live. The research docs referenced above contain specific action items and open questions that feed into each phase's board.

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
