"use client";

import { useEffect, useRef, useState } from "react";
import { company } from "@/content/site";
import { cx } from "@/lib/cx";
import { trackReadiness } from "@/lib/loadingSignals";
import { releaseReveal } from "@/lib/revealRuntime";
import { LOGO_RATIO, LOGO_SRC } from "@/components/ui/Logo";
import { CrystalField } from "@/components/visuals/CrystalField";
import { EntryArchitecture } from "./EntryArchitecture";
import { EntryFrame } from "./EntryFrame";
import styles from "./LoadingExperience.module.css";

/**
 * The entrance — the first scene of the site rather than a utility screen.
 *
 *   dark -> identity -> material -> intelligence -> activation -> reveal
 *
 * Three rules govern it, in this order:
 *
 *  1. It never lies. The frame around the wordmark resolves from real
 *     readiness milestones (see lib/loadingSignals). If the page is ready in
 *     200ms, the frame is complete in 200ms.
 *  2. It never traps. The boot script in the layout clears the entrance on a
 *     timer of its own, so even a build that fails to hydrate cannot leave a
 *     visitor stranded behind this layer. Readiness has a second net here.
 *  3. It never repeats. One entrance per session; internal navigation uses the
 *     ordinary page transition.
 *
 * Staging is additive: each stage adds a class that is never removed, so a
 * stage change can only start animations, never restart them.
 */

/** Stage cues in ms from mount. Choreography only; these never gate the reveal. */
const CUES = [120, 520, 830, 1150];

/**
 * The shortest a first visit's entrance may run. This is the one deliberate
 * wait in the sequence: an opening title needs a beat to read. It is short by
 * design, applies only to the first visit of a session, and is dropped
 * entirely under reduced motion.
 */
const FLOOR = 1400;

/** Hand-off to the homepage. */
const EXIT = 900;

/** Readiness is forced at this point, whatever is still outstanding. */
const SAFETY = 5000;

export function LoadingExperience() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState(0);
  const [field, setField] = useState<null | { compact: boolean }>(null);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;

    // Tells the boot script's fallback timer that the app did take over, so
    // it does not need to force the reveal content visible.
    html.dataset.nxReady = "1";

    // Not a first entry (repeat visit, or scripting-gated) — nothing to play.
    if (!html.classList.contains("entry-active")) {
      setDone(true);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const compact = window.matchMedia("(max-width: 767px)").matches;

    const timers: number[] = [];
    const rafs: number[] = [];
    let ready = false;
    let scheduled = false;
    const t0 = performance.now();

    /* ---------------------------------------------------------- staging -- */
    if (reduced) {
      // Reduced motion keeps the composition and drops the choreography: the
      // scene is simply present, and leaves as soon as the page is ready.
      setStage(CUES.length);
      setField({ compact });
    } else {
      CUES.forEach((at, i) => {
        timers.push(
          window.setTimeout(() => {
            setStage(i + 1);
            // Mount the crystals one stage before they are shown, so the SVG
            // rasterises during a quiet beat rather than on the frame it fades in.
            if (i === 0) setField({ compact });
          }, at),
        );
      });
    }

    /* ------------------------------------------------------------- exit -- */
    const beginExit = () => {
      // Release the scroll lock first, while the layer is still opaque: the
      // scrollbar returning reflows the page, and that must happen out of
      // sight rather than during the fade.
      html.classList.remove("entry-hold");

      rafs.push(
        requestAnimationFrame(() => {
          rafs.push(
            requestAnimationFrame(() => {
              setExiting(true);
              // The homepage now reveals *into* the opening layer, so the hero
              // rises as the entrance parts rather than behind it.
              releaseReveal();
              timers.push(
                window.setTimeout(
                  () => {
                    html.classList.remove("entry-active");
                    setDone(true);
                  },
                  // Under reduced motion the fade is instant, so there is
                  // nothing to wait out before unmounting.
                  reduced ? 120 : EXIT,
                ),
              );
            }),
          );
        }),
      );
    };

    const scheduleExit = () => {
      if (!ready || scheduled) return;
      scheduled = true;
      const floor = reduced ? 0 : FLOOR;
      timers.push(window.setTimeout(beginExit, Math.max(0, floor - (performance.now() - t0))));
    };

    /* --------------------------------------------------------- progress -- */
    const readiness = trackReadiness({
      timeout: SAFETY,
      onProgress: (p) => rootRef.current?.style.setProperty("--entry-p", p.toFixed(3)),
      onReady: () => {
        ready = true;
        scheduleExit();
      },
    });
    readiness.reach("hydrate");

    /* ---------------------------------------------------- ambient light -- */
    let move: ((e: PointerEvent) => void) | null = null;
    if (fine && !reduced) {
      let raf = 0;
      let x = 0;
      let y = 0;
      let ex = 0;
      let ey = 0;
      const step = () => {
        raf = 0;
        ex += (x - ex) * 0.06;
        ey += (y - ey) * 0.06;
        const el = rootRef.current;
        if (!el) return;
        el.style.setProperty("--lx", ex.toFixed(4));
        el.style.setProperty("--ly", ey.toFixed(4));
        if (Math.abs(x - ex) > 0.002 || Math.abs(y - ey) > 0.002) {
          raf = requestAnimationFrame(step);
          rafs.push(raf);
        }
      };
      move = (e: PointerEvent) => {
        x = (e.clientX / window.innerWidth - 0.5) * 2;
        y = (e.clientY / window.innerHeight - 0.5) * 2;
        if (!raf) {
          raf = requestAnimationFrame(step);
          rafs.push(raf);
        }
      };
      window.addEventListener("pointermove", move, { passive: true });
    }

    return () => {
      for (const t of timers) clearTimeout(t);
      for (const r of rafs) cancelAnimationFrame(r);
      readiness.cancel();
      if (move) window.removeEventListener("pointermove", move);
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className={cx(
        styles.entry,
        stage >= 1 && styles.sIdentity,
        stage >= 2 && styles.sMaterial,
        stage >= 3 && styles.sArchitecture,
        stage >= 4 && styles.sActivation,
        exiting && styles.exiting,
      )}
      aria-hidden="true"
      inert
    >
      <div className={styles.ground} />

      {field && (
        <div className={styles.fieldWrap}>
          <CrystalField variant="entry" id="entry-cf" seed={19} compact={field.compact} />
        </div>
      )}

      <EntryArchitecture />

      <div className={styles.brand}>
        <div className={styles.markBox}>
          <div className={styles.frameLayer}>
            <EntryFrame />
            <span className={cx(styles.tick, styles.tick1)} />
            <span className={cx(styles.tick, styles.tick2)} />
            <span className={cx(styles.tick, styles.tick3)} />
            <span className={cx(styles.tick, styles.tick4)} />
          </div>

          <div className={styles.mark} style={{ aspectRatio: String(LOGO_RATIO) }}>
            {/* The official wordmark, unmodified: scaled only on its own ratio. */}
            <img
              className={styles.markImg}
              src={LOGO_SRC}
              alt=""
              width={1183}
              height={184}
              fetchPriority="high"
              draggable={false}
            />
            {/* One light pass, masked to the letterforms so the light travels
                inside the mark rather than across a rectangle over it. */}
            <span className={styles.markLight} />
          </div>
        </div>

        <span className={styles.rule} />
        <p className={styles.tag}>{company.tagline}</p>
      </div>

      <p className={styles.legal}>{company.legalName}</p>
      <div className={styles.veil} />
    </div>
  );
}
