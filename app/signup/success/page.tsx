"use client";

import { useRouter } from "next/navigation";
import { CalendarDots, PawPrint } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { MeetCard } from "@/components/meets/MeetCard";
import { getUpcomingMeets } from "@/lib/mockMeets";
import { getNeighbourhoodStats } from "@/lib/mockNeighbourhoodStats";

export default function SignupSuccessPage() {
  const router = useRouter();
  const nearbyMeets = getUpcomingMeets().slice(0, 2);
  const stats = getNeighbourhoodStats();

  return (
    <main className="success-shell">
      <div className="success-content">
        <div className="success-main">
          <h1 className="success-heading">You&apos;re in!</h1>
          <p className="success-body-text">
            Your profile is ready. Find meets near you, connect with other dog owners, and build your community.
          </p>
          <div className="success-btn-row">
            <ButtonAction
              variant="primary"
              size="lg"
              cta
              onClick={() => router.push("/home")}
            >
              Go to Home
            </ButtonAction>
            <ButtonAction
              variant="secondary"
              size="lg"
              cta
              onClick={() => router.push("/activity")}
            >
              Browse Meets
            </ButtonAction>
          </div>

          {/* Nearby activity preview */}
          {nearbyMeets.length > 0 && (
            <div className="flex flex-col gap-md" style={{ marginTop: "var(--space-6)" }}>
              <h2 className="font-heading text-lg font-semibold text-fg-primary flex items-center gap-sm">
                <CalendarDots size={20} weight="light" className="text-brand-main" />
                What&apos;s happening near you
              </h2>
              <div className="flex flex-col gap-md">
                {nearbyMeets.map((meet) => (
                  <MeetCard key={meet.id} meet={meet} />
                ))}
              </div>
              <p className="flex items-center gap-xs text-sm text-fg-tertiary">
                <PawPrint size={14} weight="light" />
                {stats.dogsWalkedThisWeek} dogs walked in {stats.neighbourhood} this week
              </p>
            </div>
          )}

          <div className="success-offer-card">
            <div>
              <p className="success-offer-title">Want to offer care?</p>
              <p className="success-body-text">
                As you build connections through meets, you can start offering walking, sitting, or boarding to people you know.
              </p>
            </div>
            <ButtonAction
              variant="secondary"
              size="md"
              onClick={() => router.push("/profile?tab=services")}
            >
              Set up care services
            </ButtonAction>
          </div>
        </div>
      </div>
    </main>
  );
}
