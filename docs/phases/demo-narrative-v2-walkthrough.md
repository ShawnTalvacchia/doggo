---
status: active
last-reviewed: 2026-05-19
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Demo Narrative V2 — Walkthrough

Verification checklist for the **Demo Narrative V2** phase. **This document is for checking** — the design lives in `docs/strategy/Demo Narrative.md` (the V2 spine) and the phase board `demo-narrative-v2.md`; emergent decisions go in the **"Decisions surfaced"** log at the bottom.

**What V2 delivered.** The Guided Walkthrough was re-authored as a **narrated concept story** — a tighter **3-beat, 2-persona** arc (Daniel → Klára → Daniel) framed around the **walker-trainer hybrid**: the public walk is a sales funnel *and* a trainer's vocation. The world is pre-staged; the viewer taps through it, performing one or two hero actions per beat. New since V1: mid-beat interstitials (time-passage + explainer), a fire-off step type, and a private-group "Care from neighbours" surface.

**How to use:**
1. Run the dev server (`npm run dev`, port 3000).
2. Open `/demo` → **Start guided walkthrough** for Workstream A. Use `?as=<personaId>` / the persona picker for B–D.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Context — read before walking:**
- **All photos are in (W2.5 done).** The 5 V2 photos — `post-stromovka-walk.jpeg`, `magda-profile.jpeg`, `veronika-profile.jpeg`, `zofka-portrait.jpeg`, `kuba-portrait.jpeg` — are generated and wired; nothing should render broken. (The Holešovice Dog Block cover stays `evening-walk-group.jpeg` — a dedicated cover was optional and skipped.)
- **The walkthrough is fully walkable** — the meet (`meet-klara-stromovka`) and the drop-off booking (`booking-klara-toby`) now exist, so every nav step resolves.
- **Demo dates are relative** — the walk and the drop-off session are dated "today." Workstream A's **Start guided walkthrough** now auto-resets demo state, so it always runs on a clean seed. For the B–D `?as=` checks (which skip the launcher), reset manually first (`/demo` → Reset demo state) so stale persisted state doesn't mask seeded data.

**Key V2 decisions** (full record in the Decisions log at the bottom): 2-persona restructure; Daniel starts with *no* care relationship with Klára (the Beat 3 booking is a genuine first conversion); Beat 3 marks Familiar on the **People tab** (not a post-meet review); the fire-off is **card-handled** (Option 1); W5 added a real new surface — the **"Care from neighbours"** group section.

---

## Workstream A — The Guided Walkthrough, end to end

The phase thesis. Start at `/demo` → **Start guided walkthrough**.

- [ ] **A1. The launcher.** `/demo` reads "Three beats, two personas" (not "Four… four"). The beat preview lists 3 beats: Daniel · Klára · Daniel.
- [ ] **A2. Beat 1 handoff.** The first interstitial reads "You're now Daniel" with his archetype + a scene-setting context line. **Continue** lands on `/discover`, with the on-surface step card already present.
- [ ] **A3. Beat 1 — find the walk.** Card step 1 → **Discover → Meets**. Klára's **Stromovka morning walk** appears under "Meets from your circle" (it surfaces because Daniel is a member of her group). Open it.
- [ ] **A4. Beat 1 — join.** The walk reads as free + open, with Klára's nervous-dogs-welcome note in the description. Tap **Join**; the card advances.
- [ ] **A5. Beat 2 handoff.** Interstitial → "You're now Klára." **Continue** lands on `/schedule`.
- [ ] **A6. Beat 2 — start the drop-off.** Beat 2 opens on **My Schedule**. Find today's session with **Toby** and tap **Start session** — the schedule quick-start flips it in-progress and lands on the active panel + app-wide banner. (Step 2 is `awaitAction` — the card shows no Next.)
- [ ] **A7. Beat 2 — mid-beat explainer.** A full-screen interstitial "What happens on a Klára walk" appears (the on-surface card stands down while it shows); **Continue** returns to the card.
- [ ] **A8. Beat 2 — finish + the meet.** **Finish** the session and seal the visit report; then open the Stromovka walk meet and see the roster.
- [ ] **A9. Beat 2 — fire off the post.** The card's last step shows Klára's walk-post preview (caption + `post-stromovka-walk.jpeg`) with a **Share** button. Tapping Share advances to Beat 3.
- [ ] **A10. Beat 3 handoff + People tab.** Interstitial → back to Daniel; lands on the Stromovka walk. Open the **People** tab, find **Magda**, mark her **Familiar**.
- [ ] **A11. Beat 3 — Familiar explainer.** The "What 'Familiar' means" interstitial appears full-screen, then returns to the card.
- [ ] **A12. Beat 3 — the capstone.** Open **Klára's profile → Services**; **book her 1-on-1 training**. Then the "A couple of days later" **time-passage** interstitial fires.
- [ ] **A13. Beat 3 — Magda's reach-out.** `/notifications` shows Magda's **connection request** ("Magda wants to connect") + her **group invite**. Accept the request; open the invite.
- [ ] **A14. Beat 3 — the circle.** The "Private groups, and mutual care" explainer fires; open **Holešovice Dog Block**; on the **Members** tab, the **Care from neighbours** section lists **Veronika** — book her. (Detail in Workstream D.)
- [ ] **A15. Closing + pause/resume.** After Beat 3, the closing interstitial reads the V2 recap ("one free walk… a trainer, a neighbour, a community"; "Stay as Daniel"). Separately: the card's **✕** pauses to the "Walkthrough" pill; the pill's menu resumes.

