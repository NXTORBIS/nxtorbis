import styles from "./LoadingExperience.module.css";

/**
 * The progress indicator, as architecture rather than a bar.
 *
 * A hairline frame is drawn around the wordmark. It begins incomplete and
 * resolves as the page actually becomes ready — `--entry-p` (0-1) is written
 * by the entrance runtime from real milestones, never from a timer. A short
 * bright segment rides the leading edge, so the eye can read progress as
 * movement without a percentage ever being shown.
 *
 * `vector-effect="non-scaling-stroke"` keeps the line a true hairline even
 * though the frame is stretched to the wordmark's proportions.
 */
export function EntryFrame() {
  const box = { x: 0.5, y: 0.5, width: 399, height: 159, pathLength: 1 } as const;
  return (
    <svg
      className={styles.frame}
      viewBox="0 0 400 160"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect {...box} className={styles.frameTrack} vectorEffect="non-scaling-stroke" />
      <rect {...box} className={styles.frameFill} vectorEffect="non-scaling-stroke" />
      <rect {...box} className={styles.frameHead} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
