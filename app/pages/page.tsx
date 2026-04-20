import Link from "next/link";
import { PAGE_MENU_GROUPS } from "@/lib/navigation/pageMenuGroups";
import "./status-page.css";

/* ── tiny helpers ────────────────────────────────────────────────── */

function Chip({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "brand" | "muted" }) {
  return <span className={`status-chip status-chip--${variant}`}>{children}</span>;
}

function RouteLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="status-route-link">
      {children}
    </Link>
  );
}

/* ── data ────────────────────────────────────────────────────────── */

const siteMap = [
  {
    area: "Public / Guest",
    pages: [
      { name: "Landing", route: "/", desc: "Community-first hero, photo meet cards, how-it-works tabs, archetype section, testimonials" },
      { name: "Sign In", route: "/signin", desc: "Email + password form (demo navigation only)" },
    ],
  },
  {
    area: "Signup Flow",
    label: "multi-step",
    pages: [
      { name: "Start", route: "/signup/start", desc: "SSO options + email form + T&C checkboxes" },
      { name: "Profile", route: "/signup/profile", desc: "Photo upload, bio, location, neighbourhood" },
      { name: "Pet", route: "/signup/pet", desc: "Pet card: photo, breed, size, temperament, health notes" },
      { name: "Visibility", route: "/signup/visibility", desc: "Locked vs. Open default (per-person Familiar/Connect happens later)" },
      { name: "Success", route: "/signup/success", desc: "Confirmation + CTAs + profile preview" },
    ],
  },
  {
    area: "Community — Home Hub",
    label: "default tab after login",
    pages: [
      { name: "Community Feed", route: "/home", desc: "Neighbourhood-scoped feed with posts, meets strip, group activity. Category sub-tabs: All / Parks / Neighbors / Interest / Care" },
      { name: "Group Detail", route: "/communities/group-1", desc: "Group hub with Feed, Members, Meets tabs. Type-specific content (park, neighbor, interest, care)" },
      { name: "Create Group", route: "/communities/create", desc: "Form: name, description, visibility (open/approval/private), photo" },
    ],
  },
  {
    area: "Community — Meets",
    label: "the trust-building mechanic",
    pages: [
      { name: "Meet Detail", route: "/meets/meet-1", desc: "Cover hero, info strip, attendees with dogs, people-you-know social proof, rules, organiser card, sticky RSVP" },
      { name: "Post-Meet Review", route: "/meets/meet-9/connect", desc: "The Familiar trigger — attendee card stack with Mark Familiar / Connect / Skip, share-photos entry" },
      { name: "Create Meet", route: "/meets/create", desc: "Type picker (walk / park / playdate / training), details, visibility, recurring" },
    ],
  },
  {
    area: "Discover",
    label: "hub with three doors",
    pages: [
      { name: "Discover Hub", route: "/discover", desc: "Three entry points: Meets, Groups, Dog Care. All results use FilterPillRow + floating Filters button" },
      { name: "Discover Meets", route: "/discover/meets", desc: "Meet search results with filter pills (type, time, distance, size)" },
      { name: "Discover Groups", route: "/discover/groups", desc: "Group search results with filter pills (type, neighbourhood, activity)" },
      { name: "Discover Care", route: "/discover/care", desc: "Provider search — filter pills for service type, price, distance" },
    ],
  },
  {
    area: "Schedule & Bookings",
    label: "operational backbone",
    pages: [
      { name: "My Schedule", route: "/schedule", desc: "Upcoming / Care / Interested tabs. 'Review recent meets' section drives post-meet Familiar trigger" },
      { name: "Bookings", route: "/bookings", desc: "All active and past bookings. Owner and provider bookings in one list" },
      { name: "Booking Detail", route: "/bookings/booking-klara-daniel", desc: "Info / Sessions / Chat tabs. Provider sees start/complete actions; owner sees aggregate stats. Rolling weekly billing" },
      { name: "Checkout", route: "/bookings/booking-olga-walks/checkout", desc: "Payment mock for initial booking" },
    ],
  },
  {
    area: "Messaging & Notifications",
    pages: [
      { name: "Inbox", route: "/inbox", desc: "Connection list + search. Links to profile-based chat threads" },
      { name: "Thread", route: "/inbox/olga-conv", desc: "Message bubbles, inquiry card, booking proposal cards" },
      { name: "Notifications", route: "/notifications", desc: "Grouped by time. Supports meet invites/reminders, RSVPs, post-meet review prompts, connection updates, bookings" },
    ],
  },
  {
    area: "Profile",
    label: "relationship hub",
    pages: [
      { name: "My Profile", route: "/profile", desc: "About / Posts / Services tabs. Connection list, trust badges, share profile link" },
      { name: "User Profile — Tereza", route: "/profile/tereza", desc: "Other user's profile (owner archetype). About / Posts / Services / Chat tabs. Connection-gated CTAs" },
      { name: "User Profile — Klára (provider)", route: "/profile/klara", desc: "Provider archetype — Services tab populated with offerings, availability, pricing" },
      { name: "Share Profile Link", route: "/connect/shawn-demo", desc: "Landing for someone opening your shared profile code" },
    ],
  },
  {
    area: "System",
    pages: [
      { name: "Sitemap", route: "/pages", desc: "This page — the sitemap" },
      { name: "Styleguide", route: "/styleguide", desc: "Design system reference — Colors, Typography, Tokens, Components" },
    ],
  },
];

