---
status: archived
last-reviewed: 2026-06-03
review-trigger: "Closed phase — historical record only"
---

# Dog Profile

**Goal:** A real, unified `/dogs/[id]` profile for owned dogs (entirely new) AND a deepened version for shelter dogs (continues the spine Shelter Foundation shipped), plus Vaccines V1 (structured per-vaccine records replacing the boolean), pet-level standing preferences (likes / dislikes / triggers / play preferences), tag taxonomy formalization (FC8), and a landing slot for the per-dog photo gallery.

**Depends on:** Shelter Foundation (closed 2026-06-02) — provides the shared dog-profile spine the owned-dog side reuses. Photos & Galleries phase (later) — owns the auto-album machinery; this phase only reserves the surface.

**Refs:** [[features/shelters]] (shared dog-profile spine), [[features/profiles]] (PetCard today, treatment ladder, owner-side context), [[meetings/po-briefing-2026-06-02]] (Roman's vaccine + per-walk-preference requirements), [[Open Questions §14]] (shelter dog-profile-relevant open items), [[Open Questions §15]] (Vaccines V1), [[Open Questions §16]] (Vets as a Credentialing Layer — V2 forward direction this phase leaves room for), [[Future Considerations FC8]] (tag system formalization — lands here), [[Future Considerations FC9]] (locked-profile rendering — cross-ref), [[Future Considerations FC11]] (resolver pattern + violet → tokens)

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — flag anything affecting this phase
- [x] Audit for conflicts between phase plan and current codebase
- [x] Update any referenced docs with `last-reviewed` older than 2 weeks — `profiles.md` is 16 days; bumped when first edited in Workstream B/C
- [x] Confirm scope — no tasks that belong in a different phase

---

## Scope Notes

What's already on disk (from Shelter Foundation 2026-06-02) and what this phase adds.

**Shared spine — already shipped for shelter dogs** at `app/dogs/[id]/page.tsx`: full-width hero with name + meta overlay (breed · age · sex · weight), backstory, stat row (hairline strokes — In care · Last walked), tags row (energy-derived + auto Long-stayer + manual), policy strip, recent walkers, posts-about, shelter backlink. Unknown ids fall back to a polite "coming soon" empty state — that's what this phase replaces with the owned-dog branch.

**What's new:** owned-dog branch (Workstream A), Vaccines V1 reshape (Workstream B), standing preferences (Workstream C), tag taxonomy formalization (Workstream D), photo-gallery landing slot (Workstream E), shared-spine parity polish (Workstream F), PetCard → photo-led summary tile that links to `/dogs/[id]` + dog editing relocated to the dog page (Workstream G, added 2026-06-03 during walkthrough).

**Out of scope (deferred — explicitly named):**
- Vaccine gating / verification (§15 V2 + §16 — waits on PO vet conversation)
- Long-stayer card-treatment depth beyond what's shipped (§14)
- Per-dog policy authoring UX (§14 — V3+ shelter operator surface)
- Adopted-dog transition pattern (§14 — V2)
- Carer Portfolio aggregate on dog profile (Credentialing-Moat phase)
- Dog-to-dog social tagging (§3 — post-Demo)
- Photo auto-album mechanics + owner moderation (Photos & Galleries phase)

---

## Workstream A — Owned-dog profile at `/dogs/[id]`

Replace the "coming soon" empty-state fallback with a real owned-dog profile that reuses the shelter spine (pet-as-protagonist hero, sections below).

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Resolver: extend page to resolve owned dogs. Add `getDogByIdAcrossOwners(id)` in `lib/mockUsers.ts` (or unify with `getDogById`) — returns `{ dog, owner: UserProfile }` when found. Page calls shelter resolver first, then owner resolver, then empty-state. | `app/dogs/[id]/page.tsx`, `lib/mockUsers.ts`, [[features/shelters]] → Non-owned dogs | done |
| A2 | Hero + meta line for owned dogs. Reuse the shipped `dog-profile-hero` pattern (full-width photo, name overlay, breed · age · sex · weight). No "Adoption pending" pill. | `app/dogs/[id]/page.tsx` | done |
| A3 | Owner backlink, parallel to shelter backlink: `Lives with {Owner Name} →` with owner avatar (circle per Avatar Rule B). Routes to `/profile/[ownerId]`. | `app/dogs/[id]/page.tsx`, `components/feed/MomentCard.tsx` (resolver pattern) | done |
| A4 | Back-nav: owned-dog parent href routes to the owner's profile (or to `/profile` if self), not to a shelter. Source-aware via NavigationMemory when present. | `app/dogs/[id]/page.tsx`, `contexts/NavigationMemoryContext.tsx` | done |
| A5 | Stat row gating: shelter-care stats (In care · Last walked) suppressed for owned dogs (already gated on `adoptionStatus !== "adopted"`; widen the check to also suppress when there's no `daysInKennel`). | `app/dogs/[id]/page.tsx` | done |
| A6 | Posts-about section: existing `getDogPosts(dog.id)` already works for owned-dog ids (post tags use the dog id). Verify mock posts seed enough owned-dog tags that the section reads populated for at least one persona's dog (Bára for Tereza, Hugo for Daniel — pick the strongest two). Add seed posts only if the read is too thin. | `lib/mockPosts.ts`, `lib/mockShelters.ts:getDogPosts` | done |
| A7 | Visibility gate: the owned-dog profile inherits the owner's profile visibility. Locked owner → locked dog profile (Familiar/Connected viewers only). Open owner → public dog profile. Reuse the existing visibility-gradient machinery. Empty-state for blocked viewers mirrors the locked-profile pattern. | `lib/mockUser.ts`, `app/profile/[userId]/page.tsx` (visibility gating reference) | done |
| A8 | Visual sanity check: owned-dog profile reads complete with realistic seeded data — no obviously-empty sections, no chrome that only makes sense for shelter dogs (policy strip, recent walkers, stat row should all suppress correctly). | running app | done |

---

## Workstream B — Vaccines V1

Replace `VetInfo.vaccinationsUpToDate: boolean` with structured per-vaccine records, owner-acknowledged. Informational only — no gating, no verification.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Type reshape: add `VaccinationRecord { type: VaccinationType; lastGivenAt: string; confidence: "self-declared" }` to `lib/types.ts`. `VaccinationType` enum: `"rabies" \| "parvovirus" \| "distemper" \| "hepatitis" \| "parainfluenza"`. Extend `VetInfo` with `vaccinations?: VaccinationRecord[]` + `vaccinationsAcknowledgedAt?: string` (per-dog single confirm, not per-vaccine). Leave `vaccinationsUpToDate: boolean` in place for one phase as a derived/legacy field; mark deprecated in a JSDoc comment. | `lib/types.ts` | done |
| B2 | Helper: `isVaccinationsCurrent(vet: VetInfo, today: Date): boolean` derived from the records (returns true if `vaccinations.length > 0` and acknowledgement is fresh enough — pick a 12-month-ish threshold for the prototype). Replaces the boolean read everywhere it's consumed. | `lib/petUtils.ts` (new) | done |
| B3 | PetCard reshape: Health & vet section renders the vaccination list as chips (`Rabies · Aug 2025`, `Distemper · Sep 2025`, etc.) when records exist; falls back to "No vaccination records on file" when empty. Drops the legacy single "Vaccinations up to date" check. | `components/profile/PetCard.tsx` | done |
| B4 | Dog-profile chips: surface vaccinations on `/dogs/[id]` as a Health section (icon + vaccination chips list + acknowledgement caption "{Owner} confirmed on {date}"). Shelter-dog path uses the shelter as the acknowledger. | `app/dogs/[id]/page.tsx` | done |
| B5 | Acknowledgement framing in edit: PetEditCard's Health & vet section carries the per-vaccine entries (type select + date picker per row, + / − to add/remove) and a single "I confirm {Dog}'s vaccination record is accurate as of today" checkbox that writes `vaccinationsAcknowledgedAt = today`. Per-dog confirm. | `components/profile/PetEditCard.tsx` | done |
| B6 | Seed migration: migrate all seeded `vaccinationsUpToDate: true` into 5-record arrays with realistic recent dates per dog. Pick dates that span the persona personas (most-recent for active personas; older for less-engaged). Add a 6-month-ago acknowledgement timestamp per dog. | `lib/mockUser.ts`, `lib/mockUsers.ts`, `lib/mockShelters.ts` | done |
| B7 | Future-proofing audit: confirm `confidence: "self-declared"` is the only value V1 emits; comment in the type points at §16 (Vets as a Credentialing Layer) as the V2 forward path. No verification UI, no gating in this phase. | `lib/types.ts`, [[Open Questions §15]] | done |
| B8 | Update `features/profiles.md` Pet Profile Fields table to reflect the structured vaccines field (was: "vaccinations" boolean → now: structured record list + acknowledgement). | `docs/features/profiles.md` | done |

---

## Workstream C — Pet-level standing preferences

Structured fields owners author once, carers see at every booking. Per-booking overrides ("solo today / longer today") explicitly deferred to the third-comms-surface decision.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Type reshape: add `PetProfile.preferences?: { likes?: string[]; dislikes?: string[]; triggers?: string[]; playPreferences?: string[] }`. Each is a list of short chips (free-form strings for V1; controlled vocabulary out of scope). | `lib/types.ts` | done |
| C2 | Display surface on dog profile: new "How {Dog} likes to be cared for" section under tags. Four sub-groups (Likes · Dislikes · Triggers · Play) each rendered as a chip row with a sub-label. Skip groups that are empty. | `app/dogs/[id]/page.tsx`, `app/globals.css` (new `.dog-profile-prefs-*`) | done |
| C3 | Display surface on PetCard (own profile): mirror the dog-profile section, sized for the in-card context. | `components/profile/PetCard.tsx` | done |
| C4 | Edit affordance on PetEditCard: each sub-group as a chip-add input ("Add a like..." → enter to commit, x to remove). Keep authoring lightweight; no autocomplete. | `components/profile/PetEditCard.tsx` | done |
| C5 | Cross-surface: ensure the preferences section is visible on the booking detail Info tab (the carer's "I have this dog" surface) — reuses the same display block on `components/profile/PetInfoSection.tsx` or equivalent if it exists. | `components/profile/PetInfoSection.tsx` (verify path), [[features/explore-and-care]] | done |
| C6 | Seed: 3+ owned dogs get realistic preferences (Bára: dislikes loud noises / triggers strange men in hats / likes squeaky toys; Hugo: dislikes nail trims; etc.). Surfaces the feature for demo. Shelter dogs can also carry preferences where the staff knows them. | `lib/mockUser.ts`, `lib/mockUsers.ts`, `lib/mockShelters.ts` | done |
| C7 | Update `features/profiles.md` Pet Profile Fields table with the new preferences field; cross-link from `features/explore-and-care.md` Key Decision #8 (per-booking overrides remain deferred). | `docs/features/profiles.md`, `docs/features/explore-and-care.md` | done |

---

## Workstream D — Tag taxonomy formalization (FC8)

Split the current free-text `tags: string[]` into three coordinated categories: auto-derived (computed) + curated personality (typed enum) + policy (auto-derived). Migrate seed data, ship helpers, update consumers.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Type changes: add `PersonalityTag` typed union in `lib/types.ts` with the curated vocabulary (initial set: `"affectionate" \| "calm" \| "smart" \| "shy" \| "wary-of-strangers" \| "playful" \| "independent" \| "gentle" \| "good-with-kids" \| "good-with-dogs" \| "reactive-on-leash" \| "selective-with-dogs"` — refine during D2 from seed review). Replace `PetProfile.tags?: string[]` with `personalityTags?: PersonalityTag[]`. | `lib/types.ts` | done |
| D2 | Vocabulary refinement: read every tag in `lib/mockShelters.ts` + owned-dog seeds. Normalize variants ("Reactive to other dogs" → `"reactive-on-leash"`, etc.). Document the final set in code via a `PERSONALITY_TAG_LABELS` map in `lib/constants/dogs.ts` (new file) — label + optional short description per tag. | `lib/constants/dogs.ts` (new), `lib/mockShelters.ts` | done |
| D3 | Auto-derive helper: `deriveAutoTags(dog: PetProfile, today: Date): AutoTag[]` computes Long-stayer / New arrival / Adoption pending / energy-derived. Replaces the inline render-time logic in `app/dogs/[id]/page.tsx` + `components/shelters/ShelterDogCard.tsx`. | `lib/petUtils.ts` | done |
| D4 | Policy chip helper: `derivePolicyChips(dog: PetProfile): PolicyChip[]` returns Solo-only / Experienced-handlers-only chips structurally separate from personality tags. Drives the `dog-profile-policy` strip render. | `lib/petUtils.ts` | done |
| D5 | Render-layer update: dog profile + shelter dog card consume the three helpers (auto + personality + policy) instead of inline-deriving. Dedupe logic moves into `deriveAutoTags` (no manual personality tag duplicates the auto chip). | `app/dogs/[id]/page.tsx`, `components/shelters/ShelterDogCard.tsx` | done |
| D6 | Seed migration: rewrite shelter dog `tags: string[]` entries into `personalityTags: PersonalityTag[]` (drop "Long-stayer" / "New arrival" / "Adoption pending" / energy-derived from manual seeds — those are auto). | `lib/mockShelters.ts` | done |
| D7 | Edit affordance (PetEditCard): personality tags become a multi-select chip picker from the controlled vocabulary, not free-text. Owners pick from a labeled list. Edit affordance for shelter dogs is V3+ (operator surface) — out of scope this phase. | `components/profile/PetEditCard.tsx` | done |
| D8 | Doc updates: `features/shelters.md` → "Dog profile tag taxonomy" section updated from "interim" to "shipped" — move the table to reflect the typed enum + helper-based render. Cross-reference in `features/profiles.md`. | `docs/features/shelters.md`, `docs/features/profiles.md` | done |
| D9 | Future Considerations: mark FC8 as resolved/shipped with a pointer to this phase. | `docs/strategy/Future Considerations.md` | done |

---

## Workstream E — Photo gallery surface hookup

Landing slot only. The auto-album machinery (per-dog auto-album from tagged posts, Highlights pinning, owner moderation) is the Photos & Galleries phase.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | Reserve a "Photos" section on `/dogs/[id]` between Tags and Posts-about. Renders the existing `PetProfile.photoGallery` thumbnails (3-column grid, square crops) when present; empty state when not. | `app/dogs/[id]/page.tsx`, `app/globals.css` | done |
| E2 | Section header carries a "Coming soon: photos from posts" subline (1 line) signaling the Photos & Galleries phase will populate this surface from tagged posts. Plain caption, no CTA. | `app/dogs/[id]/page.tsx` | done |
| E3 | Owned-dog hero photo + curated `photoGallery` continue to surface here (no auto-album yet). PetCard's existing `photoGallery` rendering stays unchanged on `/profile`. | `components/profile/PetCard.tsx` (no-op verify) | done |

---

## Workstream F — Shared spine parity polish

Small items that fall out of giving owned dogs the same spine shelter dogs got. Each one < 30 min.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | Backstory field availability on owned dogs — surface in PetEditCard as an optional "About {Dog}" textarea below Basic info. Surfaces on dog profile as the same `dog-profile-backstory` paragraph the shelter spine uses. | `lib/types.ts` (verify field exists on owned dogs — it does), `components/profile/PetEditCard.tsx`, `app/dogs/[id]/page.tsx` | done |
| F2 | Avatar Rule B check on the owner backlink: owner avatar is a circle (people), dog hero is a rounded-square asset (creature-of-bonding). No mixing. Quick visual pass. | `app/dogs/[id]/page.tsx` | done |
| F3 | Sex / weight meta-line consistency: owned dogs may omit `sex` (per `PetProfile` JSDoc). Hero meta line skips the missing field cleanly (current shelter implementation already filters falsy values — verify). | `app/dogs/[id]/page.tsx` | done |

---

## Workstream G — PetCard → photo-led summary + dog editing relocated to `/dogs/[id]`

Added 2026-06-03 during walkthrough discussion. The expandable PetCard pattern on `/profile` predates the owned-dog profile and now duplicates content the subpage shows better. PetCard becomes a photo-led summary tile (shelter-dog-card visual pattern), tap → `/dogs/[id]`. Dog editing moves off `/profile` and onto `/dogs/[id]`. Profile edit mode mutes the dog cards with a helper line.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| G1 | New `PetSummaryCard` component — photo-led, vertical stack (large square photo + name + breed/sex/age/weight meta), wraps a `Link` to `/dogs/[id]`. Reuses the `.shelter-dog-card-*` CSS family for visual parity. No auto chip overlay; no stat row (those are shelter-only). | `components/profile/PetSummaryCard.tsx` (new), `app/globals.css` (verify shelter dog card classes generalize) | todo |
| G2 | `ProfileAboutTab` view-mode dogs section uses `PetSummaryCard` in a 2-up grid (1-up on narrow) — mirrors the shelter Dogs tab grid. Drops `PetCard` in view mode entirely. | `components/profile/ProfileAboutTab.tsx` | todo |
| G3 | `/profile/[userId]` (other-user) dogs section same refactor — `PetSummaryCard` in grid. Cards link to `/dogs/[id]`; the visibility gate on `/dogs/[id]` handles locked-owner-other-viewer. | `app/profile/[userId]/page.tsx` | todo |
| G4 | Edit-mode disabled view: when `/profile` Edit is active, dog cards stay as `PetSummaryCard` but render muted (lower opacity, no hover, no click). Helper line above the dogs grid: **"Edit a dog's details from its profile."** "+ Add a dog" button stays — tap creates a blank pet + routes to `/dogs/[newId]` for filling out. | `components/profile/ProfileAboutTab.tsx`, `app/globals.css` (`.pet-summary-card--disabled` modifier) | todo |
| G5 | `/dogs/[id]` page header for owned dogs: when viewer === owner, title becomes **"{firstName}'s Dogs"** (was the dog's name); back arrow routes to `/profile?tab=about` (was already correct but reconfirm). DetailHeader title for non-owners stays the dog name. | `app/dogs/[id]/page.tsx`, `contexts/PageHeaderContext.tsx` | todo |
| G6 | Multi-dog owners get a sibling tab strip below the DetailHeader on `/dogs/[id]` — `Franta · Bella` style. Single-dog owners render no tab strip (saves space). Reuses the existing `TabBar` primitive. Tap → routes to the sibling's `/dogs/[id]`. | `app/dogs/[id]/page.tsx`, `components/ui/TabBar.tsx` (or equivalent) | todo |
| G7 | Owner Edit affordance on `/dogs/[id]`: when viewer === owner, Edit button in the page-action slot (same `PageHeaderContext.pageAction` pattern profile uses). Toggling Edit swaps to Cancel + Save and locks the nav. Renders `PetEditCard` for that single dog as the edit body. | `app/dogs/[id]/page.tsx`, `contexts/PageHeaderContext.tsx`, `components/profile/PetEditCard.tsx` | todo |
| G8 | Delete dog flow on `/dogs/[id]` edit. Existing PetEditCard summary-row Trash button keeps working as the delete action; on delete, navigates back to `/profile?tab=about`. | `app/dogs/[id]/page.tsx`, `components/profile/PetEditCard.tsx` | todo |
| G9 | Add dog flow: `ProfileAboutTab` "+ Add a dog" button creates a new pet record with a generated id and minimal placeholder fields, then navigates to `/dogs/[newId]?edit=1` (or routes into edit mode by default on first visit). PetEditCard handles the empty-state placeholder pattern (which it already does via `defaultExpanded` auto-expand for new pets). | `components/profile/ProfileAboutTab.tsx`, `app/dogs/[id]/page.tsx`, `lib/mockUser.ts` (or session-state hook for pet creation) | todo |
| G10 | Walkthrough item updates: B2/B3 (vaccines on PetCard + edit) move to PetSummaryCard / `/dogs/[id]` edit. C2 (preferences edit) moves to dog page edit. D3 (personality tag picker) moves to dog page edit. | `docs/phases/dog-profile-walkthrough.md` | todo |
| G11 | Doc updates: `features/profiles.md` "Pet management" section reflects the new pattern (cards link out; editing on dog page). `features/shelters.md` Dog Profile section notes the editing affordance is owner-side on `/dogs/[id]`. | `docs/features/profiles.md`, `docs/features/shelters.md` | todo |

---

## Acceptance Criteria

Walked against the running app at phase close.

- [ ] Visiting `/dogs/<owned-pet-id>` for Bára, Hugo, Franta, Bella, etc. renders a real owned-dog profile — no "coming soon" fallback.
- [ ] Owned-dog hero matches the shelter-dog hero shape (full-width photo + name + meta).
- [ ] Owner backlink resolves to the owner's profile; the route mirrors the shelter backlink.
- [ ] Vaccines render as structured chips on both PetCard (own profile) and `/dogs/[id]` (dog profile). Acknowledgement caption surfaces who confirmed and when.
- [ ] PetEditCard authors vaccine records via per-row inputs + single per-dog acknowledgement checkbox. Saves clean.
- [ ] Standing preferences (Likes / Dislikes / Triggers / Play) surface on the dog profile, in PetCard, and in the booking detail Info tab — all reading from the same data.
- [ ] `personalityTags` is a typed enum app-wide; no remaining `tags: string[]` references on shelter dogs in seed data.
- [ ] Auto-derived chips (Long-stayer, New arrival, Adoption pending, energy) come from `deriveAutoTags` — no manually-seeded duplicates.
- [ ] Policy strip continues to render via `derivePolicyChips` (no regression on shelter dogs).
- [ ] Photos section reserves space on `/dogs/[id]` with the "Coming soon" signal; existing `photoGallery` thumbs surface when seeded.
- [ ] Locked owner → locked dog profile gates correctly per the visibility-gradient rules; Familiar/Connected viewers see expanded content.
- [ ] FC8 marked resolved in Future Considerations. `features/shelters.md` "Dog profile tag taxonomy" section updated from interim → shipped. `features/profiles.md` Pet Profile Fields table updated for vaccines + preferences.

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Sweep the walkthrough's "Decisions surfaced" section — propagate every entry to its home doc per CONTRIBUTING.md
- [ ] Update all affected feature docs (`features/profiles.md`, `features/shelters.md`, possibly `features/explore-and-care.md` for the preferences cross-link)
- [ ] Update Open Questions log — close §15 V1 portion (vaccines structured + acknowledged; V2 gating/verification + §16 vets remain open); close FC8; revisit §12 photo-gallery surfacing
- [ ] Update ROADMAP.md if upcoming scope shifted (likely: Carer Portfolio + Shelter Walker Credentialing phase row, since vaccine confidence field is groundwork; Photos & Galleries phase row, since landing slot exists)
- [ ] Review CLAUDE.md — no expected structural changes; verify "Core Principles" + nav stay accurate
- [ ] Review Punch List for completed-since-last-close items that touched these surfaces
- [ ] Archive this phase board AND walkthrough — `status: archived` + `git mv` to `docs/archive/phases/`
- [ ] Trim pass
- [ ] **Structural audit:**
  - `grep -rl "status: archived\|status: complete" docs/phases/` returns only legitimate paused phases
  - No filename overlap between `docs/phases/` and `docs/archive/phases/`
  - No `last-reviewed` older than 21 days in `strategy/` / `features/` / `implementation/`
- [ ] Strategic review — what changed, what open questions earned a research pass, alternatives, next-phase readiness
