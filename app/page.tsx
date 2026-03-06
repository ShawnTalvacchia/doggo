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
          Browse →
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
            <span className="landing-hero-eyebrow">Prague · Dog Care</span>
            <h1 className="landing-hero-heading">
              Trusted dog care,
              <br />
              from your
              <br />
              <span className="landing-hero-accent">neighbours.</span>
            </h1>
            <p className="landing-hero-sub">
              Browse walkers, sitters, and boarders who live nearby. Message
              first — book when you're ready.
            </p>
            <div className="landing-hero-ctas">
              <Link href="/explore/results" className="landing-btn-primary">
                Find care nearby
              </Link>
              <Link href="/signup/start" className="landing-btn-outline">
                Earn on the side
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────── */}
      <div className="landing-trust-strip">
        <div className="landing-trust-item">
          <span className="landing-trust-value">{providers.length}</span>
          <span className="landing-trust-label">Helpers in Prague</span>
        </div>
        <div className="landing-trust-sep" aria-hidden="true" />
        <div className="landing-trust-item">
          <span className="landing-trust-value">Free</span>
          <span className="landing-trust-label">to message &amp; browse</span>
        </div>
        <div className="landing-trust-sep" aria-hidden="true" />
        <div className="landing-trust-item">
          <span className="landing-trust-value">No</span>
          <span className="landing-trust-label">booking fees</span>
        </div>
        <div className="landing-trust-sep" aria-hidden="true" />
        <div className="landing-trust-item">
          <span className="landing-trust-value">Local</span>
          <span className="landing-trust-label">&amp; neighbour-vetted</span>
        </div>
      </div>

      {/* ── Services ─────────────────────────────────────────────────── */}
      <section className="landing-section">
        <div className="landing-inner">
          <div className="landing-section-header">
            <h2 className="landing-section-heading">How we can help</h2>
            <p className="landing-section-sub">
              Three services, all arranged directly with your carer.
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
              <h3 className="landing-how-col-heading">For dog owners</h3>
              <div className="landing-steps">
                <Step
                  n="01"
                  title="Browse carers"
                  body="Search by service, neighbourhood, and price. Every profile shows real rates, experience, and reviews."
                />
                <Step
                  n="02"
                  title="Message directly"
                  body="No middleman. Send a message, ask your questions, and get a feel for the person before committing."
                />
                <Step
                  n="03"
                  title="Arrange on your terms"
                  body="Agree dates, details, and payment directly with your carer. Simple."
                />
              </div>
              <Link href="/explore/results" className="landing-how-cta">
                Find care →
              </Link>
            </div>

            <div className="landing-how-divider" aria-hidden="true" />

            <div className="landing-how-col">
              <h3 className="landing-how-col-heading">For dog lovers</h3>
              <div className="landing-steps">
                <Step
                  n="01"
                  title="Create your profile"
                  body="Tell owners about your home, your experience, and the dogs you love to care for. Takes about 5 minutes."
                />
                <Step
                  n="02"
                  title="Set your own prices"
                  body="You decide what you charge. No platform fee eats into your earnings."
                />
                <Step
                  n="03"
                  title="Choose who you take on"
                  body="Owners message you first. You review their dog's profile and only accept the ones that are a great fit."
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
              <h2 className="landing-section-heading">Meet some carers</h2>
              <p className="landing-section-sub">
                A few of the people looking after Prague's dogs.
              </p>
            </div>
            <Link href="/explore/results" className="landing-browse-all">
              Browse all →
            </Link>
          </div>
          <div className="landing-featured-grid">
            {featured.map((p) => (
              <FeaturedCard key={p.id} provider={p} />
            ))}
          </div>
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
              Start searching
            </Link>
            <Link href="/signup/start" className="landing-btn-outline-white">
              Earn on the side
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
