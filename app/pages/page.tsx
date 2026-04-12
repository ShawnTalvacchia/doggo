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
    label: "5 steps, progress bar",
    pages: [
      { name: "Start", route: "/signup/start", desc: "SSO options + email form + T&C checkboxes" },
      { name: "Profile", route: "/signup/profile", desc: "Photo upload, bio, location, visibility toggle" },
      { name: "Pet", route: "/signup/pet", desc: "Pet card: photo, breed, size, temperament, health notes" },
      { name: "Visibility", route: "/signup/visibility", desc: "Control who sees your profile" },
      { name: "Success", route: "/signup/success", desc: "Confirmation + CTAs + profile preview" },
    ],
  },
  {
    area: "Community — Meets",
    label: "strategic centrepiece",
    pages: [
      { name: "Activity", route: "/activity", desc: "Discover/My Schedule/Bookings tabs — meet browse, personal schedule, care arrangements" },
      { name: "Create Meet", route: "/meets/create", desc: "Form: type selection, title, location, date/time, duration, max attendees, recurring, leash & size rules" },
      { name: "Meet Detail", route: "/meets/meet-1", desc: "Type badge, details grid, join/leave, organiser, attendee list with connection badges, group chat" },
      { name: "Post-Meet Connect", route: "/meets/meet-6/connect", desc: "Recap with photos, attendee cards with Familiar/Connect actions, bulk connect, share modal" },
    ],
  },
  {
    area: "Home",
    label: "tabbed hub",
    pages: [
      { name: "Feed", route: "/home", desc: "Personalised greeting, upcoming strip, social feed with mixed card types" },
      { name: "Groups", route: "/home?tab=groups", desc: "Browse and manage groups — your groups, discover, private, with filter pills" },
    ],
  },
  {
    area: "Groups (detail pages)",
    pages: [
      { name: "Create Group", route: "/communities/create", desc: "Form: name, description, visibility (open/approval/private), photo" },
      { name: "Group Detail", route: "/communities/group-1", desc: "Members, meets, chat, gallery" },
    ],
  },
  {
    area: "Schedule",
    pages: [
      { name: "My Schedule", route: "/schedule", desc: "Upcoming/History toggle with unified meets + bookings timeline" },
    ],
  },
  {
    area: "Care & Explore",
    label: "accessed via Find Care CTA",
    pages: [
      { name: "Results", route: "/discover?tab=care", desc: "Provider cards with filters (service, price, availability), interactive Leaflet map" },
      { name: "Provider Profile", route: "/profile/olga-m", desc: "Unified profile with About / Posts / Services tabs" },
    ],
  },
  {
    area: "Messaging",
    pages: [
      { name: "Inbox", route: "/inbox", desc: "Conversation list with avatars, unread dots, service chips" },
      { name: "Thread", route: "/inbox/conv-olga", desc: "Message bubbles, inquiry card, booking proposal cards" },
    ],
  },
  {
    area: "Bookings",
    label: "care management hub",
    pages: [
      { name: "My Care", route: "/bookings?tab=care", desc: "Owner bookings — active, upcoming, past care arrangements" },
      { name: "My Services", route: "/bookings?tab=services", desc: "Provider dashboard — visibility, stats, service cards, incoming requests, active clients" },
      { name: "Booking Detail", route: "/bookings?tab=care", desc: "Select a booking to see session management, price breakdown, review — all in the detail panel" },
    ],
  },
  {
    area: "Profile & System",
    pages: [
      { name: "My Profile", route: "/profile", desc: "About tab (bio, pet cards, trust badges, connections) + Offering tab (services, pricing, availability)" },
      { name: "User Profile", route: "/profile/user-leo", desc: "Public view of another user's profile" },
      { name: "Styleguide", route: "/styleguide", desc: "Design system reference — Colors, Typography, Tokens, Components" },
    ],
  },
];

