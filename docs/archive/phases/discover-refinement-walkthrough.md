---
status: archived
last-reviewed: 2026-05-10
review-trigger: "Update as items are walked, edit as scope adjusts"
archived: 2026-05-10
---

# Discover Refinement — Walkthrough

Verification checklist for the Discover Refinement phase. **This document is primarily for checking** — most decisions, follow-ups, and findings belong in the phase board, Open Questions log, or feature docs. The exception is the **"Decisions surfaced during walkthrough"** section at the bottom.

**Scope rule.** Walkthroughs verify the **phase thesis** — the structural change the phase delivered. Phase thesis here: *Discover Care is community-first; Helper/Provider tier collapses into a single Carer role; every provider is a real bridged user; per-service data drives the surface; avatars obey Rule B app-wide.* Edge-case permutations (every persona × every filter combo) are not the goal — pick a representative persona per item.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Available personas:** Tereza (Vinohrady connector — has Klára as Familiar), Daniel (anxious new owner, locked profile, Nikola R. as Familiar), Klára (trainer with Care group), Tomáš (Karlín professional), New User. Lenka N. (groomer at Mánesova Grooming Salon) is in mock-world data but is NOT a viewer persona.

**Bridge state going in:** all 12 entries in `lib/mockData.ts:providers` now bridge to real `UserProfile` records. The 7 newly bridged carers (Jana K., Tomáš B., Pavel D., Simona V., Martin K., Lenka S., Petr V.) carry full `carerProfile` blocks with per-service pricing + service-aware fields + credentials.

---

## Workstream A — Helper/Provider retired, Carer Identity in its place

