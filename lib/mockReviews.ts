import type { UserReview } from "./types";

export const mockReviews: UserReview[] = [
  {
    id: "review-petra-1",
    bookingId: "booking-petra-dropins",
    authorId: "shawn",
    authorName: "Shawn T.",
    carerName: "Petra Veselá",
    carerAvatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    text: "Petra was wonderful with Spot and Goldie over the holidays. She sent daily updates and photos, and the dogs were clearly happy and well looked after. Would absolutely book again.",
    createdAt: "2025-12-29T10:00:00Z",
  },
];
