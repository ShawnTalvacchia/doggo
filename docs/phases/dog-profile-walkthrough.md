---
status: active
last-reviewed: 2026-06-03
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Dog Profile — Walkthrough

Tight verification for the Dog Profile phase thesis: **`/dogs/[id]` now renders a real owned-dog profile alongside the shelter-dog profile from Shelter Foundation. Vaccines V1 ships structured per-vaccine records with an owner acknowledgement. Pet-level standing preferences carry per-pet care info visible to anyone who books. Tag taxonomy is formalized — typed personality vocabulary + auto-derived chips + policy chips, with explicit helpers. Photo gallery surface is reserved for the next phase.**

Anything not testing that thesis lives elsewhere (cross-persona permutations → `verification-checklist.md`; vaccine-gating + verification → Open Q §15/§16, deferred; Photos & Galleries auto-album → its own phase).

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Walk straight through — should take 10–15 minutes.
3. Tick items as you go. Log surprises in the Decisions section at the bottom.

**Seed context.** Vaccines V1 seeded on 9 owned dogs (Franta, Bella, Bára, Eda, Hugo, Asha, Žofka, Spot, Goldie) with realistic per-vaccine dates and per-dog acknowledgement timestamps. Standing preferences seeded on 4 dogs (Franta, Bella, Bára, Hugo). Bára gains a rescue backstory so the field surfaces on owned-dog profiles. Shelter dogs migrated to typed `personalityTags`; auto-derivable entries (Long-stayer, New arrival, Small) dropped from manual seeds.

**Persona visibility states (matters for A5/A6):** Tereza + Klára are **public**; Daniel + Tomáš are **locked**.

---

## Workstream A — Owned-dog profile branch at `/dogs/[id]`

The page used to fall back to a "coming soon" empty state for any non-shelter id. It now resolves owned dogs in earnest, with a visibility gate inheriting from the owner's profile lock.

