"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

const INTERACTIVE = "a, button, [role='button'], summary, label, [data-cursor]";
const TEXT = "input, textarea, select, [contenteditable='true']";

/**
 * A small ring that trails the pointer and widens over interactive elements.
 * The native cursor stays visible; this only adds feedback. Mounted only for
 * fine pointers without a reduced-motion preference — never on touch.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!fine || reduced || !el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    let visible = false;

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        x = tx;
        y = ty;
        el.classList.add(styles.visible);
      }
      const t = e.target as Element | null;
      const isText = Boolean(t?.closest(TEXT));
      const isInteractive = !isText && Boolean(t?.closest(INTERACTIVE));
      el.classList.toggle(styles.active, isInteractive);
      el.classList.toggle(styles.text, isText);
    };
    const onLeave = () => {
      visible = false;
      el.classList.remove(styles.visible);
    };
    const onDown = () => el.classList.add(styles.pressed);
    const onUp = () => el.classList.remove(styles.pressed);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} className={styles.cursor} aria-hidden="true" />;
}
