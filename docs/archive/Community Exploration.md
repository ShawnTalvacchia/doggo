---
category: strategy
status: active
last-reviewed: 2026-03-17
tags: [community, strategy, meets, monetization]
review-trigger: "when touching nav, meets, or monetization"
---

# Doggo — Community-First Product Strategy

*March 16, 2026 — Strategic exploration, pre-build*

---

## Why Community First

The Provider Version assumes supply (providers) drives demand (owners looking for care). But in Prague's dog culture — routine-driven, park-based, neighbourhood-dense — organic growth is more likely to come from **owners connecting with each other** than from owners searching for paid services.

The bet: if Doggo becomes the place where dog owners in Prague socialize their pets, meet up for walks, and build neighbourhood familiarity, everything else follows. Paid services, business profiles, and booking become natural extensions of an already-engaged user base — not cold marketplace features competing with word-of-mouth.

This resolves the tension between the Provider and Community versions described in Product Principles. They are not two separate products — **the community is the acquisition and trust layer for the provider marketplace**. You don't validate one and then build the other. You build the community and the marketplace emerges from it.

### Dog-first positioning

The platform is promoted and centred around **dog ownership**. Every feature leads with the dog — their socialization, their health, their care. Human social connections are a natural byproduct, not the pitch. This is intentional: people who want to meet neighbours are wary of "social apps," but they'll happily join a dog app. The social reward lands harder because it wasn't sold to them.

This framing also makes the provider transition feel natural. You're not "becoming a gig worker" — you're helping with dogs, which you already love doing. The user ramps and archetypes in [[User Archetypes]] are built around this principle.

---

## The Monetization Flywheel

The core revenue model is not ads or business subscriptions. It's **platform-mediated care between people who already trust each other**.

### The natural progression

1. Owners join meets, build familiarity over weeks
2. Some of those people are helper-curious (archetype 3) or aspiring providers (archetype 4)
3. An owner needs someone to watch their dog for a weekend
4. They already know and trust people from their regular Tuesday walks
5. One of them offers sitting. They agree on the platform — dates, price, expectations, all clean
6. The platform takes a small fee on that transaction

This is exactly what the Trust Model describes — Level 0 (presence) through Level 3 (helper) and Level 4 (provider). Community features make that ladder actually work.

### Why on-platform beats side conversations

People could Venmo each other and skip the platform. But the platform offers:

- **Clear record** — dates, price, pet details, confirmed in writing. No disputes.
- **Cancellation and change handling** — structured modification beats an awkward text
- **Care history** — "Petra has watched 4 dogs from this group with no issues." Not star ratings — a track record.
- **Insurance/liability** (eventually) — "your dog is covered while in care through Doggo." This is Rover's actual moat.
- **Payment without the awkward** — paying a friend for dog-sitting is socially weird. Paying through the app normalises it.

### Walker-specific pricing

Walkers could offer tiered services:
- **Neighbourhood walk** — loop near the owner's home
- **Park walk** — pick up the dog and bring them to a public group meet (socialisation value, priced higher)
- **Mixed schedules** — some days neighbourhood, some days park

This distinction matters because the services are genuinely different (time, travel, group management) and owners would value the park walk more.

### Revenue priority stack

1. **Transaction fee on care arrangements** (10-15%) — the core. Only works because community built the trust first.
2. **Business profiles** (freemium directory) — supplemental. Enhanced listings, not ads.
3. **Premium owner features** (later, careful) — advanced group tools, unlimited gallery storage, priority matching. Don't gate community features behind payment.

---

## Meets: The Core Activity

"Meets" is the umbrella term for all organised dog social activities. The word is natural to dog culture ("dog meet," "meet and greet"), short enough for a tab label, and scales across activity types.

### Meet types

- **Walk** — structured route, set pace, specific start time
- **Park hangout** — casual, drop-in time window, a location to gather
- **Playdate** — small group, specific dogs invited, more intimate
- **Training session** — skill-focused, someone leads (recall, leash manners)
- **Outing** — dog-friendly cafe, hike, beach day, seasonal

