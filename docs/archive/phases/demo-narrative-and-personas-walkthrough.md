---
status: archived
last-reviewed: 2026-05-18
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Demo Narrative & Personas — Walkthrough

Verification checklist for the Demo Narrative & Personas phase. **This document is primarily for checking** — most decisions, follow-ups, and findings belong in the phase board, the produced narrative outline doc, the User Archetypes doc, the demo-mode doc, or the Open Questions log. The exception is the **"Decisions surfaced during walkthrough"** section at the bottom, which exists specifically to catch emergent decisions in the moment and ensure they propagate to home docs at phase close.

**Scope rule.** This phase produced docs + persona/data changes more than feature surface changes, so the walkthrough leans on doc + data verification (read the produced doc; visit the surface that demos the new persona) over interaction sweeps. Tickable persona-on-URL items where applicable; doc-review items for W1 (narrative) and W4 (UX spec).

**Pre-walkthrough reset.** Before walking, hit `/demo` → "Reset demo state" so any cached connection overrides from prior sessions don't mask the seeded edges.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. For W1 + W4 doc-review items, open the produced doc alongside this walkthrough.
4. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues. Checkboxes apply to verification items only — the Decisions section at the bottom is a plain log.

**Available personas (post-W3.1):** Tereza, Daniel, Klára, Tomáš, Lena, **Magda** (new — Hub Member), New User. Veronika is in the cast but not a viewer persona.

---

## Workstream W1 — Anchor event + thread structure

Verification of the narrative outline doc shipped at [docs/strategy/Demo Narrative.md](../strategy/Demo Narrative.md). Open the doc alongside this checklist.

- [ ] **W1.1. Doc exists at the chosen home.** [docs/strategy/Demo Narrative.md](../strategy/Demo Narrative.md) — frontmatter has `category: strategy`, `status: draft`, `last-reviewed: 2026-05-17`. Lives in `strategy/` per the phase decision (positioning artifact alongside Product Vision, not folded into demo-mode.md).
- [ ] **W1.2. Anchor names a real seeded meet.** Doc names **Klára's Saturday training meet at Stromovka (`meet-care-1`)** as the anchor. Service ↔ Meet linked + paid **required-link** (booking IS the RSVP). No hypothetical "we'll seed this later" anchor.
- [ ] **W1.3. Four POV beats, distinct feature focus.** Beats: (1) Daniel books into Klára's group session, (2) Klára runs an active session with Hana, (3) Magda connects + invites + finds peer care, (4) Lena funnel-graduate coda. Four beats, four personas. Each beat states: persona, time, surfaces walked, demo focus, tester actions, tester prompt.
- [ ] **W1.4. Threading rule stated.** Doc explicitly picks **anchor-as-starting-point (radial)** with one-sentence rationale (loose enough to cover Lena's Monday and Magda's evening; tight enough that the anchor still pulls the demo together).
- [ ] **W1.5. "What's NOT walked" section justifies cuts.** Tereza, Tomáš, Daniel→Klára inquiry tail, New User POV, walkthrough copy authoring all explicitly excluded with one-line rationale per item.
- [ ] **W1.6. W2.4 framing decision recorded.** Beat 1's framing paragraph records the W2.4 decision: **after-picture, not rewind** — Daniel keeps his existing `klaraTrainingDaniel` 1-on-1 + Connected-to-Klára state; Beat 1 is a trust-progression beat (1-on-1 → group session), not a cold first contact. Rationale (cascade cost of rewinding vs. the richer trust beat) is stated.
- [ ] **W1.7. Anchor-day staging table matches what shipped.** Staging table rows carry `SHIPPED` status + accurate detail (6 group members not ~12; rosters hygienized; required-link noted; `kh-6`/`kh-5` dates). P69/P59 partial-scope footnote present.

---

## Workstream W2 — Persona roster v2

