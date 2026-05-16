---
status: archived
last-reviewed: 2026-05-14
review-trigger: archived
---

# Profiles Deep Pass — Walkthrough

Verification checklist for the Profiles Deep Pass phase reopen (2026-05-11). The phase originally paused 2026-04-14 with trust signals (A3), post composer (C1–C3), and post header attribution (B2/B3) shipped. This walkthrough covers the work landed during the 2026-05-11 reopen run.

**Thesis being verified:** profiles feel like real people with real lives, and the relationship hub (About, Posts, Services) reads as one coherent surface. The structural change this round is **edit mode lives in the AppNav header slot** — Edit / Cancel / Save no longer dangle in the tab body; the user is fully locked into edit when they enter it (TabBar, Bell, Chat all hide) and leaves it by committing or cancelling.

**How to use:**

1. Run dev server on port 3000 (`npm run dev`).
2. Switch personas via the profile-page name dropdown, `/demo`, or `?as=<personaId>`.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Available personas:** Tereza (Vinohrady connector, open + casual carer), Daniel (anxious new owner, locked), Klára (trainer, public Carer with Care group), Tomáš (Karlín professional, no carer profile), New User.

---

## Workstream A — Posts header refactor (B5)

The in-panel "Posts" heading + "New post" button row was redundant with the AppNav Camera+. New model: on own-profile Posts tab, AppNav Camera+ goes away (suppressed via `PageHeaderContext.suppressCreate`) and `+ New post` lives flush-right at the top of the panel.

