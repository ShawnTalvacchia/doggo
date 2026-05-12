---
status: active
last-reviewed: 2026-05-11
review-trigger: When any task is completed or blocked
---

# Profiles Deep Pass

> **Reopened 2026-05-11** in parallel with separate demo work in another chat. File overlap is low — profile work lives in `app/profile/*` + `components/profile/*`; demo work touches `app/page.tsx` + `app/demo/*` + `lib/tourSteps.ts` + `components/landing/*`.
>
> **2026-05-11 run shipped:** B5 (Posts header refactor + AppNav slot foundation), A5 (PetCard polish + persona-dog vet info), B1 (P8 verified resolved + removed from punch list), **A6 (edit-mode rework via AppNav page-action slot — the structural thesis of the round)**, D7 (Carer audience Toggle), D6 (locked-provider banner wired), A1 (thin-bio enrichment for Marek/Jakub/Marie), B4 (post-content audit — left as-is, four lurker personas with zero posts is intentional). Walkthrough: `profiles-deep-pass-walkthrough.md`.
>
> **Deferred:** **D4** ("Open to helping" badge prominence) and **E3** (Care CTAs) pending PO-meeting outcomes that may reshape trust signals and the community↔marketplace fork. **A2** (About subsection structure) not pursued — current bio + dogs + connections + tagging + care section reads coherent enough. **A4/A7/E1/E2/E4** (display polish) not pursued this round — most surfaces unchanged, kept for a polish-only sweep. **D1/D2/D3/D5** (services content + flow review) — content looks adequate from data inspection; live-preview review folded into the walkthrough.
>
> **Original pause 2026-04-14.** Trust signals (A3), composer rebuild (C1–C3), and post header attribution (B2/B3) shipped before the pause.

**Goal:** Make profiles feel like real people with real lives. The profile is the relationship hub — About, Posts, Services, Chat — it needs to be the strongest page in the app. When a tester views a profile, they should think: "I'd trust this person with my dog."

**Depends on:** Inbox & Notifications (done — chat-on-profiles architecture, connections list), Profiles & Dogs (done — unified PageColumn + TabBar, connection-gated CTAs, PetCard expand/collapse).

**Refs:** [[profiles]], [[Trust & Connection Model]], [[Content Visibility Model]], [[explore-and-care]], [[design-system]]

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — flag anything affecting this phase
- [x] Walk through own profile (`/profile`) — bio good, carer profile thin (generic bio, 1 service only)
- [x] Walk through other-user profiles — 12/20 users have thin bios, 12 pets lack socialisation notes
- [x] Walk through locked profile view — gate works, 8 users locked (some with thin content behind the gate)
- [x] Review current About tab content for each mock user — 5 rich (tereza, daniel, klara, eva, hana), 12 thin, 3 moderate
- [x] Review post composer — P7 confirmed: form-shell height calc doesn't account for page-shell padding
- [x] Review Posts tab — P8 needs verification (attribution, corner radius)
- [x] Check Services tab with provider profiles — klara/tereza/petra have carerProfiles in mockUsers but NOT in Explore providers array (data mismatch)
- [x] Confirm scope — all tasks fit this phase, no scope conflicts

---

## Tasks

### About Tab — Richer Content & Layout

The About tab is the first thing a visitor sees. It needs to tell a story — not just list facts.