Each type gets a simple icon and label in the create flow. The form adapts slightly per type — a walk asks for route/pace, a park hangout asks for a time window, training asks for a focus topic.

### Public meets

- Visible to anyone in the neighbourhood (within safety defaults)
- Creator sets: location, date/time, recurring or not, dog size, max group, on/off leash, any notes
- Anyone matching criteria can join — no approval needed
- Lightweight group thread for coordination ("running late," "heavy rain, skipping today")
- After the meet: optional photo sharing, check-in builds familiarity signals
- The meet has a persistent page — it's a *thing*, not a message thread

### Private meets (groups)

- Invite-only — creator adds people from their familiar list or via share link
- Shared gallery that accumulates over time (emotionally sticky — people love looking back at dog photos)
- Recurring schedule with attendance patterns ("Petra usually comes Tuesdays")
- Group chat that's contextual — coordinating around the next meet, not just chatting
- New members added by any group member, or only by creator (configurable)

### Why this beats WhatsApp

- New people discover your meet through the app — WhatsApp groups only grow through someone sharing a link
- People leave gracefully (just stop joining) instead of awkward group-leave notifications
- Dog profiles and compatibility are built in — no explaining your dog's quirks
- Gallery and history persist as shared record
- Seasonal discovery: "What meets are happening near me this Saturday?" is a question WhatsApp can never answer

---

## Profile Visibility & Connection Model

Users control how visible they are and who can contact them. The model has four states — two global settings (Locked, Open) and two per-person relationship levels (Familiar, Connected).

### The four states

| State | Scope | What's shown | Contact |
|---|---|---|---|
| **Locked** | Global default | Profile pic, first name, dog profile, neighbourhood | None — no message, no connect request |
| **Open** | Global opt-in | Everything in Locked + additional owner detail, dog personality/preferences | Can receive message requests from anyone |
| **Familiar** | Per-person, one-sided | Grants the same visibility as Open to a specific person | That person can send a message request |
| **Connected** | Per-person, mutual | Richer content, direct message window, care services CTA if the other person offers services | Full messaging, care arrangements |

**Locked** is the default. A locked profile is visible the way a private Instagram account is — you see the profile pic, name, dog, and neighbourhood. Enough to recognise someone from a meet. Not enough to dig deeper or make contact.

**Open** is a global toggle. Turning it on makes your expanded profile visible to everyone and allows anyone to send you a message request. Some users will go Open immediately; others never will. Neither is penalised.

**Familiar** is one-sided and selective. A locked user can mark specific people as Familiar — granting them Open-level visibility and the ability to send a message request — without ever going globally Open. This is the primary mechanism for cautious users to build their social graph after meeting people IRL.

**Connected** is mutual. Both people accept. It unlocks richer profile content, a direct message window, and — if either person offers care services — a minimal CTA on their profile visible only to the other. If a care arrangement is made, that CTA becomes a status card (upcoming booking, active care, etc.). Connected is where the community-to-care transition happens.

### Profile picture

The user chooses their own profile picture — the platform does not enforce showing your face. Many users will use a photo of themselves with their dog; some will use just their dog. Both are fine. The dog profile has its own photos regardless.

### Two user journeys through the model

**Cautious user**: Locked → attends public meets → marks a few meet attendees as Familiar → exchanges messages → mutually Connects with regulars → may never go Open.

**Social user**: Open from day one → receives message requests → Connects with people they click with → builds a large Connected list quickly.

Both paths lead to the same place: a network of Connected users who trust each other enough for group meets, private groups, and eventually care arrangements.

### How this supports the two ramps

The visibility model maps directly to the two user ramps described in [[User Archetypes]].

**Ramp 1 — Curious → Active (Engagement).** The visibility model lets users control their exposure at every stage of engagement. A **Curious** user stays Locked — they can browse meets and profiles without exposing themselves. A **Participant** attends a meet and uses Familiar to selectively open up to people they met IRL, without going globally visible. A **Regular** has a stable Connected list built through repeated attendance. A **Connector** is likely Open and actively building the local social graph. At no stage is anyone forced into visibility they didn't choose. The meet is the top of the ramp — IRL contact in a group setting is the lowest-risk way to start, and post-meet prompts ("You attended Letna Tuesday Walk with 4 others — connect with anyone?") are the highest-intent moment to nudge users forward.

