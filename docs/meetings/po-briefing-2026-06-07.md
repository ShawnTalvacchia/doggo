---
category: meetings
status: active
last-reviewed: 2026-06-07
tags: [po, briefing, user-interviews, shelter-angle, status]
---

# Doggo — PO Briefing: Post-Interview Build Recap

**For:** Alyssa
**From:** Shawn
**Date:** 2026-06-07
**Purpose:** Trace the consolidated three-interview feedback + the shelter-angle brainstorm against what's actually built, surface what's on-deck, and flag the strategic calls worth discussing.

**Source note:** "Feedback" below refers to the consolidated points from the three user interviews. Specific individuals are named only when the original attribution did (Roman → training-demand signal + dog-tax example).

References: `meetings/po-briefing-2026-06-02.md` (interview synthesis) · `ROADMAP.md` · `phases/Open Questions & Assumptions Log.md` · `strategy/Vets as a Credentialing Layer.md`

---

## TL;DR

Of the ~13 distinct feedback points: **5 shipped**, **5 sized + queued**, **3 are deliberate research/open-question threads** (vets, vaccine gating, forum). Training was the strongest landed thread — Discover filters surface training across both care + meets, structured sub-types are wired, two new trainer carers seeded, and the demo's anchor persona (Daniel) has training framed as the capstone.

Shelter angle has a strong foundation (Útulek Liběň + dog roster + Members + tier badges + "Needs walks now" sort) but the **volunteer journey itself — waiver, approval, booking a walk — is deliberately deferred to a merged credentialing-moat phase**. Your brainstorm lands cleanly against that.

---

## What shipped (visible in the demo today)

