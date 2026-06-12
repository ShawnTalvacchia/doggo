---
status: archived
last-reviewed: 2026-06-10
review-trigger: When any task is completed or blocked; at the mid-phase single-shelter-loop checkpoint
---

# Cross-Shelter Mentor Network

> **The mentor-vouching phase — the mechanism that turns the credentialing layer into a scalable trust unlock.** Opened 2026-06-09, the same day the Carer Portfolio + Shelter Walker Credentialing phase closed. That phase delivered the credentials; this phase delivers what the credentials unlock: Super Volunteers offering paid mentor sessions that produce walkers shelters can trust without doing the assessment work themselves.
>
> **Reframed at open (2026-06-09 strategic review follow-up):** instead of "build the mechanism, then talk to shelters," this phase builds a **fleshed-out shelter-facing demo with explicit assumptions flagged** — the artifact for PO/shelter coordinator interviews, produced while the PO arranges them. The demo IS the deliverable, not just internal verification.

**Goal:** The mentor-vouching mechanism works end-to-end — mentor offers sessions, mentee books and graduates, credentials port across shelters — packaged as a shelter-facing demo walkthrough with every baked-in Playbook assumption flagged by number.

**Thesis.** Doggo isn't just a coordination layer — it's where trust gets BUILT in the dog community. Trainer-walkers (the keystone archetype) extend trust to new walkers through paid mentorship; the platform tracks and ports the resulting credentials; shelters get a larger, higher-quality walker pool without the admin burden. Full mechanism in [[Cold-Start Playbook]] → "Mentor-vouching as the scalable trust mechanism."

**Depends on:**
- Carer Portfolio + Shelter Walker Credentialing (2026-06-09) — `WalkerApplicationsContext` state machine (`applied → invited → vouched` + walkCount), walker tier model via shared `.credential-pill` family, `Booking.ownerKind` discriminator (type only — consumer wiring is THIS phase), `getUserShelterAffiliations` resolver, Volunteer work profile section, shelter-membership sort elevation on `/discover/help-a-dog`, hidden-affordance state-toggle pattern.
- Shelter Foundation (2026-06-02) — `ShelterProfile`, `ShelterPolicy` per-shelter overrides, three seeded shelters.
- Services as Catalog (`CarerServiceConfig` discriminated union — care / meet / appointment; this phase adds the fourth kind).
- Sessions & Service Execution (2026-05-08) — Start → Finish → Visit Report flow, reused for shelter walks.

**Refs:** [[strategy/Cold-Start Playbook]] → "Mentor-vouching as the scalable trust mechanism" + "Assumptions to validate" (A1–A10), [[planning/Open Questions & Assumptions Log]] §14, [[features/shelters]], [[implementation/badges]] → "Credential pill family", [[features/demo-mode]] → "Hidden-affordance pattern", `archive/phases/carer-portfolio-and-shelter-walker.md` → "Strategic Review (2026-06-09)", [[strategy/Groups & Care Model]] → Services as Catalog.

---

## Scope disciplines

Three disciplines govern this phase. They were set at open and don't get renegotiated mid-build.

1. **Two walkthroughs, one phase.** The standard dev-facing walkthrough verifies the build works. A SECOND shelter-facing walkthrough (`docs/phases/cross-shelter-mentor-network-shelter-demo.md`) is written like a sales demo, narrating the storyline ("Klára onboards a new walker for Útulek in three minutes"). The shelter-facing doc is the deliverable for shelter conversations, not internal verification. At phase close it **graduates to `docs/strategy/`** (outward-facing artifact with ongoing use) rather than archiving.
2. **Shelter operator surface stays stubbed.** V3+ territory. "Approve walker" / "Accept mentor-vouch" / "Credit historical walks" are state-toggle dropdowns per the hidden-affordance pattern ([[features/demo-mode]]). The shelter-facing walkthrough shows polished walker + mentor sides; the operator side is honestly faked and SAYS so.
3. **The Playbook's "Assumptions to validate" section drives PO interview prep.** Every phase decision that depends on a Playbook assumption references it by number (A1–A10) on this board, so when an interview refutes an assumption the affected scope is easy to find and revisit.

