---
status: active
last-reviewed: 2026-05-05
review-trigger: When any task is completed or blocked
---

# Demo Presentation

**Goal:** Ship a real product landing page (with a small "private prototype · try the demo →" affordance), backed by enough working logged-out flows that landing-page CTAs aren't theatre. The demo (`/demo` + Tereza's tour) becomes the side door, reachable from anywhere.

**Why expanded (vs. original "demo cover page" framing):** Testers absorb the *idea* through the landing — not just the functionality. A real product landing is what they react to. A demo cover page hides the value prop. PO call 2026-05-05.

**Depends on:**
- Persona & Demo Mode Wiring (closed 2026-04-26) — `/demo` route, `?as=` URL param, persona registry, `useCurrentUser()` hook.
- Mock World Building (closed 2026-05-02) — per-persona content + highlight reels in `features/demo-mode.md`.
- Discover & Care + Pricing & Proposals — full services-as-catalog flow exists for the tour to walk through.
- **Pricing & Proposals close** — to unblock workstreams D2/D3/D4 (logged-out `/discover/care`, `/discover/meets`, `/profile/[userId]`). Surfaces are mid-edit in another chat.

**Refs:**
- [[Open Questions & Assumptions Log]] §10 — both open items closed by this phase.
- [[Product Vision]] → "Three Ways In" — the spine of the landing page.
- [[User Archetypes]] — four journey personas the landing + /demo + tour pull from.
- [[features/landing-page]] — current spec; will be rewritten by this phase.
- [[features/demo-mode]] → "Highlight reels" — the surface list each persona's story reads strongest on.
- `app/page.tsx`, `app/demo/page.tsx`, `app/demo/demo.css`, `app/landing-extra.css`, `app/communities/[id]/page.tsx`, `components/groups/GroupDetailPanel.tsx`, `components/layout/AppNav.tsx`, `components/layout/GuestLayout.tsx`, `contexts/CurrentUserContext.tsx`, `hooks/useCurrentUser.ts`.

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs (CLAUDE.md, ROADMAP, Product Vision, User Archetypes, landing-page.md, demo-mode.md, Open Questions §10, current `app/page.tsx`, current `app/demo/page.tsx`, AppNav + GuestLayout for routing)
- [x] Review Open Questions log — §10 closes
- [x] Audit for conflicts between phase plan and current codebase — workstreams A/B/C are clear; workstreams D2–D4 collide with avoided surfaces (Pricing & Proposals chat) and are deferred
- [x] Update referenced docs with `last-reviewed` older than 2 weeks — none triggering today
- [x] Confirm scope — workstreams A, B, C done; D (logged-out flows) added 2026-05-05; E (real product landing) added 2026-05-05; F (persistent demo affordance) added 2026-05-05. Workstreams D2–D4 deferred until Pricing & Proposals closes.

---

## Direction (locked)

| Decision | Choice | Why |
|----------|--------|-----|
| Landing page (initial pass A1–A9, 2026-05-04) | **Direction B — show, don't tell** (demo cover) | Stop-gap that solved the dead-CTA problem and gave us a coherent persona row + Three Doors structure. Superseded by workstream E. |
| Landing page (final, workstream E) | **Real product landing with prototype banner** | Tester audience absorbs the value prop directly. Small "private prototype · try the demo →" affordance keeps the demo entry one click away without compromising the page. |
| `/demo` framing | **Direction 3 — hybrid** | Top row of 3 scenario cards + bottom row of 5 flat persona pills. Becomes the side door reachable from the persistent affordance on every guest page. |
| Guided tour | **Tereza-only** | Her surfaces cleanly demo the full community→trust→care funnel. Other personas remain free-exploration. |
| Logged-out viewer state | **`isGuest: boolean` on `CurrentUserContext`** | Cleaner than reusing the new-user persona. Surfaces still get a sample user for read-only display via `useCurrentUser()`; action handlers branch on `useIsGuest()` and trigger the `AuthGate` prompt. URL param `?guest=1` enters guest mode without persistence. |

---

## Workstream A — Landing redesign (initial pass — done, will be superseded by E)

These tasks shipped 2026-05-04 as the "demo cover" version. The hero, CTA wiring, and brand voice carry over to E; the section structure (Three Doors + persona row + scenario testimonials) gets reused or evolved.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Hero refinement (eyebrow + dual CTAs) | `app/page.tsx` | done |
| A2 | Three Doors section (Find Your Park / People / Help with mock-world examples) | `app/page.tsx`, `app/landing-extra.css` | done |
| A3 | Persona preview row (4 journey personas) | `app/page.tsx`, `lib/personas.ts` | done |
| A4 | Archetypes section CTA cleanup | `app/page.tsx` | done |
| A5 | Care section inline CTA | `app/page.tsx` | done |
| A6 | Persona-attributed testimonials | `app/page.tsx`, `lib/personas.ts` | done |
| A7 | Bottom CTA cleanup | `app/page.tsx` | done |
| A8 | Delete unused `HowItWorksTabs.tsx` | `components/landing/HowItWorksTabs.tsx` | done |
| A9 | Three Doors + persona row CSS + responsive | `app/landing-extra.css` | done |