type PhaseStatus = "done" | "active" | "paused" | "upcoming";

const phases: { name: string; status: PhaseStatus; summary: string }[] = [
  {
    name: "Phases 1–18 — Foundation",
    status: "done",
    summary: "Design tokens, app shell, nav, landing, signup, meets, groups, home, schedule, inbox, bookings, provider onboarding, trust signals, layout redesign. Full skeleton built.",
  },
  {
    name: "Phase 19–25 — UI Rebuild & Polish",
    status: "done",
    summary: "Panel architecture across Home/Discover/Bookings/Schedule, Discover hub with FilterPillRow, group detail tabs, schedule card rebuild, component consolidation.",
  },
  {
    name: "Content Completion",
    status: "done",
    summary: "Feed comments, Discover filters wired, photo height caps, unified tabs, empty states filled with real content.",
  },
  {
    name: "Bookings & Care Provider Flow",
    status: "done",
    summary: "Tabbed booking detail (Info / Sessions / Chat), rolling weekly billing, provider session actions (Start → Complete → Note).",
  },
  {
    name: "Profiles & Dogs",
    status: "done",
    summary: "Unified profile pages (PageColumn + TabBar), connection-gated CTAs, PetCard expand/collapse.",
  },
  {
    name: "Inbox & Notifications",
    status: "done",
    summary: "Chat-on-profile architecture, inbox search, notification panel, grouped view.",
  },
  {
    name: "Profiles Deep Pass",
    status: "paused",
    summary: "Trust signals (mutual connections, shared groups), post composer rebuilt as ModalSheet, post header attribution. Remaining content enrichment folded into Mock World Building.",
  },
  {
    name: "Meets Deep Pass",
    status: "active",
    summary: "Make meets feel compelling — cover photo hero, attendee social proof, type-specific details, post-meet review flow (the Familiar trigger). In progress.",
  },
  {
    name: "Community & Groups",
    status: "upcoming",
    summary: "Groups and feeds feel alive. Type-specific group behaviour for Park / Neighbor / Interest / Care.",
  },
  {
    name: "Discover & Care",
    status: "upcoming",
    summary: "Care discovery feels like community, not marketplace. Trust badge system, pet-based matching, intro sessions.",
  },
  {
    name: "Schedule & Bookings Deep Pass",
    status: "upcoming",
    summary: "Visit report cards, real-time session updates, provider in-session UI.",
  },
  {
    name: "Mock World Building",
    status: "upcoming",
    summary: "Coherent four-persona world (Tereza, Daniel, Klára, Tomáš) with rich cross-connections, images, and content.",
  },
  {
    name: "Cross-Cutting Flow Testing",
    status: "upcoming",
    summary: "Every persona journey works end-to-end. Trust signals accumulate. No dead ends.",
  },
  {
    name: "Demo Presentation",
    status: "upcoming",
    summary: "Landing page, persona selection, guided tours. Free exploration also rewarding.",
  },
];