**Not in scope (honestly deferred):**
- **Shelter operator surface** (dashboard, application queue, vouching UX, dog edit) — V3+; all operator actions in this phase are state-toggles.
- **Real payments / marketplace cut** — `paymentStatus` stub only; the cut is a pitch line, not a built flow.
- **Insurance / liability layer** — operational not product, per [[Cold-Start Playbook]] walker-credentialing risk #1.
- **Adoption-curious persona + doorway** — Multi-Path Demo phase. This phase's mentee storyline uses Tomáš (see D6).
- **Mentor discovery/matching** beyond the seeded mentor — single-mentor demo (Klára); a "find a mentor" surface waits for validation.
- **Real notification triggering** for the mentor flow — system messages in existing conversations only.
- **Group-walk unlock mechanics** — all three seeded shelters are `groupWalksPermitted: false`; tier-gated group walks are orthogonal to the mentor mechanism.
- **Active-vs-past shelter affiliation distinction** — flagged in the prior phase's strategic review; logged here so it's a conscious deferral, not built.
- **Bilingual surfaces** — per §14 standing deferral.

---

## Opening Checklist

Completed 2026-06-09.

- [x] Read every task and its referenced docs (ROADMAP phase entry, Cold-Start Playbook mentor-vouching + assumptions sections, Open Questions §14, archived credentialing-moat board + Strategic Review, `features/shelters.md`, `implementation/badges.md`, CONTRIBUTING.md)
- [x] Review Open Questions log — §14 "Shipped 2026-06-09" block confirms the foundation; the three strategic-review questions resolved pre-open (see Design Decisions D1/D2/D6)
- [x] Audit for conflicts between phase plan and current codebase — six surfaced, captured below
- [x] Update any referenced docs with `last-reviewed` older than 2 weeks — all referenced docs reviewed ≤ 7 days; none stale
- [x] Scan the Punch List — P77 adopted into Workstream G (it was explicitly deferred TO this phase); no other overlap
- [x] Confirm scope — Service Options & Booking Clarity deliberately passed over (see conflict 1); operator-side scope-creep guarded by scope discipline 2

### Conflicts surfaced during opening

