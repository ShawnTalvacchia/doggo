---
status: living
last-reviewed: 2026-05-13
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
