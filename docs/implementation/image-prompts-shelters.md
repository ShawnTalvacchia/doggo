---
category: implementation
status: active
last-reviewed: 2026-06-08
tags: [enrichment, images, shelters, content]
review-trigger: "after each enrichment batch is generated; revise prompts that produced weak results"
---

# Image Prompts — Shelter Content Enrichment

Generation guide for the shelter content enrichment pass. The Help a Dog Discover door (shipped 2026-06-08) reuses existing portrait + community-cover assets across three shelters and 17 shelter dogs. This doc enumerates the prompts and file destinations for a dedicated image pass that replaces those placeholders with shelter-specific assets.

**Approach.** Per the demo-content-iteration principle, structural surfaces shipped first with thin reused content. This is the enrichment pass — generation happens outside this codebase (the user runs image generation), files land at the paths specified below, references in `lib/mockShelters.ts` + `lib/mockPosts.ts` update to match.

**Scope.** Three shelters (banner + logo each), 17 shelter-dog portraits, two shelter-authored post photos. The two thin shelters (Pes v nouzi, Druhá šance) currently use the same image for both banner and logo — splitting them is part of this pass.

**Not in scope.** Persona portraits, owned-dog portraits, community covers, supporting-cast portraits, walker/supporter avatars on Útulek's Members tab. Those have their own future enrichment passes; this doc stays shelter-only.

---

## Style direction

All assets share a visual vocabulary so the world feels coherent across surfaces:

- **Realistic photography**, not illustration or stylized art. Documentary register — these are real shelters with real dogs, not marketing material.
- **Warm natural light** as the default — soft window light, overcast diffuse, late afternoon. Avoid harsh studio lighting, flashes, or saturated color grading.
- **Czech Republic / Prague context.** Old-stone architecture, mature park trees, tram lines, working-neighbourhood textures (Žižkov, Holešovice, Karlín, Libeň). Avoid generic Western European or US suburban backdrops.
- **Honest mood.** Shelters carry care AND melancholy. A dog photo that looks like a glossy adoption ad doesn't read as a shelter dog. A photo of a dog mid-yawn or staring out a kennel grate does. Don't over-style toward "happy."
- **No anthropomorphizing.** Real dog expressions, real dog body language. Avoid dogs in costumes, party hats, or human poses.
- **No watermarks, no text overlays, no logos.** The product chrome supplies all framing.

When in doubt: think Pieter Hugo's animal documentary work or local Prague photojournalism — grounded, unsentimental, warm-but-real.

### Banners specifically: they must read unambiguously as a shelter

The shelter detail banner is the FIRST thing a viewer sees on `/shelters/[id]`. A passerby with no chrome context should think "this is a place I could adopt a dog" within a half-second. Identity mood ("quiet," "scrappy") is secondary — it tunes the banner once the shelter framing is locked in.

**Required signals (use at least three per banner):**
- **Visible shelter signage** with the name painted, printed, or carved into the scene. Not branded — hand-done.
- **Multiple dogs visible** (or strong hints — two beds clearly in use, multiple leashes hanging, several water bowls). One dog in frame reads as "owned."
- **Operational presence** — a volunteer in a vest or apron, paperwork on a clipboard, an adoption-application visitor mid-meeting, a noticeboard with flyers, a stack of bowls being filled.
- **Public-facing posture** — an open gate, a welcoming entry, someone visibly being shown around — NOT a private intimate scene.

If a prompt only describes the *mood* of the place, the generator will default to "someone's home." Mood layers on top of operational framing, not instead of it.

---

## File conventions

