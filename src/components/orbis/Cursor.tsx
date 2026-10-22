"use client";

import { useEffect, useRef } from "react";
import styles from "./Orbis.module.css";

/**
 * A cursor with a job.
 *
 * A precise ring that follows the pointer, grows over anything interactive,
 * becomes a crosshair over the drawings, and carries a short label when the
 * thing under it says what it does (`data-cursor="download"`). The real cursor
 * stays where it is — this rides with it rather than replacing it, so nobody
 * loses their pointer.
 *
 * Fine pointers only, never under reduced motion, and it writes transforms on
 * one rAF that stops when the pointer stops.
 */
const LABELS: Record<string, string> = {
  cta: "",
  download: "download",
  drawing: "",
  orb: "touch",
};

export function Cursor() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const label = el.querySelector("i");
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let running = false;
    let seen = false;

    const loop = () => {
      cx += (tx - cx) * 0.28;
      cy += (ty - cy) * 0.28;
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) translate(-50%, -50%)`;
      if (Math.abs(tx - cx) < 0.3 && Math.abs(ty - cy) < 0.3) {
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
      tx = e.clientX;
      ty = e.clientY;
      if (!seen) {
        seen = true;
        cx = tx;
        cy = ty;
        el.classList.add(styles.cursorOn);
      }
      const over = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role='button']") as HTMLElement | null;
      const kind = over?.dataset.cursor ?? (over ? "cta" : "");
      el.dataset.kind = kind;
      if (label) label.textContent = LABELS[kind] ?? "";
      start();
    };

    const onLeave = () => el.classList.remove(styles.cursorOn);
    const onEnter = () => seen && el.classList.add(styles.cursorOn);
    const onDown = () => el.classList.add(styles.cursorDown);
    const onUp = () => el.classList.remove(styles.cursorDown);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={ref} className={styles.cursor} aria-hidden="true">
      <span className={styles.cursorRing} />
      <i className={styles.cursorLabel} />
    </div>
  );
}