**Ramp 2 — The Provider Dial.** Care services only surface within Connected relationships. "Petra offers walking — book through Doggo" appears on her profile only for people she's Connected with. This means the care marketplace is never cold — every care CTA sits inside an existing trust relationship. The path is: meet regularly → Connect → see that someone offers help → arrange care. Critically, the provider never has to "sign up" as a provider — they turn the dial: toggle "open to helping" and their Connected network sees it. They can list a service with a price or not. They can set constraints so narrow they rarely get requests. The dial can be turned back down at any time. This blurs the line between "community member who helps" and "service provider" — intentionally. See the Casual Helper, Aspiring Provider, and Professional Provider archetypes for how users experience different positions on this dial.

---

## Owner Matching & Discovery

Matching builds the social graph. The primary path is **post-meet** — connecting with people you've already met IRL. A secondary path exists for Open users who want to discover others proactively.

### Post-meet connections (primary)

- After a meet, attendees see who else attended (dog profiles + owner at their visibility level)
- "Want to connect?" prompts for each attendee — the highest-intent moment
- For Locked users, this is the main way to build Familiar/Connected relationships
- Dog-centred framing: "Luna and Max seemed to get along" not "Shawn wants to meet you"

### Browse & discover (secondary, Open users only)

- Browse nearby owners/dogs — see compatibility signals (breed, energy, play style, neighbourhood)
- Send a message request — the other person accepts or ignores
- Works best for social/Open users; invisible to Locked users (by design)

### The relationship flow

```
Join a public meet  ->  Attend IRL  ->  See attendees in app
                                              |
                                    Mark as Familiar (one-sided)
                                         or
                                    Send connect request
                                              |
                                    Connected (mutual) — message, groups, care
                                              |
                              ┌───────────────┴───────────────┐
                    Join each other's meets          Create private group
                              |                      Recurring + chat + gallery
                              |                               |
                    "I need help this weekend"    "Can anyone watch Max?"
                              |                               |
                    See care CTA on profile      Arrange through Doggo
                              |                               |
                              └───────────── Care transaction ┘
```

---

## Safety & Privacy

The core tension: the app's value comes from proximity and routine visibility — the same data that enables creepy behaviour. The goal is not to solve stalking — it's to not make it worse than Nextdoor, Meetup, or a local Facebook group.

### Location granularity — the biggest lever

- **Neighbourhood-level only** by default. "Meets near Letna" not "meets on Korunovacni street at 7:15am."
- No GPS tracks, no real-time location, no route history visible to others.
- Meet locations use **named public parks and landmarks**, not custom pin-drops.

### Profile visibility

See **Profile Visibility & Connection Model** above. The four-state model (Locked → Open → Familiar → Connected) is the primary privacy mechanism. Key principles:

- Locked by default — users opt in to visibility, not out of it.
- Walking schedule / "I'm at the park now" features: visible only to Connected users, not strangers.
- Familiar is one-sided (you grant it). Connected is mutual (both accept). No one-sided access to detailed information.

### Interaction gates

- Locked users cannot be contacted at all — no messages, no connect requests.
- Open users can receive message requests (not direct messages — the recipient must accept).
- Direct messaging requires Connected status (mutual).
- Strangers can join public meets but cannot contact other attendees unless visibility permits.

### Blocking and reporting — table stakes

- **Block = immediate and total.** Blocked user can't see your profile, your meets, or that you exist.
- Report with categories (harassment, inappropriate behaviour, safety concern).
- Reports from in-person meets taken more seriously — the real-world element raises the stakes.

### Pattern detection — low effort, high value

- Flag accounts that view the same person's profile repeatedly without interacting.
- Flag accounts that join meets but never check in or get confirmed by others (lurker pattern).
- Surface for review, not automated action.

### What NOT to build

- No real-time "who's at this park right now" for anyone except Connected users
- No walking route or history tracking visible to others
- No "people who walk near you" based on precise location overlap — use neighbourhood, not GPS intersection
- No public activity feed showing when someone was last active

