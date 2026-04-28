---
status: archived
last-reviewed: 2026-04-26
archived-on: 2026-04-26
review-trigger: archived — read for historical context only
---

# Persona & Demo Mode Wiring

**Goal:** Turn persona switching from a static URL-deeplink concept into a real runtime feature. Any reviewer (or tester) should be able to pick a persona from the Front Door, navigate anywhere in the prototype, and have the whole app render as that persona — attendee tiers, connection state, feed, "people you know" copy, everything — with the choice persisting across navigation. Same for the "new user" empty-state demo.

**Depends on:** Meets Deep Pass closed. Persona switching infrastructure lands before Mock World Building so we can actually see what Daniel / Klára / Tomáš need.

**Refs:** [[Open Questions & Assumptions Log]] (§10 Demo & Presentation — persona switching mechanism), [[User Archetypes]], [[mock-data-plan]], `lib/mockUser.ts`, `lib/mockUsers.ts`, `lib/mockUserState.ts`

---

## Why now

The Meets Deep Pass walkthrough surfaced this: most surfaces render fine as Shawn because his data happens to straddle interesting states. But the demo-grade pieces — brand-new-user empty state, Daniel's "you know nobody" copy, Klára's provider dashboard from her own perspective, Tomáš's busy-professional care flow — all require *seeing the app as someone else*, and the current system can't do that.

Right now:
- `mockUser.id = "shawn"` is a hardcoded constant (`lib/mockUser.ts:4`)
- `DEMO_NEW_USER = false` is a compile-time flag (`lib/mockUserState.ts:6`) — flipping it requires a source edit + rebuild
- There is no existing "view as someone else" surface anywhere in the app. The current landing page is also stale and due for its own refresh in a later phase, so don't anchor too hard on its current sections (Archetype cards, testimonials) when designing where the switcher lives — they're not the foundation, they're prior state. _(2026-04-25 — corrected after a sibling chat audited the landing page and the original draft was clarified: this phase introduces a switcher; the landing page redesign is its own future concern.)_

The fix is plumbing, not product design. But it unblocks the next several phases of product work.

---

## Decisions already made (from 2026-04-25 scoping chat)

Captured here so the phase-open chat doesn't re-litigate them:

- **Storage mechanism:** `localStorage`, not URL params. URL clutter is worse than minor hydration complexity.
- **Default state:** Shawn as the current user, `DEMO_NEW_USER = false`. If localStorage is empty, render as today.
- **Switcher surface:** Front Door gets a "View as…" picker listing Shawn + the four personas. Each option optionally bundles "new-user mode on/off" as a sub-choice.
- **Visibility when switched:** a small persona banner at the top of the app shell whenever the current user ≠ default OR `DEMO_NEW_USER = true`. Format: *"Viewing as Daniel · New-user mode · Exit"*. The banner itself is the exit affordance.
- **Scope bound:** this phase is *infrastructure*. It does NOT include curating each persona's mock data to the demo-ready bar (thin connections for Daniel, provider dashboard for Klára, etc.). That belongs in Mock World Building.
- **Runtime vs SSR:** current-user hook reads from localStorage on mount, defaults to Shawn on SSR. Accept a brief flash of default-user content during hydration; flag as known limitation.

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task below and the referenced docs (Open Questions §10, User Archetypes, mock-data-plan)
- [x] Review Open Questions log in full — flag anything related _(noted: §11 "feed algorithm currently hardcoded to 'Vinohrady' — needs to be user-context-aware for persona switching" folds into C5; §10 stale "three personas" line — fix during E3)_
- [x] Audit for conflicts: grep `mockUser.id`, `"shawn"`, `DEMO_NEW_USER`, `CURRENT_USER` — how many sites assume the hardcoded values? (Prepare the refactor map) _(map captured in chat: ~25 callsites across 3 patterns — `CURRENT_USER`/`MY_USER_ID` constants in 8 files, inline `"shawn"` literals across ~12 components/pages, and helper defaults in `lib/meetUtils.ts`. Mock-data seeds in `lib/mock*.ts` are correctly excluded.)_
- [x] Confirm all of the 2026-04-25 scoping decisions above still hold — push back if any feel wrong on a fresh read _(all hold. C3 sub-decision: strip Shawn defaults from `getAttendeeTier`/`getKnownAttendees` rather than re-default — runtime switching makes silent defaults a bug magnet.)_
- [x] Update any referenced docs with `last-reviewed` older than 2 weeks _(none stale — all referenced docs reviewed 2026-04-23 or later.)_
- [x] Confirm scope — no persona-specific content curation creeping in (that belongs in Mock World Building)

