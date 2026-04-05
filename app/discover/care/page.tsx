"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MapPin,
  CaretRight,
  CaretDown,
  CheckSquare,
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
  const [servicesOpen, setServicesOpen] = useState(true);
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
      <div className="discover-hub-body" style={{ gap: "var(--space-xxl)" }}>
        {/* Service */}
        <div className="flex flex-col gap-sm">
          <span className="font-body font-semibold text-fg-secondary text-sm">
            Service
          </span>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            {svc && <svc.icon size={20} weight="regular" className="text-fg-tertiary shrink-0" />}
            <span className="font-body text-md text-fg-secondary">{label}</span>
          </div>
        </div>

        {/* Pets */}
        <div className="flex flex-col gap-sm">
          <span className="font-body font-semibold text-fg-secondary text-sm">
            Pets
          </span>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            <Dog size={20} weight="regular" className="text-fg-tertiary shrink-0" />
            <span className="font-body text-md text-fg-tertiary">Lucy, Spot</span>
          </div>
        </div>

        {/* Nearby */}
        <div className="flex flex-col gap-sm">
          <span className="font-body font-semibold text-fg-secondary text-sm">
            Nearby
          </span>
          <div
            className="bg-surface-top border border-edge-stronger flex items-center gap-sm rounded-sm"
            style={{ padding: "var(--space-sm) var(--space-md)" }}
          >
            <MapPin size={20} weight="light" className="text-fg-tertiary shrink-0" />
            <span className="font-body text-md text-fg-tertiary">Vinohrady</span>
          </div>
        </div>

        {/* How often */}
        <div className="flex flex-col gap-sm">
          <span className="font-body font-semibold text-fg-secondary text-sm">
            How often?
          </span>
          <div className="flex gap-md">
            <div
              className="flex-1 bg-surface-base border border-edge-stronger flex flex-col gap-xxs rounded-sm"
              style={{ padding: "var(--space-sm) var(--space-md)" }}
            >
              <div className="flex items-center gap-sm">
                <CalendarBlank size={19} weight="regular" className="text-fg-tertiary shrink-0" />
                <span className="font-body font-semibold text-sm text-fg-tertiary">Repeat Weekly</span>
              </div>
              <span className="font-body text-sm text-fg-tertiary" style={{ lineHeight: "20px" }}>Daily visits for a short period</span>
            </div>
            <button
              className="flex-1 bg-surface-top border flex flex-col gap-xxs rounded-sm"
              style={{ padding: "var(--space-sm) var(--space-md)", borderColor: "var(--text-secondary)", cursor: "pointer", textAlign: "left" }}
            >
              <div className="flex items-center gap-sm">
                <CalendarBlank size={19} weight="regular" className="text-fg-primary shrink-0" />
                <span className="font-body font-semibold text-sm text-fg-primary">Repeat Weekly</span>
              </div>
              <span className="font-body text-sm text-fg-secondary" style={{ lineHeight: "20px" }}>Daily visits for a short period</span>
            </button>
          </div>
        </div>

        {/* For which days — segment bar */}
        <div className="flex flex-col gap-sm">
          <span className="font-body font-semibold text-fg-secondary text-sm">
            For which days?
          </span>
          <div className="flex" style={{ borderRadius: "var(--radius-sm)" }}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
              <div
                key={day}
                className="flex flex-1 items-center justify-center bg-surface-base text-md text-fg-tertiary font-body"
                style={{
                  height: 40,
                  border: "1px solid var(--border-stronger)",
                  marginLeft: i > 0 ? -1 : 0,
                  borderRadius:
                    i === 0
                      ? "var(--radius-sm) 0 0 var(--radius-sm)"
                      : i === 6
                      ? "0 var(--radius-sm) var(--radius-sm) 0"
                      : 0,
                }}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div className="flex flex-col gap-sm">
          <span className="font-body font-semibold text-fg-secondary text-sm">
            Price range
          </span>
          <div
            className="flex items-center"
            style={{ height: 40, padding: "0 var(--space-xxl)" }}
          >
            <div
              className="flex flex-1 items-center relative"
              style={{ height: 5, background: "var(--surface-inset)", borderRadius: 9999 }}
            >
              <div
                className="flex flex-1 items-center justify-between"
                style={{
                  height: "100%",
                  background: "var(--brand-light)",
                  borderRadius: 9999,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "2px solid var(--brand-light)",
                    background: "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    marginLeft: -12,
                  }}
                />
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "2px solid var(--brand-light)",
                    background: "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    marginRight: -12,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-lg">
            <div className="flex flex-col flex-1 gap-xxs" style={{ height: 76, justifyContent: "space-between" }}>
              <span className="font-body font-semibold text-fg-secondary text-sm">Min. per walk</span>
              <div
                className="bg-surface-top border border-edge-stronger rounded-sm font-body text-md text-fg-tertiary"
                style={{ padding: "var(--space-sm) var(--space-md)" }}
              >
                150 Kč
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-xxs" style={{ height: 76, justifyContent: "space-between" }}>
              <span className="font-body font-semibold text-fg-secondary text-sm">Max. per walk</span>
              <div
                className="bg-surface-top border border-edge-stronger rounded-sm font-body text-md text-fg-tertiary"
                style={{ padding: "var(--space-sm) var(--space-md)" }}
              >
                950 Kč
              </div>
            </div>
          </div>
        </div>

        {/* Services accordion */}
        <div
          className="flex flex-col"
          style={{
            borderTop: "1px solid var(--border-strong)",
            borderBottom: "1px solid var(--border-strong)",
            padding: "var(--space-sm) 0",
          }}
        >
          <button
            className="flex items-center gap-sm"
            style={{
              height: 40,
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
              width: "100%",
            }}
            onClick={() => setServicesOpen((o) => !o)}
          >
            <span className="flex-1 font-body font-semibold text-fg-secondary text-sm text-left">
              Services
            </span>
            <CaretDown
              size={24}
              weight="light"
              className="text-fg-secondary"
              style={{
                transition: "transform 0.2s",
                transform: servicesOpen ? "rotate(0deg)" : "rotate(-90deg)",
              }}
            />
          </button>
          {servicesOpen && (
            <div className="flex flex-col">
              {["Drop-in visit", "Group walk", "Solo walk"].map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-md"
                  style={{ height: 40 }}
                >
                  <span className="flex-1 font-body text-sm text-fg-secondary" style={{ lineHeight: "20px" }}>
                    {name}
                  </span>
                  <CheckSquare size={24} weight="light" className="text-fg-tertiary shrink-0" />
                </div>
              ))}
            </div>
          )}
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
