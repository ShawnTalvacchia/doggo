---
category: strategy
status: research
last-reviewed: 2026-06-02
tags: [vets, credentialing, vaccinations, cold-start, multi-sided, future]
review-trigger: "before any decision about un-retiring vets, vaccination gating, or vet-side surfaces"
---

# Vets as a Credentialing Layer

> **Status: research doc.** Drafted 2026-06-02 in response to Roman's user interview insights. Captures the strategic thinking behind treating vets as a multi-sided credentialing layer (parallel to shelters), the options worth considering, and the decisions PO needs to make before any of this graduates to a phase. **No code commitment.** For PO presentation.

**TL;DR.** Roman's vaccination insight — owners want structured vaccine records + gating on meets — reveals a larger thread. Vaccines without verification are theatre; verification requires vets in the system; vets bring their own multi-sided value loop (owners get peace of mind, vets get a client acquisition channel, platform gets a verified data layer, public good: more dogs vaccinated). This is the **credentialing-as-deliberate-moat** thesis applied to a new vertical, with the same shape as shelters. **The question isn't "should we build a vaccines field" — it's "should we build vets as an institutional entity type, of which a verified vaccine record is one output?"** This doc lays out the loop, the options, and the decisions worth making before committing.

---

## How this came up

Roman flagged three connected points in the user interview (2026-06-02):

1. Vaccinations should be a structured field on the dog profile, with the owner acknowledging accuracy.
2. Unvaccinated dogs should be excluded from group meets.
3. (Tangentially) Vets are something he was VERY interested in as a future direction.

The first two by themselves are a feature request. The third reframes them: if we build verified vet relationships, **vaccinations become verified, gating becomes real, and a new institutional partner enters the platform.** That's not a feature — it's a strategy move.

The same logic that made shelters worth pursuing (multi-sided value, credentialing-as-moat, real cold-start lever) applies to vets. The question is whether we want to commit to it.

---

## The multi-sided value loop

| Side | What they get | What they give |
|---|---|---|
| **Owners** | Verified vaccine record (peace of mind in group settings). Transparency about their dog's coverage. Reduced cognitive load — vet enters it, owner doesn't have to remember dates. Discovery of nearby vets. | Their vet relationship. Implicit endorsement of the platform when they share their record. |
| **Vets** | Owner acquisition (new patient pipeline through Discover). Billing for vaccination visits + checkup-driven recurring revenue. Reduced phone-tag for record requests ("can you fax me Bára's rabies record?"). Visible to a community-oriented owner audience that values transparency. | A profile presence + the work of confirming vaccination records. |
| **Platform** | A verified data layer that enables real meet-gating (not theatre). A third source of trust signals (institutional credential — vet-confirmed). A new entity type that compounds with shelters + carers into a richer credentialing fabric. New cold-start partner. | Vet-side surfaces (pages, billing tools, record entry). Identity verification of vet accounts. |
| **Public good** | More dogs vaccinated. Fewer outbreaks at parks. Healthier community herd-immunity. | — |

This is the same shape as the shelter thesis — institutional partner gives the platform something hard to fake, gets value the platform doesn't have to fund directly, contributes to a public good that aligns with the platform's stated mission.

---

## What vaccines look like with vs. without verification

**Without verification (owner self-declares):**
- Structured field on the dog profile (per-vaccine type + date)
- Owner acknowledges accuracy ("I confirm this is correct")
- Display surface — chips on the dog profile, maybe a status pill on RSVP rows
- **Can't gate meets meaningfully** — anyone willing to lie joins anyway
- Best use: informational, social pressure ("most dogs at this meet are Up To Date"), liability transfer ("we asked, you said yes")

**With verification (vet-confirmed):**
- Same structured field, but each entry carries `confirmedByVetId` + `confirmedAt`
- Status tiers: Self-declared → Vet-confirmed → Vet-confirmed-recent
- Real gating becomes possible — meet hosts can require "vet-confirmed Rabies in the last N years"
- Differentiated UX — a verified record renders with a vet badge; an unverified one renders with the acknowledgement framing
- The vet-confirmed status compounds with the trust badge system already shipped (community-earned > credential > platform tiers)

