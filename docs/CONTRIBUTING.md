---
category: meta
status: active
last-reviewed: 2026-03-17
tags: [rules, workflow, css, conventions]
review-trigger: "always — read before any working session"
---

# Contributing Rules

Rules for humans and agents working in this codebase. Read before building.

---

## Workflow Rules

### Phase discipline
- Work only on tasks from the **current phase board** in `phases/`.
- Each phase starts with a **doc review** — read all active docs, update stale ones, raise concerns.
- Each phase ends with a **doc review** — same process, plus archive anything completed.

### Task cards reference docs
- Every task card should list `refs:` with `[[wiki-links]]` to relevant docs.
- Before starting a task, **read the referenced docs**. After finishing, **update them if anything changed**.

### Doc updates
- If you change a component, update [[component-inventory]].
- If you add/change a CSS variable, update [[design-tokens]] AND add it to the styleguide.
- If you make a product decision, log it in the relevant feature doc or create a decision record in `decisions/`.
- If you discover an open question, add it to [[Open Questions]].
- If you build or modify a feature, update its feature doc in `features/`.

### Frontmatter maintenance
- Every doc has YAML frontmatter with `status`, `last-reviewed`, and `review-trigger`.
- When you review a doc, update `last-reviewed` to today's date.
- Valid statuses: `active` (living doc), `stable` (rarely changes), `stale` (needs review), `archived`.

---

## CSS & Design System Rules

### Tailwind-first authoring (new code)
1. **Use Tailwind utilities** for new components and JSX — layout, spacing, typography, colors
2. Utilities reference existing CSS custom properties via the `@theme` block in `globals.css`
3. **Don't create new CSS classes** for simple patterns (1-3 properties). Use utilities inline instead
4. **Do create CSS classes** for complex patterns: pseudo-elements, animations, multi-state variants (9+ properties), or shared component styles used in 3+ places
5. Existing CSS classes coexist with Tailwind — migrate incrementally, not all at once

### Token-first values
1. Use **semantic tokens** first (`--surface-primary`, `--text-secondary`), then primitives (`--neutral-300`). Never raw hex/rgb.
2. Tailwind utilities already map to these tokens: `bg-surface-base`, `text-fg-primary`, `gap-md`, etc.
3. If you need a value that doesn't exist as a token, **create the token first**, add it to the `@theme` block and styleguide, then use it

### No orphan tokens
- Every CSS variable in `globals.css` must appear in the styleguide
- Every component class used in 2+ places should be in the component inventory
- Dead/unused tokens get removed, not commented out

### Class naming (for remaining CSS classes)
- Domain-prefixed: `.explore-*`, `.inbox-*`, `.profile-*`, `.booking-*`
- Shared primitives: `.btn-*`, `.form-*`, `.card-*`
- No generic names like `.container`, `.wrapper`, `.box` without a domain prefix
- Modifiers use `--`: `.btn--primary`, `.card--compact`

### Styleguide parity
- The styleguide is not optional decoration — it's the **source of truth**
- New tokens → styleguide entry + `@theme` mapping in the same PR/session
- New components → component inventory entry + styleguide demo if reusable
- If a token exists in CSS but not in the styleguide, it's a bug

### Accessibility baseline
- Touch targets: 32px minimum
- Color contrast: check against `--surface-primary` and `--surface-secondary` backgrounds
- Interactive elements need `:focus-visible` styles
- Use semantic HTML before reaching for ARIA

---

## Doc Categories

| Folder | What goes here | Examples |
|--------|---------------|----------|
| `strategy/` | Product direction, user models, trust, scope | Product Vision, User Archetypes, Trust & Connection Model, Prototype Scope |
| `features/` | Feature specs — what's built, key decisions, flows, future plans | meets, connections, messaging, explore-and-care, profiles, schedule |
| `decisions/` | Build decisions, trade-off records | chat-design |
| `implementation/` | Technical references, coding standards | design-tokens, frontend-style, component-inventory |
| `phases/` | Phase kanban boards (one per phase) | phase-1-design-system |
| `archive/` | Completed/superseded docs kept for reference | status reports, deprecated strategy docs |
| root | Meta docs (this file, ROADMAP) | CONTRIBUTING, ROADMAP |
