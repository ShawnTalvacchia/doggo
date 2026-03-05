"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonIcon } from "@/components/ui/ButtonIcon";
import { ButtonAction } from "@/components/ui/ButtonAction";
import {
  Bell,
  CalendarDots,
  ChatCircleDots,
  MagnifyingGlass,
  Sparkle,
} from "@phosphor-icons/react";

const PAGE_GROUPS = [
  {
    title: "Sign Up",
    items: [
      { label: "Start", value: "/signup/start" },
      { label: "Role", value: "/signup/role" },
      { label: "Profile", value: "/signup/profile" },
      { label: "Care Preferences", value: "/signup/care-preferences" },
      { label: "Walking", value: "/signup/walking" },
      { label: "Hosting", value: "/signup/hosting" },
      { label: "Pet", value: "/signup/pet" },
      { label: "Success", value: "/signup/success" },
    ],
  },
  {
    title: "Explore",
    items: [
      { label: "Results", value: "/explore/results" },
      { label: "Profile", value: "/explore/profile/olga-m" },
    ],
  },
  {
    title: "System",
    items: [{ label: "Styleguide", value: "/styleguide" }],
  },
];

function PageMenu({
  trigger,
  align = "right",
}: {
  trigger: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <details className="app-nav-menu">
      <summary className="app-nav-menu-summary">{trigger}</summary>
      <div className={`app-nav-menu-panel ${align === "left" ? "align-left" : "align-right"}`}>
        {PAGE_GROUPS.map((group) => (
          <div key={group.title} className="app-nav-menu-group">
            <div className="app-nav-menu-group-title">{group.title}</div>
            {group.items.map((option) => (
              <Link key={option.value} href={option.value} className="app-nav-menu-item">
                {option.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </details>
  );
}

function GuestNavLinks() {
  return (
    <div className="app-nav-right" aria-label="Guest navigation">
      <Link href="/signup/start" className="app-nav-link">
        Sign Up
      </Link>
      <PageMenu trigger={<span className="app-nav-signin-trigger">Sign In</span>} />
    </div>
  );
}

function LoggedNavLinks() {
  return (
    <div className="app-nav-logged" aria-label="Logged-in navigation">
      <div className="app-nav-main-links">
        <ButtonAction
          href="/explore/results"
          variant="tertiary"
          size="md"
          leftIcon={<MagnifyingGlass size={24} weight="light" />}
          className="app-nav-action-btn"
        >
          Search
        </ButtonAction>
        <ButtonAction
          href="/signup/start"
          variant="tertiary"
          size="md"
          leftIcon={<Sparkle size={24} weight="light" />}
          className="app-nav-action-btn"
        >
          Offer Care
        </ButtonAction>
      </div>
      <div className="app-nav-icon-row">
        <ButtonIcon label="Notifications" showBadge>
          <Bell size={32} weight="light" />
        </ButtonIcon>
        <ButtonIcon label="Messages">
          <ChatCircleDots size={32} weight="light" />
        </ButtonIcon>
        <ButtonIcon label="Calendar">
          <CalendarDots size={32} weight="light" />
        </ButtonIcon>
        <PageMenu
          trigger={
            <span className="app-nav-avatar-trigger" aria-label="Open page menu">
              <img
                className="app-nav-avatar-img"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                alt="User avatar"
              />
            </span>
          }
        />
      </div>
    </div>
  );
}

export function AppNav() {
  const pathname = usePathname();
  const mode = pathname.startsWith("/explore") ? "logged" : "guest";

  return (
    <header className="app-nav-shell">
      <nav className="app-nav">
        <div className="app-nav-brand-wrap">
          <Link
            href="/signup/start"
            className="app-nav-brand"
            style={{ fontFamily: "var(--font-heading), sans-serif" }}
          >
            DOGGO
          </Link>
        </div>

        <div className="app-nav-mode">
          {mode === "guest" ? <GuestNavLinks /> : <LoggedNavLinks />}
        </div>
      </nav>
    </header>
  );
}
