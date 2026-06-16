---
status: active
last-reviewed: 2026-06-15
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Service Options & Booking Clarity — Walkthrough

Verification checklist for the Service Options & Booking Clarity phase. **Concise by design** — three priority categories instead of an exhaustive per-workstream checklist. Trust that automated checks + visual sanity passes ran during the build; surface only what's worth the reader's judgment, what risks regression, and what they should glance at to confirm the phase thesis lands.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Walk top-to-bottom — the categories are ordered by "needs your eyeballs most" → "least."

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues. The Decisions log at the bottom is a plain log (append-only).

**Available personas:** Tereza (Vinohrady connector), Daniel (anxious new owner, locked profile), Klára (trainer with Care group), Tomáš (Karlín professional), Eliška (adoption-curious), New User.

**Scope-call resolutions (2026-06-15):** B = keep-separate `appointmentLocations` (no walks migration) + curated 4-tuples · D = surface existing `triggers`/`healthNotes` (no new field) + shelter empty-state prompts. Full table on the phase board.

**Build order:** A (verify A1/A2/A3 + build A4/A6) → C + C5 + D → B. Committed per workstream.

---

## Open for your call

Decisions the author made that warrant a second look — direction, not bug-hunt. (See `CONTRIBUTING.md` → decide-and-flag.)

Identifier prefix: **`O`** (O1, O2, ...).

- [ ] **O1. A4 carer half-day editor scope — built day-care only, NOT the parallel walk-delivery price editor.** The opening audit found `ProfileServicesTab` had no carer-edit UI for *either* `durationOptions` (day-care half-day) or `deliveryOptions` (walk pickup/drop-off prices) — both were mock-seed-only. I built the day-care half-day editor (A4's scoped task) but left the walk `deliveryOptions` editor unbuilt — adding it is a different axis (Workstream C is about *addresses*, not delivery *prices*), so folding it in would expand scope. Flag if you want the walk-delivery price editor built here too. (Tereza → `/profile?tab=services` → Edit → Day care card.)
- [ ] **O2. Half-day default = 60% of full-day rate.** When a carer flips "Offer a half-day rate" on, the half-day price seeds to `round(fullDay × 0.6)` (150 → 90). Arbitrary-but-sensible; carer can tune the field immediately. Ratify the multiplier. (Tereza → `/profile?tab=services` → Edit → Day care → toggle off/on.)

---

## Worth verifying

Interaction nuance, complex state, persona round-trips. Identifier prefix: **`V`** (V1, V2, ...).

- [ ] **V1. Owner-facing day-care half-day flow (A3 + A6) — needs a viewer Connected to Tereza.** Tereza's day-care is circle-scoped ("Familiar dogs only"), so it doesn't appear in a stranger's `/discover/care`. As a persona Connected to Tereza, open her day-care inquiry: confirm the **Full day / Half day** radio shows 150 / 90, the live estimate updates on toggle, and the chosen duration carries through to the proposal price line + booking-detail "Half day"/"Full day" label. (Code path verified — `InquiryForm.tsx` `offersHalfDay`, `resolveBaseRate`, `bookings/[id]` label — but not clicked end-to-end this build.)

---

## Decisions surfaced during walkthrough

A running **log** (not a checklist) of decisions/design changes/rationale that surfaced during walkthrough. Append as you walk. Each entry carries a `→ target-doc.md` annotation for the phase-close propagation sweep.

- _(none yet)_
