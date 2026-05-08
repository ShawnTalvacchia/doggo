---
status: active
last-reviewed: 2026-05-08
review-trigger: "Update as items are walked, edit as scope adjusts"
---

# Inbox & Notifications — Walkthrough

Verification checklist for the Inbox & Notifications phase. **This document is for checking, not record-keeping** — decisions, follow-ups, and findings belong in the phase board, Open Questions log, or feature docs. The "Decisions surfaced during walkthrough" section at the bottom is the one place where emergent stuff is captured inline.

**Scope rule.** Walkthroughs verify the **phase thesis** — *typed-but-undelivered notifications become real, the inquiry-driven trust model finishes, the two notification surfaces collapse to one, and the messaging-stream design questions get coherent answers*. Items that should work but aren't core to the thesis go in `verification-checklist.md`.

**How to use:**

1. Run the dev server (`npm run dev`, port 3000).
2. Switch personas via the profile-page name dropdown, the `/demo` route, or the `?as=<personaId>` URL param.
3. Tick items as you go.

**Status legend:** `[ ]` not yet walked · `[x]` walked, no issues.

**Anchor demo flows:**

| Booking | Personas | What it shows |
|---|---|---|
| `booking-klara-daniel` (recurring training, weekly Wed 10am, 5 completed + 1 upcoming = `kd-6`) | Daniel (owner), Klára (provider) | Notification fires on Start + Finish (A2/A3); G1 schedule review-recent; G2 /bookings strip; G3 inline review CTA; E2 edit-after-submit |
| Tomáš → any provider with no prior conversation (e.g. Lenka via `/profile/lenka` or whoever has a Care/Appointment service) | **Tomáš (owner)** | First-message → mutual Familiar (B1) |
| Any thread with multiple proposals (Pricing & Proposals seeded a few — find one with countered/declined/accepted state) | Either side | E3 — superseded card subdue + expand-on-click |

**Pre-state:** wipe local state via `/demo` → "Reset demo state" before walking, so seeded `mockNotifications` is the bell's starting list (no leftover runtime fires from prior runs). The seeded `notif-10` Klára/Daniel session-completed mock is gone — the bell list will look slightly shorter than before.

---

## Workstream A — Notification delivery wiring

The bell goes from "designed but quiet" to actually firing on session lifecycle.

