---
category: meetings
status: active
last-reviewed: 2026-06-02
tags: [po, briefing, user-interviews, validation, roman]
---

# Doggo — PO Briefing: User Interview Insights (Roman + 2)

**For:** Alyssa
**From:** Shawn
**Date:** 2026-06-02
**Purpose:** PO ran three user interviews. This briefing captures the insights, the disposition for each (where it lands in the roadmap), and the open strategic questions worth pulling on.

The interview source-of-record is Roman's flagged-as-most-detailed conversation; the other two interviews reinforced rather than contradicted his points unless noted.

---

## Insight summary, by theme

### General

- **Monday as first day of week** in all date pickers. Quick fix.

### Walking service

- **Pickup / drop-off addresses can differ.** Owner should be able to specify a non-default drop-off location distinct from the pickup address.
- **Half-day option** for walking/care, distinct from full-day pricing.
- **Special requests on a per-walk basis:**
  - Solo walk request ("walk my dog alone").
  - Things the dog doesn't like / triggers.
  - Positive preferences ("get him to run a lot," "loves fetch").

### Meets / hangouts

- **Puppy-only groups / meets.** Already supported at the meet level via age-range on the playdate type; needs surfacing + seeding.
- **Vaccinations as a structured field**, owner self-declares with acknowledgement of accuracy. Most common Czech vaccines: Rabies (legally mandatory), Parvovirus, Distemper, Infectious Canine Hepatitis, Canine Parainfluenza.
- **Gating meets on vaccination status** — Roman expects unvaccinated dogs to be excluded. We flagged the verifiability problem (without verification, gating is theatre). Opens a strategic thread on Vets as a credentialing layer.

### Trust and reliability

- **Ratings (stars + text)** are KEY to booking decisions, per Roman.
- **"Has anyone in my circle booked this provider?"** — visible on the Discover surface, with their review snippet. The community→care credential signal applied directly to the booking decision.

### Training

- **Training was the most appealing service to Roman.** He expects first-time owners and expats to be the highest-demand segment, and training is the most-needed help for them.
- **Specific training types worth representing:** Obedience / Skills, Manners, Behaviour, Agility, Tracking & SAR, Protection, Therapy Dogs, Service Dogs, Retriever, Dog Sports, Puppy Socialisation.

### Future / not-now

- **Forum / community for legal & regulatory info.** Czech dog owners are often unaware of rules (Roman: 10 years unaware of the dog tax). Worth keeping as a long-term idea.
- **Grooming services** — already partially built.
- **Vet / medical services** — Roman is interested. We sunset vet as a Care category previously (Open Q §6) but the interest is real. Reopens as a parallel credentialing-layer thread, not a Care category.

---

## Disposition — where each insight lands

| Insight | Disposition | Home |
|---|---|---|
| Monday first day of week | Punch list | `phases/punch-list.md` |
| Pickup / drop-off addresses (walks) | Phase workstream C | `phases/service-options-and-booking-clarity.md` |
| Half-day option (day-care SKU) | Phase workstream A | `phases/service-options-and-booking-clarity.md` |
| Solo walk + per-walk special requests | Pet-level + booking-level split | Dog Profile phase (pet-level standing prefs) + future per-session ownerNote work (booking-level overrides) |
| Puppy-only meets / groups | Punch list (seed + filter pill) | `phases/punch-list.md` |
| Vaccinations as a structured field | Folded into Dog Profile phase | ROADMAP Dog Profile entry |
| Vaccination verification + gating | Open Question §15 (smaller, immediate) + Open Question §16 (Vets as credentialing layer, strategic) | `phases/Open Questions & Assumptions Log.md` |
| Ratings (stars + text) review form | Carer Portfolio phase Workstream F | `phases/carer-portfolio.md` |
| "Connections who booked this provider" | Carer Portfolio phase Workstream E | `phases/carer-portfolio.md` |
| Training prominence in demo | Doc updates (Demo Narrative + User Archetypes) | This briefing + framing additions |
| Training Discover filter pill | Side task | Punch list (added 2026-06-02) |
| Appointment `trainingType` sub-types | Side task | Punch list (added 2026-06-02) |
| Should training become a 5th Care service type? | Open Question — defer until user testing | Open Questions log |
| Forum / regulatory info | Future Consideration FC10 | `Future Considerations.md` |
| Grooming | No-op (partially built) | — |
| Vet services | Strategy doc for PO presentation | `docs/strategy/Vets as a Credentialing Layer.md` (research doc) + Cold-Start Playbook section |

---

## Strategic threads opened by these insights

### Appointment meeting-options model (Klára case)

Roman implicitly raised this when discussing trainers picking up dogs from owners and transporting them to parks. The current Appointment booking sheet says nothing about location — owner can't tell from the booking flow whether the trainer comes to their address, the owner brings the dog to a facility, or some other arrangement.

The generalised model: each Appointment service carries a set of `(who-travels, where, price)` options. Owner picks at booking time. The richer model also applies to walks (where current `deliveryOptions` is binary).

Two design Qs surface inside the phase board:
- Q1: Generalise into a shared "meeting-options" abstraction across walks + appointments, or keep separate?
- Q2: Curated tuples or carer-defined free-form?

### Vaccines + Vets as a multi-sided credentialing layer

Roman's vaccine insight reframes vaccines from "an owner-facing field" to "a multi-sided value loop":
- Owners get peace of mind in group settings + transparency
- Vets get a new client acquisition channel + billing for vaccination visits + verified record-keeping
- Platform gets a verified data layer that makes real gating possible (not theatre)
- Public good: more dogs vaccinated, fewer outbreaks

This is the same shape as the shelter thesis in the Cold-Start Playbook (credentialing-as-deliberate-moat, applied to a new vertical). Vets become a third source of verifiable, hard-to-fake trust signals.

Building vet pages is Shelter-Foundation-sized — un-retire vets as an entity type, build a `VetProfile`, design pet ↔ vet relationships, etc. Pre-roadmap until PO has a real conversation with a Prague vet (mirroring how shelters graduated to a phase).

**Output:** Research doc at `docs/strategy/Vets as a Credentialing Layer.md` to present to PO. Open Question §16 referenced from there.

### Training demand from newcomers + expats

Roman's framing that training is the most-needed service for first-time owners and expats directly reinforces the existing V2 Demo Narrative (Daniel — anxious new owner, books Klára's 1-on-1 training as Beat 3's capstone). This is validation, not pivot — the demo already lands on this insight. What's missing is explicit naming of the demand-signal-from-newcomers pattern in the User Archetypes doc (new archetype added 2026-06-02).

---

## Refs

- `docs/strategy/Demo Narrative.md` — V2 walkthrough that already centres Daniel's training conversion
- `docs/strategy/User Archetypes.md` — new "Anxious New Owner" archetype added 2026-06-02
- `docs/strategy/Vets as a Credentialing Layer.md` — research doc, new 2026-06-02
- `docs/phases/service-options-and-booking-clarity.md` — phase board, new 2026-06-02
- `docs/phases/carer-portfolio.md` — Workstreams E + F added 2026-06-02
- `docs/phases/Open Questions & Assumptions Log.md` — §15 + §16 added 2026-06-02
- `docs/phases/punch-list.md` — Monday-first, puppy-meet seed, training side tasks added 2026-06-02
- `docs/strategy/Future Considerations.md` — FC10 (forum / regulatory) added 2026-06-02
