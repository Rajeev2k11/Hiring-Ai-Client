import {
  Activity,
  BarChart3,
  BrainCircuit,
  CalendarCheck,
  ClipboardCheck,
  FileSearch,
  Gavel,
  Globe,
  Handshake,
  Layers,
  Mail,
  Radar,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type AgentStatus = "live" | "beta" | "soon";
export type Accent = "electric" | "plasma" | "aurora";

export interface AiAgent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
  status: AgentStatus;
  /** Headline capabilities shown on hover/detail. */
  capabilities: string[];
}

/**
 * The nine-agent system. `status` reflects what the FastAPI backend can
 * actually power today vs. what is on the roadmap (mock UI only):
 *  - live: real endpoint exists (sourcing, screening, planner-assist, analytics)
 *  - beta/soon: premium mock surface, no backend yet
 */
export const AI_AGENTS: AiAgent[] = [
  {
    id: "planner",
    name: "Hiring Planner",
    tagline: "From headcount to a live req in minutes",
    description:
      "Turns a hiring goal into structured job specs, scorecards, and an interview plan. Drafts compelling descriptions, requirements, and salary bands.",
    icon: BrainCircuit,
    accent: "electric",
    status: "live",
    capabilities: [
      "Job description authoring",
      "Auto-generated requirements",
      "Salary band suggestions",
    ],
  },
  {
    id: "sourcing",
    name: "Sourcing Agent",
    tagline: "Autonomous talent discovery, 24/7",
    description:
      "Continuously scans internal pools and external sources, ranks every profile against the role, and shortlists the strongest matches automatically.",
    icon: Radar,
    accent: "plasma",
    status: "live",
    capabilities: [
      "Internal pool + GitHub providers",
      "Background scoring runs",
      "Auto-shortlisting above threshold",
    ],
  },
  {
    id: "outreach",
    name: "Outreach Agent",
    tagline: "Personalized messaging that converts",
    description:
      "Crafts and sequences hyper-personalized outreach across email and social, then learns which messaging lands to keep response rates climbing.",
    icon: Mail,
    accent: "aurora",
    status: "beta",
    capabilities: [
      "Multi-touch sequences",
      "Tone + persona matching",
      "Reply detection & handoff",
    ],
  },
  {
    id: "screening",
    name: "Screening Agent",
    tagline: "Evidence-based evaluations in seconds",
    description:
      "Reads every resume against the job, returns a 0–100 match score with a recommendation, strengths, risks, and tailored interview questions.",
    icon: FileSearch,
    accent: "electric",
    status: "live",
    capabilities: [
      "0–100 match scoring",
      "Strengths · weaknesses · risks",
      "Suggested interview questions",
    ],
  },
  {
    id: "interview",
    name: "Interview Agent",
    tagline: "Coordinate panels without the back-and-forth",
    description:
      "Finds optimal slots across the panel, auto-creates Zoom/Meet links, sends confirmations, and prepares structured interview kits.",
    icon: CalendarCheck,
    accent: "plasma",
    status: "beta",
    capabilities: [
      "Panel availability matching",
      "Auto meeting links",
      "Confirmation + reschedule notices",
    ],
  },
  {
    id: "assessment",
    name: "Assessment Agent",
    tagline: "Calibrated skills, not gut feel",
    description:
      "Generates role-specific assessments, grades submissions against a rubric, and normalizes scores so every candidate is compared fairly.",
    icon: ClipboardCheck,
    accent: "aurora",
    status: "soon",
    capabilities: [
      "Role-specific task generation",
      "Rubric-based grading",
      "Bias-aware normalization",
    ],
  },
  {
    id: "offer",
    name: "Offer Agent",
    tagline: "Close faster with smart offers",
    description:
      "Models acceptance probability, recommends competitive packages, drafts the offer, and tracks every approval through to signature.",
    icon: Handshake,
    accent: "electric",
    status: "soon",
    capabilities: [
      "Acceptance modeling",
      "Package recommendations",
      "Approval workflows",
    ],
  },
  {
    id: "compliance",
    name: "Compliance Agent",
    tagline: "Audit-ready hiring, by default",
    description:
      "Monitors every decision for EEOC/GDPR alignment, flags risk, and keeps a complete, exportable audit trail across the pipeline.",
    icon: Gavel,
    accent: "plasma",
    status: "soon",
    capabilities: ["EEOC / GDPR checks", "Bias monitoring", "Exportable audit log"],
  },
  {
    id: "analytics",
    name: "Analytics Agent",
    tagline: "The metrics that move hiring",
    description:
      "Surfaces funnel conversion, source quality, and offer acceptance in real time — and tells you exactly where the pipeline is leaking.",
    icon: BarChart3,
    accent: "aurora",
    status: "live",
    capabilities: [
      "Funnel conversion",
      "Source quality scoring",
      "Offer acceptance tracking",
    ],
  },
];

