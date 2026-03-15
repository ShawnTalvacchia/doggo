import type { UserProfile } from "./types";

export const mockUser: UserProfile = {
  id: "shawn",
  firstName: "Shawn",
  lastName: "Talvacchia",
  email: "stalvacchia@gmail.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  bio: "Dog dad and remote worker based in Prague 2. I love exploring Vinohrady and Žižkov parks with my dogs and am always looking for reliable, caring people to help out when I'm busy or travelling.",
  location: "Prague 2, Czech Republic",
  memberSince: "2025-01",
  pets: [
    {
      id: "spot",
      name: "Spot",
      breed: "Dalmatian Mix",
      weightLabel: "18 kg",
      ageLabel: "4 years",
      imageUrl:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80",
      notes: "Friendly but can be nervous with new dogs. Loves fetch and long walks.",
    },
    {
      id: "goldie",
      name: "Goldie",
      breed: "Golden Retriever",
      weightLabel: "28 kg",
      ageLabel: "2 years",
      imageUrl:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
      notes: "Very social, gets along with everyone. Still learning to walk nicely on leash.",
    },
  ],
  carerProfile: {
    bio: "I offer daily dog walks in the Vinohrady and Žižkov area. I have experience with dogs of all sizes and genuinely enjoy spending time with them.",
    location: "Prague 2 – Vinohrady",
    availability: [
      { day: "Mon", slots: ["morning", "afternoon"] },
      { day: "Tue", slots: ["morning"] },
      { day: "Wed", slots: ["morning", "afternoon"] },
      { day: "Thu", slots: ["morning"] },
      { day: "Fri", slots: ["morning", "afternoon"] },
      { day: "Sat", slots: ["morning", "afternoon", "evening"] },
      { day: "Sun", slots: ["morning"] },
    ],
    services: [
      {
        serviceType: "walk_checkin",
        enabled: true,
        pricePerUnit: 280,
        priceUnit: "per_visit",
        subServices: ["Solo walk", "Group walk"],
        notes: "45–60 min walks around Riegrovy sady and Vítkov park. Max 3 dogs.",
      },
    ],
    publicProfile: true,
  },
};
