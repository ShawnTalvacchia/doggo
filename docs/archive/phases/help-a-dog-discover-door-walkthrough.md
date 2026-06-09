---
status: archived
last-reviewed: 2026-06-08
review-trigger: "Update as items are walked, edit as scope adjusts"
tags: [walkthrough, discover, shelters]
---

# Help a Dog — Discover Door — Walkthrough

Verification checklist for the Help a Dog phase. Pinned to the phase thesis: **does Útulek now have a real Discover entrance, and does the surface scale to 2-5 seeded shelters?**

**How to use:**
1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, `/demo`, or `?as=<personaId>`.
3. Walk top-to-bottom — categories are ordered by "needs your eyeballs most" → "least."

**Status legend:** `[ ]` not walked · `[x]` walked, no issues.

**Available personas:** Tereza (Vinohrady connector), Daniel (anxious new owner, locked profile), Klára (trainer with Care group), Tomáš (Karlín professional), New User.

**Phase seed data note:** Three shelters total — Útulek Liběň (full roster, 8 dogs), Pes v nouzi (thin, 5 dogs), Druhá šance (thin, 4 dogs). Walker rosters: full on Útulek, empty on the two thin shelters by design. Two thin-shelter posts seeded (one each) so Feed tabs aren't empty.

---

## Open for your call

- [x] **O1. SortMenu inlined, not extracted.** The shelter Dogs tab and the Help a Dog Dogs view both render a custom-styled sort dropdown with outside-click + Esc handling. The two copies are now near-identical. I kept them inline rather than extracting to a shared `<SortMenu />` component because (a) the trigger uses shelter-prefixed CSS that'd need generalizing, and (b) extracting it as part of this phase widens blast radius beyond the scope. Logged for the Design System Cleanup phase. (Tereza → `/discover/help-a-dog` and `/shelters/utulek-liben?tab=dogs` to compare.)
- [x] **O2. In-circle elevation deliberately skipped, no placeholder reserved in the layout.** The Discover Care / Meets surfaces split results with `ResultsSectionHeader` (in-circle / other). Here I render a flat list. The walker journey will eventually give us "dogs you've walked" / "shelters your circle volunteers at" — but neither bridges through `UserProfile` today, so any split would be theatre. If you want a visible reservation in the layout (a slot that lights up later), say so and I'll wire it; right now there's nothing in the source that names the future hook.
- [x] **O3. ~~Single-column Dogs grid on Discover, 2-up on the shelter page.~~ Resolved 2026-06-08 — Discover grid now mirrors `.shelter-dogs-grid` (2-up via `repeat(auto-fit, minmax(220px, 1fr))`). Same component, same grid, only the shelter attribution row differs.**
- [x] **O4. Personality filter is a curated subset of the `PersonalityTag` vocabulary, not all 17.** I picked 8 adopter-shopping lenses (gentle / good-with-strangers / good-with-dogs / good-with-kids / loves-walks / puppy / senior / calm) and excluded the eligibility-flavored tags (reactive-on-leash / wary-of-strangers / selective-with-dogs). Those latter are walker-eligibility signals; surfacing them as filters invites the wrong question ("show me reactive dogs" reads weird on a volunteer-walker entry door). Extend cautiously if you want a wider list. (Tereza → `/discover/help-a-dog` → Filters → Personality accordion.)

---

## Worth verifying

- [x] **V1. Back nav from a dog reached via Discover.** Tereza → `/discover/help-a-dog` → tap any dog (e.g. Berta, top of the Needs walks now sort) → DetailHeader back button should read "Help a Dog" path, not "Útulek Liběň ▸ Dogs." I confirmed `backHref` resolves to `/discover/help-a-dog` for shelter dogs reached this way. Then visit `/dogs/shelter-dog-berta` directly (no Discover in history) and confirm back falls through to the shelter Dogs tab — the tree-hierarchy default.
- [x] **V2. Back nav from a shelter reached via Discover.** Tereza → `/discover/help-a-dog` → Shelters pill → tap "Druhá šance" → back returns to `/discover/help-a-dog`, not `/home`. Already source-aware before this phase, but the new route surface as `lastListPath` is new.
- [x] **V3. "Needs walks now" sort surfaces never-walked first, then oldest `lastWalkedAt`.** Berta (no walks yet, 120d in care) and Tonda (5d ago) should be at or near the top with `Needs walks now` selected. Switching to `Longest in care` should also surface Berta first (120d). `Smallest first` should put Theo (puppy, 11kg) or Rosa (6kg) at the top.
- [x] **V4. Filter panel cross-shelter correctness.** Tereza → Filters → tick Adoption status > "Pending adoption" → "View N results" should surface only the dogs with `adoptionStatus === "pending"` across all three shelters (Káťa at Útulek, Věra at Druhá šance). Combining filters (e.g. Small + Adoption pending) should narrow to the intersection.
- [x] **V5. Shelters pill renders three shelters with the right counts.** Útulek "8 dogs in care · 5 need walks now"; Pes v nouzi "5 dogs in care · 1 need a walk now"; Druhá šance "4 dogs in care · 2 need walks now" (or whatever `countDogsNeedingWalks` resolves at the demo clock).

