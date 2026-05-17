---
status: active
last-reviewed: 2026-05-17
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Guided Walkthrough Build — Walkthrough

Verification checklist for the Guided Walkthrough Build phase. Live-verify on the running app (`npm run dev`, port 3000).

**Pre-walkthrough reset.** `/demo` → "Reset demo state" first, so cached state doesn't mask the flow.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues. The Decisions log at the bottom is a plain log, not a checklist.

---

## Workstream A — Beat registry + state

- [ ] **A1. Beats registry is the single source.** `lib/walkthroughBeats.ts` exports `WALKTHROUGH_BEATS` (4 beats). `/demo`'s manual beat cards render from it — no duplicate `BEATS` array remains in `app/demo/page.tsx`.
- [ ] **A2. Walkthrough state survives navigation + reload.** Start the walkthrough, advance a beat, navigate via an in-app link, then reload — the walkthrough is still active on the same beat (sessionStorage-backed).

## Workstream B — Interstitial

The interstitial is **scene-only** — it names the persona + situation and does NOT list the task (stepped-model decision, 2026-05-17). The task lives on the on-surface card.

- [ ] **B1. Start → first interstitial.** `/demo` → "Start guided walkthrough" → full-screen interstitial: "**Beat 1 of 4** · Saturday morning", Daniel's avatar, "You're now Daniel", archetype sub-line, situational context. **No task box.** "Continue as Daniel" primary + "Pause walkthrough" secondary.
- [ ] **B2. Continue switches persona + routes.** Tap "Continue as Daniel" → interstitial dismisses, persona is Daniel, lands on **`/discover`** (the beat's `startUrl` — the demo opens on the Discover hub, and step 1 asks the tester to go to Meets), the on-surface card is present on step 1.
- [ ] **B3. Each beat's interstitial is correct.** Advance through beats 2–4 — each interstitial names the right persona (Klára → Magda → Lena), the "Beat N of 4" counter increments, context matches `Demo Narrative.md`. No task listed.
- [ ] **B4. Closing interstitial.** After beat 4's last step, advancing fires the closing interstitial: "End of walkthrough", "Pick another persona" (→ `/demo`) + "Stay as Lena" (dismiss, stay).

## Workstream C — On-surface step card (stepped)

Each beat is a sequence of steps; the card shows one at a time and advances on Next.

- [ ] **C1. Card walks the beat's steps.** During a beat the card shows the persona mini-identity + "**Step N of M**" (within the current beat) + the current step's instruction + optional detail + Prev/Next. Beat 1 has 4 steps, beats 2 + 3 have 3, beat 4 has 2.
- [ ] **C2. Card persists across in-app navigation.** Within a beat, navigate the app yourself (the steps ask you to — e.g. "tap into Meets") — the card stays present on every destination surface, still showing the current step.
- [ ] **C3. Collapse / expand.** Tap the collapse caret → card shrinks to a slim pill (step counter + expand + ✕). Page beneath fully usable. Expand → full card back. The card **auto-expands** on every step change.
- [ ] **C4. Desktop + mobile placement.** Desktop: bottom-left floating card. Mobile (≤600px): full-width bottom sheet.
- [ ] **C5. Next / Prev step-aware.** Next advances one step within the beat; past the last step → next beat's interstitial. Prev steps back; from a beat's first step → re-opens the previous beat's interstitial. On the last step of beat 4, Next reads "Finish".

## Workstream D — Integration + cleanup

- [ ] **D1. Pause → Resume.** Pause (card ✕ collapsed, or expanded-card Pause) → drops to Open View on the current persona, card becomes a "Resume walkthrough" pill. Resume → card re-expands on the paused beat.
- [ ] **D2. Exit.** Exit (expanded-card footer) → walkthrough ends, returns to `/demo`. No Resume pill.
- [ ] **D3. No dead tour code.** `components/landing/TourOverlay.tsx` + `lib/tourSteps.ts` are deleted; `app/layout.tsx` no longer mounts `TourOverlay`; no broken imports. `npx tsc --noEmit` clean.
- [ ] **D4. Open View untouched.** `/demo` "Or explore freely" pills still work; `?as=` + profile dropdown still switch personas with no walkthrough chrome appearing.

---

## Decisions surfaced during walkthrough

A running log of emergent decisions. Each entry carries a `→ target-doc.md` annotation; propagated to home docs at phase close.

- **Stepped beats, not atomic (2026-05-17).** The first build had one task per beat shown whole. Changed to stepped: each beat is an ordered `WalkthroughStep[]`; the interstitial is scene-only (task removed), the on-surface card walks one step at a time with Prev/Next. Also: beats gained `startUrl` (Beat 1 opens on `/discover` so step 1 can be "tap into Meets"); `WalkthroughContext` gained `stepIndex` + step-aware `next`/`prev`. Lets each step carry focused context and guide more precisely. → `features/demo-mode.md` ("Guided Walkthrough" spec — interstitial layout, on-surface card, atomic-vs-stepped question all updated); `lib/walkthroughBeats.ts` shape

<!-- Append entries as you walk. -->
