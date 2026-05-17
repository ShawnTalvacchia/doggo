---
category: strategy
status: draft
last-reviewed: 2026-05-17
tags: [demo, narrative, walkthrough, personas]
review-trigger: "before any change to the persona roster, the anchor meet, or the walkthrough beats"
---

# Demo Narrative

The threaded multi-persona narrative the demo follows. Authored during **Demo Narrative & Personas** phase (W1.5, 2026-05-14). The demo runs in two modes — **Open View** (free exploration via the existing persona picker) and **Guided Walkthrough** (auto-switching personas with full-screen interstitials). This doc specifies the **Guided Walkthrough**'s spine; Open View is just today's persona picker behavior.

The walkthrough infrastructure (interstitial component, mode toggle, auto-switch wiring) is W4 design work + a follow-on build phase. This doc specifies *what* the walkthrough walks through, not *how* it transitions.

**Refs:** [[strategy/Product Vision]] → "Three Ways In" + Brand Voice; [[strategy/User Archetypes]]; [[features/demo-mode]] (current persona-switching plumbing); [[phases/demo-narrative-and-personas]] (the phase board this artifact opens against).

---

## Anchor

**Klára's Saturday morning training meet at Stromovka** (`meet-care-1` — recurring weekly Calm Dog Group Session, paid 350 Kč, required-service per the Service ↔ Meet Linkage model). The meet anchors the narrative because:

- It's **Klára's own meet** — she hosts; she promotes through the same surfaces she sells through. Demonstrates the Cold-Start Playbook's "trainer-led walks where the host happens to be a trainer" thesis on a real surface.
- It's **the gravitational center** that pulls multiple personas into orbit: Daniel as a new attendee, Klára as the host, Magda (Hub Member) as a Holešovice neighbour who attends. POVs spin off it into their own time/place from there.
- It's **service-linked** — Daniel's RSVP IS a paid booking, walking the booking flow in the very first beat.

**Threading rule: anchor-as-starting-point (radial).** The meet is where the demo opens (Beat 1 + Beat 2 both orbit it on Saturday morning), but POVs may drift into their own time/place when their feature loop demands it. Beat 3 happens Saturday afternoon at Magda's flat; Beat 4 happens Monday morning at Lena's. The meet's gravity holds the narrative even when the camera leaves Stromovka.

---

## The four beats

Four POV segments, four personas (Daniel, Klára, Magda, Lena). Each beat names: **persona**, **time**, **surfaces walked**, **demo focus** (the feature loop on display), **tester actions** (what the tester does), **tester prompt** (what the walkthrough asks them to consider).

### Beat 1 — Daniel books into Klára's group session

**Persona:** Daniel Procházka (anxious new owner, Smíchov, locked profile, rescue Bára).
**Time:** Saturday morning, "today."
**Surfaces walked:** `/discover/meets` ("Meets from your circle" section) → meet-care-1 detail → People tab.
**Demo focus:** the **Discover Meets circle section** + the **Service ↔ Meet Linkage booking flow (required-link)** + the **trust-ladder Familiar → Connect gesture (Daniel → Magda)**.

**Framing — W2.4 decision: after-picture, not rewind.** Daniel is NOT a cold stranger. He's already Klára's client — a recurring 1-on-1 reactive-dog arrangement (`klaraTrainingDaniel`), and they're already mutual Connected. Beat 1 is a *trust-progression* beat: a nervous owner who has built enough confidence through private 1-on-1s now tries Klára's **group** session for the first time. The group setting is the new thing — and it's where the community layer starts growing on top of the care relationship (he meets Magda there). **The W2.4 task asked: rewind Daniel's data to a true in-journey zero-state, or keep him as-is and frame his current state as the "after" picture? Decision: after-picture (keep as-is).** Rewinding would cascade through `klaraTrainingDaniel` (referenced in notifications, conversations, the active-session highlight reel) + his connection roster + every other persona's roster that points at him — high blast radius for a framing choice the walkthrough copy can carry instead. The after-picture framing is also *richer*: a nervous owner stepping from 1-on-1s into a group setting is a more interesting trust beat than a blank-slate first contact, and it lets the community layer (meeting Magda) grow visibly on top of an existing care relationship — which is the whole community↔care thesis in one beat.

