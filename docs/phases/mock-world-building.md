---
status: draft
last-reviewed: 2026-04-26
review-trigger: "When any task is completed or blocked; re-read at phase open and any time scope shifts"
---

# Mock World Building

**Goal:** Make every persona's view of the prototype feel like a real person's account. Tap "Daniel" in the dropdown and his home feed has posts from his support group, his profile shows his connections to Klára and Hana, his inbox has the training-booking thread with Klára. Switch to Klára and the same thread is there, framed from her side. Each persona embodies a feature theme — Tereza (community organising), Daniel (cautious trust-building), Klára (provider workflow), Tomáš (care-finding under pressure), New User (onboarding empty states).

**Depends on:** Persona & Demo Mode Wiring closed (`docs/archive/phases/persona-wiring.md`). The infrastructure is in place; this phase fills the world.

**Refs:** [[mock-data-plan]], [[User Archetypes]], [[Trust & Connection Model]], [[Groups & Care Model]], `lib/mockUsers.ts`, `lib/mockConnections.ts`, `lib/mockConversations.ts`, `lib/mockMeets.ts`, `lib/mockPosts.ts`, `lib/mockBookings.ts`, `lib/mockReviews.ts`, archived persona-wiring "Follow-ups for Mock World Building".

---

## Why now

Persona Wiring shipped the plumbing. Today, picking Daniel from the dropdown swaps the active user — but the **world he sees is barely his**. Connection rosters are still Shawn-relative (`mockConnections.ts` returns `undefined` for any non-Shawn viewer), conversation threads all have Shawn as one of the two parties, posts are mostly Shawn-authored. The empty state isn't intentional design — it's missing data.

The fix is content, not code. The `useCurrentUser()` hook is everywhere; the helpers (`getConnectionState(userId, viewerId)`, `getUserMeets(userId)`, `getUserGroups(userId)`) already take a user ID. We just need each persona to have a populated "my world" the helpers can return.

This phase ends when a tester can drop into any persona and explore freely without hitting "huh, that's empty" surfaces — except where empty is the *narrative point* (Daniel's locked profile, New User's onboarding).

---

## Current state — audit (2026-04-26)

Counts after grep across mock files:

| Persona | Groups | Meets attended | Meets created | Posts | Bookings (owner / carer) | Reviews authored | Conn map | Convos |
|---|---|---|---|---|---|---|---|---|
| **Shawn** | 16 | 12 | 2 | 9 | 3 / 2 | 3 | 19 entries | 7 |
| **Tereza** | 9 | 6 | 5 | 3 | 0 / 1 | 1 | 0 (Shawn-only model) | 0 |
| **Daniel** | 3 | 4 | 2 | 3 | 1 / 0 | 1 | 0 | 0 |
| **Klára** | 7 | 7 | 3 | 5 | 0 / 3 | 0 | 0 | 0 |
| **Tomáš** | 7 | 7 | 2 | 5 | 2 / 0 | 1 | 0 | 0 |
| **New User** | 0 | 0 | 0 | 0 | 0 / 0 | 0 | 0 | 0 |

**Shape of the gaps:**

1. **Connections (biggest).** `mockConnections.ts` is a flat array — Shawn's perspective on 19 other users. Non-Shawn viewers see `undefined` for everyone. Fix: restructure as per-viewer maps (`{ shawn: [...], tereza: [...], daniel: [...], ... }`); update `getConnectionState(userId, viewerId)` to look up the viewer's map.
2. **Conversations.** All 7 booking-conversations have `ownerId: "shawn"`. None of `Daniel↔Klára (training)`, `Tomáš↔Petra (emergency)`, `Tereza↔Marek (sitting)` exist as threads, even though `mock-data-plan.md` describes them and the bookings reference them.
3. **Posts have decent diversity** — Eva, Tomáš, Klára, Jana have multiple — but the four journey personas (especially Daniel + Tereza) are thin. `mockPosts.ts` distribution: Shawn 9, Eva 8, Tomáš 5, Klára 5, Daniel 3, Tereza 3.
4. **Meets are well-populated** — 24 meets across the personas; creator distribution looks healthy.
5. **Bookings sparse.** 9 total. Need at least: Daniel↔Klára (training, active recurring), Tomáš↔Petra (emergency completed), Tereza↔Marek (favour, completed).
6. **Provider-userId mismatch (P4).** `mockBookings` has `carerId: "olga-m"`, `"nikola-r"`, `"petra-v"`. `mockUsers.ts` has `petra` (no `-v`), `nikola` (no `-r`), no `olga`. Booking objects already snapshot `carerName` + `carerAvatarUrl` so display works, but `getUserById` lookups break. Decision required on backfill vs. bridge formalisation.
7. **`shareCode` only on Shawn.** Trivial — 4 strings.
8. **`mockMeetMessages` sparse** (10 messages). Could use Daniel/Klára/Tereza/Tomáš messages on their own meets.

