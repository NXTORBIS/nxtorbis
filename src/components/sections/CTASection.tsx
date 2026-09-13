import { cta } from "@/content/site";
import { Reveal } from "@/lib/Reveal";
import { Button } from "@/components/ui/Button";
import { CrystalField } from "@/components/visuals/CrystalField";
import styles from "./CTASection.module.css";

type Props = {
  title?: React.ReactNode;
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function CTASection({
  title = (
    <>
      Ready to build <span className="t-serif">what’s next?</span>
    </>
  ),
  body = "Tell us about the product, the problem or the idea. We will come back to you with a clear next step.",
  primary = cta.primary,
  secondary = cta.contact,
}: Props) {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="cta-title">
      <div className={styles.visual} aria-hidden="true">
        <CrystalField variant="cta" parallax={false} id="cta-cf" hues={["gold", "steel", "copper"]} seed={19} />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <Reveal variant="clip">
          <h2 id="cta-title" className={`t-display ${styles.title}`}>
            {title}
          </h2>
        </Reveal>
        <Reveal as="p" className={`t-lead ${styles.body}`} delay={80}>
          {body}
        </Reveal>
        <Reveal className={styles.actions} variant="scale" delay={140}>
          <Button href={primary.href} variant="primary" size="lg" arrow intensity="major" magnetic fillFrom="center">
            {primary.label}
          </Button>
          <Button href={secondary.href} variant="secondary" size="lg" fillFrom="center">
            {secondary.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
