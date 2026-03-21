---
category: decisions
status: stale
last-reviewed: 2026-03-16
tags: [prototype, technical, scope]
review-trigger: "when revisiting prototype scope or adding routes"
---

# Doggo Prototype Decisions

> [!warning] Stale — partially superseded
> Some decisions here (v1.1 backlog, route structure) may be affected by the community-first pivot. See [[Community Exploration]] for current strategic direction.

See also: [MVP Scope Boundaries](./MVP%20Scope%20Boundaries.md) · [Open Questions & Assumptions Log](./Open%20Questions%20%26%20Assumptions%20Log.md) · [Trust Model](./Trust%20Model.md)

## Scoped in

- Next.js App Router + TypeScript implementation.
- End-to-end Sign Up → Explore happy path.
- Desktop + mobile layout behaviour.
- Local mock data and URL query-driven filters, with a Supabase read path (provider discovery + profile content).
- Explicit provider header states (`expanded`, `condensed`) to represent future scroll behaviour.
- Inline validation, empty/error states, trust signal display, and signup profile preview.

## Scoped out

- Real authentication or social provider integration.
- Write path to Supabase (signup draft is not persisted).
- Interactive map integration.
- Scroll-linked motion states and advanced micro-interactions.
- Full edge-case and validation matrix beyond basic gating.

---

## Signup flow

The multi-step signup lives under `/signup/*`. Step ordering and count are computed by `lib/signupSteps.ts` based on the roles selected at the Role step. State is held in `contexts/SignupContext.tsx` (`SignupDraft` type) for the duration of the session. Nothing is written to Supabase yet — on the success page the draft is rendered as a read-only preview via `SignupProfilePreview`.

### Step sequence by role

| Roles selected        | Step sequence                                                                           |
| --------------------- | --------------------------------------------------------------------------------------- |
| Owner only            | start → role → profile → pet → success                                                  |
| Walker only           | start → role → profile → care-preferences → walking → pricing → success                 |
| Host only             | start → role → profile → care-preferences → hosting → pricing → success                 |
| Walker + Host         | start → role → profile → care-preferences → walking → hosting → pricing → success       |
| Walker + Owner        | start → role → profile → care-preferences → walking → pricing → pet → success           |
| Host + Owner          | start → role → profile → care-preferences → hosting → pricing → pet → success           |
| Walker + Host + Owner | start → role → profile → care-preferences → walking → hosting → pricing → pet → success |

### Data collected per step

| Step             | Route                      | `SignupDraft` fields                                                                                 |
| ---------------- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| Start            | `/signup/start`            | `firstName`, `lastName`, `email`, `password`, `confirmPassword`                                      |
| Role             | `/signup/role`             | `roles`                                                                                              |
| Profile          | `/signup/profile`          | `bio`, `location`, `publicProfile`                                                                   |
| Care preferences | `/signup/care-preferences` | `dogSizes`, `dogAges`, `dogTemperamentsExcluded`, `dogSpecialNotes`                                  |
| Walking setup    | `/signup/walking`          | `walkingRadius`, `walkingDays`, `walkingTimes`                                                       |
| Hosting setup    | `/signup/hosting`          | `hostDays`, `hostTimes`, `homeType`, `outdoorSpace`, `dogStayArea`                                   |
| Pricing          | `/signup/pricing`          | `prices` (Kč per service: `walk_checkin`, `inhome_sitting`, `boarding`)                              |
| Pet profile      | `/signup/pet`              | `pet` (`name`, `breed`, `size`, `age`, `temperament`, `goodWithDogs`, `goodWithKids`, `healthNotes`) |
| Success          | `/signup/success`          | — (read-only preview via `SignupProfilePreview`)                                                     |

### Draft → Supabase field mapping (for when real auth is added)

`lib/draftToProfile.ts` converts the draft to a profile-shaped object. Approximate target schema:

| `SignupDraft` field(s)                       | Supabase target                       | Notes                                                          |
| -------------------------------------------- | ------------------------------------- | -------------------------------------------------------------- |
| `firstName`, `lastName`, `email`, `password` | `auth.users`                          | Supabase Auth; display name stored in `providers.display_name` |
| `bio`                                        | `provider_profiles.about_body`        | About tab body copy                                            |
| `location`                                   | `providers.location`                  | Free-text neighbourhood/district                               |
| `dogSizes`, `dogAges`                        | `provider_experience_items`           | Generates care experience entries                              |
| `homeType`, `outdoorSpace`, `dogStayArea`    | `home_environment`                    | Home environment module                                        |
| `pet`                                        | `provider_pets`                       | Host's own pet(s)                                              |
| `prices`                                     | `provider_service_offerings.rate_czk` | One row per service offered                                    |
| `roles`                                      | `providers.roles[]`                   | Array of offered service types                                 |

---

## Component inventory

### `components/ui/`

- `ButtonAction.tsx` — primary/secondary/tertiary/outline/disabled/destructive variants; CTA pill mode; size sm/md/lg; optional leading/trailing Phosphor icons
- `ButtonIcon.tsx` — icon-only touch target (navbar glyphs)
- `InputField.tsx` — labelled text input; `required`, `helper`, `error`, `onBlur` props; error state styling
- `CheckboxRow.tsx` — labelled checkbox with consistent touch target
- `FormHeader.tsx` — signup step header: title, subtitle, step X of Y progress bar
- `FormFooter.tsx` — signup step footer: Back (CTA tertiary) + Continue (CTA primary) buttons

### `components/explore/`

- `CardExploreResult.tsx` — provider result card: avatar, name, rating, services chips, blurb, trust row, price; carries full filter query into profile URL via `returnQuery` prop
- `TopNavDesktop.tsx` — desktop top-of-page nav (logo + links)
- `ExploreFilterPanelDesktop.tsx` — left-rail filter panel (desktop only): service, price range, time-of-day
- `ExploreFilterPanelMobile.tsx` — bottom-sheet filter panel (mobile): same controls as desktop
- `ProviderHeaderState.tsx` — provider profile hero: `expanded` (full name, rating, tags, trust row, photo) and `condensed` (sticky compact) states

### `components/signup/`

- `SignupProfilePreview.tsx` — read-only tabbed profile card rendered on the success page; mirrors the provider profile layout using draft data

### `components/` (root)

- `AppNav.tsx` — global top navbar; guest mode on `/signup/*`, logged-in mode on `/explore/*`; page quick-jump attached to Sign In / Avatar
- `BottomNav.tsx` — mobile bottom tab bar (Explore / Calendar / Inbox / Profile); shown at < 804px; hidden during signup, explore profile, and service sub-flow

---

## V1.1 backlog

1. Replace static map with interactive map provider.
2. Convert profile header state toggle into real scroll-linked behaviour.
3. Integrate server-backed auth and provider write path (signup → Supabase).
