import type { GroupMessage } from "./types";

export const mockGroupMessages: Record<string, GroupMessage[]> = {
  "group-1": [
    {
      id: "gm-1",
      groupId: "group-1",
      senderId: "shawn",
      senderName: "Shawn",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      text: "Morning everyone! Walk is on for Wednesday as usual. Spot is extra energetic this week 😅",
      sentAt: "2026-03-17T08:30:00Z",
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
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      text: "Good idea! Lower path it is. See you at 8 by the main entrance.",
      sentAt: "2026-03-17T10:30:00Z",
    },
  ],
  "group-2": [
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
