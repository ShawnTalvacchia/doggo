---
category: feature
status: active
last-reviewed: 2026-03-21
tags: [landing-page, marketing, copy, brand]
review-trigger: "when updating landing page copy, layout, or narrative structure"
---

# Landing Page

The public landing page at `/` communicates Doggo's value proposition to first-time visitors. It follows a deliberate narrative arc: **emotional hook → what you can do → how it works → who it's for → care as outcome → social proof → CTA**.

---

## Narrative Structure

The page tells a story in sequence. Each section builds on the previous one:

1. **Hero** — "Your dog's neighbourhood crew." Sets the frame: this is about your dog, your neighbourhood, your people.
2. **Emotional hook** — "Does your dog have a community?" Makes the visitor think about their dog's social life. Trust badges reinforce the three pillars (meets, trust, care).
3. **Meet types** — Shows what you'd actually do: group walks, park hangouts, playdates & training. Concrete, visual.
4. **How it works** — Interactive tabs (owner vs sitter perspective) showing the 4-step flow.
5. **Archetypes** — "Everyone uses Doggo differently." Three personas showing the spectrum from casual to committed.
6. **Care section** — "Care from people you already know." The payoff: trust you've built through community enables care arrangements.
7. **Testimonials** — Social proof from three different engagement levels.
8. **Bottom CTA** — "Your dog deserves a crew." Final push.

---

## Section Details

### Hero
- **Tagline:** "Your dog's neighbourhood crew."
- **Subline:** "Meet dog owners locally. Build real trust through walks, hangouts, and play. When you need care, you already know who to ask."
- **Eyebrow:** "Available in Prague" — grounds the product geographically
- **CTAs:** "Find a meet near you" (primary → /meets) + "See how it works" (secondary → #how-it-works)
- **Background:** Photo of dog owners walking together in a park (hero-park-community.jpg)
- **Layout:** Two-column grid. Text in left column, vertically centered. Right column is empty — photo shows through.

### Emotional Hook
- **Header:** "Does your dog have a community?"
- **Body:** "Dogs are social — they want to get out, play with dogs they know, and see familiar faces. Doggo connects you to local dog owners, regular meets, and trusted care."
- **Trust badges:** Three pill-shaped badges on teal background:
  - "Regular meets in parks near you" (PawPrint icon)
  - "Trust built through real encounters" (ShieldCheck icon)
  - "Care from people you already know" (MapPin icon)

**Copy decisions:**
- "Does your dog have a community?" was chosen over "Who's your dog's best friend?" (answerable with "me!") and "Dogs need friends too" (too generic).
- The word "community" is used in the heading; the body avoids repeating it, using "local dog owners" instead.
- Dog-first emotional hook — leads with what the dog wants, not what the platform offers.

### Meet Types
- Three cards with custom SVG illustrations
- **Group walks:** "See the same people every week. Familiar faces, familiar dogs. Matched by size and pace."
- **Park hangouts:** "Drop in, no pressure. Stay five minutes or an hour. Dogs play, owners chat."
- **Playdates & training:** "Smaller groups for dogs that need the right pace — puppy socialisation, recall practice, or calm play."

### How It Works
- Interactive tab switcher: Owner perspective / Sitter perspective
- Shows the 4-step progression from community to care
- Component: `HowItWorksTabs`

### Archetypes ("Everyone uses Doggo differently")
- **Layout:** Two-column split. Left: heading + body + "Get started" CTA. Right: three stacked cards.
- **Cards:** Each has a coloured left ribbon, icon in a tinted circle, label, and 1-2 line description.
  - **The Regular** (blue / `--status-info-main`): Casual participant, no connections needed
  - **The Connector** (amber / `--status-warning-main`): Small trusted group, swaps care
  - **The Organiser** (teal / `--brand-light`): Runs meets, natural choice for care
- **Purpose:** Shows the spectrum of engagement without prescribing a "correct" usage. Reinforces the dial-not-switch principle.

### Care Section
- **Header:** "Care from people you already know."
- Three benefit points with icons:
  - "Not profiles. Real people." — check connections first
  - "No cold outreach" — already met at the park
  - "Your neighbourhood, not a marketplace" — local, familiar
- Photo of person walking a dog

### Testimonials
- Three cards: Eva (newcomer who found trust fast), Jana (meet→care natural progression), Tomáš (helper who became a provider organically)
- Each maps roughly to an archetype: Regular, Connector, Organiser

### Bottom CTA
- **Header:** "Your dog deserves a crew."
- **Body:** "Meet locally. Build trust. Care comes naturally."
- **CTAs:** "Find a meet near you" (white) + "Get started" (outline-white)
- Teal background matching the emotional hook section

---

## Key Copy Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Hero tagline | "Your dog's neighbourhood crew" | Dog-first, local, warm. Avoids "platform" or "marketplace" language |
| Emotional hook | "Does your dog have a community?" | Question format engages. "Does" avoids the "me!" answer trap. Highlights a gap without being preachy |
| Hook body | Drops "community" to avoid repetition with heading | Uses "local dog owners" instead — same meaning, no echo |
| Archetype names | Regular, Connector, Organiser | Familiar archetypes from user research. Show the dial, not a binary |
| Bottom CTA | "Your dog deserves a crew" | Emotional, dog-first, callbacks to hero tagline |
| Care framing | "Care from people you already know" | Positions care as outcome of community, not a separate product |

---

## Related Docs

- [[Product Vision]] — product strategy and principles
- [[User Archetypes]] — source for the three landing page personas
- [[Trust & Connection Model]] — trust narrative the page communicates
- [[meets]] — meet types referenced in the cards section
