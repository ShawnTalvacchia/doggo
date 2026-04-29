"use client";

import { Suspense, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CaretDown } from "@phosphor-icons/react";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { useDemoState } from "@/contexts/CurrentUserContext";
import "./hub.css";

/* ── Tab config ──────────────────────────────────────────────────── */

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "demo", label: "Demo" },
  { key: "work", label: "Work" },
  { key: "research", label: "Research" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ══════════════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════════════ */

/* ── Three Ways In (Overview tab) ────────────────────────────────── */

const WAYS_IN = [
  {
    title: "Find Your Park",
    body: "Auto-generated groups for every major dog park. Open, no admin, anyone posts a walk. The lowest-barrier entry point.",
    meta: "Large · Open · Auto-generated",
  },
  {
    title: "Find Your People",
    body: "Neighborhood circles, breed groups, activity crews. Small, trusted, high-utility. Where mutual aid lives.",
    meta: "Small-Medium · Private · User-created",
  },
  {
    title: "Find Your Help",
    body: "Provider-run groups with booking CTAs on meets. Your walker's schedule, your trainer's sessions. Community-wrapped service.",
    meta: "Medium · Open or Private · Provider-created",
  },
];

/* ── Demo tab — Personas ─────────────────────────────────────────── */

type Step = {
  title: string;
  narrative: string;
  cta?: { label: string; href: string };
};

type Persona = {
  id: string;
  name: string;
  archetype: string;
  tagline: string;
  steps: Step[];
  takeaway: string;
};

const PERSONAS: Persona[] = [
  {
    id: "tereza",
    name: "Tereza",
    archetype: "Routine Owner → Connector",
    tagline:
      "Routine owner who builds a neighborhood care network through walks.",
    steps: [
      {
        title: "Find a regular walk nearby",
        narrative:
          "Joins the auto-generated Riegrovy Sady Dog Walks park group. Shows up to a Thursday walk. Marks two attendees as Familiar.",
        cta: { label: "See a park group", href: "/communities/group-1" },
      },
      {
        title: "Form a smaller crew from regulars",
        narrative:
          "Recognizes the same faces weekly. Creates a private group — Vinohrady Evening Walkers — and invites five people she's met at the park.",
        cta: { label: "Create a group", href: "/communities/create" },
      },
      {
        title: "Help a neighbor when life happens",
        narrative:
          "The group grows to eight. Marek goes away for a weekend — Tereza watches his dog. Then another neighbor asks. She's becoming the default backup.",
        cta: { label: "Her profile", href: "/profile/tereza" },
      },
      {
        title: "Keep it fair without awkwardness",
        narrative:
          "Lists dog sitting with a modest rate. Not for income — because a posted rate makes expectations clear. The booking system protects the friendships.",
        cta: { label: "A rolling booking", href: "/bookings/booking-tereza-marek" },
      },
    ],
    takeaway:
      "Park group → neighborhood group → casual care. The platform didn't push her to become a provider. The social dynamics did.",
  },
  {
    id: "daniel",
    name: "Daniel",
    archetype: "Occasional-Need → Regular",
    tagline:
      "New rescue owner who finds support, confidence, and eventually a trainer.",
    steps: [
      {
        title: "Find safe socialization for a reactive dog",
        narrative:
          "Park groups feel too chaotic. Finds Prague Reactive Dog Support — a private interest group. Requests to join. Gets accepted.",
        cta: { label: "Interest group", href: "/communities/group-reactive-dogs" },
      },
      {
        title: "See what a meet looks like before committing",
        narrative:
          "Lurks for two weeks. Sees photos from a small, calm meet — four dogs, plenty of space. Signs up. It goes well. Marks two people as Familiar.",
        cta: { label: "Post-meet review", href: "/meets/meet-9/connect" },
      },
      {
        title: "Build a support network around a shared challenge",
        narrative:
          "Attends bi-weekly meets. Connects with three members. Shares photos to the group (never his profile — Locked, prefers group privacy).",
        cta: { label: "His locked profile", href: "/profile/daniel" },
      },
      {
        title: "Find professional help from someone he already trusts",
        narrative:
          "A Connected friend, Klára, is also a trainer. Joins her service group. Books a session through the meet CTA. Trust was already built.",
        cta: { label: "Klára's services", href: "/profile/klara?tab=services" },
      },
    ],
    takeaway:
      "Interest group → trust → care booking. He never used a park group. His entire experience was built around a specific need.",
  },
  {
    id: "klara",
    name: "Klára",
    archetype: "Professional Provider",
    tagline:
      "Professional trainer who builds a client base through community groups.",
    steps: [
      {
        title: "Create a service channel that doesn't feel like advertising",
        narrative:
          "Creates an open service group with training meets — 4 spots, 350 Kč, booking CTA attached. Also joins a park group as a regular owner with her own dog.",
        cta: { label: "Her care group", href: "/communities/group-klara-training" },
      },
      {
        title: "Let organic connections drive client discovery",
        narrative:
          "Three park group regulars connect with her. They see her services on her profile. Two join her service group and book sessions.",
        cta: { label: "Her profile", href: "/profile/klara" },
      },
      {
        title: "Use shared content as social proof",
        narrative:
          "15 members, two sessions a week. Members share photos from training — real dogs in real sessions. New visitors see the value and book.",
        cta: { label: "A training session", href: "/bookings/booking-klara-daniel" },
      },
      {
        title: "Scale the practice through the platform",
        narrative:
          "Adds dog walking, hires an assistant, creates a second service group. Groups are her primary client channel — real community, not ads.",
      },
    ],
    takeaway:
      "Service groups as community-wrapped business. The booking CTAs are commerce — but the meets, photos, and relationships are real.",
  },
  {
    id: "tomas",
    name: "Tomáš",
    archetype: "Social Seeker → Regular",
    tagline:
      "Newcomer who uses groups purely for coordination and emergency care.",
    steps: [
      {
        title: "Find parks and walks in an unfamiliar city",
        narrative:
          "Just moved to Prague. Joins Karlín Walks and Vítkov Park Dogs (auto-generated park groups). Goes to a morning walk.",
        cta: { label: "Discover parks", href: "/discover/groups" },
      },
      {
        title: "Start recognizing faces and building a network",
        narrative:
          "Six meets across two parks. Connects with Petra. She invites him to Karlín Dog Neighbors — a small private group for his block.",
        cta: { label: "Neighborhood group", href: "/communities/group-karlin-neighbours" },
      },
      {
        title: "Get emergency help from people who know his dog",
        narrative:
          "Needs to fly home for a family emergency. Posts in the neighborhood group. Two responses in an hour. Books Petra through the app — she already knows Hugo.",
        cta: { label: "Emergency booking", href: "/bookings/booking-petra-tomas" },
      },
      {
        title: "Stay embedded without creating content",
        narrative:
          "Regular in two park groups, active in the neighborhood group, connected with a dozen people. Never posted a photo. Never turned the provider dial. Pure utility.",
        cta: { label: "His profile", href: "/profile/tomas" },
      },
    ],
    takeaway:
      "Park groups for discovery, neighborhood group for belonging, care booking for emergencies. No content creation needed — still enormous value.",
  },
];

const CROSS_CONNECTIONS = [
  "Daniel books Klára's training sessions — trust built in a shared interest group leads to a service booking.",
  "Tomáš books Petra from his neighborhood group — emergency care from someone who already knows his dog.",
  "Tereza's neighborhood group mirrors Tomáš's — same pattern, different neighborhood. The model scales.",
  "Klára co-hosts events with Daniel's support group — service groups and community groups cross-pollinate.",
];

/* ── Work tab — Feature Families ─────────────────────────────────── */

type FeatureStatus = "done" | "in-progress" | "next" | "later";

type Feature = {
  name: string;
  status: FeatureStatus;
  desc: string;
  refs?: { label: string; href: string }[];
};

type Family = {
  name: string;
  summary: string;
  features: Feature[];
};

const FAMILIES: Family[] = [
  {
    name: "Community & Groups",
    summary:
      "The connective tissue. Four group types (park, neighborhood, interest, care), a scoped feed, post composer, and tabbed group detail.",
    features: [
      {
        name: "Community feed",
        status: "done",
        desc: "Neighborhood-scoped feed with posts, meet strip, category sub-tabs (All / Parks / Neighbors / Interest / Care).",
        refs: [{ label: "Open", href: "/home" }],
      },
      {
        name: "Group detail — tabbed",
        status: "done",
        desc: "Feed / Members / Meets tabs per group. Type-specific content.",
        refs: [{ label: "Open", href: "/communities/group-1" }],
      },
      {
        name: "Create group flow",
        status: "done",
        desc: "Name, description, visibility (open / approval / private), photo.",
        refs: [{ label: "Open", href: "/communities/create" }],
      },
      {
        name: "Post composer (modal + sheet)",
        status: "done",
        desc: "Rebuilt as ModalSheet. Photo-first, tag accordion (place / dog / person / community / meet).",
      },
      {
        name: "Post attribution",
        status: "done",
        desc: "Headers show in [Group] · at [Place] · with [Dogs]. Shared between community feed and profile posts tab.",
      },
      {
        name: "Community & Groups Deep Pass",
        status: "next",
        desc: "Make feeds and groups feel alive. Daniel lurks, Tomáš posts emergencies, type-specific group behaviour sharpened.",
      },
    ],
  },
  {
    name: "Meets",
    summary:
      "The trust-building mechanic. Detail pages, RSVP states, the post-meet review flow (primary Familiar trigger), creation flow.",
    features: [
      {
        name: "Meet detail page",
        status: "done",
        desc: "Cover photo hero, info strip, attendees with dogs, people-you-know social proof, rules, organiser card, sticky RSVP.",
        refs: [{ label: "Open", href: "/meets/meet-1" }],
      },
      {
        name: "Post-meet review flow",
        status: "done",
        desc: "Card stack of attendees with Mark Familiar / Connect / Skip. Locked profiles show first-name-only. The primary Familiar trigger.",
        refs: [{ label: "Open", href: "/meets/meet-9/connect" }],
      },
      {
        name: "Photo gallery + lightbox",
        status: "done",
        desc: "Adaptive 1/2/3/4+ grid, fullscreen lightbox with prev/next navigation.",
      },
      {
        name: '"Review recent meets" prompt',
        status: "done",
        desc: "Schedule upcoming view surfaces completed meets with a brand-accent Review CTA, linking into the post-meet flow.",
        refs: [{ label: "Open", href: "/schedule" }],
      },
      {
        name: "Meet cards across surfaces",
        status: "in-progress",
        desc: "Feed card, schedule timeline card, group detail card, search results card. Ongoing iteration.",
      },
      {
        name: "Meet creation flow",
        status: "next",
        desc: "Type picker, required vs optional fields, cover photo fallback per type, repeat/series option.",
        refs: [{ label: "Open", href: "/meets/create" }],
      },
      {
        name: "Type-specific content blocks",
        status: "next",
        desc: "Walk route, park details, playdate notes, training agenda. Depth and visual treatment per type.",
      },
    ],
  },
  {
    name: "Profiles",
    summary:
      "The relationship hub. Unified About / Posts / Services / Chat layout for every user. Connection-gated CTAs.",
    features: [
      {
        name: "Unified profile layout",
        status: "done",
        desc: "PageColumn + TabBar pattern. Same shell for owner, provider, own profile.",
        refs: [
          { label: "Own", href: "/profile" },
          { label: "Other", href: "/profile/tereza" },
        ],
      },
      {
        name: "Trust signals on About",
        status: "done",
        desc: "Walks, known-since, met-at, mutual connections, shared groups badges.",
      },
      {
        name: "PetCard expand/collapse",
        status: "done",
        desc: "Compact → expanded pet profile with socialisation, play style, vet notes.",
      },
      {
        name: "Locked profile gate",
        status: "done",
        desc: "Locked users show limited info. Gate feels respectful, not preachy.",
        refs: [{ label: "See locked", href: "/profile/daniel" }],
      },
      {
        name: "Services tab (provider view)",
        status: "in-progress",
        desc: "Service cards with pricing + units, availability grid, open-to-helping badge. Enrichment folded into Mock World Building.",
        refs: [{ label: "Example", href: "/profile/klara?tab=services" }],
      },
      {
        name: "Share profile link",
        status: "done",
        desc: "Landing page for a shared profile code.",
        refs: [{ label: "Example", href: "/connect/shawn-demo" }],
      },
    ],
  },
  {
    name: "Discover & Care",
    summary:
      "Hub with three doors (Meets, Groups, Dog Care). Filter pills + results cards. Currently marketplace-flavoured; next deep pass makes it feel like community.",
    features: [
      {
        name: "Discover hub",
        status: "done",
        desc: "Three entry points. All results use FilterPillRow + floating Filters button.",
        refs: [{ label: "Open", href: "/discover" }],
      },
      {
        name: "Discover Meets / Groups / Care",
        status: "done",
        desc: "Results with type-specific filter pills (service, time, size, distance).",
        refs: [
          { label: "Care", href: "/discover/care" },
          { label: "Groups", href: "/discover/groups" },
        ],
      },
      {
        name: "Provider cards",
        status: "done",
        desc: "Provider summary with rating, service type, price.",
      },
      {
        name: "Trust badge system",
        status: "next",
        desc: "Three tiers — community-earned (Community Regular, Neighborhood Anchor, Trusted by your Network), credential (Certified Trainer, First Aid, Insured), platform (Verified ID). See Research & Considerations.",
      },
      {
        name: "Pet-profile-based matching",
        status: "later",
        desc: "Recommend providers based on dog breed, size, temperament, special needs. From Fluv research.",
      },
      {
        name: "Intro Session booking type",
        status: "next",
        desc: "Free / reduced first booking for provider found via Discover without prior meets. Bridges the trust gap for the direct-discovery path.",
      },
    ],
  },
  {
    name: "Bookings & Sessions",
    summary:
      "Operational backbone. Tabbed booking detail, rolling weekly billing, provider session actions.",
    features: [
      {
        name: "Booking detail — Info / Sessions / Chat",
        status: "done",
        desc: "Owner and provider see the same booking from their respective perspectives. Rolling weekly billing with one upcoming session at a time.",
        refs: [{ label: "Open", href: "/bookings/booking-klara-daniel" }],
      },
      {
        name: "Provider session actions",
        status: "done",
        desc: "Start → Complete → Add note. Session state machine.",
      },
      {
        name: "Booking proposal & acceptance",
        status: "done",
        desc: "Proposal card in chat, owner Review & Sign / Decline actions, checkout mock.",
        refs: [{ label: "Checkout", href: "/bookings/booking-olga-walks/checkout" }],
      },
      {
        name: "Visit Report Card",
        status: "next",
        desc: "Photos + notes + timestamps (+ optional GPS summary) after every completed session. From Time To Pet research — table stakes for owner confidence.",
      },
      {
        name: "Mid-session photo update",
        status: "next",
        desc: "Provider sends a photo during an active session, owner sees it in real time.",
      },
      {
        name: "Live GPS during active sessions",
        status: "later",
        desc: "Real-time infrastructure required. Deferred past the prototype.",
      },
      {
        name: "Provider in-session focused mode",
        status: "next",
        desc: "Streamlined view during an active session — pet info (meds, vet, behaviour), quick actions, photo upload.",
      },
    ],
  },
  {
    name: "Messaging & Notifications",
    summary:
      "Chat-on-profile architecture. Inbox as a connections list. Grouped notifications.",
    features: [
      {
        name: "Inbox + search",
        status: "done",
        desc: "Conversation list with avatars, unread dots, service chips. Search by name, message body.",
        refs: [{ label: "Open", href: "/inbox" }],
      },
      {
        name: "Thread view",
        status: "done",
        desc: "Message bubbles, inquiry card, booking proposal cards inline.",
        refs: [{ label: "Open", href: "/inbox/olga-conv" }],
      },
      {
        name: "Notifications panel",
        status: "done",
        desc: "Grouped by time, typed icons. Supports meet invites, RSVPs, post-meet prompts, connection updates, booking events.",
        refs: [{ label: "Open", href: "/notifications" }],
      },
      {
        name: "Post-meet review notification",
        status: "done",
        desc: "New notification type (post_meet_review) that fires the day after a completed meet.",
      },
      {
        name: "Notification strategy — push vs. quiet",
        status: "later",
        desc: "What triggers push? What stays quiet in the panel? Requires real backend.",
      },
    ],
  },
  {
    name: "Trust & Connection",
    summary:
      "The four-state model. None → Familiar → Pending → Connected. Connection gates care actions. Community-built trust is the moat.",
    features: [
      {
        name: "Four-state connection model",
        status: "done",
        desc: "Data and rendering across profiles, attendee lists, care gates.",
      },
      {
        name: "Post-meet review (Familiar trigger)",
        status: "done",
        desc: "The primary mechanism for turning real-world meets into in-app Familiar connections. Just shipped.",
        refs: [{ label: "See the flow", href: "/meets/meet-9/connect" }],
      },
      {
        name: "Connection-gated care CTAs",
        status: "done",
        desc: "Care services require Connected status. Locked profiles are invisible until a meet bridges the gap.",
      },
      {
        name: "Hybrid trust — credential + platform badges",
        status: "next",
        desc: "Self-declared credentials (Certified Trainer, First Aid, Insured) and lightweight platform signals (Verified ID) as bridging confidence. Paired with community-earned badges.",
      },
    ],
  },
  {
    name: "Signup & Authentication",
    summary: "Onboarding flow + session.",
    features: [
      {
        name: "Multi-step signup",
        status: "done",
        desc: "Start → Profile → Pet → Visibility → Success.",
        refs: [{ label: "Start", href: "/signup/start" }],
      },
      {
        name: "Profile visibility toggle",
        status: "done",
        desc: "Locked (default) vs Open. Per-person Familiar/Connected happens later in-app.",
      },
      {
        name: "Real authentication (Supabase)",
        status: "later",
        desc: "Current flow is demo-only. Production auth is post-prototype.",
      },
    ],
  },
];

const STATUS_LABEL: Record<FeatureStatus, string> = {
  done: "Done",
  "in-progress": "In progress",
  next: "Next",
  later: "Later",
};

/* ── Research summaries (Research tab) ───────────────────────────── */

const RESEARCH = [
  {
    name: "Fluv",
    tag: "Asia pet-care marketplace",
    body:
      "Fluv is a vetted marketplace in Taiwan / Japan / Hong Kong — ~190K users, 9K sitters. Their trust model is top-down: ID verification, background checks, screening tests, platform-backed insurance, professional sitter photography, and a free in-home meet-and-greet before the first booking. Different mechanism from Doggo (vetting vs. community), but proves trust is the core problem.",
    land:
      "Lands in Discover & Care (hybrid trust signals, intro session booking type) and positioning work (social-mission framing, pet-profile-based matching).",
  },
  {
    name: "Time To Pet",
    tag: "B2B pet care SaaS",
    body:
      "Operational back-office for existing pet care businesses — 4K+ customers. Not a competitor (they assume you already have clients). Their killer features for owner confidence are Visit Report Cards (photos + notes + GPS + timestamps after every visit), real-time walk updates, and a focused provider in-session mobile workflow.",
    land:
      "Lands in Schedule & Bookings Deep Pass (report cards, mid-session photos, provider in-session focused mode). Also validates our rolling weekly billing model.",
  },
  {
    name: "Prague Dog Care Scene",
    tag: "local market study",
    body:
      "Three tiers today — professional services (credentials, years, named team, daily photo updates), platform sitters (Hlídačky.cz's video ID verification, rebooking badges, first-aid badges), and informal word-of-mouth (Facebook groups, Expats.cz). The informal tier is the one Doggo digitises. Paired with a proposed three-tier trust badge system (community-earned + credential + platform) and a cold-start seeding strategy: recruit 3–5 providers who use meets as a client-acquisition channel.",
    land:
      "Lands in Discover & Care (badge system), Mock World Building (realistic provider signals), and post-demo go-to-market (seed provider recruitment).",
  },
];

/* ── Considerations (Research tab) ───────────────────────────────── */

const CONSIDERATIONS = [
  {
    title: "Hybrid trust model",
    body:
      "Research shows users want at least some confidence before committing to a stranger — Fluv solves this with top-down vetting, Hlídačky.cz with platform badges. A Daniel-style anxious owner won't attend three meets before booking a walker; we need a faster path without abandoning community trust.",
    lean:
      "Hybrid. Community trust is primary (the moat), but add credential badges (self-declared with optional verification) and lightweight platform badges (Verified ID). Scope to Discover & Care Deep Pass.",
  },
  {
    title: "Intro session / pre-booking meet-and-greet",
    body:
      "Fluv offers a free meet-and-greet before the first booking. Doggo's meets serve the same role organically for users attending events. For the direct-discovery path (found in Discover without prior meets), there's a trust gap.",
    lean:
      "Add an Intro Session booking type — free or reduced, provider-toggleable. Scope to Bookings Deep Pass.",
  },
  {
    title: "Session experience — report cards & real-time updates",
    body:
      "Time To Pet and Prague professionals both treat daily photo/note/GPS updates as table stakes. Doggo's current Complete-session is a text note — obvious gap.",
    lean:
      "Ship Visit Report Card and mid-session photo updates in Schedule & Bookings Deep Pass. Defer live GPS (needs real-time infrastructure).",
  },
  {
    title: "Post-meet review — timing and the aha moment",
    body:
      "The just-shipped post-meet review is the primary Familiar trigger. Timing shapes how many Familiars accumulate. The broader question: what's the first experience that makes a new user think 'oh, this is actually useful'?",
    lean:
      "Next-morning push + permanent Schedule card (already shipped). Test both push and no-push in user testing. Aha-moment candidates worth trying: recognising faces at a park group, the first mutual Familiar → Connected escalation, a neighborhood feed full of people you just walked with.",
  },
  {
    title: "Demo packaging",
    body:
      "How do we present the prototype to testers — persona entry, guided tour, free exploration, or a mix?",
    lean:
      "Persona entry screen → short guided highlight reel → free exploration. Last deep pass before demo.",
  },
  {
    title: "Cold-start seeding",
    body:
      "The thesis rests on providers using meets as a client-acquisition channel. 3–5 seed providers in Vinohrady / Letná / Vršovice is enough to test the loop. Post-prototype but worth starting a shortlist.",
    lean:
      "Not in the current arc. Start a shortlist now, draft outreach when ready.",
  },
];

/* ── Sitemap data (Work tab accordion) ───────────────────────────── */

const SITEMAP = [
  {
    area: "Public / Guest",
    pages: [
      { name: "Landing", route: "/" },
      { name: "Sign In", route: "/signin" },
      { name: "Signup — Start", route: "/signup/start" },
      { name: "Signup — Success", route: "/signup/success" },
    ],
  },
  {
    area: "Community Hub",
    pages: [
      { name: "Community feed", route: "/home" },
      { name: "Group detail", route: "/communities/group-1" },
      { name: "Create group", route: "/communities/create" },
    ],
  },
  {
    area: "Meets",
    pages: [
      { name: "Meet detail", route: "/meets/meet-1" },
      { name: "Post-meet review", route: "/meets/meet-9/connect" },
      { name: "Create meet", route: "/meets/create" },
    ],
  },
  {
    area: "Discover",
    pages: [
      { name: "Discover hub", route: "/discover" },
      { name: "Discover Meets", route: "/discover/meets" },
      { name: "Discover Groups", route: "/discover/groups" },
      { name: "Discover Care", route: "/discover/care" },
    ],
  },
  {
    area: "Schedule & Bookings",
    pages: [
      { name: "My Schedule", route: "/schedule" },
      { name: "Bookings", route: "/bookings" },
      { name: "Booking detail", route: "/bookings/booking-klara-daniel" },
      { name: "Checkout", route: "/bookings/booking-olga-walks/checkout" },
    ],
  },
  {
    area: "Messaging & Notifications",
    pages: [
      { name: "Inbox", route: "/inbox" },
      { name: "Thread", route: "/inbox/olga-conv" },
      { name: "Notifications", route: "/notifications" },
    ],
  },
  {
    area: "Profile",
    pages: [
      { name: "My Profile", route: "/profile" },
      { name: "User — Tereza", route: "/profile/tereza" },
      { name: "User — Klára (provider)", route: "/profile/klara" },
      { name: "Share link", route: "/connect/shawn-demo" },
    ],
  },
  {
    area: "System",
    pages: [
      { name: "Sitemap (this page)", route: "/pages" },
      { name: "Styleguide", route: "/styleguide" },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════
   TAB COMPONENTS
   ══════════════════════════════════════════════════════════════════ */

function OverviewTab() {
  return (
    <>
      <section className="hub-hero">
        <p className="hub-hero-eyebrow">Doggo · Prototype preview</p>
        <h1 className="hub-hero-title">Community-first dog care for Prague</h1>
        <p className="hub-hero-lede">
          Dog ownership is the most natural social connector in a city. Doggo
          turns that into a platform — meets build trust, trust enables care,
          and care is booked through people you already know. This prototype
          demonstrates the full funnel across four personas.
        </p>

        <div className="hub-stats">
          <div className="hub-stat">
            <span className="hub-stat-num">20</span>
            <span className="hub-stat-label">Mock users</span>
          </div>
          <div className="hub-stat">
            <span className="hub-stat-num">24</span>
            <span className="hub-stat-label">Meets</span>
          </div>
          <div className="hub-stat">
            <span className="hub-stat-num">35</span>
            <span className="hub-stat-label">Posts</span>
          </div>
          <div className="hub-stat">
            <span className="hub-stat-num">60+</span>
            <span className="hub-stat-label">Images</span>
          </div>
          <div className="hub-stat">
            <span className="hub-stat-num">30+</span>
            <span className="hub-stat-label">Phases shipped</span>
          </div>
        </div>
      </section>

      <section className="hub-section">
        <h2 className="hub-section-title">Three Ways In</h2>
        <p className="hub-section-lede">
          Groups are the connective tissue. Every user enters through one of
          three doors. All three lead to the same place — a network of people
          who know each other and each other&apos;s dogs.
        </p>

        <div className="hub-ways">
          {WAYS_IN.map((w) => (
            <div key={w.title} className="hub-way">
              <h3 className="hub-way-title">{w.title}</h3>
              <p className="hub-way-body">{w.body}</p>
              <p className="hub-way-meta">{w.meta}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hub-section">
        <h2 className="hub-section-title">Where to start</h2>
        <p className="hub-section-lede">
          Head to the <strong>Demo</strong> tab to walk through four personas —
          Tereza, Daniel, Klára, Tomáš — and see how each experiences the
          community → trust → care funnel. Each step has a deep link into the
          running prototype.
        </p>
      </section>
    </>
  );
}

function FrontDoor() {
  return (
    <div className="hub-front-door">
      <h3 className="hub-front-door-title">The Front Door</h3>
      <p className="hub-front-door-note">
        Also accessible without the password — share publicly if you want.
      </p>
      <div className="hub-front-door-links">
        <Link className="hub-link-card" href="/">
          Landing page — community-first pitch
        </Link>
        <Link className="hub-link-card" href="/signup/start">
          Signup flow — onboarding story
        </Link>
      </div>
    </div>
  );
}

function PersonaBlock({ persona }: { persona: Persona }) {
  const router = useRouter();
  const { setUserById } = useDemoState();
  const [expanded, setExpanded] = useState(false);

  const handleEnter = () => {
    setUserById(persona.id);
    // Persist + send to /home so the persona switch is visible immediately.
    router.push("/home");
  };

  return (
    <div className="hub-persona">
      <div className="hub-persona-head">
        <div className="hub-persona-name-row">
          <h3 className="hub-persona-name">{persona.name}</h3>
          <span className="hub-persona-archetype">{persona.archetype}</span>
        </div>
        <p className="hub-persona-tagline">{persona.tagline}</p>

        <div className="hub-persona-actions">
          <ButtonAction
            variant="primary"
            cta
            size="md"
            onClick={handleEnter}
            rightIcon={<ArrowRight size={16} weight="bold" />}
          >
            Enter as {persona.name}
          </ButtonAction>
          <button
            type="button"
            className="hub-persona-toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "Hide journey" : "Show journey"}
            <CaretDown
              size={14}
              weight="bold"
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 150ms ease",
              }}
            />
          </button>
        </div>
      </div>

      {expanded && (
        <>
          <div className="hub-persona-steps">
            {persona.steps.map((s, i) => (
              <div key={i} className="hub-step">
                <div className="hub-step-num">{i + 1}</div>
                <div className="hub-step-body">
                  <h4 className="hub-step-title">{s.title}</h4>
                  <p className="hub-step-narrative">{s.narrative}</p>
                  {s.cta && (
                    <div className="hub-step-cta">
                      <Link className="hub-link" href={s.cta.href}>
                        {s.cta.label} →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="hub-persona-foot">{persona.takeaway}</div>
        </>
      )}
    </div>
  );
}

function DemoTab() {
  return (
    <>
      <section className="hub-section">
        <h2 className="hub-section-title">Demo by persona</h2>
        <p className="hub-section-lede">
          Four people, four paths through the same platform. Each step below
          deep-links into the prototype — click through and see how the
          experience unfolds. Start anywhere.
        </p>

        <FrontDoor />

        {PERSONAS.map((p) => (
          <PersonaBlock key={p.id} persona={p} />
        ))}
      </section>

      <section className="hub-section">
        <h2 className="hub-section-title">How the journeys connect</h2>
        <p className="hub-section-lede">
          These aren&apos;t four separate products — they&apos;re four
          experiences of the same platform.
        </p>

        <div className="hub-connections">
          <h3 className="hub-connections-title">Cross-pollination</h3>
          <ul className="hub-connections-list">
            {CROSS_CONNECTIONS.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function WorkTab() {
  return (
    <>
      <section className="hub-section">
        <h2 className="hub-section-title">Features by family</h2>
        <p className="hub-section-lede">
          Every feature, grouped into eight families. Status reflects where
          each one is in the build — some are shipped and polished, others are
          structural scaffolding waiting for a deep pass.
        </p>

        {FAMILIES.map((f) => (
          <div key={f.name} className="hub-family">
            <div className="hub-family-head">
              <h3 className="hub-family-name">{f.name}</h3>
              <p className="hub-family-summary">{f.summary}</p>
            </div>

            <div className="hub-features">
              {f.features.map((feat) => (
                <div key={feat.name} className="hub-feature">
                  <span className={`hub-status hub-status--${feat.status}`}>
                    {STATUS_LABEL[feat.status]}
                  </span>
                  <div className="hub-feature-body">
                    <span className="hub-feature-name">{feat.name}</span>
                    <span className="hub-feature-desc">{feat.desc}</span>
                    {feat.refs && feat.refs.length > 0 && (
                      <div className="hub-feature-refs">
                        {feat.refs.map((r) => (
                          <Link
                            key={r.href}
                            href={r.href}
                            className="hub-feature-ref"
                          >
                            {r.label} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="hub-section">
        <details className="hub-sitemap">
          <summary className="hub-sitemap-summary">Full site map</summary>
          <div className="hub-sitemap-body">
            {SITEMAP.map((group) => (
              <div key={group.area} className="hub-sitemap-group">
                <h4 className="hub-sitemap-area">{group.area}</h4>
                <div className="hub-sitemap-rows">
                  {group.pages.map((p) => (
                    <div key={p.route} className="hub-sitemap-row">
                      <Link href={p.route}>{p.name}</Link>
                      <code>{p.route}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      </section>
    </>
  );
}

function ResearchTab() {
  return (
    <>
      <section className="hub-section">
        <h2 className="hub-section-title">Research</h2>
        <p className="hub-section-lede">
          Three focused studies informed the next phase of work. Summaries
          below; the full docs are linked at the bottom.
        </p>

        {RESEARCH.map((r) => (
          <div key={r.name} className="hub-study">
            <h3 className="hub-study-name">
              {r.name} <span className="hub-study-tag">— {r.tag}</span>
            </h3>
            <p className="hub-study-body">{r.body}</p>
            <p className="hub-study-land">{r.land}</p>
          </div>
        ))}
      </section>

      <section className="hub-section">
        <h2 className="hub-section-title">Considerations</h2>
        <p className="hub-section-lede">
          Decisions worth aligning on before the next Deep Passes. Each
          includes what the research suggests and my current lean — happy to
          revisit any of them.
        </p>

        {CONSIDERATIONS.map((c) => (
          <div key={c.title} className="hub-consideration">
            <h3 className="hub-consideration-title">{c.title}</h3>
            <p className="hub-consideration-body">{c.body}</p>
            <p className="hub-consideration-lean">
              <strong>Current lean:</strong> {c.lean}
            </p>
          </div>
        ))}
      </section>

      <section className="hub-section">
        <h2 className="hub-section-title">Competitive Research</h2>
        <p className="hub-section-lede">
          Full write-ups of the three studies — context, features worth
          studying, strategic takeaways, and action items per company.
        </p>
        <div className="hub-front-door-links">
          <Link className="hub-link-card" href="/pages/research/fluv">
            Fluv →
          </Link>
          <Link className="hub-link-card" href="/pages/research/time-to-pet">
            Time To Pet →
          </Link>
          <Link className="hub-link-card" href="/pages/research/prague">
            Prague Dog Care Scene →
          </Link>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════ */

function HubInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab");
  const activeTab: TabKey = (TABS.find((t) => t.key === rawTab)?.key ??
    "overview") as TabKey;

  const setTab = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", key);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [pathname, router, searchParams]
  );

  return (
    <main className="hub">
      {/* Top strip — brand + meta chips (private preview, last updated) */}
      <header className="hub-top-strip">
        <div className="hub-wrap hub-top-strip-inner">
          <Link href="/pages" className="hub-brand">
            DOGGO
          </Link>
          <div className="hub-header-meta">
            <span className="hub-header-meta-chip">
              <span className="hub-header-meta-dot" />
              Private preview
            </span>
            <span className="hub-header-meta-date">Updated Apr 20</span>
          </div>
        </div>
      </header>

      {/* Content panel — fills remaining height, body scrolls internally */}
      <div className="hub-panel-wrap">
        <section className="hub-panel">
          <nav
            className="hub-panel-tabs detail-tabs--fill"
            aria-label="Hub sections"
          >
            <TabBar
              tabs={TABS as unknown as { key: string; label: string }[]}
              activeKey={activeTab}
              onChange={setTab}
            />
          </nav>
          <div className="hub-panel-body">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "demo" && <DemoTab />}
            {activeTab === "work" && <WorkTab />}
            {activeTab === "research" && <ResearchTab />}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function Hub() {
  return (
    <Suspense fallback={null}>
      <HubInner />
    </Suspense>
  );
}
