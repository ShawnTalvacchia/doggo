---
status: archived
last-reviewed: 2026-06-08
review-trigger: When any task is completed or blocked
tags: [phase, discover, shelters, cold-start, ways-in]
---

# Help a Dog — Discover Door

**Goal:** Open the fourth Ways In door. Adds a `Help a Dog` card on `/discover` routing to `/discover/help-a-dog`, a browse surface with `Dogs` (default) and `Shelters` pills, and lifts demo shelter density from one to three so the surface reads as a real category and not a single-row directory. After this phase, Útulek is reachable as a front-door experience rather than a direct URL.

**Depends on:**
- Shelter Foundation (closed 2026-06-02) — `ShelterProfile`, `/shelters/[id]`, shelter dog page, walker tier model.
- Photos & Galleries (closed 2026-06-07) — shared posts surface used by shelter dogs; no new work required, but the surfaces it shipped need to keep working for the new shelters.

**Refs:** [[features/shelters]], [[strategy/Product Vision]] → "Ways In", [[strategy/Cold-Start Playbook]] → "The shelter angle", [[meetings/po-briefing-2026-06-07]] → Thread 3, [[phases/Open Questions & Assumptions Log]] §14.

---

## Strategic frame

Three things this phase has to get right:

1. **Door framing — community, not marketplace.** Help a Dog is the non-owner ramp into institutional accounts. Walkers earn credentials and become community anchors. Discover Care is paid-care marketplace. The two doors live as peers on `/discover`; they don't nest. The card copy and surface should read like "browse rescues nearby and meet their dogs" — not "find a volunteer opportunity" or "request a walk." Frame as belonging, not transacting.

2. **Pet-as-protagonist on the results surface.** The bet from the PO briefing is that some users will walk a shelter dog who'd never have sought one out, because the tool made it easy. Lead with dogs (photo-led card feed, "Needs walks now" sort by default) and let shelter context anchor each card. The Shelters pill is the alternate view for users who want to know-the-rescue before picking-the-dog.

3. **Anti-scoreboard discipline carries through.** No "Top shelter this month," no walker leaderboards on Discover, no urgency-as-pressure framing. "Needs walks now" surfaces information for action, not competition. Reuses the existing surface conventions from the shelter page.

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs (po-briefing 2026-06-07, features/shelters, Product Vision Ways In, Open Questions §14, Cold-Start Playbook shelter section)
- [x] Review Open Questions log — flag anything affecting this phase
- [x] Audit for conflicts between phase plan and current codebase (existing `/discover/page.tsx` 3-door layout, shelter page Members pill labelled "Walkers", FilterPillRow + ResultsSectionHeader patterns from Discover Care/Meets)
- [x] Update any referenced docs with `last-reviewed` older than 2 weeks — none affected
- [x] Confirm scope — no tasks that belong in a different phase (walker journey, vouching state machine, operator/admin view, walker-circle elevation all explicitly deferred to the credentialing-moat phase)

### Conflicts surfaced during opening

- **"Walker" vs "Volunteer" label divergence** (po-briefing Thread 3 open decision): Members pill on the shelter page reads `Walkers · 8`; the dog profile uses "Recent walkers." Volunteer badge ladder uses "Volunteer / Regular Volunteer / Super Volunteer." This phase introduces a third user-facing surface (Discover door) that needs a copy decision. **Adopted:** the surface copy frames *action* ("Walk shelter dogs nearby"), and entity references stay as **"walkers"** (the per-shelter members) and **"shelter"** (institutional). The badge ladder stays as-is. Logging this as a workstream item so the resolution is visible and reusable when the credentialing-moat phase opens.
- **No `OrgProfile` generalization yet** (§14 deferred). Discover surfaces only shelters; the design intentionally leaves room for rescue/vet entities to slot in if/when they land, but doesn't pre-build for them. `getAllShelters()` style helpers should be named explicitly so the future generalization is mechanical.

---

## Design decisions

Captured here so the build steps land against fixed targets.

### D1 — Hub-level entry

Add a fourth entry to `CATEGORIES` in [app/discover/page.tsx](app/discover/page.tsx):

```ts
{
  key: "help-a-dog",
  label: "Help a Dog",
  description: "Walk shelter dogs nearby and meet your local rescue.",
  icon: HandHeart,
  href: "/discover/help-a-dog",
}
```

