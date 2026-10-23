"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import { CrystalField } from "./CrystalField";
import styles from "./HeroVisual.module.css";

/**
 * Hero artwork: a picture first, the real thing a moment later.
 *
 * The crystal field is the same SVG renderer every other hero uses, and on
 * the home page it is the largest thing on the first screen: eleven crystals,
 * each with specular lighting, a turbulence grain and four composites.
 * Rasterising that was most of what Lighthouse was waiting for, with the
 * largest paint sitting at 3.7 seconds under its four-times CPU throttle.
 *
 * So the first screen gets a still of exactly that composition — 28KB, in the
 * server HTML, decoded by the time anything else has started — and the live
 * SVG is mounted once the page is idle, then faded in over it. Nothing moves
 * until the real one is there, and nothing moves when it arrives either,
 * because the still was rendered from the field at rest.
 *
 * The poster is regenerated with the composition: see notes in the repo.
 * Without scripting, the still simply stays, which is the same picture.
 */
export function HeroVisual() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const mount = () => !cancelled && setLive(true);

    // After the page has settled, not before: this is decoration arriving
    // behind a page somebody is already reading.
    const idle = window.requestIdleCallback?.(mount, { timeout: 2500 });
    const timer = idle === undefined ? window.setTimeout(mount, 1200) : undefined;

    return () => {
      cancelled = true;
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={cx(styles.poster, live && styles.posterGone)}
        src="/brand/hero-poster.webp"
        alt=""
        width={1600}
        height={1000}
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
      {live && (
        <div className={cx(styles.svg, styles.svgIn)}>
          <CrystalField variant="hero" id="hero-cf" />
        </div>
      )}
    </div>
  );
}