const phases = [
  { num: 1, name: "Foundation", status: "done" as const, summary: "Design tokens, base styles, landing page, signup flow, explore, provider profiles" },
  { num: 2, name: "App Shell", status: "done" as const, summary: "Nav restructure, app layout, page shells for Home/Schedule/Inbox/Bookings/Profile" },
  { num: 3, name: "Community Core", status: "done" as const, summary: "Meets (browse, create, detail, group chat), connections (trust ladder), home feed, schedule" },
  { num: 4, name: "Polish & UX", status: "done" as const, summary: "Navbar simplified, modal pattern formalised, shadow softened, forms flattened, prototype overview consolidated" },
  { num: 5, name: "Care & Profile", status: "done" as const, summary: "Booking detail, profile edit mode, provider trust signals, explore map, messaging, enhanced pet profiles" },
  { num: 6, name: "Audit & Alignment", status: "done" as const, summary: "Home page overhaul, landing page rewrite, signup flow review, Offer Care nav link, visual consistency pass" },
  { num: 7, name: "Community-Native Care", status: "done" as const, summary: "Provider onboarding via profile, community-first care discovery, relationship context in bookings, payment mock" },
  { num: 8, name: "Community Feel", status: "done" as const, summary: "Neighbourhood identity, social proof stats, activity indicators, welcome state, post-meet recap with photos, trust badges" },
  { num: 9, name: "Groups & Belonging", status: "done" as const, summary: "Groups browse/detail/create, meet-group cross-links, shared MessageBubble, Your Groups on Home" },
  { num: 10, name: "Home Feed & Social Posts", status: "done" as const, summary: "Social feed, user-authored photo posts, mixed card types, profile Posts tab, contextual CTAs, reactions" },
  { num: 11, name: "Booking & Care Polish", status: "done" as const, summary: "Connection gating, payment mock checkout, provider setup consolidation, owner booking actions" },
  { num: 12, name: "Demo Ready", status: "done" as const, summary: "Carer inquiry response, component extraction, dead CSS audit, EmptyState + ButtonAction adoption" },
  { num: 13, name: "Meet Type Enrichment", status: "done" as const, summary: "Type-specific fields (walk/park/playdate/training), conditional form sections, summary pills, detail sections" },
  { num: 14, name: "Community & Activity Restructure", status: "done" as const, summary: "Activity page with Discover/My Schedule/Bookings tabs, join-gated chat, system messages, event card strip" },
  { num: 15, name: "Trust & Connections", status: "done" as const, summary: "Share profile links, tiered participant lists, Going/Interested RSVP, post-meet reveal, AI-generated images" },
  { num: 16, name: "Layout Redesign", status: "done" as const, summary: "Desktop sidebar nav, LoggedInShell (640px content), Groups/Activities rename, CalendarDots icon" },
  { num: 17, name: "Activities Tab Redesign", status: "next" as const, summary: "My Schedule Upcoming/Completed toggle, role badges, hosting distinction, Bookings card consistency" },
];

const considerations = [
  {
    title: "Authentication strategy",
    body: "Supabase Auth is the assumed path. Decisions pending: email-only vs. SSO (Google, Apple), magic link vs. password, whether to gate features behind login.",
  },
  {
    title: "Chat infrastructure",
    body: "Group and meet threads exist as mock UI. For real-time: Supabase Realtime vs. Stream/SendBird. SharedMessageBubble component is ready for either path.",
  },
  {
    title: "Recurring meet mechanics",
    body: "Users can mark a meet as recurring, but join mechanics are undefined: \"join all Tuesdays\" vs. single occurrence RSVP. Impacts calendar and notification design.",
  },
  {
    title: "Community visibility model",
    body: "Groups support open/approval/private tiers. How does this interact with the personal connection model (familiar/connected)? Needs alignment before production.",
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
          <p className="status-date">March 30, 2026</p>

          <div className="status-stats">
            <div className="status-stat">
              <span className="status-stat-num">{totalPages}</span>
              <span className="status-stat-label">Pages</span>
            </div>
            <div className="status-stat">
              <span className="status-stat-num">50+</span>
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
          <div className="status-considerations">
            {phases.map((p) => (
              <div key={p.num} className="status-consideration">
                <h3>
                  Phase {p.num}: {p.name}{" "}
                  <Chip variant={p.status === "done" ? "brand" : p.status === "next" ? "default" : "muted"}>
                    {p.status === "done" ? "Complete" : p.status === "next" ? "Up Next" : "Future"}
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
              <p>Provider profiles, service offerings, and rates are seeded in the database and fetched server-side on Explore and Provider Profile pages. This data is real and will carry forward.</p>
            </div>
            <div className="status-data-card">
              <h3 className="status-data-card-title">Mock Data <Chip variant="muted">client-side</Chip></h3>
              <p>Meets, connections, conversations, bookings, notifications, and the logged-in user are loaded from static mock files. State updates in the session but resets on refresh.</p>
            </div>
          </div>

          <div className="status-data-note">
            <strong>Why it works this way:</strong> Auth isn&apos;t wired up yet, so there&apos;s no logged-in user to write data for. The mock layer is designed to swap in Supabase calls later without rebuilding any UI.
          </div>
        </section>

        {/* ── Considerations ───────────────────────────────────── */}
        <section className="status-section">
          <h2 className="status-section-title">Open Considerations</h2>
          <p className="status-section-intro">Decisions worth discussing before the next build phase.</p>

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
          <p>Last updated March 30, 2026</p>
        </footer>
      </div>
    </main>
    </div>
    <div className="page-spacer" aria-hidden="true" />
    </>
  );
}
