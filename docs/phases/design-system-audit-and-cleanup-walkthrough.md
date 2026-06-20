---
status: active
last-reviewed: 2026-06-20
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Design-System Audit + Cleanup — Walkthrough

Verification checklist for the Design-System Audit + Cleanup phase. **Concise by design** — surface what's worth the reader's judgment, what risks regression, and what confirms the phase thesis (a coherent, debt-free design system). Most of this phase is invisible-by-design (dead-code deletion, token promotion, dedup), so the **V items concentrate on the few surfaces where a refactor could visibly change rendering** — chiefly the service cards (a real bug fix), the volunteer-colour surfaces, and the converged variants.

**How to use:**
1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, `/demo`, or `?as=<personaId>`.
3. Verification is **batched at the end** (PO call) — this list is the consolidated walk, filled in per workstream as each lands.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Available personas:** Tereza, Daniel, Klára, Tomáš, Eliška, New User.

> **Authoring note (open):** O items below are the calls made at phase open. V items are stubbed per workstream and get their exact URL + Expect filled as each workstream is built. Delete this note when the build is committed and the walkthrough is review-ready.

---

## Open for your call

- [ ] **O1. FC5 IdentityChip was NOT extracted.** The audit found only 2 of the 3 hero-chip consumers the doc's trigger requires — the others feed the dense PersonRow pill, a different role. Built nothing to avoid over-extraction; lifted the two inline hero-chip `style` blocks to a shared constant at most. Reverse if you'd rather extract proactively. (`/profile?as=klara` hero + `/profile/klara` hero — both still render the Carer chip identically.)
- [ ] **O2. ScheduleCard status converged to inline icon+text.** Per your call, dropped the chip-pill chrome for Hosting/Cancelled/Providing/Care to match CardMeet's Principle-7 treatment. Confirm the schedule surface still reads clearly without the pill silhouette. (`/schedule?as=tereza`.)
- [ ] **O3. Canonical optional-field label = `(Optional)` via `.label-secondary`.** Picked capitalized-parens-inline over the right-aligned `Optional` and the inline-dash variants. Check it reads right on the form surfaces that previously used the other treatments. (`InquiryForm`, `MeetComposer`, `PetEditCard` edit.)
- [ ] **O4. Connection-pill Connected state — cards vs rows.** Resolved the Discover-chip (inline) vs PersonRow (class) split into one shared class; confirm the deliberate carve-out (Connected shows a chip on Discover cards, no pill on PersonRow — the Message CTA carries it there) is the behaviour you want, now that it's explicit rather than accidental.
- [ ] **O5. `--text-xs` reconciled to {VALUE}.** The `@theme` (10px) vs `:root` (12px) conflict was resolved to one value; this is the base for the font-size migration. Flag if the chosen value shifts any small-text surface you care about.

---

## Worth verifying

> Filled per workstream during build. One check per item; each names exact URL + Expect. Persona tag only where who's looking changes what's shown (the service-card own-vs-other check below is the canonical load-bearing case).

### V1 — Service-card reconciliation (WS-A)

- [ ] **V1.1 Own-profile Care card shows the full priced axis.** `/profile?as=klara` → Services tab. *Expect:* "From" prefix + pickup/drop-off delivery rows + (for day-care carers) full-day/half-day rows — i.e. identical pricing to what a visitor sees.
- [ ] **V1.2 Own vs other-user prices match.** Compare `/profile?as=klara` Services vs `/profile/klara` Services as another persona. *Expect:* same numbers on both; the previous flat-`pricePerUnit` discrepancy is gone.

### V2 — Volunteer tokenization (WS-B)
- [ ] **V2.1 _(author at build)_** Volunteer surfaces render unchanged after hex→token migration. `/discover/help-a-dog`, mentor booking, `.booking-card--volunteer`. *Expect:* identical violet, no visual diff.

### V3 — Converged variants (WS-F)
- [ ] **V3.1 _(author at build)_** One-time/Repeat picker behaves identically across its 3 former call sites after primitive extraction.
- [ ] **V3.2 _(author at build)_** Paired-CTA rows wrap (not overflow) at narrow width on the 5 migrated surfaces.

### V4 — Primitive extractions (WS-D/E)
- [ ] **V4.1 _(author at build)_** SortMenu behaves identically on `/shelters/[id]` and `/discover/help-a-dog` (open/outside-click/Esc/select).
- [ ] **V4.2 _(author at build)_** CheckboxRow `density="compact"` on PetEditCard matches the old override; default rows unchanged elsewhere.

---

## Decisions surfaced during walkthrough

A running log (append as you walk). Each entry carries a `→ target-doc.md` annotation for the close sweep.

- _(none yet — populate during the walk)_
