---
status: scratch
last-reviewed: 2026-06-09
review-trigger: "Delete after the Mentor Network phase opens"
---

# Next session kickoff — Cross-Shelter Mentor Network

This file is a one-shot prompt for the session that opens the Cross-Shelter Mentor Network phase. Delete after the phase board lands.

---

## Paste into the next session

> We're opening the **Cross-Shelter Mentor Network** phase. Before you do anything, read in this order:
>
> 1. `CLAUDE.md` (project rules)
> 2. `docs/ROADMAP.md` → the phase entry for Cross-Shelter Mentor Network (currently sized 2026-06-09)
> 3. `docs/strategy/Cold-Start Playbook.md` → the entire "Mentor-vouching as the scalable trust mechanism" subsection AND the new "Assumptions to validate" subsection that follows it
> 4. `docs/planning/Open Questions & Assumptions Log.md` §14 (Shelters & Institutional Accounts) — the "Shipped 2026-06-09" header block summarizes the credentialing-moat foundation this phase builds on
> 5. `docs/archive/phases/carer-portfolio-and-shelter-walker.md` → "Strategic Review (2026-06-09)" section at the bottom. It explicitly flagged three open questions worth resolving before this phase opens.
> 6. `docs/features/shelters.md` → "Volunteer work on user profiles" + "Discovery" sections, and `docs/implementation/badges.md` → "Credential pill family" — these are the shipped primitives this phase builds on.
>
> Then run the Opening Checklist per `docs/CONTRIBUTING.md` → "Opening a Phase."
>
> **Phase reframing from last session's strategic review:** instead of "build the mechanism, then talk to shelters," the user wants to build a **fleshed-out shelter-facing demo with explicit assumptions flagged**, to use as the artifact for PO/shelter coordinator interviews while the PO arranges them. Three scope disciplines for the phase board:
>
> - **Two walkthroughs, one phase.** The standard dev-facing walkthrough verifies the build works. Add a SECOND **shelter-facing walkthrough** (`docs/phases/cross-shelter-mentor-network-shelter-demo.md` or similar) — written like a sales demo, narrating the storyline ("Klára onboards a new walker for Útulek in three minutes"). This walkthrough is the deliverable for shelter conversations, not just internal verification.
> - **Shelter operator surface stays stubbed.** Don't try to build coordinator UX from scratch — V3+ territory. For demo purposes, "Approve walker" / "Accept mentor-vouch" / "Credit historical walks" are state-toggle dropdowns like everything else demo-side. The shelter-facing walkthrough shows the WALKER and MENTOR sides as polished surfaces; the operator side is honestly faked.
> - **The "Assumptions to validate" section in the Playbook drives PO interview prep.** Each phase decision that depends on a Playbook assumption should reference the assumption by number (e.g. "per A1, A3") in the phase board, so when an interview refutes an assumption, the phase scope is easy to revisit.
>
> **Three open questions from the strategic review that ideally get a quick discussion before the phase opens** (not blocking, but flag them):
>
> 1. **Mentor session pricing model** — priced like 1:1 training (~600 CZK/hour)? Guided intro (~300 CZK)? Volunteer + tip? Each shape carries different second-order effects.
> 2. **Mentor-vouching authority** — does the shelter still approve? Three options drafted: (a) mentor's vouch is binding, (b) "recommended for vouching" status the shelter still approves, (c) shelter sets the policy (`acceptsMentorVouches: boolean` per shelter). Probably (c), but the UX shape for shelters that DON'T accept matters.
> 3. **Adoption-curious persona shape** — the Multi-Path Demo phase depends on this archetype existing in `lib/personas.ts`. Doesn't exist yet. Behavioral profile matters (do they engage with meets? Connect with anyone?).
>
> Some of these may resolve cleanly with the user's input; others may need to be Open-for-your-call items in the new phase board.
>
> **What shipped last session that this phase builds on** (verify before claiming you can use them):
>
> - `WalkerApplicationsContext` with `applied → invited → vouched + walkCount` state machine
> - Walker tier model: T1+T2 share "Volunteer" / T3 "Super Volunteer," via the shared `.credential-pill` family (carer blue + volunteer violet)
> - `Booking.ownerKind: "user" | "shelter"` discriminator (the type extension; consumer wiring is part of THIS phase's scope)
> - `getUserShelterAffiliations(userId, dynamicVouched)` resolver in `lib/trustBadges.ts` or similar — combines static `mockShelters.walkers` with dynamic vouched applications
> - "Volunteer work" cross-shelter section on `/profile/[userId]`
> - Shelter-membership sort elevation on `/discover/help-a-dog`
> - `ShelterPolicy` per-shelter overrides (already shipped — this phase extends it with `acceptsMentorVouches?: boolean` and `mentorSessionMinimum?: number`)
> - Hidden-affordance state-toggle pattern (`features/demo-mode.md` → "Hidden-affordance pattern")
>
> **What does NOT yet exist** that this phase needs to build:
>
> - `mentor_session` as a third kind on the `CarerServiceConfig` discriminated union (alongside Care/Meet/Appointment)
> - The Booking creation surface for shelter walks (deferred from last phase as P77 / honestly-deferred D1) — this phase has to either land it or honestly defer it further
> - Cross-shelter affiliation portability — promoting Super Volunteer from per-shelter to platform-level tier with shelter context preserved
> - Layered waiver model (platform baseline + per-shelter waivers + mentor-minimum)
> - Bootstrap affordance for shelters to credit historical real-world walks
> - The Mentor session surface itself — likely a new Carer service rendering on profile + booking flow that handles the dual relationship (sponsor + shelter context)
> - The shelter-facing demo storyline + the second walkthrough doc
>
> Start by drafting the phase board in plan mode, including:
> - The two-walkthrough discipline explicit in the board's "Workstreams" section
> - Per-workstream references to the Playbook assumptions they depend on
> - An honest "Honestly deferred" list (the operator surface is the obvious one)
> - A clear ship target / mid-phase checkpoint
>
> The user will probably want to discuss the three open questions above before the board lands. Surface them up-front.

---

## Notes for whoever runs the kickoff

- The user has time to build while waiting on PO interviews — this is intentionally building under uncertainty.
- The phase scope is larger than recent phases (last comparable: Shelter Foundation). Don't try to ship everything; pick the load-bearing 60% and honestly defer the rest.
- Cold-Start Playbook's "Assumptions to validate" section is the single source of truth for "what we're guessing." Whenever you add a phase-board task that hinges on a guess, reference it by number.
- Service Options & Booking Clarity is still queued — small enough to interleave OR slide after Mentor Network. User's call at phase open.
