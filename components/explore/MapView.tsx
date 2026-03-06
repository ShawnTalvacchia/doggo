"use client";

/**
 * MapView — dynamic wrapper that loads MapViewInner only on the client.
 * Leaflet requires `window`, so SSR must be skipped entirely.
 */

import dynamic from "next/dynamic";
import { ProviderCard, ServiceType } from "@/lib/types";

const MapViewInner = dynamic(() => import("./MapViewInner"), {
  ssr: false,
  loading: () => (
    <div className="map-loading-state">
      <span className="map-loading-label">Loading map…</span>
    </div>
  ),
});

interface MapViewProps {
  providers: ProviderCard[];
  service: ServiceType | null;
}

export default function MapView({ providers, service }: MapViewProps) {
  return <MapViewInner providers={providers} service={service} />;
}
