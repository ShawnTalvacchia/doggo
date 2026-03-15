# Doggo – Product Board

_Living tracker of build state, priorities, and open decisions. Update this after each working session._

---

## Status Key

| Symbol | Meaning                                  |
| ------ | ---------------------------------------- |
| ✅     | Done — shippable                         |
| 🔧     | Done — needs polish or known rough edges |
| 🟡     | In progress                              |
| ⬜     | Planned / queued                         |
| ❌     | Explicitly out of scope (Provider MVP)   |

---

## What's Built

### Foundation

- ✅ Design token system (primitives → semantic tokens → component classes)
- ✅ `frontend-style.md` enforced — no raw inline styles in product surfaces
- ✅ Global layout: `AppNav`, `BottomNav`, responsive behaviour
- ✅ Styleguide (`/styleguide`) — tokens, typography, components

### Landing Page (`/`)

- ✅ Hero section with eyebrow pill, accent text, animated provider card
- ✅ Trust badges (icons, correct token usage)
- ✅ Stats bar
- ✅ Services grid (3 types)
- ✅ How It Works — interactive tab switcher (owners / sitters)
- ✅ Featured sitters with "Available" badge
- ✅ Feature card grid (Why Doggo)
- ✅ Bottom CTA with white/outline-white CTA variants
- ✅ All CTAs use `ButtonAction` — no landing-specific button CSS

### Signup Flow (`/signup/*`)

- ✅ Full 9-step flow (start → role → profile → care-preferences → walking → hosting → pricing → pet → success)
- ✅ Step sequence adapts to roles selected
- ✅ `SignupContext` holds draft state for session
- ✅ `SignupProfilePreview` on success page
- 🔧 Signup draft not yet persisted to Supabase (intentional for now)

### Explore & Discovery

- ✅ Results page with service filter, price range slider, time-of-day filter
- ✅ `CardExploreResult` — provider cards with trust signals
- ✅ Filter state in URL query string
- ✅ Desktop filter panel + mobile bottom-sheet filter panel
- 🔧 Map placeholder exists but no live map integration

### Provider Profile (`/explore/profile/[id]`)

- ✅ Mobile panel layout + desktop two-column layout
- ✅ Tab navigation: Info | Services | Reviews
- ✅ `ProviderHeaderState` — expanded + condensed states
- ✅ Info tab: about, photos, care experience, home environment, pets
- ✅ Services tab: service blocks with rate rows, weight bands, correct titles/subtitles
- ✅ Reviews tab: per-review cards
- ✅ Photo gallery + lightbox
- ✅ `ContactModal` — compose + sent confirmation states
- 🔧 Header scroll-link (expanded → condensed) is a toggle, not real scroll behaviour
- 🔧 Services tab data is `defaultServices()` fallback until Supabase services schema is seeded

### Authentication

- 🔧 Sign-in page (`/signin`) exists but no real auth — demo navigation only
- ❌ Supabase write path (signup → persist)

---

## What's Next

### ✅ Inbox & Chat (complete — mock/local-state)

- ✅ `Conversation`, `ChatMessage`, `BookingProposal` types in `lib/types.ts`
- ✅ `lib/mockConversations.ts` — 3 realistic conversations (Olga/walk, Nikola/boarding, Jana/walk + pending proposal)
- ✅ `/inbox` — conversation list: avatar, unread dot, service chip, dog name, last message preview, relative time
- ✅ `/inbox/[conversationId]` — full-height thread: inquiry card, date-grouped bubbles, booking proposal card (Accept/Decline), local-state send
- ✅ `BottomNav` — now shows on `/inbox` and `/calendar`; hides on individual thread pages
- ✅ `ContactModal` sent state — "View conversation in Inbox →" link added
- 🔧 Send is local-state only (no persistence across sessions — intentional until Supabase auth is in place)
- 🔧 ContactModal → inbox link goes to `/inbox` list for now (no direct conversation seeding from profile page yet)

See **Chat Design** section below for architecture notes.

### ⬜ Profile Page (`/profile`)

- Own profile view (logged-in owner or sitter seeing their own listing)
- Edit mode for bio, services, photos
- Currently a placeholder

