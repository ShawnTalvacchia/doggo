---
status: archived
last-reviewed: 2026-05-11
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Care Catalog Taxonomy & Filter Redesign — Walkthrough

Verification checklist for the Care Catalog Taxonomy & Filter Redesign phase. **This document is primarily for checking** — most decisions, follow-ups, and findings belong in the phase board, Open Questions log, or feature docs. The exception is the **"Decisions surfaced during walkthrough"** section at the bottom.

**Scope rule.** Walkthroughs verify the **phase thesis** — the structural change the phase delivered. Phase thesis here: *Care services resolve to four crisp variants with documented meanings (`walks_checkins` / `house_sitting` / `day_care` / `boarding`); the Discover Care filter panel teaches the trust model — pets, address, sub-services, and service-aware fields are real interactive controls keyed off the viewer + active service pill, not placeholders.* Edge-case permutations (every persona × every filter combo) are not the goal — pick a representative persona per item.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000) — already running.
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Available personas:** Tereza (Vinohrady, **2 pets Franta + Bella** — second pet added 2026-05-11 for the multi-pet capacity walkthrough), Daniel (Smíchov, 1 pet Bára), Klára (Holešovice, 1 pet Eda), Tomáš (Karlín, 1 pet Hugo), New User (no pets, no neighbourhood).

**Bridge state going in:** every `/discover/care` provider already bridges to a real `UserProfile`; per-service pricing, service-aware fields, and the community-first split shipped in Discover Refinement (2026-05-10) and remain intact under the new taxonomy.

---

## Workstream A — Four-service taxonomy resolved (data migration)

Verifies the `inhome_sitting → walks_checkins / house_sitting / day_care / boarding` migration shipped cleanly, including the **sub-service drift normalization** done this turn (9 stale entries — `"Home boarding"`, `"Training walk"`, `"Adventure walk"`, plus the conflated `["Home boarding", "Day care"]` boarding config — collapsed to canonical strings).

- [x] **A1. Tereza → `/discover/care`** → filter pill row reads **All / Walks / House sitting / Day care / Boarding / Appointment**. No `inhome_sitting` legacy label, no `Sitting` (the unparenthesised name) — "House sitting" is the canonical noun.
- [x] **A2. Tereza → tap "House sitting" pill** → results narrow to carers with `house_sitting` configs. Spot-check that the displayed price reads "per visit" (the house-sitting default unit), not "per night". Tereza's own card is excluded (self-exclusion preserved).
- [x] **A3. Tereza → tap "Day care" pill** → results narrow to carers whose home daytime offering is now the peer service. Pavel D., Petr V., Olga M., Markéta H. should all surface (per their bridged `day_care` configs). Their displayed price reads "per visit".
- [x] **A4. Tereza → tap "Boarding" pill** → results narrow to overnight-only configs. Cards display "per night" price unit. **Pavel D.** (formerly stale `["Home boarding", "Day care"]` subServices) still appears in results — the drift normalization emptied his Boarding `subServices` but didn't drop him from the directory.
- [x] **A5. Tereza → `/profile/tereza` → Services tab.** Verifies the carer-side taxonomy on the most-edited persona. Three Care offerings: **Day care 150 Kč/visit**, **House sitting 180 Kč/visit**, **Walks & Check-ins 200 Kč/visit**. No `inhome_sitting` label anywhere.
- [x] **A6. Tereza → `/profile/klara` → Services tab.** Klára's `walks_checkins` config now shows `subServices: ["Group walk"]` (the post-normalization shape — `"Training walk"` was dropped because her training offerings live in separate `kind: "meet"` configs). Confirm her Training meets (1-on-1 + group training) still render in the catalogue alongside the walks.

---

## Workstream B — Filter panel redesign

The phase thesis. Pets + Nearby rows go from placeholders to real interactive controls; sub-services accordion lands; header pattern settles per service; predicates wire to bridged config data.

### B5 — Filters heading + in-panel service-type dropdown (revised 2026-05-11)

The original B5 plan was `{service} · Filters` as a static header. Revised to fold the service scope into a commanding in-panel dropdown so (a) the pill row's mobile overflow goes away while filtering, and (b) the panel becomes self-contained — you can change service scope without closing the panel.

