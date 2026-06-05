---
status: active
last-reviewed: 2026-06-04
review-trigger: When any task is completed or blocked; when prerequisite Open Questions resolve
---

# Photos & Galleries

> **Status: active (opened 2026-06-04).** Sketched 2026-05-11 during Profiles Deep Pass walkthrough (B6 surfaced the gap — Spot's manually-curated `photoGallery` thumbnails read as static, with no way to browse the broader stream of posts tagging him). Strategic resolutions live in `Open Questions & Assumptions Log` §12; the three 2026-06-01 phase-blockers (moderation set, tag-approval inheritance, cross-pet households) all resolved. The two remaining §12 open items (post-publish tag adding, albums-as-tag-type) are explicitly V2+ and out of scope here.

**Goal:** Photos in posts surface naturally on the things they're about — dogs, people, places — gated through the existing two-gate privacy model. Owners get curated control (Highlights) on top of an auto-derived stream (Photos grid). Care providers' photo contributions to clients' dogs flow back as content the owner values, without becoming portfolio fodder.

**Depends on:**
- **Dog Profile** (closed 2026-06-03) — `/dogs/[id]` is canonical, the Photos landing slot is in place, PetCard is retired in favor of `PetSummaryCard` linking out, `personalityTags` is a typed enum + tag-taxonomy helpers in `lib/petUtils.ts` are in place.
- **Profiles Deep Pass** (closed 2026-05-11) — `Post.tags: PostTag[]` shape; mutual-connections section pattern as a reference for "compact + Show all modal."
- **Shelter Foundation** (closed 2026-06-02) — `getDogPosts(dogId)` resolver in `lib/mockShelters.ts` already filters posts by `tag.type === "dog"` (dog-agnostic; works for owned-dog ids too); `ShelterProfile.tagApproval` already wired as the shelter-dog authority.
- Content Visibility Model — already prescribes the two-gate rules + filterable gallery pattern; this phase implements it.

**Refs:** [[profiles]], [[Content Visibility Model]], [[Trust & Connection Model]], [[meets]], [[design-system]], [[archive/phases/dog-profile]] (landing slot context + Workstream G shape).

**Not in scope:**
- **Carer Portfolio aggregate** (completed-engagements → "X dogs trained" / "X sessions completed" trust signal) — lives on the merged Carer Portfolio + Shelter Walker Credentialing phase; tags do not aggregate to portfolios (§8 abuse-resistance).
- **Post-publish tag adding** (V2+ §12 open item) — neither author "edit tags" nor non-author "suggest tag" surfaces.
- **Albums-as-tag-type** (V2+ §12 open item) — no album CRUD; V1 ships Highlights (curated, per-dog) + auto-album (tag-filtered view) only.
- **Shelter operator moderation UI** — shelter-side enforces `ShelterProfile.tagApproval` read-only; no untag/hide/pin operator surface (V3+ per [[features/shelters]] "Deferred").

---

## Audit notes (2026-06-04 opening)

Captured during opening so future readers know what shifted between draft (2026-05-11) and active:

- **Surface shift.** Draft assumed PetCard as the per-dog auto-album surface. Dog Profile phase (2026-06-03) retired PetCard in favor of `PetSummaryCard` tiles linking to `/dogs/[id]`, and reserved a "Photos" landing slot between Recent walkers / Health and Posts at `app/dogs/[id]/page.tsx:712`. The auto-album surface IS that slot. Workstream A targets it directly; Workstream C (Highlights) renders above it on the same page.
- **Resolver already exists.** `lib/mockShelters.ts:472` `getDogPosts(dogId)` is dog-agnostic — it filters all posts by `tag.type === "dog" && tag.id === dogId`. Works for owned-dog ids too. Decision (locked in below): move + extend with a viewer arg, rename to clarify it's app-wide. New home: `lib/dogPosts.ts`.
- **§12 pre-decided.** Long-press vs menu (resolved: per-post three-dots `Untag/Report/Block`, long-press on album photo `Hide/Pin`, per-dog Photos-tab `Auto-approve/View hidden/Clear pinned`), tag-approval inheritance (resolved: owner is authority, shelter is authority for shelter dogs), cross-pet households (resolved: separate per-dog albums, no aggregate owner-level "all my dogs" primary view).
- **`photoGallery` field plan.** ~~Keep the field name, evolve semantics in place — JSDoc rewritten to "Highlights: owner-curated pinned photos." Only ~6 callsites and PetCard is going away.~~ **Renamed 2026-06-04** to `PetProfile.highlights` for symmetry with the new `UserProfile.highlights` field. ~6 callsite mechanical rename + seed migration.
- **Seed audit.** Anchor-dog tagged-post counts are thin: Bára=3, Hugo=2, Franta=4, Bella=1. Target 5–10 each for demo readiness. Shelter dogs already populated from walker-led posts (Shelter Foundation).
- **"posts ≈ photos" insight (2026-06-04).** Every Post has 1–4 photos; Posts and Photos collections are largely the same data. User-level grid lands as a List⇄Grid view toggle on the existing Posts tab — no new tab, no `?tab=photos` route.

---

## Opening Checklist

- [x] Read every task and its referenced docs
- [x] Confirm Open Questions §12 resolutions are still current (auto-album + Highlights, tag-approval inheritance, moderation set, cross-pet households)
- [x] Audit `Post.tags` seed coverage for anchor dogs (results in audit notes above — drives Workstream F)
- [x] Confirm `PetProfile.photoGallery` plan — keep name, evolve semantics in place
- [x] Re-read Content Visibility Model — confirmed the "tags never expand audience" rule (line 183) is the load-bearing constraint for non-owner viewers + tag-approval authority clause (line 185 — `ShelterProfile.tagApproval` for shelter dogs)
- [x] Punch list scan — no items load-bearing; P74 connection-seed audit cleared in commit 18c466c

---

## Tasks

### Workstream A — Per-dog auto-album on `/dogs/[id]`

Replace the "Coming soon" caption in the existing Photos landing slot with a real viewer-aware auto-album.

| # | Description | Status |
|---|-------------|--------|
| A1 | New `lib/dogPosts.ts` with `getPostsByDog(dogId, viewerId)` — filters all posts by dog tag AND viewer two-gate visibility. Migrate the existing `getDogPosts(dogId)` from `lib/mockShelters.ts` into this file (rename to `getPostsByDog`; keep a thin shelter-side re-export if call-site churn is large). Owner viewing own dog: returns ALL tagged posts regardless of relationship to poster (owner is the dog's authority). Non-owner viewers: returns only posts that pass the Content Visibility Model two-gate. Encode the rule in docstring + a comment pointing at `Content Visibility Model.md` line 183 (tags never expand audience). | todo |
| A2 | `DogPhotosGallery` component — viewer-aware grid of post photos (3-col mobile, 4-col desktop), each tile = the post's first photo, square crop. Tap → opens the parent post in context (existing post detail surface). | todo |
| A3 | Wire `DogPhotosGallery` into the existing Photos landing slot at `app/dogs/[id]/page.tsx:712`. Remove the "Coming soon" caption. Curated `photoGallery` thumbs become the Highlights strip (Workstream C), not the auto-album. | todo |
| A4 | Empty state — when no posts tag the dog yet, friendly icon + "No photos yet" copy. On own-dog: "Post your first photo of {dogName}" CTA → opens composer with dog pre-tagged. | todo |

### Workstream B — User-level Photos as a Posts-tab view toggle

Posts ≈ Photos. No new tab. The existing Posts tab gains a List⇄Grid view toggle and visibility-aware filter pills.

| # | Description | Status |
|---|-------------|--------|
| B1 | List⇄Grid view toggle in the Posts tab section header (icon pair). Grid = 3-col mobile / 4-col desktop, photo-only tiles, tap → opens parent post in context. List = unchanged from today. URL: `?tab=posts&view=grid` for deep-link; default = list. Applies on both `/profile` and `/profile/[userId]`. | todo |
| B2 | Visibility filter pills at the top of the Posts tab — "All visible to me / By group / Personal posts only" — apply to both views. Filter labels reveal only contexts the viewer has access to (per Content Visibility Model line 166 — never leak group existence). Same viewer-aware filter helper as A1, scoped by author. | todo |

### Workstream C — Highlights strip on `/dogs/[id]`

`PetProfile.photoGallery` evolves in place into an opt-in Highlights strip rendered above the auto-album on the dog page. Field name unchanged; JSDoc rewritten.

| # | Description | Status |
|---|-------------|--------|
| C1 | JSDoc update on `PetProfile.photoGallery` — rewrite to describe it as "Highlights: owner-curated pinned photo URLs surfaced above the auto-album on `/dogs/[id]`." No field rename. | todo |
| C2 | Highlights strip UI on `/dogs/[id]` — horizontal scrollable thumbnails above the auto-album Photos grid, cap ~5-6 visible with "See all →" if more. Hidden entirely when `photoGallery` is empty. | todo |
| C3 | Pin-to-Highlights affordance — long-press on a photo in the auto-album opens a small menu with "Pin to Highlights" + "Hide from album" (per §12 resolution). Owner only. | todo |
| C4 | Edit Highlights flow — owner can reorder + unpin from a Highlights edit screen. Lightweight modal (reuse `ModalSheet` primitive). | todo |

### Workstream D — Owner moderation

Three-surface moderation set per §12 (2026-06-01) resolution — surface affinity matters.

| # | Description | Status |
|---|-------------|--------|
| D1 | Per-post three-dots menu on every post: "Untag my dog" (removes the dog tag from `Post.tags`; post stays). Surfaces on feed, profile Posts tab, and the post-detail surface. Owner-only (visible only when the post tags a dog the viewer owns). | todo |
| D2 | Long-press on auto-album photo opens a small menu — "Hide from album" (per-dog hide list on owner side; tag stays, post stays elsewhere) + "Pin to Highlights" (calls C3). Owner-only. | todo |
| D3 | Per-dog Photos-tab settings (light): Auto-approve tags toggle, View hidden photos link, Clear pinned Highlights link. Lives as a small gear/cog at the top-right of the Photos section on `/dogs/[id]` (owner-only). Tag approval semantics inherit from owner per §12 — no per-dog approval override (V2+). | todo |
| D4 | Pending-tag queue UI — when owner has `tagApproval: "approve"`, tags on their dog land in a queue surfaced at `/profile?tab=about` (small inline section under Tagging preferences, badge with count). Owner approves/rejects per-tag; approved tags appear in the auto-album. | todo |

### Workstream E — Cross-cutting privacy walkthrough

Verify the two-gate model holds across the full viewer matrix.

| # | Description | Status |
|---|-------------|--------|
| E1 | Walkthrough: owner views own dog's auto-album → sees every tagged post regardless of poster relationship. | todo |
| E2 | Walkthrough: Connected viewer → sees only posts whose post-level visibility includes them. | todo |
| E3 | Walkthrough: Familiar viewer → sees only what the owner has opened (Familiar grants the marker, not the markee). | todo |
| E4 | Walkthrough: stranger / locked-profile viewer → sees nothing for locked dogs (consistent with profile-level gate); sees public-context posts for Open profiles. | todo |
| E5 | Walkthrough: meet-attached photos via the dog's auto-album — context gate applies (group membership / meet attendance), not just relationship gate. Per Content Visibility Model. | todo |
| E6 | Walkthrough: tag-doesn't-expand-audience — verify that tagging a dog never grants visibility to viewers who couldn't already see the post. | todo |
| E7 | Walkthrough: shelter-dog auto-album → respects `ShelterProfile.tagApproval` read-only (Útulek Liběň is "auto" today; the gate exists for future shelters that flip to "approve"). | todo |

### Workstream F — Seed densification

Anchor-dog tagged-post counts are thin (Bára=3, Hugo=2, Franta=4, Bella=1). Target 5–10 per anchor so the auto-album reads populated for the demo. Shelter dogs already populated from walker-led posts.

| # | Description | Status |
|---|-------------|--------|
| F1 | Author additional posts in `lib/mockPosts.ts` tagging Bára, Hugo, Franta, Bella so each anchor dog has 5–10 viewer-visible tagged posts. Mix authors meaningfully — Klára posts of Hugo from training, Marek/Eva posts of Bára at park meets, Tereza's own posts of Franta + Bella, etc. Reuse existing post photos where possible; only add new image URLs when narrative demands it. | todo |
| F2 | Spot-check after F1 — each persona dog's `/dogs/[id]` Photos grid renders 5+ tiles from the default-persona viewer (Tereza) and from cross-persona views (Klára viewing Bára, Daniel viewing Bára through the Stromovka group, etc.). | todo |

---

## Acceptance Criteria

- [ ] Every persona-dog has a populated, viewer-correct auto-album on `/dogs/[id]` (replaces "Coming soon").
- [ ] Posts tab on `/profile` and `/profile/[userId]` carries a List⇄Grid view toggle + visibility-aware filter pills; filters reveal only contexts the viewer has access to.
- [ ] Highlights strip on `/dogs/[id]` works; owners can pin/unpin/reorder via long-press + edit modal.
- [ ] Owner moderation: per-post untag, long-press hide-from-album / pin, per-dog Auto-approve toggle, pending-tag queue — all functional.
- [ ] Cross-cutting privacy walkthrough (Workstream E) ticks clean across all six viewer states + shelter case.
- [ ] `features/profiles.md` + `Content Visibility Model.md` + `features/shelters.md` (Photos landing slot section) updated.
- [ ] TypeScript compiles clean.

---

## Closing Checklist

- [ ] Walk through every acceptance criterion against the running app
- [ ] Sweep the walkthrough's "Decisions surfaced" section — propagate every entry to its home doc per CONTRIBUTING.md
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions §12 — close resolved items, keep V2+ items (post-publish tag adding, albums-as-tag-type) open
- [ ] Update ROADMAP.md — mark phase complete (move out of Upcoming)
- [ ] Review CLAUDE.md — update if Photos affects navigation, key components, or Core Principles
- [ ] Review Punch List for completed-since-open items that touched these surfaces
- [ ] Archive this phase board + walkthrough (status: archived, `git mv` to `docs/archive/phases/`)
- [ ] Trim pass
- [ ] **Structural audit:**
  - `grep -rl "status: archived\|status: complete" docs/phases/` returns only legitimate paused phases
  - No filename overlap between `docs/phases/` and `docs/archive/phases/`
  - No `last-reviewed` older than 21 days in `strategy/` / `features/` / `implementation/`
- [ ] Strategic review — what changed, what open questions earned a research pass, alternatives, next-phase readiness
