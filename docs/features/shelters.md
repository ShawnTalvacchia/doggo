---
category: feature
status: built
last-reviewed: 2026-06-13
tags: [shelters, institutional-accounts, walkers, dogs, cold-start, photos, mentor-network]
review-trigger: "when modifying shelter surfaces, walker tier model, or non-owned dog handling"
---

# Shelters

Top-level institutional accounts on Doggo. Parallel to `UserProfile` — NOT a Group type. Shipped with the Shelter Foundation phase (closed 2026-06-02) seeded with one demo shelter (Útulek Liběň). Walker journey, credentialing UX, and shelter operator/admin views are deferred to later phases.

See [[Cold-Start Playbook]] (strategic rationale) and [[planning/Open Questions & Assumptions Log]] §14 (resolutions log).

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

The single most distinctive surface on the shelter Members tab. Walkers carry a tier-aware credential pill using the shared three-tier saturation ramp (see [[badges]] → "Credential pill family"):

| Tier | Icon | Label | Threshold (typical) | Visual |
|---|---|---|---|---|
| `vetted` | (none) | `Volunteer` | Default after vouching | T1 — near-white surface, soft border, family-tinted text |
| `experienced` | 🌱 Plant | `Volunteer` | ~10 walks at this shelter | T2 — soft violet fill, strong violet text |
| `trusted` | 🌳 Tree (filled) | `Super Volunteer` | ~25 walks + coordinator sign-off | T3 — dark violet fill, near-white text |

Notes on the label ladder:
- T1 and T2 share the short label `Volunteer`. Earlier "Regular Volunteer" middle name was dropped at the credentialing-moat walkthrough (2026-06-08) — the visual escalation (soft fill + Plant icon) carries the tier signal, so the label can stay short. Only T3 distinguishes (`Super Volunteer`).
- Entry tier is just `Volunteer` (no "New" prefix). "New" implied probationary status.
- Top tier is `Super Volunteer`, not "Trusted." Trust is binary, so "Trusted Volunteer" made the lower tiers sound untrusted by implication.
- T1 dropped its Leaf icon to make the icon-less tier the visual "you've been vouched" baseline; icons start at T2 to signal escalation, not entry.

