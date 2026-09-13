import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function ArrowRight({ size = 16, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" {...rest}>
      <path d="M2.5 8h10M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpRight({ size = 16, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" {...rest}>
      <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDown({ size = 16, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" {...rest}>
      <path d="M8 2.5v10M3.5 8.5 8 13l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Plus({ size = 16, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" {...rest}>
      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Close({ size = 18, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" {...rest}>
      <path d="m3 3 10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Check({ size = 16, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" {...rest}>
      <path d="m3 8.5 3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Spinner({ size = 16, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" {...rest}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity=".25" strokeWidth="1.5" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="0.9s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}
