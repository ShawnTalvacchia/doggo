---
status: active
last-reviewed: 2026-05-04
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Discover & Care — Walkthrough

Living checklist for Discover & Care. One section per workstream. Each item names where to go (persona + URL) and what to verify. Findings land inline; cross-cutting notes at the bottom.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go. Drop notes inline on items that need follow-up.
4. Anything that needs fixing or a product call lands in the **Findings & follow-ups** section for that workstream.
5. Cross-cutting observations land in **Cross-cutting observations** at the bottom.

**Status legend:** `[ ]` = not yet walked · `[x]` = walked, no issues · `[!]` = walked, finding logged below.

**Available personas:** Tereza (default — Vinohrady connector), Daniel (anxious new owner, locked profile, few connections), Klára (trainer with Care group), Tomáš (Karlín professional), New User. Lenka (vet, new in this phase) is in mock-world data but is NOT a viewer persona — she only shows up as a co-provider on PremiumVet.

**State persistence (2026-05-04):** Conversations, connection overrides, and bookings now persist to localStorage. Refreshes and URL-based persona switches no longer wipe in-progress state — feel free to navigate freely. Need a clean slate? `/demo` page → "Reset demo state" or the matching action in the profile dropdown wipes all `doggo*` keys.

---

## Workstream A — Services-as-Catalog (P44)