---

## Surfaces to glance

- **G1.** Tereza → `/discover` — Four hub cards, "Help a Dog" is the fourth, HandHeart icon, copy "Walk shelter dogs nearby and meet your local rescue."
- **G2.** Tereza → `/discover/help-a-dog` — Dogs pill default (Dogs · 17), Sort by Needs walks now, photo-led cards with shelter attribution row.
- **G3.** Tereza → `/discover/help-a-dog` → Shelters pill — Three shelter cards (banner + circular logo overlap + name + meta).
- **G4.** Tereza → `/discover/help-a-dog` → Filters → all four filter sections render (Dog size / Energy / Adoption status / Personality accordion).
- **G5.** Tereza → `/shelters/pes-v-nouzi` — Thin-shelter Feed tab. Meta row reads `Holešovice, Prague 7 · since 2014` (NO "0 walkers, 0 supporters" line). Dogs-in-care card reads "5 dogs in care." One shelter-authored post about Baron.
- **G6.** Tereza → `/shelters/pes-v-nouzi?tab=members` — Empty state title "Walkers and supporters coming soon," subtitle "Pes v nouzi is small. Walkers join through a coordinator-led intro session." Filter pills read `Walkers · 0 / Supporters · 0`. No Team pill (zero linked staff).
- **G7.** Tereza → `/shelters/druha-sance?tab=dogs` — Four dog cards, Mila (75d in care) shows the Long-stayer chip overlay, Věra shows Pending adoption.
- **G8.** Tereza → `/shelters/utulek-liben` — Existing Útulek surface unchanged (regression check — `ShelterDogCard` default behaviour identical without the `shelter` prop).

---

## Decisions surfaced during walkthrough

Running log — append as decisions land. Each entry carries a `→ target-doc.md` annotation for the phase-close sweep.

- **SortMenu kept inline rather than extracted.** Two near-identical copies live in `app/shelters/[id]/page.tsx` and `app/discover/help-a-dog/page.tsx`. PO call (2026-06-08) confirmed: extract during Design System Cleanup phase along with other consolidation candidates, rather than mid-phase. Logged as FC15. → `strategy/Future Considerations.md` FC15.
- **Three Discover personality lenses dropped from the vocabulary** (`reactive-on-leash`, `wary-of-strangers`, `selective-with-dogs`). These are walker-eligibility signals, not adopter shopping lenses. Open vocabulary stays the same — only the Discover filter subset is curated. → `features/shelters.md` Discovery section (documented inline in this phase's doc update).
- **Discover Dogs grid mirrors the shelter Dogs-tab 2-up grid.** Initially shipped single-column for richer presentation, walked back to match the shelter page's `.shelter-dogs-grid` after PO review. Same `repeat(auto-fit, minmax(220px, 1fr))` formula. → `features/shelters.md` Discovery section (Dogs pill description updated).
- **Thin-shelter meta-row + Members-tab empty-state adjustments.** Three small changes in `app/shelters/[id]/page.tsx`: hide the walkers/supporters meta line when both are zero; show a partial when only one side is zero; rewrite the Members tab "no members" copy to read as intentional (forward-looking) rather than as a filter-switching prompt when the rosters are genuinely empty. → `features/shelters.md` "Thin-shelter rendering" subsection added.
- **`/dogs/[id]` back-nav source rule (two-signal).** Tree-hierarchy default wins whenever the IMMEDIATELY previous URL was a shelter detail (`previousPath?.startsWith("/shelters/")`); otherwise source-aware to `lastListPath` when it starts with `/discover/`; otherwise tree-hierarchy. Discover → shelter → dog returns to the shelter Dogs tab (the user was inside the shelter context); Discover → dog returns to Discover. Required extending `NavigationMemoryContext` with `previousPath` (any-path tracker, parallel to the existing list-level `lastListPath`). → `features/shelters.md` Navigation section (documented in this phase's doc update).
- **In-circle elevation slot deliberately not reserved in layout.** Decided to ship the flat list without a placeholder. If we want a visible "Dogs you've walked" hook in the source as a TODO marker, that's a one-line addition the credentialing-moat phase will need anyway. → no feature-doc update needed; flag if O2 comes back as "reserve it now."
- **Two thin shelters seeded for density** (Pes v nouzi + Druhá šance). The PO call (2026-06-08) lifted shelter count from 1 to 3 so the Shelters pill reads as a real category. Walker + supporter rosters intentionally empty — walker journey is the next phase. → `features/shelters.md` Discovery (documented inline).
