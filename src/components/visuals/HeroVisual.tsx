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
 * The live SVG is for machines that can afford it: a fine pointer, a window
 * wide enough to show the composition, and at least six cores. Everywhere
 * else the still stays, which is the same picture — the drift and the
 * pointer tilt are all the live one adds.
 *
 * Without scripting, the still simply stays too.
 */
export function HeroVisual() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Who gets the live crystals at all.
    //
    // Mounting them costs real main-thread time — measured on the deployed
    // site, blocking time ran between 330ms and 980ms once they arrived. On a
    // phone, or a machine with few cores, that is paid for a difference
    // nobody can see: the still was rendered from this exact composition at
    // rest, and the only thing the live one adds is a slow drift and a tilt
    // toward the pointer, which a touch screen has no use for either.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const roomy = window.matchMedia("(min-width: 1024px)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    if (!fine || !roomy || cores < 6) return;

    let cancelled = false;
    const mount = () => !cancelled && setLive(true);

    // After the page has settled, not before: this is decoration arriving
    // behind a page somebody is already reading.
    // Late, and only when the page has genuinely gone quiet.
    const idle = window.requestIdleCallback?.(mount, { timeout: 4000 });
    const timer = idle === undefined ? window.setTimeout(mount, 2500) : undefined;

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