| Asset type | Path pattern | Aspect | Notes |
|---|---|---|---|
| Shelter banner | `/public/images/generated/shelter-{slug}-banner.jpeg` | ~3:1 wide (e.g. 1500×500) | Renders full-width across the shelter detail Feed tab and the DiscoverShelterCard. Top third visible when cropped. |
| Shelter logo | `/public/images/generated/shelter-{slug}-logo.jpeg` | 1:1 square (1024×1024 fine) | Renders as a 48px circle on the DiscoverShelterCard, smaller circles in author bylines + Recent walkers strips. Must read at small sizes. |
| Shelter-dog portrait | `/public/images/generated/shelter-dog-{name}-portrait.jpeg` | 1:1 square (1024×1024 fine, larger OK) | Renders as a 4:3-cropped photo at the top of `ShelterDogCard` (Help a Dog Discover door + shelter Dogs tab), 200px rounded-square hero on `/dogs/[id]`. Subject framed center, breathing room around the dog. |
| Shelter post hero | `/public/images/generated/shelter-post-{shelter-slug}-{name}.jpeg` | 4:3 or 1:1 | Renders inside the post photo gallery on the Feed tab. |

Slugs match the shelter IDs in `lib/mockShelters.ts:mockShelters[].id`: `utulek-liben`, `pes-v-nouzi`, `druha-sance`. Dog names match `PetProfile.id` after the `shelter-dog-` / `pvn-dog-` / `ds-dog-` prefix (e.g. `tonda`, `cira`, `mila`).

After generation, update the four reference sites:
1. `lib/mockShelters.ts` — `bannerUrl`, `logoUrl` on each shelter; `imageUrl` on each dog.
2. `lib/mockPosts.ts` — `photos[]` on the four shelter-authored posts.
3. Remove the placeholder comment block at the top of `lib/mockShelters.ts` ("Image placeholders: lacking shelter-specific assets...").
4. Bump `last-reviewed` in `docs/features/shelters.md` + this doc.

---

## Priority 1 — Shelter banners + logos (6 assets)

These currently reuse community covers. Highest-leverage swap: the banner is the first thing a viewer sees on `/shelters/[id]` and the DiscoverShelterCard.

### Útulek Liběň

> **Identity.** Municipal shelter in Libeň, Prague 8. Established 2007. Roughly 80 dogs rehomed per year. Mid-size operation, vetted walker roster, group-walk culture, Czech + English working languages. Functional, slightly worn, community-loved.

**Banner** → `shelter-utulek-liben-banner.jpeg` (3:1 wide)
> Wide documentary photograph of the entrance to a small municipal animal shelter in Libeň, a working-class neighbourhood of Prague 8. Late afternoon overcast light. Plastered brick exterior wall with a hand-painted "MĚSTSKÝ ÚTULEK PRO PSY" sign mounted prominently above an open green-painted metal gate. Through the gate, low concrete kennel buildings are clearly visible with several dogs visible at the fronts of their kennels. In the foreground, two volunteers in casual coats and high-visibility vests leading three different mixed-breed dogs out for a walk together, mid-stride, candid. A noticeboard beside the gate with a few flyers ("ADOPCE", "DOBROVOLNÍCI VÍTÁNI") pinned to it. Mature plane trees overhead, tram line visible in the distance. Grounded, slightly worn, community-loved. Realistic photography, warm natural light, no marketing polish, no text overlays beyond the painted sign and flyers.

**Logo** → `shelter-utulek-liben-logo.jpeg` (1:1 square)
> Simple printed logo mark for a Czech municipal animal shelter. Hand-drawn line illustration of a dog's head silhouette in profile, friendly mongrel proportions (one ear up, one down), forest green stroke on cream background. Beneath the dog, the words "ÚTULEK LIBEŇ" in a sturdy modest sans-serif, Czech diacritics included. Slight grain like a printed flyer, no gradient effects, no shine. Readable at 48 pixels.

---

### Pes v nouzi

> **Identity.** Small private rescue in Holešovice, Prague 7. Established 2014. Focuses on dogs who slipped through cracks — abandonments, surrenders, late-in-life loss of an owner. Czech-only working language. Scrappy, intimate, small operation with volunteer walkers and foster families.

