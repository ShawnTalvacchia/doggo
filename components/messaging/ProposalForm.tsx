"use client";

import { useState } from "react";
import type {
  Conversation,
  ServiceType,
  BookingType,
  RecurringSchedule,
  BookingPrice,
  BookingProposal,
} from "@/lib/types";
import { SERVICE_LABELS, SUB_SERVICES } from "@/lib/constants/services";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { InputField } from "@/components/ui/InputField";
import { ModalSheet } from "@/components/overlays/ModalSheet";

/**
 * Simplified proposal builder for carers.
 * Pre-fills from the inquiry data; carer can adjust price and confirm.
 */
export function ProposalForm({
  conv,
  open,
  onClose,
  onSubmit,
}: {
  conv: Conversation;
  open: boolean;
  onClose: () => void;
  onSubmit: (proposal: BookingProposal) => void;
}) {
  const inq = conv.inquiry;
  const ownerFirst = conv.ownerName.split(" ")[0];

  const [serviceType] = useState<ServiceType>(inq.serviceType);
  const [subService, setSubService] = useState<string | null>(inq.subService);
  const [bookingType] = useState<BookingType>(inq.bookingType);
  const [priceAmount, setPriceAmount] = useState<string>(getDefaultPrice(inq.serviceType));
  const [startDate] = useState(inq.startDate || "2026-09-01");
  const [endDate] = useState(inq.endDate);
  const [recurringSchedule] = useState<RecurringSchedule | undefined>(inq.recurringSchedule);

  const priceNum = parseInt(priceAmount, 10);
  const canSubmit = priceNum > 0;

  const priceUnit = serviceType === "walk_checkin" ? "per session"
    : serviceType === "inhome_sitting" ? "per night"
    : "per night";

  const billingCycle = serviceType === "walk_checkin" ? "per_session" as const
    : "per_night" as const;

  function handleSubmit() {
    if (!canSubmit) return;

    const label = subService || SERVICE_LABELS[serviceType];
    const price: BookingPrice = {
      lineItems: [{ label, amount: priceNum, unit: priceUnit }],
      total: priceNum,
      currency: "Kč",
      billingCycle,
    };

    const proposal: BookingProposal = {
      bookingType,
      serviceType,
      subService,
      pets: inq.pets.length > 0 ? inq.pets : [inq.dogName || "Pet"],
      startDate,
      endDate,
      recurringSchedule,
      price,
      status: "pending",
    };

    onSubmit(proposal);
  }

  const subOptions = SUB_SERVICES[serviceType];

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      title={`Proposal for ${ownerFirst}`}
      footer={
        <div className="flex gap-sm">
          <ButtonAction variant="primary" onClick={handleSubmit} disabled={!canSubmit}>
            Send proposal
          </ButtonAction>
          <ButtonAction variant="tertiary" onClick={onClose}>
            Cancel
          </ButtonAction>
        </div>
      }
    >
      <div className="flex flex-col gap-md">
        {/* Service (read-only from inquiry) */}
        <div>
          <p className="text-xs font-semibold text-fg-secondary mb-xs">Service</p>
          <p className="text-sm text-fg-primary">{SERVICE_LABELS[serviceType]}</p>
        </div>

        {/* Sub-service */}
        <div>
          <p className="text-xs font-semibold text-fg-secondary mb-xs">What specifically?</p>
          <div className="flex flex-wrap gap-xs">
            {subOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`pill${subService === opt ? " active" : ""}`}
                onClick={() => setSubService((prev) => (prev === opt ? null : opt))}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Pets (read-only from inquiry) */}
        <div>
          <p className="text-xs font-semibold text-fg-secondary mb-xs">Pets</p>
          <p className="text-sm text-fg-primary">
            {inq.pets.length > 0 ? inq.pets.join(", ") : inq.dogName || "—"}
          </p>
        </div>

        {/* Schedule / dates (read-only from inquiry) */}
        <div>
          <p className="text-xs font-semibold text-fg-secondary mb-xs">
            {bookingType === "ongoing" ? "Schedule" : "Dates"}
          </p>
          <p className="text-sm text-fg-primary">
            {recurringSchedule
              ? `Every ${recurringSchedule.days.join(", ")} · ${recurringSchedule.timeLabel}`
              : endDate
              ? `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`
              : `From ${formatShortDate(startDate)}`}
          </p>
        </div>

        {/* Price — editable */}
        <InputField
          id="proposal-price"
          label={`Your rate (Kč ${priceUnit})`}
          type="number"
          value={priceAmount}
          onChange={(val) => setPriceAmount(val)}
          required
          helper={`Market range: ${getMarketRange(serviceType)}`}
        />

        {/* Frequency badge */}
        <div>
          <p className="text-xs font-semibold text-fg-secondary mb-xs">Booking type</p>
          <span className="pill active">
            {bookingType === "ongoing" ? "Ongoing" : "One time"}
          </span>
        </div>
      </div>
    </ModalSheet>
  );
}

function getDefaultPrice(service: ServiceType): string {
  switch (service) {
    case "walk_checkin": return "280";
    case "inhome_sitting": return "550";
    case "boarding": return "600";
  }
}

function getMarketRange(service: ServiceType): string {
  switch (service) {
    case "walk_checkin": return "150–500 Kč per walk";
    case "inhome_sitting": return "500–1,200 Kč per night";
    case "boarding": return "450–1,000 Kč per night";
  }
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
