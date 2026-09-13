import { about, cta } from "@/content/site";
import { Reveal } from "@/lib/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import styles from "./CultureSection.module.css";

export function CultureSection({ full = false }: { full?: boolean }) {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="culture-title" id="culture">
      <div className="container">
        <SectionHeading
          id="culture-title"
          eyebrow="Culture & team"
          index={full ? undefined : "08"}
          title={
            <>
              Problem-solvers <span className="t-serif">first,</span> coders second.
            </>
          }
          lead="A team of developers, designers and strategists who believe technology should do something useful — and who enjoy the hard problems."
          action={
            !full && (
              <Button href={`${cta.about.href}#culture`} variant="ghost" arrow>
                More about our culture
              </Button>
            )
          }
          split
        />

        <ul className={styles.values}>
          {about.culture.map((v, i) => (
            <Reveal as="li" key={v.title} className={styles.value} variant="up" delay={i * 60}>
              <span className="num">0{i + 1}</span>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={`t-sm ${styles.valueBody}`}>{v.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
