import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./MaskedTitle.module.css";

type Props = {
  /** One entry per visual line. Each line is masked and rises into view. */
  lines: ReactNode[];
  className?: string;
  id?: string;
  as?: "h1" | "h2";
  /** Delay before the first line, in ms. */
  delay?: number;
};

/**
 * Masked line-by-line title reveal. CSS-only motion (no layout shift, no
 * JS timers) and a plain static heading under prefers-reduced-motion.
 */
export function MaskedTitle({ lines, className, id, as: Tag = "h1", delay = 120 }: Props) {
  return (
    <Tag id={id} className={cx(styles.title, className)}>
      {lines.map((line, i) => (
        <span key={i} className={styles.line}>
          <span className={styles.inner} style={{ animationDelay: `${delay + i * 110}ms` }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
