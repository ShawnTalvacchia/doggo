---
category: meetings
status: active
last-reviewed: 2026-06-08
tags: [po, briefing, strategic-threads, status]
---

# Doggo — PO Briefing

## TL;DR

Three strategic threads define the platform right now: **dog community**, **trainer-walker**, and **shelter**. Each is at a different validation maturity:

- **Dog community** — *already validated* in earlier testing; we're deepening the surfaces.
- **Trainer-walker** — *unique to Doggo, unvalidated with real trainers*. The biggest open question on the platform.
- **Shelter** — *foundational design landed*; the volunteer journey itself is the next big build, and worth a real shelter conversation before we commit to detail.

Everything else (privacy, private groups, vaccines, booking-flow polish, posts experience) is supporting infrastructure. The interview-feedback table at the bottom tracks the specific asks from the three interviews — **8 shipped, 3 queued, 5 still open or in research**.

---

## Thread 1 — Dog community

**The bet.** This is the original Doggo thesis: owners want to connect with other owners around their dogs, share walks, and build a familiar local group. The trust earned there is what makes the rest of the platform work.

**Status.** *Validated and built out.* The core surfaces are live — groups (open / neighbourhood / interest), meets with RSVP and post-meet review, the Familiar → Connected gradient, Discover Groups + Discover Meets. Ondra's interview reinforced the thesis directly:

> "I think planning or joining community walks would be something I would very much like to do, especially with people that — if I could have a group of people that I know that with each of whom I'm familiar enough and I want to spend time with, and then could have like out of these people see if they're going somewhere or even organizing a group walk."

Remaining work is densification (more groups and meets seeded so the network feels alive in demo), not structural. The open strategic questions live in threads 2 and 3.

---

## Thread 2 — The trainer-walker

**The bet.** A trainer-walker will run social meets as a community-building play AND as a lead-gen play. They get to know dogs and owners through free / low-cost walks, then convert that trust into paid training, daycare, or boarding. This pattern is not offered on any other platform we've looked at.

**Validation status.** *Unvalidated with real trainers.* This is the biggest open question on the platform. We've assumed Prague trainers will want to do this — the assumption needs ground-truthing.

**What's built.**
- Klára as the anchor persona; her arc anchors the V2 walkthrough (free walks → trust → paid bookings).
- Three trainer carers with distinct positioning — Klára (puppy + reactive specialist), Šárka (group-walk regular), Radek (one-on-one appointment trainer).
- Training filter pill on Discover Care + Discover Meets. Training sub-type chips on service cards. Carer identity sub-specs ("Dog Trainer" / "Pet Sitter" instead of plain "Carer").
- Services-as-catalog: Care + Meet + Appointment offering shapes via the same `CarerServiceConfig` discriminated union. Half-day day-care SKU shipped end-to-end (Tereza seeded with full-day / half-day pricing).
- Daniel's archetype recast as Anxious New Owner — his journey lands on training as the resolution.

**What's next.**
- Trust signals — ratings (stars + text) and "people in your circle have booked them" on Discover.
- Trainer-walker journey polish — the path from social meet → paid appointment booking with the same trainer.
- Trust-badge taxonomy with real teeth (Community Regular / Trusted by Network / Repeat Clients / Certified Trainer / etc.).

**What we need to validate.**
- **Real conversations with 2-3 Prague trainers.** Does the trainer-led-walks-as-funnel model match how they actually find clients today? Would they use a tool like this? What do they list on their own sites today, and what do clients actually ask about? (The last question directly informs which badges matter in the trust-signal work.)

---

## Thread 3 — The shelter

**The bet.** Shelters can use the platform to onboard volunteers and intake/track walk requests. Some people who'd never seek out shelter dogs will be inspired to check on and walk one because the tool makes it easy. Shelter dogs become an always-on walking inventory for the broader community.

**Validation status.** *Foundational design landed; unvalidated with a real shelter.* Útulek Liběň is fictional. Before we design the volunteer-journey surfaces in detail, a real Prague shelter conversation would sharpen the design considerably.

**What's built.**
- ShelterProfile as a top-level institutional entity (parallel to UserProfile, not a Group type). Route at `/shelters/[id]`.
- Útulek Liběň with four tabs — Feed / Dogs / Members / Gallery.
- Dogs tab sorted by **"Needs walks now"** (longest-since-walked first).
- Each shelter dog has its own profile on the same surface as owned dogs — backstory, kennel stats, tags, Posts, Highlights, Recent walkers.
- Members tab with **Volunteer tier badges** (Leaf / Plant / Tree in violet — growth-metaphor icons that scale with tier).
- "Walk a dog" hero affordance (today flips to a placeholder "Interest sent" state).

