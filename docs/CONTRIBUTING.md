---
category: meta
status: active
last-reviewed: 2026-06-25
tags: [rules, workflow, css, conventions]
review-trigger: "always — read before any working session"
---

# Contributing Rules

Rules for humans and agents working in this codebase. Read before building.

---

## Phase Lifecycle

Phases are the unit of work. Every phase follows this lifecycle. **Do not skip steps.**

**Template:** New phases start from `phases/_phase-template.md`, which includes embedded opening and closing checklists. The checklists are part of the board — they get marked done alongside the tasks.

### Opening a Phase

Before writing any code for a new phase, complete the **Opening Checklist** on the phase board:

1. **Read the phase board** in `phases/`. Understand every task and its references.
2. **Read all referenced docs** — strategy, feature, and implementation docs cited by the phase.
3. **Review Open Questions** (`planning/Open Questions & Assumptions Log.md`). Check if any unresolved questions affect this phase. Resolve or flag them before building.
4. **Audit for conflicts.** Compare what the phase proposes against what's currently built. Raise anything that contradicts existing code, strategy docs, or feature docs. Don't assume the phase board is correct — it may have been written before recent changes.
5. **Update stale docs.** If any referenced doc has a `last-reviewed` date older than 2 weeks, review and update it now.
6. **Scan the Punch List and Future Considerations** (`planning/punch-list.md`, `planning/Future Considerations.md`). Check if any open items overlap the new phase's scope — adopt them into the board or note the overlap. If this phase **fires a Future Consideration's trigger**, promote that FC onto the board now rather than building blind to it.
7. **Confirm scope.** If the phase has tasks that feel like they belong in a different phase, or if scope has grown, discuss before starting.

**Enforcement:** The opening checklist items must be checked off on the phase board before the first task moves to `in_progress`. If an agent or human starts building without completing the checklist, stop and finish it first.

### During a Phase

- Work only on tasks from the **current phase board**.
- **Decide-and-flag — bias toward action.** Make reasonable design and implementation calls during the build instead of stopping at every fork to ask. Two things still get raised mid-build:
  - **(a) True blockers** — you can't take the next step and can't unblock yourself.
  - **(b) Scope or strategy shifts** — anything that contradicts the phase board, expands what the phase ships, affects another phase, or touches a paused phase (default for paused phases is "ask first," per "Side Tasks").

  Everything else — token choices, copy variants, mock-data values, component naming, structural picks where multiple answers are reasonable — gets MADE during the build and surfaced as an **"Open for your call"** item on the phase walkthrough. The reviewer ratifies or redirects there. "No feature sprawl" still applies: if the call would EXPAND scope, that's a scope shift and gets raised.

  The walkthrough's "Open for your call" section is the build-time audit trail — it leads the walkthrough because the build-time discipline (decide + flag) and the review-time artifact (ratify or redirect) point at each other.
- When you finish a task, update the phase board status immediately.
- If you change a feature, update its **feature doc** in `features/`.
- If you add/change a component, update **design-system.md**.
- If you add/change a CSS variable, update **design-tokens** AND the `@theme` block.
- If you discover an open question, add it to **Open Questions**.
- If you make a significant product decision, record it in the relevant feature doc under a "Decisions" section.
- **If a code change makes an active walkthrough item's description inaccurate, update the walkthrough item in the same edit.** Stale walkthrough text is worse than no walkthrough — verifiers look for behaviour that's no longer there. See `phases/_walkthrough-template.md` → "Drift rules" for the two recurring failure modes (stale item descriptions + Decisions entries that should have been revised in place rather than appended).

### Walkthrough (the review stage)

**The walkthrough is a main stage of the phase, not a step inside closing.** Once the build is committed, the phase enters a collaborative review: the PO and the agent go through the walkthrough doc **together, point by point.** This is where the bulk of the design refinement happens — building gets a surface ~80% there; the walkthrough gets it right. **Expect many iterations** — most points trigger polish, copy changes, or redirects before they pass. Budget for it; don't rush toward close.

How it runs:

