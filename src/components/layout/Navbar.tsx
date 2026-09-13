"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { company, cta, nav } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import styles from "./Navbar.module.css";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const toggleEl = toggleRef.current;
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      toggleEl?.focus();
    };
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Home first; the logo links home too.
  const items = nav;

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled, open && styles.open)}>
      <div className={cx("container", styles.inner)}>
        <Link href="/" className={styles.brand} aria-label="NxtOrbis® — home" aria-current={pathname === "/" ? "page" : undefined}>
          <Logo height={20} priority />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.list}>
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} className={cx(styles.link, active && styles.active)} aria-current={active ? "page" : undefined}>
                    <span className={styles.label}>{item.label}</span>
                    <span className={styles.dot} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Button href={cta.primary.href} variant="secondary" size="sm" arrow className={styles.cta}>
            {cta.primary.label}
          </Button>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={toggle}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={styles.drawer} aria-hidden={!open}>
        <div className={cx("container", styles.drawerInner)}>
          <ul className={styles.drawerList}>
            {nav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}>
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    className={cx(styles.drawerLink, active && styles.drawerActive)}
                    aria-current={active ? "page" : undefined}
                    tabIndex={open ? 0 : -1}
                  >
                    <span className="num">0{i + 1}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className={styles.drawerFoot} style={{ transitionDelay: open ? "360ms" : "0ms" }}>
            <Button href={cta.primary.href} variant="primary" size="lg" arrow>
              {cta.primary.label}
            </Button>
            <a className={styles.drawerEmail} href={`mailto:${company.email}`} tabIndex={open ? 0 : -1}>
              {company.email}
            </a>
            <p className="t-xs">{company.legalName} · {company.location}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
