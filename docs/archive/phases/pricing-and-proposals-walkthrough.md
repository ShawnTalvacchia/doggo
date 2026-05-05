---
status: active
last-reviewed: 2026-05-05
review-trigger: "Update as items are walked, edit as scope adjusts"
---
# Pricing & Proposals — Walkthrough

**Modifier configs seeded this phase:**
- **Tereza** (sitting, 150 Kč/visit) → weekend +15%, multi-pet +80 Kč/extra
- **Petra** (sitting, 120 Kč/visit) → weekend +20%, last-minute +10% within 3d
- **Shawn** (walks, 280 Kč/visit) → holiday +25%, multi-pet +100 Kč/extra
- **Nikola** (boarding, 480 Kč/night) → holiday +30%, multi-pet +200 Kč/extra, last-minute +15% within 5d *(flagship — all three modifier kinds)*
- **Olga M.** (sitting/walks, 390 Kč/visit) → weekend +15%, multi-pet +100 Kč/extra *(promoted to bridged Provider 2026-05-04)*
- **Markéta H.** (full-service, 600 Kč/visit) → holiday +25%, weekend +15%, multi-pet +150 Kč/extra; boarding adds last-minute +15% within 7d *(promoted 2026-05-04)*

**Today's date in mock world:** 2026-05-04 (Monday). Czech holidays in scope for testing: May 1 (Labour Day, past), May 8 (Liberation Day, 4 days out), Jul 5–6, Sep 28, Oct 28, Nov 17, Dec 24–26. Easter Monday 2026 was Apr 6 (past).

---

## Workstream A — Provider pricing config schema

Cards show **"From {price} / unit"** when modifiers are configured. Modifier specifics resolve in the proposal, not the card.

- [x] **A1. Tomáš → `/profile/petra?tab=services`.** "In-home Sitting" card shows **"From 120 Kč / visit"**. No chip strip.
- [x] **A2. Daniel → `/profile/nikola?tab=services`.** "From " prefix on the boarding card.
- [x] **A3. Daniel → `/profile/shawn?tab=services`.** "From " prefix on the walks card.
- [x] **A4. Tomáš → `/profile/klara?tab=services`.** No "From " prefix — just `300 Kč / visit`.
- [x] **A5. Tomáš → `/profile/olga-m?tab=services`** and **`/profile/marketa-h?tab=services`.** Per-service price with "From ", sub-service chips, notes, "Book a session" CTA. Units correct per type. No "Open to helping" badge. Availability grids render full Mon–Sun with muted inactive slots.

---

## Workstream B — Auto-pricing engine

**Today:** 2026-05-04. Persona override via `?as=<personaId>` for Petra/Shawn/Nikola (not on picker).

- [x] **B1. Tomáš → `/profile/petra?tab=services`** → "Book a session." Service picker does NOT render. Hugo, **One Time**, **2026-05-09 (Sat)**. Send.
- [x] **B2. `/inbox?as=petra`** → Tomáš thread → InquiryCard "Send proposal."
  - Header **"System quote"**
  - `In-home sitting × 1 visit` — `120 Kč`
  - `Weekend rate (+20%)` + note "Booking spans a weekend day" — `+ 24 Kč`
  - Subtotal `144 Kč` · Platform fee 12% `+ 17 Kč` · Owner pays `161 Kč`
  - No last-minute line (May 9 is 5 days out, threshold 3)
  - "Adjust this quote" visible in header
- [x] **B3. Last-minute.** Tomáš → Petra → **2026-05-06 (Wed, 2 days out)** → Send. `/inbox?as=petra` respond.
  - Base `120 Kč` + Last-minute (+10%) "Booking starts in 2 days" — `+ 12 Kč`. No weekend. Subtotal `132 Kč`.
- [x] **B4. Holiday.** Daniel → `/profile/shawn?tab=services` → Bára, Walks, One Time, **2026-07-05 (Sun, Saints Cyril and Methodius Day)** → Send. `/inbox?as=shawn` respond.
  - Base `280 Kč × 1 visit` + Holiday (+25%) "Saints Cyril and Methodius Day (07-05) falls in this booking" — `+ 70 Kč`. Subtotal `350 Kč`.
