import { Orbitron } from "next/font/google";

/**
 * Orbitron is the Orbis app's display face. It is loaded only by the Orbis
 * page (nxtorbis.com/ai), so no other route downloads it.
 */
export const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-orbitron",
  display: "swap",
});
