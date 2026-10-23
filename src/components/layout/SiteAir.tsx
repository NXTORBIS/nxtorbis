"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./SiteAir.module.css";

/**
 * The air, for the whole site.
 *
 * The Orbis page proved it: grain, a vignette, a dot matrix and a light that
 * follows the pointer turn a dark background into a lit room. Every other page
 * had the dark background and none of the light, which is why they read as a
 * different website. This carries the same air everywhere, with the accent
 * graded per route so each page has its own temperature inside one family.
 *
 * Nothing here runs per frame except the pointer light, which eases on a
 * single loop that stops as soon as it has caught up. The Orbis page keeps
 * its own, richer version: this one steps aside there.
 */

/** A hue per route, so pages differ by temperature rather than by design. */
const HUES: Record<string, number> = {
  "/": 34,
  "/about": 28,
  "/services": 206,
  "/products": 268,
  "/pricing": 150,
  "/contact": 20,
  "/privacy": 214,
};

export function SiteAir() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let running = false;
    let seen = false;

    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.setProperty("--px", `${cx.toFixed(1)}px`);
      el.style.setProperty("--py", `${cy.toFixed(1)}px`);
      if (Math.abs(tx - cx) < 0.5 && Math.abs(ty - cy) < 0.5) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        cx = tx;
        cy = ty;
        el.dataset.lit = "1";
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // Orbis brings its own weather, lit by the Orb rather than by the pointer.
  if (pathname?.startsWith("/orbis")) return null;

  const hue = HUES[pathname ?? "/"] ?? 34;

  return (
    <div ref={ref} className={styles.air} style={{ ["--page-hue" as string]: String(hue) }} aria-hidden="true">
      <div className={styles.still} />
      <div className={styles.lit} />
    </div>
  );
}
