"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";
type FillFrom = "left" | "right" | "bottom" | "diagonal" | "center";
type Intensity = "hero" | "major" | "default";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** Directional arrow with masked forward roll on hover. */
  arrow?: boolean;
  loading?: boolean;
  /** Text shown while loading. Dimensions never change. */
  loadingLabel?: string;
  /** Direction the surface fill travels from — vary by context for rhythm. */
  fillFrom?: FillFrom;
  /** Layer density: hero = full choreography, major = most, default = reduced. */
  intensity?: Intensity;
  /** Approach-zone magnetism (fine pointers only). On by default for pills. */
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps & { href: string; external?: boolean; onClick?: () => void };
type NativeProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
export type ButtonProps = LinkProps | NativeProps;

/* ------------------------------------------------------------------------ */
/* Interaction engine                                                        */
/* Approach → Detect → Activate → Transform → React → Settle                 */
/* All motion is transform/opacity/clip-path/CSS-variable driven; a single   */
/* rAF loop per button interpolates cursor-derived values and stops when     */
/* settled. Nothing here runs for touch or reduced-motion users.             */
/* ------------------------------------------------------------------------ */
function useButtonFx(magnetic: boolean, intensity: Intensity) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    // Reduced motion keeps the button's states (fill, colour, border, light)
    // but drops everything that moves: magnetism, parallax, perimeter trace,
    // click pulse. The CSS marks the element so it can style accordingly.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.classList.add(styles.fx);
    if (reduced) {
      const enter = () => el.classList.add(styles.hot);
      const leave = () => el.classList.remove(styles.hot);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    }

    const magnetPx = intensity === "hero" ? 5 : intensity === "major" ? 3 : 1.5;
    const zone = 36; // approach zone in px around the pill

    // targets (t*) and current (c*) values
    let tlx = 50, tly = 50, clx = 50, cly = 50; // light position, %
    let tdx = 0, tdy = 0, cdx = 0, cdy = 0; // parallax, -1..1
    let tmx = 0, tmy = 0, cmx = 0, cmy = 0; // magnetic offset, px
    let raf = 0;
    let running = false;
    let inside = false;

    const write = () => {
      el.style.setProperty("--lx", `${clx.toFixed(2)}%`);
      el.style.setProperty("--ly", `${cly.toFixed(2)}%`);
      el.style.setProperty("--dx", cdx.toFixed(3));
      el.style.setProperty("--dy", cdy.toFixed(3));
      el.style.setProperty("--mgx", `${cmx.toFixed(2)}px`);
      el.style.setProperty("--mgy", `${cmy.toFixed(2)}px`);
    };

    const loop = () => {
      const k = 0.16;
      clx += (tlx - clx) * k;
      cly += (tly - cly) * k;
      cdx += (tdx - cdx) * k;
      cdy += (tdy - cdy) * k;
      cmx += (tmx - cmx) * 0.14;
      cmy += (tmy - cmy) * 0.14;
      write();
      const settled =
        Math.abs(tlx - clx) < 0.05 && Math.abs(tly - cly) < 0.05 && Math.abs(tdx - cdx) < 0.002 && Math.abs(tmx - cmx) < 0.02 && Math.abs(tmy - cmy) < 0.02;
      if (settled && !inside) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const onEnter = (e: PointerEvent) => {
      inside = true;
      const r = el.getBoundingClientRect();
      // perimeter trace originates where the cursor crossed the edge
      const ang = (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI + 90;
      el.style.setProperty("--trace-from", `${ang.toFixed(1)}deg`);
      el.classList.remove(styles.tracing);
      void el.offsetWidth; // restart the trace cleanly on quick re-entry
      el.classList.add(styles.tracing);
      el.classList.add(styles.hot);
      start();
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      tlx = Math.min(100, Math.max(0, x * 100));
      tly = Math.min(100, Math.max(0, y * 100));
      tdx = (x - 0.5) * 2;
      tdy = (y - 0.5) * 2;
      start();
    };

    const onLeave = () => {
      inside = false;
      el.classList.remove(styles.hot);
      tdx = 0;
      tdy = 0;
      tlx = 50;
      tly = 50;
      if (!magnetic) {
        tmx = 0;
        tmy = 0;
      }
      start();
    };

    const onDown = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", `${(e.clientX - r.left).toFixed(1)}px`);
      el.style.setProperty("--py", `${(e.clientY - r.top).toFixed(1)}px`);
      el.classList.remove(styles.pulsing);
      void el.offsetWidth;
      el.classList.add(styles.pulsing);
    };

    // Approach zone (magnetic buttons only): awareness begins before contact
    const onWindowMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cxp = r.left + r.width / 2;
      const cyp = r.top + r.height / 2;
      const dx = e.clientX - cxp;
      const dy = e.clientY - cyp;
      const nearX = Math.abs(dx) < r.width / 2 + zone;
      const nearY = Math.abs(dy) < r.height / 2 + zone;
      if (nearX && nearY) {
        el.classList.add(styles.near);
        const fx = Math.max(-1, Math.min(1, dx / (r.width / 2 + zone)));
        const fy = Math.max(-1, Math.min(1, dy / (r.height / 2 + zone)));
        tmx = fx * magnetPx;
        tmy = fy * magnetPx * 0.8;
        start();
      } else if (el.classList.contains(styles.near)) {
        el.classList.remove(styles.near);
        tmx = 0;
        tmy = 0;
        start();
      }
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    if (magnetic) window.addEventListener("pointermove", onWindowMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onWindowMove);
    };
  }, [magnetic, intensity]);

  return ref;
}