- [x] **A1. Tereza → `/profile?tab=posts`.** AppNav row shows **Bell + Chat only** (Camera+ suppressed). Panel renders the `ShareMomentBar` strip full-width at the top of the posts list. No "Posts" heading inside the panel.
- [x] **A2. Tereza → `/profile?tab=posts`, tap the ShareMomentBar prompt.** Post composer opens. Cancel/Close returns cleanly.
- [x] **A3. Tereza → `/profile?tab=about` or `?tab=services`.** AppNav slot now renders the **Edit** text button (see Workstream C). Camera+ is gone (replaced by Edit on About/Services, not present on Posts).
- [x] **A4. New User → `/profile?tab=posts`.** Empty-state "Share a moment" button renders. No `+ New post` at top (gated on `posts.length > 0` so the empty state isn't double-CTA'd).
- [x] **A5. Tomáš → `/profile/tereza?tab=posts`** (other user's posts tab). AppNav Camera+ **does** render (global compose still available). No in-panel `+ New post` (gated on `isOwnProfile`).

---

## Workstream B — PetCard + own-self redirect (A5)

Verifies the PetCard treatment system (energy pill, neutral pills, inline health checks, body-copy conditions, section dividers, FirstAidKit icon) + persona-dog vet-info coverage + the `/profile/[ownId]` self-redirect.

- [x] **B0. Daniel → `/profile/daniel`** (typing own ID into the URL). Redirects to `/profile` — does NOT render the "this profile is private" gate against self. Tab param preserved when valid on the own-profile route.
- [x] **B1. Daniel → `/profile?tab=about`, scroll to "My dogs" → Bára.** Caret is **vertically centered** with the identity column (not floating at the top-right corner of the card). Caret pushes to the right edge of the header.
- [x] **B2. Daniel → Bára card, expanded view.** **Energy pill** ("Moderate") has a visible border (`--{level}-600`) + tinted fill (`--{level}-50`) + colored text. **Play-style pills** ("Sniff explorer", "Fetch lover") share the system-neutral pill treatment: `--surface-inset` fill + `--border-strong` border + `--text-secondary` text. Both pill silhouettes read clearly against the `--surface-base` card.
- [x] **B3. Daniel → Bára card, expanded view, scroll to Health & vet.** Verify the section as a whole:
  - Section header uses the **FirstAidKit** icon (filled, brand-tinted) — visual weight matches the Heart icon on the Socialisation section above.
  - Section has a **visible top border** (was `--border-light`, invisible against `--surface-base`; now `--border-strong`).
  - "Vaccinations up to date" + "Spayed / neutered" render as **icon + colored text only** (no pill chrome) — `ShieldCheck` glyph + `--success-600` text, sitting inline.
  - Conditions text ("Mild leash reactivity. No food allergies. Sensitive stomach with novel proteins.") renders as **plain body copy** matching the Socialisation paragraph — no pill, no amber, just `--text-secondary` body text.
  - Vet clinic ("Veterina Smíchov") sits in a **neutral pill** (same treatment as play pills); "Last visit Feb 2026" follows in muted `--text-tertiary`.
- [x] **B4. Tereza → `/profile?tab=about`, "My dogs" → Franta + Bella.** Both have vet info (Veterina Vinohrady). Health & vet section renders with vaccinations + spayed/neutered + clinic line.
- [x] **B5. Klára → `/profile?tab=about`, "My dogs" → Eda.** Vet info present (Veterina Holešovice).
- [x] **B6. Any persona → `/profile/shawn?tab=about`, "My dogs" → Spot.** Tap to expand (other-user cards default collapsed). Photo gallery thumbnails appear at the bottom of the expanded card (Spot has 3 gallery photos seeded). Confirm the Camera badge over the avatar shows the count. *(Persona-agnostic: Shawn's profile is `profileVisibility: "open"` so any viewer can see him; Shawn himself is not on the persona picker, so this is always viewed from someone else's perspective.)*
- [x] **B7. Tomáš → `/profile/marek?tab=about`, "My dogs" → Benny.** No-energy / no-socialisation states render gracefully (Benny has minimal data). Caret still works.

---

## Workstream C — Edit-mode rework via AppNav slot (A6)

**Phase thesis.** The single biggest UX change. Edit / Save / Cancel moved from a hero button + in-tab chrome into the AppNav page-action slot. Edit mode is now a fully locked state.

- [x] **C1. Tereza → `/profile?tab=about`.** Horizontal hero: avatar (200×200) left, name + chips + meta + Share Profile right. Stacks vertically on narrow viewports. Matches `/profile/[userId]` shape.
- [x] **C2. Tereza → `/profile?tab=about`, AppNav row.** Renders **Edit** (outline variant, with pencil icon) + Bell + Chat. Camera+ is gone (replaced by Edit). On desktop, the same `Edit` button also appears in the `.page-column-header` above the panel — same `pageActionNode` flows into both surfaces via `PageColumn.headerAction`.
- [x] **C3. Tereza → `/profile?tab=about`, tap **Edit**.** App enters edit mode:
  - **TabBar disappears** (no About/Posts/Services strip).
  - **Bell + Chat disappear** from AppNav (navLockedIn).
  - AppNav row shows **Cancel + Save** only.
  - About tab body shows the edit form (bio textarea, PetEditCard rows, Add dog button, Tagging settings).
- [x] **C3a. Tereza → in edit mode, scroll to first PetEditCard (Franta).** Compact summary row (photo thumb + name + breed + caret + Trash) is always visible; tap to expand. Saved pets default collapsed; new pets auto-expand. When expanded, four sections appear: Basic info / Personality (Dog icon) / Socialisation (Heart icon) / Health & vet (FirstAidKit icon, collapsible — Franta's vet data auto-expands).
- [x] **C3b. Tereza → About tab, Profile visibility + Tagging preferences.** View mode = compact summary cards. Tap Edit → both expand to full picker with helper text. Tap a row → commits immediately. Visibility labels read **Private / Public** with Familiar-inclusive description. For Private profiles, the "About marking people Familiar" explainer nests inside the visibility section.
- [x] **C3c. Tereza → in edit mode, tap "+ Add dog".** New pet card appears auto-expanded with "New dog" placeholder + Dog icon in empty thumb slot. Fill name → summary row updates live. Toggle caret → collapse/expand. Trash → remove.
- [x] **C4. Tereza → in edit mode, type into bio textarea, tap **Cancel**.** Edits discarded silently (no confirm prompt). Returns to view mode. TabBar reappears. Bell + Chat reappear. Bio is unchanged.
- [x] **C5. Tereza → tap Edit again, change bio, tap **Save**.** Bio updates in view mode. Same return-to-view behavior.
- [x] **C6. Klára → `/profile?tab=services`, tap Edit.** Lock-in works (same as About). First section is the Care-offering picker with three radio-card options: Not offering / Connected circle only / Open to anyone.
- [x] **C7. Klára → cycle through the three options + Save.** Selection updates the underlying audience state. **Not offering care** hides the Carer bio / services / modifiers / availability blocks; the other two keep them visible.
- [x] **C7a. Klára → in edit mode, scroll to Services.** Each Care service is its own card: section header (service-type label) + red trash on the right, then Price / Includes sub-services pills / Notes / Pricing modifiers accordion. Per-type "+ Add ..." buttons below (one per unconfigured ServiceType). Meet-type footnote appears when applicable (Klára has session offerings, Tereza doesn't).
- [x] **C8. Daniel → `/profile?tab=services`.** Empty-state "Want to offer care?" card renders with hint to tap Edit.
- [x] **C9. Tereza → `/profile?tab=posts`** (no Edit verb here). AppNav shows Bell + Chat only. No Edit button in slot (intentional — Posts doesn't have an edit mode; the verb is New post which lives in-panel per Workstream A).
- [x] **C10. New User → `/profile?tab=about`.** Edit button still renders (New User has no pets yet but can still edit their bio + add a dog). Tap Edit → lock-in works the same way.
- [x] **C11. Tomáš → `/profile/tereza?tab=about`** (other user's profile). No Edit button anywhere — this is someone else's profile. AppNav shows Camera+ + Bell + Chat (global compose unaffected).

---

## Workstream G — Connections surfaces (extends E4)

Two distinct surfaces verified here. *(Workstream letter is G rather than E2 — avoids name collision with the original phase-board task E2 'Share profile link.')*

### G.1 — Mutual connections (other-user About)

The "you both know" section on **someone else's** About tab. Renders the Connected-only intersection of viewer × subject.

- [x] **G1. Tereza → `/profile/shawn?tab=about`.** After Dogs, a **Mutual connections** section renders: avatar stack of up to 5 + count line ("2 mutual connections") + "View →". Section is hidden entirely when there are zero Connected mutuals.
- [x] **G2. Tereza → tap the Mutual connections row.** ModalSheet opens with title "You both know · N". Each row links to that person's `/profile/[id]`. Tapping a row closes the modal and navigates.
- [x] **G3. Privacy check: Familiar marks NEVER appear in Mutual connections.** Pick a persona pair where the viewer has Familiar marks the subject doesn't know about. Those rows must not appear under Mutual connections on that subject's profile. Connected-only by design.

### G.2 — Connections roster (own profile About)

The full Connections list on **your own** About tab, grouped by state. Different surface from G.1.

- [x] **G4. Daniel → `/profile?tab=about`** *(own profile — no `/[userId]`)*, scroll to Connections. Each non-empty state (Connected / Familiar / Pending) renders as a **summary card** — avatar stack (up to 5 + "+N" overflow chip) on the left, label + count ("3 people") on the right. Empty states are hidden.
- [x] **G5. Daniel → tap View all.** ModalSheet opens titled "Connections · N" with the full, uncapped grouped list. Closes cleanly.
- [x] **G6. New User → `/profile?tab=about`.** Zero connections renders the empty state ("No connections yet. Attend a meet…") with the Browse Meets CTA. No View all button.

---

## Workstream D — Services tab (D6 + D7)

Verifies the Carer audience picker (Services edit) + audience signaling (view mode) + the locked-provider banner CTA across persona states. *(D6 / D7 outcomes documented in the Decisions section below.)*

- [x] **D1. Klára → `/profile?tab=services`, tap Edit, scroll to top.** Care-offering picker renders with the **Connected circle only** option selected (Klára's current state — `openToHelping: true`, `publicProfile: false`). Hover over each card — selected has brand-main border + brand-subtle tint; unselected get a subtle `--surface-inset` hover tint.
- [x] **D2. Klára → tap **Open to anyone**, tap Save.** View mode loads. Above the Carer bio, a small **"Offering care" summary card** renders: Globe icon + "Open to anyone" + "Your services are discoverable in Discover by anyone in Prague." Switching back to circle in edit shows UsersThree icon + "Connected circle only" + "Only people you're Connected with can see and book your services." Carer Identity badge on the hero also reflects the role.
- [x] **D3. Tereza → `/profile?tab=services`** (carer with `publicProfile: false`, profile is open but carer audience is circle-only). Badge line reads **"Connected circle only"**. Banner does NOT show (banner is gated on profile being locked).
- [x] **D4. Marek → `?as=marek` then `/profile?tab=services`** (no carerProfile). "Want to offer care?" empty-state card renders. Tap Edit → picker preselects **Not offering care**.
- [x] **D5. Locked-provider banner CTA.** No persona has the (locked + carer + has-services) combo in current seed. Deferred until a seed candidate appears naturally OR a future phase (Onboarding & In-Product Communication) needs it for tutorial flow.

---

## Workstream E — Cross-cutting consistency (X1–X4 scoped)

Light-touch consistency checks. Full cross-cutting walk happens at phase close.

- [x] **E1. Tereza → `/profile`.** TabBar visible. Tap About → Posts → Services. AppNav action slot updates per tab: Edit / (nothing) / Edit. No flicker.
- [x] **E2. Tereza → enter edit, switch persona via name dropdown.** New persona arrives in view mode with TabBar visible (no stuck-in-edit state).
- [x] **E3. Daniel → `/profile/tereza?tab=about`.** Other-user profile renders without Edit button. AppNav shows Camera+ + Bell + Chat.
- [x] **E4. Mobile width (≤640px) + resize between widths during edit mode.** Lock-in holds; no overflow; Cancel/Save fits the row.

---

## Decisions surfaced during walkthrough

Emergent decisions / design changes during verification. **Append as you walk**, sweep at phase close.

### Edit-mode + AppNav slot (A6 / B5)

- **Auto-discard on Cancel — no confirm prompt.** Pragmatic choice for the prototype; matches Doggo's general "no half-built modal" feel. If user-testing reveals lost-edit complaints, revisit. → `docs/features/profiles.md` if it survives testing
- **AppNav page-action slot pattern.** New `PageHeaderContext` fields (`pageAction`, `suppressCreate`, `navLockedIn`) — a reusable mechanism for any page that wants a contextual primary action in the AppNav nav row + optional lock-in mode. Profile is the first consumer; future phases may apply it (booking detail, meet detail, group detail). The same `pageActionNode` flows into `PageColumn.headerAction` for desktop. → `docs/implementation/design-system.md` (new principle: page-action slot)
- **Own-self redirect on `/profile/[ownId]` + hydration gate (B0 + C11 bugfix, 2026-05-13).** Visiting your own URL while logged in as that user redirects to `/profile`, preserving the tab param if the destination tab exists on the own-profile route. Without this, the page applies the viewer-vs-subject gate against yourself — locked personas see "this profile is private" about themselves. **Hydration gate added 2026-05-13 (C11 bugfix):** `useCurrentUser` resolves to Tereza (canonical default) on SSR + first paint until `localStorage` hydrates. Pre-hydration, `isSelf` evaluated as `tereza === userId` — so any non-Tereza persona (e.g. Tomáš) visiting `/profile/tereza` false-positively triggered the redirect, bouncing them off Tereza's page. Fix: new `useIsHydrated()` hook reading a `hydrated` flag on `CurrentUserContext` (flips true at end of the mount-hydration `useEffect`). `isSelf` now gated on `isHydrated && !isGuest && userId === currentUserId` — pre-hydration the redirect can't fire because `isSelf` stays false. Same gate also prevents the `if (isSelf) return null` blank-render path from flashing pre-hydration. → `docs/features/profiles.md`, `docs/features/demo-mode.md` (hydration-gate pattern for persona-identity-dependent side effects)
- **Own-profile hero converged with `/profile/[userId]` shape.** Avatar-left + name/location/dogs/member-since/Share-right horizontal layout, stacking vertically on narrow viewports. Hero lives inside the About tab body now (not page-level chrome above tabs), so Posts and Services don't show the hero — matches other-user profile model. → `docs/features/profiles.md`
- **Hero pills moved UNDER the name + sized + reordered (2026-05-13 PDP polish).** Carer identity chip ("Dog Trainer", "Carer", etc.) and Profile visibility chip ("Private profile" / "Public profile") used to sit inline alongside the name (`flex-wrap` row) — at narrow widths they'd wrap below, but at wider widths they competed with the name for heading weight. Three sub-fixes shipped together:
  1. **Moved under the name** — dedicated row directly underneath, no `flex-wrap` (combined chip width fits 280px viewport). Mirrored on own-profile + `/profile/[userId]` heroes.
  2. **Reordered: visibility first, carer second** — visibility is the more structural fact (always present, defaults to "Private"; the privacy state modifies the noun "profile"). Carer role is conditional supplementary metadata. Reading "Private profile · Dog Trainer" is the natural order.
  3. **Sized to match** — the carer chip used `.person-row-pill--carer` (11px font, no vertical padding, 16.5px tall — sized for PersonRow's dense 36px rows); the visibility chip used the chip pattern (12px font, `px-sm py-xs`, 24px tall). On a hero they're a sibling pair; size mismatch read sloppy. Both now use the chip chrome (`flex items-center gap-xs rounded-pill px-sm py-xs text-xs font-medium`). Colors stay distinct — visibility = neutral surface, carer = info-blue. Different meanings deserve different colors; what should match is the chrome.
  - Share Profile button also dropped from `size="md"` to `size="sm"` so the hero's right column reads as identity + metadata + light action, not three competing chrome elements.
  - PersonRow's `.person-row-pill--carer` is unchanged — it remains the compact PersonRow treatment. Hero-specific chrome is inlined per surface (not yet extracted into a shared `IdentityChip` component; would consider that if a third surface appears). → `docs/features/profiles.md`, `docs/implementation/design-system.md` (chip-vs-pill: chip = hero/header chrome 24px, pill = dense-row chrome 16-20px)
- **CTA row pairs wrap to stacked full-width at tiny viewports (2026-05-13 PDP polish).** The relationship/action pair on `/profile/[userId]` ("Mark Familiar" + "Message"/"Book care"/"Connect with X") + the Care pair on own-profile ("Find care" + "Offer care"/"Manage your services") both used `flex gap-sm` (or `flex flex-wrap gap-sm`) + `flex-1` on each button. `flex-1` is `flex: 1 1 0%` (basis 0%); with `.btn`'s `white-space: nowrap`, the buttons would compete to grow from a 0 basis but couldn't shrink below content width — overflowing the panel horizontally on iPhone SE / 320px viewports rather than wrapping. Replaced with `flex flex-wrap gap-sm` + `grow basis-[140px]` per button so the pair shares the row equally when both fit (each grows from 140px to fill), and wraps to stacked full-width when the panel is narrower than `2 × 140 + gap`. → `docs/implementation/design-system.md` ("flex-1 + white-space:nowrap can't shrink — use `grow basis-[N]` for paired CTAs that need to wrap on narrow viewports")
- **`ShareMomentBar` redesigned to a 3-part inviting-affordance strip + propagated to community feed (2026-05-11 initial / 2026-05-13 redesign).** Origin: own-profile Posts had a redundant in-panel "+ New post" button alongside the AppNav Camera+ — Camera+ now suppresses on this surface via `PageHeaderContext.suppressCreate`, and the in-panel action lives in the `ShareMomentBar` strip. **Final shape after 2026-05-13 redesign** (was a single-line sunken pill "Share a moment..."): self-contained `--surface-top` strip with top + bottom `--border-regular` borders, three parts inside —
  1. **Avatar (40px circle, current user)** on the left, establishing card grammar so the bar visually foreshadows the posts it produces.
  2. **Sunken pill input prompt** ("Share a moment..."), primary tap target — opens `PostComposer` modal.
  3. **Shortcut row** of `Photo · Dog · Location · Group` (light tertiary buttons with Phosphor icons). Surfaces the tag-taxonomy affordances that were previously hidden inside the composer. Each shortcut opens the composer with that tag picker auto-active: Photo opens with no picker (composer shows the photo-add affordance prominently); Dog → `"dog"` picker; Location → `"place"` picker; Group → `"community"` picker.

  **Implementation:** `PostComposerContext.openComposer` signature migrated from `(groupId?: string)` → `(opts?: { groupId?: string; initialTagPicker?: PostTagType })`, mirroring `MeetComposerContext`. Three positional-arg call sites updated (`app/communities/[id]/page.tsx` × 2, `components/groups/GroupDetailPanel.tsx`). `PostComposer` auto-opens the requested picker on mount via a one-shot ref guard mirroring the existing `hasSetPreselected.current` pattern. Strip chrome is self-contained, so the outer `--surface-top` wrapper that previously lived in `PostsTab.tsx` was dropped — the component IS the strip now.

  **Propagated to community feed top** (`app/home/page.tsx` feed view, between sticky tabs and the feed list) — same component, same affordances. Suppressed for `newUserMode` (DogsNearYou leads the feed; user hasn't built community yet to share with). The header-action "Post" button is the compact sticky equivalent for scroll-down state; the strip is the in-feed invitation. → `docs/features/profiles.md`, `docs/implementation/design-system.md` (3-part inviting-affordance pattern: avatar + input + shortcut row)
- **Profile visibility + Tagging preferences gated behind edit mode (C3b, 2026-05-11).** Both `ProfileVisibilitySetting` and `TagApprovalSetting` gained an `editing` prop. View mode renders a compact bordered summary card (same shape as the "Offering care" summary on the Services tab) showing the current state — icon + label + description. Edit mode renders the full row picker. Replaces the previous always-editable pickers that were taking significant vertical room on the About tab. `onChange` semantics unchanged — taps in edit mode still commit immediately (these are state toggles, not buffered form fields like bio/pets). → `docs/features/profiles.md`
- **Profile visibility — Private/Public labels + Familiar-inclusive copy (C6, 2026-05-11).** Picker + hero chip both updated. Labels swept from "Locked"/"Open" → **"Private"/"Public"** per the Open Q §9 standardisation (data field stays `"locked" | "open"`; rename is UI-string only). Private description corrected from "Only Connected members see your full profile" → **"Only people you've marked Familiar or are Connected with can see your full profile"** to match the trust-model rule (marking someone Familiar opens YOUR profile to them; the previous copy contradicted it). The hero chip's longer-form explainer got the same treatment. Deeper teaching of the progression (None → Familiar → Pending → Connected) is the existing "About marking people Familiar" explainer card; full lesson lands in the Onboarding & In-Product Communication phase. → `docs/features/profiles.md`, `docs/strategy/Open Questions §9` (Private vs Locked drift closes for these surfaces; code field rename remains)
- **"About marking people Familiar" explainer relocated to Profile visibility section + gated on Private (C6, 2026-05-11).** Was nested inside the Connections block. Moved up under the Profile visibility picker since Familiar IS the mechanism for selectively opening a Private profile — the teaching belongs paired with the setting it explains. Gated on `profileVisibility === "locked"` so Public profile owners don't see explanation for a mechanic that doesn't apply to them. Matches Action matrix v3 (2026-04-27): "Open viewers skip Familiar entirely (it's redundant)." Surfaced a mock-data drift in the same walkthrough — Klára (Public) has 4 outbound Familiar entries on her roster, which contradicts the rule. Logged as punch list P68 for a separate data cleanup pass. → `docs/features/profiles.md`, `docs/phases/punch-list.md#P68`

### Services tab (D6 / D7)

- **Care-offering picker replaces the two-Toggle pattern (C6, 2026-05-11).** Three radio-style option cards (Not offering / Connected circle only / Open to anyone) surfaced as one section at the top of the Services edit form. Replaces the prior flat Toggles ("Open to helping" + "Open to anyone") that hid the trichotomy. Selecting an option sets both underlying booleans (`openToHelping` + `publicProfile`) together. **View mode** drops the redundant "Open to helping" pill but adds an **"Offering care" summary card** above the Carer bio — Globe / UsersThree icon + audience label + descriptive line — so owners can see their current setting at a glance without entering edit mode. (Initial sweep removed the pill outright; the summary card was added in a follow-up after walking C6 — the Carer Identity badge on the hero was too far from the services context to carry the signal alone.) **Empty-state header reworded** "Open to helping?" → "Want to offer care?". **Copy sweep**: "Open to helping" UI string retired across the app; the `openToHelping` data field name stays as the internal boolean. **Other-user services tab**: the circle-only carer explainer card was reframed from "Open to helping" + PawPrint icon to "Carer · Connected circle" + UsersThree icon. Docs swept: `features/profiles.md`, `strategy/User Archetypes.md`. → `docs/features/profiles.md`, `docs/strategy/Groups & Care Model.md`
- **`onUnlockProfile` wires the locked-provider banner CTA.** One-tap action flips `profileVisibility: "locked" → "open"`. No confirm modal — banner is the affordance, it goes away the moment the unlock takes effect. → `docs/features/profiles.md`
- **Service ↔ Meet linkage model resolved (C7a discussion, 2026-05-13) — no build this phase.** Walking C7a surfaced that Klára's 4 Meet-type "services" exist nowhere in any edit UI — the footnote claimed "managed separately" but no management surface exists. They're seed-data fixtures only. The Discover & Care phase shipped the `CarerServiceConfig` discriminated union (Care | Meet | Appointment) but only built the Care edit; the "elsewhere" never landed. Discussion locked the target model: **Services and Meets are independent entities that can be linked.** Neither owns the other. Four canonical configurations (free meet / meet+optional service / meet+required service / service with no meet); service is the monetization wrapper; one service → N possible meet links; Book routes through one flow from either doorway. Full spec + open build-time questions in Open Q §13 + `Groups & Care Model.md` → "Service ↔ Meet linkage." Footnote on `ProfileServicesTab` updated to be honest ("authoring lands in a future phase — model is documented but UI isn't built yet"). **Cold-start relevance** — per the Cold-Start Playbook, trainers are the anchor cold-start carer type, and most of what trainers sell IS Meet-type. The unbuilt authoring surface is load-bearing for the strategy. Phase-board scope deferred to a future opening (not Carer Portfolio — that's a different concept around aggregating completed-engagement trust signal). → `docs/strategy/Open Questions & Assumptions Log.md` §13, `docs/strategy/Groups & Care Model.md`

### PetCard treatment system

- **Neutral pill pattern codified.** `--surface-inset` fill + `--border-strong` border + `--text-secondary` text. Shared by `.pet-profile-play-pill` (categorical labels: Sniff explorer, Fetch lover) and `.pet-profile-vet-pill` (vet clinic name). Reads cleanly against the `--surface-base` PetCard background where the older `--surface-inset`-only treatment blended in. Future: consolidate into a general `pill--neutral` class once another surface needs it. → `docs/implementation/design-system.md`
- **PetCard energy palette switched from `--status-*-light/main` to `--*-50/600` + matching `*-600` border.** Scoped to the energy pill only — does NOT touch app-wide `--status-*` tokens. Background bumped from `*-25` (blended into card) to `*-50` (clear silhouette); border at `*-600` defines the edge against `--surface-base`. → `docs/implementation/design-system.md`
- **Health-check inline pattern (no pill).** Affirmative facts (Vaccinations up to date, Spayed / neutered) dropped pill chrome entirely — render as `ShieldCheck` icon + `--success-600` text inline, no background, no border. The pill treatment was visually heavy for "yes this is a thing" affirmations; the inline glyph reads as a check at a glance. → `docs/implementation/design-system.md` ("treatment ladder: pill / inline-check / body copy")
- **Conditions content moved to body copy (not pill, not amber).** Was originally `--status-warning-main` text on `--status-warning-light` bg as a `--health-tag--note` pill — yellow-on-yellow was unreadable. Briefly switched to `--warning-600` text for readable amber, but the better fix was dropping the pill chrome entirely: open-ended multi-sentence health notes read as body copy (`--text-secondary`, normal line-height), not labels. → `docs/implementation/design-system.md`
- **PetCard section dividers fixed.** `.pet-profile-section { border-top: 1px solid var(--border-light); }` was invisible because `--border-light` (#f4f4f4) equals the `--surface-base` card background. Switched to `--border-strong` (#e5e5e5) for a subtle but visible separator. Gap inside sections bumped 6px → 8px for slight breathing. → `docs/implementation/design-system.md` ("border-light is invisible on surface-base — use border-strong for dividers")
- **FirstAidKit icon replaces Stethoscope.** Stethoscope's complex line silhouette didn't visually pair with the solid Heart icon on the Socialisation header. FirstAidKit (filled) sits as a peer — both compact solid shapes. → no doc update needed (icon choice, not pattern)
- **PetEditCard mirrors view-mode section pattern (C3 walkthrough fix).** Field labels stay plain (no icons); icons live on section headers only — Socialisation (Heart) and Health & vet (FirstAidKit), both filled + brand-tinted, both preceded by a `--border-strong` top divider. Health & vet body collapses behind an accordion (default-collapsed for empty vet records, auto-expanded when data exists) — the section is "set once, rarely revisit" data so the compact form is the common case. Replaces the previous fieldset+legend+padding chrome that was producing the inset look + tight vertical collision (nested `two-col` blocks had no row-gap). The accordion + section-divider treatment matches view mode's Socialisation/Health rhythm, eliminates the indent, fixes the spacing, and trims the form-weight up front. → `docs/implementation/design-system.md` ("treatment ladder for forms: section header + divider, accordion for deferred-engagement fields")
- **PetEditCard collapses by default in edit mode (C7b, 2026-05-11).** Each pet card carries an always-visible compact summary row at the top (48px rounded-square photo thumb + name + breed + caret + Trash delete); tap to expand the full form. **Saved pets default-collapsed** (Profile visibility was sitting well below the fold on multi-pet profiles; the Carer audience question — "should Profile visibility move above My dogs?" — was being driven by edit-mode form weight, not the underlying ordering). **Newly added pets auto-expand** so the "+ Add dog" path doesn't trap users behind a collapsed empty card. Key: pet `id` membership in `user.pets` (saved) vs `editState.pets` only (in-progress). The Trash delete moved from the Basic info section header's rightSlot to the summary row so it's reachable from collapsed state — no Expand-just-to-delete double-step. View-mode (PetCard) stays fully expanded; collapse is an edit-mode-only affordance. → `docs/features/profiles.md`, `docs/implementation/design-system.md` ("collapse-by-default for tall edit cards when companion settings sit nearby")

### Connections surfaces

- **Mutual connections section on other-user profiles.** New helper `getMutualConnectedUserIds(viewerId, subjectId)` in `lib/mockConnections.ts` computes Connected-only intersections. Section renders below Dogs on `/profile/[userId]` About: avatar stack of up to 5 + count + "View →" → opens ModalSheet with full list. Hidden entirely on zero mutuals. **Privacy: Familiar marks are deliberately excluded** — surfacing them would break the deniability principle. Helper docstring spells this out so future edits don't loosen the contract. → `docs/features/profiles.md`, `docs/strategy/Trust & Connection Model.md` (note: Mutual Connections surface is Connected-only)
- **Own-profile connections — compact summary cards + View all modal matching the meet member-list pattern (2026-05-11 initial / 2026-05-13 modal refactor).** Two surfaces:
  - **In-tab summary (compact)** — three `ConnectionGroupCard`s on the About tab (Connected / Familiar / Pending), each with avatar stack (cap 5 + "+N" overflow chip) + label + count line. Non-interactive; empty states (count 0) hide entirely. Zero connections renders a friendly empty state with a "Browse Meets" CTA.
  - **Modal (full list)** — "View all (N)" header button on the section opens a `ModalSheet` titled "Connections · N". Originally rendered a compact `ConnectionRow` (36px avatar + truncated meta + per-row state pill) inside a `ConnectionGroup` with small caps labels. **Refactored 2026-05-13** to use the shared meet member-list primitives: `SectionHeader` from `components/people/PersonSections.tsx` (uppercase tracking-wider) for state dividers, and `PersonRow` (variant `default`) for each entry — bigger presence per row, owner+dog avatar (OwnerDogAvatar), name + dog name. `actions={[]}` (info-only mode); each row links to `/profile/[userId]`. Per-row state pill dropped (the section header carries that). Pending status pill inline in the name area survives (PersonRow's documented status-not-action behavior). The compact summary on the tab itself stays as-is — the modal is where the upgrade lives.
  - Actions enabled — `actions` left at default `"auto"`, same wiring pattern as `ParticipantList` (meet People tab). Connected rows surface a Message button (right side, brand-fill primary); Familiar rows surface a Connect button (escalation up the ladder); Pending rows render the inline "Pending" status pill, no action button (PersonRow's intentional status-not-action distinction). PersonRow self-wires `onConnect`/`onMessage` via `ConnectionsContext` defaults — no consumer-side plumbing needed.
  - Decisions deferred: **(a)** don't add filter pills (Connected / Familiar / Pending) at the top of the modal. Considered during 2026-05-13 redesign discussion. Rejected for current data scale (most personas have <15 total connections; pills add a tap layer without solving a real scanning problem). Revisit if/when a single user accumulates 50+ connections. **(b)** don't add search input inside the modal yet. Same reasoning — at current scale the full list is visible in one scroll; search earns its chrome at 50+ rows. Both pills + search become useful at the same threshold; both filed as future revisits when data scale justifies. → `docs/features/profiles.md`

### CSS hygiene

- **Dead `.profile-*` CSS swept.** ~370 lines of CSS from earlier provider-detail page iterations removed from `globals.css` — `.profile-page`, `.profile-header`, `.profile-name`, `.profile-location`, `.profile-section`, `.profile-back-row`, `.profile-back-link`, `.profile-desktop-*`, `.profile-header-state`, `.profile-main`, `.profile-title-wrap`, `.profile-avatar`, `.profile-identity`, `.profile-edit-actions`, `.profile-contact-btn`, `.profile-member-since`, `.profile-rating`, `.profile-read-more`, `.profile-trust`, `.profile-about-*`, `.profile-content-width`, `.profile-photo-*`, `.profile-gallery-bar*`, `.profile-visibility-row`, plus the `.pet-profile-health-tag*` classes obsoleted by the inline-check pattern. Each verified as zero-TSX-consumers first. → no doc update needed (cleanup, no behavior change)

---

<!--
Open items NOT verified here (defer to phase close or later):
- D4 (Carer audience signal + provider stats prominence — pill went away in C6; the broader prominence question remains) — deferred pending PO meeting outcomes
- E3 (Care CTAs copy + placement) — deferred pending community-vs-marketplace fork
- A2 (About subsection structure) — not pursued this round; current bio + dogs + connections + tagging + care section reads fine
- A4 (Connection state display) — no changes this round; reads as-is on other-user profile pages
- A7 (Member since + location prominence) — kept current treatment; small meta lines below the name
- E1 (Profile hero polish) — hero is now leaner after removing Edit Profile button; further polish deferred
- E2 (Share profile link) — `/connect/[code]` route not changed this round; verify visually but no code work
- E4 (Connection list display) — no changes; existing grouped list (Connected / Familiar / Pending) reads fine
- B4 (Post content depth) — content review only; four supporting users (zuzana, vitek, marie, nikola) have zero posts. Acceptable for "new/lurker" personas (Marie's bio explicitly says she's new). Promotion to add posts would be a Mock World Building task.
- B1 (Post image corner radius / P8) — CSS already has `border-radius: var(--radius-md)` on `.post-photo-grid-img` from the Threads-style refactor. P8 removed from punch list 2026-05-11; verify nothing visually-regressed during F-pass.
- Future: Photos & Galleries phase + Carer Portfolio phase (drafted 2026-05-11 from B6 observations and the Open Q §8 resolution respectively). Both have draft phase boards in `docs/phases/`. See `Open Questions §8 + §12`.
-->
