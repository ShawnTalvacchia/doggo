"use client";

import { useEffect, useRef } from "react";

/**
 * Detects scroll direction inside any `.list-panel-scroll`,
 * `.detail-panel-scroll`, or `.discover-mobile-tab-content` element
 * and toggles `nav-hidden` class on `<body>` when scrolling down.
 *
 * Only activates on viewports ≤ 767px (mobile).
 */
export function useScrollHideNav() {
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const THRESHOLD = 10; // px before toggling

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

        if (delta > THRESHOLD && currentY > 56) {
          document.body.classList.add("nav-hidden");
        } else if (delta < -THRESHOLD) {
          document.body.classList.remove("nav-hidden");
        }

        lastY.current = currentY;
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
