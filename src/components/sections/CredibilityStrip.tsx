import { company, products, services } from "@/content/site";
import { Reveal } from "@/lib/Reveal";
import styles from "./CredibilityStrip.module.css";

/**
 * Trust without fabrication: a restrained strip of verifiable facts about the
 * company — what it builds, how many service lines and products it offers,
 * and where it is based. No client logos are shown because none are
 * available in the source material.
 */
export function CredibilityStrip() {
  const facts = [
    { label: "What we are", value: "Software development & software product company" },
    { label: "Service lines", value: `${String(services.length).padStart(2, "0")} — from custom software to cloud` },
    { label: "Own products", value: `${String(products.length).padStart(2, "0")} software products in development and use` },
    { label: "Based in", value: company.location },
  ];

  return (
    <section className={styles.strip} aria-label="About NxtOrbis at a glance">
      <div className="container">
        <ul className={styles.list}>
          {facts.map((f, i) => (
            <Reveal as="li" key={f.label} className={styles.item} delay={i * 60}>
              <span className={styles.label}>{f.label}</span>
              <span className={styles.value}>{f.value}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
