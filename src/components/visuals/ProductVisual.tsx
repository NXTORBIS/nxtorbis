import type { Product } from "@/content/site";
import { cx } from "@/lib/cx";
import { CrystalField } from "./CrystalField";
import styles from "./ProductVisual.module.css";

/**
 * Product artwork: each product receives its own crystalline composition and
 * hue family. Deliberately abstract — the artwork signals identity, not
 * functionality, and never depicts an interface.
 */
const HUES: Record<Product["visual"], { hues: Array<"gold" | "champagne" | "copper" | "amber" | "steel">; seed: number }> = {
  advocate: { hues: ["gold", "champagne", "copper"], seed: 11 },
  birthday: { hues: ["copper", "amber", "gold"], seed: 23 },
  review: { hues: ["champagne", "steel", "gold"], seed: 37 },
  genuine: { hues: ["amber", "gold", "steel"], seed: 53 },
};

export function ProductVisual({ product, className, large = false }: { product: Product; className?: string; large?: boolean }) {
  const cfg = HUES[product.visual];
  return (
    <div className={cx("glass", "glass--l3", "glass--panel", styles.frame, large && styles.large, className)} aria-hidden="true">
      <div className={styles.art}>
        <CrystalField variant="product" hues={cfg.hues} seed={cfg.seed} parallax={false} id={`pv-${product.slug}`} />
      </div>
      <div className={styles.meta}>
        <span className="num">PRODUCT {product.index}</span>
        <span className="num">{product.technologies.join(" / ").toUpperCase()}</span>
      </div>
    </div>
  );
}
