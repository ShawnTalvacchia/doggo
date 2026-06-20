---
status: active
last-reviewed: YYYY-MM-DD
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Phase Name — Walkthrough

Verification checklist for the Phase Name phase. **Concise by design** — three priority categories instead of an exhaustive per-workstream checklist. Trust that automated checks + visual sanity passes ran during the build; surface only what's worth the reader's judgment, what risks regression, and what they should glance at to confirm the phase thesis lands.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Walk top-to-bottom — the categories are ordered by "needs your eyeballs most" → "least."

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues. Checkboxes apply to every walkthrough section that asks the reviewer to look at something. The Decisions log at the bottom is a plain log (append-only).

**Available personas:** Tereza (Vinohrady connector), Daniel (anxious new owner, locked profile), Klára (trainer with Care group), Tomáš (Karlín professional), New User.

<!-- Optional context block — phase-specific seed data, dates that matter, persona pet counts, etc. Keep it terse. Drop entirely if not needed. -->

---

## Open for your call

Decisions the author made that warrant a second look — direction, not bug-hunt. These are the calls made during the build instead of stopping to ask — surfaced so the reviewer can ratify or redirect (see `CONTRIBUTING.md` → "During a Phase" → decide-and-flag). Each one should describe a real call the author made that someone else might land differently, and tell the reader the quickest URL/persona path to see it in context.

Identifier prefix: **`O`** (O1, O2, ...). Use these in conversation to point at items.

- [ ] **O1. {One-line framing of the call.}** Why it could go another way. (Persona → `/url` to see it.)
- [ ] **O2. ...**

---

## Worth verifying

Interaction nuance, complex state, persona-switching round-trips, anything author-confidence is genuinely uncertain about. Each item should describe a behavior the reader needs to drive themselves — an automated check or a static screenshot wouldn't have caught it.

**Every check names where to look and what to expect.** Give each item a concrete pointer — persona (`?as=<id>`) + the exact URL — and a one-line *Expect:*. A check the reader can't locate is not a check.

**One check per item — split freely.** If an item bundles two surfaces, two personas, or two behaviours, that's two items, not one. There is no penalty for many small, clearly-pointed items; the penalty is for a fat item that buries three checks behind one URL (or no URL). Group related checks under a sub-heading (`### V1 — {workstream}`) and list each as its own checkbox.

Identifier prefix: **`V`** (V1, V2, ...).

- [ ] **{What this one check proves.}** `{persona via ?as=}` + `{/exact/url}` → tap/do {the one action}. *Expect:* {the single observable result}.
- [ ] **{The next distinct check — its own item, its own URL.}** ...

---

## Surfaces to glance _(usually skip)_

**Only include this section when V can't naturally exercise a shipped surface.** Driving a V item already lands you on the surface, so a separate "glance at it" pass is almost always redundant. Most phases should have 0 G items; some have 1–3 for genuinely glance-only surfaces V can't cover (a styleguide render, a static seeded feed, a print/export view, a CSS-only state that no behavioral test reaches). If you're tempted to write a G item that re-visits a surface V already drove, delete it instead. If this section ends up empty, delete the whole section before shipping.

Identifier prefix: **`G`** (G1, G2, ...).

- [ ] **G1.** {Persona} → `/url` — one-line description of what should be there.

---

## Decisions surfaced during walkthrough

A running **log** (not a checklist) of decisions, design changes, or rationale that surfaced during walkthrough discussion. **Append as you walk** — don't wait until the end. Each entry carries a `→ target-doc.md` annotation indicating where the decision needs to land. The phase-close sweep (per `CONTRIBUTING.md` → "Closing a Phase") processes each entry by propagating it to the named home doc; the entries themselves stay in the archived walkthrough as the historical record of what was decided.

