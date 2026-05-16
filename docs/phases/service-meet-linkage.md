---
status: active
last-reviewed: 2026-05-14
review-trigger: When opening; when build-time questions resolve mid-phase
---

# Service ↔ Meet Linkage

> **Status: active (opened 2026-05-13).** Sketched 2026-05-13 during Profiles Deep Pass walkthrough on C7a, after the gap surfaced: Klára's 4 seeded Meet-type services exist nowhere in any edit UI, and the prior "managed separately" framing implied a management surface that was never built. The model is locked (Open Q §13); the phase is the implementation. **Read Open Q §13 before opening — the four canonical configurations, cardinality, mixed-roster UX, and discovery cross-surfacing are pre-decided. The phase builds toward them; it doesn't re-litigate them.**
>
> **Parallel-work status (updated 2026-05-14):** Profiles Deep Pass **closed** — Workstream B (Service authoring UI, `ProfileServicesTab.tsx`) is **unblocked**, no longer gated. Workstreams A–G are all open in any order.
>
> **Coordination with Demo Narrative & Personas** (`phases/demo-narrative-and-personas.md`, active in a parallel session). The two phases collide on **Klára** — she's this phase's demo payload AND a likely Demo Narrative POV. Three touchpoints:
> 1. **Klára's catalog — this phase is the source of truth.** A4 reclassifies `klara-1on1` (Meet → Appointment) + adds a puppy-basics cohort meet. Demo Narrative W2.6 audits Klára's catalog; it reads our A4 outcome as-is, doesn't pre-empt it. Land A4 cleanly so Demo Narrative has a stable catalog to audit.
> 2. **Anchor event.** Demo Narrative W1.1 picks a narrative anchor and may land on a Klára training meet. This phase reshapes those meets (new `linkedServices` field + required flag) and adds the puppy-basics meet — Demo Narrative reads our final `mockMeets.ts` meet set before finalizing the anchor.
> 3. **Daniel.** Demo Narrative W2.4 may rewind Daniel to a sparser pre-booking snapshot — which removes his Klára training booking. Workstream G3 here uses Daniel as an owner-side booking viewer. If Daniel gets rewound, G3 needs a different owner persona (Tomáš works). Don't hard-depend G3 on Daniel's current booking state.
>
> **File-overlap danger zone with Demo Narrative W3:** `mockMeets.ts` (both add meets) + `mockUsers.ts` (this phase edits Klára's `carerProfile.services`; Demo Narrative adds new persona objects + maybe edits Daniel). Demo Narrative W3 is sequenced to wait for this phase's Workstream A to land, so the data-model migration is stable first.

**Goal:** The carer authors all their paid offerings — Care AND Meet-type — in one place, the Services tab edit. Meet-type services link to one or more of the carer's hosted meets. Owners tap "Book" from either surface (carer's Services tab OR meet detail page) and route through the same booking flow; the booking creates the right records and updates the meet's roster when linked. The "managed separately" lie disappears from the product. Klára's training-session catalogue (her primary cold-start carer offering) becomes editable, demoable, and structurally consistent with her Care services.

**Thesis:** Services are the source of truth for "what I sell." Meets are the schedule/roster mechanism that some services use. The Service is the monetization wrapper (price, modifiers, notes, audience); the Meet, when linked, owns the operational fields (location, cadence, roster, RSVP rules). One service → N possible meet links — the same product can be offered at multiple scheduled times without duplicating the service entry. The phase implements the linkage model the user's mental model already assumes.

**Depends on:**
- **Profiles Deep Pass** (closed 2026-05-14) — the Services tab edit surface that this phase extends, the Care-offering picker pattern, the "Offering care" view-mode summary card.
- **Care Catalog Taxonomy & Filter Redesign** (closed 2026-05-11) — `CarerServiceConfig` discriminated union, `SUB_SERVICES` map, four-service Care taxonomy.
- **Discover & Care** (closed 2026-05-04) — `CarerServiceConfig` Meet kind, `seriesMeetId` link, view-mode rendering of Meet-type service cards.
- **Open Questions §13 resolutions** — four canonical configurations, service-as-wrapper, one-to-many cardinality, mixed-roster UX, cross-surface discovery.

