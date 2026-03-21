---
category: strategy
status: draft
last-reviewed: 2026-03-18
tags: [roadmap, validation, testing, planning]
review-trigger: "when planning next steps or discussing project direction"
---

# Doggo — Roadmap & Validation Plan (Proposal)

**Status:** Draft proposal. Not yet reviewed or agreed upon.

This document proposes running two parallel workstreams — **Develop** and **Test** — rather than building the full product before validating assumptions. It also raises the question of what the end goal of this build is.

## Related docs

- [[Product Vision]] — product strategy and principles
- [[Prototype Scope]] — what the prototype needs to demonstrate
- [[Open Questions & Assumptions Log]] — tracked unknowns
- [[ROADMAP]] — phase history (Phases 1–6)

---

## The Proposal

We've built a working prototype that demonstrates the full product story: signup → meets → connections → trust → care → booking. With AI-assisted development, we can continue to iterate quickly.

But building more features without validating the core thesis is risky. The proposal is to run two tracks in parallel:

1. **Develop** — Continue building and polishing the prototype
2. **Test & Validate** — Start testing assumptions now, before the product is "done"

The testing track starts broad (general research) and narrows as the prototype matures (specific feature validation).

---

## Track 1: Develop

### Now (Phase 6 completion)

- Finish visual consistency pass
- Component and token cleanup
- Final doc update
- Ensure all core flows are demoable end-to-end

### Near-term (Phase 7 candidates)

- Nice-to-have features that strengthen the demo:
  - Private groups (invite-only meets with persistent chat)
  - Photo gallery per meet
  - Payment mock (fake checkout at end of booking)
  - "Open to helping" toggle
- Polish based on feedback from testing track

### Later (depends on test results + end goal decision)

- Production infrastructure decisions
- Real backend (Supabase write paths, realtime messaging)
- Performance and scale considerations
- Decisions about native mobile vs. responsive web

---

## Track 2: Test & Validate

### Key Assumptions to Test

These are the assumptions the product depends on. Each needs validation before we invest heavily in building further.

| # | Assumption | Risk if wrong | How to test |
|---|-----------|---------------|-------------|
| 1 | Prague dog owners want an app for organising social dog meets | Product has no audience | Survey, interviews, landing page test |
| 2 | WhatsApp/Facebook groups are insufficient for this | No reason to switch | Interviews with group organisers, pain point mapping |
| 3 | Community participation builds enough trust for care arrangements | Care transition doesn't happen | Prototype walkthrough, trust model testing |
| 4 | The four-state connection model matches how people actually build trust | Model feels unnatural | User testing with prototype |
| 5 | Dog owners in Prague will pay for care through the platform | No revenue model | Willingness-to-pay interviews |
| 6 | Initial community activity can be seeded successfully | Empty platform, no retention | Neighbourhood pilot |
| 7 | The "provider dial" framing works (vs. separate provider identity) | Confusing UX, low provider supply | Concept testing, prototype feedback |

### Testing Phases

**Phase A — General Research (start now, no prototype needed)**

- Survey Prague dog owners: How do you socialise your dog today? What's frustrating? Would you use an app?
- Interview 10–15 dog owners across target neighbourhoods (Letna, Stromovka, Riegrovy sady)
- Map existing communities: WhatsApp groups, Facebook groups, regular park gatherings
- Identify what's missing from current solutions

**Phase B — Prototype Feedback (once core flows are polished)**

- Guided walkthrough with 5–8 target users
- Test specific flows: signup → find meet → connect with someone → explore care
- Validate the trust model: Does the Familiar → Connected progression feel natural?
- Gather feedback on the community-first framing vs. marketplace framing

**Phase C — Neighbourhood Pilot (requires budget + planning)**

- Seed activity in one neighbourhood (e.g., Letna)
- Recruit 5–10 "founding hosts" to create and run the first meets
- This likely requires compensation or strong incentives
- Measure: attendance, return visits, connections formed, care conversations
- Duration: 4–8 weeks minimum to see patterns

---

## The Cold Start Problem

This deserves special attention. A community product with no community is worse than an empty marketplace.

### Why it's the hardest problem

- Meets need attendees to feel worthwhile. One person at a meet is failure.
- Unlike a marketplace (where one transaction = value), a community needs *density* — enough people in the same area, at the same times, with compatible dogs.
- Early adopters have to tolerate an imperfect experience. That tolerance has limits.

### Possible seeding strategies

- **Pay early hosts**: Compensate 5–10 people to organise and run meets in a target neighbourhood for 4–8 weeks.
- **Partner with existing communities**: Find active WhatsApp/Facebook dog groups in Prague and offer the platform as a coordination tool.
- **Event-based launch**: Organise a few large, well-promoted dog events (not through the app) and use them to onboard the first wave.
- **Neighbourhood ambassadors**: Recruit visible, well-connected dog owners to champion the platform locally.
- **Content-first approach**: Build a social media presence around Prague dog culture before launching the product.

### Budget implications

Community seeding is not free. Any launch plan needs a budget for:

- Host compensation (if paying early organisers)
- Event costs (venue, materials, promotion)
- Marketing (social media, local advertising)
- Incentives (early-user rewards, referral bonuses)

This might be where the majority of initial investment should go — not on engineering.

---

## End Goal: Open Question

What is the goal of this build? This frames everything else.

### Option A: Hand off to developers

Use the prototype as a detailed spec. Hire a development team to build the production app. Our role shifts to product direction.

- **Pros:** Faster path to production quality. Professional engineering.
- **Cons:** Expensive. Requires the prototype to be extremely clear as a spec. Risk of losing nuance in translation.
- **Implication:** Prototype polish and documentation matter most.

### Option B: Seek investment

Use the prototype + early validation data to pitch investors. Use funding to hire a team, fund marketing, and launch properly.

- **Pros:** Bigger ambition. Proper resources for both engineering and marketing.
- **Cons:** Needs strong validation data first. Fundraising takes time and effort.
- **Implication:** Testing track becomes critical. Validation data is the pitch.

### Option C: Keep building ourselves

Continue with AI-assisted development. Move methodically from prototype toward a real product.

- **Pros:** Low cost. Full control over direction. No external dependencies.
- **Cons:** Slower. Limited by our bandwidth. Some things (real-time infrastructure, mobile apps) may be beyond what we can do alone.
- **Implication:** Scope discipline matters. Build only what we can maintain.

These aren't mutually exclusive — we might start with C, validate with testing, and pivot to A or B based on results.

---

## Suggested Next Steps

1. **Finish Phase 6** — Complete the prototype polish so it's demo-ready.
2. **Start Phase A testing** — Survey and interviews. Low cost, high information value.
3. **Discuss end goal** — This decision affects what we prioritise next.
4. **Budget the cold start** — Even a rough estimate helps frame the conversation.
5. **Plan Phase B testing** — Schedule prototype walkthroughs with target users.

---

## Revision Rule

This is a living proposal. Updates should be dated and tracked. Decisions made should be moved to the relevant strategy docs.
