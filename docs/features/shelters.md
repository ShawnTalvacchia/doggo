---
category: feature
status: built
last-reviewed: 2026-06-02
tags: [shelters, institutional-accounts, walkers, dogs, cold-start]
review-trigger: "when modifying shelter surfaces, walker tier model, or non-owned dog handling"
---

# Shelters

Top-level institutional accounts on Doggo. Parallel to `UserProfile` — NOT a Group type. Shipped with the Shelter Foundation phase (closed 2026-06-02) seeded with one demo shelter (Útulek Liběň). Walker journey, credentialing UX, and shelter operator/admin views are deferred to later phases.

See [[Cold-Start Playbook]] (strategic rationale) and [[phases/Open Questions & Assumptions Log]] §14 (resolutions log).

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

**Tabs:** `Feed / Dogs / Members / Gallery`. Tabs sit at the top of the scrollable panel body (sticky), not above the banner. Mirrors community-detail: tabs always accessible, hero scrolls away within the Feed tab content, no banner-jump on tab change.

**Detail header** — Back arrow + shelter name. No bottom-nav on detail pages (mirrors community-detail).

**Horizontal padding inside the panel** matches `.detail-tabs` (md / 12px) on the Dogs and Members tabs so cards/rows align edge-to-edge with the tabs above. The Feed tab uses xl (20px) for prose sections (bio, meta row, action buttons) because the wider gutter suits prose blocks.

### Feed tab anatomy

Top-to-bottom inside the Feed tab body (which begins below the sticky tabs):

1. **Banner** — full-width image, 240px / 220px mobile. Matches `.group-detail-banner` height.
2. **Intro block** — shelter name (h1) + bio paragraph. No logo overlay on the banner (clean break from the community pattern; logo lives on small-context surfaces only — post-author avatars, dog-profile backlink).
3. **Dogs-in-care summary card** — the primary CTA. White card on the panel surface, violet icon tile + "X dogs in care" headline + "Y need walks now · Z long-stayers" subline + "See the roster" CTA in violet. Lifts on hover (`--surface-base` → `--surface-top` + `--shadow-sm`).
4. **Inline meta row** — `📍 Libeň, Prague 8 · 👥 N walkers, M supporters · 🕐 since 2007`. Single row that wraps on narrow viewports. Mirrors the community page's location/members/dogs/photos rhythm.
5. **Socials row** — icon-only chips (Website, Facebook, Instagram, Email) in small circles. Replaced the original text-and-icon "Website: utulekliben.cz" treatment that read as broken at small sizes.
6. **Action row** — `Follow` + `Walk a dog` (both stateful, action-becomes-status pattern):
   - `Follow` toggles to `Following ▾` (caret reveals an Unfollow menu).
   - `Walk a dog` opens a sheet with the shelter's `vouchingNote` and an `Express interest` CTA → flips to `Interest sent ▾` (caret reveals Withdraw interest).
7. **Post feed** — walker-led mix (see "Posts & content visibility" below).

### Dogs tab

- **Sort dropdown** — custom-styled trigger + `.dropdown-menu` listbox (matches Follow / RSVP / Joined menus). Replaced the native `<select>` which rendered OS-default styling. Options: `Needs walks now` (default) / `Longest in care` / `Smallest first` / `A-Z`. Each option bakes its direction in (no asc/desc toggle).
- **Card grid** — `repeat(auto-fit, minmax(220px, 1fr))` — 2-up on desktop within the 640px panel, 1-up on narrow viewports. Cards stay tight inside the 640px shell (panel width unchanged).

### Members tab

- **Filter pills** — `All / Walkers · N / Supporters · M / Team · K (when seeded)`. Rendered bare via `<FilterPillRow>` (no wrapping container — `FilterPillRow` already carries its own padding + border-bottom).
- **Rows** — one badge per row (volunteer badge for walkers; no chip for supporters since everyone in the tab is a supporter by default).
- **Default sort** — recency (most-recent activity first — anti-scoreboard discipline).

### Gallery tab

- Empty-state placeholder pointing at the future Photos & Galleries phase.

---

## Volunteer badge

The single most distinctive surface on the shelter Members tab. Walkers carry a `[Tier] Volunteer` badge using:

- **Color: violet** (`#ede9fe` background / `#5b21b6` text). Sits outside the existing semantic ladder (`info` blue = paid care; `brand` green = community) so it reads as its own category: "time given to shelter dogs." Volunteer-recognition without rank framing.
- **Icon shape: growth metaphor** (`Leaf → Plant → Tree`). Distinct shapes carry the tier escalation — shape progression is far more legible at 12px than weight variation on a single icon (the original paw-weight approach was barely visible).
- **Label: `[Tier] Volunteer`** (working titles):

