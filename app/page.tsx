import {
  PawPrint,
  MapPin,
  ShieldCheck,
  ChatCircleDots,
  CalendarDots,
  Sneaker,
  UsersThree,
  Megaphone,
} from "@phosphor-icons/react/dist/ssr";
import { HowItWorksTabs } from "@/components/landing/HowItWorksTabs";
import { ButtonAction } from "@/components/ui/ButtonAction";

// ── Photo URLs ───────────────────────────────────────────────────────────────

const PHOTOS = {
  hero: "/images/hero-park-community.jpg",
  care: "/images/generated/care-dog-walking.jpeg",
};

// ── Sub-components ───────────────────────────────────────────────────────────

function MeetTypeCard({
  imgSrc,
  title,
  description,
}: {
  imgSrc: string;
  title: string;
  description: string;
}) {
  return (
    <div className="landing-meet-card">
      <div className="landing-meet-card-illustration">
        <img src={imgSrc} alt={title} className="landing-meet-card-img" loading="lazy" />
      </div>
      <div className="landing-meet-card-body">
        <h3 className="landing-service-title">{title}</h3>
        <p className="landing-service-desc">{description}</p>
      </div>
    </div>
  );
}

function ArchetypeCard({
  icon,
  label,
  description,
  accentColor,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  accentColor: string;
}) {
  return (
    <div className="landing-archetype-card" style={{ "--accent": accentColor } as React.CSSProperties}>
      <div className="landing-archetype-icon">{icon}</div>
      <div className="landing-archetype-body">
        <h3 className="landing-archetype-label">{label}</h3>
        <p className="landing-archetype-desc">{description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  detail,
  avatarUrl,
}: {
  quote: string;
  name: string;
  detail: string;
  avatarUrl: string;
}) {
  return (
    <div className="landing-testimonial-card">
      <p className="landing-testimonial-quote">&ldquo;{quote}&rdquo;</p>
      <div className="landing-testimonial-author">
        <img src={avatarUrl} alt={name} className="landing-testimonial-avatar" />
        <div>
          <span className="landing-testimonial-name">{name}</span>
          <span className="landing-testimonial-detail">{detail}</span>
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
      <section className="landing-hero landing-hero--photo">
        <div className="landing-hero-photo-bg">
          <img
            src={PHOTOS.hero}
            alt="Two dogs running together in a park"
            className="landing-hero-photo-img"
          />
          <div className="landing-hero-photo-overlay" />
        </div>
        <div className="landing-hero-inner">
          <div className="landing-hero-content">
            <span className="landing-hero-eyebrow">Available in Prague</span>
            <h1 className="landing-hero-heading">
              Your dog&apos;s <span className="landing-hero-accent">neighbourhood crew.</span>
            </h1>
            <p className="landing-hero-sub">
              Meet dog owners locally. Build real trust through walks, hangouts, and play. When you need care, you already know who to ask.
            </p>
            <div className="landing-hero-ctas">
              <ButtonAction variant="primary" cta size="lg" href="/activity">
                Find a meet near you
              </ButtonAction>
              <ButtonAction variant="secondary" cta size="lg" href="#how-it-works">
                See how it works
              </ButtonAction>
            </div>
          </div>
        </div>
      </section>

      {/* ── Emotional hook + trust badges ────────────────────────────── */}
      <section className="landing-hook">
        <div className="landing-inner">
          <div className="landing-hook-text">
            <h2 className="font-heading text-2xl md:text-3xl font-semibold leading-tight text-white m-0">Does your dog have a community?</h2>
            <p className="landing-hook-subline">
              Dogs are social — they want to get out, play with dogs they know, and see familiar faces. Doggo connects you to local dog owners, regular meets, and trusted care.
            </p>
          </div>
          <div className="landing-trust-badges-row">
            <span className="landing-trust-badge">
              <PawPrint size={16} weight="bold" aria-hidden="true" />
              Regular meets in parks near you
            </span>
            <span className="landing-trust-badge">
              <ShieldCheck size={16} weight="bold" aria-hidden="true" />
              Trust built through real encounters
            </span>
            <span className="landing-trust-badge">
              <MapPin size={16} weight="bold" aria-hidden="true" />
              Care from people you already know
            </span>
          </div>
        </div>
      </section>

      {/* ── Meet types (with photos) ────────────────────────────────── */}
      <section className="landing-section bg-surface-top">
        <div className="landing-inner">
          <div className="landing-section-header landing-section-header--centered">
            <h2 className="landing-section-heading">Meets for every dog</h2>
            <p className="landing-section-sub">
              Organised by size, energy, and style — so every dog gets the right kind of social.
            </p>
          </div>
          <div className="landing-meet-cards-grid">
            <MeetTypeCard
              imgSrc="/images/Group walks.svg"
              title="Group walks"
              description="See the same people every week. Familiar faces, familiar dogs. Matched by size and pace."
            />
            <MeetTypeCard
              imgSrc="/images/Park hangouts.svg"
              title="Park hangouts"
              description="Drop in, no pressure. Stay five minutes or an hour. Dogs play, owners chat."
            />
            <MeetTypeCard
              imgSrc="/images/Playdates & training.svg"
              title="Playdates & training"
              description="Smaller groups for dogs that need the right pace — puppy socialisation, recall practice, or calm play."
            />
          </div>
        </div>
      </section>

      {/* ── How it works (interactive tab switcher) ───────────────────── */}
      <section id="how-it-works" className="landing-section landing-section--alt">
        <div className="landing-inner">
          <div className="landing-section-header landing-section-header--centered">
            <h2 className="landing-section-heading">How it works</h2>
          </div>
          <HowItWorksTabs />
        </div>
      </section>

      {/* ── Everyone uses Doggo differently ─────────────────────────── */}
      <section className="landing-section landing-section--alt">
        <div className="landing-inner">
          <div className="landing-archetypes-split">
            <div className="landing-archetypes-text">
              <h2 className="landing-section-heading">Everyone uses Doggo differently</h2>
              <p className="landing-section-sub">
                There&apos;s no right way to be part of the community. Show up for walks, build a crew, or turn it into something more — it&apos;s up to you.
              </p>
              <ButtonAction variant="primary" cta size="lg" href="/signup/start">
                Get started
              </ButtonAction>
            </div>
            <div className="landing-archetypes-cards">
              <ArchetypeCard
                icon={<Sneaker size={28} weight="light" />}
                label="The Regular"
                description="Joins walks in their free time. Makes friends with other regulars, but keeps their account private. Fresh air, happy dog, good routine."
                accentColor="var(--status-info-main)"
              />
              <ArchetypeCard
                icon={<UsersThree size={28} weight="light" />}
                label="The Connector"
                description="Built a small private group from connections through park hangouts. They swap dog-sitting, share walks, and look out for each other."
                accentColor="var(--status-warning-main)"
              />
              <ArchetypeCard
                icon={<Megaphone size={28} weight="light" />}
                label="The Organiser"
                description="Runs weekly walks, often picking up other owner&apos;s dogs on the way. An easy choice when a community member needs a dog sitter."
                accentColor="var(--brand-light)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Doggo — care from your community ─────────────────────── */}
      <section className="landing-section landing-section--alt">
        <div className="landing-inner">
          <div className="landing-care-split">
            <div className="landing-care-text">
              <h2 className="landing-section-heading">Care from people you already know.</h2>
              <div className="landing-care-points">
                <div className="landing-care-point">
                  <CalendarDots size={24} weight="light" className="landing-care-point-icon" />
                  <div>
                    <strong>Not profiles. Real people.</strong>
                    <p>Need a sitter? Check your connections first — people you&apos;ve walked with, whose dogs know yours.</p>
                  </div>
                </div>
                <div className="landing-care-point">
                  <ChatCircleDots size={24} weight="light" className="landing-care-point-icon" />
                  <div>
                    <strong>No cold outreach</strong>
                    <p>You&apos;ve already met at the park. The first message isn&apos;t awkward — it&apos;s natural.</p>
                  </div>
                </div>
                <div className="landing-care-point">
                  <MapPin size={24} weight="light" className="landing-care-point-icon" />
                  <div>
                    <strong>Your neighbourhood, not a marketplace</strong>
                    <p>Your park, your streets, your neighbours. Care that fits in your daily walk.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="landing-care-photo-col">
              <img
                src={PHOTOS.care}
                alt="Person walking a dog in a sunny field"
                className="landing-care-photo"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof ──────────────────────────────────────────────── */}
      <section className="landing-section landing-section--alt">
        <div className="landing-inner">
          <div className="landing-section-header landing-section-header--centered">
            <h2 className="landing-section-heading">What dog owners are saying</h2>
          </div>
          <div className="landing-testimonials-grid">
            <TestimonialCard
              quote="I moved to Prague and didn't know anyone with a dog. Two weeks of Saturday walks later, I had three people I'd trust with Luna."
              name="Eva"
              detail="Luna's owner · Prague 7"
              avatarUrl="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80"
            />
            <TestimonialCard
              quote="I met Tomáš at a park walk. Two weeks later he watched Rex while I travelled. It just made sense — we'd already spent hours together."
              name="Jana"
              detail="Rex's owner · Prague 2"
              avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
            />
            <TestimonialCard
              quote="I started walking a neighbour's dog on Saturdays. Now I help three families. It never felt like a job — it just happened."
              name="Tomáš"
              detail="Bruno's owner · Prague 3"
              avatarUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
            />
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────── */}
      <section className="landing-cta-close">
        <div className="landing-cta-close-inner">
          <h2 className="landing-cta-close-heading">Your dog deserves a crew.</h2>
          <p className="landing-cta-close-sub">
            Meet locally. Build trust. Care comes naturally.
          </p>
          <div className="landing-cta-close-btns">
            <ButtonAction variant="white" cta size="lg" href="/activity">
              Find a meet near you
            </ButtonAction>
            <ButtonAction variant="outline-white" cta size="lg" href="/signup/start">
              Get started
            </ButtonAction>
          </div>
        </div>
      </section>
    </main>
  );
}