**Banner** → `shelter-pes-v-nouzi-banner.jpeg` (3:1 wide)
> Wide documentary photograph of a small Czech rescue operation tucked into a Holešovice side street. A converted street-level workshop with the front roller-door open, a hand-painted "PES V NOUZI — PSÍ ÚTULEK" sign mounted across the lintel, paint a little faded. Inside the open doorway, glimpses of kennel pens with two or three dogs visible. Outside in the foreground: three large mixed-breed dogs of different colors lounging on a long bench in the sunshine, one being scratched behind the ears by a young volunteer in jeans, a sweatshirt, and a fabric apron carrying a leash and a clipboard. A handwritten sandwich-board on the pavement reads "DNES ADOPCE — VOLEJTE" with a phone number. Industrial brick wall texture, tram tracks visible in the road, mature linden tree leaning into frame. Warm late-spring light. Grounded, intimate, working-neighbourhood feel. Realistic photography, no marketing polish, no text overlays except the painted sign and sandwich-board.

**Logo** → `shelter-pes-v-nouzi-logo.jpeg` (1:1 square)
> Hand-drawn ink illustration of a mixed-breed dog mid-walk, leash slack, looking back over its shoulder toward the viewer with a soft expression. Single colour: warm rust orange on off-white. Below the illustration, the words "PES V NOUZI" in a slightly uneven hand-lettered serif, Czech diacritics included. Feels like a flyer pinned to a notice board. Readable at 48 pixels.

---

### Druhá šance

> **Identity.** Community-run rescue in Karlín, Prague 8. Established 2018. Helping seniors and special-needs dogs find homes. Small by design — every dog gets a careful match. Czech + English working languages. Quiet, intentional, soft.

**Banner** → `shelter-druha-sance-banner.jpeg` (3:1 wide)
> Wide documentary photograph of a small dog rescue operating out of a Karlín courtyard, Prague 8. A hand-painted wooden sign reading "DRUHÁ ŠANCE" mounted above an open doorway in a plastered terracotta wall. Three wicker dog beds visible at different spots in the courtyard, two clearly occupied: a senior mixed-breed dog (white muzzle) curled in one, a small grey terrier asleep in another. In the foreground, a volunteer in a denim apron showing a hopeful older couple around — the couple are reading an adoption flyer, the volunteer is pointing toward one of the dog beds. A small chalkboard mounted on the wall reads "ADOPCE / NÁVŠTĚVA PO DOMLUVĚ" in chalk handwriting. Soft morning light, leafy fig tree in a planter. The mood is patient and careful — small operation, every match deliberate. Realistic photography, no marketing polish, no text overlays beyond the painted sign and chalkboard.

*Revised 2026-06-08 — first generation read as "older woman with her dog in a private courtyard." Added shelter signage, multiple dogs, an intro-session staging, and a chalkboard so the banner reads unambiguously as a rescue operation rather than a residential courtyard. See "Banners specifically" in style direction.*

**Logo** → `shelter-druha-sance-logo.jpeg` (1:1 square)
> Minimal hand-drawn line illustration of a small heart with an embedded dog paw print, soft warm coral colour on cream. Beneath, the words "DRUHÁ ŠANCE" in a gentle rounded sans-serif, Czech diacritics included, slightly smaller than the icon. Quiet, deliberate, not corporate. Readable at 48 pixels.

---

## Priority 2 — Shelter-dog portraits (17 assets)

Each portrait is a single-dog photograph framed center, the dog as the unambiguous subject, soft natural light, neutral or environmentally suggestive background. Avoid extreme close-ups (we need room around the head for the auto-derived chip overlay). 4:3 or 1:1 framing both work.

When the personality tags include "reactive-on-leash" / "wary-of-strangers" / "shy" — the portrait should reflect that honestly (a slightly guarded body posture, ears back, looking sideways). Don't make every dog beam at the camera. Real shelter-photo register.

