---
status: archived
last-reviewed: 2026-05-18
review-trigger: "Archived — photos generated + wired (W2.5 complete). Reference only, e.g. to regenerate a photo."
---

# Demo Narrative V2 — Image Generation Prompts

> **Archived 2026-05-18.** All photos were generated and wired into mock data (V2 phase W2.5). Kept as a reference for regenerating any of these images.

Image-generation prompts for the Demo Narrative V2 walkthrough. The walkthrough cast and surfaces already have most of their imagery; this doc covers what's **missing or borrowed**. Reflects the **2-persona structure** (Daniel / Klára) decided 2026-05-18.

---

## How and where to save the files

- **Save all images to `public/images/generated/`.**
- **Use the exact filename given for each prompt**, including the `.jpeg` extension. Mock data references images by exact path (`avatarUrl`, pet `imageUrl`, group `coverPhotoUrl`, post image) — a filename mismatch renders a broken image.
- **Aspect ratio** is listed per image below. Quick reference: avatars **1:1**, dog portraits **1:1**, group covers **16:9**, the walk post **16:9** — matching the dimensions the existing cast already uses.
- **Reference image:** where a prompt lists one, add that existing file as a reference image when generating, so the new image stays consistent with the cast.
- **Style convention** — match the existing cast: *casual phone photo, natural daylight, a Prague setting, candid and unstaged, late spring* (leafy, green — the demo's "today" is mid-May). The established aesthetic and the cast diversity guidelines are in `docs/archive/image-prompts/image-generation-reference.md`.
- **After generating:** hand back to the V2 phase — W2.5 wires each file into mock data (`lib/mockUsers.ts` avatars + pet `imageUrl`, `lib/mockGroups.ts` `coverPhotoUrl`, and the Beat 2 walk post). The walk post's caption is written in W4.1.

---

## Already covered — no new image needed

These walkthrough characters already have dedicated photos:

- **Klára** (`klara-profile.jpeg`) + her dog **Eda** (`eda-portrait.jpeg`)
- **Daniel** (`daniel-profile.jpeg`) + his dog **Bára** (`bara-portrait.jpeg`)
- **Filip** (`filip-profile.jpeg`) + his dog **Toby** (`toby-portrait.jpeg`) — the Beat 2 drop-off client and dog

---

## Prompts

### Essential (1) — the fire-off hero asset

**`post-stromovka-walk.jpeg`** — Klára's walk post. Fired off by the viewer in Beat 2 (the canonical "the walk is content + lead-gen" moment).

- **Aspect ratio:** 16:9
- **Reference image:** add `eda-portrait.jpeg` — the black-and-white border collie near the front should look like Klára's dog Eda.

> Casual phone photo of a friendly group dog walk in Stromovka park, Prague — five or six mixed-breed dogs and their owners walking together along a tree-lined gravel path, a black-and-white border collie trotting near the front, late spring with full green chestnut trees, warm morning light, people relaxed and smiling, candid unstaged snapshot. The feel of an easy, social Saturday morning — dogs out together, owners chatting.

### Recommended (2) — replace the Beat-3 stand-ins

Magda and Veronika were seeded with **borrowed images as visual stand-ins** (their `lib/mockUsers.ts` comments say so). Both appear in V2's Beat 3 — Magda on the connection request, her message, and the post-meet review; Veronika when Daniel books her circle-scoped care. Dedicated avatars avoid the same-face collision. No reference image — these are new faces.

**`magda-profile.jpeg`** — Magda Vondráková's avatar (currently borrows `lucie-profile.jpeg`).

- **Aspect ratio:** 1:1

> Casual phone-style portrait of a warm, settled woman in her late 40s, friendly and approachable, standing in a Prague park in late spring, natural daylight, a slight genuine smile, candid snapshot framing.

**`veronika-profile.jpeg`** — Veronika Krásná's avatar (currently borrows `marie-profile.jpeg`).

- **Aspect ratio:** 1:1

> Casual phone-style portrait of a calm, friendly woman in her late 30s, relaxed work-from-home demeanour, soft natural light by a window or on a Prague apartment balcony, candid snapshot framing.

### Optional (3) — polish

Not load-bearing for the guided walkthrough; nice for Open View exploration and overall polish. No reference images — new dogs and a new place.

**`zofka-portrait.jpeg`** — Magda's dog Žofka, a Schnauzer mix (currently borrows `pepik-portrait.jpeg`).

- **Aspect ratio:** 1:1

> Casual phone photo of a small-to-medium schnauzer mix dog with a wiry grey-and-black coat and a characteristic bearded muzzle, sitting calmly on a path in a Prague park, late spring greenery, alert and friendly expression, candid phone snapshot.

**`kuba-portrait.jpeg`** — Veronika's dog Kuba, a 12-year-old Cocker Spaniel (currently borrows `benny-portrait.jpeg`).

- **Aspect ratio:** 1:1

> Casual phone photo of an elderly cocker spaniel, around twelve years old, with a soft wavy golden-brown coat and a gently greying muzzle, lying contentedly on a wooden apartment floor by a window, soft natural light, calm sleepy expression, cozy candid snapshot.

**`community-cover-holesovice.jpeg`** — cover for the Holešovice Dog Block group (currently borrows `evening-walk-group.jpeg`, a fine stand-in).

- **Aspect ratio:** 16:9

> Casual phone photo of a quiet residential street in Holešovice, Prague 7 — handsome early-20th-century apartment buildings, a couple of dog owners chatting on the sidewalk with their dogs, late-spring trees, warm evening light, candid neighbourhood feel.

---

## What changed since the first photo list

The original plan (drafted against the 3-beat Klára → Daniel → Magda structure) had **Žofka's portrait as "recommended."** With the 2-persona restructure, **Magda is now a supporting character, not a POV persona** — the walkthrough never opens her profile, so Žofka's portrait barely surfaces. Žofka downgraded to optional.

The **Beat 2 drop-off client resolved to Filip + Toby** (W2.3) — both already have dedicated photos, so the drop-off needs no new image. (The earlier plan left the drop-off client unresolved.)

Net change: the essential + recommended set is **3 images** (1 essential, 2 recommended); 3 remain optional.
