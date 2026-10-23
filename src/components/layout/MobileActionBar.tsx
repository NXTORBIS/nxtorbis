"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import { company, cta } from "@/content/site";
import { ArrowRight } from "@/components/ui/Icons";
import styles from "./MobileActionBar.module.css";

/**
 * The action, within reach on a phone.
 *
 * On a small screen the only way to start a project was to open the menu and
 * find it. This rises once you are past the first screen, carries the primary
 * action and a direct email, and gets out of the way on the page where it
 * would be in the way — the contact page itself, where the form is the point.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/contact")) return null;

  return (
    <div className={cx(styles.bar, shown && styles.shown)} aria-hidden={!shown}>
      <Link href={cta.primary.href} className={styles.primary} tabIndex={shown ? 0 : -1}>
        {cta.primary.label}
        <ArrowRight size={15} />
      </Link>
      <a href={`mailto:${company.email}`} className={styles.secondary} aria-label={`Email ${company.email}`} tabIndex={shown ? 0 : -1}>
        Email
      </a>
    </div>
  );
}