---

## Workstream B — Walker-trainer framing & anchor content

Open View checks (`?as=` / persona picker) of the underlying content.

- [ ] **B1. Klára's profile** — `/profile/klara`. Bio reads as a **walker-trainer-community-builder**: hosts a free Saturday walk, runs training, owns Eda. Not trainer-only.
- [ ] **B2. Klára's group** — `/communities/group-klara-training`. Description leads with walks + training (the free Saturday walk as the on-ramp), not "training sessions" alone.
- [ ] **B3. The anchor meet** — `/meets/meet-klara-stromovka`. A **free** public walk (no required-booking CTA collapsing the free RSVP); config #2 — it advertises Klára's drop-off Care service as a supplementary callout.
- [ ] **B4. The drop-off booking** — `/bookings?as=klara`. `booking-klara-toby` (Filip/Toby) is present, ongoing, with today's session startable. Filip is *not* on the meet roster (book ≠ attend).
- [ ] **B5. The walk post** — Klára's feed. `post-klara-stromovka-walk` exists with the funnel-copy caption + `post-stromovka-walk.jpeg`.
- [ ] **B6. Eda** — Klára's profile. Reads as friendly / good with other dogs (the demo's "her dog comes along" framing).

---

## Workstream C — Daniel the newcomer & the removed cascade

- [ ] **C1. Daniel's profile** — `/profile/daniel`. Bio reads "new to Prague… getting Bára out"; neighbourhood is **Holešovice** (Prague 7), not Smíchov.
- [ ] **C2. No prior Klára relationship** — `/bookings?as=daniel`. There is **no** Daniel↔Klára booking (`booking-klara-daniel` was removed). Daniel ↔ Klára connection state is **None**.
- [ ] **C3. Group memberships** — Daniel is a member of **Klára's care group** (so her walk surfaces in his "circle") and **Holešovice Dog Block**.
- [ ] **C4. Bára's notes** — no stale "working with a trainer (Klára)" claim — pre-demo he hasn't engaged her.

---

## Workstream D — Private-group mutual-care surface (W5)

The new **"Care from neighbours"** section — `components/groups/GroupNeighbourCare.tsx`.

- [ ] **D1. The section renders** — `/communities/group-holesovice-block?as=daniel` → **Members** tab. A "Care from neighbours" section sits above the member list, listing **Veronika** with her offering ("Walks & Check-ins · from 200 Kč").
- [ ] **D2. Co-membership is the grant** — Daniel sees Veronika's offering **even though he is not Connected to her** (`publicProfile: false` — she's absent from `/discover/care`). Group co-membership alone surfaces it.
- [ ] **D3. Book flow** — tapping **Book** on Veronika's entry opens the Care inquiry modal (`InquiryFormModal`) — the same machinery as a marketplace Care booking.
- [ ] **D4. Members-only** — view the group as a guest / non-member: the "Care from neighbours" section does **not** render.
- [ ] **D5. Not on Care groups** — `/communities/group-klara-training` has **no** "Care from neighbours" section (Care groups foreground their providers via the hero instead).

---

## Decisions surfaced during walkthrough

A running log — append as the walkthrough is walked. The entries below are the **phase's landed decisions**, recorded so the close-time sweep can confirm each reached its home doc.

- **2-persona restructure.** V2 moved from a 3-beat/3-persona arc (Klára → Daniel → Magda) to **3 beats, 2 personas** (Daniel → Klára → Daniel); Magda is now a supporting character, not a POV. → `strategy/Demo Narrative.md` + phase board (landed)
- **Daniel starts with no care relationship with Klára.** `booking-klara-daniel` + its conversation + both connection records removed; Daniel ↔ Klára is None pre-demo, so the Beat 3 capstone is a genuine first conversion. → `strategy/Demo Narrative.md` (landed); **`features/demo-mode.md` highlight reels still cite the removed booking — fix at close.**
- **Beat 3 marks Familiar on the meet's People tab, not a post-meet review.** A single weekly meet can't be both upcoming (Beat 1 RSVP) and completed (a review); the People tab works for any meet the viewer RSVP'd to. → `strategy/Demo Narrative.md` Beat 3 (landed)
- **Fire-off = Option 1 (card-handled).** The walkthrough card renders the pre-written post + a Share button; the post is pre-seeded in `mockPosts.ts`. Self-contained — no dependency on the real `PostComposer`. → `features/demo-mode.md` (update the Guided Walkthrough spec at close)
- **W5.2 added a new surface — "Care from neighbours."** `GroupNeighbourCare` on a group's Members tab surfaces members' circle-scoped Care offerings; **group co-membership grants the visibility** (not 1:1 Connection); booking reuses `InquiryFormModal`. → `features/meets.md` or `strategy/Groups & Care Model.md` (document at close)
- **Trainer value-prop is product positioning.** A draft note was added to `Product Vision.md` ("Trainer-Led Walks & the Training Value Proposition") — to be expanded at the phase strategic review. → `strategy/Product Vision.md` (landed as draft)
- **Trainer-positioning validation gate.** Logged as the signal to escalate the project — pitch the positioning to local walker-trainers. → `strategy/Open Questions & Assumptions Log.md` §7 (landed)
- **Walker-trainer ops research.** Prague paid dog-walking is dominated by solo from-home neighbourhood walks; the group/destination walk is the *wedge*, not the default — the demo shows the aspiration, and the Cold-Start Playbook owns the seeding. Informed Klára's trainer-forward framing. → conversation record + `Product Vision` note (no separate doc)

