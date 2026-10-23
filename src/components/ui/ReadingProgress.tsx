"use client";

import { useEffect, useRef } from "react";
import styles from "./ReadingProgress.module.css";

/**
 * How far through this piece you are.
 *
 * A hairline under the navigation that fills as the article passes. Where the
 * browser has scroll-driven animations it runs entirely off the main thread;
 * everywhere else one passive listener writes a single variable per frame.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (CSS.supports("animation-timeline: scroll()")) {
      el.style.animation = "readingGrow linear";
      el.style.setProperty("animation-timeline", "scroll()");
      return;
    }

    let raf = 0;
    const write = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--read", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
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
    <div className={styles.track} aria-hidden="true">
      <span ref={ref} className={styles.fill} />
    </div>
  );
}