**Thresholds are suggestions, not gates** (Mentor Network Decision #4, 2026-06-12). Walk counts auto-derive a *suggested* tier, but the shelter holds free promote/demote authority both directions — this is NOT an approval queue, it's an override on the zero-admin default. Persisted as a `tierOverrides` map keyed `(shelterId, userId)` in `WalkerApplicationsContext`; **effective tier = override ?? derived**, threaded through every reader (affiliations, platform tier, mentor-eligibility gate, Members tab, dog-page eligibility). Surfaced as a "(demo)" dots dropdown per Members-row walker; the real operator surface is FC16. Because platform Super Volunteer requires a `trusted` affiliation, the shelter's lever transitively controls platform status + mentor eligibility — demoting a mentor's only `trusted` affiliation revokes their Super Volunteer status and pulls their mentor offerings. Provenance (credited vs platform-logged walks) stays a data-layer fact (`creditedWalkCount`) surfaced only on the future admin view — public rows show the plain total and trust the tier (Decision #6).

**Color: violet `--volunteer-*` family** (in `app/globals.css`). Sits outside the existing semantic ladder (`info` blue = paid care; `brand` green = community) so it reads as its own category: "time given to shelter dogs."

The pill travels cleanly to out-of-context surfaces (user profiles, feed mentions) without needing shelter context appended. A multi-shelter volunteer wears one row per shelter on their profile's Volunteer-work section — see "Volunteer work on user profiles" below.

**Three-axis composition for walk eligibility** (independent of the visible badge):
1. Walker tier
2. Per-shelter policy (`ShelterPolicy.groupWalksPermitted` — some shelters never permit group walks regardless of tier)
3. Per-dog policy overrides (`PetProfile.soloOnly`, `PetProfile.experiencedHandlersOnly`)

Strictest rule wins.

## Volunteer work on user profiles

A user's volunteer standing renders in **two** places (restructured 2026-06-12 — Mentor Network Decision #16, which reverses the 2026-06-09 "no walk-count totals" call):

1. **Aggregate badge in About** — directly under the carer aggregate (`Trusted Carer · N sessions`), a parallel headline credential: **`Super Volunteer · N walks`** (Tree icon, violet tier-3) when the user holds the platform tier, else **`Volunteer · N walks`** (tier-1). N is the **sum of walks across every shelter** (`affiliations.reduce`). The badge renders for any volunteer, carer or not — the About badges block is ungated from `carerProfile`. This aggregate walk total is the deliberate reversal: dropped in 2026-06-09 as "a stat, not a status," it now reads as the volunteer counterpart to the carer's session count.
2. **"Volunteer work" section** — the per-shelter breakdown. One row per shelter the user is vouched at: the credential pill (tier label only — `Volunteer` for T1/T2, `Super Volunteer` for T3) + a context line `at {Shelter name} · N walks`. The section header is plain "Volunteer work" — its earlier Super Volunteer pill + "Recognized at every participating shelter" subline moved UP to the aggregate badge.

For a single-shelter volunteer the aggregate equals the one row; it diverges once someone walks at ≥2 shelters.

The single source for per-shelter affiliation data is `getUserShelterAffiliations(userId, dynamicVouched, tierOverrides)` — combines static `mockShelters.walkers` entries with dynamic `WalkerApplication` records. The portable platform tier comes from `getPlatformVolunteerTier` (`lib/volunteerTier.ts`): cross-shelter walk total + ≥1 `trusted` affiliation → Super Volunteer.

---

## Shelter-walking journey & mentor network

The mechanism that turns shelter walking into a scalable, credentialed trust unlock (Cross-Shelter Mentor Network phase, 2026-06-09 → 2026-06-12). A new walker reaches solo-walking either by **applying directly** or by booking **mentor sessions** with a Super Volunteer; either way the shelter keeps final authority.

### One smart entry — "Walk a dog"

A single state-aware CTA, never competing buttons (Decision #11). It's the action-row slot on the shelter feed AND the "Walk {dog}" button on the dog page:

- **Unverified** → opens `WalkEntrySheet`, a routing sheet offering two paths to verification, mentored-first but not forced: *"New to shelter walking? Walk with a mentor — N sessions, from {price}"* (primary, violet) + *"Walked shelter dogs before? Apply directly"* (free-text application). At shelters that don't `acceptsMentorVouches`, only direct-apply shows.
- **In mentorship** → a violet **split button** (`Book next session` / caret holds demo state-toggles) over a flat, CTA-less progress stepper (Decision #10).
- **Vouched** → a violet **"Walk a dog"** split button (main → Dogs tab; caret → demo toggles) + a `VouchedBadge` (Volunteer credential pill + "You're verified to walk at {shelter}"). Decision #13.

The standalone "See mentors" card and the dog-page mentor upsell are gone — folded into the entry; the mentor stepper renders ONLY mid-mentorship.

### Mentor sessions

A paid, supervised first-walk offering — the **`mentor_session`** service kind (the fourth `CarerServiceConfig` shape; see [[Groups & Care Model]] → Services as Catalog). Offered by Super Volunteers at shelters whose policy `acceptsMentorVouches`.

- **Discovery is list-first and shelter-neutral** (Decision #7). A shelter surface never features a *specific* mentor (that reads as the shelter advertising a favourite); the card is mentor-neutral ("from {min} Kč") with a **See mentors** CTA → `MentorListSheet` → booking sheet locked to the shelter (the shelter was chosen by where you tapped, so no shelter-switcher there; the picker survives only on mentor-profile entry).
- **Booking sheet** (`MentorSessionBookingSheet`, Decisions #8 + #15): a visual progress track toward solo-walker status (numbered nodes + a 🎓 goal); a required **Time of day** picker (Morning/Afternoon — shelter walks are daytime); the layered waiver checklist (below); a flat fixed price (no quote); a neutral rounded `ButtonAction` submit (not the pill CTA). Drops a `booking_confirmation` card into the mentor chat (see [[messaging]]). Booking marks mutual Familiar; the first COMPLETED session marks mutual Connected (see [[Trust & Connection Model]]).
- **Sessions are independent — no pinned mentor, no pinned dog** (Decision #9). The path is a count of N sessions toward the SHELTER's vouch; each can be a different mentor and a different dog. "Book next session" reopens the mentor list every time; the graduation vouch attributes to whoever ran the FINAL session. The dog appears only as a transient ENTRY hook (dog-page CTA + list intro), never persisted — locking one dog works against adoption, where the point is sampling dogs to find the one you'd adopt.
- **Graduation** — completing the shelter's `mentorSessionMinimum` auto-advances the mentee to `vouched`, attributed to the mentor, with a message sent FROM the mentor (shelters can't message yet; O8). At non-accepting shelters, completed sessions render as a "Mentor-recommended · N sessions with {mentor}" credibility line on the standard apply path — mentor work is never wasted, shelter authority never overridden.

### Layered waivers

Two layers, signed by tap (honestly faked — no real legal text):

- **Platform baseline** — identity + emergency contact + general liability, signed ONCE per user (keyed by userId), carries to every participating shelter. The cross-shelter payoff: later bookings anywhere show it pre-signed.
- **Per-shelter waiver** — each shelter's own terms, signed once per shelter (on the `WalkerApplication`).

When both are already signed, the booking sheet collapses the section to a single "Waivers signed — you're cleared…" line instead of re-presenting a checklist. The real document-review + e-sign surface is FC16.

### The walk itself is a Booking

A solo walk is a real `Booking` with `ownerKind: "shelter"` (the shelter is the "owner" party, the walker is the carer) — created from the dog page via `WalkBookingSheet`. It runs on existing Schedule/Bookings + Sessions rails (Start → Finish → visit report); completed walks feed tier escalation. It's volunteer work: price 0, rendered "Volunteer · no charge" (never "0 Kč"). Both mentor sessions and solo walks live on the **Volunteering** tab in `/bookings`, with a violet category accent — see [[explore-and-care]] (Decisions #14 + #15) and [[design-system]] (booking category accent).

### Operator side is stubbed (V3+)

All shelter-admin actions are demo state-toggles per the hidden-affordance pattern: the Members-row kebab carries Promote / Demote (real — effect is immediately visible) + Credit walks / Remove-from-walkers (stub toast — the real flows need the operator count + reason forms). The full operator surface is enumerated in FC16. Decisions #5 + #6.

**Operator-view gate (2026-06-12).** Those kebab controls are demo-gated behind `?admin=1` on the Members tab — without the flag (the default, and what every persona sees) the tab is read-only. With it, the controls render and an "Operator view (demo)" banner sits above the list. This keeps the persona view honest: a supporter like Eliška shouldn't see staff-only tier controls just by opening the shelter. The flag is the stand-in for real role-based access (operator login is V3+ / FC16); it is not a security boundary, just a demo affordance toggle.

---

## Group shelter walk (FC18)

A **mixed community walk** (a Meet, green) where shelter dogs can join — the inviting social on-ramp from [[Future Considerations]] FC18, shipped in the Adoption-Curious Journey phase (2026-06-12). Most attendees bring their own dog; a **vouched** walker can pick up a shelter dog on the way; dogless newcomers come along. Hosted by a Super Volunteer / mentor (Klára), in their care group for discovery. Linked to a shelter via `Meet.shelterWalk?: { shelterId }`; the dog each walker brings rides in the existing `MeetAttendee.dogNames`. Surfaces: a "Shelter dogs joining" summary card on the meet's Details tab (avatar pile + count + a violet "Walk with a mentor" eyebrow link for un-vouched viewers), and the People tab roster, where a dog that resolves on the linked shelter's roster (`getShelterDogByName`) is badged as a shelter dog. Útulek's `groupWalksPermitted: true` is what allows shelter dogs to join; per-dog overrides still gate the genuinely-difficult ones (Berta stays solo).

**Shelters do not list meets or specific mentors on their page** (PO direction 2026-06-12). The shelter page stays: browse dogs → become a supporter → the sign-up / pick-a-mentor flow (`WalkEntrySheet` → shelter-neutral mentor list). A "warm on-ramp" callout that listed this walk on the shelter Feed was **removed** — discovery comes from the community side (the host's group Meets tab, meets discovery, the adoption-curious doorway). Connecting meets to shelter pages is a deliberate "maybe later."

**How a brought shelter dog connects — current state vs intended.** Today the link is **display-only and name-resolved**: an attendee row with `dogNames: ["Nora"]` is badged because the name matches the shelter roster at render time. It does **not** create a `Booking`, log a walk, touch the dog's walk count / `lastWalkedAt` / tier, seal a visit report, add the walker to "recent walkers," or trigger the advocacy "Share a moment" — all of those run off the **solo** shelter-walk `Booking` rails (the "Walk a dog" flow), not the group walk. For the demo this stays **instructed** (the meet description explains it) + the roster lists the dog. **Intended design** (not built): a brought shelter dog is the existing **shelter-walk `Booking`** (vouched-gated, waivers, shelter sign-off, checkout record) **linked to the meet occurrence** — the same `Booking.dropoffMeetId` linkage config #2 uses (Filip books Klára so Toby rides along on the Stromovka walk). That keeps every party on the surface they already own — walker RSVPs (community) + books the dog (credentialed flow); the shelter releases the dog through its own booking flow, not a meet-side picker — and the booking captures the walk for tier / report / advocacy "for free." An in-meet dog-*picker* (self-serve selection inside the Meet) is explicitly **not** the direction: it needs a new availability/checkout model and quietly bypasses the shelter. See [[planning/Open Questions & Assumptions Log]] (group-walk shelter-dog connection model + checkout — FC18 tension #2).

---

## Adoption funnel & transition

The full path from interest to a home (Adoption-Curious Journey, Workstreams E + G, 2026-06-12). Replaces the old stub `Adopt {dog}` CTA (which just routed to the shelter).

**The funnel (E).** `Adopt {dog}` opens `AdoptInquirySheet` — a state machine with **non-failure off-ramps**, not a binary commit:
- **No-obligation framing up front** (interest ≠ adopting — the #1 documented friction).
- **Escalation ladder** — walk → repeat → sleepover/foster → adopt, each a graceful place to stop; returns framed as welfare-positive ("never a failure").
- **Shelter-curated meet-and-greet** — interest routes to the shelter, which arranges the meeting; no auto-match (matches shelter authority).
- Stages persist via the demo override `useAdoptionStore` (dogId → `interested | pending | adopted`); shelter-side advances are honest state-toggles (real operator surface = FC16). `pending` surfaces the "Adoption pending" hero pill (solid violet) + a matching glass-violet card chip on Discover / the shelter Dogs tab — both color-coded to the shelter / adoption-journey violet accent (the mentor link, doorway card, credential pills). While pending, the dog is spoken for: the **Walk and Adopt actions are both suppressed** (a quiet "Adoption in progress — {name} is getting to know their family-to-be" line stands in for the buttons), and the duplicate "Adoption pending" auto-chip is dropped from the dog-page tag row (the hero pill is the single source). Honors seed-pending dogs (e.g. Káťa), not just demo overrides. `adopted` → green, the celebration below. The **primary** finalize is the **network adopter** (tied to the walk-recap commenter — the advocacy loop closed); self-adopt is secondary, per the research (community exposure is the proven engine).

**The transition (G) — frozen "Adopted" profile.** On adoption the dog's profile becomes a **frozen, on-platform "Adopted" profile** — a hand-off, not a delete, working for any adopter (off-platform or on-platform) with **no migration**:
- Dog page: green **Adopted** pill, Walk/Adopt actions suppressed, shelter-context auto-chips shed (Long-stayer/New-arrival/Adoption-pending; energy + personality tags stay), care stats hidden, "Happy endings" celebration banner. Tagged walk recaps still resolve to her.
- Shelter Dogs tab: she leaves the active grid into a **"Happy endings"** subsection (Adopted chip, no kennel stats).
- Discover Help a Dog: excluded from the walkable roster. Feed "dogs in care" counts exclude her.

**Deferred (PO call 2026-06-12, option 1):** the **take-over** path — an on-platform adopter continuing the profile as their *own* dog. That's the genuine cross-container migration (touches the owned-vs-shelter resolver + every `UserProfile.pets[]` read) plus the real cross-account **claim/consent flow**, so it waits for a later phase rather than being half-faked. Resolved model + branches (fresh-start vs take-over, authorship-vs-ownership) live in [[planning/Open Questions & Assumptions Log]] → "Adopted-dog transition pattern."

**Implementation:** `lib/useAdoptionStore.ts` (persisted stage override), `components/shelters/AdoptInquirySheet.tsx`, dog-page adopted rendering in `app/dogs/[id]/page.tsx`, `ShelterDogCard` `adopted` prop, Dogs-tab "Happy endings" split + Discover/Feed exclusion.

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

Lives at `/dogs/[id]`. Shipped (Dog Profile phase, 2026-06-03) for both shelter dogs and owned dogs from a single page that branches on the resolver. Shelter dogs get the original spine (Shelter Foundation 2026-06-02); owned dogs get the same spine with shelter-only sections suppressed (stat row, recent walkers, shelter backlink) and an owner-side edit affordance.

**DetailHeader title.** Owned dogs render **"← {firstName}'s Dogs"** — attributes the dog to its owner and frames the page as part of that owner's territory. Multi-dog owners get a sibling `TabBar` below the header (`Franta | Bella`) so visitors can switch siblings without going back through the owner profile. Shelter dogs keep the dog's name as the title (no equivalent grouping concept).

**Owner edit affordance** (Workstream G, 2026-06-03). When viewer === owner, an Edit button surfaces in the page-action slot. Tap → swaps to Cancel + Save chrome and locks the nav (`navLockedIn: true` via `PageHeaderContext`). Renders `PetEditCard` as the body. Delete (Trash in PetEditCard's summary row) routes back to `/profile`. Shelter operator editing on shelter dogs is V3+ (see deferred items below).

**Hero** — Side-by-side card pattern (refactored Dog Profile phase, 2026-06-03). 200px rounded-square photo (Avatar Rule B — dogs are squares) left + 12px padding wrap, name (text-3xl heading) + meta line (`breed · sex · age · weight`) + tag chips on the right column. `Adoption pending` status pill sits inline beside the name when applicable. Replaced the earlier full-bleed 4:3 hero, which stretched square-source pet portraits awkwardly. Same shape across shelter + owned dogs.

**Tag row in hero.** Auto-derived chips + personality tags render inside the hero's right column (moved from the next section, 2026-06-03). Order: auto chips (Adoption pending > New arrival > Long-stayer > energy) → typed personality tags. Render helpers: `lib/petUtils.ts:deriveAutoTags` + `lib/constants/dogs.ts:PERSONALITY_TAG_LABELS`.

**Stat row** — Hairline strokes top + bottom (border-top + border-bottom on the row container), NOT card chrome. Two stat tiles in a 2-column grid (`In care` + `Last walked`), each with icon + label inline + larger value below. Only renders while the dog is in active shelter care (`adoptionStatus !== "adopted"` AND shelter context present). Owned dogs hide it entirely.

**Policy strip** — Solo-only / Experienced-handlers-only renders as its own row below the hero (shield icon + descriptive text), visually distinct from personality tags. Walker eligibility gates, not personality. Shelter dogs only — derived via `derivePolicyChips`.

**Standing preferences** — "How {Dog} likes to be cared for" section between the about/operational block and Health. Four label + text-with-separator rows (Likes / Dislikes / Triggers / Play). See [[features/profiles]] → Standing preferences for storage shape + edit affordance.

**Health (Vaccines V1)** — Syringe-prefixed vaccine chips list (`Rabies · Aug 2025`, etc.) + acknowledgement caption ("Confirmed by {acknowledger} on {date}"). Shelter dogs use the shelter as the acknowledger; owned dogs use the owner's first name. See [[features/profiles]] → Vaccines V1.

**Recent walkers** — Avatar stack with names below. Shelter dogs only. Derived from posts tagging this dog whose author is a walker at the shelter. Falls back to no row when there are none.

**Highlights strip** — Renders above the Posts section when `dog.highlights` is non-empty. Owner-curated horizontal scroll; "See all" opens a full grid modal. Tappable thumbnails open the lightbox in "Highlights mode" — carousel scopes to the highlights themselves (each URL resolved globally so cross-author entries work), within-post nav hidden. Reorder + unpin via Edit Highlights modal (pencil affordance on the strip header). Add via the per-post kebab → "Pin to {Dog}'s Highlights" — universal (any viewer can pin photos from any author's post, since Highlights is about the curator's surfaces, not authorship).

**Posts** — Single section combining the per-dog auto-album + the chronological feed (Photos & Galleries 2026-06-04, after the unification with owner profile's PostsTab). Uses the shared `PostsCollectionView` — List ⇄ Grid view toggle in the header, tag-type filter pills (+Filter pattern). Viewer-gated via `getPostsByDog(dogId, viewerId)`. Owner-side per-dog settings (Auto-approve, View hidden, Clear pinned) live in a gear icon next to the section title. Per-post actions (Pin to {Dog}'s Highlights, Hide from {Dog}'s album, Untag, Report, Block) live in the per-post kebab on every card / lightbox header — see [[features/profiles]] → "Per-post kebab menu" for the unified action surface spec.

For shelter dogs, `ShelterProfile.tagApproval` is the authority instead of an owner's `UserProfile.tagApproval` — same inheritance model, different authority. V1 enforces it read-only (no shelter operator moderation UI; that's V3+).

**Backlink** — Shelter dogs: `Cared for by Útulek Liběň →` with shelter logo (circle avatar — institutional entity). Owned dogs: owner backlink reads "Your dog · You" for self or "Lives with {Owner Name}" for cross-persona view, with owner avatar (circle — person).

**Locked owned-dog state** — When the owner's profile is locked AND the viewer has no Familiar/Connected/Pending relationship, the dog profile renders a lock empty state (lock icon + "{Dog}'s profile is private" title + "Connect with {owner} at a meet…" subtitle + **"View {firstName}'s profile"** action button routing to `/profile/{ownerId}`). The action button is the connection path — the dog's lock derives from the owner's lock, so meeting the owner is the only path through. No additional privacy leak: the owner's profile honors its own lock when visited.

**Unknown-dog graceful state.** Visiting `/dogs/[id]` for a non-existent id falls back to a polite empty state ("Dog profile not found") with a CTA back to the shelter roster. NOT a 404 — the route is real, the content just doesn't resolve.

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

## Dog profile tag taxonomy

Formalized in the Dog Profile phase (2026-06-02 — FC8 closure). Three categories with explicit code separation: auto-derived chips computed at render time, curated personality tags from a typed vocabulary, and policy chips derived from per-dog flags. Helpers live in `lib/petUtils.ts` (`deriveAutoTags`, `derivePolicyChips`); vocabulary lives in `lib/constants/dogs.ts` (`PERSONALITY_TAG_LABELS`, `PERSONALITY_TAG_PICKER_ORDER`).

**1. Auto-derived chips** — computed at render time via `deriveAutoTags(dog, today)`. Never stored. Order is render-priority:

| Chip | Derived from | Tone | Dog-profile renders | Shelter-card renders |
|---|---|---|---|---|
| `Adoption pending` | `adoptionStatus === "pending"` | `pending` | yes | yes (highest priority chip — yellow glass) |
| `New arrival` | `daysInKennel > 0 && daysInKennel <= 7` | `new` | yes | yes (solid brand fill) |
| `Long-stayer` | `daysInKennel >= 30` | `long` | yes | yes (white glass) |
| *energy-derived* | `energyLevel` (`low → Calm` / `moderate → Easygoing` / `high → Active` / `very_high → High energy`) | `energy` | yes | no — energy chips never appear on the shelter Dogs-tab card |

Shelter Dogs-tab card takes the first non-energy chip. The dog profile renders all.

**2. Personality tags** — typed `PersonalityTag` vocabulary stored in `PetProfile.personalityTags?: PersonalityTag[]`. Owner-authored (PetEditCard picker) or shelter-seeded. Replaces the previous free-text `PetProfile.tags: string[]`.

Vocabulary (17 entries — extend in `lib/types.ts:PersonalityTag` + `lib/constants/dogs.ts:PERSONALITY_TAG_LABELS`):

`affectionate` · `calm` · `smart` · `shy` · `playful` · `independent` · `gentle` · `loves-walks` · `good-with-strangers` · `good-with-kids` · `good-with-dogs` · `selective-with-dogs` · `reactive-on-leash` · `wary-of-strangers` · `needs-basics` · `senior` · `puppy`

Curation rules (enforced by review):
- Behavioural / disposition descriptors only.
- NO auto-derivable state (Long-stayer, New arrival, Adoption pending, energy-level) — those compute from data.
- NO policy chips (Solo-only, Experienced-handlers-only) — those come from `derivePolicyChips`.
- NO size chips — size sorts the Dogs tab; a redundant tag adds noise.

Edit affordance: PetEditCard's Personality section carries the multi-select chip picker (owned dogs). Shelter operator authoring lives at the shelter-operator surface (V3+).

**3. Policy chips** — auto-derived via `derivePolicyChips(dog)` from `PetProfile.soloOnly` + `PetProfile.experiencedHandlersOnly`. Render as a separate row with a shield icon, visually distinct from personality tags because they gate walker eligibility.

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

The **Help a Dog Discover door** ships at `/discover/help-a-dog` (2026-06-08, fourth Ways In door). The hub card on `/discover` uses the `HandHeart` icon and the copy "Walk shelter dogs nearby and meet your local rescue."

The door surface uses a `FilterPillRow` view toggle:

- **Dogs pill (default)** — photo-led 2-up grid of all shelter dogs across all seeded shelters (mirrors the shelter Dogs tab's `.shelter-dogs-grid` formula — `repeat(auto-fit, minmax(220px, 1fr))`). Reuses `ShelterDogCard` with the `shelter` prop set so each card renders a small attribution row (logo + shelter name + location). Sort dropdown mirrors the shelter Dogs tab: `Needs walks now` (default) / `Longest in care` / `Smallest first` / `A–Z`. Filter panel (behind the Filters float button): dog size, energy level, adoption status, personality (subset of the `PersonalityTag` vocabulary — `gentle / good-with-strangers / good-with-dogs / good-with-kids / loves-walks / puppy / senior / calm` — picked as adopter lenses; eligibility-flavored tags like `reactive-on-leash` deliberately excluded).
- **Shelters pill** — single-column list of `DiscoverShelterCard` rows (banner + circular logo overlap + name + `location · dogs in care · X need walks now` meta). Tap routes to `/shelters/[id]`.

**Shelter-membership elevation (credentialing-moat 2026-06-09).** Two elevation reasons sort dogs + shelters by priority — NOT via section headers, just stable sort within each pill's primary sort:

1. **Shelters you walk at** (priority 2) — your home base. Computed from your own vouched `WalkerApplication` records.
2. **Shelters your circle volunteers at** (priority 1) — social-proof hook. Computed from vouched applications belonging to your Connected connections.
3. Everything else (priority 0).

Applied as a stable secondary sort on top of the user-chosen primary sort (`Needs walks now` / `Longest in care` / etc.), so dogs from elevated shelters float to the top within their primary-sort bucket. No section headers — the original O5 framing considered them but dropped during walkthrough: empty sections read as broken, and the "different sections" structure overstates a signal that's really just "this shelter is closer to your network."

**What was deliberately NOT built:** per-dog walker-relationship elevation ("Dogs you've walked," "Dogs your circle walked"). The per-dog signal is thin — shelter dogs don't belong to walkers, and the same content surfaces more naturally at the shelter level. A small inline meta-label on elevated cards explaining the reason (`Klára volunteers here` / `You walk here`) is specced but deferred as polish — sort works; the inline label is a future enrichment pass.

Three shelters seeded at this phase to make "browse rescues" earn its keep — Útulek Liběň (full roster), Pes v nouzi (thin), Druhá šance (thin). The two thin shelters have empty walker + supporter rosters and one shelter-authored post each; their `/shelters/[id]` pages use the same chrome with content-aware empty states (see "Thin-shelter rendering" below).

Source-aware back: `/shelters/[id]` reached from `/discover/help-a-dog` returns to the door via the existing source-aware `lastListPath`. `/dogs/[id]` for a shelter dog uses a two-signal rule:

1. If the **immediately previous URL** (`previousPath`) starts with `/shelters/`, the viewer was inside the shelter context — return to the shelter Dogs tab (tree-hierarchy default wins).
2. Else if `lastListPath` starts with `/discover/`, the viewer came directly from a Discover surface — return there.
3. Otherwise tree-hierarchy default.

`previousPath` is a new field on `NavigationMemoryContext` (2026-06-08) that tracks the immediately-previous full URL including detail paths — `lastListPath` alone can't disambiguate "Discover → dog directly" from "Discover → shelter → dog" because shelter detail visits don't update list memory.

Other entry surfaces still work:
- Direct URL (`/shelters/utulek-liben`, `/shelters/pes-v-nouzi`, `/shelters/druha-sance`)
- Author link on a shelter-authored post
- The `shelter` tag pill on a tagged post

### Thin-shelter rendering

Three small adjustments on `/shelters/[id]` so the chrome doesn't read as broken with an empty walker roster:

- **Meta row** — the `N walkers, M supporters` line hides entirely when both counts are zero, and renders just the populated side when only one is zero.
- **Members tab empty state** — when `walkers + supporters === 0`, the title becomes "Walkers and supporters coming soon" and the subtitle uses the shelter's name plus a forward-looking line about how walkers join (instead of "Switch the filter to see walkers or supporters," which implies switching to a populated view that doesn't exist).
- **Team filter** — was already conditionally hidden when `team.length === 0`; the staff-linking line in the Walk-a-dog sheet was already shelter-agnostic via `${shelter.name}`.

---

## Deferred for later phases

Items named in §14 but explicitly out of scope for Shelter Foundation:

- ~~**Walker journey.** Booking a walk, active session, visit-report attaching back to a dog.~~ → **State machine + tier escalation shipped 2026-06-09** (Carer Portfolio + Shelter Walker Credentialing phase). Booking creation surface for shelter walks (Schedule integration + visit reports attaching to the shelter dog) **shipped 2026-06-12** (Cross-Shelter Mentor Network — `WalkBookingSheet` + `ownerKind: "shelter"` Bookings; see "Shelter-walking journey & mentor network" above).
- ~~**Walker credentialing visual escalation.** Tier-coded heavier treatments on the volunteer badge for the top tier.~~ → **Shipped 2026-06-09** via the shared three-tier credential-pill family. See [[badges]] → "Credential pill family."
- **Shelter operator/admin view.** Dashboard, dog edit affordances, walker application queue, vouching state machine UX. → V3+ pending real shelter conversations.
- **Adopted-dog transition pattern.** Celebration card → archived state → potentially transitioning the profile to a new owner's `UserProfile.pets[]`. → V2.
- **`ShelterEvent` escape valve.** For open days / adoption fairs. Different from Meets (no Familiar marking, no post-meet review). → If/when a real shelter raises the need.
- **Long-stayer treatment depth.** V1 ships a tag chip + sort. Distinct card treatment, profile-level urgency framing, special "Looking for a special home" copy → future Dogs-tab polish pass.
- **Bilingual surfaces.** Útulek Liběň coordinates in Czech; expat community is English-first. Authoring layer that supports both is unusually valuable for shelter onboarding but out of V2.
- **Incident reporting workflow.** Visit reports support flagging in principle; the institutional impact (does the shelter see, does it auto-impact walker tier, does the per-dog policy auto-tighten) is real design work. → Adjacent to §5 Safety & Liability.
- **`ShelterProfile` → `OrgProfile` generalization.** Premature until a second institutional type lands.
- **Per-service visibility on shelter affiliation.** Shelter affiliation could become a third visibility path (alongside Lock, Connection, Group co-membership) for circle-scoped Carer offerings. Open question — not scoped.
- **Promote violet to design tokens.** ~~Inlined hex pair~~ — promoted to `--volunteer-*` family during credentialing-moat phase (2026-06-09) when the saturation-ramp pill family landed. Remaining: audit any straggling inline hex.

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
