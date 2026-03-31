"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { TabBar } from "@/components/ui/TabBar";
import { DiscoverTab } from "@/components/activity/DiscoverTab";
import { CareTab } from "@/components/discover/CareTab";

const TABS = [
  { key: "meets", label: "Meets" },
  { key: "care", label: "Care" },
];

function DiscoverPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "meets";

  const handleTabChange = (key: string) => {
    router.replace(`/discover?tab=${key}`, { scroll: false });
  };

  // Care tab uses its own full-width layout (explore-page grid)
  // Meets tab uses the standard page container
  if (activeTab === "care") {
    return (
      <div className="discover-page discover-page--care">
        <div className="discover-tab-header">
          <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
        </div>
        <CareTab />
      </div>
    );
  }

  return (
    <div className="page-container discover-page">
      <div className="discover-tab-header">
        <TabBar tabs={TABS} activeKey={activeTab} onChange={handleTabChange} />
      </div>
      <div className="discover-body">
        <DiscoverTab />
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverPageInner />
    </Suspense>
  );
}
