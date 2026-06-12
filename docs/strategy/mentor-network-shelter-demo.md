---
category: strategy
status: active
last-reviewed: 2026-06-12
review-trigger: "Before every shelter-coordinator or PO interview; after any interview that confirms or refutes a Playbook assumption"
---

> Graduated from the Cross-Shelter Mentor Network phase board to `strategy/` at phase close (2026-06-12) — an outward-facing artifact with ongoing use (the live-driven shelter-interview script), not an archived walkthrough. Source material for the future guided `shelter-mentor` walkthrough (FC17).

# The Mentor Network — Shelter-Facing Demo

> **What this is.** A narrated demo script for the mentor-vouching mechanism, with its assumptions on its sleeve: every beat that depends on an unvalidated assumption carries an **ASSUMPTION (A#)** callout referencing [[strategy/Cold-Start Playbook]] → "Assumptions to validate," and everything faked is labeled.
>
> **Role (re-pointed 2026-06-11): source material for the guided "Help a shelter dog" walkthrough (FC17).** The demo IS the interview — there's no separate live-presentation step before it. These beats convert into guided steps, the ASSUMPTION callouts become in-demo checkpoints posed to the coordinator viewer, and the crosswalk table becomes the checkpoint inventory. Until that conversion lands, the script still works driven live (a presenter clicking through with the demo toggles) — but that's a fallback mode, not the plan.
>
> **The one-sentence pitch.** *Your intake rules exist because you can't verify strangers. We built the verification layer — your most trusted walker does the assessment, gets paid by the trainee, and you get a bigger, better walker pool without lifting a finger. You keep every veto.*

**Setup (2 min, before they arrive):** dev server on port 3000 → open `/` in a fresh/private browser window (clean demo state). The script switches personas with the `?as=` URL param. Cast: **Klára** (trainer, Útulek's long-time walker, the mentor), **Tomáš** (works 9–6 in Karlín, never volunteered — the walker today's intake filters out).

**Honesty rules for the room:** the shelter operator's own screens don't exist yet — wherever the shelter would act, the demo uses a visible "(demo)" toggle and SAYS so. Payments are display-only. Waiver text is placeholder. This demo is the conversation about what the real thing should be, not a finished product.

---

## Beat 1 — A shelter you already recognize *(Útulek's world on Doggo)*

`/shelters/utulek-liben?as=tomas`

Show the shelter page: the dogs in care, "5 need walks now," the walker roster, the feed carried by walkers' walk photos — the shelter doesn't have to run a social account.

Open the **Members tab**: walkers carry earned tiers (Volunteer → Super Volunteer), sorted by recent activity, no leaderboards. Point at **Klára H. — Super Volunteer, 64 walks.**

**Narrate:** *"Klára walked here for three years before this app existed. When Útulek joined, the shelter credited her history — 60 of those 64 walks. The roster just shows the total — nobody audits a walker row — but under the hood the platform keeps credited and logged walks separate, so the audit trail is always there if a question ever comes up."*

> **ASSUMPTION (A7):** shelters will do the crediting work for their known walkers. The demo shows the result; the act itself is a one-tap "(demo)" toggle standing in for a real operator surface. **Probe:** would you spend 30 minutes crediting your 5 best walkers if it unlocked the rest of this?

---

## Beat 2 — The mentor offering *(Klára's third service line)*

`/profile/klara?as=tomas` → **Services tab**

Walk down her catalogue: paid walks, group training, 1-on-1 behaviour work — and the new one: **"Mentored shelter walk · 450 Kč/session"** with Útulek and Pes v nouzi chips.

**Narrate:** *"Klára can offer this BECAUSE she's a Super Volunteer — the platform gates mentoring on earned, verifiable history. She sets her own price. The trainee pays her; the shelter pays nothing, ever. And she's not the only one — Pavel, the long-time walker you saw on the roster, mentors here too at 350. Mentors don't have to be professional trainers; they have to have earned it."*

> **ASSUMPTION (A5):** trainers want this as a service line at this price point. 450 Kč sits between a guided intro and her 1:1 training rate — and Pavel's 350 shows the senior-volunteer fallback if trainers pass. **Probe (for trainers):** would you run these? At what price?
>
> **ASSUMPTION (A4):** the fee filters for commitment without pricing out serious walkers. **Probe (for coordinators):** who would this fee exclude that you'd want?

---

## Beat 3 — The walker your intake filters out *(Tomáš finds Bára… or Tonda)*

`/discover/help-a-dog?as=tomas` → tap **Tonda** (or any Útulek dog)

**Narrate:** *"Tomáš works 9 to 6 in Karlín. Your current ask — weekday daytime, three-month minimum — was never about what walking dogs requires; it's what coordination by email can afford. So people like him never apply. He just found Tonda and wants to help."*

On the dog page, point at the line under the Walk button: **"New to shelter walking? Book a mentored first walk — 3 sessions and you walk solo here."** Note what it does NOT say: no featured mentor. Tap it → **the mentor list**: every Super Volunteer mentoring at Útulek, each with their own price and availability. *"Your page never advertises a favorite — walkers pick their mentor; the shelter stays neutral."*

> **ASSUMPTION (A8):** intake friction — not demand — is the binding constraint. There are more Tomášes than your current pipeline shows. **Probe:** is your current walker count limited by applicants, or by what you can afford to vet?

---

## Beat 4 — Booking + the waiver moment *(sign once, carry everywhere)*

Pick **Klára** from the mentor list → the booking sheet, locked to Útulek (the shelter was chosen by where Tomáš tapped — no shelter switcher here).

Walk the room through it slowly — this screen carries the requirements model:
1. **Doggo baseline waiver** — identity, emergency contact, general liability. Signed ONCE, valid at every participating shelter.
2. **Útulek's own waiver** — YOUR liability terms, YOUR dog-handling rules. Signed per shelter. The platform never collapses your legal layer into its own.
3. The graduation rule: *"after 3 sessions, Klára's vouch makes you a solo walker there"* — and the 3 is **your number** (Pes v nouzi set theirs to 5).

Pick a date, book. Show the price line: *"You pay Klára — the shelter pays nothing."*

> **ASSUMPTION (A2):** a shared platform baseline is legally acceptable with a per-shelter layer on top. Refuted = the model gracefully degrades to per-shelter-only. **Probe:** would your lawyer accept a platform baseline + your own waiver, or must everything be yours?
>
> **ASSUMPTION (A6):** 3–5 sessions is a sane default. **Probe:** how many supervised walks before YOU'D trust someone solo?

---

## Beat 5 — "Klára onboards a new walker for Útulek in three minutes" *(graduation)*

Back on `/shelters/utulek-liben?as=tomas`: the button now reads **"In mentorship · 0/3"**.

Open the dropdown and tap **"Complete mentor session (demo)"** three times — *say out loud that this toggle stands in for real completed sessions over real weeks.* Watch the counter tick 1/3 → 2/3 → then flip to **"Vouched walker."**

Open the **Inbox**: Klára's message — *"That's 3 sessions — I've vouched for you at Útulek. You can book solo walks with their dogs now."* Open **Members**: Tomáš is on the roster.

**Narrate:** *"Nobody at the shelter did anything. No intake interview, no orientation shift, no email thread. Your most trusted walker did the assessment — supervised, documented, paid for by the trainee — and your walker pool just grew by one vetted person with a weekend schedule."*

Then open the **Members tab** and show the per-walker controls (the dots menu on each walker row): *"And tiers are never the app's call alone. Walk counts only SUGGEST promotions — you promote or demote anyone, any time, right here, and the roster simply shows your call. Demote a mentor below trusted and their mentoring rights vanish everywhere — your judgment overrides the math, all the way up."*

> **ASSUMPTION (A1) — the load-bearing one:** you'd accept Klára's vouch + the platform's session count as a substitute for your own assessment. **Probe:** what would have to be true about the mentor, the sessions, or the record for this to be a yes? If the answer is "we'd still do our own walk-through," the mentor session becomes a credibility booster instead — see Beat 8.

---

## Beat 6 — The walk itself runs on YOUR rules

`/dogs/shelter-dog-tonda?as=tomas` → **Walk Tonda** → pick a date → booked.

Show `/bookings`: *"Útulek Liběň · Tonda · Volunteer · no charge."* Open it: the shelter is the named party, the walk has a session with check-in → finish → a visit report that documents how the dog did.

Then go back and tap into **Šimon** (experienced-handlers-only): the Walk button is disabled — *"Šimon needs an experienced walker."*

**Narrate:** *"Vouched doesn't mean keys to the kennel. Your policy says solo walks only — so the app only books solo walks. THIS dog needs an experienced handler — so a new walker can't book him, mentor or no mentor. Per-dog rules, per-shelter rules, and tier compose; the strictest always wins. And every completed walk leaves a documented record on the dog."*

---

## Beat 7 — The credential travels *(what's in it for walkers — and for you)*

`/profile/tomas` → **Volunteer work** section, then `/shelters/pes-v-nouzi?as=tomas` → **Walk a dog**.

**Narrate:** *"Tomáš's record is portable. When he turns up at Pes v nouzi, they see his history arrive with the application — and their own waiver and their own orientation still apply. Recognition shortens trust-building; it never skips your process. For walkers, volunteering finally builds something they keep."* Show Klára's profile for the mature version: **Super Volunteer · recognized at every participating shelter.**

> **ASSUMPTION (A3):** portable credentials are acceptable to shelters ("the dogs are different here" is the counter). **Probe:** if a Super Volunteer from another shelter applied tomorrow, what would you still require?

---

## Beat 8 — The shelter that says no *(and loses nothing)*

`/shelters/druha-sance?as=tomas` → **Walk a dog** → application sheet.

**Narrate:** *"Druhá šance turned mentor-vouching OFF. No mentor card shows here; nobody graduates into their roster automatically. When Tomáš applies the normal way, his mentor work arrives as a line on the application — 'Mentor-recommended · 3 sessions with Klára Horáčková' — and their coordinator decides, exactly as today. Saying no to the mechanism doesn't opt you out of the network; it just means everything routes through you."*

> **ASSUMPTION (A10):** shelter hesitancy is about trust, not control. If it's control, THIS posture — Doggo as a tool you configure, not a layer you delegate to — is the product. **Probe:** which of the two shelters you just saw is closer to how you'd want to run?

---

## What's honestly faked (say it before they ask)

| Surface | Demo state | Real version |
|---|---|---|
| Shelter operator screens | "(demo)" state-toggle dropdowns (advance state, accept vouch, credit walks, promote/demote tiers) | Operator dashboard + application queue + walker pool management — V3+, designed WITH shelters from these interviews |
| Session completion | One tap stands in for weeks of real sessions | Real session check-ins by mentor + mentee |
| Payments | Display-only price; no money moves | Platform-mediated payment with a marketplace cut |
| Waiver text | Checkbox + placeholder language | Real legal text, per-shelter authoring |
| Notifications | Graduation message in chat only | Proper notification triggers |

---

## Interview crosswalk — beat → assumption → what refutes it

Prep: scan this table, pick the 2–3 highest-impact probes for THIS interviewee. After the interview, edit the Playbook's "Assumptions to validate" entries IN PLACE.

| Beat | Assumption | One-line probe | Refuted if... | Fallback already built |
|---|---|---|---|---|
| 5 | **A1** vouch substitutes for intake | "What would make Klára's vouch enough?" | "We always do our own walk-through" | Beat 8's posture — mentor work as credibility, shelter gates |
| 4 | **A2** platform baseline waiver | "Would your lawyer accept baseline + your layer?" | "Everything must be our paper" | Per-shelter-only waivers; sign-once UX drops |
| 7 | **A3** portable credentials | "Super Volunteer from elsewhere — what do you still require?" | "Earning starts from zero here" | Per-shelter recognition override |
| 2 | **A4** fee filters, doesn't exclude | "Who would 450 Kč keep out?" | Target walkers priced out | Sliding scale / shelter-funded first session |
| 2 | **A5** trainers want the line | "Would you run these at this price?" (trainers) | Trainers decline / price out of reach | Senior-volunteer (non-trainer) mentors |
| 4 | **A6** 3–5 session minimum | "How many supervised walks before solo?" | "5 is way too few" / "1 + sign-off is plenty" | Per-shelter override (already a policy field) |
| 1 | **A7** shelters will credit history | "30 minutes to credit your 5 best walkers?" | "No time, ever" | Doggo-side concierge data entry |
| 3 | **A8** friction is the constraint | "Limited by applicants, or by vetting capacity?" | "Demand is the constraint" | Scope down to better tooling for existing walkers |
| 5+7 | **A9** volunteering → adoption funnel | "How many of your adopters were walkers first?" | Conversion is rare (<5%/yr) | Drop the adoption framing; keep community framing |
| 8 | **A10** it's trust, not control | "Which of the two shelters is closer to you?" | Coordinators frame it as "our way of doing things" | Beat 8 IS the product: a tool they configure |

---

*Phase artifact of [[phases/cross-shelter-mentor-network]] (scope discipline 1). At phase close this doc graduates to `docs/strategy/` with a pointer from the Cold-Start Playbook.*
