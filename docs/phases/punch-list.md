---
status: active
last-reviewed: 2026-05-18
review-trigger: "any time — add items as they're noticed, fix them when convenient"
---

# Punch List

Running list of small UI tweaks, visual fixes, and quick bugs that live alongside whatever phase is active.

---

## Workflow

### What belongs here

- Quick fixes (≤30 min): visual nits, small bugs, content tweaks, dead-code cleanup.
- **Description column is 1–2 sentences.** The refs column carries deeper context (file paths, feature docs).
- If an item needs paragraphs of justification, design discussion, sub-items, or has "open product calls," it's phase work, not a punch-list item — promote it.

### Adding items

Add to the table with the next number, a one-sentence description, category, affected page/area, file refs, and today's date.

### Fixing items

1. Read the item's referenced files. If the fix touches a feature doc or design doc, update it too.
2. Make the change.
3. **Remove the item from the table.** The commit message is the record — don't log fixes here.

### Promoting items

If an item turns out to need design thinking or more than ~30 minutes:

1. Move it to the relevant phase board's pre-loaded scope (or to Open Questions if the question itself is open).
2. Remove it from this file.
3. Don't let it sit silently — the point is that nothing gets lost.

---

## Open Items

| # | Description | Category | Page/Area | Refs | Added |
|---|-------------|----------|-----------|------|-------|
| P76 | **`.dropdown-menu` source-order specificity footgun.** Surfaced 2026-06-04 (Photos & Galleries kebab refactor). Variants of `.dropdown-menu` (e.g. `.post-kebab-menu` for right-aligned sizing) lose the cascade against the base `.dropdown-menu` rules because the base comes LATER in `globals.css`. Current workaround: double-class selectors (`.dropdown-menu.post-kebab-menu`) to win on specificity. Better long-term: move `.dropdown-menu` defaults into a CSS layer or reorganize so variant rules come after the base. Affects any future menu variant that wants to override left/right/sizing. | Design system | App-wide | `app/globals.css` (`.dropdown-menu`, `.post-kebab-menu`, `.posts-tab-filter-menu`) | 2026-06-04 |
| P69 | **Seed connection rosters for the remaining supporting cast.** Surfaced 2026-05-13 (PDP walkthrough G1) — `mockConnectionsByViewer` needs both ends of a connection seeded for `getMutualConnectedUserIds` to resolve, so the Mutual connections section silently hides whenever one end has no roster. **Partial fix shipped** (Demo Narrative & Personas W3.2, 2026-05-17): rosters added for the 6 anchor supporting personas — Marek, Eva, Hana, Jana, Pawel, Petra — plus an open-viewer hygiene fix on Magda + Veronika. **Remaining:** the bridged providers (olgaM, janaK, tomasB, pavelD, simonaV, martinK, lenkaS, petrV) and the lighter supporting cast (Lucie, Jakub, Zuzana, Ondřej, Adéla, Vítek, Anežka, Marie, Filip, Martin, Nikola) still have no roster of their own — symmetrize the inverse of every existing seeded entry pointing at them. **Out of scope:** generating new Connections from scratch. | Mock data | Connection-dependent surfaces app-wide | `lib/mockConnections.ts:mockConnectionsByViewer`, `lib/mockConnections.ts:getMutualConnectedUserIds`, `app/profile/[userId]/page.tsx` (MutualConnectionsSection) | 2026-05-13 |
| P67 | **Component-consolidation audit — recurring patterns to lift.** Surfaced 2026-05-11 during Profiles Deep Pass walkthrough C3a/C-extension. Pattern: every time we touch a section in a profile-style surface, we discover the same shape sitting inline as bespoke JSX. Two concrete cases just landed: (a) `SectionHeader` in `components/profile/` — wraps `.profile-card-subtitle` h3 + optional right-aligned action; lives profile-side today but recurs anywhere a page section needs a header + action (booking detail, meet detail, group panels). Promote to `components/ui/` (or `components/layout/`) when a non-profile consumer asks. (b) Service-card shell — `.profile-service-card` is now used by both view and edit modes on the Services tab, but the shape (rounded panel, surface-base fill, 1.5px subtle border, padding, flex-column-gap) recurs on other "card with form fields inside" surfaces (PetEditCard sections, Discover Care provider cards). Worth extracting as a `.card-shell` or component. **Action:** scan `components/` for inline JSX patterns that recur ≥3 times across files (`flex items-center justify-between` around an h3, bordered rounded-panel wrappers, "summary card with icon + title + sub" cards, etc.) and propose extractions. Output: a prioritized list of consolidation targets that fit into Design System Cleanup-style focused phase work. | Design system | App-wide | `components/profile/SectionHeader.tsx`, `app/globals.css` (`.profile-service-card`, `.profile-card-subtitle`), `docs/implementation/design-system.md` | 2026-05-11 |
| P65 | **Inline add-pet + inline location lookup on Discover Care filter panel.** Surfaced 2026-05-11 during Care Catalog Taxonomy B6 walkthrough. The Pets + Nearby empty states (New User persona, or any user with no pets / no neighbourhood) currently render as CTAs linking to `/profile` — the user has to navigate away to add a dog or set a neighbourhood, then come back. Better UX: let them add inline from the filter panel. **For pets:** a small inline form (name + breed minimum) that creates a `PetProfile` on the viewer's `UserProfile` and immediately re-renders the checkbox row. Needs save plumbing — probably a `usePersistedState`-backed override mirroring the existing context patterns. **For nearby:** location autocomplete (Prague POI list at minimum — see existing Open Q "Meet location — structured place selection" in OQ §3 for the broader pattern). Both are real features; deferred so they don't block the demo. | UX gap / future feature | `/discover/care` filter panel empty states | `app/discover/care/page.tsx`, `app/profile/page.tsx`, `components/profile/PetEditCard.tsx`, OQ §3 meet-location entry | 2026-05-11 |
| P63 | **"Open to bookings" status pill on profile hero — needs decision.** Discover Refinement C4 deferred this. Today the public-vs-circle audience setting (`carerProfile.publicProfile`) is signaled implicitly: in-circle Discover section structure for circle-Carers; presence in `/discover/care` listings + Carer Identity badge for open-Carers. **Open call:** does profile hero need an additional small "Open to bookings" status pill where the audience distinction matters and the surface itself doesn't carry it (e.g. arriving on a profile from a meet attendee row, group member, post author)? Pro: makes the dial visible from any entry point. Con: redundant with Carer Identity badge + risk of over-pillification. Decide on a focused pass (or in Onboarding & In-Product Communication if the audience-setting toggle UI lands there). | Carer audience signaling | Profile hero | `app/profile/[userId]/page.tsx`, `docs/implementation/badges.md` | 2026-05-10 |
| P60b | **Carer sub-specification picker UI** *(data layer landed 2026-06-03 — see P60 in archive)*. The `specializations?: CarerSpecialization[]` field on `CarerProfile` is wired and seeded (Klára `["trainer","walker"]`, Tereza `["sitter","daycare"]`); the resolver in `lib/identityBadges.ts` now uses it as the highest-priority sub-spec source. **Remaining:** a multi-select chip picker on the carer profile edit surface so non-seeded carers can set their own. Likely a new `MultiSelectChipPicker` primitive that the profile edit + future surfaces share. Multi-spec rendering on the badge ("Trainer + Walker") is another future enhancement once a picker exists and we have a real multi-spec demo carer. | Identity badges + UI | Profile edit surface | `lib/identityBadges.ts` (resolver), `lib/types.ts:CarerSpecialization` (enum), `app/profile/page.tsx` (edit form), `docs/implementation/badges.md` | 2026-05-10 |
| P51 | **Design-system audit + convergence pass.** Running list of areas that need unification — running collection, build into a single phase when it's worth a focused sweep. (a) Optional-field label pattern across forms (today: inline em-dash `— optional`, right-aligned `Optional`, no marker — pick one, apply everywhere). (b) Familiar / Connected chip pattern — Discover Card now uses brand outline (Familiar) + brand fill (Connected) at brand-strong text. PersonRow surfaces (`person-row-pill--familiar` etc.) still use the older neutral-grey treatment. Bring those in line so the chip language is consistent across cards, member lists, and meet attendee rows. | Design system | App-wide | `components/ui/InputField.tsx`, `components/messaging/InquiryForm.tsx`, filter fields in Discover, `components/people/PersonRow.tsx`, `app/globals.css` (`.person-row-pill--*`) | 2026-05-04 |
| P38 | Generic "+" icon on the mobile nav create button reads as ambiguous — action is context-aware (post / meet) but the icon doesn't flip per context. Audit and pick context-specific icons. **CCFT 2026-05-14 progress:** group detail per-tab icons shipped (Feed → CameraPlusFill, Meets → CalendarPlus, Members → UserPlus) via the detail-header `headerAction` slot; mobile detail-action treatment got a 1px outline + radius-md so action-buttons differentiate from chromeless Bell/Inbox. AppNav top-row default Create remains route-aware (CalendarPlus on `/schedule`, AddPostIcon elsewhere) and chromeless when alongside Bell/Inbox — intentional, per "no chrome when grouped with system nav" rule. Open: similar per-tab icon flips on other detail surfaces beyond group detail (e.g. profile, booking detail) if/when context-aware actions surface there. | Visual / Content | Mobile nav | `components/layout/AppNav.tsx`, `app/communities/[id]/page.tsx`, `app/globals.css` (`.app-nav-detail-action`) | 2026-04-30 |
| P42 | Inline comment compose on feed posts — `CommentThread` has a `canComment` prop but the send action is a stub. Wire to session-scoped local state (mirrors `ConnectionsContext` pattern), or skip until backend is real. Low priority. | Content / Interaction | Feed posts | `components/feed/FeedCard.tsx`, `components/feed/CommentThread.tsx` | 2026-04-30 |
