"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import styles from "./CrystalField.module.css";

/**
 * Cinematic crystal field — an original composition of faceted, iridescent
 * forms floating in a deep atmosphere with light rays and dust.
 * Pure SVG (no WebGL, no images). Deterministic (seeded), so server and
 * client render identically. Gentle drift + pointer parallax; both are
 * disabled under prefers-reduced-motion.
 */

type Hue = "gold" | "champagne" | "copper" | "amber" | "steel";
type Variant = "hero" | "ambient" | "product" | "cta";

/* [mid, light, deep] — a warm-led gold/bronze metal palette. `steel` is the
   single cool counterpoint: polished metal needs one cold reflection to read
   as metal rather than as flat yellow plastic. */
const PALETTE: Record<Hue, [string, string, string]> = {
  gold: ["#e0a147", "#ffd79a", "#764110"],
  champagne: ["#d9b877", "#fff0d0", "#6d5220"],
  copper: ["#dd8438", "#ffc48a", "#78390b"],
  amber: ["#ffb866", "#ffe1b3", "#b0621c"],
  steel: ["#7d94c4", "#cbd9f0", "#2f4066"],
};
const RIM_WARM = "#ffb46a";
const RIM_HOT = "#ffd9a6";

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Silhouette families, so no two crystals share the same outline. */
type Shape = "kite" | "shard" | "blunt" | "wide" | "skew";

type CrystalSpec = {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  hues: [Hue, Hue, Hue];
  blur?: number;
  opacity?: number;
  depth: number;
  glow?: boolean;
  shape?: Shape;
};

/** Girdle / apex geometry per family. Returns [top, bottom, left, right, ridge]. */
function outline(shape: Shape, w: number, h: number): number[][] {
  switch (shape) {
    case "shard": // long, narrow, high shoulders
      return [[0, -h / 2], [w * 0.04, h / 2], [-w / 2, -h * 0.26], [w / 2, -h * 0.32], [-w * 0.1, -h * 0.18]];
    case "blunt": // truncated apex, heavy body
      return [[-w * 0.16, -h * 0.4], [-w * 0.04, h / 2], [-w / 2, -h * 0.02], [w / 2, -h * 0.1], [-w * 0.14, h * 0.1]];
    case "wide": // squat gem, girdle near the middle
      return [[w * 0.06, -h / 2], [-w * 0.02, h / 2], [-w / 2, -h * 0.04], [w / 2, h * 0.02], [-w * 0.08, h * 0.08]];
    case "skew": // leaning, asymmetric
      return [[w * 0.18, -h / 2], [-w * 0.16, h / 2], [-w / 2, -h * 0.02], [w / 2, -h * 0.22], [-w * 0.02, -h * 0.04]];
    default: // kite — the classic elongated octahedron
      return [[0, -h / 2], [0, h / 2], [-w / 2, -h * 0.1], [w / 2, -h * 0.16], [-w * 0.12, h * 0.04]];
  }
}

