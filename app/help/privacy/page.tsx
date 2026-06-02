"use client";

/**
 * Privacy explainer — `/help/privacy`.
 *
 * Canonical "how does this work" destination for the privacy + tier model.
 * Wired from the locked-profile lock card and from in-product tooltips
 * (group visibility chip, tier badges). Anchor IDs let other surfaces
 * deep-link to the relevant section.
 *
 * Copy is consequence-first: lead with what others can or can't actually
 * do based on your settings, not with mechanic vocabulary. Each section
 * stays tight — the page is a quick reassurance, not a lecture.
 *
 * Layout: PageColumn with DetailHeader for desktop back-nav; AppNav's
 * mobile detail header is set via `usePageHeader` so mobile gets a back
 * button + title in the top bar.
 *
 * Onboarding & In-Product Communication phase, 2026-05-04.
 */

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LockKey,
  UserCirclePlus,
  Handshake,
  ShareNetwork,
  PawPrint,
} from "@phosphor-icons/react";
import { PageColumn } from "@/components/layout/PageColumn";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { usePageHeader } from "@/contexts/PageHeaderContext";

interface SectionProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ id, icon, title, children }: SectionProps) {
  return (
    <section
      id={id}
      style={{
        scrollMarginTop: "var(--space-xxl)",
        padding: "var(--space-xl)",
        background: "var(--surface-top)",
        borderRadius: "var(--radius-panel)",
        border: "1px solid var(--border-regular)",
      }}
    >
      <div className="flex items-center gap-sm" style={{ marginBottom: "var(--space-md)" }}>
        <span className="text-fg-secondary" aria-hidden>{icon}</span>
        <h2
          className="font-heading text-lg font-medium text-fg-primary m-0"
          style={{ lineHeight: 1.3 }}
        >
          {title}
        </h2>
      </div>
      <div
        className="flex flex-col gap-md text-sm text-fg-secondary"
        style={{ lineHeight: 1.55 }}
      >
        {children}
      </div>
    </section>
  );
}

