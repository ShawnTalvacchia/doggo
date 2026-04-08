---
status: done
last-reviewed: 2026-03-23
---

# Onboarding Flow

New user signup — from landing page through to the home dashboard. Provider setup is not part of signup — it happens later through profile edit mode (see [[provider-setup]]).

```mermaid
flowchart TD
    A["Landing Page"] --> B["Sign In / Sign Up"]
    B --> C["Create Account\n(email, password)"]
    C --> D["Your Profile\n(name, location, bio, avatar)"]
    D --> E["Add Your Dog\n(name, age, size, energy, play style)"]
    E --> F["Visibility Setting\n(locked / public / selective)"]
    F --> G["Success Screen"]
    G --> H["Home Dashboard"]

    style I stroke-dasharray: 5 5
    H -.-> I["Future: Onboarding payoff step\n(preview nearby meets, dogs in area)"]
```

## Step status

| Step | Route | Status |
|------|-------|--------|
| Landing page | `/` | Done |
| Sign in | `/signin` | Done |
| Create account | `/signup/start` | Done |
| Your profile | `/signup/profile` | Done |
| Add your dog | `/signup/pet` | Done |
| Visibility setting | `/signup/visibility` | Done |
| Success screen | `/signup/success` | Done |
| Home dashboard | `/home` | Done |

## Notes

- Provider role selection, care preferences, pricing, and hosting/walking pages still exist in the codebase (`/signup/role`, `/signup/care-preferences`, etc.) but are **not linked** in the current signup flow. They were removed in Phase 6.
- Provider setup now happens through profile edit mode — see [[provider-setup]].
- Phase 8 proposes an **onboarding payoff step** after success — a preview of nearby activity to give immediate value before the user has done anything.
