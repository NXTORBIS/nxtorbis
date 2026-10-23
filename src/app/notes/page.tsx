import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/content/site";
import { notes } from "@/content/notes";
import { pageMeta } from "@/lib/meta";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/lib/Reveal";
import styles from "./page.module.css";

export const metadata: Metadata = pageMeta({
  title: `Engineering Notes | ${company.name}`,
  description:
    "How parts of this site were built and what they cost: one WebGL object for the Orbis page, lighting a page from a moving source, and a front door that ran at eleven frames a second.",
  path: "/notes",
});

const dateOf = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

export default function NotesPage() {
  return (
    <>
      <PageHero
        eyebrow="Engineering notes"
        title={
          <>
            How it was <span className="t-serif">built.</span>
          </>
        }
        lead="Notes on the engineering behind this site and the software on it, with the measurements that decided each change. Written by the people who made them."
        seed={5}
      />

      <section className="section" aria-label="Notes">
        <div className="container">
          <ol className={styles.list}>
            {notes.map((note, i) => (
              <Reveal as="li" key={note.slug} className={styles.item} delay={i * 70}>
                <Link href={`/notes/${note.slug}`} className={styles.link}>
                  <p className={styles.meta}>
                    <time dateTime={note.date}>{dateOf(note.date)}</time>
                    <span>{note.readingMinutes} min read</span>
                  </p>
                  <h2 className={styles.title}>{note.title}</h2>
                  <p className={styles.standfirst}>{note.standfirst}</p>
                  <span className={styles.more}>Read the note</span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
