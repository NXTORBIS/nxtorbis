import { company } from "@/content/site";

/**
 * Privacy policy — every statement here describes what this site and Orbis
 * actually do, checked against the code:
 *
 *  - the site is a static export on GitHub Pages (no server of ours, no database)
 *  - no analytics, advertising or cookies anywhere in the codebase
 *  - fonts come from next/font, which serves them from this site, not from Google
 *  - the contact form opens the visitor's email program (lib/contact.ts, no endpoint set)
 *  - sessionStorage holds two things: the entrance-animation flag (app/layout.tsx)
 *    and a cache of GitHub release data (lib/orbisReleases.ts)
 *  - /orbis reads releases from api.github.com and links downloads on github.com
 *
 * Nothing here promises a practice that the site does not carry out.
 */

export const privacyUpdated = "2026-09-29";

export type PolicySection = { heading: string; blocks: (string | { list: string[] })[] };

export const privacyPolicy: PolicySection[] = [
  {
    heading: "Who this is about",
    blocks: [
      `${company.legalName} builds software from ${company.location}. This policy covers this website, ${company.domain}, and the Orbis desktop app we publish.`,
      `Questions about anything here: ${company.email}.`,
    ],
  },
  {
    heading: "What this website collects",
    blocks: [
      "Nothing. This site is a set of static files. There are no accounts, no sign-ins, no analytics, no advertising and no tracking scripts, and we run no server or database of our own for it.",
      "The site sets no cookies. It stores two small items in your browser’s session storage, which your browser discards when you close the tab: a note that the opening animation has already played, and a short-lived copy of the Orbis release information so the page doesn’t request it again. Neither is sent to us.",
      "Typefaces are served from this site itself, so viewing a page makes no request to a font provider.",
    ],
  },
  {
    heading: "Who can see your visit",
    blocks: [
      "The site is hosted on GitHub Pages, so GitHub receives the ordinary information a web server needs to answer a request, such as your IP address and browser, and handles it under its own privacy statement.",
      "The Orbis page asks GitHub’s API for the current release details, and the download links point at GitHub. Loading that page or starting a download means GitHub sees the request.",
    ],
  },
  {
    heading: "The contact form",
    blocks: [
      "The form runs entirely in your browser. When you submit it, it opens your own email program with the details filled in, and nothing is sent until you send that email yourself. We do not receive a copy of anything you typed but did not send.",
      `Enquiries reach us at ${company.email}, which is a Google mail account, so Google processes that email as our mail provider. We use what you send to answer you and to discuss the work.`,
      "Ask us at any time to delete an enquiry and the messages around it, and we will.",
    ],
  },
  {
    heading: "The Orbis app",
    blocks: [
      "Orbis answers through an AI service in the cloud, so the text it needs to answer leaves your computer. It goes to Groq, which runs the models, and not to us — we never receive your chats.",
      {
        list: [
          "Chatting sends your recent messages in that conversation to Groq.",
          "Asking Orbis to act on a page sends what it needs from that page, so it can read the page and carry out what you asked.",
          "Researching a question sends the search words to a search engine, such as DuckDuckGo or Google, and reads the pages it finds.",
          "Typing in the address bar asks Google's suggestion service for suggestions as you type.",
          "Browsing loads the sites you open, exactly as any browser does.",
        ],
      },
      "Your chats, tabs, history, bookmarks, downloads, profiles and settings are kept in files on your own computer, not on a server of ours. Deleting a profile in Orbis deletes its data from your computer.",
      "The app sends us no usage data, and it has no analytics or crash reporting.",
    ],
  },
  {
    heading: "What we do not do",
    blocks: [
      {
        list: [
          "We do not sell or rent personal information.",
          "We do not profile visitors or build advertising audiences.",
          "We do not use cookies for tracking, because we use none at all.",
        ],
      },
    ],
  },
  {
    heading: "Your choices",
    blocks: [
      `Write to ${company.email} to ask what we hold about you, to correct it, or to have it deleted. Clearing your browser’s storage for this site removes the two session items described above.`,
    ],
  },
  {
    heading: "Changes",
    blocks: [
      "If what we do changes, this page changes with it, and the date at the top changes too. The previous wording stays in this site’s public history on GitHub.",
    ],
  },
];
