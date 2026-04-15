"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Tracks navigation direction (forward / back) and sets a data attribute
 * on <html> so CSS view-transition animations can adapt.
 *
 * Heuristic:
 *  - `popstate` events (browser back/forward) → "back"
 *  - All other navigations (Link clicks, router.push) → "forward"
 *
 * The attribute is reset to "forward" after each transition completes.
 * Only activates on mobile (≤ 767px) to avoid desktop interference.
 */
export function useViewTransitionDirection() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const isPopState = useRef(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    if (!mql.matches) return;

    // Mark popstate navigations (back/forward button)
    const handlePopState = () => {
      isPopState.current = true;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (pathname === prevPathname.current) return;

    const direction = isPopState.current ? "back" : "forward";
    document.documentElement.dataset.navDirection = direction;

    // Reset for next navigation
    isPopState.current = false;
    prevPathname.current = pathname;

    // Clean up attribute after transition settles
    const timer = setTimeout(() => {
      document.documentElement.dataset.navDirection = "forward";
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);
}
