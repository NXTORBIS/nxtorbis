import type { Metadata } from "next";
import { cta, products, seo } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { PageHero } from "@/components/layout/PageHero";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { CTASection } from "@/components/sections/CTASection";
import { Reveal } from "@/lib/Reveal";
import styles from "./page.module.css";

export const metadata: Metadata = pageMeta({ ...seo.products, path: "/products" });

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title={
          <>
            Software <span className="t-serif">we</span> build.
          </>
        }
        lead="NxtOrbis® develops software products designed around real-world needs. We don’t only build software for others — we build our own."
        aside={
          <ol className={styles.index} aria-label="Products">
            {products.map((p) => (
              <li key={p.slug}>
                <a href={`/products/${p.slug}`} className={styles.indexLink}>
                  <span className="num">{p.index}</span>
                  <span>{p.name}</span>
                  <span className={styles.indexTag}>{p.positioning}</span>
                </a>
              </li>
            ))}
          </ol>
        }
      />

      <ProductShowcase heading={false} />

      <section className={`section ${styles.note}`} aria-labelledby="products-note-title">
        <div className={`container ${styles.noteGrid}`}>
          <Reveal as="p" className="eyebrow" variant="fade">
            Product-first
          </Reveal>
          <div className={styles.noteBody}>
            <Reveal>
              <h2 id="products-note-title" className="t-h2">
                Building our own products keeps our engineering <span className="t-serif">honest.</span>
              </h2>
            </Reveal>
            <Reveal as="p" className="t-lead" delay={80}>
              Every product is developed with the same discipline we bring to client work — and the lessons flow
              both ways. The four products above are presented at a high level; if you would like to know more
              about any of them, get in touch.
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection
        title={
          <>
            Interested in a <span className="t-serif">product?</span>
          </>
        }
        body="Ask about availability, plans or how a product could fit your organisation."
        primary={{ label: "Ask about a product", href: "/contact?intent=product" }}
        secondary={cta.primary}
      />
    </>
  );
}