**Background MUST signal shelter facility.** A dog photographed in a sunlit Prague apartment window reads as "owned" no matter how good the framing is. Backgrounds should anchor in the shelter's operational space — concrete kennel floors, painted cinderblock walls, chain-link partitions, shelter-issued blankets and bowls, fenced exercise yards with kennel buildings visible behind, a volunteer's apron or hands. The shelter's *own* facility character should come through (Útulek = mid-size municipal kennels; Pes v nouzi = converted-workshop interior; Druhá šance = courtyard with kennel-area glimpses or the small intro office) — but in all cases the viewer should think "this dog is at a shelter" within a second. Personality expresses *within* that frame, not as escape from it.

**No text, signage, or logos in dog-portrait backgrounds.** Image generators produce unstable / garbled writing, and in reality a shelter dog wouldn't be photographed with the rescue's identifying signage in every single frame. Shelter context comes through operational textures — fencing, blankets, bowls, concrete, kennel partitions — NOT through ID cards, clipboards with visible paperwork, painted signs, flyers, or logos in the background. Banners are the ONLY assets where signage is required; dog portraits get the texture without the text.

### Útulek Liběň (8 dogs)

#### Tonda → `shelter-dog-tonda-portrait.jpeg`
> Mixed-breed dog, four years old, around 22 kilos, short tan coat with white chest patch. Goofy open-mouth grin, tongue out, ears alert. Photographed in a fenced shelter yard in afternoon sun, a strip of grass behind him. He looks like he's about to bound forward toward the camera. Personality: enthusiastic, friendly, good with strangers. Realistic photography, warm light.

#### Maja → `shelter-dog-maja-portrait.jpeg`
> Border collie cross, six years old, around 16 kilos, classic black-and-white markings, slightly long muzzle, alert intelligent eyes. Sitting upright on a worn concrete shelter floor, focused intently on something off-camera (a tossed ball, perhaps). Slightly tense posture — she's a sharp dog who's been overlooked because of her reactivity, but you can see the brilliance. Personality: smart, watchful, reactive to other dogs. Realistic photography, soft window light.

#### Šimon → `shelter-dog-simon-portrait.jpeg`
> Senior German shepherd, eight years old, around 34 kilos, classic black-and-tan markings with grey muzzle and tired eyes. Lying on a thick wool blanket inside a shelter kennel, head resting on his paws, looking up gently at the camera without lifting his head. The kind of expression that breaks your heart on purpose. Personality: calm, dignified, lost his person. Realistic photography, soft late-afternoon light filtering through bars.

#### Líza → `shelter-dog-liza-portrait.jpeg`
> Staffordshire cross, three years old, around 20 kilos, brindle coat with white blaze on chest, broad smiling face, ears half-pricked. Mid-action — she's leaning into the camera with her tongue out, body wagging from the shoulders back. Photographed in a sunny shelter yard with woodchip ground. Personality: bubbly, affectionate, can be reactive on leash. Realistic photography, warm sunlight.

#### Edda → `shelter-dog-edda-portrait.jpeg`
> Small terrier mix, two years old, around 9 kilos, scruffy wiry coat in shades of grey and tan, perked ears, bright dark eyes. Sitting on a tile floor with a stick lying in front of her, glancing up as if waiting for someone to throw it. Sharp small-dog energy. Personality: high-energy, loves walks, opinions about cats. Realistic photography, soft indoor light.

#### Káťa → `shelter-dog-kata-portrait.jpeg`
> Mixed-breed dog, five years old, around 12 kilos, medium-length wavy coat in soft cream and caramel, gentle face. Sitting on a quilted bed in a shelter office, body angled slightly away from camera, but looking back over her shoulder with a careful, hopeful expression. Personality: shy, gentle, gold once she warms up. Adoption pending — this might be the photo from her adoption application. Realistic photography, warm window light.

#### Berta → `shelter-dog-berta-portrait.jpeg`
> Czech wolfdog mix, seven years old, around 28 kilos, thick double coat in wolf-grey and cream, prick ears, almond eyes. Standing alone in a quiet shelter corridor, body slightly turned, watching the photographer with measured wariness — not hostile, just guarded. The longest-stayer at Útulek (four months). Personality: wary of strangers, loyal once trusted, needs a quiet home. Realistic photography, cool overcast light, slightly somber mood.