---

## Opening Checklist

Complete before writing any task code. Mark each item done.

- [x] Read every workstream + the referenced docs (mock-data-plan §"The Cast", User Archetypes for each persona, Trust & Connection Model)
- [x] Re-read persona-wiring archive's "Follow-ups for Mock World Building" — confirm coverage
- [x] Confirm scope cap with Shawn — **decided 2026-04-26: demo-quality (~4–6 sessions)**
- [x] Decide on P4 (provider-userId pattern) before A1 lands — **decided 2026-04-26: formalise the bridge** (keep providers as `ProviderCard`-only entries; document that `getUserById` may return `undefined`; ensure all UI handles gracefully)
- [x] Resolve image strategy with Shawn — **decided 2026-04-26: use existing assets only**; new image gen becomes its own later pass
- [x] Update any referenced docs with `last-reviewed` older than 2 weeks — already done during persona-wiring close (mock-data-plan bumped)
- [x] Confirm scope — no infrastructure work creeping in (that all belongs back in Persona Wiring or whichever surface phase introduces it)
- [x] Confirm execution order with Shawn — **decided 2026-04-26: all four personas in parallel, by workstream** (so A1 restructures shape → A2–A5 seed all four personas' connections in one pass → B/C/D similar)

---

## Workstream A — Per-persona connection rosters (the unblock)

`mockConnections.ts` becomes per-viewer. Every persona has 5–10 connections following their archetype. Shawn's existing 19 entries become his map.

| # | Description | Status |
|---|-------------|--------|
| A1 | Restructure `mockConnections.ts` from flat array to per-viewer map. Move existing 19 to `shawn`. Update `getConnectionState(userId, viewerId)` to look up the viewer's map. Keep the `Connection[]` type; just add a wrapping `Record<string, Connection[]>`. | todo |
| A2 | Seed Tereza's connections — Connected to Marek, Lucie, Jana, Klára (cross-persona); Familiar with Shawn, Zuzana (newest member); Pending out from Zuzana. ~6–8 entries. Mirror data from existing Shawn-side ones (Tereza is `Familiar` from Shawn's side → from Tereza's side that's also Familiar but with the bidirectional flag flipped). | todo |
| A3 | Seed Daniel's connections — Connected to Klára (his trainer), Hana (recommended Klára), Anezka (active poster in support group); Familiar with Vitek, Eva. ~5 entries. Reflects "anxious new owner who built trust through the reactive dog group." | todo |
| A4 | Seed Klára's connections — Connected to Daniel, Filip, Hana (clients) + Eva, Martin (Stromovka regulars) + Shawn; Familiar with a couple more. ~8–10 entries. Reflects "professional provider with deep cross-cluster ties." | todo |
| A5 | Seed Tomáš's connections — Connected to Petra (his go-to sitter), Ondřej, Adéla (Karlín regulars); Familiar with a couple more; Pending out from Shawn (mirrors Shawn-side existing data). ~6 entries. | todo |
| A6 | Seed New User connections — empty. Verify the empty-state branches across the app render gracefully (already validated during persona-wiring §7b — sanity re-check). | todo |
| A7 | Backfill connection symmetry. If Shawn shows Tereza as Familiar, Tereza should show Shawn as either Familiar (mutual silent) or None (Shawn marked her, she didn't reciprocate yet). Pick a policy + apply consistently. | todo |

## Workstream B — Per-persona conversation threads

| # | Description | Status |
|---|-------------|--------|
| B1 | Seed `Daniel ↔ Klára` booking-conversation thread. Anchors the training-booking arc the mock-data-plan describes. Real messages: Daniel's first inquiry, Klára's intake questions, Bára's reactivity context, scheduling, post-session follow-up. The active recurring booking object already exists for them — link via `conversationId`. | todo |
| B2 | Seed `Tomáš ↔ Petra` emergency-care thread. Tomáš asks if Petra can take Hugo for 2 days, Petra responds, logistics, payment. The completed booking already exists — link. | todo |
| B3 | Seed `Tereza ↔ Marek` casual sitting thread. Direct conversation (not booking) — Tereza asks about Benny, they coordinate a weekend favour. | todo |
| B4 | Seed `Klára ↔ Filip` training thread. Filip is a Klára client; one completed booking exists. Conversation is short — booking confirmation + recap. | todo |
| B5 | Seed 2 group-chat-style messages or DMs from supporting cast that visibly bring each persona's inbox to life when viewing as them. E.g., `Hana → Daniel` ("how was last session?"), `Jana → Tereza` ("Thursday on?"), etc. | todo |
| B6 | Audit `mockConversations.ts` field usage. Does anything assume Shawn? `getOrCreateConversation` defaults to current persona (already fixed during persona-wiring) — verify other helpers. | todo |

## Workstream C — Per-persona post authorship + feed depth

| # | Description | Status |
|---|-------------|--------|
| C1 | Add 3–4 Daniel posts in the reactive dog support group + 1 personal (Locked). Tone: vulnerable, grateful, slow-progress wins. ("Bára held it together for the whole walk today.") | todo |
| C2 | Add 3–4 Tereza posts — 2 in Vinohrady Evening Walkers (her group), 1 in Riegrovy Sady, 1 personal (Open). Tone: organising, warm, "see you Thursday." | todo |
| C3 | Add 2 more Klára posts — training session recaps with progress photos. Acts as social proof on her care-group page. | todo |
| C4 | Add 1–2 more Tomáš posts in Karlín groups — light, "Hugo got mud everywhere again" energy. | todo |
| C5 | Verify `getFeedForUser(personaId)` returns a coherent feed for every persona — at least 5 items, mix of types (post / meet recap / upcoming meet / connection nudge). Adjust feed-assembly logic if any persona's mix is broken. | todo |

## Workstream D — Bookings, reviews, share codes, polish

| # | Description | Status |
|---|-------------|--------|
| D1 | Add 1–2 more bookings to fill the demo arcs: Daniel↔Klára recurring active (already exists, verify), one new Klára recurring with Hana, one Tomáš booking with another Karlín helper. | todo |
| D2 | Add reviews mostly *of* Klára (she's the most-reviewed by design — 6 target per `mock-data-plan`). Authors: Daniel, Filip, Hana, Shawn (already exists). Plus 1 review of Petra by Tomáš and 1 of Tereza by Marek. | todo |
| D3 | Add `shareCode` to Tereza, Daniel, Klára, Tomáš. ~4 string assignments in `mockUsers.ts`. | todo |
| D4 | **P4 resolution** — execute the chosen path (backfill provider UserProfiles, OR formalise the bridge). Affects `mockBookings.ts` carerIds, `mockData.ts` provider entries, `mockConversations.ts` providerIds. | todo |

## Workstream E — Highlight reels + smoke

| # | Description | Status |
|---|-------------|--------|
| E1 | Identify each persona's "tell their story best" 3–4 surfaces. (E.g., Tereza: home feed + her created group + her profile. Daniel: reactive support group + his profile + his Klára-training-booking detail.) Document in `docs/features/demo-mode.md`. | todo |
| E2 | Walk each persona through their highlight reel + the rest of the app — flag any surface that's still incoherent. Fix or punt to the punch list. | todo |
| E3 | Update `docs/features/demo-mode.md` "Known limitations" — most should now be ticked off as resolved. | todo |
| E4 | Update `docs/implementation/mock-data-plan.md` — promote relevant sections from "Target State" to "Current State" reflecting what shipped. | todo |
| E5 | Verify every persona's `useCurrentUser()` flow against the running app (echo of persona-wiring E1, but with content this time). | todo |

---

## Acceptance Criteria

- [ ] `getConnectionState(userId, viewerId)` returns a populated `Connection` for any (user, viewer) pair where the relationship was seeded — no more `undefined` from non-Shawn viewers.
- [ ] Each of the 4 journey personas has at least 5 connections (mix of Connected / Familiar / Pending) reflecting their archetype.
- [ ] Picking Daniel from the dropdown shows: a non-empty home feed (his support group activity), a non-empty inbox (Klára training thread), connection pills that render on meets where he knows attendees, and a profile that reflects his locked-but-trusted-by-a-few state.
- [ ] Same for Klára: provider profile fully populated, her care group has visible posts + reviews, her inbox has at least 2 client threads.
- [ ] Same for Tomáš: Karlín group activity visible, Petra emergency-care conversation in inbox, his Hugo-Petra booking history surfaces in the schedule.
- [ ] Same for Tereza: Vinohrady Evening Walkers feed populated, her created-meets show up in her schedule, profile shows community-organiser trust signals.
- [ ] New User persona still renders gracefully — empty states feel intentional, not broken.
- [ ] Provider-userId pattern (P4) resolved — no `undefined` from `getUserById(carerId)` lookups in live code paths.
- [ ] TypeScript compiles clean.
- [ ] No regressions when viewing as Shawn — his existing world stays intact (all 19 connections, 7 conversations, etc.).

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs in `docs/features/` (especially `demo-mode.md`, `connections.md`, `messaging.md`)
- [ ] Update `docs/implementation/mock-data-plan.md` — promote shipped items from Target → Current; close mock-data Open Questions
- [ ] Update Open Questions log — close any per-persona content questions; surface new ones (Cross-Cutting Flow Testing scope?)
- [ ] Update ROADMAP.md — move phase out; note that Cross-Cutting Flow Testing now has rich content to test against
- [ ] Review CLAUDE.md — only update if the phase changed structure (likely just the persona-data state)
- [ ] Review Punch List changes since phase open
- [ ] Structural audit (per CONTRIBUTING.md step 8a)
- [ ] Strategic review — what does the demo arc look like now? Are we ready to start packaging it?
- [ ] Show user the closing checklist before archiving
- [ ] Archive this phase board

---

## Not in scope (will be tempting)

- **Image generation.** The mock-data-plan references 40 image prompts. Mock World Building uses *existing* assets. New image generation belongs in a dedicated content-asset pass, or earlier in this phase if Shawn wants to fold it in (Open Question below).
- **Surface design changes.** If a page's design is broken, that's the next surface-deep-pass's job (Community & Groups, Discover & Care, Schedule & Bookings). This phase only fills data.
- **Authentication, real backend, real-time messaging.** Still all mock.
- **New product features.** If something is missing because we never built it (e.g., notification rules per persona), file it on the punch list or as an Open Question — don't expand scope here.
- **Multi-user state mutations.** If Daniel marks Jana as Familiar in this session, Jana's view doesn't reflect it next session. Out of scope (was also out of scope for Persona Wiring).

---

## Decisions made at phase open (2026-04-26)

1. **Scope cap: Demo-quality** (~4–6 sessions). Every persona gets a coherent home feed, inbox, profile, and at least one rich cross-persona arc.
2. **Execution order: All four in parallel, by workstream.** A1 restructures connection shape → A2–A5 seed all four personas' connections in one pass → B/C/D follow the same pattern.
3. **P4 (provider-userId): Formalise the bridge.** Providers stay as `ProviderCard`-only entries; document `getUserById` may return `undefined`; ensure UI handles gracefully. None of these providers is a switcher persona.
4. **Images: Existing assets only.** 21 user avatars + dog/scene photos already in `/public/images/generated/`. New image gen is its own later pass.

## Open Questions — to resolve as we go

These are framing/depth decisions where my defaults below are reasonable; flag any that feel off.

5. **Demo-promotion focus.** Defaults:
   - **Tereza** — community organising (her created group, recurring meet, post-meet review flow as host)
   - **Daniel** — trust-building from a low base (locked profile, Familiar marks accumulating, the Klára booking arc as the trust→care payoff)
   - **Klára** — provider workflow (her care group, services on her profile, active booking with session check-ins)
   - **Tomáš** — community-to-care under pressure (Petra emergency thread + booking + review)
   - **New User** — onboarding empty states (no groups → join CTA, no connections → meets discovery)
6. **Cross-persona arcs.** The mock-data-plan calls out three: Daniel→Klára (training), Tomáš→Petra (emergency), Tereza→Marek (favour). Default: build all three richly as part of demo-quality scope.
