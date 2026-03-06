import Link from "next/link";
import {
  House,
  PawPrint,
  PersonSimpleWalk,
  Star,
} from "@phosphor-icons/react/dist/ssr";
import { providers } from "@/lib/mockData";

// ── Static featured provider picks ───────────────────────────────────────────

const FEATURED_IDS = ["olga-m", "nikola-r", "jana-k"];
const featured = providers.filter((p) => FEATURED_IDS.includes(p.id));

// ── Small sub-components ──────────────────────────────────────────────────────

function ServiceCard({
  icon,
  title,
  description,
  from,
  unit,
  service,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  from: string;
  unit: string;
  service: string;
}) {
  return (
    <div className="landing-service-card">
      <div className="landing-service-icon">{icon}</div>
      <h3 className="landing-service-title">{title}</h3>
      <p className="landing-service-desc">{description}</p>
      <div className="landing-service-footer">
        <span className="landing-service-price">
          From {from}
          <span className="landing-service-unit"> / {unit}</span>
        </span>
        <Link
          href={`/explore/results?service=${service}`}
          className="landing-service-link"
        >
          View sitters →
        </Link>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="landing-step">
      <span className="landing-step-n">{n}</span>
      <div className="landing-step-body">
        <strong className="landing-step-title">{title}</strong>
        <p className="landing-step-text">{body}</p>
      </div>
    </div>
  );
}

function FeaturedCard({
  provider,
}: {
  provider: (typeof providers)[number];
}) {
  const topService = provider.services[0];
  const serviceLabel =
    topService === "walk_checkin"
      ? "Walks & Check-ins"
      : topService === "inhome_sitting"
        ? "In-home Sitting"
        : "Boarding";

  return (
    <Link
      href={`/explore/profile/${provider.id}`}
      className="landing-featured-card"
    >
      <img
        src={provider.avatarUrl}
        alt={provider.name}
        className="landing-featured-avatar"
      />
      <div className="landing-featured-info">
        <span className="landing-featured-name">{provider.name}</span>
        <span className="landing-featured-location">
          {provider.neighborhood}, {provider.district}
        </span>
        <span className="landing-featured-meta">
          <Star size={13} weight="fill" className="landing-star-icon" />
          {provider.rating.toFixed(1)}
          <span className="landing-featured-dot">·</span>
          {serviceLabel}
        </span>
        <span className="landing-featured-price">
          From {provider.priceFrom} Kč
        </span>
      </div>
    </Link>
  );
}

// ── Hero visual — live preview card ──────────────────────────────────────────

