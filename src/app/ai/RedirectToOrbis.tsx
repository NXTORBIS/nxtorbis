"use client";

import { useEffect } from "react";

/** Forwards /ai to /orbis, keeping any #section the link pointed at. */
export function RedirectToOrbis() {
  useEffect(() => {
    window.location.replace(`/orbis${window.location.hash}`);
  }, []);
  return null;
}
