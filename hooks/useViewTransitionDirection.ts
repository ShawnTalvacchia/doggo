"use client";

import { useEffect } from "react";

/**
 * Tracks navigation direction (forward / back) and sets a data attribute
 * on <html> so CSS view-transition animations can adapt.
 *
 * Uses synchronous DOM event handlers to ensure the attribute is set
 * BEFORE Next.js calls document.startViewTransition():
 *  - `popstate` (browser back/forward) → sets "back"
 *  - `click` on any anchor → sets "forward"
 *  - Default is "forward"
 *
 * Only activates on mobile (≤ 767px).
 */
export function useViewTransitionDirection() {
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");

    // Set default direction
    document.documentElement.dataset.navDirection = "forward";

    function handlePopState() {
      if (!mql.matches) return;
      document.documentElement.dataset.navDirection = "back";
    }

    function handleClick(e: MouseEvent) {
      if (!mql.matches) return;
      // Any anchor click = forward navigation
      const anchor = (e.target as HTMLElement).closest("a[href]");
      if (anchor) {
        document.documentElement.dataset.navDirection = "forward";
      }
    }

    // popstate fires before Next.js router processes back/forward
    window.addEventListener("popstate", handlePopState);
    // click fires before Next.js router processes link navigation
    document.addEventListener("click", handleClick, { capture: true });

    // Cleanup direction after transitions end
    function handleTransitionEnd() {
      // Reset to forward after each completed transition
      setTimeout(() => {
        document.documentElement.dataset.navDirection = "forward";
      }, 350);
    }
    document.addEventListener("transitionend", handleTransitionEnd);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleClick, { capture: true } as EventListenerOptions);
      document.removeEventListener("transitionend", handleTransitionEnd);
      delete document.documentElement.dataset.navDirection;
    };
  }, []);
}