V1 of the vaccines field can ship **without** verification (Dog Profile phase scope). But the verification path needs to exist as a clear forward direction — otherwise V1 is feature theatre and we can't tell owners "this matters."

---

## Entity model options

If we commit to vets as an institutional entity, four options worth considering:

### A. `VetProfile` parallel to `ShelterProfile`

The shelter pattern, applied directly. Vets are a top-level institutional entity, NOT a Group type. Account model: institutional-by-default (shared login + clinic logo as avatar). Page chrome: Feed / Patients (limited) / Team / Services. Pet ↔ vet relationship via `VetProfile.patients[]` containment or a separate join table.

**Pros:** clean architectural fit, mirrors existing shelter work, room for richer surfaces (telehealth, reminders, etc.) without rebuilding later.
**Cons:** biggest scope. The shelter parallel implies a similar build cost (~one phase).

### B. `VetProfile` as a thin entity (record-only)

A minimal vet entity that exists only to issue confirmed vaccine records. No page chrome, no Feed, no Discover surface. Owners link their dog to their vet via a private form; vet logs into a stripped-down "confirm records" surface.

**Pros:** lowest build cost. Solves the verification problem without committing to vet pages.
**Cons:** abandons the multi-sided value loop. Vets get nothing visible. Reduces the credentialing-moat compounding effect.

### C. Vets as a credential issuer (no entity)

Vets aren't users at all. Owners upload a photo of the vaccination booklet; a moderation layer (platform-side, eventually crowd-sourced) confirms. Vaccines status becomes "Photo submitted" / "Photo verified."

**Pros:** no vet onboarding required. Works at any market scale.
**Cons:** moderation cost. No vet-side value loop. The photo-confirmed signal is weaker than vet-confirmed for sophisticated owners. Doesn't enable the cold-start partnership angle.

### D. Hybrid — start with C, graduate to A

Ship photo-confirmation in V1; build `VetProfile` later as vet partnerships solidify. Photo records would migrate to vet-confirmed as the vet account is set up.

**Pros:** lowest immediate commitment; preserves the option to build A later.
**Cons:** two paths to maintain. Migration is non-trivial.

**Recommendation if we proceed:** A or D. The shelter precedent argues for A (we have the pattern, we know the cost, the moat is real). D is the right call if PO wants the verification path *now* without the vet-partnership cost.

---

## Cold-start considerations

If vets become a real partner type, the same playbook structure that applies to shelters applies here. Mirroring the Cold-Start Playbook:

**Partner type characteristics:**
- Vets are highly local (owners pick by neighbourhood)
- Vets have strong professional networks (Czech Veterinary Chamber)
- Vets are competing for owners' attention with limited tools (websites, word-of-mouth)
- Vet-owner relationship is long-term and high-trust

**What we'd want to know before committing:**
1. **Is record-keeping a real pain point?** Today vets keep records on paper booklets + their own systems. Owner-requested record sharing is phone/fax/email. Is this annoying enough that a vet would set up a profile to make it easier?
2. **Is owner acquisition real for vets?** Vets near a busy park might say yes. Vets with full books might say no. Targeting matters.
3. **Are there policy concerns?** Vaccination records are not legally HIPAA-equivalent in CZ (no GDPR special-category for animals), but vets may still have professional norms about data sharing.
4. **What's the smallest validation play?** Same answer as shelters: 1-2 anchor partnerships (one large clinic, one small/expat-oriented one) before product commitment.

**The trigger to graduate this from research to phase:** PO has a real conversation with a Prague vet (mirroring how shelters graduated to a phase 2026-06-01).

---

## What V1 could look like, by scope tier

To make this concrete for a PO decision:

### Tier 1 — owner-only vaccines (Dog Profile phase scope)

- Structured `vaccinations: { type, lastGivenAt, acknowledgedAt }[]` field on `PetProfile`
- Owner edits in `PetEditCard`; explicit acknowledgement framing ("I confirm this is accurate")
- Display surface on dog profile (chips with date, status pill)
- Czech-specific defaults — Rabies flagged as legally mandatory
- No gating. No verification.
- **Cost:** ~one workstream inside Dog Profile.
- **Value:** owner-facing transparency, narrative coverage of the issue, structurally future-proof.