**Discover surfaces**
- **Training filter pill on `/discover/care`** narrows the **providers list** (Klára, Šárka, Radek).
- **Training filter pill on `/discover/meets`** narrows the **meets list** (Klára's group session, puppy meets). Independent surface from Care.
- **Three trainers** with distinct positioning: community-anchored / mobile puppy specialist / facility-based agility specialist.
- **Sub-type chips on service cards** — Behaviour / Puppy socialisation / Agility. All 11 interview sub-types wired as `TrainingType` enum + picker in the service-edit form.
- **Carer identity sub-specs** — Klára now reads "Dog Trainer," Tereza now reads "Pet Sitter" (was plain "Carer").

**Profile interactions**
- **Familiar pill on locked profiles** → tappable, opens an Unmark menu (friction-by-design).
- **Connected pill** → drops a menu (Unconnect / Block / Report).
- **"Connect with X" button** wires through `requestConnect` + persists Pending state.
- **Locked-profile prose** restructured as a two-line question-with-footnote treatment.
- **Shared meets line** on the locked-profile SharedContextCard — "You were both at *Spring reactive dog community walk* on 28 May 2026" as social proof.

**Meet detail**
- **Organised by row** on the People tab — locked hosts no longer disappear into Private Profiles.
- **Private Profiles split per RSVP section** — counts and visible rows align inside each heading.

**Filters / dates / membership**
- **Monday as first day of week** in every date picker.
- **Group size slider "no max"** with explicit "Any size" affordance.
- **"Any" filter pill mutual exclusivity** — selecting Any deselects specifics.
- **Focus accordion interactive + active count** ("Focus · 2" when collapsed with selections).
- **Group join/leave persistence** via a new `GroupsContext`.

**Plumbing**
- localStorage `seedVersion` (fresh seeds for testers without `/demo` reset).
- localStorage key naming consistency.
- Orphan-file + CSS cleanup.
- Panel chrome opacity (kills the inconsistent glassmorphism).

---

## Strategic doc work

Doc-level scaffolding for upcoming phases. Not demo-visible but load-bearing:

- **New phase board:** Service Options & Booking Clarity (3 workstreams — walking pickup/dropoff addresses, half-day day-care SKU, appointment meeting-options design).
- **New research doc:** Vets as a Credentialing Layer — multi-sided value loop, four entity-model options, three tiers of commitment. For your decision.
- **Carer Portfolio scope-up:** Workstreams E (circle attribution) + F (review form) added to serve the ratings + "circle has booked them" signals.
- **Dog Profile scope expansion:** vaccines V1 + pet-level standing preferences ("Bára loves fetch, hates loud dogs").
- **Cold-Start Playbook** gained "The vet angle" parallel to the shelter angle.
- **Demo Narrative + User Archetypes** updated with the training-demand signal + new "Anxious New Owner" archetype (maps to Daniel).
- **Open Questions §15-§18** filed: vaccines, vets-as-credentialing, appointment meeting-options, training-as-5th-Care-type.
- **Future Considerations FC10:** forum / regulatory info for Czech owners (dog-tax example).

---

## Interview feedback — point-by-point status

| # | Feedback point | Status | Where it lives |
|---|---|---|---|
| 1 | Monday as first day of week | ✅ Shipped | Date pickers app-wide |
| 2 | Walking: separate pickup & drop-off addresses | 🗺 Queued | Service Options phase, Workstream C |
| 3 | Walking: half-day option | 🗺 Queued | Service Options phase, Workstream A |
| 4 | Walking: solo-walk request | 🗺 Queued | Pet-level standing prefs → Dog Profile; per-booking deferred |
| 5 | Walking: dog preferences (likes fetch, triggers) | 🗺 Queued | Pet-level structured fields → Dog Profile |
| 6 | Puppy-only meets | ✅ Shipped | "Puppies" filter pill + seeded puppy meets |
| 6b | Puppy-only **groups** | 💡 Open | Different surface from puppy meets; small design call |
| 7 | Vaccines: structured record + acknowledgement | 🗺 Queued | Dog Profile, V1 scope |
| 8 | Vaccines: gating meets on vax status | 💡 Open | OQ §15 — depends on §16 verification path |
| 9 | Ratings (stars + text) | 🗺 Queued | Carer Portfolio, Workstream F |
| 10 | "Has anyone in my circle booked them" + their review | 🗺 Queued | Carer Portfolio, Workstream E |
| 11 | Training prominence (Roman) | ✅ Shipped | Filter pills, sub-types, two trainer seeds, identity badges |
| 11b | Training framing in demo narrative | ✅ Doc | Demo Narrative + "Anxious New Owner" archetype |
| 12 | Forum / regulatory info (Roman, dog-tax example) | 💡 Future | FC10 — post-demo |
| 13 | Grooming services | ✅ Live | Lenka Nováková at Mánesova Grooming Salon |
| 14 | Vet/medical services | 💡 Research ready | `strategy/Vets as a Credentialing Layer.md` |

**Reading the table:** training was the strongest landed thread, mapping directly to Daniel as the demo archetype. The walking-detail asks cluster into one upcoming phase. The trust-signal asks cluster into Carer Portfolio. Vaccines + vets are deliberately gated on strategic input.

---

## Shelter angle

### Built today (Shelter Foundation, 2026-06-02)

- `/shelters/[id]` is a real surface; Útulek Liběň is the demo shelter.
- Four tabs (Feed / Dogs / Members / Gallery) mirroring Communities.
- Dog roster, default sort **"Needs walks now"** — matched your brainstorm exactly.
- `/dogs/[id]` per dog: backstory, kennel stats, tags, "Recent walkers" row, tagged posts.
- Members tab with All / Walkers / Supporters / Team filter pills.
- **Volunteer tier badges** — Leaf 🍃 / Plant 🌱 / Tree 🌳 (violet color category, growth-metaphor icons; recognition rather than rank).
- "Walk a dog" affordance with placeholder Interest-sent state.

### Deliberately deferred

- **Walker journey** (waiver → approval → pick dog → book walk → start/finish + visit report) → merged Carer Portfolio + Shelter Walker Credentialing phase.
- **Admin / operator view** (approvals, queue, notifications) → V3+; depends on multi-user state.
- **Multi-shelter discovery** — Útulek reachable today by direct URL only.

### Your brainstorm mapped against the build

| Idea | Status | Notes |
|---|---|---|
| New volunteering section/module | 💡 Foundation IS this | Built as a top-level entity (not a Group type) — shelters carry institutional identity (non-owned dogs, vetted walker pool, per-shelter policy) that the Group model can't carry cleanly. |
| List of shelters, closest first | ❌ Not yet | Demo has one; "Help a Dog" 4th Discover door is an open call (see Q3). |
| Click shelter → admin + dogs | ✅ Built | Page chrome is in place. |
| Click Volunteer → waiver modal | ❌ Deferred | Walker journey work. |
| Admin approve/reject + notifications | ❌ V3+ | Admin view. |
| Approved walker books a dog walk | ❌ Deferred | Walker journey. |
| Recurring walks | ❌ Deferred | Pattern exists (recurring meets, recurring care). |
| Dogs with least-recent walks first | ✅ Built | Default Dogs-tab sort. |
| Joining a meet with a shelter dog | 💡 Open | Touches walker-led public meets — see Q5. |
| Walk started/ended | ❌ Deferred | Reuses care-session pattern. |
| Tag/pill in Schedule | 🗺 Queued | Lands when walker journey ships. |
| Type of group with filter pill | ❌ Rejected | Shelters need entity-shape, not group-shape. Worth restating in the meeting. |
| Profile badges | ✅ Shipped (shelter side) | Travelling to UserProfile is FC9. |
| 4th Discover door ("Help a Dog") | 💡 Open | See Q3. |

---

## On deck — phases queued

| Phase | Interview touch points | Sizing |
|---|---|---|
| **Dog Profile** *(next)* | Vaccines V1, pet-level standing prefs, vet info display | Medium-large. Deepens shelter dog profile + builds owned-dog profile from scratch. |
| **Photos & Galleries** | (strategic) | Medium. Per-dog auto-album + curated highlights. |
| **Carer Portfolio + Shelter Walker Credentialing** *(merged)* | Ratings + text reviews, circle attribution, walker journey, tier badges, visit reports attaching to dogs | Large. Credentialing-moat phase. |
| **Service Options & Booking Clarity** | Pickup/dropoff addresses, half-day, appointment meeting-options | Medium. Three workstreams. |
| **Onboarding & Communication** *(paused)* | (strategic) | Re-scope pending. |
| **Design System Cleanup** | (hygiene) | Component consolidation pre-demo polish. |

Side-tasks (not phases): inline add-pet + location lookup (P65), component-consolidation audit (P67), connection rosters fill-out (P69).

---

## Open questions worth discussing

Ordered by how blocking they are:

1. **Vets as a credentialing layer.** Research doc ready. Three tiers — Tier 1 (owner self-declared vaccines, already in Dog Profile), Tier 2 (photo-confirmed), Tier 3 (full `VetProfile` entity, Shelter-Foundation-sized phase). Tier 3 trigger = a real Prague vet conversation, mirroring how shelters graduated. Your appetite?
2. **Vaccine gating.** Without verification, gating meets on vax is theatre. Tier-1 ships informational display in Dog Profile; real gating depends on Q1.
3. **Multi-shelter Discover door ("Help a Dog").** Útulek is reachable by direct URL only. Does the 4th Discover door land before demo, or do we keep the single-shelter exemplar pattern?
4. **Volunteer vs Walker terminology.** Build currently uses "Volunteer" badges on shelter Members tab but "Walker" elsewhere. Your brainstorm consistently uses "Volunteer." Easy converge; worth a call.
5. **Walker-led meets with shelter dogs.** Should walker-led public meets carry shelter-dog roster status ("Bára from Útulek will be there")?
6. **Appointment meeting-options model.** Filed in Service Options phase as Pre-build scope calls: generalise across walks + appointments, or keep separate? Curated tuples or carer-defined free-form?
7. **Per-booking special requests vs pet-level standing preferences.** Pet-level is committed to Dog Profile. Per-booking ("solo walk today") currently deferred — earlier?
8. **Training as a 5th Care service type?** Training is split across Meet + Appointment with a filter pill aggregating both. Defer until user-testing surfaces "I couldn't find training" as a real pain.

---

## Suggested meeting structure (~45 min)

- **5 min — context.** What landed since the interview + what's queued.
- **15 min — demo walkthrough.** Training filter + the three trainers; locked-profile flow (Familiar + shared meets line); group join persisting.
- **10 min — shelter angle.** Map brainstorm against build; resolve Volunteer-vs-Walker terminology; align on Q3 (Help a Dog door before demo).
- **10 min — vets thread.** Walk through the research doc; ask about Q1 (Prague vet conversation appetite).
- **5 min — open questions.** Pick top 2-3 worth resolving this cycle.

---

## Appendix

- Demo Narrative → `strategy/Demo Narrative.md`
- Cold-Start Playbook → `strategy/Cold-Start Playbook.md`
- Shelter feature doc → `features/shelters.md`
- Interview synthesis → `meetings/po-briefing-2026-06-02.md`
- Vets research doc → `strategy/Vets as a Credentialing Layer.md`
- Punch list → `phases/punch-list.md`
