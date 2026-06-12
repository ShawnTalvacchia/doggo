---
status: active
last-reviewed: 2026-06-12
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Adoption-Curious Journey — Walkthrough

Verification checklist for the Adoption-Curious Journey phase. **Concise by design** — surface what's worth your judgment, what risks regression, and what confirms the phase thesis (an adoption-curious newcomer walks shelter dogs and becomes an advocate; the advocacy loop is the adoption engine).

**How to use:**

1. Dev server on port 3000 (preview already running). Unlock password is the local-dev default.
2. Switch personas via the profile-name dropdown or `?as=<id>` (the new persona is `?as=eliska`).
3. Walk top-to-bottom — ordered "needs your eyeballs most" → "least."

**Build status (2026-06-12):** Workstream A shipped (persona + focal dog). B (doorway), C (group walk), D (advocacy loop), E (capstone), F (beats + this doc) are in progress — items below are tagged `[A ✓]` for shipped vs `[pending]` for not-yet-built so you know what's drivable.

**New seed data this phase:**
- **Eliška Dvořáková** (`?as=eliska`) — the Adoption-Curious Explorer persona. Žižkov, no dog, walking shelter dogs to decide whether to adopt.
- **Nora** (`/dogs/shelter-dog-nora`) — the focal long-stayer at Útulek. Gentle, newcomer-walkable, 71 days in care.

---

## Open for your call

Decisions made during the build — ratify or redirect. Each has a path to see it in context.

- [ ] **O1. Focal dog is a NEW seed (Nora), not Maja `[A ✓]`.** The board floated Maja, but Maja — and every existing Útulek long-stayer (Šimon, Berta) — is `soloOnly`/`experiencedHandlersOnly`, so a freshly-vouched newcomer can't walk them, which breaks the walk-and-advocate spine. So I seeded **Nora**: gentle, sociable, *newcomer-walkable*, overlooked-but-blooms-on-a-walk (the research's advocacy archetype). Both adoption endings hang off her. Another reasonable call: relax a policy flag on an existing dog instead of seeding new. (`/dogs/shelter-dog-nora`)
- [ ] **O2. Persona name + neighbourhood: Eliška Dvořáková, Žižkov `[A ✓]`.** Fresh name + a neighbourhood not yet used by a POV persona (geographic spread). Bless or rename. (`/profile?as=eliska`)
- [ ] **O3. Eliška seeded as a Útulek Supporter + Follow button now derives from membership `[A ✓]`.** She starts a step in (already following), so a reviewer dropping into her story finds her embedded rather than cold. Side effect: the shelter Follow button now reads initial state from the supporters roster (she's the first real persona ever seeded as a supporter). Alternative: leave her unseeded and make "Follow" her first live beat. (`/shelters/utulek-liben?as=eliska` — button reads "Following"; Members tab → Supporters · 13)
- [ ] **O4. Placeholder images for Eliška + Nora `[A ✓]`.** Both carry their own file slots (`eliska-profile.jpeg`, `shelter-dog-nora-portrait.jpeg`) copied from existing portraits, pending the image-enrichment pass. Nora's placeholder has a faint "MIA" kennel nameplate in the source photo — cosmetic, regenerates with enrichment. (per the demo-content-iteration convention)
- [ ] **O5. Meet↔shelter linkage for the group walk (DR4) `[pending]`.** How the group-walk Meet sources Útulek's dog roster (a `shelterId` on the Meet vs hanging off a group). Build-targeting — flag once C lands.
- [ ] **O6. Group dog-checkout depth + peel decision (C / discipline 5) `[pending]`.** How deep to model a shelter releasing N dogs to a group at once; whether C stays in this phase or peels. Decide at the mid-phase checkpoint.
- [ ] **O7. Adoption transition boundary (DR7) `[pending]`.** Capstone models `adoption-pending` + celebration/archived "Happy endings"; the literal `PetProfile`→new-owner migration stays V2-deferred. Confirm that's the right line, or push deeper.
- [ ] **O8. Advocacy framing vs commitment-pressure (D3) `[pending]`.** Surfacing "this dog is looking for a home" on long-stayer recaps without re-introducing the "walking = adopting" pressure the research warns against. Judgment call on copy tone.

---

## Worth verifying

Behaviors that need a human at the keyboard.

- [ ] **V1. Eliška renders coherently across her surfaces `[A ✓]`.** `?as=eliska` → `/profile` (locked, "No dogs added yet", no connections, Žižkov/Prague 3, May 2026), `/shelters/utulek-liben` (Follow reads "Following"), bottom-nav avatar. Should read as a newcomer a step in, nothing broken.
- [ ] **V2. Eliška appears in the persona picker `[A ✓]`.** Profile-name dropdown and `/` Explore-freely both list "Eliška Dvořáková · Adoption-Curious Explorer." Picking her routes and persists.
- [ ] **V3. Nora reads as the advocacy archetype `[A ✓]`.** `/dogs/shelter-dog-nora` — Long-stayer chip, gentle/sociable tags (no policy/eligibility chips, since she's newcomer-walkable), 71 days in care, the "overlooked, blooms on a walk" backstory, Walk + Adopt CTAs both present.
- [ ] **V4. Eliška on the Members tab `[A ✓]`.** `/shelters/utulek-liben?tab=members` → Supporters count is 13, "Eliška D." present under All/Supporters. (Her row isn't a profile link yet — bridged-supporter linking is existing FC9 territory, not this phase.)
- [ ] **V5. Doorway "explore before you commit" framing `[pending — B]`.** `/discover/help-a-dog` carries the no-adoption-obligation framing and surfaces the group walk as a warm entry.
- [ ] **V6. Group shelter walk two-tier roster `[pending — C]`.** Vouched attendees claim a shelter dog; un-vouched newcomers join socially + see the mentor CTA.
- [ ] **V7. Advocacy loop end-to-end `[pending — D]`.** Walk-finish → "Share a moment" → recap lands in shelter feed + surfaces in network/dog page.
- [ ] **V8. Adoption capstone `[pending — E]`.** Adopt CTA → interest → shelter-curated meet-and-greet → `adoption-pending` → off-ramps → celebration/archived resolution. No auto-match.
- [ ] **V9. Existing demo threads intact `[pending — F]`.** V2 Daniel→Klára and Tomáš mentee arcs still drive; no persona-switch regressions; TypeScript clean.

---

## Decisions surfaced during walkthrough

Append as you walk. Each entry carries a `→ target-doc.md` for the close sweep.

- **Seeded Nora as a new newcomer-walkable focal long-stayer rather than reusing Maja.** Existing Útulek long-stayers are all `soloOnly`/`experiencedHandlersOnly`; the advocacy spine needs a dog a freshly-vouched newcomer can actually walk. → `features/shelters.md` (focal-dog seed) + phase board O1
- **Shelter Follow button derives initial state from the supporters roster.** Previously hardcoded `false`; Eliška is the first real persona seeded as a supporter, so the button and the Members tab now agree. → `features/shelters.md` (action row) + `features/demo-mode.md` (hydration-gated identity state)
- **Adoption-Curious Explorer archetype is distinct from the Shelter Walker.** Walker walks *instead of* owning; Explorer walks *to decide whether* to own. → `strategy/User Archetypes.md` (shipped)
