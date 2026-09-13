"use client";

import { useEffect } from "react";

/**
 * One pointer listener for every Liquid Glass surface on the page.
 *
 * Each `.glass` element reads --gx/--gy (where the light sits) and --gi (how
 * activated the surface is). Rather than attaching listeners per element,
 * this tracks the pointer once and writes to whichever surface it is over,
 * easing the previous one back to rest. Cost stays flat no matter how many
 * glass surfaces the page contains.
 *
 * Inert on touch devices and under prefers-reduced-motion — the surfaces then
 * keep their static translucency, edge and depth from CSS alone.
 */
export function GlassRuntime() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    type State = { el: HTMLElement; x: number; y: number; i: number; tx: number; ty: number; ti: number };
    let current: State | null = null;
    let fading: State | null = null;
    let raf = 0;

    const write = (s: State) => {
      s.el.style.setProperty("--gx", `${s.x.toFixed(1)}%`);
      s.el.style.setProperty("--gy", `${s.y.toFixed(1)}%`);
      s.el.style.setProperty("--gi", s.i.toFixed(3));
    };

    const clear = (s: State) => {
      s.el.style.removeProperty("--gx");
      s.el.style.removeProperty("--gy");
      s.el.style.removeProperty("--gi");
    };

    const step = () => {
      raf = 0;
      let alive = false;

      if (current) {
        const k = 0.18;
        current.x += (current.tx - current.x) * k;
        current.y += (current.ty - current.y) * k;
        current.i += (current.ti - current.i) * 0.12;
        write(current);
        if (Math.abs(current.tx - current.x) > 0.1 || Math.abs(current.ty - current.y) > 0.1 || Math.abs(current.ti - current.i) > 0.004) alive = true;
      }

      if (fading) {
        fading.i += (0 - fading.i) * 0.12;
        write(fading);
        if (fading.i < 0.01) {
          clear(fading);
          fading = null;
        } else {
          alive = true;
        }
      }

      if (alive) raf = requestAnimationFrame(step);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>(".glass") ?? null;

      if (target !== current?.el) {
        if (current) {
          if (fading && fading !== current) clear(fading);
          fading = current;
          fading.ti = 0;
        }
        current = target ? { el: target, x: 50, y: 50, i: 0, tx: 50, ty: 50, ti: 1 } : null;
        if (current && fading?.el === current.el) fading = null;
      }

      if (current) {
        const r = current.el.getBoundingClientRect();
        current.tx = Math.max(-10, Math.min(110, ((e.clientX - r.left) / r.width) * 100));
        current.ty = Math.max(-10, Math.min(110, ((e.clientY - r.top) / r.height) * 100));
        current.ti = 1;
      }
      kick();
    };

    const onLeave = () => {
      if (current) {
        if (fading && fading !== current) clear(fading);
        fading = current;
        fading.ti = 0;
        current = null;
        kick();
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      if (current) clear(current);
      if (fading) clear(fading);
    };
  }, []);

  return null;
}
