"use client";

/**
 * Legacy `/meets/create` route.
 *
 * The creation flow moved out of a full-page route into a ModalSheet
 * mounted at app-layout level (see `components/meets/MeetComposer.tsx`).
 * Entry points now call `useMeetComposer().openComposer({ groupId })`
 * directly. This route remains as a thin redirect so any bookmarks,
 * dev-menu links, or legacy `?groupId=` URLs still work:
 *
 *   1. On mount, open the composer (with optional prefilled group)
 *   2. Replace the URL with `/schedule` so the stray route doesn't linger
 *      in history or become re-bookmarkable.
 */

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMeetComposer } from "@/contexts/MeetComposerContext";

export default function CreateMeetRedirectPage() {
  return (
    <Suspense>
      <CreateMeetRedirectInner />
    </Suspense>
  );
}

function CreateMeetRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openComposer } = useMeetComposer();

  useEffect(() => {
    const groupId = searchParams.get("groupId") || undefined;
    openComposer({ groupId });
    router.replace("/schedule");
  }, [openComposer, router, searchParams]);

  return null;
}
