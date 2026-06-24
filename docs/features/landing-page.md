---
category: feature
status: active
last-reviewed: 2026-06-24
tags: [landing-page, demo, launcher]
review-trigger: "when the landing-page launcher or unlock gate changes"
---

# Landing Page (`/`)

**Retired 2026-05-19 as a marketing page; reborn as the demo launcher.** The Demo Narrative V2 phase folded `/demo` into the landing page and retired the prior 8-section marketing story (hero → emotional hook → meet types → how it works → archetypes → care → testimonials → bottom CTA). The 2026-05-04 doc that described that page is preserved in git history.

**Files:** `app/page.tsx`, `app/page.css` (walkthrough card/interstitial chrome lives in `app/landing-extra.css`)

## What `/` does now

**Rebuilt for the Multi-Path Demo (2026-06)** into a wide, left-aligned, **single-viewport** launcher (no AppNav, no marketing copy, fits a desktop screen with no scroll; cards stack under ~760px):

1. **Guided walkthroughs** — a **row of door cards**, one per `WALKTHROUGH_LIST` entry (title + blurb): `new-owner`, `trainer`, `shelter`. Tapping a door calls `start(id)` → `clearDemoStorage` (auto-reset) → that walkthrough's first interstitial. (The earlier single "Start the walkthrough" CTA is gone.)
2. **Look around freely** — a secondary bar under "Or explore on your own" that drops into the app as the default persona (Tereza). Persona switching then lives on the profile name dropdown — there are no per-persona cards on the launcher anymore.

## Gating

`proxy.ts` gates **everything**. Public surfaces are exactly:
- the unlock page + its API
- static assets

The landing page itself is behind the unlock gate — a tester arriving at the URL hits the unlock page first, then lands on `/`.

## Why one front door

The launcher *is* the demo's first impression. A marketing splash before it meant a tester opening the demo URL had to bounce off a hero and a how-it-works section before reaching the doors. The launcher-as-landing makes the demo start instantly — pick a walkthrough (or explore) and go.

## Related

- [[demo-mode]] → "Landing page (`/`) — the demo front door" + "Reset behavior" + "Guided Walkthrough — UX design spec"
- `proxy.ts` — the unlock gate
- `lib/demoReset.ts` — `clearDemoStorage` helper (clears `doggo*` keys in both local + session storage)
