import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { advocatePlans, company, products } from "@/content/site";
import { pageMeta } from "@/lib/meta";
import { PageHero } from "@/components/layout/PageHero";
import { ProductVisual } from "@/components/visuals/ProductVisual";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/lib/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { ArrowRight } from "@/components/ui/Icons";
import styles from "./page.module.css";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return pageMeta({
    title: `${product.name} | NxtOrbis®`,
    description: `${product.name} — ${product.positioning}. ${product.intro}`,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = products.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const product = products[index];
  const next = products[(index + 1) % products.length];

  return (
    <>
      <PageHero
        eyebrow={`Product ${product.index}`}
        size="h1"
        title={product.name}
        lead={product.intro}
        meta={
          <>
            <span className={`glass glass--l2 glass--pill ${styles.tag}`}>{product.positioning}</span>
            <span className={styles.techs}>
              {product.technologies.map((t) => (
                <span key={t} className="glass glass--l1 glass--pill">{t}</span>
              ))}
            </span>
          </>
        }
      />

      <section className={`section ${styles.body}`} aria-labelledby="product-overview">
        <div className={`container ${styles.grid}`}>
          <Reveal className={styles.visual} variant="blur">
            <ProductVisual product={product} large />
          </Reveal>

          <div className={styles.copy}>
            <Reveal as="p" className="eyebrow" variant="fade">
              Overview
            </Reveal>
            <Reveal>
              <h2 id="product-overview" className="t-h2">
                {product.positioning === "AI + Blockchain" ? (
                  <>
                    Built on software, <span className="t-serif">AI</span> and blockchain.
                  </>
                ) : (
                  <>
                    Software, enhanced <span className="t-serif">with</span> AI.
                  </>
                )}
              </h2>
            </Reveal>
            {product.context && (
              <Reveal as="p" className="t-lead" delay={80}>
                {product.context}
              </Reveal>
            )}
            <Reveal as="p" className="t-body" delay={120}>
              {product.name} is one of the software products developed by {company.legalName}. We present our
              products at a high level here; for details on availability, plans and fit, please get in touch.
            </Reveal>

            <Reveal as="dl" className={styles.facts} delay={160}>
              <div>
                <dt>Positioning</dt>
                <dd>{product.positioning}</dd>
              </div>
              <div>
                <dt>Technology direction</dt>
                <dd>{product.technologies.join(" · ")}</dd>
              </div>
              <div>
                <dt>Developed by</dt>
                <dd>{company.legalName}</dd>
              </div>
              {product.hasPlans && (
                <div>
                  <dt>Plans</dt>
                  <dd>
                    <Link href="/pricing#advocate-plans" className={styles.inlineLink}>
                      View {advocatePlans.plans.length} published plans <ArrowRight size={14} />
                    </Link>
                  </dd>
                </div>
              )}
            </Reveal>

            <Reveal className={styles.actions} delay={200}>
              <Button href={`/contact?intent=product&product=${encodeURIComponent(product.name)}`} variant="primary" arrow intensity="major" fillFrom="diagonal">
                Ask about this product
              </Button>
              <Button href="/products" variant="ghost">
                All products
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.next} aria-label="Next product">
        <Link href={`/products/${next.slug}`} className={`container ${styles.nextLink}`}>
          <span className="eyebrow">Next product</span>
          <span className={`t-h2 ${styles.nextName}`}>
            {next.name} <ArrowRight size={28} />
          </span>
          <span className="t-sm">{next.positioning}</span>
        </Link>
      </section>

      <CTASection />
    </>
  );
}
