---
status: archived
last-reviewed: 2026-05-02
review-trigger: "Update as items are walked, edit as scope adjusts"
---
# Mock World Building — Walkthrough

Living doc for visual walkthroughs of Mock World Building Workstreams A + B + C. One section per workstream. Each section has a numbered checklist (where to go + what to verify) plus space for findings and follow-ups.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go. Drop notes inline on items that need follow-up.
4. Anything that needs fixing or a product call lands in the **Findings & follow-ups** section for that workstream.
5. Cross-cutting observations land in **Cross-cutting observations** at the bottom.

**Status legend:** `[ ]` = not yet walked · `[x]` = walked, no issues · `[!]` = walked, finding logged below.

**Available personas** (per `lib/personas.ts`): Tereza (default — Vinohrady routine owner / connector), Daniel (anxious new owner, private profile, few connections), Klára (professional trainer with Care group), Tomáš (busy Karlín professional), New User (empty profile). Shawn exists in mock-world data but is NOT a viewer persona — he appears as an attendee/group member other personas encounter.

---

## Workstream A — Data-shape resolutions (P4 / P21 / P28)

- [x] **A1. Tereza → `/profile/olga-m`** (directory-only provider — no `UserProfile`, just a `ProviderCard` in `mockData.ts`). Verify: profile page renders without crashing — `getUserOrProvider` synthesizes a minimal profile from the provider card (name "Olga M.", avatar, district "Prague 5"). Pets/bio/posts will be empty (synthesized profile has no `pets`/`bio`/`carerProfile`) — that's correct, not a regression.
- [x] **A2. Tomáš → `/bookings`** → tap his Petra emergency-care booking → detail page. Verify: renders with Petra's name + avatar. Tapping the carer name navigates to `/profile/petra` (real user, full content because Tomáš is Connected to Petra). The pre-A1 booking carried `carerId: "petra-v"` (a phantom id pointing nowhere); now it's `petra` (canonical user id).
- [x] **A3. Tereza → `/discover/groups`.** Verify: each group card shows "N upcoming events" with sane numbers. Counts may have *decreased* if `Group.meetIds` had drifted from `Meet.groupId` previously — that's correct, not a regression. Cards with no upcoming meets should show no events line.
- [x] **A4. Tereza → `/communities/group-1`** (Vinohrady Morning Crew — she's a member). → **Meets tab.** Verify: lists upcoming meets associated with the group. Spot-check the count against the card on `/discover/groups`.

---

## Workstream B — Visibility distribution (P36)

- [x] **B1. Daniel → `/profile/marek`.** Verify: Private profile state renders — first name only, blurred/dimmed avatar, lock card with copy ("Marek keeps their profile private…"), and a "Learn how privacy works" link below. **No tabs, no posts, no services, no dogs, no relationship CTAs.** Marek used to render Public; now Private unless you have a relationship with him. Same expectation for `/profile/lucie`, `/profile/martin`, `/profile/hana`, `/profile/ondrej`, `/profile/anezka`.
- [x] **B2. Tereza → `/profile/marek`.** Verify: full profile renders — bio, dogs (Benny), shared groups, posts. Tereza is Connected to Marek; connection unlocks visibility regardless of his privacy setting.
- [x] **B3. Daniel → `/profile/jana` and `/profile/eva`.** Verify: both render full profiles even without a relationship. Jana is the Vinohrady cross-cluster anchor; Eva is the Holešovice + Reactive Dog Support anchor — intentionally kept Public.
- [x] **B4. Daniel → `/profile/klara`, `/profile/petra`, `/profile/tereza`, `/profile/nikola`.** Verify: all render full profiles regardless of relationship. Carer-tier visibility is required for service surfaces.
- [x] **B5. Daniel → `/meets/meet-reactive-spring`** → **People tab.** Verify section structure top-to-bottom: **CONNECTED** (Daniel pinned to top, Hana, Klára), **FAMILIAR** (Vítek), **OTHER ATTENDEES** (Petra and other Open profiles), **PRIVATE PROFILES** containing **Marek, Lucie, Jakub, Zuzana** as compact rows (32px avatar, single-line name + dog, "+ Familiar" pill on the right). Pre-rebalance these were a non-actionable chip list — now they're actionable.
- [x] **B6. Daniel → `/communities/group-reactive-dogs`** → **Members tab.** Verify: members grouped CONNECTED → FAMILIAR → **OTHER MEMBERS** → **PRIVATE PROFILES** (compact rows with "+ Familiar" pills). Tap "+ Familiar" on a private member (e.g. Marek) — pill flips to "Familiar ✓". The row **stays in PRIVATE PROFILES** (does NOT promote to FAMILIAR section) because the mark is an outbound grant — Daniel opens up to Marek, but Marek's content stays private to Daniel until Marek reciprocates. Navigate away and back — pill is still "Familiar ✓" (mark persisted via ConnectionsContext) but the transient undo footer is gone (committed feel). Tap "Familiar ✓" again to unmark — pill returns to "+ Familiar". Tap "+ Familiar" on someone in OTHER MEMBERS (an Open profile, e.g. Eva from Daniel's view) — that row DOES promote to FAMILIAR section because Eva's profile is already visible to Daniel.
- [x] **B5a. Daniel → `/profile/marek`** (Private profile. Daniel and Marek share past attendance at `meet-reactive-spring` — that's the shared context). Verify: lock card renders with the privacy copy + a **"+ Familiar" pill below the lock card**. Tap it → pill flips to "Familiar ✓". **Marek's profile stays Locked** — refresh, navigate away, etc., and the lock card persists. (The mark is an outbound grant: Daniel just opened up to Marek, not the other way around. Marek's profile would only unlock if Marek is Open, has marked Daniel back, or they're Connected/Pending.) Tap "Familiar ✓" to reverse → mark removed. **No Connect button** appears even after marking — Connect requires Marek to give an opening signal first.
- [x] **B8. Tomáš → `/profile/filip`.** Verify: lock card renders **without** a "+ Familiar" pill — Tomáš and Filip share **no** groups and **no** past meet attendance, so there's no shared context to act on. Genuine-stranger dead-end: just the lock card + "Learn how privacy works" link. Confirms that the Familiar action is gated on real shared context, not surfaced indiscriminately.

---

## Workstream C — Content density + inbox hygiene

- [x] **C1. Tereza → `/communities/group-tereza-neighbourhood`** (Vinohrady Evening Walkers) → **Feed tab.** Verify: ≥5 posts, mix of authors (Tereza ×2, plus Shawn-as-mock-resident, Lucie, Marek). Marek's earlier-start coordination post has a small comment thread (Lucie + Tereza replying).
- [x] **C2. Daniel → `/communities/group-reactive-dogs`** (Prague Reactive Dog Support) → **Feed tab.** Verify: ≥6 posts. **Eva's cold-weather tip post** ("Quick tip from this week's session…") is visible with comments from Daniel and Hana — Eva is the admin and previously had zero posts in her own group.
- [x] **C3. Klára → `/communities/group-klara-training`** (Calm Dog Sessions) → **Feed tab.** Verify: ≥6 posts. **Hana's gratitude post** ("Six sessions in. Runa walked past a barking Husky…") visible with Klára's reply. Klára's recent training-recap post renders with a photo.
- [x] **C4. Tomáš → `/communities/group-karlin-neighbours`** (Karlín Dog Neighbors) → **Feed tab.** Verify: ≥5 posts, mix of authors (Tomáš, Filip, Adéla, Petra, Ondřej). **Petra's admin announcement** ("Karlín riverside is closed for resurfacing…") is visible.
- [x] **C5. Daniel → `/communities/park-3`** (Riegrovy Sady Dog Walks — Daniel is NOT a member; this tests the **non-member view** of an open-visibility group). Verify: open visibility (no Private/Approval-required pill near the group name), no approval gate. Daniel can see the group's content and a Join CTA without restriction. Drop-in feel — meet cadence chip on cards. ≥3 posts, ≥9 meets in the group. Park-type affordances render.
- [x] **C6. Tereza → `/communities/group-tereza-neighbourhood`.** Verify: private visibility chip near group name, recurring meet pattern (the Vinohrady evening loop on a weekly cadence), Tereza shows as admin in Members tab, description reads in admin's voice (first-person, not third-person about Tereza). *Note: Neighbour-type doesn't have UI affordances meaningfully distinct from Interest-type — both are private/approval scoped groups. The real test here is "an admin-created private group looks coherent from the admin's view." If you want richer type-specific verification, the Park (C5) and Care (C8) tests carry more distinct surface affordances.*
- [x] **C7. Daniel → `/communities/group-reactive-dogs`.** Verify: Interest-type — approval-required visibility, Eva shows as admin. Members tab leans heavily Private (intentional for support-context privacy character).
- [x] **C8. Daniel → `/communities/group-klara-training`.** Verify: Care-type — care category = training, Klára shows as host. Meets carry booking CTAs (price, "Book session" affordance). NO Services tab on the group itself (training category routes services to Klára's profile instead).
- [x] **C9. Daniel → `/profile/klara`** → **Services tab.** Verify: tab visible. Lists training-walk service (300 Kč) and 1-on-1 training (600 Kč). Booking CTA present.
- [x] **C10. Daniel → `/communities/group-klara-training`** → **Meets tab.** Verify: meets in ascending date order, each bookable card shows Book CTA + price + spots-left (one 1-on-1 client session may show no CTA). Switch to **Klára** on the same page — Book CTAs suppressed on her own hosted cards.
- [x] **C11. Klára → `/inbox`.** Verify: ≥4 client threads visible — Daniel P., Filip N., Hana P., plus Shawn T.'s training-booking thread. Each row carries booking context (the dog, the service).
- [x] **C12. Daniel → `/home`.** Verify: feed dominated by Reactive Dog Support activity (Eva's tip, Daniel's own posts, Hana's gratitude post in Klára's group via the group-context gate). Should NOT see heavy Vinohrady content. Tone reads as "anxious owner finding support."
- [x] **C13. Klára → `/home`.** Verify: mix of training recaps (her own + client posts in her care group) + Stromovka regulars' posts. Reads as "professional provider deeply embedded in two scenes."
- [x] **C14. Tomáš → `/home`.** Verify: Karlín-heavy — Petra's admin post, Ondřej's harness post, Adéla's posts, Tomáš's own. Light on personal-posts-from-connections (his Karlín ring posts in groups, not personally). Reads as "Karlín local, low-key user."
- [x] **C15. Tereza → `/home`.** Verify: Vinohrady Evening Walkers content (her own + Lucie + Marek) + Vinohrady Morning Crew + Riegrovy park posts. Reads as "Vinohrady connector running her own group."
- [x] **C16. Daniel → `/home`.** Discovery-gate spot-check: NO accidental Vinohrady-flavored discovery items in his feed. The previously-hardcoded `userNeighbourhood = "Vinohrady"` was the bug; Daniel's feed should resolve to Smíchov (which has no open groups, so Gate 3 returns nothing for him — correct).
- [x] **C17. Klára → `/inbox`.** Verify: every conversation row shows the partner as `FirstName L.` (e.g., "Daniel P.", "Filip N.", "Hana P.", "Shawn T."). No full last names, no first-name-only.
- [x] **C18. Tereza → `/inbox`.** Verify: every row shows the partner's dog inline next to the name (🐾 + dog name). All three threads (Shawn, Marek, Lucie) are direct/social — no service label appears.
- [x] **C19. Daniel → `/inbox`.** Verify: only thread is the Klára training booking. Partner reads as "Klára H." with Bára as the dog name. `FirstName L.` format applied.

---

## Cross-cutting observations

*Things that span multiple workstreams or are general state-of-the-world notes. Add as you walk.*

*(empty)*