export interface Stat {
  value: string;
  label: string;
  sub?: string;
}

export const HERO_STATS: Stat[] = [
  { value: "70%", label: "faster time-to-hire", sub: "vs. legacy ATS" },
  { value: "5×", label: "more qualified pipeline", sub: "per recruiter" },
  { value: "92%", label: "screening accuracy", sub: "vs. human baseline" },
  { value: "60+", label: "hours saved / month", sub: "per team" },
];

export interface FeaturePillar {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
}

export const FEATURE_PILLARS: FeaturePillar[] = [
  {
    title: "Modular agentic system",
    description:
      "Compose a hiring workflow from specialized agents. Turn them on as you grow — each one plugs into the same shared talent graph.",
    icon: Layers,
    accent: "electric",
  },
  {
    title: "One autonomous operator",
    description:
      "Meet your AI hiring operator. Delegate a goal — 'hire 3 backend engineers' — and watch it source, screen, and schedule end to end.",
    icon: Sparkles,
    accent: "plasma",
  },
  {
    title: "Evidence over instinct",
    description:
      "Every recommendation is backed by a transparent rationale and a score you can audit — no black boxes, no fabricated metrics.",
    icon: Activity,
    accent: "aurora",
  },
  {
    title: "Workflows that adapt",
    description:
      "Pipelines reconfigure to the role and req. The system routes work to the right agent and the right human at the right moment.",
    icon: Workflow,
    accent: "electric",
  },
];

export interface IntegrationGroup {
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
}

export const INTEGRATION_GROUPS: IntegrationGroup[] = [
  {
    title: "Job boards & sourcing",
    description: "Post once, syndicate everywhere, and pull candidates back in.",
    icon: Globe,
    items: ["LinkedIn", "Indeed", "GitHub", "Greenhouse", "Lever"],
  },
  {
    title: "Calendar & video",
    description: "Auto-scheduling with native meeting links for every panel.",
    icon: CalendarCheck,
    items: ["Google Meet", "Zoom", "Microsoft Teams", "Google Calendar"],
  },
  {
    title: "Comms & workflow",
    description: "Keep recruiters and hiring managers in their tools of choice.",
    icon: Workflow,
    items: ["Slack", "Gmail", "Outlook", "Notion", "Zapier"],
  },
];