---

## Workstream A — Current-user hook

Replace the static `mockUser` import pattern with a hook-backed current user that reads from localStorage and has a sensible SSR fallback.

| # | Description | Status |
|---|-------------|--------|
| A1 | Create `contexts/CurrentUserContext.tsx` — provider wraps the app shell, exposes `{ user, setUser, resetToDefault }`. Reads localStorage on mount; default is Shawn. | done |
| A2 | Create `hooks/useCurrentUser.ts` — shorthand returning the resolved UserProfile (falls back to `mockUser` on SSR / empty state). | done |
| A3 | Mount `CurrentUserProvider` in `app/layout.tsx` (inside SignupProvider, outside the domain contexts). | done |
| A4 | Create `lib/personas.ts` — ordered list of persona options for the switcher. | done |

**A1 outcome:** `contexts/CurrentUserContext.tsx` exposes `{ user, isDefault, setUserById, resetToDefault }`. localStorage key `doggo-demo-user-id` persists the active persona. SSR renders Shawn; mount effect hydrates from storage. (Earlier draft also held a `newUserMode` flag — superseded; see B-revision below.)

**A2 outcome:** `hooks/useCurrentUser.ts` exports `useCurrentUser()`, `useCurrentUserId()`, and `useIsNewUser()`. Reads from `CurrentUserContext` plus checks `?as=<personaId>` URL param for per-URL overrides (no localStorage write). SSR-safe.

**A3 outcome:** Provider mounted in `app/layout.tsx` between `SignupProvider` and `NotificationsProvider`. Profile-page hero re-renders against `useCurrentUser()` so persona swap reflects in place.

**A4 outcome:** `lib/personas.ts` defines `personas: PersonaOption[]` (6 options: Shawn, Tereza, Daniel, Klára, Tomáš, New User). Each pairs a `UserProfile` with `archetype` + `tagline` framing. `getPersona(id)` lookup helper. `defaultPersona` constant. `isNewUser(id)` predicate.

## Workstream B — Empty-state demo as a persona (revised)

Originally scoped as: "make `DEMO_NEW_USER` a runtime toggle." Revised mid-phase to: **make "New User" a regular persona option** so it sits in the same picker as everyone else and the API stays consistent (one selection, not selection + flag). Cleaner UX, simpler mental model.

| # | Description | Status |
|---|-------------|--------|
| B1 | ~~Move `DEMO_NEW_USER` from constant to `CurrentUserContext` state.~~ **Revised** — `newUserPersona` added to `lib/personas.ts` as the 6th picker option (empty pets, blank bio, locked, no carer profile, generic SVG avatar). Empty state surfaces as `useIsNewUser()` → `currentUser.id === "new-user"`. | done (revised) |
| B2 | Update `DEMO_NEW_USER` consumers (`app/home/page.tsx`) to read from context. | done |
| B3 | Keep `lib/mockUserState.ts` as a fallback shim, then delete once zero importers. | done — reduced to deprecation stub; sandbox blocked initial `rm`. Phase-close cleanup attempts deletion via `mcp__cowork__allow_cowork_file_delete`. |

## Workstream C — Migrate consumers

Grep and migrate sites that assume `mockUser.id === "shawn"` or import `mockUser` directly.

| # | Description | Status |
|---|-------------|--------|
| C1 | Audit + classify `"shawn"` usages. | done |
| C2 | Replace `mockUser.id` in composers (PostComposer, MeetComposer, PostMeetReviewSheet) with `useCurrentUserId()`. | done |
| C3 | Strip Shawn defaults from `getAttendeeTier` / `getKnownAttendees`; force callers to pass `currentUserId` explicitly. | done |
| C4 | Make `getConnectionState` viewer-aware. | done |
| C5 | Audit feed, schedule, notifications — make them current-user aware. | done |
| C6 | Audit `getUserMeets` callers. | done |

