"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MapPin,
  CaretRight,
  PawPrint,
  House,
  Bed,
  Dog,
  CalendarBlank,
  Repeat,
} from "@phosphor-icons/react";
import { DiscoverShell } from "@/components/discover/DiscoverShell";
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
  const label = SERVICE_LABELS[activeService];
  const svc = CARE_SERVICES.find((s) => s.key === activeService);

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
      <div className="discover-hub-body">
        {/* Service */}
        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            Service
          </span>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            {svc && <svc.icon size={20} weight="regular" className="text-fg-tertiary shrink-0" />}
            <span className="text-md text-fg-tertiary">{label}</span>
          </div>
        </div>

        {/* Pets */}
        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            Pets
          </span>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            <Dog size={20} weight="regular" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-tertiary">Lucy, Spot</span>
          </div>
        </div>

        {/* Nearby */}
        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            Nearby
          </span>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="text-md text-fg-tertiary">Vinohrady</span>
          </div>
        </div>

        {/* How often */}
        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            How often?
          </span>
          <div className="flex gap-md">
            <div
              className="flex-1 bg-surface-top border border-edge-stronger flex flex-col gap-xs rounded-sm"
              style={{ padding: "var(--space-md)" }}
            >
              <div className="flex items-center gap-xs">
                <CalendarBlank size={16} weight="regular" className="text-fg-tertiary" />
                <span className="text-sm font-semibold text-fg-secondary">Repeat Weekly</span>
              </div>
              <span className="text-xs text-fg-tertiary">Daily visits for a short period</span>
            </div>
            <div
              className="flex-1 bg-surface-top border-2 flex flex-col gap-xs rounded-sm"
              style={{ padding: "var(--space-md)", borderColor: "var(--brand-main)" }}
            >
              <div className="flex items-center gap-xs">
                <Repeat size={16} weight="bold" className="text-fg-primary" />
                <span className="text-sm font-semibold text-fg-primary">Repeat Weekly</span>
              </div>
              <span className="text-xs text-fg-tertiary">Daily visits for a short period</span>
            </div>
          </div>
        </div>

        {/* For which days */}
        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            For which days?
          </span>
          <div className="flex gap-xs">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="flex items-center justify-center rounded-sm text-sm text-fg-secondary"
                style={{
                  width: 40,
                  height: 40,
                  border: "1px solid var(--border-stronger)",
                  background: "var(--surface-top)",
                }}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div className="flex flex-col gap-md">
          <span className="font-body font-bold text-fg-secondary text-lg">
            Price range
          </span>
          <div
            className="relative"
            style={{ height: 24, margin: "var(--space-sm) 0" }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                height: 4,
                background: "var(--brand-main)",
                borderRadius: 2,
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid var(--brand-main)",
                background: "white",
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid var(--brand-main)",
                background: "white",
                transform: "translateY(-50%)",
              }}
            />
          </div>
          <div className="flex gap-md">
            <div className="flex flex-col gap-xs flex-1">
              <span className="text-xs text-fg-secondary">Min. per walk</span>
              <div
                className="bg-surface-top border border-edge-stronger rounded-sm text-sm text-fg-secondary"
                style={{ padding: "var(--space-sm) var(--space-md)" }}
              >
                150 Kč
              </div>
            </div>
            <div className="flex flex-col gap-xs flex-1">
              <span className="text-xs text-fg-secondary">Max. per walk</span>
              <div
                className="bg-surface-top border border-edge-stronger rounded-sm text-sm text-fg-secondary"
                style={{ padding: "var(--space-sm) var(--space-md)" }}
              >
                950 Kč
              </div>
            </div>
          </div>
        </div>

        {/* Services accordion */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center justify-between">
            <span className="font-body font-bold text-fg-secondary text-lg">
              Services
            </span>
            <CaretRight size={16} weight="regular" className="text-fg-tertiary" style={{ transform: "rotate(90deg)" }} />
          </div>
          <div className="flex flex-col">
            {["Drop-in visit", "Group walk", "Solo walk"].map((svc) => (
              <label key={svc} className="flex items-center justify-between" style={{ padding: "var(--space-sm) 0" }}>
                <span className="text-sm text-fg-secondary">{svc}</span>
                <input type="checkbox" style={{ width: 18, height: 18, accentColor: "var(--brand-main)" }} />
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
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
