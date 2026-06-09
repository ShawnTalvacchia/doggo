"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Dog,
  Users,
  Images,
  Heart,
  Clock,
  PawPrint,
  CaretRight,
  CaretDown,
  Check,
  Globe,
  FacebookLogo,
  InstagramLogo,
  Envelope,
  SignOut,
  X,
} from "@phosphor-icons/react";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { TabBar } from "@/components/ui/TabBar";
import { Spacer } from "@/components/layout/Spacer";
import { FilterPillRow } from "@/components/ui/FilterPillRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { ModalSheet } from "@/components/overlays/ModalSheet";
import { MomentCardFromPost } from "@/components/feed/MomentCard";
import { ShelterDogCard } from "@/components/shelters/ShelterDogCard";
import { ShelterMemberRow } from "@/components/shelters/ShelterMemberRow";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { useNavigationMemory } from "@/contexts/NavigationMemoryContext";
import {
  getShelterById,
  getShelterFeed,
  getDogsNeedingWalks,
  countDogsNeedingWalks,
  countLongStayers,
} from "@/lib/mockShelters";
import type {
  PetProfile,
  ShelterProfile,
  ShelterSupporter,
  ShelterWalker,
  WalkerApplicationState,
} from "@/lib/types";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import { useWalkerApplications } from "@/contexts/WalkerApplicationsContext";
import { getUserById } from "@/lib/mockUsers";

/* ── Page wrapper (Suspense for useSearchParams) ───────────────────── */

export default function ShelterDetailPage() {
  return (
    <Suspense>
      <ShelterDetailInner />
    </Suspense>
  );
}

function ShelterDetailInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawActiveTab = searchParams.get("tab") || "feed";
  const { setDetailHeader, clearDetailHeader } = usePageHeader();
  const { lastListPath } = useNavigationMemory();

  const shelter = getShelterById(params.id as string);
  // Source-aware back: shelter detail is reachable from /home, future
  // /discover/shelters, post tag click, etc. Walk back to wherever the
  // viewer was last on a list-level surface; fallback /home.
  const parentHref = lastListPath ?? "/home";

  const tabs = useMemo(
    () => [
      { key: "feed", label: "Feed" },
      { key: "dogs", label: "Dogs" },
      { key: "members", label: "Members" },
      { key: "gallery", label: "Gallery" },
    ],
    [],
  );
  const visibleKeys = new Set(tabs.map((t) => t.key));
  const activeTab = visibleKeys.has(rawActiveTab) ? rawActiveTab : "feed";

  // Mobile detail header. Back walks to the last list-level path the
  // viewer was on (NavigationMemoryContext), falling back to /home for
  // deep links / fresh sessions.
  useEffect(() => {
    if (!shelter) return;
    setDetailHeader(shelter.name, () => router.push(parentHref));
    return () => clearDetailHeader();
  }, [shelter?.name, parentHref]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!shelter) {
    return (
      <div className="flex flex-col items-center gap-md p-xl">
        <p className="text-fg-secondary">Shelter not found.</p>
        <ButtonAction variant="secondary" size="sm" onClick={() => router.push("/home")}>
          Back to home
        </ButtonAction>
      </div>
    );
  }

  const handleTabChange = (key: string) => {
    if (key === "feed") {
      router.replace(`/shelters/${shelter.id}`, { scroll: false });
    } else {
      router.replace(`/shelters/${shelter.id}?tab=${key}`, { scroll: false });
    }
  };

  return (
    <div className="shelter-detail-page">
      <DetailHeader backLabel="Back" title={shelter.name} backHref={parentHref} />

      <div className="shelter-detail-panel">
        <div className="shelter-detail-body">
          {/* Tabs are sticky at the top of the scrollable body. Mirrors the
              community-detail pattern: tabs always accessible, hero scrolls
              away inside the Feed tab, no banner-jump between tabs. */}
          <div className="detail-tabs detail-tabs--fill">
            <TabBar tabs={tabs} activeKey={activeTab} onChange={handleTabChange} />
          </div>

          {activeTab === "feed" && <FeedTab shelter={shelter} />}
          {activeTab === "dogs" && <DogsTab shelter={shelter} />}
          {activeTab === "members" && <MembersTab shelter={shelter} />}
          {activeTab === "gallery" && <GalleryTab />}

          <Spacer />
        </div>
      </div>
    </div>
  );
}

