import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./OrbisLogo.module.css";

/**
 * The original Orbis logo, set in running text wherever the product is named.
 *
 * It takes its size from the surrounding font: the letters are 71.7% of the
 * artwork's height and sit on a baseline 85.5% down, so at 1em tall they
 * match the text's cap height and baseline. It never drops below 20px, where
 * the ring would stop reading (see OrbisLogo.module.css).
 *
 * The artwork is white with a glow, made for dark grounds, and is never
 * recoloured — keep it off light surfaces. The alt text keeps the name for
 * screen readers and search engines.
 */
export function OrbisLogo({ display = false, className }: { display?: boolean; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cx(styles.logo, className)}
      src="/orbis/orbis-logo-sm.png"
      srcSet="/orbis/orbis-logo-sm.png 331w, /orbis/orbis-logo.png 1321w"
      // Headings get the full artwork; running text rarely needs more than the small one.
      sizes={display ? "480px" : "120px"}
      width={1321}
      height={399}
      alt="Orbis"
      decoding="async"
      draggable={false}
    />
  );
}

// "Orbis" as a word, with any punctuation straight after it. File names such
// as Orbis.exe or Orbis-Setup-0.1.0.exe stay as text.
const NAME = /(\bOrbis\b(?![.-]\w)[.,;:!?…]*)/;

/**
 * Replaces the word Orbis in a piece of copy with the logo. The logo and the
 * punctuation after it are kept together so a line never starts with "." or "?".
 */
export function withOrbisLogo(text: string, options: { display?: boolean } = {}): ReactNode {
  const parts = text.split(NAME);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (i % 2 === 0) return part;
    const punctuation = part.slice("Orbis".length);
    return (
      <span key={i} className={styles.word}>
        <OrbisLogo display={options.display} className={punctuation ? styles.beforePunctuation : undefined} />
        {punctuation}
      </span>
    );
  });
}
