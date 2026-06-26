---
category: implementation
status: active
last-reviewed: 2026-06-25

tags: [badges, person-row, trust, design-system]
review-trigger: "when adding a new badge, changing display rules, or modifying carer-status semantics"
---

# Badges — Catalog and Display Rules

This is the catalog. It says **what badges exist, where they show, and what rules govern their display.** Strategy lives elsewhere — see references at the bottom. The job here is consistency: when you add a row component or a new surface, this doc tells you which badges apply and how to render them.

Depends on: [[Trust & Connection Model]], [[Groups & Care Model]], [[Competitive Research - Prague Dog Care Scene]], [[design-system]]

---

## Three categories, distinct purposes

Badges split into three categories with different semantics, different visibility rules, and different visual treatments. **A single PersonRow should never show more than one badge per category** — three max per row, but two is the typical density.

| Category | What it conveys | Stable across surfaces? | Examples |
|---|---|---|---|
| **Role** | Contextual relationship to the *surface* | No — surface-specific | Admin (group), Host (meet) |
| **Identity** | What someone IS / DOES — answers "who is this" at a glance | Yes — person attribute | Carer (with audience variants) |
| **Trust** | Earned data that informs decisions — accumulates over time | Yes — but priority and treatment vary by surface (decision-helper density on Discover, full strip on profile) | Community Regular, Trusted by Network, Repeat Clients, Years Experience, First Aid Trained, Insured, Verified Identity |

The cleanup landed in Discover Refinement (2026-05-10): the previous "Tier" category (Helper / Provider) was retired and **reframed as Identity** — single noun ("Carer") with audience-encoding visual variants. The previous credential trust badges that were really identity statements ("Certified trainer", "Vet degree") *did not* graduate to Identity in v1 — Identity stays narrowly scoped to "Carer" alone. Trainer/Walker/Sitter sub-specifications are punch-listed for a future Carer-customization pass.

---

## Role badges

Contextual to the surface. The same person can render with different role badges on different surfaces.

| Badge | Context | Data source | PersonRow variant |
|---|---|---|---|
| **Admin** | Group context | `Group.adminIds.includes(userId)` | `group-member` only |
| **Host** | Meet context | `Meet.creatorId === userId` | `meet-attendee` (not yet implemented in PersonRow — meet creators currently surface via the creator banner above the attendee list) |

**No badge across contexts.** A meet host who's also a group admin shows Admin in the Members tab and Host in the People tab — never both.

**Future:** Host badge in PersonRow's `meet-attendee` variant would surface the creator inline with the attendee list. Today the meet creator is identified separately via `creatorId/creatorName/creatorAvatarUrl` fields rendered in a banner. Worth considering whether to consolidate; right now the banner reads as the right surface for the host's context (date created, host bio, share CTA).

---

## Identity badges

Stable person-attributes — same identity surfaces wherever the person renders. v1 ships **Carer only**, with an optional sub-specialization label that varies by carer.

### Carer

The badge is one pill, one visual treatment (light info-blue fill, dark info-blue text). The label is either `Carer` or a sub-spec like `Dog Trainer` / `Vet Clinic` / `Grooming Salon` / `Boarding & Daycare` — same labels the Care-group hero uses, kept consistent so the same Carer reads the same way across surfaces.

**Sub-spec resolution priority** (`resolveCarerSubSpec` in `lib/identityBadges.ts`):

1. *(Future)* `carerProfile.specializations` — direct user-set field. Tracked in punch list P60.
2. **Care group `careCategory`.** When the carer runs or co-runs a Care group, the group's category becomes the sub-spec. Klára runs `group-klara-training` (`careCategory: "training"`) → her badge reads **Dog Trainer**.
3. **Credential cert string match.** Catches credentialed carers who don't run a Care group. `/train/i` → `Dog Trainer`; `/vet|veterinary|dvm/i` → `Vet`. Tomáš B. (cert: "Certified Trainer") → **Dog Trainer**.
4. **Fallback to plain `Carer`** when no sub-spec resolves. Olga, Markéta, Petr V., etc. show as `Carer`.

### Audience setting (`publicProfile`) is encoded by visibility, not by intensity

| `publicProfile` | Visible to | What the viewer learns |
|---|---|---|
| `true` *(open)* | Everyone | This person offers care, anyone can ask |
| `false` *(circle)* | Connected viewers + self only — privacy gate | This person offers care to their circle, and you're in it |

**If you can see the pill, you can act on the services.** The badge presence itself is the audience signal — earlier two-intensity treatment (strong fill = open, light fill = circle) was redundant. One uniform light-fill treatment for all Carer badges.

**Privacy rule.** Circle-Carers' pill only renders when `viewerIsConnected === true` (or the row is the viewer themselves — self always sees own classification). Otherwise `getCarerIdentity` returns `undefined`. This carries the privacy intent that the retired Helper-tier pill had — non-Connected viewers don't learn that someone offers selective care.