- Icon: `HandHeart` (Phosphor, weight `"regular"` to match the existing three card icons).
- Same card chrome as the other three. No violet tint at the door — the walker-tier violet lives inside the shelter as a credential signal, not at the entry.
- Order on the page: place LAST in the list (after Dog Care). Reads as expansion of the platform's ways in.

### D2 — Route

`/discover/help-a-dog`. Matches the user-facing name, consistent with `/discover/care`, `/discover/meets`, `/discover/groups` slugs.

### D3 — Results surface — Dogs (default) / Shelters pill split

Top-level pills via `FilterPillRow`:

```
[ Dogs · N ] [ Shelters · M ]
```

- **Dogs pill** is the default. Flat photo-led feed of all shelter dogs across all seeded shelters. Pet-as-protagonist.
- **Shelters pill** lists shelter cards (banner + name + neighbourhood + "X dogs in care · Y need walks now" + "View shelter →" action).

Skipping the "in your circle" elevation in V1 — walkers don't bridge to `UserProfile` yet (per [features/shelters](docs/features/shelters.md) "Posts & content visibility"). The elevation hook ("Dogs you've walked," "Shelters your circle volunteers at") lights up when the walker journey ships in the credentialing-moat phase. Worth a placeholder slot in the layout so it's a one-line addition then.

### D4 — Dogs pill — sort + filters

Mirror the shelter Dogs tab where possible so behaviour is predictable.

- **Sort dropdown** (custom-styled, same `SortMenu` pattern from the shelter page): `Needs walks now` (default) / `Longest in care` / `Smallest first` / `A-Z`. Sort options bake direction in; no asc/desc toggle.
- **Filter panel** (behind the Filters float button, mirrors `/discover/care` + `/discover/meets`):
  - Dog size (small / medium / large / any)
  - Energy level (calm / moderate / active / very-high / any)
  - Personality (multi-select chips derived from `personalityTags`: gentle, good-with-strangers, good-with-dogs, puppy, senior, calm)
  - Adoption status (available / pending) — small but real signal

Explicitly **not** in V1:
- Walker-tier eligibility ("dogs I'd be allowed to walk") — vouching doesn't exist; would lie about availability. Lands with the credentialing-moat phase.
- Neighbourhood filter — with 3 seeded shelters in close Prague neighbourhoods, the filter is theatre. Defer until shelter density warrants it.
- "Needs walks now" boolean filter — redundant with the default sort.

### D5 — Shelters pill — card design

Single-column list. Each row:

- Banner thumbnail (3:1 aspect, left-aligned or top depending on width)
- Shelter logo (small, circle — Avatar Rule B for institutional entities)
- Name (h3)
- Meta line: `{neighbourhood} · {N} dogs in care · {M} need walks now`
- Primary action: `View shelter →` (links to `/shelters/[id]`)

No "Browse dogs from this shelter" action in V1 — the shelter page's own Dogs tab is that surface. Avoid stacking two parallel paths to the same content.

### D6 — Dog card on Discover

Reuse `ShelterDogCard` from the shelter page with one addition: an optional `showShelterAttribution` prop. When enabled, render a shelter row at the bottom of the card body (small shelter logo + name). Card width adapts to container: shelter page renders 2-up; Discover renders 1-up for richer presentation and shelter attribution room.

Resist creating a `DiscoverShelterDogCard` variant. The shelter Dogs tab and the Discover Dogs surface should stay visually coherent — same card pattern across both — and a prop is cheaper than a parallel component.

### D7 — Demo density: three shelters

Útulek alone is too thin for a "browse rescues" framing. Seed two additional shelters this phase (PO call 2026-06-08):

- **Pes v nouzi** — already named in [Product Vision](docs/strategy/Product Vision.md) Ways In examples. Holešovice or similar. ~5 dogs, 1 banner, basic info card. No walker roster.
- **Druhá šance** — small Prague-area rescue. ~4 dogs, 1 banner, basic info card. No walker roster.

Each thin shelter:
- Renders `/shelters/[id]` with the same chrome but Members tab is empty-stated ("Members coming soon" or hidden if cleaner).
- Carries its own `ShelterPolicy` defaults.
- Posts feed seeded minimally (1-2 shelter-authored posts to avoid an empty Feed tab).
- No bridged walker personas — same directory-style as Útulek's roster.

This is the density floor. Below three shelters, the Shelters pill reads as broken; at three, the "browse rescues" verb earns its keep. Real shelter conversations may sharpen design details for the next pass.

