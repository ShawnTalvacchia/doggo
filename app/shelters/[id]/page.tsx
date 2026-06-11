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
import { WalkApplicationSheet } from "@/components/shelters/WalkApplicationSheet";
import { MentorSessionBookingSheet } from "@/components/shelters/MentorSessionBookingSheet";
import { usePageHeader } from "@/contexts/PageHeaderContext";
import { useNavigationMemory } from "@/contexts/NavigationMemoryContext";
import {
  getShelterById,
  getShelterFeed,
  getDogsNeedingWalks,
  countDogsNeedingWalks,
  countLongStayers,
} from "@/lib/mockShelters";
import {
  getMentorsForShelter,
  getMentorshipHistory,
  getPlatformVolunteerTier,
} from "@/lib/volunteerTier";
import { MENTOR_SESSION_DEFAULT_MINIMUM } from "@/lib/constants/services";
import type {
  CarerMentorSessionServiceConfig,
  PetProfile,
  ShelterProfile,
  ShelterSupporter,
  ShelterWalker,
  UserProfile,
  WalkerApplication,
  WalkerApplicationState,
  WalkerTier,
} from "@/lib/types";
import { useCurrentUserId } from "@/hooks/useCurrentUser";
import {
  useWalkerApplications,
  deriveWalkerTier,
  tierOverrideKey,
} from "@/contexts/WalkerApplicationsContext";
import { useBookings } from "@/contexts/BookingsContext";
import { useStubNotice } from "@/contexts/StubFeatureContext";
import { useMentorSessionCompletion } from "@/components/shelters/useMentorSessionCompletion";
import { countCompletedShelterWalks } from "@/lib/volunteerTier";
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
  const {
    applications,
    getApplication,
    apply,
    advance,
    withdraw,
    logWalk,
    creditWalks,
    tierOverrides,
  } = useWalkerApplications();
  const application = currentUserId ? getApplication(currentUserId, shelter.id) : undefined;
  const applicationState = application?.state;
  const [isFollowing, setIsFollowing] = useState(false);
  const [walkSheetOpen, setWalkSheetOpen] = useState(false);
  const [followMenuOpen, setFollowMenuOpen] = useState(false);
  const [walkerMenuOpen, setWalkerMenuOpen] = useState(false);
  // Mentor path (Cross-Shelter Mentor Network B2): the shelter-side door
  // into booking a mentored first walk. {mentor, service} drives the
  // sheet. Self excluded — a mentor doesn't get offered their own
  // mentorship at shelters they serve. Tier overrides flow in so a
  // shelter demoting a mentor's trusted tier revokes their mentor
  // eligibility here too (O4).
  const mentors = getMentorsForShelter(shelter.id, applications, tierOverrides).filter(
    (m) => m.mentor.id !== currentUserId,
  );
  const [mentorSheetTarget, setMentorSheetTarget] = useState<
    (typeof mentors)[number] | null
  >(null);
  const mentorshipHistory = currentUserId
    ? getMentorshipHistory(currentUserId, applications)
    : { totalSessions: 0, mentorNames: [] };

  const minimum = shelter.policy.mentorSessionMinimum ?? MENTOR_SESSION_DEFAULT_MINIMUM;

  // Complete-session demo toggle (B4) — shared handler: increments the
  // mentorship count, completes the matching mentor booking, and lands
  // the mentor's graduation message when the minimum is reached.
  const completeMentorSessionHere = useMentorSessionCompletion(shelter);
  const handleCompleteMentorSession = () => {
    completeMentorSessionHere();
    setWalkerMenuOpen(false);
  };

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
        application={application}
        mentorSessionMinimum={minimum}
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
        onLogWalk={() => {
          if (currentUserId) logWalk(currentUserId, shelter.id);
          setWalkerMenuOpen(false);
        }}
        onCompleteMentorSession={handleCompleteMentorSession}
        onCreditWalks={() => {
          // Operator stub (D5): the shelter credits 25 historical
          // real-world walks to the current user. Provenance-marked.
          if (currentUserId) creditWalks(currentUserId, shelter.id, 25);
          setWalkerMenuOpen(false);
        }}
        onWithdraw={() => {
          if (currentUserId) withdraw(currentUserId, shelter.id);
          setWalkerMenuOpen(false);
        }}
      />

      <MentorProgressLine
        shelter={shelter}
        application={application}
        minimum={minimum}
        mentorshipHistory={mentorshipHistory}
      />

      {/* Mentor-path door (B2): shown while the viewer isn't a vouched
          walker here and a mentor serves this shelter. Doubles as the
          "book your next session" surface mid-mentorship. */}
      {mentors.length > 0 &&
        shelter.policy.acceptsMentorVouches &&
        applicationState !== "vouched" && (
          <MentorPathCard
            shelter={shelter}
            mentorEntry={mentors[0]}
            sessionsCompleted={application?.mentorship?.sessionsCompleted ?? 0}
            minimum={minimum}
            onBook={() => setMentorSheetTarget(mentors[0])}
          />
        )}

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

      <WalkApplicationSheet
        open={walkSheetOpen}
        shelter={shelter}
        onClose={() => setWalkSheetOpen(false)}
        onConfirm={(message) => {
          if (currentUserId) apply(currentUserId, shelter.id, message);
          setWalkSheetOpen(false);
        }}
        mentorshipHistory={mentorshipHistory}
        isSuperVolunteer={
          currentUserId
            ? getPlatformVolunteerTier(currentUserId, applications, [], tierOverrides).isSuperVolunteer
            : false
        }
      />

      {mentorSheetTarget && (
        <MentorSessionBookingSheet
          open
          onClose={() => setMentorSheetTarget(null)}
          mentor={{
            id: mentorSheetTarget.mentor.id,
            name: `${mentorSheetTarget.mentor.firstName} ${mentorSheetTarget.mentor.lastName}`.trim(),
            avatarUrl: mentorSheetTarget.mentor.avatarUrl ?? "",
          }}
          service={mentorSheetTarget.service}
          defaultShelterId={shelter.id}
        />
      )}
    </div>
  );
}

