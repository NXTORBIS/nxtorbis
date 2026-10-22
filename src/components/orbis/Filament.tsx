"use client";

import { useEffect, useRef } from "react";
import styles from "./Orbis.module.css";

/**
 * A thread of light down the left edge, filling as the page is read.
 *
 * Where the browser supports scroll-driven animation it is done in CSS, off
 * the main thread entirely. Everywhere else a passive scroll listener writes
 * one variable per frame, which is the same picture for a little more work.
 */
export function Filament() {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Native scroll timelines: no listener, no script per frame.
    if (CSS.supports("animation-timeline: scroll()")) {
      el.style.setProperty("--progress", "1");
      el.style.animation = "filamentGrow linear";
      el.style.setProperty("animation-timeline", "scroll()");
      return;
    }

    let raf = 0;
    const write = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={styles.filament} aria-hidden="true">
      <span ref={ref} className={styles.filamentFill} />
    </div>
  );
}
