"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Compass } from "@phosphor-icons/react";
import { TabBar } from "@/components/ui/TabBar";
import { DiscoverTab } from "@/components/activity/DiscoverTab";
import { MyScheduleTab } from "@/components/activity/MyScheduleTab";
import { BookingsTab } from "@/components/activity/BookingsTab";

const TABS = [
  { key: "discover", label: "Discover" },
  { key: "schedule", label: "My Schedule" },
  { key: "bookings", label: "Bookings" },
];

function ActivityPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "discover";

  const handleTabChange = (key: string) => {
    router.replace(`/activity?tab=${key}`, { scroll: false });
  };

  return (
    <div
      className="flex flex-col gap-xl p-xl"
      style={{ maxWidth: "var(--app-page-max-width)", margin: "0 auto", width: "100%" }}
    >
      <header className="flex items-center gap-sm pt-md">
        <Compass size={28} weight="light" className="text-brand-main" />
        <h1 className="font-heading text-4xl font-semibold text-fg-primary">Activity</h1>
      </header>

      <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />

      {activeTab === "discover" && <DiscoverTab />}
      {activeTab === "schedule" && <MyScheduleTab />}
      {activeTab === "bookings" && <BookingsTab />}
    </div>
  );
}

export default function ActivityPage() {
  return (
    <Suspense fallback={null}>
      <ActivityPageInner />
    </Suspense>
  );
}