/* ── Mentor path pieces (Cross-Shelter Mentor Network, 2026-06-09) ──── */

/**
 * Quiet status line under the action row — the mentee's graduation arc
 * (B3). Three shapes: in-mentorship progress at an accepting shelter;
 * the "Mentor-recommended" credibility line on a standard application at
 * a NON-accepting shelter (D2 fallback — mentor work elsewhere still
 * counts, the coordinator still gates, ASSUMPTION A10); nothing.
 */
function MentorProgressLine({
  shelter,
  application,
  minimum,
  mentorshipHistory,
}: {
  shelter: ShelterProfile;
  application?: WalkerApplication;
  minimum: number;
  mentorshipHistory: { totalSessions: number; mentorNames: string[] };
}) {
  let text: string | null = null;
  if (
    application?.mentorship &&
    application.state !== "vouched" &&
    shelter.policy.acceptsMentorVouches
  ) {
    const done = application.mentorship.sessionsCompleted;
    text = `${done} of ${minimum} mentor sessions with ${application.mentorship.mentorName} — ${shelter.name} vouches you after that.`;
  } else if (
    application &&
    application.state !== "vouched" &&
    !shelter.policy.acceptsMentorVouches &&
    mentorshipHistory.totalSessions > 0
  ) {
    text = `Mentor-recommended · ${mentorshipHistory.totalSessions} ${mentorshipHistory.totalSessions === 1 ? "session" : "sessions"} with ${mentorshipHistory.mentorNames.join(", ")} — strengthens your application; ${shelter.name} reviews walkers directly.`;
  } else if (application?.state === "vouched" && application.vouchedVia === "mentor") {
    text = `Vouched via mentor sessions with ${application.mentorship?.mentorName ?? "your mentor"}.`;
  }
  if (!text) return null;
  return (
    <p className="text-xs text-fg-tertiary m-0" style={{ padding: "0 var(--space-xl)" }}>
      {text}
    </p>
  );
}

/**
 * The mentor-path door card (B2): "new to walking here? there's a paid,
 * mentored way in." Renders the mentor's identity + price + the
 * graduation promise; CTA opens the booking sheet in place. ASSUMPTION
 * A4 (the fee filters for commitment) + A8 (intake friction, not demand,
 * is the binding constraint) live or die on this card's conversion.
 */