#### Theo → `shelter-dog-theo-portrait.jpeg`
> Labrador puppy, five months old, around 11 kilos, glossy yellow coat with oversized paws and a slightly clumsy proportion, ears flopping. Mid-sit on a vinyl shelter floor, head tilted to one side, tongue just visible. Pure puppy energy held back for half a second. Just arrived with two siblings. Realistic photography, bright cheerful natural light.

---

### Pes v nouzi (5 dogs)

#### Círa → `shelter-dog-cira-portrait.jpeg`
> Beagle mix, three years old, around 14 kilos, classic tricolour beagle markings (white, tan, black) with a soft expression and slightly droopy ears. Sniffing along the base of the chain-link fence of the small Pes v nouzi exercise yard — gravel and dirt ground, the rescue's painted concrete back wall and the corner of the workshop building visible behind her, a battered metal water bowl just within frame. Body angled in profile, nose to the ground tracking a scent. Personality: curious, friendly, nose-driven, gets along with other dogs. Realistic photography, warm light, unmistakably the rescue's fenced yard not a public courtyard.

#### Baron → `shelter-dog-baron-portrait.jpeg`
> German shepherd mix, six years old, around 30 kilos, classic shepherd coloring softened by age (some grey around the muzzle), calm intelligent eyes. Lying just inside the open roller-door of the Pes v nouzi workshop on a thick worn shelter blanket, head up but body relaxed, watching the Holešovice street outside go by. Concrete shelter floor beneath the blanket, the corner of a chain-link kennel partition visible behind him inside the workshop, a stainless steel food bowl beside him. Devoted, patient, waiting. Personality: gentle, calm, lost his person. Realistic photography, soft afternoon light from the open doorway, slightly melancholy mood, unmistakably the rescue's interior not someone's home.

#### Rosa → `shelter-dog-rosa-portrait.jpeg`
> Miniature pinscher, four years old, around 6 kilos, sleek black-and-tan coat, pointed muzzle, prick ears, sharp dark eyes. Perched on top of a stack of folded shelter blankets on a low metal filing cabinet inside the Pes v nouzi workshop, surveying her domain. Looking down at the photographer with unmistakable disdain — small dog energy, fully self-aware. Behind her, the converted workshop interior is visible — painted concrete walls, the corner of a chain-link kennel partition, the open roller-door framing a sliver of a Holešovice street beyond. Personality: independent, smart, bossy. Realistic photography, golden afternoon light from the open workshop doorway, clearly the rescue's interior not an apartment.

#### Archie → `shelter-dog-archie-portrait.jpeg`
> Mixed-breed dog, two years old, around 20 kilos, athletic build with short brindle coat and white socks. Mid-run in the small fenced exercise yard behind the Pes v nouzi workshop — chain-link fence and the rescue's concrete back wall visible behind him, gravel and dirt underfoot, a worn tennis ball lying in the corner. Ears flying, tongue out, pure joy. Action photo with slight motion blur on the legs but face in sharp focus. Personality: high-energy, playful, loves long walks. Realistic photography, bright sunlight, unmistakably the rescue's yard not a public park.

#### Tina → `shelter-dog-tina-portrait.jpeg`
> Spaniel cross puppy, eight months old, around 11 kilos, long wavy chestnut-and-white coat, big soft eyes, slightly oversized ears. Sitting on a worn fleece shelter blanket inside the Pes v nouzi workshop — painted concrete floor, the corner of a chain-link kennel partition visible behind her, a stainless steel water bowl beside her. Looking up at the photographer with complete adoration. A volunteer's hand visible at the edge of frame holding a leash. Pure beginner energy. Personality: sweet, social, ready to learn. Realistic photography, warm light from an open doorway, clearly a rescue space.

---

