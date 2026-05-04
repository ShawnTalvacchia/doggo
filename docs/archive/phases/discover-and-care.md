---
status: archived
last-reviewed: 2026-05-04
review-trigger: When any task is completed or blocked
---

# Discover & Care

**Goal:** Care discovery on `/discover/care` reads as community, not marketplace. Services-as-Catalog lands in code, Care groups support a multi-provider hero, trust signals layer onto Discover result cards + provider profile heroes, and the soft Familiar indicator extends to non-grouped surfaces.

**Depends on:** Mock World Building (closed 2026-05-02). Per-persona content, the Services-as-Catalog model, and the badges taxonomy are documented and ready for code.

**Refs:**
- [[features/explore-and-care]]
- [[strategy/Groups & Care Model]] → Services as Catalog, Provider Tiers, Care Group Admin Model
- [[strategy/Competitive Research - Prague Dog Care Scene]] (badge taxonomy + cold-start)
- [[strategy/Competitive Research - Fluv]] (hybrid trust signals)
- [[strategy/Open Questions & Assumptions Log]] §3 (care-group provider presence) + §4 (offering types, participants_only)
- [[implementation/badges]]
- Punch list: P44 (Services-as-Catalog code), P29 (soft Familiar on non-grouped surfaces)

---

## Opening Checklist

Complete before writing any code. Mark each item done.

- [x] Read every task and its referenced docs
- [x] Review Open Questions log — flag anything affecting this phase (§3, §4, §8 in scope)
- [x] Audit for conflicts between phase plan and current codebase — none found; current `/discover/care` is the right base to deepen
- [x] Bumped `last-reviewed` on the two competitive research docs (Prague Dog Care Scene + Fluv) — content still accurate, dates refreshed to 2026-05-02
- [x] Confirm scope — out-of-scope items routed to their proper phases (see "Deferred elsewhere" below)

---

## Workstream A — Services-as-Catalog code (P44)

Foundation. Sequenced first so the rest of the phase renders correctly. The Services-vs-Care-vs-Meet boundary was clarified 2026-05-02; this is the code-side follow-up.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| A1 | Add `"participants_only"` to `MeetVisibility`. Update `getGroupMeets` (filter unless viewer is in roster) and the meet-creation path that generates package instances. Backfill `meet-care-6` (Hana 1-on-1) so it stops leaking into Klára-group's public Meets tab. | `lib/types.ts`, `lib/mockGroups.ts`, `lib/mockMeets.ts`, [[Open Questions]] §4 | done |
| A2 | Discriminated union on `CarerServiceConfig` so Meet-type offerings (1-on-1 training, workshops, paid group walks) have a real shape — not jammed into `inhome_sitting.subServices`. Care-type retains today's shape; Meet-type carries title, cadence, price-per-session, link to hosted meets. | `lib/types.ts`, [[Groups & Care Model]] → Services as Catalog | done |
| A3 | Profile Services tab renders both Care-type and Meet-type offerings. Type-aware tap routing — Care → request-booking flow; Meet → "see my upcoming sessions" → user picks a date. Single comprehensive tab, no Care/Meet labelled segmentation. Card content does the work. | `app/profile/[userId]/page.tsx`, [[features/explore-and-care]] | done |
| A4 | Klára mock-data hygiene. Move "1-on-1 training session" / "Reactive dog session" / "Puppy basics" out of `inhome_sitting.subServices` onto Meet-type offerings tied to her hosted meets. Keep "Training walk" inside `walk_checkin` (still Care — drop-off walk with training mixed in). | `lib/mockUsers.ts` (klara), `lib/mockMeets.ts` | done |

---

## Workstream B — Care-group hero & multi-provider (Open Q §3)

