"use client";

import { useEffect, useRef } from "react";
import styles from "./Orbis.module.css";

/**
 * The air the page sits in.
 *
 * Every layer here is painted from variables the page already publishes —
 * where the Orb is (`--orb-x/y/r`), where the pointer is (`--sx/sy`), what
 * hour it is — so none of it runs script per frame. In order, back to front:
 *
 *   still    grain, vignette and the dot matrix — painted once, never again
 *   light    a disc carrying the flare, the caustics and the flow rings,
 *            carried to the Orb on a transform rather than repainted
 *   mesh     slow clouds of colour, drifting on a transform
 *
 * The seed makes the noise different per visit; the hour grades the page warm
 * in the evening and cool at midday. Both are written once, on mount.
 */
export function Atmosphere() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current?.closest("[data-orbis-page]") as HTMLElement | null;
    if (!root) return;

    // A different noise field every visit, and a different drift with it.
    root.style.setProperty("--seed", String(Math.round(Math.random() * 360)));
    root.style.setProperty("--seed-drift", `${(Math.random() * 40 - 20).toFixed(1)}s`);

    // Warmer after dark, cooler at noon: a few degrees of hue, nothing more.
    const hour = new Date().getHours();
    const night = Math.cos(((hour - 1) / 24) * Math.PI * 2) * 0.5 + 0.5; // 1 at 1am, 0 at 1pm
    root.style.setProperty("--warmth", night.toFixed(3));

    // And a quarter-turn of the accent across the year, so winter and summer
    // are not the same page.
    const month = new Date().getMonth();
    root.style.setProperty("--season", String(Math.round(Math.sin((month / 12) * Math.PI * 2) * 6)));

    // What the machine can afford. The air costs about ten frames a second on
    // this one; on a slower machine that is the difference between a page that
    // glides and one that stutters, so it is measured once and the light and
    // the weather are dropped if they are not affordable. Richer where there
    // is room, honest where there is not.
    let frames = 0;
    const started = performance.now();
    let raf = requestAnimationFrame(function tick() {
      frames += 1;
      if (performance.now() - started < 1600) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const fps = (frames / (performance.now() - started)) * 1000;
      if (fps < 48) root.dataset.lean = "1";
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className={styles.atmos} aria-hidden="true">
      {/* Everything that holds still — dots, horizon, flow, caustics, flare,
          grain — is one painted layer. Seven separate ones each repainted on
          every scroll and cost more than half the frame rate between them. */}
      <div className={styles.atmosStill} />
      <div className={styles.atmosLight} />
      {/* The only one that moves: the weather, drifting on a transform. */}
      <div className={styles.atmosMesh} />
    </div>
  );
}