### Druhá šance (4 dogs)

#### Jasper → `shelter-dog-jasper-portrait.jpeg`
> Labrador mix, five years old, around 25 kilos, glossy chocolate-brown coat with kind eyes and a soft expression. Sitting on a shelter mat in the Druhá šance courtyard rescue, head tilted slightly, ears alert but relaxed. Behind him, the wooden doorway leading into the kennel area is open and one of the wicker dog beds is visible inside. A volunteer's hand resting lightly on his shoulder, a coiled leash held loosely in their other hand. Looks like he'd be excellent with kids. Personality: affectionate, loyal, food-motivated. Realistic photography, warm filtered sunlight through leaves, clearly the rescue courtyard not a private one.

#### Mila → `shelter-dog-mila-portrait.jpeg`
> Senior mixed-breed dog, seven years old, around 15 kilos, soft golden-cream coat with a touch of grey around the muzzle, gentle eyes that have been waiting. Lying in a wicker shelter bed in the Druhá šance kennel area — plastered wall behind her painted a soft terracotta, a stainless steel water bowl on the concrete floor nearby, the edge of a kennel partition visible in the frame. Head on paws, looking out toward the courtyard doorway rather than at the camera, as if watching for someone who hasn't come. A folded shelter-issue fleece tucked under her. The longest-stayer at Druhá šance (two and a half months). Quietly heartbreaking. Personality: gentle, calm, shy, overlooked. Realistic photography, soft overcast morning light filtering through a high window.

#### Bruno → `shelter-dog-bruno-portrait.jpeg`
> Boxer mix, four years old, around 27 kilos, sleek fawn coat with white blaze, classic squared boxer head, bright eager eyes. Mid-pounce on a tennis ball in the small fenced play area behind the Druhá šance courtyard — woodchip and gravel ground, chain-link fence and the rescue's terracotta back wall visible behind him, the corner of a wicker dog bed visible at the edge of frame. Body bunched and joyful. Action photo, sharp focus on the face mid-leap. Personality: bouncy, playful, ball-obsessed, good with other dogs. Realistic photography, bright sunny afternoon, unmistakably the rescue's play yard.

#### Věra → `shelter-dog-vera-portrait.jpeg`
> Senior terrier mix, nine years old, around 8 kilos, scruffy wiry coat in greys and tans, white muzzle, slightly hazy older-dog eyes. Curled up on a folded shelter-issue fleece blanket on a low futon in the Druhá šance intro room — the small office space where adopters meet potential dogs. A simple wooden desk visible behind her with a coiled leash and a stainless steel bowl on top, a row of dog leashes hanging on hooks on the wall, the corner of a kennel partition visible through the doorway behind. Eyes half-closed, deeply content. Knows her routine, knows what she wants. Adoption pending — this is the photo her adopter saw. Personality: senior, calm, gentle. Realistic photography, soft warm interior light, clearly the rescue's intro room not a home living room.

---

## Priority 3 — Shelter-authored post photos (4 assets)

These currently reuse the dog portraits. The shelter feed is one tap deep, but a few purpose-shot photos lift the demo's reality without a lot of effort. Each post frames a *different moment* than the dog's profile portrait so the feed doesn't read as duplicated.

Same rules as P2 — no text/signage/logos in background, shelter-facility anchored, real documentary register. 4:3 or 1:1 framing.

#### Útulek — Theo arrival → `shelter-post-utulek-theo-arrival.jpeg`
> Caption context: "Meet Theo. Five months old, just arrived with two siblings. He's already a goofball." Photo: Yellow Labrador puppy (Theo) tumbling on a vinyl shelter floor inside an intake room, with one of his lookalike puppy siblings half-visible in the corner of the frame, also playing. Theo is mid-tumble with his ears flopping and one paw raised — pure clumsy puppy moment. Worn concrete walls painted a soft cream, a stainless steel water bowl knocked sideways near the edge of frame, a folded shelter blanket on the floor. A volunteer's denim-clad knees just visible at the bottom edge, suggesting someone sitting on the floor with them. Realistic photography, bright cheerful natural light from an overhead window, unmistakably a shelter intake room.

