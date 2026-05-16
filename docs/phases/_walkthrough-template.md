---
status: active
last-reviewed: YYYY-MM-DD
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Phase Name — Walkthrough

Verification checklist for the Phase Name phase. **This document is primarily for checking** — most decisions, follow-ups, and findings belong in the phase board, Open Questions log, or feature docs. The exception is the **"Decisions surfaced during walkthrough"** section at the bottom, which exists specifically to catch emergent decisions in the moment and ensure they propagate to feature docs at phase close.

**Scope rule.** Walkthroughs verify the **phase thesis** — the structural / behavioral change the phase delivered. They are NOT for edge cases, regression checks, cross-persona permutations, or every filter/state combo. Rule of thumb: if you find yourself adding a 5th sub-scenario, or "verify the same thing from the other side," that item goes in `verification-checklist.md` instead. Aim for 8–15 items per workstream — if a workstream is sprawling, split it or trim it.

**Structure rule.** Top of each workstream is verification items only — persona + URL + what to look for. Pre-loaded phase scope can have a short framing preamble if it helps the tester know what to expect ("here's what was seeded; here's what should be visible"). Emergent decisions from walkthrough discussion DO NOT belong inside workstream items or as workstream preambles — they go in the **"Decisions surfaced during walkthrough"** log at the bottom. If a discussion produces a code/design change mid-walk, update the affected verification item to describe the new behavior, and log the *why* in the bottom section.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues. Checkboxes apply to verification items only — the Decisions section at the bottom is a plain log.

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

---

## Decisions surfaced during walkthrough

A running **log** (not a checklist) of decisions, design changes, or rationale that surfaced during walkthrough discussion. **Append as you walk** — don't wait until the end. Each entry carries a `→ target-doc.md` annotation indicating where the decision needs to land. The phase-close sweep (per `CONTRIBUTING.md` → "Closing a Phase") processes each entry by propagating it to the named home doc; the entries themselves stay in the archived walkthrough as the historical record of what was decided.

Format:
```
- **{Decision in one line.}** {Optional one-line context.} → `features/foo.md`
- **{Implementation-only change}** {What/why.} → no feature-doc update needed
```

Examples of what belongs here:
- A behavior was changed during the walkthrough (e.g. "added a 5-day recency window to X")
- A design pattern shifted (e.g. "moved the Y CTA from card-bottom to top banner")
- Mock data assumptions changed (e.g. "kd-5 dates moved from fixed to relative")
- An implementation gap was fixed in a way that warrants documentation (e.g. "demo reset now also clears the in-memory cache")

Examples of what does NOT belong here:
- Walkthrough wording fixes (just update the item)
- Bug fixes with no behavior change worth documenting (just commit + move on)
- Decisions captured elsewhere (phase board, Open Questions, punch list)

<!--
Conventions:
- Each verification item starts with a bold persona + URL anchor so the reader knows where to go without reading the rest.
- Expected outcomes use sub-bullets when there are multiple things to confirm; one-line item otherwise.
- Use `**bold**` for the things that should match, `*italic*` for trigger notes / explanatory copy.
- DO NOT add "Findings & follow-ups" sections to individual workstreams — those belong in the phase board, Open Questions log, or a relevant feature doc. Workstreams are verification-only. The Decisions section above is the ONE place where emergent stuff is captured inline.

Drift rules — the two failure modes this template is fighting:

1. **Code change → update the walkthrough item in the same edit.** When you refactor or restyle something the active walkthrough already describes, edit the item's description to match the new behaviour as part of the same change. Stale walkthrough text is worse than no walkthrough — verifiers look for what isn't there, get confused, and either tick items that don't match what they see or stall mid-walk. Rule of thumb: if a code change would make an existing walkthrough item's description inaccurate, the walkthrough edit is part of finishing that code change.

2. **Decisions are current-state, not an event log.** If a decision logged in "Decisions surfaced" gets superseded by a better one as the work evolves (e.g. "switched conditions text to amber" became "dropped pill chrome entirely, conditions is body copy now"), **edit the existing entry** to describe the final landing — don't append a new entry alongside the stale one. The section should describe what shipped, not the trail of intermediate calls.

   The signal you got this wrong: at phase-close sweep, the same surface has multiple Decisions entries with contradictory descriptions.
-->
