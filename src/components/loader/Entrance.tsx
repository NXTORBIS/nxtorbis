"use client";

import dynamic from "next/dynamic";

/**
 * The entrance, loaded after the page it opens.
 *
 * It plays once per session and never on a deep link, so there is no reason
 * for its code to sit in the first load of every page on the site. This is
 * the client boundary that lets it be fetched separately; the component
 * itself decides whether to play at all.
 */
const LoadingExperience = dynamic(
  () => import("./LoadingExperience").then((m) => m.LoadingExperience),
  { ssr: false },
);

export function Entrance() {
  return <LoadingExperience />;
}
