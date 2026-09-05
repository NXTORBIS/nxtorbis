"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import styles from "./GlassSelect.module.css";

type Props = {
  id: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  name?: string;
};

/**
 * Liquid Glass listbox. A real combobox, not a restyled <select>: the closed
 * control and the floating menu are both glass surfaces, so the environment
 * stays visible through them.
 *
 * Accessibility: proper listbox semantics, full keyboard support (arrows,
 * Home/End, Enter/Space, Escape, type-ahead), focus returns to the trigger on
 * close, and a hidden native input keeps the value in normal form submission.
 */
export function GlassSelect({ id, value, options, placeholder, onChange, onBlur, disabled, invalid, describedBy, name }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)));
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const typed = useRef({ str: "", at: 0 });
  const listId = useId();

  // close on outside pointer or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const commit = (i: number) => {
    onChange(options[i]);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (i >= last ? 0 : i + 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i <= 0 ? last : i - 1)); return; }
    if (e.key === "Home") { e.preventDefault(); setActive(0); return; }
    if (e.key === "End") { e.preventDefault(); setActive(last); return; }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); commit(active); return; }
    if (e.key === "Tab") { setOpen(false); return; }
    if (e.key.length === 1) {
      const now = Date.now();
      typed.current.str = now - typed.current.at > 700 ? e.key : typed.current.str + e.key;
      typed.current.at = now;
      const hit = options.findIndex((o) => o.toLowerCase().startsWith(typed.current.str.toLowerCase()));
      if (hit >= 0) setActive(hit);
    }
  };

  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActive(Math.max(0, options.indexOf(value)));
      setOpen(true);
    }
  };

  return (
    <div ref={rootRef} className={styles.root} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) onBlur?.(); }}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKey}
        className={cx(styles.trigger, !value && styles.placeholder, invalid && styles.invalid, open && styles.open)}
      >
        <span className={styles.value}>{value || placeholder}</span>
        <span className={cx(styles.chev, open && styles.chevOpen)} aria-hidden="true">
          <svg viewBox="0 0 12 8" width="12" height="8" fill="none">
            <path d="M1 1.5 6 6.5l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={id}
          aria-activedescendant={`${listId}-${active}`}
          tabIndex={-1}
          onKeyDown={onListKey}
          className={cx("glass", "glass--l4", "glass--panel", styles.menu)}
        >
          {options.map((o, i) => (
            <li
              key={o}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={o === value}
              className={cx(styles.option, i === active && styles.optionActive, o === value && styles.optionSelected)}
              onPointerEnter={() => setActive(i)}
              onClick={() => commit(i)}
            >
              <span>{o}</span>
              {o === value && (
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                  <path d="m3 8.5 3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}

      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
