import Link from "next/link";
import { cta, products, type Product } from "@/content/site";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductVisual } from "@/components/visuals/ProductVisual";
import { ArrowUpRight } from "@/components/ui/Icons";
import styles from "./ProductShowcase.module.css";

type Layout = "wide" | "offset" | "reverse" | "statement";
const layouts: Layout[] = ["wide", "offset", "reverse", "statement"];

function ProductPanel({ product, layout }: { product: Product; layout: Layout }) {
  return (
    <Reveal className={cx(styles.panel, styles[layout])} variant="scale">
      <Link href={`/products/${product.slug}`} className={styles.link} aria-label={`${product.name} — ${product.positioning}`}>
        <div className={styles.visualCol}>
          <ProductVisual product={product} large={layout === "wide" || layout === "reverse"} />
        </div>
        <div className={styles.copyCol}>
          <div className={styles.meta}>
            <span className="num">{product.index}</span>
            <span className={cx("glass", "glass--l2", "glass--pill", styles.tag)}>{product.positioning}</span>
          </div>
          <h3 className={cx(layout === "statement" ? "t-h1" : "t-h2", styles.name)}>{product.name}</h3>
          <p className={cx("t-body", styles.intro)}>{product.intro}</p>
          <span className={styles.more}>
            View product <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export function ProductShowcase({ heading = true }: { heading?: boolean }) {
  return (
    <section className={cx("section", styles.section)} aria-labelledby="products-title" id="products">
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        {heading && (
          <SectionHeading
            id="products-title"
            eyebrow="Products"
            index="04"
            title={
              <>
                Software <span className="t-serif">we</span> build.
              </>
            }
            lead="NxtOrbis® develops software products designed around real-world needs. We don’t only build software for others — we build our own."
            action={
              <Button href={cta.secondary.href} variant="ghost" arrow>
                {cta.secondary.label}
              </Button>
            }
            split
          />
        )}

        <div className={styles.stack}>
          {products.map((p, i) => (
            <ProductPanel key={p.slug} product={p} layout={layouts[i % layouts.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}
