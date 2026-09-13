import { company } from "@/content/site";
import { Reveal } from "@/lib/Reveal";
import { ArrowUpRight } from "@/components/ui/Icons";
import styles from "./ContactBlock.module.css";

/**
 * Factual contact details only: email and registered address.
 * No phone number is shown because the source site's number is a template
 * placeholder — add one here when a real number is available.
 */
export function ContactBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div className={styles.block}>
      <Reveal className={styles.item}>
        <span className={styles.label}>Email</span>
        <a href={`mailto:${company.email}`} className={styles.email}>
          {company.email}
        </a>
      </Reveal>
      <Reveal className={styles.item} delay={60}>
        <span className={styles.label}>Office</span>
        <address className={styles.address}>
          {company.address.lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </address>
        <a
          className={styles.map}
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address.mapsQuery)}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          Open in Maps <ArrowUpRight size={14} />
        </a>
      </Reveal>
      {!compact && (
        <Reveal className={styles.item} delay={120}>
          <span className={styles.label}>Company</span>
          <p className={styles.company}>{company.legalName}</p>
          <p className="t-sm">{company.descriptor}</p>
        </Reveal>
      )}
    </div>
  );
}
