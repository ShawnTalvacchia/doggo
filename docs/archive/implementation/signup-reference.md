---
category: implementation
status: active
last-reviewed: 2026-03-17
tags: [signup, routes, supabase, schema]
review-trigger: "when touching signup flow or auth integration"
---

# Signup Flow — Technical Reference

Extracted from prototype-decisions (March 2026). This is the canonical reference for the multi-step signup.

---

## Architecture

The multi-step signup lives under `/signup/*`. All users follow the same linear flow regardless of role. State is held in `contexts/SignupContext.tsx` (`SignupDraft` type) with localStorage persistence for the duration of the session. Nothing is written to Supabase yet.

> **Phase 2 change (March 2026):** Provider-specific steps (care-preferences, walking, hosting, pricing) were removed. Caregivers now set up services post-signup via their Profile page. A dedicated Visibility step was added.
>
> **Phase 6 change (March 2026):** Role step removed entirely. Everyone starts as an owner — there is no role selection at signup. The provider dial is turned later from the Profile page.

---

## Step sequence

`start → profile → pet → visibility → success`

---

## Data collected per step

| Step       | Route                 | `SignupDraft` fields                                                                                 |
| ---------- | --------------------- | ---------------------------------------------------------------------------------------------------- |
| Start      | `/signup/start`       | `firstName`, `lastName`, `email`, `password`, `confirmPassword`                                      |
| Profile    | `/signup/profile`     | `bio`, `location`                                                                                    |
| Pet        | `/signup/pet`         | `pet` (`name`, `breed`, `size`, `age`, `temperament`, `goodWithDogs`, `goodWithKids`, `healthNotes`) |
| Visibility | `/signup/visibility`  | `publicProfile` (Locked = false, Open = true)                                                        |
| Success    | `/signup/success`     | — (CTAs: Go to Home, Browse Meets, Set up care in Profile)                                           |

### Archived steps (pages exist but are not in the flow)

| Former step      | Former route                 | Status    |
| ---------------- | ---------------------------- | --------- |
| Role             | `/signup/role`               | Archived  |
| Care preferences | `/signup/care-preferences`   | Archived  |
| Walking setup    | `/signup/walking`            | Archived  |
| Hosting setup    | `/signup/hosting`            | Archived  |
| Pricing          | `/signup/pricing`            | Archived  |

---

## Draft → Supabase field mapping (for when real auth is added)

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
| `roles`                                      | `providers.roles[]`                   | No longer collected at signup; set from Profile                |
