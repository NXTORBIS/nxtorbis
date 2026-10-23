/**
 * Single source of truth for all site copy and structured content.
 * Every factual statement here is taken from the existing nxtorbis.com site.
 * Nothing in this file may introduce clients, statistics, awards, or product
 * functionality that the source material does not contain.
 */

export const company = {
  name: "NxtOrbis®",
  legalName: "NxtOrbis® Technologies Private Limited",
  shortName: "NxtOrbis",
  domain: "https://nxtorbis.com",
  tagline: "Building what’s next.",
  descriptor: "Software development and software product company",
  capabilities: ["Software", "AI", "Mobile", "Blockchain", "Cloud"],
  location: "Chennai, India",
  address: {
    lines: [
      "Plot No. 599, 28th Cross Street",
      "Sai Ganesh Nagar, Jalladianpet",
      "Pallikaranai, Chennai – 600100",
      "Tamil Nadu, India",
    ],
    mapsQuery:
      "Plot No. 599, 28th Cross Street, Sai Ganesh Nagar, Jalladianpet, Pallikaranai, Chennai 600100",
  },
  email: "nxtorbis@gmail.com",
  copyright: "© 2025 NxtOrbis® Technologies Private Limited.",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Orbis", href: "/orbis" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

export const cta = {
  primary: { label: "Start a Project", href: "/contact" },
  secondary: { label: "Explore Products", href: "/products" },
  about: { label: "About NxtOrbis", href: "/about" },
  services: { label: "View Services", href: "/services" },
  quote: { label: "Request a Quote", href: "/contact?intent=quote" },
  contact: { label: "Contact Us", href: "/contact" },
  conversation: { label: "Start a Conversation" },
} as const;

/* ------------------------------------------------------------------------ */
/* Services                                                                  */
/* ------------------------------------------------------------------------ */

export type Service = {
  id: string;
  index: string;
  slug: string;
  title: string;
  short: string;
  description: string;
  /** Sentence from the existing site, lightly edited for grammar only. */
  detail: string;
  glyph: "custom" | "product" | "mobile" | "ai" | "blockchain" | "cloud";
};

export const services: Service[] = [
  {
    id: "custom-software",
    index: "01",
    slug: "custom-software-development",
    title: "Custom Software Development",
    short: "Software tailored to specific business needs.",
    description:
      "We create software tailored to specific business needs — from ready-made products to fully bespoke systems that streamline operations.",
    detail:
      "From ready-made products to tailored software, we help businesses streamline operations and achieve their goals through technology, with an emphasis on scalable, secure and user-friendly applications.",
    glyph: "custom",
  },
  {
    id: "product-development",
    index: "02",
    slug: "software-product-development",
    title: "Software Product Development",
    short: "Design, build and evolve scalable software products.",
    description:
      "We design, build and develop scalable software products — the end-to-end process of shaping, engineering, deploying and maintaining software that solves a specific problem.",
    detail:
      "Software product development is the end-to-end process of designing, building, deploying and maintaining software applications that solve specific business challenges or enhance user experiences. We build products tailored to market needs and customer expectations.",
    glyph: "product",
  },
  {
    id: "mobile",
    index: "03",
    slug: "mobile-app-development",
    title: "Mobile App Development",
    short: "Modern mobile applications for business and user needs.",
    description:
      "We develop modern mobile applications for business and user needs, focused on performance, usability and scale across Android and iOS.",
    detail:
      "We create high-performance, user-friendly and scalable apps for both Android and iOS platforms, delivering seamless digital experiences that enhance user engagement and business efficiency.",
    glyph: "mobile",
  },
  {
    id: "ai",
    index: "04",
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    short: "Intelligent software experiences, built into digital solutions.",
    description:
      "We build intelligent software experiences and integrate AI into digital solutions — so products can automate processes, support decisions and improve the user experience.",
    detail:
      "We harness AI to build smarter, more efficient and data-driven software. By integrating AI into our products, we help businesses automate processes, enhance decision-making and improve user experiences.",
    glyph: "ai",
  },
  {
    id: "blockchain",
    index: "05",
    slug: "blockchain-development",
    title: "Blockchain Development",
    short: "Secure, transparent solutions — where blockchain fits.",
    description:
      "We develop secure and transparent technology solutions using blockchain where it is appropriate — for data integrity, trust and authenticity.",
    detail:
      "We integrate blockchain technology to build secure, transparent and tamper-resistant solutions, ensuring data integrity, trust and authenticity — particularly in Genuine Product Checker and True Review System.",
    glyph: "blockchain",
  },
  {
    id: "cloud",
    index: "06",
    slug: "cloud-computing",
    title: "Cloud Computing",
    short: "Scalable, flexible cloud-based software.",
    description:
      "We create scalable and flexible cloud-based software solutions that let businesses grow without rebuilding their foundations.",
    detail:
      "We specialise in cloud-based software development, enabling businesses to scale, strengthen security and improve efficiency with high-performance, cost-effective and flexible solutions.",
    glyph: "cloud",
  },
];

/* ------------------------------------------------------------------------ */
/* Products — presented at a high level only. No feature claims.            */
/* ------------------------------------------------------------------------ */

export type Product = {
  index: string;
  slug: string;
  name: string;
  positioning: "AI-powered enhancement" | "AI + Blockchain" | "Customer relationship management" | "Desktop browser with AI";
  technologies: string[];
  /** The problem it exists for, in one or two sentences. */
  intro: string;
  /** Optional context drawn from the existing site. */
  context?: string;
  /**
   * Who it is for. Only where it is actually known — the published plans say
   * this for the Advocate system, and Brixora360 says it by being closed to
   * public sign-up. The others carry none rather than a guess.
   */
  audience?: string;
  /**
   * What it does. Only from published material: the Advocate lines are the
   * features listed on the pricing page, the Orbis lines are in its release
   * notes. A product with nothing published says nothing here.
   */
  does?: string[];
  /** Where it can be seen, when there is somewhere to send people. */
  link?: { label: string; href: string; external?: boolean };
  visual: "advocate" | "birthday" | "review" | "genuine" | "brixora" | "orbis";
  hasPlans?: boolean;
};

export const products: Product[] = [
  {
    index: "01",
    slug: "advocate-office-management",
    name: "Advocate Office Management System",
    positioning: "AI-powered enhancement",
    technologies: ["Software", "AI"],
    intro:
      "A legal practice runs on things that must not be lost: the case, the client, the date, the document. This keeps them in one place, so a practice does not depend on remembering.",
    context:
      "Designed for independent lawyers, small law firms and larger legal enterprises alike.",
    audience: "Independent lawyers, small firms, and legal enterprises with teams to coordinate.",
    // Exactly the features published on the pricing page, nothing added.
    does: [
      "Case and client management in one record",
      "Calendar and appointment scheduling",
      "Secure document storage",
      "Email and SMS reminders",
      "Team collaboration with multi-user access",
      "Integration with cloud storage",
    ],
    visual: "advocate",
    hasPlans: true,
  },
  {
    index: "02",
    slug: "orbis",
    name: "Orbis",
    positioning: "Desktop browser with AI",
    technologies: ["Software", "AI"],
    intro:
      "A browser for Windows with Orion beside every page you open — ask about what you are reading, have it acted on, or research a question and get the sources back with the answer.",
    context: "Free to download, and what you do in it stays on your computer.",
    audience: "Anyone who works in a browser all day and would rather not leave it to ask a question.",
    does: [
      "Tabs, workspaces, history, downloads and per-site permissions",
      "Ad blocking built in, with lists that update in the background",
      "Orion answers about the page you are on, with its sources",
      "Chats, bookmarks and profiles kept in files on your own computer",
    ],
    link: { label: "Explore Orbis", href: "/orbis" },
    visual: "orbis",
  },
  {
    index: "03",
    slug: "brixora360",
    name: "Brixora360",
    positioning: "Customer relationship management",
    technologies: ["Software"],
    // Taken from the product itself: brixora360.com signs in to "Brixora360 CRM",
    // carries the line "Build Smarter. Grow Faster." and names NxtOrbis as its maker.
    intro:
      "Customer relationships are mostly memory: who asked for what, when, and what was promised. Brixora360 is where a business keeps that instead of carrying it.",
    context: "Accounts are provided by NxtOrbis®; there is no public sign-up.",
    audience: "Businesses we set up and support directly, rather than self-service sign-ups.",
    visual: "brixora",
  },
  {
    index: "04",
    slug: "true-review",
    name: "True Review System",
    positioning: "AI + Blockchain",
    technologies: ["Software", "AI", "Blockchain"],
    intro:
      "A review is only worth reading if it is real. Everyone knows the ones that are bought, written in bulk or quietly edited after the fact — and once a reader suspects that, every honest review on the page is worth less too.",
    context:
      "Built so that a review can be shown to be the review that was written: AI to tell written-by-a-person from written-at-scale, and blockchain so the record of what was said cannot be rewritten later.",
    audience:
      "Businesses whose reputation is worth faking, and the readers deciding whether to believe it.",
    visual: "review",
  },
  {
    index: "05",
    slug: "genuine-product-checker",
    name: "Genuine Product Checker",
    positioning: "AI + Blockchain",
    technologies: ["Software", "AI", "Blockchain"],
    intro:
      "A counterfeit survives one question badly: is this the thing it says it is? The packaging can be copied, the label can be copied, the shop can be convincing — the one thing hard to copy is a record kept somewhere the seller does not control.",
    context:
      "Built around that record: blockchain for a history of a product that no one party can edit, and AI to read what is in front of you and check it against what should be there.",
    audience:
      "Brands whose products are worth copying, and the people who would rather check than hope.",
    visual: "genuine",
  },
  {
    index: "06",
    slug: "birthday-reminder",
    name: "Birthday Reminder App",
    positioning: "AI-powered enhancement",
    technologies: ["Software", "AI"],
    intro:
      "Nobody forgets a birthday on purpose. It goes the same way every time: you remember in the week, you mean to do something about it, and then you remember again two days late.",
    context:
      "An application built around that small, entirely human failure — so the people who matter hear from you on the day, rather than in the apology afterwards.",
    audience: "Anyone who means to remember, and would like some help being the kind of person who does.",
    visual: "birthday",
  },
];

/**
 * Plans for the Advocate Office Management System exactly as published on the
 * existing nxtorbis.com pricing page. Figures are reproduced, not invented.
 */
export const advocatePlans = {
  productName: "Advocate Office Management System",
  intro:
    "The Advocate Office Management System is offered with flexible plans to suit different needs — whether you are an independent lawyer, a small law firm or a larger legal enterprise.",
  currency: "Rs.",
  period: "/mo",
  plans: [
    {
      name: "Basic",
      price: "499",
      audience: "Ideal for solo practitioners",
      includes: [
        "Case & client management",
        "Calendar & appointment scheduling",
        "Secure document storage",
        "Email & SMS reminders",
      ],
      action: "Enquire about Basic",
    },
    {
      name: "Pro",
      price: "999",
      audience: "Includes all Basic plan features",
      includes: [
        "10 users included",
        "Team collaboration & multi-user access",
        "Integration with cloud storage",
        "Priority support",
      ],
      action: "Enquire about Pro",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "1999",
      audience: "Best for large legal firms & enterprises",
      includes: [
        "Includes all Pro plan features",
        "25 users included",
        "Advanced security & compliance",
        "Dedicated account manager",
      ],
      action: "Contact us",
    },
  ],
} as const;

/**
 * The same plans, as a comparison.
 *
 * Every row and every mark below is taken from `advocatePlans` above, which
 * is the pricing page as published. Nothing is added: a row exists because a
 * plan lists it, and a plan is marked for a row because that plan names it or
 * inherits it ("includes all Basic plan features").
 */
export const advocateMatrix = {
  rows: [
    { label: "Case & client management", basic: true, pro: true, enterprise: true },
    { label: "Calendar & appointment scheduling", basic: true, pro: true, enterprise: true },
    { label: "Secure document storage", basic: true, pro: true, enterprise: true },
    { label: "Email & SMS reminders", basic: true, pro: true, enterprise: true },
    { label: "Team collaboration & multi-user access", basic: false, pro: true, enterprise: true },
    { label: "Integration with cloud storage", basic: false, pro: true, enterprise: true },
    { label: "Priority support", basic: false, pro: true, enterprise: true },
    { label: "Advanced security & compliance", basic: false, pro: false, enterprise: true },
    { label: "Dedicated account manager", basic: false, pro: false, enterprise: true },
    { label: "Users included", basic: "1", pro: "10", enterprise: "25" },
  ],
} as const;

/* ------------------------------------------------------------------------ */
/* Technology ecosystem                                                      */
/* ------------------------------------------------------------------------ */

export const technology = {
  core: "Software Engineering",
  nodes: [
    { id: "ai", label: "Artificial Intelligence", note: "Intelligence built into software" },
    { id: "cloud", label: "Cloud", note: "Scalable, flexible foundations" },
    { id: "blockchain", label: "Blockchain", note: "Integrity, trust, authenticity" },
    { id: "mobile", label: "Mobile", note: "Android and iOS applications" },
    { id: "web", label: "Web", note: "Modern web applications" },
    { id: "automation", label: "Automation", note: "Streamlined business processes" },
    { id: "digital", label: "Digital Solutions", note: "End-to-end digital products" },
  ],
} as const;

/* ------------------------------------------------------------------------ */
/* Why NxtOrbis — principles from the existing site                          */
/* ------------------------------------------------------------------------ */

export const principles = [
  {
    index: "01",
    title: "Customer-Centric Approach",
    body: "We start from your goals, your users and your constraints — not from a pre-decided solution.",
  },
  {
    index: "02",
    title: "Transparent and Collaborative Process",
    body: "You see how decisions are made and where the work stands. We build with you, not just for you.",
  },
  {
    index: "03",
    title: "Cost-Effective and Efficient",
    body: "Scope is shaped around what actually creates value, so effort goes where it matters.",
  },
  {
    index: "04",
    title: "24/7 Tech & Business Support",
    body: "Technology and business support around the clock, so the software keeps working when you need it.",
  },
] as const;

/* ------------------------------------------------------------------------ */
/* Process                                                                   */
/* ------------------------------------------------------------------------ */

export const processStages = [
  { index: "01", title: "Discover", body: "Understand the problem, goals and requirements." },
  { index: "02", title: "Define", body: "Establish the direction, scope and priorities." },
  { index: "03", title: "Design", body: "Shape the experience and the solution." },
  { index: "04", title: "Build", body: "Develop the software with precision." },
  { index: "05", title: "Test", body: "Validate quality, reliability and experience." },
  { index: "06", title: "Launch", body: "Prepare the solution for real-world use." },
  { index: "07", title: "Evolve", body: "Continue improving as requirements change." },
] as const;

/* ------------------------------------------------------------------------ */
/* About: vision, mission, culture                                           */
/* ------------------------------------------------------------------------ */

export const about = {
  intro:
    "NxtOrbis® is a forward-thinking software development and software product company dedicated to innovative digital solutions that empower businesses and individuals.",
  expertise:
    "Our expertise spans software product development, custom software solutions, AI-driven applications, cloud computing, blockchain integration and mobile app development.",
  team:
    "At our core, we are a team of experienced developers, designers and strategists who believe in using technology to drive meaningful impact — whether that means using AI for automation, strengthening security or optimising business processes.",
  productsLine:
    "Alongside client work, we develop our own software products: Orbis, the Advocate Office Management System, Brixora360, True Review System, Genuine Product Checker and the Birthday Reminder App.",
  vision:
    "To be a global leader in software product innovation, delivering cutting-edge solutions that empower businesses and individuals to achieve more through technology.",
  mission: [
    { verb: "Develop", body: "intelligent, efficient and scalable software solutions." },
    { verb: "Empower", body: "businesses by simplifying complex processes through technology." },
    { verb: "Deliver", body: "exceptional user experiences through continuous innovation." },
    { verb: "Create", body: "secure, reliable and high-quality software products." },
  ],
  culture: [
    {
      title: "Passion for Problem-Solving",
      body: "We are not just coders; we are problem-solvers who thrive on complex challenges — optimising business processes, strengthening security or building AI-powered solutions — and we approach each project with dedication and precision.",
    },
    {
      title: "Innovation-Driven Mindset",
      body: "We embrace technologies like artificial intelligence, blockchain and cloud computing to stay ahead of industry trends, and continuously explore new frameworks, tools and methodologies to improve the quality of our products.",
    },
    {
      title: "Teamwork & Collaboration",
      body: "We foster a collaborative, agile environment where developers, designers and strategists work together. Brainstorming, code reviews and pair programming keep communication open and learning continuous.",
    },
    {
      title: "Diversity & Inclusion",
      body: "We take pride in a diverse team with professionals from different backgrounds, cultures and skill sets. That diversity fuels creativity and helps us build for a global audience.",
    },
  ],
} as const;

/* ------------------------------------------------------------------------ */
/* Contact                                                                   */
/* ------------------------------------------------------------------------ */

export const contactServiceOptions = [
  "Custom Software Development",
  "Software Product Development",
  "Mobile App Development",
  "Artificial Intelligence",
  "Blockchain Development",
  "Cloud Computing",
  "Other",
] as const;

/**
 * What the contact form actually does, step by step. Every line describes
 * mechanics you can verify on the page: the form composes the message in the
 * visitor's own email program (lib/contact.ts has no endpoint set), so nothing
 * is sent until they send it, and the reply comes from the same address.
 * No response times are claimed, because none have been set.
 */
export const contactAfter = [
  {
    title: "It opens in your own email",
    body: "The form fills in a message in your email program. You can read every word of it before it goes, and nothing reaches us until you press send.",
  },
  {
    title: "It arrives with a person",
    body: `Your message lands in ${company.email}, which the people who would build the work read themselves. There is no ticket queue in between.`,
  },
  {
    title: "We come back with questions",
    body: "The first reply is usually questions rather than a quote: what the software has to do, for whom, and what success looks like. The proposal follows the answers.",
  },
] as const;

export const pricingFactors = [
  { title: "Scope", body: "What the software needs to do, and for whom." },
  { title: "Complexity", body: "The depth of logic, data and edge cases involved." },
  { title: "Requirements", body: "Security, compliance, performance and quality expectations." },
  { title: "Platform", body: "Web, Android, iOS, cloud — or several at once." },
  { title: "Integrations", body: "The systems the software must connect with." },
  { title: "Technology", body: "Whether AI, blockchain or cloud capabilities are part of the solution." },
  { title: "Support", body: "The level of ongoing support and evolution you expect after launch." },
] as const;

/* ------------------------------------------------------------------------ */
/* SEO                                                                       */
/* ------------------------------------------------------------------------ */

export const seo = {
  home: {
    title: "NxtOrbis® — Software Products & Digital Solutions",
    description:
      "NxtOrbis® Technologies is a software development and software product company in Chennai, India — building custom software, mobile apps and its own products with AI, blockchain and cloud.",
  },
  about: {
    title: "About NxtOrbis® Technologies",
    description:
      "NxtOrbis® is a software development and software product company. Learn about our vision, mission, culture and the capabilities behind the software we build.",
  },
  services: {
    title: "Software Development & AI Solutions | NxtOrbis®",
    description:
      "Custom software development, software product development, mobile apps, artificial intelligence, blockchain and cloud computing — engineered by NxtOrbis®.",
  },
  products: {
    title: "Software Products | NxtOrbis®",
    description:
      "Software products developed by NxtOrbis®: Orbis, the Advocate Office Management System, Brixora360, True Review System, Genuine Product Checker and the Birthday Reminder App.",
  },
  pricing: {
    title: "Pricing | NxtOrbis®",
    description:
      "Project pricing at NxtOrbis® starts with the problem — scope, complexity, platform and requirements. Request a quote for your software project.",
  },
  contact: {
    title: "Contact NxtOrbis®",
    description:
      "Have an idea worth building? Contact NxtOrbis® Technologies in Chennai, India to start a conversation about your software project.",
  },
} as const;
