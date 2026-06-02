---
status: archived
last-reviewed: 2026-06-01
review-trigger: archived — phase closed-without-completion 2026-06-01
---

# Onboarding & In-Product Communication

> **Closed-without-completion 2026-06-01 (lightweight close).** Phase was opened 2026-05-04 as pre-phase research while Pricing & Proposals was mid-flight; only V1.1 (privacy explainer page `/help/privacy` + lock-card wire-up at [`app/profile/[userId]/page.tsx:501`](../../app/profile/[userId]/page.tsx)) and V1.3 (Familiar asymmetry explainer card on `ProfileAboutTab` at [`components/profile/ProfileAboutTab.tsx:562`](../../components/profile/ProfileAboutTab.tsx)) actually shipped. **V1.2 (group visibility chip rewrites)** and **V1.4 (tier badge tooltips — partially obsolete since the tier system was retired in Discover Refinement 2026-05-10)** were never built.
>
> **Why closed without completion.** Too much core flow was still changing for tutorial work to invest in (V2 walker-trainer narrative, Carer Portfolio, Photos & Galleries, the four-service Care taxonomy + filter redesign all landed after this board was drafted). A future onboarding phase should re-scope against the current product state rather than resume this board verbatim — the V1.2 + V1.4 specs reference surfaces that may have moved.
>
> **What survives for a future onboarding phase.** The product decisions D1–D5 below + the V2-deferred list at the bottom are the reusable record. The deniability principle, the four touchpoint design pattern (trigger / surface / dismiss / copy), and the V1.1 privacy explainer page structure are the foundations a re-opened phase can build on.
>
> **Walkthrough.** Only V1.1.a + V1.1.b were walked (the privacy page renders + anchors work). The other walkthrough items are unverified.

---

## Original phase content

**Goal:** Teach the trust model + tier system + privacy mechanics in-context, briefly, without lecturing — and without leaking anything that would break the deniability principle.

**Depends on:** Discover & Care (closed). Pricing & Proposals is mid-flight in another chat — pricing-setup teaching surfaces are deferred to v2 to avoid surface collisions.

**Refs:** [[strategy/Trust & Connection Model]], [[strategy/Groups & Care Model]], [[strategy/Content Visibility Model]], [[strategy/Open Questions & Assumptions Log]] §2 + §3 + §4 + §9, [[features/profiles]], [[features/connections]]

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — flag anything affecting this phase
- [x] Audit for conflicts between phase plan and current codebase
- [ ] Update any referenced docs with `last-reviewed` older than 2 weeks (deferred to formal phase open per pre-phase rules)
- [x] Confirm scope — no tasks that belong in a different phase

---

## Phase Status

**Pre-phase research + isolated implementation in flight (2026-05-04).** Touching only safe surfaces while Pricing & Proposals is mid-edit. Formal phase open is pending the user's sequencing — when it happens, update CLAUDE.md, ROADMAP.md, and the Open Questions log to reflect "this phase is active."

---

## Decisions

Logged here, not in Open Questions, per pre-phase scope.

