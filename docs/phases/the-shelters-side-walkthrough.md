---
status: active
last-reviewed: 2026-06-24
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# The Shelter's Side — Walkthrough

Verification checklist for the Shelter's Side phase. **Concise by design** — surface only what's worth the reviewer's judgment, what risks regression, and what confirms the phase thesis.

**Phase thesis:** the shelter's *own* (operator) view is now real enough to **show and to interview against** — chiefly the **handover** (check-out → back-safe check-in, logged) — with the application landing, walker pool, and adoption-interest landing at illustrative parity, the shelter walkthrough's back half *demonstrating* it (POV switches to the operator), and a feasibility kit driving the interviews.

**How to use:**

1. Dev server on port 3000.
2. Enter the operator POV: the demo switcher → **Útulek Liběň (Shelter operator)**, or the `?admin=1` escape hatch on any shelter.
3. Walk top-to-bottom.

**Seed context (today at Útulek):** the handover board is seeded with a realistic morning — Maja (due to collect, Pavel D.), Tonda (out walking, Marie B.), Líza (walk finished, awaiting back-safe, Lukáš P.), Theo (back safe, Anna K.), and a group-walk batch (Edda + Nora, led by Klára). Applications: 3 pending (Petra S. invited, Radek N. + Jan D. new). Adoptions: Nora + Maja + Theo interested, Káťa pending. Times render in your local timezone (seed times are UTC).

---

## Open for your call

Identifier prefix: **`O`**.

- [ ] **O1. Persona roster trim — dropped Tomáš, Lena, Magda from the *picker*.** The free-roam picker now carries Tereza, Daniel, Klára, Eliška, **Útulek Liběň (operator)**, New User. Tomáš/Lena/Magda stay full mock-world users and stay switchable (guided walkthroughs still drive them); they're just off the free-roam menu. Ratify the cut list, or keep/cut others. (See any picker: `/profile` name dropdown, or `/`.)
- [ ] **O2. Group multi-dog release is shown as a PROPOSAL, not a committed model.** The batch card proposes "the mentor signs out the group as the responsible walker — one check-out for the batch." This is the open FC18 checkout question, deliberately framed as a question to shelters, not an asserted flow. (Operator → Today → the "Stromovka morning walk" batch card.)
- [ ] **O3. The operator is modeled as a synthetic `UserProfile` persona (`op-utulek-liben`), not a new entity layer.** A shelter isn't a UserProfile, but modeling the operator AS a minimal persona (shelter logo as avatar) lets it flow through the existing switcher/`useCurrentUser` machinery with minimal plumbing. Tradeoff: on non-shelter surfaces it renders as a sparse locked account. Acceptable for a demo affordance? (Switch to it, then visit `/home`.)
- [ ] **O4. Beats 3–4 of the shelter walkthrough switch POV to the operator persona.** The demo viewer literally "becomes the shelter" mid-walkthrough to see their own side. A strong move; the alternative was staying Eliška and just navigating to the operator view. (Run the `shelter` walkthrough → Beat 3.)
- [ ] **O5. Seeded illustrative content choices.** The "today at Útulek" handover seed, 3 pending applications (directory-style applicants with denormalized names), and 3 seeded adoption interests (Nora/Maja/Theo) are all mock-data calls to make the operator surfaces read populated. Seeding Nora interested means her dog page shows the "interested" adopt state (Walk still works). Right amount of seeded depth?
- [ ] **O6. The operator view REPLACES the public tab chrome** (rather than augmenting it). When in operator POV the page swaps Feed/Dogs/Members/Gallery for Today/Walkers/Applications/Adoptions, with a banner + "View public page" exit. Sections are URL-addressable via `?op=`. (Operator → the tab bar.)
- [ ] **O7. Added `text-volunteer` / `bg-volunteer-*` Tailwind utilities** (`@theme` mappings of the existing `--status-volunteer-*` family) — parity with `info`/`brand`, used across the new operator surfaces. Design-system addition. (`docs/implementation/design-tokens.md` will note it at close.)

---

## Worth verifying

Identifier prefix: **`V`**. One check per item.

### V1 — Operator entry + shell (WS-A)

