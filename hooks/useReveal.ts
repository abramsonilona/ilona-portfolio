"use client";

import { useEffect } from "react";

/* ------------------------------------------------------------------ *
 *  useReveal — scroll-reveal hook
 * ------------------------------------------------------------------ *
 *  Reveals any element with the class "reveal" as it scrolls into view
 *  (fade + slight rise). Add "reveal" to anything you want animated.
 *  Optional stagger: add "d1" / "d2" / "d3" for incremental delays.
 *
 *  Honors prefers-reduced-motion (elements show immediately, no motion).
 *
 *  Usage: call useReveal() once near the top of a client page/section
 *  that contains .reveal elements. Then add className="reveal" (and
 *  optionally "d1"/"d2"/"d3") to the elements.
 * ------------------------------------------------------------------ */

export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
