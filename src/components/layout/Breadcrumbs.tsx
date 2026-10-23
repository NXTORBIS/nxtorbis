import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

/**
 * Where this page sits. Two levels is all this site is ever deep, so it is a
 * line rather than a widget: the parent section, then where you are.
 *
 * It also emits the structured data search engines read for the same thing,
 * built from the same array, so the two cannot disagree.
 */
export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.label,
      ...(step.href ? { item: step.href } : {}),
    })),
  };

  return (
    <nav className={styles.crumbs} aria-label="Breadcrumb">
      <ol className="container">
        {trail.map((step, i) => (
          <li key={step.label}>
            {step.href ? <Link href={step.href}>{step.label}</Link> : <span aria-current="page">{step.label}</span>}
            {i < trail.length - 1 && <span className={styles.sep} aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
    </nav>
  );
}
