import type { Service } from "@/content/site";
import styles from "./ServiceGlyph.module.css";

/**
 * Abstract, architectural glyphs for each service. Line-based, monochrome,
 * with a single accent node. Intentionally non-literal (no icons of brains,
 * chips or coins).
 */
export function ServiceGlyph({ kind, className }: { kind: Service["glyph"]; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, vectorEffect: "non-scaling-stroke" as const };

  return (
    <svg viewBox="0 0 240 240" className={`${styles.svg} ${className ?? ""}`} aria-hidden="true">
      <rect x="0.5" y="0.5" width="239" height="239" stroke="currentColor" strokeOpacity="0.12" fill="none" />
      {kind === "custom" && (
        <g {...common}>
          {/* Bespoke: modular blocks fitting a frame */}
          <rect x="40" y="40" width="160" height="160" strokeOpacity="0.35" />
          <rect x="40" y="40" width="72" height="72" />
          <rect x="128" y="40" width="72" height="34" />
          <rect x="128" y="90" width="72" height="22" />
          <rect x="40" y="128" width="34" height="72" />
          <rect x="90" y="128" width="110" height="72" />
          <circle cx="145" cy="164" r="4" fill="var(--accent)" stroke="none" />
        </g>
      )}
      {kind === "product" && (
        <g {...common}>
          {/* Product: layered planes rising */}
          <path d="M120 60 190 96 120 132 50 96Z" />
          <path d="M120 96 190 132 120 168 50 132Z" strokeOpacity="0.6" />
          <path d="M120 132 190 168 120 204 50 168Z" strokeOpacity="0.3" />
          <line x1="120" y1="24" x2="120" y2="60" />
          <circle cx="120" cy="24" r="4" fill="var(--accent)" stroke="none" />
        </g>
      )}
      {kind === "mobile" && (
        <g {...common}>
          {/* Mobile: two offset portrait frames */}
          <rect x="66" y="40" width="88" height="160" rx="10" />
          <rect x="94" y="60" width="88" height="160" rx="10" strokeOpacity="0.4" />
          <line x1="98" y1="52" x2="122" y2="52" />
          <circle cx="110" cy="186" r="4" fill="var(--accent)" stroke="none" />
        </g>
      )}
      {kind === "ai" && (
        <g {...common}>
          {/* AI: structured node lattice */}
          {[
            [60, 70],
            [120, 50],
            [180, 70],
            [60, 130],
            [120, 120],
            [180, 130],
            [90, 190],
            [150, 190],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill={i === 4 ? "var(--accent)" : "none"} stroke={i === 4 ? "none" : "currentColor"} />
          ))}
          <path d="M60 70 120 50 180 70M60 70 120 120 180 70M60 130 120 120 180 130M120 120 90 190M120 120 150 190M60 70 60 130M180 70 180 130" strokeOpacity="0.55" />
        </g>
      )}
      {kind === "blockchain" && (
        <g {...common}>
          {/* Blockchain: linked hexagonal cells */}
          <path d="M70 84 96 69 122 84v30l-26 15-26-15z" />
          <path d="M118 126 144 111 170 126v30l-26 15-26-15z" />
          <path d="M70 156 96 141 122 156v30l-26 15-26-15z" strokeOpacity="0.45" />
          <line x1="122" y1="99" x2="144" y2="111" />
          <line x1="122" y1="171" x2="144" y2="156" strokeOpacity="0.45" />
          <circle cx="144" cy="141" r="4" fill="var(--accent)" stroke="none" />
        </g>
      )}
      {kind === "cloud" && (
        <g {...common}>
          {/* Cloud: distributed tiers */}
          <ellipse cx="120" cy="72" rx="70" ry="18" />
          <ellipse cx="120" cy="120" rx="70" ry="18" strokeOpacity="0.6" />
          <ellipse cx="120" cy="168" rx="70" ry="18" strokeOpacity="0.3" />
          <line x1="50" y1="72" x2="50" y2="168" strokeOpacity="0.4" />
          <line x1="190" y1="72" x2="190" y2="168" strokeOpacity="0.4" />
          <circle cx="120" cy="54" r="4" fill="var(--accent)" stroke="none" />
        </g>
      )}
    </svg>
  );
}