The phase's central design call: how does a Care group communicate its provider(s) without flipping marketplace-y? Lean restrained — community first, attribution clear, links to richer info on the provider profile.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| B1 | Decision pass on Care-group hero anatomy. What surfaces beyond the current "Run by [Name] · [Category]" block? Recommend: provider summary line (years/methodology), top 1-2 community-earned badges, "View profile" link. NOT: full credential list, services menu, reviews preview — those live on the provider profile. Document decision in `Groups & Care Model.md`. | [[Open Questions]] §3, [[Groups & Care Model]] → Care Group Admin Model, [[Competitive Research - Prague Dog Care Scene]] | done |
| B2 | Generalise `Group.hostedBy: string` → `providers: string[]`. Backfill all mock Care groups. Update everything reading `hostedBy` to read the new field. | `lib/types.ts`, `lib/mockGroups.ts`, `components/groups/GroupDetailPanel.tsx`, `app/communities/[id]/page.tsx` | done |
| B3 | Render single-provider vs multi-provider variants on the Care-group hero. Single (Klára's training): one provider card, full anatomy from B1. Multi (vet practice / boarding facility): condensed provider strip with avatars + names, expand-to-detail. Decide collapse threshold (1 vs 2 vs 3+). | `components/groups/GroupDetailPanel.tsx`, `app/communities/[id]/page.tsx` | done |
| B4 | Apply the service-intersection rule. Each Care group surfaces only contextually-relevant services from its member providers (location / service type / methodology match). E.g. Klára at Stromovka Collective surfaces her Stromovka training; Vinohrady Training surfaces her Riegrovy Sady offering. | `lib/mockGroups.ts`, [[Groups & Care Model]] → Care Group Admin Model | done (helper landed; passthrough until location metadata exists on services) |

---

## Workstream C — Vet/grooming offering type (Open Q §4)

Resolve and document. Light implementation since neither category is on the demo arc.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| C1 | Decide: third "Appointment-type" offering vs solo-roster Meet vs another framing. Proposed direction: Appointment-type as a third variant (sibling to Care + Meet) — booking produces a Booking record like Care, but tied to a specific time slot like Meet, and roster never has other dogs. | [[Open Questions]] §4, [[Groups & Care Model]] | done |
| C2 | Update `Groups & Care Model.md` → Services as Catalog with the resolved third type. Close the §4 open question; add anything that emerged. | [[Groups & Care Model]], [[Open Questions]] | done |
| C3 | Ship one mock Care group (vet or grooming) using the new shape to prove it renders. No demo arc; just enough to validate the data + UI. | `lib/mockGroups.ts`, `lib/mockUsers.ts` | done |

---

## Workstream D — Trust signals on Discover

The phase headline. Make care discovery feel like community. Connection-state hints + trust badges layered onto cards and profile heroes — bridges the trust gap for users who haven't built deep ties yet (the hybrid-trust direction from Fluv research).

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| D1 | Audit `/discover/care` — flag every surface that reads transactional today (price-led, distance-led, no community signals). Output: a punchlist that D2–D6 work from. | `app/discover/care/page.tsx`, `components/explore/CardExploreResult.tsx`, [[features/explore-and-care]] | done (findings → D2/D6: trust row promoted above service tags; "in your circle" replaces "mutual owners"; hardcoded persona placeholders in filter panel flagged for F-stream) |
| D2 | Connection-state hints on result cards. "Used by 3 people you know," "Met at 2 walks together," shared-connection counts. Computed from existing `ConnectionsContext` + meet history. Card surface, not just profile. | `components/explore/CardExploreResult.tsx`, `lib/personActions.ts`, `lib/meetUtils.ts` | done |
| D3 | Trust badge taxonomy MVP. Ship 6 badges (3 community-earned: **Community Regular**, **Trusted by Your Network**, **Repeat Clients**; 2 credential: **Certified Trainer**, **X Years Experience**; 1 platform stub: **Verified Identity**). Document the rest as future. Prioritisation rule: community-earned > credential > platform. | [[Competitive Research - Prague Dog Care Scene]] → Trust Badges, [[implementation/badges]] | done |
| D4 | Add credential fields to `UserProfile.carerProfile`. Years experience, methodology statement, first aid, certifications. Self-declared (verified flag for future). Backfill mock providers with realistic values. | `lib/types.ts`, `lib/mockUsers.ts` | done |
| D5 | Provider profile hero badge row. Full earned taxonomy renders here. Tappable for detail — "Trusted by your network" expands to which connections. Lives on `/profile/[userId]`. | `app/profile/[userId]/page.tsx`, `components/people/PersonRow.tsx` (existing badge primitives), [[implementation/badges]] | done (tooltip-on-hover ships; tap-to-expand "which connections" deferred) |
| D6 | Discover result cards show ≤2-3 most relevant badges per the prioritisation rule. Avoid pill-clutter. Same primitives as D5, just trimmed selection. | `components/explore/CardExploreResult.tsx`, [[implementation/badges]] | done |

---

## Workstream E — Soft Familiar indicator on non-grouped surfaces (P29)

Members tab + People tab already section-group by relationship state, so FAMILIAR rows surface under their own subheader. The remaining gap: Discover lists — a sea of mostly-strangers where users can't tell "have I marked this person?" without expanding. The ring is intentionally **scoped to Discover surfaces only** — meet/group surfaces already signal relationship through sections, labels, and CTAs, so adding a ring there is redundant noise (decision 2026-05-04).

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| E1 | Pick visual treatment. Options: tiny corner check icon overlaying avatar (16px circle), subtle brand-tinted ring, small inline "Familiar" label. Privacy-safe (own data). Decide once, apply consistently. | `components/people/PersonRow.tsx`, `components/ui/ConnectionIcon.tsx`, P29 | done (chose brand-tinted outline ring — `.avatar-familiar` in `app/globals.css`. Subtle, scales across avatar sizes) |
| E2 | Apply on Discover provider cards. Do NOT apply on AttendeeAvatarStack or other meet/group surfaces. | `components/explore/CardExploreResult.tsx` | done (Discover provider cards only; AttendeeAvatarStack ring removed 2026-05-04 — design call: ring is a Discover-only affordance) |

---

## Workstream G — Booking inquiry & proposal flow

The structured request-booking flow promised by A3. Two parallel artifacts in every service-context conversation: **InquiryCard** (owner intent) and **ProposalCard** (provider offer). Both render as first-class message types — chat fills the gaps between them. The Bookings tab mirrors proposal-onward state as a pipeline view (pending → active → completed). Decisions captured in the design discussion 2026-05-02 (this phase).

**Key model:**
- One service-context conversation per (owner, provider) pair. Multiple inquiries over time live in the same thread (chronology preserved).
- Booking record is created when the provider sends the first proposal; status `"proposed"` until accepted.
- Counter = a *new* ProposalCard, not an amendment. Booking's current fields mirror the latest proposal; older proposals collapse to a "Countered" / "Superseded" state in the thread.
- Decline (either side): status → `"cancelled"` on the Booking; thread stays open for follow-up.
- Provider tier gating uses the existing `personActions` matrix — no new gating logic; the "Book a session" CTA simply doesn't render for ineligible viewers.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| G1 | `getOrCreateServiceConversation(providerId, service, sub?)` on `ConversationsContext`. Service card "Book a session" + Appointment "Ask about this" pass `service` (and `sub` if set) as query params. `ProfileChatTab` reads them and seeds `conv.inquiry` with the service context. Direct-conversation path stays separate (used by Connected social chat). | `contexts/ConversationsContext.tsx`, `components/profile/ProfileChatTab.tsx`, `app/profile/[userId]/page.tsx`, `lib/types.ts` (Conversation shape) | done (Care + Meet routes wired with structured inquiry; Appointment "Ask about this" routes to plain chat — the Appointment-specific inquiry shape is future Bookings & Monetisation work) |
| G2 | Replace InquiryForm's templated-text output with a structured **InquiryCard** message. New message type `inquiry`; new component `components/messaging/InquiryCard.tsx` renders for both viewers. Free-text notes flow as a separate text message after, if the owner wrote anything. | `lib/types.ts` (MessageType), `components/messaging/InquiryForm.tsx`, `components/messaging/InquiryCard.tsx` (new), `app/inbox/[conversationId]/ThreadClient.tsx` | done (notes attach inline on the card via `InquiryDetails.notes` instead of separate text message — simpler in the thread, single artifact per inquiry) |
| G3 | Provider-side **"Send proposal" CTA** rendered on a pending InquiryCard (provider viewer only). Opens **ProposalForm** (new component, mirrors InquiryForm shape + price). Pre-fills dates/schedule from inquiry; **auto-calculates price** as `pricePerUnit × occurrences + 12% platform fee`; provider can override line items. Submit posts a ProposalCard to the thread. | `components/messaging/InquiryCard.tsx` (the CTA), `components/messaging/ProposalForm.tsx` (extended), `lib/pricing.ts` (occurrence + fee math) | done (existing ProposalForm extended rather than rebuilt; legacy `InquiryResponseCard` floating affordance suppressed when a structured InquiryCard exists in the thread — single source of provider actions) |
| G4 | Polish existing `BookingProposalCard` rendering. Owner-side actions: **Accept** (primary) / **Suggest changes** (secondary, opens ProposalForm pre-filled with current values, sends as new ProposalCard) / **Not now** (tertiary, status → `declined` with optional free-text). Provider-side: "Sent — waiting" state, edit/withdraw deferred. Status transitions wired across both InquiryCard and ProposalCard. | `components/messaging/BookingProposalCard.tsx`, `lib/types.ts` (BookingProposalStatus), `contexts/ConversationsContext.tsx` (status transitions) | done (three-action row: Not now / Suggest changes / Review & sign; counter flow sources price from the source proposal and flips it to `countered` on submit; either side can respond — gating is `msg.sender !== myRole`) |
| G5 | **Booking record creation + Bookings tab mirroring.** When provider sends first proposal: create `Booking` with `status: "proposed"`. Counter → update same Booking's fields to latest proposal. Accept → `status: "active"`. Decline → `status: "cancelled"`. Add `"proposed"` to `BookingStatus` enum; `/bookings` renders proposed state distinctly (e.g. "Pending — awaiting Klára"). | `lib/types.ts` (BookingStatus), `contexts/BookingsContext.tsx`, `app/bookings/page.tsx`, `components/bookings/BookingListCard.tsx` | done (`upsertProposedBooking` keeps a single Booking record per conversation through the proposal/counter cycle; accept flips to `upcoming`; decline flips to `cancelled`; `/bookings` renders a "Pending" section above Active for both owner + carer perspectives) |
| G6 | Inbox row preview distinguishes inquiry / proposal system messages from text. Icon + label treatment so "Inquiry sent" and "Proposal received" don't read as plain unsent drafts. Closes P46(2) within service-thread scope. | `app/inbox/page.tsx` (getPreview), `components/people/PersonRow.tsx` (inbox-conversation variant), `app/globals.css` | done (`getPreview` returns `{ text, kind }`; PersonRow inbox variant renders system-message kinds with brand-tinted leading glyph; status-aware copy: "New inquiry" vs "Inquiry — responded", "New proposal" vs "Proposal accepted/declined/countered") |

---

## Workstream F — Discover Care content + language pass

Marketplace → community feeling. Words and rhythm matter as much as the badges and signals.

| Task | Description | Refs | Status |
|------|-------------|------|--------|
| F1 | Card copy audit. Replace transactional phrasing ("From 400 Kč/visit," "Book now") with community-rooted language where it fits. Don't strip pricing — pricing transparency builds trust per [[Groups & Care Model]] → Friendship-Meets-Contract Problem. | `components/explore/CardExploreResult.tsx`, [[Groups & Care Model]] | done (trust-row copy reframed in D2: "in your circle" replaces "mutual owners," "Met at N walks" added; pricing kept as-is per Friendship-Meets-Contract Problem) |
| F2 | Empty states + zero-result framing. "No providers in your area" → community-first reframing ("No carers in your circle yet — find your park, attend a walk, see who's around"). Map to existing community CTAs. | `app/discover/care/page.tsx`, [[Product Vision]] | done |
| F3 | Result list rhythm + map polish. Card density, spacing, map pin treatment. Quality-of-detail pass — make the surface feel finished. | `app/discover/care/page.tsx`, `components/explore/MapView.tsx`, `app/globals.css` | deferred to walkthrough — the new badge strip + promoted trust row added vertical density; rhythm tuning needs visual verification before further changes ship |

---

## Acceptance Criteria

- [x] `/discover/care` reads as community-first when walked through cold (Daniel persona is the strongest test — anxious new owner, no deep network yet).
- [x] Care-group detail pages render correctly for both single-provider (Klára) and multi-provider (new vet/boarding mock) shapes.
- [x] Klára's Services tab shows Meet-type offerings as first-class catalogue entries; tapping a Meet-type service routes to "pick a session," tapping a Care-type service routes to request-booking.
- [x] `meet-care-6` (Hana's 1-on-1) is no longer visible to other Klára-group members on the public Meets tab.
- [x] Trust badge MVP renders correctly on provider profile hero (full set) and Discover result cards (top 2-3, prioritised).
- [x] Connection-state hints on result cards reflect viewer's actual connection graph + shared meet history.
- [x] Soft Familiar indicator visible on Discover provider cards (intentionally scoped Discover-only — design decision logged 2026-05-04). Mock-data seeds added so all viewer personas with carer-list intersections see positive cases (Daniel→Nikola, Klára→Pavel, Tereza already had matches).
- [x] Vet/grooming offering type is documented in [[Groups & Care Model]] and Open Q §4 is closed.
- [x] No marketplace-y copy remains on `/discover/care` cards or empty states.
- [x] Tapping "Book a session" on a Care service card opens the structured inquiry flow (not just a free-text chat).
- [x] Provider can send a structured proposal in response, with price auto-calculated. Owner can Accept (Review & sign) / Suggest changes / Not now.
- [x] Bookings tab shows pending proposals as `"proposed"` state alongside active and completed bookings; owner can Review & sign from the booking detail page directly.

---

## Open Questions this phase resolves

| Question | Section | Resolution path |
|---|---|---|
| Care-group provider presence — community vs. marketplace | §3 | B1 decision + B3 hero variants |
| Multi-provider Care groups (`hostedBy: string` → `providers: string[]`) | §3 | B2 rename |
| Vet & grooming offerings — neither pure Care nor pure Meet | §4 | C1 decision + C2 doc update |
| Meet visibility level: `participants_only` | §4 | A1 enum + filter |
| Soft Familiar indicator (non-grouped surfaces) | §2 | E1 + E2 |
| Trust badges MVP scope (partial — full taxonomy is a future concern) | §8 | D3 ships the MVP set |

---

## Deferred elsewhere

| Item | Routed to |
|---|---|
| Intro session booking type | Schedule & Bookings |
| Pet-profile-based provider matching | Future / stretch — not in this phase |
| Helper vs Carer terminology rename | Onboarding & In-Product Communication |
| Provider onboarding routing question (Care vs Meet) | Onboarding & In-Product Communication |
| Owner-facing card differentiation copy (Care vs Meet teaching) | Onboarding & In-Product Communication |
| Privacy explainer page (P37) | Onboarding & In-Product Communication |
| Inbox visual hygiene (P46) | Inbox & Notifications |
| Familiar ✓ tap-to-reverse (P40) | Punch list |
| Auto-badges (Responsive, Consistent) | Post-prototype (require real messaging/session data) |

---

## Closing Checklist

Complete before marking this phase done. The full canonical list lives in `CONTRIBUTING.md` → "Closing a Phase" — this is the local copy.

- [x] Walk through every acceptance criterion against the running app — completed via the live walkthrough doc; F2/F3/G2–G6 covered with findings logged + addressed inline (single-day date support, modal styling fixes, action-row hierarchy, inquiry/proposal/contract flow including Bookings-detail Review & sign)
- [x] Update [[features/explore-and-care]] — full Discover & Care additions section + Future trimmed to the next-phase + deferred-cluster items
- [x] Update [[Groups & Care Model]] — last-reviewed bumped (Services as Catalog third type + multi-provider hero already documented during the phase)
- [x] Update [[implementation/badges]] — last-reviewed bumped (MVP taxonomy + prioritisation rule + display rules already documented during D3)
- [x] Update Open Questions log — §3 multi-provider Care groups closed (B1–B4); §4 `participants_only` + vet/grooming closed (A1 + C1); §6 added "Structured pricing model + no-bargaining principle" for Pricing & Proposals; §2 added "Inquiry-driven trust transitions" for Inbox & Notifications; §4 surface gaps cluster (5 sub-items) for a future Discover refinement pass
- [x] Update ROADMAP.md — Pricing & Proposals inserted as next phase, Sessions & Service Execution renames+refocuses Schedule & Bookings, Inbox & Notifications scope compressed; "Current Phase" set to none-active
- [x] Review CLAUDE.md — added 6 new Key Decisions covering Services as Catalog, multi-provider Care groups, trust badges MVP, Discover-only soft Familiar ring, inquiry/proposal/contract flow + Review & sign from Bookings detail, auto-Familiar on inquiry, persisted demo state + new conv ID format
- [x] Review Punch List — P44 + P29 already removed; P51 (design-system audit) added during the phase covering Familiar/Connected chip pattern divergence + optional-field labels
- [x] Trim pass — Roadmap reorganized; CLAUDE.md Current Phase + Upcoming refreshed; feature doc Future trimmed to the new-phase items
- [x] Archive this phase board (status: archived set; git mv to follow this checklist update)
- [x] **Structural audit:** see strategic review below for details
- [x] **Strategic review** — see brief at end of close in chat
- [x] Check Inbox & Notifications scope for conflicts with what was just built — none. Inbox & Notifications inherits the inquiry-driven-trust-transitions question and the request-vs-thread distinction work; the structured InquiryCard / ProposalCard / ContractCard rendering already shipped, so that phase opens with comms polish + status-aware previews + the trust-transition full model rather than artifact rendering itself
