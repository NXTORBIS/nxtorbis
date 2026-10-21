"use client";

import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import type { OrbisCapabilityId } from "@/content/orbis";
import styles from "../Orbis.module.css";

/**
 * One drawing per headline feature.
 *
 * These are compositions, not screenshots: nothing here shows an interface
 * Orbis does not have, and nothing shows data. A tab strip is three bars, a
 * race is a sweep of light, Earth is a wire globe. Everything animates in CSS
 * from a single `.inView` class on the section, so a feature out of sight
 * costs nothing, and `prefers-reduced-motion` stops the movement without
 * removing the picture.
 */

const v = (name: string, value: string | number) => ({ [name]: String(value) }) as CSSProperties;

/** Deterministic pseudo-random in [0,1) — same picture on the server and in the browser. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

/* ---------------------------------------------------------------- browser -- */
/** A tab strip filling in, a page drawing itself, and three ads struck out. */
function BrowserVisual() {
  return (
    <div className={cx(styles.fx, styles.fxBrowser)} aria-hidden="true">
      <div className={styles.browserBar}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={styles.browserTab} style={v("--d", `${i * 220}ms`)} />
        ))}
        <span className={styles.browserPlus} style={v("--d", "760ms")} />
      </div>
      <div className={styles.browserPage}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={styles.browserLine} style={{ ...v("--d", `${900 + i * 120}ms`), ...v("--w", `${[86, 72, 94, 58, 80][i]}%`) }} />
        ))}
        {[0, 1, 2].map((i) => (
          <span key={i} className={cx(styles.browserAd, styles[`ad${i + 1}`])} style={v("--d", `${1500 + i * 260}ms`)} />
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- orion ai -- */
/** A question typed into the address bar, then an answer with its sources. */
function OrionVisual() {
  return (
    <div className={cx(styles.fx, styles.fxOrion)} aria-hidden="true">
      <div className={styles.orionBar}>
        <span className={styles.orionDot} />
        <span className={styles.orionType} />
        <span className={styles.orionKey}>⌃⏎</span>
      </div>
      <div className={styles.orionCard}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={styles.orionLine} style={{ ...v("--d", `${1500 + i * 140}ms`), ...v("--w", `${[92, 78, 64][i]}%`) }} />
        ))}
        <div className={styles.orionSources}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={styles.orionSource} style={v("--d", `${2000 + i * 160}ms`)}>
              {i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- toolkit -- */
/** A dense grid of tools, lighting in waves from the centre. */
const TOOL_CELLS = Array.from({ length: 108 }, (_, i) => {
  const col = i % 12;
  const row = Math.floor(i / 12);
  return { i, delay: (Math.abs(col - 5.5) + Math.abs(row - 4)) * 90 + rand(i) * 260, lit: rand(i + 50) > 0.72 };
});

function ToolkitVisual() {
  return (
    <div className={cx(styles.fx, styles.fxToolkit)} aria-hidden="true">
      <div className={styles.toolGrid}>
        {TOOL_CELLS.map((c) => (
          <span key={c.i} className={cx(styles.toolCell, c.lit && styles.toolCellLit)} style={v("--d", `${Math.round(c.delay)}ms`)} />
        ))}
      </div>
      <span className={styles.toolSweep} />
    </div>
  );
}

/* --------------------------------------------------------------- courses -- */
/** Modules completing along a path, and a mastery ring closing. */
function CoursesVisual() {
  return (
    <div className={cx(styles.fx, styles.fxCourses)} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.courseTrack} focusable="false">
        <path d="M8,84 C26,84 24,58 40,58 S60,38 70,38 S88,16 94,16" pathLength={1} vectorEffect="non-scaling-stroke" />
        <path className={styles.courseDone} d="M8,84 C26,84 24,58 40,58 S60,38 70,38 S88,16 94,16" pathLength={1} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className={styles.courseNodes}>
        {[
          [8, 84],
          [40, 58],
          [70, 38],
          [94, 16],
        ].map(([x, y], i) => (
          <span key={i} className={styles.courseNode} style={{ ...v("--x", `${x}%`), ...v("--y", `${y}%`), ...v("--d", `${600 + i * 420}ms`) }} />
        ))}
      </div>
      <svg viewBox="0 0 36 36" className={styles.courseRing} focusable="false">
        <circle cx="18" cy="18" r="15" pathLength={1} vectorEffect="non-scaling-stroke" />
        <circle className={styles.courseRingFill} cx="18" cy="18" r="15" pathLength={1} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------- chess -- */
/** A board, with a knight's path drawn across it. */
const KNIGHT = [
  [1, 6],
  [3, 5],
  [4, 3],
  [6, 2],
  [5, 0],
];

function ChessVisual() {
  return (
    <div className={cx(styles.fx, styles.fxChess)} aria-hidden="true">
      <div className={styles.chessBoard}>
        {Array.from({ length: 64 }, (_, i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          return <span key={i} className={cx(styles.chessSquare, (col + row) % 2 === 1 && styles.chessSquareDark)} style={v("--d", `${(col + row) * 45}ms`)} />;
        })}
      </div>
      <svg viewBox="0 0 8 8" className={styles.chessPath} focusable="false">
        {KNIGHT.slice(0, -1).map(([x, y], i) => {
          const [nx, ny] = KNIGHT[i + 1];
          return (
            <path
              key={i}
              d={`M${x + 0.5},${y + 0.5} Q${(x + nx) / 2 + 0.5},${Math.min(y, ny) - 0.4 + 0.5} ${nx + 0.5},${ny + 0.5}`}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
              style={v("--d", `${700 + i * 380}ms`)}
            />
          );
        })}
        {KNIGHT.map(([x, y], i) => (
          <circle key={`n${i}`} cx={x + 0.5} cy={y + 0.5} r="0.17" style={v("--d", `${700 + i * 380}ms`)} />
        ))}
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------- arena -- */
/** A race: cars sweeping a timing line, and a table settling beside it. */
function ArenaVisual() {
  return (
    <div className={cx(styles.fx, styles.fxArena)} aria-hidden="true">
      <div className={styles.arenaTrack}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={styles.arenaLane}>
            <i className={styles.arenaCar} style={{ ...v("--d", `${i * 320}ms`), ...v("--dur", `${2.6 + i * 0.35}s`) }} />
          </span>
        ))}
        <span className={styles.arenaFinish} />
      </div>
      <div className={styles.arenaTable}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={styles.arenaRow} style={{ ...v("--d", `${900 + i * 180}ms`), ...v("--w", `${[94, 78, 66, 52][i]}%`) }} />
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- orbiseye -- */
/** A wire Earth with flight arcs over it and a quake ripple. */
const MERIDIANS = [0.25, 0.5, 0.75];
const FLIGHTS = [
  "M14,52 Q50,16 86,44",
  "M20,70 Q48,46 84,66",
  "M26,34 Q54,62 80,30",
];

function EyeVisual() {
  return (
    <div className={cx(styles.fx, styles.fxEye)} aria-hidden="true">
      <svg viewBox="0 0 100 100" className={styles.eyeGlobe} focusable="false">
        <circle className={styles.eyeEdge} cx="50" cy="50" r="38" vectorEffect="non-scaling-stroke" />
        {MERIDIANS.map((m, i) => (
          <ellipse key={`m${i}`} cx="50" cy="50" rx={38 * Math.abs(1 - m * 2) + 2} ry="38" vectorEffect="non-scaling-stroke" style={v("--d", `${200 + i * 140}ms`)} />
        ))}
        {[-20, 0, 20].map((o, i) => (
          <ellipse key={`p${i}`} cx="50" cy={50 + o} rx={Math.sqrt(Math.max(1, 38 * 38 - o * o))} ry="4.5" vectorEffect="non-scaling-stroke" style={v("--d", `${300 + i * 140}ms`)} />
        ))}
        {FLIGHTS.map((d, i) => (
          <g key={`f${i}`} className={styles.eyeFlight} style={v("--d", `${900 + i * 420}ms`)}>
            <path d={d} pathLength={1} vectorEffect="non-scaling-stroke" />
            <circle r="1.1">
              <animateMotion dur={`${4 + i * 0.8}s`} repeatCount="indefinite" path={d} />
            </circle>
          </g>
        ))}
        <circle className={styles.eyeQuake} cx="34" cy="64" r="3" />
        <circle className={styles.eyeQuake} cx="72" cy="38" r="3" style={v("--d", "1.4s")} />
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- cosmos -- */
/** A system to scale: a star, planets on their ellipses, and the field beyond. */
const PLANETS = [
  { rx: 16, ry: 7, size: 1.6, dur: 7 },
  { rx: 26, ry: 11, size: 2.2, dur: 11 },
  { rx: 36, ry: 15, size: 1.8, dur: 16 },
  { rx: 46, ry: 19, size: 2.6, dur: 23 },
];
const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: rand(i * 3 + 1) * 100,
  y: rand(i * 3 + 2) * 100,
  r: 0.25 + rand(i * 3 + 3) * 0.55,
  d: rand(i * 7) * 3,
}));

function CosmosVisual() {
  return (
    <div className={cx(styles.fx, styles.fxCosmos)} aria-hidden="true">
      <svg viewBox="0 0 100 100" className={styles.cosmos} focusable="false">
        {STARS.map((s, i) => (
          <circle key={`s${i}`} className={styles.cosmosStar} cx={s.x} cy={s.y} r={s.r} style={v("--d", `${s.d.toFixed(2)}s`)} />
        ))}
        {PLANETS.map((p, i) => (
          <g key={`p${i}`}>
            <ellipse className={styles.cosmosOrbit} cx="50" cy="50" rx={p.rx} ry={p.ry} vectorEffect="non-scaling-stroke" style={v("--d", `${200 + i * 160}ms`)} />
            <circle className={styles.cosmosPlanet} r={p.size}>
              <animateMotion
                dur={`${p.dur}s`}
                repeatCount="indefinite"
                path={`M${50 + p.rx},50 a${p.rx},${p.ry} 0 1,0 ${-p.rx * 2},0 a${p.rx},${p.ry} 0 1,0 ${p.rx * 2},0`}
              />
            </circle>
          </g>
        ))}
        <circle className={styles.cosmosSun} cx="50" cy="50" r="4.5" />
      </svg>
    </div>
  );
}

export function FeatureVisual({ id }: { id: OrbisCapabilityId }) {
  switch (id) {
    case "browser":
      return <BrowserVisual />;
    case "ai":
      return <OrionVisual />;
    case "toolkit":
      return <ToolkitVisual />;
    case "courses":
      return <CoursesVisual />;
    case "chess":
      return <ChessVisual />;
    case "arena":
      return <ArenaVisual />;
    case "eye":
      return <EyeVisual />;
    case "cosmos":
      return <CosmosVisual />;
  }
}