### Tier 2 — photo-confirmed (additional phase or side task)

- Owner uploads a photo of the booklet
- Moderation surface (platform team or eventual community/vet sign-off)
- Status: "Photo submitted" / "Photo verified"
- **Cost:** moderation infrastructure + new status layer. Multiple workstreams.
- **Value:** verification path exists; weaker signal than vet-confirmed but real.

### Tier 3 — vet-confirmed (`VetProfile` phase)

- Full `VetProfile` entity (Option A above)
- Vet pages, owner-vet linking, vet-side record confirmation
- Status: "Vet-confirmed by {clinic}, {date}"
- Real meet-gating becomes possible
- **Cost:** Shelter-Foundation-sized phase + ongoing partnerships work.
- **Value:** the full credentialing-moat thesis lands.

Tier 1 is committed (in Dog Profile phase scope). Tiers 2 and 3 require PO commitment.

---

## Risks worth flagging

- **Scope creep.** Vet pages opens an obvious slippery slope into vet-as-Care-category (booking visits, telehealth, prescription management). We retired vet as a Care category 2026-05-11 (OQ §6); reopening it would un-do a stabilization decision. **Suggested rule:** if we build VetProfile, it's a credentialing layer + record system, NOT a Care service category. The Vet-as-Carer question stays retired.
- **Privacy.** Even for animals, vaccination records carry implicit information about owner behaviour ("hasn't vaccinated in 2 years" = "vet doesn't trust them"). Owner-shared records are the norm, but vet-shared records via the platform have implications. Worth a quiet review with a Prague vet before committing.
- **Cold-start asymmetry.** Shelters cold-start on a clear public good (homeless dogs). Vets cold-start on a quieter motivation (record-keeping, patient acquisition). Less obviously aligned with mission framing. The story is real but harder to tell publicly than the shelter story.
- **Verification arms race.** As soon as vet-confirmed records become a real gate, there's incentive to fake the confirmation. The platform inherits a moderation problem (fake vet accounts, claimed-but-not-actual confirmations). Real, manageable, but not free.
- **Owner uptake.** Owners may not bother linking their vet. The Tier 1 self-declared field needs to be useful *on its own* — Tier 2 and 3 are upgrades, not the only valid state.

---

## Decisions for PO

If you're considering whether to graduate this from research to phase, these are the calls:

1. **Is the vet thread real?** Worth a Prague vet conversation (one large clinic + one expat-leaning one) before committing further.
2. **If we proceed, which Tier?** Tier 1 is already on deck (Dog Profile phase). Tier 2 (photo-confirmed) is a smaller-but-real commitment. Tier 3 (`VetProfile`) is a Shelter-Foundation-sized phase.
3. **Entity model — A, B, C, or D?** If we proceed past Tier 1, this is the central architectural call.
4. **Is the "Vet-as-Carer is retired" rule maintained?** Suggested yes — vets stay a credentialing layer, not a Care category. Confirm.
5. **Cold-start partnerships strategy.** Same playbook structure as shelters (anchor partners, framing principle, success metrics). Confirm willingness to invest in vet partnerships separately from the existing shelter + trainer threads.

---

## Refs

- `docs/meetings/po-briefing-2026-06-02.md` — original PO interview synthesis where this thread surfaced
- `docs/strategy/Cold-Start Playbook.md` — shelter precedent + framing principle this doc mirrors
- `docs/features/shelters.md` — institutional entity pattern this doc generalises from
- `docs/planning/Open Questions & Assumptions Log.md` §15 (vaccines V1) + §16 (Vets as credentialing layer) — formal question slots
- `docs/strategy/Trust & Connection Model.md` — credentialing layer fits within the three-tier badge architecture (community-earned > credential > platform)
- Czech Veterinary Chamber (Komora veterinárních lékařů ČR) — institutional partner to map onto if we proceed
