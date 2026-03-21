import Link from "next/link";
import { PAGE_MENU_GROUPS } from "@/lib/navigation/pageMenuGroups";

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
      { name: "Landing", route: "/", desc: "Marketing homepage — hero, service cards, how-it-works, trust props" },
      { name: "Sign In", route: "/signin", desc: "Email + password form (demo navigation only)" },
    ],
  },
  {
    area: "Signup Flow",
    label: "6 steps, progress bar, role-adaptive",
    pages: [
      { name: "Start", route: "/signup/start", desc: "SSO options + email form + T&C checkboxes" },
      { name: "Role", route: "/signup/role", desc: "Pick roles: Pet Owner, Walker, Host" },
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
      { name: "Browse Meets", route: "/meets", desc: "Meet cards with filter pills (Walks, Park Hangouts, Playdates, Training), Nearby/Upcoming/Recent sections" },
      { name: "Create Meet", route: "/meets/create", desc: "Form: type selection, title, location, date/time, duration, max attendees, recurring, leash & size rules" },
      { name: "Meet Detail", route: "/meets/meet-1", desc: "Type badge, details grid, join/leave, organiser, attendee list with connection badges, group chat" },
      { name: "Post-Meet Connect", route: "/meets/meet-6/connect", desc: "Dog-centred framing, attendee cards with Familiar/Connect actions, trust explainer" },
    ],
  },
  {
    area: "Community — Schedule & Home",
    pages: [
      { name: "Home", route: "/home", desc: "Nearby meets, suggested connections, community highlights" },
      { name: "Schedule", route: "/schedule", desc: "This Week / Coming Up / Past — user's joined meets" },
    ],
  },
  {
    area: "Care & Explore",
    label: "accessed via Find Care CTA",
    pages: [
      { name: "Results", route: "/explore/results", desc: "Provider cards with filters (service, price, availability), map view" },
      { name: "Provider Profile", route: "/explore/profile/olga-m", desc: "Info / Services / Reviews tabs, photo gallery, contact modal" },
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
    pages: [
      { name: "My Bookings", route: "/bookings", desc: "Owner view (Active/Upcoming/Past) + Carer view (earnings, clients)" },
      { name: "Booking Detail", route: "/bookings/booking-1", desc: "Session management, price breakdown, review submission" },
    ],
  },
  {
    area: "Profile & System",
    pages: [
      { name: "Profile", route: "/profile", desc: "About tab (bio, pet cards, connections by state) + Offering tab (services, pricing, availability)" },
      { name: "Styleguide", route: "/styleguide", desc: "Design system reference — Colors, Typography, Tokens, Components" },
    ],
  },
];

const phases = [
  { num: 1, name: "Foundation", status: "done" as const, summary: "Design tokens, base styles, landing page, signup flow, explore, provider profiles" },
  { num: 2, name: "App Shell", status: "done" as const, summary: "Nav restructure, app layout, page shells for Home/Schedule/Inbox/Bookings/Profile" },
  { num: 3, name: "Community Core", status: "done" as const, summary: "Meets (browse, create, detail, group chat), connections (trust ladder), home feed, schedule" },
  { num: 4, name: "Polish & UX", status: "done" as const, summary: "Navbar simplified, modal pattern formalized, shadow softened, forms flattened, prototype overview consolidated" },
  { num: 5, name: "Care & Profile Enhancement", status: "next" as const, summary: "Booking detail, profile edit mode, provider trust signals, explore map, messaging, enhanced pet profiles" },
];

const considerations = [
  {
    title: "Authentication strategy",
    body: "Supabase Auth is the assumed path. Decisions pending: email-only vs. SSO (Google, Apple), magic link vs. password, whether to gate features behind login.",
  },
  {
    title: "Chat infrastructure",
    body: "Group threads exist as mock UI on meet detail pages. For real-time: build simple with Supabase Realtime, or integrate Stream/SendBird? Depends on scale expectations.",
  },
  {
    title: "Recurring meet mechanics",
    body: "Users can mark a meet as recurring, but join mechanics are undefined: \"join all Tuesdays\" vs. single occurrence RSVP. Impacts calendar and notification design.",
  },
  {
    title: "Meet discovery",
    body: "Currently list-based with filter pills. Neighbourhood/radius filtering vs. map-based discovery is an open question. Map infrastructure exists on Explore but not yet on Meets.",
  },
];

/* ── page ────────────────────────────────────────────────────────── */

export default function PrototypeOverviewPage() {
  const totalPages = siteMap.reduce((n, g) => n + g.pages.length, 0);

  return (
    <main className="page-shell status-page">
      <div className="page-width status-wrap">

        {/* ── Quick Nav ────────────────────────────────────────── */}
        <section className="status-section">
          <h2 className="status-section-title">Quick Nav</h2>
          <div className="profile-menu-groups">
            {PAGE_MENU_GROUPS.map((group) => (
              <div key={group.title} className="profile-menu-group input-block">
                <div className="label profile-menu-group-title">
                  <span className="label-primary-group">
                    <span>{group.title}</span>
                  </span>
                </div>
                <div className="profile-menu-links">
                  {group.items.map((item) => (
                    <Link key={item.value} href={item.value} className="profile-menu-link">
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
          <p className="status-date">March 16, 2026</p>

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
          <p>Last updated March 16, 2026</p>
        </footer>
      </div>
    </main>
  );
}