**Content quality is intentionally thin.** Reuse existing image assets (per the `mockShelters.ts` precedent); placeholder text is fine. A dedicated content-enrichment pass — better images from the user, collaborative text iteration — happens after structural surfaces ship. Do NOT let content quality bottleneck this phase. If a thin shelter reads embarrassingly sparse during the build, flag it for the enrichment pass rather than expanding scope inline.

### D8 — Navigation memory

Source-aware back paths. When the viewer reaches:
- `/dogs/[id]` from `/discover/help-a-dog` → back to `/discover/help-a-dog` (not the shelter Dogs tab).
- `/shelters/[id]` from `/discover/help-a-dog` → back to `/discover/help-a-dog` (not `/home`).

Extend `NavigationMemoryContext` to track the Discover door as a list-page source. The existing pattern (per [features/shelters](docs/features/shelters.md) Navigation) already supports this for Discover Care; same hook.

### D9 — Empty states + edge cases

- **Dogs pill empty after filters:** "No dogs match your filters. Try broadening your search." + reset-filters affordance. Mirror Discover Meets/Groups empty-state pattern.
- **Shelters pill is never empty** (always at least three seeded). No empty-state design needed for V1.
- **Guest viewer:** identical to authenticated viewer. There's no in-circle split, so no guest leakage concern.

### D10 — Posts feed for new shelters

Each thin shelter needs ≥1 shelter-authored post to keep the Feed tab non-empty. Walker-authored posts that interleave via `getShelterFeed()` can stay zero — V1 leaves the walker tagging surface honest (no walker roster → no walker posts). The shelter-authored seed posts can be: "new arrival" or "long-stayer needs a walker today" tone.

---

## Workstream A — Hub card

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Add fourth `Help a Dog` entry to `CATEGORIES` in `app/discover/page.tsx` per D1. Verify card spacing in Vinohrady and 4-up grid hold. | D1 | done |

---

## Workstream B — Discover door page

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Create `app/discover/help-a-dog/page.tsx`. Suspense + Inner pattern matches `/discover/care` and `/discover/meets`. DetailHeader title "Help a Dog", backHref `/discover`. | D2 | done |
| B2 | `FilterPillRow` with Dogs/Shelters pills at the top of the panel body. Default active = Dogs. Counts derive from currently-filtered results. | D3 | done |
| B3 | Dogs view: photo-led card list, custom `SortMenu` matching the shelter Dogs tab pattern. Filter panel behind the Filters float button per D4. | D4 | done |
| B4 | Shelters view: shelter card list per D5. No floating Filters button on this view (no V1 filters). | D5 | done |
| B5 | Empty state per D9 — Dogs pill only. | D9 | done |

---

## Workstream C — Card components

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Extend `ShelterDogCard` with optional `showShelterAttribution` boolean. When true, render `<shelter logo + name>` row at the bottom of the body. Default false → existing shelter Dogs tab behaviour unchanged. | D6 | done |
| C2 | Create `DiscoverShelterCard` in `components/shelters/` per D5. Banner + logo + name + meta line + `View shelter →` action. | D5 | done |

---

## Workstream D — Mock data + new shelter seeding

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Add `Pes v nouzi` to `lib/mockShelters.ts` per D7. ~5 dogs, banner, basic info, ≥1 shelter-authored post. Empty walker roster + empty supporter roster (use the thin-shelter pattern). | D7 | done |
| D2 | Add `Druhá šance` to `lib/mockShelters.ts` per D7. ~4 dogs, banner, basic info, ≥1 shelter-authored post. Empty walker + supporter rosters. | D7 | done |
| D3 | Export `getAllShelters()` from `lib/mockShelters.ts`. Avoid leaking implementation detail to the Discover page. | D7 | done |
| D4 | Audit `/shelters/[id]` rendering against thin-shelter shapes — Members tab empty-state, Feed tab with sparse content, Dogs tab with reduced roster. Whatever doesn't render cleanly gets fixed here. | D7 | done |

---

## Workstream E — Navigation memory

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | Wire `NavigationMemoryContext` to recognise `/discover/help-a-dog` as a list-page source. Back from `/dogs/[id]` and `/shelters/[id]` returns to it when that was the entry path. | D8 | done |

---

## Workstream F — Docs

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | Update [features/shelters](docs/features/shelters.md) → "Discovery" section. Replace the "V1 ships no top-level Discover entry" line with the shipped Help a Dog door description. Note the two thin shelters as Discover-only density seeding. | D3, D7 | done |
| F2 | Update [Product Vision](docs/strategy/Product Vision.md) Ways In table. Remove the "Shelter Foundation phase pending" parenthetical from the Help a Dog row. Update the examples list to include the two new shelters. | D7 | done |
| F3 | Update [Open Questions](docs/phases/Open Questions & Assumptions Log.md) §14. Add a resolved marker for the Discover door. Carry forward the deferred items (walker-circle elevation on Discover, neighbourhood filter, OrgProfile generalization). | D3, D4 | done |