- [x] **B1. Tereza → `/discover/care`** → confirm the page-level pill row is visible (All / Walks / House sitting / Day care / Boarding / Appointment). Tap **Filters** (floating button at bottom). Panel opens; **the pill row hides** while the panel is open. At the top of the panel: a plain **"Filters"** heading (text-xl), with a bordered **service-type trigger** directly below it showing the current scope as an icon + two-line label (service name + descriptive subline) + caret. Starts on "All services / Show every service" with a PawPrint icon.
- [x] **B2. Tereza → tap the service-type trigger inside the panel.** A 6-row menu opens beneath. Each row carries an icon + title + subline that teaches the where/when axes:
  - **All services** / Show every service (PawPrint)
  - **Walks & Check-ins** / Out and about with your dog (Footprints)
  - **House sitting** / Carer comes to your home (House)
  - **Day care** / Daytime at the carer's home (Sun)
  - **Boarding** / Overnight at the carer's home (Moon)
  - **Appointment** / Grooming or training visit (Scissors)
  Active row is highlighted (brand-strong color + tinted background, clipped to rounded corners). Tap **Walks & Check-ins** → dropdown closes, trigger now shows the Footprints icon + "Walks & Check-ins / Out and about with your dog", **panel stays open**, fields below reshape (walk pace + leash policy appear, home setting fields disappear). The B6 service-aware behavior is now reachable without closing the panel.
- [x] **B2a. Tereza → close panel** (tap "View N results"). Pill row reappears at the top. Active pill matches whatever scope was last picked in the dropdown.

### B1 — Pets (real, persisted)

