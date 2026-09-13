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
  { label: "AI", href: "/ai" },
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
  positioning: "AI-powered enhancement" | "AI + Blockchain";
  technologies: string[];
  /** One high-level sentence. Must not describe functionality. */
  intro: string;
  /** Optional context drawn from the existing site. */
  context?: string;
  visual: "advocate" | "birthday" | "review" | "genuine";
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
      "A software product built for legal practice management, developed by NxtOrbis® with AI-powered enhancement.",
    context:
      "Designed for independent lawyers, small law firms and larger legal enterprises alike.",
    visual: "advocate",
    hasPlans: true,
  },
  {
    index: "02",
    slug: "birthday-reminder",
    name: "Birthday Reminder App",
    positioning: "AI-powered enhancement",
    technologies: ["Software", "AI"],
    intro:
      "An application built around a simple, human need — remembering the people who matter — developed with AI-powered enhancement.",
    visual: "birthday",
  },
  {
    index: "03",
    slug: "true-review",
    name: "True Review System",
    positioning: "AI + Blockchain",
    technologies: ["Software", "AI", "Blockchain"],
    intro:
      "A review system developed to bring trust and authenticity to reviews, combining AI with blockchain.",
    visual: "review",
  },
  {
    index: "04",
    slug: "genuine-product-checker",
    name: "Genuine Product Checker",
    positioning: "AI + Blockchain",
    technologies: ["Software", "AI", "Blockchain"],
    intro:
      "A product developed to support the authenticity of products, combining AI with blockchain for data integrity and trust.",
    visual: "genuine",
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
    "Alongside client work, we develop our own software products: Advocate Office Management System, Birthday Reminder App, True Review System and Genuine Product Checker.",
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
      "Software products developed by NxtOrbis®: Advocate Office Management System, Birthday Reminder App, True Review System and Genuine Product Checker.",
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
