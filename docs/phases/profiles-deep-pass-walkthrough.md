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

## Workstream B — PetCard polish (A5b)

Three visual fixes on the PetCard: caret position, energy-pill contrast, conditions-tag contrast. No data changes — pure styling scoped to the card.

- [x] **B0. Daniel → `/profile/daniel`** (typing own ID into the URL). Page should **redirect to `/profile`** — not render the "this profile is private" gate. Tab param preserved when the destination tab exists on own-profile (`?tab=posts` / `?tab=services`); dropped otherwise. *(Added 2026-05-11 during walkthrough — viewer-vs-subject gate was firing on own-self when arriving via the userId URL.)*
- [ ] **B1. Daniel → `/profile?tab=about`, scroll to "My dogs" → Bára.** Caret is **vertically centered** with the identity column (not floating at the top-right corner of the card). Caret pushes to the right edge of the header.
- [ ] **B2. Daniel → Bára card, expanded view.** Energy pill ("Moderate") has a **visible border** and stronger green text (success-600). Pill silhouette is distinct against the gray card background.
- [ ] **B3. Daniel → Bára card, expanded view, scroll to Health & vet.** Conditions tag ("Mild leash reactivity. No food allergies. Sensitive stomach with novel proteins.") reads in **darker amber** (warning-600), not yellow-on-yellow. Multi-sentence text wraps cleanly with normal line-height (no pill truncation).
- [ ] **B4. Tereza → `/profile?tab=about`, "My dogs" → Franta + Bella.** Both now have **vet info** (Veterina Vinohrady). PetCard Health & vet section renders with vaccinations + spayed/neutered + clinic line. (Was missing pre-2026-05-11 — only persona dogs with vetInfo were Bára / Hugo / Spot / Goldie.)
- [ ] **B5. Klára → `/profile?tab=about`, "My dogs" → Eda.** Vet info present (Veterina Holešovice).
- [ ] **B6. Shawn → `/profile/shawn?tab=about`, "My dogs" → Spot.** Photo gallery thumbnails appear (Spot has 3 gallery photos seeded). Confirm the Camera badge over the avatar shows the count.
- [ ] **B7. Tomáš → `/profile/marek?tab=about`, "My dogs" → Benny.** No-energy / no-socialisation states render gracefully (Benny has minimal data). Caret still works.

---

## Workstream C — Edit-mode rework via AppNav slot (A6)

**Phase thesis.** The single biggest UX change. Edit / Save / Cancel moved from a hero button + in-tab chrome into the AppNav page-action slot. Edit mode is now a fully locked state.

- [ ] **C1. Tereza → `/profile?tab=about`.** **Horizontal hero** at the top of the About tab body — avatar (200×200) on the left, name dropdown + Carer badge (if applicable) + location + dogs + member-since + Share Profile button stacked on the right. Stacks vertically on narrow viewports. Matches the `/profile/[userId]` hero shape for visual parity. *(Refactored 2026-05-11 during walkthrough — the previous centered hero felt different from other-user profile pages.)*
- [ ] **C2. Tereza → `/profile?tab=about`, AppNav row.** Renders **Edit** (text, tertiary variant, with pencil icon) + Bell + Chat. Camera+ is gone (replaced by Edit).
- [ ] **C3. Tereza → `/profile?tab=about`, tap **Edit**.** App enters edit mode:
  - **TabBar disappears** (no About/Posts/Services strip).
  - **Bell + Chat disappear** from AppNav (navLockedIn).
  - AppNav row shows **Cancel + Save** only.
  - About tab body shows the edit form (bio textarea, PetEditCard rows, Add dog button, Tagging settings).
