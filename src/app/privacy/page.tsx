import type { Metadata } from "next";
import { company } from "@/content/site";
import { privacyPolicy, privacyUpdated } from "@/content/legal";
import { pageMeta } from "@/lib/meta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/lib/Reveal";
import styles from "./page.module.css";

export const metadata: Metadata = pageMeta({
  title: `Privacy Policy | ${company.name}`,
  description: `How ${company.name} handles information on nxtorbis.com and in the Orbis desktop app: no analytics, no cookies, and nothing collected by this site.`,
  path: "/privacy",
});

const updated = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(privacyUpdated));

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Policies"
        title={
          <>
            Privacy <span className="t-serif">Policy</span>
          </>
        }
        lead="What this website and the Orbis app do with information — and, for the most part, what they never collect in the first place."
        meta={
          <p className="t-xs">
            Last updated <time dateTime={privacyUpdated}>{updated}</time>
          </p>
        }
        seed={7}
      />

      <section className="section" aria-label="Privacy policy">
        <div className="container">
          <div className={styles.policy}>
            {privacyPolicy.map((section, i) => (
              <Reveal as="section" key={section.heading} className={styles.block} delay={i * 40}>
                <h2 className={styles.heading}>{section.heading}</h2>
                {section.blocks.map((block, j) =>
                  typeof block === "string" ? (
                    <p key={j} className={styles.text}>
                      {block}
                    </p>
                  ) : (
                    <ul key={j} className={styles.list}>
                      {block.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}
              </Reveal>
            ))}
            <p className={styles.contact}>
              Questions about this policy: <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