export const TRUST_LOGOS: string[] = [
  "Northwind",
  "Vanta Labs",
  "Helix",
  "Quantel",
  "Aurora AI",
  "Monolith",
  "Cobalt",
  "Lumen",
];

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  accent: Accent;
  image: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Hiring OS replaced four tools and a spreadsheet. Our recruiters now spend their time with people, not pipelines. Time-to-hire dropped from 41 days to 12.",
    name: "Priya Nair",
    title: "VP of Talent",
    company: "Northwind",
    accent: "electric",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote:
      "The screening agent's scoring is uncannily good. It surfaces candidates our team would have missed and tells us exactly why they're worth a conversation.",
    name: "Marcus Chen",
    title: "Head of Engineering",
    company: "Helix",
    accent: "plasma",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "It feels less like software and more like a teammate that never sleeps. The sourcing agent had a shortlist ready before I'd finished my coffee.",
    name: "Sofia Alvarez",
    title: "Director of Recruiting",
    company: "Quantel",
    accent: "aurora",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "We finally have one source of truth for hiring. The analytics alone justified the switch — we can see where the funnel leaks in real time.",
    name: "James Okoro",
    title: "Chief People Officer",
    company: "Monolith",
    accent: "electric",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    quote:
      "Onboarding took an afternoon. Within a week the team was running every req through Hiring OS. The interface is genuinely a joy to use.",
    name: "Hannah Weiss",
    title: "Talent Operations Lead",
    company: "Cobalt",
    accent: "plasma",
    image: "https://randomuser.me/api/portraits/women/90.jpg",
  },
  {
    quote:
      "The candidate experience is night and day. Faster responses, structured interviews, zero ghosting. Our offer-acceptance rate is up 23%.",
    name: "Diego Santos",
    title: "Recruiting Manager",
    company: "Lumen",
    accent: "aurora",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
  },
];

export interface ComplianceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    title: "SOC 2 Type II",
    description: "Independently audited security controls across the platform.",
    icon: ShieldCheck,
  },
  {
    title: "GDPR & CCPA",
    description: "Privacy by design with data residency and right-to-erasure.",
    icon: Globe,
  },
  {
    title: "EEOC-aware AI",
    description: "Bias monitoring and transparent rationale on every decision.",
    icon: Gavel,
  },
  {
    title: "Enterprise SSO",
    description: "SAML, SCIM provisioning, and granular role-based access.",
    icon: ShieldCheck,
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "Is Hiring OS a replacement for our ATS?",
    answer:
      "Yes. Hiring OS is a full operating system for hiring — jobs, pipeline, candidates, interviews, and analytics — with an agentic AI layer on top. You can also run it alongside an existing ATS during migration.",
  },
  {
    question: "How does the AI scoring actually work?",
    answer:
      "Our Screening Agent evaluates each resume against the specific job description and returns a transparent 0–100 match score with a recommendation, strengths, weaknesses, risks, and suggested interview questions — every score is explainable and auditable.",
  },
  {
    question: "Will AI make hiring decisions for us?",
    answer:
      "No. Agents do the heavy lifting — sourcing, screening, scheduling, analysis — and surface evidence. Humans stay in control of every decision, with a complete audit trail for compliance.",
  },
  {
    question: "How long does it take to get started?",
    answer:
      "Most teams are live the same day. Create your company, configure your agents, invite your team, and post your first role in under an hour.",
  },
  {
    question: "Which integrations are supported?",
    answer:
      "Calendar and video (Google Meet, Zoom, Teams), sourcing (LinkedIn, Indeed, GitHub), and comms (Slack, Gmail, Outlook), with an open API for everything else.",
  },
  {
    question: "Is my candidate data secure?",
    answer:
      "Hiring OS is built for enterprise: SOC 2 Type II, GDPR/CCPA compliance, SSO/SCIM, encryption in transit and at rest, and configurable data residency.",
  },
];

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: "01",
    title: "Define the role",
    description:
      "Describe the hire in plain language. The Planner drafts the spec, requirements, scorecard, and salary band.",
    icon: BrainCircuit,
    accent: "electric",
  },
  {
    step: "02",
    title: "Agents go to work",
    description:
      "Sourcing finds talent, Screening scores every applicant, and your shortlist builds itself — ranked by evidence.",
    icon: Radar,
    accent: "plasma",
  },
  {
    step: "03",
    title: "Interview & decide",
    description:
      "Auto-scheduled panels, structured kits, and side-by-side evaluations. You make the call with full context.",
    icon: CalendarCheck,
    accent: "aurora",
  },
  {
    step: "04",
    title: "Measure & improve",
    description:
      "Real-time funnel, source quality, and offer acceptance show exactly what's working — and what to fix next.",
    icon: BarChart3,
    accent: "electric",
  },
];