/* ── Feed tab ──────────────────────────────────────────────────────── */

function FeedTab({ shelter }: { shelter: ShelterProfile }) {
  const posts = getShelterFeed(shelter);
  const currentUserId = useCurrentUserId();
  const { getApplication, apply, advance, withdraw } = useWalkerApplications();
  const application = currentUserId ? getApplication(currentUserId, shelter.id) : undefined;
  const applicationState = application?.state;
  const [isFollowing, setIsFollowing] = useState(false);
  const [walkSheetOpen, setWalkSheetOpen] = useState(false);
  const [followMenuOpen, setFollowMenuOpen] = useState(false);
  const [walkerMenuOpen, setWalkerMenuOpen] = useState(false);

  // Order mirrors the community-detail Feed: banner → title + bio →
  // primary "what's the special thing about this surface" card
  // (community uses the provider card; we use the dogs-in-care summary)
  // → consolidated meta row → socials → action buttons → posts.
  return (
    <div className="shelter-feed">
      <ShelterBanner shelter={shelter} />
      <ShelterIntro shelter={shelter} />
      <DogsInCareSummaryCard shelter={shelter} />
      <ShelterMetaRow shelter={shelter} />
      <ShelterSocialsRow shelter={shelter} />
      <ShelterActionRow
        isFollowing={isFollowing}
        applicationState={applicationState}
        followMenuOpen={followMenuOpen}
        walkerMenuOpen={walkerMenuOpen}
        onToggleFollow={() => {
          if (isFollowing) setFollowMenuOpen((v) => !v);
          else setIsFollowing(true);
        }}
        onUnfollow={() => {
          setIsFollowing(false);
          setFollowMenuOpen(false);
        }}
        onToggleWalker={() => {
          if (applicationState) setWalkerMenuOpen((v) => !v);
          else setWalkSheetOpen(true);
        }}
        onAdvanceState={() => {
          if (currentUserId) advance(currentUserId, shelter.id);
          setWalkerMenuOpen(false);
        }}
        onWithdraw={() => {
          if (currentUserId) withdraw(currentUserId, shelter.id);
          setWalkerMenuOpen(false);
        }}
      />

      {posts.length === 0 ? (
        <div className="px-lg py-xl">
          <EmptyState
            icon={<PawPrint size={32} weight="light" />}
            title="No posts yet"
            subtitle="Walks, adoption celebrations, and dog stories will land here."
          />
        </div>
      ) : (
        <div className="shelter-feed-list">
          {posts.map((post) => (
            <MomentCardFromPost key={post.id} post={post} />
          ))}
        </div>
      )}

      <WalkInterestSheet
        open={walkSheetOpen}
        shelter={shelter}
        onClose={() => setWalkSheetOpen(false)}
        onConfirm={(message) => {
          if (currentUserId) apply(currentUserId, shelter.id, message);
          setWalkSheetOpen(false);
        }}
      />
    </div>
  );
}

/* ── Hero pieces ───────────────────────────────────────────────────── */

function ShelterBanner({ shelter }: { shelter: ShelterProfile }) {
  return (
    <div
      className="shelter-detail-banner"
      style={{ backgroundImage: shelter.bannerUrl ? `url(${shelter.bannerUrl})` : undefined }}
    />
  );
}

function ShelterIntro({ shelter }: { shelter: ShelterProfile }) {
  return (
    <div className="shelter-intro">
      <h1 className="shelter-intro-name">{shelter.name}</h1>
      <p className="shelter-intro-bio">{shelter.bio}</p>
    </div>
  );
}

/**
 * Single-row icon-prefixed meta. Mirrors the community page's
 * "📍 location · 👥 N members · 6 dogs · 📷 Photos encouraged" pattern.
 * We drop "Run by team" (redundant with the institutional account model
 * when no staff are linked) and "Solo walks only" (already on each dog
 * card and in the Walk-a-dog sheet's vouching note).
 */
