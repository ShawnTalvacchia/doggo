---
status: active
last-reviewed: 2026-06-03
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Dog Profile — Walkthrough

Tight verification for the Dog Profile phase thesis: **`/dogs/[id]` now renders a real owned-dog profile alongside the shelter-dog profile. Vaccines V1 ships structured per-vaccine records with an owner acknowledgement. Pet-level standing preferences carry per-pet care info visible to anyone who books. Tag taxonomy is formalized (typed personality vocabulary + auto-derived chips + policy chips). Photo gallery surface is reserved for the next phase.**

**Seed context.** Vaccines V1 on 9 owned dogs; standing preferences on Franta, Bella, Bára, Hugo; Bára gains a rescue backstory. Shelter dogs migrated to typed `personalityTags` (auto-derivable entries dropped from manual seeds). Persona visibility: Tereza + Klára are **public**; Daniel + Tomáš are **locked**.

**How to use:** `npm run dev` (port 3000). Walk straight through (~10 min). Log surprises in the Decisions section at the bottom.

---

## Workstream A — Owned-dog profile branch at `/dogs/[id]`

- [ ] **A1. Tereza → `/dogs/franta`.** First real owned-dog profile. Hero (full-width photo + name + breed/age/weight, sex omitted cleanly). Tag chips. **No** "In care / Last walked" row, **no** policy strip, **no** Recent walkers. Owner backlink at bottom reads **"Your dog · You"** → tap routes to `/profile`. Back arrow (top-left) also → `/profile`.

- [ ] **A2. Tereza → `/dogs/shelter-dog-tonda`** (regression). Shelter spine still intact — stat row + shelter backlink + the rest.

- [ ] **A3. Switch to New User → `/dogs/bara`** (Daniel locked, New User unconnected). Lock icon + **"Bára's profile is private"** empty state.

- [ ] **A4. Switch to Daniel → `/dogs/bara`** (self viewing own locked dog). Full profile renders. Backlink reads **"Your dog · You"**.

---

## Workstream B — Vaccines V1

- [ ] **B1. Tereza → `/dogs/franta`.** Health section: 5 chips in canonical order (**Rabies · Aug 2025 · Parvovirus · Aug 2025 · Distemper · Aug 2025 · Hepatitis · Aug 2025 · Parainfluenza · Aug 2025**) + caption **"Confirmed by Tereza on Apr 2026"**.

- [ ] **B2. Tereza → `/profile`,** expand Franta's PetCard → Health & vet. Same 5 chips with the ShieldCheck-headed Vaccinations block + **"Confirmed Apr 2026"** caption.

- [ ] **B3. Tereza → `/profile`, Edit → Franta → Health & vet.** 5 vaccine date inputs pre-populated to **2025-08-15**. Acknowledgement checkbox below: **"I confirm Franta's vaccination record is accurate as of today"** — checked, with `Confirmed 2026-04-20` caption. Toggle off → caption disappears; toggle back on → caption updates to today's ISO date.

---

## Workstream C — Pet-level standing preferences

- [ ] **C1. Daniel → `/dogs/bara`.** Between Tags and Health: **"How Bára likes to be cared for"** with 4 sub-labels (LIKES / DISLIKES / TRIGGERS / PLAY) + chip rows. Same section also visible on `/profile` Bára PetCard (expanded view).

- [ ] **C2. Daniel → `/profile`, Edit → Bára → Personality section.** `PreferencesEditor` block at the bottom. Type a phrase into Likes + Enter → chip added. Click **×** → removed.

- [ ] **C3. Any persona → `/bookings/<a-booking>`** Info tab → expand the Pet info block. Likes / Dislikes / Triggers / Play rows render alongside Medications / Conditions / Around dogs / Vet.

---

## Workstream D — Tag taxonomy formalization (FC8)

- [ ] **D1. Tereza → `/shelters/utulek-liben` Dogs tab** (regression). Card chip priority unchanged: Theo's **New arrival** green, Berta's **Long-stayer** white glass, Káťa's **Adoption pending** yellow glass.

- [ ] **D2. Visit `/dogs/shelter-dog-berta` then `/dogs/shelter-dog-theo`.** Berta: **Long-stayer** (auto) + **Calm** (auto-energy) + **Wary of strangers** + policy strip **"Solo walks only · Experienced handlers only"**. Theo: **New arrival** (auto) + **High energy** (auto-energy) + **Puppy** + **Needs basics**. No duplicate Long-stayer / New arrival chips from old manual seeds.

- [ ] **D3. Tereza → `/profile`, Edit → Franta → Personality section.** New **"Personality tags"** pill-group with 17 chips from the controlled vocabulary. Click "Affectionate" → highlights active.

---

## Workstream E — Photos landing slot

- [ ] **E1. Tereza → `/dogs/shelter-dog-tonda`.** Photos section between Recent walkers and Posts. Header **"Photos"** + subline **"Coming soon — photos from posts tagging Tonda will surface here."** (No thumbs; shelter dogs aren't seeded with `photoGallery`.)

---

## Workstream F — Backstory on owned dogs

- [ ] **F1. Daniel → `/dogs/bara`.** Backstory paragraph under the hero: **"Adopted from a rural shelter in late 2025…"**. Same `.dog-profile-backstory` styling shelter dogs use. Editable on `/profile` Edit → Bára → Basic info → **"About Bára — optional"** textarea.

---

## Decisions surfaced during walkthrough

Append as you walk — don't wait until the end. Each entry annotates where the decision needs to land (`→ target-doc.md`); phase-close sweep processes the list.

(Add entries below as the walkthrough reveals them.)
