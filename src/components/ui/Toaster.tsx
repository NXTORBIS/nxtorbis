"use client";

import { useEffect, useState } from "react";
import styles from "./Toaster.module.css";

/**
 * Small confirmations, said once and taken away.
 *
 * Anything on the site can raise one without importing this:
 *
 *   window.dispatchEvent(new CustomEvent("nx:toast", { detail: "Copied" }))
 *
 * They are announced politely to screen readers, stack newest last, and
 * leave after four seconds or when dismissed.
 */
type Toast = { id: number; text: string };

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    let n = 0;
    const onToast = (e: Event) => {
      const text = String((e as CustomEvent).detail ?? "").trim();
      if (!text) return;
      const id = ++n;
      setToasts((list) => [...list, { id, text }].slice(-3));
      window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 4000);
    };
    window.addEventListener("nx:toast", onToast);
    return () => window.removeEventListener("nx:toast", onToast);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} type="button" className={styles.toast} onClick={() => setToasts((l) => l.filter((x) => x.id !== t.id))}>
          {t.text}
        </button>
      ))}
    </div>
  );
}

/** Raise a toast from anywhere, including code that never renders. */
export function toast(text: string) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("nx:toast", { detail: text }));
}
