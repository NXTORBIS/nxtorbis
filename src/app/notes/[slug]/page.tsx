import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { company } from "@/content/site";
import { notes } from "@/content/notes";
import { pageMeta } from "@/lib/meta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/lib/Reveal";
import styles from "./page.module.css";

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) return {};
  return pageMeta({ title: `${note.title} | ${company.name}`, description: note.standfirst, path: `/notes/${note.slug}` });
}

const dateOf = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = notes.find((n) => n.slug === slug);
  if (!note) notFound();

  return (
    <>
      <PageHero
        eyebrow="Engineering note"
        title={note.title}
        size="h1"
        lead={note.standfirst}
        meta={
          <p className="t-xs">
            <time dateTime={note.date}>{dateOf(note.date)}</time> · {note.readingMinutes} min read
          </p>
        }
        seed={11}
      />

      <section className="section" aria-label="Note">
        <div className="container">
          <article className={styles.note}>
            {note.body.map((block, i) => (
              <Reveal as="section" key={i} className={styles.block} delay={i * 50}>
                {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
                {block.paragraphs.map((text, j) => (
                  <p key={j} className={styles.text}>
                    {text}
                  </p>
                ))}
                {block.list && (
                  <ul className={styles.list}>
                    {block.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
            <p className={styles.back}>
              <Link href="/notes">All engineering notes</Link>
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
