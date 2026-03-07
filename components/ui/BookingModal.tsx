"use client";

import { useState, useMemo } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { ModalSheet } from "@/components/ui/ModalSheet";
import { DatePicker, DateTrigger, type DateRange } from "@/components/ui/DatePicker";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { SERVICE_LABELS } from "@/lib/constants/services";
import type { ProviderCard, ProviderServiceOffering, ServiceType } from "@/lib/types";

function formatPriceUnit(unit: ProviderCard["priceUnit"]): string {
  if (unit === "per_visit") return "per visit";
  if (unit === "per_night") return "per night";
  return "per walk";
}

export type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  provider: ProviderCard;
  /** Full service offerings from ProviderProfileContent — used for service picker + pricing */
  services: ProviderServiceOffering[];
  /** Pre-select this service when the modal opens (comes from the explore URL param) */
  defaultService?: ServiceType | null;
};

export function BookingModal({
  open,
  onClose,
  provider,
  services,
  defaultService,
}: BookingModalProps) {
  const initialService: ServiceType =
    defaultService ?? services[0]?.serviceType ?? provider.services[0] ?? "walk_checkin";

  const [step, setStep] = useState<"form" | "success">("form");
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>(initialService);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Find the full offering for the currently selected service
  const selectedOffering = useMemo(
    () => services.find((s) => s.serviceType === selectedServiceType),
    [services, selectedServiceType],
  );

  const priceFrom = selectedOffering?.priceFrom ?? provider.priceFrom;
  const priceUnit = selectedOffering?.priceUnit ?? provider.priceUnit;

  // Deduplicated by serviceType so we don't show duplicates in the picker
  const displayServices = useMemo<ProviderServiceOffering[]>(() => {
    if (services.length > 0) {
      const seen = new Set<ServiceType>();
      return services.filter((s) => {
        if (seen.has(s.serviceType)) return false;
        seen.add(s.serviceType);
        return true;
      });
    }
    // Fall back to ProviderCard.services when full offerings aren't loaded yet
    return provider.services.map((st, i) => ({
      id: `fallback-${i}`,
      providerId: provider.id,
      serviceType: st,
      title: SERVICE_LABELS[st],
      shortDescription: "",
      priceFrom: provider.priceFrom,
      priceUnit: provider.priceUnit,
    }));
  }, [services, provider]);

  const canSubmit = !!(dateRange.start && dateRange.end);
  const firstName = provider.name.split(" ")[0];

  function handleClose() {
    onClose();
    // Reset state after the close animation settles
    setTimeout(() => {
      setStep("form");
      setSelectedServiceType(initialService);
      setDateRange({ start: null, end: null });
      setMessage("");
    }, 300);
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <ModalSheet
        open={open}
        onClose={handleClose}
        title="Request sent"
        footer={
          <ButtonAction variant="primary" onClick={handleClose} className="booking-done-btn">
            Done
          </ButtonAction>
        }
      >
        <div className="booking-success">
          <CheckCircle size={56} weight="fill" className="booking-success-icon" />
          <h2 className="booking-success-heading">Request sent to {firstName}!</h2>
          <p className="booking-success-body">
            We&apos;ll let you know as soon as {firstName} responds. In the meantime, you can browse
            other providers.
          </p>
        </div>
      </ModalSheet>
    );
  }

  // ── Booking form ──────────────────────────────────────────────────────────
  return (
    <>
      <ModalSheet
        open={open}
        onClose={handleClose}
        title={`Book with ${firstName}`}
        footer={
          <div className="booking-footer-inner">
            <div className="booking-price-summary">
              <span className="booking-price-from">from</span>
              <span className="booking-price-amount">{priceFrom} Kč</span>
              <span className="booking-price-unit">{formatPriceUnit(priceUnit)}</span>
            </div>
            <ButtonAction
              variant="primary"
              onClick={() => setStep("success")}
              disabled={!canSubmit}
            >
              Send Request
            </ButtonAction>
          </div>
        }
      >
        <div className="booking-modal-form">
          {/* Service selector — only rendered when the provider offers multiple services */}
          {displayServices.length > 1 && (
            <div className="booking-section">
              <span className="booking-section-label">Service</span>
              <div className="booking-service-list">
                {displayServices.map((svc) => (
                  <button
                    key={svc.id}
                    type="button"
                    className={`booking-service-item${selectedServiceType === svc.serviceType ? " selected" : ""}`}
                    onClick={() => setSelectedServiceType(svc.serviceType)}
                  >
                    <span className="booking-service-name">
                      {svc.title || SERVICE_LABELS[svc.serviceType]}
                    </span>
                    <span className="booking-service-price">
                      {svc.priceFrom} Kč{" "}
                      <span className="booking-service-unit">{formatPriceUnit(svc.priceUnit)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="booking-section">
            <span className="booking-section-label">Dates</span>
            <DateTrigger
              label="Select dates"
              value={dateRange}
              onClick={() => setDatePickerOpen(true)}
            />
          </div>

          {/* Message */}
          <div className="booking-section">
            <span className="booking-section-label">Message to {firstName}</span>
            <textarea
              className="booking-message"
              placeholder={`Hi ${firstName}, I'd love to book care for my dog…`}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
      </ModalSheet>

      {/* Date picker is rendered separately so it stacks on top of the booking modal */}
      <DatePicker
        mode="range"
        open={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        title="Select dates"
        value={dateRange}
        onChange={setDateRange}
      />
    </>
  );
}
