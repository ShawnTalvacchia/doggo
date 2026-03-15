"use client";

import { useEffect } from "react";
import { X } from "@phosphor-icons/react";
import { SERVICE_LABELS } from "@/lib/constants/services";
import { ExploreFilters, ServiceType } from "@/lib/types";
import { ButtonAction } from "@/components/ui/ButtonAction";
import { FilterBody } from "./FilterBody";
import { FilterPanelShell } from "./FilterPanelShell";
import { type DateRange } from "@/components/ui/DatePicker";

function serviceLabel(service: ServiceType | null) {
  return service ? SERVICE_LABELS[service] : "";
}

type FilterPanelMobileProps = {
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

export function FilterPanelMobile({
  open,
  onClose,
  filters,
  onMinRateChange,
  onMaxRateChange,
  onTimeToggle,
  onDateRangeChange,
  onStartDateChange,
}: FilterPanelMobileProps) {
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
      <FilterPanelShell
        header={
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
        }
        footer={
          <div className="mobile-slide-footer">
            <ButtonAction variant="primary" cta onClick={onClose}>
              View Results
            </ButtonAction>
          </div>
        }
      >
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
      </FilterPanelShell>
    </div>
  );
}
