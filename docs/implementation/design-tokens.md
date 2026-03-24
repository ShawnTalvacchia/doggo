---
category: implementation
status: active
last-reviewed: 2026-03-16
tags: [tokens, css, figma, design-system]
review-trigger: "when adding or changing CSS variables"
---

# Design Tokens — Figma → CSS Mapping

Figma file: [Doggo](https://www.figma.com/design/nPApYGJkh8muUqw60nLPxs/Doggo)
Last synced: **2026-03-02**

All values in `app/globals.css` are now synced to Figma. Do not hand-edit primitive values — pull from Figma and update `globals.css` instead.

---

## Naming conventions

| Layer     | Figma prefix | CSS prefix     | Notes                                            |
| --------- | ------------ | -------------- | ------------------------------------------------ |
| Primitive | `_Brand/600` | `--brand-600`  | Raw values, don't use in components              |
| Semantic  | `Brand/Main` | `--brand-main` | Aliases into primitives, use these in components |

---

## Primitive Tokens

### \_Neutral

| Figma step | CSS variable      | Value     |
| ---------- | ----------------- | --------- |
| White      | `--neutral-white` | `#ffffff` |
| 12         | `--neutral-12`    | `#fcfcfc` |
| 25         | `--neutral-25`    | `#F8F8F8` |
| 50         | `--neutral-50`    | `#F4F4F4` |
| 100        | `--neutral-100`   | `#e5e5e5` |
| 150        | `--neutral-150`   | `#d8d8d8` |
| 200        | `--neutral-200`   | `#cbcbcb` |
| 300        | `--neutral-300`   | `#b0b2b2` |
| 400        | `--neutral-400`   | `#969898` |
| 500        | `--neutral-500`   | `#656666` |
| _(no 600)_ | —                 | —         |
| 700        | `--neutral-700`   | `#4a4c4c` |
| 800        | `--neutral-800`   | `#323232` |
| 850        | `--neutral-850`   | `#252626` |
| 900        | `--neutral-900`   | `#191919` |
| 950        | `--neutral-950`   | `#0c0d0d` |
| Black      | `--neutral-black` | `#000000` |

### \_Brand

| Figma step | CSS variable  | Value     |
| ---------- | ------------- | --------- |
| 4          | `--brand-4`   | `#fbffff` |
| 12         | `--brand-12`  | `#e5f4f4` |
| 25         | `--brand-25`  | `#c4f4f1` |
| 50         | `--brand-50`  | `#b1f3f0` |
| 100        | `--brand-100` | `#89e6e0` |
| 150        | `--brand-150` | `#78d9d4` |
| 200        | `--brand-200` | `#67cdc7` |
| 300        | `--brand-300` | `#44b4ad` |
| 400        | `--brand-400` | `#229b94` |
| 500        | `--brand-500` | `#00827a` |
| 600        | `--brand-600` | `#006862` |
| 700        | `--brand-700` | `#004e49` |
| 800        | `--brand-800` | `#003431` |
| 900        | `--brand-900` | `#001716` |
| 950        | `--brand-950` | `#001513` |

### \_Status (Success / Warning / Error / Info)

Each status colour has steps: 25, 50, 100, 300, 500, 600, 850.
CSS pattern: `--{status}-{step}` e.g. `--success-500`, `--error-25`.

| Figma                | CSS             | Value     |
| -------------------- | --------------- | --------- |
| \_Status/Success/25  | `--success-25`  | `#defff1` |
| \_Status/Success/500 | `--success-500` | `#069d5c` |
| \_Status/Success/600 | `--success-600` | `#057e4a` |
| \_Status/Warning/25  | `--warning-25`  | `#fff7e1` |
| \_Status/Warning/500 | `--warning-500` | `#ffc936` |
| \_Status/Warning/600 | `--warning-600` | `#deab26` |
| \_Status/Error/25    | `--error-25`    | `#fcedec` |
| \_Status/Error/500   | `--error-500`   | `#e2473c` |
| \_Status/Error/600   | `--error-600`   | `#b53930` |
| \_Status/Info/25     | `--info-25`     | `#eff2fc` |
| \_Status/Info/500    | `--info-500`    | `#607ae1` |
| \_Status/Info/600    | `--info-600`    | `#4e63b8` |

### \_Transparent

Base colours: Dark = `#000000`, Light = `#ffffff`, Gray = `#ededed`
Steps: 0, 4, 8, 16, 24, 32, 40, 64, 80 (as opacity %)
CSS pattern: `--transparent-{dark|light|gray}-{step}`

---

## Semantic Tokens

### Surface

| Figma                | CSS                      | Resolves to                 |
| -------------------- | ------------------------ | --------------------------- |
| Surface/Top          | `--surface-top`          | `--neutral-white` `#ffffff` |
| Surface/Popout       | `--surface-popout`       | `--neutral-12` `#fcfcfc`    |
| Surface/Base         | `--surface-base`         | `--neutral-25` `#F8F8F8`    |
| Surface/Inset        | `--surface-inset`        | `--neutral-50` `#F4F4F4`    |
| Surface/Gray         | `--surface-gray`         | `--neutral-200` `#cbcbcb`   |
| Surface/Disabled     | `--surface-disabled`     | `--neutral-300` `#b0b2b2`   |
| Surface/Base-inverse | `--surface-base-inverse` | `--neutral-800` `#323232`   |
| Surface/Neutral-dark | `--surface-neutral-dark` | `--neutral-900` `#191919`   |

### Brand

| Figma        | CSS              | Resolves to             |
| ------------ | ---------------- | ----------------------- |
| Brand/Faint  | `--brand-faint`  | `--brand-4` `#fbffff`   |
| Brand/Subtle | `--brand-subtle` | `--brand-12` `#e5f4f4`  |
| Brand/Light  | `--brand-light`  | `--brand-400` `#229b94` |
| Brand/Main   | `--brand-main`   | `--brand-600` `#006862` |
| Brand/Strong | `--brand-strong` | `--brand-700` `#004e49` |

### Text

| Figma          | CSS                | Resolves to                 |
| -------------- | ------------------ | --------------------------- |
| Text/Primary   | `--text-primary`   | `--neutral-850` `#252626`   |
| Text/Secondary | `--text-secondary` | `--neutral-700` `#4a4c4c`   |
| Text/Tertiary  | `--text-tertiary`  | `--neutral-500` `#656666`   |
| Text/Light     | `--text-light`     | `--neutral-300` `#b0b2b2`   |
| Text/Inverse   | `--text-inverse`   | `--neutral-12` `#fcfcfc`    |
| Text/White     | `--text-white`     | `--neutral-white` `#ffffff` |
| Text/Black     | `--text-black`     | `--neutral-950` `#0c0d0d`   |

### Border (colour)

| Figma            | CSS                  | Resolves to               |
| ---------------- | -------------------- | ------------------------- |
| Border/Lightest  | `--border-lightest`  | `--neutral-white`         |
| Border/Light     | `--border-light`     | `--neutral-25`            |
| Border/Regular   | `--border-regular`   | `--neutral-50` `#F4F4F4`  |
| Border/Strong    | `--border-strong`    | `--neutral-100` `#e5e5e5` |
| Border/Stronger  | `--border-stronger`  | `--neutral-150` `#d8d8d8` |
| Border/Strongest | `--border-strongest` | `--neutral-400` `#969898` |

### Border (width)

| Figma      | CSS                  | Value |
| ---------- | -------------------- | ----- |
| Border/REG | `--border-width-reg` | `1px` |
| Border/LG  | `--border-width-lg`  | `2px` |
| Border/XL  | `--border-width-xl`  | `3px` |
| Border/XXL | `--border-width-xxl` | `4px` |

### Interaction

| Figma                     | CSS                           | Resolves to              |
| ------------------------- | ----------------------------- | ------------------------ |
| Interaction/Hover/Lighten | `--interaction-hover-lighten` | `--transparent-light-16` |
| Interaction/Hover/Darken  | `--interaction-hover-darken`  | `--transparent-dark-8`   |
| Interaction/Hover/Subtle  | `--interaction-hover-subtle`  | `--transparent-dark-4`   |

### Status (semantic)

| Figma                           | CSS                       | Value                   |
| ------------------------------- | ------------------------- | ----------------------- |
| Status/Success/light            | `--status-success-light`  | `#defff1`               |
| Status/Success/main             | `--status-success-main`   | `#069d5c`               |
| Status/Success/strong           | `--status-success-strong` | `#057e4a`               |
| Status/Warning/light            | `--status-warning-light`  | `#fff7e1`               |
| Status/Warning/main             | `--status-warning-main`   | `#ffc936`               |
| Status/Warning/strong           | `--status-warning-strong` | `#deab26`               |
| Status/Error/light              | `--status-error-light`    | `#fcedec`               |
| Status/Error/main               | `--status-error-main`     | `#e2473c`               |
| Status/Error/strong             | `--status-error-strong`   | `#b53930`               |
| Status/Error/surface _(compat)_ | `--status-error-surface`  | `--status-error-light`  |
| Status/Error/border _(compat)_  | `--status-error-border`   | `--status-error-main`   |
| Status/Error/text _(compat)_    | `--status-error-text`     | `--status-error-strong` |
| Status/Info/light               | `--status-info-light`     | `#eff2fc`               |
| Status/Info/main                | `--status-info-main`      | `#607ae1`               |
| Status/Info/strong              | `--status-info-strong`    | `#4e63b8`               |

---

## Radius

| Figma                  | CSS               | Value             |
| ---------------------- | ----------------- | ----------------- |
| Radius/None            | `--radius-none`   | `0px`             |
| Radius/Tiny            | `--radius-tiny`   | `2px`             |
| Radius/XXS             | `--radius-xxs`    | `4px`             |
| Radius/XS              | `--radius-xs`     | `6px`             |
| Radius/SM              | `--radius-sm`     | `8px`             |
| Radius/MD              | `--radius-md`     | `12px`            |
| Radius/LG              | `--radius-lg`     | `16px`            |
| Radius/XL              | `--radius-xl`     | `24px`            |
| Radius/Circle          | `--radius-circle` | `9999px`          |
| Radius/Full _(compat)_ | `--radius-full`   | `--radius-circle` |

---

## Spacing

| Figma           | CSS               | Value  |
| --------------- | ----------------- | ------ |
| Spacing/Tiny    | `--space-tiny`    | `2px`  |
| Spacing/XS      | `--space-xs`      | `6px`  |
| Spacing/SM      | `--space-sm`      | `8px`  |
| Spacing/MD      | `--space-md`      | `12px` |
| Spacing/LG      | `--space-lg`      | `16px` |
| Spacing/XL      | `--space-xl`      | `20px` |
| Spacing/XXL     | `--space-xxl`     | `24px` |
| Spacing/XXXL    | `--space-xxxl`    | `32px` |
| Spacing/Jumbo-1 | `--space-jumbo-1` | `40px` |
| Spacing/Jumbo-2 | `--space-jumbo-2` | `64px` |
| Spacing/Jumbo-3 | `--space-jumbo-3` | `80px` |

---

## Typography

### Families & weights

| Figma                         | CSS                  | Value                     |
| ----------------------------- | -------------------- | ------------------------- |
| Font/Family/Heading           | `--font-heading`     | `'Poppins', sans-serif`   |
| Font/Family/Body              | `--font-body`        | `'Open Sans', sans-serif` |
| Font/Weight/Light             | `--weight-light`     | `300`                     |
| Font/Weight/Regular           | `--weight-regular`   | `400`                     |
| Font/Weight/Medium _(compat)_ | `--weight-medium`    | `500`                     |
| Font/Weight/SemiBold          | `--weight-semibold`  | `600`                     |
| Font/Weight/Bold              | `--weight-bold`      | `700`                     |
| Font/Weight/ExtraBold         | `--weight-extrabold` | `800`                     |

### Heading sizes (desktop / mobile)

| Figma                      | CSS                    | Desktop | Mobile |
| -------------------------- | ---------------------- | ------- | ------ |
| Font Size/Heading/1        | `--font-size-h1`       | `48px`  | `32px` |
| Font Size/Heading/2        | `--font-size-h2`       | `32px`  | `24px` |
| Font Size/Heading/3        | `--font-size-h3`       | `24px`  | `20px` |
| Font Size/Heading/4        | `--font-size-h4`       | `20px`  | `18px` |
| Font Size/Heading/5        | `--font-size-h5`       | `18px`  | `16px` |
| Font Size/Heading/Tagline  | `--font-size-tagline`  | `16px`  | `14px` |
| Font Size/Heading/Calendar | `--font-size-calendar` | `16px`  | `13px` |

### Body sizes (desktop / mobile)

| Figma              | CSS                    | Desktop | Mobile |
| ------------------ | ---------------------- | ------- | ------ |
| Font Size/Body/XXL | `--font-size-body-xxl` | `32px`  | `28px` |
| Font Size/Body/XL  | `--font-size-body-xl`  | `24px`  | `20px` |
| Font Size/Body/LG  | `--font-size-body-lg`  | `18px`  | `16px` |
| Font Size/Body/MD  | `--font-size-body-md`  | `16px`  | `15px` |
| Font Size/Body/REG | `--font-size-body-reg` | `14px`  | `14px` |
| Font Size/Sub _(code-only)_ | `--font-size-sub` | `13px`  | `13px` |
| Font Size/Body/SM  | `--font-size-body-sm`  | `12px`  | `12px` |
| Font Size/Fine _(code-only)_ | `--font-size-fine` | `11px`  | `11px` |
| Font Size/Body/XS  | `--font-size-body-xs`  | `10px`  | `10px` |

Mobile overrides are set inside the `@media (max-width: 767px)` block in `globals.css` — they override the CSS custom properties, so any component using `var(--font-size-h1)` etc. automatically gets the correct responsive value.

---

## Convenience Aliases (code-only)

These are shorthand tokens defined in CSS for common patterns. They don't have Figma counterparts.

| CSS token | Maps to | Usage |
| --------- | ------- | ----- |
| `--surface-page` | `--surface-top` | Nav bars, sticky headers |
| `--surface-hover` | `--interaction-hover-darken` | Subtle hover on light surfaces |
| `--border-subtle` | `--border-strong` | Light dividers |
| `--border-default` | `--border-stronger` | Standard visible borders |
| `--text-muted` | `--text-tertiary` | De-emphasised text |
| `--success` | `--status-success-main` | Legacy shorthand |
| `--error` | `--status-error-main` | Legacy shorthand |

## Layout Tokens (code-only)

| CSS token | Value | Usage |
| --------- | ----- | ----- |
| `--nav-height` | `65px` (desktop) / `56px` (mobile) | Top nav height, sticky offsets |
| `--app-page-max-width` | `768px` | Max content width |

---

## Styleguide coverage

All tokens above are now surfaced in `/styleguide/tokens` and `/styleguide/typography`. If you add a new token to `globals.css`, add it to the styleguide in the same session — see [[CONTRIBUTING]] for rules.

---

## Open questions / known gaps

- `_Neutral/600` does not exist in Figma (scale jumps 500 → 700). Add if a mid-dark neutral step is needed.
- Shadows are not defined as Figma variables — values in CSS are design judgement, should be confirmed against Figma components.
- `Surface/Disabled` not confirmed from Figma variable panel — currently set to `--neutral-300` (`#b0b2b2`), which matches the visible Figma semantic colour swatch.
- `--font-size-fine` (11px) and `--font-size-sub` (13px) are code-only — confirm if they should become Figma variables.