### Post-build polish — walkthrough UI + copy (2026-05-19)

A second iteration pass on the built walkthrough. These all need `features/demo-mode.md`'s "Guided Walkthrough — UX design spec" rewritten at close — that section still describes the pre-polish pause/✕/menu model.

- **Walkthrough UI → dark "system chrome".** The on-surface card, the minimised pill, and the full-screen interstitial moved to a dark neutral treatment (`--neutral-850`) so the walkthrough reads unmistakably as a guide layer, distinct from the light platform UI. Contrast tuned to WCAG AA (`--brand-300` accent, `--neutral-400` muted text — both clear 4.5:1 on the dark surface). → `features/demo-mode.md` (rewrite the Guided Walkthrough spec at close)
- **Pause removed; the card is a minimise/restore toggle.** `paused` / `pause` / `resume` and the 3-choice pill menu were deleted from `WalkthroughContext`. One control minimises the card to a "Walkthrough · {step}/{n}" pill; tapping the pill restores it — a frictionless card-local toggle, no menu, and the walkthrough never stops running. The ✕ is gone; **Exit walkthrough** is now a quiet link under the new footer (Back / Next, separated by a hairline divider). → `features/demo-mode.md` (rewrite the card spec + drop the Pause/Resume section at close)
- **`awaitAction` step flag.** A navigation step that renders no card "Next" — it advances only when the tester performs the in-app action and the resulting navigation reaches `advanceOn`. Used on Beat 2's "Start the session" so the walkthrough can't land on the Finish step with an unstarted session. → `features/demo-mode.md` (step-advancement spec) + documented inline in `lib/walkthroughBeats.ts`
- **Exit + Start reset demo state.** The walkthrough is scripted, so it must run on the canonical mock seed: **Start guided walkthrough** auto-resets demo state before launching, and **Exit** wipes the state the walkthrough mutated then hard-navigates to `/demo`. "Explore freely" persona-pick also ends any active walkthrough. Shared helper extracted to `lib/demoReset.ts` (`clearDemoStorage` — clears `doggo*` local *and* session storage). → `features/demo-mode.md` → "Reset behavior" + Guided Walkthrough spec (at close)
- **Discover Filters button co-exists with the card.** The floating `.discover-floating-btn` right-aligns while the walkthrough is active (a `body:has(.wt-card / .wt-pill)` rule) so the bottom-left card/pill never overlaps it; it stays visible and usable throughout. → `features/demo-mode.md` (note at close)
- **Walkthrough copy direction — narrative, no jargon, no em dashes.** Re-authored: step `detail` lines pull back to the persona's goal (instruction = action + light context, detail = the character's stake); platform jargon removed ("trust ladder", "the meet → booking conversion", "content and lead-gen", "there's a deliverable"); em dashes dropped throughout (they read as AI-written). Beat 1's context took the "Option 3" rewrite. → `strategy/Demo Narrative.md` (Beat copy + interstitial examples re-synced — landed)
- **`/demo` launcher redesign.** De-jargoned the intro copy, collapsed the three-beat preview into a single card, tightened the container. → `features/demo-mode.md` → "`/demo` route" (update at close)
- **Beat 2 enters from My Schedule, not Bookings.** Starting today's session is a Schedule action — Schedule's function is acting on what's coming up; Bookings is for managing the care arrangements themselves. Routing the start through Schedule is IA-correct, reads as the natural "working morning begins" beat, and is tighter (the schedule quick-start drops straight into the active session). The drop-off booking still appears, at its best moment: after Finish, when the app lands on the booking detail holding the sealed visit report. → `strategy/Demo Narrative.md` Beat 2 (landed)
- **`/demo` folded into the landing page.** The standalone `/demo` route was deleted; the landing page (`/`) is now the demo's single front door — a slim, chrome-free launcher: the new logo, no navbar, "Start the walkthrough" (primary) + the persona picker (secondary). The prior 8-section marketing landing page was retired. `proxy.ts` now gates **everything** (the landing page included — nothing is public but the unlock page + its API + static assets). `exit()`, `AuthGateContext`, `AppNav`, and `ProfileNameDropdown` all repoint `/demo` → `/`. New brand logo at `public/logo.svg`. → `features/demo-mode.md` ("`/demo` route" section + Reset behavior) and `features/landing-page.md` (retire or rewrite at close)
