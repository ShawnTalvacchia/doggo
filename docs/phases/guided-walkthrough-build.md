---
status: active
last-reviewed: 2026-05-17
review-trigger: When any task is completed or blocked
---

# Guided Walkthrough Build

**Goal:** Implement the Guided Walkthrough specced in Demo Narrative & Personas W4 — auto-switching between personas through the four-beat [[strategy/Demo Narrative]], with a full-screen interstitial at each handoff and a persistent collapsible on-surface step card carrying the task while the tester works.

**Why now:** the `/demo` manual beat guide (shipped in Demo Narrative & Personas W5) is a confusing stopgap — once the tester taps into a beat, the instructions vanish and there's no way back to them. The on-surface card fixes that; the interstitial makes the persona handoff land.

**Depends on:** Demo Narrative & Personas — the W4 spec (`features/demo-mode.md` → "Guided Walkthrough — UX design spec") is the design this phase implements; the four-beat narrative + personas are the content. That phase is functionally complete (walkthrough verification outstanding); this build consumes its finished output, so the two overlap cleanly.

**Refs:**
- `docs/features/demo-mode.md` → "Guided Walkthrough — UX design spec" (THE spec — build to it)
- `docs/strategy/Demo Narrative.md` (the four beats + per-beat surfaces, tasks, prompts)
- `components/landing/TourOverlay.tsx` + `lib/tourSteps.ts` — prior art for the on-surface card; **superseded by this phase** (deleted in Workstream D)
- `contexts/CurrentUserContext.tsx` (`setUserById` — the persona-switch primitive), `app/demo/page.tsx` (the entry surface), `app/layout.tsx` (global mount)

---

## Opening Checklist

- [x] Read the W4 spec in full + the Demo Narrative beats
- [x] Read `TourOverlay.tsx` / `tourSteps.ts` / `CurrentUserContext.tsx` / `layout.tsx` — understand the persona-switch primitive + global-mount pattern
- [x] Review Open Questions — none block; the W4 spec's "Open build-time questions" travel with this phase and resolve during the build
- [x] Audit for conflicts — `/demo` was rebuilt in Demo Narrative & Personas W5 (manual beat list); this phase ADDS the guided-mode entry to it, doesn't undo it. `TourOverlay` is dead after the W5 `/demo` rebuild (nothing launches `?tour=`) — safe to delete
- [x] Confirm scope — full build per the W4 spec; user picked "build it all in one push" 2026-05-17

---

> **Stepped-model refinement (2026-05-17, post-initial-build).** The first build was *atomic* — one task per beat, shown whole on the interstitial + card. Changed to *stepped*: each beat is an ordered list of `WalkthroughStep`s; the interstitial is now **scene-only** (no task), and the on-surface card walks the steps one at a time (Prev/Next, crossing into the next beat's interstitial past the last step). `WalkthroughContext` gained `stepIndex`; `nextBeat`/`prevBeat` became step-aware `next`/`prev`; beats gained `startUrl` + `steps[]` (Beat 1 opens on `/discover` so step 1 can be "go to Meets"). The task descriptions below predate this and say "task" where it's now "steps" — the refinement is the current truth. Spec updated in `features/demo-mode.md`; see the walkthrough doc's Decisions log.

## Workstreams

### Workstream A — Beat registry + walkthrough state

| Task | Description | Status |
|------|-------------|--------|
| A1 | `lib/walkthroughBeats.ts` — `WALKTHROUGH_BEATS` registry (4 beats: persona, when, context, task, optional notice, opening URL). Single source of truth — `/demo` imports it too. | done |
| A2 | `contexts/WalkthroughContext.tsx` — `WalkthroughProvider` + `useWalkthrough()`. State: `active`, `beatIndex`, `phase` (`interstitial` / `running`), `paused`. sessionStorage-backed so it survives in-app navigation + reload. Actions: `start`, `continueToBeat`, `nextBeat`, `prevBeat`, `pause`, `resume`, `exit`. `continueToBeat` calls `setUserById` + routes. | done |

### Workstream B — Full-screen interstitial

| Task | Description | Status |
|------|-------------|--------|
| B1 | `components/walkthrough/WalkthroughInterstitial.tsx` — full-screen sheet: eyebrow (Step N of M) + avatar + heading + persona sub-line + context + task prompt + primary "Continue as {name}" + secondary "Pause". Renders when `active && phase === "interstitial"`. Handles the closing interstitial at `beatIndex === BEATS.length`. | done |
| B2 | Interstitial CSS — full-screen overlay, centered sheet (≤520px desktop), entry animation (avatar scale-in + staggered text fade). | done |

### Workstream C — On-surface step card

| Task | Description | Status |
|------|-------------|--------|
| C1 | `components/walkthrough/WalkthroughCard.tsx` — adapted from `TourOverlay`: desktop bottom-left float / mobile bottom accordion, collapsible. Expanded: header (step counter + persona mini-id + collapse caret) + task + optional notice + Prev/Next/Pause/Exit footer. Collapsed: slim pill. Paused: "Resume walkthrough" pill. Renders when `active && phase === "running"`. | done |
| C2 | Card CSS — reuses the existing `.tour-overlay*` classes (proven collapse/float/accordion); minimal additions only. | done |

### Workstream D — Integration + cleanup

| Task | Description | Status |
|------|-------------|--------|
| D1 | `/demo` — add "Start guided walkthrough" entry above the beat list; re-point the manual beat cards at `WALKTHROUGH_BEATS` (drop the duplicate local `BEATS` array). | done |
| D2 | `app/layout.tsx` — wrap in `WalkthroughProvider`; mount `WalkthroughInterstitial` + `WalkthroughCard` globally. | done |
| D3 | Delete dead `components/landing/TourOverlay.tsx` + `lib/tourSteps.ts` + the layout mount — superseded. | done |
| D4 | Typecheck + preview-verify the full flow (start → 4 beats → closing → exit; pause/resume; collapse). | done |

---

## Acceptance Criteria

- [ ] `/demo` has a "Start guided walkthrough" entry; tapping it opens the first interstitial.
- [ ] Each interstitial → "Continue" switches persona + routes to the beat surface + shows the on-surface card.
- [ ] The on-surface card persists across in-app navigation within a beat; collapsible; carries the beat task.
- [ ] Next/Prev move between beats (interstitial each time); Pause drops to Open View with a Resume pill; Exit returns to `/demo`.
- [ ] Closing interstitial fires after beat 4 with "Pick another persona" + "Stay as {persona}".
- [ ] `TourOverlay` + `tourSteps` deleted; no dead references.
- [ ] TypeScript compiles clean.

---

## Closing Checklist

- [ ] Walk every acceptance criterion against the running app
- [ ] Sweep the walkthrough's Decisions log → propagate to home docs
- [ ] Update `features/demo-mode.md` — flip the "Guided Walkthrough" section status from "design only, build deferred" to built; document the shipped components
- [ ] Update ROADMAP.md + CLAUDE.md
- [ ] Archive this phase board + walkthrough
- [ ] Structural audit
- [ ] Strategic review