| Tier | Icon | Label | Threshold (typical) |
|---|---|---|---|
| `vetted` | 🍃 Leaf | `Volunteer` | Default after vouching |
| `experienced` | 🌱 Plant | `Regular Volunteer` | ~10 walks at this shelter |
| `trusted` | 🌳 Tree | `Super Volunteer` | ~25 walks + coordinator sign-off |

Notes on the label ladder:
- Entry tier is just `Volunteer` (no "New" prefix). "New" implied probationary status; just "Volunteer" reads as the real thing.
- Top tier is `Super Volunteer`, not "Trusted." Trust is binary, so "Trusted Volunteer" made the lower tiers sound untrusted by implication. "Super" is praise rather than rank.
- Middle stays `Regular Volunteer` — modest and descriptive of cadence.

The chip travels cleanly to out-of-context surfaces (user profiles, feed mentions) without needing shelter context appended. A multi-shelter volunteer just wears two badges of (possibly) different tiers; no single-shelter naming required. This explicit design choice supports encouraging multi-shelter volunteering.

**Three-axis composition for walk eligibility** (independent of the visible badge):
1. Walker tier
2. Per-shelter policy (`ShelterPolicy.groupWalksPermitted` — some shelters never permit group walks regardless of tier)
3. Per-dog policy overrides (`PetProfile.soloOnly`, `PetProfile.experiencedHandlersOnly`)

Strictest rule wins.

**Visual escalation deferred to the credentialing-moat phase.** V1 ships one uniform chip style across all tiers (the icon does the work). Final tier naming, cross-shelter badge aggregation on user profiles, and any heavier visual treatment for the top tier come with the merged Carer Portfolio + Shelter Walker Credentialing phase. See FC9 + FC11.

---

## Anti-scoreboard discipline

No leaderboards. No streaks. No "top walker this month." No public ranking of walker pools.

The recognition pattern is **visible accumulation through icon shape progression + absolute stats per profile** (not ranked). The Members tab sorts by recency (most-recent activity first), surfacing community-in-motion without competition framing.

The Dogs tab "Needs walks now" sort surfaces urgency, not competition. The summary card line ("X need walks now") is information for action, not a public scorecard.

This discipline aligns with the broader Doggo principle that trust accrues through real engagement and accumulates personally — not via leaderboards optimized for engagement metrics.

---

## Non-owned dogs

Shelter dogs live in `ShelterProfile.dogs[]` — a contained array of `PetProfile`. Containment IS the ownership signal on both sides:

- **Owned dogs** — contained in `UserProfile.pets[]`. No `shelterId` field; no `ownerId` field. The container resolves authority.
- **Shelter dogs** — contained in `ShelterProfile.dogs[]`. Same shape as owned dogs but carrying shelter-only optional fields (`daysInKennel`, `lastWalkedAt`, `backstory`, `tags`, `adoptionStatus`, `soloOnly`, `experiencedHandlersOnly`, `intakeDate`, `sex`).

Lookups (`getShelterDog(dogId)` in `lib/mockShelters.ts`) check shelter rosters; `getDogById` in `lib/mockUsers.ts` handles owned dogs. A unified lookup that bridges both is a future cleanup.

---

## Dog Profile

