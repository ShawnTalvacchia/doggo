---
status: archived
last-reviewed: 2026-06-16
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

- [x] **O1. Walk-delivery price editor — RESOLVED (fold in).** PO 2026-06-15: build the walk `deliveryOptions` carer-edit UI here too. Built. See Decisions log. (Klára → `/profile?tab=services` → Edit → Walks & Check-ins card.)
- [x] **O2. Half-day default = 60% of full-day rate — RATIFIED (PO 2026-06-15).** Kept at 60%. A half-day isn't half the cost (fixed per-booking overhead); 60% matches the seed and is a tunable starting suggestion. (Tereza → `/profile?tab=services` → Edit → Day care → toggle off/on.)

---

## Worth verifying

Interaction nuance, complex state, persona round-trips. Each check gives **where to look** (persona via `?as=` + URL) and **what to expect**. Identifier prefix: **`V`** (V1, V2, ...).

### V1 — Appointment meeting-options (B)

- [x] **V1.1 Multi-option picker.** `/profile/sarka-trainer?tab=services` → tap **Book a session** on "Puppy starter session". *Expect:* a "Where should this happen?" picker with **Carer comes to you · 650 Kč** and **Meet at a public spot · 600 Kč**; tapping one tints it blue and the **Price** estimate switches to match (650 ↔ 600). *(Any persona — open profile.)*
- [x] **V1.2 Single-option read-only line.** `/profile/klara?tab=services` → **Book a session** on "1-on-1 training session". *Expect:* no picker — a read-only **Where** line "Klára comes to your address", price **800 Kč**.
- [x] **V1.3 Flat / legacy path (no options set).** `/profile/lenka-groomer?tab=services` → **Book a session** on "Full groom — small/medium breed". *Expect:* no "Where" block at all, flat **800 Kč** (confirms carers who never set locations are unaffected).
- [x] **V1.4 Carer edit UI.** `/profile?as=klara&tab=services` → **Edit** → the **Appointment** card ("1-on-1 training session"). *Expect:* a "Where do you meet?" block of four toggle rows; **Carer comes to you** is ON with an 800 Kč price field; the standalone flat Price field is hidden; toggling a second option on reveals its own price field.
- [x] **V1.5 Booking-detail location row** *(optional, needs the full sign round-trip — we can drive it together).* After an owner signs an appointment proposal, the booking detail shows a meeting-location row (mirrors the walks delivery row). Code-verified this build.

### V2 — Walk handoff-location + event-aware default (C2/C3)

