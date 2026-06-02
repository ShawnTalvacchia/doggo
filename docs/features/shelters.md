---
category: feature
status: built
last-reviewed: 2026-06-01
tags: [shelters, institutional-accounts, walkers, dogs, cold-start]
review-trigger: "when modifying shelter surfaces, walker tier model, or non-owned dog handling"
---

# Shelters

Top-level institutional accounts on Doggo. Parallel to `UserProfile` — NOT a Group type. Ship with the Shelter Foundation phase (2026-06-01) seeded with one demo shelter (Útulek Liběň). Walker journey, credentialing UX, and shelter operator/admin views are deferred to later phases.

See [[Cold-Start Playbook]] (strategic rationale) and [[strategy/Open Questions & Assumptions Log]] §14 (resolutions log).

---

## Why a separate entity

Shelters were sized against four options during the 2026-06-01 strategy conversation:

- **Group type** — A fifth `Group` discriminator alongside park/neighbor/interest/care. Rejected: shelters have institutional identity, non-owned dogs, a vetted walker pool, per-shelter policy, and multi-staff admin shape that the Group model can't carry cleanly.
- **UserProfile with a flag** — A user account where `isShelter: true`. Rejected: posts attributed to "shelter staff" rather than "the shelter," weak handling of staff turnover.
- **Hybrid org-containing-group** — A `ShelterProfile` that owns a private walker `Group`. Rejected: doubles the data model for limited UX gain; the walker pool isn't a discussion group, it's a credential list.
- **Top-level entity (chosen)** — A `ShelterProfile` parallel to `UserProfile`. Six features that fit it cleanly: institutional identity, non-owned dogs, vetted walker pool, per-shelter policy, dog roster, multi-staff admin shape.

Future generalization to `OrgProfile` (rescue, vet clinic, training school) is logged in §14 as an open item — premature until a second institutional type exists.

---

## Account model

**Institutional-by-default.** Shared login. Shelter logo as the avatar (rendered as a circle per Avatar Rule B, same as communities and user profiles — every entity-with-presence is a circle; only dogs are rounded-square). Posts authored by the shelter use the shelter's id as `Post.authorId`. Survives staff turnover; no per-staff account setup; minimal onboarding friction.

**Optional Team mode.** Individual staff can opt to link their `UserProfile` to a shelter via `ShelterTeamMember`. When `team[].length > 0`, the shelter info card's "Run by" line scales from "Run by the {shelter} team" to "Run by N team members," and a Team filter pill appears on the Members tab. The page shape is identical with zero linked staff or with N linked staff — same chrome, scaled fill-in. Full invite UX and operator/admin view are V3+.

Demo ships shared-credential only (`team: []`).

---

## Page chrome