/* ------------------------------------------------------------------------ */

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    arrow = false,
    loading = false,
    loadingLabel,
    fillFrom = "left",
    intensity = "default",
    magnetic = true,
    className,
    children,
  } = props;

  const v = variant === "inverse" ? "primary" : variant;
  const ref = useButtonFx(magnetic && v !== "ghost", intensity);
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      ref.current = node;
    },
    [ref],
  );

  const classes = cx(
    styles.btn,
    styles[v],
    styles[size],
    styles[`from_${fillFrom}`],
    styles[`i_${intensity}`],
    loading && styles.loading,
    className,
  );

  const content = (
    <>
      {v !== "ghost" && (
        <>
          <span className={styles.fill} aria-hidden="true" />
          <span className={styles.edge} aria-hidden="true" />
          <span className={styles.light} aria-hidden="true" />
          <span className={styles.grid} aria-hidden="true" />
          <span className={styles.trace} aria-hidden="true" />
          <span className={styles.pulse} aria-hidden="true" />
        </>
      )}
      <span className={styles.inner}>
        <span className={styles.labelWrap}>
          <span className={styles.label}>
            <span className={styles.labelA}>{children}</span>
            <span className={styles.labelB} aria-hidden="true">
              {children}
            </span>
          </span>
          {loading && <span className={styles.loadingLabel}>{loadingLabel ?? children}</span>}
        </span>
        {(arrow || loading) && (
          <span className={styles.arrow} aria-hidden="true">
            {loading ? (
              <span className={styles.dots}>
                <i />
                <i />
                <i />
              </span>
            ) : (
              <>
                <svg className={styles.arrowA} viewBox="0 0 20 12" fill="none">
                  <path d="M1 6h16M12.5 1.5 17 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg className={styles.arrowB} viewBox="0 0 20 12" fill="none">
                  <path d="M1 6h16M12.5 1.5 17 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={styles.trail} />
              </>
            )}
          </span>
        )}
      </span>
    </>
  );

  if ("href" in props && props.href) {
    const { href, external, onClick } = props;
    if (external) {
      return (
        <a ref={setRef as (n: HTMLAnchorElement | null) => void} href={href} className={classes} target="_blank" rel="noreferrer noopener" onClick={onClick} data-cursor="cta">
          {content}
        </a>
      );
    }
    return (
      <Link ref={setRef as (n: HTMLAnchorElement | null) => void} href={href} className={classes} onClick={onClick} data-cursor="cta">
        {content}
      </Link>
    );
  }

  const {
    href: _href,
    variant: _v,
    size: _s,
    arrow: _a,
    loading: _l,
    loadingLabel: _ll,
    fillFrom: _f,
    intensity: _i,
    magnetic: _m,
    className: _c,
    children: _ch,
    ...rest
  } = props as NativeProps;
  void _href; void _v; void _s; void _a; void _l; void _ll; void _f; void _i; void _m; void _c; void _ch;

  return (
    <button
      ref={setRef as (n: HTMLButtonElement | null) => void}
      className={classes}
      aria-busy={loading || undefined}
      disabled={rest.disabled || loading}
      data-cursor="cta"
      {...rest}
    >
      {content}
    </button>
  );
}
