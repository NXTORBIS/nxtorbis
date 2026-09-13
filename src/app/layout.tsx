import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { company, seo } from "@/content/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollRail } from "@/components/sections/ScrollRail";
import { Cursor } from "@/components/ui/Cursor";
import { GlassRuntime } from "@/components/ui/GlassRuntime";
import { LoadingExperience } from "@/components/loader/LoadingExperience";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.domain),
  title: seo.home.title,
  description: seo.home.description,
  applicationName: company.shortName,
  keywords: [
    "software development company",
    "software product development",
    "custom software",
    "mobile app development",
    "artificial intelligence",
    "blockchain development",
    "cloud computing",
    "Chennai",
  ],
  openGraph: {
    type: "website",
    siteName: company.legalName,
    title: seo.home.title,
    description: seo.home.description,
    url: company.domain,
    images: [{ url: "/brand/og-image.png", width: 1200, height: 630, alt: "NxtOrbis® — Building what’s next." }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.home.title,
    description: seo.home.description,
    images: ["/brand/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a0806",
  width: "device-width",
  initialScale: 1,
};


/**
 * Entrance boot script. Runs before the rest of the document is parsed, so the
 * entrance is on screen from the first paint rather than appearing after
 * hydration on top of a homepage the visitor has already seen.
 *
 * It does three things and nothing else:
 *   - one entrance per session, so returning to the tab is not a performance
 *   - marks the document, which is what the CSS keys off; with scripting
 *     unavailable the class is never set and the site is simply itself
 *   - clears itself on a timer, so a build that never hydrates still cannot
 *     leave anyone stranded behind a decorative layer
 *
 * That last timer also un-hides the reveal content. If the app never took
 * over, the reveal runtime never ran either, and `scripting: none` does not
 * apply because scripting *is* enabled — the JavaScript simply failed to
 * arrive. Without this the page would come back empty of everything the
 * reveal system owns.
 */
const ENTRANCE_BOOT = `(function(){try{var d=document.documentElement,k="nx-entered";
if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,"1");
d.classList.add("entry-active","entry-hold");
setTimeout(function(){d.classList.remove("entry-active","entry-hold");
if(!d.dataset.nxReady){var s=document.createElement("style");
s.textContent="[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}";
document.head.appendChild(s)}},7000)}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script id="entrance-boot" dangerouslySetInnerHTML={{ __html: ENTRANCE_BOOT }} />
        <noscript>
          {/* Belt and braces for browsers without the `scripting` media feature. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <ScrollRail />
        <main id="main">{children}</main>
        <Footer />
        <Cursor />
        <GlassRuntime />
        <LoadingExperience />
      </body>
    </html>
  );
}