#### Útulek — Berta needs home → `shelter-post-utulek-berta-call.jpeg`
> Caption context: "Berta has been with us for four months. She's wary, she's careful, and she's been completely overlooked. Looking for someone who understands that some dogs need a slow start." Photo: Czech wolfdog mix (Berta) in her kennel at Útulek, lying down at the back of the kennel space with her head on her paws, watching the chain-link kennel door from a safe distance. Painted concrete kennel walls in a faded municipal beige, a folded thick wool shelter blanket beneath her. Slightly distant framing — the photographer is standing OUTSIDE the kennel looking in, suggesting the careful distance she needs. Soft cool overcast light, slightly somber mood. Her expression: not afraid, just patient and reserved, the wisdom of a dog who's been overlooked for four months. Realistic photography, no marketing polish.

#### Pes v nouzi — Baron → `shelter-post-pvn-baron-call.jpeg`
> Caption context: "Baron has been with us seven weeks now. He's the calmest dog you'll meet — and he's been overlooked because he's older." Photo: Senior German shepherd mix (Baron) sitting upright on a worn shelter blanket inside the Pes v nouzi workshop, with a volunteer's hand visible resting gently on his chest, scratching beneath his collar. Baron's eyes are half-closed in contentment, head tilted slightly into the volunteer's hand. The volunteer is mostly out of frame — just a hand, a forearm, the corner of a denim apron. Painted concrete workshop walls behind, the corner of a chain-link kennel partition visible. Realistic photography, soft afternoon light from the open roller-door, warm but melancholy mood — the quiet dignity of a senior dog who knows how to be loved.

#### Druhá šance — Mila → `shelter-post-ds-mila-waiting.jpeg`
> Caption context: "Mila has been waiting two and a half months. She is gentle, quiet, and would be the easiest dog in any household. We're sharing her again because the right person hasn't found her yet." Photo: Senior mixed-breed dog (Mila) sitting upright at the open doorway between the Druhá šance kennel area and the courtyard, framed by the wooden doorframe, looking outward into the empty courtyard. Soft golden-cream coat, white muzzle, ears alert but body relaxed — the patient posture of a dog who waits every day. Plastered terracotta walls of the kennel area visible behind her, the corner of her wicker bed in the kennel area just within frame, dappled courtyard light spilling onto the concrete floor in front of her. The photograph is taken from inside the kennel area looking past her toward the door, so we share her vantage point of waiting. Realistic photography, soft morning light, quietly heartbreaking.

---

## Generation workflow

When running a batch:

1. **Pick one shelter at a time.** Generate the banner, logo, and all its dogs together so the visual register stays consistent within the shelter.
2. **Spot-check the first dog in each shelter** against the banner mood before committing the rest — if the dog portrait feels stylistically off from the banner, adjust the prompt vocabulary before generating the others.
3. **Skip portraits that produce weak results.** A noticeably weak dog portrait reads worse than the existing reused-portrait placeholder. Better to leave the placeholder and revise the prompt for next pass.
4. **After each shelter's batch lands** — drop the files in `/public/images/generated/` with the names listed above, then update the four references listed under "File conventions" in one commit.

If a dog name's transliteration is ambiguous (e.g. `simon` for Šimon), the file slug uses the ASCII version even though the displayed name preserves diacritics. The `id` in `lib/mockShelters.ts` is the source of truth — match the file name to the id's portion after the prefix.

---

## Related

- `docs/features/shelters.md` — shipped surfaces these assets feed into
- `docs/implementation/mock-data-plan.md` — broader cast / data inventory (this doc is one workstream off that one)
- `lib/mockShelters.ts` — current image refs, slated for update after the pass
- `feedback_demo_content_iteration.md` (user memory) — why structural phases ship with thin content and content enrichment runs as a dedicated pass
