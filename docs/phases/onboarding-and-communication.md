---
status: planned
last-reviewed: 2026-05-03
review-trigger: When opening this phase, or when adding new deferred items
---

# Onboarding & In-Product Communication

**Goal:** The trust model + tier system + privacy mechanics are subtle and need to be explained clearly without over-explaining on every surface. Multiple touchpoints — locked profile lock card, Familiar mark asymmetry, Helper/Carer tier label, "Learn how privacy works" link with no destination yet, share-link bypass, group visibility chip clarity — share the same root: users need to understand what these mechanics do without being lectured.

**Depends on:** Discover & Care (the trust signal model + Care Group hero pattern need to be settled before the explainer page documents them).

**Refs:** [[strategy/Trust & Connection Model]], [[strategy/Open Questions & Assumptions Log]] §2 + §3 + §4 (Helper vs Carer terminology), [[features/profiles]]

---

## Pre-loaded Scope (deferred from punch list — 2026-05-03)

These items were raised on the punch list as in-product copy + comms gaps. Captured here so the phase has a starting punchlist instead of starting from scratch.

### Privacy explainer page (was P37)

The "Learn how privacy works" link on Locked profile pages is currently a placeholder (`href="#"`, `onClick` no-ops) — added 2026-04-30 during Mock World Building locked-profile copy update. Wire it to a real privacy explainer page. The destination should explain the privacy model (open vs locked, who sees what, how Familiar marks unlock visibility) and double as the route the viewer can adjust *their own* settings from — the lock card is the natural moment for a new user to wonder "wait, am I locked too?" Could live at `/profile?tab=privacy` (settings) or as a standalone explainer at `/help/privacy`; decide when the page is built. Touches `app/profile/[userId]/page.tsx` (the placeholder anchor).

### Share-profile link affordance (was P41)

Two related gaps. **(1)** The share-link bypass mechanism (`/connect/[shareCode]`) exists in code + strategy but has no clear in-product surfacing — audit whether a "Share profile" button is rendered on the user's own profile, and if not, build it. **(2)** The privacy explainer page above should explain the share-link bypass for the "we already know each other IRL but share no in-app context" case (e.g. Tomáš → Filip, B8 walkthrough). Don't surface the bypass on the locked-no-context lock card itself — keeps that surface focused on the privacy moment. The owner-side framing ("share your link with friends who aren't yet here") is the right place for the affordance, including potentially a hint at first-time profile setup. Touches `app/connect/[code]/page.tsx`, `lib/personas.ts` (shareCode field).

### Helper vs Carer terminology rename

Open Questions §4 deferred the rename until this phase. Today: Owner / Helper / Provider tiers, with "Helper" badge label rendered on PersonRow + member surfaces. "Helper" reads vague (helping with what?); proposed rename to "Carer" for consistency with surrounding "Care services / Care group / Care category" vocabulary. Risk: overlap with Provider-tier-also-being-a-carer concept. Pair the rename decision with the broader "explain the trust + tier model in-product" work that's the spine of this phase.

### Provider onboarding routing question (Care vs Meet)

Deferred from Discover & Care. The data model has a clean Care-type vs Meet-type split (see [[Groups & Care Model]] → Services as Catalog), but provider onboarding doesn't yet teach this. Need UX treatment for the routing question: "How does this work? — I take the dog (Walking/Sitting/Boarding) — I run a session people sign up for (Training/Workshop)." Providers should fall into the right shape without seeing data-model jargon.

### Owner-facing card differentiation (Care vs Meet teaching)

Deferred from Discover & Care. Same Services tab surface, different card behaviour — Care cards (price-per-visit, availability days, "Request booking") vs Meet cards (next-upcoming-date, "Book a spot"). No labelled "Care vs Meet" segmentation; the card content does the work. Confirm the chosen pattern reads correctly to owners cold.

### Group visibility chip clarity

Deferred from Open Questions §3. `group.visibility` is `open | approval | private` — three mutually exclusive states on a continuum. Current chip labels each carry only half the meaning: "Approval required" doesn't communicate that content is still visible to non-members; "Private" doesn't communicate that joining still requires a request. Possible refinements: "Approval to join" (action-y), "Private · approval to join" (combine), or hover/tap tooltip with the explainer. Surfaced 2026-04-30.

---

## Tasks

To be defined when this phase opens. The pre-loaded scope above is the seed.

---

## Acceptance Criteria

To be defined when this phase opens.
