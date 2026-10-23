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
  /**
   * For anything on the first screen.
   *
   * The ordinary reveal starts at opacity zero and is turned on by script
   * when it comes into view, which means the hero's own copy waited for the
   * JavaScript bundle: Lighthouse measured the largest paint at four seconds
   * because of it. An immediate reveal is the same movement done in CSS, so
   * it begins at first paint and needs nothing to arrive.
   */
  immediate?: boolean;
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
  immediate = false,
  style,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;
    return observeReveal(el);
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      {...(immediate ? { "data-reveal-now": variant } : { "data-reveal": variant })}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
