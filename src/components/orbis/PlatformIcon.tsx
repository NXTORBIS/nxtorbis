import type { OrbisPlatform } from "@/content/orbis";

/** Platform marks for download cards. Only rendered for platforms that have a release. */
export function PlatformIcon({ platform }: { platform: OrbisPlatform }) {
  if (platform === "windows") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
        <path d="M3 5.6 10.6 4.6v7.1H3zM11.6 4.4 21 3.1v8.6h-9.4zM3 12.6h7.6v7.1L3 18.7zM11.6 12.6H21v8.5l-9.4-1.3z" />
      </svg>
    );
  }
  if (platform === "macos") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
        <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.9-3-.9-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zM14.2 5.8c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 9 3 3-3 3M13 15h4" />
    </svg>
  );
}
