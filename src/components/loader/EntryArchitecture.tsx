import { cx } from "@/lib/cx";
import styles from "./LoadingExperience.module.css";

/**
 * The technical layer: fine geometry that resolves behind the identity.
 *
 * It is atmosphere, not information. There are no metrics, no dashboard and
 * no product interface here — nothing that could be read as a claim about the
 * company. Just structure: two rails, two datums, bracketed corners, a
 * measured tick strip and a few nodes.
 *
 * Deliberately built from positioned elements rather than an SVG. Every line
 * here is axis-aligned, so percentages keep the geometry correct at any
 * aspect ratio (an SVG viewBox would either distort the brackets or crop the
 * rails off a phone), the hairlines stay exactly one pixel, and the draw-on
 * is a scale transform — no layout, no dash arithmetic.
 */

const NODES = ["n1", "n2", "n3", "n4", "n5", "n6"] as const;

export function EntryArchitecture() {
  return (
    <div className={styles.arch} aria-hidden="true">
      <span className={cx(styles.rail, styles.railL)} />
      <span className={cx(styles.rail, styles.railR)} />
      <span className={cx(styles.datum, styles.datumT)} />
      <span className={cx(styles.datum, styles.datumB)} />
      <span className={styles.ticks} />

      <span className={cx(styles.bracket, styles.bTL)} />
      <span className={cx(styles.bracket, styles.bTR)} />
      <span className={cx(styles.bracket, styles.bBL)} />
      <span className={cx(styles.bracket, styles.bBR)} />

      {NODES.map((n) => (
        <span key={n} className={cx(styles.node, styles[n])} />
      ))}
    </div>
  );
}