- [x] **V2.1 Event-aware default.** `/meets/meet-klara-stromovka?as=daniel` (persona matters here — the pickup default is the *viewer's own* area, and the viewer needs a dog) → tap **"Have Klára walk your dog"**. *Expect:* on **Pickup** the address field prefills **Holešovice** (Daniel's area); switch the segment to **Drop-off** and it re-prefills **Stromovka** (the meet's park).
- [x] **V2.2 Override persists to the booking.** In that sheet, type a custom spot (e.g. "East gate by the café"), pick a date, **Book**, then open it from `/bookings?as=daniel`. *Expect:* the booking-detail row and the Schedule card both read "…at East gate by the café".

### V3 — Dog health/care fields, populated vs empty (D)

- [x] **V3.1 Fully populated (shelter dog).** `/dogs/shelter-dog-tonda`. *Expect:* "How Tonda likes to be cared for" with **Likes / Triggers / Play / Exercise** rows; **Health** with vaccines + **Spayed / neutered** + **Microchip · 203164000981245**.
- [x] **V3.2 Empty-state prompt (shelter dog).** `/dogs/shelter-dog-liza`. *Expect:* the care section shows a neutral **"No care notes yet."** instead of hiding (owned dogs hide entirely). Copy is neutral because every viewer sees it; the staff "add notes" prompt belongs in the operator view (FC16).
- [x] **V3.3 Conditions line (shelter dog).** `/dogs/shelter-dog-simon`. *Expect:* a health **conditions** line ("Senior with some hip stiffness…").
- [x] **V3.4 Owned-dog render + edit.** `/dogs/bara?as=daniel` (persona matters — Bára's owner Daniel has a private profile, and editing needs to be him) shows the **Exercise** row + **Microchip** line. Then `/profile?as=daniel` → **Edit** → Bára's card has an **"Exercise needs"** field (preferences) + **"Microchip number"** field (Health & vet) that save and re-render.

### V4 — Day-care half-day (A) — circle-scoped, needs a connected viewer

- [x] **V4.1 Carer edit (half-day opt-in).** `/profile?as=tereza&tab=services` → **Edit** → the **Day care** card. *Expect:* a half-day opt-in; enabling it reveals a **90 Kč** half-day price (60% of the 150 full-day rate), full-day field stays the base.
- [x] **V4.2 Owner-facing radio.** `/profile/tereza?as=jana&tab=services` — Jana is Connected to Tereza (so the circle-scoped day-care is visible) and has a dog (Rex). Open the **Day care** request. *Expect:* a **Full day · 150 / Half day · 90** choice; the live estimate updates on toggle and carries through to the proposal price line + the booking-detail "Half day / Full day" label. *(Owner-facing path not clicked end-to-end this build; code path verified — `InquiryForm` `offersHalfDay`, `resolveBaseRate`, `bookings/[id]` label.)*

---

## Decisions surfaced during walkthrough

A running **log** (not a checklist) of decisions/design changes/rationale that surfaced during walkthrough. Append as you walk. Each entry carries a `→ target-doc.md` annotation for the phase-close propagation sweep.

- **Walk-delivery price carer-edit UI built (folds O1 into A4).** `ProfileServicesTab` walks_checkins card now offers drop-off + pickup as toggle rows, each with its own priced input; the standalone "Price" field is replaced by these rows for walks (no double-price confusion). `pricePerUnit` is kept pointed at the base (drop-off if offered, else pickup) for fallback surfaces. Pickup seeds to `round(dropoff × 1.2)` when first enabled. At-least-one-method guard prevents disabling both. The `deliveryOptions` axis had been mock-seed-only since the Walk Service Delivery phase (2026-05-20). → `features/explore-and-care.md` (Walk Service Delivery additions — the carer-edit UI now exists)
- **Day-care half-day carer-edit UI built (A4).** Half-day price seeds to 60% of full-day; full-day option kept in lockstep with `pricePerUnit`. → `features/explore-and-care.md`
- **Walk handoff location = single `Booking.deliveryLocation?` field, not a pickup/dropoff pair.** The `delivery` method already disambiguates, so one free-text field suffices (board sketched two). Event-aware default: meet-linked drop-off defaults to the meet's park; pickup to the owner's area. Editable = a proposal the carer reviews (no formal approve gate in V1 — chat covers it). → `features/explore-and-care.md`
- **C4 — walk handoff location is free-text V1; saved-address dropdown deferred.** Matches C1's free-text call; the meet-park default removes most typing. The Discover saved-address picker reuse can come with P65. → no feature-doc update needed
- **C5 — "Group walk" walk sub-service renamed `Small-group walk` globally.** Disambiguates the care delivery detail (≤4 clients' dogs) from a community group-walk Meet. `mockShelters` FC18 community group walk keeps "group walk" (it IS a meet). → `features/explore-and-care.md` + `strategy/Groups & Care Model.md`
- **Walk handoff-location input gets a leading map-pin (walkthrough 2026-06-16).** Purely visual affordance signalling "this is a place," and a gentle foreshadow of real address autocomplete (deferred — P65 / OQ §3). New reusable `.input-with-leading-icon` + `.input-leading-icon` CSS (parallel to the existing trailing-icon variant). → `implementation/design-system.md` (input leading-icon variant)
- **Day-care duration breakdown on the profile service card (walkthrough 2026-06-16).** The `/profile/[userId]` Care card surfaced the walks delivery breakdown (Pickup/Drop-off rows + "From {cheapest}") but day-care showed only "From {full-day}" with the half-day hidden until you opened the booking form. Now day-care renders **Full day / Half day rows + "From {cheapest=half-day}"**, mirroring walks so both priced axes read the same on the card. (Em dash kept in the walks rows — structural UI label separator, not seeded prose; PO 2026-06-16.) → `features/explore-and-care.md` (service-card priced-axis breakdown)
- **Mentor-offering card copy softened (walkthrough 2026-06-16).** "Mentor offering — managed with the shelters you mentor at. Editing arrives with the mentor tools." → "A mentor offering, managed with the shelters you mentor at." Drops the editing-promise (the real editor is FC16, deferred V3+, not on the roadmap) + the em-dash. → no feature-doc update needed
- **Appointment editor simplified to name + Description + Type (walkthrough 2026-06-16).** The card had three structured "what is this" fields — `Type` (training/grooming), `Training focus` (the P73 `trainingType` enum, 11 pills), and `Notes`. Collapsed to a single **Description** field under the name (reuses the existing `notes` field; the carer explains focus/grooming/etc. in prose). The `trainingType` enum + `TRAINING_TYPE_LABELS`/`_PICKER_ORDER` constants were removed entirely (an interim free-text `trainingFocus` field was added then dropped — Description covers it). **`Type` (`appointmentCategory`) was KEPT** — it's the one structured signal powering the Discover "Training" filter pill + the "Training visit / Grooming" card labels; dropping it would make training unfindable (cuts against Open Questions §18). Seed focuses folded into each appointment's Description. → `lib/types.ts` + `features/explore-and-care.md` (appointment editor)
- **Service-editor row polish (walkthrough 2026-06-16).** Per PO: (a) the section helper line moved to sit *under* the section header ("Delivery & pricing" / "Where do you meet?"), not trailing after the rows; (b) `PricedToggleRow` uses the small (`size="sm"`) toggle; (c) the unit ("Kč / visit" / "Kč / appointment") renders *inside* the price input (`.input-with-trailing`), not as a separate span. → `implementation/design-system.md` (PricedToggleRow)
- **Carer service-editor option rows unified (walkthrough 2026-06-16).** The walk delivery editor and the appointment meeting-locations editor had drifted into different layouts (walks: description inline on the toggle + "X price" label + em-dashes; appointments: no description + redundant "{full tuple name} price" labels). Unified onto a shared `PricedToggleRow` (`components/ui`): **bold option name + toggle on row 1; muted subline + compact right-aligned price input share row 2 when on.** `Toggle` gained a `strong` prop (bold label) + `.toggle-label--strong`. Appointment `carerHint` added to `APPOINTMENT_LOCATION_META` for the sublines. → `implementation/design-system.md` (new `PricedToggleRow` + `Toggle strong`) + `features/explore-and-care.md` (carer-editor option-row layout)
- **Appointment meeting-options (B) — kept separate + curated (Open Q §17 closed).** New `appointmentLocations: { kind, price }[]` on `CarerAppointmentServiceConfig` only (walks `deliveryOptions` untouched — no migration). Four curated tuples (`AppointmentLocationKind`) with labels/owner-copy in `APPOINTMENT_LOCATION_META`. `computeAppointmentQuote` is option-aware; the chosen kind rides `AppointmentRef.location` through inquiry→proposal→booking (no separate `Booking` field). → `features/explore-and-care.md` (Appointment booking flow + Services-as-Catalog) + close Open Questions §17
- **Appointment edit + booking-sheet patterns mirror the walks delivery axis.** Carer edit: toggle-rows-with-price, flat field hidden when options exist, `pricePerAppointment` kept synced to the first option. Booking sheet: picker when >1, read-only line when exactly 1, omitted when 0. → `features/explore-and-care.md`
- **Dog health/care fields (D).** Added `PetProfile.microchipNumber` + `exerciseNeeds`. Dog page now also surfaces `spayedNeutered` + `vetInfo.conditions` (previously PetCard-only) and shows a shelter-dog empty-state when care notes are absent. Owned dogs edit both new fields via PetEditCard; shelter dogs read-only (operator UI V3+). **Empty-state copy is neutral ("No care notes yet.") — NOT a staff "add notes" instruction (walkthrough 2026-06-16): every viewer sees this surface, so a staff-directed prompt reads wrong; the real prompt-to-fill belongs in the FC16 operator view.** → `features/profiles.md` (PetProfile fields + dog-page Health/preferences) + `features/shelters.md` (shelter-dog empty-state)
- **No em dashes in copy (PO 2026-06-16).** Standing preference: avoid em dashes in product/seeded copy (reads as machine-written); use periods/commas/parentheses. Applied to all D seed content + the C copy. Saved to memory. → no feature-doc update needed (broader sweep of pre-existing em-dash copy is a candidate punch-list item)
- **Linked-care booking copy reframed.** Booking-sheet card subline drops the raw "Walks & Check-ins" label (read as a check-in) → "On the {park} group walk · no need to come along," surfacing the linked meet. "no need to come along" (positive framing) replaces "you don't come along" across the card, success screen, and `LinkedCareCallout` (PO 2026-06-16). → `features/explore-and-care.md`
