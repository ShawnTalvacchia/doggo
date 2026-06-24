---
status: living
last-reviewed: 2026-06-24
review-trigger: "Append when a 'noted for later' idea surfaces; promote out when triggered"
---

# Future Considerations

Long-term ideas, possible add-ons, and improvements to keep on the radar — things that aren't actionable now but are worth not-forgetting.

**Distinct from:**
- **Open Questions** (`docs/planning/Open Questions & Assumptions Log.md`) — unresolved questions affecting upcoming work. Future Considerations are NOT questions; the direction is known, just waiting for a trigger.
- **Punch List** (`docs/planning/punch-list.md`) — concrete, actionable fixes (≤few hours each). Future Considerations are speculative or trigger-gated; usually too big OR too tentative for the punch list.
- **Phase boards** (`docs/phases/*.md`) — multi-task coordinated goals. A Future Consideration that grows trigger-fired scope can graduate to a phase board.

**Lifecycle:** items live here until their trigger fires (data scale reached, user feedback received, related work surfaces, etc.). When triggered, **promote out** — to the punch list (small fix), a phase board (coordinated work), or feature scope. Don't let items rot here for years without a trigger check.

**Item format:**
- **Title** — one-line summary
- **Trigger** — when this becomes worth doing ("if/when X happens")
- **Context** — why noted, what it solves
- **Effort** — rough size when picked up (best-guess; refine on promotion)
- **Refs** — related docs / surfaces
- **Added** — date noted

---

## FC1. Search + filter pills on the Connections modal

**Trigger:** A single user roster grows past ~50 total connections. Or user testing surfaces "I can't find Jana" as a real complaint at smaller scale.

**Context:** The Profile About-tab Connections modal (`ProfileAboutTab.tsx` → `ConnectionsList`) renders the full grouped list (Connected / Familiar / Pending) inside a `ModalSheet`. At current data scale (every persona <15 connections total), the list is scannable in one screen — search + filter pills add UI overhead without solving a real problem. At 50+ connections per state, the section becomes too long to scan; finding a specific person by state OR by name becomes the dominant intent.

Two affordances both earn their weight at the same threshold:
- **Search input** above the section headers — typed input filters across all groups, narrows visible rows.
- **Filter pills** (Connected · Familiar · Pending) dynamically rendered for non-empty states — tap to scope to one group at a time.

Both decisions were considered + rejected during the 2026-05-13 Connections modal redesign (PDP walkthrough G); rationale logged in `docs/phases/profiles-deep-pass-walkthrough.md` Decisions section. Revisit when data scale justifies.

**Effort:** ~1-2h. `useState` for search query + filter selection; conditional render of pill row above section headers; substring match on `userName`/`dogNames` for the search; standard `SearchInput` + `FilterPillRow` components already exist.

**Refs:** `components/profile/ProfileAboutTab.tsx` (ConnectionsList + modal), `docs/phases/profiles-deep-pass-walkthrough.md` (Connections surfaces Decisions entry), `components/ui/SearchInput.tsx`, `components/ui/FilterPillRow.tsx`.

**Added:** 2026-05-13

---

## FC2. Mock-world densification — broader than per-persona symmetric rosters

**Trigger:** Pre-user-testing pass OR when a phase walkthrough surfaces a surface that reads thin in the demo because supporting data isn't there.

**Context:** Doggo's mock world has 5 personas with deep data (Shawn, Tereza, Daniel, Klára, Tomáš) and many supporting characters (Eva, Petra, Marek, Lucie, Jana, Filip, Hana, Nikola, bridged carers like olgaM/janaK/etc.) with shallow data. Three concrete gaps already documented:

1. **Connection rosters** — P69 (punch list) covers symmetric inverse-fill of seed entries. Still leaves rosters where supporting personas appear ONLY in inverse-fill — they have no outbound depth of their own.
2. **Notification seeds** — P59 (punch list) covers re-attributing the 23 Shawn-centric seeds to other personas. Still leaves the supporting cast with empty bells.
3. **Posts + photo coverage per dog** — flagged in Photos & Galleries phase draft (Workstream A opening checklist). Many persona-dogs need more tagged posts before the auto-album reads populated.
4. **Copy polish — em-dash sweep of seeded prose** *(quality, not density)*. Existing seeded copy (dog backstories, care notes, bios, posts) still contains em dashes that read as machine-written. The no-em-dash preference now prevents *new* ones, but the back-catalogue needs a per-line rewrite (period / comma / parens — sentence-level judgment, not find-and-replace). Fold into the collaborative text-iteration round, where every line is being read anyway. Structural UI-label separators (e.g. service-card "Pickup — comes to you") stay — this is about person-voiced prose only. See memory `feedback-no-em-dashes`; P81 already covers the walk-recap subset.

The pattern: when a phase ships a feature that depends on cross-persona data (mutual connections, notification recipients, photo-tag streams), the feature works for the 5 deep personas but reads empty/thin when the active persona is a supporting character OR when viewing a supporting character. Periodic densification passes — seed fill for whatever feature needs depth — is the structural answer.

**Effort:** Variable. A focused 2-4h pass per feature when the trigger fires; or a coordinated mock-data densification phase if multiple gaps stack up. The bridged-provider pattern (cheap inverse-fill from existing data) is the lowest-friction template.

**Refs:** `docs/implementation/mock-data-plan.md`, `lib/mockUsers.ts`, `lib/mockConnections.ts`, `lib/mockNotifications.ts`, `lib/mockPosts.ts`, P59 + P69 (current symptom-level entries).

**Added:** 2026-05-13

---

## FC3. ShareMomentBar shortcut taxonomy expansion