**Refs:** [[Open Questions §13]], [[Groups & Care Model]] → "Service ↔ Meet linkage" subsection, [[features/explore-and-care]], [[features/meets]], [[features/profiles]], [[Cold-Start Playbook]] (trainers are the anchor carer type — this phase makes their offering manageable).

**Not in scope:**
- **Carer Portfolio aggregate badge** (sibling phase, `docs/phases/carer-portfolio.md`, draft). Different concept — that phase aggregates completed-engagement records into a trust signal ("30 completed sessions"). This phase is about authoring + linkage; they don't block each other.
- **Auto-pricing engine extension to Meet-type services.** Meet services stay flat `pricePerSession` for now. The `computeQuote` engine (holiday / weekend / multi-pet / last-minute modifiers) is Care-only. Extending it to Meet-type services is a follow-on — Open Q §13 has the question logged.
- **Full Discover/care vs Discover/meets cross-surface filter de-duplication.** Required-service meets appear in `/discover/meets` with a price chip; Meet-type services appear in `/discover/care` with schedule info. Filter result counts may double-count records that match both surfaces — that's a refinement, deferred. Open Q §13.
- **Free → paid upsell mid-meet** (owner joined free, decides mid-meet they want the service). Flagged but deferred to a later phase.
- **Photo gallery integration on linked meets** (photos posted at a service-linked occurrence flow to the booking's Visit Report) — Photos & Galleries phase scope.

---

## Opening Checklist

Complete before writing any code.

- [ ] Read Open Q §13 in full + the "Service ↔ Meet linkage" subsection of `Groups & Care Model.md`
- [ ] Read every task and its referenced docs
- [ ] Confirm Profiles Deep Pass closed (the Services edit surface this phase extends is stable)
- [ ] Re-read `lib/types.ts` → `CarerServiceConfig` discriminated union — understand the existing `kind: "care" | "meet" | "appointment"` shape before extending
- [ ] Audit Klára's seeded data — 4 Meet services exist (`klara-group-training`, `klara-1on1`, `klara-reactive`, `klara-puppy-basics`) with `seriesMeetId` fields. Confirm those Meet IDs exist in `mockMeets.ts` and the linkage is bidirectionally consistent
- [ ] Decide naming: `seriesMeetId` (current, singular) stays for one-to-one historical, OR migrate to `linkedMeetIds[]` (plural, supports one-to-many). The cardinality rule says many — migration likely needed. Flag at A1.
- [ ] Confirm scope — no scope leak into Carer Portfolio (aggregate trust signal), full Discover filter dedup, or auto-pricing engine extension

---

## Tasks

### Workstream A — Data model + mock migration

The foundation. The existing `CarerMeetServiceConfig` carries a singular `seriesMeetId`; the model wants `linkedMeetIds[]`. Mock data needs to follow. Without this the rest of the phase can't lean on the linkage.

**Opening decisions (2026-05-13):**
- **A1 cardinality (two-sided shape).** Carer-side `CarerMeetServiceConfig.linkedMeetIds: string[]` is authoritative for "what I sell, where it runs." Meet-side `Meet.linkedServices: { serviceId: string; required: boolean }[]` carries the link properties — `required` lives on the Meet because it's a meet-level RSVP-gate property (determines whether the free RSVP CTA collapses). This collapses A2 + A3 into one normalized model. Helper `getServicesLinkedToMeet(meetId)` reads from the Meet side. A2's "mirror" framing replaced with "two-sided join" framing.
- **A4 Klára seed strategy.** `klara-1on1` reclassifies from `kind: "meet"` → `kind: "appointment"` with `appointmentCategory: "training"` (pre-existing taxonomy drift: 1-on-1 = solo + scheduled = Appointment per §13's roster test, not Meet). Moves to the appointment shape; no Meet created for it. Fleshes out the `"training"` Appointment variant that previously had no seeded data (partial fulfillment of P64). `klara-puppy-basics` gets a new seed Meet — a recurring weekly puppy-basics cohort — and links via `linkedMeetIds[]`. Net result: Klára becomes a complete demo of all three service kinds (Care · Meet · Appointment).

| # | Description | Status |
|---|-------------|--------|
| A1 | Migrate `CarerMeetServiceConfig.seriesMeetId` (singular optional) → `linkedMeetIds: string[]` (array). Update `lib/types.ts` JSDoc to spell out: "Meets this service is offered on. One-to-many — same service can run on multiple meets (e.g. a 'Group walk' service offered on Tuesday + Saturday walks)." Backfill mock data: `seriesMeetId: "meet-care-1"` → `linkedMeetIds: ["meet-care-1"]`. Search for all `seriesMeetId` reads in the codebase and update. | **done** — 3 production `seriesMeetId` callers migrated; consumer in `app/profile/[userId]/page.tsx` reads `linkedMeetIds[0]`. |
| A2 | Add the inverse field on `Meet`: optional `linkedServiceIds: string[]` (which services from any carer reference this meet). Document that this is the read-path optimization — the carer's service has the authoritative link, the meet just mirrors for cross-surface lookups. Add a `getServicesLinkedToMeet(meetId)` helper to keep the mirror consistent. | **done** — shipped as `Meet.linkedServices: { serviceId, required }[]` (two-sided join, not a bare mirror). Helper is `getLinkedServicesForMeet(meet)` + `isMeetRequiringService(meet)` in `meetUtils.ts`. |
| A3 | Add the **link properties**: is the service link `required` for this meet (booking is the RSVP) or `optional` (free attendees + paid service attendees, mixed roster)? Probably lives on `Meet.linkedServices: { serviceId: string; required: boolean }[]` rather than two separate arrays. Reconsider data shape during A1 if this is cleaner. | **done** — folded into A2's `Meet.linkedServices[]` shape; `required` flag per link. |
| A4 | **Klára mock data migration.** Ensure her 4 Meet-type services each link to a real seeded Meet she hosts (already partial — `klara-group-training` → `meet-care-1`, `klara-reactive` → `meet-care-workshop-1`; the other two have NO seriesMeetId). Either create new seed Meets for `klara-1on1` and `klara-puppy-basics`, or leave them unlinked-but-discoverable (the service exists but has no scheduled occurrences yet — valid state). Decide during the workstream. | **done** — `klara-1on1` reclassified Meet → Appointment (training); new seed `meet-care-puppy-basics` created + linked to `klara-puppy-basics`. Klára now demos all 3 service kinds. |
| A5 | **Tereza mock data — mixed-roster demo case.** Add an optional service link to one of Tereza's hosted park walks (her Sunday park walk). She offers "Group walk" Care service at 200 Kč; the walk stays free to join but paid attendees get her dog-walking attention. Demos the optional-link configuration end-to-end. | **done** — `tereza-group-walk` **Meet-type** service (200 Kč/session) added to Tereza's `carerProfile.services`, linked to `meet-15` ("Thursday morning — Riegrovy sady" — a recurring upcoming park walk; her only upcoming Sunday meet is a one-off "+ coffee" social walk that pairs awkwardly with a walking service). `meet-15.linkedServices = [{ serviceId: "tereza-group-walk", required: false }]` → optional link / mixed roster. Board's "Care service" wording corrected to Meet-type per A1/A6. |
| A6 | Type-level enforcement — `CarerCareServiceConfig` cannot have `linkedMeetIds` (Care doesn't link to meets, by design). Use discriminated-union narrowing or runtime check; document the constraint. | **done** — enforced structurally: `linkedMeetIds` exists only on `CarerMeetServiceConfig`; the discriminated union makes a Care service with `linkedMeetIds` a compile error. JSDoc on `CarerServiceConfig` documents the constraint. |

### Workstream B — Service authoring UI (Meet-type)

The thesis surface. Services edit gains Meet-type service authoring with the same card pattern as Care.

**Build decisions (2026-05-14):**
- **Appointment edit card added (scope addition, user-approved).** A4 reclassified `klara-1on1` Meet → Appointment, so an `AppointmentServiceEditCard` was built alongside `MeetServiceEditCard` — Klára's catalogue is fully editable across all 3 kinds. Without it the Appointment would be a new "uneditable here" gap, the exact thing this phase kills.
- **`editServices` widened to `CarerServiceConfig[]`** in `app/profile/page.tsx` (was `CarerCareServiceConfig[]`). The prior save merge only passed through `kind === "meet"` entries — after A4 that silently dropped the new Appointment on save. Save now writes the full array. Companion `editMeetLinks` state carries the per-link `required` flag (lives on the Meet, not the service); flushed to `mockMeets` on Save via `syncMeetLinksForService`, dropped on Cancel.
- **B5 soft-archive proxy.** `Booking` carries no `serviceId` back-reference, so "has active bookings" can't be matched precisely. Proxy: a Meet service soft-archives if any linked meet has a roster (non-host attendees) — the roster *is* the booking record for Meet-type. A service added this session hard-deletes (never accrued bookings). Appointment: pre-existing → soft-archive (no roster signal, conservative); fresh → hard-delete.

| # | Description | Status |
|---|-------------|--------|
| B1 | Add a new card type to the Services edit list: `MeetServiceEditCard`. Mirrors the existing Care card pattern (section header + red trash + fields below) but with Meet-specific fields: title, price per session, format (1-on-1 / small group / workshop), cadence (weekly / biweekly / monthly / ad_hoc), duration minutes, notes, enabled toggle. | **done** — `components/profile/MeetServiceEditCard.tsx`. Kicker header (calendar icon + "Session offering") since the title is editable. |
| B2 | **Linked meets picker** inside the Meet service edit card. Shows the carer's currently-hosted meets that COULD be linked (or already are). Each row: meet title + next-occurrence date + checkbox. Below: "You don't see a meet here? Create one first in Meets" → links to MeetComposer. (Phase doesn't pull meet-creation into the service flow — single source of authoring per entity.) | **done** — `CheckboxRow` per `getHostedMeets(carerId)`; `meetScheduleSummary` schedule line; empty-state hint when the carer hosts no meets. |
| B3 | **Per-link "required" toggle** in the picker rows. Each linked meet gets a toggle: "Booking required to RSVP." Off = optional/mixed-roster; on = service-required. Toggle persists to `Meet.linkedServices[].required`. | **done** — toggle reveals under a checked meet; persists via `editMeetLinks` companion state → `syncMeetLinksForService` on Save. |
| B4 | **Add a new Meet-type service** — "+ Add session offering" CTA below the existing per-Care-type add buttons. Tapping opens a fresh `MeetServiceEditCard` in expanded state (parallels the "+ Add dog" flow on PetEditCard). | **done** — "+ Session offering" + "+ Appointment" buttons in a row below the per-Care-type buttons. |
| B5 | **Delete a Meet-type service.** Red trash in the card header. If there are active bookings referencing this service, soft-archive (set `enabled: false` + a `softDeletedAt` timestamp) rather than hard-delete. Active bookings stand; future attendees see the meet without the link. Document the soft-archive in the JSDoc. Hard-delete only if no bookings exist. | **done** — `softDeletedAt` on `CarerMeetServiceConfig` + `CarerAppointmentServiceConfig` (JSDoc'd). Soft-archive renders a muted strip with Undo; roster-proxy decides soft vs hard (see Build decisions). |
| B6 | **Care-only edit list rename.** The existing edit list is "Care services"; with this phase the Services edit holds BOTH Care + Meet services. Pick a single section header — likely just **"Services"** at the top, with Care cards above Meet cards (or interleaved by `enabled` then date-added). Decide layout during the workstream — there's a real UX question about grouping. | **done** — single "Services" section; cards grouped by kind (Care → Meet → Appointment) via `SERVICE_KIND_RANK`, array index preserved as the update/delete handle. The dishonest "managed separately" footnote is deleted. |
| B7 | View-mode service cards (non-edit) — Meet-type cards show linked-meet schedule info inline ("Tuesdays 6pm at Stromovka · weekly"). Today they show format + cadence + duration chips but no scheduled-time grounding. Pull from `Meet.dates` / occurrences via the linked meet ID. | **done** — schedule lines ("Weekly · next Tue 19 May, 10:00 · Stromovka") on Meet cards in BOTH view-mode surfaces: `ProfileServicesTab` and `/profile/[userId]`. View mode also gained Appointment-card rendering (was missing) + an `enabled` filter (hides disabled / soft-archived services). |

### Workstream C — Booking flow integration

The "Book routes through one flow from both doorways" requirement. Tap Book on Services tab OR on meet detail → same sheet. Session picker when service links to N>1 meets.

| # | Description | Status |
|---|-------------|--------|
| C1 | Audit the existing Care-service Book flow (`InquiryFormModal` etc.) and the existing meet-RSVP flow (`MeetDetailPage` RSVP CTA). Identify the convergence point — where the two flows can share a sheet for Meet-type services. | todo |
| C2 | New `BookSessionSheet` (or extend the existing booking sheet) that handles Meet-type service bookings. Inputs: the service + which linked meet occurrence the owner is booking. On commit: creates a `Booking` record with the service ID + occurrence date; adds the attendee to the meet's `attendeesByDate[date]` roster. | todo |
| C3 | **Session picker** in the booking sheet. If the service has ONE linked meet, default to next occurrence — owner sees a single "Next session: Tue Apr 15, 6pm" line with a date dropdown to switch occurrences. If the service has MULTIPLE linked meets (Klára's "Group walk" → Tuesday meet + Saturday meet), the picker is a list of upcoming occurrences across all linked meets, ordered by date. | todo |
| C4 | Wire "Book" from the meet detail page (when the meet has a service-linked CTA) into the same `BookSessionSheet` — pre-seeded with the meet's ID so the session picker defaults to that meet's occurrences. | todo |
| C5 | Wire "Book" from the Services tab Meet-type cards into the same sheet — no meet pre-seed, picker shows all linked meets' occurrences. | todo |
| C6 | **Required-service meet RSVP gate.** When a meet has a required linked service, the regular "Going" RSVP CTA is replaced — only the "Book session → 350 Kč" CTA shows. Tap routes through `BookSessionSheet`; on commit, the attendee is added to the roster AND a Booking exists. Free RSVP is impossible for required-link meets. | todo |

### Workstream D — Meet card mixed-roster UX

Per Open Q §13: optional-link meets keep "Join free" primary CTA + supplementary service callout; required-link meets collapse the free CTA.

| # | Description | Status |
|---|-------------|--------|
| D1 | Meet card chrome handles three states: (a) free unlinked (today's behavior — "Going / Skip / Interested"), (b) optional service link (primary "Join free" + inline service callout "Have your dog walked: 300 Kč →"), (c) required service link ("Book session → 350 Kč" sole CTA). Implement in `CardMeet` + meet detail page. | todo |
| D2 | Linked-service callout inline UI — sits below the meet meta (when / where / who), above the action row. Treatment: subtle bordered box with carer avatar + service title + price + chevron. Tap routes into `BookSessionSheet` pre-seeded with this meet's occurrences. | todo |
| D3 | **Roster rendering for mixed-roster meets.** People tab on the meet shows all attendees (free + paid) the same way — no visible distinction between "free RSVP" and "service booking" attendees. Behind the scenes the booking record exists for paid ones (carer sees it on their dashboard), but the social surface stays unified. Verify People tab disclosure model still works (info open, action gated by attendance). | todo |
| D4 | **Meet detail page "Linked services" section** — when a meet has linked services, a small section in the meet body lists them (with the same chrome as service cards on the carer's Services tab). Provides a discoverable on-ramp for users who land on the meet first. | todo |

### Workstream E — Discover cross-surfacing

Meet-type services appear in `/discover/care` with schedule info; required-service meets appear in `/discover/meets` with a price chip. Scope is minimal — full filter dedup is deferred.

| # | Description | Status |
|---|-------------|--------|
| E1 | `/discover/care` — when filtered to "Training" or other Meet-relevant appointment types, surface Meet-type services from the carer catalog. Provider card shape matches existing Care cards (avatar / name / Carer identity badge / price / schedule chip). Tap → opens `BookSessionSheet` (not the inquiry flow that Care uses). | todo |
| E2 | `/discover/meets` — when a meet has a linked service (optional OR required), show a price chip on the meet card. For required-link meets, the chip is the dominant price signal ("350 Kč / session"); for optional-link, it's secondary ("Free · 300 Kč service available"). | todo |
| E3 | Filter behavior — appointment-type filter "Training" should surface BOTH Meet-type services in `/discover/care` AND training meets in `/discover/meets`. Verify filter labels match across surfaces. Filter result counts may include the same record twice across the two surfaces — deferred refinement, but flag in the walkthrough. | todo |

### Workstream F — MeetComposer read-only fields for service-owned

When a meet is service-linked, the fields the service owns (price, the service's notes about what's included) shouldn't be editable from MeetComposer. The meet still owns location / cadence / attendees / RSVP rules.

| # | Description | Status |
|---|-------------|--------|
| F1 | MeetComposer detects service-linked meets. For fields the service owns (currently just `price` exists per service, but reserve the pattern for future service-owned fields), render read-only with a lock icon + "Edit on Services →" link to the relevant service edit card. | todo |
| F2 | When the carer deletes a service that's the only link to a meet, the meet survives but loses its service-owned fields. The fields revert to meet-owned (or empty); the lock icons disappear. Test this lifecycle. | todo |
| F3 | Lock UI pattern — extract into a small `LockedFieldHint` component if it appears in more than one place; otherwise inline. | todo |

### Workstream G — Mock data + persona walkthrough

Verify the model holds end-to-end across the personas.

| # | Description | Status |
|---|-------------|--------|
| G1 | **Klára (anchor carer).** 4 Meet-type services linked to her seeded training meets. Editable in Services edit. Owner tapping "Book" on her Group training service → opens session picker with Tuesdays at Stromovka. Mixed-roster Tuesday walk demo: optional "Group walk" service linked to her hosted park walk. | todo |
| G2 | **Tereza (informal carer + community connector).** Add her optional "Group walk" Care service linked to her Sunday park walk meet (free to join; 200 Kč if she walks your dog specifically). Demos the mixed-roster configuration end-to-end. Owner viewing the meet sees "Join free" primary + service callout. | todo |
| G3 | **Daniel + Tomáš.** Not carers (Daniel locked + new owner; Tomáš open but no `carerProfile`). They don't author services; verify their Services tab still renders the empty-state CTA correctly. They DO book services from other carers — verify the booking flow works as an owner-side viewer. | todo |
| G4 | **New User.** Add a service from scratch — onboard creates a `carerProfile`, picks a Meet-type service offering, links it to a meet they don't have yet. Verify the "Create a meet first" prompt fires correctly (this is the path where Service authoring sends them to MeetComposer to set up the meet, then back to Service authoring to link). | todo |
| G5 | **Bridged carers** (olgaM, janaK, etc.). The 7 bridged carers added during Discover Refinement — verify their Discover provider cards still resolve correctly when the data migration touches `seriesMeetId` → `linkedMeetIds`. Spot-check that none of their seeded services break. | todo |
| G6 | **Phase walkthrough doc.** Write `service-meet-linkage-walkthrough.md` covering all canonical configurations (free unlinked / optional-link / required-link / no-meet) across the personas above. Include the open-question items from §13 as a "things to look out for" section. | todo |

---

## Acceptance Criteria

- [ ] Klára can edit each of her 4 Meet-type services in the Services tab edit — change price, notes, enabled state, cadence, duration, format, linked meets.
- [ ] Klára can add a new Meet-type service from scratch. If she doesn't have a meet to link to, the picker prompts her to create one first (link to MeetComposer).
- [ ] Owner tapping "Book" on a Meet-type service card OR on the linked meet detail page → routes through the same `BookSessionSheet`. Session picker behaves correctly for one-link vs N-link services.
- [ ] Mixed-roster meet (Tereza's Sunday walk with optional Group walk service) renders correctly — "Join free" primary CTA + service callout inline.
- [ ] Required-service meet (Klára's Group training) collapses the free RSVP CTA; only "Book session → 350 Kč" shows.
- [ ] Service delete with active bookings → soft-archive. Service delete with no bookings → hard-delete.
- [ ] Service-linked meets in MeetComposer show service-owned fields as read-only with the "Edit on Services →" link.
- [ ] Discover/care filtered to "Training" surfaces Klára's Meet-type training services with schedule info.
- [ ] Discover/meets shows price chips on service-linked meets.
- [ ] The dishonest footnote on `ProfileServicesTab` is deleted (it currently exists explaining the gap; this phase closes the gap).
- [ ] `seriesMeetId` field name is retired across the codebase in favor of `linkedMeetIds: string[]`.
- [ ] `Groups & Care Model.md` "Service ↔ Meet linkage" subsection updated to reflect shipped state (status note: "Authoring UI now live; remaining open items in OQ §13").
- [ ] `features/explore-and-care.md` + `features/meets.md` updated.
- [ ] Phase walkthrough doc walked clean across personas.
- [ ] TypeScript compiles clean.

---

## Closing Checklist

- [ ] Walk through every acceptance criterion against the running app
- [ ] Update all affected feature docs (`features/explore-and-care.md`, `features/meets.md`, `features/profiles.md`)
- [ ] Update Open Questions §13 — close resolved items (likely most), keep any genuinely deferred ones (auto-pricing engine extension, full Discover filter dedup, free→paid upsell)
- [ ] Update `Groups & Care Model.md` → "Service ↔ Meet linkage" subsection status block
- [ ] Update ROADMAP.md — mark phase complete with summary
- [ ] Review CLAUDE.md — update Key Decisions if the linkage model changes how the trust/care funnel reads
- [ ] Archive this phase board + walkthrough (status: archived, `git mv` to `docs/archive/phases/`)
- [ ] Structural audit
- [ ] **Strategic review** — does the carer's catalog feel complete? Does Klára's training catalogue feel demo-ready for a trainer cold-start conversation? Anything to feed back into Cold-Start Playbook?
- [ ] Check next phase scope for conflicts with what was just built

---

## Open build-time questions (from OQ §13 — resolve mid-phase)

These are the things to keep an eye on during the build. Don't pre-resolve them in opening; let the build surface the right answer.

- **Booking-sheet session picker UX.** Dropdown when N≤3, route to meet's sessions page when more? Or always inline? Decide during C3.
- **Lifecycle when meet cancels with attached service-bookings.** Auto-refund? Reschedule offer? Reuses existing cancellation flow but the message + refund path needs design. Decide during D1 + B5.
- **Edit-on-Meet redirect UI pattern.** Disabled inputs, hidden inputs, or lock-icon-with-link? Decide during F1.
- **Multi-doorway filter result-count semantics.** A meet with a required service surfaces in both Discover/meets and Discover/care; result counts may double up. Acceptable for v1; flag for refinement. Note in walkthrough.
- **Free → paid upsell flow.** Owner joins free, mid-meet wants the service — can they upgrade in-context? Deferred but flag the question so the booking sheet doesn't paint into a corner.
- **Privacy semantics on the link.** Meet visibility (public / group_only / participants-only) × service audience (circle / anyone). Probably the service controls the audience for booking; the meet stays at its declared visibility for free attendees. Verify during D1 + G2.
