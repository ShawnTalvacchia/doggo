---
category: implementation
status: active
last-reviewed: 2026-04-29

tags: [badges, person-row, trust, design-system]
review-trigger: "when adding a new badge, changing display rules, or modifying tier semantics"
---

# Badges — Catalog and Display Rules

This is the catalog. It says **what badges exist, where they show, and what rules govern their display.** Strategy lives elsewhere — see references at the bottom. The job here is consistency: when you add a row component or a new surface, this doc tells you which badges apply and how to render them.

Depends on: [[Trust & Connection Model]], [[Groups & Care Model]], [[Competitive Research - Prague Dog Care Scene]], [[design-system]]

---

## Three categories, distinct purposes

Badges aren't a single thing. They split into three categories with different semantics, different visibility rules, and different visual treatments. **A single PersonRow should never show more than one badge per category** — three badges max, and even three is rare.

| Category | What it conveys | Examples |
|---|---|---|
| **Tier** | Identity classification — what services this person offers and to whom | Helper, Provider |
| **Role** | Contextual relationship to the surface | Admin, Host |
| **Trust** | Earned signals derived from platform activity, credentials, or platform verification | Community Regular, Verified Identity, Certified Trainer, etc. |

Tier and Role are stable, demo-relevant, and shipped (or shipping). Trust badges are mostly future-state — most won't render until production data exists to back them.

---

## Tier badges

Identity classification. Derived from `UserProfile.carerProfile`:

| Tier | Data source | Badge label | Who sees it |
|---|---|---|---|
| **Owner** (default) | No `carerProfile` set | _no badge_ | n/a |
| **Helper** | `carerProfile.publicProfile === false` | "Helper" | **Connected viewers only** — services are private to Connected users (see [[Groups & Care Model]] → Provider Tiers), so the badge follows the same privacy rule. Showing Helper to a non-connected viewer would leak that the person offers selective care. |
| **Provider** | `carerProfile.publicProfile === true` | "Provider" | All viewers — Provider services are public, so the badge is too. |

**Visibility logic in code:** the consumer (e.g. `ParticipantList`) resolves the tier and passes it to `PersonRow` as `careTier?: "helper" | "provider" | undefined`. Helper-tier rendering also requires `connectionState === "connected"` — when the viewer isn't Connected, pass `undefined` to suppress the badge.

**Self-render:** when the row is the viewer themselves, the tier badge renders unconditionally (you always see your own classification).

**Open question — selective care offering** ([[Open Questions & Assumptions Log]] §4 / Provider Model):
The current model is binary — Helper services are visible to ALL Connected users. A natural extension is selective offering: a Helper might want to offer services to specific Connected users only, not all of them. Whether this is a meaningful product feature or YAGNI for the demo is unresolved. If we go selective, the Helper-badge visibility rule has to refine accordingly (visible only to viewers in the actual eligibility set, not all Connected). Worth revisiting once we have provider walkthroughs in Discover & Care Deep Pass.

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

## Trust badges

Earned signals. Most are **post-MVP** — they require production data (booking history, attendance records, credential verification flow) that the demo phase doesn't generate. The taxonomy is captured here from `Competitive Research - Prague Dog Care Scene.md` so future work has a reference.

### Community-earned (primary — unique to Doggo)

Derived from platform activity. Can't be faked because the data is the platform's.

| Badge | How it's earned |
|---|---|
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

See `strategy/Competitive Research - Prague Dog Care Scene.md` → "Trust Badges for Doggo Provider Profiles" for full descriptions and earning criteria.

---

## Display rules per surface

| Surface | Tier | Role | Trust badges | Notes |
|---|---|---|---|---|
| **PersonRow — meet-attendee** | Yes (1) | Host (future) | No | Action affordances are the headline; badges are quiet identity. |
| **PersonRow — group-member** | Yes (1) | Admin | No | Same as meet-attendee; Admin replaces Host. |
| **PersonRow — inbox-conversation** | No | No | No | Chat-list shape — no room. |
| **PersonRow — default** | Yes (1) | No | No | Generic surface; conservative defaults. |
| **Profile page hero** | Yes (1) | No | All earned, ranked Community-earned > Credential > Platform | Full provider story lives here. |
| **Provider cards in Discover > Dog Care** | Yes (1) | No | Top 2-3 most relevant | Booking-decision context. |
| **Booking detail Info tab** | Yes (1) | No | Relevant subset (e.g. Trusted by Your Network, Insured) | Reinforces confidence at the commit moment. |

