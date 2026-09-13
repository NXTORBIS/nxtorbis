import Link from "next/link";
import { company, nav, products, services } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" aria-label="NxtOrbis® — home" className={styles.logo}>
              <Logo height={26} />
            </Link>
            <p className={styles.desc}>
              A software development and software product company. We design and engineer custom software,
              mobile applications and our own products — combining software engineering with AI, blockchain and
              cloud.
            </p>
            <p className={styles.caps}>{company.capabilities.join(" · ")}</p>
          </div>

          <nav className={styles.cols} aria-label="Footer">
            <div className={styles.col}>
              <h2 className={styles.colTitle}>Navigation</h2>
              <ul>
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className={styles.link}>
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.col}>
              <h2 className={styles.colTitle}>Services</h2>
              <ul>
                {services.map((s) => (
                  <li key={s.id}>
                    <Link href={`/services#${s.slug}`} className={styles.link}>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.col}>
              <h2 className={styles.colTitle}>Products</h2>
              <ul>
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} className={styles.link}>
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.col}>
              <h2 className={styles.colTitle}>Contact</h2>
              <ul>
                <li>
                  <a href={`mailto:${company.email}`} className={styles.link}>
                    {company.email}
                  </a>
                </li>
                <li>
                  <address className={styles.address}>
                    {company.address.lines.map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </address>
                </li>
                <li>
                  <a
                    className={styles.mapLink}
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address.mapsQuery)}`}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    View on map <ArrowUpRight size={14} />
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>{company.copyright}</p>
          <a href="#main" className={styles.toTop}>
            Back to top <ArrowRight size={14} />
          </a>
          <p className={styles.meta}>
            {company.legalName} · {company.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