- [ ] **A1. Tereza → `/dogs/franta`.** Owned-dog profile renders for the first time. Hero photo full-width with name + meta line (`Beagle · 5 years · 12 kg`, no sex set so it's omitted cleanly). Backstory paragraph hidden (Franta has none seeded). Tag chips: energy (auto) + Franta's personality tags. **No** "In care / Last walked" stat row (shelter-only). **No** policy strip. **No** Recent walkers.

- [ ] **A2. Same page, scroll to bottom.** Owner backlink reads **"Your dog · You"** with Tereza's avatar in a circle. Tap it → routes to `/profile`.

- [ ] **A3. Tereza → `/dogs/franta`, tap the back arrow (top-left).** Returns to `/profile` (self), not to `/home` and not to a shelter.

- [ ] **A4. Tereza → `/dogs/shelter-dog-tonda`.** Shelter dogs still work as before. Stat row, recent walkers, shelter backlink (`Cared for by Útulek Liběň →`) all present.

- [ ] **A5. Switch to New User → `/dogs/bara`** (Daniel's dog; Daniel is locked; New User has no connections). Locked empty state: lock icon + **"Bára's profile is private"** + subtitle prompting to meet Daniel.

- [ ] **A6. Switch to Daniel → `/dogs/bara`** (self viewing own locked dog). Full profile renders. Owner backlink reads **"Your dog · You"** (not "Lives with").

- [ ] **A7. Klára → `/dogs/franta`** (Tereza is public). Full profile renders, owner backlink reads **"Lives with · Tereza Nováková"** and routes to `/profile/tereza`.

- [ ] **A8. Klára → `/dogs/spot`** (an id that resolves to neither shelter nor owned). Empty state reads **"Dog profile not found"** with a CTA back to the shelter roster. NOT a 404, NOT the "coming soon" copy.

---

## Workstream B — Vaccines V1

Structured per-vaccine records replace the legacy `vaccinationsUpToDate: boolean`. Owner self-declared; no gating, no verification.

- [ ] **B1. Tereza → `/dogs/franta`.** Health section renders 5 vaccine chips in canonical order: **Rabies · Aug 2025 · Parvovirus · Aug 2025 · Distemper · Aug 2025 · Hepatitis · Aug 2025 · Parainfluenza · Aug 2025**. Caption below: **"Confirmed by Tereza on Apr 2026"**.

- [ ] **B2. Tereza → `/profile`** (own profile, About tab). Expand Franta's PetCard → Health & vet section. Same 5 vaccine chips rendered as `.pet-profile-vet-pill` chrome, with the "Vaccinations" header row + ShieldCheck icon. Caption: **"Confirmed Apr 2026"**.

- [ ] **B3. Tereza → `/profile`, tap Edit.** Expand Franta's PetEditCard → Health & vet (expand if collapsed). Vaccinations block shows 5 rows (Rabies / Parvovirus / Distemper / Hepatitis / Parainfluenza), each with a date input pre-populated to **2025-08-15**. Below the rows: checkbox **"I confirm Franta's vaccination record is accurate as of today"** — checked. Caption shows `Confirmed 2026-04-20`.

- [ ] **B4. Same edit form.** Clear Rabies's date → caption is unchanged, but on Save the chips would re-render with only 4 entries. Re-enter a date for Rabies. Toggle the acknowledgement off → caption disappears; toggle back on → caption updates to today's ISO date.

- [ ] **B5. Tereza → `/dogs/shelter-dog-tonda`.** Health section is **not present** (Tonda has no `vetInfo` seeded). Confirms the "no vaccination records on file" empty state suppresses cleanly rather than rendering an awkward header.

- [ ] **B6. Daniel → `/dogs/bara`.** Health section renders Bára's 5 chips (Nov 2025 doses). Caption: **"Confirmed by Daniel on May 2026"**.

---

## Workstream C — Pet-level standing preferences

Four chip groups (Likes / Dislikes / Triggers / Play) per pet. Visible to anyone who can see the dog AND to carers on the booking detail Info tab.

- [ ] **C1. Daniel → `/dogs/bara`.** Between Tags and Health: **"How Bára likes to be cared for"** section. Four sub-labels (LIKES / DISLIKES / TRIGGERS / PLAY), each with its chip row populated. Dislikes includes "loud noises"; Triggers includes "men in tall hats" and "skateboards".

- [ ] **C2. Daniel → `/profile`.** Expand Bára's PetCard. New "How Bára likes to be cared for" section in the expanded view with the same four sub-labels + chip rows.

- [ ] **C3. Daniel → `/profile`, tap Edit, expand Bára.** Personality section now contains a `PreferencesEditor` block. Type a phrase into the Likes input and press Enter → chip added to the row above. Click the **×** on a chip → removed.

- [ ] **C4. Daniel → `/bookings/<any-of-Daniel's-bookings>`** (Info tab). Find the Pet info block, tap to expand. The list of rows now includes **Likes**, **Dislikes**, **Triggers**, **Play** alongside the existing Medications / Conditions / Around dogs / Vet rows.

- [ ] **C5. Tereza → `/dogs/franta`.** "How Franta likes to be cared for" renders Franta's three groups: Likes ("scent games" etc.), Dislikes ("being rushed past interesting smells"), Play ("long sniffy walks"). No Triggers sub-label (he has none) — confirms empty groups suppress cleanly.

---

## Workstream D — Tag taxonomy formalization (FC8)

Three explicit categories: auto-derived chips computed at render time, controlled `PersonalityTag` vocabulary, policy chips from per-dog flags. No more free-text `tags: string[]`.

- [ ] **D1. Tereza → `/shelters/utulek-liben` Dogs tab.** Card chips unchanged from before: Theo's "New arrival" (green solid), Berta's "Long-stayer" (white glass), Káťa's "Adoption pending" (yellow glass). Sort defaults stay correct.

- [ ] **D2. Tap into Theo → `/dogs/shelter-dog-theo`.** Tag row contains exactly: **New arrival** (auto, green) · **High energy** (auto, energy) · **Puppy** · **Needs basics**. No duplicate "New arrival" chip from manual seeds.

- [ ] **D3. Tap into Šimon → `/dogs/shelter-dog-simon`.** Tag row: **Long-stayer** (auto, white) · **Calm** (auto, energy) · **Senior**. Confirms `Long-stayer` came from `deriveAutoTags` and not the manual seed (which was dropped during migration).

- [ ] **D4. Tap into Berta → `/dogs/shelter-dog-berta`.** Tag row: **Long-stayer** · **Calm** · **Wary of strangers**. Policy strip below tags (shield icon): **"Solo walks only · Experienced handlers only"** — derived from `derivePolicyChips`.

- [ ] **D5. Tereza → `/profile`, tap Edit, expand Franta.** Personality section now contains a **"Personality tags"** pill-group below Play style. 17 tags from the controlled vocabulary in `PERSONALITY_TAG_PICKER_ORDER`. None are pre-selected for Franta (owned dogs don't carry seeded personality tags yet). Click "Affectionate" → highlights as active.

---

## Workstream E — Photo gallery landing slot

The Photos & Galleries phase will fill this surface with an auto-album drawn from tagged posts. V1 reserves the section so the surface feels in-place.

- [ ] **E1. Tereza → `/dogs/shelter-dog-tonda`** (or any shelter dog). Photos section sits between Recent walkers and Posts. Header reads **"Photos"**; subline reads **"Coming soon — photos from posts tagging Tonda will surface here."** No thumbs (no `photoGallery` seeded for shelter dogs) — section is just header + caption.

- [ ] **E2. Daniel → `/dogs/bara`.** Same Photos section. If Bára's PetProfile has `photoGallery` items (check Daniel's profile to confirm), they render in a 3-column square grid. Otherwise just the header + caption.

---

## Workstream F — Shared-spine polish (backstory + Avatar Rule B sanity)

- [ ] **F1. Daniel → `/dogs/bara`.** Backstory paragraph renders under the hero: **"Adopted from a rural shelter in late 2025 after eight months in care…"**. Same `dog-profile-backstory` styling the shelter spine uses.

- [ ] **F2. Daniel → `/profile`, tap Edit, expand Bára → Basic info section.** New **"About Bára — optional"** textarea pre-populated with the same rescue backstory. Edit it → backstory updates in real time; Save → re-renders on `/dogs/bara`.

- [ ] **F3. Klára → `/dogs/franta`** (cross-persona view of an owned dog). Owner backlink shows Tereza's avatar as a **circle** (Avatar Rule B — people are circles), the dog hero stays a full-bleed photo of the dog. No mixing of shapes.

---

## Decisions surfaced during walkthrough

Append as you walk — don't wait until the end. Each entry annotates where the decision needs to land (`→ target-doc.md`); phase-close sweep processes the list.

(Add entries below as the walkthrough reveals them.)
