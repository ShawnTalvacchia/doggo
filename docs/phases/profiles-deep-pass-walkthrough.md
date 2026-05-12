---
status: active
last-reviewed: 2026-05-11
review-trigger: "Update as items are walked, edit as scope adjusts"
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

- [x] **A1. Tereza → `/profile?tab=posts`.** AppNav row shows **Bell + Chat only** (Camera+ is suppressed). Panel renders the **ShareMomentBar prompt** (`[Camera icon] Share a moment...`) full-width at the top of the posts list. No "Posts" heading inside the panel. *(Updated 2026-05-11: floating `+ New post` button felt awkward; swapped to `ShareMomentBar` for a banner-style prompt affordance.)*
- [x] **A2. Tereza → `/profile?tab=posts`, tap the ShareMomentBar prompt.** Post composer opens. Cancel/Close returns cleanly.
- [x] **A3. Tereza → `/profile?tab=about` or `?tab=services`.** AppNav slot now renders the **Edit** text button (see Workstream C). Camera+ is gone (replaced by Edit on About/Services, not present on Posts).
- [x] **A4. New User → `/profile?tab=posts`.** Empty-state "Share a moment" button renders. No `+ New post` at top (gated on `posts.length > 0` so the empty state isn't double-CTA'd).
- [x] **A5. Tomáš → `/profile/tereza?tab=posts`** (other user's posts tab). AppNav Camera+ **does** render (global compose still available). No in-panel `+ New post` (gated on `isOwnProfile`).

---

## Workstream B — PetCard + own-self redirect (A5)

Originally three visual fixes (caret / energy pill / conditions). Grew during the walkthrough to cover the full PetCard treatment system (FirstAidKit icon, inline-check pattern, body-copy conditions, neutral vet pill, visible section dividers), plus persona-dog vet-info enrichment (Franta / Bella / Eda) and the `/profile/[ownId]` self-redirect bug fix.

- [x] **B0. Daniel → `/profile/daniel`** (typing own ID into the URL). Page should **redirect to `/profile`** — not render the "this profile is private" gate. Tab param preserved when the destination tab exists on own-profile (`?tab=posts` / `?tab=services`); dropped otherwise. *(Added 2026-05-11 during walkthrough — viewer-vs-subject gate was firing on own-self when arriving via the userId URL.)*
- [x] **B1. Daniel → `/profile?tab=about`, scroll to "My dogs" → Bára.** Caret is **vertically centered** with the identity column (not floating at the top-right corner of the card). Caret pushes to the right edge of the header.
- [x] **B2. Daniel → Bára card, expanded view.** **Energy pill** ("Moderate") has a visible border (`--{level}-600`) + tinted fill (`--{level}-50`) + colored text. **Play-style pills** ("Sniff explorer", "Fetch lover") share the system-neutral pill treatment: `--surface-inset` fill + `--border-strong` border + `--text-secondary` text. Both pill silhouettes read clearly against the `--surface-base` card.
- [x] **B3. Daniel → Bára card, expanded view, scroll to Health & vet.** Verify the section as a whole:
  - Section header uses the **FirstAidKit** icon (filled, brand-tinted) — visual weight matches the Heart icon on the Socialisation section above.
  - Section has a **visible top border** (was `--border-light`, invisible against `--surface-base`; now `--border-strong`).
  - "Vaccinations up to date" + "Spayed / neutered" render as **icon + colored text only** (no pill chrome) — `ShieldCheck` glyph + `--success-600` text, sitting inline.
  - Conditions text ("Mild leash reactivity. No food allergies. Sensitive stomach with novel proteins.") renders as **plain body copy** matching the Socialisation paragraph — no pill, no amber, just `--text-secondary` body text.
  - Vet clinic ("Veterina Smíchov") sits in a **neutral pill** (same treatment as play pills); "Last visit Feb 2026" follows in muted `--text-tertiary`.
- [x] **B4. Tereza → `/profile?tab=about`, "My dogs" → Franta + Bella.** Both now have **vet info** (Veterina Vinohrady). PetCard Health & vet section renders with vaccinations + spayed/neutered + clinic line. (Was missing pre-2026-05-11 — only persona dogs with vetInfo were Bára / Hugo / Spot / Goldie.)
- [x] **B5. Klára → `/profile?tab=about`, "My dogs" → Eda.** Vet info present (Veterina Holešovice).
- [x] **B6. Any persona → `/profile/shawn?tab=about`, "My dogs" → Spot.** Tap to expand (other-user cards default collapsed). Photo gallery thumbnails appear at the bottom of the expanded card (Spot has 3 gallery photos seeded). Confirm the Camera badge over the avatar shows the count. *(Persona-agnostic: Shawn's profile is `profileVisibility: "open"` so any viewer can see him; Shawn himself is not on the persona picker, so this is always viewed from someone else's perspective.)*
- [x] **B7. Tomáš → `/profile/marek?tab=about`, "My dogs" → Benny.** No-energy / no-socialisation states render gracefully (Benny has minimal data). Caret still works.

---

## Workstream C — Edit-mode rework via AppNav slot (A6)

**Phase thesis.** The single biggest UX change. Edit / Save / Cancel moved from a hero button + in-tab chrome into the AppNav page-action slot. Edit mode is now a fully locked state.

- [x] **C1. Tereza → `/profile?tab=about`.** **Horizontal hero** at the top of the About tab body — avatar (200×200) on the left, name dropdown + Carer badge (if applicable) + location + dogs + member-since + Share Profile button stacked on the right. Stacks vertically on narrow viewports. Matches the `/profile/[userId]` hero shape for visual parity. *(Refactored 2026-05-11 during walkthrough — the previous centered hero felt different from other-user profile pages.)*
- [x] **C2. Tereza → `/profile?tab=about`, AppNav row.** Renders **Edit** (outline variant, with pencil icon) + Bell + Chat. Camera+ is gone (replaced by Edit). On desktop, the same `Edit` button also appears in the `.page-column-header` above the panel — same `pageActionNode` flows into both surfaces via `PageColumn.headerAction`.
- [x] **C3. Tereza → `/profile?tab=about`, tap **Edit**.** App enters edit mode:
  - **TabBar disappears** (no About/Posts/Services strip).
  - **Bell + Chat disappear** from AppNav (navLockedIn).
  - AppNav row shows **Cancel + Save** only.
  - About tab body shows the edit form (bio textarea, PetEditCard rows, Add dog button, Tagging settings).
- [x] **C3a. Tereza → in edit mode, scroll to first PetEditCard (Franta).** Form is now structured as four named sections, each with a 15px semibold section header above a `--border-strong` divider (first section drops the divider so the card doesn't open with a line under nothing):
  - **Basic info** (no icon) — header carries the per-pet **Trash delete button on the far right** (was previously absolute-positioned in the card corner). Body: Dog's name + Breed on one row; Pet Photo (left, 50%) + Size / Age / Energy level stacked on the right (50%).
  - **Personality** (Dog icon, filled, brand-tinted) — Play style pills + General notes textarea.
  - **Socialisation** (Heart icon, filled, brand-tinted) — single textarea.
  - **Health & vet info** (FirstAidKit icon, filled, brand-tinted) — collapsible. Caret on the right of the header; **collapsed by default** for empty vet records, auto-expanded for pets with existing data (Franta has Veterina Vinohrady so it should open). Body: Vet clinic / Vet phone (side by side), Vaccinations + Spayed/neutered checkboxes in a single wrapping row, Medications, Known conditions.
  - **Field labels never carry icons** — icons live on section headers only.
  - **Pet photo** has a lighter `--border-light` frame (was the heavy `--border-edge-subtle`) + a circular pencil edit overlay in the bottom-right corner — affordance for "tap to change" regardless of whether a photo is set.
  - *(PetEditCard refactor 2026-05-11 during walkthrough C3 — drift caught: Stethoscope didn't get updated to FirstAidKit when view-mode did; field-level icons were inconsistent; fieldset padding was producing the inset + spacing issues. Restructured 2026-05-11 to commit fully to named sections with heavier headers; Last checkup dropped — owners don't keep it current.)*
- [ ] **C3b. Tereza → About tab, scroll to Profile visibility + Tagging preferences.** In **view mode** each renders as a **compact summary card** — icon (Lock/Eye for visibility, CheckCircle/Clock/Prohibit for tag approval) + bold title + descriptive sub-line, in the same bordered-card shape as the Services tab's "Offering care" summary. Tap **Edit** in AppNav → both sections expand to the **full picker** (two options for visibility, three for tag approval) with the descriptive helper text above. Tap a row in edit mode → commits immediately (same `onChange` semantics as before). *(View-mode condensation added 2026-05-11 — the previous always-editable pickers took a lot of vertical room on the About tab without entering edit mode.)*
- [x] **C4. Tereza → in edit mode, type into bio textarea, tap **Cancel**.** Edits discarded silently (no confirm prompt). Returns to view mode. TabBar reappears. Bell + Chat reappear. Bio is unchanged.
- [x] **C5. Tereza → tap Edit again, change bio, tap **Save**.** Bio updates in view mode. Same return-to-view behavior.
- [ ] **C6. Klára → `/profile?tab=services`, tap **Edit**.** Same lock-in: TabBar + Bell + Chat hide; AppNav shows Cancel + Save; tab body renders the service edit form. **First section is the Care-offering picker** — `Offering care` heading + helper line ("How do you want to offer care to your community?") + three radio-style option cards: **Not offering care** / **Connected circle only** / **Open to anyone**. Selected card has the brand-main border + brand-subtle tint + filled radio dot. *(Was previously two flat Toggles: "Open to helping" + "Open to anyone" — replaced 2026-05-11 to surface the trichotomy explicitly.)*
- [ ] **C7. Klára → in edit mode, tap **Connected circle only**, then tap **Open to anyone**, tap Save.** Selection changes the underlying `openToHelping` + `publicProfile` together. Below the picker, the Carer bio / services / modifiers / availability blocks stay visible (Klára is a carer in both circle and anyone modes). Tap **Not offering care** — the lower blocks hide (you're not a carer; nothing to configure). View-mode signal updates via the Carer Identity badge on the hero (the "Open to helping" pill that previously sat in the Services tab body was removed in the same sweep).
- [ ] **C8. Daniel → `/profile?tab=services`** (locked profile, no carerProfile). Empty-state **"Want to offer care?"** card renders with copy "Set yourself up as a carer for your community. Walks, sitting, boarding — you set the terms." + the hint "Tap 'Edit' above to get started." *(Header reworded 2026-05-11 — "Open to helping?" retired.)*
- [ ] **C9. Tereza → `/profile?tab=posts`** (no Edit verb here). AppNav shows Bell + Chat only. No Edit button in slot (intentional — Posts doesn't have an edit mode; the verb is New post which lives in-panel per Workstream A).
- [ ] **C10. New User → `/profile?tab=about`.** Edit button still renders (New User has no pets yet but can still edit their bio + add a dog). Tap Edit → lock-in works the same way.
- [ ] **C11. Tomáš → `/profile/tereza?tab=about`** (other user's profile). No Edit button anywhere — this is someone else's profile. AppNav shows Camera+ + Bell + Chat (global compose unaffected).

---

## Workstream G — Connections surfaces (extends E4)

Two new affordances added during walkthrough: mutual-connections section on other-user profiles, and compact + "Show all" modal on own-profile connections list. 2026-05-11. *(Workstream letter is G rather than E2 — avoids name collision with the original phase-board task E2 'Share profile link.')*

- [ ] **G1. Tereza → `/profile/eva?tab=about`** (or any other-user About). After Dogs, a **Mutual connections** section renders: avatar stack of up to 5 + count line ("3 mutual connections") + "View →". Section is hidden entirely when there are zero Connected mutuals.
- [ ] **G2. Tereza → tap the Mutual connections row.** ModalSheet opens with title "You both know · N". Each row links to that person's `/profile/[id]`. Tapping a row closes the modal and navigates.
- [ ] **G3. Privacy check: Familiar marks NEVER appear in Mutual connections.** Pick a persona pair where the viewer has Familiar marks the subject doesn't know about (e.g. someone Tereza marked as Familiar). Those rows must not appear under Mutual connections on that subject's profile. Connected-only by design.
- [ ] **G4. Tereza → `/profile?tab=about`, scroll to Connections.** Top **5** per group (Connected / Familiar / Pending) render in the compact view. When at least one group has >5, a **"Show all (N)"** button renders below the groups.
- [ ] **G5. Tereza → tap Show all.** ModalSheet opens titled "Connections · N" with the full, uncapped grouped list. Closes cleanly.
- [ ] **G6. New User (zero connections) → `/profile?tab=about`.** Connections section still renders the empty state ("No connections yet. Attend a meet…") with the Browse Meets CTA. No "Show all" button.

---

## Workstream D — Services tab (D6 + D7)

**D7.** Audience-setting UI was reshipped 2026-05-11 — the original Toggle was folded into the C6 care-offering picker (three radio-card options: Not offering / Connected circle only / Open to anyone). The view-mode "Open to helping" pill was removed; the Carer Identity badge on the hero carries the role + audience signal. **D6.** "Make profile public" CTA on the locked-provider banner is now wired (was a no-op stub).

- [ ] **D1. Klára → `/profile?tab=services`, tap Edit, scroll to top.** Care-offering picker renders with the **Connected circle only** option selected (Klára's current state — `openToHelping: true`, `publicProfile: false`). Hover over each card — selected has brand-main border + brand-subtle tint; unselected get a subtle `--surface-inset` hover tint.
- [ ] **D2. Klára → tap **Open to anyone**, tap Save.** View mode loads. Above the Carer bio, a small **"Offering care" summary card** renders: Globe icon + "Open to anyone" + "Your services are discoverable in Discover by anyone in Prague." Switching back to circle in edit shows UsersThree icon + "Connected circle only" + "Only people you're Connected with can see and book your services." Carer Identity badge on the hero also reflects the role.
- [ ] **D3. Tereza → `/profile?tab=services`** (carer with `publicProfile: false`, profile is open but carer audience is circle-only). Badge line reads **"Connected circle only"**. Banner does NOT show (banner is gated on profile being locked).
- [ ] **D4. Marek → `?as=marek` then `/profile?tab=services`** (locked profile, no carerProfile). Empty-state card renders. Tap Edit → lock-in works. Confirm no carerProfile mutations leak when carer audience toggle is never touched.
- [ ] **D5. Find a locked + carer + has-services persona.** Currently this combo doesn't exist in seed (the bridged Carers are all `publicProfile: true` + `profileVisibility: open`, and own personas with carerProfiles are mostly `open`). To test, temporarily swap Tereza's `profileVisibility` to `"locked"` in `mockUsers.ts` and reload — the locked-provider banner should render with Info icon + copy + **Make profile public** button. Tap → flips profileVisibility to "open" in-memory; banner disappears immediately. (Note: state persists only for the session; reset via `/demo` for a clean reload.)

---

## Workstream E — Content enrichment surface check (A1 + A5a)

Spot-check that the bio + pet enrichments read well in context.

- [ ] **E1. Marek → `?as=marek`, `/profile`.** Bio reads as personality-rich (mornings at Riegrovy, pulled into the Thursday walkers crew). Old bio was 1-line; new is 3 sentences with concrete detail.
- [ ] **E2. Jakub → `?as=jakub`, `/profile`.** Bio reads as personality-rich (weekend GSD owner, careful around dogs).
- [ ] **E3. Marie → `?as=marie`, `/profile`.** Bio reads as personality-rich (Letná lab owner looking for a walker — sets up a clear "why I'm here" hook).
- [ ] **E4. Tereza → Franta + Bella cards expanded.** Health & vet section visible on both (was missing — added 2026-05-11). Reads as a complete household, not a half-finished file.
- [ ] **E5. Klára → Eda card expanded.** Health & vet section visible (Veterina Holešovice, hip-check note).

---

## Workstream F — Cross-cutting consistency (X1–X4 scoped)

Light-touch consistency checks. Full cross-cutting walk happens at phase close.

- [ ] **F1. Tereza → `/profile`.** TabBar visible. Tap About → Posts → Services. AppNav action slot updates per tab: Edit / (nothing) / Edit. No flicker, no stale state.
- [ ] **F2. Tereza → tap Edit on About, tap browser back.** Edit mode persists or aborts cleanly (whichever — verify it doesn't get stuck in a half-locked state with TabBar still hidden but no Cancel/Save button).
- [ ] **F3. Persona switch via name dropdown while in edit mode.** The persona-change useEffect in `app/profile/page.tsx` resets `aboutEditing` / `servicesEditing` to false. Confirm: enter edit, switch persona via the name dropdown, the new persona arrives in view mode with TabBar visible. No stuck-in-edit state.
- [ ] **F4. Daniel → `/profile/tereza?tab=about`.** Other-user profile renders without Edit button. AppNav has Camera+ + Bell + Chat. Familiar / Connected pill (depending on relationship) shows in the hero — not affected by this round's changes.
- [ ] **F5. Mobile width (≤640px).** All AppNav slot states render without overflow. Edit text button doesn't crowd Bell + Chat. Cancel/Save in edit mode fits the row.
- [ ] **F6. Resize browser between mobile and desktop during edit mode.** Lock-in holds at both widths (TabBar stays hidden, slot stays in Cancel/Save). No layout breaks.

---

## Decisions surfaced during walkthrough

Emergent decisions / design changes during verification. **Append as you walk**, sweep at phase close.

### Edit-mode + AppNav slot (A6 / B5)

- [ ] **Auto-discard on Cancel — no confirm prompt.** Pragmatic choice for the prototype; matches Doggo's general "no half-built modal" feel. If user-testing reveals lost-edit complaints, revisit. → `docs/features/profiles.md` if it survives testing
- [ ] **AppNav page-action slot pattern.** New `PageHeaderContext` fields (`pageAction`, `suppressCreate`, `navLockedIn`) — a reusable mechanism for any page that wants a contextual primary action in the AppNav nav row + optional lock-in mode. Profile is the first consumer; future phases may apply it (booking detail, meet detail, group detail). The same `pageActionNode` flows into `PageColumn.headerAction` for desktop. → `docs/implementation/design-system.md` (new principle: page-action slot)
- [ ] **Own-self redirect on `/profile/[ownId]`.** Visiting your own URL while logged in as that user used to render the viewer-vs-subject gate against yourself; locked personas saw "this profile is private" about themselves. Now redirects to `/profile`, preserving the tab param if the destination tab exists on the own-profile route. → `docs/features/profiles.md`
- [ ] **Own-profile hero converged with `/profile/[userId]` shape.** Avatar-left + name/location/dogs/member-since/Share-right horizontal layout, stacking vertically on narrow viewports. Hero lives inside the About tab body now (not page-level chrome above tabs), so Posts and Services don't show the hero — matches other-user profile model. → `docs/features/profiles.md`
- [ ] **`+ New post` is a `ShareMomentBar` strip on own-profile Posts.** Floating "+ New post" button replaced with a section strip (`--surface-top` + `--border-strong` top/bottom borders) hosting the previously-orphan `ShareMomentBar` (sunken `--surface-inset` pill input). AppNav Camera+ is suppressed on this surface via `PageHeaderContext.suppressCreate` — no duplication. ShareMomentBar gained a live consumer. → `docs/features/profiles.md`
- [ ] **Profile visibility + Tagging preferences gated behind edit mode (C3b, 2026-05-11).** Both `ProfileVisibilitySetting` and `TagApprovalSetting` gained an `editing` prop. View mode renders a compact bordered summary card (same shape as the "Offering care" summary on the Services tab) showing the current state — icon + label + description. Edit mode renders the full row picker. Replaces the previous always-editable pickers that were taking significant vertical room on the About tab. `onChange` semantics unchanged — taps in edit mode still commit immediately (these are state toggles, not buffered form fields like bio/pets). → `docs/features/profiles.md`

### Services tab (D6 / D7)

- [ ] **Care-offering picker replaces the two-Toggle pattern (C6, 2026-05-11).** Three radio-style option cards (Not offering / Connected circle only / Open to anyone) surfaced as one section at the top of the Services edit form. Replaces the prior flat Toggles ("Open to helping" + "Open to anyone") that hid the trichotomy. Selecting an option sets both underlying booleans (`openToHelping` + `publicProfile`) together. **View mode** drops the redundant "Open to helping" pill but adds an **"Offering care" summary card** above the Carer bio — Globe / UsersThree icon + audience label + descriptive line — so owners can see their current setting at a glance without entering edit mode. (Initial sweep removed the pill outright; the summary card was added in a follow-up after walking C6 — the Carer Identity badge on the hero was too far from the services context to carry the signal alone.) **Empty-state header reworded** "Open to helping?" → "Want to offer care?". **Copy sweep**: "Open to helping" UI string retired across the app; the `openToHelping` data field name stays as the internal boolean. **Other-user services tab**: the circle-only carer explainer card was reframed from "Open to helping" + PawPrint icon to "Carer · Connected circle" + UsersThree icon. Docs swept: `features/profiles.md`, `strategy/User Archetypes.md`. → `docs/features/profiles.md`, `docs/strategy/Groups & Care Model.md`
- [ ] **`onUnlockProfile` wires the locked-provider banner CTA.** One-tap action flips `profileVisibility: "locked" → "open"`. No confirm modal — banner is the affordance, it goes away the moment the unlock takes effect. → `docs/features/profiles.md`

### PetCard treatment system

- [ ] **Neutral pill pattern codified.** `--surface-inset` fill + `--border-strong` border + `--text-secondary` text. Shared by `.pet-profile-play-pill` (categorical labels: Sniff explorer, Fetch lover) and `.pet-profile-vet-pill` (vet clinic name). Reads cleanly against the `--surface-base` PetCard background where the older `--surface-inset`-only treatment blended in. Future: consolidate into a general `pill--neutral` class once another surface needs it. → `docs/implementation/design-system.md`
- [ ] **PetCard energy palette switched from `--status-*-light/main` to `--*-50/600` + matching `*-600` border.** Scoped to the energy pill only — does NOT touch app-wide `--status-*` tokens. Background bumped from `*-25` (blended into card) to `*-50` (clear silhouette); border at `*-600` defines the edge against `--surface-base`. → `docs/implementation/design-system.md`
- [ ] **Health-check inline pattern (no pill).** Affirmative facts (Vaccinations up to date, Spayed / neutered) dropped pill chrome entirely — render as `ShieldCheck` icon + `--success-600` text inline, no background, no border. The pill treatment was visually heavy for "yes this is a thing" affirmations; the inline glyph reads as a check at a glance. → `docs/implementation/design-system.md` ("treatment ladder: pill / inline-check / body copy")
- [ ] **Conditions content moved to body copy (not pill, not amber).** Was originally `--status-warning-main` text on `--status-warning-light` bg as a `--health-tag--note` pill — yellow-on-yellow was unreadable. Briefly switched to `--warning-600` text for readable amber, but the better fix was dropping the pill chrome entirely: open-ended multi-sentence health notes read as body copy (`--text-secondary`, normal line-height), not labels. → `docs/implementation/design-system.md`
- [ ] **PetCard section dividers fixed.** `.pet-profile-section { border-top: 1px solid var(--border-light); }` was invisible because `--border-light` (#f4f4f4) equals the `--surface-base` card background. Switched to `--border-strong` (#e5e5e5) for a subtle but visible separator. Gap inside sections bumped 6px → 8px for slight breathing. → `docs/implementation/design-system.md` ("border-light is invisible on surface-base — use border-strong for dividers")
- [ ] **FirstAidKit icon replaces Stethoscope.** Stethoscope's complex line silhouette didn't visually pair with the solid Heart icon on the Socialisation header. FirstAidKit (filled) sits as a peer — both compact solid shapes. → no doc update needed (icon choice, not pattern)
- [ ] **PetEditCard mirrors view-mode section pattern (C3 walkthrough fix).** Field labels stay plain (no icons); icons live on section headers only — Socialisation (Heart) and Health & vet (FirstAidKit), both filled + brand-tinted, both preceded by a `--border-strong` top divider. Health & vet body collapses behind an accordion (default-collapsed for empty vet records, auto-expanded when data exists) — the section is "set once, rarely revisit" data so the compact form is the common case. Replaces the previous fieldset+legend+padding chrome that was producing the inset look + tight vertical collision (nested `two-col` blocks had no row-gap). The accordion + section-divider treatment matches view mode's Socialisation/Health rhythm, eliminates the indent, fixes the spacing, and trims the form-weight up front. → `docs/implementation/design-system.md` ("treatment ladder for forms: section header + divider, accordion for deferred-engagement fields")

### Connections surfaces

- [ ] **Mutual connections section on other-user profiles.** New helper `getMutualConnectedUserIds(viewerId, subjectId)` in `lib/mockConnections.ts` computes Connected-only intersections. Section renders below Dogs on `/profile/[userId]` About: avatar stack of up to 5 + count + "View →" → opens ModalSheet with full list. Hidden entirely on zero mutuals. **Privacy: Familiar marks are deliberately excluded** — surfacing them would break the deniability principle. Helper docstring spells this out so future edits don't loosen the contract. → `docs/features/profiles.md`, `docs/strategy/Trust & Connection Model.md` (note: Mutual Connections surface is Connected-only)
- [ ] **Own-profile connections compact + Show all modal.** `ConnectionsList` caps each group (Connected / Familiar / Pending) at 5 rows; "Show all (N) →" button appears below groups *only if any group has >5* and opens a ModalSheet with the uncapped list. Same `ConnectionRow` + `ConnectionGroup` JSX shared between compact and modal views. No new route — modal scope creep avoided for the prototype. → `docs/features/profiles.md`

### CSS hygiene

- [ ] **Dead `.profile-*` CSS swept.** ~370 lines of CSS from earlier provider-detail page iterations removed from `globals.css` — `.profile-page`, `.profile-header`, `.profile-name`, `.profile-location`, `.profile-section`, `.profile-back-row`, `.profile-back-link`, `.profile-desktop-*`, `.profile-header-state`, `.profile-main`, `.profile-title-wrap`, `.profile-avatar`, `.profile-identity`, `.profile-edit-actions`, `.profile-contact-btn`, `.profile-member-since`, `.profile-rating`, `.profile-read-more`, `.profile-trust`, `.profile-about-*`, `.profile-content-width`, `.profile-photo-*`, `.profile-gallery-bar*`, `.profile-visibility-row`, plus the `.pet-profile-health-tag*` classes obsoleted by the inline-check pattern. Each verified as zero-TSX-consumers first. → no doc update needed (cleanup, no behavior change)

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