const considerations = [
  {
    title: "Hybrid trust model",
    body: "Research into Fluv (Asia pet-care marketplace) and Prague platform sitters (Hlídačky.cz) shows users want at least some confidence before committing to a stranger. Open question: does Doggo add lightweight top-down signals (Verified ID, 'Used by X of your connections', credential badges) on top of community-built trust, or stay pure community? A three-tier badge system (community-earned + self-declared credentials + platform-verified) is scoped for Discover & Care.",
  },
  {
    title: "Intro session / pre-booking meet-and-greet",
    body: "Fluv offers a free in-home meet-and-greet before the first booking. This is what Doggo's meets do organically for users attending events. For the direct-discovery path (Daniel finds Klára in Discover without prior meets), an 'Intro Session' booking type — free or reduced — could bridge the trust gap. Scoped for Bookings Deep Pass.",
  },
  {
    title: "Session experience — visit report cards & real-time updates",
    body: "Time To Pet research (B2B pet care SaaS) and Prague professionals (Pawz, Dogitory) show that daily photos/notes/GPS updates during and after sessions are table stakes, not delight. Currently Doggo's 'Complete session' is a text note. A Visit Report Card (photos + notes + timestamps + optional GPS summary) and mid-session photo updates would land in Schedule & Bookings Deep Pass.",
  },
  {
    title: "Pet-profile-based provider matching",
    body: "Fluv matches owners to sitters using pet data (breed, size, temperament, special needs). Doggo's Discover currently filters by service type + location only. A 'Recommended for [dog name]' layer using existing pet profile data would differentiate Discover & Care. Lower priority than trust badges.",
  },
  {
    title: "Cold-start seeding strategy",
    body: "Seed 3–5 Prague providers in Vinohrady / Letná / Vršovice who use meets as a client-acquisition channel. Every meet they host generates real trust badges. Owners get value before they need care; providers get a pipeline. This is the thesis the prototype sells — demo needs to make the loop legible. Post-demo execution.",
  },
  {
    title: "Post-meet review flow — timing & aha moment",
    body: "The post-meet review (card stack of attendees with Mark Familiar / Connect / Skip) is the primary Familiar trigger in the Trust & Connection Model. Just shipped. Open: should the prompt fire immediately after the meet ends, or next-morning push? And what's the 'aha moment' — the first action that makes a user come back?",
  },
];

/* ── page ────────────────────────────────────────────────────────── */

