---
category: meta
status: active
last-reviewed: 2026-04-15
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
3. **Review Open Questions** (`strategy/Open Questions & Assumptions Log.md`). Check if any unresolved questions affect this phase. Resolve or flag them before building.
4. **Audit for conflicts.** Compare what the phase proposes against what's currently built. Raise anything that contradicts existing code, strategy docs, or feature docs. Don't assume the phase board is correct — it may have been written before recent changes.
5. **Update stale docs.** If any referenced doc has a `last-reviewed` date older than 2 weeks, review and update it now.
6. **Scan the Punch List** (`phases/punch-list.md`). Check if any open items overlap with the new phase's scope — adopt them into the phase board or note the overlap.
7. **Confirm scope.** If the phase has tasks that feel like they belong in a different phase, or if scope has grown, discuss before starting.

**Enforcement:** The opening checklist items must be checked off on the phase board before the first task moves to `in_progress`. If an agent or human starts building without completing the checklist, stop and finish it first.

### During a Phase

- Work only on tasks from the **current phase board**.
- When you finish a task, update the phase board status immediately.
- If you change a feature, update its **feature doc** in `features/`.
- If you add/change a component, update **component-inventory**.
- If you add/change a CSS variable, update **design-tokens** AND the `@theme` block.
- If you discover an open question, add it to **Open Questions**.
- If you make a significant product decision, record it in the relevant feature doc under a "Decisions" section.

### Closing a Phase

Before marking a phase complete, work through the **Closing Checklist** on the phase board:

1. **Walk through every acceptance criterion.** Verify each one against the running app, not just the code.
2. **Update all affected feature docs.** If the phase changed how meets, groups, profiles, etc. work, the feature docs must reflect the new reality.
3. **Update the Open Questions log.** Close any questions this phase resolved. Add any new ones that emerged.
4. **Update ROADMAP.md.** Move the completed phase out of "Current Phase." Do NOT add a completion summary — the archived phase board is the record.
5. **Review CLAUDE.md.** If the phase changed navigation, key components, or project structure, update the project instructions.
6. **Review Punch List changes.** Read completed items and change reports in `phases/punch-list.md` since the last phase close. Check if any completed fixes affected feature docs, design-system.md, or design-tokens.md — update anything that was missed.
7. **Archive the phase board.** Copy to `archive/phases/`, mark status: archived. (If deletion is blocked, mark the original as archived too.)
8. **Trim pass.** Skim the Roadmap, CLAUDE.md, and touched docs. Cut anything stale, redundant, or duplicated. See Doc Hygiene Rules.
9. **Strategic review.** This is the most important step. Stop building and think. Read the Open Questions log, the Roadmap, the relevant strategy and competitive research docs, and the next phase's scope. Then present a brief to the team covering:
   - **What changed.** How does the work just completed shift our understanding of the product? Did building it reveal anything we didn't anticipate?
   - **Open questions worth resolving now.** Which unresolved questions from the log would benefit from research or discussion before the next phase opens? Don't just list them — recommend whether to research, discuss, or defer, and why.
   - **Alternatives and challenges.** Is there anything in the current design, feature set, or direction that deserves reconsideration? Are we overbuilding something? Underbuilding something? Is a competitor doing something that should change our approach? Are there simpler paths we're ignoring?
   - **Research suggestions.** If competitive research, user research, or technical spikes would be valuable before the next phase, say so and describe what to look into.
   - **Next phase readiness.** Does the next phase's scope still make sense? Should anything be added, cut, or reordered?

   This isn't a checkbox — it's a thinking mode. Take the time to do it well. The goal is to surface insights and recommendations, not just confirm that docs are updated.

**Enforcement:** The closing checklist items must all be checked off before a new phase can be opened.

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
| `features/` | Feature specs — what's built, key decisions, future plans |
| `implementation/` | Technical references, coding standards, component catalog |
| `phases/` | Active phase boards only (completed boards → archive) |
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

When closing a phase, do NOT add a completion summary to the Roadmap. Archive the phase board — that IS the record.

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
