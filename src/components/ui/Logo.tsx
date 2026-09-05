import Image from "next/image";
import { cx } from "@/lib/cx";

/** The official wordmark and its true proportions (602 x 95). Exported so
 *  every surface that draws the mark scales it identically. */
export const LOGO_SRC = "/brand/nxtorbis-wordmark.png";
export const LOGO_RATIO = 602 / 95;

type Props = {
  /** Rendered height in px; width follows the official proportions (602 x 95). */
  height?: number;
  className?: string;
  priority?: boolean;
};

/**
 * Official NxtOrbis® wordmark. The asset is the original artwork with only
 * transparent margins trimmed — never redrawn, recoloured or distorted.
 */
export function Logo({ height = 22, className, priority = false }: Props) {
  const width = Math.round(height * LOGO_RATIO);
  return (
    <Image
      src={LOGO_SRC}
      alt="NxtOrbis®"
      width={width}
      height={height}
      priority={priority}
      className={cx(className)}
      style={{ width, height }}
    />
  );
}