- **The agent prepares the walkthrough doc as it builds** (`phases/<name>-walkthrough.md`, from `_walkthrough-template.md`) — "Open for your call" (O) items, "Worth verifying" (V) items, and an append-only Decisions log. It is ready for review when the build is committed; it is **not** authored from scratch at close.
- **Every checkable item names where to look + what to expect, and holds exactly one check.** Each O/V item carries the exact URL + a one-line expected result. Add `?as=<persona>` **only when who's looking changes what's shown** (edit/self surface, connection-gated or circle-scoped service, viewer-specific default, private profile) — omit it on open, persona-agnostic surfaces. If an item bundles two surfaces or behaviours, split it into two items; there's no penalty for many small, well-pointed items, only for fat, unpointed, or falsely-persona-tagged ones. (Recurring regression — see the template's anti-pattern 6.)
- **The PO drives the review with the agent.** Each O/V point is passed or sent back. Resolved O items get checked + a one-line pointer (full rationale lands in the Decisions log — don't duplicate). Decisions made mid-walk get appended to the Decisions log in the same edit.
- **When a walkthrough change makes an item inaccurate, update the item in the same edit** (template Drift rules). Stale walkthrough text is worse than none.
- **The phase is not ready to close until every O and V point has passed** and the Decisions log reflects what actually shipped.

Closing comes *after* the walkthrough passes, and **consumes** it — the Decisions log is the propagation worklist (see "Closing a Phase," step 2).

### Closing a Phase

These steps are the **canonical closing process — the single source of truth.** Work through them in order. The phase board does **not** repeat them; it carries only **phase-specific** close items under its "Close notes" section (the feature docs this phase touched, outward-facing artifacts to graduate, punch-list items it closes, next-phase dependencies it satisfies). Per-decision doc-propagation targets live in the walkthrough's "Decisions surfaced" log (step 2), not in a second checklist. Do not copy these steps onto the board — that duplication is what drifts.

1. **Confirm the walkthrough passed.** Closing presumes the collaborative Walkthrough stage (above) is complete — every O and V point checked, acceptance criteria holding against the running app. This is a confirmation that the review landed, not a fresh first-time walk.
2. **Sweep the walkthrough's "Decisions surfaced" section.** This is a plain log — not a checklist. Every entry there represents an emergent decision that needs to land in a feature doc (or be explicitly marked "no doc update needed"). Process each one in order: update the named home doc per the `→` annotation, then check it off in the phase board's Closing Checklist (not in the walkthrough itself — the walkthrough entries stay as the historical record). **The walkthrough cannot be archived until every entry has been propagated.** This is the single biggest defense against feature-doc staleness — earlier phases shipped many decisions that never made it home, and this step plugs the gap going forward.
3. **Update all affected feature docs.** Beyond what the Decisions section covers, scan for anything else the phase changed (component patterns, edge cases, copy conventions). The feature docs must reflect the new reality.
4. **Update the Open Questions log.** Close any questions this phase resolved — and **compress each resolved item to a one-line pointer at its home doc** (don't leave multi-paragraph resolved blocks to pile up; the SOT carries the reasoning). Add any new questions that emerged.
5. **Update ROADMAP.md — remove the closed phase, then re-orient forward.** First, take the just-finished phase **off** the roadmap (it's done; the archived board is its record) and refresh the current-phase pointer. Then update the forward view *informed by what this phase built and revealed* — reorder, add, cut, or re-scope upcoming phases so the roadmap reflects current understanding. Keep it strictly **future-focused**: let what we learned shape *where we're going*, but never log *what shipped*. No completion summary, no list of recent closes — the archived board is the record. The Roadmap tracks objectives and what's next, not history.
6. **Review CLAUDE.md.** If the phase changed navigation, key components, or project structure, update the project instructions.
7. **Review the running trackers — Punch List and Future Considerations.** Read completed punch-list items since the last close; check if any fix affected feature docs, design-system.md, or design-tokens.md and update what was missed. Then **prune Future Considerations**: every FC this phase **shipped** is removed (the phase archive is the record — no retained ✅ banner); every FC **partly** shipped is rewritten to lead with the remaining open work; every FC whose **trigger fired** is confirmed promoted out.
8. **Archive the phase board AND walkthrough.** Mark `status: archived` in the frontmatter on both, then `git mv docs/phases/<name>.md docs/archive/phases/` and the same for the walkthrough. Single atomic moves.
9. **Trim pass.** Skim the Roadmap, CLAUDE.md, and touched docs. Cut anything stale, redundant, or duplicated. See Doc Hygiene Rules.
9a. **Structural audit.** Run these three checks — any hits get fixed before phase close:
   - `grep -rl "status: archived\|status: complete" docs/phases/` should return nothing but `_phase-template.md` (never) and legitimately paused phases. Anything else — delete it; the archive copy exists in `docs/archive/phases/`.
   - Compare filenames in `docs/phases/` vs `docs/archive/phases/`. Any overlap means a phase-close cleanup was skipped — delete the live copy.
   - Scan docs in `strategy/`, `features/`, `implementation/` with `last-reviewed` older than 21 days. Review or bump.
10. **Strategic review.** This is the most important step. Stop building and think. Read the Open Questions log, the Roadmap, the relevant strategy and competitive research docs, and the next phase's scope. Then present a brief to the team covering:
   - **What changed.** How does the work just completed shift our understanding of the product? Did building it reveal anything we didn't anticipate?
   - **Open questions worth resolving now.** Which unresolved questions from the log would benefit from research or discussion before the next phase opens? Don't just list them — recommend whether to research, discuss, or defer, and why.
   - **Alternatives and challenges.** Is there anything in the current design, feature set, or direction that deserves reconsideration? Are we overbuilding something? Underbuilding something? Is a competitor doing something that should change our approach? Are there simpler paths we're ignoring?
   - **Research suggestions.** If competitive research, user research, or technical spikes would be valuable before the next phase, say so and describe what to look into.
   - **Next phase readiness.** Does the next phase's scope still make sense? Should anything be added, cut, or reordered?

   This isn't a checkbox — it's a thinking mode. Take the time to do it well. The goal is to surface insights and recommendations, not just confirm that docs are updated.

**Enforcement:** The closing checklist items must all be checked off before a new phase can be opened.

### Side Tasks

Some work doesn't fit a phase board. It's bigger than a punch-list nit, smaller than a phase, and may land between phases or alongside the active one. Spawned tasks (created via the `spawn_task` mechanism in a chat session) typically land here.

**Three sizes of work, decision rule:**

| Size | Where it lives | Touches phase state? |
|------|----------------|---------------------|
| ≤30 min, isolated fix | Punch list (`planning/punch-list.md`) | No |
| ~30 min – few hours, contained scope | Side task (worktree session) | No |
| Multi-task scope, design thinking | Phase (open/close checklist) | Yes |

**A side task should:**
- Have a single, well-defined goal stated in its spawn prompt.
- **Declare the files it expects to touch** in the spawn prompt (Files: list). Lets the user spot overlap with active phase work before spawning.
- **Rebase onto current `main` before completing.** When the work is ready, the worktree agent runs `git rebase main`, resolves any conflicts in the worktree (where it has full context for both sides), then signals ready-to-merge. Conflicts are the side-task agent's problem to solve, not the later merger's.
- **Push to a remote branch and open a PR** rather than only committing locally. The PR is the merge surface. Reviewing and merging on GitHub doesn't require re-entering the chat that produced the work.
- Update any feature docs whose described behavior changed.
- Update `last-reviewed` on docs it touched.

**A side task should NOT:**
- Modify `CLAUDE.md`, `ROADMAP.md`, phase boards, or the Open Questions log.
- Unilaterally resume a paused phase. If the work clearly belongs in a paused phase, ASK the user before starting — they decide whether to formally resume the phase (running its Opening Checklist) or to treat the work as a one-off side task. Default is one-off.
- Sprawl beyond the spawn prompt. If meaningful new scope appears, surface it back to the user — don't expand silently.
- Land work that's stale relative to `main`. If `main` has moved meaningfully since the worktree branched and the side task hasn't rebased, it's likely missing concurrent work that should be integrated. Rebase first.

**Before spawning a side task, check for file-level overlap with active phase work.** If the side task's declared files overlap with files currently being edited in the active phase, either (a) defer the side task until the phase closes, (b) finish the active phase's edits to those files first so the worktree branches from a settled state, or (c) brief the side-task agent in its spawn prompt about the concurrent changes and what to integrate. Today's worst case (Profile Deep Pass spawned during Pricing & Proposals walkthrough — both touching `ProfileServicesTab.tsx`) is exactly the failure mode this rule prevents.

**Promoting a side task to a phase.** If a side task reveals significant additional scope, stop and propose either (a) resuming a relevant paused phase, (b) opening a new phase, or (c) deferring the rest to the punch list. The user picks.

### System Work

Meta-work on the docs and workflow themselves — restructuring a tracker, rewriting these rules, reorganizing the doc tree, editing CLAUDE.md or the Roadmap's *structure*. It isn't building the product, so it isn't a phase; and it's the **inverse of a side task** — where a side task must NOT touch the governance docs, system work exists *to* touch them.

- **Allowed to touch** CLAUDE.md, CONTRIBUTING, ROADMAP structure, the planning trackers' formats, and the doc tree — the very files side tasks are barred from.
- **Done with the user, not mid-phase.** Avoid it during an active phase walkthrough; the doc churn collides with phase edits. Between phases, or as a deliberate detour, is the time.
- **Lands as its own commit** (or PR), described as a system/doc change — never mixed into a product commit.
- **No phase board, no walkthrough.** State the intent, make the change with the user, done. Keep it lean: a system pass should leave the rule-set the same size or smaller, not bigger.

---

## The Planning Trackers

Three running lists in `planning/` hold work that isn't in a phase yet. Each is a different **stance** on not-yet-done work — keep an item in the one that matches its stance, and move it when the stance changes.

| Tracker | Holds | Unit | Default exit |
|---------|-------|------|-------------|
| `punch-list.md` | Known small fixes (≤30 min) | the fix | **Removed** when fixed — the commit is the record |
| `Open Questions & Assumptions Log.md` | Unanswered questions blocking future work | the question | **Compressed** to a one-line pointer when resolved |
| `Future Considerations.md` | Known directions waiting for a trigger | the trigger | **Removed** when shipped (archive is the record), or **promoted** when the trigger fires |

**How work flows between them and into phases:**

- An **Open Question** resolves → it becomes a **Future Consideration** (direction now known, trigger pending), a **punch-list** item (small fix), a **phase** (coordinated work), or just a decision recorded in its home doc.
- A **Future Consideration**'s trigger fires → it **promotes out** to the punch list, a phase board, or feature scope.
- A **punch-list** item grows past ~30 min or sprouts an open design call → it **promotes** to a phase board (or to Open Questions if the open part is a question).
- Any of them, once it's multi-task with real design thinking → opens a **phase**.

**Shared rule — prune on resolve.** None of these is an archive. When an item is done it *leaves* — removed, or compressed to a pointer at its home doc / phase archive. Reassessment is ritualized at phase open (scan for overlap + fired triggers) and phase close (prune shipped, compress resolved). Don't let finished items accumulate behind banners or strikethroughs — that bloat is the thing these rules exist to prevent.

---

## Workflow Rules

### No feature sprawl
- If it's not on the phase board, don't build it without discussion.
- UI tweaks and bug fixes during a phase are fine, but new features require a phase home.

### Task references
- Every task should reference the docs it depends on.
- Before starting a task, **read the referenced docs**. After finishing, **update them if anything changed**.

### Frontmatter maintenance
- Every doc has YAML frontmatter: `status`, `last-reviewed`, `review-trigger`.
- Update `last-reviewed` when you touch a doc.
- Valid statuses: `active` (living doc), `built` (describes shipped feature), `draft` (in progress), `archived`.

---

## CSS & Design System Rules

Full component and pattern reference: `implementation/design-system.md`
Token reference: `implementation/design-tokens.md`

### Tailwind-first authoring (new code)
1. **Use Tailwind utilities** for new components — layout, spacing, typography, colors
2. Utilities reference CSS custom properties via the `@theme` block in `globals.css`
3. **Don't create new CSS classes** for simple patterns (1-3 properties)
4. **Do create CSS classes** for complex patterns: pseudo-elements, animations, multi-state variants (9+ properties), or shared styles used in 3+ places
5. Existing CSS classes coexist with Tailwind — migrate incrementally

### Token-first values
1. **Semantic tokens first** (`--surface-primary`, `--text-secondary`), then primitives. Never raw hex/rgb.
2. If you need a value that doesn't exist as a token, **create the token first**, add it to `@theme` and styleguide, then use it.

### No orphan tokens
- Every CSS variable in `globals.css` must appear in the styleguide
- Dead/unused tokens get removed, not commented out

### Inline style policy
- **Allowed:** Dynamic values (measured widths, transforms from state), one-off demo rendering
- **Avoid:** Static layout, color, spacing, radius, typography, borders in `style={{}}`
- When a static inline style appears in product surfaces, move it to `globals.css` with a semantic class name

### Class naming
- Domain-prefixed: `.explore-*`, `.inbox-*`, `.profile-*`
- Shared primitives: `.btn-*`, `.form-*`, `.card-*`
- Modifiers use `--`: `.btn--primary`, `.card--compact`
- Name by behavior/intent, not by location (e.g. `FilterBody`, not `DiscoverFilterPanel`)

### Accessibility baseline
- Touch targets: 32px minimum, 40px preferred for primary controls
- Color contrast: check against surface backgrounds
- Interactive elements need `:focus-visible` styles
- Semantic HTML before ARIA

### Style migration checklist
When updating existing styles:
1. Replace static inline styles with class-based tokenized CSS
2. Replace hardcoded colors with semantic tokens
3. Check for undefined token references
4. If introducing a compatibility alias, document in `design-tokens.md`

---

## Doc Structure

| Folder | What goes here |
|--------|---------------|
| `strategy/` | Product direction, user models, trust, groups, care, scope |
| `planning/` | Cross-phase running lists that feed scheduling: `Open Questions & Assumptions Log.md`, `Future Considerations.md`, `punch-list.md`, `verification-checklist.md` |
| `features/` | Feature specs — what's built, key decisions, future plans |
| `implementation/` | Technical references, coding standards, component catalog |
| `phases/` | Active phase boards + walkthroughs, plus the `_phase-template.md` / `_walkthrough-template.md` molds. Completed boards → archive. |
| `archive/` | Completed/superseded docs kept for reference |
| root | Meta docs (this file, ROADMAP, CLAUDE.md) |

---

## Doc Hygiene Rules

These prevent the documentation from bloating over time. **Treat these as seriously as the code rules.**

### One home, many references

Every piece of information has exactly one home doc. Other docs reference it — they don't repeat it.

| Information type | Home doc | Other docs should... |
|-----------------|----------|---------------------|
| Product decisions, strategy | `strategy/` docs | Reference: "See Trust & Connection Model.md" |
| What a feature does, how it works | `features/` doc for that feature | Reference: "See features/profiles.md" |
| Competitive research, market insights | `strategy/Competitive Research - *.md` | Reference by name, don't copy action items |
| Phase-specific tasks | Phase board in `phases/` | Not appear in the Roadmap or feature docs |
| Open questions | `Open Questions & Assumptions Log.md` | Not be duplicated in strategy or feature docs |
| Build history, what was shipped | `archive/phases/` | Not be summarized in the Roadmap |

**The test:** If you're writing something and it already exists elsewhere, write a reference instead. If you can't point to where it lives, then this is the home — write it here and reference it from elsewhere.

### The Roadmap is a compass, not a changelog

The Roadmap tracks: where we're going, what phase we're in, what's coming next, and key strategic considerations. It does NOT track: what was built in previous phases (that's `archive/`), detailed task lists (that's phase boards), or current state assessments (that's the phase board + code).

When closing a phase, do NOT add a completion summary to the Roadmap. Take the finished phase off the forward list and archive its board — that IS the record. Do let what the phase built and revealed *re-orient* the forward view (reorder/add/cut/re-scope what's next), but express it as direction, never as a log of what's done.

### When adding new information

Before writing, ask:

1. **Does a home doc already exist for this?** → Add it there, reference from elsewhere.
2. **Am I duplicating something?** → Stop. Write a reference instead.
3. **Am I adding tasks to a strategy doc?** → Tasks belong in phase boards. Strategy docs describe considerations and open questions — when a phase opens, the board pulls from them.
4. **Am I making a doc longer?** → Could I make it shorter instead? Can anything be cut or consolidated?

### Periodic cleanup

At every phase close, in addition to the existing checklist:

- **Trim pass.** Skim the Roadmap, CLAUDE.md, and any docs you touched. Is anything stale, redundant, or duplicated? Cut it.
- **Challenge the product.** Flag anything that feels overcomplicated, underspecified, or inconsistent with the vision. Raise it with the team rather than silently working around it.
- **Question the docs.** Are we maintaining docs nobody reads? Is anything documented in two places? Could two docs merge?