### Why this is safer than alternatives

Dog-centred profiles (the dog is public-facing, not the person), Locked by default, mutual Connected status required for messaging and care, no unsolicited contact, public park meets only, neighbourhood-level location. The visibility model ensures users open up at their own pace — the platform never exposes more than the user has chosen.

---

## Navigation Restructure

The current four-tab mobile nav (Explore | Bookings | Inbox | Profile) is built for a marketplace. Community-first requires different daily rhythms.

### New tab structure

```
Home  |  Meets  |  Schedule  |  Inbox  |  Profile
```

Five tabs. Each earns its spot:

- **Home** — personalised feed. What's happening nearby, suggested meets, match suggestions, community highlights. Also surfaces care CTAs and active bookings. This replaces Explore as the default landing.
- **Meets** — browse, create, manage. Filter by type (walks, hangouts, playdates, training). "What can I do?" tab.
- **Schedule** — your timeline. Upcoming meets you've joined, care bookings (as sitter or owner), past activity. CTAs: "Find Care," "Offer Care," "Create Meet." "What am I committed to?" tab.
- **Inbox** — all conversations. Meet group threads, 1:1 matches, care coordination.
- **Profile** — you and your dogs. Settings, care history, familiar list, "open to helping" toggle.

### Why these five

- **Home vs. Meets**: Home is personalised ("for you"), Meets is browsable ("what's available"). Different intents, different UI.
- **Schedule vs. Bookings**: "Bookings" is marketplace language. "Schedule" covers both community meets and paid care in one chronological stream — because that's how your actual week works.
- **Inbox stays**: Community generates more conversation than a marketplace. Group threads, match chats, care coordination all live here.
- **Profile stays**: Expanded to include care history, familiar list, and helper/provider settings.

### Desktop nav adaptation

Current desktop AppNav (logged-in mode): DOGGO logo | Search + Offer Care (centre) | Bell + Messages + Bookings + Avatar (right).

Updated desktop nav:

```
DOGGO logo  |  Home  Meets  Schedule  |  [Find Care]  [Offer Care]  |  Bell  Inbox  Avatar
```

- Primary nav links replace the mobile bottom tabs on desktop — horizontal in the centre
- "Find Care" and "Offer Care" remain as CTAs but are now clearly secondary to community navigation
- Bell (notifications), Inbox (shortcut to messages), and Avatar (profile) stay on the right
- Bookings icon removed from top nav — Schedule page handles this

### How the current Explore flow folds in

The current Explore flow: user hits Explore tab -> sees three service cards (Walk & Check-ins, In-home Sitting, Boarding) -> selects one -> bottom nav hides -> full-screen results with filter subnav -> provider profile.

In the new structure:

1. **Entry point moves to Home.** A "Find Care" card or CTA on the Home feed replaces the Explore tab as the way into provider search. On desktop, "Find Care" button in the nav does the same.
2. **Service selection stays.** Tapping "Find Care" shows the three service options (walk/check-in, in-home sitting, boarding). On mobile, this is a transitional screen with a back button to return to Home.
3. **Full-screen results stay.** Once a service is selected, the bottom nav hides and the full-screen provider results + filter subnav appear — same as current behaviour. The back button escapes to the service chooser, then back to Home.
4. **Provider profile stays.** Same flow, same full-screen behaviour.

The key change: provider search is no longer the primary surface. It's an intentional action ("I need care") accessed from within the community context, not a default tab.

```
Mobile flow:

  Home tab -> [Find Care card] -> Service chooser (3 options, back button)
                                       |
                                  Select service
                                       |
                                  Full-screen results (nav hidden, subnav with back + filters)
                                       |
                                  Provider profile (full-screen)
```

```
Desktop flow:

  [Find Care] button in nav -> Service chooser panel/modal
                                    |
                               Select service
                                    |
                               Results page (standard layout, nav persists)
                                    |
                               Provider profile
```

---

## Business Profiles

Local dog-related businesses — trainers, groomers, salons, vets, pet shops, dog-friendly cafes — get profiles on the platform.

