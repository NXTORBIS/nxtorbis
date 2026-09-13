import type { Metadata } from "next";
import Link from "next/link";
import { RedirectToOrbis } from "./RedirectToOrbis";

/**
 * nxtorbis.com/ai was the first home of Orbis, and it has already been
 * shared. The site is a static export, so there are no server redirects:
 * this page forwards visitors (meta refresh, then script) and tells search
 * engines where the page lives now.
 */
export const metadata: Metadata = {
  title: "Orbis has moved | NxtOrbis®",
  robots: { index: false, follow: true },
  alternates: { canonical: "/orbis" },
};

export default function AiRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/orbis" />
      <RedirectToOrbis />
      <section className="section">
        <div className="container">
          <p className="t-lead">
            Orbis now lives at <Link href="/orbis">nxtorbis.com/orbis</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