export default function PrivacyExplainerPage() {
  const router = useRouter();
  const { setDetailHeader, clearDetailHeader } = usePageHeader();

  useEffect(() => {
    // Back-as-hierarchy: /help/privacy has no parent index, so back
    // goes to /home (the global up-a-level for help articles).
    setDetailHeader("How privacy works", () => router.push("/home"));
    return () => clearDetailHeader();
  }, [setDetailHeader, clearDetailHeader, router]);

  return (
    <PageColumn
      hideHeader
      abovePanel={<DetailHeader title="How privacy works" backHref="/home" />}
    >
      <div
        className="page-column-panel-body"
        style={{ padding: "var(--space-lg)" }}
      >
        <div className="flex flex-col gap-lg">
          {/* Header block — large title + subhead + light inline trigger.
              Lets the page have a clear opening voice and a quiet pull
              toward the user's profile (where the real settings live).
              The decisive "Open my profile" button at the bottom is the
              same destination, sized up — bookends the page. */}
          <div
            className="flex flex-col gap-sm"
            style={{
              paddingTop: "var(--space-md)",
              paddingBottom: "var(--space-xs)",
            }}
          >
            <h1
              className="font-heading text-2xl font-medium text-fg-primary m-0"
              style={{ lineHeight: 1.2 }}
            >
              Your profile, your call
            </h1>
            <p
              className="text-md text-fg-secondary m-0"
              style={{ lineHeight: 1.55 }}
            >
              Here&apos;s what your settings actually mean for the people who
              find you.
            </p>
            <Link
              href="/profile"
              className="text-sm font-semibold text-brand-strong hover:text-brand-main"
              style={{
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                marginTop: "var(--space-xs)",
                alignSelf: "flex-start",
              }}
            >
              Manage these on your profile →
            </Link>
          </div>

          {/* Private vs Public */}
          <Section
            id="open-vs-locked"
            icon={<LockKey size={22} weight="light" />}
            title="Private or public"
          >
            <p className="m-0">
              Your profile starts <strong>private</strong>. People you meet see
              the basics — first name, dog, neighbourhood — and not much more.
              They can&apos;t see your posts, see tags of you in other
              people&apos;s posts, or message you.
            </p>
            <p className="m-0">
              Switch to <strong>public</strong> any time, and anyone can see
              your full profile and ask to connect. Public is the natural fit
              if you&apos;re offering care to people you haven&apos;t met yet.
              Private is the natural fit for everyone else.
            </p>
          </Section>

          {/* Familiar */}
          <Section
            id="familiar"
            icon={<UserCirclePlus size={22} weight="light" />}
            title="Familiar"
          >
            <p className="m-0">
              When you meet someone you&apos;d like to give access to, mark
              them <strong>Familiar</strong>. They&apos;ll see your full
              profile next time they look — your posts, your tags, the option
              to message you.
            </p>
            <p className="m-0">
              It&apos;s silent — they&apos;re never told who marked them. And
              it&apos;s one-way: marking them Familiar opens <em>your</em>{" "}
              profile to them. It doesn&apos;t open theirs to you. They&apos;d
              need to mark you back, or set their own profile to public.
            </p>
          </Section>

          {/* Connected */}
          <Section
            id="connected"
            icon={<Handshake size={22} weight="light" />}
            title="Connected"
          >
            <p className="m-0">
              Connected is mutual — both of you asked, both of you accepted.
              Direct messaging opens up. If either of you offers care, the
              booking option appears for the other.
            </p>
            <p className="m-0">
              This is where the people you trust become the people you can
              actually rely on.
            </p>
          </Section>

          {/* Share-link bypass */}
          <Section
            id="share-link"
            icon={<ShareNetwork size={22} weight="light" />}
            title="When you already know each other"
          >
            <p className="m-0">
              Met someone in real life who&apos;s also on Doggo? Share your
              profile link. The link works as a direct introduction — they can
              ask to connect with you without needing to cross paths at a walk
              first.
            </p>
            <p className="m-0">
              Find your link on your{" "}
              <Link
                href="/profile"
                className="text-brand-strong hover:text-brand-main"
                style={{ textDecoration: "underline", textUnderlineOffset: "2px", fontWeight: 600 }}
              >
                profile
              </Link>
              {" "}— the &ldquo;Share Profile&rdquo; button.
            </p>
          </Section>

          {/* Tier */}
          <Section
            id="tier"
            icon={<PawPrint size={22} weight="light" />}
            title="If you offer care"
          >
            <p className="m-0">
              Your <strong>tier</strong> sets who can ask about your services.
              Three positions on a dial:
            </p>
            <ul
              className="m-0 flex flex-col gap-sm"
              style={{ paddingLeft: "var(--space-lg)" }}
            >
              <li>
                <strong>Owner</strong> — the default. No services, full
                community participation.
              </li>
              <li>
                <strong>Helper</strong> — only people you&apos;re Connected
                with can ask. The right setting if you sit for friends and
                neighbours occasionally.
              </li>
              <li>
                <strong>Provider</strong> — anyone can ask. Published rates,
                professional setup.
              </li>
            </ul>
            <p className="m-0">
              Privacy and tier work together: privacy controls who can{" "}
              <em>see</em> your profile, tier controls who can{" "}
              <em>act</em> on your services.
            </p>
          </Section>

          {/* Footer CTA — decisive button. By this point the reader has
              the model in their head; the natural next move is to act on
              their own settings. Same destination as the inline link at
              the top, sized up. */}
          <div
            className="flex justify-center"
            style={{
              paddingTop: "var(--space-md)",
              paddingBottom: "var(--space-xl)",
            }}
          >
            <ButtonAction variant="primary" size="md" href="/profile" cta>
              Open my profile
            </ButtonAction>
          </div>
        </div>
      </div>
    </PageColumn>
  );
}