function MentorPathCard({
  shelter,
  mentorEntry,
  sessionsCompleted,
  minimum,
  onBook,
}: {
  shelter: ShelterProfile;
  mentorEntry: { mentor: UserProfile; service: CarerMentorSessionServiceConfig };
  sessionsCompleted: number;
  minimum: number;
  onBook: () => void;
}) {
  const { mentor, service } = mentorEntry;
  const mentorName = `${mentor.firstName} ${mentor.lastName}`.trim();
  const inProgress = sessionsCompleted > 0;
  const remaining = Math.max(minimum - sessionsCompleted, 0);
  return (
    <div className="shelter-mentor-card">
      <img
        src={mentor.avatarUrl}
        alt={mentorName}
        className="shelter-mentor-card-avatar"
      />
      <div className="flex flex-col gap-xs flex-1 min-w-0">
        <span className="text-sm font-semibold text-fg-primary">
          {inProgress
            ? `Keep going — ${remaining} ${remaining === 1 ? "session" : "sessions"} to solo walking`
            : "New to shelter walking?"}
        </span>
        <span className="text-sm text-fg-secondary">
          {inProgress
            ? `Book your next mentored walk with ${mentorName}.`
            : `${mentorName}, a Super Volunteer here, runs paid mentored first walks — ${minimum} sessions and ${shelter.name} vouches you to walk solo.`}
        </span>
        <span className="text-xs text-fg-tertiary">
          {service.pricePerSession.toLocaleString()} Kč / session · {service.durationMinutes} min ·
          you pay the mentor, the shelter pays nothing
        </span>
      </div>
      <ButtonAction variant="secondary" size="sm" cta onClick={onBook}>
        {inProgress ? "Book next session" : "Book a mentored walk"}
      </ButtonAction>
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
  /** Walker application — undefined when the user hasn't applied. */
  application?: WalkerApplication;
  /** Resolved mentor-session minimum for this shelter. */
  mentorSessionMinimum: number;
  followMenuOpen: boolean;
  walkerMenuOpen: boolean;
  onToggleFollow: () => void;
  onUnfollow: () => void;
  onToggleWalker: () => void;
  onAdvanceState: () => void;
  onLogWalk: () => void;
  onCompleteMentorSession: () => void;
  onCreditWalks: () => void;
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
  application,
  mentorSessionMinimum,
  followMenuOpen,
  walkerMenuOpen,
  onToggleFollow,
  onUnfollow,
  onToggleWalker,
  onAdvanceState,
  onLogWalk,
  onCompleteMentorSession,
  onCreditWalks,
  onWithdraw,
}: ShelterActionRowProps) {
  const applicationState = application?.state;
  const inMentorship = !!application?.mentorship && applicationState !== "vouched";
  // Mentor-path applications read as mentorship progress, not "waiting
  // for the shelter" — the button label carries the arc (B3).
  const walkerLabel = inMentorship
    ? `In mentorship · ${application!.mentorship!.sessionsCompleted}/${mentorSessionMinimum}`
    : WALKER_BUTTON_LABEL[applicationState ?? "none"];

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
          {walkerLabel}
        </ButtonAction>
        {walkerMenuOpen && applicationState && (
          <div className="dropdown-menu" role="menu">
            {inMentorship && (
              <button
                type="button"
                className="dropdown-menu-item"
                onClick={onCompleteMentorSession}
              >
                <Check size={16} weight="light" />
                Complete mentor session (demo)
              </button>
            )}
            {!inMentorship && applicationState !== "vouched" && (
              <button
                type="button"
                className="dropdown-menu-item"
                onClick={onAdvanceState}
              >
                <Check size={16} weight="light" />
                Advance state (demo)
              </button>
            )}
            {applicationState === "vouched" && (
              <button
                type="button"
                className="dropdown-menu-item"
                onClick={onLogWalk}
              >
                <PawPrint size={16} weight="light" />
                Log walk (demo)
              </button>
            )}
            {/* Operator stub (D5): the shelter crediting historical
                real-world walks. Lives behind the same hidden-affordance
                dropdown as the other state toggles; the real authoring
                surface is shelter-operator territory (V3+). */}
            <button
              type="button"
              className="dropdown-menu-item"
              onClick={onCreditWalks}
            >
              <Clock size={16} weight="light" />
              Credit historical walks (demo)
            </button>
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

// WalkInterestSheet extracted to components/shelters/WalkApplicationSheet.tsx
// (2026-06-09) so the dog profile hero "Walk {dog.name}" button can open
// the same surface without navigating to the shelter page first.

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

/** Tier ladder for the operator-stub promote/demote controls (O4). */
const TIER_LADDER: WalkerTier[] = ["vetted", "experienced", "trusted"];

function MembersTab({ shelter }: { shelter: ShelterProfile }) {
  const teamCount = shelter.team?.length ?? 0;
  const { applications, tierOverrides, setTierOverride } = useWalkerApplications();
  const { bookings } = useBookings();
  const { notify: notifyStub } = useStubNotice();

  // Vouched-but-not-yet-seeded walkers (I, 2026-06-09). When a user
  // completes the walker journey through to "vouched," they appear on
  // the shelter's Members tab as a Volunteer (vetted tier) even if
  // they aren't in the static mock roster. Walk counts combine the
  // demo "Log a walk" toggle, shelter-credited bootstrap walks, AND
  // completed shelter-walk Bookings (Cross-Shelter Mentor Network G3 —
  // real walks feed tier escalation, derived at read time).
  const vouchedDynamicWalkers = useMemo<ShelterWalker[]>(() => {
    return applications
      .filter((a) => a.shelterId === shelter.id && a.state === "vouched")
      // Skip if already in the static roster (avoid double-render).
      .filter((a) => !shelter.walkers.some((w) => w.userId === a.userId))
      .map((a) => {
        const u = getUserById(a.userId);
        const walkCount =
          (a.walkCount ?? 0) + countCompletedShelterWalks(a.userId, shelter.id, bookings);
        return {
          userId: a.userId,
          displayName: u ? `${u.firstName} ${u.lastName}` : a.userId,
          avatarUrl: u?.avatarUrl,
          tier: deriveWalkerTier(walkCount),
          vouchedAt: a.vouchedAt ?? a.appliedAt,
          walkCount,
          creditedWalkCount: a.creditedWalkCount,
        };
      });
  }, [applications, shelter, bookings]);

  // Shelter tier authority (O4 resolution, 2026-06-10): the shelter's
  // explicit promote/demote call wins over both the seeded static tier
  // and the walk-count derivation. The row renders the RESULT only —
  // provenance (credited vs logged, override vs derived) stays in the
  // data per the 2026-06-10 PO call. Static walkers also accrue dynamic
  // activity (row-kebab credits land on a WalkerApplication and sum on
  // top of the seeded history).
  const allWalkers = [...shelter.walkers, ...vouchedDynamicWalkers].map((w) => {
    const override = tierOverrides[tierOverrideKey(shelter.id, w.userId)];
    const isStatic = shelter.walkers.some((s) => s.userId === w.userId);
    const dynForStatic = isStatic
      ? applications.find((a) => a.userId === w.userId && a.shelterId === shelter.id)
      : undefined;
    return {
      ...w,
      walkCount: w.walkCount + (dynForStatic?.walkCount ?? 0),
      tier: override ?? w.tier,
    };
  });

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
              // Shelter tier authority (O4): operator-stub promote/demote
              // per walker row. Hidden per direction at the ladder ends.
              onPromote={
                entry.kind === "walker" && entry.data.tier !== "trusted"
                  ? () =>
                      setTierOverride(
                        shelter.id,
                        entry.data.userId,
                        TIER_LADDER[TIER_LADDER.indexOf(entry.data.tier) + 1],
                      )
                  : undefined
              }
              onDemote={
                entry.kind === "walker" && entry.data.tier !== "vetted"
                  ? () =>
                      setTierOverride(
                        shelter.id,
                        entry.data.userId,
                        TIER_LADDER[TIER_LADDER.indexOf(entry.data.tier) - 1],
                      )
                  : undefined
              }
              onCreditWalks={
                entry.kind === "walker"
                  ? // Stub toast, not a hidden +25 (PO call 2026-06-10):
                    // the real crediting flow needs a count + period form
                    // on the operator surface. The walker-button demo
                    // dropdown still credits the current persona for
                    // walkthrough bootstrap beats.
                    () =>
                      notifyStub({
                        feature: "Credit walks",
                        note: "Crediting a walker's pre-app history needs the shelter operator surface (how many walks, over what period). For walkthroughs, the Walk-a-dog button's demo dropdown credits the current persona.",
                      })
                  : undefined
              }
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
