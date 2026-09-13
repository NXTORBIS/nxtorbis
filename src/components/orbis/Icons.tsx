import type { OrbisIconName } from "@/content/orbis";

/** Stroke icons in the Orbis app's style, as one inline symbol sheet. */
export function OrbisIconSheet() {
  return (
    <svg className="ob-icon-sheet" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <symbol id="ob-i-orbit" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" /><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-30 12 12)" /></symbol>
      <symbol id="ob-i-panel" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></symbol>
      <symbol id="ob-i-cpu" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M15 20v2M9 2v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" /></symbol>
      <symbol id="ob-i-plus" viewBox="0 0 24 24"><path d="M5 12h14M12 5v14" /></symbol>
      <symbol id="ob-i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></symbol>
      <symbol id="ob-i-hash" viewBox="0 0 24 24"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" /></symbol>
      <symbol id="ob-i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></symbol>
      <symbol id="ob-i-mic" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" /></symbol>
      <symbol id="ob-i-bell" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" /></symbol>
      <symbol id="ob-i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></symbol>
      <symbol id="ob-i-pen" viewBox="0 0 24 24"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.4 2.6a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z" /></symbol>
      <symbol id="ob-i-penline" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></symbol>
      <symbol id="ob-i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></symbol>
      <symbol id="ob-i-settings" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></symbol>
      <symbol id="ob-i-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /></symbol>
      <symbol id="ob-i-chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></symbol>
      <symbol id="ob-i-share" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></symbol>
      <symbol id="ob-i-ellipsis" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></symbol>
      <symbol id="ob-i-files" viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v5h5M16 13H8M16 17H8M10 9H8" /></symbol>
      <symbol id="ob-i-upload" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></symbol>
      <symbol id="ob-i-sparkles" viewBox="0 0 24 24"><path d="m12 3 1.9 5.6 5.6 1.9-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9Z" /><path d="M5 3v4M3 5h4M19 17v4M17 19h4" /></symbol>
      <symbol id="ob-i-send" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></symbol>
      <symbol id="ob-i-zap" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></symbol>
      <symbol id="ob-i-gauge" viewBox="0 0 24 24"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></symbol>
      <symbol id="ob-i-brain" viewBox="0 0 24 24"><path d="M12 5a3 3 0 1 0-5.9.9A3 3 0 0 0 5 11.5a3 3 0 0 0 1 5.5 3 3 0 0 0 6 .9V5Z" /><path d="M12 5a3 3 0 1 1 5.9.9 3 3 0 0 1 1.1 5.6 3 3 0 0 1-1 5.5 3 3 0 0 1-6 .9V5Z" /></symbol>
      <symbol id="ob-i-sliders" viewBox="0 0 24 24"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></symbol>
      <symbol id="ob-i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></symbol>
      <symbol id="ob-i-history" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></symbol>
      <symbol id="ob-i-layers" viewBox="0 0 24 24"><path d="m12 2 9 5-9 5-9-5 9-5z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></symbol>
      <symbol id="ob-i-message" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8M8 13h5" /></symbol>
      <symbol id="ob-i-refresh" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-2.6-6.4" /><path d="M21 3v6h-6" /></symbol>
      <symbol id="ob-i-copy" viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></symbol>
      <symbol id="ob-i-thumb-up" viewBox="0 0 24 24"><path d="M7 10v12" /><path d="M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 8a2 2 0 0 1-1.9 1.4H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9Z" /></symbol>
      <symbol id="ob-i-thumb-down" viewBox="0 0 24 24"><path d="M17 14V2" /><path d="M9 18.1 10 14H4.2a2 2 0 0 1-1.9-2.6l2.3-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.8a2 2 0 0 0-1.8 1.1L12 22a3.1 3.1 0 0 1-3-3.9Z" /></symbol>
      <symbol id="ob-i-palette" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle cx="8" cy="10" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="7" r="1.2" fill="currentColor" stroke="none" /><circle cx="16" cy="10" r="1.2" fill="currentColor" stroke="none" /><path d="M12 22a3 3 0 0 0 0-6h-1.5a1.5 1.5 0 0 1 0-3H14" /></symbol>
      <symbol id="ob-i-external" viewBox="0 0 24 24"><path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></symbol>
      <symbol id="ob-i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></symbol>
      <symbol id="ob-i-min" viewBox="0 0 24 24"><path d="M5 12h14" /></symbol>
      <symbol id="ob-i-max" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" /></symbol>
      <symbol id="ob-i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></symbol>
      <symbol id="ob-i-monitor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></symbol>
      <symbol id="ob-i-windows" viewBox="0 0 24 24"><path d="M3 5.6 10.6 4.6v7.1H3zM11.6 4.4 21 3.1v8.6h-9.4zM3 12.6h7.6v7.1L3 18.7zM11.6 12.6H21v8.5l-9.4-1.3z" /></symbol>
    </svg>
  );
}

export function OrbisIcon({ name, fill = false, className }: { name: OrbisIconName | string; fill?: boolean; className?: string }) {
  return (
    <svg className={["ob-icon", fill ? "ob-icon-fill" : "", className ?? ""].join(" ").trim()} aria-hidden="true" focusable="false">
      <use href={`#ob-i-${name}`} />
    </svg>
  );
}
