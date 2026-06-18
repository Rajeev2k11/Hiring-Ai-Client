/** Brand identity + site-wide navigation/footer config. */

export const BRAND = {
  name: "Hiring OS",
  // Short product descriptor used in meta + hero eyebrow.
  descriptor: "The AI Hiring Operating System",
  tagline: "The future of autonomous hiring.",
  domain: "hiringos.ai",
  email: "hello@hiringos.ai",
} as const;

export interface NavItem {
  label: string;
  href: string;
  /** Optional dropdown children for mega-menu style nav. */
  children?: { label: string; href: string; description?: string }[];
}

export const MARKETING_NAV: NavItem[] = [
  {
    label: "Product",
    href: "/solutions",
    children: [
      {
        label: "AI Command Center",
        href: "/solutions/command-center",
        description: "Orchestrate every agent from one cockpit.",
      },
      {
        label: "Autonomous Sourcing",
        href: "/solutions/sourcing",
        description: "Surface qualified talent while you sleep.",
      },
      {
        label: "AI Screening & Scoring",
        href: "/solutions/screening",
        description: "Evidence-based candidate evaluations.",
      },
      {
        label: "Hiring Analytics",
        href: "/solutions/analytics",
        description: "Funnel, source quality, and pipeline health.",
      },
    ],
  },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_NAV: { title: string; links: NavItem[] }[] = [
  {
    title: "Product",
    links: [
      { label: "AI Command Center", href: "/solutions/command-center" },
      { label: "Sourcing Agent", href: "/solutions/sourcing" },
      { label: "Screening Agent", href: "/solutions/screening" },
      { label: "Analytics", href: "/solutions/analytics" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/resources#about" },
      { label: "Customers", href: "/resources#customers" },
      { label: "Careers", href: "/resources#careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/resources#blog" },
      { label: "Changelog", href: "/resources#changelog" },
      { label: "Documentation", href: "/resources#docs" },
      { label: "Security", href: "/resources#security" },
    ],
  },
  {
    title: "Get started",
    links: [
      { label: "Company sign in", href: "/login" },
      { label: "Create company account", href: "/register" },
      { label: "Candidate sign in", href: "/candidate/login" },
      { label: "Book a demo", href: "/book-demo" },
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: "X / Twitter", href: "https://x.com", icon: "twitter" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com", icon: "github" },
] as const;