- [ ] **C4. Tereza → in edit mode, type into bio textarea, tap **Cancel**.** Edits discarded silently (no confirm prompt). Returns to view mode. TabBar reappears. Bell + Chat reappear. Bio is unchanged.
- [ ] **C5. Tereza → tap Edit again, change bio, tap **Save**.** Bio updates in view mode. Same return-to-view behavior.
- [ ] **C6. Klára → `/profile?tab=services`, tap **Edit**.** Same lock-in: TabBar + Bell + Chat hide; AppNav shows Cancel + Save; tab body renders service edit form (Open to helping toggle, Care bio, modifier editor, availability grid, Open to anyone Toggle).
- [ ] **C7. Klára → in edit mode, change visibility toggle, tap **Save**.** Returns to view mode. Audience signal updates ("Open to anyone" / "Connected circle only" line under the Open to helping badge).
- [ ] **C8. Daniel → `/profile?tab=services`** (locked profile, no carerProfile). Empty-state "Open to helping?" card shows with copy **"Tap 'Edit' above to get started."** (was previously "Tap 'Edit Services' to get started" — updated for the new label).
- [ ] **C9. Tereza → `/profile?tab=posts`** (no Edit verb here). AppNav shows Bell + Chat only. No Edit button in slot (intentional — Posts doesn't have an edit mode; the verb is New post which lives in-panel per Workstream A).
- [ ] **C10. New User → `/profile?tab=about`.** Edit button still renders (New User has no pets yet but can still edit their bio + add a dog). Tap Edit → lock-in works the same way.
- [ ] **C11. Tomáš → `/profile/tereza?tab=about`** (other user's profile). No Edit button anywhere — this is someone else's profile. AppNav shows Camera+ + Bell + Chat (global compose unaffected).

---

## Workstream D — Services tab (D6 + D7)

**D7.** Carer audience toggle replaced the raw `<button>` with a real `Toggle` component, relabeled "Open to anyone" to communicate the audience dial (not a tier progression). **D6.** "Make profile public" CTA on the locked-provider banner is now wired (was a no-op stub).

- [ ] **D1. Klára → `/profile?tab=services`, tap Edit, scroll to bottom.** "Open to anyone" section renders with a real Toggle (matching the Open-to-helping style above). Sub-copy reads:
  - On: *"Your services appear in Discover for anyone in Prague to find."*
  - Off: *"Only people you're Connected with can see and book your services."*
- [ ] **D2. Klára → flip the Toggle in both directions, Save.** View mode updates: small "Open to anyone" / "Connected circle only" line under the "Open to helping" badge reflects the new state.
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
- [ ] **F3. Persona switch via name dropdown while in edit mode.** The persona-change useEffect resets `aboutEditing` / `servicesEditing` to false (line ~134 in `app/profile/page.tsx`). Confirm: enter edit, switch persona via the name dropdown, the new persona arrives in view mode with TabBar visible. No stuck-in-edit state.
- [ ] **F4. Daniel → `/profile/tereza?tab=about`.** Other-user profile renders without Edit button. AppNav has Camera+ + Bell + Chat. Familiar / Connected pill (depending on relationship) shows in the hero — not affected by this round's changes.
- [ ] **F5. Mobile width (≤640px).** All AppNav slot states render without overflow. Edit text button doesn't crowd Bell + Chat. Cancel/Save in edit mode fits the row.
- [ ] **F6. Resize browser between mobile and desktop during edit mode.** Lock-in holds at both widths (TabBar stays hidden, slot stays in Cancel/Save). No layout breaks.

---

## Decisions surfaced during walkthrough

Emergent decisions / design changes during verification. **Append as you walk**, sweep at phase close.

- [ ] **Auto-discard on Cancel — no confirm prompt.** Pragmatic choice for the prototype; matches Doggo's general "no half-built modal" feel. If user-testing reveals lost-edit complaints, revisit. → `docs/features/profiles.md` if it survives testing
- [ ] **`Open to anyone` is the new audience label (D7).** Replaced "Search visibility" / "Public" / "Connections only" mix with one Toggle + binary copy. Drops all tier/ladder language. → `docs/features/profiles.md`, `docs/strategy/Groups & Care Model.md`
- [ ] **`onUnlockProfile` wires the locked-provider banner CTA (D6).** One-tap action flips `profileVisibility: "locked" → "open"`. No confirm modal. → `docs/features/profiles.md`
- [ ] **AppNav page-action slot pattern (A6).** New `PageHeaderContext` fields (`pageAction`, `suppressCreate`, `navLockedIn`) — a reusable mechanism for any page that wants a contextual primary action in the AppNav nav row + optional lock-in mode. Profile is the first consumer; future phases may apply it (booking detail, meet detail, group detail). → `docs/implementation/design-system.md` (new principle: "Page-action slot in AppNav")
- [ ] **PetCard energy palette switched from `--status-*-light/main` to `--*-50/600`.** Scoped to PetCard energy pill only — does not touch app-wide `--status-*` tokens. Border added for edge definition on `--surface-base` card. → `docs/implementation/design-tokens.md` or design-system.md if generalized
- [ ] **Conditions tag (warning-yellow) text color was the worst offender.** Switched to `--warning-600` for readable amber. Same scoped fix logic — may indicate the broader `--status-warning-main` is too light for body-text use anywhere. Audit punch list item P51 once. → punch list note

---

<!--
Open items NOT verified here (defer to phase close or later):
- D4 (Open to helping badge prominence) — deferred pending PO meeting outcomes
- E3 (Care CTAs copy + placement) — deferred pending community-vs-marketplace fork
- A2 (About subsection structure) — not pursued this round; current bio + dogs + connections + tagging + care section reads fine
- A4 (Connection state display) — no changes this round; reads as-is on other-user profile pages
- A7 (Member since + location prominence) — kept current treatment; small meta lines below the name
- E1 (Profile hero polish) — hero is now leaner after removing Edit Profile button; further polish deferred
- E2 (Share profile link) — `/connect/[code]` route not changed this round; verify visually but no code work
- E4 (Connection list display) — no changes; existing grouped list (Connected / Familiar / Pending) reads fine
- B4 (Post content depth) — content review only; four supporting users (zuzana, vitek, marie, nikola) have zero posts. Acceptable for "new/lurker" personas (Marie's bio explicitly says she's new). Promotion to add posts would be a Mock World Building task.
- D1/D2/D3 (Services content review) — content looks adequate from data inspection. Layout/grid review needs live preview.
- B1 (Post image corner radius / P8) — CSS already has `border-radius: var(--radius-md)` on `.post-photo-grid-img` from the Threads-style refactor. P8 removed from punch list 2026-05-11; verify nothing visually-regressed during F-pass.
-->
