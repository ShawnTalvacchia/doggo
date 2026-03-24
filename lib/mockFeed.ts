import type {
  FeedItem,
  FeedPostItem,
  FeedMeetRecapItem,
  FeedUpcomingMeetItem,
  FeedConnectionActivityItem,
  FeedConnectionNudgeItem,
  FeedCarePromptItem,
  FeedMilestoneItem,
  FeedDogMomentItem,
  FeedCareReviewItem,
} from "./types";
import { mockPosts } from "./mockPosts";
import { mockMeets } from "./mockMeets";
import { mockConnections } from "./mockConnections";
import { mockGroups } from "./mockGroups";
import { mockUser } from "./mockUser";

export function getFeedForUser(userId: string): FeedItem[] {
  const items: FeedItem[] = [];

  // 1. Recent posts (personal + community)
  for (const post of mockPosts) {
    const feedItem: FeedPostItem = {
      feedId: `feed-post-${post.id}`,
      type: post.groupId ? "community_post" : "personal_post",
      timestamp: post.createdAt,
      post,
    };
    items.push(feedItem);
  }

  // 2. Completed meets as recaps
  const completedMeets = mockMeets.filter((m) => m.status === "completed" && m.photos && m.photos.length > 0);
  for (const meet of completedMeets) {
    const recapItem: FeedMeetRecapItem = {
      feedId: `feed-recap-${meet.id}`,
      type: "meet_recap",
      timestamp: meet.createdAt,
      meet,
    };
    items.push(recapItem);
  }

  // 3. Upcoming meets (next 2-3)
  const upcomingMeets = mockMeets
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 2);
  for (const meet of upcomingMeets) {
    const upcomingItem: FeedUpcomingMeetItem = {
      feedId: `feed-upcoming-${meet.id}`,
      type: "upcoming_meet",
      timestamp: meet.date, // sort by meet date
      meet,
    };
    items.push(upcomingItem);
  }

  // 4. Connection activity — mock a couple of recent events
  const activityItems: FeedConnectionActivityItem[] = [
    {
      feedId: "feed-activity-1",
      type: "connection_activity",
      timestamp: "2026-03-21T16:00:00Z",
      userId: "jana",
      userName: "Jana",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      activity: "added Dog Walking services",
      connectionContext: "3 meets together",
    },
    {
      feedId: "feed-activity-2",
      type: "connection_activity",
      timestamp: "2026-03-20T10:00:00Z",
      userId: "eva",
      userName: "Eva",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      activity: "joined Letná Recall Training",
      connectionContext: "Familiar",
    },
  ];
  items.push(...activityItems);

  // 5. Connection nudge — familiar connections the user hasn't connected with
  const familiarConnections = mockConnections.filter((c) => c.state === "familiar");
  if (familiarConnections.length > 0) {
    const nudge = familiarConnections[0];
    const nudgeItem: FeedConnectionNudgeItem = {
      feedId: `feed-nudge-${nudge.userId}`,
      type: "connection_nudge",
      timestamp: "2026-03-21T08:00:00Z",
      userId: nudge.userId,
      userName: nudge.userName,
      avatarUrl: nudge.avatarUrl,
      dogNames: nudge.dogNames,
      sharedMeets: nudge.meetsShared ?? 0,
    };
    items.push(nudgeItem);
  }

  // 6. Care prompts
  const findCarePrompt: FeedCarePromptItem = {
    feedId: "feed-find-care",
    type: "find_care_prompt",
    timestamp: "2026-03-19T12:00:00Z",
    text: `Need help with ${mockUser.pets[0]?.name ?? "your dog"}? ${mockConnections.filter((c) => c.state === "connected").length} people in your network offer care.`,
    ctaLabel: "Find care",
    ctaHref: "/explore/results",
  };
  items.push(findCarePrompt);

  if (!mockUser.openToHelping) {
    const offerCarePrompt: FeedCarePromptItem = {
      feedId: "feed-offer-care",
      type: "offer_care_prompt",
      timestamp: "2026-03-18T12:00:00Z",
      text: "Your connections are looking for help — want to offer care?",
      ctaLabel: "Set up",
      ctaHref: "/profile?tab=services",
    };
    items.push(offerCarePrompt);
  }

  // 7. Milestone
  const milestone: FeedMilestoneItem = {
    feedId: "feed-milestone-1",
    type: "milestone",
    timestamp: "2026-03-20T06:00:00Z",
    text: "50 dogs walked in Vinohrady this month",
    subtext: "Your neighbourhood is getting active!",
  };
  items.push(milestone);

  // 8. Dog moment
  const dogMoment: FeedDogMomentItem = {
    feedId: "feed-dog-moment-1",
    type: "dog_moment",
    timestamp: "2026-03-19T09:00:00Z",
    dogName: "Rex",
    ownerName: "Jana",
    ownerAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    momentText: "turned 3 today!",
  };
  items.push(dogMoment);

  // 9. Care review
  const careReview: FeedCareReviewItem = {
    feedId: "feed-review-1",
    type: "care_review",
    timestamp: "2026-03-18T15:00:00Z",
    reviewerName: "Martin",
    reviewerAvatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    carerName: "Jana",
    carerAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    rating: 5,
    snippet: "Jana is incredible with Charlie. He came back exhausted and happy every time.",
  };
  items.push(careReview);

  // Sort by timestamp descending
  items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return items;
}

/** Feed for new users — open community content, public meets, milestones */
export function getNewUserFeed(): FeedItem[] {
  const items: FeedItem[] = [];

  // Posts from open communities
  const openGroupIds = new Set(mockGroups.filter((g) => g.visibility === "open").map((g) => g.id));
  const openPosts = mockPosts.filter((p) => p.groupId && openGroupIds.has(p.groupId));
  for (const post of openPosts) {
    items.push({
      feedId: `feed-new-post-${post.id}`,
      type: "community_post",
      timestamp: post.createdAt,
      post,
    });
  }

  // Upcoming public meets
  const upcomingMeets = mockMeets
    .filter((m) => m.status === "upcoming")
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 3);
  for (const meet of upcomingMeets) {
    items.push({
      feedId: `feed-new-upcoming-${meet.id}`,
      type: "upcoming_meet",
      timestamp: meet.date,
      meet,
    });
  }

  // Completed meet recaps
  const recaps = mockMeets.filter((m) => m.status === "completed" && m.photos && m.photos.length > 0);
  for (const meet of recaps) {
    items.push({
      feedId: `feed-new-recap-${meet.id}`,
      type: "meet_recap",
      timestamp: meet.createdAt,
      meet,
    });
  }

  // Milestones
  items.push({
    feedId: "feed-new-milestone-1",
    type: "milestone",
    timestamp: "2026-03-20T06:00:00Z",
    text: "50 dogs walked in Vinohrady this month",
    subtext: "Your neighbourhood is getting active!",
  });

  items.push({
    feedId: "feed-new-milestone-2",
    type: "milestone",
    timestamp: "2026-03-18T06:00:00Z",
    text: "12 communities active in Prague this week",
    subtext: "Find one near you!",
  });

  items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return items;
}
