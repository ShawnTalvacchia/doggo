---
category: implementation
status: active
last-reviewed: 2026-06-20
tags: [design-system, components, patterns, css]
review-trigger: "when building or refactoring components, adding CSS patterns, or consolidating styles"
---

# Design System

Living reference for tokens, components, and CSS patterns. This doc should get **shorter** over time — consolidate, don't accumulate.

**Tokens:** Full Figma→CSS mapping in `design-tokens.md`. Tailwind v4 mapping in the `@theme` block of `globals.css`.

---

## Principles

1. **Use what exists.** Check `components/ui/`, `components/layout/`, and `components/people/` before building anything from scratch.
2. **Tokens first.** All colors, spacing, radii, and typography via CSS custom properties. Never raw values.
3. **Tailwind for simple styles.** 1-3 property patterns go in JSX as utilities. CSS classes only for complex patterns (pseudo-elements, animations, multi-state, 9+ properties).
4. **Consolidate aggressively.** If two patterns do the same thing, merge them. Flag candidates in the Consolidation Queue below.
5. **Avatar shape Rule B (entity identity, 2026-05-08; app-wide sweep landed Discover Refinement F, 2026-05-10).** People are circles. Dogs are rounded squares (small dog avatars use `--radius-md` / `rounded-md`; larger pet hero treatments use `--radius-panel` / `rounded-panel`). The shape encodes the entity type, not the layout role — same dog renders the same way wherever it appears. Surfaces that resolve to either an owner or a dog photo (e.g. `AttendeeAvatarStack`, `meet-summary-avatar`) apply a `--dog` modifier conditionally so the shape follows the resolved entity. Caveat: shapes encoding *relationship* (Familiar/Connected ring on Discover provider cards) are an orthogonal pattern and not affected by Rule B.
6. **Pet-as-protagonist (Sessions & Service Execution, 2026-05-08).** For surfaces that frame care of a specific dog (booking detail Sessions tab, future session-cards on the schedule), the dog is the visual centerpiece. Hero photo treatment over avatar-as-thumbnail. Encourages emotional bonding, instant recall, and a behavioral nudge for owners to upload quality photos. Currently applied on `SessionsPetHeader`; candidate for codification in `strategy/Product Vision.md` if extended elsewhere.
7. **Chips host categorical labels only; status renders as inline icon + colored text (Design System Cleanup, 2026-05-11).** The `card-schedule-chip` pill vocabulary is reserved for *categorical* labels (Meet type pills: Walk / Park / Playdate / Training; Group type pills: Park / Neighbor / Interest / Care). *Status* — anything denoting a state, role, or transient condition (Joined, Cancelled, Going, Hosting, Interested, Booked) — renders as inline icon + colored text with no chip chrome. Pattern: `<span className="flex items-center gap-xs text-sm font-semibold shrink-0" style={{ color: <token> }}>{icon} {label}</span>`. Reference: `CardMeet.tsx` role indicator (~lines 254–267) for the canonical implementation; CardGroup "Joined" + CardMeet "Cancelled" both follow. Rationale: the brand-subtle pill used as the meet-detail RSVP control visually collides with `card-schedule-chip` — moving status out of the chip vocabulary eliminates the ambiguity. Type pills stay as chips (they're clearly non-interactive categorical labels).
8. **ModalSheet footers are system-primary by default (Design System Cleanup, 2026-05-11).** Footer buttons use `<ButtonAction variant="primary">` (and `variant="tertiary"` for the dismiss/back button) — no `cta` modifier, no pill shape, small radius. Process flow: navigation/commit at the footer reads as "task" not "celebration." **Carve-out:** the pill shape (`cta`) belongs only when the footer button IS the celebratory commit of an inherently celebratory flow — currently this is `PostComposer`'s Share button (Instagram-style photo post). Every other footer commit (BookingModal Send Request, MeetComposer Create meet, ServiceBookingSheet Confirm, ProposalForm Send, SigningModal Sign Contract, CareReviewSheet Send review, Cancel-confirmation modals) uses the rectangular system-primary treatment.
9. **Treatment ladder for data points — pill / inline-check / body copy (Profiles Deep Pass, 2026-05-11).** Pick the chrome treatment based on **content shape**, not content semantics:
    - **Pill** — short, bounded, categorical labels (Sniff explorer, Fetch lover, Carer, vet clinic name). Sits inside `display: inline-flex`, single-line, fixed-ish width.
    - **Inline check** — affirmative facts with a one-state-only meaning (Vaccinations up to date, Spayed / neutered). Icon + colored text, no background, no border. Reads as "yes." `--success-600` text + `ShieldCheck` is the canonical PetCard usage.
    - **Body copy** — open-ended multi-sentence prose (conditions, socialisation notes, bios). `--text-secondary` paragraph, normal line-height, no chrome. Reads as a real note, not a label.
    - Caught us out 2026-05-11 on the PetCard Health & vet section — `vetInfo.conditions` was originally a `--status-warning-light` / `--status-warning-main` pill, but the content is open-ended ("Mild leash reactivity. No food allergies. Sensitive stomach with novel proteins.") so the pill chrome was wrong regardless of color. Body copy was the right treatment. Same call applies wherever a "label" surface needs to host genuinely paragraph-shaped content.
10. **Page-action slot in AppNav (Profiles Deep Pass A6, 2026-05-11).** Pages can declare a contextual primary action via `PageHeaderContext.setPageAction(node, { suppressCreate, navLockedIn })`. When set, the node renders in the AppNav nav row in place of the default Create (Camera+/CalendarPlus) icon. **`suppressCreate: true`** hides the default Create without providing a replacement (used by Posts tab where the action lives in-panel). **`navLockedIn: true`** additionally hides Bell + Inbox for a focused edit-mode lock-in — pair with hiding the page's own TabBar so the user must commit (Save) or abort (Cancel) to leave the state. The same `pageActionNode` flows into `PageColumn.headerAction` so the slot reaches both mobile (AppNav row) and desktop (`.page-column-header`) without duplicating logic. **First consumer:** Profile (Edit / Cancel + Save on About + Services; `+ New post` in-panel + suppressCreate on Posts). **Candidates for adoption:** booking detail, meet detail, group detail, any future "edit this thing" surface that benefits from a lock-in.
11. **Header actions = outline rectangle, not brand pill (Cross-Cutting Flow Testing, 2026-05-11).** Header-slot actions (the `headerAction` / `setDetailHeader` / `setPageAction` slot rendered in `PageColumn` or AppNav) use **`<ButtonAction variant="outline" size="sm" leftIcon={…}>Label</ButtonAction>`** with no `cta` modifier (rectangular). Reserves brand-filled pills for *primary commits* — row CTAs (Message, Connect), hero CTAs (Join community, RSVP), and modal-footer primaries. Without this hierarchy, members-tab views like `group-reactive-dogs` end up with a brand pill in the header AND brand pills on every row, with no visual signal of which is primary. **Same render across desktop and mobile** — `headerAction` JSX flows into both surfaces, so the convention is automatic once the variant is correct. Long titles truncate with ellipsis; the action button stays put. **Canonical examples:** Profile Edit (already correct), all four detail/page actions swept 2026-05-11 (Group Invite/Create/Post, Meet Share, Home Create/Post, Schedule Create). **Carve-out:** Profile edit-mode pairs an `outline` Cancel with a `primary` Save (both rectangular, no `cta`) — the destructive/constructive contrast on a focused-edit surface earns the brand-fill on Save without breaking the rectangular convention.
12. **Hydration gate for persona-identity-dependent side effects (Profiles Deep Pass C11 bugfix, 2026-05-13).** `useCurrentUser` resolves to the SSR/first-paint Tereza fallback until `localStorage` hydrates. Any side effect that reads `currentUserId` and acts on it (own-self redirects, audience gates, render-null branches keyed on identity) MUST gate on the hydration flag — otherwise pre-hydration code evaluates against the Tereza default and false-positives when the URL or context happens to match Tereza. **Hook:** `useIsHydrated()` from `@/hooks/useCurrentUser`. **Pattern:** `const isSelf = isHydrated && !isGuest && userId === currentUserId;`. First consumer: `/profile/[userId]` own-self redirect. Reusable for any future persona-identity-dependent decision (booking ownership checks, schedule view-mode gates, etc.).
13. **Paired CTA row that wraps on narrow viewports (Profiles Deep Pass, 2026-05-13).** `.btn` carries `white-space: nowrap`, so `flex-1` (= `flex: 1 1 0%`, basis 0) on paired CTAs can't shrink the buttons below content width — they overflow horizontally instead of wrapping. Pattern: `<div className="flex flex-wrap gap-sm w-full">` with `className="grow basis-[140px]"` on each ButtonAction. Result: both fit on one row (each grows from 140px to fill); when panel is narrower than `2 × 140 + gap`, they wrap to stacked full-width. Used on `/profile/[userId]` relationship/action row + own-profile Care CTA row + guest viewer CTA row. Drop `flex-1`; prefer this pattern for any paired-button row that needs to gracefully wrap.
14. **Care = blue, community = green (Service ↔ Meet Linkage, 2026-05-17).** Two semantic colour families split the app. **`--status-info` / `text-info-*` (blue) = care and paid services** — booking prices, the meet "About this service" card, the config #2 drop-off callout, Schedule care cards. **`--brand-*` (green) = community** — meets, groups, and the links to them. Group links render `--brand-main` everywhere they appear (meet hero, home + Discover feed cards). When a new surface introduces a price or a community link, colour it by this rule. `--color-info-strong` (bridges `--status-info-strong`) was added so `text-info-strong` is available as a Tailwind utility for blue text on light backgrounds. **Violet = volunteer** was added as the third family (Cross-Shelter Mentor Network, 2026-06-11→12): the `--volunteer-*` / `.credential-pill--volunteer` family plus the `volunteer` `ButtonAction` variant (`.btn-volunteer`, violet-700) for volunteer-path actions (Walk-a-dog, Walk-{dog}, the mentor "Book next session"/"Walk a dog" split buttons) and the violet left-accent on volunteer-path booking cards (`.booking-card--volunteer` — mentor sessions + solo shelter walks, placed before the `--past`/`--live` modifiers so those still override). **One job per family: green = community, blue = paid care, violet = volunteer.** A semantic family may own its CTA via scoped CSS without becoming a global concern; violet stays reserved for the volunteer path so it keeps one clear meaning (dial it back to neutral/outline if it ever reads as colour sprawl — e.g. the mentor booking *submit* is deliberately neutral, not violet, to keep violet on the navigation affordances).

15. **Coloured affordances are pills or links — never rounded coloured buttons (Adoption-Curious Journey, 2026-06-12).** A rounded-corner (non-pill) `ButtonAction` should read as **neutral** chrome; when an affordance needs a semantic colour (green/blue/violet), it takes the shape of a **pill** (`cta`) or a **text+icon link**, not a rounded coloured button. There is **no `text-brand` token** — semantic colour is applied as the text/surface colour directly. *Applied example:* the group-walk "Walk with a mentor" CTA is a violet **eyebrow link** (`.shelter-walk-mentor-link` — violet text + GraduationCap + caret, not a button); the doorway reassurance card uses a light violet wash, not a violet button. Violet is still **inlined hex** (`#6d28d9` etc.) pending a real `--volunteer-*` token family — the **Design-System Audit** (next-after-Service-Options) should promote the violet hex to tokens AND formalise this button-shape rule across surfaces.

---

## Primitives (`components/ui/`)

| Component | Purpose | Key props |
|-----------|---------|-----------|
| `ButtonAction` | All clickable actions — buttons, links, CTAs | `variant` (primary/secondary/tertiary/outline/neutral/soft/brand-subtle/white/outline-white), `size` (sm/md/lg), `href`, `cta`, `destructive`. **`neutral`** is filled `--surface-inset` with no border — use for inactive toggle states (RSVP not yet, Join community before joining) and quiet secondary actions (Decline, Skip). **`brand-subtle`** is filled `--brand-subtle` with `--brand-strong` text and no border — use for ACTIVE toggle states (Going, Interested, Joined, Following). The toggle pattern (FB Events "Interested" model): brand color appears ONLY on active state — never on inactive — so the brand presence reads as "your committed state, celebrated." Inactive is quiet (`neutral`) so the active state's brand identity isn't competed with. **`destructive` is a modifier, not a variant** (Design System Cleanup 2026-05-11) — it composes with primary / secondary / outline / tertiary so the destructive palette can scale from loud commit (`primary destructive`, filled error) through mid (`secondary destructive`, error-tinted) and ringed (`outline destructive`) down to text-only (`tertiary destructive`). Use the *quietest* combination that still reads as the destructive path — keep `primary destructive` for the commit action of a Cancel-confirmation modal where it IS the primary action of the flow. |
| `ButtonIcon` | Icon-only buttons (40px square) | `icon`, `badge` (notification dot) |
| `InputField` | Text inputs with label, helper, error | `label`, `error`, `helper` |
| `CheckboxRow` | Labeled checkbox | `checked`, `label`, `placement` |
| `Toggle` | On/off switch for immediate settings | `checked`, `onChange`, `size` (default / `sm`), `strong` (bold label via `.toggle-label--strong` — for option-header rows, e.g. `PricedToggleRow`). `sm` is the compact track. |
| `PricedToggleRow` | A priced opt-in row for carer service editors (walk delivery options, appointment meeting-locations) | `label`, `description?`, `checked`, `onToggle`, `price`, `onPriceChange`, `unitLabel`, `inputId`. Bold option name + small toggle on row 1; muted subline + compact price input (unit *inside* via `.input-with-trailing`) on row 2 when on. One shared shape so the editors read identically. Service Options & Booking Clarity, 2026-06-16. |
| `TabBar` | Horizontal tab row | `tabs`, `activeKey`, `onChange`. The bar itself overflows scrollably (`max-width: 100%; overflow-x: auto`) with `flex-shrink: 0; white-space: nowrap` on each tab — mirrors the `.filter-pill-row` pattern. Without this, narrow viewports bleed horizontal scroll onto the panel body. (Inbox & Notifications, 2026-05-08.) |
| `StatusBadge` | Contract lifecycle + session state labels | `status` |
| `SectionLabel` | Section heading in lists/panels | `label` |
| `EmptyState` | Zero-content placeholder | `icon`, `title`, `subtitle`, `action` |
| `Slider` | Single or dual-thumb range slider | `min`, `max`, `value`, `dual` |
| `MultiSelectSegmentBar` | Joined multi-select buttons (days, time windows) | `options`, `selected` |
| `DatePicker` | Single-date and range date picker | `mode` (single/range) |
| `RecurringSchedulePicker` | Days + time picker in ModalSheet | — |
| `ConnectionIcon` | Visual connection state indicator | `state` |
| `DefaultAvatar` | Fallback avatar with initials | `name`, `size` |
| `BookingRow` | Booking list item (My Bookings + My Services) | `booking`, `perspective` |
| `FilterPillRow` | Unified horizontal scrollable filter pills | `pills`, `activePill`, `onChange` |
| `CameraPlusFill` | Camera icon with plus badge (photo upload prompt) | `size`, `className` |
| `Alert` | Tinted callout card with icon + title + optional description + optional dismiss × | `kind` (info/success/warning/error), `title`, `description`, `onDismiss`. Photos & Galleries 2026-06-04. Used inline for page-level callouts AND as the body of transient toasts via `<ToastHost>` / `useStubNotice()`. Tone-matched fill + border per variant; icon picked per kind (Info / CheckCircle / WarningCircle / XCircle). |

## Layout (`components/layout/`)

| Component | Purpose | Notes |
|-----------|---------|-------|
| `LoggedInShell` | Top-level shell: Sidebar + content area | Wraps all logged-in routes. Calls `useScrollHideNav`. |
| `Sidebar` | Desktop 7-item nav (Community → Profile) | Hidden on mobile. Width: 180px. |
| `AppNav` | Top navigation bar (3 modes: Guest, Signup, Logged) | Mobile only for logged-in routes. |
| `BottomNav` | Mobile 5-tab nav | Community, Discover, My Schedule, Bookings, Profile. |
| `PageColumn` | Canonical single-column page layout | Centered 640px column. Used by all pages (Community, Schedule, Discover sub-pages, Inbox, Bookings, etc.). Replaced MasterDetailShell and DiscoverShell (both deleted). `abovePanel` prop for content above the panel (e.g. filter pills). |
| `PanelBody` | Scrollable panel interior | Use inside raw `<div className="list-panel">` or `<div className="detail-panel">`. |
| `LayoutSection` | Padded content block inside PanelBody | Adds horizontal padding. |
| `LayoutList` | Edge-to-edge card list inside PanelBody | No horizontal padding. |
| `Spacer` | Bottom spacer (last child of PanelBody) | Prevents content from being clipped by panel border-radius. |
| `DetailHeader` | Back-button header for detail/subpages (desktop) | Back target wraps arrow + title as single clickable area. Accepts `backHref` (Link) or omitted (router.back). Renders inside `PageColumn`'s `abovePanel` slot. **Pairs with `setDetailHeader` (PageHeaderContext) on mobile** — the AppNav-rendered detail header (`.app-nav-detail-header`) is `display: none` above 767px, so detail pages set both: `setDetailHeader(title, onBack)` for the mobile bar in AppNav AND a `<DetailHeader>` `abovePanel` for desktop. Pattern: `app/bookings/[id]/page.tsx`, `app/bookings/[id]/active/page.tsx`, etc. (Inbox & Notifications H, 2026-05-08.) |
| `FormHeader` / `FormFooter` | Multi-step form page header and footer | Back/Continue button row. |
| `GuestLayout` | Layout shell for public/guest routes | — |
| `ListPanel` | *(Legacy — avoid for new code)* | Wrapper for list panels. Use `PanelBody` inside raw div instead. |
| `DetailPanel` | *(Legacy — avoid for new code)* | Wrapper for detail panels. Use `PanelBody` inside raw div instead. |

## People (`components/people/`)

| Component | Purpose | Notes |
|-----------|---------|-------|
| `PersonRow` | Canonical row for rendering a person — meet attendees, group members, inbox conversations | Variants: `meet-attendee`, `group-member`, `inbox-conversation`, `default`. Non-inbox variants render with the `OwnerDogAvatar` combo (owner + overlapping dogs) on the left, identity column on the right. Identity column locked to 64px height; name-row is `h-8 -ml-3` (32px tall, pulled 12px LEFT toward the owner — the asymmetric offset that gives consecutive cards visual distinction). Pet text below uses `text-sub` (13px) with `leading-8`. Inbox variant is denser (44px owner circle, paw-icon + text dog line, no overlapping dog avatars). Action set resolves automatically via `lib/personActions.ts:resolvePersonActions` per the Trust & Visibility action matrix; pass `actions={[]}` for info-only mode (suppresses CTAs and Familiar toggle pill — Pending status pill still renders). Connection-state pill suppressed on `none + theyMarkedFamiliar` per the deniability guardrail (see `Trust & Connection Model.md`). **No Carer-status badge on PersonRow** (Discover Refinement 2026-05-10 retired the per-row tier pill — connection grouping + section labels carry that signal at the surface level). |
| `OwnerDogAvatar` | Owner-forward avatar primitive — owner circle (64px) + dog cluster overlapping bottom-right | Inline-flex combo. Dog cluster lives in a 44px right-aligned slot anchored to the owner via `margin-left: -16px`. Dog size dynamic: 36px when single-slot rendered (lone dog), 32px when two-slot (2 dogs OR 1 dog + chip). Cap at 2 slots max — 3+ dogs collapse to 1 dog avatar + "+N" chip. Owner stays a circle (humans = circles); dogs use `--radius-md` 12px-rounded squares with a `box-shadow` ring on the outside (so the image stays a true 32×32). Used by `PersonRow` non-inbox variants and by `PostMeetReviewSheet`'s AttendeeActionCard. Internal dog-image lookup via `getDogImageByOwnerAndName`. |
| `PersonSections` | Shared section primitives for person-row surfaces | Exports `SectionHeader` (uppercase tracking-wider label between row groups — CONNECTED, FAMILIAR, ADMINS), `MetaDivider` (hairline rule + `mt-md`, separates higher-level groupings like Going block vs Interested or Admins block vs the rest), `LockedChipList` (chip list for tier-3 rows that don't render as cards). Used by `ParticipantList` (meet People tab) and `MembersTab` (group detail Members tab). |

## Overlays (`components/overlays/`)

| Component | Purpose |
|-----------|---------|
| `ModalSheet` | Desktop centered card / mobile bottom sheet. `compact` prop tightens the card for short content (`modal-sheet-card--compact`). |
| `BookingModal` | Open-ended provider booking — service picker + date range + message + success flow |
| `ServiceBookingSheet` | Lightweight "book this scheduled session" — pre-filled date/time/provider/price, optional message, confirm. **Legacy** — serves `serviceCTA`-only meets with no resolvable linked service; superseded by `BookSessionSheet` for the linkage model, retires when `serviceCTA` is removed. |
| `BookSessionSheet` | Meet-type service booking (Service ↔ Meet Linkage) — occurrence picker across the service's linked meets; on confirm creates a `Booking` with `meetBooking` set + adds the owner to the meet roster. Reached from the carer's Services tab and a linked meet's detail page. |
| `LinkedWalkBookingSheet` | Config #2 linked-care booking — pick a date on a free meet's schedule, book the carer to walk your dog. Hosts the delivery picker (`MultiSelectSegmentBar`, pickup-default) when the walks_checkins service offers both methods; the chosen `delivery` and final price persist on the `Booking`. Creates a plain Care `Booking` with `dropoffMeetId` set; does **not** add the owner to the roster (book ≠ attend). Renamed from `DropoffBookingSheet` (Walk Service Delivery 2026-05-20). |

---

## CSS Pattern Classes

Shared CSS classes in `globals.css` that are used across multiple components. Use these instead of recreating with Tailwind.

| Class | Purpose | Notes |
|-------|---------|-------|
| `.pill-group` + `.pill` / `.pill.active` | Multi-select filter pills | Toggle on/off, brand color when active |
| `.tag` | Compact label (4px radius) | For post tags, metadata labels |
| `.chip` | Pill-shaped label (12px radius) | Service chips, booking chips |
| `.input-with-leading-icon` + `.input-leading-icon` | Text input with a leading icon (e.g. a map-pin on an address field) | Mirror of the trailing `.input-with-icon`. Icon at `left: 10px`, input `padding-left: 32px` (gap tuned to match list-row icon spacing). Used by the walk handoff-location field. Service Options & Booking Clarity, 2026-06-16. |
| `.avatar` | 40×40 circle image | Standard user/dog avatar |
| `.card-schedule-meet` | Schedule/booking card | Left accent border, consistent padding |
| `.feed-card-*` | Feed card layout system | Two-column (avatar + content), two-row header |
| `.feed-card-provider-badge` | "Carer" badge on feed cards | Shown on posts by care providers |
| `FeedShareNudge` | Share prompt in community feed | Encourages photo/content sharing |
| `.sched-card-days` | Day chips on schedule care cards | Shows recurring day abbreviations |
| `.sched-card-role--providing` | Provider role badge on schedule cards | Distinguishes provider vs owner perspective |
| `.filter-pill-row` | Unified horizontal filter pill row | Used by all Discover sub-pages and Schedule Care tab. Replaced `discover-type-pill` CSS. |
| `.booking-card` | Redesigned booking/care card | Full accent border for provider/host cards, action verb labels |
| `.filter-accordion` | Inline collapsible filter sections | Used in FilterBody |
| `.md-shell` / `.list-panel` / `.detail-panel` | *(Deleted)* MasterDetailShell panels | Replaced by PageColumn |
| `.person-row` + `.person-row--*` variants | Shared person-row chrome | Used by `PersonRow`. Variant modifiers: `--meet-attendee`, `--group-member`, `--inbox-conversation`, `--default`. Row uses `gap: var(--space-xl)` (20px) between avatar combo and identity column. Inbox variant is denser + transparent (sits inside flush conversation list); others are panel-bordered cards. |
| `.person-row-pill` + `.person-row-pill--familiar` / `--pending` / `--admin` / `--provider` / `--helper` | Connection-state, role, and tier pills inside `PersonRow` | Familiar/pending/admin use `surface-inset` neutral. Provider tier uses `brand-subtle` (public, professional). Helper tier uses `surface-inset` (informal, Connected-only privacy gate enforced by caller). Connected status renders no pill (the Message CTA carries the signal). `.person-row-pill--care` retained as legacy alias of `--provider`. |
| `.person-avatar-*` | OwnerDogAvatar primitive (combo container, owner img, dogs slot, dog avatars, "+N" chip) | `.person-avatar-combo` is inline-flex with `align-items: flex-end`, `height: 64px`. `.person-avatar-dogs` is the 44px right-aligned slot with `margin-left: -16px` anchoring it to the owner. Dog size set inline (36px / 32px) per slot count. |
| `.live-pulse-dot` | Animated pulsing dot — "live now" indicator | Custom-property API: `--live-pulse-color` (default `--status-warning-strong`) and `--live-pulse-size` (default `8px`). Pulses via `@keyframes live-pulse` (opacity + scale). Used by mobile `ActiveSessionBanner`, desktop `SidebarActiveSessionLink`, and the in-page Live pill on `ActiveSessionPanel`. (Sessions & Service Execution → Inbox & Notifications, 2026-05-08.) |
| `.active-session-frame` + `.active-session-frame-content` + `.active-session-action-footer` | Page-level frame for the active session sub-page | 4px left amber accent stripe (`border-left: 4px solid var(--status-warning-strong)`) on the frame; content slot inside; sticky bottom action footer (`position: sticky; bottom: 0`) carrying Finish + Undo. The page IS the active surface — `ActiveSessionPanel` within renders content only. (Inbox & Notifications H, 2026-05-08.) |
| `.pet-profile-play-pill` + `.pet-profile-vet-pill` | **Neutral pill** treatment shared inside PetCard | `--surface-inset` fill + `--border-strong` border + `--text-secondary` text. Reads as a quiet bounded label against the `--surface-base` PetCard. The earlier borderless variant blended into the card surface; adding the border gives the pill a defined silhouette. Future consolidation: when a third consumer surfaces, promote to a general `.pill--neutral` class. (Profiles Deep Pass, 2026-05-11.) |
| `.pet-profile-energy-pill` (palette via `ENERGY_COLORS` in `PetCard.tsx`) | **Energy pill** — colored variant of the neutral pill | Per-level `--{level}-50` fill + `--{level}-600` border + `--{level}-600` text. Scoped to the PetCard — does NOT touch the app-wide `--status-*` tokens. Bumped from `*-25`/`*-500` to `*-50`/`*-600` 2026-05-11 because the pale tint blended into the card. |

---

## Page Shell Patterns

Single-panel pages (Community, Schedule) use their own shell classes instead of MasterDetailShell:

| Page | Shell class | Panel class | Notes |
|------|-------------|-------------|-------|
| Community | `.community-page-shell` | `.community-panel` | Feed/Groups tabs, category filter pills |
| Schedule | `.schedule-page-shell` | `.schedule-panel` | Upcoming/Interested/Care tabs, simple single-panel |
| Group detail | `.group-detail-page` | — | Banner + info + sticky tabs |
| Meet detail | `.meet-detail-page` | — | Tabbed: Details · People · Chat |

All pages now use PageColumn. MasterDetailShell and DiscoverShell have been deleted.

---

## Consolidation Queue

Active list of things to merge, simplify, or remove. Work these down over time.

| Item | Issue | Proposed fix |
|------|-------|-------------|
| `ListPanel` / `DetailPanel` | Legacy components still in codebase, CLAUDE.md says don't use | Remove files, update any remaining imports to use `PanelBody` + raw divs |
| `MasterDetailShell` / `DiscoverShell` | Deleted — replaced by PageColumn | Remove any lingering CSS or references |
| Provider ID mismatch | `mockData.ts` uses `olga-m`, `nikola-r`; `mockUsers.ts` uses `jana`, `nikola` | Unify to one naming scheme before backend work |
| Duplicate CSS for single-panel pages | Community and Schedule shells follow the same pattern but have separate CSS | Consider a shared `.single-panel-shell` base class |
| `.feed-card-body--simple` variant | Only used for authorless cards; may be removable | Audit usage, consider removing if unused |
| `discover-type-pill` CSS | Consolidated into `.filter-pill-row` | Remove old class if no remaining references |

---

## Recurring patterns

### Section rhythm — tight header, larger body gap

Shared by `.profile-tab-stack > section` AND `.dog-profile-section` (the two parallel "header + body" section surfaces). Implemented as a comma-separated selector list so future section surfaces can opt in by extending it.

```css
.profile-tab-stack > section,
.dog-profile-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);                                /* header → first body item: tight */
}

.profile-tab-stack > section > :nth-child(n+3),
.dog-profile-section > :nth-child(n+3) {
  margin-top: calc(var(--space-md) - var(--space-sm)); /* body → body: larger */
}
```

Assumes the section's first child is the header. CSS-only — no JSX wrapper needed. Visual chrome (padding / background / border) stays per-class because the two surfaces render in different layout contexts. Photos & Galleries 2026-06-04.

### Stub-action toast

Pattern for any in-prototype action that isn't wired up yet but should LOOK present (e.g., Edit post, Delete post, Report). Stub buttons call `useStubNotice().notify({ feature, note })` instead of silently closing — a non-modal toast slides in from the top-right (top on mobile), auto-dismisses after ~6s, manually × dismissible.

- **For demo viewers:** clear signal the action is intentionally inert, not broken. Non-blocking so they can keep exploring.
- **For the team:** a self-documenting bookmark while walking the app — every stub announces itself.

Lives in `contexts/StubFeatureContext.tsx`, mounted at the app root. Renders the `<Alert kind="info">` (see Primitives table). Photos & Galleries 2026-06-04.

### Post detail surface — modal lightbox, not a route

Doggo deliberately has no `/posts/[id]` route — comments aren't a primary platform thread. Any caller that wants to show a single post uses `usePostDetail().openPost(postId, opts)` from `PostDetailContext`; a global lightbox at the app root renders the post photo-led. Cross-post navigation via `collection` (with optional `photoIndices` for per-item starting photo), within-post nav togglable via `withinPostNav`. Used by PhotoGrid tiles, PostPhotoGrid photos in feed cards, Highlights thumbs, tag-pending notifications. See `features/profiles.md` → "Post detail surface".

### Service-card views — one renderer for both profile surfaces

`components/profile/ServiceCardViews.tsx` exports the four presentational service-card views (`CareServiceCardView`, `MeetServiceCardView`, `AppointmentServiceCardView`, `MentorServiceCardView`) used by BOTH the own-profile preview (`ProfileServicesTab`) and the viewer-facing `/profile/[userId]`. Each takes the service config + an optional `action` slot (the viewer surface passes a Book/Ask CTA; the own-profile preview passes none); the mentor view also takes an optional `progress` node. Before this, the two surfaces carried independent copies of the markup and drifted — the own-profile Care card had lost the "From" prefix, the pickup/drop-off delivery breakdown, and the full-day/half-day duration breakdown, so a carer saw a different (wrong) price on their own profile than visitors saw. The shared views are the single source of truth; the kind-order is also unified (appointment → mentor → care → meet) so the own-profile preview faithfully mirrors what owners see. The chip chrome converged on the viewer-facing inline rounded-pill treatment (`bg-surface-popout` bordered) over the own-profile's old `.chip`. Label maps (`MEET_FORMAT_LABEL` / `MEET_CADENCE_LABEL` / `APPOINTMENT_CATEGORY_LABEL`) live in `lib/constants/services.ts`. Design-System Audit + Cleanup WS-A, 2026-06-20.

---

## When to update this doc

- **Adding a component:** Add it to the appropriate table above.
- **Removing a component:** Remove from table, add to Consolidation Queue if cleanup is needed elsewhere.
- **Adding a CSS pattern class:** Add to the CSS Pattern Classes table.
- **Spotting duplication:** Add to Consolidation Queue.
- **Completing a consolidation:** Remove from queue, update tables.
