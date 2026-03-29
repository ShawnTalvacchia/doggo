"use client";

import { mockMeets } from "@/lib/mockMeets";
import { mockUser } from "@/lib/mockUser";
import { getFeedForUser, getNewUserFeed } from "@/lib/mockFeed";
import { DEMO_NEW_USER } from "@/lib/mockUserState";
import { HomeWelcome } from "@/components/home/HomeWelcome";
import { DogsNearYou } from "@/components/home/DogsNearYou";
import { CompactGreeting } from "@/components/feed/CompactGreeting";
import { UpcomingStrip } from "@/components/feed/UpcomingStrip";
import { UpcomingPanel } from "@/components/home/UpcomingPanel";
import { FeedPersonalPost } from "@/components/feed/FeedPersonalPost";
import { FeedCommunityPost } from "@/components/feed/FeedCommunityPost";
import { FeedMeetRecap } from "@/components/feed/FeedMeetRecap";
import { FeedUpcomingMeet } from "@/components/feed/FeedUpcomingMeet";
import { FeedConnectionActivity } from "@/components/feed/FeedConnectionActivity";
import { FeedConnectionNudge } from "@/components/feed/FeedConnectionNudge";
import { FeedCarePrompt } from "@/components/feed/FeedCarePrompt";
import { FeedMilestone } from "@/components/feed/FeedMilestone";
import { FeedDogMoment } from "@/components/feed/FeedDogMoment";
import { FeedCareReview } from "@/components/feed/FeedCareReview";
import type { FeedItem } from "@/lib/types";

function FeedItemRenderer({ item }: { item: FeedItem }) {
  switch (item.type) {
    case "personal_post":
      return <FeedPersonalPost post={item.post} />;
    case "community_post":
      return <FeedCommunityPost post={item.post} />;
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

export default function HomePage() {
  const feedItems = getFeedForUser("shawn");

  // Meets the user is attending (for the upcoming side panel)
  const myUpcoming = mockMeets
    .filter((m) => m.status === "upcoming" && m.attendees.some((a) => a.userId === "shawn"))
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 5);

  return (
    <>
      {/* Main content column */}
      <div className="page-container flex flex-col bg-surface-base min-h-screen">
        {DEMO_NEW_USER ? (
          <>
            <HomeWelcome />
            <DogsNearYou />
            <div className="feed-list">
              {getNewUserFeed().map((item) => (
                <FeedItemRenderer key={item.feedId} item={item} />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Header: greeting + Add Post / Find Care */}
            <div className="home-header">
              <CompactGreeting user={mockUser} />
            </div>

            {/* Upcoming strip — shown on mobile/tablet when side panel is hidden */}
            <div className="home-upcoming-inline">
              <UpcomingStrip meets={myUpcoming} />
            </div>

            {/* Social feed */}
            <div className="feed-list">
              {feedItems.map((item) => (
                <FeedItemRenderer key={item.feedId} item={item} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Side panel: Your Upcoming (desktop only, hidden on mobile via CSS) */}
      {!DEMO_NEW_USER && <UpcomingPanel meets={myUpcoming} />}
    </>
  );
}
