---
category: phase
status: active
last-reviewed: 2026-03-24
tags: [phase-13, meets, meet-types, feature-enrichment]
review-trigger: "when modifying meet types, creation form, or meet display"
---

# Phase 13 — Meet Type Enrichment

**Goal:** Flesh out meet types (Walk, Park Hangout, Playdate, Training) with type-specific fields so the demo shows fully differentiated event experiences — not just four labels on the same form.

**Depends on:** Phase 12 (demo-ready polish).

---

## Why

Meets are the core community feature. Right now all four types share the same data model and creation form — the type is just a label. Real users make decisions based on pace, terrain, whether an area is fenced, what skills they'll practice, or whether it's a drop-in window vs. a fixed start time. Type-specific fields make each meet feel purposeful and help people self-select into the right events.

---

## Workstream A — Data Model & Shared Fields

### A1 · Type-specific interfaces in types.ts

Add discriminated union types for each meet type's extra fields. Keep the base `Meet` interface and add optional type-specific blocks.

**New types:** `WalkFields`, `ParkHangoutFields`, `PlaydateFields`, `TrainingFields`, `EnergyLevel`, `WalkPace`, `WalkDistance`, `WalkTerrain`, `ParkAmenity`, `ParkVibe`, `PlaydateAgeRange`, `PlayStyle`, `TrainingSkill`, `TrainingExperienceLevel`, `TrainerType`

### A2 · Shared enhancement fields on Meet

Three new fields on all meets:
- `energyLevel`: "calm" | "moderate" | "high" | "any"
- `whatToBring`: string[]
- `accessibilityNotes`: string

### A3 · Enrich mock data

Populate all 6 mock meets with type-specific and shared fields so the demo feels real immediately.

---

## Workstream B — Creation Form

### B1 · Conditional type-specific section in create form

After type selection, show a "Details for [type]" section with the relevant fields:

- **Walk:** pace, distance, terrain, route notes
- **Park Hangout:** drop-in window toggle + end time, amenities multi-select, vibe
- **Playdate:** age range, play style, fenced area, max dogs per person
- **Training:** skill focus multi-select, experience level, led by, trainer name, equipment needed

### B2 · Shared fields in Rules section

Add energy level selector, "what to bring" tag input, and accessibility notes to the existing Rules section for all types.

---

## Workstream C — Display

### C1 · MeetCard type-specific signals

Add 1–2 key signals per type to the card meta row:
- Walk → "Moderate pace · 3 km"
- Hangout → "Drop in 10–12 · Fenced"
- Playdate → "Puppies · Gentle play"
- Training → "Recall · Beginner"

### C2 · Meet detail page type-specific section

Expand the details grid with a type-specific section showing all relevant fields with appropriate icons and formatting.

---

## Workstream D — Documentation

### D1 · Update meets feature doc

Update `docs/features/meets.md` with the new type-specific fields, updated data model, and creation flow changes.

### D2 · Update component inventory

Add any new components to `docs/implementation/component-inventory.md`.

---

## Execution Order

1. A1 + A2 — Types (foundation)
2. A3 — Mock data (so we can see changes immediately)
3. B1 + B2 — Creation form (type-specific + shared fields)
4. C1 — MeetCard signals
5. C2 — Detail page
6. D1 + D2 — Docs

---

## Verification

- [ ] Each meet type has distinct fields in the data model
- [ ] Creation form shows type-specific fields conditionally after type selection
- [ ] All 6 mock meets have type-specific data populated
- [ ] MeetCard shows 1–2 type-specific signals per type
- [ ] Detail page displays type-specific section with all relevant fields
- [ ] Feature doc updated with new data model and field descriptions
- [ ] Energy level, what to bring, and accessibility notes available for all types

---

## Out of Scope

- Map-based location picker (still text input)
- Route drawing/GPS tracking for walks
- Trainer profile linking
- Equipment marketplace
- Dog compatibility algorithm
