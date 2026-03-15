"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { mockReviews } from "@/lib/mockReviews";
import type { UserReview } from "@/lib/types";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ReviewsContextValue {
  reviews: UserReview[];
  hasReview: (bookingId: string) => boolean;
  getReview: (bookingId: string) => UserReview | undefined;
  addReview: (review: Omit<UserReview, "id" | "createdAt">) => void;
}

// ── Context ────────────────────────────────────────────────────────────────────

const ReviewsContext = createContext<ReviewsContextValue | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────────────

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<UserReview[]>(mockReviews);

  const hasReview = useCallback(
    (bookingId: string) => reviews.some((r) => r.bookingId === bookingId),
    [reviews]
  );

  const getReview = useCallback(
    (bookingId: string) => reviews.find((r) => r.bookingId === bookingId),
    [reviews]
  );

  const addReview = useCallback((review: Omit<UserReview, "id" | "createdAt">) => {
    const newReview: UserReview = {
      ...review,
      id: `review-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [...prev, newReview]);
  }, []);

  return (
    <ReviewsContext.Provider value={{ reviews, hasReview, getReview, addReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useReviews(): ReviewsContextValue {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used within ReviewsProvider");
  return ctx;
}
