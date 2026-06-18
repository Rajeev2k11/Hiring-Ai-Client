export interface PricingTier {
  id: string;
  name: string;
  priceMonthly: number | null; // null = custom / contact sales
  priceYearly: number | null;
  blurb: string;
  highlight?: boolean;
  cta: string;
  ctaHref: string;
  features: string[];
  seats: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 99,
    priceYearly: 79,
    blurb: "For small teams making their first autonomous hires.",
    cta: "Start free trial",
    ctaHref: "/register",
    seats: "Up to 3 seats",
    features: [
      "Up to 5 open roles",
      "Screening Agent (AI scoring)",
      "Sourcing — internal pool",
      "Pipeline & candidate management",
      "Interview scheduling",
      "Email support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    priceMonthly: 349,
    priceYearly: 279,
    blurb: "For scaling teams running multiple agents in parallel.",
    highlight: true,
    cta: "Start free trial",
    ctaHref: "/register",
    seats: "Up to 15 seats",
    features: [
      "Unlimited open roles",
      "All Starter features",
      "Sourcing — external providers (GitHub, boards)",
      "Outreach & Interview agents",
      "Hiring analytics suite",
      "Slack & calendar integrations",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: null,
    priceYearly: null,
    blurb: "For organizations that need scale, control, and compliance.",
    cta: "Book a demo",
    ctaHref: "/book-demo",
    seats: "Unlimited seats",
    features: [
      "Everything in Growth",
      "All nine AI agents",
      "Compliance Agent & audit log",
      "SSO / SAML / SCIM",
      "Custom data residency",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
  },
];
