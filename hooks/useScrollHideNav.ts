"use client";

import { useEffect, useRef } from "react";

/**
 * Detects scroll direction inside any scroll container element
 * and toggles `nav-hidden` class on `<body>` when scrolling down.
 * Adjusts scroll position to prevent content jumps when the nav
 * hides/shows and the panel height changes.
 *
 * Only activates on viewports ≤ 767px (mobile).
 */
export function useScrollHideNav() {
  const lastY = useRef(0);
  const ticking = useRef(false);
  const activeContainer = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const THRESHOLD = 10; // px before toggling
    const TOP_NAV_H = 56;
    const BOTTOM_NAV_H = 64;
    const TOTAL_OFFSET = TOP_NAV_H + BOTTOM_NAV_H; // 120px total reclaimed

    function handleScroll(e: Event) {
      const target = e.target as HTMLElement;
      if (!target || !target.classList) return;

      // Only handle our known scroll containers
      const isScrollContainer =
        target.classList.contains("list-panel-scroll") ||
        target.classList.contains("detail-panel-scroll") ||
        target.classList.contains("discover-mobile-tab-content") ||
        target.classList.contains("discover-hub-body") ||
        target.classList.contains("discover-results-list");

      if (!isScrollContainer) return;

      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = target.scrollTop;
        const delta = currentY - lastY.current;
        const isHidden = document.body.classList.contains("nav-hidden");

        if (delta > THRESHOLD && currentY > TOP_NAV_H && !isHidden) {
          // Hiding nav — panel will grow, offset scroll to keep content stable
          activeContainer.current = target;
          document.body.classList.add("nav-hidden");
          // After the panel grows by TOTAL_OFFSET, the same content is now
          // higher in the viewport. Increase scrollTop to compensate.
          target.scrollTop = currentY + TOP_NAV_H;
        } else if (delta < -THRESHOLD && isHidden) {
          // Showing nav — panel will shrink, offset scroll to keep content stable
          activeContainer.current = target;
          document.body.classList.remove("nav-hidden");
          // Panel shrinks, content moves down. Decrease scrollTop.
          target.scrollTop = Math.max(0, currentY - TOP_NAV_H);
        }

        lastY.current = target.scrollTop;
        ticking.current = false;
      });
    }

    // Only attach on mobile
    const mql = window.matchMedia("(max-width: 767px)");
    if (!mql.matches) return;

    // Use capture to catch scroll events on nested elements
    document.addEventListener("scroll", handleScroll, true);

    const onChange = () => {
      if (!mql.matches) {
        document.body.classList.remove("nav-hidden");
        document.removeEventListener("scroll", handleScroll, true);
      } else {
        document.addEventListener("scroll", handleScroll, true);
      }
    };

    mql.addEventListener("change", onChange);

    return () => {
      document.removeEventListener("scroll", handleScroll, true);
      mql.removeEventListener("change", onChange);
      document.body.classList.remove("nav-hidden");
    };
  }, []);
}
