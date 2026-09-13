"use client";

import { useState } from "react";
import { about } from "@/content/site";
import { cx } from "@/lib/cx";
import { Reveal } from "@/lib/Reveal";
import styles from "./MissionList.module.css";

/**
 * Mission as four verbs. Hovering / focusing a verb brings it forward and
 * lets the others recede. All content stays visible at every size.
 */
export function MissionList() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <ol className={styles.list} onMouseLeave={() => setActive(null)}>
      {about.mission.map((m, i) => {
        const dim = active !== null && active !== i;
        return (
          <Reveal as="li" key={m.verb} className={cx(styles.item, dim && styles.dim)} delay={i * 60}>
            <div
              className={styles.row}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <span className="num">0{i + 1}</span>
              <h3 className={styles.verb}>{m.verb}</h3>
              <p className={styles.body}>{m.body}</p>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
