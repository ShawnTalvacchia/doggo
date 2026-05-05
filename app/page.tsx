import Link from "next/link";
import {
  PawPrint,
  MapPin,
  ShieldCheck,
  ChatCircleDots,
  CalendarDots,
  Sneaker,
  UsersThree,
  Megaphone,
  ArrowRight,
  Tree,
  HouseLine,
  Briefcase,
} from "@phosphor-icons/react/dist/ssr";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { personas } from "@/lib/personas";

// ── Photo URLs ───────────────────────────────────────────────────────────────

const PHOTOS = {
  hero: "/images/hero-park-community.jpg",
  care: "/images/generated/care-dog-walking.jpeg",
};

// ── Tour entry URL (Tereza-only guided walk) ─────────────────────────────────
const TOUR_ENTRY = "/home?as=tereza&tour=tereza&step=1";

// ── Sub-components ───────────────────────────────────────────────────────────

function DoorCard({
  icon,
  label,
  title,
  body,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <Link href="/demo" className="landing-door-card">
      <div className="landing-door-icon">{icon}</div>
      <span className="landing-door-label">{label}</span>
      <h3 className="landing-door-title">{title}</h3>
      <p className="landing-door-body">{body}</p>
      <span className="landing-door-cta">
        See it in the demo
        <ArrowRight size={14} weight="bold" aria-hidden="true" />
      </span>
    </Link>
  );
}