| # | Description | Status |
|---|-------------|--------|
| A1 | Review and enrich mock user bios — every user should have a distinct, personality-rich bio (2-4 sentences). Currently most are one-liners or fallback text. **2026-05-11 audit:** majority of bios are now personality-rich. Enriched the three thinnest ones (Marek, Jakub, Marie) to match the rest. Remaining one-liners (Lucie, Zuzana, Ondrej, Adela, Martin, Filip, Hana, Vitek, Anezka, Jana) all have specific personality hooks — leaving as-is unless they read as thin in walkthrough. | done |
| A2 | "About" section structure — consider splitting into subsections: bio, interests/lifestyle, neighbourhood context. What would make someone feel they *know* this person? | todo |
| A3 | Trust signals review — added mutual connections ("You both know X") and shared groups ("Both in X") badges. Centered badge layout. Now 5 badge types: walks, known since, met at, mutual connections, shared groups | done |
| A4 | Connection state display — review how None/Familiar/Pending/Connected render. Is the badge clear? Is the gate understandable? | todo |
| A5 | Dogs section — two parts. (a) **Content review:** vet info added to Franta + Bella (Tereza's) and Eda (Klára's) so all four personas' dogs render the full Health & vet section. Supporting cast dogs have specific personality notes — leaving as-is. (b) **PetCard polish (2026-05-11):** caret now centers vertically with the identity column via `alignSelf: center` + `marginLeft: auto`; identity column gets `flex: 1; min-width: 0;`. Energy pill switched to `--{level}-50` background + `--{level}-600` text + 1px `--{level}-600` border for edge definition against the `--surface-base` card. Conditions tag (`pet-profile-health-tag--note`) text switched to `--warning-600` for readable amber on cream + `white-space: normal` so multi-sentence notes wrap cleanly. Scoped — no app-wide token changes. | done |
| A6 | **Edit-mode rework via AppNav slot (2026-05-11).** Shipped. New `PageHeaderContext` fields (`pageAction`, `suppressCreate`, `navLockedIn`) + `setPageAction` / `clearPageAction` methods. AppNav `LoggedNavLinks` consumes them: pageAction renders in the create-icon slot, suppressCreate hides it entirely, navLockedIn hides Bell + Inbox. Profile page wires per tab + edit state: Posts → suppressCreate; About/Services view → `Edit` button (tertiary text + pencil); About/Services edit → `Cancel` + `Save` + navLockedIn. TabBar hides during edit (`isEditing = aboutEditing \|\| servicesEditing`). Hero stripped to identity-only (Edit Profile button removed). `EditChrome` deleted from both ProfileAboutTab and ProfileServicesTab (3 sites in Services). Edit handlers in `app/profile/page.tsx` converted to `useCallback` so the slot's ReactNode memoizes stably. Auto-discard on Cancel; no confirm. Reusable pattern available for future phases — first candidate is booking/meet/group detail headers. | done |
| A7 | "Member since" and location display — are these prominent enough for trust building? | todo |

### Posts Tab — Fix & Enrich

| # | Description | Status |
|---|-------------|--------|
| B1 | Fix corner radius on post images in profile context (P8 from punch list). **2026-05-11:** Verified `.post-photo-grid-img` already has `border-radius: var(--radius-md)` (Threads-style refactor resolved it). P8 was stale — removed from punch list. | done |
| B2 | Add group/meet/care attribution to post headers — FeedCommunityPost now uses buildHeaderContext (shared with MomentCard) to show "in [Group]" / "at [Place]" / "with [Dogs]" context | done |
| B3 | Add header link matching main feed — headerContext includes clickable Link to group. Also added isCareProvider badge. Remaining tags shown (group/place consumed by header) | done |
| B4 | Review post content — do mock posts tell stories? Does each user have enough posts to feel real? **2026-05-11:** 102 seeded posts across 17 authors. Personas range from 3-7 posts each (Klára 7, Tereza 5, Shawn 4, Daniel 4, Tomáš 3). Four supporting users have zero posts (zuzana, vitek, marie, nikola) — acceptable for "new/lurker" archetypes (Marie's bio explicitly says she's new). Adding posts is Mock World Building territory if it grows. | done |
| B5 | **New post placement (2026-05-11).** Shipped. PostsTab dropped the "Posts" heading + button row; `+ New post` renders flush-right at the top of the panel, gated on `posts.length > 0` so the empty state isn't double-CTA'd. Profile page calls `setPageAction(null, { suppressCreate: true })` when on own Posts tab — AppNav Camera+ hides. Other-user Posts tabs keep Camera+ (global compose) and no in-panel button (gated on `isOwnProfile`). | done |

### Post Composer — Fix Broken Layout

| # | Description | Status |
|---|-------------|--------|
| C1 | Diagnose and fix post composer layout (P7 from punch list). Fixed: desktop form-shell height calc (was 80px short of page-shell padding), mobile uses 100dvh for full viewport | done |
| C2 | Redesign composer as modal (desktop) / bottom sheet (mobile) using ModalSheet. Minimal-first: photo hero, camera button, borderless caption, tag action row (Location/Pets/People/Community with inline pickers) | done |
| C3 | Wire PostComposerProvider into layout, update all entry points (AppNav, HomeFAB, ShareMomentBar, FeedCTA, CompactGreeting, PostsTab, GroupDetailPanel, communities page) to use openComposer() | done |