### ⬜ Calendar / Bookings (`/calendar`)

- BottomNav tab exists, no page yet
- Depends on: chat + booking agreement flow design
- Scope: show confirmed bookings, pending requests, availability

### ⬜ Supabase Write Path

- Connect signup → `provider_profiles`, `provider_service_offerings`
- Requires real auth (Supabase Auth)
- Currently blocked by: auth decision

### ⬜ Real Authentication

- Replace demo sign-in with Supabase Auth
- Session persistence across pages
- Role-gated navigation (owner vs. sitter views)

---

## Chat Design — Open Decisions

### The core question

The product's identity is **"message first, book when ready"** — chat is not a support channel, it's the primary trust-building and coordination mechanism. It needs to feel like a real messaging app, not a contact form.

### How real do we want to make it?

**Option A — Mock only (UI demo)**

- Pre-seeded conversations in mock data
- Append-to-local-state on send (no persistence across sessions)
- Good enough for demos and investor pitches
- Honest about prototype status

**Option B — Supabase-backed, auth-gated (real)**

- `conversations` + `messages` tables
- Supabase Realtime for live updates
- Requires auth to be working first
- Full build — probably a 1.1 feature

**Option C — Hybrid (recommended for now)**

- Full, realistic chat UI built now with mock conversations
- Send appends to local state (looks real in the session)
- Schema + hooks designed to swap in Supabase Realtime later without rebuilding the UI
- Doesn't block on auth

### Initiating a conversation — how much structure?

The current `ContactModal` is a blank textarea with a pre-filled opener. It works but misses an opportunity.

**Light structure approach (recommended):**
When an owner taps Contact, a 2-step sheet:

1. **Context step** — service type (pre-selected from where they navigated from) + rough dates ("flexible" / date range picker) + their dog's name (pre-filled from profile if exists)
2. **Message step** — editable pre-filled message using the context above

This creates a richer "inquiry card" at the top of the conversation (like Airbnb's booking request summary), which gives the sitter everything they need to respond. It also means the first message thread has structure without feeling like a form.

### The booking agreement moment

This is the most nuanced design question. Product principle: **no pressure, direct arrangement**. But owners and sitters both benefit from some confirmation mechanism.

**Proposal: lightweight in-chat booking card**

- Either party can tap "Propose dates" inside a conversation
- This inserts a structured card into the thread: service + dates + price + dog
- The other party can "Accept", "Counter", or "Decline" inline
- On Accept: conversation status → "Confirmed" + entry created in `/calendar`
- No payment processed, no platform fees — just a confirmed shared record

This keeps it feeling like a direct human agreement, not a platform-mediated transaction. The card is a coordination tool, not a contract.

### Linking chat to other surfaces

- **Profile page** → Contact button → opens ConversationStartSheet → lands in `/inbox/[id]`
- **Explore cards** → quick contact action → same flow
- **BottomNav Inbox tab** → `/inbox` (conversation list)
- **Calendar** → each booking entry links back to its conversation thread
- **Notifications** (future) → new message or booking proposal badge on Inbox tab

### Suggested build order

1. `/inbox` — conversation list page (mock data)
2. `/inbox/[conversationId]` — message thread page (mock data, local-state send)
3. Upgrade `ContactModal` → `ConversationStartSheet` (service + dates + message)
4. "Propose dates" card in thread (structured booking proposal)
5. Wire accept → `/calendar` entry

---

## Backlog (not yet prioritised)

- Interactive map (replace placeholder)
- Scroll-linked profile header collapse (real scroll event, not toggle)
- Saved / favourited providers
- Provider response rate display
- Push/in-app notifications
- Supabase write path + real auth
- Community Version features (parked until Provider MVP validated)

---

## Revision log

| Date       | Change                                                           |
| ---------- | ---------------------------------------------------------------- |
| 2026-03-07 | Created Board.md; captured full build state; drafted chat design |
| 2026-03-07 | Built full Inbox & Chat system (types, mock data, /inbox list, /inbox/[id] thread, BottomNav wiring, ContactModal update) |
