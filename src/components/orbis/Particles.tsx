"use client";

import { useEffect, useRef } from "react";

/** Pre-rendered radial glow; far cheaper per frame than canvas shadowBlur. */
function glowSprite() {
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

type Particle = { x: number; y: number; vx: number; vy: number; radius: number; phase: number; twinkle: number };

/** Drifting glow particles on a canvas, sized to the canvas's own layout box. */
export function particleField(canvas: HTMLCanvasElement | null, { density = 24000, alpha = 1 } = {}) {
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return { start() {}, stop() {}, dispose() {} };
  const sprite = glowSprite();
  let particles: Particle[] = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let running = false;

  const spawn = (): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.03 + Math.random() * 0.16;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.02,
      radius: 0.7 + Math.random() ** 2 * 2.8,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.5 + Math.random() * 1.6,
    };
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: Math.round((width * height) / density) }, spawn);
  };

  const draw = (time: number) => {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -12) p.x = width + 12;
      else if (p.x > width + 12) p.x = -12;
      if (p.y < -12) p.y = height + 12;
      else if (p.y > height + 12) p.y = -12;
      const size = p.radius * 7;
      ctx.globalAlpha = alpha * (0.45 + 0.55 * Math.abs(Math.sin(time * 0.0007 * p.twinkle + p.phase)));
      ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(draw);
  };

  const onResize = () => running && resize();
  window.addEventListener("resize", onResize);

  return {
    start() {
      if (running) return;
      running = true;
      resize();
      frame = requestAnimationFrame(draw);
    },
    stop() {
      running = false;
      cancelAnimationFrame(frame);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    },
  };
}

/** The page backdrop's particle layer. Paused while the tab is hidden, off under reduced motion. */
export function OrbisBackdropParticles() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const field = particleField(ref.current, { density: 52000, alpha: 0.8 });
    field.start();
    const onVisibility = () => (document.hidden ? field.stop() : field.start());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      field.dispose();
    };
  }, []);
  return <canvas ref={ref} className="ob-bg-particles" aria-hidden="true" />;
}
