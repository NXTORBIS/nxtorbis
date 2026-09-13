"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { OrbEngine, type OrbDownloadPhase, type OrbQuality, type OrbStateName } from "./OrbEngine";
import styles from "./OrbStage.module.css";

/**
 * The stage the Orb lives on, and the story it follows down the page.
 *
 * There is exactly one Orb. Sections do not render their own; they place an
 * <OrbSlot> where the Orb should be and say what it should become. As the
 * page scrolls, the stage finds the slots either side of the viewport's
 * centre and eases the Orb between them — so it travels with the story
 * instead of teleporting from section to section.
 *
 * Where a long stretch of the page has no slot (release lists, requirements),
 * the Orb fades out rather than floating across text.
 *
 * No WebGL, or a lost GPU context, falls back to a static CSS Orb that follows
 * the same slots. Reduced motion keeps the Orb and drops its movement.
 *
 * The stage is rendered before the page content and must stay its first child
 * inside .page: the content sits above it, the page background below it.
 */

type Mode = "pending" | "webgl" | "static";

type OrbApi = {
  mode: Mode;
  /** True once the hero may reveal its copy. */
  introStarted: boolean;
  /** True when the intro was skipped (reduced motion, deep link, no WebGL): reveal copy at once. */
  introInstant: boolean;
  ripple: () => void;
  setOverride: (state: OrbStateName | null) => void;
  setDownloadPhase: (phase: OrbDownloadPhase) => void;
  setLoading: (loading: boolean) => void;
};

const noop = () => {};
const OrbContext = createContext<OrbApi>({
  mode: "pending",
  introStarted: false,
  introInstant: true,
  ripple: noop,
  setOverride: noop,
  setDownloadPhase: noop,
  setLoading: noop,
});

export const useOrb = () => useContext(OrbContext);

