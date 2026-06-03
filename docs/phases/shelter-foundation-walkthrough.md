---
status: active
last-reviewed: 2026-06-01
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Shelter Foundation — Walkthrough

Tight verification for the Shelter Foundation phase thesis: **Doggo accepts shelters as a first-class entity, with full page chrome (Feed / Dogs / Members / Gallery), a roster of non-owned dogs whose cards link through to a minimal Dog Profile, and walker-led shelter posts.** Anything not testing that thesis lives elsewhere (doc-update verification → closing checklist; cross-persona permutations → `verification-checklist.md`; tag-system formalization → FC8).

**How to use:**

1. Run the dev server (`npm run dev`, port 3000), or hit the deployed prototype.
2. Walk straight through — should take 5–10 minutes.
3. Tick items as you go. Log surprises in the Decisions section at the bottom.

**Seed context.** One shelter (Útulek Liběň, Libeň/Prague 8) with 8 dogs covering all chip states — `New arrival`, `Long-stayer`, `Adoption pending`, plus dogs in between. 8 walkers across 3 tiers. 12 supporters. ~12 posts (3 shelter-authored, 9 walker-authored). Image assets are placeholders — visuals won't match descriptions perfectly; a real seed pass will generate shelter-specific imagery later.

---

## Workstream A — Shelter page

- [x] **A1. Open `/shelters/utulek-liben`.** Top to bottom: tabs sticky at top, banner (~240px), title + bio + meta row (location · walkers/supporters · since YYYY) + social icons, Follow + Walk-a-dog buttons, dogs-in-care summary card, then the post feed. Walker-authored posts are the majority; each post has the shelter's logo (circle) for shelter-authored OR initials avatar for walker-authored.

- [x] **A2. Tap Follow.** Flips to `Following ▾`. Tap again → menu with Unfollow. Tap **Walk a dog** → sheet opens with the vouching note ("First-time walkers come in for a 30-minute intro visit…"); tap **Express interest** → button flips to `Interest sent ▾`.

- [ ] **A3. Switch tabs.** Tabs stay at top, no banner-jump between tabs (banner is inside the Feed tab body, scrolls within it).

---

## Workstream B — Dogs roster

- [ ] **B1. Dogs tab.** Sort dropdown defaults to **Needs walks now**. Berta sorts first (never walked, 120 days in care — Long-stayer glass chip). Theo appears with the solid green **New arrival** chip. Káťa shows the yellow glass **Adoption pending** chip. Cards 1-up on mobile, 2-up on desktop.

- [ ] **B2. Switch sort.** Try `Longest in care` (Berta still first, 120d), `Smallest first` (Edda's 9kg first), `A–Z` (Berta, Edda, Káťa, Líza, Maja, Šimon, Theo, Tonda).

---

## Workstream C — Dog Profile

- [ ] **C1. Tap any dog → `/dogs/[id]`.** Hero photo (capped at 20rem on tall viewports), name + meta line `breed · age · sex · weight`, backstory, stat row (In care / Last walked, centered, hairline strokes top + bottom), tag chips (energy chip first / Long-stayer if applicable / manual tags), policy strip if soloOnly or experiencedHandlersOnly, Recent walkers row (initials avatars), Posts about [dog], shelter backlink at the bottom.

- [ ] **C2. Visit `/dogs/spot`** (owned-dog id that doesn't resolve as a shelter dog). Graceful "Dog profile coming soon" empty state with a CTA back to the shelter roster — not a 404.

---

## Workstream D — Members tab

- [ ] **D1. Members tab.** Filter pills `All · Walkers · 8 · Supporters · 12`, no Team pill (no linked staff in V1). Walker rows show "Walker · Útulek Liběň" chip + tier label in subline (Trusted handler / Experienced walker / Vetted walker). Supporter rows show the quieter Supporter chip + "Following since …" subline. List sorts by recency.

---

## Workstream E — Gallery

- [ ] **E1. Gallery tab.** Empty-state placeholder pointing at the future Photos & Galleries phase.

---

## Decisions surfaced during walkthrough

Append as you walk — don't wait until the end. Each entry annotates where the decision needs to land (`→ target-doc.md`); phase-close sweep processes the list.

(Add entries below as the walkthrough reveals them.)
