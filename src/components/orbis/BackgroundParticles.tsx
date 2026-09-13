"use client";

import { useEffect, useRef } from "react";
import styles from "./Orbis.module.css";

/**
 * Drifting glow particles, ported from the Orbis app's own background
 * (src/renderer/src/components/HudBackground.tsx): the same glow sprite,
 * density, drift, edge wrapping and twinkle, so the page and the app share
 * one atmosphere.
 *
 * The canvas is only ever the size of the screen. It sticks to the viewport
 * inside a layer that spans the page (position: fixed would break under the
 * site's transformed page-transition wrapper), and it stops drawing while the
 * tab is hidden. Under reduced motion it draws a single still frame.
 */

type Particle = { x: number; y: number; vx: number; vy: number; radius: number; phase: number; twinkleSpeed: number };

function spawn(width: number, height: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 0.03 + Math.random() * 0.16;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.02,
    // Mostly small points with a few larger glows.
    radius: 0.7 + Math.random() ** 2 * 2.8,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.5 + Math.random() * 1.6,
  };
}

/** Pre-rendered radial glow, far cheaper per frame than canvas shadowBlur. */
function makeGlowSprite(): HTMLCanvasElement {
  const size = 64;
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const g = sprite.getContext("2d")!;
  const gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(220, 252, 255, 1)");
  gradient.addColorStop(0.16, "rgba(110, 225, 255, 0.95)");
  gradient.addColorStop(0.42, "rgba(56, 190, 255, 0.22)");
  gradient.addColorStop(1, "rgba(56, 190, 255, 0)");
  g.fillStyle = gradient;
  g.fillRect(0, 0, size, size);
  return sprite;
}

export function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprite = makeGlowSprite();
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    const paint = (time: number, move: boolean) => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (move) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -12) p.x = width + 12;
          else if (p.x > width + 12) p.x = -12;
          if (p.y < -12) p.y = height + 12;
          else if (p.y > height + 12) p.y = -12;
        }
        const size = p.radius * 7;
        ctx.globalAlpha = 0.45 + 0.55 * Math.abs(Math.sin(time * 0.0007 * p.twinkleSpeed + p.phase));
        ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const draw = (time: number) => {
      paint(time, true);
      frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: Math.round((width * height) / 24000) }, () => spawn(width, height));
      if (reduced) paint(0, false);
    };

    const onVisibilityChange = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduced) frame = requestAnimationFrame(draw);
    };

    resize();
    if (!reduced) frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className={styles.particles} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.particlesCanvas} />
    </div>
  );
}
