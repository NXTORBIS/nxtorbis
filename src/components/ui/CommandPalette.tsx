"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cx } from "@/lib/cx";
import { company, nav, products, services } from "@/content/site";
import { notes } from "@/content/notes";
import styles from "./CommandPalette.module.css";

/**
 * Everything on the site, one keystroke away.
 *
 * Ctrl+K or ⌘K opens it; typing filters pages, products, services and notes
 * by name and by the words around them; the arrow keys walk the list and
 * Enter goes. Escape closes it, focus returns to wherever it came from, and
 * the page behind it stops scrolling while it is open.
 *
 * The index is built from the same content files the pages are, so nothing
 * here can list a page that does not exist or miss one that does.
 */

type Item = {
  id: string;
  label: string;
  hint: string;
  group: string;
  href: string;
  keywords: string;
  external?: boolean;
};

function buildIndex(): Item[] {
  const items: Item[] = [];

  for (const item of nav) {
    items.push({
      id: `nav-${item.href}`,
      label: item.label,
      hint: item.href,
      group: "Pages",
      href: item.href,
      keywords: `${item.label} ${item.href}`,
    });
  }
  items.push(
    { id: "nav-notes", label: "Engineering notes", hint: "/notes", group: "Pages", href: "/notes", keywords: "notes writing engineering blog articles" },
    { id: "nav-privacy", label: "Privacy Policy", hint: "/privacy", group: "Pages", href: "/privacy", keywords: "privacy policy data gdpr cookies" },
  );

  for (const product of products) {
    items.push({
      id: `product-${product.slug}`,
      label: product.name,
      hint: product.positioning,
      group: "Products",
      href: `/products/${product.slug}`,
      keywords: `${product.name} ${product.positioning} ${product.technologies.join(" ")} ${product.intro}`,
    });
  }

  for (const service of services) {
    items.push({
      id: `service-${service.id}`,
      label: service.title,
      hint: service.short,
      group: "Services",
      href: `/services#${service.slug}`,
      keywords: `${service.title} ${service.short} ${service.description}`,
    });
  }

  for (const note of notes) {
    items.push({
      id: `note-${note.slug}`,
      label: note.title,
      hint: `${note.readingMinutes} min read`,
      group: "Notes",
      href: `/notes/${note.slug}`,
      keywords: `${note.title} ${note.standfirst}`,
    });
  }

  items.push(
    { id: "do-contact", label: "Start a project", hint: "Tell us what you are building", group: "Actions", href: "/contact", keywords: "contact start project quote enquiry hire brief" },
    { id: "do-email", label: `Email ${company.email}`, hint: "Opens your mail app", group: "Actions", href: `mailto:${company.email}`, keywords: "email mail write contact", external: true },
    { id: "do-download", label: "Download Orbis", hint: "Windows", group: "Actions", href: "/orbis#download", keywords: "download orbis installer windows exe" },
  );

  return items;
}

function score(item: Item, query: string): number {
  const q = query.toLowerCase();
  const label = item.label.toLowerCase();
  if (label === q) return 0;
  if (label.startsWith(q)) return 1;
  if (label.includes(q)) return 2;
  if (item.keywords.toLowerCase().includes(q)) return 3;
  return -1;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const index = useMemo(buildIndex, []);
  const results = useMemo(() => {
    if (!query.trim()) return index.slice(0, 9);
    return index
      .map((item) => ({ item, s: score(item, query.trim()) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => a.s - b.s)
      .slice(0, 12)
      .map((r) => r.item);
  }, [index, query]);

  // The one shortcut, and the one way out.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openerRef.current = document.activeElement as HTMLElement;
        setOpen((v) => !v);
        return;
      }
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openerRef.current = document.activeElement as HTMLElement;
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setQuery("");
    setActive(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(t);
      openerRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const go = (item: Item) => {
    setOpen(false);
    if (item.external) {
      window.location.href = item.href;
      return;
    }
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => {
        const next = e.key === "ArrowDown" ? i + 1 : i - 1;
        const wrapped = (next + results.length) % Math.max(1, results.length);
        listRef.current?.children[wrapped]?.scrollIntoView({ block: "nearest" });
        return wrapped;
      });
      return;
    }
    if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  if (!open) return null;

  let lastGroup = "";

  return (
    <div className={styles.scrim} onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className={styles.panel} role="dialog" aria-modal="true" aria-label="Search this site" onKeyDown={onKeyDown}>
        <div className={styles.field}>
          <span className={styles.prompt} aria-hidden="true">
            /
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, products, services and notes"
            aria-label="Search"
            aria-controls="command-results"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={styles.esc}>esc</kbd>
        </div>

        <ul ref={listRef} id="command-results" className={styles.results} role="listbox" aria-label="Results">
          {results.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            return (
              <li key={item.id} role="option" aria-selected={i === active}>
                {header && <span className={styles.group}>{header}</span>}
                <button
                  type="button"
                  className={cx(styles.result, i === active && styles.resultActive)}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => go(item)}
                >
                  <span className={styles.label}>{item.label}</span>
                  <span className={styles.hint}>{item.hint}</span>
                </button>
              </li>
            );
          })}
          {!results.length && <li className={styles.empty}>Nothing matches “{query}”. Try a product, a service or “notes”.</li>}
        </ul>

        <p className={styles.foot}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> to move
          </span>
          <span>
            <kbd>↵</kbd> to open
          </span>
          <span>
            <kbd>esc</kbd> to close
          </span>
        </p>
      </div>
    </div>
  );
}