### How business profiles differ from provider profiles

| | Provider Profile | Business Profile |
|---|---|---|
| **Who** | Individual person | Registered business |
| **Trust model** | Earned through community participation | Verified through business registration / presence |
| **Services** | Walking, sitting, boarding | Training, grooming, veterinary, retail, hospitality |
| **Relationship** | 1:1 with owner | 1:many, often with a physical location |
| **Booking** | Coordination via chat | Link out to booking system, or in-app if integrated |
| **Revenue model** | Platform fee on transactions | Profile listing fees, promoted placement, lead generation |

### How it could work

- **Claimed profiles**: Businesses claim and manage their own profile (hours, services, photos, offers)
- **Community-sourced info**: Owners can suggest a business, leave recommendations. Business appears with community data until claimed.
- **Neighbourhood integration**: "3 groomers within 1km of your usual walking area"
- **Recommendations over ratings**: "12 owners in your neighbourhood recommend this vet" rather than "4.3 stars"
- **Special offers / events**: Businesses can post to the local feed — "Free puppy socialization class Saturday"

### Business monetization paths

1. **Freemium listing**: Basic profile free. Enhanced profile (photos, hours, offers, analytics) is paid.
2. **Promoted placement**: Pay to appear higher in neighbourhood results or in relevant meet contexts.
3. **Lead generation**: Charge per inquiry or per booking referral.
4. **Event sponsorship**: Businesses sponsor community meets. "This Saturday walk brought to you by PetCenter Holesovice." Light touch.
5. **Subscription tiers**: Free -> Pro (analytics, offers) -> Premium (promoted, featured)

---

## Additional Feature Ideas

### Dog-friendly places map

Community-sourced map of dog-friendly cafes, restaurants, parks, off-leash areas, water access points. High engagement potential — utility people return to weekly.

### Lost & found

Neighbourhood-scoped alerts when a dog goes missing. High emotional value, infrequent use, enormous goodwill and word-of-mouth. Could be the feature that gets people to download the app.

### Dog health / milestone tracking

Vaccination reminders, vet visit history, weight tracking. Also feeds into the platform: share health records with a sitter, prove vaccinations for a group meet. Risk: scope creep into a pet health app.

### Neighbourhood Q&A / advice

"Best off-leash park near Vinohrady?" "Vet recommendations for senior dogs?" Community knowledge driven by local owners. Could be a feed feature on Home, not a separate product.

### Seasonal / event-based features

- Prague-specific: dog-friendly Christmas markets, summer swimming spots, winter walking routes
- Community events: adoption days, training workshops, charity walks
- Keeps the app feeling alive and locally relevant

---

## Risks & Challenges

### 1. Cold start / empty rooms

Community features need participants. A meet with 0 joiners feels dead — worse than no feature at all.

**Mitigation**: Seed specific neighbourhoods, not city-wide. Pick 2-3 dog-dense areas (Letna, Stromovka, Riegrovy sady). Partner with existing Facebook/WhatsApp dog groups to seed initial activity.

### 2. Safety and liability

Platform-facilitated in-person meetups raise liability questions. Dog fights, injuries, harassment.

**Mitigation**: See Safety & Privacy section above. Clear terms (platform facilitates, does not supervise). Incident reporting. Block/report from launch. Public parks only. Insurance research needed.

### 3. Privacy and location sensitivity

Walking routines and locations create pattern-of-life data. Sensitive in a European/GDPR context.

**Mitigation**: Coarse location by default. No real-time tracking. Users choose what to share. Mutual familiarity gates on detailed visibility.

### 4. Moderation at scale

Community features generate user content — messages, recommendations, events. Moderation needs exist from day one.

**Mitigation**: Start small and neighbourhood-scoped (natural social accountability). Report/block tools from launch. Don't build a global feed.

### 5. Business profile quality

Unclaimed, stale profiles hurt credibility.

**Mitigation**: Start curated with verified businesses. Let community endorsements surface quality. Don't open self-serve until there's enough community activity to validate.

### 6. Monetization timing

Too early poisons goodwill. Too late, can't sustain.

