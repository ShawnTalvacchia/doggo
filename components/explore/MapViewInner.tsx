"use client";

/**
 * MapViewInner — the actual Leaflet map, loaded dynamically (client-only).
 * Loads Leaflet v1.9.4 from unpkg CDN to avoid adding it as an npm dep.
 * Shows price-pill markers for each provider; clicking opens a mini popup card.
 */

import { useEffect, useRef, useState } from "react";
import { ProviderCard, ServiceType } from "@/lib/types";

// ── Leaflet CDN loader ────────────────────────────────────────────────────────

const LEAFLET_VERSION = "1.9.4";
let leafletLoadPromise: Promise<void> | null = null;

function loadLeaflet(): Promise<void> {
  if (leafletLoadPromise) return leafletLoadPromise;
  leafletLoadPromise = new Promise((resolve, reject) => {
    // Already loaded (e.g. hot-reload)
    if ((window as unknown as Record<string, unknown>).L) {
      resolve();
      return;
    }
    // Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
    document.head.appendChild(link);
    // Leaflet JS
    const script = document.createElement("script");
    script.src = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Leaflet from CDN"));
    document.head.appendChild(script);
  });
  return leafletLoadPromise;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PRAGUE_CENTER: [number, number] = [50.0755, 14.4378];

function priceLabel(p: ProviderCard): string {
  return `${p.priceFrom} Kč`;
}

function buildPopupHtml(provider: ProviderCard, serviceParam: string): string {
  const href = `/explore/profile/${provider.id}${serviceParam}`;
  // Stars: render filled/half stars as a simple string
  const stars = "★".repeat(Math.round(provider.rating));
  return `
    <div class="map-popup-card">
      <img
        src="${provider.avatarUrl}"
        alt="${provider.name}"
        class="map-popup-avatar"
        loading="lazy"
      />
      <div class="map-popup-body">
        <span class="map-popup-name">${provider.name}</span>
        <span class="map-popup-district">${provider.neighborhood}</span>
        <span class="map-popup-meta">
          <span class="map-popup-stars">${stars}</span>
          ${provider.rating.toFixed(1)}
          <span class="map-popup-dot">·</span>
          from ${provider.priceFrom} Kč
        </span>
        <a href="${href}" class="map-popup-link">View profile →</a>
      </div>
    </div>
  `;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  providers: ProviderCard[];
  service: ServiceType | null;
}

export default function MapViewInner({ providers, service }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // ── Initialize Leaflet map once ────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    loadLeaflet()
      .then(() => {
        if (!mounted || !containerRef.current || mapRef.current) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const L = (window as any).L;

        const map = L.map(containerRef.current, {
          center: PRAGUE_CENTER,
          zoom: 12,
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: true,
        });

        // Carto Positron — clean, light base tiles (no API key required)
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;
        if (mounted) setMapReady(true);
      })
      .catch((err) => {
        console.error("MapViewInner: failed to load Leaflet", err);
      });

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        leafletLoadPromise = null; // allow re-init after HMR unmount
      }
    };
  }, []);

  // ── Add / refresh markers whenever providers or service changes ────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L = (window as any).L;
    const map = mapRef.current;
    const serviceParam = service ? `?service=${service}` : "";

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const withCoords = providers.filter(
      (p) => typeof p.lat === "number" && typeof p.lng === "number",
    );

    withCoords.forEach((provider) => {
      const price = priceLabel(provider);

      const icon = L.divIcon({
        html: `<div class="map-price-pin">${price}</div>`,
        className: "map-pin-wrapper",
        iconSize: null,
        iconAnchor: [0, 0],
        popupAnchor: [36, 0],
      });

      const marker = L.marker([provider.lat, provider.lng], { icon });

      marker.bindPopup(buildPopupHtml(provider, serviceParam), {
        className: "map-popup-shell",
        closeButton: false,
        maxWidth: 240,
        minWidth: 200,
        offset: L.point(0, -4),
      });

      // Highlight pin when popup is open
      marker.on("popupopen", () => {
        const el = marker.getElement();
        el?.querySelector(".map-price-pin")?.classList.add("map-price-pin--active");
      });
      marker.on("popupclose", () => {
        const el = marker.getElement();
        el?.querySelector(".map-price-pin")?.classList.remove("map-price-pin--active");
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    // Fit map to visible providers
    if (withCoords.length > 1) {
      const bounds = L.latLngBounds(withCoords.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [56, 56] });
    } else if (withCoords.length === 1) {
      map.setView([withCoords[0].lat, withCoords[0].lng], 14);
    } else {
      // No results — reset to Prague center
      map.setView(PRAGUE_CENTER, 12);
    }
  }, [mapReady, providers, service]);

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%" }} aria-label="Provider map" />
  );
}
