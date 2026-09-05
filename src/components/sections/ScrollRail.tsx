"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollRail.module.css";

/**
 * Vertical rail on the right edge (desktop only): a "scroll" label, a
 * progress line and a section counter that follows the reader.
 */
export function ScrollRail() {
  const [state, setState] = useState({ index: 1, total: 1, progress: 0 });

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section, main header"));
    const total = Math.max(1, sections.length);
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        const mid = window.innerHeight * 0.45;
        let index = 1;
        sections.forEach((s, i) => {
          if (s.getBoundingClientRect().top <= mid) index = i + 1;
        });
        setState({ index, total, progress });
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <aside className={styles.rail} aria-hidden="true">
      <span className={styles.label}>Scroll</span>
      <span className={styles.line}>
        <span className={styles.fill} style={{ transform: `scaleY(${state.progress})` }} />
      </span>
      <span className={styles.dot} />
      <span className={styles.counter}>
        <span>{pad(state.index)}</span>
        <span>{pad(state.total)}</span>
      </span>
    </aside>
  );
}
