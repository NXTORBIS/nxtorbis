"use client";

import { useEffect, useRef } from "react";

/**
 * Hero interaction layer — Level 01, the signature moment.
 *
 * Writes three variables on the hero section and lets CSS do the rest:
 *   --hx / --hy  pointer position, -1..1, eased so the hero has inertia
 *   --hp         scroll progress through the hero, 0..1
 *
 * Depth comes from each layer consuming those values by a different amount
 * (see Hero.module.css): the crystal field moves most, the light field
 * follows the cursor, the copy barely moves and the headline never does —
 * the type stays the anchor.
 *
 * One rAF loop, passive listeners, and it stops entirely once the hero
 * scrolls out of view. Pointer response is disabled on touch and under
 * reduced motion; the scroll transform is kept but flattened.
 */
export function HeroMotion() {
  const anchor = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const hero = anchor.current?.closest("section") as HTMLElement | null;
    if (!hero) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const trackPointer = fine && !reduced;

    let tx = 0, ty = 0, cx = 0, cy = 0;
    let progress = 0;
    let visible = true;
    let raf = 0;
    let running = false;

    const readScroll = () => {
      const h = hero.offsetHeight || 1;
      progress = Math.min(1, Math.max(0, window.scrollY / h));
    };

    const frame = () => {
      raf = 0;
      cx += (tx - cx) * 0.07; // slow follow gives the hero weight
      cy += (ty - cy) * 0.07;
      hero.style.setProperty("--hx", cx.toFixed(4));
      hero.style.setProperty("--hy", cy.toFixed(4));
      hero.style.setProperty("--hp", progress.toFixed(4));
      if (visible && (Math.abs(tx - cx) > 0.0015 || Math.abs(ty - cy) > 0.0015)) start();
    };

    const start = () => {
      if (!running || raf) return;
      raf = requestAnimationFrame(frame);
    };

    const onPointer = (e: PointerEvent) => {
      if (!visible) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      start();
    };

    const onScroll = () => {
      readScroll();
      // progress is written directly: scroll must never lag behind the page
      hero.style.setProperty("--hp", progress.toFixed(4));
      if (visible) start();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        running = visible;
        if (visible) {
          start();
        } else {
          cancelAnimationFrame(raf);
          raf = 0;
          // park the pointer offset so it does not snap on return
          tx = 0;
          ty = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(hero);

    running = true;
    readScroll();
    hero.style.setProperty("--hp", progress.toFixed(4));
    hero.dataset.heroMotion = "on";

    if (trackPointer) window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delete hero.dataset.heroMotion;
      hero.style.removeProperty("--hx");
      hero.style.removeProperty("--hy");
      hero.style.removeProperty("--hp");
    };
  }, []);

  return <span ref={anchor} hidden aria-hidden="true" />;
}
