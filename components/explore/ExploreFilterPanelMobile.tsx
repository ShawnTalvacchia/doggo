"use client";

import { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { ExploreFilters, ServiceType } from "@/lib/types";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { FilterBody } from "./FilterBody";
import { type DateRange } from "@/components/ui/DatePicker";

function serviceLabel(service: ServiceType | null) {
  if (service === "inhome_sitting") return "In-home Sitting";
  if (service === "boarding") return "Boarding";
  return "Walks & Check-ins";
}

type ExploreFilterPanelMobileProps = {
  open: boolean;
  onClose: () => void;
  filters: ExploreFilters;
  onServiceChange: (service: ExploreFilters["service"]) => void;
  onMinRateChange: (value: number) => void;
  onMaxRateChange: (value: number) => void;
  onTimeToggle: (value: "6-11" | "11-15" | "15-22") => void;
  onDateRangeChange: (range: DateRange) => void;
  onStartDateChange: (iso: string | null) => void;
};

export function ExploreFilterPanelMobile({
  open,
  onClose,
  filters,
  onMinRateChange,
  onMaxRateChange,
  onTimeToggle,
  onDateRangeChange,
  onStartDateChange,
}: ExploreFilterPanelMobileProps) {
  // Lock body scroll while panel is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`mobile-slide-panel${open ? " open" : ""}`}
      aria-modal={open}
      aria-hidden={!open}
    >
      {/* Header */}
      <div className="mobile-slide-header">
        <span className="mobile-slide-title">
          {serviceLabel(filters.service)}
          <span className="mobile-slide-title-sep"> • </span>
          Filters
        </span>
        <button
          type="button"
          className="mobile-slide-close"
          onClick={onClose}
          aria-label="Close filters"
        >
          <X size={20} weight="bold" />
        </button>
      </div>

      {/* Scrollable body — service-aware filter fields */}
      <div className="mobile-slide-body">
        <FilterBody
          filters={filters}
          onMinRateChange={onMinRateChange}
          onMaxRateChange={onMaxRateChange}
          onTimeToggle={onTimeToggle}
          onDateRangeChange={onDateRangeChange}
          onStartDateChange={onStartDateChange}
          dualSlider
        />
      </div>

      {/* Footer */}
      <div className="mobile-slide-footer">
        <ButtonAction variant="primary" cta onClick={onClose}>
          View Results
        </ButtonAction>
      </div>
    </div>
  );
}
