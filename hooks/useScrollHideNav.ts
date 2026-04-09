"use client";

import { useEffect, useRef } from "react";

/**
 * Detects scroll direction inside known scroll-container elements
 * and toggles `nav-hidden` class on `<body>` when scrolling down.
 *
 * Uses a MutationObserver to dynamically discover scroll containers
 * and attaches listeners directly, avoiding capture-phase delegation
 * issues with nested overflow:hidden parents.
 *
 * Only activates on viewports ≤ 767px (mobile).
 */

const SCROLL_CONTAINER_CLASSES = [
  "list-panel-scroll",
  "detail-panel-scroll",
  "discover-mobile-tab-content",
  "discover-hub-body",
  "discover-results-list",
  "community-panel-body",
  "group-detail-body",
  "meet-detail-body",
  "schedule-body",
];

export function useScrollHideNav() {
  const lastY = useRef(0);
  const ticking = useRef(false);
  const cooldown = useRef(false);
  const trackedElements = useRef<Set<HTMLElement>>(new Set());

  useEffect(() => {
    const THRESHOLD = 8;
    const TOP_NAV_H = 56;
    const BOTTOM_NAV_H = 64;
    const TOTAL_OFFSET = TOP_NAV_H + BOTTOM_NAV_H;
    const COOLDOWN_MS = 350;

    const mql = window.matchMedia("(max-width: 767px)");
    if (!mql.matches) return;

    function handleScroll(e: Event) {
      const target = e.currentTarget as HTMLElement;
      if (!target) return;

      if (cooldown.current) {
        lastY.current = target.scrollTop;
        return;
      }

      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = target.scrollTop;
        const delta = currentY - lastY.current;
        const isHidden = document.body.classList.contains("nav-hidden");

        // Only hide if there's meaningful scrollable depth
        const MIN_SCROLL_DEPTH = TOTAL_OFFSET;
        const canHide = target.scrollHeight - target.clientHeight > MIN_SCROLL_DEPTH;

        if (delta > THRESHOLD && currentY > TOP_NAV_H && !isHidden && canHide) {
          cooldown.current = true;
          document.body.classList.add("nav-hidden");
          setTimeout(() => { cooldown.current = false; }, COOLDOWN_MS);
        } else if (delta < -THRESHOLD && isHidden) {
          cooldown.current = true;
          document.body.classList.remove("nav-hidden");
          setTimeout(() => { cooldown.current = false; }, COOLDOWN_MS);
        }

        lastY.current = target.scrollTop;
        ticking.current = false;
      });
    }

    function isScrollContainer(el: HTMLElement): boolean {
      return SCROLL_CONTAINER_CLASSES.some((cls) => el.classList.contains(cls));
    }

    function attachListener(el: HTMLElement) {
      if (trackedElements.current.has(el)) return;
      trackedElements.current.add(el);
      el.addEventListener("scroll", handleScroll, { passive: true });
    }

    function detachListener(el: HTMLElement) {
      if (!trackedElements.current.has(el)) return;
      trackedElements.current.delete(el);
      el.removeEventListener("scroll", handleScroll);
    }

    // Scan DOM for existing scroll containers
    function scanAndAttach() {
      for (const cls of SCROLL_CONTAINER_CLASSES) {
        const els = document.querySelectorAll<HTMLElement>(`.${cls}`);
        els.forEach((el) => attachListener(el));
      }
    }

    // Initial scan
    scanAndAttach();

    // Watch for DOM changes (route navigation adds/removes scroll containers)
    const observer = new MutationObserver((mutations) => {
      let needsScan = false;
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          // Check removed nodes
          mutation.removedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (isScrollContainer(node)) detachListener(node);
              // Also check descendants
              trackedElements.current.forEach((tracked) => {
                if (!document.body.contains(tracked)) detachListener(tracked);
              });
            }
          });
          // Check added nodes
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (isScrollContainer(node)) {
                needsScan = true;
              } else if (node.querySelector) {
                for (const cls of SCROLL_CONTAINER_CLASSES) {
                  if (node.querySelector(`.${cls}`)) {
                    needsScan = true;
                    break;
                  }
                }
              }
            }
          });
        }
      }
      if (needsScan) scanAndAttach();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const onChange = () => {
      if (!mql.matches) {
        document.body.classList.remove("nav-hidden");
        // Detach all listeners
        trackedElements.current.forEach((el) => {
          el.removeEventListener("scroll", handleScroll);
        });
        trackedElements.current.clear();
        observer.disconnect();
      }
    };

    mql.addEventListener("change", onChange);

    return () => {
      trackedElements.current.forEach((el) => {
        el.removeEventListener("scroll", handleScroll);
      });
      trackedElements.current.clear();
      observer.disconnect();
      mql.removeEventListener("change", onChange);
      document.body.classList.remove("nav-hidden");
    };
  }, []);
}