- [ ] **W2.1. Magda persona renders cleanly.** `/profile?as=magda` — name "Magda Vondráková," **Public** profile chip (open), Holešovice neighbourhood, Žofka the Schnauzer mix as the only pet, Member since September 2025, About-me bio about the WhatsApp-thread-turned-group origin story.
- [ ] **W2.2. Žofka renders with realistic detail.** Same page → My dogs section. Žofka shows: 11 kg · 6 years, Moderate energy, Sniff explorer + Fetch lover play styles, body-copy notes ("Easy with kids and other dogs..."), socialisation note ("Friendly with everyone, prefers calm dogs..."), Health & vet (Veterina Holešovice, vaccinations + spayed, body-copy condition note about arthritis).
- [ ] **W2.3. Veronika persona renders cleanly.** `/profile/veronika?as=magda` — name "Veronika Krásná," Public chip, Holešovice, Kuba the Cocker Spaniel (12 years, low energy), Member since October 2025, About-me bio about translator + casual carer framing.
- [ ] **W2.4. Veronika's Carer services render under circle audience.** Same page → Services tab → two cards: **Walks & check-ins** (200 Kč per visit, drop-in + solo walk subservices) and **House sitting** (220 Kč per visit, drop-in subservice). No "publicly listed" framing — copy reads as block-only.
- [ ] **W2.5. Veronika does NOT appear in `/discover/care`.** `/discover/care?as=daniel` (or any persona NOT Connected to Veronika) — Veronika's card does NOT surface. `publicProfile: false` correctly hides her from the broader marketplace.
- [ ] **W2.6. Persona picker shows 7 entries with Magda in correct slot.** `/demo` (or profile-name dropdown) — list reads: Tereza, Daniel, Klára, Tomáš, Lena, **Magda (Neighborhood Hub Member · "Holešovice. Anchors a tight private block.")**, New User. Magda's entry uses lucie-profile.jpeg avatar.
- [ ] **W2.7. Hub Member archetype block lives in User Archetypes.md.** [docs/strategy/User Archetypes.md](../strategy/User Archetypes.md) → between Social Seeker and Casual Carer. Block has the canonical structure (Who they are / Primary goals / Primary fears / Trust threshold / What success feels like / Product behaviour / Why we test against this archetype).
- [ ] **W2.8. demo-mode.md persona table + highlight reel match reality.** [docs/features/demo-mode.md](../features/demo-mode.md) → "Persona registry" table has 7 rows; "Highlight reels" has a Magda section (Holešovice Dog Block / Profile / Klára's training meet / Veronika's profile).
- [ ] **W2.9. Klára trainer audit (phase board W2.6).** `/profile?as=klara` → Services tab → her catalog reads as a trainer-promoter, NOT a generic carer. Post Service ↔ Meet Linkage close, her catalog demos all **three service kinds**: Care, **Meet-type** (Group training session → meet-care-1, Reactive dog session, Puppy basics — each required-link to a real seeded meet), and **Appointment-type** (1-on-1 training session, `klara-1on1`, reclassified Meet→Appointment by the linkage phase). Also check `/communities/group-klara-training?as=klara` — group description + Carer Identity badge communicate trainer-as-promoter. No new data expected; if a gap surfaces, log it in the Decisions section.

---

## Workstream W3 — Mock-world data adjustments

### Holešovice Dog Block group + meet seeding

- [ ] **W3.1. Holešovice Dog Block renders cleanly.** `/communities/group-holesovice-block?as=magda` — name "Holešovice Dog Block," **Private** chip, full description (the "WhatsApp thread" origin story), Holešovice location, **6 members · 7 dogs** (Eva has 2 dogs Luna+Max → 5×1 + 1×2 = 7). **Admin** + **Invite** + **Post** buttons visible. Helper line "Members-only — content stays in the group."
- [ ] **W3.2. Members tab shows the right roster.** Same page → Members tab → Magda (admin) + Veronika + Eva + Martin + Filip + Hana, in joined-at order.
- [ ] **W3.3. meet-care-1 attendees match the demo flow.** `/meets/meet-care-1?as=daniel` (cold, no prior RSVP) → People tab → 3 attendees rendered: **Klára CONNECTED** (because Daniel is connected to her), **Magda OTHER ATTENDEES** (Daniel doesn't know her yet), **Tomáš PRIVATE PROFILES** (locked profile chip list at bottom). Daniel correctly absent from the roster — Beat 1 will walk him through the booking-as-RSVP action.
- [ ] **W3.4. Same view from Magda shows Daniel's row absent + Tomáš in private chip list.** `/meets/meet-care-1?as=magda` → People tab → 3 attendees: Klára CONNECTED, Tomáš PRIVATE PROFILES. Daniel doesn't appear pre-Beat-1; once Daniel books in the demo, his row appears for Magda's Beat 3 review.
- [ ] **W3.5. Meet date is Sunday this week.** Same page → top row date reads "Sun 17 May" (or the next Sunday from current `daysFromNow(3)`). Recurring weekly cadence shows three upcoming Sundays in the date pills above the People list.

### Klára's session + active-banner setup

- [ ] **W3.6. kh-6 today's session is upcoming.** `/bookings?as=klara` → find the Hana booking (booking-klara-hana) → tap into Sessions tab → **kh-6 dated today** is the next upcoming session, with a **Start** action visible. (Walkthrough verification stops at "Start visible"; tapping Start writes to localStorage and shouldn't be left in that state — the demo Beat 2 walks the full Start → photo → Finish → seal flow.)
- [ ] **W3.7. kh-5 stays as a future session.** Same page → kh-5 visible at `daysFromNow(7)` after kh-6 in the upcoming list, so the recurring weekly cadence reads correctly.