function PersonaPreviewCard({
  avatarUrl,
  firstName,
  archetype,
  story,
  href,
}: {
  avatarUrl: string;
  firstName: string;
  archetype: string;
  story: string;
  href: string;
}) {
  // Flat-grid structure (avatar / titles / story / cta) so the mobile
  // breakpoint can re-grid the avatar inline with the titles while desktop
  // keeps the avatar in a left column spanning all three content rows.
  return (
    <Link href={href} className="landing-persona-card">
      <img src={avatarUrl} alt="" className="landing-persona-avatar" loading="lazy" />
      <div className="landing-persona-titles">
        <span className="landing-persona-archetype">{archetype}</span>
        <h3 className="landing-persona-name">{firstName}</h3>
      </div>
      <p className="landing-persona-story">{story}</p>
      <span className="landing-persona-cta">
        Enter as {firstName}
        <ArrowRight size={14} weight="bold" aria-hidden="true" />
      </span>
    </Link>
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

// ── Persona-row content (pulled from `lib/personas.ts` so identity stays in sync) ─

const PERSONA_STORIES: Record<string, string> = {
  tereza:
    "Vinohrady regular. Anchors a morning walking crew, sits for neighbours on weekends.",
  daniel:
    "Anxious rescue owner. Locked profile, slow to trust — found his footing in one support group.",
  klara:
    "Trainer running a Care group of regulars. Provider-tier, embedded in the community.",
  tomas:
    "Karlín commuter. Leans on a small circle of trusted carers when work runs late.",
};

function getPersonaCard(personaId: string) {
  const p = personas.find((p) => p.user.id === personaId);
  if (!p) return null;
  return (
    <PersonaPreviewCard
      key={p.user.id}
      avatarUrl={p.user.avatarUrl}
      firstName={p.user.firstName}
      archetype={p.archetype}
      story={PERSONA_STORIES[p.user.id] ?? p.tagline}
      href={`/home?as=${p.user.id}`}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  // Pull testimonial avatars + neighbourhoods from the persona registry so
  // they stay in sync with mock-world content (one source of truth).
  const tereza = personas.find((p) => p.user.id === "tereza")!.user;
  const klara = personas.find((p) => p.user.id === "klara")!.user;
  const tomas = personas.find((p) => p.user.id === "tomas")!.user;

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
            <span className="landing-hero-eyebrow">Doggo prototype · Prague</span>
            <h1 className="landing-hero-heading">
              Your dog&apos;s <span className="landing-hero-accent">neighbourhood crew.</span>
            </h1>
            <p className="landing-hero-sub">
              Meet dog owners locally. Build real trust through walks, hangouts, and play. When you need care, you already know who to ask.
            </p>
            <div className="landing-hero-ctas">
              <ButtonAction variant="primary" cta size="lg" href="/demo">
                Choose a persona
              </ButtonAction>
              <ButtonAction variant="secondary" cta size="lg" href={TOUR_ENTRY}>
                Walk me through Tereza&apos;s day
              </ButtonAction>
            </div>
          </div>
        </div>
      </section>

      {/* ── Emotional hook + trust badges ────────────────────────────── */}
      <section className="landing-hook">
        <div className="landing-inner">
          <div className="landing-hook-text">
            <h2 className="landing-section-heading" style={{ color: "var(--text-white)" }}>Does your dog have a community?</h2>
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

      {/* ── Three Doors ─────────────────────────────────────────────── */}
      <section className="landing-section bg-surface-top">
        <div className="landing-inner">
          <div className="landing-section-header landing-section-header--centered">
            <h2 className="landing-section-heading">Three ways in</h2>
            <p className="landing-section-sub">
              Every user enters through one of three doors. All three lead to the same place: a network of people who know each other and each other&apos;s dogs.
            </p>
          </div>
          <div className="landing-doors-grid">
            <DoorCard
              icon={<Tree size={28} weight="light" />}
              label="Find Your Park"
              title="Open park groups"
              body="Auto-generated for every major Prague dog park. Drop in, no admin, anyone calls a walk."
            />
            <DoorCard
              icon={<HouseLine size={28} weight="light" />}
              label="Find Your People"
              title="Neighbourhood + interest"
              body="Small, trusted circles. Where mutual aid lives — neighbours swap walks, share carers, look out for each other."
            />
            <DoorCard
              icon={<Briefcase size={28} weight="light" />}
              label="Find Your Help"
              title="Provider-run care groups"
              body="Your trainer&apos;s sessions, your walker&apos;s schedule — community-wrapped service. Book inside the group you already know."
            />
          </div>
        </div>
      </section>

      {/* ── Persona preview row ─────────────────────────────────────── */}
      <section className="landing-section landing-section--alt">
        <div className="landing-inner">
          <div className="landing-section-header landing-section-header--centered">
            <h2 className="landing-section-heading">Step into the prototype</h2>
            <p className="landing-section-sub">
              Four people. Four ways the community-to-care funnel actually plays out. Pick whose perspective to drop into.
            </p>
          </div>
          <div className="landing-persona-grid">
            {getPersonaCard("tereza")}
            {getPersonaCard("daniel")}
            {getPersonaCard("klara")}
            {getPersonaCard("tomas")}
          </div>
        </div>
      </section>

      {/* ── Everyone uses Doggo differently ─────────────────────────── */}
      <section className="landing-section landing-section--alt">
        <div className="landing-inner">
          <div className="landing-archetypes-split">
            <div className="landing-archetypes-text">
              <h2 className="landing-section-heading">Everyone uses Doggo differently</h2>
              <p className="landing-section-sub">
                There&apos;s no right way to be part of the community. Show up for walks, build a crew, or turn it into something more — it&apos;s a dial, not a switch.
              </p>
              <ButtonAction variant="primary" cta size="lg" href="/demo">
                See the spectrum
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
              <div className="landing-care-cta-row">
                <ButtonAction variant="primary" cta size="lg" href="/demo">
                  Browse the prototype
                </ButtonAction>
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

      {/* ── Social proof — quotes attributed to real personas ────────── */}
      <section className="landing-section landing-section--alt">
        <div className="landing-inner">
          <div className="landing-section-header landing-section-header--centered">
            <h2 className="landing-section-heading">Voices from the prototype</h2>
            <p className="landing-section-sub">
              Three personas, three ways the community-to-care funnel plays out.
            </p>
          </div>
          <div className="landing-testimonials-grid">
            <TestimonialCard
              quote="I&rsquo;ve been doing the morning loop in Riegrovy for years. Now Franta has six dogs he expects to see every day, and I have six people I&rsquo;d trust with him."
              name={tereza.firstName}
              detail={`${tereza.firstName}'s journey · ${tereza.neighbourhood}`}
              avatarUrl={tereza.avatarUrl}
            />
            <TestimonialCard
              quote="My group is mostly clients now. They started by joining a Saturday calm-dog session — by the third week, they were booking weekday training. The community is the funnel."
              name={klara.firstName}
              detail={`${klara.firstName}'s journey · trainer`}
              avatarUrl={klara.avatarUrl}
            />
            <TestimonialCard
              quote="Petra watched Hugo when I was stuck in a 9pm meeting. She wasn&rsquo;t a stranger — we&rsquo;d been at the same Karlín group for a month. That&rsquo;s the difference."
              name={tomas.firstName}
              detail={`${tomas.firstName}'s journey · ${tomas.neighbourhood}`}
              avatarUrl={tomas.avatarUrl}
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
            <ButtonAction variant="white" cta size="lg" href="/demo">
              Choose a persona
            </ButtonAction>
            <ButtonAction variant="outline-white" cta size="lg" href={TOUR_ENTRY}>
              Walk me through Tereza&apos;s day
            </ButtonAction>
          </div>
        </div>
      </section>
    </main>
  );
}