Mirrors the Communities pattern with one substitution (Meets → Dogs, because shelters don't host meets as a core feature).

**Route:** `/shelters/[id]` where `id` is a slug-style string (`utulek-liben`).

**Tabs:**
- **Feed** — Shelter info card + dogs-in-care summary card + post stream. Interleaves shelter-authored + walker-authored posts.
- **Dogs** — Single-column photo-led roster of `ShelterProfile.dogs`. Sort pills: "Needs walks now" (default) / "Recently arrived" / "Long-stayers" / "All".
- **Members** — Filter pills: All / Walkers / Supporters / Team (Team appears only when `team[].length > 0`). One badge per row. Default sort: recency (most-recent activity first — anti-scoreboard discipline).
- **Gallery** — Stub in V1; inherits machinery from the Photos & Galleries phase.

**Detail header** — Back arrow + shelter name. No bottom-nav on detail pages (mirrors community-detail).

**Hero** — Banner image at top (200px / 180px mobile), shelter logo (72px rounded-panel) pulled up to overlap the banner, name + location subline. Hero collapses on sub-tabs to give content room.

---

## Non-owned dogs

Shelter dogs live in `ShelterProfile.dogs[]` — a contained array of `PetProfile`. Containment IS the ownership signal on both sides:

- **Owned dogs** — contained in `UserProfile.pets[]`. No `shelterId` field; no `ownerId` field. The container resolves authority.
- **Shelter dogs** — contained in `ShelterProfile.dogs[]`. Same shape as owned dogs but carrying shelter-only optional fields (`daysInKennel`, `lastWalkedAt`, `backstory`, `tags`, `adoptionStatus`, `soloOnly`, `experiencedHandlersOnly`, `intakeDate`, `sex`).

Lookups (`getShelterDog(dogId)` in `lib/mockShelters.ts`) check shelter rosters; `getDogById` in `lib/mockUsers.ts` handles owned dogs. A unified `getDogById` that bridges both is a future cleanup.

---

## Dog Profile

Lives at `/dogs/[id]`. V1 ships a minimal-but-functional version for shelter dogs only — Dog Profile phase deepens this AND introduces the owned-dog profile (which doesn't exist yet).

**Spine** (shared with future owned-dog profile): hero photo, name, breed/age/sex line, backstory blurb, tags, kennel stats tiles, recent walkers row, posts about this dog, backlink to shelter.

**Pet-as-protagonist** — full-width hero photo with name + line overlay at the bottom. The dog is the visual centerpiece, not the layout chrome.

**Unknown-dog graceful state.** Visiting `/dogs/[id]` for an owned-dog id falls back to a polite empty state ("Dog profile coming soon — owned-dog profiles arrive with the Dog Profile phase"). NOT a 404 — the route is real, the content just hasn't landed yet. Post-tag clicks routing to `/dogs/${ownedPetId}` thus degrade gracefully rather than dead-ending.

---

## Walker tier model

Three per-shelter institutional tiers gating walk eligibility:

| Tier | Permission | Threshold (typical) |
|------|-----------|---------------------|
| **Vetted Walker** | Solo walks only | Default after vouching |
| **Experienced Walker** | Group walks with vetted-sociable dogs | ~10 walks at this shelter |
| **Trusted Handler** | Group walks with reactive or unknown dogs | ~25 walks + coordinator sign-off |

**Three-axis composition for walk eligibility:**
1. Walker tier (this section)
2. Per-shelter policy (`ShelterPolicy.groupWalksPermitted` — some shelters never permit group walks regardless of tier)
3. Per-dog policy overrides (`PetProfile.soloOnly`, `PetProfile.experiencedHandlersOnly`)

Strictest rule wins.

**Visual escalation deferred to credentialing-moat phase.** V1 ships flat affiliation chips ("Walker · {shelter}") on Members tab rows. The intensification language (outlined → filled → filled+ring) shared with the Carer Portfolio aggregate badge ships when the merged Carer Portfolio + Shelter Walker Credentialing phase lands. See [[implementation/badges]].

Tier label is visible in the Members row subline this phase ("Experienced walker · 22 walks") — the information is shown without the styled chip.

---

## Anti-scoreboard discipline

No leaderboards. No streaks. No "top walker this month." No public ranking of walker pools.

The recognition pattern is **visible accumulation through badge intensification + absolute stats per profile** (not ranked). The Members tab sorts by recency (most-recent activity first), surfacing community-in-motion without competition framing.

The Dogs tab "Needs walks now" sort surfaces urgency, not competition. The summary card line ("X need walks now") is information for action — not a public scorecard.

This discipline aligns with the broader Doggo principle that trust accrues through real engagement and accumulates personally — not via leaderboards optimized for engagement metrics.

---

## Posts & content visibility

**Authorship.** A post's `authorId` resolves through three paths:
1. `getShelterById(authorId)` — shelter-authored. Author link routes to `/shelters/${id}`.
2. `getUserById(authorId)` — user-authored. Author link routes to `/profile/${id}`.
3. Neither — directory-style walker without a `UserProfile` bridge. Author name renders as plain text (no link).

The `resolveAuthorHref` helper in `components/feed/MomentCard.tsx` encapsulates this resolution.

**Shelter feed query.** `getShelterFeed(shelter)` interleaves three post types:
- `post.authorId === shelter.id` (shelter-authored)
- Posts tagged `{ type: "shelter", id: shelter.id }`
- Posts tagged `{ type: "dog", id: <any dog in shelter.dogs[]> }`

Walker-authored walk recaps thus auto-route into the shelter feed via their dog/shelter tags.

**Tag inheritance for shelter dogs.** Shelter dogs use `ShelterProfile.tagApproval` instead of an owner's `UserProfile.tagApproval`. Same inheritance model as owned dogs, different authority. See [[Content Visibility Model]] → tag-approval section.

---

## Dog profile tag taxonomy (interim)

The chip/pill rows on the Dogs-tab card AND the dog profile (`/dogs/[id]`) fall into three categories. V1 ships them visually distinct but the data model is still informal — formalization is FC8 in Future Considerations and lands with the Dog Profile phase.

**1. Auto-derived chips** — computed at render time, never stored. Always accurate.

| Chip | Derived from | Visual |
|---|---|---|
| Long-stayer | `daysInKennel >= 30` | Amber-tinted (`--warning-25`) |
| New arrival | `daysInKennel <= 7` (cards only) | Solid brand fill (event treatment) |
| Adoption pending | `adoptionStatus === "pending"` (cards only) | Yellow glass (translucent) |
| Calm / Easygoing / Active / High energy | `PetProfile.energyLevel` | Brand-tinted (`--brand-subtle`) |

The card-level chip uses single-overlay priority (Adoption pending > New arrival > Long-stayer > none). The dog-profile chips render all applicable.

**2. Manual personality tags** — `PetProfile.tags: string[]`. Curated free-text, e.g. "Affectionate", "Smart", "Wary of strangers", "Reactive to other dogs". Render as neutral surface chips.

Seed-time discipline: don't manually enter any tag that would auto-derive (e.g. don't add "Calm" to a dog whose `energyLevel: "low"` — the energy chip will render it). The render layer dedupes case-insensitively against `formatEnergy()` output to handle drift.

**3. Policy chips (auto-derived)** — `PetProfile.soloOnly` + `PetProfile.experiencedHandlersOnly`. Visually distinct (single row with shield icon) because they gate walker eligibility. Different visual role from personality tags.

**Tag system formalization** — FC8 in Future Considerations covers the planned shape: a typed enum for personality tags (controlled vocabulary), explicit auto-derive helpers per chip type, and the harmonized seed data. Currently mixed for compatibility; clean-up lands with the Dog Profile phase.

---

## Discovery

V1 ships **no top-level Discover entry** for shelters. Users reach a shelter via:
- Direct URL (`/shelters/utulek-liben`)
- Author link on a shelter-authored post in any feed
- The `shelter` tag pill on a tagged post

A cold-start "Help a Dog" door in Discover is referenced in [[Cold-Start Playbook]] as a future thread; it's not on this phase or roadmap.

---

## Deferred for later phases

Items named in §14 but explicitly out of scope for Shelter Foundation:

- **Walker journey.** Booking a walk, active session, visit-report attaching back to a dog. → Merged Carer Portfolio + Shelter Walker Credentialing phase.
- **Walker credentialing visual escalation.** Tier badges with outlined → filled → filled+ring intensification. → Same merged phase.
- **Shelter operator/admin view.** Dashboard, dog edit affordances, walker application queue, vouching state machine UX. → V3+ pending real shelter conversations.
- **Adopted-dog transition pattern.** Celebration card → archived state → potentially transitioning the profile to a new owner's `UserProfile.pets[]`. → V2.
- **`ShelterEvent` escape valve.** For open days / adoption fairs. Different from Meets (no Familiar marking, no post-meet review). → If/when a real shelter raises the need.
- **Long-stayer treatment depth.** V1 ships a tag chip + sort. Distinct card treatment, profile-level urgency framing, special "Looking for a special home" copy → future Dogs-tab polish pass.
- **Bilingual surfaces.** Útulek Liběň coordinates in Czech; expat community is English-first. Authoring layer that supports both is unusually valuable for shelter onboarding but out of V2.
- **Incident reporting workflow.** Visit reports support flagging in principle; the institutional impact (does the shelter see, does it auto-impact walker tier, does the per-dog policy auto-tighten) is real design work. → Adjacent to §5 Safety & Liability.
- **`ShelterProfile` → `OrgProfile` generalization.** Premature until a second institutional type lands.
- **Per-service visibility on shelter affiliation.** Shelter affiliation could become a third visibility path (alongside Lock, Connection, Group co-membership) for circle-scoped Carer offerings. Open question — not scoped.

---

## Implementation pointers

- **Types:** `lib/types.ts` → `ShelterProfile`, `ShelterPolicy`, `ShelterWalker`, `ShelterSupporter`, `ShelterTeamMember`, `WalkerTier`. Shelter-only `PetProfile` fields documented inline (`soloOnly`, `experiencedHandlersOnly`, `adoptionStatus`, `daysInKennel`, `lastWalkedAt`, `backstory`, `tags`, `intakeDate`, `sex`).
- **Mock data:** `lib/mockShelters.ts` (single seeded shelter — Útulek Liběň). Shelter feed posts live in `lib/mockPosts.ts` for unified post querying.
- **Page:** `app/shelters/[id]/page.tsx` (chrome + Feed / Dogs / Members / Gallery tabs in one file).
- **Dog profile:** `app/dogs/[id]/page.tsx` (minimal V1; owned-dog fallback to graceful empty state).
- **Components:** `components/shelters/ShelterDogCard.tsx` (Dogs-tab card), `components/shelters/ShelterMemberRow.tsx` (Members-tab row).
- **CSS:** `.shelter-detail-*`, `.shelter-info-card`, `.shelter-summary-card`, `.shelter-dog-card-*`, `.shelter-member-*`, `.dog-profile-*` in `app/globals.css`. Candidate for design-system consolidation into a generic `.detail-page-shell` (FC4) — added to Design System Cleanup phase scope.
- **`PostTagType` slot:** `"shelter"` added 2026-06-01 as reserved infrastructure; composer doesn't surface a shelter picker.
