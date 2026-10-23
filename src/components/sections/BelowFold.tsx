import dynamic from "next/dynamic";

/**
 * Everything on the home page below the first screen.
 *
 * These four carry the page's weight — three of them are interactive and
 * bring their own scripts — and they were all in the first load along with
 * the hero. They are split into their own chunks here, so the hero paints
 * against the shell rather than behind their code.
 *
 * They stay server-rendered on purpose. Dropping them from the HTML would
 * make the home page empty to a crawler and to anyone whose scripts fail,
 * which is a worse trade than a few kilobytes.
 */
const ServiceExplorer = dynamic(() => import("./ServiceExplorer").then((m) => m.ServiceExplorer));
const ProductShowcase = dynamic(() => import("./ProductShowcase").then((m) => m.ProductShowcase));
const TechnologySection = dynamic(() => import("./TechnologySection").then((m) => m.TechnologySection));
const WhyNxtOrbis = dynamic(() => import("./WhyNxtOrbis").then((m) => m.WhyNxtOrbis));

export function HomeBelowFold() {
  return (
    <>
      <ServiceExplorer />
      <ProductShowcase />
      <TechnologySection />
      <WhyNxtOrbis />
    </>
  );
}