---

## Workstream B — `/demo` redesign (done)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Guided journeys section (3 scenario cards) | `app/demo/page.tsx`, `lib/personas.ts` | done |
| B2 | Just-explore flat persona pills (5) | `app/demo/page.tsx`, `app/demo/demo.css` | done |
| B3 | Scenario + pill CSS | `app/demo/demo.css` | done |
| B4 | Footer (reset + back) preserved | `app/demo/page.tsx` | done |

---

## Workstream C — Tereza-only guided tour (done)

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Tour step list (6 steps) | `lib/tourSteps.ts` | done |
| C2 | `TourOverlay` component | `components/landing/TourOverlay.tsx`, `app/landing-extra.css` | done |
| C3 | Mount overlay globally | `app/layout.tsx` | done |
| C4 | Tour entry CTAs wired (landing hero + bottom + /demo) | `app/page.tsx`, `app/demo/page.tsx` | done |
| C5 | Smoke test | dev server | done (step 1 verified live; steps 2–6 left to walkthrough) |

---

## Workstream D — Logged-out flows (NEW — added 2026-05-05)

A real product landing needs working downstream. Without at least some logged-out surfaces, every "Browse meets near you" CTA is theatre. Goal: ship the structural pattern + one full surface in this chat; the rest unblock when Pricing & Proposals closes.