### Connection rosters (W3.1 narrative + W3.2 P69 partial)

- [ ] **W3.8. Magda's roster reads as Hub Member.** `/profile?as=magda` → scroll to Connections section → **Connected: 2 people (Veronika + Eva)**, **Familiar: 0 people** (the open-viewer hygiene fix moved Martin/Filip/Hana to inbound-only state:"none" + theyMarkedFamiliar:true), **View all (5)** count includes them under a different rendering. *Note: if the View all modal shows 5 (2 Connected + 3 inbound-Familiar), the narrative still holds — the roster has 5 entries, just 0 outbound Familiar marks.*
- [ ] **W3.9. Veronika's roster reads as Casual Carer.** `/profile/veronika?as=veronika` → Connections section → **Connected: 1 (Magda)**, plus Eva + Martin under inbound-only state. Smaller-than-Magda roster, fits archetype.
- [ ] **W3.10. Mutual connections section renders for Magda × Daniel pre-demo.** `/profile/magda?as=daniel` → About tab → **Mutual connections section absent** (no shared Connections in the seed graph; Daniel and Magda's worlds don't overlap pre-demo). This is the *correct* pre-demo state — Beat 3 walks them through Familiar → Connect, after which the section would populate.
- [ ] **W3.11. Mutual connections section renders for Klára × Eva (P69 inverse working).** `/profile/eva?as=klara` → About tab → **Mutual connections section** lists at least one shared person (Hana or Martin). Demonstrates the P69 inverse-roster work — Eva now has her own roster pointing at Klára with the right mutual-connection metadata.
- [ ] **W3.12. Mutual connections section renders for Tomáš × Petra (P69 inverse working).** `/profile/petra?as=tomas` → About tab → Mutual connections lists Ondřej and/or Adéla. Petra's new roster carries the inverse of Tomáš's existing entry.

### Notifications enrichment (W3.4 P59 partial)

- [ ] **W3.13. Klára's bell shows seeded notifications.** `/notifications?as=klara` (or tap Bell icon) → at least three entries: **"Today's session: Hana + Runa"** (meet_reminder, today), **"Filip wants to book a follow-up"** (booking_proposal), **"New RSVP — Sunday training session"** (Magda + Žofka, meet_rsvp).
- [ ] **W3.14. Magda's bell shows seeded notifications.** `/notifications?as=magda` → **"Eva posted in Holešovice Dog Block"** (group_activity, today) + **"Tomorrow: Calm Dog Group Session"** (meet_reminder).
- [ ] **W3.15. Lena's bell shows the funnel-graduate cadence.** `/notifications?as=lena` → **"Pawel: 'Asha was a star today'"** (booking_message) + **"Wednesday walk with Pawel — 9:00am"** (meet_reminder). Quiet, low-volume — fits archetype.

### Realism standards (W3.5)

- [ ] **W3.16. Realism standards section landed.** [docs/implementation/mock-data-plan.md](../implementation/mock-data-plan.md) → new section between "Date strategy" and "Target State: The Cast." Subsections: People + dog naming, Neighbourhoods (with district mapping table), Profile visibility distribution, Connection density per persona (with target table), Pricing realism (with Czech-crown bands), Bridged provider contract, Date strategy reference, Veterinary records on dogs, Service taxonomy.

