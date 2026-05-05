import type { CarerAvailabilitySlot, DayOfWeek, TimeSlot } from "@/lib/types";

const ALL_DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ALL_SLOTS: TimeSlot[] = ["morning", "afternoon", "evening"];

/**
 * Read-only weekly availability grid. Renders all 7 days and all 3
 * time-of-day slots — inactive cells are heavily muted so the eye skims
 * past them but the column anchor remains. Pattern recognition ("weekday
 * mornings", "weekends only") is faster with consistent anchor points
 * than scanning a sparse list.
 *
 * Used on:
 *   - Own profile view-mode (`ProfileServicesTab`)
 *   - Viewer-side public profile (`app/profile/[userId]/page.tsx`)
 *
 * Edit mode uses interactive `.pill` toggles instead — different contract,
 * stays a separate inline implementation. Pricing & Proposals, 2026-05-04.
 */
export function AvailabilityGrid({
  availability,
}: {
  availability: CarerAvailabilitySlot[];
}) {
  return (
    <div className="profile-avail-grid">
      {ALL_DAYS.map((day) => {
        const dayData = availability.find((a) => a.day === day);
        const activeSlots = dayData?.slots ?? [];
        return (
          <div key={day} className="profile-avail-row">
            <span className="profile-avail-day">{day}</span>
            <div className="profile-avail-slots">
              {ALL_SLOTS.map((slot) => {
                const isActive = activeSlots.includes(slot);
                return (
                  <span
                    key={slot}
                    className={`profile-avail-slot${isActive ? "" : " profile-avail-slot--off"}`}
                  >
                    {slot}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