**C1 outcome:** Refactor map: ~25 callsites across 3 patterns — `CURRENT_USER`/`MY_USER_ID` constants in 8 files, inline `"shawn"` literals across ~12 components/pages, helper defaults in `lib/meetUtils.ts`. Mock-data seeds in `lib/mock*.ts` correctly excluded.

**C2 outcome:** PostComposer, MeetComposer, PostMeetReviewSheet, TagAutocomplete all migrated. PostComposer's module-level helpers (`getEntitiesForType`, `getSuggestions`) now take `currentUser: UserProfile` as a parameter — the main component reads via hook and threads it down through `AccordionRow`.

**C3 outcome:** `getAttendeeTier(a, currentUserId)` and `getKnownAttendees(attendees, currentUserId)` now require the user ID. Decision rationale: silent defaults are bug magnets in a runtime-switching world — better to surface every callsite at type-check time. All callers updated.

**C4 outcome:** `getConnectionState(userId, viewerId = "shawn")` now takes a viewer parameter. For `viewerId !== "shawn"`, returns `undefined` — connection rosters are still Shawn-relative in `mockConnections.ts`. Non-Shawn personas see no connection pills until **Mock World Building** populates per-persona maps. Documented with a long doc-comment so the limitation isn't surprising.

**C5 outcome:** `app/home/page.tsx` reads `useCurrentUserId()` for `getUserGroups` + `getFeedForUser` + `useIsNewUser()` for the empty-state branch. `app/schedule/page.tsx` + `MyScheduleTab` use `useCurrentUserId()`. `app/inbox/page.tsx` `getOtherParty(conv, currentUserId)`. `contexts/ConversationsContext.tsx` reads current persona for `getOrCreateConversation`/`getOrCreateDirectConversation` and the `getConversationForUser` filter. Notifications already user-agnostic (no migration needed).

**C6 outcome:** All callers of `getUserMeets`, `getUserGroups`, `getMessagesForGroup` pass `currentUserId`. Also swept `app/discover/meets/page.tsx`, `app/discover/groups/page.tsx`, `app/posts/create/page.tsx`, `app/connect/[code]/page.tsx`, `app/profile/page.tsx`, `app/profile/[userId]/page.tsx`, `app/communities/[id]/page.tsx`, `app/meets/[id]/page.tsx`, `components/explore/CardExploreResult.tsx`, `components/groups/GroupDetailPanel.tsx`, `components/messaging/RelationshipBanner.tsx`, `components/meets/CardMeet.tsx`, `components/meets/ParticipantList.tsx`, `components/posts/PawReaction.tsx`, `components/feed/FeedCard.tsx`, `components/home/DogsNearYou.tsx`.

## Workstream D — Switcher UI (revised)

Originally scoped as: "/demo route + persona banner + exit affordance." Revised mid-phase: **banner removed, switcher relocated to the profile page name**. The banner pattern was right for visibility but felt intrusive on every screen; the name-as-dropdown affordance is contextual (you're on your own profile = the place where you'd choose to "be" someone) and demo-only by design — wouldn't ship in the real product.

| # | Description | Status |
|---|-------------|--------|
| D1 | `/demo` route — standalone picker page listing the 6 personas. Added to `GuestLayout`'s `isStandaloneRoute` list (no AppNav/Sidebar/BottomNav). Picking a persona writes to `CurrentUserContext` and routes to `/home`. Survives any future landing-page redesign because it's its own route. | done |
| D2 | ~~Persona banner in app shell.~~ **Revised** — `components/profile/ProfileNameDropdown.tsx`: the profile page's name (`text-2xl`) doubles as a dropdown trigger with a small caret. Tap → 280px popover with the 6 personas + "Open full picker →" link to `/demo`. Demo-only affordance; doesn't appear elsewhere. | done (revised) |
| D3 | ~~Exit-to-default banner click.~~ **Revised** — picking the default persona (Shawn) from the name dropdown clears localStorage; same effect as the old banner-click. Plus URL param `?as=<personaId>` lets you preview any URL as another persona without persisting. | done (revised) |

