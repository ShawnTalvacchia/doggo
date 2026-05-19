---
category: strategy
status: draft
last-reviewed: 2026-05-19
tags: [demo, narrative, walkthrough, personas]
review-trigger: "before any change to the persona roster, the anchor meet, or the walkthrough beats"
---

# Demo Narrative

The spine of Doggo's **Guided Walkthrough** — the narrated concept story the demo walks a viewer through. **V2, re-authored 2026-05-18** (Demo Narrative V2 phase, W1.1) around the walker-trainer hybrid framing. Supersedes the V1 four-beat outline.

The walkthrough infrastructure already exists (`lib/walkthroughBeats.ts`, `WalkthroughContext`, the full-screen interstitial + the on-surface step card — see [[features/demo-mode]] → "Guided Walkthrough"). V2 re-authors *what it walks through* and extends — does not rebuild — that infrastructure.

**Refs:** [[meetings/po-briefing-2026-05-15]] (walker-trainer framing, meet→booking conversion); [[strategy/Product Vision]] → "Trainer-Led Walks & the Training Value Proposition"; [[strategy/Cold-Start Playbook]] (trainer-led walks as the cold-start engine); [[strategy/User Archetypes]]; [[strategy/Groups & Care Model]] (config #2 — drop-off Care on a free meet; circle-audience Carer); [[features/demo-mode]].

---

## What V2 changes, and why

V1's walkthrough was an **interactive tour** — the tester performed every action, so every step was a surface that had to fully work (which is why the V1 build kept hitting feature stubs). V2 is a **narrated concept story**: the world is pre-staged, the viewer taps through it at a quick pace, performing only one or two *hero* actions per beat and "firing off" pre-written content with a single tap. Low cognitive load by design — the demo's job is to tell the story well and test whether the *concept* is sticky, not to usability-test the UX.

**Who it's for.** V2's first audience is **walker-trainers** — the cold-start engine (see [[Product Vision]] → "Trainer-Led Walks"). The walkthrough is a concept-test + recruitment instrument: a trainer watching should see both the business case (the walk is a client funnel) and the vocation (real, visible work — turning anxious dogs into dogs that belong). It also serves a PO / first-time viewer; the trainer is the sharper target.

The demo still runs in two modes; V2 stops trying to make one mode do both jobs:

| Mode | What it is | V2 status |
|---|---|---|
| **Guided Walkthrough** | The narrated concept story this doc specifies. Two auto-switching personas, interstitials, a pre-staged world. | Re-authored here. |
| **Open View** | The free persona picker (`/demo`, `?as=`). Hands-on, unscripted — the usability-testing mode. | Unchanged. |

---

## The walker-trainer framing

V2 anchors on **Klára**, a **walker-trainer-community-builder** — the most common shape of paid dog professional in Prague (80–90% of the market; see [[po-briefing-2026-05-15]]). For this pro, a public walk isn't a sideline — it's the business: demonstration, lead-gen, content, and retention all at once.

But the framing is not only commercial. A trainer's real value to owners is **teaching** — dogs sit home alone most of the day, and getting them out, social, and well-mannered lifts both the dog's quality of life and the owner's ability to communicate with them. Dogs need social, leash, and listening skills. The pattern Doggo argues against is **avoidance** — a reactive dog that simply never gets near another dog, until one day it gets too close and there's a clash. *Resolve it, don't avoid it.* A trainer helps an anxious dog build the skills to enjoy other dogs' company — and **once ready, the dog belongs to the community.** Training is the on-ramp to belonging. Full positioning: [[Product Vision]] → "Trainer-Led Walks & the Training Value Proposition."

Klára's funnel has three tiers, all already in Doggo's model:

1. **Free public walk** (a free meet, config #2) — top of funnel. Anyone comes; it's social and fun; Klára coaches as the group walks.
2. **Paid group training session** (`meet-care-1`, required-link) — the middle tier. "Take it up a level," still social.
3. **Paid 1-on-1 training** — for anxious or challenging dogs and individual attention.

**The demo shows tiers 1 and 3** — the free walk (Beats 1 & 2) and a conversion to a 1-on-1 (Beat 3's capstone). Tier 2 exists in Klára's world as texture; it isn't walked.

Klára's meet description does double duty as funnel copy — it welcomes friendly dogs, sets the light-coaching expectation, and gently routes anxious dogs toward a private session (*"Got a reactive or anxious dog? Come say hi, and let's talk about a private session"*). A helpful boundary, not a pitch — consistent with the Cold-Start Playbook's framing principle (*a community walk where the host happens to be a trainer*). There is **no "meet rules" product surface** — the rules live as description copy.

---

## The anchor event

**Klára's free weekly morning walk at Stromovka.** A free public meet (config #2 — see [[Groups & Care Model]]). The whole demo orbits it: Beat 1 leads into it (Daniel joins), Beat 2 *is* it (Klára runs it), Beat 3 follows from it (Daniel's aftermath).

It anchors the narrative because:
- It's **Klára's own meet** — she hosts it, coaches on it, and is paid through it (via the drop-off, below). The Cold-Start Playbook thesis on a real surface.
- It's the **gravitational center** — it pulls Klára (host), Daniel (newcomer attendee), and Magda (a Holešovice neighbour Daniel meets there) into orbit.
- It's **config #2** — the walk is free, but Klára earns by **picking up a client's dog** as a drop-off Care booking (*book ≠ attend*). She walks her own dog Eda plus the one drop-off; finishing that care session seals a visit report — the care loop, closed.

---

## The three beats

Two personas. **Daniel's journey is the spine**; the demo cuts once to Klára's POV — Beat 2 — to show the same walk from the trainer's side. Each beat names: **persona**, **time**, **interstitials**, **surfaces**, **demo focus**, **hero actions** (what the viewer makes happen), and **steps**. The walkthrough is now built: **`lib/walkthroughBeats.ts` is the source of truth for the final step + interstitial copy.** The step lists below describe each beat's structure and intent, kept in step with the build.

### Beat 1 — Daniel: time to get Bára out

**Persona:** Daniel Procházka — new to Prague, locked profile, anxious reactive rescue Bára. Already a member of Klára's care group.
**Time:** earlier in the week.
**In:** persona-handoff interstitial → Daniel.
**Surfaces:** `/discover/meets` → the Stromovka walk detail.
**Demo focus:** the newcomer deciding to take the step — and the free public walk as a low-friction, anxious-dog-friendly front door.

**Hero action:** RSVP to the walk.

**Steps:** *(final copy in `lib/walkthroughBeats.ts`)*
1. *(nav)* Discover has three doors. Into **Meets**, to find a walk where Bára can meet other dogs gently.
2. *(nav)* Klára's free **Stromovka morning walk** sits near the top, under "Meets from your circle"; it surfaces there because Daniel already joined her group. Open it.
3. *(look)* Read the walk: free, open to everyone, Klára's note welcomes nervous dogs. This is the gentle first outing Daniel was hoping to find for Bára.
4. *(tap-through · hero)* Tap **Join** to RSVP. A free, low-pressure first step; Bára is going on her first group walk.

### Beat 2 — Klára: the walk is the work

**Persona:** Klára Horáčková — walker-trainer-community-builder, Holešovice, open profile, owns Eda (friendly Border Collie).
**Time:** morning.
**In:** persona-handoff interstitial → Klára.
**Mid-beat interstitial:** explainer ("what happens on a Klára walk").
**Surfaces:** `/schedule` → `/bookings/<id>/active` → the Stromovka walk meet. (Beat 2 enters from My Schedule — its quick-start is the natural place to begin a session that's coming up; the drop-off booking appears later, after Finish, holding the sealed report. The walk post fires off from the card itself, not a composer surface — see fire-off mechanic below.)
**Demo focus:** the public-meet-as-funnel — config #2 (the free walk + the paid drop-off), the trainer's coaching work, the care-session loop, and the walk post as content + lead-gen.

**Hero actions:** run the drop-off care session (Start → Finish → seal report); fire off the walk post.

**Steps:** *(final copy in `lib/walkthroughBeats.ts`)*
1. *(nav)* Open Klára's **My Schedule** — her day at a glance. Today: the Stromovka walk she hosts, and a booked walk for Filip's dog Toby, who she picks up on the way. (Schedule is the natural opening for a working morning: you check what's on. It's also the IA-correct surface for *starting* what's coming up — Bookings is for managing the arrangements themselves.)
2. *(awaitAction · hero)* On today's session with Toby, tap **Start session**. The schedule's quick-start flips the session in-progress and drops Klára onto the active surface. *(An `awaitAction` step: the card shows no Next; the quick-start is what advances it.)* The walk is free for everyone; Klára earns through the dogs she brings, today Toby plus her own dog Eda.

→ *explainer interstitial — "What happens on a Klára walk."* Part exercise, part training. As the group moves, Klára coaches, and a nervous dog gets a calm, controlled first taste of company. It's how a dog that used to avoid the park slowly becomes one that belongs in the group.

3. *(action)* The walk's done. Back on the active session, **Finish** it and seal the **visit report**. Filip gets the report afterwards, photos and all; it's how he knows the walk happened.
4. *(nav)* Open the **Stromovka morning walk** to see who came along: regulars and new faces, Daniel and Bára among them.
5. *(fire-off · hero)* **Share** Klára's walk post, caption and photo already written. This is how the walk grows: tomorrow an owner with a nervous dog scrolls past it and thinks, maybe that's what we need.

### Beat 3 — Daniel: review, convert, belong

**Persona:** Daniel (the demo returns to him).
**Time:** the walk is over — later that day, then a couple of days on.
**In:** persona-handoff interstitial → Daniel (its context carries the time cue — the walk's done).
**Mid-beat interstitials:** explainer ("what Familiar means") · time-passage ("a couple of days later") · explainer ("private groups, and mutual care").
**Surfaces:** the Stromovka walk's People tab → Klára's profile → Services → booking flow → `/notifications` → Magda's request + message → `/communities/group-holesovice-block` → Veronika's offering → booking flow.
**Demo focus:** the funnel running end to end — the trust ladder (stranger → Familiar → Connected), the meet → booking conversion, and the private neighbour circle with its mutual care. Two kinds of help, both growing from one walk: a pro to teach, a neighbour to lean on.

**Hero actions:** mark Magda **Familiar**; **book Klára's training**; **book Veronika**.

**Steps:** *(final copy in `lib/walkthroughBeats.ts`)*
1. *(nav)* Open the Stromovka walk's **People** tab. Everyone who came along this morning, grouped by who Daniel already knows; most are new faces.
2. *(HERO)* On the People tab, Daniel marks **Magda** Familiar, a neighbour from his own street he got talking to on the walk.

*Why the People tab, not a post-meet review: a single weekly meet can't be simultaneously upcoming (Beat 1's RSVP) and completed (a review). The People tab works for a meet the viewer has RSVP'd to regardless of timing — Daniel's Beat 1 RSVP is what lets him act here. The time-passage is narrated; the data stays honest. (W4.3 reconciliation.)*

→ *explainer interstitial — "What 'Familiar' means."* Daniel's profile is private; marking Magda Familiar quietly lets her see it, and nothing more. Not a friend request, no notification to Magda, no commitment. The first quiet step from stranger toward neighbour.

3. *(nav)* Daniel keeps thinking about how calmly Klára handled the nervous dogs. He opens **Klára's profile → Services**.
4. *(HERO — capstone)* A group walk is a great start, but Bára needs focused, one-on-one help to really get there. Daniel **books Klára's 1-on-1 training**. The free walk is what led him here; now he's investing in the confident dog Bára could become.

→ *time-passage interstitial — "A couple of days later."*

5. *(nav)* Open Daniel's **Notifications**. Magda has reached out, with a connection request and a message.
6. *(tap-through)* **Accept** Magda's connection request. They each marked the other Familiar at the walk; accepting makes it mutual, and the two of them are connected now.
7. *(nav)* Open Magda's **invite** to her private neighbourhood group, **Holešovice Dog Block**.

→ *explainer interstitial — "Private groups, and mutual care."* A private group is a closed circle of neighbours. Invite-only, and not a marketplace of strangers; inside it, people look out for each other and each other's dogs, and some offer care to the circle at neighbourly rates.

8. *(nav)* Open **Holešovice Dog Block** and look around: the feed, the members. A tight crew of Holešovice neighbours, and Daniel is one of them now.
9. *(HERO)* On the Members tab, the **Care from neighbours** section lists members who offer care to the circle. **Veronika** shows there at a neighbourly rate, and Daniel **books her** for Bára. Booking her works just like booking Klára, but Veronika is a neighbour, inside a circle he trusts. A pro to teach, a neighbour to lean on.

---

## The closing screen

After Beat 3, a closing interstitial — not a beat. It:

- **Recaps the weekend** — one free walk at Stromovka, and from it: Daniel found a trainer to help anxious Bára, a neighbour circle to lean on, and a community his dog can belong to. For Klára, that same walk was her work — demonstration, a new client, content for tomorrow's browsers.
- **Names the balance** — community and marketplace aren't two products. The same walk, the same people, serve both: a walker-trainer is also a dog owner; an owner getting care also shows up to walks.
- **Absorbs Lena** — *some* people come only for the care: book a weekly walker and never touch the community — and that's a success too. The funnel runs both ways. One line; Lena is not a beat. (She stays in Open View and the persona registry as the Marketplace Owner archetype.)
- **Hands off** — to Open View ("pick another persona") or stay on Daniel.

---

## The three interstitial modes

V2's interstitial is a **three-mode device** — V1 had only the persona handoff. All three share the full-screen treatment and the no-accidental-dismiss rule ([[features/demo-mode]] → interstitial spec); they differ only in what fills the body. Built as a step `kind: "interstitial"` in `lib/walkthroughBeats.ts`; the examples below are the shipped copy.

**Shared frame:** eyebrow (small, muted) · body region · primary CTA · optional secondary.

**Mode 1 — Persona handoff.** Before each beat (×3). The deliberate POV switch.
- *Eyebrow:* "Beat {n} of 3 · {time}"
- *Body:* persona avatar (64px) + "You're now {first name}." + "{full name} · {archetype}" + a 1–2 sentence situational context (time + motivation).
- *CTAs:* "Continue as {first name} →" · "Exit walkthrough"
- *Example — Beat 2:* "You're now Klára." / "Klára Horáčková · Professional Provider"; *"Klára runs a free walk at Stromovka every week. It's how the neighbourhood's dogs get out, and it's how she meets her training clients. First, though, she's got a dog to pick up."*

**Mode 2 — Time-passage.** Mid-beat, to move the clock. No persona swap. Doubles as the honest cover for pre-seeded state.
- *Eyebrow:* a time cue — "A couple of days later"
- *Body:* a short heading naming the jump + one sentence on what is now true.
- *CTA:* "Continue →" (no secondary — it's a quiet beat-internal transition)
- *Example — Beat 3:* eyebrow "A couple of days later"; "Daniel's settled in." / *"The training with Klára is underway, and Magda has been in touch."*

**Mode 3 — Explainer.** Mid-beat, to unpack one concept plainly and in-flow. No persona swap. Explains either a Doggo *feature* (Familiar, private groups) or a piece of the *world the demo is selling* (what a trainer actually does on a walk).
- *Eyebrow:* "How this works"
- *Body:* a heading naming the concept + 2–3 plain-language sentences, no jargon. May carry a small supporting icon.
- *CTA:* "Got it →"
- *Example — Beat 3, after the Familiar mark:* "What 'Familiar' means." / *"Daniel's profile is private. Marking Magda Familiar quietly lets her see it, and nothing more. It isn't a friend request. Magda is never notified, and it commits Daniel to nothing. It's the first quiet step from stranger toward neighbour."*

**Placement:** persona handoff ×3 (beat starts — Daniel, Klára, Daniel) · explainer ×3 (Beat 2 "what happens on a Klára walk"; Beat 3 "what Familiar means"; Beat 3 "private groups, and mutual care") · time-passage ×1 (Beat 3, before the notifications). Beats 2 and 3 carry mid-beat interstitials — W3.2 builds that support.

---

## Pre-loaded content — the fire-off mechanic

V2's defining shift: the world is **pre-staged**, and the viewer taps through it rather than authoring it. This is what makes V2 robust where V1's interactive tour kept hitting half-built composers. W3.3 builds the fire-off step type; this section specs intent.

**Five step kinds.** Every step the on-surface card walks is one of:

| Kind | What the viewer does | Advances |
|---|---|---|
| **nav** | Goes to a surface — taps an in-app control, or the card's Next routes there | auto, on arrival (`advanceOn`) |
| **hero action** | Performs the meaningful, beat-defining action (mark Familiar, book) | manual Next |
| **tap-through** | One tap on a pre-staged surface (Join a meet, Accept a request) | manual Next |
| **fire-off** | Commits pre-written content with one tap (Share a post) | manual Next |
| **interstitial** | A mid-beat interstitial — time-passage or explainer | its own Continue |

A nav step can also carry **`awaitAction`** — then the card shows no Next button, and the step advances *only* when the tester performs the in-app action and the resulting navigation reaches `advanceOn`. Used for Beat 2's "Start the session", so the walkthrough can't reach the Finish step with the session unstarted.

**The fire-off step, precisely.** The content already exists in the mock world as a pre-seeded post (`mockPosts.ts`). The walkthrough card itself surfaces it — the pre-written caption and photo shown on the card as a post preview, with a **Share** button — and the viewer taps Share. The viewer never types. Card-handled (Option 1, decided 2026-05-18): self-contained, with no dependency on the real `PostComposer`. The point is the *expressive* satisfaction of posting, without the friction (and fragility) of authoring.

**The viewer's role per beat:** one or two **hero actions** plus a few single-tap progressions (nav / tap-through / fire-off). Everything else — other people's RSVPs, the inbound message and connection request, the drop-off booking — is staged, and simply *there*.

**V2's fire-off moment:**
- **Beat 2 step 5 — Klára's walk post.** The canonical fire-off: the card shows the caption and `post-stromovka-walk.jpeg` as a post preview; the viewer taps **Share**. The walk-as-content-and-lead-gen payoff, in one tap.
- *Candidate (decide in W3/W4, not load-bearing):* Beat 3's post-meet review text could carry pre-filled copy as a light secondary fire-off.

**Time-passage interstitials are the honest cover.** "A couple of days pass" is what makes a pre-seeded connection request waiting in Daniel's notifications read as natural rather than as a magic trick.

---

## Payoffs → beats (W1.2 verified 2026-05-18 — see phase board)

The payoffs the demo must land, each with a concrete step home:

| # | Payoff | Lands in |
|---|--------|----------|
| 1 | A walk is a community, not just exercise | Beat 1 (Daniel joins); Beat 2 (the walk, the roster, the explainer) |
| 2 | For a pro, the walk *is* the business — meet → booking | Beat 2 step 5 (the post as lead-gen); Beat 3 step 5 (Daniel converts) |
| 3 | The funnel: stranger → Familiar → Connected | Beat 3 (steps 3, 7 — Daniel↔Magda; step 5 — Daniel→Klára None→client) |
| 4 | Familiar is a real, distinct, silent thing | Beat 3 step 3 + the explainer interstitial |
| 5 | Private groups + mutual care | Beat 3 steps 8–10 + the explainer interstitial |
| 6 | The loop closes — the sealed visit report | Beat 2 step 3 |
| 7 | Training is the on-ramp to belonging | Beat 2 (the "what happens on a Klára walk" explainer) + Beat 3 step 5 (the capstone framing) |

**Surface flag for W5:** payoff #5 needs a member's circle-scoped care offering to be **visible inside the group** (Beat 3 step 10). Whether the group surface needs a small "care offered here" affordance or existing surfaces suffice is W5.2's call.

---

## Anchor-day staging — target mock state (drives W4)

What the V2 narrative needs seeded.

| Item | V2 target state | Owner |
|---|---|---|
| Klára's **free Stromovka walk** | A free public meet (config #2), id **`meet-klara-stromovka`** — hosted by Klára, associated with her care group (`group-klara-training`) so members see it. *Not* `meet-care-1` — that paid required-link "Calm Dog Group Session" stays as Klára's middle tier. | W4 |
| Klára's **drop-off booking** | A config #2 drop-off Care booking, id **`booking-klara-toby`** — **Filip books Klára so Toby rides along on the walk** (Filip: existing Klára client, Holešovice neighbour; Toby: high-energy Jack Russell, group-ready). `Booking.dropoffMeetId` → `meet-klara-stromovka`. Care booking → Start/Finish/visit report. | W4.4 |
| Klára owns **Eda** | Border Collie, already seeded — audit that she reads as friendly / good with other dogs. | W2.1 |
| Daniel ↔ Klára | Member of Klára's group; **no care relationship; `booking-klara-daniel` removed; connection state None pre-demo.** The Beat 3 capstone *creates* his first booking with her. | W2.2, W4 |
| "Meets from your circle" surfacing | The Discover Meets elevated section must surface Klára's free walk for Daniel via **group co-membership** — V1 relied on Connected; V2 Daniel is None to Klára. | W3 / W4 |
| Daniel's RSVP to the Stromovka walk | **Not pre-staged** — Daniel RSVPs live in Beat 1 (taps **Join**); the RSVP persists to Beat 3, where it lets him act on the walk's People tab. Pre-staging would make Beat 1's RSVP toggle *off*. | — |
| Magda's RSVP to the Stromovka walk | Pre-staged — Magda attends, so Daniel meets her there (the post-meet review is where he marks her Familiar). | W4 |
| Daniel ↔ Magda | None pre-demo; the walkthrough walks Familiar (post-meet review) → Connected (accept). | W4.2 |
| Magda's connection request + message to Daniel | Pre-seeded; the message carries the Holešovice Dog Block invite. | W4.2 |
| Holešovice Dog Block | Private group, Magda admin, Veronika a member; Daniel joins it in Beat 3. Already seeded. | — |
| Veronika's circle-scoped Carer offering | `publicProfile: false`; must be legible *inside* the group so Daniel can book it as a new member. | W5.2 |
| Daniel's bookings (Klára, Veronika) | Created *by* the walkthrough (Beat 3 steps 5, 10) — not pre-seeded. | W4.4 |
| Klára's walk post | Pre-written caption + `post-stromovka-walk.jpeg`, staged for Beat 2's fire-off **Share** step. | W4.1, W2.5 |

---

## What's cut or changed from V1

- **Four beats → three beats, two personas.** Daniel's journey is the spine; the demo cuts once to Klára's POV (Beat 2). Tighter, faster, and legible — and it works better for a trainer audience (the Klára beat is "this is you"; the Daniel beats are "here's how a client finds and converts to you").
- **Magda is no longer a POV persona.** She's a supporting character — the neighbour Daniel marks Familiar, and who sends the connection request + private-group invite. The private group is still shown, from Daniel's POV. Her Neighborhood Hub Member archetype stays available in Open View. (This reframes W2.4 — Magda only needs supporting-character sharpening — and W5 — the mutual-care concept is now seen through Daniel.)
- **Lena's beat → the closing screen.** Her "graduated to care, never engages community" end-state is a closing-screen line, not a beat. She stays in Open View and the registry.
- **Klára's V1 standalone session-execution beat → folded into Beat 2's config #2 drop-off.** The active-session surface still appears, reframed onto the funnel mechanic rather than shown as session mechanics for their own sake.
- **The chronological backflip is gone.** V2 is linear: Daniel joins → the walk happens (Klára's POV) → Daniel reviews.
- **Tereza / Tomáš / New User POVs** — not in the guided walkthrough; Open View covers them. Tereza stays the Open View default.