- **D1 — Privacy explainer route is `/help/privacy`** (standalone, shareable, doesn't conflate "explain" with "settings"). Anchor links per section so other surfaces can deep-link (`/help/privacy#open-vs-locked`, `#familiar`, `#share-link`, `#tier`).
- **D2 — Group visibility chip uses combined label + tooltip.** Label gets the action-y rewrite; tap reveals a one-sentence explainer popover. Both pieces of meaning surface — label for at-a-glance, tooltip for "wait, what does that mean."
- **D3 — Familiar asymmetry explainer is a persistent card on the own-profile About tab,** not a one-time coachmark on first Familiar action. Reasons: (a) deniability-safe — only the actor sees it on their own profile, (b) avoids first-time persistence machinery, (c) reinforces the mechanic every time the user revisits their own profile.
- **D4 — Tier badge tooltip uses tap (not hover).** Mobile-first; hover is a desktop-only fallback. Tap also feels intentional ("I want to know more about this badge").
- **D5 — Helper → Carer rename, Care vs Meet teaching, pricing-setup walkthrough, post-meet review nudge: all deferred to v2.** v1 ships the four foundational touchpoints below; v2 cleanup happens after Pricing & Proposals closes and the avoid-list lifts.

---

## Workstream V1 — Foundational Touchpoints

Four touchpoints, isolated from Pricing & Proposals surface area. Each has trigger / surface / dismiss / copy detail inline.

### V1.1 — Privacy explainer page + lock-card link wire-up

**Mechanic taught:** Lock vs Open profile visibility, asymmetric Familiar grant, Connected as mutual, share-link bypass, Owner / Helper / Provider tier dial.

**Trigger:** Tap "Learn how privacy works" on a locked profile lock card (today: dead `href="#"`). Also reachable directly via URL.

**Surface:** New route `/help/privacy`. Standalone within the existing app shell (not a modal, not behind `/profile`). Sections (anchor IDs in parentheses):

1. **Intro** — one paragraph: "Doggo is community-first. Trust is earned by showing up — at meets, in groups, in your neighbourhood. The model below is what makes that work."
2. **Who can see your profile** (`#open-vs-locked`) — Open vs Locked. Default is Locked. Open = anyone can see expanded content. Locked = only Familiar/Connected viewers see expanded content.
3. **Familiar — the asymmetric grant** (`#familiar`) — Marking someone Familiar opens **your** profile to them. It does not unlock theirs for you. Familiar is silent — no notification. The unlock loop: participate → mark people you recognise → they see more of you → they may mark you back → over time you see each other's full profiles.
4. **Connected — the mutual relationship** (`#connected`) — Both people accept. Unlocks direct messaging. If either offers care services, the booking CTA appears.
5. **Share-link bypass** (`#share-link`) — Your profile share link works because *the act of sharing it is itself the trust signal.* For the "we already know each other IRL" case. Find your link on your own profile.
6. **Tier — your services dial** (`#tier`) — Owner (default, no services) → Helper (Connected viewers can act) → Provider (anyone can act). Tier is **independent** from Lock: Lock controls who can *see* the profile; Tier controls who can *act* on its services.

**Dismiss:** Navigation. Page has standard back-nav (DetailHeader pattern).

**Copy tone:** Direct, second-person, short paragraphs. No "we built this because" — explain the mechanic, not the philosophy. Link to the home pages of personas/meets where the mechanic is exercised, but don't try to demo it inside the explainer.

**Implementation notes:**
- Place at `app/help/privacy/page.tsx`. PageColumn pattern. DetailHeader with back button + "How privacy works" title.
- Update [app/profile/[userId]/page.tsx:294-304](app/profile/[userId]/page.tsx) — replace `href="#"` and `onClick={(e) => e.preventDefault()}` with `href="/help/privacy"`.
- No new tokens, no new CSS. Pure Tailwind utilities + existing semantic tokens.

---

### V1.2 — Group visibility chip clarity

**Mechanic taught:** open / approval / private continuum — visibility (who can see content) is independent from joining (whether the group requires approval).

**Trigger:** Tap the visibility chip on a group card or detail page.

**Surfaces (4 callsites):**
- [components/groups/CardGroup.tsx:81-83](components/groups/CardGroup.tsx) — chip on the compact group card
- [components/groups/GroupCard.tsx:43](components/groups/GroupCard.tsx) — chip on the larger group card
- [components/groups/GroupDetailPanel.tsx:153-160](components/groups/GroupDetailPanel.tsx) — chip on the panel header
- [app/communities/[id]/page.tsx:320-327](app/communities/[id]/page.tsx) — chip on the standalone group page header

**Label rewrite:**

| Old | New | Explainer (tooltip) |
|-----|-----|---------------------|
| (no chip for `open`) | (no chip — unchanged) | n/a |
| "Approval required" | **"Approval to join"** | "Anyone can see this group. Joining requires admin approval." |
| "Private" | **"Private · approval to join"** | "Hidden from non-members. Joining requires admin approval." |

**Dismiss:** Tap-away closes the popover.

**Implementation notes:**
- Build a small `GroupVisibilityChip` component in `components/groups/`. Wraps the existing chip pattern; takes `visibility: GroupVisibility` and renders the label + tap-tooltip. All 4 callsites switch to it.
- Tap-tooltip = a small popover anchored below the chip. No external library — inline state + outside-click handler. ~40 lines.
- Tooltip body: tokenized — `bg-surface-overlay` (or equivalent), `text-fg-secondary`, `text-xs`, `rounded-panel`, `shadow-md`. Width capped at ~240px so the sentence wraps cleanly.
- Open groups still render no chip — preserves the visual hierarchy "noteworthy = chip; default = silent."

---

### V1.3 — Familiar asymmetry explainer on own-profile About tab

**Mechanic taught:** Marking Familiar opens **your** profile to them, not the reverse. The deniability-sensitive piece — explained on the actor's surface only.

**Trigger:** Always present on the own-profile About tab. Low-key, not blocking, not dismissible (it's the explainer, not a coachmark).

**Surface:** [app/profile/page.tsx](app/profile/page.tsx) → About tab. Placement: after the visibility toggle / lock setting, before tag-approval. So the mental sequence reads: "this is who can see your profile" → "this is what marking someone Familiar does" → "this is how tagging works."

**Copy:**

> **About marking people Familiar**
>
> Marking someone Familiar opens **your** profile to them — not the other way around. They can see more of you next time they visit. It's silent — they're never told who marked them.
>
> [Learn more about how privacy works →](/help/privacy#familiar)

**Dismiss:** N/A — persistent.

**Implementation notes:**
- Inline JSX block in `app/profile/page.tsx` About tab, no new component needed (it's a one-instance card).
- Use `bg-surface-inset rounded-panel p-lg` pattern matching other About tab cards. Lead bold text + paragraph + link.
- Link uses the same underlined-link pattern as the lock card's "Learn how privacy works."

---

### V1.4 — Tier-badge tooltip + tier section in explainer page

**Mechanic taught:** Helper vs Provider distinction, Lock × Tier orthogonality.

**Trigger:** Tap the Helper or Provider tier badge anywhere it renders (PersonRow, profile hero, members list, etc.).

**Surface:** `components/badges/TierBadge.tsx` (or wherever the tier badge currently renders — verify in implementation).

**Copy (tooltip body):**

- Helper badge → **"Helper — Connected with this person? You can ask them about their services. They keep services casual, between people they already know."**
- Provider badge → **"Provider — anyone can book. {Name} offers care as a published service with set rates."**

Footer link in both: "[How tiers work →](/help/privacy#tier)"

**Dismiss:** Tap-away.

**Implementation notes:**
- Reuse the same tap-tooltip primitive built for V1.2 (extract to `components/ui/TapTooltip.tsx` so both touchpoints share it). This is a 9+ properties / multi-state component → CSS class + component is the right shape per design system rules.
- Verify the badge rendering site exists; if it's currently a passive span, wrap in a button with `aria-haspopup` and the tap handler.
- Tier section in `/help/privacy#tier` — already specified in V1.1.

---

## Acceptance Criteria

- [ ] `/help/privacy` exists and renders in the app shell with all six sections + working anchor IDs
- [ ] Lock-card "Learn how privacy works" link routes to `/help/privacy` (no more `href="#"`)
- [ ] Group visibility chips read "Approval to join" / "Private · approval to join" across all 4 callsites
- [ ] Tap on a group visibility chip opens a one-sentence explainer popover; tap-away dismisses
- [ ] Own-profile About tab shows the Familiar asymmetry explainer card with link to `/help/privacy#familiar`
- [ ] Tap on a Helper or Provider tier badge opens an explainer popover with link to `/help/privacy#tier`
- [ ] No regressions to existing surfaces (lock card, group cards, badges, profile About tab still render as before everywhere else)
- [ ] No edits to: `components/messaging/*`, `components/profile/ProfileServicesTab.tsx`, `components/profile/AvailabilityGrid.tsx`, `app/discover/care/*`, `lib/pricing.ts`, `lib/types.ts` pricing types, `app/globals.css` proposal-form/profile-modifiers sections

---

## Deferred to V2 (post-Pricing & Proposals)

Documented here so the work doesn't get lost. Not built in v1.

- **Helper → Carer rename** — product call belongs with formal phase open. Open Q §4.
- **Pricing-setup entry coachmark** — wait until Pricing & Proposals closes so the entry routes to a known UI.
- **Provider onboarding routing question (Care vs Meet)** — blocked by ProfileServicesTab avoid-list.
- **Owner-facing card differentiation (Care vs Meet)** — blocked by ProfileServicesTab avoid-list.
- **Inquiry → mutual-Familiar transition explainer in InquiryFormModal** — blocked by messaging avoid-list; arguably belongs to Inbox & Notifications.
- **Post-meet review onboarding nudge** — existing flow works; v2 polish.
- **New-user welcome card on /home** — Demo Presentation phase has more context.
- **"What's a meet?" empty-state inline explainer** on Discover Meets — small pickup, v2.
- **Share-link first-time hint on own profile** — share section in V1.1 explainer page is enough for v1.
- **Privacy explainer page tier section gets a "What's a Carer?" subsection** if the rename happens.

---

## Closing Checklist

Complete before marking this phase done. Mark each item done.

- [ ] Walk through every acceptance criterion against the running app (use the walkthrough doc)
- [ ] Update affected feature docs in `docs/features/` (profiles, connections — at minimum reference the new explainer page)
- [ ] Update Open Questions log — close §3 group-visibility-chip-clarity, partially address §2 Familiar-asymmetry teaching, partially address §4 tier-system teaching
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update current phase, key decisions, any structural changes
- [ ] Archive this phase board (copy to `archive/phases/`, mark status: archived, then delete original from `phases/`)
- [ ] **Structural audit** — run before marking the phase done:
    - Any files in `docs/phases/` with `status: archived` or `status: complete`? Delete them.
    - Any filename duplicated between `docs/phases/` and `docs/archive/phases/`? Delete the live copy.
    - Any docs in `strategy/`, `features/`, `implementation/` with `last-reviewed` older than 21 days? Review or bump.
    - Any dead references in `README.md`, `CLAUDE.md`, `ROADMAP.md`, `CONTRIBUTING.md` to files that no longer exist? Fix.
- [ ] Check next phase scope (Design System Cleanup or Demo Presentation depending on order) for conflicts with what was just built
