import type { Conversation } from "@/lib/types";
import { SERVICE_LABELS } from "@/lib/constants/services";

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function InquiryChips({ conv }: { conv: Conversation }) {
  const inq = conv.inquiry;
  const petText = inq.pets?.length > 0 ? inq.pets.join(" & ") : inq.dogName;
  if (!petText && !inq.subService) return null;

  const serviceLabel = SERVICE_LABELS[inq.serviceType];
  const scheduleText = inq.recurringSchedule
    ? `Every ${inq.recurringSchedule.days.join(", ")}`
    : inq.startDate && inq.endDate
    ? `${formatShortDate(inq.startDate)} – ${formatShortDate(inq.endDate)}`
    : inq.startDate
    ? `From ${formatShortDate(inq.startDate)}`
    : null;

  return (
    <div className="inbox-inquiry-card">
      <div className="inbox-inquiry-chips">
        <span className="inbox-inquiry-chip">{serviceLabel}</span>
        {inq.subService && (
          <span className="inbox-inquiry-chip">{inq.subService}</span>
        )}
        {petText && <span className="inbox-inquiry-chip">{petText}</span>}
        {scheduleText && <span className="inbox-inquiry-chip">{scheduleText}</span>}
        {inq.bookingType === "ongoing" && (
          <span className="inbox-inquiry-chip inbox-inquiry-chip--ongoing">Ongoing</span>
        )}
      </div>
    </div>
  );
}