**Maximum badges on a single row/card:** PersonRow stays at 1–2 (tier + role). Profile and provider cards can carry more because they're the "deep look" surfaces.

---

## Visual spec

Today all badges share a pill primitive: `.person-row-pill` for PersonRow consumers. Variants per category:

| Class | Background | Color | Usage |
|---|---|---|---|
| `.person-row-pill--provider` | `--status-info-main` | `--surface-top` (white) | Provider tier — public, professional. Info-blue palette so care signals read consistently with the schedule's care cards (blue = care across the app). |
| `.person-row-pill--helper` | `--status-info-light` | `--status-info-strong` | Helper tier — same info-blue palette but lighter fill + dark blue text. Reads as "informal, between friends." Visibility gated by the consumer (only render when viewer is Connected to subject). |
| `.person-row-pill--care` | `--status-info-main` | `--surface-top` | Legacy alias of `--provider`. Kept until remaining consumers migrate. |
| `.person-row-pill--admin` | `--surface-inset` | `--text-secondary` | Group admin role. Suppressed when admins are rendered under an explicit ADMINS section header (e.g. group Members tab). |
| `.person-row-pill--familiar` | `--surface-inset` | `--text-secondary` | Connection-state pill (not a badge in this taxonomy — display-only relationship indicator). |
| `.person-row-pill--pending` | `--surface-inset` | `--text-secondary` | Connection-state pill. |

**Why info-blue for tier badges:** Doggo's brand color is green. Tier badges live across many surfaces and benefit from a consistent semantic palette distinct from brand chrome — blue = care, signals "this is service-related" at a glance. Brand green stays for app-wide chrome and CTAs; care-specific signals (tier badges, schedule care cards, booking confirmations) lean blue.

**Provider vs Helper visual hierarchy:** Same palette family, different intensity. Provider's strong fill + white text reads public/confident. Helper's lighter fill + dark text reads quiet/informal. The shared blue family signals "both are care-tier"; the intensity differential signals "Provider is more public."

**Trust badges (future)** likely warrant their own visual treatment — small icon + label, possibly grouped in a horizontal strip on profile/Discover surfaces. Defer detailed spec until first trust badge ships.

---

## What's built today

- **Tier:** "Care" (collapses Helper + Provider — splitting in Community & Groups Deep Pass A9).
- **Role:** Admin (PersonRow group-member variant only).
- **Trust:** Zero. Wholly unbuilt.

## What's specced but not built

- Tier: Helper / Provider split (this phase, A9).
- Role: Host on PersonRow meet-attendee (deferred — banner is sufficient for now).
- Trust: Entire taxonomy. Production-only.

---

## Adding a new badge

1. Decide its category (Tier / Role / Trust). The category determines visibility rules and visual treatment.
2. Define the data source — what field on what type triggers it. Add to the relevant table above.
3. Define visibility rules — who sees it, with what gates (deniability, privacy).
4. Define visual treatment in `app/globals.css` under the existing `.person-row-pill--*` block.
5. Wire to `PersonRow` (or other consumer) via a new typed prop. Avoid generic "badges: string[]" — keeps the API legible.
6. Update this doc and `design-system.md`.

---

## Related Docs

- [[Trust & Connection Model]] — connection states + visibility toggle that gate Tier badge rendering.
- [[Groups & Care Model]] — Provider Tiers spec (Owner / Helper / Provider) and Care Group Admin Model.
- [[Competitive Research - Prague Dog Care Scene]] — full trust badge taxonomy and earning criteria.
- [[design-system]] — pill primitive, color tokens, sizing.
- [[Open Questions & Assumptions Log]] — selective care offering (open).