**What's next.**
- **"Help a Dog" Discover door** — the fourth entry point in Discover, surfacing nearby shelters and their dogs. Today the shelter is reachable only by direct URL; this is the front door that actually opens the thread.
- **The volunteer journey itself** — non-owner taps "Walk a dog," signs a waiver, gets approved, picks a dog, books a one-off or recurring walk. The walk side reuses the Start → Finish → seal-the-visit-report pattern from paid care; the new piece is the approval flow.
- **Shelter-dog signals in walker-led public meets** — when a walker brings a shelter dog to a meet, the meet surfaces it explicitly ("Bára from Útulek will be there too"). More surfaces for shelter dogs is the right direction.
- **Admin/coordinator view** (approving walkers, queuing applications, managing the roster) — depends on multi-user state we don't have yet, intentionally out of demo scope.

**What we need to validate.**
- **A real Prague shelter conversation.** What paperwork their volunteers sign, how they vet new walkers (interview, trial walk, both?), what their group-walk policies look like, how the coordinator role actually works.

**Open decision on this thread:**
- "Volunteer" vs "Walker" — Members tab uses "Volunteer"; the dog profile uses "Walker." Easy converge before the journey gets built.

---

## Adjacent work

Supporting surfaces that span the three threads:

- **Privacy + Familiar/Connected machinery** — the connection gradient powers all three threads. Locked profile is default; Familiar is one-sided and silent; Connected is mutual.
- **Private groups** — neighbourhood and interest groups with member-only visibility. Powers thread 1 directly; also where trainer-walker community-building happens.
- **Vaccines V1 + health data** — structured per-vaccine records, pet-level standing preferences (likes / dislikes / triggers / play). Vaccine gating is open pending the vets thread.
- **Booking-flow improvements** — half-day day-care shipped today; separate pickup/dropoff still queued.
- **Posts + photo experience** — list / gallery / lightbox views, Highlights, filter pills, per-post kebab, tag-approval notifications.

---

## Interview feedback — point-by-point status

| # | Feedback point | Status | Note |
|---|---|---|---|
| 1 | Monday as first day of week | ✅ Shipped | Date pickers app-wide |
| 2 | Walking: separate pickup & drop-off addresses | 🗺 Queued | Walking-flow improvements |
| 3 | Walking: half-day option | ✅ Shipped | Day-care durationOptions; Tereza seeded |
| 4 | Walking: solo-walk request | 💡 Open | Standing prefs shipped; per-booking version still open |
| 5 | Walking: dog preferences (likes fetch, triggers) | ✅ Shipped | Standing preferences on each dog |
| 6 | Puppy-only meets | ✅ Shipped | "Puppies" filter pill + seeded puppy meets |
| 6b | Puppy-only **groups** | 💡 Open | Different surface from puppy meets; small design call |
| 7 | Vaccines: structured record + acknowledgement | ✅ Shipped | Syringe-icon chips on the dog profile |
| 8 | Vaccines: gating meets on vax status | 💡 Open | Depends on verification path — see vets thread |
| 9 | Ratings (stars + text) | 🗺 Queued | Trust-signal work (thread 2) |
| 10 | "Has anyone in my circle booked them" + their review | 🗺 Queued | Trust-signal work (thread 2) |
| 11 | Training prominence (Roman) | ✅ Shipped | Filter pills, sub-types, three trainer carers, identity badges |
| 11b | Training framing in demo narrative | ✅ Doc | "Anxious New Owner" archetype anchors Daniel's arc |
| 12 | Forum / regulatory info (Roman, dog-tax example) | 💡 Future | Parked; surfaces post-demo if it earns it |
| 13 | Grooming services | ✅ Live | Lenka Nováková at Mánesova Grooming Salon |
| 14 | Vet/medical services | 💡 Research ready | Research doc lays out three tiers — for your call |

---

## Other open product decisions

- **Vets as a category.** Self-declared vaccines shipped. Research doc lays out three tiers if we want to go further (photo-confirmed records, or a full Vet entity parallel to Shelter). The biggest unlock is a real Prague vet conversation.
- **Vaccine gating.** Depends on the vets thread above.
- **Per-booking special requests.** Pet-level prefs shipped; the "solo walk today" overrides were deferred. Earlier?
- **Training as its own service category?** Currently surfaces across meets + appointments via a shared filter pill. Promotion is possible but worth waiting for trainer-validation signal (thread 2) first.
- **Forum / regulatory info.** The dog-tax example. Parked.