**Mitigation**: Community features are free. Business profiles are the first monetization surface. Care transaction fees come once the trust flywheel is turning. Individual owner features remain free.

### 7. Feature sprawl

The community direction opens many possibilities. Too many half-baked features is worse than 2 excellent ones.

**Mitigation**: Apply the Revision Rule aggressively. Pick the smallest feature set that proves "owners will use Doggo to socialize their dogs" and validate before expanding.

---

## How This Informs Messaging & Booking

### Messaging

- **Group messaging** becomes core (meet coordination, not just 1:1 service inquiries)
- Messages are about coordinating meetups, chatting after meeting in person, and arranging care — not filling out a contact form
- Community messages should feel like group chat, not a service inbox
- "Message first, book when ready" extends beyond transactions

### Booking

- "Join" or "RSVP" for meets. Reserve "Booking" for paid care.
- Business bookings may link out to the business's own system
- The in-chat booking card could adapt: "Meet proposal" card (date, park, dogs) alongside "Care proposal" card (service, dates, price)

---

## Account Creation Implications

### What stays

- Owners enter first (principle 2)
- Pet profile step (even more important — dog compatibility drives meet matching)
- Location/neighbourhood

### What changes

**Role selection removed.** Current flow asks "Pet Owner / Walker / Host" upfront. In the community model, everyone starts as an owner — there is no provider role at signup. The provider dial (see [[User Archetypes]]) is turned later, from within the profile, after the user has community context. Asking "are you a provider?" at signup frames the platform as a gig marketplace and creates a categorical identity shift that we're trying to avoid.

Instead, focus onboarding on **what you're looking for**:
- "I want to socialise my dog and meet other owners" (default — Ramp 1 entry)
- "I want to find care for my dog" (still valid, but not the lead)

The "open to helping" signal lives in profile settings after signup, not in the onboarding flow. Users discover it naturally once they have connections and understand the community.

**Profile visibility default.** New accounts start Locked. During onboarding, offer the choice: "Keep your profile private (you choose who sees more)" vs. "Make your profile open (anyone can reach out)." No pressure either way — frame Locked as the normal, safe default. See Profile Visibility & Connection Model.

**Pet profile expanded.** Beyond photo/breed/size/temperament/health:
- Energy level (high/medium/low)
- Off-leash comfort
- Socialisation comfort (loves other dogs / selective / nervous)
- Play style (rough play, chase, parallel walker)

These feed meet matching and compatibility — and they're the kind of thing owners enjoy filling out.

**Neighbourhood selection more intentional.** Pick primary parks, usual walking times, neighbourhood. Seeds the discovery feed from day one: "Here are 3 meets happening this week near Letna" on your first session.

---

## Open Considerations (Resolve Before Building)

These need answers before we start building community features:

### Navigation & Structure

- [ ] **Five tabs on mobile** — does this feel crowded? Test with the current tab bar component to see if labels truncate or icons get too small. Consider if any two tabs could merge.
- [ ] **Home feed content** — what populates Home for a brand-new user with no meets, no familiars, no history? Empty states are critical to get right.
- [ ] **Desktop nav layout** — how do five primary nav items + CTAs + utility icons fit? Does the centre section get too wide? Need to mock this.
- [ ] **Find Care entry point** — is a card on the Home feed discoverable enough? Or does care search need a more prominent, persistent entry point?

### Meets

- [ ] **Create flow** — what's the minimum viable "create a meet" form? Location, date/time, type, dog rules. How many steps? One page or multi-step?
- [ ] **Meet detail page** — what does it show? Attendees (dogs), location, time, rules, chat thread, gallery. How much fits on one screen?
- [ ] **Recurring meets** — how does recurrence work? Weekly on the same day? Does each occurrence get its own attendee list? Can you join "all Tuesdays" or just "this Tuesday"?
- [ ] **Meet discovery** — is neighbourhood enough for filtering, or do users need map-based browsing? How far out should meets be shown?
- [ ] **Gallery implementation** — where do photos live? Per meet, per group, per dog? Storage/hosting implications.
- [ ] **Private groups** — how do invitations work? Link-based? In-app invite from familiar list? Can a group exist without a scheduled meet?