function Crystal({ id, c }: { id: string; c: CrystalSpec }) {
  const { w, h } = c;
  const [T, B, L, R, F] = outline(c.shape ?? "kite", w, h);
  const p = (pts: number[][]) => pts.map((q) => q.join(",")).join(" ");
  const [h1, h2, h3] = c.hues;
  const g1 = PALETTE[h1];
  const g2 = PALETTE[h2];
  const g3 = PALETTE[h3];
  const silhouette = p([T, R, B, L]);
  const sharp = !c.blur;

  /**
   * Environment map. Every facet samples this same vertical "world" —
   * bright cool sky at the top, a hard amber horizon line, dark ground —
   * from a different angle and range, which is what makes polished metal
   * read as metal: hard-edged reflections that differ per face.
   */
  const env = (gid: string, x1: number, y1: number, x2: number, y2: number) => (
    <linearGradient id={gid} x1={x1} y1={y1} x2={x2} y2={y2}>
      {/* smooth studio environment: soft sky, saturated mid-tones, warm falloff */}
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.1" stopColor="#fff4e2" />
      <stop offset="0.24" stopColor={g2[1]} />
      <stop offset="0.38" stopColor={g2[0]} />
      <stop offset="0.5" stopColor={g1[0]} />
      <stop offset="0.6" stopColor={g3[0]} />
      <stop offset="0.7" stopColor={g1[2]} />
      <stop offset="0.8" stopColor="#2a1c0c" />
      <stop offset="0.88" stopColor="#3a2318" />
      <stop offset="0.95" stopColor="#8a5330" />
      <stop offset="1" stopColor={RIM_WARM} />
    </linearGradient>
  );

  return (
    <g
      transform={`translate(${c.x} ${c.y}) rotate(${c.rot})`}
      style={{ opacity: c.opacity ?? 1 }}
      filter={c.blur ? `url(#${id}-blur)` : undefined}
    >
      <defs>
        {c.blur && (
          <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={c.blur} />
          </filter>
        )}

        {/* Metal surface: two specular lights (cool above, warm below) + brushed grain */}
        {sharp && (
          <filter id={`${id}-metal`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation={Math.max(1.5, w * 0.022)} result="soft" />
            <feSpecularLighting in="soft" surfaceScale={Math.max(4, w * 0.05)} specularConstant="1" specularExponent="24" lightingColor="#ffffff" result="specCool">
              <fePointLight x={-w * 1.3} y={-h * 1.5} z={w * 2.2} />
            </feSpecularLighting>
            <feSpecularLighting in="soft" surfaceScale={Math.max(4, w * 0.05)} specularConstant="0.7" specularExponent="14" lightingColor={RIM_WARM} result="specWarm">
              <fePointLight x={w * 0.6} y={h * 1.6} z={w * 1.4} />
            </feSpecularLighting>
            <feComposite in="specCool" in2="specWarm" operator="arithmetic" k1="0" k2="1" k3="0.6" k4="0" result="spec" />
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
            <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="0.55" k4="0" result="lit" />
            {/* very fine grain — texture without stripes */}
            <feTurbulence type="fractalNoise" baseFrequency="1.1 0.35" numOctaves="2" seed="7" result="grainRaw" />
            <feColorMatrix in="grainRaw" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.07 0" result="grain" />
            <feComposite in="grain" in2="SourceAlpha" operator="in" result="grainIn" />
            <feBlend in="lit" in2="grainIn" mode="overlay" result="brushed" />
            <feComposite in="brushed" in2="SourceAlpha" operator="in" />
          </filter>
        )}
        <clipPath id={`${id}-clip`}>
          <polygon points={silhouette} />
        </clipPath>

        {/* Each face reflects a different, gently rotated slice of the environment */}
        {env(`${id}-tl`, 0.15, -0.2, 0.85, 1.2)}
        {env(`${id}-tr`, 0.9, -0.45, 0.2, 1.0)}
        {env(`${id}-bl`, 0.25, 0.0, 0.7, 1.1)}
        {env(`${id}-br`, 0.8, 0.05, 0.3, 1.08)}

        {/* broad soft reflection sweep + one faint secondary */}
        <linearGradient id={`${id}-env`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.3" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.48" stopColor="#ffffff" stopOpacity="0.38" />
          <stop offset="0.6" stopColor="#fff0d8" stopOpacity="0.08" />
          <stop offset="0.7" stopColor="#fff0d8" stopOpacity="0.18" />
          <stop offset="0.85" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* soft colour bloom where the sky reflects */}
        <radialGradient id={`${id}-bloom`} cx="38%" cy="30%" r="55%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="0.35" stopColor={g2[1]} stopOpacity="0.22" />
          <stop offset="1" stopColor={g2[0]} stopOpacity="0" />
        </radialGradient>
        {/* Fresnel: edges brighter than the centre */}
        <radialGradient id={`${id}-fresnel`} cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.72" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id={`${id}-ridge`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="0.2" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.5" stopColor={g2[1]} stopOpacity="0.9" />
          <stop offset="0.82" stopColor={RIM_HOT} stopOpacity="1" />
          <stop offset="1" stopColor={RIM_WARM} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={RIM_WARM} stopOpacity="0" />
          <stop offset="0.5" stopColor={RIM_WARM} stopOpacity="0.7" />
          <stop offset="1" stopColor={RIM_HOT} stopOpacity="1" />
        </linearGradient>
        <filter id={`${id}-rimglow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={Math.max(2, w * 0.03)} />
        </filter>
        <filter id={`${id}-hot`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={Math.max(2, w * 0.035)} />
        </filter>
        {c.glow && (
          <>
            <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor={g2[1]} stopOpacity="0.32" />
              <stop offset="0.4" stopColor={g1[0]} stopOpacity="0.14" />
              <stop offset="0.75" stopColor={g1[0]} stopOpacity="0.03" />
              <stop offset="1" stopColor={g1[0]} stopOpacity="0" />
            </radialGradient>
            <filter id={`${id}-halo-blur`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={Math.max(18, w * 0.12)} />
            </filter>
          </>
        )}
      </defs>

      {c.glow && (
        <ellipse cx="0" cy={h * 0.05} rx={w * 1.05} ry={h * 0.58} fill={`url(#${id}-halo)`} filter={`url(#${id}-halo-blur)`} />
      )}

      {/* faces — mirrored environment, lit and brushed */}
      <g filter={sharp ? `url(#${id}-metal)` : undefined}>
        <polygon points={p([T, L, F])} fill={`url(#${id}-tl)`} />
        <polygon points={p([T, F, R])} fill={`url(#${id}-tr)`} />
        <polygon points={p([B, L, F])} fill={`url(#${id}-bl)`} />
        <polygon points={p([B, F, R])} fill={`url(#${id}-br)`} />
      </g>

      {/* clipped overlays: streaks, fresnel, hot spots */}
      <g clipPath={`url(#${id}-clip)`}>
        <g style={{ mixBlendMode: "screen" }}>
          <rect x={-w} y={-h} width={w * 2} height={h * 2} fill={`url(#${id}-env)`} transform={`rotate(-26) translate(${-w * 0.05} 0)`} />
        </g>
        <ellipse cx={-w * 0.06} cy={-h * 0.14} rx={w * 0.42} ry={h * 0.3} fill={`url(#${id}-bloom)`} />
        <polygon points={silhouette} fill={`url(#${id}-fresnel)`} />
        {/* soft hot spots near the upper-left light and the warm base */}
        <ellipse cx={-w * 0.22} cy={-h * 0.2} rx={w * 0.16} ry={h * 0.06} fill="#ffffff" opacity="0.5" filter={`url(#${id}-hot)`} transform={`rotate(-32 ${-w * 0.22} ${-h * 0.2})`} />
        <ellipse cx={w * 0.1} cy={h * 0.36} rx={w * 0.12} ry={h * 0.03} fill={RIM_HOT} opacity="0.45" filter={`url(#${id}-hot)`} transform={`rotate(-20 ${w * 0.1} ${h * 0.36})`} />
        {/* internal refraction lines */}
        <g stroke="#ffffff" strokeOpacity="0.12" fill="none">
          <line x1={T[0]} y1={T[1]} x2={F[0] + w * 0.22} y2={F[1] + h * 0.18} />
          <line x1={F[0]} y1={F[1]} x2={B[0] + w * 0.16} y2={B[1] - h * 0.12} />
        </g>
      </g>

      {/* dark bevels just inside each facet edge */}
      <polyline points={p([T, F, B])} fill="none" stroke="#0a0806" strokeOpacity="0.4" strokeWidth="2.6" />
      <line x1={L[0]} y1={L[1]} x2={F[0]} y2={F[1]} stroke="#0a0806" strokeOpacity="0.32" strokeWidth="2" />
      <line x1={F[0]} y1={F[1]} x2={R[0]} y2={R[1]} stroke="#0a0806" strokeOpacity="0.32" strokeWidth="2" />

      {/* amber rim light on the lower silhouette (glow, then crisp line) */}
      <polyline points={p([L, B, R])} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="6" strokeOpacity="0.6" filter={`url(#${id}-rimglow)`} />
      <polyline points={p([L, B, R])} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="1.5" />

      {/* cool specular edges on the upper silhouette + front ridge */}
      <polyline points={p([T, F, B])} fill="none" stroke={`url(#${id}-ridge)`} strokeWidth="1.6" />
      <polyline points={p([L, T, R])} fill="none" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1" />
      <line x1={L[0]} y1={L[1]} x2={F[0]} y2={F[1]} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.9" />
      <line x1={F[0]} y1={F[1]} x2={R[0]} y2={R[1]} stroke="#ffffff" strokeOpacity="0.95" strokeWidth="1" />

      {/* apex sparkle + warm base glint */}
      <circle cx={T[0]} cy={T[1]} r="2.6" fill="#ffffff" />
      <circle cx={T[0]} cy={T[1]} r="7" fill="#ffffff" opacity="0.28" />
      <circle cx={B[0]} cy={B[1]} r="2" fill={RIM_HOT} />
      <circle cx={B[0]} cy={B[1]} r="8" fill={RIM_WARM} opacity="0.25" />
    </g>
  );
}

function specs(variant: Variant, seed: number, hues: Hue[]): { crystals: CrystalSpec[]; dust: number } {
  const r = rng(seed);
  const pick = (): [Hue, Hue, Hue] => [hues[0], hues[1 % hues.length], hues[2 % hues.length]];
  const alt = (): [Hue, Hue, Hue] => [hues[1 % hues.length], hues[2 % hues.length], hues[0]];

  if (variant === "hero") {
    return {
      dust: 90,
      crystals: [
        // far, blurred background shards
        { x: 1030, y: 130, w: 62, h: 200, rot: 28, hues: alt(), blur: 6, opacity: 0.45, depth: 0.4, shape: "shard" },
        { x: 1160, y: 470, w: 48, h: 168, rot: -18, hues: pick(), blur: 7, opacity: 0.4, depth: 0.35, shape: "kite" },
        { x: 505, y: 795, w: 78, h: 230, rot: 64, hues: alt(), blur: 8, opacity: 0.42, depth: 0.5, shape: "wide" },
        { x: 690, y: 120, w: 34, h: 120, rot: -40, hues: pick(), blur: 4, opacity: 0.5, depth: 0.6, shape: "shard" },
        // mid crystals — each a different silhouette
        { x: 505, y: 300, w: 132, h: 300, rot: -24, hues: alt(), opacity: 0.94, depth: 1.1, shape: "skew" },
        { x: 1075, y: 655, w: 126, h: 268, rot: 38, hues: pick(), opacity: 0.9, depth: 1.2, shape: "wide" },
        { x: 1165, y: 250, w: 56, h: 176, rot: 12, hues: alt(), opacity: 0.86, depth: 1.4, shape: "shard" },
        { x: 405, y: 585, w: 62, h: 146, rot: 70, hues: pick(), opacity: 0.8, depth: 1.5, shape: "blunt" },
        // the hero crystal — the focal object, fully in frame
        { x: 815, y: 445, w: 300, h: 560, rot: 13, hues: pick(), depth: 1, glow: true, shape: "kite" },
        // near, large, out of focus
        { x: 250, y: 840, w: 168, h: 310, rot: -58, hues: alt(), blur: 10, opacity: 0.46, depth: 2.2, shape: "blunt" },
        { x: 1268, y: 790, w: 148, h: 300, rot: 34, hues: pick(), blur: 11, opacity: 0.42, depth: 2.4, shape: "skew" },
      ],
    };
  }
  if (variant === "product") {
    return {
      dust: 26,
      crystals: [
        { x: 300 + r() * 40, y: 200, w: 120, h: 270, rot: -10 + r() * 20, hues: pick(), depth: 1, glow: true },
        { x: 470, y: 120, w: 40, h: 120, rot: 30, hues: alt(), blur: 3, opacity: 0.7, depth: 0.6 },
        { x: 150, y: 300, w: 46, h: 140, rot: -35, hues: alt(), blur: 4, opacity: 0.6, depth: 0.7 },
        { x: 440, y: 330, w: 30, h: 90, rot: 55, hues: pick(), opacity: 0.85, depth: 1.3 },
      ],
    };
  }
  if (variant === "cta") {
    return {
      dust: 60,
      crystals: [
        { x: 600, y: 440, w: 200, h: 470, rot: 10, hues: pick(), depth: 1, glow: true, opacity: 0.9 },
        { x: 330, y: 300, w: 70, h: 200, rot: -30, hues: alt(), blur: 4, opacity: 0.6, depth: 0.6 },
        { x: 880, y: 300, w: 60, h: 180, rot: 28, hues: alt(), blur: 5, opacity: 0.6, depth: 0.5 },
        { x: 240, y: 700, w: 110, h: 240, rot: -55, hues: pick(), blur: 8, opacity: 0.45, depth: 2 },
        { x: 960, y: 720, w: 90, h: 220, rot: 40, hues: alt(), blur: 8, opacity: 0.45, depth: 2.2 },
      ],
    };
  }
  // ambient — small, quiet, for inner-page heroes
  return {
    dust: 30,
    crystals: [
      { x: 960, y: 260, w: 90, h: 260, rot: 18, hues: pick(), opacity: 0.85, depth: 1, glow: true },
      { x: 1120, y: 480, w: 50, h: 150, rot: -24, hues: alt(), blur: 4, opacity: 0.55, depth: 0.6 },
      { x: 820, y: 560, w: 36, h: 110, rot: 48, hues: alt(), blur: 3, opacity: 0.6, depth: 1.3 },
      { x: 1160, y: 150, w: 30, h: 90, rot: -10, hues: pick(), blur: 2, opacity: 0.6, depth: 0.5 },
    ],
  };
}

export function CrystalField({
  variant = "hero",
  hues = ["gold", "champagne", "copper"],
  seed = 7,
  className,
  parallax = variant === "hero",
  id = "cf",
}: {
  variant?: Variant;
  hues?: Hue[];
  seed?: number;
  className?: string;
  parallax?: boolean;
  id?: string;
}) {
  const ref = useRef<SVGSVGElement | null>(null);
  const { crystals, dust } = specs(variant, seed, hues);
  const r = rng(seed * 31 + 7);
  const W = variant === "product" ? 600 : 1200;
  const H = variant === "product" ? 420 : 900;
  const dustPts = Array.from({ length: dust }, () => ({
    x: r() * W,
    y: r() * H,
    s: 0.6 + r() * 1.8,
    o: 0.15 + r() * 0.7,
    warm: r() > 0.7,
  }));

  useEffect(() => {
    if (!parallax) return;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.setProperty("--mx", mx.toFixed(3));
        el.style.setProperty("--my", my.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [parallax]);

  const sorted = [...crystals].sort((a, b) => a.depth - b.depth);

  return (
    <svg
      ref={ref}
      className={cx(styles.svg, styles[variant], className)}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={`${id}-atmo1`} cx="62%" cy="48%" r="45%">
          <stop offset="0" stopColor="#c98b3c" stopOpacity="0.34" />
          <stop offset="0.5" stopColor="#8a5417" stopOpacity="0.14" />
          <stop offset="1" stopColor="#0a0806" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-atmo2`} cx="20%" cy="90%" r="45%">
          <stop offset="0" stopColor="#7d4a15" stopOpacity="0.22" />
          <stop offset="1" stopColor="#0a0806" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-ray`} x1="1" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="0.5" stopColor="#ffdca8" stopOpacity="0.06" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id={`${id}-dustglow`} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      {/* atmosphere */}
      <rect width={W} height={H} fill={`url(#${id}-atmo1)`} />
      <rect width={W} height={H} fill={`url(#${id}-atmo2)`} />

      {/* light rays from top-right */}
      {variant !== "product" && (
        <g className={styles.rays} filter={`url(#${id}-soft)`}>
          <polygon points={`${W * 0.72},-40 ${W * 0.98},-40 ${W * 0.62},${H * 1.1} ${W * 0.3},${H * 1.1}`} fill={`url(#${id}-ray)`} />
          <polygon points={`${W * 0.86},-40 ${W * 1.05},-40 ${W * 0.9},${H * 1.1} ${W * 0.7},${H * 1.1}`} fill={`url(#${id}-ray)`} opacity="0.6" />
        </g>
      )}

      {/* far dust */}
      <g className={styles.dustFar} style={{ ["--depth" as string]: 0.3 } as React.CSSProperties}>
        {dustPts.slice(0, Math.floor(dust * 0.6)).map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.s * 0.7} fill={d.warm ? "#ffd9a8" : "#f0e2c8"} opacity={d.o * 0.6} />
        ))}
      </g>

      {/* crystals, back to front, each on its own parallax depth */}
      {sorted.map((c, i) => (
        <g key={i} className={styles.layer} style={{ ["--depth" as string]: c.depth, ["--i" as string]: i } as React.CSSProperties}>
          <Crystal id={`${id}-c${i}`} c={c} />
        </g>
      ))}

      {/* near dust with glow */}
      <g className={styles.dustNear} style={{ ["--depth" as string]: 1.8 } as React.CSSProperties}>
        {dustPts.slice(Math.floor(dust * 0.6)).map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.s} fill={d.warm ? "#ffcf94" : "#ffffff"} opacity={d.o} filter={`url(#${id}-dustglow)`} />
        ))}
      </g>
    </svg>
  );
}