- [x] **A1. Tereza → `/communities/group-klara-training`** → **Meets tab.** The "1-on-1 — Runa, threshold work" meet should NOT appear (it's `participants_only` — only the creator and the booked roster see it). Other Klára meets should still be there.
- [x] **A2. Klára → `/communities/group-klara-training`** → **Meets tab.** "1-on-1 — Runa, threshold work" SHOULD appear (Klára is creator + attendee). Spot-check Daniel and Tomáš too — neither should see it.
- [x] **A3. Daniel → `/discover/meets`.** Confirm "1-on-1 — Runa, threshold work" is absent. Sweep filter pills (Walks / Hangouts / Playdates / Training / Following) — it shouldn't surface under any.
- [x] **A4. Daniel → `/profile/klara`** → **Services tab.** Should show 1 Care card (Walks — 300 Kč/visit, with "Group walk" + "Training walk" subservice chips) and 4 Meet cards: "Group training session" (350/session, Weekly, 60 min), "1-on-1 training session" (800/session, By arrangement, 60 min), "Reactive dog session" (600/session, By arrangement, 90 min), "Puppy basics" (400/session, By arrangement, 45 min). Each Meet card carries a format chip (1-on-1 / Small group / Workshop), a cadence chip, a duration chip.
- [x] **A5. Daniel → `/profile/klara`** → tap the **"Group training session"** Meet card's CTA. Should route to `/meets/meet-care-1` (the linked series). The "1-on-1 training session" CTA reads "Ask about this" instead (no `seriesMeetId`) and routes to chat.
- [x] **A6. Tomáš → `/profile/klara`** → tap the **Walks** Care card's "Book a session" CTA. **InquiryFormModal** opens over the Services tab — no navigation. Modal title reads "Ask Klára about care"; form pre-filled with Walks + Group walk + Tomáš's dog (Hugo). X / overlay tap closes without sending. Full inquiry-and-proposal flow is Workstream G — this item just verifies the modal opens with the right pre-fill.
- [x] **A7. Klára → `/profile/klara`** (own profile, Services tab). Both Care and Meet cards render info-only — no Book/See-upcoming CTAs (you don't book yourself).

---

## Workstream B — Care-group hero & multi-provider

- [x] **B1. Daniel → `/communities/group-klara-training`** (single-provider). Hero shows: 1 avatar (Klára, 48px), name "Klára", category badge "Training", tagline (first two sentences from her carer bio), "View profile" button → `/profile/klara`.
- [x] **B2. Daniel → `/communities/group-premiumvet`** (multi-provider — 3 providers). Hero shows: avatar stack of 3 overlapping 40px avatars (PremiumVet, Dr. Nováková, Dr. Štěpánek), name line "PremiumVet, Dr. Nováková + 1 others", category badge "Vet", **NO tagline** (multi-provider hero suppresses tagline — one bio doesn't represent the team). "View profile" routes to `/profile/premiumvet` (the primary provider).
- [x] **B3. Daniel → `/discover/groups`** → spot a Care group card. The "Run by …" line shows the primary provider's name; for multi-provider groups it tails "+ N" (e.g. "Run by PremiumVet + 2"). Single-provider groups show just the name.
- [x] **B4. Daniel → `/meets/meet-care-1`.** The "From [group]" attribution box at the top reads "PremiumVet" or "Klára" depending on the meet's group; for multi-provider groups it appends "+ N".

---

## Workstream C — Appointment-type offerings (vet)

- [x] **C1. Daniel → `/profile/lenka-vet`** → **Services tab.** Two Appointment-type cards: "Annual checkup" (1200 Kč, 30 min) and "Skin & coat consult" (900 Kč, 25 min). Notes render under each. The cards should LOOK distinct from Klára's Meet cards — appointment-type cards don't carry format/cadence chips, only duration. Tapping **"Ask about this"** routes to the Chat tab and **skips the "Say hello" empty state** — the direct conv is auto-created and the message input is **pre-filled** with a templated opener like *"Hi Lenka, I'd like to book the Annual checkup. When works for you?"*. The owner can edit before sending or fire as-is. *(The structured Appointment-type inquiry shape — date/time picker, reason — is deferred to a future Bookings & Monetisation pass; today's pre-filled-draft is the lightweight stand-in.)*
- [x] **C2. Daniel → `/profile/lenka-vet`.** Hero shows Lenka's bio + her trust badges (8 years experience, certified, identity verified — she has a `credentials` block). Confirms the Appointment shape coexists with the badge layer.
- [x] **C3. Daniel → `/communities/group-premiumvet`** → **Members tab.** Lenka should appear as a member (or in the Locked section if visibility cuts that way) — she's a co-provider on the group's `providers[]` but not necessarily seeded as a `members[]` entry. If she's missing from Members tab, that's an expected mock-data gap (not a regression).

---

## Workstream D — Trust signals on Discover

- [x] **D1. Daniel → `/profile/klara`** (hero section, just below the Connect/Familiar pill row). Trust badge strip renders: "Trusted by your network" (if Daniel has any Connected connections who are also Connected to Klára), "Community Regular" (if Klára has 3+ recent meets), "Repeat clients" (12), "Certified trainer", "8 years experience", "Verified identity". Order follows the priority rule (Trusted by Network first). Hover any badge for the detail tooltip.
- [x] **D2. Daniel → `/discover/care` — credential badges on cards.** Each provider card shows up to 2 badges in a compact pill strip below the head row. These are *about the provider* — Community Regular, Certified trainer, Verified identity, etc. Klára's card should lead with the strongest signals (community-earned > credential > platform). Her full set is Community Regular, Repeat clients, Certified trainer, 8 years experience, Verified identity — top 2 render on the compact card.
- [x] **D3. Daniel → `/discover/care` — connection signals on cards.** Below the badge strip: a row of inline icon+text items — *what you and this provider have in common*. "Met at N walks" (if shared meet history), "N in your circle" (mutual connection count), "Your neighbourhood" or "X km away". Sits ABOVE the service tags + blurb (community context before service catalogue).
- [x] **D4. Tereza → `/discover/care`.** Tereza has more connections than Daniel — verify her cards show different / stronger signals (e.g. higher "in your circle" counts on shared-network providers).
- [x] **D5. New User → `/discover/care`.** Cards still render but trust badges may collapse to credential-only (no shared meets, no network overlap). Confirm graceful fallback — no broken layouts when arrays are empty.
- [x] **D6. Daniel → `/profile/lenka-vet`.** Trust strip renders even though Lenka has zero recent meets (Verified Identity + Years Experience + Vet certification should appear). Confirms credential/platform badges work standalone.

---

## Workstream E — Soft Familiar indicator (P29)

The ring is a **Discover-only** affordance — surfaces a few Familiars in a sea of strangers. On meet/group surfaces, relationship is already signaled by sections + labels + CTAs, so the ring is suppressed there (`AttendeeAvatarStack` cleaned up 2026-05-04).

- [x] **E1. Tereza → `/discover/care`.** Familiar marks → brand-outline ring on avatar + "Familiar" chip. Connected → brand-fill chip, no ring. Spot-check both.
- [x] **E2. Daniel → `/discover/care`.** Look for Nikola R. (Letná boarder) — should show ring + Familiar chip. Klára's card → Connected chip, no ring.
- [x] **E3. Klára → `/discover/care`.** Look for Pavel D. (Karlín boarder) — should show ring + Familiar chip. Confirms the ring works on directory-only ProviderCards (no UserProfile bridge), not just bridge-mapped ones.
- [x] **E4. Daniel → any meet detail page** (e.g. `/meets/meet-reactive-spring`). Confirm the avatar stack does **NOT** show the ring on any attendee — the ring is Discover-scoped.

---

## Workstream F — Content + language

- [!] **F1. Empty state on `/discover/care`.** Live trigger blocked — filter panel is unwired (see Open Questions §4 sub-item 5). Design verified by code reading at `app/discover/care/page.tsx` lines 150–162: heart icon, correct community-rooted copy, two secondary `ButtonAction`s routing to `/discover/groups` and `/discover/meets`. Logged 2026-05-04.
- [x] **F2. Tereza → `/discover/care`.** Card copy stays community-toned, not transactional. Trust row reads "in your circle" / "Met at N walks" / "Your neighbourhood" — never "mutual owners." Pricing transparency stays.
- [x] **F3. Daniel → `/discover/care`.** Visual rhythm pass on the card stack (head row, badge strip, trust row, service tags, blurb). Flag anything cramped or unbalanced.

---

## Workstream G — Booking inquiry & proposal flow

Walk as a sequence — each step builds state for the next. Test pairing: **Tomáš → Klára** (no seeded conversation, clean inbox).

- [x] **G1. Tomáš → `/profile/klara` → Services tab** → "Book a session" on Walks card. **InquiryFormModal** opens over the tab (no navigation). Pre-filled from active persona: Hugo (Tomáš's only dog), Walks, Group walk. Frequency defaults to One Time, no days preselected, dates empty. Send button stays disabled until a date is picked. X / overlay closes without sending.

- [x] **G2.** From G1 — switch to Repeat Weekly → pick at least one day (Send stays disabled until ≥1 day). Optional note → "Send inquiry". Brief success state, modal auto-closes. Tap Chat tab → thread shows **InquiryCard** at bottom: "Awaiting response" status pill, service + pet + schedule rows, notes block if added. Card *is* the message. Send also auto-marks **mutual Familiar** between Tomáš and Klára (stop-gap; full inquiry-trust model logged in Open Questions §2).

- [x] **G3. Klára → `/inbox` → Tomáš thread.** Tomáš's row sits at the top (just-now timestamp, viewer-aware unread). His profile is now visible to Klára (mutual Familiar from G2). InquiryCard shows provider variant ("Inquiry from Tomáš" + "Send proposal" button). Tap → **ProposalForm** opens. Verify: summary line (`Walks · Group walk · Hugo · Ongoing`), auto-calculated price (`Walks × 3 visits/week` = 900 Kč), three-line total (subtotal · platform fee 12% · owner pays). Edit a line amount → subtotal updates live. Send → BookingProposalCard appears, InquiryCard flips to "Responded".

- [x] **G4. Tomáš.** Pending proposal shows three actions: **Not now** / **Suggest changes** / **Review & sign**.
  - **Counter:** Suggest changes → form pre-fills → edit amount → send. Original gets "Countered" pill, new pending card appears. Klára sees same three actions (counters both ways).
  - **Decline:** Not now → "Declined" status + soft auto-message.
  - **Accept:** Review & sign → SigningModal → confirm → "Accepted" status + ContractCard.

- [x] **G5. Tomáš → `/bookings` → "My Care".** Pending proposal sits under "Pending" section. After Accept, moves to "Upcoming". Klára → `/bookings` → "My Services" — same booking, her pipeline. Counter updates the same record (no duplicates).

- [x] **G6. Tomáš → `/inbox`.** Klára thread row preview shows ✦ glyph + brand-tinted text per state ("New proposal" / "Proposal accepted" / "Proposal declined" / "Proposal countered"). Compare with a regular text thread — plain grey, no glyph.

