# Doggo

Next.js + TypeScript prototype for Doggo — a community-first platform for Prague dog owners where trust built through meets unlocks care services.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase (optional)

The app reads from Supabase when configured and falls back to local mock data otherwise.

1. Copy the Project URL and anon key from **Supabase → Settings → API** into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
2. In the Supabase SQL Editor, run `supabase/schema.sql` then `supabase/seed.sql`.
3. Restart `npm run dev`.

Without Supabase, the app uses `lib/mockData.ts` for everything. UI is identical — only the data source differs.

## Docs

All project context lives under `docs/`.

- [`docs/CLAUDE.md`](docs/CLAUDE.md) — start here. Stack rules, workflow, current phase.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — phase arc and current state.
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — workflow rules, phase lifecycle, CSS conventions.
- [`docs/strategy/`](docs/strategy) — product direction, trust model, groups, competitive research.
- [`docs/features/`](docs/features) — per-feature specs.
- [`docs/implementation/`](docs/implementation) — design system, tokens, patterns.
- [`docs/phases/`](docs/phases) — active phase boards + punch list.
