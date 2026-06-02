---
status: living
last-reviewed: 2026-06-01
review-trigger: "Append when a 'noted for later' idea surfaces; promote out when triggered"
---

# Future Considerations

Long-term ideas, possible add-ons, and improvements to keep on the radar — things that aren't actionable now but are worth not-forgetting.

**Distinct from:**
- **Open Questions** (`docs/strategy/Open Questions & Assumptions Log.md`) — strategic questions awaiting resolution. Future Considerations are NOT questions; the direction is known, just waiting for a trigger.
- **Punch List** (`docs/phases/punch-list.md`) — concrete, actionable fixes (≤few hours each). Future Considerations are speculative or trigger-gated; usually too big OR too tentative for the punch list.
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

**Trigger:** A walker or shelter coordinator surfaces "I want to scan the roster more quickly" (list view), or the "Help a Dog" entry point (Cold-Start Playbook future thread) needs an emotional one-dog-at-a-time pattern (carousel view).

**Context:** Shelter Foundation (2026-06-01) shipped the Dogs tab as a single photo-led card grid (2-up on desktop, 1-up on mobile). Two additional view modes were discussed and deferred:

- **List view** — small dog avatar on the left, info on the right. Most compact; useful for staff/walkers scanning who's available, who needs a walk, etc. Trades emotive presentation for density.
- **Carousel / one-at-a-time view** — swipe-style focus on a single dog at a time. Emphasizes commitment (you can't scroll past), fits the future "Help a Dog" door from the Cold-Start Playbook. Substantial UI build (swipe gestures, transitions, navigation, prev/next state).

Cards remain the default. A view-mode toggle (Cards · List · Carousel) would sit in the toolbar next to the sort dropdown. Sort persists across views.

**Effort:** ~3-5h for List (new compact row component + view-mode toggle state + CSS). Carousel is its own ~1-day build (gesture handling, animation, nav UI) and should probably land as part of the "Help a Dog" Cold-Start phase rather than incrementally on the existing Dogs tab.

**Refs:** `app/shelters/[id]/page.tsx` (`DogsTab`), `components/shelters/ShelterDogCard.tsx`, `docs/strategy/Cold-Start Playbook.md` ("Help a Dog" thread), Shelter Foundation walkthrough.

**Added:** 2026-06-01

---

## FC8. Shelter dog tag system formalization

**Trigger:** Manual tag inconsistency becomes a real maintenance pain (one shelter's "Reactive" is another's "Reactive to other dogs"), OR a search/filter affordance over tags becomes a real ask.

**Context:** Shelter Foundation (2026-06-01) seeded shelter dogs with a `tags: string[]` free-text field — "Affectionate", "Smart", "Reactive to other dogs", "Long-stayer", "New arrival", "Solo only", etc. Tags currently render only on `/dogs/[id]` (the Dogs-tab card was pared back to drop them, since auto-derived chips communicate the urgent signals).

Two distinct tag categories are mixed in the current data:
- **Auto-derivable** — Long-stayer (`daysInKennel >= 30`), New arrival (`daysInKennel <= 7`), Senior (age-derived), Puppy (age-derived). These should be computed at render time, never manually entered. Today some of these are duplicated manually in the `tags` array.
- **Curated personality** — Affectionate, Calm, Smart, Shy, Wary of strangers, etc. These are human-judgment tags. A controlled vocabulary (enum or constants set) would make them consistent across shelters.

Cleaner system: split `PetProfile.tags` into auto-derived (computed, never stored) + curated personality (typed enum or constants-backed string union). Or just keep the free-text field and rely on documentation conventions. Either way, the V1 mock data needs a cleanup pass: drop redundant auto-derivable entries, harmonize wording.

**Effort:** ~2-3h. Define the personality-tag vocabulary; refactor seeds; add a `deriveAutoTags(dog: PetProfile)` helper; update the dog profile + future surfaces to compose auto-derived + manual.

**Refs:** `lib/mockShelters.ts` (current free-text seeds), `app/dogs/[id]/page.tsx` (renders `dog.tags`), `components/shelters/ShelterDogCard.tsx` (uses `pickAutoChip` — the seed for the auto-derived pattern).

**Added:** 2026-06-01

---

## FC9. Locked-profile rendering across surfaces

**Trigger:** The Credentialing Moat phase (Carer Portfolio + Shelter Walker Credentialing) opens. Or sooner if a walkthrough surfaces "I clicked on a walker name and it 404'd" / "Why can't I see this person?"

**Context:** The visibility-gradient machinery for showing a person to a viewer (full identity vs Tier-2/Tier-3 collapse vs "+ Familiar" pill on locked profiles with shared context) already exists in `PersonRow` + `getAttendeeTier` + `lib/personActions.ts` + `PrivateProfileRow`. It runs on the community Members tab today.

Several surfaces don't use it yet — most notably the **shelter Members tab**, where walkers are rendered through a custom `ShelterMemberRow` because today's walkers are directory-style entries without `UserProfile` records. When walkers bridge to real personas (planned for credentialing-moat), the move is: make `ShelterMemberRow` a thin wrapper around `PersonRow` (passing the walker affiliation chip + tier label into PersonRow's chip slot). Visibility logic comes for free.

Same applies to: post comments from un-bridged authors, "Recent walkers" on dog profiles, future gallery sub-attribution. The principle is one shape per entity, regardless of which surface renders it.

**Effort:** ~2-3h within the credentialing-moat phase once walker personas exist. Most work is wiring, not rebuilding.

**Refs:** `components/people/PersonRow.tsx`, `components/people/PrivateProfileRow.tsx`, `lib/personActions.ts`, `components/shelters/ShelterMemberRow.tsx` (today's stand-in), `docs/strategy/Trust & Connection Model.md` (full visibility model).

**Added:** 2026-06-01
