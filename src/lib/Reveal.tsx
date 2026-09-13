"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { observeReveal } from "./revealRuntime";

export type RevealVariant = "up" | "fade" | "clip" | "scale" | "blur" | "right" | "left" | "glass";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Reveal behaviour. Pick by content type, not at random. */
  variant?: RevealVariant;
  /** Stagger delay in ms. */
  delay?: number;
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
  style,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeReveal(el);
  }, []);

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