The Helper/Provider tier nouns are GONE. There's one noun for someone offering care: **Carer**. Audience setting (`carerProfile.publicProfile`) is encoded by the badge's visibility (circle-Carers' badge is privacy-gated to Connected viewers); sub-spec ("Dog Trainer", "Grooming Salon", etc.) resolves from the carer's Care group `careCategory` or credential certs. Visual: uniform light info-blue pill on PersonRow + profile hero.

- [x] **A1. Daniel → `/communities/group-klara-training`** → **Members tab.** Klára (`publicProfile: true`, runs the training Care group) renders **`Admin · Dog Trainer`** — Admin pill (neutral) + Carer Identity pill (light info-blue, "Dog Trainer" because her group's `careCategory` is "training"). Tereza (`publicProfile: false`, viewing self) renders just **`Carer`** (light info-blue, plain — no sub-spec because she has no Care group or trainer cert). Other members (Shawn, etc.) render `Carer` if `publicProfile: true` and they have no sub-spec source. No `Helper` / `Provider` pill anywhere — the old tier nouns are retired.
- [x] **A2. Tereza → `/meets/meet-reactive-spring`** → **People tab.** Verify three things on the attendee list (creator: Daniel; attendees include Klára, Jakub, Petra, Hana, Vítek, Marek, Lucie, Zuzana):
    - Klára's row shows **`Dog Trainer`** Carer pill (no `Provider` pill).
    - Jakub's row shows the **`Pending`** connection-state pill (Tereza has a pending connect request out to him via `conn-tereza-jakub`).
    - No row carries a `Helper` or `Provider` pill anywhere.
- [x] **A3. Tereza → `/profile/klara`** (hero section). Klára's profile header renders her name with the **`Dog Trainer`** Carer Identity pill inline next to it (light info-blue). No `Provider` tier label. Trust badges (Community Regular, Repeat clients, Certified trainer, Verified Identity) still render in the strip below the hero — those are decision-helpers, separate from Identity.
- [x] **A4. Privacy gate on circle-Carers — Petra (`publicProfile: false`, `profileVisibility: open`, no Care group, no trainer cert). Verify both directions:**
    - **Tereza → `/profile/petra`** — Tereza is NOT Connected to Petra (state: none). Profile renders fully (Petra is Open) but **no Carer pill** appears next to her name. That's the privacy gate working — Petra's circle-Carer status is hidden from non-Connected viewers.
    - **Tomáš → `/profile/petra`** (use the persona switcher or `?as=tomas`) — Tomáš IS Connected to Petra (`conn-tomas-petra`). Same profile, but now the **`Carer`** pill (plain label, no sub-spec since Petra has neither a Care group nor a trainer cert) renders inline next to her name. Light info-blue treatment.
    - No `Helper` tier label on either view.
- [x] **A5. Visual sweep — search the running app for the strings `Helper` or `Provider` in the rendered DOM** (browser Cmd+F). Acceptable matches: `MessageSender = "owner" | "provider"` chat-side variants in inbox CSS class names (e.g. `.inbox-message--provider` for chat bubble color); the word "providing" in copy ("You're providing"). **Not** acceptable: any tier badge labelled `Helper` or `Provider` on a person row, profile hero, member tab, etc.

---

## Workstream B — Every Discover Care card bridges to a real profile

Newly bridged carers should now have full credentials, trust badges, and per-service pricing — the same surface treatment as the originally-bridged ones (Olga, Nikola, Klára, Markéta, Lenka N.).

- [x] **B1. Tereza → `/discover/care`** → scroll to the bottom of the marketplace section. Find **Jana K.** (Dejvice). Her card should now render trust badges (Repeat clients, Certified trainer) and a "Connection signals" row (km away, network overlap if any). Pre-phase she had no bridged profile, so trust badges drew from raw ProviderCard fields; post-phase they should resolve through the bridge identically.
- [x] **B2. Tereza → tap Jana K.'s card** → routes to `/profile/jana-k` (the bridged UserProfile). Profile should render properly: avatar, bio ("Patient pet care for shy and senior dogs in Dejvice…"), location, trust badges in the hero, and a Services tab listing her three Care offerings (Walks, Sitting, Boarding) with prices.
- [x] **B3. Tereza → tap "Book a session" on Jana K.'s Walks card.** InquiryFormModal opens pre-filled with Walks. Confirms inquiry flow works on a freshly bridged carer (B+G stream integration check).
- [x] **B4. Tereza → `/discover/care`** → spot-check **Pavel D.** (Karlín — has own dogs + house with yard). His profile bio should mention the family home + own dog setup; his Boarding service config should now drive pricing on the Boarding pill (see Workstream D).
- [ ] **B5. Tereza → `/profile/petr-v`.** Petr V.'s profile should render with full credentials (8 years exp, first aid, insured, identity verified). His Services tab shows Sitting (480 Kč) + Boarding (720 Kč). Pre-phase, profile-route from his Discover card hit the synthesis fallback in `getUserOrProvider` (minimal name + avatar + neighbourhood, no Services tab); post-phase, he routes to a full UserProfile with services.

---

## Workstream C — Community-first ordering on `/discover/care`

The phase thesis. Carers in the viewer's circle (Connected or Familiar) render distinctly above the broader marketplace.

- [x] **C1. Tereza → `/discover/care`.** Top section reads "**CARERS IN YOUR CIRCLE (1)**" with Klára's card. Card chrome differs from the marketplace section below: brand-subtle background tint + 3px brand-main left accent stripe. **No platform-style rating row** (no "4.9 (31)" line). Familiar pill on the name row still renders.
- [x] **C2. Tereza → same page, scroll past the in-circle section.** "**OTHER CARERS (11)**" header divides the marketplace section. Standard card chrome (white background, no left stripe, rating + review-count row visible).
- [x] **C3. Daniel → `/discover/care`.** In-circle section should surface **Nikola R.** (his Familiar from D&C seed `conn-daniel-nikola`). Card has the softer chrome, no rating row. Marketplace below carries everyone else including Klára (no relationship Daniel-side).
- [x] **C4. Tomáš → `/discover/care`.** Tomáš has no Connected/Familiar carers in seed data — surface should fall through to a flat marketplace list (no "Carers in your circle" header at all). Confirms the empty-circle case renders cleanly without an empty section header.
- [x] **C5. New User → `/discover/care`.** Same as Tomáš case — no in-circle section, flat marketplace. Confirms graceful fallback for the persona with zero connections.
- [x] **C6. Daniel → mark a marketplace Carer as Familiar; verify the in-circle re-ordering happens live.** *(Why Daniel: he's the locked-profile persona — open viewers like Tereza skip Familiar entirely per the action matrix and have no Mark Familiar affordance.)* From `/discover/care` as Daniel: pick a Carer not yet in his circle (Olga, Klára, or Pavel D.), tap into their profile, tap **Mark Familiar**, then navigate back to `/discover/care`. The newly-Familiar carer should appear in the **Carers in your circle** section without a hard page reload — the ordering reads through `ConnectionsContext.getConnection`, which overlays session marks immediately. Hard-refresh (`⌘R`) to confirm the mark persists across reloads (localStorage backing).
- [x] **C7. Klára → `/discover/care`.** Klára-as-viewer sees her own circle. Per `mockConnectionsByViewer.klara`, her only connection that bridges to a Discover-listed Carer is **Pavel D.** (Familiar). Her other Connected/Familiar relationships are owners (daniel, filip, hana, eva, etc.), not Carers in the directory. Expected: in-circle section has **one card (Pavel D.)**; marketplace below has the rest. **Klára's own card does NOT appear** anywhere — viewer self-exclusion (you don't book yourself). Confirms the ordering works for non-default personas + the self-exclusion fix from this walkthrough.

---

## Workstream D — Service catalog: Appointment pill + per-service pricing + service-aware chip rendering

- [x] **D1. Tereza → `/discover/care`.** Filter pill row reads: **All / Walks / Sitting / Boarding / Appointment**. Pre-phase only the first four existed.
- [x] **D2. Tereza → tap "Appointment" pill.** Surface filters down to **Lenka N. only** (she's the lone grooming entry — vets sunset from the demo per Open Q §6, see Groups & Care Model "Vet category sunset" note). Her card no longer shows the empty-services issue; the "Grooming" chip is suppressed under the active filter (chip row hides when a specific filter is active). Price displays "from 500 Kč per visit" — that's the cheapest of her two grooming appointments (500 bath & brush / 800 full groom), resolved through the bridged `lenka-vet.carerProfile.services` appointment configs.
- [x] **D3. Tereza → tap "All" pill.** Lenka N.'s card now shows the **"Grooming"** chip in the chip row (alongside any Care-service tags from other providers). Confirms appointment subtype labels render correctly when no specific filter is active.
- [x] **D4. Tereza → tap "Sitting" pill.** Per-service pricing audit: cards swap to their sitting rate. **Olga M.** shows 500 Kč per visit (her sitting rate from the bridged config), NOT her legacy 390 Kč walks rate. **Markéta H.** shows 700 Kč per visit (sitting), NOT her 600 walks rate. **Petr V.** shows 480 Kč per visit (sitting), NOT his 720 per-night boarding rate. Confirms `resolveDisplayPrice` is reading through the bridge. *(Note: the "Sitting" label itself is under taxonomy review in the next phase — this item verifies the price-resolution mechanic, which stays intact regardless of the label outcome.)*
- [x] **D5. Tereza → tap "Boarding" pill.** Same audit on the boarding side. Pavel D. shows 720 Kč per night; Petr V. shows 720 Kč per night; Martin K. shows 750 Kč per night. Walking-only carers (Tomáš B., Klára) drop out of the result set.

---

## Workstream E — Filter panel — *deferred to next phase*

The filter panel work that originally lived in this workstream — service-aware field rendering (D6/D7/D8 in earlier drafts), day-of-week predicate, time-of-day filter, walk-pace + leash + home-features + own-dogs + has-yard predicates, pill-switch reset, result-count math — is being **re-shaped** in the next phase: **Care Catalog Taxonomy & Filter Redesign** (see ROADMAP). The taxonomy resolution there (four-service model, label cleanup, drop-in-visit placement, Sitting price-unit decision) reshapes the filter panel from the bottom up.

The predicates + service-aware fields shipped in this phase work today (verified during build via curl + dev-server checks); they're just not worth re-walking here as standalone items because the next phase will both re-shape the panel AND re-walk the resulting verifications. Removed to keep this walkthrough focused on the Discover Refinement thesis (community-first ordering, role collapse, bridge work).

---

## Workstream F — Avatar Rule B sweep: dogs are rounded squares, people are circles

- [x] **F1. Tereza → `/meets/meet-1`** (Vinohrady Morning Crew — recurring walk with several Going attendees, a good test surface for the dog-stack preview). On the meet detail page (Details tab is default), scroll to the **"Who's coming"** summary card. It shows up to 4 dog photos in a stack. Each dog photo renders as a **rounded square** (12px radius), NOT a circle. Owner-fallback avatars (when a dog photo can't resolve) stay circles.
- [x] **F2. Tereza → `/meets/meet-1?tab=people`.** Now you're seeing the full attendee list rendered via `OwnerDogAvatar` (one row per attendee). Each row's owner avatar is a circle (left); the small dog avatars overlap the bottom-right as rounded squares.
- [x] **F3. Tereza → `/bookings` → spot a booking row with a pet avatar combo.** Person + pet overlap: person is a circle, pet (dog) is a rounded square. `.booking-card-avatar-pet` was previously a circle.
- [x] **F4. Tereza → `/schedule` (or `/community`) → spot a schedule card with a person + pet combo.** Same: person circle, pet rounded square. `.sched-avatar-pet` was previously a circle.
- [x] **F5. Switch to the New User persona → `/home` → Feed tab → look for the "Dogs near you" strip at the top.** Each dog tile renders the dog photo as a rounded square; if the dog photo can't resolve and falls back to the owner avatar, that fallback stays a circle. *Note:* `DogsNearYou` is intentionally gated behind `newUserMode` — it's an empty-state nudge for new users with no real feed yet, so established personas like Tereza never see it. *(Renamed from F7. F5 + F6 in the original plan referenced `CompactGreeting` and `FeedCTA` — both turned out to be orphan components with no live consumer; Rule B fixes were applied to the source files anyway in case they're reactivated, but there's nothing to verify live. Orphan cleanup logged as a punch-list item.)*
- [x] **F6. Tereza → `/discover/care`.** Carer avatars on result cards stay **circles** (people, not pets). Confirms the in-circle accent stripe and brand-subtle ring are independent of Rule B (the Familiar/Connected ring is the relationship-encoding pattern, not affected by Rule B).
- [x] **F7. Tereza → `/profile/tereza` → expand a PetCard.** Pet primary avatar renders as a rounded square (small radius — the original `--radius-sm` treatment, which was already correct). Cross-check on the Pet info section if visible.
- [x] **F8. Visual sweep — open browser DevTools, type `$$('img').filter(i => i.alt?.toLowerCase().includes('dog')).map(i => getComputedStyle(i).borderRadius)` in console.** All values should be `12px` (rounded squares) or `0px` (raw photos like landing-page hero images that aren't avatars). No `9999px` or `50%` on dog images.

---

## Decisions surfaced during walkthrough

Emergent decisions, design changes, or rationale that come up as we walk the items above and refine. **This section starts empty** — append entries inline as decisions get made together. At phase close, sweep this list and propagate each entry to its named home doc.

- [x] **Carer Identity badge — single Carer noun with optional sub-spec label, uniform light info-blue treatment.** Walkthrough A1 surfaced that the row real estate left empty by the tier-pill removal needed *something*. First attempt (top trust badge) was the wrong shape — conflated identity statements with decision-helpers. Second attempt (Carer with strong/light intensity variants for open/circle audience) was visually too loud and the intensity differential was redundant with the privacy gate. **Final shipped form:** badges split into three categories (Role / Identity / Trust); Identity ships **Carer only**, one uniform light-fill info-blue treatment, with a sub-spec label resolved from (1) future `carerProfile.specializations` field [P60], (2) Care group `careCategory` (Klára → Dog Trainer), (3) credential cert string match (Tomáš B. → Dog Trainer), (4) fallback "Carer". Audience setting is encoded by visibility, not intensity — circle-Carers' badge is privacy-gated to Connected viewers only. Same visual treatment as the Care-group category label (mapped via `CARE_CATEGORY_LABELS`) so the same Carer reads consistently across surfaces. Wired in `PersonRow` (`carerBadge?` prop), `ParticipantList`, `MembersTab`, profile hero (`/profile/[userId]`). → `docs/implementation/badges.md` (already updated 2026-05-10), `docs/phases/punch-list.md` (P60 added for direct sub-spec field)
- [x] **Vet sunset from demo arc.** Walkthrough D1 surfaced that keeping Lenka N. as a vet contradicted the documented strategic position (Open Q §6 — vets are post-MVP at best, possibly never). The seeded vet entity (Lenka + PremiumVet group) was repurposed as a grooming salon (Mánesova Grooming) so the demo no longer telegraphs "Doggo wants vet accounts." `vet` retained in the data-model enums (`AppointmentCategory`, `careCategory`, `CARE_CATEGORY_LABELS`) for forward compatibility but no live mock data carries it. → `docs/strategy/Groups & Care Model.md` (already updated — Provider Categories table marks Vet as deprioritized + sunset note), `docs/strategy/Open Questions & Assumptions Log.md` (already updated — Provider category prioritization marked partially resolved), `docs/features/explore-and-care.md` (already updated — Lenka entry annotation). Future thread: "Account Types & Cold-Start Refinement" phase to settle long-term vet treatment (advertising-out, full removal, or eventual return) — not on roadmap yet.
- [x] **Care Catalog Taxonomy & Filter Redesign — scoped as the next phase.** Walkthrough D-stream surfaced that `inhome_sitting` drifted away from its original babysitter-metaphor intent (Sitting = at owner's home) and now means carer-side day care. The label is misleading; we're missing the at-owner's-home service entirely; the shipped filter panel is partial (non-functional Pets/Address rows, no sub-services accordion, coarse time-of-day, no sub-spec accordion); old reference designs shared in chat (2026-05-10) have useful shapes but predate the taxonomy resolution. **Resolution direction (to confirm at phase open):** four-service model — Walks & Check-ins / Sitting (at owner's home) / Day care (carer's home, daytime) / Boarding (carer's home, overnight). → ROADMAP (already updated — phase added as the next slot after Discover Refinement, before Cross-Cutting Flow Testing because flow tests depend on the service model being right), Open Questions §4 (already updated — full cluster captured: taxonomy drift, drop-in-visit placement, sitting price unit, filter panel redesign gaps, "avoid recurrence" guidance to document the resolved label inline next to the enum). Phase board itself to be drafted at Discover Refinement close, not now — protects this walkthrough from sprawling further.

Format for new entries:
```
- [ ] **{Decision in one line.}** {Optional one-line context.} → `features/foo.md`
- [ ] **{Implementation-only change}** {What/why.} → no feature-doc update needed
```

Examples of what belongs here:
- A behavior was changed during the walkthrough (e.g. "added a 5-day recency window to X")
- A design pattern shifted (e.g. "moved the Y CTA from card-bottom to top banner")
- Mock data assumptions changed (e.g. "dates moved from fixed to relative")
- An implementation gap was fixed in a way that warrants documentation

Examples of what does NOT belong here:
- Walkthrough wording fixes (just update the item)
- Bug fixes with no behavior change worth documenting (just commit + move on)
- Decisions captured elsewhere (phase board, Open Questions, punch list)
