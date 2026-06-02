---
category: feature
status: active
last-reviewed: 2026-06-01
tags: [landing-page, demo, launcher]
review-trigger: "when the landing-page launcher or unlock gate changes"
---

# Landing Page (`/`)

**Retired 2026-05-19 as a marketing page; reborn as the demo launcher.** The Demo Narrative V2 phase folded `/demo` into the landing page and retired the prior 8-section marketing story (hero → emotional hook → meet types → how it works → archetypes → care → testimonials → bottom CTA). The 2026-05-04 doc that described that page is preserved in git history.

**Files:** `app/page.tsx`, `app/landing.css`

## What `/` does now

A slim, chrome-free demo launcher — the new brand logo (`public/logo.svg`), no AppNav, no marketing copy. Two paths:

1. **Start the walkthrough** (primary) — auto-resets demo state via `clearDemoStorage` and launches the V2 Guided Walkthrough at Beat 1's interstitial.
2. **Explore freely** (secondary) — persona picker (all 7 personas). Picking writes to localStorage and routes to `/home`; ends any active walkthrough.

## Gating

`proxy.ts` gates **everything**. Public surfaces are exactly:
- the unlock page + its API
- static assets

The landing page itself is behind the unlock gate — a tester arriving at the URL hits the unlock page first, then lands on `/`.

## Why one front door

The walkthrough *is* the demo's first impression. A marketing splash before the launcher meant a tester opening the demo URL had to bounce off a hero and a how-it-works section before reaching the picker. Folding the picker into the landing page makes the demo start instantly — no extra click, no extra read.

## Related

- [[demo-mode]] → "Landing page (`/`) — the demo front door" + "Reset behavior" + "Guided Walkthrough — UX design spec"
- `proxy.ts` — the unlock gate
- `lib/demoReset.ts` — `clearDemoStorage` helper (clears `doggo*` keys in both local + session storage)