- [ ] **V1.1 Operator persona lands on the operator view.** Demo switcher → **Útulek Liběň (Shelter operator)** → *Expect:* routes to `/shelters/utulek-liben` showing the operator banner + Today/Walkers/Applications/Adoptions tabs (not the public Feed/Dogs/Members/Gallery).
- [ ] **V1.2 `?admin=1` escape hatch still works.** `/shelters/utulek-liben?admin=1` as any persona → *Expect:* the same operator view.
- [ ] **V1.3 An operator persona on a *different* shelter sees the public page.** As the operator persona, open `/shelters/pes-v-nouzi` → *Expect:* the normal public page (you only operate your own shelter).
- [ ] **V1.4 Public ↔ operator round-trip.** Operator view → "View public page" → *Expect:* public page with a "Back to operator view" return strip → tap it → back to operator view.
- [ ] **V1.5 Picker is trimmed + carries the operator entry.** `/profile` → tap the name dropdown → *Expect:* Tereza, Daniel, Klára, Eliška, Útulek Liběň, New User (no Tomáš/Lena/Magda).
- [ ] **V1.6 A dropped persona is still walkthrough-switchable.** Run the **new-owner** walkthrough to the beat that switches to Magda → *Expect:* it switches to Magda fine (the `getUserById` fallback — proves the trim didn't break walkthroughs).

### V2 — Handover board (WS-B)

- [ ] **V2.1 Check out a due dog.** Operator → Today → Maja's row → **Check out** → *Expect:* Maja moves from "Due to collect" to "Out now."
- [ ] **V2.2 Confirm back safe.** Líza ("Walk finished … confirm back safe") → **Back safe** → *Expect:* she moves to "Back safe today" with a return time; the "back safe" count ticks up.
- [ ] **V2.3 Group batch release.** The "Stromovka morning walk" card → **Check out all · 2 dogs** → *Expect:* both Edda + Nora flip to released (each now offers a "Back safe" control).
- [ ] **V2.4 Live walker status reads through.** *Expect:* "Out now" distinguishes a walk in progress (Tonda, "Out since … walking") from a finished-but-not-returned walk (Líza, "Walk finished … confirm back safe").

### V3 — Existing surfaces, illustrative parity (WS-C)

- [ ] **V3.1 Application advance round-trip.** Operator → Applications → Radek N. **Invite to visit** (applied→invited), then **Vouch as walker** (invited→vouched) → *Expect:* Radek leaves the queue and appears on the **Walkers** tab.
- [ ] **V3.2 Adoption advance.** Operator → Adoptions → Maja **Arrange meet-and-greet** (interested→pending), then **Finalise adoption** → *Expect:* stage advances; finalised dog leaves the active list.
- [ ] **V3.3 Walker pool controls.** Operator → Walkers → a walker's **⋯** → Promote/Demote → *Expect:* the tier badge updates; demoting a Super Volunteer's only `trusted` standing pulls the top tier.

### V4 — Shelter walkthrough back half (WS-D)

- [ ] **V4.1 POV switch + demonstration.** Run the **shelter** walkthrough to Beat 3 → *Expect:* the handoff reads "You're now Útulek Liběň · Shelter operator" and lands on the operator handover board with the step card.
- [ ] **V4.2 Walkthrough drives the operator tabs.** Continue through Beat 3 → *Expect:* the nav steps move to `?op=applications` then `?op=walkers`; Beat 4 lands on `?op=adoptions` then the public feed (`?public=1`).
- [ ] **V4.3 Soft close.** Finish the walkthrough → *Expect:* the closing screen "If you run a shelter, this part's for you." with three light questions (no per-beat probes anywhere in the run).

---

## Decisions surfaced during walkthrough

A running log. Each entry carries a `→ target-doc` for the phase-close sweep.

- **Operator persona = synthetic `UserProfile` (`op-utulek-liben`) + `getOperatorShelterId` helper; picker routes operator picks to `/shelters/<id>`.** Shelter modeled as a minimal persona so it rides the existing switcher. → `features/demo-mode.md` (+ `features/shelters.md` operator-view entry)
- **Persona roster trimmed (Tomáš/Lena/Magda off the picker); switchability decoupled from picker membership via `setUserById` → `getUserById` fallback.** → `features/demo-mode.md`
- **Handover data model: `BookingSession.releasedAt` / `returnedAt` (operator check-out / back-safe check-in), distinct from the walker's `checkedInAt` / `report.completedAt`.** → `features/shelters.md`
- **Operator handover board ("today's walks") — the hero surface; reads shelter-walk `Booking`s, writes the custody trail.** Seeded "today at Útulek" in `mockBookings.ts` (BOOKINGS_SEED_VERSION→2). → `features/shelters.md`
- **Group multi-dog release shown as a proposal (mentor-as-responsible-party), not committed.** → `features/shelters.md` + Open Q FC18-tension-2 (advance/keep-open at close)
- **Operator view replaces the public tab chrome; sections URL-addressable via `?op=`; `?admin=1` now routes to the full operator view (was just Members controls).** → `features/shelters.md`
- **Application queue + adoption-interest landing built as operator panels; seeded 3 pending applications (`WalkerApplication.applicantName`/`applicantAvatarUrl` denormalized fields, APPLICATIONS_SEED_VERSION→2) + 3 seeded adoption interests (ADOPTION_SEED_VERSION).** Adoption-interest landing is the one genuinely-new operator surface (the others verified existing). → `features/shelters.md`
- **`text-volunteer` / `bg-volunteer-*` / `border-volunteer-*` Tailwind utilities added to `@theme`** (mappings of `--status-volunteer-*`). → `docs/implementation/design-tokens.md` + `design-system.md`
- **Shelter walkthrough back half (Beats 3–4) now switches POV to the operator persona and demonstrates the real surfaces** (was "described, not shown"); vouch fires at end of Beat 2; soft-close copy settled (three questions). → `strategy/Demo Narrative.md` + `features/demo-mode.md`
- **Feasibility interview kit authored** (`strategy/Shelter Feasibility Interview Kit.md`) — pain-point ladder + 9-item pain-point map + per-surface prompts. **Open Q §14 binding-constraint reframed to the ladder.** → already landed (graduate/confirm at close)
