---
status: draft
last-reviewed: 2026-05-11
review-trigger: When any task is completed or blocked; when prerequisite Open Questions resolve
---

# Photos & Galleries

> **Status: draft.** Sketched 2026-05-11 during Profiles Deep Pass walkthrough (B6 surfaced the gap — Spot's manually-curated `photoGallery` thumbnails read as static, with no way to browse the broader stream of posts tagging him). Strategic resolutions live in `Open Questions & Assumptions Log` §12. **Do not open as active until the moderation + tag-approval Open Questions resolve** — those decisions shape Workstreams C and D.

**Goal:** Photos in posts surface naturally on the things they're about — dogs, people, places — gated through the existing two-gate privacy model. Owners get curated control (Highlights) on top of an auto-derived stream (Photos tab). Care providers' photo contributions to clients' dogs flow back as content the owner values, without becoming portfolio fodder.

**Depends on:**
- **Profiles Deep Pass** (PetCard structure, profile photo grid placement, mutual-connections section pattern as a reference for "compact + Show all modal").
- Content Visibility Model (already prescribes the privacy gates + filterable gallery pattern — this phase implements it).
- `Post.tags.dogs` data already in place; `PetProfile.photoGallery` already in place (evolves to Highlights).

**Refs:** [[profiles]], [[Content Visibility Model]], [[Trust & Connection Model]], [[meets]], [[design-system]].

**Not in scope:** Carer Portfolio badge (completed-engagements → "X dogs trained" / "X sessions completed" trust signal). Sibling phase, independent — see `phases/carer-portfolio.md` (draft) + Open Questions §8. Either phase can open first; they don't block each other.

---

## Opening Checklist

Complete before writing any code.

- [ ] Read every task and its referenced docs
- [ ] Confirm Open Questions §12 resolutions are still current (auto-album + Highlights, tag-approval inheritance, moderation set)
- [ ] Audit `Post.tags.dogs` seed coverage — every persona-dog should appear in enough tagged posts that the auto-album reads populated
- [ ] Confirm `PetProfile.photoGallery` deprecation plan (rename to `highlights` or keep field name + change semantics?)
- [ ] Re-read Content Visibility Model — implementations of the two-gate filter must match the rules exactly

---

## Tasks

### Workstream A — Per-dog Photos tab (the auto-album)

The thesis of the phase. Each dog gets a Photos tab on the PetCard / pet detail surface.

| # | Description | Status |
|---|-------------|--------|
| A1 | Helper `getPostsByDog(dogId, viewerId)` in `lib/mockPosts.ts` — filters all posts to those that tag `dogId` AND pass the viewer's two-gate visibility. | todo |
| A2 | `DogPhotosGallery` component — viewer-aware grid of post photos (3-col on mobile, 4-col on desktop). Tap photo → opens the parent post in context (caption, author, timestamp). | todo |
| A3 | PetCard gains a Photos affordance — likely a tab inside the expanded card, or a "View N photos →" link in the header that opens a sheet/route. Decide UI placement (decision needed inside the phase). | todo |
| A4 | Owner sees ALL tagged posts on their dog (regardless of relationship to poster — owner is the dog's authority). Non-owner viewers see only posts visible per the Content Visibility Model. Encode in the helper's docstring + a privacy-walkthrough test. | todo |
| A5 | Empty state — when no posts tag the dog yet, show a friendly prompt with an icon + "No photos yet" copy. On own-dog: optional "Post your first photo of {dogName}" CTA → opens composer with dog pre-tagged. | todo |

### Workstream B — User-level Photos grid

Profile-level photo surface — every post the user has authored, in an Instagram-style grid, filterable per Content Visibility Model line 166.

| # | Description | Status |
|---|-------------|--------|
| B1 | New `/profile/[userId]?tab=photos` (and own profile equivalent) showing the grid. Same viewer-aware filter logic as A1, scoped by author instead of dog tag. | todo |
| B2 | Filter affordance: "All (visible to me)" / "By group" / "Personal posts only" — per Content Visibility Model. Hidden filter labels for groups the viewer isn't in (per the model — don't leak group existence). | todo |
| B3 | Decide whether to add a Photos entry to the profile TabBar (about/posts/services + photos) or surface as a sub-view inside Posts. The latter is less nav-heavy; the former is more discoverable. Decision needed inside the phase. | todo |

### Workstream C — Highlights (curated)

`PetProfile.photoGallery` evolves into an opt-in Highlights strip on PetCard above the auto-album.

| # | Description | Status |
|---|-------------|--------|
| C1 | Data model decision — rename `photoGallery` → `highlights`, or change semantics in place? Either way, document the new intent in the JSDoc on `PetProfile`. | todo |
| C2 | Highlights strip UI — horizontal scrollable thumbnails on the PetCard, between the breed/meta row and the section dividers. Cap at ~5–6 visible; "See all" if more. | todo |
| C3 | Pin-to-Highlights affordance — owner can pin a tagged post's photo from the auto-album to Highlights. UI: long-press on photo? per-photo menu? Open Q to resolve before C3 starts. | todo |
| C4 | Edit Highlights flow — owner can reorder + unpin from a Highlights edit screen. Reuses the existing PetEditCard surface or a dedicated modal. | todo |

### Workstream D — Owner moderation

| # | Description | Status |
|---|-------------|--------|
| D1 | Untag affordance — owner can remove their dog's tag from someone else's post (post stays; dog removed from `Post.tags.dogs`). Surfaces from the auto-album per-photo menu. | todo |
| D2 | Hide-from-album — keep the tag but suppress the post from the owner's dog's Photos tab (per-album hide list on the owner's side, doesn't affect the post elsewhere). | todo |
| D3 | Tag approval queue — when owner has `tagApproval: "approve"`, tags on their dog land in a pending queue surfaced on `/profile?tab=about` or a new `/settings/tags` route. Owner approves/rejects; approved ones appear in the auto-album. | todo |
| D4 | Tag approval semantics — confirm Open Q resolution: owner's `tagApproval` governs tags on their dog (inherit, not separate per-dog setting). Document in `features/profiles.md` and `lib/types.ts` JSDoc. | todo |

### Workstream E — Cross-cutting privacy walkthrough

Verify the two-gate model holds across the full viewer matrix.

| # | Description | Status |
|---|-------------|--------|
| E1 | Walkthrough: owner views own dog's Photos tab → sees every tagged post regardless of poster relationship. | todo |
| E2 | Walkthrough: Connected viewer → sees only posts whose post-level visibility includes them. | todo |
| E3 | Walkthrough: Familiar viewer → sees only what the owner has opened (Familiar grants the marker, not the markee). | todo |
| E4 | Walkthrough: stranger / locked-profile viewer → sees nothing for locked dogs (consistent with profile-level gate); sees public-context posts for Open profiles. | todo |
| E5 | Walkthrough: meet-attached photos via the dog's Photos tab — context gate applies (group membership / meet attendance), not just relationship gate. Per Content Visibility Model. | todo |
| E6 | Walkthrough: tag-doesn't-expand-audience — verify that tagging a dog never grants visibility to viewers who couldn't already see the post. | todo |

---

## Acceptance Criteria

- [ ] Every persona-dog has a populated, viewer-correct Photos tab (auto-album).
- [ ] User-level Photos grid renders per Content Visibility Model — filter affordances reveal only contexts the viewer has access to.
- [ ] Highlights strip on PetCard works; owners can pin/unpin/reorder.
- [ ] Owner moderation: untag, hide-from-album, approve-pending all functional.
- [ ] Cross-cutting privacy walkthrough (Workstream E) ticks clean across all five viewer states.
- [ ] `features/profiles.md` + `Content Visibility Model.md` updated.
- [ ] TypeScript compiles clean.

---

## Closing Checklist

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions §12 — close resolved, add any new
- [ ] Update ROADMAP.md — mark phase complete (move out of Current)
- [ ] Review CLAUDE.md — update if Photos affects navigation, key components, or project structure
- [ ] Archive this phase board + walkthrough (status: archived, `git mv` to `docs/archive/phases/`)
- [ ] Structural audit
- [ ] Check next phase scope for conflicts with what was just built