function ShelterMetaRow({ shelter }: { shelter: ShelterProfile }) {
  // Walkers/supporters line hides entirely when both are zero — "0 walkers,
  // 0 supporters" reads as broken on thin shelters. When only one side has
  // entries, render just that side. Surfaced 2026-06-08 (Help a Dog
  // Discover door — thin-shelter audit).
  const walkerCount = shelter.walkers.length;
  const supporterCount = shelter.supporters.length;
  const peopleLineParts: string[] = [];
  if (walkerCount > 0) peopleLineParts.push(`${walkerCount} walkers`);
  if (supporterCount > 0) peopleLineParts.push(`${supporterCount} supporters`);

  return (
    <div className="shelter-meta-row">
      <span className="shelter-meta-item">
        <MapPin size={14} weight="light" />
        <span>{shelter.location}</span>
      </span>
      {peopleLineParts.length > 0 && (
        <span className="shelter-meta-item">
          <Users size={14} weight="light" />
          <span>{peopleLineParts.join(", ")}</span>
        </span>
      )}
      {shelter.establishedYear && (
        <span className="shelter-meta-item">
          <Clock size={14} weight="light" />
          <span>since {shelter.establishedYear}</span>
        </span>
      )}
    </div>
  );
}

function ShelterSocialsRow({ shelter }: { shelter: ShelterProfile }) {
  if (!shelter.website && !shelter.socialLinks) return null;
  return (
    <div className="shelter-intro-socials" aria-label="Shelter links">
      {shelter.website && (
        <a
          href={`https://${shelter.website}`}
          target="_blank"
          rel="noreferrer"
          className="shelter-intro-social"
          aria-label={`Website: ${shelter.website}`}
          title={shelter.website}
        >
          <Globe size={16} weight="light" />
        </a>
      )}
      {shelter.socialLinks?.facebook && (
        <span
          className="shelter-intro-social"
          aria-label={`Facebook: ${shelter.socialLinks.facebook}`}
          title={shelter.socialLinks.facebook}
        >
          <FacebookLogo size={16} weight="light" />
        </span>
      )}
      {shelter.socialLinks?.instagram && (
        <span
          className="shelter-intro-social"
          aria-label={`Instagram: ${shelter.socialLinks.instagram}`}
          title={shelter.socialLinks.instagram}
        >
          <InstagramLogo size={16} weight="light" />
        </span>
      )}
      {shelter.socialLinks?.email && (
        <a
          href={`mailto:${shelter.socialLinks.email}`}
          className="shelter-intro-social"
          aria-label={`Email: ${shelter.socialLinks.email}`}
          title={shelter.socialLinks.email}
        >
          <Envelope size={16} weight="light" />
        </a>
      )}
    </div>
  );
}

/* ── Action row (Follow + Walk a dog) ──────────────────────────────── */

interface ShelterActionRowProps {
  isFollowing: boolean;
  /** Walker application state — undefined when the user hasn't applied. */
  applicationState?: WalkerApplicationState;
  followMenuOpen: boolean;
  walkerMenuOpen: boolean;
  onToggleFollow: () => void;
  onUnfollow: () => void;
  onToggleWalker: () => void;
  onAdvanceState: () => void;
  onWithdraw: () => void;
}

const WALKER_BUTTON_LABEL: Record<WalkerApplicationState | "none", string> = {
  none: "Walk a dog",
  applied: "Application sent",
  invited: "Invited to visit",
  vouched: "Vouched walker",
};

