"use client";

import { useEffect, useState } from "react";
import styles from "../Orbis.module.css";

/**
 * The first three seconds: a browser assembles itself around the Orb.
 *
 * A frame draws, a tab snaps in, a question types itself into the address bar,
 * the answer lifts with its sources — and then the whole thing dissolves and
 * leaves the Orb alone, which is where the hero was before. It says "a browser
 * with a mind of its own" before the tagline below has to.
 *
 * It plays once per visit (sessionStorage), only at the top of the page, never
 * under reduced motion, and removes itself when done so nothing animates behind
 * the rest of the page.
 */

const TOTAL_MS = 5200;
const KEY = "orbis-hero-assembly";

export function HeroAssembly() {
  const [phase, setPhase] = useState<"off" | "play">("off");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.scrollY > window.innerHeight * 0.4) return;
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private window: play it, just don't remember */
    }
    setPhase("play");
    const t = window.setTimeout(() => setPhase("off"), TOTAL_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (phase === "off") return null;

  return (
    <div className={styles.assembly} aria-hidden="true">
      <div className={styles.asmFrame}>
        <div className={styles.asmTabs}>
          <span className={styles.asmTab} />
          <span className={styles.asmTabGhost} />
        </div>
        <div className={styles.asmBar}>
          <span className={styles.asmDot} />
          <span className={styles.asmQuery} />
        </div>
        <div className={styles.asmAnswer}>
          <span style={{ width: "88%" }} />
          <span style={{ width: "72%" }} />
          <span style={{ width: "54%" }} />
          <div className={styles.asmSources}>
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}