Format:
```
- **{Decision in one line.}** {Optional one-line context.} → `features/foo.md`
- **{Implementation-only change.}** {What/why.} → no feature-doc update needed
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
================================================================================
Authoring conventions — read before writing or expanding this walkthrough.
================================================================================

THE THREE CATEGORIES — what belongs where:

  Open for your call
    Calls the author made where another reasonable person would land
    differently. Magic numbers, semantic compromises, "kept X instead of
    renaming" decisions, V1 stubs (visible-but-no-op affordances), scope
    cuts the reader should ratify or reverse. Lead with the call itself
    so the reader doesn't have to read the rest to know what's being
    asked. If you have zero of these, the category section can be a
    one-line "No open calls — everything landed per spec."

  Worth verifying
    Behaviors that need a human at the keyboard. Multi-step round-trips
    (e.g. "approve in queue A → appears in surface B"), interaction
    nuance (multi-select, long-press, drag), privacy/visibility gates
    that depend on persona context, anything you genuinely couldn't be
    sure of from automated checks. NOT for things that work-or-don't at
    a glance — those go in "Surfaces to glance."

  Surfaces to glance (usually skip)
    Only for shipped surfaces that V can't naturally exercise — a
    styleguide page render, a static seeded feed, a print/export view,
    a CSS-only state no behavioral test reaches. Driving a V item
    already lands the reviewer on the surface, so a separate glance
    item that re-visits the same URL is redundant. Most phases have
    0 G items; some have 1–3. If you wrote one and it overlaps with
    any V, delete it. If the whole section ends up empty, delete the
    section before shipping.

ANTI-PATTERNS the structure exists to fight:

  1. Listing every persona × surface permutation.
     If verifying behavior X with Tereza implies it works with Daniel
     too (same code path, no persona-specific logic), list it once. Use
     "Worth verifying" when the persona switch IS the test.

  2. Spelling out what would naturally be exercised by another item.
     If "B5: tap × to clear" would be done in passing while verifying
     "B4: pill multi-select," don't list B5 separately. Trust the
     reader to clear a pill they just set.

  3. Pure-visual checks dressed up as verification items.
     "Filter row reads light enough that pill borders are visible" is
     either fine (don't list it) or it isn't (fix it, don't ask the
     reader to flag it). The exception: a glance bullet under
     "Surfaces to glance" if the visual choice is worth a second
     opinion.

  4. Decisions buried in workstream items.
     If a verification item contains "we landed on X because Y" framing,
     promote the decision to the Decisions log and shrink the item to
     "verify X behaves correctly." The walkthrough is for the reader's
     use, not for narrating the build's history.

  5. Stale items after mid-build refactors.
     When a code change makes an existing verification item inaccurate,
     edit the item in the same change. Stale items confuse verifiers
     into ticking what they don't see.

  6. Bundled or unpointed checks.
     The two failures we keep regressing into: (a) one item that hides
     several distinct checks behind a single URL — or worse, references
     a second surface ("...then Klára's card") without giving its URL;
     (b) an item with no persona/URL pointer at all, so the reviewer
     can't find what to look at. Fix: one check per item, and every
     item carries persona (?as=) + exact URL + a one-line Expect. Two
     surfaces = two items. More small, well-pointed items always beats
     fewer fat ones.

LENGTH TARGETS (rough — adjust per phase scope):

  - Open for your call: 0–6 items. Often the smallest section.
  - Worth verifying: 4–10 items. The substantive middle.
  - Surfaces to glance: 0–3 items. Often empty — only V-uncoverable surfaces.

  Item COUNT is not the enemy — bundling is. Splitting one fat check
  into three clear, individually-pointed ones is correct even though it
  grows the count; have as many items as the phase genuinely needs. The
  cap to watch is REDUNDANCY: if the extra items are persona×surface
  permutations (anti-pattern 1) or checks another item already exercises
  (anti-pattern 2), cut. Distinct, well-pointed checks: keep them all.

DRIFT RULES — the two failure modes this template fights at phase-close:

  1. Code change → update the walkthrough item in the same edit.
     When you refactor or restyle something the active walkthrough
     already describes, edit the item's description to match the new
     behaviour as part of the same change. Stale walkthrough text is
     worse than no walkthrough.

  2. Decisions are current-state, not an event log.
     If a logged decision gets superseded by a better one (e.g.
     "switched conditions text to amber" became "dropped pill chrome
     entirely"), EDIT the existing entry — don't append a new entry
     alongside the stale one. The section should describe what shipped,
     not the trail of intermediate calls.

     The signal you got this wrong: at phase-close sweep, the same
     surface has multiple Decisions entries with contradictory
     descriptions.
-->
