"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { TabBar } from "@/components/ui/TabBar";
import { DiscoverTab } from "@/components/activity/DiscoverTab";
import { MyScheduleTab } from "@/components/activity/MyScheduleTab";
import { ServicesTab } from "@/components/activity/ServicesTab";

const TABS = [
  { key: "discover", label: "Discover" },
  { key: "schedule", label: "My Schedule" },
  { key: "services", label: "Services" },
];

function ActivityPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "discover";

  const handleTabChange = (key: string) => {
    router.replace(`/activity?tab=${key}`, { scroll: false });
  };

  return (
    <>
      <div className="page-container activity-page">
        {/* Tab header — sticky, doesn't scroll */}
        <div className="activity-tab-header">
          <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
        </div>

        {/* Scrollable body */}
        <div className="activity-body">
          {activeTab === "discover" && <DiscoverTab />}
          {activeTab === "schedule" && <MyScheduleTab />}
          {activeTab === "services" && <ServicesTab />}
        </div>
      </div>

      {/* Spacer to keep content centered (no side panel on activities) */}
      <div className="page-spacer" aria-hidden="true" />
    </>
  );
}

export default function ActivityPage() {
  return (
    <Suspense fallback={null}>
      <ActivityPageInner />
    </Suspense>
  );
}
