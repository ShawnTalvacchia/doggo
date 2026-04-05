"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MapPin,
  CaretRight,
  CaretUp,
  PawPrint,
  House,
  Bed,
  Dog,
  CalendarBlank,
  Repeat,
} from "@phosphor-icons/react";
import { DiscoverShell } from "@/components/discover/DiscoverShell";
import { CheckboxRow } from "@/components/ui/CheckboxRow";
import { MultiSelectSegmentBar } from "@/components/ui/MultiSelectSegmentBar";
import { Slider } from "@/components/ui/Slider";
import { getExploreRateBounds } from "@/lib/pricing";
import type { ServiceType } from "@/lib/types";

const CARE_SERVICES: {
  key: ServiceType;
  label: string;
  description: string;
  icon: typeof PawPrint;
}[] = [
  {
    key: "walk_checkin",
    label: "Walks & check-ins",
    description: "Short visits at your home",
    icon: PawPrint,
  },
  {
    key: "inhome_sitting",
    label: "In-home sitting",
    description: "Overnight care at your home",
    icon: House,
  },
  {
    key: "boarding",
    label: "Boarding",
    description: "Your dog stays with a trusted host",
    icon: Bed,
  },
];

const SERVICE_LABELS: Record<ServiceType, string> = {
  walk_checkin: "Walks & Check-ins",
  inhome_sitting: "In-home Sitting",
  boarding: "Boarding",
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const WALK_SERVICES = ["Drop-in visit", "Group walk", "Solo walk"];

/** Hub panel — service picker (no service selected yet) */
function CarePickerPanel() {
  return (
    <>
      <div className="list-panel-header">
        <Link
          href="/discover"
          className="flex items-center gap-sm"
          style={{ textDecoration: "none" }}
        >
          <ArrowLeft size={20} weight="regular" className="text-fg-primary" />
          <h2
            className="font-heading font-bold text-fg-primary"
            style={{ fontSize: "var(--text-2xl)", lineHeight: 1.2 }}
          >
            Dog Care
          </h2>
        </Link>
      </div>
      <div className="discover-hub-body">
        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            Near
          </span>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-tertiary">Vinohrady</span>
          </div>
        </div>

        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            What are you looking for?
          </span>
          <div className="flex flex-col gap-lg">
            {CARE_SERVICES.map((svc) => (
              <Link
                key={svc.key}
                href={`/discover/care?service=${svc.key}`}
                className="bg-surface-top border border-edge-stronger flex items-center gap-md rounded-sm"
                style={{
                  textDecoration: "none",
                  padding: "var(--space-lg)",
                  overflow: "hidden",
                }}
              >
                <svc.icon size={32} weight="regular" className="text-fg-secondary shrink-0" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-body font-semibold text-md text-fg-secondary">
                    {svc.label}
                  </span>
                  <span className="text-sm text-fg-secondary" style={{ lineHeight: "20px" }}>
                    {svc.description}
                  </span>
                </div>
                <CaretRight size={20} weight="light" className="text-fg-secondary shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/** Hub panel — filter form (service selected) */
function CareFilterPanel({ activeService }: { activeService: ServiceType }) {
  const [servicesOpen, setServicesOpen] = useState(true);
  const [visitMode, setVisitMode] = useState<"one_time" | "repeat">("repeat");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [minRate, setMinRate] = useState(150);
  const [maxRate, setMaxRate] = useState(950);

  const label = SERVICE_LABELS[activeService];
  const svc = CARE_SERVICES.find((s) => s.key === activeService);
  const rateBounds = getExploreRateBounds(activeService);

  return (
    <>
      <div className="list-panel-header">
        <Link
          href="/discover/care"
          className="flex items-center gap-sm"
          style={{ textDecoration: "none" }}
        >
          <ArrowLeft size={20} weight="regular" className="text-fg-primary" />
          <h2
            className="font-heading font-bold text-fg-primary"
            style={{ fontSize: "var(--text-2xl)", lineHeight: 1.2 }}
          >
            Dog Care
          </h2>
        </Link>
      </div>
      <div className="discover-hub-body" style={{ gap: "var(--space-xxl)" }}>
        {/* Service */}
        <div className="filter-field">
          <div className="label">Service</div>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            {svc && <svc.icon size={20} weight="regular" className="text-fg-tertiary shrink-0" />}
            <span className="font-body text-md text-fg-secondary">{label}</span>
          </div>
        </div>

        {/* Pets */}
        <div className="filter-field">
          <div className="label">Pets</div>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            <Dog size={20} weight="regular" className="text-fg-tertiary shrink-0" />
            <span className="font-body text-md text-fg-tertiary">Lucy, Spot</span>
          </div>
        </div>

        {/* Nearby */}
        <div className="filter-field">
          <div className="label">Nearby</div>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="font-body text-md text-fg-tertiary">Vinohrady</span>
          </div>
        </div>

        {/* How often */}
        <div className="filter-field">
          <div className="label">How often?</div>
          <div className="filter-visit-row">
            <button
              type="button"
              className={`filter-option-card${visitMode === "one_time" ? " active" : ""}`}
              onClick={() => setVisitMode("one_time")}
            >
              <strong>One Time</strong>
              <span>Daily visits for a short period</span>
            </button>
            <button
              type="button"
              className={`filter-option-card${visitMode === "repeat" ? " active" : ""}`}
              onClick={() => setVisitMode("repeat")}
            >
              <strong>Repeat Weekly</strong>
              <span>Ongoing weekly schedule</span>
            </button>
          </div>
        </div>

        {/* For which days — interactive segment bar */}
        <div className="filter-field">
          <div className="label">For which days?</div>
          <MultiSelectSegmentBar
            ariaLabel="Repeat weekly days"
            options={DAYS.map((day) => ({ value: day, label: day }))}
            selectedValues={selectedDays}
            onToggle={(day) =>
              setSelectedDays((prev) =>
                prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
              )
            }
            variant="filter"
          />
        </div>

        {/* Price range — interactive dual slider */}
        <div className="filter-field">
          <div className="label">Price range</div>
          <Slider
            dual
            min={rateBounds.min}
            max={rateBounds.max}
            step={50}
            minValue={minRate}
            maxValue={maxRate}
            onMinChange={(v) => setMinRate(v)}
            onMaxChange={(v) => setMaxRate(v)}
          />
          <div className="filter-minmax-row">
            <div className="filter-field">
              <div className="label">Min. per walk</div>
              <input
                className="input"
                type="number"
                min={rateBounds.min}
                max={rateBounds.max}
                value={minRate}
                onChange={(e) => {
                  const v = Number(e.target.value) || rateBounds.min;
                  setMinRate(Math.min(Math.max(v, rateBounds.min), maxRate));
                }}
              />
            </div>
            <div className="filter-field">
              <div className="label">Max. per walk</div>
              <input
                className="input"
                type="number"
                min={rateBounds.min}
                max={rateBounds.max}
                value={maxRate}
                onChange={(e) => {
                  const v = Number(e.target.value) || rateBounds.max;
                  setMaxRate(Math.max(Math.min(v, rateBounds.max), minRate));
                }}
              />
            </div>
          </div>
        </div>

        {/* Services accordion — interactive checkboxes */}
        <div className="filter-accordion-stack">
          <div className="filter-accordion">
            <button
              type="button"
              className={`filter-accordion-btn${servicesOpen ? " open" : ""}`}
              onClick={() => setServicesOpen((o) => !o)}
            >
              Services
              <span className="accordion-caret">
                <CaretUp size={24} weight="regular" />
              </span>
            </button>
            <div className={`filter-accordion-body${servicesOpen ? " open" : ""}`}>
              <div className="filter-accordion-inner">
                {WALK_SERVICES.map((name) => (
                  <AccordionCheckbox key={name} label={name} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/** Checkbox row with local state for accordion items */
function AccordionCheckbox({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return <CheckboxRow label={label} checked={checked} onChange={setChecked} placement="right" />;
}

function DiscoverCareInner() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service") as ServiceType | null;
  const isValidService = service && ["walk_checkin", "inhome_sitting", "boarding"].includes(service);

  if (isValidService) {
    return (
      <DiscoverShell
        hubPanel={<CareFilterPanel activeService={service} />}
        resultsTitle={SERVICE_LABELS[service]}
        resultsIcon={
          CARE_SERVICES.find((s) => s.key === service)
            ? (() => {
                const Ico = CARE_SERVICES.find((s) => s.key === service)!.icon;
                return <Ico size={20} weight="regular" className="text-fg-primary" />;
              })()
            : undefined
        }
        activeService={service}
        mobileShowResults
      />
    );
  }

  return (
    <DiscoverShell
      hubPanel={<CarePickerPanel />}
      resultsTitle="Find Dog Care"
      resultsIcon={<Heart size={20} weight="regular" className="text-fg-primary" />}
    />
  );
}

export default function DiscoverCarePage() {
  return (
    <Suspense fallback={null}>
      <DiscoverCareInner />
    </Suspense>
  );
}
