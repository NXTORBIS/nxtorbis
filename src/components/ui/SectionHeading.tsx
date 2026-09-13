import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import styles from "./SectionHeading.module.css";

type Props = {
  eyebrow?: string;
  /** Section index, rendered as a small technical mark beside the eyebrow. */
  index?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  /** Heading level for semantics. */
  as?: "h1" | "h2" | "h3";
  size?: "h1" | "h2" | "h3" | "display";
  align?: "start" | "center";
  /** Split layout: heading left, lead/action right on desktop. */
  split?: boolean;
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  index,
  title,
  lead,
  action,
  as: Tag = "h2",
  size = "h2",
  align = "start",
  split = false,
  className,
  id,
}: Props) {
  return (
    <div className={cx(styles.wrap, split && styles.split, align === "center" && styles.center, className)}>
      <div className={styles.main}>
        {eyebrow && (
          <Reveal as="p" className={cx("eyebrow", styles.eyebrow)} variant="fade">
            <span>{eyebrow}</span>
            {index && <span className={styles.index}>{index}</span>}
          </Reveal>
        )}
        <Reveal variant="clip">
          <Tag id={id} className={cx(`t-${size}`, styles.title)}>
            {title}
          </Tag>
        </Reveal>
      </div>
      {(lead || action) && (
        <div className={styles.aside}>
          {lead && (
            <Reveal as="p" className={cx("t-lead", styles.lead)} variant="up" delay={80}>
              {lead}
            </Reveal>
          )}
          {action && (
            <Reveal className={styles.action} variant="right" delay={140}>
              {action}
            </Reveal>
          )}
        </div>
      )}
    </div>
  );
}
