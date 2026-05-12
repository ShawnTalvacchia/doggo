---
category: meetings
status: active
last-reviewed: 2026-05-11
tags: [po, briefing]
---

# Doggo Prototype — Briefing Note

**For:** PO catch-up, May 2026
**Purpose:** Quick read on where the prototype is, what's been thought through, and the open strategic call worth sitting with.

---

## Where the prototype is

The full product loop is built — community → trust → care → sessions. Every page renders with real content. The world feels lived-in.

Major surfaces:

- **Community** — feed, four group types (park / neighborhood / interest / care), meets with RSVP, post-meet review flow that drives trust marking
- **Trust** — relationship states between people (None / Familiar / Connected), trust badges (community-earned + credential + platform), connection signals across the app
- **Discovery** — `/discover/care` with filter-driven results, community-first ordering (people you know rendered above the broader marketplace, with different chrome)
- **Booking** — full inquiry → auto-priced proposal → contract → sessions → visit reports
- **Profiles** — unified shape for every user. Carer offerings are a "dial" on the same profile, not a separate account type. Audience setting (circle vs. anyone) is what changes when the dial moves up.

What it's *not*: no real auth (persona switching stands in for sign-in), no real payment, mock data. The point is to feel real to a tester, not be production-ready.

---

## The booking flow

This is the most likely place where the prototype reads a little differently from how you specced it. The end result is the same — owner gets a confirmed booking, provider gets a signed agreement — but the path is structured around **in-chat cards** that guide both sides through the steps:

1. **Owner sends an Inquiry** — structured card lands in the provider's thread (dates, service, pets, live price estimate)
2. **Provider builds a Proposal** — auto-priced quote based on their config + the inquiry. Stackable modifiers (holiday, weekend, multi-pet, last-minute) appear as line items. Provider reviews and confirms, or overrides with a reason. They can also counter with different terms.
3. **Owner Reviews & Signs** — proposal card shows the full quote; signing confirms the booking
4. **Sessions execute** — provider checks in, takes photos mid-session, seals a visit report when done

The **proposal step** is the meaningful addition vs. a straight "Confirm/Decline → Pay → Done" flow. It gives the provider room to set their quote, customize terms, suggest alternatives without leaving the chat. Counter-proposals work within the same conversation — same booking record, new proposal supersedes the old one.

A few items from your spec we haven't built:

- **In-chat Book button** (your path 1, where the owner messages first then books in-chat). Inquiry entry today is from the service card on a provider's profile. Easy to add.
- **Payment step** (PENDING PAYMENT → BOOKING CONFIRMED). We treat the signed contract as the confirmation. Real payment integration is a backend phase.
- **Alternative provider suggestions** on decline/cancellation. Doable, design call on which carers to surface.
- **Cancellation cutoff** (you noted 2 days, open to discussion). Cancellation works and requires a reason; there's no time-window gate yet.

None of these block testing. All are fast follow-ups.

---

## The strategic direction worth sitting with

A few threads have converged into a clearer cold-start story than we had a month ago.

**The chicken-and-egg.** Community-first platforms need other users on them to have value. New visitors see an empty room and leave. The community thesis is right (trust → care is more defensible than a price marketplace), but it needs paid bootstrapping to survive the first six months.

**The playbook that's emerging.** Three converging threads:

1. **Partner with 2-5 trainers in Prague to lead public walks** on the platform. The trainer always has a dog to walk — booked client, regular owner, or (if neither) a shelter dog. Walks generate photos, in-person interactions, leads. Their incentive aligns without platform-side cash.
2. **Shelter dogs as always-on inventory** (and as an emotional discovery layer in their own right). Dog profiles with stats — *"4 days in kennel, last walked 3 days ago"* — turn occasional walkers into adopters. Big secondary effect: people who'd otherwise never sign up come for the dogs.
3. **Doggo as the credentialing layer.** Prague's training market is fragmented and uncredentialed — 80-90% solo trainers, no chains, no legal cert requirement (unlike Germany or Austria). Owners can't easily verify trainer quality today. A trust layer (LIMA-network affiliations, KYNOLOG.cz cert, Helppes alumni, methodology-school memberships, community-earned signals) could be the deepest moat.

**The question this opens up.** Doing this seriously means leaning hard one direction on a strategic fork:

| | Community-with-marketplace | Marketplace-with-community |
|---|---|---|
| Core | Community engagement | Paid transactions |
| Differentiator | Care + trust come from network | Community is the moat that makes marketplace work |
| Comparable to | Strava, Nextdoor, ClassDojo | Rover, Wag, TaskRabbit |
| Compounding | Slower, network effects | Faster, marketplace efficiency |
| Vulnerability | Slow to monetize | Competitors poach trainers with better economics |

The trainer-led playbook above leans community-with-marketplace — Strava-for-dog-people that happens to monetize through care, rather than a Czech Rover with a community layer. Both are legitimate companies. They're shaped differently and pitch differently.

**This doesn't have to be settled today** — but knowing the answer would clarify a lot downstream. Which features feel essential. How to talk about the product. What to optimize user testing to learn. How to pitch to potential investors.

Worth chewing on. Curious for your instinct.

---

## Testing readiness

The prototype is ready for moderated user testing now. The four scenarios you outlined (book walking, book boarding, group creation, event creation) are all well-supported. A few additions worth considering:

- **First-time-user discoverability** — drop a tester on the landing page cold, no instructions, see what they do
- **Community-first vs. marketplace test** — show them both orderings, ask which they'd actually use. This directly tests the strategic fork above.
- **Trust signals test** — two cards side by side, one with rich badges, one bare. Which would they book?

**Format suggestion:** 5-7 testers, 45-60 min moderated walkthroughs. Mix of Prague locals and expats.

A few phase boards still have open work — Profiles Deep Pass paused, Onboarding & In-Product Communication next up after Cross-Cutting Flow Testing. **None of these block testing.** The project keeps building in parallel. Long-term, here are things that are queued:

- Profile self-serve audience-setting toggle (today the setting works as data; the UI control is the missing piece)
- In-product teaching surfaces (privacy mechanics, Familiar-mark asymmetry, Carer pricing setup walkthrough)
- Logged-out flow polish (currently guest preview goes through persona switching)

Tester confusion on these is actually the *input* for the upcoming teaching phase. No reason to wait.

---

## What's next

Depending on what you take away from this:

- **If the playbook direction feels right** — start mapping conversations you could have in Prague with trainers and shelters
- **If you want to ship more first** — fastest next phase fills the booking-spec gaps above (in-chat Book button, alternative-provider suggestions, cancellation cutoff)
- **Either way** — demo presentation walkthrough + Tereza guided tour need light updates before testing kicks off (~half day's work)

Curious for your reactions on the strategic question and on the playbook. Whatever direction we pick, the build keeps moving.