1. **Service Options & Booking Clarity was marked "(next)" in ROADMAP**, and the prior strategic review recommended it as a palate cleanser ("Decision needed at next phase open"). Decision made at open: Mentor Network opens now — the shelter-interview window is the strategic driver. Service Options board stays `draft`/queued; ROADMAP marker swapped.
2. **P77 (punch list)** — dog-page Walk dropdown carries wrong-surface `Leave shelter` + no-op `Log walk (demo)`. The prior strategic review said "don't ship the next phase without addressing this." Adopted into Workstream G.
3. **ROADMAP phase entry says mentor_session is a "third kind"** on `CarerServiceConfig` — it's the FOURTH (care / meet / appointment exist). Board corrects; ROADMAP row gets fixed at close per compass-not-changelog.
4. **Klára is not a seeded walker at any shelter**, but the storyline needs her as a Super Volunteer mentor. Resolution: the bootstrap affordance (Workstream F) IS how she gets there — shelter-credited historical walks become a demo beat ("Útulek credits Klára's 3 years of real-world walks"), not silent seeding.
5. **Platform-level tier rendering vs. the prior phase's "no aggregate header" decision** (archived D9/L3 — aggregate dropped at walkthrough 2026-06-09). The platform Super Volunteer tier is a different signal than a walk-count total, but the Volunteer-work section rendering must reconcile the two. In-build design call — flag as an O item in the dev walkthrough (see D3).
6. **`ShelterPolicy` has no mentor fields** (`acceptsMentorVouches` / `mentorSessionMinimum` don't exist — confirmed in `lib/types.ts:1938`). Added in Workstream C, exactly as §14 / the Playbook drafted them.

---

## Design Decisions

Captured 2026-06-09 at phase open. The three weight-bearing questions from the prior strategic review were resolved with the PO before the board landed (D1 pricing, D2 authority, D6 mentee); the rest are build-targeting calls.

### D1 — `mentor_session` service kind *(per A5)*

Fourth kind on the `CarerServiceConfig` discriminated union (`lib/types.ts:1421`): `CarerMentorSessionServiceConfig` with `kind: "mentor_session"`. Modeled on the Appointment variant — solo time slot, no roster, fixed price — plus shelter context:

- `id`, `title` ("Mentored shelter walk"), `description?`
- `pricePerSession` — **mentor-set, mid-band**. Platform-recommended range constant (~300–600 CZK) in `lib/constants/services.ts`; Klára seeds at ~450 CZK — between a guided intro and her 1:1 training rate, signaling "supervised apprenticeship, not a training session."
- `durationMinutes`
- `shelterIds: string[]` — participating shelters where this mentor runs sessions
- `softDeletedAt?` (matches meet/appointment variants)

**No modifier engine.** Fixed per-session quote like `computeAppointmentQuote` (`lib/pricing.ts:392`) — mentor sessions don't carry the holiday/weekend/multi-pet stack. Routing tests stay coherent: *sign up to a specific time?* yes; *other dogs?* no — but unlike Appointment, the session produces **graduation progress at a shelter**, which is why it's its own kind rather than an `appointmentCategory`.

Pricing remains an explicit interview probe per **A4** (fee filter vs affordability) and **A5** (trainer willingness at this price point).

### D2 — Vouching authority: per-shelter policy + recommended-fallback *(per A1, A6, A10)*

`ShelterPolicy` gains:
- `acceptsMentorVouches: boolean`
- `mentorSessionMinimum?: number` — platform-suggested default **3**; per-shelter override

**Accepting shelters:** when a mentee completes `mentorSessionMinimum` sessions at that shelter, their application auto-advances to `vouched`, attributed to the mentor ("Vouched by Klára H. via mentor sessions"). The mentor's vouch is binding there — that's the admin-burden-drops value prop, shown working.

**Non-accepting shelters:** the mentor path isn't hidden — completed mentor sessions render as a **"Mentor-recommended · N sessions with {mentor}"** credibility line on the standard apply path, and the shelter's own process still gates (state-toggle in demo). Mentor work is never wasted; shelter authority is never overridden. This is the honest answer to A10 (resistance may be about control, not trust): the demo shows both postures working.

**Seeds:** Útulek Liběň accepts (min 3); Pes v nouzi accepts (min 5 — shows the per-shelter override); **Druhá šance does NOT accept** — the demo's non-accepting contrast case.

### D3 — Platform-level Super Volunteer *(per A3)*

New resolver `getPlatformVolunteerTier(userId)`: platform tier computed from **cross-shelter walk total + ≥2 vouches** (per the Playbook's earning rule). Renders with shelter context preserved: "Super Volunteer · 87 walks at Útulek · vouched by Klára H., Pavel D." — the platform tier is portable; the history stays attributed.

- **Mentor eligibility gates on platform Super Volunteer** — only they can author a `mentor_session` offering.
- **Per-shelter tiers remain** for per-shelter permissions (walk eligibility is still per-shelter + per-dog; strictest rule wins).
- **New-shelter recognition:** arriving at a shelter you've never walked at, the platform tier shows on your application, but the shelter's own waiver + orientation walk are still required (per Playbook "Cross-shelter recognition").
- **Rendering reconciliation (O item):** the prior phase dropped the Volunteer-work aggregate header. The platform tier pill is a different signal (a status, not a stat), but where it sits relative to the per-shelter rows is an in-build call to flag for ratification.

### D4 — Layered waiver model *(per A2)*

Three layers per the Playbook requirements model:
1. **Platform baseline** — identity + emergency contact + general liability, signed ONCE. Field on `UserProfile` (e.g. `platformWaiver?: { signedAt: string }`).
2. **Per-shelter waiver** — signed per affiliation; flag on the `WalkerApplication` record.
3. **Mentor session minimum** — `ShelterPolicy.mentorSessionMinimum` (D2).

Surfaces as checklist rows in the mentor-session booking flow and the walker application flow ("Platform baseline — signed ✓" / "Útulek waiver — sign now"). Demo signs via tap — honestly fake, no real legal text. If A2 is refuted (no shared baseline possible), the model collapses cleanly to two layers — the data shape should make that cheap.

### D5 — Bootstrap affordance: credit historical walks *(per A7)*

Walk-count provenance splits into `platformLogged` vs `shelterCredited` (audit trail stays clean per the Playbook). Hidden state-toggle **"Credit historical walks (demo)"** on the shelter Members tab — an operator stub per scope discipline 2. Shelter-credited walks count toward tier resolution but are marked distinctly where walk counts render.

**Storyline beat:** Útulek credits Klára's years of real-world walking → she crosses the Super Volunteer threshold → mentor offering unlocks. The bootstrap isn't seeding trivia; it's the demo's first act.

### D6 — Demo mentee: Tomáš *(per A8)*

Resolved with PO at open ("reuse a persona, but not Daniel"). Tomáš (busy professional, Karlín, 9–6) is the latent-demand thesis (A8) in person — exactly who Útulek's "weekdays 9am–5pm" intake filter excludes. His mentee path runs **parallel to the V2 Daniel→Klára demo narrative without touching it** — new thread, same mentor. Klára serving as mentor in both threads is by design: she's the keystone trainer-walker archetype.

Adoption-curious persona + archetype design stays Multi-Path Demo scope. Flag the Tomáš call as an O item for ratification at walkthrough.

### D7 — Shelter walks are Bookings *(carried forward; fixes P77)*

Consume `Booking.ownerKind: "shelter"` (type shipped last phase, no consumers):
- "Book a walk" on `/dogs/[id]` creates a real `Booking` (`ownerKind: "shelter"`, `ownerId` = shelter id, carer = walker).
- Schedule/Bookings integration per the archived board's D5: shelter walks under the existing Bookings tab; booking detail's "owner" slot resolves to the shelter (logo + name); Pet-as-protagonist hero uses the shelter dog.
- Sessions flow reuse: Start → Finish → Visit Report; report seals to the dog's profile via existing tag plumbing; completed walk bookings feed tier escalation (replacing the bare `logWalk` counter as the primary path — the demo toggle remains for walkthrough speed).
- **P77 fixes:** drop `Leave shelter` from the dog-page dropdown (relationship-level action, wrong surface); `Log walk (demo)` no longer a silent no-op — walks land as visible bookings/reports.

---

## Sequencing

**Single-shelter loop first** (Workstreams A–C + G, all at Útulek): the mentor session kind, the mentee journey, the policy gate, and the real walk booking surface. This is the half that proves the mechanism.

**Mid-phase checkpoint** — walked live in the preview during the build (2026-06-10); re-verify via walkthrough V1–V3:

- [x] Klára's profile carries a `mentor_session` offering at ~450 CZK (A)
- [x] Tomáš books a mentor session at Útulek from at least two entry points (B) — shelter MentorPathCard + profile service card + dog-page upsell link
- [x] Progress surface counts sessions ("0 of 3 mentor sessions with Klára Horáčková") (B)
- [x] Third completed session auto-advances Tomáš to `vouched`, attributed to Klára; graduation message lands in Inbox (B, C)
- [x] Druhá šance shows the "Mentor-recommended" fallback instead of auto-vouch (C)
- [x] Tomáš books a real solo walk that lands in Bookings (list + detail render the shelter party); session completes with a sealed report (G)
- [x] P77 both halves fixed (G)
- [x] TypeScript compiles clean

Then the **cross-shelter half** (D–F) and the **two walkthroughs** (H–I).

**Ship target:** the phase is done when the shelter-facing demo doc can be driven start-to-finish in front of a coordinator — bootstrap beat → mentor offering → mentee journey → graduation → portability moment → non-accepting contrast — with every ASSUMPTION (A#) callout in place and the operator side honestly faked.

---

## Workstreams

### Workstream A — Mentor session service kind *(A5)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| A1 | `CarerMentorSessionServiceConfig` added to the `CarerServiceConfig` union per D1. Inline JSDoc documents the routing rationale (specific time + no roster + graduation progress). | D1 | done |
| A2 | Platform-recommended price range constant in `lib/constants/services.ts` (~300–600 CZK) + fixed per-session quote path (no modifier engine). | D1 | done |
| A3 | Klára seeds a mentor offering (~450 CZK, `shelterIds: ["utulek-liben", "pes-v-nouzi"]`). | D1, D3 | done |
| A4 | `ProfileServicesTab` renders the mentor-session card. Visual family is an in-build call (care=blue vs volunteer=violet tension) — flag as O item. | D1 | done |

### Workstream B — Mentee journey: booking, progress, graduation *(A4, A6, A8)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| B1 | Mentor-session Booking shape — reuses `Booking` with a `mentorSession?: { shelterId: string; sessionNumber: number }` reference; carer = mentor, owner = mentee (`ownerKind: "user"`). Books like an appointment (chat-based slot per prototype convention). | D1, D7 | done |
| B2 | Entry points: (a) mentor's Services tab card; (b) shelter-page affordance "New to walking here? Book a mentored first walk" when `acceptsMentorVouches` and viewer isn't vouched; (c) dog-page eligibility state upsell (the "needs an experienced walker" explanatory state gains a mentor-path pointer). | D2 | done |
| B3 | Progress surface — "N of M mentor sessions at {shelter}" on the shelter page (own application context) + own profile. | D2 | done |
| B4 | Graduation — Mth completed session at an accepting shelter auto-advances the `WalkerApplication` to `vouched`, attributed to the mentor; system message lands in the mentee's conversation. | D2, C2 | done |

### Workstream C — Vouching authority + ShelterPolicy *(A1, A6, A10)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| C1 | `ShelterPolicy.acceptsMentorVouches` + `mentorSessionMinimum?` fields; seeds per D2 (Útulek 3 / Pes v nouzi 5 / Druhá šance does not accept). | D2 | done |
| C2 | `WalkerApplication` mentorship extension — `mentorship?: { mentorId: string; sessionsCompleted: number }`, coexisting with the direct-apply path (two paths in steady state per the Playbook). | D2 | done |
| C3 | Non-accepting fallback at Druhá šance — "Mentor-recommended · N sessions with {mentor}" credibility line on the standard application; shelter still gates via state-toggle. | D2 | done |
| C4 | Operator accept/decline as hidden state-toggles per scope discipline 2. | D2 | done |

### Workstream D — Cross-shelter portability *(A3)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| D1 | `getPlatformVolunteerTier(userId)` resolver — cross-shelter walk total + vouch count per D3. | D3 | done |
| D2 | Profile rendering — platform tier with shelter context + vouched-by line; reconcile with the no-aggregate-header decision (O item per opening conflict 5). | D3 | done |
| D3 | New-shelter recognition flow — applying at a shelter you've never walked at surfaces the platform tier on the application; own waiver + orientation still required. Demo: Tomáš (or Pavel) arrives at Pes v nouzi with the portable credential. | D3, E2 | done |
| D4 | Mentor-eligibility gate — `mentor_session` authoring/visibility gated on platform Super Volunteer. | D3 | done |

### Workstream E — Layered waivers *(A2)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| E1 | Data — `UserProfile.platformWaiver?` + per-shelter waiver flag on `WalkerApplication`; baseline item list as a constant. | D4 | done |
| E2 | Flow surfaces — waiver checklist rows in the mentor-booking + application flows ("signed once" vs "sign now" states); tap-to-sign demo behavior. | D4 | done |
| E3 | Own-view waiver status on the Volunteer-work / affiliations surface (quiet, self-only). | D4 | done |

### Workstream F — Bootstrap: credit historical walks *(A7)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| F1 | Walk-count provenance split — `platformLogged` vs `shelterCredited`; tier resolution sums both; rendering marks credited counts distinctly. | D5 | done |
| F2 | Hidden "Credit historical walks (demo)" state-toggle on the shelter Members tab (operator stub). | D5 | done |
| F3 | Klára's bootstrap — shelter-credited walks at Útulek land her at Super Volunteer; storyline beat seeded so the shelter demo can SHOW the crediting moment. | D5, D3 | done |

### Workstream G — Shelter walk Booking surface + P77 *(carried forward)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| G1 | "Book a walk" on `/dogs/[id]` creates a real `Booking` with `ownerKind: "shelter"` per D7; gated by existing eligibility check. | D7 | done |
| G2 | Schedule/Bookings integration — shelter walks under the Bookings tab; owner slot resolves to shelter logo + name; Pet-as-protagonist hero. | D7 | done |
| G3 | Sessions flow reuse — Start → Finish → Visit Report sealing to the dog's profile; completed walk bookings feed tier escalation. | D7 | done |
| G4 | P77 — drop `Leave shelter` from the dog-page dropdown; `Log walk (demo)` becomes visible (walks land as bookings/reports); demo toggle retained for walkthrough speed. | D7 | done |

### Workstream H — Shelter-facing demo walkthrough *(A1, A8, A9 — and all)*

| # | Description | Refs | Status |
|---|-------------|------|--------|
| H1 | Storyline — Tomáš mentee path drives LIVE from fresh state (pre-staging dropped: the state-toggles make live driving fast, and a pre-staged mid-mentorship state would collide with demonstrating the booking beat — walkthrough O9); V2 Daniel→Klára narrative untouched (smoke-checked; full check is walkthrough V8). | D6 | done |
| H2 | Write `docs/phases/cross-shelter-mentor-network-shelter-demo.md` — sales-demo narration: bootstrap beat (Útulek credits Klára) → mentor offering → Tomáš books → 3 sessions → graduation at Útulek → portability moment at Pes v nouzi → non-accepting contrast at Druhá šance. Inline **ASSUMPTION (A#)** callouts at every assumption-dependent beat; honest "operator side is faked here" notes. | D1–D7 | done |
| H3 | Interview-prep crosswalk — table mapping each demo beat → the Playbook assumption(s) it tests, so PO interview prep is "scan the crosswalk, pick the highest-impact probes." | H2 | done |

### Workstream I — Dev walkthrough + calibration

| # | Description | Refs | Status |
|---|-------------|------|--------|
| I1 | Standard dev-facing walkthrough doc from `_walkthrough-template.md` — O items already queued: mentor-card visual family (A4), platform-tier rendering vs no-aggregate-header (D2 of Workstream D), Tomáš-as-mentee (D6). | | done |
| I2 | Mock data calibration + persona sanity across switcher; TypeScript compiles clean. | | done |

---

## Acceptance Criteria

- [ ] Mid-phase checkpoint list (above) fully walked at Útulek
- [ ] Platform Super Volunteer tier resolves and renders with shelter context; mentor authoring gates on it (D)
- [ ] Waiver layers render correctly across first-shelter and second-shelter journeys (E)
- [ ] Bootstrap crediting visibly distinguishes shelter-credited from platform-logged walks (F)
- [ ] Shelter-facing demo doc drives start-to-finish with all ASSUMPTION callouts + operator-honesty notes in place (H)
- [ ] Dev walkthrough complete; O items ratified or redirected (I)

---

## Closing Checklist

- [ ] Walk through every acceptance criterion against the running app
- [ ] Sweep the dev walkthrough's "Decisions surfaced" section — propagate every entry to its home doc
- [ ] **Graduate the shelter-facing demo doc to `docs/strategy/`** (scope discipline 1) with a pointer from the Playbook
- [ ] Update `features/shelters.md` — policy fields, mentor path, walk-booking surface, waiver layers
- [ ] Update `strategy/Groups & Care Model.md` — Services as Catalog gains `mentor_session` (fourth kind + routing test note)
- [ ] Update `implementation/badges.md` — platform-tier rendering if the credential-pill family changed
- [ ] Update `features/demo-mode.md` — new hidden affordances (credit walks, accept vouch)
- [ ] Update `features/profiles.md` — Volunteer-work section changes (platform tier, waiver status)
- [ ] Update Open Questions log — §14 entries; log any new questions
- [ ] Update ROADMAP.md — phase row (also fix the "third kind" → "fourth kind" wording); confirm Multi-Path Demo dependency now satisfied
- [ ] Review CLAUDE.md — Ways In line + Core Principles if the service taxonomy line changed
- [ ] Mark P77 closed in `planning/punch-list.md`
- [ ] Archive this board + dev walkthrough (`git mv` to `docs/archive/phases/`, `status: archived`)
- [ ] Structural audit (per CONTRIBUTING.md → Closing Checklist 9a)
- [ ] Strategic review — special attention: which Playbook assumptions did building this REVISE before any interview happened?

---

## Build sequence

Single-shelter loop first; each line ≈ one focused commit. (In-phase build order — NOT the cross-phase punch list.)

**Single-shelter loop (ship target: mid-phase checkpoint):**

1. **C1** — `ShelterPolicy` mentor fields + seeds (foundation other workstreams read).
2. **A1 + A2** — Union variant + price-range constant + quote path.
3. **A3 + A4** — Klára's seeded offering + Services tab card.
4. **C2** — `WalkerApplication` mentorship extension.
5. **B1** — Mentor-session booking shape + flow.
6. **B2** — Entry points (Services tab / shelter page / dog page).
7. **B3** — Progress surface.
8. **B4 + C4** — Graduation auto-vouch + operator state-toggles.
9. **C3** — Druhá šance non-accepting fallback.
10. **G1 + G2** — Real walk booking + Schedule integration.
11. **G3** — Sessions flow + visit report sealing + tier escalation feed.
12. **G4** — P77 fixes.
13. **Mid-phase checkpoint** — walk the loop end-to-end.

**Cross-shelter half + walkthroughs:**

14. **F1 + F2** — Provenance split + crediting toggle.
15. **F3** — Klára's bootstrap beat.
16. **D1 + D4** — Platform tier resolver + mentor-eligibility gate.
17. **D2** — Profile rendering reconciliation (O item).
18. **E1 + E2 + E3** — Waiver layers.
19. **D3** — New-shelter recognition flow.
20. **H1** — Storyline seeding + V2-narrative parallel check.
21. **I1 + I2** — Dev walkthrough + calibration.
22. **H2 + H3** — Shelter-facing demo doc + interview crosswalk.

Estimated: 4–6 focused build sessions — single-shelter loop ~2–3; cross-shelter half + two walkthroughs ~2–3.
