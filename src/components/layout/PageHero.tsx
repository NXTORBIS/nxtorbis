import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import { CrystalField } from "@/components/visuals/CrystalField";
import { MaskedTitle } from "@/components/ui/MaskedTitle";
import styles from "./PageHero.module.css";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  meta?: ReactNode;
  aside?: ReactNode;
  size?: "display" | "h1";
  className?: string;
  /** Seed for the ambient crystal composition so each page differs slightly. */
  seed?: number;
};

/** Inner-page hero: oversized serif typography over a quiet crystal atmosphere. */
export function PageHero({ eyebrow, title, lead, meta, aside, size = "display", className, seed = 3 }: Props) {
  return (
    <header className={cx(styles.hero, className)}>
      <div className={styles.visual} aria-hidden="true">
        <CrystalField variant="ambient" parallax={false} id={`ph-cf-${seed}`} seed={seed} />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={cx("container", styles.inner)}>
        <div className={styles.main}>
          <Reveal as="p" className="eyebrow" variant="fade">
            {eyebrow}
          </Reveal>
          <MaskedTitle className={cx(size === "display" ? "t-display" : "t-h1", styles.title)} lines={[title]} delay={100} />
          {lead && (
            <Reveal as="p" className={cx("t-lead", styles.lead)} delay={120}>
              {lead}
            </Reveal>
          )}
          {meta && (
            <Reveal className={styles.meta} variant="fade" delay={180}>
              {meta}
            </Reveal>
          )}
        </div>
        {aside && (
          <Reveal className={styles.aside} variant="glass" delay={160}>
            <div className={cx("glass", "glass--l3", styles.asideInner)}>{aside}</div>
          </Reveal>
        )}
      </div>
    </header>
  );
}
