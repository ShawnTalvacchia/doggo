---
status: active
last-reviewed: YYYY-MM-DD
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Phase Name — Walkthrough

Verification checklist for the Phase Name phase. **This document is for checking, not record-keeping** — decisions, follow-ups, and findings belong in the phase board, Open Questions log, or feature docs.

**Scope rule.** Walkthroughs verify the **phase thesis** — the structural / behavioral change the phase delivered. They are NOT for edge cases, regression checks, cross-persona permutations, or every filter/state combo. Rule of thumb: if you find yourself adding a 5th sub-scenario, or "verify the same thing from the other side," that item goes in `verification-checklist.md` instead. Aim for 8–15 items per workstream — if a workstream is sprawling, split it or trim it.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Available personas:** Tereza (Vinohrady connector), Daniel (anxious new owner, locked profile), Klára (trainer with Care group), Tomáš (Karlín professional), New User.

<!-- Optional context block — phase-specific seed data, dates that matter, persona pet counts, etc. Keep it terse. Drop entirely if not needed. -->

---

## Workstream A — Name

One-line context if helpful.

- [ ] **A1. {Persona} → `{URL}`.** What to verify.
- [ ] **A2. ...**

---

## Workstream B — Name

- [ ] **B1. ...**

<!--
Conventions:
- Each item starts with a bold persona + URL anchor so the reader knows where to go without reading the rest.
- Expected outcomes use sub-bullets when there are multiple things to confirm; one-line item otherwise.
- Use `**bold**` for the things that should match, `*italic*` for trigger notes / explanatory copy.
- DO NOT add "Findings & follow-ups" sections — those belong in the phase board, Open Questions log, or a relevant feature doc. The walkthrough is verification only.
- DO NOT track decisions inline. If the walkthrough surfaces a product call, capture it in the right home doc and update the walkthrough item to reflect the new expected behavior.
-->
