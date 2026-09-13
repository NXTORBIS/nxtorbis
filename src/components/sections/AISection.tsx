import { Reveal } from "@/lib/Reveal";
import { Button } from "@/components/ui/Button";
import styles from "./AISection.module.css";

const stages = [
  { index: "01", label: "Software", note: "Engineered systems, products and applications." },
  { index: "02", label: "Intelligence", note: "AI capabilities integrated where they are useful." },
  { index: "03", label: "Digital experience", note: "Smarter, more efficient experiences for users." },
];

/**
 * AI as a capability inside NxtOrbis — not a separate brand.
 * Visual: Software → Intelligence → Digital experience.
 */
export function AISection() {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="ai-title">
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <Reveal as="p" className="eyebrow" variant="fade">
            <span>Artificial intelligence</span>
            <span className="eyebrow-index">03</span>
          </Reveal>
          <Reveal variant="clip">
            <h2 id="ai-title" className={`t-h1 ${styles.title}`}>
              Intelligence, <span className="t-serif">built into</span> software.
            </h2>
          </Reveal>
          <Reveal as="p" className="t-lead" delay={80}>
            NxtOrbis® combines software engineering with AI to create smarter digital experiences and to
            integrate intelligent capabilities into modern digital solutions.
          </Reveal>
          <Reveal as="p" className={`t-body ${styles.note}`} delay={140}>
            AI is one capability among several — alongside mobile, blockchain and cloud — and it lives inside
            the same engineering discipline as everything else we build.
          </Reveal>
          <Reveal delay={200}>
            <Button href="/services#artificial-intelligence" variant="ghost" arrow>
              AI as a service line
            </Button>
          </Reveal>
        </div>

        <Reveal className={styles.flow} variant="blur" delay={120}>
          <ol className={styles.stages} aria-label="How AI fits into what we build">
            {stages.map((s, i) => (
              <li key={s.index} className={styles.stage} style={{ ["--i" as string]: i } as React.CSSProperties}>
                <div className={styles.stageHead}>
                  <span className="num">{s.index}</span>
                  {i < stages.length - 1 && <span className={styles.connector} aria-hidden="true" />}
                </div>
                <h3 className={`t-h3 ${styles.stageLabel}`}>{s.label}</h3>
                <p className="t-sm">{s.note}</p>
              </li>
            ))}
          </ol>

          <svg className={styles.field} viewBox="0 0 600 220" aria-hidden="true">
            <defs>
              <linearGradient id="ai-line" x1="0" x2="1">
                <stop offset="0" stopColor="currentColor" stopOpacity="0" />
                <stop offset="0.5" stopColor="currentColor" stopOpacity="0.6" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {Array.from({ length: 7 }).map((_, i) => (
              <path
                key={i}
                d={`M0 ${40 + i * 22} C 150 ${40 + i * 22 + (i % 2 ? 26 : -26)}, 450 ${40 + i * 22 + (i % 2 ? -26 : 26)}, 600 ${40 + i * 22}`}
                fill="none"
                stroke="url(#ai-line)"
                strokeWidth="1"
                className={styles.wave}
                style={{ animationDelay: `${i * -1.2}s` }}
              />
            ))}
            {[120, 300, 480].map((x, i) => (
              <g key={x}>
                <circle cx={x} cy="106" r="3" fill={i === 1 ? "var(--accent)" : "currentColor"} />
                <circle cx={x} cy="106" r="12" fill="none" stroke={i === 1 ? "var(--accent)" : "currentColor"} strokeOpacity="0.35" />
              </g>
            ))}
          </svg>
        </Reveal>
      </div>
    </section>
  );
}
