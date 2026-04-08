import type { MeetMessage } from "./types";

export const mockMeetMessages: Record<string, MeetMessage[]> = {
  // Messages for meet-1 (Morning walk — Riegrovy sady)
  "meet-1": [
    {
      id: "msg-1-1",
      meetId: "meet-1",
      senderId: "shawn",
      senderName: "Shawn",
      senderAvatarUrl:
        "/images/generated/shawn-profile.jpg",
      text: "Looking forward to Wednesday! I'll be at the main entrance at 8.",
      sentAt: "2026-03-16T18:00:00Z",
    },
    {
      id: "msg-1-2",
      meetId: "meet-1",
      senderId: "jana",
      senderName: "Jana",
      senderAvatarUrl:
        "/images/generated/jana-profile.jpeg",
      text: "Great! Rex and I will be there. Should we do the upper loop or the path by the beer garden?",
      sentAt: "2026-03-16T18:05:00Z",
    },
    {
      id: "msg-1-3",
      meetId: "meet-1",
      senderId: "shawn",
      senderName: "Shawn",
      senderAvatarUrl:
        "/images/generated/shawn-profile.jpg",
      text: "Upper loop! More space for the dogs off-leash once we're past the playground.",
      sentAt: "2026-03-16T18:08:00Z",
    },
    {
      id: "msg-1-4",
      meetId: "meet-1",
      senderId: "tomas",
      senderName: "Tomáš",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      text: "Bella and I are in. Might be 5 min late — dropping kid at school first.",
      sentAt: "2026-03-16T19:30:00Z",
    },
  ],
  // Messages for meet-2 (Weekend playdate — Stromovka)
  "meet-2": [
    {
      id: "msg-2-1",
      meetId: "meet-2",
      senderId: "jana",
      senderName: "Jana",
      senderAvatarUrl:
        "/images/generated/jana-profile.jpeg",
      text: "Who's bringing a ball? Rex destroyed ours last weekend 😅",
      sentAt: "2026-03-19T10:00:00Z",
    },
    {
      id: "msg-2-2",
      meetId: "meet-2",
      senderId: "eva",
      senderName: "Eva",
      senderAvatarUrl:
        "/images/generated/eva-profile.jpeg",
      text: "I've got a couple! Luna won't share but Max will.",
      sentAt: "2026-03-19T10:15:00Z",
    },
    {
      id: "msg-2-3",
      meetId: "meet-2",
      senderId: "martin",
      senderName: "Martin",
      senderAvatarUrl:
        "/images/generated/martin-profile.jpeg",
      text: "Charlie's bringing his tug rope too. See everyone Saturday!",
      sentAt: "2026-03-19T11:00:00Z",
    },
  ],
  // Completed meet (meet-6) — post-meet conversation
  "meet-6": [
    {
      id: "msg-6-1",
      meetId: "meet-6",
      senderId: "shawn",
      senderName: "Shawn",
      senderAvatarUrl:
        "/images/generated/shawn-profile.jpg",
      text: "That was a great walk! Spot and Rex really hit it off.",
      sentAt: "2026-03-16T10:15:00Z",
    },
    {
      id: "msg-6-2",
      meetId: "meet-6",
      senderId: "jana",
      senderName: "Jana",
      senderAvatarUrl:
        "/images/generated/jana-profile.jpeg",
      text: "Agreed! Same time next Sunday?",
      sentAt: "2026-03-16T10:20:00Z",
    },
    {
      id: "msg-6-3",
      meetId: "meet-6",
      senderId: "eva",
      senderName: "Eva",
      senderAvatarUrl:
        "/images/generated/eva-profile.jpeg",
      text: "Luna loved it. She's already napping 🐕",
      sentAt: "2026-03-16T10:25:00Z",
    },
  ],
};

export function getMessagesForMeet(meetId: string): MeetMessage[] {
  return mockMeetMessages[meetId] || [];
}
