import Image from "next/image";
import { cx } from "@/lib/cx";

type Props = {
  /** Rendered height in px; width follows the official proportions (610 × 96). */
  height?: number;
  className?: string;
  priority?: boolean;
};

/**
 * Official NxtOrbis® wordmark. The asset is the original artwork with only
 * transparent margins trimmed — never redrawn, recoloured or distorted.
 */
export function Logo({ height = 22, className, priority = false }: Props) {
  const width = Math.round((height * 610) / 96);
  return (
    <Image
      src="/brand/nxtorbis-wordmark.png"
      alt="NxtOrbis®"
      width={width}
      height={height}
      priority={priority}
      className={cx(className)}
      style={{ width, height }}
    />
  );
}