**Tester actions:**
1. From `/discover/meets`, find Klára's Calm Dog Group Session in the **"Meets from your circle"** elevated section (it surfaces there because Daniel is Connected to Klára). Tap into the detail.
2. Tap **Book session → 350 Kč** (the sole CTA — required-service collapses the free RSVP). Walk the session picker + booking confirmation. On commit, a Booking is created and Daniel joins the meet roster. *(No new trust transition here — Daniel + Klára are already Connected; the booking just adds him to the session.)*
3. Tap the People tab. Find **Magda Vondráková** in the unmarked / "other attendees" grouping — Daniel doesn't know her yet.
4. Tap "+ Familiar" on Magda's row (her open profile means the mark grants HER visibility into Daniel's locked profile — the asymmetric grant doing its job).
5. After Familiar lands, tap **Connect** on her row (now visible per matrix v3 — Connect appears for locked viewers after Familiar). Sends a Connect request — the genuinely new relationship this beat creates.

**Tester prompt:** *Did booking into the group session feel like a comfortable next step from 1-on-1s? Did the trust ladder (Familiar then Connect) feel like a natural sequence, or like extra friction?*

---

### Beat 2 — Klára runs her morning

**Persona:** Klára Horáčková (professional trainer, Holešovice, open profile, Border Collie Eda).
**Time:** Saturday morning, **earlier than Beat 1** (chronological backflip — Klára's morning starts before Daniel opens his app).
**Surfaces walked:** `/bookings` → Hana's reactive-dog session → `/bookings/<id>/active` → Finish → visit report.
**Demo focus:** the **active-session execution surface** — the in-session banner + photo updates + Finish-and-seal flow + visit report.

**Tester actions:**
1. From `/bookings`, find Klára's session with **Hana for Runa** (recurring 1-on-1 reactive-dog work, today's occurrence is `kh-6`).
2. Tap into the booking, then the Sessions tab, then **Start session**. The active banner lights up across the app.
3. Walk through the active surface: Send-photo (a quick mid-session shot of Runa working on threshold exercises), Add-note (one line about progress).
4. Tap **Finish session**. Pre-seal Undo affordance is briefly visible (don't tap it). Seal the visit report.
5. Optional preview: switch to Hana via `?as=hana` and view the sealed report from the owner side.

**Tester prompt:** *Did the active-session surface feel like a focused tool for the carer, or did it carry too much chrome? Would the in-session banner across the app feel intrusive or reassuring as an owner?*

**Note for the walkthrough:** Klára's group meet (the anchor — meet-care-1 at 10am) happens later this same Saturday morning. The demo does NOT walk her through running the group meet step-by-step; the focus is the booking-side active flow. The group meet is the anchor that connects this beat to Beat 1 (Daniel will attend it after booking). Walkthrough copy can bridge: *"After Hana's session, Klára heads back to Stromovka for the group meet — the one Daniel just booked."*

---

### Beat 3 — Magda connects, invites, and finds peer care

**Persona:** Magda Vondráková (NEW — Neighborhood Hub Member, Holešovice, **open profile**, Schnauzer mix Žofka).
**Time:** Saturday afternoon (after the meet).
**Surfaces walked:** `/notifications` → connection request → People tab on meet-care-1 → her private group "Holešovice Dog Block" → invite flow → `/profile/veronika` → Book → inquiry → proposal → contract.
**Demo focus:** the **community → trust → care funnel on the peer side** — different door from Klára's marketplace surface; same trust-builds-care principle. Plus the **Find Your People** door (private neighbour group).

**Tester actions:**
1. From `/notifications`, find Daniel's Connect request. Accept it. Mutual Connected lands. (Open profile + matrix v3 means Magda never had to mark Familiar herself — the Connect gesture is direct.)
2. Open the meet-care-1 People tab → find Daniel's row → confirm the relationship state shows Connected.
3. Open her private group **Holešovice Dog Block** (`group-holesovice-block`). Open the Members tab → tap **Invite** → invite Daniel. (Demo walks the invite gesture; Daniel doesn't need to accept for the beat to land.)
4. Switch surfaces: open `/profile/veronika` (Veronika Krásná — a fellow group member, Casual Carer with `publicProfile: false` and a 200 Kč peer rate).
5. On Veronika's Services tab, tap **Book a session** on her drop-in/walk-checkin offering. Fill the inquiry (tonight, ~6pm, Žofka). Send.
6. Switch to Veronika via `?as=veronika`. She receives the inquiry, opens ProposalForm — system auto-quote populates (200 Kč base, no modifiers triggered for a same-day evening visit). Send.
7. Back to Magda. She sees the proposal land in the conversation. Tap Sign → contract signed → booking active.

**Tester prompt:** *Did the peer-care arrangement feel as light as the relationship implied (a neighbour helping a neighbour) — or did the platform overlay feel heavy on top of an informal favour? Did the auto-priced quote land at a comfortable number, or did it feel like a transaction wedged into a friendship?*

**The thesis this beat carries:** *Good fences make good neighbours.* The platform makes the informal arrangement easy and not awkward — the rate is posted, the booking is tracked, nobody's keeping score, the relationship survives the transaction. This is the demo's most important emotional beat — if the tester walks away remembering *one* thing, this is what we want it to be.

---

### Beat 4 — Lena, the funnel-graduate coda

**Persona:** Lena Marešová (Marketplace Owner, Letná, locked profile, Vizsla mix Asha).
**Time:** Monday morning, two days after the anchor.
**Surfaces walked:** `/home` → DiscoveryBanner → scroll past → `/bookings` → recurring Pawel/Asha booking → confirm/glance.
**Demo focus:** the **post-funnel state** — what life looks like for a successful Doggo user who built community trust, found her carer, and now uses the app primarily for care management.

**Tester actions:**
1. Open `/home` cold (no notification badge needed). The DiscoveryBanner sits at index 1 of the feed: *"Your week is empty — meets in your circle."* Glance at it; scroll past. (The demo deliberately does NOT have her engage with it.)
2. Open `/bookings` → find the recurring **Pawel walks Asha** booking. Confirm the next session is on schedule.
3. Optional: glance at the Pawel chat thread for any operational note.

**Tester prompt:** *Did the DiscoveryBanner feel like a polite nudge or like the app insisting on community engagement she's moved past? Did the care surfaces feel complete on their own — i.e., does the platform stand up if a user never re-engages community after their carer is found?*

**The thesis this beat carries:** the community → trust → care funnel **worked**. Lena is what success looks like for most users. The demo ends here so the tester closes on "this is where most successful users will live" rather than on "and now go meet more people."

---

## What's NOT walked (and why)

- **Tereza POV.** The Vinohrady density her surfaces would demo doesn't earn its keep against the ~25–30 min runtime. Hub Member effectively replaces her as the embedded-community-anchor archetype on display, from a fresher angle. Tereza stays in the persona registry for Open View exploration.
- **Tomáš POV.** His utility-user emergency-care arc partially duplicates Lena's "uses the app for care management" framing, with weaker narrative payoff. Cut. Stays in registry.
- **New User POV.** Empty-state preview is a different demo job (onboarding); Open View handles it. Not in the Guided Walkthrough.
- **Recent-mover persona (W2.5 decision: skip).** W2.5 asked whether to add a "Day 0" persona — minimal seed, one dog, no connections, no groups, just landed in Prague — distinct from the truly-empty New User. Decision: **skip.** The four-beat narrative has no slot for it (the demo's entry point is Daniel, an established owner trying a new surface, not a fresh arrival), and New User already covers the empty-state preview job for Open View. A Recent-mover persona would only earn its keep if a future phase builds an onboarding-journey demo — revisit then. No persona seeded.
- **Daniel → Klára 1-on-1 inquiry as a separate beat.** Daniel already has a recurring 1-on-1 booking with Klára (`klaraTrainingDaniel`) so a "first inquiry" beat doesn't read clean. The walkthrough closes Daniel's arc with the Connect-request gesture in Beat 1; the recurring 1-on-1 surface remains visible in Open View if a tester wants to explore it.
- **Walkthrough copy.** This doc names the beats and tester prompts at the structural level. Final wording for interstitials is W4 + build-phase work; placeholder copy (in italics here) validates the structure only.

---

## Anchor-day staging summary

What seeded data the narrative requires (driven from this doc into W3.1 implementation):

| Item | State for the demo | Status |
|---|---|---|
| **Magda Vondráková** persona | Holešovice, open profile, Hub Member archetype, one dog (Žofka, Schnauzer mix) | SHIPPED |
| **Veronika Krásná** persona | Holešovice, open profile, Casual Carer (`publicProfile: false`, 200 Kč walks/checkins + 220 Kč house-sitting) | SHIPPED |
| **`group-holesovice-block`** | Private neighbour group, Magda admin, **6 seeded members** (Magda, Veronika, Eva, Martin, Filip, Hana). Archetype calls for ~12 — a future seeding pass can grow it; 6 is enough for the demo. | SHIPPED |
| **`meet-care-1` attendees** | Add Magda; remove Daniel — Daniel isn't pre-RSVP'd to *this* group session so Beat 1's booking action lands cleanly (he's still Klára's 1-on-1 client elsewhere). meet-care-1 stays required-link to `klara-group-training`. | SHIPPED |
| **`klaraTrainingHana` sessions** | `kh-6` dated `daysFromNow(0)` so Beat 2 has a startable session today; `kh-5` pushed to `daysFromNow(7)`. This `daysFromNow(0)` anchor matches the Service ↔ Meet Linkage convention for recurring care bookings. | SHIPPED |
| **Daniel ↔ Magda connection** | Pre-demo: none. Demo walks them through Familiar → Connect → mutual Connected. | none seeded (by design) |
| **Magda's connection roster** | Connected with Veronika + Eva; inbound-Familiar from Martin/Filip/Hana (Magda is Open so her outbound marks are no-ops — P68 hygiene). No Klára relationship pre-demo. | SHIPPED |
| **Veronika's connection roster** | Connected with Magda; inbound-Familiar from Martin (Open-viewer hygiene applied). | SHIPPED |

W3.2 (P69) shipped a **partial** inverse-roster sweep — the 6 anchor supporting personas (Marek, Eva, Hana, Jana, Pawel, Petra). The broader sweep across bridged providers + lighter cast stays open on the punch list. W3.4 (P59) shipped notification enrichment for the narrative personas (Klára, Magda, Lena); non-narrative personas stay open.

---

## Open Questions surfaced by drafting this doc

These belong in the walkthrough's Decisions log if they evolve mid-build, or in `Open Questions & Assumptions Log.md` if they don't resolve in this phase.

- **Connect-request acceptance surface.** Beat 3.1 has Magda accepting from `/notifications`. Today the inbox + notifications surfaces show connection requests, but the accept gesture's exact UI is uneven. Worth verifying mid-W3 that the accept flow is single-tap.
- ~~**Meet attendance ↔ booking record consistency.**~~ **Resolved — phase task W3.6 (2026-05-17).** The required-link meets (`meet-care-1` / `meet-care-workshop-1` / `meet-care-puppy-basics`) had pre-seeded roster attendees with no backing `Booking` — so their sessions never showed on `/bookings`. The Service ↔ Meet Linkage walkthrough surfaced this (C6) and handed it to this phase as W3.6. Four `meetBooking` bookings now seed the non-creator attendees (Magda + Tomáš on meet-care-1, Daniel on the workshop, Jana on puppy-basics). Klára as creator needs none. See `lib/mockBookings.ts` → `meetCare1Magda` + siblings.
- **Open Profile + Familiar from a locked viewer.** Beat 1.4 has Daniel mark Magda Familiar even though her profile is open. The mark is meaningful (it grants HER visibility into HIS locked profile — the asymmetric grant), but the People tab UI may render the Familiar pill as a "you marked them" affordance that reads slightly different when the target is open. Verify in walkthrough.
- **Veronika's appearance in `/discover/care`.** With `publicProfile: false`, Veronika should NOT appear in the broader marketplace — only Connected viewers see her services. Magda is Connected to her, so Magda finds her by browsing the group's members and tapping into her profile. Tester must take that route, not `/discover/care` (which would surface no result for Veronika by design).
- **Config #2 (drop-off Care on a community walk) is not showcased in the Guided Walkthrough.** The Service ↔ Meet Linkage phase shipped config #2 — a free community walk advertising a drop-off Care service (book a carer to walk your dog *without* joining the walk; book ≠ attend). The handover flags the **Marketplace Owner (Lena)** as the canonical config #2 persona: her recurring Pawel arrangement is conceptually exactly this (Pawel runs pack walks; Lena pays for the drop-off). But Lena's seeded booking (`booking-pawel-lena`, from CCFT) predates the config #2 model and is a plain Care booking — not linked to a Pawel pack-walk meet. **Open call for the team:** re-model Lena's Pawel arrangement as config #2 so Beat 4 passively (no extra tester prompt) shows the model accurately, OR leave config #2 to Open View exploration (Tereza's `meet-15` is the seeded config #2 example). Re-modelling is moderate seeding work (Pawel needs a Care service with an `id` + a linked pack-walk meet + `dropoffMeetId` on Lena's booking) with some cascade risk (her conversation + notifications). Recommendation: **leave it for now** — Beat 4's job is the funnel-graduate emotional note, not a feature-mechanics demo; forcing config #2 into the coda muddies it. Revisit if a demo reviewer specifically wants config #2 in the guided path.