function ShelterActionRow({
  isFollowing,
  applicationState,
  followMenuOpen,
  walkerMenuOpen,
  onToggleFollow,
  onUnfollow,
  onToggleWalker,
  onAdvanceState,
  onWithdraw,
}: ShelterActionRowProps) {
  return (
    <div className="shelter-action-row">
      <div className="shelter-action-button-wrap dropdown-menu-wrap">
        <ButtonAction
          variant={isFollowing ? "brand-subtle" : "neutral"}
          size="md"
          cta
          leftIcon={isFollowing ? <Check size={16} weight="bold" /> : undefined}
          rightIcon={isFollowing ? <CaretDown size={12} weight="bold" /> : undefined}
          onClick={onToggleFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </ButtonAction>
        {followMenuOpen && isFollowing && (
          <div className="dropdown-menu" role="menu">
            <button
              type="button"
              className="dropdown-menu-item dropdown-menu-item--destructive"
              onClick={onUnfollow}
            >
              <SignOut size={16} weight="light" />
              Unfollow
            </button>
          </div>
        )}
      </div>

      <div className="shelter-action-button-wrap dropdown-menu-wrap">
        <ButtonAction
          variant={applicationState ? "brand-subtle" : "primary"}
          size="md"
          cta
          leftIcon={applicationState ? <Check size={16} weight="bold" /> : undefined}
          rightIcon={applicationState ? <CaretDown size={12} weight="bold" /> : undefined}
          onClick={onToggleWalker}
        >
          {WALKER_BUTTON_LABEL[applicationState ?? "none"]}
        </ButtonAction>
        {walkerMenuOpen && applicationState && (
          <div className="dropdown-menu" role="menu">
            {applicationState !== "vouched" && (
              <button
                type="button"
                className="dropdown-menu-item"
                onClick={onAdvanceState}
              >
                <Check size={16} weight="light" />
                Advance state (demo)
              </button>
            )}
            <button
              type="button"
              className="dropdown-menu-item dropdown-menu-item--destructive"
              onClick={onWithdraw}
            >
              <X size={16} weight="light" />
              {applicationState === "vouched" ? "Leave shelter" : "Withdraw application"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function WalkInterestSheet({
  open,
  shelter,
  onClose,
  onConfirm,
}: {
  open: boolean;
  shelter: ShelterProfile;
  onClose: () => void;
  onConfirm: (message: string) => void;
}) {
  const [message, setMessage] = useState("");
  const canSubmit = message.trim().length >= 10;
  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title="Apply to walk dogs"
      compact
      footer={
        <div className="flex gap-sm justify-end px-md py-md">
          <ButtonAction variant="neutral" size="md" onClick={onClose}>
            Not yet
          </ButtonAction>
          <ButtonAction
            variant="primary"
            size="md"
            cta
            disabled={!canSubmit}
            onClick={() => {
              onConfirm(message.trim());
              setMessage("");
            }}
          >
            Send application
          </ButtonAction>
        </div>
      }
    >
      <div className="flex flex-col gap-md p-md">
        <p className="text-sm text-fg-secondary m-0">
          {shelter.name} pairs new walkers with the right dog through a short
          intro visit at the shelter.
        </p>
        {shelter.policy.vouchingNote && (
          <p className="text-sm text-fg-primary m-0">
            <em>{shelter.policy.vouchingNote}</em>
          </p>
        )}
        <div className="flex flex-col gap-xs">
          <label htmlFor="walker-application-message" className="text-sm font-semibold text-fg-primary">
            Why do you want to walk here?
          </label>
          <textarea
            id="walker-application-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="A few sentences about your experience with dogs and why this shelter."
            className="text-sm"
            style={{
              width: "100%",
              padding: "var(--space-sm)",
              border: "1px solid var(--border-regular)",
              borderRadius: "var(--radius-form)",
              background: "var(--surface-top)",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
          <span className="text-xs text-fg-tertiary">
            Required — 10 characters minimum.
          </span>
        </div>
      </div>
    </ModalSheet>
  );
}

/* ── Dogs-in-care summary card ─────────────────────────────────────── */

function DogsInCareSummaryCard({ shelter }: { shelter: ShelterProfile }) {
  const dogCount = shelter.dogs.length;
  const needWalks = countDogsNeedingWalks(shelter);
  const longStayers = countLongStayers(shelter);

  const subParts: string[] = [];
  if (needWalks > 0) subParts.push(`${needWalks} need walks now`);
  if (longStayers > 0) subParts.push(`${longStayers} long-stayer${longStayers === 1 ? "" : "s"}`);

  return (
    <Link
      href={`/shelters/${shelter.id}?tab=dogs`}
      className="shelter-summary-card"
      style={{ textDecoration: "none" }}
    >
      <div className="shelter-summary-card-icon">
        <Dog size={24} weight="light" />
      </div>
      <div className="flex flex-col gap-tiny flex-1 min-w-0">
        <span className="shelter-summary-card-headline">
          {dogCount} {dogCount === 1 ? "dog" : "dogs"} in care
        </span>
        {subParts.length > 0 && (
          <span className="shelter-summary-card-sub">{subParts.join(" · ")}</span>
        )}
        <span className="shelter-summary-card-action">See the roster</span>
      </div>
      <CaretRight size={16} weight="bold" className="text-fg-tertiary flex-shrink-0" />
    </Link>
  );
}

/* ── Dogs tab ──────────────────────────────────────────────────────── */

type DogsSortKey = "needs-walks" | "longest" | "smallest" | "alpha";

const SORT_OPTIONS: { value: DogsSortKey; label: string }[] = [
  { value: "needs-walks", label: "Needs walks now" },
  { value: "longest", label: "Longest in care" },
  { value: "smallest", label: "Smallest first" },
  { value: "alpha", label: "A–Z" },
];

/** Parse weight strings like "22 kg" -> 22. Falls back to Infinity for
 *  unknown weights so they sort to the end of "smallest first." */
function parseWeight(label: string | undefined): number {
  if (!label) return Number.POSITIVE_INFINITY;
  const match = label.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : Number.POSITIVE_INFINITY;
}

/**
 * Custom-styled sort dropdown. Uses the project's .dropdown-menu pattern
 * (same as the Follow / RSVP / Joined menus) so options render with our
 * styling instead of the OS-native select dropdown. Lives inline here
 * because the shelter Dogs tab is its only consumer; extract to a
 * shared component when a second surface needs the pattern.
 */
function SortMenu({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape. Mirrors the meet-RSVP / shelter-Follow
  // menus' close behavior.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onMouseDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={wrapRef} className="dropdown-menu-wrap shelter-sort-wrap">
      <button
        type="button"
        className="shelter-sort-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{current?.label ?? "Sort"}</span>
        <CaretDown size={12} weight="bold" />
      </button>
      {open && (
        <div className="dropdown-menu" role="listbox">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              className={`dropdown-menu-item${opt.value === value ? " is-active" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <Check
                size={14}
                weight="light"
                style={{ opacity: opt.value === value ? 1 : 0 }}
                aria-hidden="true"
              />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DogsTab({ shelter }: { shelter: ShelterProfile }) {
  const [sortKey, setSortKey] = useState<DogsSortKey>("needs-walks");

  const sorted = useMemo<PetProfile[]>(() => {
    switch (sortKey) {
      case "needs-walks":
        return getDogsNeedingWalks(shelter);
      case "longest":
        return [...shelter.dogs].sort(
          (a, b) => (b.daysInKennel ?? 0) - (a.daysInKennel ?? 0),
        );
      case "smallest":
        return [...shelter.dogs].sort(
          (a, b) => parseWeight(a.weightLabel) - parseWeight(b.weightLabel),
        );
      case "alpha":
        return [...shelter.dogs].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [shelter, sortKey]);

  return (
    <div className="shelter-dogs">
      <div className="shelter-dogs-toolbar">
        <span className="shelter-dogs-toolbar-label">Sort by</span>
        <SortMenu
          value={sortKey}
          options={SORT_OPTIONS}
          onChange={(v) => setSortKey(v as DogsSortKey)}
        />
      </div>

      {sorted.length === 0 ? (
        <div className="px-lg py-xl">
          <EmptyState
            icon={<PawPrint size={32} weight="light" />}
            title="No dogs to show"
          />
        </div>
      ) : (
        <div className="shelter-dogs-grid">
          {sorted.map((dog) => (
            <ShelterDogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Members tab ───────────────────────────────────────────────────── */

type MembersFilterKey = "all" | "walkers" | "supporters" | "team";

function MembersTab({ shelter }: { shelter: ShelterProfile }) {
  const teamCount = shelter.team?.length ?? 0;
  const { applications } = useWalkerApplications();

  // Vouched-but-not-yet-seeded walkers (I, 2026-06-09). When a user
  // completes the walker journey through to "vouched," they appear on
  // the shelter's Members tab as a Volunteer (vetted tier) even if
  // they aren't in the static mock roster. Their walkCount starts at
  // 0 — increments via the demo's hidden "Log a walk" affordance on
  // the walker journey.
  const vouchedDynamicWalkers = useMemo<ShelterWalker[]>(() => {
    return applications
      .filter((a) => a.shelterId === shelter.id && a.state === "vouched")
      // Skip if already in the static roster (avoid double-render).
      .filter((a) => !shelter.walkers.some((w) => w.userId === a.userId))
      .map((a) => {
        const u = getUserById(a.userId);
        return {
          userId: a.userId,
          displayName: u ? `${u.firstName} ${u.lastName}` : a.userId,
          avatarUrl: u?.avatarUrl,
          tier: "vetted" as const,
          vouchedAt: a.vouchedAt ?? a.appliedAt,
          walkCount: 0,
        };
      });
  }, [applications, shelter]);

  const allWalkers = [...shelter.walkers, ...vouchedDynamicWalkers];

  const filters = useMemo(() => {
    const base: { key: MembersFilterKey; label: string }[] = [
      { key: "all", label: "All" },
      { key: "walkers", label: `Walkers · ${allWalkers.length}` },
      { key: "supporters", label: `Supporters · ${shelter.supporters.length}` },
    ];
    if (teamCount > 0) {
      base.push({ key: "team", label: `Team · ${teamCount}` });
    }
    return base;
  }, [shelter, teamCount, allWalkers.length]);

  const [filter, setFilter] = useState<MembersFilterKey>("all");

  // Sortable, typed entries that flow through ShelterMemberRow.
  type WalkerEntry = { kind: "walker"; data: ShelterWalker; sortAt: string };
  type SupporterEntry = { kind: "supporter"; data: ShelterSupporter; sortAt: string };
  type Entry = WalkerEntry | SupporterEntry;

  const entries = useMemo<Entry[]>(() => {
    const walkerEntries: Entry[] = allWalkers.map((w) => ({
      kind: "walker",
      data: w,
      // Sort by most-recent walk for active walkers; fall back to vouchedAt.
      sortAt: w.lastWalkedAt ?? w.vouchedAt,
    }));
    const supporterEntries: Entry[] = shelter.supporters.map((s) => ({
      kind: "supporter",
      data: s,
      sortAt: s.since,
    }));

    let list: Entry[];
    if (filter === "walkers") list = walkerEntries;
    else if (filter === "supporters") list = supporterEntries;
    else if (filter === "team") list = []; // No staff seeded; UI is forward-compat.
    else list = [...walkerEntries, ...supporterEntries];

    // Sort by recency (newest sortAt first). Anti-scoreboard discipline.
    return list.sort((a, b) => b.sortAt.localeCompare(a.sortAt));
  }, [allWalkers, shelter.supporters, filter]);

  return (
    <div className="shelter-members">
      {/* FilterPillRow carries its own padding + border-bottom — no need
          to wrap it in another container (was causing double-padding
          and double-divider relative to other surfaces). */}
      <FilterPillRow
        pills={filters}
        activeKey={filter}
        onChange={(k) => setFilter(k as MembersFilterKey)}
      />

      {entries.length === 0 ? (
        <div className="px-lg py-xl">
          <EmptyState
            icon={<Heart size={32} weight="light" />}
            title={
              filter === "team"
                ? "No team members linked yet"
                : shelter.walkers.length + shelter.supporters.length === 0
                  ? "Walkers and supporters coming soon"
                  : "No members in this view"
            }
            subtitle={
              filter === "team"
                ? `${shelter.name} operates as a shared-account team. Individual staff can opt to link their profiles.`
                : shelter.walkers.length + shelter.supporters.length === 0
                  ? `${shelter.name} is small. Walkers join through a coordinator-led intro session.`
                  : "Switch the filter to see walkers or supporters."
            }
          />
        </div>
      ) : (
        <div className="shelter-members-list">
          {entries.map((entry) => (
            <ShelterMemberRow
              key={`${entry.kind}-${entry.data.userId}`}
              entry={entry}
              shelterName={shelter.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Gallery tab (stub) ────────────────────────────────────────────── */

function GalleryTab() {
  return (
    <div className="px-lg py-xl">
      <EmptyState
        icon={<Images size={32} weight="light" />}
        title="Gallery coming soon"
        subtitle="Photos from walks and shelter posts will live here. Lands with the Photos & Galleries phase."
      />
    </div>
  );
}
