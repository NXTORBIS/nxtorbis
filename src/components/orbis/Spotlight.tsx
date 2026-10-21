"use client";

import { useEffect, useRef } from "react";
import styles from "./Orbis.module.css";

/**
 * A soft light that follows the pointer across the page, so the hairlines and
 * glass edges catch it as it passes.
 *
 * It writes two CSS variables and nothing else: no React state, no re-render,
 * no layout read beyond the one rect it needs. The light eases toward the
 * cursor in a single rAF loop that stops as soon as it has caught up, so an
 * idle pointer costs nothing at all.
 *
 * Fine pointers only — a finger has no hover — and never under reduced motion.
 */
export function Spotlight() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = el.parentElement ?? el;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let started = false;
    let raf = 0;
    let running = false;

    const write = () => {
      el.style.setProperty("--sx", `${cx.toFixed(1)}px`);
      el.style.setProperty("--sy", `${cy.toFixed(1)}px`);
    };

    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      write();
      if (Math.abs(tx - cx) < 0.5 && Math.abs(ty - cy) < 0.5) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = layer.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!started) {
        // Arrive where the pointer already is, rather than sliding in from the corner.
        started = true;
        cx = tx;
        cy = ty;
        el.classList.add(styles.spotlightOn);
        write();
      }
      start();
    };

    const onLeave = () => el.classList.remove(styles.spotlightOn);
    const onEnter = () => started && el.classList.add(styles.spotlightOn);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return <div ref={ref} className={styles.spotlight} aria-hidden="true" />;
}