**Trigger:** User testing surfaces that the current 4-shortcut set (Photo / Dog / Location / Group) misses common tag intents. OR `PostComposer`'s `initialTagPicker` mechanism gets extended for richer surface entry points.

**Context:** The redesigned `ShareMomentBar` (2026-05-13, PDP) surfaces 4 tag shortcuts. The composer supports 5 tag types: `place` / `dog` / `person` / `community` / `meet`. The two omitted from the shortcut row:

- **Person tag** — deliberately deferred. Tagging another person requires a search dialog (less of a one-tap-and-go than a fixed list); felt like more thought than the teaser bar invites.
- **Meet tag** — deliberately deferred. Tagging a meet is highly contextual to having attended one recently; better surfaced from the meet detail page than the generic teaser. The post-meet review's "share a moment" affordance is the right entry point for meet-tagged posts.

If user testing or product evolution shows either of these is a common-enough intent to warrant exposure on the teaser, the shortcut row is the obvious place.

**Effort:** ~30min per addition (icon choice + label + `initialTagPicker` value + visual fit at 5+ shortcuts on narrow viewports).

**Refs:** `components/feed/ShareMomentBar.tsx`, `components/posts/PostComposer.tsx`, `contexts/PostComposerContext.tsx`.

**Added:** 2026-05-13

---

## FC4. `Section` shell component — bundle SectionHeader + optional description

> **Still open — deferred from the Design-System Audit + Cleanup phase (2026-06-21, demo-scope).** Confirmed still valid but deliberately not built: it's an invisible refactor with a spacing-rhythm wrinkle (see correction below), no demo payoff. **Correction to the analysis below:** the offending gap is NOT `gap-md` — `.profile-tab-stack > section` actually uses `gap: var(--space-sm)` (8px) + a `:nth-child(n+3)` margin-top that lifts later children to ~`--space-md`. The same two-tier rhythm rule also covers `.dog-profile-section`, so a `Section` component must reproduce it (and ideally retire the `:nth-child` hack), and likely lives in `components/layout/`, not `components/profile/`.

**Trigger:** Next time the "subheader has too much space above it, body is too close below" spacing bug surfaces in a new section. Or when a Design System Cleanup phase opens and pattern consolidation is in scope.

**Context:** The Profiles Deep Pass About tab has a recurring spacing pattern: a section with `SectionHeader` (32px tall, vertically centered title text) + optional description paragraph + body content. The section's flex `gap-md` (12px) fires between EACH flex child by default, which is wrong here — the description should sit tight under the header (natural text rhythm, no gap-md between them) and the gap-md should land between description and body content.

The fix pattern, applied three times so far on this tab:
- Profile visibility section (with editing-mode subheader)
- Tagging preferences section (with editing-mode subheader)
- Connections section empty state (2026-05-13 G6 fix)

Each fix wraps `SectionHeader` + description in a single `<div>` so the section's gap-md only applies between the bundle and the body. The repetition signals a shared component opportunity.

Proposed API:
```tsx
<Section
  title="Profile visibility"
  description="Control who can see your full profile, posts, and dogs"
>
  <ProfileVisibilitySetting ... />
</Section>
```

The component handles the bundle pattern, description visibility toggling (e.g. only in editing mode), and the gap rhythm internally. Drop-in replacement for the current `<section><SectionHeader /> ... </section>` pattern across `ProfileAboutTab` and (eventually) other tab surfaces.

**Effort:** ~1h. New `components/profile/Section.tsx` (or `components/layout/Section.tsx` if scope expands beyond profile). Three migration call sites on `ProfileAboutTab`. Document in design-system.md under "Section primitives."

**Refs:** `components/profile/ProfileAboutTab.tsx` (current call sites), `components/profile/SectionHeader.tsx` (would compose), `docs/implementation/design-system.md` (section primitives entry), P67 (component-consolidation audit — this fits the same recurring-pattern theme).

**Added:** 2026-05-13

---

## FC5. `IdentityChip` shared component

> **Re-checked 2026-06-21 (Design-System Audit) — trigger still NOT met, left inlined.** The audit confirmed only the 2 named hero-chip consumers exist; the other `getCarerIdentity` callers feed the dense PersonRow `.person-row-pill--carer`, a deliberately different role. Extracting now would be over-engineering. Revisit at the 3rd consumer.

**Trigger:** A third surface needs the hero-sized identity chip treatment (`flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium`).

**Context:** 2026-05-13 (PDP) sized the Carer identity chip on profile heroes to match `ProfileVisibilityChip`'s chrome — both render at 24px tall with 12px font on hero surfaces. The implementation inlined the Tailwind classes per-surface (own-profile hero + `/profile/[userId]` hero) rather than extracting a shared `IdentityChip` component. Two inlined call sites is acceptable; three would warrant extraction.

The smaller `.person-row-pill--carer` treatment (11px font, 16.5px tall, for PersonRow dense rows) stays untouched — different visual role, different home. The split is: **PersonRow pill = dense-row chrome (16-20px); IdentityChip = hero/header chrome (24px)**.

**Effort:** ~30min. New `components/people/IdentityChip.tsx` exporting a small component that takes `label` + `tone` (`info` / `neutral`) + optional icon. Inline call sites migrate.

**Refs:** `components/profile/ProfileAboutTab.tsx` (own-profile hero), `app/profile/[userId]/page.tsx` (other-user hero), `components/profile/ProfileVisibilityChip.tsx` (related neutral-tone visibility chip), `docs/implementation/design-system.md` ("chip-vs-pill" treatment ladder).

**Added:** 2026-05-13

---

## FC6. Group admin control + member opt-out for member-service display

