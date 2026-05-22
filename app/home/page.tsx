"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, MagnifyingGlass } from "@phosphor-icons/react";
import { CameraPlusFill } from "@/components/icons/CameraPlusFill";
import { usePostComposer } from "@/contexts/PostComposerContext";
import { getFeedForUser, getNewUserFeed } from "@/lib/mockFeed";
import { useCurrentUserId, useIsNewUser } from "@/hooks/useCurrentUser";
import { DogsNearYou } from "@/components/home/DogsNearYou";
import { DiscoveryBanner } from "@/components/home/DiscoveryBanner";
import { getUserMeetInstances } from "@/lib/mockMeets";
import { MomentCardFromPost } from "@/components/feed/MomentCard";
import { FeedMeetRecap } from "@/components/feed/FeedMeetRecap";
import { FeedUpcomingMeet } from "@/components/feed/FeedUpcomingMeet";
import { FeedConnectionActivity } from "@/components/feed/FeedConnectionActivity";
import { FeedConnectionNudge } from "@/components/feed/FeedConnectionNudge";
import { FeedCarePrompt } from "@/components/feed/FeedCarePrompt";
import { FeedMilestone } from "@/components/feed/FeedMilestone";
import { FeedDogMoment } from "@/components/feed/FeedDogMoment";
import { FeedCareReview } from "@/components/feed/FeedCareReview";
import { FeedShareNudge } from "@/components/feed/FeedShareNudge";
import { ShareMomentBar } from "@/components/feed/ShareMomentBar";
import { TabBar } from "@/components/ui/TabBar";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { PageColumn } from "@/components/layout/PageColumn";
import { CardGroup } from "@/components/groups/CardGroup";
import { FilterPillRow } from "@/components/ui/FilterPillRow";
import { getUserGroups } from "@/lib/mockGroups";
import { useWalkthrough } from "@/contexts/WalkthroughContext";
import { isFireOffPostHidden, isWalkthroughHiddenMeet } from "@/lib/walkthroughBeats";
import type { FeedItem, GroupType } from "@/lib/types";

// ── Feed rendering ──────────────────────────────────────────────────────────

function FeedItemRenderer({ item }: { item: FeedItem }) {
  switch (item.type) {
    case "personal_post":
    case "community_post":
      return <MomentCardFromPost post={item.post} />;
    case "meet_recap":
      return <FeedMeetRecap meet={item.meet} />;
    case "upcoming_meet":
      return <FeedUpcomingMeet meet={item.meet} />;
    case "connection_activity":
      return <FeedConnectionActivity item={item} />;
    case "connection_nudge":
      return <FeedConnectionNudge item={item} />;
    case "offer_care_prompt":
    case "find_care_prompt":
      return <FeedCarePrompt item={item} />;
    case "milestone":
      return <FeedMilestone item={item} />;
    case "dog_moment":
      return <FeedDogMoment item={item} />;
    case "care_review":
      return <FeedCareReview item={item} />;
    case "share_nudge":
      return <FeedShareNudge item={item} />;
    default:
      return null;
  }
}

// ── Group category filter pills ─────────────────────────────────────────────

const CATEGORY_PILLS: { key: GroupType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "park", label: "Parks" },
  { key: "neighbor", label: "Neighbors" },
  { key: "interest", label: "Interest" },
  { key: "care", label: "Care" },
];

// ── Main tabs (inside panel) ────────────────────────────────────────────────

type MainTab = "groups" | "feed";

const MAIN_TABS: { key: MainTab; label: string }[] = [
  { key: "feed", label: "Feed" },
  { key: "groups", label: "Groups" },
];

// ── Main page ───────────────────────────────────────────────────────────────

function HomePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openComposer } = usePostComposer();

  // Main tab: groups or feed
  const mainTab = (searchParams.get("view") as MainTab) || "feed";
  const handleMainTabChange = (key: string) => {
    const tab = key as MainTab;
    // Reset scroll position when switching tabs
    const scrollBody = document.querySelector(".page-column-panel-body");
    if (scrollBody) scrollBody.scrollTop = 0;

    if (tab === "feed") {
      router.replace("/home", { scroll: false });
    } else {
      router.replace(`/home?view=${tab}`, { scroll: false });
    }
  };

  // Category filter — single select
  const [activeCategory, setActiveCategory] = useState<GroupType | "all">("all");

  const newUserMode = useIsNewUser();
  const currentUserId = useCurrentUserId();
  const wt = useWalkthrough();

  const userGroups = getUserGroups(currentUserId);
  // Walkthrough-only feed gating: (1) hide fire-off posts not yet "Shared"
  // so a fire-off card's post isn't already in the feed; (2) hide the
  // Stromovka walk's "Coming up" card, which is dated today and would
  // otherwise contradict Klára having just run it in Beat 2. Both no-op
  // outside an active walkthrough. 2026-05-22.
  const hideInWalkthrough = (item: FeedItem): boolean => {
    const post = (item as { post?: { id?: string } }).post;
    if (post?.id && isFireOffPostHidden(post.id, wt.active, wt.sharedPostIds)) {
      return true;
    }
    const meet = (item as { meet?: { id?: string } }).meet;
    if (meet?.id && isWalkthroughHiddenMeet(meet.id, wt.active)) return true;
    return false;
  };
  const allFeedItems = getFeedForUser(currentUserId).filter((i) => !hideInWalkthrough(i));

  // Discovery banner trigger — user is in at least one group but has
  // fewer than 2 distinct meet series in the next 7 days. The "your
  // week is open" framing matches the product intent better than the
  // earlier "all upcoming" count, which was easily satisfied by any
  // recurring weekly meet seeded multiple months out. CCFT F3.1
  // walkthrough iteration (2026-05-13): every persona is heavily
  // engaged when counting all upcoming RSVPs (Daniel 10 series,
  // Tereza 11, Klára 16, Tomáš 11), so the banner could never fire
  // against seeded data — even though Daniel/Tomáš genuinely have
  // sparse near-term calendars. Tightening to a 7-day horizon
  // surfaces "your week is empty" without losing the "fully booked"
  // suppression for Tereza/Klára. Trigger sophistication (frequency
  // caps, dismiss memory, variant rotation) still filed as a
  // follow-up — see Product Vision.md → Schedule + Discover IA.
  const nearTermMeetSeriesCount = useMemo(() => {
    if (newUserMode) return 0;
    const today = new Date();
    const todayIso = today.toISOString().slice(0, 10);
    const horizon = new Date(today);
    horizon.setDate(horizon.getDate() + 7);
    const horizonIso = horizon.toISOString().slice(0, 10);
    const ids = new Set<string>();
    for (const occ of getUserMeetInstances(currentUserId)) {
      if (occ.date >= todayIso && occ.date <= horizonIso) {
        ids.add(occ.meet.id);
      }
    }
    return ids.size;
  }, [currentUserId, newUserMode]);
  const showDiscoveryBanner =
    !newUserMode && userGroups.length > 0 && nearTermMeetSeriesCount < 2;

  // Filter groups by selected category
  const filteredGroups = useMemo(() => {
    if (activeCategory === "all") return userGroups;
    return userGroups.filter((g) => g.groupType === activeCategory);
  }, [userGroups, activeCategory]);

  // Filter feed items by selected category
  const feedItems = useMemo(() => {
    if (activeCategory === "all") return allFeedItems;
    const groupIdsOfType = new Set(
      userGroups.filter((g) => g.groupType === activeCategory).map((g) => g.id)
    );
    return allFeedItems.filter((item) => {
      if (item.type === "community_post" || item.type === "personal_post") {
        const post = (item as any).post;
        if (post?.groupId) return groupIdsOfType.has(post.groupId);
        return false;
      }
      if (item.type === "upcoming_meet" || item.type === "meet_recap") {
        const meet = (item as any).meet;
        if (meet?.groupId) return groupIdsOfType.has(meet.groupId);
        return false;
      }
      return false;
    });
  }, [allFeedItems, activeCategory, userGroups]);

  // Header action button changes per tab.
  // Header-action convention (2026-05-11, Cross-Cutting Flow Testing):
  // outline + sm + leftIcon + text, no `cta` (rectangular). Reserves
  // brand-filled pills for row / hero CTAs so the hierarchy reads clearly.
  // See `design-system.md` → "Header actions."
  const headerAction = mainTab === "groups" ? (
    <ButtonAction
      variant="outline"
      size="sm"
      leftIcon={<Plus size={14} weight="bold" />}
      href="/communities/create"
    >
      Create
    </ButtonAction>
  ) : (
    <ButtonAction
      variant="outline"
      size="sm"
      leftIcon={<CameraPlusFill size={14} />}
      onClick={() => openComposer()}
    >
      Post
    </ButtonAction>
  );

  return (
    <PageColumn title="Community" headerAction={headerAction}>
      {/* Single scroll body — tabs sticky inside for glassmorphism */}
      <div className="page-column-panel-body">
        {/* Sticky glass tab bar */}
        <div className="page-column-panel-tabs">
          <TabBar tabs={MAIN_TABS} activeKey={mainTab} onChange={handleMainTabChange} />
        </div>

          {/* Groups view */}
          {mainTab === "groups" && (
            <>
              {/* Category filter pills */}
              <FilterPillRow
                pills={CATEGORY_PILLS}
                activeKey={activeCategory}
                onChange={(key) => setActiveCategory(key as GroupType | "all")}
              />

              {/* Group cards */}
              {filteredGroups.length > 0 ? (
                <div className="community-group-list">
                  {filteredGroups.map((group) => (
                    <CardGroup key={group.id} group={group} variant="my-groups" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-md p-xl text-center">
                  <p className="text-fg-tertiary text-md">
                    {activeCategory === "all"
                      ? "You haven\u2019t joined any groups yet."
                      : "No groups match your filters."}
                  </p>
                  <Link
                    href="/discover/groups"
                    className="text-brand-main font-semibold text-md"
                    style={{ textDecoration: "none" }}
                  >
                    Explore groups →
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Feed view */}
          {mainTab === "feed" && (
            <>
              {/* Share-moment invitation strip — same component as the
                  own-profile Posts tab top. Surfaces the tag-taxonomy
                  affordances (Photo / Dog / Location / Group) alongside
                  the input prompt. The header-action "Post" button is
                  the compact sticky equivalent for scroll-down state;
                  the bar is the in-feed invitation. Suppressed for
                  newUserMode where DogsNearYou leads the feed and the
                  user hasn't built community yet. 2026-05-13. */}
              {!newUserMode && <ShareMomentBar />}
              {newUserMode ? (
                <>
                  <DogsNearYou />
                  {getNewUserFeed()
                    .filter((i) => !hideInWalkthrough(i))
                    .map((item) => (
                      <FeedItemRenderer key={item.feedId} item={item} />
                    ))}
                </>
              ) : (
                <>
                  {feedItems.map((item, idx) => (
                    <div key={item.feedId}>
                      <FeedItemRenderer item={item} />
                      {/* Discovery banner — slotted at index 1 (after the
                          second post = visual position 4 with the
                          ShareMomentBar counted as row 1). Lands above
                          the fold on a typical viewport rather than
                          requiring scroll. Fallback for short feeds
                          (e.g. a Marketplace Owner whose joined groups
                          are quiet): render after the final item instead.
                          Moved from idx=2 → idx=1 on CCFT F3.1 polish
                          pass (2026-05-13) — fifth-row position read as
                          too buried. */}
                      {showDiscoveryBanner && idx === Math.min(1, feedItems.length - 1) && (
                        <DiscoveryBanner
                          icon={MagnifyingGlass}
                          title="Find a meet near you"
                          subtitle={
                            userGroups.length === 1
                              ? `Your group has events you haven't RSVP'd to yet.`
                              : `Your groups have events you haven't RSVP'd to yet.`
                          }
                          href="/discover/meets"
                          ctaLabel="Browse"
                        />
                      )}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
      </div>
    </PageColumn>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageInner />
    </Suspense>
  );
}