- [ ] **A1. Any persona → `/notifications`** (after demo reset). Sanity check that the old hand-coded `notif-10` placeholder is gone — there's **no** entry titled "Training session completed" with body "Klára completed Bára's reactive dog session. Leave a review?" That seed was deleted in A4 of the build because the real fire path (A2/A3 below) supersedes it. The rest of the seeded list is unchanged.
- [ ] **A2. Klára → `/bookings/booking-klara-daniel?tab=sessions` → tap Start on `kd-6`.** Status flips to in_progress (Active panel renders). Now switch persona → **Daniel** via the profile-page name dropdown. Daniel → `/notifications`: **a new entry sits at the top — "Klára started Bára's walk"** (or *"started sitting with Bára"* / *"started Bára's boarding stay"* depending on `serviceType`; for `inhome_sitting` it'd be sitting). Body: *"Tap to follow along — see photos and updates as they come in."* Avatar: Klára. Tap → routes to `/bookings/booking-klara-daniel?tab=sessions`. Mark all read clears the unread state without removing the entry.
- [ ] **A3. Klára → finish that same session (Active panel "Finish session").** Single-tap seal. Switch to Daniel → `/notifications`: **a fresh "Klára finished Bára's walk" entry** at the top (above the started one — or the same row if persona-switch latency reordered). Body: *"Tap to view the visit report and leave a review."* Tap → routes to `/bookings/booking-klara-daniel?tab=sessions`. The seal also makes the strip on `/bookings` light up (see G2) and the Schedule review-recent card appears (see G1). Three surfaces, one event.
- [ ] **A4. Reload the page** (`Cmd+R` on `/notifications`). Both notifications survive the refresh — they're persisted via `usePersistedState("doggo-notifications")`.
- [ ] **A5. `/demo` → "Reset demo state".** Notifications list returns to the seeded set; the runtime entries from A2/A3 disappear. The `doggo-notifications` key is wiped alongside other persisted demo state automatically (no extra wiring — `clearDemoLocalStorage`'s `doggo-` prefix sweep + `resetPersistedState("doggo")` cover it).
- [ ] **A6. Schedule quick-start path (`?as=klara` → `/schedule?view=care`).** Today's Klára-Daniel session card → tap "▶ Start session" — same `session_started` notification fires for Daniel even though the path is different. Two real Start call sites, one notification builder.

---

## Workstream B — Inquiry-driven trust transitions, finishing

The fourth rule lands: first message in a non-Connected conversation auto-marks both sides Familiar.

- [ ] **B1. Set up: persona = Tomáš.** Pick a profile Tomáš has no existing connection to and isn't already Familiar with. Quickest path: `/profile/[someId]?tab=chat` for someone who's not in his connections list. (The Pricing & Proposals seed gave Tomáš a few connections; pick around them.) Verify on the profile that the Familiar state is **not** already set.
- [ ] **B2. Tomáš → type a message in the chat tab → send.** First message in this thread. Behind the scenes: `markFamiliar` fires both directions. Reload → navigate to the same profile: the Familiar marker is now present (e.g. tag near the name, profile chrome reflects Familiar viewer state).
- [ ] **B3. Switch persona to the recipient → open `/profile/tomas?tab=chat`.** They see Tomáš's message AND can see Tomáš's profile content as a Familiar viewer would (relevant for locked profiles — content that was hidden pre-message is visible). Symmetrical mark.
- [ ] **B4. Send another message in the same thread.** No double-fire — the gate `getConnection(other, viewer).state` returns `familiar` after B2, so the rule short-circuits. (Hard to verify externally; a console-side check would confirm — for the walkthrough just confirm the relationship state is unchanged.)
- [ ] **B5. Pre-Connected sanity.** Pick a Connected pair (e.g. Tereza and any of her Connected contacts) — sending a first message in their thread shouldn't downgrade or create override pollution. State stays Connected (`getConnection`'s state-rank merge prevents downgrade).

---

## Workstream C — Collapse to one notification surface

One bell, one surface.

- [ ] **C1. Any logged-in persona → click the bell icon in the top-right of any page.** **Desktop:** routes to `/notifications` (no dropdown panel slides down). **Mobile:** same — routes to `/notifications`. Same behavior on both viewports; the bell now uses the same `ButtonIcon{href}` pattern as the inbox icon next to it.
- [ ] **C2. The dropdown is gone.** No `NotificationsPanel.tsx` import in AppNav; no flickering panel on bell hover; clicking nothing else dismisses anything. Just navigation.
- [ ] **C3. `/notifications` page chrome.** Corner unread pip on the avatar (`.notif-unread-badge`), uppercase category tag (`.notif-cat-tag`) with `·` separator + relative timestamp on the top row. Body line below. Pattern: `{title}                  CARE · 7d ago` / `{body line}`. This is the chrome that previously diverged from the dropdown — now it's the only surface.
- [ ] **C4. Grouped notifications still work.** Anywhere `meet_rsvp` or `group_activity` events stack on the same href, the avatar stack renders (`.notif-avatar-stack`) with up to 3 stacked avatars + group title (e.g. "3 people are going to your meet"). Page-level grouping logic is untouched.

---

## Workstream D — Inbox visual + UX hygiene

Inbox row reads cleaner.

- [ ] **D1. Density.** `/inbox` → rows have ~12px vertical padding (was 8). The 3-line cluster (name+meta / dog+service / preview) breathes; rows no longer feel packed. Divider between rows is subtler (was regular border, now subtle).
- [ ] **D2. "You:" prefix.** Find a thread where you (the current persona) sent the last text message. Inbox row preview reads `You: …` not just `…`. System-message kinds (inquiry, proposal, contract, payment) **don't** get the prefix — those still read as their framed event ("New inquiry" / "New proposal" / etc).
- [ ] **D3. Name normalization.** All inbox rows render names as `firstName LastInitial.` (e.g. "Lucie Č.", "Jana K."). No row shows a full last name like "Lucie Černá". Single-name personas stay as-is. The connected-without-conversations branch (people with no thread yet but you're connected) follows the same rule.
- [ ] **D4. Dog data.** Every row that has a dog associated (via inquiry pets OR partner's profile pets) shows the paw icon + dog name(s) inline next to the partner name. Rows without a dog (provider with no pets seeded, or a direct conversation with no booking + no profile pets) just show the partner name — no orphan paw icon.
- [ ] **D5. System-message preview chrome.** Inquiry / proposal previews carry the `✦` glyph in brand color; payment previews carry the `✓` glyph in success color. Text previews stay plain. (Contract preview kind was retired — no rule should fire for it.)

---

## Workstream E — Messaging-stream design questions

Decided + minimum-viable for the ones that need build.

- [ ] **E1. Timestamps (decided, no build).** `/inbox/[conversationId]` → text bubbles + structured cards (proposal/inquiry/payment) all render with trailing/separator timestamps below each artifact. No per-bubble corner timestamps. Date dividers carry the day labels. This is the same as before — confirming it survives the phase + is documented in `messaging.md` Key Decisions §9.
- [ ] **E2a. Edit-after-submit window — within 24h.** Klára seals a session (use the kd-6 path from A3, OR find any pre-seeded sealed report ≤24h old; default-state seeded reports are 7 days old so they won't have the edit affordance). Klára → that session row on `?tab=sessions`: an inline **Edit** link sits to the right of "Completed at HH:MM". Tap → notes flips to a textarea. Edit, **Save**. Notes update; an italic *edited* tag appears next to the timestamp. Switch to Daniel → same booking → Sessions tab: he sees the new notes + the silent *edited* tag. No bell notification, no chat system message.
- [ ] **E2b. Edit window expires after owner views.** With Klára's seal still fresh, switch to Daniel → open Sessions tab (he reads the report) → switch back to Klára → same row: **Edit link is gone** (`ownerLastViewedAt > completedAt` killed the window). The chronicle locks once read.
- [ ] **E2c. Edit window — provider-only affordance.** Daniel viewing the same sealed report sees no Edit link regardless of timing — owner-side never gets it (`canEdit` gates on `canAct === true`).
- [ ] **E3a. Superseded proposal chrome.** Open a thread with a countered or declined or accepted proposal (Pricing & Proposals seeded several — find Tomáš/Klára or similar). The card is **dimmed (opacity 0.7)**, header background is `--surface-inset` (no longer the vivid blue), icon + label are tertiary/secondary contrast. The pending proposal in the same thread (if any) keeps full-color chrome — visual hierarchy clearly separates active from chronicle.
- [ ] **E3b. Tap-to-expand.** Tap anywhere on a collapsed/superseded card body → it expands inline showing the full chronicle (service, pets, schedule, line items, total, custom-quote callout if present). A trailing CaretDown next to the collapsed title hints at the affordance. Keyboard: it's a real `<button>` with `aria-expanded`. Inside the expanded body, a "▲ Show less" toggle returns to compact.
- [ ] **E3c. Accepted-proposal footer survives.** When an `accepted` proposal is collapsed, the footer Link to `/bookings/[id]` still works — tapping the body expands; tapping the footer routes (independent click targets).
- [ ] **E4. Owner pre-session notes (decided, no build).** Quick spot-check: `Booking.ownerNotes` still renders on the booking detail Info tab as persistent care instructions. No `BookingSession.ownerNote` field on per-occurrence sessions (deferred per the principle in `explore-and-care.md` §7). Confirm both feature docs (`messaging.md`, `explore-and-care.md`) have the principle documented.

---

## Workstream F — Cleanup from Pricing & Proposals close

Dead code is gone.

- [ ] **F1. ContractCard.tsx is deleted.** Verify via filesystem — `components/messaging/ContractCard.tsx` does not exist.
- [ ] **F2. `.inbox-contract-card*` CSS rules are gone.** Search globals.css — only the comment block "ContractCard CSS retired during Inbox & Notifications F2" remains as a marker.
- [ ] **F3. `ChatMessage.type === "contract"` is gone.** Open any thread that previously had contract messages — they don't render (the seed dataset had none, but if any survived they'd be silently skipped). The `MessageType` union no longer includes `"contract"`. `ContractConfirmation` interface is removed. The accepted-state footer on `BookingProposalCard` carries the signing signal (`Signed HH:MM · View booking →`) — verify this footer still renders correctly on a previously-accepted proposal.

---

## Workstream G — Walkthrough audit findings (carried in)

The three issues surfaced during scope-locking.

- [ ] **G1. Schedule review-recent label adapts to fresh seals.** Daniel after Klára seals `kd-6` today → `/schedule?view=history` (`?as=daniel`). The Klára booking now appears in "Review recent activity" alongside any pending meet reviews. Header reads **"Review recent activity"** (mixed) or **"Review your carer"** (session-only) — never just "Review recent meets" when sessions are present. Fix: today's `completedAt` is now included (`<= todayIso`).
- [ ] **G2. /bookings strip fires for fresh seals.** Continue from G1 — Daniel → `/bookings`. The Klára booking row shows the **"New visit report from Klára · {today's date} ›"** strip at the bottom of the card. Fix: `markedBookingRef` sentinel — persona switches no longer re-stamp `lastViewedAt` mid-walkthrough. Tap the card → routes to `?tab=sessions`. Navigate elsewhere and return: indicator gone. Reset demo and reseal: indicator returns.
- [ ] **G3. Inline review CTA on Sessions tab.** Daniel → `/bookings/booking-klara-daniel?tab=sessions` after a fresh seal. **At the top of the Sessions tab** (right after the pet hero, before the Active panel / sessions list) sits a brand-tinted **"Leave a review for Klára"** prompt with a Star icon and "Helps the community know who to trust." subline. Tap → opens the same `CareReviewSheet` modal as the Info-tab CTA. Submit a review → prompt disappears (gates on `!hasReview(booking.id)`). Same flow on cancelled bookings: prompt **does not appear** (the cancelled banner above already sets the read-only frame).

---

## Decisions surfaced during walkthrough

Emergent decisions, design changes, or rationale that surfaced during verification and need to land in their proper home docs. **Append as you walk** — don't wait until the end. **At phase close, sweep this list** — update each named doc, mark each entry `[x]`. The walkthrough should not be archived until every entry here is processed (or explicitly marked "no doc update needed").

Format:
```
- [ ] **{Decision in one line.}** {Optional one-line context.} → `features/foo.md`
- [ ] **{Implementation-only change}** {What/why.} → no feature-doc update needed
```

<!--
Conventions:
- Each verification item starts with a bold persona + URL anchor so the reader knows where to go without reading the rest.
- Expected outcomes use sub-bullets when there are multiple things to confirm; one-line item otherwise.
- Use `**bold**` for the things that should match, `*italic*` for trigger notes / explanatory copy.
- DO NOT add "Findings & follow-ups" sections to individual workstreams — those belong in the phase board, Open Questions log, or a relevant feature doc. Workstreams are verification-only. The Decisions section above is the ONE place where emergent stuff is captured inline.
-->