- [x] **B3. Tereza → Filters panel, "Pets" row.** Replaces the prior placeholder ("Lucy, Spot" greyed text). Now reads as a real checkbox row with **Franta** and **Bella** (Tereza's two pets). Toggle Franta on; the box ticks.
- [x] **B4. Tereza → close panel, refresh page (`⌘R`), reopen Filters.** Franta's checkbox is still ticked. Persistence works (`doggo-care-filters-tereza` localStorage key).
- [x] **B5. Tereza → Filters panel, tick BOTH Franta and Bella.** Now tap **"Day care"** pill → results narrow further: any carer whose bridged `day_care` config has `maxDogs < 2` drops out. Most seeded carers have `maxDogs: 2` so they survive; **Lenka S.** with `maxDogs: 1` (lines 1677 / 1694 in `lib/mockUsers.ts`) should disappear from Day care + Boarding pills under this filter. Untick one pet → Lenka S. returns.
- [x] **B6. New User → `/discover/care` → Filters panel.** Pets row shows the empty-state copy: **"Add a dog to your profile to gate by capacity."** No checkboxes, no crash.

### B2 — Address picker (real, with map stub)

- [x] **B7. Tereza → Filters panel, "Nearby" row.** Replaces the prior locked "Vinohrady" tertiary-text placeholder. Now reads as a button **"Home · Vinohrady"** with a caret-down icon, in primary text color (looks affordant).
- [x] **B8. Tereza → tap the Nearby button.** Dropdown opens below it. Two items:
    - **"Home" / "Vinohrady"** — the saved address derived from `viewer.neighbourhood`.
    - **"Pin another place on map…"** — the map-dropper stub (italicised tertiary color, border-top divider). Tap it → dropdown closes (no-op for now; the stub state is acknowledged in the phase board's B2 "even if the map is a stub" note).
- [x] **B9. Tereza → tap "Home" inside the dropdown.** Dropdown closes; the button text stays "Home · Vinohrady" (selection persisted via `filters.addressId`).
- [x] **B10. New User → `/discover/care` → Filters panel, "Nearby" row.** Empty state: **"Add a neighbourhood to your profile to filter by location."** (New User has no `neighbourhood` field seeded.)

### B3 — Sub-services accordion

- [x] **B11. Tereza → Filters panel, "All" pill.** Sub-services row is **not rendered** (would be ambiguous to union across services).
- [x] **B12. Tereza → tap "Walks" pill, reopen Filters.** Sub-services chip row appears between **Time of day** and **Price range**, labelled **"Sub-services"**. Two chips: **Solo walk · Group walk**. Per `SUB_SERVICES.walks_checkins` (post-drift-normalization — no `Training walk` / `Adventure walk` chip).
- [x] **B13. Tereza → switch pills, check the chip set per service:**
    - **House sitting**: Drop-in visit · Full-time care · Special feeding · Medication
    - **Day care**: Special feeding · Medication
    - **Boarding**: Special feeding · Medication
    - **Appointment**: no row (Appointment uses a separate category model)
- [x] **B14. Tereza → House sitting pill, tap "Drop-in visit" chip.** Results filter to carers whose bridged `house_sitting.subServices` include "Drop-in visit". Tereza's own card excluded (self). **Olga M.**, **Markéta H.** should remain (their seeded subServices include "Drop-in visit"); carers without drop-in drop out.
- [x] **B15. Tereza → Boarding pill, tap "Special feeding" chip.** Results narrow to boarders with that sub-service. The carers we normalized (`Pavel D.`, several others whose Boarding subServices became `[]`) drop out — they no longer advertise Special feeding, so they're correctly filtered out. The Discover-directory carers with seeded Boarding `["Special feeding", "Medication"]` are **Markéta H.** and **Lenka S.** — both *would* show, **but** Tereza's two pets are still selected from B5, and Lenka S.'s `maxDogs: 1` filters her out. **Result: just Markéta H.** Untick one pet → Lenka S. returns. Untick the Special feeding chip → the rest of the Boarding directory comes back. *(Petra has a matching boarding config too but doesn't appear in the Discover providers directory, so she's invisible to this filter.)*

### B6 — Service-aware filter shapes

- [x] **B16. Tereza → "Walks" pill, open Filters.** Below Price range, two extra MultiSelect groups render: **Walk pace** (Leisurely / Moderate / Brisk) and **Leash policy** (Always on leash / Off-leash areas OK / Case by case). No "Home setting" / "Has own dogs" / "Has yard" fields. Carer-home dimensions don't apply to walks.
- [x] **B17. Tereza → "House sitting" pill.** No Walk pace, no Leash policy, no Home setting, no Has-own-dogs, no Has-yard. House sitting is at the OWNER's home, so carer-home features are correctly suppressed. Universal fields (Pets / Nearby / How often / Days / Time of day / Sub-services / Price) only.
- [x] **B18. Tereza → "Day care" pill.** Home setting (Flat / House / Ground floor + garden) + two has-own-dogs checkboxes render. No Has-yard (Day care is daytime — yard is only meaningful for overnight stays). No Walk pace / Leash policy.
- [x] **B19. Tereza → "Boarding" pill.** Home setting + has-own-dogs **plus** Has-yard checkbox render. No Walk pace / Leash policy.

### Persistence + reset behaviour

- [x] **B20. Tereza → pick Franta + Home + a Walks sub-service + a walk pace. Switch from Walks pill to Day care pill.** Sub-services + Walk pace + Leash policy reset (they're service-scoped). Franta + Home remain (universal context). Then switch back to Walks — the previously-picked Solo walk + pace should be cleared (resetSubServices on pill change), not restored.
- [x] **B21. Tereza → set up some filters → switch to Daniel via name dropdown.** Daniel's filter state is independent (different localStorage key `doggo-care-filters-daniel`). His Pets row shows Bára, not Franta. Tereza's filter state survives the round-trip — switch back to Tereza and her selections reappear.
- [x] **B22. Tereza → set up filters → navigate to `/demo`, click "Reset demo state".** Returns to Tereza's `/discover/care`; her filters are wiped back to defaults (resetPersistedState picks up `doggo-care-filters-*` keys via the `doggo-*` prefix).

### B4 — Time-of-day decision codified (no UI change)

- [x] **B23. Tereza → Filters panel → "Time of day" row.** Three chips: **Morning / Afternoon / Evening**. Decision was settled at phase open in the `selectedSlots` JSDoc — finer-grained bands would invent data the carer never entered. This item just confirms the UI matches the codified decision.

---

## Decisions surfaced during walkthrough

Emergent decisions, design changes, or rationale that surfaced during verification and need to land in their proper home docs. **Append as you walk** — don't wait until the end. **At phase close, sweep this list** — update each named doc, mark each entry `[x]`. The walkthrough should not be archived until every entry here is processed (or explicitly marked "no doc update needed").

Format:
```
- [ ] **{Decision in one line.}** {Optional one-line context.} → `features/foo.md`
- [ ] **{Implementation-only change}** {What/why.} → no feature-doc update needed
```

- [x] **B6 empty states wired as CTAs (2026-05-11).** Pets + Nearby empty-state divs were styled like inputs but non-interactive — surfaced during the walkthrough. Converted to `<Link>` CTAs routing to `/profile` (canonical editor). Inline add-pet + inline location lookup deferred to punch list P65 — both need real save plumbing / geocoding respectively. → no feature-doc update needed; punch list captures the deferral

<!--
Conventions:
- Each verification item starts with a bold persona + URL anchor so the reader knows where to go without reading the rest.
- Expected outcomes use sub-bullets when there are multiple things to confirm; one-line item otherwise.
- Use `**bold**` for the things that should match, `*italic*` for trigger notes / explanatory copy.
- DO NOT add "Findings & follow-ups" sections to individual workstreams — those belong in the phase board, Open Questions log, or a relevant feature doc. Workstreams are verification-only. The Decisions section above is the ONE place where emergent stuff is captured inline.
-->