### Services Tab — Fuller Content

| # | Description | Status |
|---|-------------|--------|
| D1 | Review provider service cards — are service descriptions, pricing, and units clear? Does the layout sell the service? | todo |
| D2 | Enrich mock provider data — Klára (trainer), Nikola (walker), Olga (sitter) should each have distinct, detailed service listings with realistic pricing and descriptions | todo |
| D3 | Availability grid review — is the day/time grid readable? Does it communicate availability clearly? | todo |
| D4 | "Open to helping" badge and provider stats — are these trust signals prominent enough? Do they help a potential booker decide? | todo |
| D5 | Own profile services edit — review the edit flow for adding/removing services, setting availability, toggling visibility | todo |
| D6 | Locked provider banner — verify the "your profile is private" banner appears and the CTA works. **2026-05-11:** Wired the previously-stub `Make profile public` button via a new `onUnlockProfile` prop on ProfileServicesTab. Page-level handler flips `profileVisibility: "locked" → "open"` in-memory via `setUser`. One-tap, no confirm modal (banner disappears immediately since it's gated on profileVisibility === "locked"). Banner copy + Info icon unchanged. | done |
| D7 | **Carer audience toggle UI (2026-05-11).** Shipped. Raw `<button>` replaced with `Toggle` (matching the Open-to-helping pattern). Section label changed from "Search visibility" → **"Open to anyone"**. Sub-copy: *"Your services appear in Discover for anyone in Prague to find."* (on) / *"Only people you're Connected with can see and book your services."* (off). View-mode badge line under "Open to helping" pill changed from "Visible on Explore" / "Connections only" → **"Open to anyone"** / **"Connected circle only"**. `onToggleVisibility` prop signature normalized from `() => void` to `(v: boolean) => void` to match the Toggle API + Open-to-helping pattern. All ladder/tier/escalation language dropped per the Discover Refinement collapse. | done |

### Own Profile Polish

| # | Description | Status |
|---|-------------|--------|
| E1 | Profile hero section — avatar, name, location, edit controls. Does it feel like *your* space? | todo |
| E2 | Share profile link — review the share code UX. Is it discoverable? Does the shared page look good? | todo |
| E3 | Care CTAs — "Find Care" + "Offer Care" / "Manage Services". Are these prominent enough to drive the community→care funnel? | todo |
| E4 | Connection list on own profile — review how your connections display. Useful information? | todo |

### Cross-Cutting

| # | Description | Status |
|---|-------------|--------|
| X1 | Profile-to-profile consistency — walk through tereza, klara, daniel, tomas, marek. Do they all render consistently? Any edge cases (no pets, no posts, no care, locked)? | todo |
| X2 | Mobile responsiveness — review all tabs at mobile widths. Any overflow, truncation, or layout breaks? | todo |
| X3 | Locked profile experience — does the gate feel right? Is the explanation clear without being preachy? Does it make the user want to meet the person? | todo |
| X4 | Profile from different entry points — from inbox, from community feed, from meet attendee list, from discover. Is the transition smooth everywhere? | todo |

---

## Acceptance Criteria

- [ ] Every mock user has a personality-rich About tab that tells a story
- [ ] Trust signals on profiles communicate genuine trustworthiness, not just data points
- [ ] Posts tab shows posts with correct corner radius, group/meet attribution, and header links
- [ ] Post composer works correctly — layout intact, full flow functional
- [ ] Services tab for provider profiles (klara, nikola, olga) has rich, detailed content
- [ ] Own profile edit experience is smooth across About and Services tabs
- [ ] All profiles render consistently across users and viewports
- [ ] Locked profile gate feels respectful and motivating
- [ ] TypeScript compiles clean
- [ ] Feature docs updated

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/`
- [ ] Update Open Questions log — close resolved, add new
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived)
- [ ] Check next phase scope for conflicts with what was just built
