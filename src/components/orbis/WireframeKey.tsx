"use client";

import { useEffect } from "react";
import styles from "./Orbis.module.css";

/**
 * A way to see how the page is made.
 *
 * Press W three times and everything is stripped to its hairlines: no light,
 * no glass, no grain, just the structure. Press again to put it back. It is
 * hidden on purpose — the kind of thing someone finds and tells someone else
 * about — and it is keyboard-only, so nothing can trip into it by accident.
 */
export function WireframeKey() {
  useEffect(() => {
    let hits = 0;
    let last = 0;

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "w" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName))) return;
      const now = Date.now();
      hits = now - last < 700 ? hits + 1 : 1;
      last = now;
      if (hits < 3) return;
      hits = 0;
      const page = document.querySelector("[data-orbis-page]");
      page?.classList.toggle(styles.wireframe);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
