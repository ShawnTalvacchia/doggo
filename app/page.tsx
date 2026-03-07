import Link from "next/link";
import {
  House,
  PawPrint,
  PersonSimpleWalk,
  Star,
  ShieldCheck,
  MapPin,
  CurrencyCircleDollar,
  ChatCircleDots,
} from "@phosphor-icons/react/dist/ssr";
import { providers } from "@/lib/mockData";
import { HowItWorksTabs } from "@/components/landing/HowItWorksTabs";
import { ButtonAction } from "@/components/ui/ButtonAction";

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
        <Link href={`/explore/results?service=${service}`} className="landing-service-link">
          View sitters →
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="landing-feature-card">
      <div className="landing-feature-icon">{icon}</div>
      <strong className="landing-feature-title">{title}</strong>
      <p className="landing-feature-body">{body}</p>
    </div>
  );
}

function FeaturedCard({ provider }: { provider: (typeof providers)[number] }) {
  const topService = provider.services[0];
  const serviceLabel =
    topService === "walk_checkin"
      ? "Walks & Check-ins"
      : topService === "inhome_sitting"
        ? "In-home Sitting"
        : "Boarding";

  return (
    <Link href={`/explore/profile/${provider.id}`} className="landing-featured-card">
      <img src={provider.avatarUrl} alt={provider.name} className="landing-featured-avatar" />
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
        <span className="landing-featured-price">From {provider.priceFrom} Kč</span>
        <span className="landing-featured-available" aria-label="Available now">
          <span className="landing-featured-available-dot" aria-hidden="true" />
          Available
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
              <div className="landing-hero-avatar-wrap">
                <img src={p.avatarUrl} alt="" className="landing-hero-provider-avatar" />
                <span className="landing-hero-status-dot" aria-hidden="true" />
              </div>
              <div className="landing-hero-provider-info">
                <span className="landing-hero-provider-name">{p.name}</span>
                <span className="landing-hero-provider-loc">{p.neighborhood}</span>
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
            <span className="landing-hero-eyebrow">Available in Prague</span>
            <h1 className="landing-hero-heading">
              Trusted dog care from <span className="landing-hero-accent">people nearby.</span>
            </h1>
            <p className="landing-hero-sub">
              Find trusted dog sitters near you. Message first. Book when you&apos;re ready.
            </p>
            <div className="landing-hero-ctas">
              <ButtonAction variant="primary" cta size="lg" href="/explore/results">
                Find a dog carer
              </ButtonAction>
              <ButtonAction variant="outline" cta size="lg" href="/signup/start">
                Become a carer
              </ButtonAction>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* ── Trust badges ─────────────────────────────────────────────── */}
      <section className="landing-trust-badges" aria-label="Trust signals">
        <div className="landing-inner">
          <div className="landing-trust-badges-row">
            <span className="landing-trust-badge">
              <ShieldCheck size={16} weight="bold" aria-hidden="true" />
              ID verified sitters
            </span>
            <span className="landing-trust-badge">
              <Star size={16} weight="bold" aria-hidden="true" />
              Real reviews from dog owners
            </span>
            <span className="landing-trust-badge">
              <MapPin size={16} weight="bold" aria-hidden="true" />
              Local meet &amp; greets encouraged
            </span>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────── */}
      <div className="landing-trust-strip">
        <div className="landing-inner landing-trust-strip-inner">
          <div className="landing-trust-item">
            <span className="landing-trust-value">127</span>
            <span className="landing-trust-label">carers in Prague</span>
          </div>
          <div className="landing-trust-sep" aria-hidden="true" />
          <div className="landing-trust-item">
            <span className="landing-trust-value">Free</span>
            <span className="landing-trust-label">to browse</span>
          </div>
          <div className="landing-trust-sep" aria-hidden="true" />
          <div className="landing-trust-item">
            <span className="landing-trust-value">Transparent</span>
            <span className="landing-trust-label">carer-set prices</span>
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
          <div className="landing-section-header landing-section-header--centered">
            <h2 className="landing-section-heading">How we can help</h2>
            <p className="landing-section-sub">Three ways to get help with your dog.</p>
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

      {/* ── How it works (interactive tab switcher) ───────────────────── */}
      <section className="landing-section landing-section--alt">
        <div className="landing-inner">
          <div className="landing-section-header landing-section-header--centered">
            <h2 className="landing-section-heading">How it works</h2>
          </div>
          <HowItWorksTabs />
        </div>
      </section>

      {/* ── Featured carers ──────────────────────────────────────────── */}
      <section className="landing-section">
        <div className="landing-inner">
          <div className="landing-section-header landing-section-header--row">
            <div>
              <h2 className="landing-section-heading">Meet local sitters</h2>
              <p className="landing-section-sub">
                A few of the people looking after Prague&apos;s dogs.
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

      {/* ── Why Doggo — feature card grid ────────────────────────────── */}
      <section className="landing-section landing-section--alt">
        <div className="landing-inner">
          <div className="landing-section-header">
            <h2 className="landing-section-heading">Dog care should feel simple and local.</h2>
          </div>
          <div className="landing-features-grid">
            <FeatureCard
              icon={<CurrencyCircleDollar size={28} weight="light" />}
              title="Transparent pricing"
              body="Arrange care and payment directly with your carer. Clear, upfront prices from the people who look after your dog."
            />
            <FeatureCard
              icon={<ChatCircleDots size={28} weight="light" />}
              title="Message before you commit"
              body="Ask questions, arrange a meet & greet, and get to know your sitter before anything is confirmed."
            />
            <FeatureCard
              icon={<MapPin size={28} weight="light" />}
              title="Built for your neighbourhood"
              body="Every sitter is local. Real people in your district, not a faceless marketplace."
            />
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section className="landing-cta-close">
        <div className="landing-cta-close-inner">
          <h2 className="landing-cta-close-heading">Ready to find care for your dog?</h2>
          <p className="landing-cta-close-sub">
            Browsing is free. No account needed to look around.
          </p>
          <div className="landing-cta-close-btns">
            <ButtonAction variant="white" cta size="lg" href="/explore/results">
              Find a sitter
            </ButtonAction>
            <ButtonAction variant="outline-white" cta size="lg" href="/signup/start">
              Become a sitter
            </ButtonAction>
          </div>
        </div>
      </section>
    </main>
  );
}
