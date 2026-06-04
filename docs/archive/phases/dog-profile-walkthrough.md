---
status: archived
last-reviewed: 2026-06-03
review-trigger: "Closed phase — historical record only"
---

# Dog Profile — Walkthrough

Tight verification for the Dog Profile phase thesis: **`/dogs/[id]` now renders a real owned-dog profile alongside the shelter-dog profile. Vaccines V1 ships structured per-vaccine records with an owner acknowledgement. Pet-level standing preferences carry per-pet care info visible to anyone who books. Tag taxonomy is formalized (typed personality vocabulary + auto-derived chips + policy chips). Photo gallery surface is reserved for the next phase.**

**Seed context.** Vaccines V1 on 9 owned dogs; standing preferences on Franta, Bella, Bára, Hugo; Bára gains a rescue backstory. Shelter dogs migrated to typed `personalityTags` (auto-derivable entries dropped from manual seeds). Persona visibility: Tereza + Klára are **public**; Daniel + Tomáš are **locked**.

**How to use:** `npm run dev` (port 3000). Walk straight through (~10 min). Log surprises in the Decisions section at the bottom.

---

## Workstream A — Owned-dog profile branch at `/dogs/[id]`

- [x] **A1. Tereza → `/dogs/franta`.** First real owned-dog profile. Side-by-side hero: 200px rounded-square photo + name (text-3xl) + meta line (`Beagle · Male · 5 years · 12 kg`) + personality tag chips (Easygoing · Affectionate · Good with dogs · Loves walks) — all inside the hero. **No** "In care / Last walked" row, **no** policy strip, **no** Recent walkers. Owner backlink at bottom reads **"Your dog · You"** → tap routes to `/profile`. DetailHeader title reads **"← Tereza's Dogs"** and the back arrow routes to `/profile` too.

- [x] **A2. Tereza → `/dogs/shelter-dog-tonda`** (regression). Shelter spine still intact — stat row + shelter backlink + the rest.

- [x] **A3. Switch to New User → `/dogs/bara`** (Daniel locked, New User unconnected). Lock icon + **"Bára's profile is private"** title + subtitle + a secondary **"View Daniel's profile"** button routing to `/profile/daniel` (the connection path — meet Daniel to see his dog).

- [x] **A4. Switch to Daniel → `/dogs/bara`** (self viewing own locked dog). Full profile renders. Backlink reads **"Your dog · You"**.

---

## Workstream B — Vaccines V1

- [x] **B1. Tereza → `/dogs/franta`.** Health section: 5 chips in canonical order (**Rabies · Aug 2025 · Parvovirus · Aug 2025 · Distemper · Aug 2025 · Hepatitis · Aug 2025 · Parainfluenza · Aug 2025**) + caption **"Confirmed by Tereza on Apr 2026"**. Each chip leads with a small blue Syringe icon.

- [x] **B2. Tereza → `/dogs/franta`, tap Edit** (PencilSimple button in the DetailHeader right slot). Full-page edit form opens with all four sections always visible (Basic info / Personality / Socialisation / Health & vet). Scroll to Health & vet — 5 vaccine date inputs pre-populated to **2025-08-15**. Acknowledgement checkbox below: **"I confirm Franta's vaccination record is accurate as of today"** — checked, with `Confirmed 2026-04-20` caption. Toggle off → caption disappears; toggle back on → caption updates to today's ISO date.

---

## Workstream C — Pet-level standing preferences

- [x] **C1. Daniel → `/dogs/bara`.** Below the hero (after the optional backstory/about block), above Health: **"How Bára likes to be cared for"** with 4 sub-labels (LIKES / DISLIKES / TRIGGERS / PLAY) rendered as label + text-with-separator.

- [x] **C2. Daniel → `/dogs/bara`, tap Edit → Socialisation section** (Section 3 of 4 in the PetEditCard form). Below the Socialisation textarea: **"How Bára likes to be cared for"** with one comma-separated input per group (Likes / Dislikes / Triggers / Play). Placeholder copy nudges concision (`comma-separated, e.g. squeaky toys, ear scratches`).

- [x] **C3. Klára → `/bookings/booking-meet-care-1-tomas`** (Klára is the carer, Hugo is the pet — Hugo has preferences seeded). PetInfoSection only renders for the provider, so persona has to match the carer; Klára is in the picker. Same flow works for **Klára → `/bookings/booking-meet-care-workshop-1-daniel`** (Bára, deepest preferences seeded). Likes / Dislikes / Triggers / Play rows render alongside Medications / Conditions / Around dogs / Vet — all inline (no expand mechanic). Toby / Spot / Goldie bookings render thinner because those seeds aren't enriched.

---

## Workstream D — Tag taxonomy formalization (FC8)

- [x] **D1. Tereza → `/shelters/utulek-liben` Dogs tab** (regression). Card chip priority unchanged: Theo's **New arrival** green, Berta's **Long-stayer** white glass, Káťa's **Adoption pending** yellow glass.

- [x] **D2. Visit `/dogs/shelter-dog-berta` then `/dogs/shelter-dog-theo`.** Berta: **Long-stayer** (auto) + **Calm** (auto-energy) + **Wary of strangers** + policy strip **"Solo walks only · Experienced handlers only"**. Theo: **New arrival** (auto) + **High energy** (auto-energy) + **Puppy** + **Needs basics**. No duplicate Long-stayer / New arrival chips from old manual seeds.

