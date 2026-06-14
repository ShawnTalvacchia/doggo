---
status: active
last-reviewed: 2026-06-12
review-trigger: "Delete once the Adoption-Curious Journey images are generated + wired"
---

# Adoption-Curious Journey — Image generation prompts

A focused shot-list for the phase's placeholder / reused images. You generate them; I'll wire the new files (the two **Required** ones are drop-in overwrites and need no code change).

## House style (apply to every prompt)

Match the existing generated imagery so the new ones blend in:

- **Realistic, natural-light documentary photography** — candid, warm, a little imperfect. Not studio, not stylized, no illustration.
- **Prague setting** where a background shows (leafy residential streets, parks like Stromovka, a modest municipal animal shelter).
- **No text anywhere in frame** — no signage, kennel nameplates, watermarks, captions. (The current Nora placeholder has a stray "MIA" nameplate — avoid that.)
- **Square 1:1** for portraits/avatars; **4:5 portrait** for the walk-recap post photos (noted per item).
- Save by **overwriting the exact path** listed. Filenames in _Recommended_ are new — generate them and tell me, I'll point the seed at them.
- **Each prompt is self-contained — Flow does NOT remember earlier prompts.** Any subject that must look identical across multiple images (that's **Nora** — items #2, #3, #4) carries her **full physical description repeated verbatim** in every prompt. Don't write "the same dog." The locked description is below; paste it as-is each time.

### Nora — canonical look (paste this exact sentence into #2, #3, and #4)

> a gentle medium-sized mixed-breed dog, about 18 kg and knee-height, with a short sandy-tan coat, a slightly darker tan muzzle, soft ears that fold over at the tips, warm dark-brown eyes, a small white patch on her chest, a lean but sturdy build, and a calm, soft, sweet expression

If a generation drifts off these features (wrong colour, pricked ears, no chest patch, too big/small), regenerate — consistency across her three photos matters more than any single shot.

---

## Required (replace the placeholders)

### 1. Eliška Dvořáková — persona avatar
- **Path (overwrite):** `public/images/generated/eliska-profile.jpeg`
- **Who:** the Adoption-Curious Explorer — late-20s Czech woman, Žižkov; grew up with a dog, wants one but isn't sure her life suits it yet, so she's started walking shelter dogs. Warm, approachable, a little thoughtful.
- **Prompt:**
  > Candid waist-up portrait of a warm, approachable Czech woman in her late twenties, shoulder-length hair, casual everyday clothes (light jacket or knit), standing on a leafy Žižkov residential street in soft afternoon daylight. Friendly, slightly thoughtful expression — a dog lover who doesn't have a dog yet. Natural documentary style, shallow depth of field, gentle natural light, no text or signage in frame. Square 1:1.

### 2. Nora — shelter portrait (the focal long-stayer)
- **Path (overwrite):** `public/images/generated/shelter-dog-nora-portrait.jpeg`
- **Who:** gentle medium mixed-breed, ~18 kg, 5 yrs, female. Came in when her elderly owner went into care; shrinks to the back of the kennel and gets overlooked — the lovely dog nobody notices. Tags: gentle, affectionate, good with strangers/dogs, loves walks.
- **Prompt:**
  > Portrait of a gentle medium-sized mixed-breed dog, about 18 kg and knee-height, with a short sandy-tan coat, a slightly darker tan muzzle, soft ears that fold over at the tips, warm dark-brown eyes, a small white patch on her chest, a lean but sturdy build, and a calm, soft, sweet but slightly reserved expression. She is resting calmly in a clean, modest animal-shelter kennel or doorway in soft natural light — the calm, hopeful dog people overlook. Realistic documentary photo, shallow depth of field. Absolutely no kennel nameplate, sign, or any text in frame. Square 1:1.

---

## Recommended (so the recaps are real "adoption ads," not kennel shots)

Nora's two walk-recap posts currently reuse the kennel portrait. Her whole story is "a different dog the moment she's out" — walk photos make the advocacy loop land. **Same dog as #2.**

### 3. Nora on a walk — Eliška's recap (the lead ad)
- **Path (new):** `public/images/generated/post-nora-walk-eliska.jpeg`
- **Prompt:**
  > A gentle medium-sized mixed-breed dog, about 18 kg and knee-height, with a short sandy-tan coat, a slightly darker tan muzzle, soft ears that fold over at the tips, warm dark-brown eyes, a small white patch on her chest, a lean but sturdy build, and a soft sweet expression — now out on a leashed walk in a Prague park (Stromovka) in spring, relaxed and visibly happy, mid-stride or pausing to sniff the grass, clearly enjoying herself. Warm late-afternoon light, candid phone-snapshot feel, greenery behind. No text in frame. 4:5 portrait.

### 4. Nora on a walk — Marie's recap (reinforcement)
- **Path (new):** `public/images/generated/post-nora-walk-marie.jpeg`
- **Prompt:**
  > A gentle medium-sized mixed-breed dog, about 18 kg and knee-height, with a short sandy-tan coat, a slightly darker tan muzzle, soft ears that fold over at the tips, warm dark-brown eyes, a small white patch on her chest, a lean but sturdy build, and a soft sweet expression — sitting on the grass on a walk, looking up toward the camera with a contented expression, leash visible, park greenery and dappled light behind. Candid, warm, everyday-snapshot feel. No text in frame. 4:5 portrait.

---

## Optional

### 5. Group shelter walk — cover
- **Current:** reuses `public/images/generated/group-walk-stromovka.jpeg` (an existing real group-walk image) — perfectly fine, skip unless you want one specific to the mixed shelter-dog walk.
- **If you want a fresh one (path new — tell me and I'll wire it):** `public/images/generated/group-walk-utulek.jpeg`
- **Prompt:**
  > A small, friendly group of people walking several dogs together on a leafy Prague park path in spring morning light — a mix of pet dogs and one or two shelter dogs along for the walk. Relaxed, social, candid documentary style, natural light, no text in frame. Landscape 3:2.

---

## After you generate

- **#1 and #2** — just overwrite the files at the paths above; nothing else needed.
- **#3 / #4 / #5** — drop them in and ping me; I'll point the recap posts (`post-walker-eliska-nora`, `post-walker-marie-nora`) and/or the group-walk cover at the new files. (The seed currently points the recaps at Nora's portrait, so the build stays safe until then.)