### Matching & Social

- [x] **Familiar vs. Connected** — resolved. Familiar is one-sided (grants Open-level visibility). Connected is mutual (full messaging + care CTA). See Profile Visibility & Connection Model.
- [x] **Primary match trigger** — resolved. Post-meet attendee list is the primary connection point. Browse/discover is secondary, available to Open users only.
- [ ] **Post-meet prompt UX** — what does the "connect with attendees" screen look like? Cards? List? How soon after a meet does it appear?
- [ ] **Browse & discover UX** — for Open users, how does the browse experience work? List-style with compatibility signals? Map-based? Feed-style?
- [ ] **Familiar management** — where do you manage your Familiar list? Can you revoke Familiar status? Is there a notification when someone marks you as Familiar?

### Care Transition

- [x] **When does care surface?** — resolved. Care services CTA appears on profile only for Connected users. In group chat, an "arrange through Doggo" prompt can surface when someone offers help informally.
- [ ] **"Open to helping" toggle** — where does this live? Profile settings? What options does it include (walking, sitting, boarding)?
- [ ] **Pricing for community-sourced care** — do helpers set their own prices? Is there a suggested range? How visible is pricing before a formal arrangement?
- [ ] **Care arrangement flow** — what does the in-app care card look like? Dates, service type, price, accept/decline? How does it differ from a meet RSVP?
- [ ] **Walker service tiers** — how does a walker list different services (neighbourhood walk vs. park meet walk)? Where does this live on their profile?

### Safety

- [ ] **Block implementation** — does blocking someone remove you from their view of a public meet you've both joined? What about a private group you're both in?
- [ ] **Report flow** — what categories? What happens after reporting? Who reviews?
- [ ] **Location precision** — exactly how coarse is "neighbourhood-level"? A named district (Praha 7)? A 500m radius? A named park?
- [ ] **Minor/vulnerable user considerations** — are there age restrictions? What about users who may be targets of harassment?

### Technical

- [ ] **Chat infrastructure** — do we build our own or use a service (Stream, SendBird, etc.)? Group chat adds complexity over 1:1.
- [ ] **Notification strategy** — what triggers push notifications? Meet reminders, new joins, chat messages, match suggestions? Too many kills the app; too few means no engagement.
- [ ] **Data model** — meets, groups, attendees, familiars, matches, galleries — this is a significant schema addition. Design it before building.
- [ ] **Existing page impact** — which current pages/components need modification vs. which are new builds? AppNav, BottomNav, and route structure all change.

---

## Suggested Build Order

1. **Navigation restructure** — update BottomNav and AppNav to the new 5-tab structure. Stub out Home, Meets, and Schedule pages. Keep existing Explore/results reachable from Home.
2. **Meet creation + browsing** — the simplest social feature. One owner creates a meet, others browse and join. Neighbourhood-scoped.
3. **Meet detail + lightweight chat** — the page for a single meet. Who's coming, dogs, rules, a thread for coordination.
4. **Schedule page** — your timeline of meets and bookings. CTAs for Find Care, Offer Care, Create Meet.
5. **Owner matching** — browse nearby owners/dogs, compatibility signals, mutual matching.
6. **Private groups** — invite-only meets with persistent chat and gallery.
7. **Care transition** — the path from "walk buddy" to "paid sitter" within the community context.
8. **Business directory** — seeded with curated Prague businesses. Community endorsements.

Each step testable independently. Each generates signal about whether the community thesis holds.

---

## Open Questions for the Assumptions Log

- Will Prague dog owners use an app for social meets, or is WhatsApp/Facebook good enough?
- What's the minimum neighbourhood density for community features to feel alive?
- Do business owners in Prague's pet industry see value in a community-embedded directory?
- How do we seed initial activity without it feeling artificial?
- What's the natural conversion rate from "meet attendee" to "paid care provider/consumer"?
- At what point does the trust flywheel generate enough care transactions to sustain the platform?

---

*This is a strategy and exploration document. Its purpose is to map the territory, identify open questions, and align on direction before building.*