**Future — Carer sub-specifications field.** Punch list P60. A direct `carerProfile.specializations?: string[]` would let Carers set their sub-spec without depending on a Care group or a credential string parse, and would let them pick more than one (e.g. `Dog Walker · Sitter` — though we'd cap badge rendering at one).

---

## Trust badges

Earned signals. Most are **post-MVP** — they require production data (booking history, attendance records, credential verification flow) that the demo phase doesn't generate. The taxonomy is captured here from `Competitive Research - Prague Dog Care Scene.md` so future work has a reference.

### Community-earned (primary — unique to Doggo)

Derived from platform activity. Can't be faked because the data is the platform's.

| Badge | How it's earned |
|---|---|
| **Carer Portfolio (aggregate)** | Accumulated completed engagements (bookings + carer-hosted meets). Three tiers: T1 `Carer` / T2 `Carer` / T3 `Trusted Carer` via the shared credential-pill family. Priority 0 — leads the TrustBadgeStrip when earned. See `lib/trustBadges.ts:carer-portfolio`. |
| **Community Regular** | Attended X+ meets in the last 3 months |
| **Neighbourhood Anchor** | Connected to X+ people in the same neighbourhood |
| **Trusted by Your Network** | X of viewer's connections use this provider |
| **Repeat Clients** | X+ owners have booked 3+ times |
| **Care Veteran** | Completed X+ care sessions |

### Credential (secondary — self-declared, optionally verified)

Mirror what Prague professionals already advertise.

Certified Trainer · First Aid Trained · Vet Background · Force-Free Methods · X Years Experience · Insured

### Platform (tertiary — awarded by Doggo)

Verified Identity · Responsive · Consistent

See `strategy/research/competitive/Competitive Research - Prague Dog Care Scene.md` → "Trust Badges for Doggo Provider Profiles" for full descriptions and earning criteria.

### Volunteer (parallel — earned through shelter walking)

A separate badge family sitting outside the three trust tiers, introduced with the Shelter Foundation phase (2026-06-02) and visually escalated with the Carer Portfolio + Shelter Walker Credentialing phase (2026-06-09). Renders on the shelter Members tab AND on user profiles' Volunteer-work section (one row per shelter the walker is vouched at). Three tiers, label-led with growth-icon shape progression, ramped via the shared credential-pill family:

| Tier | Icon | Label | Threshold (typical) | Visual |
|---|---|---|---|---|
| `vetted` | (none) | `Volunteer` | Default after vouching | T1 — near-white surface, soft border, family-tinted text |
| `experienced` | 🌱 Plant | `Volunteer` | ~10 walks at this shelter | T2 — soft violet fill, strong violet text, Plant icon |
| `trusted` | 🌳 Tree (filled) | `Super Volunteer` | ~25 walks (suggested — shelter can override) | T3 — dark violet fill, near-white text, filled Tree icon |

T1 and T2 share the short label (`Volunteer`); only T3 distinguishes (`Super Volunteer`). The Leaf icon from the original V1 spec was dropped when T1 went icon-less.

**Profile rendering (restructured 2026-06-12 — Mentor Network Decision #16):** Two surfaces. (1) An **aggregate badge in About**, directly under the carer aggregate — `Super Volunteer · N walks` (Tree icon, tier-3) or `Volunteer · N walks` (tier-1), where N is the sum of walks across all shelters — the volunteer counterpart to `Trusted Carer · N sessions`. This **reverses** the 2026-06-09 "no walk-count totals" call: the aggregate total now leads, deliberately, as a status that carries its stat. (2) The **per-shelter breakdown** rows in the "Volunteer work" section: pill carries the tier label ONLY; shelter name + walk count live in the context line (`at {Shelter} · N walks`); multi-shelter walkers stack rows. The section header is plain "Volunteer work" — its former Super Volunteer pill + subline moved up to the aggregate badge.

**Tiers are suggestions, not gates (Decision #4):** walk-count thresholds auto-derive a *suggested* tier; the shelter overrides freely in both directions (`tierOverrides`, effective = override ?? derived). Platform Super Volunteer requires ≥1 `trusted` affiliation, so the shelter's lever reaches platform status + mentor eligibility.

**Color:** violet `--volunteer-*` family in `app/globals.css`. Sits outside the existing semantic ladder — `info` blue = paid care, `brand` green = community. Violet carries "earned recognition for time given to shelter dogs" as its own category.

See `features/shelters.md` → "Volunteer badge" for the full surface treatment and `mockShelters.ts:ShelterWalker.tier` for the data shape.

---

## Display rules per surface

| Surface | Role | Identity (Carer) | Trust badges | Notes |
|---|---|---|---|---|
| **PersonRow — meet-attendee** | Host (future) | Yes (Carer with audience variant) | No | Identity is the row's identity-defining badge; trust badges live on Discover/profile/booking surfaces where decisions happen. |
| **PersonRow — group-member** | Admin | Yes (Carer with audience variant) | No | Same rule as meet-attendee. Klára (admin + open Carer) renders `Admin · Carer`. |
| **PersonRow — inbox-conversation** | No | No | No | Chat-list shape — no room. |
| **PersonRow — default** | No | Optional (caller passes) | No | Generic surface; conservative defaults. Consumers wanting Identity pass it explicitly. |
| **Profile page hero** | No | Yes (Carer with audience variant) — inline next to name | All earned, ranked Community-earned > Credential > Platform | The Carer pill answers "who is this" inline; the trust strip below answers "should I trust them." |
| **Carer cards in Discover > Dog Care** | No | No (surface is by definition open-Carers — redundant) | Top 2 most relevant | Section structure (in-circle vs other) carries audience signaling; no per-card Carer pill needed. |
| **Booking detail Info tab** | No | Optional | Relevant subset (e.g. Trusted by Your Network, Insured) | Reinforces confidence at the commit moment. |

**Maximum badges on a single PersonRow:** at most 2 — typically Role + Identity. Profile and Carer cards can carry more because they're the "deep look" surfaces.

**How the Carer Identity badge resolves.** The consumer (e.g. `ParticipantList`, `MembersTab`, profile hero) calls `getCarerIdentity(subject, viewerIsConnected)` from `lib/identityBadges.ts`. The privacy gate is baked into the helper — circle-Carers return `undefined` when the viewer isn't Connected (or self). Open-Carers always return `{ kind: "open" }`. Owners (no `carerProfile`) always return `undefined`.

---

## Visual spec

All badges share a pill primitive: `.person-row-pill` for PersonRow consumers. Variants per category:

| Class | Background | Color | Usage |
|---|---|---|---|
| `.person-row-pill--admin` | `--surface-inset` | `--text-secondary` | Group admin role. Suppressed when admins are rendered under an explicit ADMINS section header (e.g. group Members tab). |
| `.person-row-pill--carer` | `--status-info-light` | `--status-info-strong` | Carer Identity — uniform light info-blue fill, dark info-blue text. One treatment for both audience settings; the audience signal is encoded by VISIBILITY (privacy gate hides circle-Carers' badges from non-Connected viewers). Matches the Care-group category label visual so the same Carer reads consistently across surfaces. |
| `.person-row-pill--familiar` | `--surface-inset` | `--text-secondary` | Connection-state pill (not a badge in this taxonomy — display-only relationship indicator). |
| `.person-row-pill--pending` | `--surface-inset` | `--text-secondary` | Connection-state pill. |

**Why info-blue for Carer.** Doggo's brand color is green. Care signals across the app lean info-blue (schedule care cards, booking confirmations, Care-group category labels) so the Carer pill stays in that family. Brand green is reserved for app-wide chrome and CTAs.

**Why one uniform treatment instead of two intensities.** The first version of the Carer pill used strong fill for `publicProfile: true` (open) and light fill for `publicProfile: false` (circle). Live-walkthrough call (2026-05-10): the strong-fill green-leaning treatment competed with the Connect CTA in the row's action area, and the audience signal it tried to encode was already encoded by the privacy gate (circle-Carers' badge is invisible to non-Connected viewers). One uniform light-fill treatment is calmer and conveys exactly the same information.

The previous tier-pill classes (`.person-row-pill--helper`, `--provider`, `--care`) were deleted at the start of Discover Refinement (2026-05-10). The current `.person-row-pill--carer` class was added partway through the walkthrough as part of the Identity-as-Carer reframe.

**Trust badges** have their own visual treatment in `components/badges/TrustBadgeStrip.tsx` — small icon + label, grouped in a horizontal strip. Two variants: `standard` (profile hero, all earned) and `compact` (Discover cards, top 2 by priority).

### Credential pill family (shared T1/T2/T3 saturation ramp)

The Carer Portfolio aggregate (carer family) and Volunteer badge (volunteer family) share a single CSS family `.credential-pill` with two axes: family color (`--carer` / `--volunteer`) and tier modifier (`--tier-1` / `--tier-2` / `--tier-3`). Ramp:

| Tier | Surface | Text | Icon |
|---|---|---|---|
| T1 | Near-white inset, soft 1px border | ~80% family color | None (icon-less tier) |
| T2 | Soft family fill (mixed surface + family) | Strong family color | Family icon, light weight |
| T3 | Dark family fill | Near-white | Family icon, FILLED weight |

Labels: T1 + T2 share the short label (`Carer` / `Volunteer`); T3 distinguishes (`Trusted Carer` / `Super Volunteer`). Session counts and shelter names live OUTSIDE the pill — consuming surface owns its own context line. The saturation ramp runs in both list (Members tab) and profile-hero (TrustBadgeStrip lead) contexts.

Why this ramp: an earlier outlined → filled → filled+ring escalation was rejected during walkthrough (2026-06-08) because the ring extended past the pill's bounding box, varying its size across tiers. Saturation ramp keeps pill dimensions constant across tiers — the eye reads tier via fill intensity + icon presence, not size.

---

## What's built today

- **Role:** Admin (PersonRow group-member variant only).
- **Identity (Discover Refinement walkthrough, 2026-05-10):** Carer with two audience variants (open / circle). Renders on PersonRow (meet-attendee + group-member variants) and profile hero. Implementation: `lib/identityBadges.ts:getCarerIdentity` + `.person-row-pill--carer` / `--carer-circle` classes.
- **Trust (MVP shipped Discover & Care D3, 2026-05-02):**
  - Community-earned: Carer Portfolio (aggregate, credentialing-moat 2026-06-09 — priority 0), Community Regular, Trusted by Your Network, Repeat Clients
  - Credential: Certified Trainer, X Years Experience
  - Platform: Verified Identity (stub — production verification flow not built)
- **Volunteer (Shelter Foundation 2026-06-02, escalated 2026-06-09):** Three-tier credential-pill family on shelter Members tab AND Volunteer-work profile section. Implementation: `lib/trustBadges.ts:getCarerPortfolioTier`, `deriveWalkerTier` in `contexts/WalkerApplicationsContext.tsx`, `.credential-pill.--volunteer` family in `app/globals.css`.

  Implementation: `lib/trustBadges.ts` (catalogue + earning rules) and `components/badges/TrustBadgeStrip.tsx` (renderer). Two variants: `standard` (profile hero, all earned) and `compact` (Discover cards, top 2 by priority).

  Earning rules (today):
  - **Community Regular** — `≥3` meets attended in the last 90 days (computed from `Meet.attendees` / `attendeesByDate`).
  - **Trusted by Your Network** — viewer has ≥1 Connected connection who is also Connected to subject. Computed per-viewer.
  - **Repeat Clients** — `carerProfile.repeatClients ≥ 3` (mock data field; production derives from booking history).
  - **Certified Trainer** — `carerProfile.credentials.certifications` contains a string matching `/train/i`.
  - **X Years Experience** — `carerProfile.credentials.yearsExperience ≥ 1`.
  - **Verified Identity** — `carerProfile.credentials.identityVerified === true`. Demo-seeded on a small handful of providers (Klára, Lenka).

  Display priority (when trimming to top N): Trusted by Network > Community Regular > Repeat Clients > Certified Trainer > Years Experience > Verified Identity.

  Visual treatment: Community-earned badges use brand-subtle fill + brand-strong text (warm, "your community" colour family). Credential and platform use `--surface-base` + `--text-secondary` with a regular border (quieter, "self-declared/platform-verified" treatment). Pill primitive lives inline in `TrustBadgeStrip`; if a third surface picks them up, extract to `app/globals.css`.

## What's specced but not built

- Trust: Neighbourhood Anchor, Care Veteran (community), First Aid Trained, Vet Background, Force-Free Methods, Insured (credential), Responsive, Consistent (platform). All require either richer per-user mock data or production data.
- Role: Host on PersonRow meet-attendee (deferred — banner is sufficient for now).
- PersonRow propagation of Carer Portfolio aggregate: explicitly deferred (credentialing-moat phase, B5 deferral). PersonRow caps at 2 badges (Role + Identity); the aggregate as a 3rd would break that rule AND compete with the Carer Identity sub-spec ("Dog Trainer") which carries more meaning at row density. Open for a future surface need (e.g. a meet-attendee list where viewers benefit from tier nuance).

---

## Adding a new badge

1. Decide its category (Role / Identity / Trust). The category determines visibility rules and visual treatment.
2. Define the data source — what field on what type triggers it. Add to the relevant table above.
3. Define visibility rules — who sees it, with what gates (deniability, privacy).
4. Define visual treatment in `app/globals.css` under the existing `.person-row-pill--*` block.
5. Wire to `PersonRow` (or other consumer) via a new typed prop. Avoid generic "badges: string[]" — keeps the API legible.
6. Update this doc and `design-system.md`.

---

## Related Docs

- [[Trust & Connection Model]] — connection states + visibility toggle that gate connection-state pill rendering.
- [[Groups & Care Model]] — Carer audience spec (`publicProfile` circle vs anyone) and Care Group Admin Model.
- [[Competitive Research - Prague Dog Care Scene]] — full trust badge taxonomy and earning criteria.
- [[design-system]] — pill primitive, color tokens, sizing.
- [[Open Questions & Assumptions Log]] — selective care offering (open).
