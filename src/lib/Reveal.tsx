"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

export type RevealVariant = "up" | "fade" | "clip" | "scale" | "blur" | "right" | "left" | "glass";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Reveal behaviour. Pick by content type, not at random. */
  variant?: RevealVariant;
  /** Stagger delay in ms. */
  delay?: number;
  /** Fraction of the element that must be visible. */
  threshold?: number;
  style?: CSSProperties;
  id?: string;
};

/**
 * Reveals children once when they enter the viewport.
 * Motion is CSS-driven (see globals.css) and disabled under prefers-reduced-motion.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  variant = "up",
  delay = 0,
  threshold = 0.15,
  style,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      data-reveal={variant}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
