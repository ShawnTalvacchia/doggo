---
category: meta
status: active
last-reviewed: 2026-04-08
tags: [rules, workflow, css, conventions]
review-trigger: "always — read before any working session"
---

# Contributing Rules

Rules for humans and agents working in this codebase. Read before building.

---

## Phase Lifecycle

Phases are the unit of work. Every phase follows this lifecycle. **Do not skip steps.**

### Opening a Phase

Before writing any code for a new phase:

1. **Read the phase board** in `phases/`. Understand every task and its references.
2. **Read all referenced docs** — strategy, feature, and implementation docs cited by the phase.
3. **Review Open Questions** (`strategy/Open Questions & Assumptions Log.md`). Check if any unresolved questions affect this phase. Resolve or flag them before building.
4. **Audit for conflicts.** Compare what the phase proposes against what's currently built. Raise anything that contradicts existing code, strategy docs, or feature docs. Don't assume the phase board is correct — it may have been written before recent changes.
5. **Update stale docs.** If any referenced doc has a `last-reviewed` date older than 2 weeks, review and update it now.
6. **Confirm scope.** If the phase has tasks that feel like they belong in a different phase, or if scope has grown, discuss before starting.

### During a Phase

- Work only on tasks from the **current phase board**.
- When you finish a task, update the phase board status immediately.
- If you change a feature, update its **feature doc** in `features/`.
- If you add/change a component, update **component-inventory**.
- If you add/change a CSS variable, update **design-tokens** AND the `@theme` block.
- If you discover an open question, add it to **Open Questions**.
- If you make a significant product decision, record it in the relevant feature doc under a "Decisions" section.

### Closing a Phase

Before marking a phase complete:

1. **Walk through every acceptance criterion.** Verify each one against the running app, not just the code.
2. **Update all affected feature docs.** If the phase changed how meets, groups, profiles, etc. work, the feature docs must reflect the new reality.
3. **Update the Open Questions log.** Close any questions this phase resolved. Add any new ones that emerged.
4. **Update ROADMAP.md.** Mark the phase complete with a summary of key outcomes.
5. **Review CLAUDE.md.** If the phase changed navigation, key components, or project structure, update the project instructions.
6. **Archive the phase board.** Move the completed phase board to `archive/phases/`.
7. **Check upcoming phases.** Does the next phase's scope still make sense given what was just built? Flag any conflicts.

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

### Class naming
- Domain-prefixed: `.explore-*`, `.inbox-*`, `.profile-*`
- Shared primitives: `.btn-*`, `.form-*`, `.card-*`
- Modifiers use `--`: `.btn--primary`, `.card--compact`

### Accessibility baseline
- Touch targets: 32px minimum
- Color contrast: check against surface backgrounds
- Interactive elements need `:focus-visible` styles
- Semantic HTML before ARIA

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
