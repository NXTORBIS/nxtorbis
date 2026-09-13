import { CrystalField } from "./CrystalField";
import styles from "./HeroVisual.module.css";

/**
 * Hero artwork. Uses the same SVG crystal renderer as every other page hero,
 * so the whole site shares one visual language — just composed larger, with
 * the focal crystal centre-right and a varied cast of silhouettes around it.
 *
 * It ships in the server HTML, needs no JavaScript to appear, and costs
 * nothing on slow devices.
 */
export function HeroVisual() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.svg}>
        <CrystalField variant="hero" id="hero-cf" />
      </div>
    </div>
  );
}