**Trigger:** Feedback that a group shouldn't surface members' care offerings at all (a pure social/park circle), or a carer doesn't want their services advertised in every group they belong to.

**Context:** The Members tab now has a viewer-side **"Show members' services"** toggle (default off) that reveals a service footer on member cards (2026-05-22 neighbour-care redesign — replaced the duplicative `GroupNeighbourCare` section, which also gated on static membership and so hid after an optimistic join). Two governance layers were deliberately deferred:
- **Admin-side:** a group setting ("Allow members to offer services here") would gate whether the toggle is even available per group.
- **Member-side:** a per-membership (or global) opt-out so a carer in several groups controls where their services show.

Neither is needed for the demo — the viewer toggle (off by default) already keeps the roster reading as a member list, not a marketplace. These add governance once it matters.

**Effort:** ~2-3h. Admin: a `Group` config boolean + a control in the group admin surface, gate `hasAnyMemberServices` + the toggle on it. Member: a per-membership / per-carer flag, filter `getMemberServiceSummary` by it.

**Refs:** `app/communities/[id]/page.tsx` (`MembersTab` toggle + `getMemberServiceSummary` + the service footer), `lib/types.ts` (`Group` / `GroupMember` / `carerProfile` would carry the flags).

**Added:** 2026-05-22

---

## FC7. Shelter Dogs tab — list + carousel view modes

> **Still deferred (checked 2026-06-13).** The Adoption-Curious Journey shipped its `/discover/help-a-dog` doorway **without** the carousel — the grid + sort + the explore-first reassurance card carried the emotional on-ramp well enough. Revisit only if a future doorway pass demonstrably needs the one-dog-at-a-time pattern.

**Trigger:** A walker or shelter coordinator surfaces "I want to scan the roster more quickly" (list view), or the "Help a Dog" entry point (Cold-Start Playbook future thread) needs an emotional one-dog-at-a-time pattern (carousel view).

**Context:** Shelter Foundation (2026-06-01) shipped the Dogs tab as a single photo-led card grid (2-up on desktop, 1-up on mobile). Two additional view modes were discussed and deferred:

- **List view** — small dog avatar on the left, info on the right. Most compact; useful for staff/walkers scanning who's available, who needs a walk, etc. Trades emotive presentation for density.
- **Carousel / one-at-a-time view** — swipe-style focus on a single dog at a time. Emphasizes commitment (you can't scroll past), fits the future "Help a Dog" door from the Cold-Start Playbook. Substantial UI build (swipe gestures, transitions, navigation, prev/next state).

Cards remain the default. A view-mode toggle (Cards · List · Carousel) would sit in the toolbar next to the sort dropdown. Sort persists across views.

**Effort:** ~3-5h for List (new compact row component + view-mode toggle state + CSS). Carousel is its own ~1-day build (gesture handling, animation, nav UI) and should probably land as part of the "Help a Dog" Cold-Start phase rather than incrementally on the existing Dogs tab.

**Refs:** `app/shelters/[id]/page.tsx` (`DogsTab`), `components/shelters/ShelterDogCard.tsx`, `docs/strategy/Cold-Start Playbook.md` ("Help a Dog" thread), Shelter Foundation walkthrough.

**Added:** 2026-06-01

---

## FC8. Shelter dog tag system formalization *(resolved 2026-06-02 — Dog Profile phase)*

**Shipped.** Dog Profile phase landed the three-category split: auto-derived chips via `deriveAutoTags` in `lib/petUtils.ts`; controlled `PersonalityTag` vocabulary in `lib/types.ts` with labels + picker order in `lib/constants/dogs.ts`; policy chips via `derivePolicyChips`. `PetProfile.tags: string[]` replaced by `personalityTags: PersonalityTag[]`. Seed migration cleaned redundant auto-derivable entries (Long-stayer / New arrival / Adoption pending dropped from manual seeds; Senior + Puppy kept in vocabulary pending structured-age refactor). PetEditCard surfaces the controlled-vocabulary picker on owned-dog editing; shelter operator authoring deferred to V3+. Full taxonomy doc: [[features/shelters]] → "Dog profile tag taxonomy."

---

## FC9. Locked-profile rendering across surfaces

**Trigger:** The Credentialing Moat phase (Carer Portfolio + Shelter Walker Credentialing) opens. Or sooner if a walkthrough surfaces "I clicked on a walker name and it 404'd" / "Why can't I see this person?"

**Context:** The visibility-gradient machinery for showing a person to a viewer (full identity vs Tier-2/Tier-3 collapse vs "+ Familiar" pill on locked profiles with shared context) already exists in `PersonRow` + `getAttendeeTier` + `lib/personActions.ts` + `PrivateProfileRow`. It runs on the community Members tab today.

Several surfaces don't use it yet — most notably the **shelter Members tab**, where walkers are rendered through a custom `ShelterMemberRow` because today's walkers are directory-style entries without `UserProfile` records. When walkers bridge to real personas (planned for credentialing-moat), the move is: make `ShelterMemberRow` a thin wrapper around `PersonRow` (passing the walker affiliation chip + tier label into PersonRow's chip slot). Visibility logic comes for free.

Same applies to: post comments from un-bridged authors, "Recent walkers" on dog profiles, future gallery sub-attribution. The principle is one shape per entity, regardless of which surface renders it.

**Effort:** ~2-3h within the credentialing-moat phase once walker personas exist. Most work is wiring, not rebuilding.

**Refs:** `components/people/PersonRow.tsx`, `components/people/PrivateProfileRow.tsx`, `lib/personActions.ts`, `components/shelters/ShelterMemberRow.tsx` (today's stand-in), `docs/strategy/Trust & Connection Model.md` (full visibility model).

**Added:** 2026-06-01

---

## FC10. Forum / regulatory information for Czech dog owners

**Trigger:** Post-demo. Or sooner if user testing surfaces "I don't know what I'm legally required to do as a dog owner" as a real complaint (especially from expat / first-time-owner segments).

**Context:** Roman flagged in his user interview (2026-06-02) that Czech dog owners — especially new owners and expats — are often unaware of regulatory and tax obligations. His own example: he was unaware for 10 years that he was required to pay a special dog tax. The bureaucracy of European dog ownership creates an information gap that current Doggo surfaces don't address.

Two shapes worth considering when the trigger fires:

- **Forum** — a Q&A surface like a community-moderated FAQ. Threads for "Registering your dog in Prague," "Annual dog tax," "Apartment-building regulations," etc. Lives parallel to Communities (own surface) or as a special Group type.
- **Helpful-info layer** — curated articles, possibly localised, surfaced contextually (e.g. a notification "First time owning a dog in Prague? Here's what you need to know"). Less interactive, lower content-moderation burden.

Strategic positioning question: is regulatory information *Doggo's job*, or do we point users at an existing resource? Czech veterinary chamber and city council publish official information; the gap may be discoverability + translation, not creation.

This thread overlaps with the **Anxious New Owner** archetype (User Archetypes, added 2026-06-02) — the user segment most likely to benefit from this content is exactly the high-demand-for-training segment Roman identified.

**Effort:** Variable. Curated-articles surface (no forum mechanics) is ~1 phase. Full forum is multi-phase territory. Helpful-info layer surfaced via existing post types is the lightest cut (~few workstreams).

**Refs:** `docs/meetings/po-briefing-2026-06-02.md` (Roman's "Future Iterations" section), `docs/strategy/User Archetypes.md` ("Anxious New Owner" archetype).

**Added:** 2026-06-02

---

## FC11. Extend `resolveAuthor*` resolvers + promote shelter denormalized fields

**Trigger:** Walker bridge to `UserProfile` lands (credentialing-moat phase). Or when a third source of truth needs to feed the post header (supporter authoring, shelter operator surface, etc.).

**Context:** Shelter Foundation introduced two resolvers in `components/feed/MomentCard.tsx`:

- `resolveAuthorHref(authorId)` — routes post-author links to `/shelters/`, `/profile/`, or undefined (for directory-style walkers without a profile).
- `resolveAuthorAvatarUrl(authorId, fallback)` — overrides the denormalized `Post.authorAvatarUrl` when the author is a walker, pulling from `ShelterWalker.avatarUrl` (single source of truth).

This works cleanly for walkers because their avatars now live on the walker record. Three follow-ups when more cases arise:

1. **Extend to supporters.** Today supporters don't author posts (only react/comment), so the resolver has no work to do. When/if supporters post — or when the comment-author treatment gets the same single-source treatment — `findShelterSupporter` would mirror `findShelterWalker`.
2. **Extend to shelter logos on shelter-authored posts.** Currently shelter posts denormalize `authorAvatarUrl` to the shelter logo path. If the logo URL changes (real shelter onboarding, brand pass), every post would need re-seeding. Switching to resolver-based lookup (`getShelterById(authorId).logoUrl`) eliminates the drift risk. Small change but worth doing the next time we touch shelter posts.
3. ~~**Promote the violet pair to tokens.**~~ **✅ DONE 2026-06-21 (Design-System Audit WS-B).** The full violet family is now `--violet-50/100/300/700/800` (primitive ramp) + `--status-volunteer-soft/light/border/main/strong` (semantic), surfaced in the styleguide. Every violet hex/rgba across the app migrated onto it; the scoped `--mentor-progress-violet*` one-offs collapsed to family aliases. See `design-tokens.md`.

**Effort:** ~30min per change. Each is mechanical.

**Refs:** `components/feed/MomentCard.tsx`, `lib/mockShelters.ts` (`findShelterWalker`), `app/globals.css` (violet hex pair in two rules).

**Added:** 2026-06-02

---

## FC12. Booking detail Info tab — dedupe pet identity, surface critical alerts inline

**Trigger:** When a booking-detail polish pass opens. Or when user testing surfaces "I scroll past the pet card without reading."

**Context:** The Dog Profile phase landed a meaningful iteration on the booking detail Info tab (PetInfoSection avatar restored, identity row dropped, Details list reordered above pet info, Next session row + Start gating, Activity row replacing the 3-tile grid). The deeper move proposed but not shipped: make the dog avatar in the booking header's `OwnerDogAvatar` tappable → routes to `/dogs/[id]`. With that anchor in place, the PetInfoSection card could disappear entirely and critical operational alerts (medications, conditions, triggers) could render as plain inline rows on the Info tab.

The trade-off: convenience of inline reference vs. cleanness of "dog page is the canonical surface." Carers DO need session-time access to triggers/meds — forcing a tap-through is real friction. The hybrid (header avatar tap-through + inline critical alerts only) captures both.

**Effort:** ~3-4 hours. (a) Extend `OwnerDogAvatar` to accept optional `petIds` so the dog half can route. (b) Drop the PetInfoSection card entirely. (c) Replace with inline rows on the Info tab for medications / conditions / triggers (the operational alerts; defer likes/dislikes/play to the dog page). (d) Update walkthrough verification + the booking-detail section in `features/explore-and-care.md`.

**Refs:** `components/people/OwnerDogAvatar.tsx`, `app/bookings/[bookingId]/page.tsx:PetInfoSection`, `docs/features/explore-and-care.md` → Booking detail surfaces. Discussed during Dog Profile phase walkthrough C3 (2026-06-03).

**Added:** 2026-06-03

---

## FC13. "Untag my dog" — mutate `Post.tags[]` instead of per-viewer suppression

**Trigger:** When an editable-post store lands. Today posts live as a static array in `lib/mockPosts.ts`; once posts become mutable (real backend, or a session-scoped persisted store for composed posts), this can flip from a per-viewer suppression filter to a real tag removal.

**Context:** The per-post three-dot menu's "Untag {Dog}" action (Photos & Galleries D1, 2026-06-04) is labeled as if it removes the dog tag from the post — but in V1 it actually records "this viewer doesn't want this post in their dog's album" via `useUntagStore` and filters at the consumption layer. The post's `Post.tags[]` is unchanged; the dog tag chip still renders on the post chrome everywhere it appears. The label was kept because §12 calls for "Untag" semantics and the moderation intent is correct; only the mutation backing is the V1 shortcut.

When the editable-post store lands, the action should mutate `Post.tags[]` directly: filter out the `{type: "dog", id: dogId}` entry. The auto-album filter via `useUntagStore` can stay as a one-tap revert path (or drop entirely if the mutation is atomic).

**Effort:** ~1-2 hours once the post store exists. The kebab menu UI + store-aware filter all stay; just swap the mutation site from store-write to post-mutation.

**Refs:** `components/posts/PostKebabMenu.tsx`, `lib/useUntagStore.ts`, `app/dogs/[id]/page.tsx:DogPhotosBundle` (consumption-layer filter), `docs/features/profiles.md` → Untag-as-suppression note. Surfaced 2026-06-04 (Photos & Galleries walkthrough O2).

**Added:** 2026-06-04

---

## FC15. Shared `<SortMenu />` primitive

> **✅ SHIPPED 2026-06-21 (Design-System Audit + Cleanup, WS-D).** Extracted to `components/ui/SortMenu.tsx` from the two byte-identical inline copies (shelter Dogs tab + Help a Dog); `.shelter-sort-*` CSS renamed `.sort-menu-*`. Documented in `design-system.md` (Primitives). Entry retained for history.

**Trigger:** Design System Cleanup phase opens. Or a third consumer is about to copy the same component inline — extract first instead of fan-out.

**Context:** The custom-styled sort dropdown (label + caret trigger + outside-click + Esc handlers + `.dropdown-menu` listbox) lives inlined in two places as of 2026-06-08:
- `app/shelters/[id]/page.tsx` — shelter Dogs tab toolbar
- `app/discover/help-a-dog/page.tsx` — Help a Dog Dogs view toolbar

The two copies are near-identical. The only meaningful divergence is the trigger's CSS class (`.shelter-sort-trigger` — shelter-prefixed, which would need generalizing as part of the extraction). Effort beyond that: thin — the component shape is already stable.

**Proposed API:**
```tsx
<SortMenu
  value={sortKey}
  options={SORT_OPTIONS}
  onChange={setSortKey}
/>
```

Move the trigger styling to a generic class (e.g. `.sort-menu-trigger`) and re-point the existing shelter consumer at it. The `dropdown-menu` / `dropdown-menu-item` classes are already generic; reuse those.

**Effort:** ~30-45 min. New `components/ui/SortMenu.tsx`; generalize `.shelter-sort-trigger` → `.sort-menu-trigger` in `app/globals.css`; two migration call sites; document in design-system.md under primitives.

**Refs:** `app/shelters/[id]/page.tsx:496` (current inline copy + helper context), `app/discover/help-a-dog/page.tsx` (second copy), `.dropdown-menu` pattern in `app/globals.css`, P67 (component-consolidation audit — fits the same recurring-pattern theme). Surfaced 2026-06-08 during Help a Dog Discover door build.

**Added:** 2026-06-08

---

## FC14. Instagram-style drag-over-photo sheet on PostLightbox (mobile)

**Trigger:** When a Demo Presentation polish pass opens pre-tester sit-down. Or when user testing surfaces "feels truncated" on the photo area below 55dvh.

**Context:** V1 mobile `PostLightbox` (Photos & Galleries phase, 2026-06-04) stacks photo (top, 55dvh cap) + sidebar (below, scrollable) vertically. Caption + comments read fine but the photo loses the immersive feel a full-bleed image gives. Instagram-style alternative: photo fills the screen, the bottom content sheet starts collapsed (showing just author + caption preview), drags up to overlay the photo as the user reads / scrolls through comments. Snap points: collapsed (bottom ~30%) / expanded (covers ~90%, photo visible behind a slight blur).

**Effort:** ~3-4 hours. Needs (a) a draggable sheet primitive with snap points + spring physics, (b) pointer-event coordination so the photo area still gets swipe-nav events when the sheet is collapsed, (c) backdrop-blur applied to the photo when the sheet expands beyond 50%, (d) keyboard / a11y story (Escape collapses then closes; tab order respects the sheet state).

**Refs:** `components/posts/PostLightbox.tsx` (current mobile layout), `app/globals.css` → `.post-lightbox-*` mobile breakpoint, `components/overlays/ModalSheet.tsx` (potential primitive to share with). Surfaced 2026-06-04 during Photos & Galleries mobile testing.

**Added:** 2026-06-04

---

## FC16. Shelter admin / operator surfaces

> **⤴ GRADUATING 2026-06-24 → Phase 2 "The Shelter's Side"** (the next phase, second half of the two-phase validation arc opened by the Multi-Path Demo phase). Phase 2 builds the shelter *operator* surface — the operator/admin views currently stubbed in the demo as "demo controls" / state-toggles. Phase 2 pulls a slice of the scope below forward; the rest stays here until its trigger fires.

**Trigger:** A real shelter conversation surfaces the need (or Cross-Shelter Mentor Network phase requires admin-side affordances to be walkable in demo).

**Context:** The Mentor Network phase ships everything the *walker* side needs (apply, mentor-vouched apply, mentor session booking, tier progression). It explicitly skips the *shelter admin* side — application review surface, walker pool management, per-shelter waiver authoring, walker tier overrides, historical-walks crediting (the bootstrap affordance from Cold-Start Playbook → mentor-vouching). For the demo, those admin surfaces can be partially faked (state-toggle for application approve/reject, pre-seeded credit counts) so the walker journey is walkable end-to-end without a real admin view.

The full admin/operator side becomes meaningful when (a) a real shelter wants to onboard and the demo needs to show "here's what your staff see," or (b) the demo-state fakes start feeling visibly broken because the walker side has gotten rich enough to expose them.

**Scope when triggered:**
- **Admin role on shelter accounts** — staff member with login can act on the shelter's behalf (approve applications, mark walks, author posts).
- **Application review surface** — incoming applications + sponsor reference + supervised session count + approve/reject (rejection requires reason).
- **Historical walk crediting** — shelter admin marks "Pavel has been walking here 4×/week for 3 years" → platform credits ~600 walks. Marked distinctly from platform-logged walks in the audit trail — and the admin view is the ONLY place that split renders: public surfaces show plain totals and trust the badge (PO call 2026-06-10; data fields `creditedWalkCount` + `tierOverrides` already carry it).
- **Per-shelter waiver authoring** — shelter admin can edit their shelter's waiver text (platform-baseline waiver stays Doggo-owned).
- **Waiver document review + e-sign** — the mentee-facing side of the above: the mentor booking sheet's waiver-name links (stubbed to a toast 2026-06-11) open the actual waiver document for reading, then a real signature step (not a checkbox). Platform baseline signs once; each shelter waiver signs once per shelter.
- **Per-shelter mentor-acceptance policy** — toggle whether the shelter accepts mentor-vouched applications + minimum session count override.
- **Walker pool management** — view all walkers affiliated with shelter, see their tier + recent activity, tag honorific roles ("Útulek Trusted," "head walker") if shelter wants the internal tagging layer. **Promote/demote freely** (O4 resolution, 2026-06-10: walk-count thresholds are suggestions; the shelter's explicit tier call wins — data + demo stub shipped as `tierOverrides` in `WalkerApplicationsContext` with a "(demo)" dropdown on Members-tab rows; this is the real surface for it). Demotion warning required: dropping a walker's only `trusted` affiliation revokes their platform Super Volunteer status and any mentor offerings.
- **Per-walker actions beyond tier** (PO direction 2026-06-10 — candidate set for the real kebab, surfaced while reviewing the demo stub):
  - **Credit historical walks** — the row-kebab "Credit walks" item exists but fires the stub-feature toast (2026-06-10: a silent +25 was an arbitrary hidden mutation); real version takes a count + period + optional note. The walker-button demo dropdown remains the functional walkthrough driver.
  - **Remove from walker pool** — revoke the vouch entirely (destructive, reason required). Distinct from demote-to-vetted; needs a removed-walkers layer since seeded rosters are static. **The shelter-level "block" folds in here as a don't-readmit flag on removal** (PO question 2026-06-10) — not a separate action, and not the person-to-person Block from the trust model (that stays on user surfaces). Visible today as a stubbed destructive item on the Members-row kebab (fires the placeholder toast).
  - **Pause walker** — temporary suspension (incident under review, long absence) without the finality of removal. Pairs with §14's incident-reporting open item and §5 trust regression.
  - **Coordinator notes** — private per-walker notes ("prefers small dogs," "no Sundays," "great with reactive dogs"). Shelter-internal; never rendered to the walker.
  - **Per-walker dog restrictions** — mirror of the per-dog overrides from the walker side ("not Berta," "small dogs only"). Composes into the walk-eligibility check (strictest wins).
  - **Message walker** — routes through the staff-linking layer once Team mode exists (institutional accounts can't chat today).
- **Notification routing** — applications + walks-needing-approval + incident reports land in shelter's Inbox.
- **Shelter-account messaging** (PO direction 2026-06-11) — institutional accounts can send/receive messages as "the shelter." Needs the `Conversation` party model widened beyond user-to-user (shelter id as a party, logo avatar, thread routes to `/shelters/[id]`), plus the who-reads-replies answer (shared account by default; staff attribution via Team mode). First consumer when it lands: the mentor-graduation vouch message migrates from mentor-sent to **shelter-sent with mentor attribution** ("vouched by Klára H.", linked) — the PO's preferred framing, deferred from the Mentor Network phase (walkthrough O8).

**Effort:** Large — multi-phase work. Standalone phase, probably broken into Admin Foundation + Admin Operations.

**Refs:** `Cold-Start Playbook.md` → "Mentor-vouching as the scalable trust mechanism" (bootstrap affordance), `Open Questions §14` → shelter operator/admin view (already flagged as V3+), `Open Questions §5` → safety + liability + incident reporting integration.

**Added:** 2026-06-09

---

## FC17. Feature-focused guided walkthroughs (beyond the V2 concept story)

> **✅ SHIPPED 2026-06-24 via `phases/multi-path-demo.md` (Phase 1 of a two-phase arc).** Delivered as a **named-walkthrough registry** + a **multi-door launcher** (distinct journey doors on `/`) + **three single-thesis guided walkthroughs** — W1 new-owner, W2 trainer, W3 shelter (demand-side). Re-scoped from the documented four feature-paths to **three audience Worlds**; `neighbour-care` absorbed into W1. The shelter's *operator* view (not in FC17's taxonomy) became the real fourth and graduates to **Phase 2 "The Shelter's Side"** (pulls a slice of [[FC16]] forward). Entry retained for the source taxonomy + scope-sketch; the board + `lib/walkthroughBeats.ts` are the SOT.

**Trigger:** After the current feature/surface flesh-out arc settles (Mentor Network closed + Adoption-Curious Doorway / Multi-Path Demo landed, or whenever a demo-packaging pass opens). PO direction given 2026-06-10 during the Mentor Network build. **NOT gated on shelter interviews** (PO clarification 2026-06-11: interview timing is unknown, so the guided shelter-facing walkthrough — concise, clearly and strongly demonstrating the potential features — is on the build path regardless; the live-driven script doc remains the interview artifact for whenever those happen, not a prerequisite).

**Context:** The guided-walkthrough infrastructure (auto-switching personas, interstitials, step cards — `WalkthroughContext`, Demo Narrative V2) currently carries ONE story: the 3-beat Daniel → Klára → Daniel concept narrative. The Mentor Network phase drove its shelter-facing demo LIVE via the hidden state-toggles (walkthrough O9) — but per the 2026-06-11 PO direction, **the guided demo IS the interview**: there's no separate live-presentation step before it. The guided shelter walkthrough therefore carries the interview function itself — concise, clearly and strongly demonstrating the potential features, with the Playbook's assumption probes embedded as in-demo checkpoints (step cards / interstitials that pose the question to the viewer: "would your shelter accept this vouch?"), not as a separate crib sheet. The live-driven script doc (`cross-shelter-mentor-network-shelter-demo.md`) is the SOURCE MATERIAL for that conversion — its beats + ASSUMPTION callouts + crosswalk table translate nearly one-to-one — and stops being a standalone delivery plan.

**Walkthrough taxonomy (PO direction 2026-06-11 — names are placeholders, bless at build time):** more than two, by splitting the current main demo. Today's 3-beat story shows the trainer-walker angle AND the private-group "Care from neighbours" surface — two unrelated, somewhat competing care models sharing one long tour. Proposed registry, each path tight and single-thesis, semantic ids + display names anchored to the Ways In doors:

| id | Working name | Thesis | Source |
|---|---|---|---|
| `trainer-walker` | "Meet your trainer" | Community walk → trust → paid training (the keystone archetype; Daniel → Klára) | Split from the current main demo |
| `neighbour-care` | "Care from your neighbours" | Private block group, neighbours minding each other's dogs (Magda/Tomáš world) | Split from the current main demo |
| `shelter-mentor` | "Help a shelter dog" | Mentor-vouched path to walking shelter dogs + shelter authority (Tomáš's mentee arc) | Converted from the Mentor Network script doc |
| `adoption-curious` | "Try before you adopt" | Walk shelter dogs to explore ownership | **Content + beats SHIPPED** 2026-06-13 (Adoption-Curious Journey); beats in `Demo Narrative.md` → Adoption-Curious Arc. FC17 wraps them in guided UI. |

**Scope sketch when triggered:**
- **Landing-page restructure** (PO, 2026-06-10): the `/` launcher gets walkthrough journey openings as distinct entry doors — not a picker behind the single "Start the walkthrough" CTA. The cast-card half likely reshuffles around them. (Deliberately deferred during the Mentor Network phase — only Tomáš's card copy was updated then.)
- Walkthrough registry — named walkthroughs (semantic ids above) with their own beat lists; launcher doors map onto them.
- Per-walkthrough pre-staged state (the pre-staging the Mentor Network deliberately skipped) — likely seeded context snapshots keyed by walkthrough id, so a guided run starts mid-world without hand-driving toggles.
- **Splitting the main demo** — belongs with the Multi-Path Demo phase's "cut each individual demo path tighter" discipline; the split decision is made there, this entry carries the direction.
- **Assumption checkpoints in the shelter-mentor walkthrough** — the interview function: in-demo moments that pose the A# probes to a coordinator viewer and (ideally) capture their reaction.
- **Mentor slots calendar** (production direction, noted 2026-06-11) — the mentor list currently summarizes coarse availability ("6 days a week · mornings & afternoons") + date-picker booking, consistent with every other booking surface. The real version is a calendar of mentors × bookable slots — but a slot model exists NOWHERE in the prototype, so it waits for a scheduling layer rather than being invented for one flow.

**Effort:** Medium-plus — the step-card/interstitial machinery exists; the new work is the registry, per-walkthrough state staging, beat authoring ×3, and the checkpoint pattern.

**Refs:** `features/demo-mode.md` (guided walkthrough spec), `strategy/Demo Narrative.md`, `phases/cross-shelter-mentor-network-shelter-demo.md` (beat script to convert), ROADMAP → Adoption-Curious Doorway + Multi-Path Demo (parallel-paths discipline).

**Added:** 2026-06-10

---

## FC18. Group shelter walk — a Meet that sources its dogs from a shelter (the social on-ramp + mentorship funnel)

> **✅ DEMO SLICE SHIPPED 2026-06-24 via `phases/multi-path-demo.md` (Workstream G).** Real sign-up to walk a shelter dog ON the trainer-led group walk → a meet-linked shelter-walk `Booking` (`dropoffMeetId`); **two-tier** (vouched = free volunteer walk; un-vouched = paid mentored first walk that counts toward the vouch); captured walk feeds the advocacy loop. **Deferred operational pieces remain future** (still shelter-interview questions): the physical multi-dog checkout/release model, mentor-as-responsible-party, group-context waivers, and the shelter *operator* side (→ Phase 2 "The Shelter's Side" / [[FC16]]). Entry retained for those open logistics + the shipped-design record.

> **✅ SHIPPED 2026-06-13 (Adoption-Curious Journey, Workstream C).** Built as a **mixed** community walk linked to a shelter via `Meet.shelterWalk?: { shelterId }`; shelter dogs ride in `MeetAttendee.dogNames` (name-resolved, badged on the People tab); host = Klára (Super Volunteer) in her care group; Útulek flipped `groupWalksPermitted: true`. The two-tier funnel survives as the un-vouched "Walk with a mentor" eyebrow link. **Reframed from the original spec:** newcomers do NOT attend dogless ("come along socially" was dropped as off-thesis) — the walk is dog-first and the newcomer's path is the mentored first walk, not tagging along. **Carried forward** (logged in Open Questions, not built): the real shelter-dog **checkout/release model** for a group (intended = a shelter-walk `Booking` linked via `Booking.dropoffMeetId`, not an in-meet picker) → shelter interviews. Entry retained for that open logistics question + the shipped-design record.

**Trigger:** After the Cross-Shelter Mentor Network closes and the solo-walk Booking surface (Workstream G) is solid. Or sooner if a shelter conversation surfaces "we'd rather host group walks than one-at-a-time hand-offs," or the Adoption-Curious Doorway / Multi-Path Demo phase wants a warmer entry than a cold solo shelter visit. PO idea, 2026-06-12.

**Context:** A trainer-walker (Super Volunteer / mentor) promotes a **group walk where members pick up shelter dogs** — they collect a dog from the shelter, others sign up to collect one too. The insight: a friendly group walk is a far more inviting on-ramp than walking into a shelter cold and decoding its process. Volunteering + meeting people + visibly showing you volunteer all compound — the community grows and more dogs get cared for.

This reuses a primitive we already have. "Meets" is the umbrella for organized dog social activities, and the **Meet** service shape is already "sessions with a roster → RSVP" (Services as Catalog). A group shelter walk *is* a Meet — the only new thing is that the roster's dogs come from a `ShelterProfile.dogs[]` instead of members' homes. Not a new concept; a Meet whose dogs are shelter dogs.

What makes it strategically load-bearing is the **two-tier roster**, because walking a shelter dog gates on being vouched (the credentialing machine):
- **Vouched walkers** → can pick up a dog and walk.
- **Un-vouched newcomers** → can still *join the walk* (come along, meet people, see how it works) but can't take a dog yet — **and that slot is exactly where a "get mentored by me" CTA lands.** The group walk becomes the warm top-of-funnel; mentorship is the conversion. This is the cold-start answer: nobody walks into a shelter cold.

Second-order unlocks:
- **The mentor gets a recurring product + a retention mechanic.** Today mentoring is a one-time transaction (3 sessions → vouched → relationship's job is done). A standing group walk gives the Super Volunteer a durable role — newcomers to convert *and* graduates who come back for the social walk, instead of graduating and drifting off.
- **Convergence surface.** A community Meet (green) that produces shelter care (Help a Dog) and runs on the credentialing layer (violet) — where the Ways In actually meet.
- **Adoption engine.** A long-stayer (Maja) gets out, is seen on the trail, photographed, posted (posts/photos are one collection); a walker who bonds is the warmest adoption lead there is. Feeds the existing "Adopt {dog}" CTA. Overlaps the deferred adoption-curious / Multi-Path thread.

**The shelter pitch it sharpens:** to a shelter this is **enrichment throughput + a managed, vetted pipeline + an adoption funnel** in one — one mentor enriches N dogs per outing and onboards newcomers simultaneously; it's credentialed, so it answers the liability objection up front; bonded walkers become adopters and advocates. The broader frame the PO is forming: Doggo promotes more dog care, more adoption, more dog knowledge — community grows, more dogs get cared for, and shelters see the appeal.

**Two open tensions to resolve before pitching (not now):**
1. **Newcomer-in-a-group liability** — an un-vouched person at a walk where dogs are out. Purely social (no dog contact) until vouched, or a "supervised handling" middle state? Shelter-policy question, A2-adjacent.
2. **Checkout logistics** — a shelter releasing N dogs to a group at once is operationally heavier than one-at-a-time; the mentor-as-responsible-party likely matters here.

**Color note:** both the mentored walk and a plain solo shelter walk sit in **violet (volunteer)**, distinguished by content (mentor present + session counter vs none), not a second color — see the booking-accent discussion. The group walk itself is a community Meet (green) at the top of funnel; the mentorship conversion inside it is violet. That green→violet boundary is the funnel, and it's a feature.

**Effort:** Medium-to-large — likely its own phase (or a workstream within Multi-Path / Adoption-Curious). Reuses the Meet roster + RSVP machinery and the eligibility/vouch check; new work is the shelter-dog roster source, the two-tier roster rendering + newcomer CTA, and the group dog-checkout model. Demo-able earlier than fully built (the roster + CTA carry the story).

**Refs:** `docs/strategy/Groups & Care Model.md` (Meet shape / Services as Catalog), `docs/strategy/Cold-Start Playbook.md` ("Help a Dog" thread + mentor-vouching engine), `docs/features/shelters.md` (`ShelterProfile.dogs[]`, walker eligibility), `phases/cross-shelter-mentor-network-shelter-demo.md` (shelter pitch framing), [[FC7]] (Dogs tab carousel for Help a Dog), [[FC17]] (`adoption-curious` walkthrough). Surfaced 2026-06-12 during Mentor Network booking-sheet polish.

**Added:** 2026-06-12