function HeroVisual() {
  const preview = providers.slice(0, 4);
  return (
    <div className="landing-hero-visual" aria-hidden="true">
      <div className="landing-hero-card">
        <p className="landing-hero-card-label">Available near you</p>
        <div className="landing-hero-provider-list">
          {preview.map((p) => (
            <div key={p.id} className="landing-hero-provider-row">
              <img
                src={p.avatarUrl}
                alt=""
                className="landing-hero-provider-avatar"
              />
              <div className="landing-hero-provider-info">
                <span className="landing-hero-provider-name">{p.name}</span>
                <span className="landing-hero-provider-loc">
                  {p.neighborhood}
                </span>
              </div>
              <span className="landing-hero-provider-rating">
                <Star size={11} weight="fill" className="landing-star-icon" />
                {p.rating.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
        <div className="landing-hero-card-footer">
          <span className="landing-hero-card-count">
            +{providers.length - 4} more carers in Prague
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="landing-page">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-content">
            <h1 className="landing-hero-heading">
              Trusted dog care from people nearby.
            </h1>
            <p className="landing-hero-sub">
              Find trusted dog sitters near you. Message first. Book when you're ready.
            </p>
            <div className="landing-hero-ctas">
              <Link href="/explore/results" className="landing-btn-primary">
                Find a sitter
              </Link>
              <Link href="/signup/start" className="landing-btn-outline">
                Become a sitter
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* ── Trust badges (row on desktop, column on mobile) ───────────── */}
      <section className="landing-trust-badges" aria-label="Trust signals">
        <div className="landing-inner">
          <div className="landing-trust-badges-row">
            <span className="landing-trust-badge">ID verified sitters</span>
            <span className="landing-trust-badge">Real reviews from dog owners</span>
            <span className="landing-trust-badge">Local meet &amp; greets encouraged</span>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <div className="landing-trust-strip">
        <div className="landing-inner landing-trust-strip-inner">
          <div className="landing-trust-item">
            <span className="landing-trust-value">7</span>
            <span className="landing-trust-label">sitters in Prague</span>
          </div>
          <div className="landing-trust-sep" aria-hidden="true" />
          <div className="landing-trust-item">
            <span className="landing-trust-value">Free</span>
            <span className="landing-trust-label">to browse</span>
          </div>
          <div className="landing-trust-sep" aria-hidden="true" />
          <div className="landing-trust-item">
            <span className="landing-trust-value">No</span>
            <span className="landing-trust-label">booking fees</span>
          </div>
          <div className="landing-trust-sep" aria-hidden="true" />
          <div className="landing-trust-item">
            <span className="landing-trust-value">Local</span>
            <span className="landing-trust-label">dog lovers</span>
          </div>
        </div>
      </div>

      {/* ── Services ─────────────────────────────────────────────────── */}
      <section className="landing-section">
        <div className="landing-inner">
          <div className="landing-section-header">
            <h2 className="landing-section-heading">How we can help</h2>
            <p className="landing-section-sub">
              Three ways to get help with your dog.
            </p>
          </div>
          <div className="landing-services-grid">
            <ServiceCard
              icon={<PersonSimpleWalk size={28} weight="light" />}
              title="Walks & Check-ins"
              description="A daily walk or drop-in visit. Your dog gets exercise and company; you get peace of mind and photo updates."
              from="330 Kč"
              unit="visit"
              service="walk_checkin"
            />
            <ServiceCard
              icon={<House size={28} weight="light" />}
              title="In-home Sitting"
              description="Your carer moves into your home. Minimal disruption to your dog's routine — same sofa, same schedule."
              from="850 Kč"
              unit="night"
              service="inhome_sitting"
            />
            <ServiceCard
              icon={<PawPrint size={28} weight="light" />}
              title="Boarding"
              description="Your dog stays with a carer in their home. A calm, warm environment while you're away."
              from="760 Kč"
              unit="night"
              service="boarding"
            />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section className="landing-section landing-section--alt">
        <div className="landing-inner">
          <div className="landing-section-header">
            <h2 className="landing-section-heading">How it works</h2>
          </div>
          <div className="landing-how-grid">
            <div className="landing-how-col">
              <h3 className="landing-how-col-heading">For Dog Owners</h3>
              <div className="landing-steps">
                <Step
                  n="01"
                  title="Browse sitters"
                  body="Search by service, neighbourhood, and price. Every profile shows real rates, experience, and reviews."
                />
                <Step
                  n="02"
                  title="Message first"
                  body="Send a message, ask questions, and get to know them before booking."
                />
                <Step
                  n="03"
                  title="Arrange directly"
                  body="Agree on dates, details, and payment directly with your sitter."
                />
              </div>
              <Link href="/explore/results" className="landing-how-cta">
                Find a sitter →
              </Link>
            </div>

            <div className="landing-how-divider" aria-hidden="true" />

            <div className="landing-how-col">
              <h3 className="landing-how-col-heading">For Dog Sitters</h3>
              <div className="landing-steps">
                <Step
                  n="01"
                  title="Create your profile"
                  body="Tell owners about your home, your experience, and the dogs you love to care for."
                />
                <Step
                  n="02"
                  title="Set your prices"
                  body="You decide what to charge. No platform fees take a cut."
                />
                <Step
                  n="03"
                  title="Choose who you help"
                  body="Owners message you first. Accept the dogs that are the right fit."
                />
              </div>
              <Link href="/signup/start" className="landing-how-cta">
                Start earning →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured carers ──────────────────────────────────────────── */}
      <section className="landing-section">
        <div className="landing-inner">
          <div className="landing-section-header landing-section-header--row">
            <div>
              <h2 className="landing-section-heading">Meet local sitters</h2>
              <p className="landing-section-sub">
                A few of the people looking after Prague's dogs.
              </p>
            </div>
            <Link href="/explore/results" className="landing-browse-all">
              Browse all sitters →
            </Link>
          </div>
          <div className="landing-featured-grid">
            {featured.map((p) => (
              <FeaturedCard key={p.id} provider={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Doggo ────────────────────────────────────────────────── */}
      <section className="landing-section landing-section--alt">
        <div className="landing-inner">
          <p className="landing-why-tagline">Dog care should feel simple and local.</p>
          <ul className="landing-why-list">
            <li className="landing-why-li">No booking fees</li>
            <li className="landing-why-li">Talk directly with sitters</li>
            <li className="landing-why-li">Built for neighbourhood dog owners</li>
          </ul>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section className="landing-cta-close">
        <div className="landing-cta-close-inner">
          <h2 className="landing-cta-close-heading">
            Ready to find care for your dog?
          </h2>
          <p className="landing-cta-close-sub">
            Browsing is free. No account needed to look around.
          </p>
          <div className="landing-cta-close-btns">
            <Link href="/explore/results" className="landing-btn-white">
              Find a sitter
            </Link>
            <Link href="/signup/start" className="landing-btn-outline-white">
              Become a sitter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
