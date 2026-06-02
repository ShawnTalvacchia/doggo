---
status: active
last-reviewed: 2026-06-01
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Shelter Foundation — Walkthrough

Verification checklist for the Shelter Foundation phase. **This document is primarily for checking** — most decisions, follow-ups, and findings belong in the phase board, Open Questions log, or feature docs. The exception is the **"Decisions surfaced during walkthrough"** section at the bottom, which catches emergent decisions in the moment so they propagate to feature docs at phase close.

**Scope rule.** The walkthrough verifies the **phase thesis**: Doggo accepts shelters as a first-class entity, with a complete page chrome and content depth that lets a tester land on Útulek Liběň, browse the dog roster, tap through to a dog, and forget the page didn't exist last week. Verification items focus on what the phase delivered structurally — NOT every edge case, regression check, or cross-persona permutation.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Open `/shelters/utulek-liben` directly. (No nav entry exists yet — by design; cold-start Discover surfaces are a later phase.)
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues. Checkboxes apply to verification items only — the Decisions section at the bottom is a plain log.

**Seed context.** The demo seeds one shelter: **Útulek Liběň** in Libeň (Prague 8). 8 dogs in care (Tonda, Maja, Šimon, Líza, Edda, Káťa, Berta, Theo). 8 walkers across three tiers (1 Trusted Handler, 3 Experienced Walkers, 4 Vetted Walkers). 12 supporters. ~10 posts in the feed (shelter-authored + walker-authored). No bridged demo personas — walkers and supporters are directory-style entries (per scope decision; demo-persona shelter affiliation defers to credentialing-moat phase). Image assets are placeholders reused from the dog-portrait set — visuals won't match descriptions perfectly; a real production seed pass will generate shelter-specific imagery.

---

## Workstream A — Type model

The model is the foundation; verifying it via the running surfaces below proves the types compile and resolve correctly. No separate type-only test surface.

- [ ] **A1. Any persona → `/shelters/utulek-liben`.** Page loads. Shelter info card, dogs-in-care summary card, and post stream render — proves `ShelterProfile`, `ShelterPolicy`, walker + supporter records, shelter-feed query all resolve correctly.
- [ ] **A2. Any persona → `/shelters/utulek-liben?tab=dogs`.** Dogs load with `daysInKennel`, `lastWalkedAt`, `backstory`, and `tags` populated — proves the `PetProfile` shelter-only optional fields shipped.
- [ ] **A3. Any persona → `/shelters/utulek-liben` (Feed tab).** Walker-authored posts show their shelter and dog tags. Tag pills render the `Buildings` icon for shelter tags — proves `"shelter"` slot on `PostTagType` ships without breaking existing tag-rendering surfaces.

---

## Workstream B — Mock data

- [ ] **B1. Útulek Liběň renders with name, location, bio, "Run by the Útulek Liběň team" line, established year (2007), and website + social chips.** Solo-walks policy line ("Solo walks only — even our calmest dogs do best one-on-one") appears in the meta.
- [ ] **B2. Eight dogs surface on the Dogs tab.** All eight names + photos + breed/age/sex lines render. Adoption-status pending pill renders on Káťa's card (the one pending dog).
- [ ] **B3. Eight walkers surface on the Members tab under the Walkers filter.** Tier distribution reads correctly in the sublines: 1 Trusted handler · 3 Experienced walkers · 4 Vetted walkers.
- [ ] **B4. Twelve supporters surface on the Members tab under the Supporters filter.** Each supporter row shows the "Supporter" chip + "Following since {month}" subline.
- [ ] **B5. Mixed shelter-authored + walker-authored posts render in the Feed tab.** At least one shelter-authored post (about a specific dog) and at least one walker-authored walk recap visible. Walker-authored posts tag both the shelter and the specific dog.

---

## Workstream C — Page chrome

