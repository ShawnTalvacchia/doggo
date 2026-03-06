# Frontend Styling Rules

This document defines how styling should be authored and reviewed in this repo.

## Token usage order

1. Use semantic tokens first (for example `--text-secondary`, `--surface-popout`).
2. Use primitive tokens only when introducing a new semantic alias.
3. Avoid raw hex/rgb values in app and component code unless they come from external brand assets (for example third-party logos).

## Inline style policy

- Allowed:
  - Dynamic values that are hard to express with classes (for example measured widths, transform from state).
  - One-off demo-only rendering inside styleguide examples.
- Avoid:
  - Static layout, color, spacing, radius, typography, and borders in `style={{...}}`.
  - Repeating the same inline declaration in multiple files.
- When a static inline style appears in product surfaces, move it to `app/globals.css` (or a dedicated module if introduced later) using semantic class names.

## Class naming conventions

- Use domain-prefixed class names for shared UI surfaces:
  - `explore-*` for explore experience.
  - `profile-*` for provider profile.
  - `signup-*` for sign-up flow.
  - `sg-*` for styleguide-only UI.
- Use modifiers for variants and state:
  - `block--variant` and `block--state` for stable variants.
  - `block active` for short-lived interaction state where already established in the codebase.

## Accessibility and consistency guardrails

- Keep interactive targets at least 32px tall; 40px preferred for primary controls.
- Preserve focus visibility; do not remove focus styles without replacement.
- Prefer tokenized typography scale over ad-hoc numeric font sizes.

## Shared control components (required)

- Prefer shared UI controls over ad-hoc markup in pages.
- Current control primitives:
  - `MultiSelectSegmentBar` for joined multi-select segmented buttons.
  - `RangeSlider` for single-value slider with left-to-right active fill.
  - `DualRangeSlider` for min/max range slider.
  - `CheckboxRow` for compact inline label + checkbox rows.
  - `CheckOptionRow` for full-width option rows with trailing check affordance.
- Do not create location-based component names (for example `*-filter-panel-*`). Name by behavior and intent.
- Styleguide demos must reference these shared components directly.

## Migration checklist for style updates

- Replace static inline style with class-based tokenized CSS.
- Replace hardcoded colors with semantic tokens.
- Check for undefined token references before merging.
- If introducing a compatibility alias, document it in `docs/design-tokens.md`.