- [x] **D3. Tereza → `/dogs/franta`, tap Edit → Personality section.** **"Personality tags"** pill-group with 17 chips from the controlled vocabulary. Click "Affectionate" → highlights active.

---

## Workstream E — Photos landing slot

- [x] **E1. Tereza → `/dogs/shelter-dog-tonda`.** Photos section between Recent walkers and Posts. Header **"Photos"** + subline **"Coming soon — photos from posts tagging Tonda will surface here."** (No thumbs; shelter dogs aren't seeded with `photoGallery`.)

---

## Workstream F — Backstory on owned dogs

- [x] **F1. Daniel → `/dogs/bara`.** Backstory paragraph under the hero: **"Adopted from a rural shelter in late 2025…"**. Same `.dog-profile-backstory` styling shelter dogs use. Editable on `/dogs/bara` → tap Edit → Basic info → **"About Bára — optional"** textarea.

---

## Workstream G — PetCard → photo-led summary + dog editing on `/dogs/[id]`

- [x] **G1. Tereza → `/profile` About tab.** Dogs section renders a 2-up grid of **photo-led PetSummaryCard** tiles (Franta + Bella). No expandable PetCard chrome. Tap Franta → `/dogs/franta` opens.

- [x] **G2. On `/dogs/franta` (as Tereza).** DetailHeader title reads **"← Tereza's Dogs"** (owner-aware). Sibling TabBar below the header inside the panel: `Franta | Bella` — tap Bella → routes to `/dogs/bella`. **Edit** button (PencilSimple outline) lives in the DetailHeader's right slot, NOT the AppNav top-row — detail pages put actions in the detail header.

- [x] **G3. Tap Edit on `/dogs/franta`.** Page swaps to a full-page edit form (Basic info / Personality / Socialisation / Health & vet — all four sections always visible, no accordion). Nav locks in: Cancel + Save replace the Edit button in the DetailHeader slot; Bell + Inbox hide; sibling TabBar hides. **"Remove Franta"** destructive button at the bottom. Cancel → exits edit. Save → exits edit (prototype: not yet persisted app-wide).

- [x] **G4. Tereza → `/profile`, tap Edit.** Dog cards stay visible but render muted (0.6 opacity, no hover, no click). Helper line under the section header: **"Edit a dog's details from its profile."** The **"+ Add dog"** button **hides** in profile edit mode (not a profile-edit action; would route away from the locked profile-edit state). To add a dog, exit profile edit first — the button is back in view mode.

- [x] **G5. Daniel → `/dogs/bara`.** Single-dog owner — no sibling tab strip (only one dog, no point). DetailHeader still reads **"← Daniel's Dogs"** (consistent owner-aware framing).

---

## Decisions surfaced during walkthrough

Append as you walk — don't wait until the end. Each entry annotates where the decision needs to land (`→ target-doc.md`); phase-close sweep processes the list.

- **Locked dog profile empty state gets an owner-profile action button.** A locked Bára view (Daniel locked, viewer unconnected) was a dead end — the title said "private," the subtitle said "connect with Daniel," but the viewer had no path to act. Added a `View {firstName}'s profile` secondary button routing to `/profile/{ownerId}`. Owner's profile honors its own lock when visited (no privacy leak vs. a meet-attendee row). → `features/shelters.md` (Dog Profile section)
- **Locked user profile card splits into title + subtitle.** The full-width lock card on `/profile/[userId]` was a single paragraph ("{firstName} keeps their profile private. People typically see more after meeting at a walk or community."). Reshaped to match the EmptyState pattern used on the dog profile lock — bold first line **"{firstName}'s profile is private"** + lighter subtitle + Learn link. Cross-page consistency for the lock language. → `features/profiles.md` (Locked Profile View section)
- **Booking detail Info tab — multiple cleanups landed during the C3 walk.** (a) PetInfoSection lost its avatar-identity row (booking header + new anchor cover it); replaced with a small `Bára · View profile →` header + the avatar restored to the left at 40px (rounded-square per Rule B). Expand/collapse retired — rows always visible. (b) Details vertical list moved ABOVE PetInfoSection (booking facts before pet reference). The `Bára · 1 pet` row in Details was removed (redundant with the booking header + PetInfoSection avatar). (c) New **Next session** row at the top of Details: shows date + relative framing ("Today" / "Tomorrow" / "In N days" / "N days overdue"), with a Start CTA when the provider is on the hook today/overdue. Works for both Care bookings (uses `nextSession.date`) and meet bookings (falls back to `booking.startDate`). (d) Status pill hidden in the booking header when status === "upcoming" — Next session row carries the equivalent info. (e) 3-tile aggregate stats grid retired; the "since + completed count" info migrates to an **Activity** row inside the Details list (ongoing Care bookings only). (f) Sessions tab Start button gated to today/overdue — same threshold as the Info-tab Next session row; future sessions render info-only. → `features/explore-and-care.md` (booking detail Info tab structure) — also worth a Future Considerations entry for the broader booking-detail refactor pattern.
- **Seed gap: Klára ↔ Daniel connection wasn't reflecting their signed booking.** Open Q §2 says contract sign → mutual Connected, but the static connection seed didn't include the Klára ↔ Daniel pair even though `booking-meet-care-workshop-1-daniel` carries `signedAt: ~8 days ago`. Backfilled both rosters with a Connected entry. Logged as **P74** for a broader audit of signed-booking pairs vs Connected seeds (and parallel audits for inquiry → Familiar, completed mutual meets → Familiar). → `phases/punch-list.md` (P74 added) — no doc update needed on the trust model itself (rules unchanged).