---

## Acceptance Criteria

Pinned to the phase thesis (the fourth door becomes the front entry for the shelter thread). Verify against the running app.

- [x] `/discover` shows four cards. Help a Dog is the fourth; visual weight is equal to the other three.
- [x] Tapping Help a Dog routes to `/discover/help-a-dog`.
- [x] The Discover door page surfaces three shelters and ~17 dogs in total across them (Útulek 8 + Pes v nouzi ~5 + Druhá šance ~4).
- [x] Dogs pill is the default view. Sort defaults to "Needs walks now."
- [x] Each dog card carries shelter attribution and routes to `/dogs/[id]`.
- [x] Shelters pill shows three cards, each routing to `/shelters/[id]`.
- [x] Filter panel applies dog size + energy + personality + adoption status; counts in the pill row update.
- [x] Back from a dog or shelter page reached via Help a Dog returns to `/discover/help-a-dog`.
- [ ] The two thin shelter pages render without empty-tab embarrassment — at minimum, Feed has ≥1 post, Dogs renders the seeded roster, Members reads as intentional (not broken).

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/` (shelters)
- [ ] Update Open Questions log — close resolved (Discover door), add new (walker-circle elevation; thin-shelter authoring authority)
- [ ] Update ROADMAP.md — only if upcoming scope shifted (likely small note: shelter cold-start path now has a front door, sharpens the credentialing-moat phase scope)
- [ ] Review CLAUDE.md — update "Ways In" line if framing changed
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived, then delete original from `phases/`)
- [ ] **Structural audit** — run before marking the phase done:
    - Any files in `docs/phases/` with `status: archived` or `status: complete`? Delete them.
    - Any filename duplicated between `docs/phases/` and `docs/archive/phases/`? Delete the live copy.
    - Any docs in `strategy/`, `features/`, `implementation/` with `last-reviewed` older than 21 days? Review or bump.
    - Any dead references in `README.md`, `CLAUDE.md`, `ROADMAP.md`, `CONTRIBUTING.md` to files that no longer exist? Fix.
- [ ] Check next phase scope for conflicts with what was just built (Carer Portfolio + Shelter Walker Credentialing — verify the door + density work doesn't conflict with the walker-circle elevation slot the credentialing-moat phase will fill)

---

## Build punch list (for the next session)

Sequenced for an efficient build pass. Each line is sized to be a single focused commit.

1. **A1** — Add `Help a Dog` card to `/discover/page.tsx`. Smallest unit, ship first. ~5 min.
2. **D3** — Add `getAllShelters()` to `lib/mockShelters.ts` returning `[utulek]` for now. Sets the helper contract before adding more data.
3. **B1 + B2 + B5** — Stub `/discover/help-a-dog/page.tsx` with the chrome (PageColumn, DetailHeader, FilterPillRow with Dogs/Shelters pills, empty state). Both pills route to placeholder lists pulled from `getAllShelters()` + `flatMap(s => s.dogs)`.
4. **C1** — Add `showShelterAttribution` prop to `ShelterDogCard`. Verify the existing shelter Dogs tab still renders identically without the prop.
5. **B3** — Dogs view: photo-led card list using `ShelterDogCard` with `showShelterAttribution`, single-column layout, `SortMenu` for the four sort options.
6. **B4 + C2** — Build `DiscoverShelterCard`, wire to the Shelters pill.
7. **D1** — Seed Pes v nouzi in `mockShelters.ts`. Confirm `/shelters/pes-v-nouzi` renders. Adjust thin-shelter rendering in `/shelters/[id]/page.tsx` if needed.
8. **D2** — Same for Druhá šance.
9. **D4** — Audit `/shelters/[id]` against thin-shelter cases (empty Members, sparse Feed). Fix any visual breaks.
10. **B3 continued** — Wire the filter panel (size, energy, personality, adoption status). Use existing `MultiSelectSegmentBar` / `CheckboxRow` patterns from sibling Discover surfaces.
11. **E1** — Extend `NavigationMemoryContext` for the new source-aware back paths.
12. **F1, F2, F3** — Doc updates. Land in the same commit as the matching code.

Estimated total: 1-2 focused build sessions.
