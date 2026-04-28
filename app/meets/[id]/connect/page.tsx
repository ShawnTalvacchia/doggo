"use client";

/**
 * Legacy `/meets/[id]/connect` route.
 *
 * The post-meet review flow moved out of a full-page route into a stepped
 * ModalSheet mounted at app-layout level
 * (`components/meets/PostMeetReviewSheet.tsx`).
 *
 * This route remains as a thin redirect so existing mock notifications and
 * bookmarks still work:
 *
 *   1. On mount, open the review sheet for this meet
 *   2. `router.replace` to `/schedule` so the stray route doesn't linger
 *      in history or become re-bookmarkable.
 */

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePostMeetReview } from "@/contexts/PostMeetReviewContext";

export default function PostMeetConnectRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const { openReview } = usePostMeetReview();

  useEffect(() => {
    const meetId = typeof params.id === "string" ? params.id : params.id?.[0];
    if (meetId) openReview({ meetId });
    router.replace("/schedule");
  }, [openReview, router, params]);

  return null;
}