export default function PrototypeOverviewPage() {
  const totalPages = siteMap.reduce((n, g) => n + g.pages.length, 0);

  return (
    <>
    <div className="page-container">
    <main className="status-page">
      <div className="status-wrap">

        {/* ── Quick Nav ────────────────────────────────────────── */}
        <section className="status-section">
          <h2 className="status-section-title">Quick Nav</h2>
          <div className="grid gap-7">
            {PAGE_MENU_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-wider text-fg-tertiary mb-2">{group.title}</p>
                <div className="flex flex-col gap-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.value}
                      href={item.value}
                      className="block rounded-sm border border-edge-strong bg-surface-popout px-3 py-2.5 text-sm font-semibold text-fg-secondary hover:border-brand-main hover:text-fg-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="status-hero">
          <p className="status-eyebrow">Prototype Status Report</p>
          <h1 className="status-title">Doggo</h1>
          <p className="status-subtitle">
            Community-first dog care — Prague
          </p>
          <p className="status-date">April 19, 2026</p>

          <div className="status-stats">
            <div className="status-stat">
              <span className="status-stat-num">{totalPages}</span>
              <span className="status-stat-label">Pages</span>
            </div>
            <div className="status-stat">
              <span className="status-stat-num">80+</span>
              <span className="status-stat-label">Components</span>
            </div>
            <div className="status-stat">
              <span className="status-stat-num">{siteMap.length}</span>
              <span className="status-stat-label">Product Areas</span>
            </div>
          </div>
        </header>

        {/* ── Journey ──────────────────────────────────────────── */}
        <section className="status-section">
          <h2 className="status-section-title">User Journey</h2>
          <div className="status-journey">
            {["Discover", "Sign up", "Meet", "Connect", "Care", "Review"].map((step, i) => (
              <div key={step} className="status-journey-step">
                <span className="status-journey-num">{i + 1}</span>
                <span className="status-journey-label">{step}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Phase Progress ─────────────────────────────────── */}
        <section className="status-section">
          <h2 className="status-section-title">Phase Progress</h2>
          <p className="status-section-intro">30+ phases shipped. Currently working through named &quot;Deep Passes&quot; — whole-surface quality rebuilds, one major area at a time.</p>
          <div className="status-considerations">
            {phases.map((p) => (
              <div key={p.name} className="status-consideration">
                <h3>
                  {p.name}{" "}
                  <Chip
                    variant={
                      p.status === "done"
                        ? "brand"
                        : p.status === "active"
                        ? "default"
                        : p.status === "paused"
                        ? "muted"
                        : "muted"
                    }
                  >
                    {p.status === "done"
                      ? "Complete"
                      : p.status === "active"
                      ? "In Progress"
                      : p.status === "paused"
                      ? "Paused"
                      : "Upcoming"}
                  </Chip>
                </h3>
                <p>{p.summary}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Site Map ─────────────────────────────────────────── */}
        <section className="status-section">
          <h2 className="status-section-title">Site Map</h2>

          {siteMap.map((group) => (
            <div key={group.area} className="status-map-group">
              <h3 className="status-map-area">
                {group.area}
                {group.label && <Chip variant="muted">{group.label}</Chip>}
              </h3>
              <div className="status-map-rows">
                {group.pages.map((page) => (
                  <div key={page.route} className="status-map-row">
                    <div className="status-map-name">
                      <RouteLink href={page.route}>{page.name}</RouteLink>
                    </div>
                    <div className="status-map-route">
                      <code>{page.route}</code>
                    </div>
                    <div className="status-map-desc">{page.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ── Data ─────────────────────────────────────────────── */}
        <section className="status-section">
          <h2 className="status-section-title">How Data Works Today</h2>

          <div className="status-data-cards">
            <div className="status-data-card">
              <h3 className="status-data-card-title">Supabase <Chip variant="brand">read-only</Chip></h3>
              <p>Provider profiles, service offerings, and rates are seeded in the database and fetched server-side on Discover and provider profile pages. This data is real and will carry forward.</p>
            </div>
            <div className="status-data-card">
              <h3 className="status-data-card-title">Mock Data <Chip variant="muted">client-side</Chip></h3>
              <p>Users, meets, groups, connections, conversations, bookings, notifications, and the logged-in user are loaded from static mock files. State updates in the session but resets on refresh.</p>
            </div>
          </div>

          <div className="status-data-note">
            <strong>Why it works this way:</strong> Auth isn&apos;t wired up yet, so there&apos;s no logged-in user to write data for. The mock layer is designed to swap in Supabase calls later without rebuilding any UI.
          </div>
        </section>

        {/* ── Considerations ───────────────────────────────────── */}
        <section className="status-section">
          <h2 className="status-section-title">Open Considerations</h2>
          <p className="status-section-intro">Strategic questions informed by recent research (Fluv, Time To Pet, Prague dog care scene). Worth discussing before the next Deep Passes.</p>

          <div className="status-considerations">
            {considerations.map((c) => (
              <div key={c.title} className="status-consideration">
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────── */}
        <footer className="status-footer">
          <p>Last updated April 19, 2026</p>
        </footer>
      </div>
    </main>
    </div>
    <div className="page-spacer" aria-hidden="true" />
    </>
  );
}
