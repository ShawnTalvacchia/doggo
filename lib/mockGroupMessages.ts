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
      text: "Count me in. Should we try the lower path this time? Hugo loved it last time.",
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

  /* ── Reactive Dog Support — tips thread ─────────────────────────────── */
  "group-reactive-dogs": [
    {
      id: "gm-rd-1",
      groupId: "group-reactive-dogs",
      senderId: "daniel",
      senderName: "Daniel",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      text: "Bára had a big breakthrough today — we passed a German Shepherd on the other side of the street and she just watched, no lunging. Three months ago that would've been impossible. Klára's threshold work really pays off.",
      sentAt: "2026-03-25T16:00:00Z",
    },
    {
      id: "gm-rd-2",
      groupId: "group-reactive-dogs",
      senderId: "hana",
      senderName: "Hana",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
      text: "That's amazing Daniel! Runa is still at the 'watch from a distance' stage but hearing your progress gives me hope. How far apart were you?",
      sentAt: "2026-03-25T16:25:00Z",
    },
    {
      id: "gm-rd-3",
      groupId: "group-reactive-dogs",
      senderId: "daniel",
      senderName: "Daniel",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      text: "Probably 8-10 metres? The key was that I saw the dog first and could redirect Bára's attention with a treat scatter. Klára calls it 'proactive management' — you set the dog up to succeed before they even notice.",
      sentAt: "2026-03-25T16:40:00Z",
    },
    {
      id: "gm-rd-4",
      groupId: "group-reactive-dogs",
      senderId: "klara",
      senderName: "Klára",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      text: "So proud of you both! 🎉 Daniel you've been so consistent with the protocol. Hana — Runa's 'watch from distance' IS the breakthrough. She's choosing to observe instead of react. That's huge. Give it time.",
      sentAt: "2026-03-25T17:05:00Z",
    },
    {
      id: "gm-rd-5",
      groupId: "group-reactive-dogs",
      senderId: "shawn",
      senderName: "Shawn",
      senderAvatarUrl:
        "/images/generated/shawn-profile.jpg",
      text: "Spot has been similar — the treat scatter trick works really well for him too. Question for the group: does anyone have tips for reactive behaviour specifically at doorways? Spot loses it when someone rings the bell.",
      sentAt: "2026-03-25T17:30:00Z",
    },
    {
      id: "gm-rd-6",
      groupId: "group-reactive-dogs",
      senderId: "klara",
      senderName: "Klára",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      text: "Great question Shawn. Doorbell reactivity is super common. Start by desensitising the bell sound at low volume — play it on your phone while Spot is relaxed and eating. Build up gradually. I can share a handout with the full protocol if you want?",
      sentAt: "2026-03-25T17:55:00Z",
    },
    {
      id: "gm-rd-7",
      groupId: "group-reactive-dogs",
      senderId: "shawn",
      senderName: "Shawn",
      senderAvatarUrl:
        "/images/generated/shawn-profile.jpg",
      text: "Yes please! That would be really helpful. Thanks Klára 🙏",
      sentAt: "2026-03-25T18:10:00Z",
    },
  ],

  /* ── Karlín Dog Neighbors — emergency care request ────────────────── */
  "group-karlin-neighbours": [
    {
      id: "gm-kn-sys-1",
      groupId: "group-karlin-neighbours",
      senderId: "",
      senderName: "",
      senderAvatarUrl: "",
      text: "Petra joined the community",
      sentAt: "2026-03-10T08:00:00Z",
      type: "system",
      activityType: "member_joined",
    },
    {
      id: "gm-kn-1",
      groupId: "group-karlin-neighbours",
      senderId: "tomas",
      senderName: "Tomáš",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      text: "Hey neighbours — bit of an emergency. I just got called to the hospital to see my mum. Is anyone able to take Hugo for a few hours this afternoon? He's friendly, walks well on leash, just needs company.",
      sentAt: "2026-03-17T11:00:00Z",
    },
    {
      id: "gm-kn-2",
      groupId: "group-karlin-neighbours",
      senderId: "petra",
      senderName: "Petra",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
      text: "I can take him Tomáš! Daisy would love the company. I'm home all afternoon. Drop him off whenever you need.",
      sentAt: "2026-03-17T11:12:00Z",
    },
    {
      id: "gm-kn-3",
      groupId: "group-karlin-neighbours",
      senderId: "tomas",
      senderName: "Tomáš",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      text: "Petra you're a lifesaver! I'll be there in 15 min with his leash and some treats. He hasn't been fed yet — his food is in the bag I'll bring.",
      sentAt: "2026-03-17T11:18:00Z",
    },
    {
      id: "gm-kn-4",
      groupId: "group-karlin-neighbours",
      senderId: "ondrej",
      senderName: "Ondřej",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80",
      text: "Hope your mum is okay Tomáš. If you need someone tomorrow too, I can help. Rocky and Hugo got along great at the riverside walk last week.",
      sentAt: "2026-03-17T11:25:00Z",
    },
    {
      id: "gm-kn-5",
      groupId: "group-karlin-neighbours",
      senderId: "tomas",
      senderName: "Tomáš",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      text: "Thanks Ondřej, I really appreciate it. Mum's stable but I might need help again this week. This group is honestly the best thing about living here.",
      sentAt: "2026-03-17T16:45:00Z",
    },
    {
      id: "gm-kn-6",
      groupId: "group-karlin-neighbours",
      senderId: "petra",
      senderName: "Petra",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
      text: "Hugo was an angel! He and Daisy napped together on the couch. Happy to have him anytime. 🐾",
      sentAt: "2026-03-17T17:00:00Z",
    },
  ],

  /* ── Klára's Calm Dog Sessions — session recap ────────────────────── */
  "group-klara-training": [
    {
      id: "gm-kt-sys-1",
      groupId: "group-klara-training",
      senderId: "",
      senderName: "",
      senderAvatarUrl: "",
      text: "New meet: Wednesday Socialisation Walk",
      sentAt: "2026-03-19T08:00:00Z",
      type: "system",
      activityType: "meet_posted",
    },
    {
      id: "gm-kt-1",
      groupId: "group-klara-training",
      senderId: "klara",
      senderName: "Klára",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      text: "Great session today everyone! Quick recap for those who were there:\n\n• Bára (Daniel) — amazing progress with parallel walking. She held focus for the whole circuit.\n• Toby (Filip) — recall is getting much better. Keep using the long line for now.\n• Spot (Shawn) — first session and he did well! Focus on the 'watch me' game before our next one.\n\nNext group session is Wednesday 2nd April, same time and place. Homework: 5 minutes of engagement games daily.",
      sentAt: "2026-03-26T14:00:00Z",
    },
    {
      id: "gm-kt-2",
      groupId: "group-klara-training",
      senderId: "daniel",
      senderName: "Daniel",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      text: "Thanks Klára! Really noticed the difference with Bára today. The parallel walking was much smoother than last time. She even glanced at Toby without stiffening up. 💪",
      sentAt: "2026-03-26T14:20:00Z",
    },
    {
      id: "gm-kt-3",
      groupId: "group-klara-training",
      senderId: "filip",
      senderName: "Filip",
      senderAvatarUrl:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
      text: "Toby was exhausted after that — best nap he's had in weeks 😄 Will keep up the long line work. See everyone next Wednesday!",
      sentAt: "2026-03-26T15:00:00Z",
    },
    {
      id: "gm-kt-4",
      groupId: "group-klara-training",
      senderId: "shawn",
      senderName: "Shawn",
      senderAvatarUrl:
        "/images/generated/shawn-profile.jpg",
      text: "Really glad I joined. Spot was nervous at first but Klára managed the introductions perfectly. The 'watch me' game is already working at home — he's starting to check in with me when he hears something instead of reacting. See you all next week!",
      sentAt: "2026-03-26T15:30:00Z",
    },
    {
      id: "gm-kt-sys-2",
      groupId: "group-klara-training",
      senderId: "",
      senderName: "",
      senderAvatarUrl: "",
      text: "4 people RSVP'd to Wednesday Socialisation Walk",
      sentAt: "2026-03-27T10:00:00Z",
      type: "system",
      activityType: "rsvp_milestone",
    },
  ],
};

/** Get chat messages for a group */
export function getMessagesForGroup(groupId: string): GroupMessage[] {
  return mockGroupMessages[groupId] || [];
}
