"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import styles from "./PageRail.module.css";

/**
 * On this page.
 *
 * The long pages — About, Services, Pricing — run to six or nine screens and
 * give no sense of where you are in them. This reads the page's own sections
 * on mount (any <section> with an id and a heading), lights whichever holds
 * the middle of the screen, and lets you jump.
 *
 * It builds itself from the page rather than from a list somebody has to
 * keep in step: a section added or renamed shows up here on its own, and a
 * page with fewer than three sections gets no rail at all.
 */
export function PageRail() {
  const [items, setItems] = useState<{ id: string; label: string }[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")].filter((el) =>
      el.querySelector("h2, h1"),
    );
    if (sections.length < 3) return;

    setItems(
      sections.map((el) => ({
        id: el.id,
        label: (el.querySelector("h2, h1")?.textContent ?? el.id).replace(/\s+/g, " ").trim().slice(0, 28),
      })),
    );

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive((entry.target as HTMLElement).id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (items.length < 3) return null;

  return (
    <nav className={styles.rail} aria-label="On this page">
      <p className={styles.title}>On this page</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cx(styles.link, active === item.id && styles.active)}
              aria-current={active === item.id ? "true" : undefined}
            >
              <span className={styles.tick} aria-hidden="true" />
              <span className={styles.label}>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