### Required-link meet bookings (phase task W3.6 — Service ↔ Meet Linkage handoff)

- [ ] **W3.17. Pre-seeded required-link attendees have backing bookings.** Each non-creator attendee of a required-link meet now has a `meetBooking` booking, so their session shows on `/bookings`:
  - `/bookings?as=magda` → a **Group training session** with Klára (350 Kč, meet-care-1) appears.
  - `/bookings?as=tomas` → the same Group training session appears (alongside his existing care history).
  - `/bookings?as=daniel` → a **Reactive dog session** with Klára (600 Kč, meet-care-workshop-1) appears.
  - `/bookings?as=klara` → My Services side shows all four as sessions she's providing (Magda, Tomáš, Daniel, Jana).
  - Each row routes to its `/meets/{meetId}` detail (Meet bookings have no separate detail page).

---

## Workstream W4 — Walkthrough UX design spec (DESIGN ONLY)

Doc-review verification. Open [docs/features/demo-mode.md](../features/demo-mode.md) → "Guided Walkthrough — UX design spec" section.

- [ ] **W4.1. Spec lives in demo-mode.md as a new section.** Section header "Guided Walkthrough — UX design spec" exists between "How 'new user' empty state works" and "What 'the C-sweep' migrated." Status note up top says "design only, build deferred."
- [ ] **W4.2. Two-mode framing is unambiguous.** Spec opens with the two-mode table (Open View vs Guided Walkthrough). Open View is explicitly called out as today's behavior + zero new infrastructure.
- [ ] **W4.3. Interstitial spec is implementable.** Layout (top-to-bottom: eyebrow → avatar → heading → context → tester prompt → primary CTA → secondary "Pause"), dismissal mechanic (primary dismisses-and-loads-next; pause keeps persona, drops to Open View; no tap-anywhere; no Esc), copy structure with examples — all spelled out. A reader could implement the component without making layout/dismissal calls of their own.
- [ ] **W4.4. Mode toggle entry + active chrome + end-state spelled out.** Entry via `/demo` with a new "Start guided walkthrough" entry; **active-walkthrough chrome is the on-surface step card's collapsed state** (slim pill — step counter + expand + ✕; no separate header bar); end-of-walkthrough fires a closing interstitial with "Pick another persona" + "Stay as {current}".
- [ ] **W4.5. Pause/Resume mechanic spelled out.** Pause (the card's ✕ collapsed, or the expanded-card footer) keeps current persona, switches to Open View, collapses the card to a "Resume walkthrough" pill. Resume re-expands the card on the paused beat. Exit (expanded-card footer) ends the walkthrough → `/demo`. State persists in `sessionStorage`; tab-close ends cleanly.
- [ ] **W4.6. Persona-switch transition has an answer.** Spec picks "interstitial dismissal covers the swap" — fade dismissal (200ms) while the new persona's surface mounts WITH the on-surface card already present (expanded). Interstitial entry has subtle avatar scale-in + sequenced text fade. Engineering reality (no real load) acknowledged.
- [ ] **W4.7. Open build-time questions logged.** Spec ends with an explicit "Open build-time questions" subsection: beat surface routing registry, on-surface-card Pause-vs-Exit affordance, card↔AppNav mobile overlap, atomic-vs-stepped beats, state persistence between beats (a vs b), mid-beat exit handling, mobile-vs-desktop layout. Build phase has clean handoff.
- [ ] **W4.8. Build-phase scope is queue-able from this spec.** A reader can write 3+ build-phase tasks directly from this spec — e.g. "Build interstitial component," "Adapt `TourOverlay` into the on-surface step card," "Wire mode toggle + beat sequencer in `/demo`," "Implement persona-switch transition." No further design decisions needed before tasks become tractable.

### W4 revision — on-surface step card (added 2026-05-17)

- [ ] **W4.9. Two-guidance-surfaces framing is explicit.** The spec has a "Two guidance surfaces, two jobs" subsection: the **interstitial** = persona handoff (once per beat); the **on-surface step card** = persistent live task reference (whole beat). The spec states *why* they're separate and notes the earlier draft had only the interstitial — a gap this revision closes.
- [ ] **W4.10. On-surface step card spec is implementable + reuses `TourOverlay`.** The "On-surface step card" subsection spells out: placement (desktop bottom-left floating card ~440px / mobile bottom accordion, `env(safe-area-inset)`), expanded content (header + task "Do:" steps + optional "what to notice" + Prev/Next/Pause/Exit footer), collapsed pill (step counter + expand + ✕), auto-expand on new beat, collapse-state-local-to-beat. The spec explicitly says the build phase **reuses `components/landing/TourOverlay.tsx`** (collapse/expand + placement already solved) rather than rebuilding.

---

## Workstream W5 — `/demo` entry rebuild (emergent)

Not in the original W1–W4 scope — added 2026-05-17 after a PO-briefing review surfaced that `/demo` was stale and bloated and there was no clean demo front door. The rebuild de-bloats `/demo` and surfaces the four-beat narrative as a **manually-followed** path (the auto-switching Guided Walkthrough stays the deferred follow-on build — W5 is NOT that). Live-verify on the running app.

- [ ] **W5.1. `/demo` renders the rebuilt structure.** `/demo` cold → header reads **"DOGGO · PROTOTYPE" / "Demo"** + a two-line subtitle. Then a **"Guided story"** section (Compass icon) with a helper line, then **four numbered beat cards**, then an **"Or explore freely"** section with persona pills, then the footer. **No "Guided journeys" scenario cards, no "Walk me through it" tour button** — the stale single-persona Tereza tour entry is gone.
- [ ] **W5.2. Beat cards carry the right content.** Each of the 4 cards: a brand-tinted **number badge** (1–4), persona avatar, a time-of-day eyebrow (e.g. "SATURDAY MORNING"), persona full name, archetype, a context paragraph, a **"Do:"** action line (left brand border), and a **"Start beat N as {Name}"** button. Beats read: 1 Daniel · 2 Klára · 3 Magda · 4 Lena.
- [ ] **W5.3. Beat buttons set persona + route correctly.** Tap each: **Beat 1** → Daniel + `/discover/meets`; **Beat 2** → Klára + `/bookings`; **Beat 3** → Magda + `/notifications`; **Beat 4** → Lena + `/home`. The persona swap persists (check the profile-name dropdown shows the new persona after landing).
- [ ] **W5.4. "Or explore freely" picker works.** Seven pills (Tereza, Daniel, Klára, Tomáš, Lena, Magda, New User). Tapping a pill sets the persona + routes to `/home`. The active persona's pill shows "Active" instead of the arrow.
- [ ] **W5.5. Footer actions work.** "Reset demo state" wipes `doggo*` localStorage + the in-memory cache + hard-reloads. "Back to landing" → `/`.

---

## Decisions surfaced during walkthrough

A running **log** (not a checklist) of decisions, design changes, or rationale that surfaced during walkthrough discussion. **Append as you walk** — don't wait until the end. Each entry carries a `→ target-doc.md` annotation indicating where the decision needs to land. The phase-close sweep processes each entry by propagating it to the named home doc; the entries themselves stay here as the historical record.

Format:
```
- **{Decision in one line.}** {Optional one-line context.} → `target-doc.md`
- **{Implementation-only change}** {What/why.} → no doc update needed
```

### Pre-walkthrough notes (recorded during W3 build)

- **Magda's outbound Familiar entries hygienized to state:"none" + theyMarkedFamiliar:true (P68 pattern).** Initially seeded with state:"familiar" on Martin/Filip/Hana, but Magda's Open profile makes outbound Familiar marks no-ops (per the P68 hygiene comment in Tereza's roster). Re-shaped to mirror Tereza's pattern. Same fix applied to Veronika's roster. → no doc update needed (consistent with existing convention)
- **Daniel→Klára inquiry tail explicitly cut from the demo flow.** Daniel already has a recurring 1-on-1 with Klára (`klaraTrainingDaniel`), so a "first inquiry" beat doesn't read clean. Closes Daniel's arc with the Connect-request gesture in Beat 1 instead. The recurring 1-on-1 surface remains visible in Open View for testers who want to explore it. → captured in [Demo Narrative.md](../strategy/Demo Narrative.md) "What's NOT walked"
- **Daniel removed from meet-care-1 pre-seeded attendees so Beat 1's booking-as-RSVP flow lands cleanly.** Was previously a static attendee; demo can't walk through booking when he's already RSVP'd. Magda added in his slot so the People tab has a Hub Member to mark Familiar. → captured in mockMeets.ts inline comment + the narrative doc's staging table
- **Klára's `kh-6` session seeded at `daysFromNow(0)` to give Beat 2 a startable today's-session.** Existing klaraTrainingHana booking lacked an actively-startable session for the active-banner demo; kh-6 fills that gap without disturbing the existing recurring sessions. → captured in mockBookings.ts inline comment + the narrative doc's staging table
- **P69 closed for 6 anchor supporting personas (Marek, Eva, Hana, Jana, Pawel, Petra) only — full P69 sweep remains open.** The bridged providers (olgaM, janaK, tomasB, etc.) and the lighter supporting cast (Lucie, Jakub, Zuzana, Ondřej, Adéla, Vítek, Anežka, Marie, Filip, Martin, Nikola) still need rosters. Most-impactful coverage shipped; remainder belongs in a future sweep. → punch list P69 stays open with scope-narrowed description; phase board W3.2 marked "partial" not "complete" at close

### Walkthrough-time decisions (append as you walk)

- **W4 spec revised — on-surface step card added alongside the interstitial (2026-05-17).** The first W4 draft designed only the between-beats full-screen interstitial: the step task was shown once at the handoff, then dismissed, forcing the tester to memorize a multi-step task. The user flagged that the retired Demo Presentation phase's `TourOverlay` (desktop floating card / mobile collapsible accordion) was a genuinely good *persistent, on-surface* guide and asked whether it was being abandoned. Decision: keep **both** — the interstitial for the persona handoff, plus a persistent collapsible **on-surface step card** (revived `TourOverlay` pattern) carrying the step task while the tester works. They do different jobs (scene-setting vs. live reference). The earlier "slim header bar" idea is dropped — the collapsed card is the persistent chrome. → captured in `features/demo-mode.md` ("Two guidance surfaces" + "On-surface step card" sections); phase board gained task W4.5
- **`/demo` rebuilt — emergent W5 workstream (2026-05-17).** A PO-briefing review surfaced that `/demo` was stale (advertised the superseded single-persona Tereza `TourOverlay`) and bloated (duplicate persona surfacing across a "Guided journeys" section + a pills row), with no clean demo front door. Rebuilt: stale Guided-journeys section removed; the four-beat narrative ([[Demo Narrative]]) now renders as a **manually-followed** path of numbered beat cards (tap → set persona + route to the beat surface); the 7-persona free-explore picker kept as the second section. This is the **manual stand-in** for the auto-switching Guided Walkthrough — that build stays the deferred follow-on phase; W5 added no walkthrough infrastructure. → captured in `features/demo-mode.md` ("`/demo` route" section rewritten)
- **PO-briefing strategy threads (walker-trainer hybrid, shelter aggregation, balanced community+marketplace) are NOT acted on in this phase.** Reviewed during the 2026-05-17 session. Direction is sound but a V2-demo realignment should follow the briefing's own §4 validation (walker-trainer + shelter conversations) — redesigning the demo around an unvalidated angle is backwards. The current four-beat narrative already embodies the balanced community+marketplace framing. Walker-trainer hybrid would land as a W2-style persona-data pass (e.g. reframing Klára/Pawel as explicit hybrids) in a future V2 phase. → no doc update needed this phase; flagged for the post-validation V2 conversation

<!-- Add entries here as you tick items above. Edit existing entries in place when later items refine an earlier decision (per the Drift Rules at the bottom of the template) — don't append a stale-and-fresh pair. -->

<!--
Conventions:
- Each verification item starts with a bold workstream + item label so the reader knows what to look at without reading the rest.
- DO NOT add "Findings & follow-ups" sections to individual workstreams — those belong in the phase board, Open Questions log, or a relevant feature doc. Workstreams are verification-only. The Decisions section above is the ONE place where emergent stuff is captured inline.

Drift rules — the two failure modes this template is fighting:

1. **Code/data change → update the walkthrough item in the same edit.** When you adjust persona seeding or rewrite a narrative section the active walkthrough already describes, edit the verification item to match the new behaviour as part of the same change.

2. **Decisions are current-state, not an event log.** If a decision logged here gets superseded by a better one as the work evolves, **edit the existing entry** to describe the final landing — don't append a new entry alongside the stale one.
-->