- [x] **B5. Flagship.** Daniel → `/profile/nikola?tab=services` → Bára, sub-service **Home boarding**, One Time, **2026-12-23 to 2026-12-27**. Send. `/inbox?as=nikola` respond.
  - Base `Boarding × 5 nights — 2,400 Kč` + Holiday (+30%) "3 Czech public holidays fall in this booking" — `+ 720 Kč`. Subtotal `~3,120 Kč`.
- [x] **B6. Ongoing.** Tereza → `/profile/shawn?tab=services` → Walks → Repeat Weekly → Mon + Wed + Sat → Send. `/inbox?as=shawn` respond.
  - `Walks × 3 visits/week — 840 Kč`. No holiday/last-minute lines. Cycle label `/ week`.

---

## Workstream C — ProposalForm refactor (read-only + override mode)

- [x] **C1. ProposalForm open from any B1–B5.** Default state read-only.
  - Header **"System quote"** + "Adjust this quote" button
  - Line items render as plain text rows
  - Each modifier row carries italic `triggerNote` under the label
  - "Send proposal" sends without clicking Adjust
- [x] **C2. Click "Adjust this quote."**
  - Header → **"Adjusted quote"**
  - Line items become editable inputs
  - Amount inputs have `min={0}` — negatives blocked + clamped on paste
  - "Adjust this quote" button hides
- [x] **C3. Edit base price** (e.g. 480 → 400 on Nikola).
  - Edited row gets subtle amber tint (`--warning-25`)
  - "You're sending a custom quote" callout: warning icon, copy, optional reason input, "Reset to system quote" link
  - Subtotal updates live
- [x] **C4. Type reason** "Repeat client discount." Send.
- [x] **C5. Owner-side BookingProposalCard.**
  - Header clean: Calendar icon + "BOOKING PROPOSAL" label + One time / Ongoing badge
  - Standard rows: Service, Pets, Dates, line items. Modifier lines retain italic `triggerNote`
  - **CUSTOM QUOTE callout in body**, after line items: pale amber (`--warning-50`), sparkle icon + uppercase "CUSTOM QUOTE" label, italic *"Repeat client discount"* below
  - Total row unchanged
  - Footer: Not now / Suggest changes / Review & sign
- [x] **C6. Reset path.** Repeat C2–C3 → "Reset to system quote." Edits revert, tints clear, header → "System quote", callout disappears, reason wipes.
- [x] **C7. Counter flow.** Tomáš taps "Suggest changes" on Petra's proposal.
  - ProposalForm pre-filled with existing proposal's price (not freshly-computed engine output)
  - If Petra deviated → opens in editing mode with deviation flags
  - If Petra matched system → opens read-only
- [x] **C8. Standard send (no override).** Send without clicking Adjust.
  - No CUSTOM QUOTE callout on owner-side card
- [x] **C9. Custom quote, no reason.** Repeat C2–C3, skip reason, send.
  - CUSTOM QUOTE callout still shows; italic reason text omitted

---

## Workstream D — Inquiry-form expansion (deferred, doc-only)

- [x] **D1.** `docs/features/explore-and-care.md` → "Future inquiry-form fields" subsection lists five deferred dimensions: `durationMinutes`, time-of-day, home-attributes, add-on opt-ins, package selection.

---

## Workstream E — Provider onboarding UI for modifier config

> **Scope note (2026-05-05).** This phase only built the `PricingModifiersEditor` accordion. The surrounding edit-mode chrome — global Edit/Save in hero, raw `<select>` for service type, card-in-card nesting — is pre-existing pattern and **deferred to Profile Deep Pass** (spawned task). E items below verify the accordion specifically; ignore parent-form layout/styling concerns.

