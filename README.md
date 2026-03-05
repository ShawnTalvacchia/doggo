# Doggo V1 Prototype

Next.js + TypeScript clickable prototype for the Doggo Sign Up -> Explore flow.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run the app:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000).

### Supabase setup

The app reads provider data from Supabase when configured, and falls back to local mock data automatically if not.

**To connect Supabase:**

1. Open your Supabase project → **Settings → API**
2. Copy the **Project URL** and **anon/public** key
3. Paste both into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   ← must start with eyJ (it's a JWT)
```

4. In the Supabase **SQL Editor**, run these files in order:
   - `supabase/schema.sql` — creates all tables, indexes, RLS policies
   - `supabase/seed.sql` — inserts the 3 demo providers + profile content

5. Restart the dev server (`npm run dev`) so the env vars are picked up.

**How to tell if it's connected:** Open the browser console on `/explore/results`. If you see a warning like `NEXT_PUBLIC_SUPABASE_ANON_KEY looks like a placeholder`, the key isn't set yet and the app is using local mock data.

**Fallback behavior:** Without Supabase, the app uses `lib/mockData.ts` and `lib/data/providerContent.ts` for all provider data. The UI is identical — only the data source differs.

## Route map

**Signup** (step sequence is role-dependent — see `lib/signupSteps.ts`):

- `/signup/start` — name, email, password
- `/signup/role` — owner / walker / host role selection
- `/signup/profile` — bio, location
- `/signup/care-preferences` — dog sizes, ages, excluded temperaments _(walker/host only)_
- `/signup/walking` — radius, days, times _(walker only)_
- `/signup/hosting` — days, times, home setup _(host only)_
- `/signup/pricing` — Kč rates per service _(walker/host only)_
- `/signup/pet` — dog profile _(owner or unset role)_
- `/signup/success` — read-only profile preview

**Explore:**

- `/explore/results` — provider discovery with filters; mobile: full-screen service chooser when no service selected
- `/explore/profile/[providerId]` — provider profile (Info / Services / Reviews tabs)

Landing route `/` redirects to `/signup/start`.

## Global navigation

- A global top navbar is available across all pages.
- Navbar mode is automatic by route:
  - Guest nav on `/signup/*`
  - Logged-in nav on `/explore/*`
- Page quick-jump menu is now attached to:
  - `Sign In` button in guest mode
  - Avatar in logged-in mode

## Mock data editing

- Domain types: `lib/types.ts`
- Defaults and fixtures: `lib/mockData.ts`
- Query parsing/building: `lib/query.ts`

To change available providers or dog-care options, edit `providers` and `dogsCareOptions` in `lib/mockData.ts`.

## Core product docs

- `docs/MVP Scope Boundaries.md` — Provider Version MVP: what's in/out of scope
- `docs/Open Questions & Assumptions Log.md` — unresolved product assumptions and risks
- `docs/Trust Model.md` — trust progression and signals
- `docs/Product Principles.md` — design and product principles
- `docs/User Archetypes.md` — owner and provider personas
- `docs/prototype-decisions.md` — implementation decisions, signup flow, and component inventory
- `docs/frontend-style.md` — frontend styling standards and migration rules

## Known simplifications

- No write path yet (read-only Supabase + local fallback).
- Social sign-up buttons are non-functional placeholders.
- Explore map is a static placeholder, not an interactive map.
- Advanced interactions (header condensing) are represented as explicit toggle states on profile pages.
- Error/edge states are intentionally minimal for V1 happy-path speed.
