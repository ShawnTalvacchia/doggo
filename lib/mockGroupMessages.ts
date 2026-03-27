import type { GroupMessage } from "./types";

export const mockGroupMessages: Record<string, GroupMessage[]> = {
  "group-1": [
    {
      id: "gm-sys-1",
      groupId: "group-1",
      senderId: "",
      senderName: "",
      senderAvatarUrl: "",
      text: "Eva joined the community",
      sentAt: "2026-03-16T12:00:00Z",
      type: "system",
      activityType: "member_joined",
    },
    {
      id: "gm-1",
      groupId: "group-1",
      senderId: "shawn",
      senderName: "Shawn",
      senderAvatarUrl:
        "/images/generated/shawn-profile.jpg",
      text: "Morning everyone! Walk is on for Wednesday as usual. Spot is extra energetic this week 😅",
      sentAt: "2026-03-17T08:30:00Z",
    },
    {
      id: "gm-sys-2",
      groupId: "group-1",
      senderId: "",
      senderName: "",
      senderAvatarUrl: "",
      text: "New meet: Wednesday Morning Walk",
      sentAt: "2026-03-17T08:35:00Z",
      type: "system",
      activityType: "meet_posted",
    },
    {
      id: "gm-2",
      groupId: "group-1",
      senderId: "jana",
      senderName: "Jana",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      text: "We'll be there! Rex has been cooped up all weekend, he needs a good run.",
      sentAt: "2026-03-17T09:15:00Z",
    },
    {
      id: "gm-sys-3",
      groupId: "group-1",
      senderId: "",
      senderName: "",
      senderAvatarUrl: "",
      text: "3 people RSVP'd to Wednesday Morning Walk",
      sentAt: "2026-03-17T09:20:00Z",
      type: "system",
      activityType: "rsvp_milestone",
    },
    {
      id: "gm-3",
      groupId: "group-1",
      senderId: "tomas",
      senderName: "Tomáš",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      text: "Count me in. Should we try the lower path this time? Bella loved it last time.",
      sentAt: "2026-03-17T10:00:00Z",
    },
    {
      id: "gm-4",
      groupId: "group-1",
      senderId: "shawn",
      senderName: "Shawn",
      senderAvatarUrl:
        "/images/generated/shawn-profile.jpg",
      text: "Good idea! Lower path it is. See you at 8 by the main entrance.",
      sentAt: "2026-03-17T10:30:00Z",
    },
  ],
  "group-2": [
    {
      id: "gm-sys-4",
      groupId: "group-2",
      senderId: "",
      senderName: "",
      senderAvatarUrl: "",
      text: "Martin joined the community",
      sentAt: "2026-03-18T10:00:00Z",
      type: "system",
      activityType: "member_joined",
    },
    {
      id: "gm-5",
      groupId: "group-2",
      senderId: "jana",
      senderName: "Jana",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      text: "Saturday playdate is on! The field by the pond should be nice and dry.",
      sentAt: "2026-03-19T14:00:00Z",
    },
    {
      id: "gm-6",
      groupId: "group-2",
      senderId: "eva",
      senderName: "Eva",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      text: "Luna and Max are ready! Should I bring the frisbee?",
      sentAt: "2026-03-19T15:20:00Z",
    },
    {
      id: "gm-sys-5",
      groupId: "group-2",
      senderId: "",
      senderName: "",
      senderAvatarUrl: "",
      text: "New meet: Saturday Puppy Playdate",
      sentAt: "2026-03-19T15:25:00Z",
      type: "system",
      activityType: "meet_posted",
    },
    {
      id: "gm-7",
      groupId: "group-2",
      senderId: "martin",
      senderName: "Martin",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      text: "Yes! Charlie loves the frisbee. See you all there.",
      sentAt: "2026-03-19T16:00:00Z",
    },
  ],
};

/** Get chat messages for a group */
export function getMessagesForGroup(groupId: string): GroupMessage[] {
  return mockGroupMessages[groupId] || [];
}