Lives at `/dogs/[id]`. V1 ships a minimal-but-functional version for shelter dogs only — the Dog Profile phase deepens this AND introduces the owned-dog profile (which doesn't exist yet).

**Hero** — Full-width photo, `aspect-ratio: 4/3`, capped at `max-height: 20rem` so it doesn't push everything else below the fold on tall viewports. Pet-as-protagonist: name + meta line (`breed · age · sex · weight`) overlaid at the bottom of the hero. `Adoption pending` status pill renders top-right when applicable.

**Stat row** — Hairline strokes top + bottom (border-top + border-bottom on the row container), NOT card chrome. Two stat tiles in a 2-column grid (`In care` + `Last walked`), each with icon + label inline + larger value below. Centered icon + label header, value below. Compact, breathable, no boxy feel.

The stat row only renders while the dog is in active care (`adoptionStatus !== "adopted"`). Owned dogs and adopted shelter dogs hide it entirely (the numbers stop being meaningful once the dog has gone home).

**Tags row** — Renders three categories with dedupe:
1. Energy-derived chip (always first when present), brand-tinted.
2. Auto Long-stayer chip (if `daysInKennel >= 30` and not duplicated in manual tags).
3. Manual personality tags from `PetProfile.tags`.

The render layer dedupes case-insensitively against `formatEnergy()` output to handle seed drift (older seeds might have "Calm" manually entered alongside `energyLevel: "low"`).

**Policy strip** — Solo-only / Experienced-handlers-only renders as its own row below tags (shield icon + descriptive text), visually distinct from personality tags. Walker eligibility gates, not personality.

**Recent walkers** — Avatar stack with names below. Derived from posts tagging this dog whose author is a walker at the shelter. Falls back to no row when there are none.

**Posts about [Dog]** — Dog-tagged posts from `getDogPosts(dog.id)`. Empty state when none.

**Backlink to shelter** — `Cared for by Útulek Liběň →` at the bottom, with the shelter logo as a small avatar.

**Unknown-dog graceful state.** Visiting `/dogs/[id]` for an owned-dog id falls back to a polite empty state ("Dog profile coming soon — owned-dog profiles arrive with the Dog Profile phase"). NOT a 404 — the route is real, the content just hasn't landed yet. Post-tag clicks routing to `/dogs/${ownedPetId}` thus degrade gracefully rather than dead-ending.

---

## Posts & content visibility

**Authorship resolution** — Two resolvers in `components/feed/MomentCard.tsx`:

- **`resolveAuthorHref(authorId)`** — author-name link target:
  1. `getShelterById(authorId)` → `/shelters/${id}`
  2. `getUserById(authorId)` → `/profile/${id}`
  3. Otherwise (directory-style walker, no profile bridge yet) → `undefined`, name renders as plain text.

- **`resolveAuthorAvatarUrl(authorId, fallback)`** — author avatar:
  1. `findShelterWalker(authorId)?.avatarUrl` — single source of truth on the walker record.
  2. Falls back to the post's denormalized `authorAvatarUrl`.

Walker avatar lives on `ShelterWalker.avatarUrl` only. Updating a walker's portrait propagates everywhere they appear (Members tab + feed posts) without needing to re-seed `Post.authorAvatarUrl`. Extending the same pattern to supporters, shelter logos, and aggregated cross-shelter walker data is tracked in FC11.

**Shelter feed query** — `getShelterFeed(shelter)` interleaves three post types:
- `post.authorId === shelter.id` (shelter-authored)
- Posts tagged `{ type: "shelter", id: shelter.id }`
- Posts tagged `{ type: "dog", id: <any dog in shelter.dogs[]> }`

Walker-authored walk recaps auto-route into the shelter feed via their dog/shelter tags.

**Walker-led post mix.** Demo seeds 12 posts: 3 shelter-authored, 9 walker-authored. The shelter's own voice is reserved for things only the shelter can say (new dog arrival, long-stayer adoption call, walker recruitment). Day-to-day walk recaps come from walkers tagging the shelter + the dog. This keeps the shelter from having to run a social media account; walkers carry the surface naturally.

**Tag inheritance for shelter dogs.** Shelter dogs use `ShelterProfile.tagApproval` instead of an owner's `UserProfile.tagApproval`. Same inheritance model as owned dogs, different authority. See [[Content Visibility Model]] → tag-approval section.

---

## Dog profile tag taxonomy (interim)

The chip/pill rows on the Dogs-tab card AND the dog profile (`/dogs/[id]`) fall into three categories. V1 ships them visually distinct but the data model is still informal — formalization is FC8 in Future Considerations and lands with the Dog Profile phase.

**1. Auto-derived card chip** — single chip overlaid on the dog card photo, picked by priority. Computed at render time, never stored.

| Chip | Derived from | Visual |
|---|---|---|
| `Adoption pending` | `adoptionStatus === "pending"` | Yellow glass (translucent, backdrop-filter) |
| `New arrival` | `daysInKennel <= 7` | Solid brand fill (event celebration) |
| `Long-stayer` | `daysInKennel >= 30` | White glass (translucent, neutral text) |

Priority order: `pending > new > long > none`. Card displays at most one.

**2. Dog-profile chips** — render all applicable, in this order:
- Energy-derived chip (`PetProfile.energyLevel` → "Calm" / "Easygoing" / "Active" / "High energy")
- Long-stayer chip (if `daysInKennel >= 30` and not already in manual tags)
- Manual personality tags from `PetProfile.tags`

The render layer dedupes case-insensitively against `formatEnergy()` output.

**3. Policy chips (auto-derived)** — `PetProfile.soloOnly` + `PetProfile.experiencedHandlersOnly`. Render as a separate row with shield icon. Different visual role from personality tags because they gate walker eligibility.

**Tag system formalization** — FC8 covers the planned shape: typed enum for personality tags (controlled vocabulary), explicit auto-derive helpers per chip type, and harmonized seed data. Currently mixed for compatibility; clean-up lands with the Dog Profile phase.

---

## Navigation

**Back-as-hierarchy.** Detail-page back navigation goes up a level rather than back through browser history, via `NavigationMemoryContext` (`contexts/NavigationMemoryContext.tsx`). Examples:

- `/dogs/[id]` → up to the dog's shelter Dogs tab (`/shelters/${shelterId}?tab=dogs`)
- `/shelters/[id]` → up to `/home`
- `/communities/[id]` → up to `/home`
- `/profile/[userId]` → up to `/home`
- `/meets/[id]` → up to the parent group's Meets tab if meet has a `groupId`, else `/schedule`

Source-aware backs are wired so that visiting a shelter from `/discover/care` (when that surface lands) routes back to `/discover/care`, not to `/home`. The Context tracks where the user entered from; the detail page reads it.

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
- **Walker credentialing visual escalation.** Tier-coded heavier treatments on the volunteer badge for the top tier. → Same merged phase. See FC9.
- **Shelter operator/admin view.** Dashboard, dog edit affordances, walker application queue, vouching state machine UX. → V3+ pending real shelter conversations.
- **Adopted-dog transition pattern.** Celebration card → archived state → potentially transitioning the profile to a new owner's `UserProfile.pets[]`. → V2.
- **`ShelterEvent` escape valve.** For open days / adoption fairs. Different from Meets (no Familiar marking, no post-meet review). → If/when a real shelter raises the need.
- **Long-stayer treatment depth.** V1 ships a tag chip + sort. Distinct card treatment, profile-level urgency framing, special "Looking for a special home" copy → future Dogs-tab polish pass.
- **Bilingual surfaces.** Útulek Liběň coordinates in Czech; expat community is English-first. Authoring layer that supports both is unusually valuable for shelter onboarding but out of V2.
- **Incident reporting workflow.** Visit reports support flagging in principle; the institutional impact (does the shelter see, does it auto-impact walker tier, does the per-dog policy auto-tighten) is real design work. → Adjacent to §5 Safety & Liability.
- **`ShelterProfile` → `OrgProfile` generalization.** Premature until a second institutional type lands.
- **Per-service visibility on shelter affiliation.** Shelter affiliation could become a third visibility path (alongside Lock, Connection, Group co-membership) for circle-scoped Carer offerings. Open question — not scoped.
- **Promote violet to design tokens.** Inlined hex pair (`#ede9fe` / `#5b21b6`) used in `.shelter-member-chip--volunteer` and `.shelter-summary-card-icon`. Promote together when a third surface picks up violet. See FC11.

---

## Implementation pointers

- **Types:** `lib/types.ts` → `ShelterProfile`, `ShelterPolicy`, `ShelterWalker`, `ShelterSupporter`, `ShelterTeamMember`, `WalkerTier`. Shelter-only `PetProfile` fields documented inline (`soloOnly`, `experiencedHandlersOnly`, `adoptionStatus`, `daysInKennel`, `lastWalkedAt`, `backstory`, `tags`, `intakeDate`, `sex`).
- **Mock data:** `lib/mockShelters.ts` (single seeded shelter — Útulek Liběň, walkers with bridged supporting-cast avatars). Shelter feed posts live in `lib/mockPosts.ts` for unified post querying.
- **Page:** `app/shelters/[id]/page.tsx` (chrome + Feed / Dogs / Members / Gallery tabs + custom `SortMenu` for the Dogs sort dropdown). All inline.
- **Dog profile:** `app/dogs/[id]/page.tsx` (minimal V1; owned-dog fallback to graceful empty state).
- **Components:** `components/shelters/ShelterDogCard.tsx` (Dogs-tab card with auto chip overlay), `components/shelters/ShelterMemberRow.tsx` (Members-tab row with the volunteer badge).
- **Feed integration:** `components/feed/MomentCard.tsx` — `resolveAuthorHref` + `resolveAuthorAvatarUrl` resolve shelter / user / walker author surfaces from a single source of truth.
- **CSS:** `.shelter-detail-*`, `.shelter-intro-*`, `.shelter-meta-row`, `.shelter-summary-card`, `.shelter-sort-trigger`, `.shelter-dogs-grid`, `.shelter-dog-card-*`, `.shelter-member-*`, `.dog-profile-*` in `app/globals.css`. Candidate for design-system consolidation into a generic `.detail-page-shell` (FC4) — added to Design System Cleanup phase scope.
- **`PostTagType` slot:** `"shelter"` added 2026-06-01 as reserved infrastructure; composer doesn't surface a shelter picker.
