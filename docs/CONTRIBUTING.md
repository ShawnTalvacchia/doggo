---
category: meta
status: active
last-reviewed: 2026-04-10
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
6. **Confirm scope.** If the phase has tasks that feel like they belong in a different phase, or if scope has grown, discuss before starting.

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
4. **Update ROADMAP.md.** Mark the phase complete with a summary of key outcomes.
5. **Review CLAUDE.md.** If the phase changed navigation, key components, or project structure, update the project instructions.
6. **Archive the phase board.** Copy to `archive/phases/`, mark status: archived. (If deletion is blocked, mark the original as archived too.)
7. **Check upcoming phases.** Does the next phase's scope still make sense given what was just built? Flag any conflicts.

**Enforcement:** The closing checklist items must all be checked off before a new phase can be opened. The ROADMAP should show a clear completion summary, not just "done."

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