function pickQuality(): OrbQuality {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;
  if (cores <= 2 || memory <= 2) return "low";
  const small = window.matchMedia("(max-width: 767px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (small || coarse || cores <= 4 || memory <= 4) return "medium";
  return "high";
}

type Measured = { state: OrbStateName; cx: number; cy: number; r: number; top: number; bottom: number };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function OrbStage({ children }: { children: ReactNode }) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<OrbEngine | null>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [intro, setIntro] = useState({ started: false, instant: true });

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!layer || !canvas || !fallback) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let engine: OrbEngine | null = null;
    if (OrbEngine.isSupported()) {
      try {
        engine = new OrbEngine(canvas, { reducedMotion: reduced, quality: pickQuality() });
      } catch {
        engine = null;
      }
    }
    engineRef.current = engine;
    setMode(engine ? "webgl" : "static");

    /* ------------------------------------------------- static follower -- */
    const follow = { x: 0, y: 0, r: 0, o: 0, tx: 0, ty: 0, tr: 0, to: 0, ox: 0, oy: 0, init: false };
    let followRaf = 0;
    const followFrame = () => {
      followRaf = 0;
      const k = reduced ? 1 : 0.14;
      follow.x += (follow.tx - follow.x) * k;
      follow.y += (follow.ty - follow.y) * k;
      follow.r += (follow.tr - follow.r) * k;
      follow.o += (follow.to - follow.o) * k;
      const fx = follow.x + window.scrollX - follow.ox;
      const fy = follow.y + window.scrollY - follow.oy;
      fallback.style.transform = `translate3d(${(fx - 200).toFixed(1)}px, ${(fy - 200).toFixed(1)}px, 0) scale(${(follow.r / 200).toFixed(4)})`;
      fallback.style.opacity = follow.o.toFixed(3);
      const settling = Math.abs(follow.tx - follow.x) + Math.abs(follow.ty - follow.y) + Math.abs(follow.tr - follow.r) + Math.abs(follow.to - follow.o) > 0.5;
      if (settling) followRaf = requestAnimationFrame(followFrame);
    };

    const useFallback = () => {
      engine?.dispose();
      engine = null;
      engineRef.current = null;
      setMode("static");
      measure();
    };
    if (engine) engine.onLost = useFallback;

    /* ---------------------------------------------------------- slots -- */
    const slots = () => Array.from(document.querySelectorAll<HTMLElement>("[data-orb-slot]"));

    const read = (el: HTMLElement): Measured => {
      const rect = el.getBoundingClientRect();
      const scale = Number(el.dataset.orbScale || 1);
      return {
        state: (el.dataset.orbSlot as OrbStateName) || "idle",
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
        r: (Math.min(rect.width, rect.height) / 2) * scale,
        top: rect.top,
        bottom: rect.bottom,
      };
    };

    const resize = () => {
      const all = slots().map(read);
      const largest = all.reduce((m, s) => Math.max(m, s.r), 120);
      engine?.setBaseRadius(largest);
      measure(true);
    };

    // Where the stage layer starts in the document; the Orb is placed relative to it.
    const syncOrigin = () => {
      const rect = layer.getBoundingClientRect();
      const ox = rect.left + window.scrollX;
      const oy = rect.top + window.scrollY;
      engine?.setOrigin(ox, oy);
      follow.ox = ox;
      follow.oy = oy;
    };

    const measure = (immediate = false) => {
      syncOrigin();
      const all = slots().map(read);
      if (!all.length) return;
      const vh = window.innerHeight;
      const mid = vh / 2;
      let above: Measured | null = null;
      let below: Measured | null = null;
      for (const s of all) {
        if (s.cy <= mid) {
          if (!above || s.cy > above.cy) above = s;
        } else if (!below || s.cy < below.cy) below = s;
      }
      const visibility = (s: Measured) =>
        s.bottom < 0 ? clamp01(1 + s.bottom / (vh * 0.3)) : s.top > vh ? clamp01(1 - (s.top - vh) / (vh * 0.3)) : 1;

      let x: number, y: number, r: number, o: number, state: OrbStateName;
      if (above && below && below.top - above.bottom > vh * 0.9) {
        // A long orb-free stretch between two slots: stay with whichever is on screen, fade across the gap.
        const va = visibility(above), vb = visibility(below);
        const pick = va >= vb ? above : below;
        ({ cx: x, cy: y, r, state } = pick);
        o = Math.max(va, vb);
      } else if (above && below) {
        const span = below.cy - above.cy;
        const e = smooth(0.3, 0.7, span > 0 ? (mid - above.cy) / span : 0);
        x = above.cx + (below.cx - above.cx) * e;
        y = above.cy + (below.cy - above.cy) * e;
        r = above.r + (below.r - above.r) * e;
        state = e < 0.5 ? above.state : below.state;
        o = 1;
      } else {
        const only = (above ?? below) as Measured;
        ({ cx: x, cy: y, r, state } = only);
        o = visibility(only);
      }

      if (engine) {
        engine.setState(state);
        engine.setLayout(x, y, r, o, immediate);
        engine.start();
      } else {
        follow.tx = x; follow.ty = y; follow.tr = r; follow.to = o;
        if (!follow.init || immediate) {
          Object.assign(follow, { x, y, r, o, init: true });
        }
        if (!followRaf) followRaf = requestAnimationFrame(followFrame);
      }
    };

    let scheduled = 0;
    const schedule = () => {
      if (!scheduled) scheduled = requestAnimationFrame(() => { scheduled = 0; measure(); });
    };
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
      schedule();
    };

    /* -------------------------------------------------------- pointer -- */
    const onPointer = (e: PointerEvent) => engine?.setPointer(e.clientX, e.clientY);
    const onLeave = () => engine?.clearPointer();

    resize();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    if (finePointer && !reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    /* ---------------------------------------------------------- intro -- */
    const hero = document.querySelector<HTMLElement>('[data-orb-slot="hero"]');
    const heroInView = hero ? hero.getBoundingClientRect().bottom > 0 && window.scrollY < window.innerHeight * 0.5 : false;
    if (engine && heroInView && !reduced) {
      engine.playIntro();
      setIntro({ started: true, instant: false });
    } else {
      engine?.skipIntro();
      setIntro({ started: true, instant: true });
    }

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      cancelAnimationFrame(scheduled);
      cancelAnimationFrame(followRaf);
      window.clearTimeout(resizeTimer);
      engine?.dispose();
      engineRef.current = null;
    };
  }, []);

  const api = useMemo<OrbApi>(
    () => ({
      mode,
      introStarted: intro.started,
      introInstant: intro.instant,
      ripple: () => engineRef.current?.ripple(),
      setOverride: (s) => engineRef.current?.setOverride(s),
      setDownloadPhase: (p) => engineRef.current?.setDownloadPhase(p),
      setLoading: (l) => engineRef.current?.setLoading(l),
    }),
    [mode, intro],
  );

  return (
    <OrbContext.Provider value={api}>
      <div ref={layerRef} className={styles.layer} aria-hidden="true">
        <canvas ref={canvasRef} className={cx(styles.canvas, mode !== "webgl" && styles.hidden)} />
        <div ref={fallbackRef} className={cx(styles.fallback, mode !== "static" && styles.hidden)} />
      </div>
      {children}
    </OrbContext.Provider>
  );
}

/**
 * Where the Orb should be, and what it should become there. The slot is an
 * empty, square box sized by its section's layout; the Orb is drawn over it.
 * Only the hero slot is a focusable control — elsewhere the Orb is decorative.
 */
export function OrbSlot({
  state,
  scale = 1,
  className,
  interactive = false,
}: {
  state: OrbStateName;
  scale?: number;
  className?: string;
  interactive?: boolean;
}) {
  const { ripple } = useOrb();
  if (interactive) {
    return (
      <button
        type="button"
        className={cx(styles.slot, styles.slotButton, className)}
        data-orb-slot={state}
        data-orb-scale={scale}
        aria-label="Interact with the Orbis Orb"
        onClick={ripple}
      />
    );
  }
  return <div className={cx(styles.slot, className)} data-orb-slot={state} data-orb-scale={scale} aria-hidden="true" onClick={ripple} />;
}
