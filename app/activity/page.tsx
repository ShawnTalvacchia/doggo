"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function ActivityRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab === "schedule") {
      router.replace("/schedule");
    } else if (tab === "services") {
      router.replace("/bookings?tab=services");
    } else {
      router.replace("/discover");
    }
  }, [tab, router]);

  return null;
}

export default function ActivityPage() {
  return (
    <Suspense fallback={null}>
      <ActivityRedirect />
    </Suspense>
  );
}