- [x] **E1.** Tereza → `/profile?tab=about` → "Edit Profile" → Services tab. Reach the editable "In-home Sitting" service card.
- [x] **E2.** Below Notes: **"Pricing modifiers"** accordion row with **"2 on"** brand pill + caret.
- [x] **E3. Expand.** All four modifier kinds render in order:
  - Holiday surcharge — OFF, hint "Czech public holidays in the booking dates"
  - Weekend rate — ON, 15%, hint "When the booking includes Sat or Sun"
  - Multi-pet — ON, 80 Kč, hint "Per extra pet beyond the first"
  - Last-minute — OFF, hint "Booking starts soon"
- [x] **E4.** Toggle Holiday ON → Surcharge `25%` revealed.
- [x] **E5.** Weekend rate 15% → 20%.
- [x] **E6.** Toggle Last-minute ON → Surcharge `10%` + "Within `3` days."
- [x] **E7. Save.** Editing closes. View-mode card chips reflect edits in same session. (Persistence is in-memory only — reload shows seeded config.)
- [x] **E8. New service.** Edit mode → "Add a service." New card has all 4 modifier kinds OFF with defaults: Holiday 25%, Weekend 15%, Multi-pet 100 Kč, Last-minute 10% / 3d.
- [x] **E9. Modifier-less carer.** Klára → Edit Profile → Services. "Pricing modifiers" accordion present with **"0 on"**. Expand shows all 4 kinds in default-OFF state.
- [x] **E10. New User empty state.** `/profile?tab=about` → toggle "Open to helping" ON → Add a service. Pricing modifiers accordion present on new service.


---

## Workstream F — Per-service pricing on Discover cards

- [x] **F1. Tomáš → `/discover/care`**, All filter. Cards show legacy `priceFrom + priceUnit`. Service-tag chip row below trust signals.
- [x] **F2. "Walks" filter.**
  - Klára's unit: "per walk" → **"per visit"** (300 Kč unchanged)
  - Service-tag chip rows hide on all cards
- [x] **F3. "Sitting" filter.** Sitting providers show. Chip rows still hidden. Prices per-service.
- [x] **F4. "Boarding" filter.** Boarding providers (Nikola, Markéta, Olga, Pavel, Jana). Nikola resolves to **480 Kč per night**.
- [x] **F5. Back to "All".** Service-tag chip rows reappear.
- [x] **F6. Daniel (locked viewer).** Repeat F1–F4 — same behavior.


---

## Workstream G — Booking detail surfaces

> Booking-detail Pricing breakdown rendering moved to `verification-checklist.md` V7 (regression check, not phase thesis).

---

## Workstream H — Inquiry decline path

- [x] **H1. Provider InquiryCard footer** (`/inbox?as=petra` with B1 pending):
  - Two buttons with gap: **Decline** (tertiary) left + **Respond with proposal** (primary) right
  - Both non-CTA register

> Decline form mechanics + send + owner-side view + cancel → `verification-checklist.md` V8.

---

## Workstream I — Engine estimate visibility

- [x] **I1. Live estimate on InquiryForm.** Tomáš → `/profile/petra?tab=services` → "Book a session."
  - No estimate until form sendable (Hugo + sub-service + One Time + date)
  - **2026-05-09 (Sat)** → Estimate block above Send: "ESTIMATE" + `144 Kč` + chip "Weekend rate (+20%)" + footnote "Petra will confirm this quote. Platform fee added at checkout."
  - **2026-05-07 (Wed)** → updates to `120 Kč`, weekend chip gone
  - **2026-05-06 (2 days out)** → last-minute chip + `132 Kč`
  - Remove pets → estimate disappears

> Estimate-on-InquiryCard + matches-ProposalForm + post-response collapse + Start-from date → `verification-checklist.md` V9–V11.

---

## Workstream J — BookingProposalCard collapse + footer

- [x] **J1. Countered collapse.** From C7's flow: after Tomáš submits the counter, scroll back to Petra's original 100 Kč proposal in the thread.
  - Body collapsed to header + "In-home Sitting · Day sitting" only. No rows / line items / custom-quote callout / total.
  - Footer: **Countered** — right-aligned, semibold, secondary text color.

> Declined / accepted / pending collapse states → `verification-checklist.md` V12.
