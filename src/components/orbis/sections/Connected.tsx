"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import { withOrbisLogo } from "@/components/ui/OrbisLogo";
import { orbisCapabilities, orbisCopy, type OrbisCapabilityId } from "@/content/orbis";
import { OrbSlot, useOrb } from "../orb/OrbStage";
import styles from "../Orbis.module.css";

const RADIUS = 43; // % of the square stage

function position(i: number) {
  const angle = ((-90 + (i * 360) / orbisCapabilities.length) * Math.PI) / 180;
  return { x: +(50 + Math.cos(angle) * RADIUS).toFixed(3), y: +(50 + Math.sin(angle) * RADIUS).toFixed(3) };
}

/**
 * Everything connected. The Orb at the centre, seven capabilities around it,
 * joined by hairlines that carry a little light. Hover, focus or tap a
 * capability and the Orb takes on that capability's state.
 *
 * On small screens the ring becomes a row of buttons under the Orb: seven
 * nodes around a phone-sized circle would be too small to use.
 */
export function OrbisConnected() {
  const orb = useOrb();
  const [active, setActive] = useState<OrbisCapabilityId | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const select = (id: OrbisCapabilityId) => {
    setActive(id);
    orb.setOverride(id);
  };
  const clear = () => {
    setActive(null);
    orb.setOverride(null);
  };

  // Leaving the section always hands the Orb back to the page.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        setActive(null);
        orb.setOverride(null);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      orb.setOverride(null);
    };
  }, [orb]);

  const current = orbisCapabilities.find((c) => c.id === active) ?? null;

  return (
    <section ref={sectionRef} id="connected" className={cx(styles.section, styles.connected)} aria-labelledby="orbis-connected-title">
      <div className="container">
        <Reveal as="h2" id="orbis-connected-title" className={cx(styles.sectionTitle, styles.center, styles.connectedTitle)}>
          {orbisCopy.connected.heading}
        </Reveal>

        <div className={styles.network} onPointerLeave={(e) => e.pointerType === "mouse" && clear()}>
          <svg className={styles.networkLines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            {orbisCapabilities.map((c, i) => {
              const { x, y } = position(i);
              return (
                <g key={c.id} className={cx(styles.networkLine, active === c.id && styles.networkLineActive)}>
                  <line x1="50" y1="50" x2={x} y2={y} vectorEffect="non-scaling-stroke" />
                  <circle r="0.55" className={styles.networkPulse}>
                    <animateMotion dur={`${(3.2 + i * 0.37).toFixed(2)}s`} repeatCount="indefinite" path={`M50,50 L${x},${y}`} />
                  </circle>
                </g>
              );
            })}
          </svg>

          <div className={styles.networkOrb}>
            <OrbSlot state="network" />
          </div>

          <ul className={styles.nodes}>
            {orbisCapabilities.map((c, i) => {
              const { x, y } = position(i);
              return (
                <li key={c.id} className={styles.nodeItem} style={{ ["--x" as string]: `${x}%`, ["--y" as string]: `${y}%` } as CSSProperties}>
                  <button
                    type="button"
                    className={cx(styles.node, active === c.id && styles.nodeActive)}
                    aria-pressed={active === c.id}
                    aria-describedby="orbis-capability-detail"
                    onPointerEnter={(e) => e.pointerType === "mouse" && select(c.id)}
                    onFocus={() => select(c.id)}
                    onClick={() => select(c.id)}
                  >
                    <span className={styles.nodeDot} aria-hidden="true" />
                    {c.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p id="orbis-capability-detail" className={styles.capabilityDetail} aria-live="polite">
          {current ? (
            <>
              <strong>{current.label}</strong>
              {withOrbisLogo(current.description)}
            </>
          ) : (
            "Select a capability to see how it connects."
          )}
        </p>
      </div>
    </section>
  );
}