**Structural decision:** "logged-out" is modeled as `isGuest: boolean` on `CurrentUserContext`. `useCurrentUser()` still returns a user (default Tereza) for read-only display purposes; new `useIsGuest()` hook gates action handlers. Action handlers call `useAuthGate()` which opens a sheet with **"Sign up to {action}"** + **"Or try the demo →"**. URL param `?guest=1` enters guest mode without persistence.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | `isGuest` viewer state. Add to `CurrentUserContext` (boolean state + `setGuestMode(boolean)` action), URL-param hydration for `?guest=1`, `useIsGuest()` hook. Default false. Setting via setter or via URL doesn't persist to localStorage (guest is ephemeral; switching to a persona writes; resetting clears). | `contexts/CurrentUserContext.tsx`, `hooks/useCurrentUser.ts` | todo |
| D2 | `AuthGate` modal sheet — "Sign up to {action}" headline, body explaining the action requires an account, **two CTAs**: "Sign up" (stubbed — opens signup flow) + "Try the demo →" (→ `/demo`). Hook `useAuthGate()` returns `(actionLabel: string) => void` that opens the sheet. Mounted globally in `app/layout.tsx`. | new `components/auth/AuthGate.tsx`, `contexts/AuthGateContext.tsx`, `app/layout.tsx`, `app/globals.css` | todo |
| D3 | Vinohrady Morning Crew logged-out preview. Modify `app/communities/[id]/page.tsx` (and its panel `components/groups/GroupDetailPanel.tsx`) to render in guest mode: feed visible, member list visible, but Join / Post composer / RSVP actions trigger AuthGate. Pick `group-1` as the canonical sample link target — Open group, Tereza is admin, recurring meets, healthy member count. | `app/communities/[id]/page.tsx`, `components/groups/GroupDetailPanel.tsx`, possibly `components/posts/PostComposer.tsx` (gate the composer button) | todo |
| D4 | **DEFERRED — avoided surface.** Logged-out `/discover/meets`. Browse cards visible, RSVP triggers AuthGate. | `app/discover/meets/page.tsx`, `components/meets/CardMeet.tsx` | blocked |
| D5 | **DEFERRED — avoided surface.** Logged-out `/discover/care`. Provider cards visible, contact/inquiry triggers AuthGate. | `app/discover/care/page.tsx`, `components/explore/CardExploreResult.tsx` | blocked |
| D6 | **DEFERRED — avoided surface.** Logged-out `/profile/tereza`. About + Posts + Services tabs visible (she's Open profile + Helper-tier sitting). Connect / Book / Message trigger AuthGate. | `app/profile/[userId]/page.tsx` | blocked |

---

## Workstream E — Real product landing (NEW — added 2026-05-05)

Replaces the current "demo cover" with a real product landing. Brand voice carries over; structure adapts to send working CTAs at logged-out flows (workstream D) and route everything else to the demo. Workflow: PO explores visual directions in Claude Design first; this chat implements the picked direction in tokenized code against the existing design system.

**Pre-req:** at least D1 + D2 + D3 shipped, so the landing's primary CTA can route to a working flow (Vinohrady Morning Crew preview).

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | Visual direction explored externally (Claude Design or similar). PO returns with a picked direction. | external | pending |
| E2 | Landing rebuild against picked direction. Tokenized code; new tokens added if needed (and registered in `@theme` + styleguide per CSS rules). Brand voice copy from `landing-page.md` carries over. | `app/page.tsx`, `app/landing-extra.css`, possibly new components in `components/landing/` | pending |
| E3 | Wire CTAs to working flows where they exist + AuthGate-triggering links to demo/signup where they don't. Primary CTA likely "Browse meets near you" → logged-out group preview (D3); secondary "Try the demo →" → /demo. | `app/page.tsx` | pending |
| E4 | Update `features/landing-page.md` to reflect the new real-product spec (separate section from the historical "demo cover" version, or supersede it). | `docs/features/landing-page.md` | pending |

---

## Workstream F — Persistent demo affordance (NEW — added 2026-05-05)

Small persistent affordance on every guest-route page. Lets a tester get into the demo from anywhere without backtracking to `/demo`. Honest about being a prototype without dominating the page.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | "Try the demo →" button in `AppNav`'s guest links row, replacing the current "Enter Demo" link with a more visible CTA-style treatment. Stays on guest routes (`/`, `/signin`, `/signup`, logged-out previews). | `components/layout/AppNav.tsx`, `app/globals.css` | todo |
| F2 | Optional one-line "Private prototype" banner above the AppNav on guest routes. Decide based on E1 visual direction — a banner may or may not fit the chosen aesthetic. Defer to E2. | `components/layout/GuestLayout.tsx` or new `components/layout/PrototypeBanner.tsx` | pending |

---

## Acceptance Criteria

**Done now (workstreams A/B/C — initial demo cover pass):**
- [x] Landing page renders the demo-cover version with hero, Three Doors, persona row, archetypes, care, persona testimonials, bottom CTA. All CTAs go somewhere real.
- [x] `/demo` shows hybrid scenario cards + flat pills.
- [x] Tereza guided tour walks 6 steps end-to-end with persona preserved.

**To ship in this chat (workstreams D1–D3, F1):**
- [ ] `isGuest` viewer state lives on `CurrentUserContext`. URL `?guest=1` enters guest mode. `useIsGuest()` hook returns the state.
- [ ] `AuthGate` modal sheet renders on demand via `useAuthGate()` with two CTAs (Sign up stub + Try demo).
- [ ] Vinohrady Morning Crew (`/communities/group-1?guest=1`) renders for guests: feed visible, members visible, action affordances (Join / Post / RSVP) trigger AuthGate.
- [ ] AppNav has a visible "Try the demo →" CTA in the guest links row.

**To ship after Pricing & Proposals closes (D4–D6):**
- [ ] Logged-out browse meets, browse providers, sample profile preview.

**To ship after Claude Design exploration completes (E1–E4):**
- [ ] Real product landing replaces demo cover. CTAs point at working logged-out flows (D3 + later D4–D6) + demo for everything else.

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update `docs/features/landing-page.md` to reflect the real-product structure
- [ ] Update `docs/features/demo-mode.md` — add "Guided tour" + "Guest viewer state" subsections
- [ ] Update Open Questions §10 — close both open items
- [ ] Document the guest viewer state pattern in a new `docs/features/guest-viewer.md` (or fold into demo-mode.md)
- [ ] Update ROADMAP.md — mark phase complete
- [ ] Review CLAUDE.md — add Demo Presentation key-decisions bullet (guest viewer state, AuthGate pattern, persistent affordance)
- [ ] Archive this phase board (`git mv docs/phases/demo-presentation.md docs/archive/phases/`)
- [ ] **Structural audit** — see CONTRIBUTING.md
- [ ] Strategic review — Did the guest viewer pattern reveal any places it wants to grow (e.g. logged-out shareable group invites)? Does the real-landing rebuild expose missing prototype surfaces? Does the AuthGate copy land or need refinement?

---

## Notes

- **Avoid surfaces:** `components/messaging/*`, `components/profile/*`, `app/profile/*`, `app/discover/*`, `lib/pricing.ts`, `lib/types.ts` — mid-edit in Pricing & Proposals.
- **No git commits** during this phase per session-opening instructions.
- **Workstream A/B/C are done** as a "first pass." Workstreams D, E, F build on top — they don't undo A/B/C, they evolve the landing to a real product page while keeping `/demo` and the tour as the side door.
