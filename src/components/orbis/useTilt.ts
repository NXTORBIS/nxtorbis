"use client";

import { useEffect, useRef } from "react";

/**
 * Tilts a feature stage toward the pointer, and lets the layers inside it move
 * at their own depths.
 *
 * The element is given four variables — `--tx`, `--ty` (−1…1, where the pointer
 * is), and `--rx`, `--ry` (the degrees to rotate) — and the CSS decides what
 * moves and how far. Values ease in one rAF loop that stops when it settles, so
 * a stage nobody is pointing at runs nothing.
 *
 * Fine pointers only, and never under reduced motion: a tilt is decoration.
 */
export function useTilt<T extends HTMLElement>(maxDeg = 5) {
  const ref = useRef<T | null>(null);

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
    let inside = false;

    const write = () => {
      el.style.setProperty("--tx", cx.toFixed(3));
      el.style.setProperty("--ty", cy.toFixed(3));
      el.style.setProperty("--ry", `${(cx * maxDeg).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-cy * maxDeg).toFixed(2)}deg`);
    };

    const loop = () => {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      write();
      if (!inside && Math.abs(tx - cx) < 0.002 && Math.abs(ty - cy) < 0.002) {
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
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      start();
    };

    const onEnter = () => {
      inside = true;
      el.dataset.tilt = "on";
    };

    const onLeave = () => {
      inside = false;
      tx = 0;
      ty = 0;
      delete el.dataset.tilt;
      start();
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [maxDeg]);

  return ref;
}