- [ ] **C1. `/shelters/utulek-liben` loads without errors.** No 404. AppNav renders the logged-in chrome (Community / Discover / Schedule / Bookings / Profile sidebar on desktop; mobile detail header on small viewport) — proves `/shelters` is on the `loggedRoutes` allowlist.
- [ ] **C2. Hero banner image displays on the Feed tab only.** Logo (rounded-panel square — institutional, Avatar Rule B extension) pulls up to overlap the banner. Name and location subline visible to its right.
- [ ] **C3. Tab bar reads `Feed / Dogs / Members / Gallery`.** Tabs persist via URL: `?tab=dogs`, `?tab=members`, `?tab=gallery`. Refreshing the page keeps the active tab. Feed tab uses no `?tab=` param.
- [ ] **C4. Detail header back arrow + title bar.** Back routes to `/home` (the platform's default landing). Title shows "Útulek Liběň." Bottom nav is hidden — by design; mirrors community-detail behaviour.

---

## Workstream D — Feed tab

- [ ] **D1. Shelter info card displays bio, "Run by" line, established year, solo-walks policy, and social link chips.** Bio reads as a coherent two-sentence statement.
- [ ] **D2. Dogs-in-care summary card reads "8 dogs in care · 5 need walks now · 4 long-stayers."** Tapping the card routes to `?tab=dogs`. Hover state activates on the card.
- [ ] **D3. Feed post stream renders ~10 posts** with shelter-authored and walker-authored interleaved chronologically (newest first). Shelter-authored posts use the shelter logo as the avatar; clicking the shelter name on a shelter-authored post stays on the shelter page (`/shelters/utulek-liben`). Walker-authored posts show their name as plain text (no link — walkers don't have user profiles in V1).

---

## Workstream E — Dogs tab

- [ ] **E1. Single-column photo-led cards.** Each card has a 16:10 hero photo, name + breed/age/sex line below, kennel stats row (days in care, last walked, solo-only badge where applicable), backstory blurb, tag chips.
- [ ] **E2. "Needs walks now" is the default sort.** Berta (never walked yet) appears first, followed by Šimon (8 days ago), then Tonda (5 days ago), then progressively more recent. Theo and Líza (walked today) sort last.
- [ ] **E3. Sort pills switch the order correctly.** "Recently arrived" → Theo first (3 days in kennel). "Long-stayers" → Berta first (120 days), then Šimon (91), Káťa (62), Maja (45) — only the four dogs ≥30 days. "All" → alphabetical: Berta, Edda, Káťa, Líza, Maja, Šimon, Theo, Tonda.
- [ ] **E4. Long-stayer chip auto-appears on dogs ≥30 days in kennel.** Visible on Berta, Šimon, Káťa, Maja. NOT visible on Tonda (27 days — under threshold), Theo (3 days), Edda (14 days), Líza (8 days). Chip uses the warning-subtle background to read distinct from regular tag chips.

---

## Workstream F — Minimal Dog Profile

- [ ] **F1. Any dog card → `/dogs/[id]`.** Hero photo full-width (4:3 aspect), name + breed/age/sex line overlaid at the bottom over a dark gradient. Detail header back button returns to the previous page.
- [ ] **F2. Backstory + three stat tiles render.** Stat tiles: In care (days), Last walked (relative), Weight. Long-stayer subline appears on the "In care" tile for dogs ≥30 days. "Not yet" appears on Berta's "Last walked" tile.
- [ ] **F3. Tags + handling policy display correctly.** Tag chips below the stat tiles. Solo-only / Experienced-handlers-only policy chip surfaces when applicable. Verify on Šimon (Experienced handlers only) and Maja (Solo only) and Berta (both).
- [ ] **F4. Recent walkers section surfaces avatar stack.** Walkers who authored posts tagging this dog appear with their initials avatars + names. Verify on Šimon's profile (Pavel D. walked him recently and authored a tagged post).
- [ ] **F5. Posts about {dog} section renders the dog-tagged feed posts.** Verify on Theo's profile — at least 2 posts (the shelter's arrival post + Helena's first-walk post) should appear. Verify on a dog with no posts shows the empty state.
- [ ] **F6. Shelter backlink at the bottom routes to `/shelters/utulek-liben`.** Shows shelter logo + "Cared for by" eyebrow + shelter name.
- [ ] **F7. Visit `/dogs/spot` (owned dog id).** Renders the graceful "Dog profile coming soon" empty state with a CTA back to the shelter dog roster. NOT a 404 — proves the route degrades gracefully for tags that resolve to owned dogs.

---

## Workstream G — Members tab

- [ ] **G1. Filter pills read `All / Walkers · 8 / Supporters · 12`.** No Team pill (team is empty — by design). Switching a pill filters the list.
- [ ] **G2. Walker rows show "Walker · Útulek Liběň" chip + tier label + walks count.** Verify the eight walkers show consistent rendering. Tier label reads correctly: Trusted handler for Pavel D., Experienced walker for Marie B./Lukáš P./Helena S., Vetted walker for Anna K./Jakub V./Petr H./Karolína M.
- [ ] **G3. Supporter rows show "Supporter" chip (quieter than walker chip) + "Following since {month year}" subline.**
- [ ] **G4. "All" filter sorts by recency.** Recent walkers (Helena S. walked today, Pavel D. walked yesterday) sort above recent supporters. No leaderboard treatment — recency, not walk count.

---

## Workstream H — Gallery stub

- [ ] **H1. Gallery tab renders the empty-state placeholder.** Icon + "Gallery coming soon" title + subtitle pointing at the Photos & Galleries phase. No surface logic — pure chrome stub.

---

## Workstream I — Doc updates

- [ ] **I1. `docs/features/shelters.md` exists and is current.** Covers: account model, page chrome, non-owned dogs, dog profile, walker tier model, anti-scoreboard discipline, posts & content visibility, discovery, deferred items, implementation pointers.
- [ ] **I2. `docs/strategy/User Archetypes.md` includes the Shelter Walker archetype.** Reads as a fifth Ramp 2 entry persona — "different door, same destination."
- [ ] **I3. `docs/strategy/Content Visibility Model.md` documents shelter tag-approval inheritance.** Shelter dogs inherit `ShelterProfile.tagApproval` instead of an owner's setting.
- [ ] **I4. `docs/strategy/Trust & Connection Model.md` has the forward x-ref to shelter walker credentialing.** Cross-references the merged Carer Portfolio + Shelter Walker Credentialing phase.
- [ ] **I5. `CLAUDE.md`** includes the shelter entity principle (institutional, parallel to UserProfile, NOT a Group), the route convention (`/shelters/[id]`), the Avatar Rule B extension (institutional = rounded-panel square), and `features/shelters.md` in the Key Docs table.

---

## Decisions surfaced during walkthrough

A running **log** (not a checklist) of decisions, design changes, or rationale that surfaced during walkthrough discussion. **Append as you walk** — don't wait until the end. Each entry carries a `→ target-doc.md` annotation indicating where the decision needs to land. The phase-close sweep processes each entry by propagating it to the named home doc.

(Add entries below as the walkthrough reveals them.)
