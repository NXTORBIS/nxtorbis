/**
 * What this build is.
 *
 * The values come from the environment at build time — GitHub Actions sets
 * them on every deploy — and fall back to nothing rather than to an invented
 * commit. The footer prints whatever is true.
 */
const sha = process.env.NEXT_PUBLIC_BUILD_SHA ?? "";
const date = process.env.NEXT_PUBLIC_BUILD_DATE ?? "";

export const buildStamp = [sha ? `BUILD ${sha.slice(0, 7)}` : null, date ? date.slice(0, 10) : null]
  .filter(Boolean)
  .join(" · ");
