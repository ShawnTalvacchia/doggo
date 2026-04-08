"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { mockUser } from "@/lib/mockUser";
import { getFeedForUser, getNewUserFeed } from "@/lib/mockFeed";
import { DEMO_NEW_USER } from "@/lib/mockUserState";
import { HomeWelcome } from "@/components/home/HomeWelcome";
import { DogsNearYou } from "@/components/home/DogsNearYou";
import { FeedCTA } from "@/components/feed/FeedCTA";
import { MomentCardFromPost } from "@/components/feed/MomentCard";
import { FeedMeetRecap } from "@/components/feed/FeedMeetRecap";
import { FeedUpcomingMeet } from "@/components/feed/FeedUpcomingMeet";
import { FeedConnectionActivity } from "@/components/feed/FeedConnectionActivity";
import { FeedConnectionNudge } from "@/components/feed/FeedConnectionNudge";
import { FeedCarePrompt } from "@/components/feed/FeedCarePrompt";
import { FeedMilestone } from "@/components/feed/FeedMilestone";
import { FeedDogMoment } from "@/components/feed/FeedDogMoment";
import { FeedCareReview } from "@/components/feed/FeedCareReview";
import { TabBar } from "@/components/ui/TabBar";
import { MasterDetailShell, type MobileView } from "@/components/layout/MasterDetailShell";
import { PanelBody } from "@/components/layout/PanelBody";
import { Spacer } from "@/components/layout/Spacer";
import { LayoutList } from "@/components/layout/LayoutList";
import { CardGroup } from "@/components/groups/CardGroup";
import { getUserGroups, getGroupById } from "@/lib/mockGroups";
import type { FeedItem, GroupType } from "@/lib/types";

// ── Feed rendering ──────────────────────────────────────────────────────────

function FeedItemRenderer({ item }: { item: FeedItem }) {
  switch (item.type) {
    case "personal_post":
      return <MomentCardFromPost post={item.post} />;
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
    default:
      return null;
  }
}

// ── Category tabs ──────────────────────────────────────────────────────────

type CategoryTab = "all" | "parks" | "neighbors" | "interest" | "care";

const CATEGORY_TABS: { key: CategoryTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "parks", label: "Parks" },
  { key: "neighbors", label: "Neighbors" },
  { key: "interest", label: "Interest" },
  { key: "care", label: "Care" },
];

/** Map category tab key to GroupType for filtering */
const TAB_TO_GROUP_TYPE: Record<CategoryTab, GroupType | null> = {
  all: null,
  parks: "park",
  neighbors: "neighbor",
  interest: "interest",
  care: "care",
};

// ── Panel header label per tab ─────────────────────────────────────────────

const TAB_PANEL_TITLE: Record<CategoryTab, string> = {
  all: "Community",
  parks: "Parks",
  neighbors: "Neighbors",
  interest: "Interest",
  care: "Care",
};

// ── Main page ───────────────────────────────────────────────────────────────

function HomePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = (searchParams.get("tab") as CategoryTab) || "all";

  const handleTabChange = (key: string) => {
    if (key === "all") {
      router.replace("/home", { scroll: false });
    } else {
      router.replace(`/home?tab=${key}`, { scroll: false });
    }
  };

  // Collapsed/mobile: show the group list (category tabs filter it).
  // Tapping a group navigates to /communities/[id] for detail.
  // Desktop: both panels visible — list (left) + feed (right).
  const mobileView: MobileView = "list";

  const userGroups = getUserGroups("shawn");
  const allFeedItems = getFeedForUser("shawn");
  const dogPhotos = mockUser.pets.map((p) => p.imageUrl);

  // Filter groups by active category tab
  const groupType = TAB_TO_GROUP_TYPE[activeTab];
  const filteredGroups = useMemo(() => {
    if (!groupType) return userGroups;
    return userGroups.filter((g) => g.groupType === groupType);
  }, [userGroups, groupType]);

  // Filter feed by active category tab
  const feedItems = useMemo(() => {
    if (!groupType) return allFeedItems;
    const groupIdsOfType = new Set(
      userGroups.filter((g) => g.groupType === groupType).map((g) => g.id)
    );
    return allFeedItems.filter((item) => {
      if (item.type === "community_post" || item.type === "personal_post") {
        const post = (item as any).post;
        if (post?.groupId) return groupIdsOfType.has(post.groupId);
        // Personal posts show only in "all"
        return false;
      }
      if (item.type === "upcoming_meet" || item.type === "meet_recap") {
        const meet = (item as any).meet;
        if (meet?.groupId) return groupIdsOfType.has(meet.groupId);
        return false;
      }
      return false;
    });
  }, [allFeedItems, groupType, userGroups]);

  // Count groups per category for potential badge display
  const groupCounts = useMemo(() => {
    const counts: Record<CategoryTab, number> = { all: userGroups.length, parks: 0, neighbors: 0, interest: 0, care: 0 };
    for (const g of userGroups) {
      if (g.groupType === "park") counts.parks++;
      else if (g.groupType === "neighbor") counts.neighbors++;
      else if (g.groupType === "interest") counts.interest++;
      else if (g.groupType === "care") counts.care++;
    }
    return counts;
  }, [userGroups]);

  const panelTitle = TAB_PANEL_TITLE[activeTab];

  return (
    <div className="page-container home-page-shell">
      {/* TabBar — visible on collapsed/mobile, hidden on desktop */}
      <div className="panel-tabbar home-tab-bar" data-view="list">
        <div className="panel-tabbar-list">
          <div className="panel-tabbar-title">Community</div>
          <div className="panel-tabbar-tabs">
            <TabBar tabs={CATEGORY_TABS} activeKey={activeTab} onChange={handleTabChange} />
          </div>
        </div>
      </div>

      <MasterDetailShell
        mobileView={mobileView}
        listPanel={
          <div className="list-panel">
            {/* Header — visible on desktop, hidden on mobile/collapsed */}
            <div className="list-panel-header panel-header-desktop">
              <h2 className="font-heading text-lg font-bold text-fg-primary m-0">
                Community
              </h2>
            </div>
            {/* Category tabs — desktop: below header, same TabBar as other pages. Mobile uses panel-tabbar above. */}
            <div className="list-panel-filters panel-header-desktop">
              <TabBar tabs={CATEGORY_TABS} activeKey={activeTab} onChange={handleTabChange} />
            </div>

            {/* Body — scrollable group list */}
            <PanelBody>
              <LayoutList>
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <CardGroup key={group.id} group={group} variant="my-groups" />
                  ))
                ) : (
                  <div className="flex flex-col items-center gap-md p-xl text-center">
                    <p className="text-fg-tertiary text-md">
                      {activeTab === "all"
                        ? "You haven\u2019t joined any groups yet."
                        : `No ${panelTitle.toLowerCase()} groups yet.`}
                    </p>
                    <a
                      href="/discover/groups"
                      className="text-brand-main font-semibold text-md"
                      style={{ textDecoration: "none" }}
                    >
                      Explore groups →
                    </a>
                  </div>
                )}
              </LayoutList>
              <Spacer />
            </PanelBody>
          </div>
        }
        detailPanel={
          <div className="detail-panel">
            <PanelBody>
              {DEMO_NEW_USER ? (
                <>
                  <HomeWelcome />
                  <DogsNearYou />
                  <LayoutList>
                    {getNewUserFeed().map((item) => (
                      <FeedItemRenderer key={item.feedId} item={item} />
                    ))}
                  </LayoutList>
                </>
              ) : (
                <LayoutList>
                  <FeedCTA dogPhotos={dogPhotos} />
                  {feedItems.map((item) => (
                    <FeedItemRenderer key={item.feedId} item={item} />
                  ))}
                </LayoutList>
              )}
              <Spacer />
            </PanelBody>
          </div>
        }
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageInner />
    </Suspense>
  );
}