**D1 outcome:** `app/demo/page.tsx` + `app/demo/demo.css` — full-bleed picker page. 6 persona cards with avatar + archetype + tagline + neighbourhood + dog summary. Active persona shows "Active" pill; others show "Enter →". Footer links back to `/`.

**D2 outcome (revised):** `ProfileNameDropdown` replaces the original `<h1>` on `/profile`. Earlier iteration was a separate "Change user" outline button next to "Edit Profile" (`ChangeUserMenu.tsx`, now stubbed). Earlier-still iteration was a fixed top-of-app banner (`PersonaBanner.tsx`, also stubbed). Both stubs are flagged for phase-close deletion.

**D3 outcome (revised):** Clean exit = pick "Shawn" from the dropdown (he's labelled "Default" with a dashed border in the picker). URL-param overrides (`?as=daniel`, `?as=new-user`) provide an even lighter "preview without committing" path.

## Workstream E — Sanity + docs

| # | Description | Status |
|---|-------------|--------|
| E1 | Visual smoke test through each persona. | done |
| E2 | New `docs/features/demo-mode.md` describing switcher + URL params + persona registry. | done |
| E3 | Close Open Questions §10. | done |
| E4 | Update Meets Deep Pass walkthrough — items gated on `DEMO_NEW_USER` no longer require flag editing. | done — items absorbed into §7b live re-run (E5) so the walkthrough has a single source of truth for verification status. |
| E5 | Run deferred §7b items live as the right persona; tick each in the walkthrough doc. | done |

---

## Acceptance Criteria

- [x] ~~From the Front Door, I can click "View as Daniel" and navigate anywhere in the app — every surface renders as Daniel~~ **Revised:** From `/demo` _or_ the profile-page name dropdown, picking Daniel routes into the app and every persona-aware surface renders as Daniel.
- [x] Choice persists across page navigation and page refresh until I pick the default again
- [x] ~~Persona banner is visible whenever I'm not viewing as the default user or newUserMode is on~~ **Revised:** The name dropdown on `/profile` is the persistent affordance; URL `?as=...` is the lightweight preview path. Banner removed.
- [x] ~~`DEMO_NEW_USER` no longer requires a source edit + rebuild to toggle~~ **Revised:** "New User" is a regular persona option in the picker; `DEMO_NEW_USER` constant is gone (`mockUserState.ts` reduced to deprecation stub).
- [x] Grep for hardcoded `"shawn"` turns up only mock-data seeds (not CURRENT_USER constants in live code) — verified at close: only `lib/mock*.ts` seeds + the `viewerId = "shawn"` default in `getConnectionState` remain.
- [x] TypeScript compiles clean
- [x] No visual regressions when viewing as default (Shawn) — manually verified during E1.
- [x] Open Questions §10 "persona switching mechanism" closed with the decision recorded

---

## Closing Checklist

Complete before marking this phase done.

- [x] Walk through every acceptance criterion against the running app — verified live (E1) + via §7b re-run + grep + tsc
- [x] Update all affected feature docs — created `docs/features/demo-mode.md`; landing-page doc not modified (landing redesign is its own future concern)
- [x] Update Open Questions log — closed §10 mechanism question, closed §9 new-user feed question, added §11 connection-state-Shawn-only follow-up
- [x] Update ROADMAP.md — Persona Wiring removed from Upcoming; Mock World Building entry now lists specific gaps to backfill
- [x] Review CLAUDE.md — added `docs/features/demo-mode.md` to Key Docs table + a Persona Switching bullet under Key Decisions
- [x] Review Punch List changes since phase open — P11/P13/P14/P15 (parallel cleanup chat) reviewed; no overlap with Persona Wiring scope. Logged new P17 (orphan-file deletion blocked by sandbox/agent-mode).
- [x] Structural audit — Check 1 clean (only template + paused-phase + draft-being-archived hits, all are body text not frontmatter); Check 2 clean (no filename overlap); Check 3 hit on `docs/implementation/mock-data-plan.md` — bumped + closed Q1 ("Shawn's role in the demo") which Persona Wiring resolved.
- [ ] Archive this phase board — **PENDING USER GO-AHEAD** (per CLAUDE.md "Show user the checklist before editing docs" + user instruction "Don't archive silently")
- [x] Strategic review — see "Closing Summary" below + the Strategic Review block at the very bottom.

---

## Not in scope (will be tempting)

- **Full persona mock-data curation** — Daniel's thin connections, Klára's provider dashboard, Tomáš's care bookings, meet attendee lists specific to each persona's neighborhood. All of that is Mock World Building. This phase's job is the infrastructure so Mock World Building can actually happen.
- **Authentication / real user accounts** — out of scope; still all mock.
- **Persona-specific onboarding flows** — signup flow stays as-is; this phase is about reviewing existing surfaces through different eyes.
- **Multi-user state mutations** — if Daniel "marks Jana as Familiar," that change should be visible when viewing as Jana. Nice-to-have, probably deferred.

---

## Closing Summary (2026-04-26)

### What shipped

**Infrastructure (A + C workstreams):**
- `CurrentUserContext` + `useCurrentUser` / `useCurrentUserId` / `useIsNewUser` hooks. localStorage-backed; SSR-safe; default Shawn.
- `lib/personas.ts` — 6-entry persona registry (Shawn / Tereza / Daniel / Klára / Tomáš / New User). `getPersona`, `defaultPersona`, `isNewUser` helpers.
- C-sweep migrated ~30 callsites from hardcoded `"shawn"` (CURRENT_USER constants, inline literals, helper defaults) to the hook. `getAttendeeTier` + `getKnownAttendees` now require `currentUserId` — no silent default.
- `getConnectionState(userId, viewerId)` viewer-aware; non-Shawn viewers return `undefined` (Mock World Building scope).

**Switcher surfaces (D workstream — revised):**
- `app/demo/page.tsx` — standalone picker route (canonical entry, shareable URL).
- `components/profile/ProfileNameDropdown.tsx` — profile-page name as dropdown trigger (`text-2xl` + caret + popover). Demo-only affordance; replaces an earlier banner pattern that felt intrusive on every screen.
- URL param `?as=<personaId>` — per-URL preview override, no localStorage write. Useful for "what does this page look like as Daniel?" checks without committing.

**Empty-state demo (B workstream — revised):**
- "New User" promoted from a separate `newUserMode: boolean` toggle to a regular persona option. Empty state surfaces naturally because the persona has no pets/groups/connections.
- `app/home/page.tsx` switches to `getNewUserFeed()` when `useIsNewUser()` is true.

**Acceptance:** all 8 criteria met (3 substantively, 5 verbatim). See Acceptance Criteria above.

### What didn't ship — and why

- **Per-persona connection rosters.** `mockConnections.ts` is still Shawn-relative. Non-Shawn viewers see no connection pills. Intentional scope bound — content curation is Mock World Building's job.
- **Per-persona conversations.** `mockConversations.ts` threads are Shawn-paired. Non-Shawn personas see an empty inbox. Same reason.
- **`shareCode` per persona.** The Share Profile button now renders for every persona (falls back to `user.id`), but real per-persona share codes (`tereza-r4m2`, etc.) are Mock World Building work.
- **Multi-user state propagation.** "Daniel marks Jana as Familiar" → "Jana sees Daniel as Familiar" requires per-viewer mutations to mock data. Nice-to-have, deferred indefinitely.
- **SSR persona resolution.** First paint is always Shawn; localStorage hydrates on mount. ~50ms flash for non-default personas. Accepted limitation.
- **Orphan file deletion.** 4 deprecation stubs (`lib/mockUserState.ts`, `components/layout/PersonaBanner.tsx`, `components/profile/ChangeUserMenu.tsx`, `A2-A3-HANDOFF.md`) need manual delete — sandbox `rm` blocked, interactive permission tool unavailable in agent mode. Logged as punch-list P17.

### Decisions made during the work

1. **Storage = localStorage, not URL.** Per the original 2026-04-25 scoping. Holds.
2. **Strip Shawn defaults from helpers** (`getAttendeeTier`, `getKnownAttendees`). Silent defaults are bug magnets in a runtime-switching world; type-checking surfaces every callsite.
3. **`getConnectionState` returns `undefined` for non-Shawn viewers** rather than fabricating data. Empty pills > misleading pills.
4. **D1 placement = `/demo` route**, not a landing-page panel/launcher. Survives any future landing redesign and is shareable.
5. **Banner removed mid-phase**, replaced by `ChangeUserMenu` button → then by `ProfileNameDropdown` (name-as-trigger). Two iterations to land on the right affordance — both prior versions are now stubbed.
6. **`?new=1` URL param removed** when "New User" became its own persona. `?as=new-user` covers the same use case without a special-case flag.
7. **`?as=<personaId>` URL param kept** as a lightweight per-URL preview path — distinct from the persistent `localStorage` choice.
8. **Bottom-nav regex fix** (`(\?.*)?` allowance for all hub routes) — wasn't in the original scope; surfaced during E1 smoke testing on `/schedule`.
9. **Share Profile button ungated** — was conditional on `user.shareCode`; now falls back to `user.id`. Every persona deserves the button.

### Follow-ups for Mock World Building

1. **Per-persona `mockConnections.ts`** — restructure to per-viewer maps so non-Shawn personas see populated trust signals. The viewer-relative `getConnectionState` API is ready; just needs data.
2. **Per-persona conversation threads** — seed `mockConversations.ts` so Daniel ↔ Klára (training booking), Tomáš ↔ Petra (emergency care), Tereza ↔ Marek (casual care) all appear in the inbox of *both* parties.
3. **Broader post authorship** — `mockPosts.ts` is mostly Shawn-authored; non-Shawn personas have sparse home feeds.
4. **`shareCode` per persona** — `tereza-r4m2`, `daniel-w9k7`, `klara-p3n8`, `tomas-x6q4` (or similar). Trivial; just adds vibes.
5. **Provider-userId pattern resolution** (punch-list P4) — `mockData.ts` providers (`olga-m`, `jana-k`, etc.) lack `UserProfile` counterparts. Either backfill or formalise the bridge.
6. **Highlight reels per persona** — which 3-4 pages tell each persona's story best? Open Questions §10 explicitly defers this here.

### Strategic review (CONTRIBUTING step 9)

**What changed in our understanding of the product.** Building the C-sweep made it concrete that "the active persona" is a first-class concept the product has been pretending around for months. Before this phase, every component implicitly assumed Shawn — which was fine when the app was a single-persona prototype but invisible-broken once you imagine real multi-tenant use. The hook-everywhere pattern is now the foundation Mock World Building can lean on. Surprise: the sheer breadth of the sweep (~30 files) — every surface touches "the user" somewhere.

**Open questions worth resolving now.** Two recommendations:
- **§4 Hybrid trust model** — should the Familiar/Pending/Connected ladder be supplemented with lightweight platform signals (verified ID, network overlap, intro sessions)? The next two phases (Community & Groups, Discover & Care) both want to show trust signals; deciding now means consistent rendering. Recommend a focused discussion before Discover & Care opens.
- **§4 Lock vs. Tier reconciliation** — Profile Lock and Provider Tier currently overlap in how they describe service visibility. Discover & Care will hit this; cleaner to resolve in strategy first than inside that phase board.

**Alternatives and challenges.** The new-user persona currently shows a generic SVG silhouette avatar — fine for the picker, slightly weird on a real "your profile" page. Worth a tiny photo-real placeholder during Mock World Building. Also, the SSR Shawn-flash is a known UX paper cut — if it bothers a tester, Solution A (cookie-backed instead of localStorage) would let SSR resolve correctly. Probably defer until someone complains.

**Research suggestions.** None new. The competitive research for Discover & Care (Fluv, Time To Pet, Prague Dog Care Scene) is already loaded into Open Questions §4/§7/§8.

**Next phase readiness.** **Mock World Building is well-positioned.** This phase explicitly named the gaps; per-persona content backfill is mechanical from here. **Community & Groups** is also ready — the persona switcher means we can now actually see "Daniel lurks, Tomáš posts emergencies" in the prototype. Recommend **Mock World Building first, Community & Groups second** so the latter has rich material to deep-pass against.
