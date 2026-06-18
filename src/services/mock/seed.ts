/**
 * In-memory demo dataset. Cohesive, cross-referenced records that make every
 * module of the product feel alive. Mutations in mock mode operate on these
 * arrays (cloned out on read), so create/update flows behave realistically.
 */
import { daysAgo, daysFromNow } from "@/services/api-helpers";
import {
  ApplicationStatus,
  InterviewPlatform,
  InterviewStatus,
  JobStatus,
  SourcingRunStatus,
  UserRole,
} from "@/types";
import type {
  AiEvaluation,
  Application,
  Candidate,
  Interview,
  Job,
  Resume,
  SourcingMatch,
  SourcingRun,
  UserSession,
} from "@/types";

export const COMPANY = {
  id: "co_northwind",
  name: "Northwind",
  plan: "Growth",
};

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  avatar: string;
}

function avatar(seed: string) {
  return `https://api.dicebear.com/7.x/glass/svg?seed=${encodeURIComponent(seed)}`;
}

export const TEAM: TeamMember[] = [
  { id: "u_admin", name: "Alexandra Reyes", email: "alex@northwind.co", role: UserRole.ADMIN, title: "Head of Talent", avatar: avatar("Alexandra") },
  { id: "u_rec1", name: "Priya Nair", email: "priya@northwind.co", role: UserRole.RECRUITER, title: "Senior Recruiter", avatar: avatar("Priya") },
  { id: "u_rec2", name: "Diego Santos", email: "diego@northwind.co", role: UserRole.RECRUITER, title: "Technical Recruiter", avatar: avatar("Diego") },
  { id: "u_hm1", name: "Marcus Chen", email: "marcus@northwind.co", role: UserRole.HIRING_MANAGER, title: "Eng Director", avatar: avatar("Marcus") },
  { id: "u_hm2", name: "Sofia Alvarez", email: "sofia@northwind.co", role: UserRole.HIRING_MANAGER, title: "Design Lead", avatar: avatar("Sofia") },
  { id: "u_int1", name: "James Okoro", email: "james@northwind.co", role: UserRole.INTERVIEWER, title: "Staff Engineer", avatar: avatar("James") },
  { id: "u_int2", name: "Hannah Weiss", email: "hannah@northwind.co", role: UserRole.INTERVIEWER, title: "Senior PM", avatar: avatar("Hannah") },
  { id: "u_int3", name: "Tom Becker", email: "tom@northwind.co", role: UserRole.INTERVIEWER, title: "Principal Engineer", avatar: avatar("Tom") },
];

function job(
  id: string,
  title: string,
  department: string,
  location: string,
  status: string,
  createdDaysAgo: number,
  description: string
): Job {
  return {
    id,
    company_id: COMPANY.id,
    title,
    department,
    location,
    description,
    status,
    created_at: daysAgo(createdDaysAgo),
    updated_at: daysAgo(Math.max(0, createdDaysAgo - 2)),
  };
}

export const JOBS: Job[] = [
  job("job_be", "Senior Backend Engineer", "Engineering", "Remote · US", JobStatus.OPEN, 18,
    "We're looking for a Senior Backend Engineer to design and scale our core hiring platform. You'll own services in Python/FastAPI, work with PostgreSQL at scale, and shape our event-driven architecture. 5+ years building production backends, strong system-design instincts, and a bias for clean, well-tested code."),
  job("job_fe", "Staff Frontend Engineer", "Engineering", "San Francisco, CA", JobStatus.OPEN, 12,
    "Lead the frontend craft for an AI-native product. Deep React/TypeScript expertise, an eye for motion and detail, and experience architecting design systems. You'll partner with design to ship interfaces that feel like the future."),
  job("job_pm", "Senior Product Manager, AI", "Product", "New York, NY", JobStatus.OPEN, 9,
    "Own the roadmap for our agentic AI suite. You'll translate ambiguous problems into shipped product, work shoulder-to-shoulder with ML, and obsess over outcomes. 4+ years in product, ideally with applied-AI experience."),
  job("job_ds", "Machine Learning Engineer", "AI", "Remote · Global", JobStatus.OPEN, 6,
    "Build the models behind our screening and sourcing agents. Strong Python, experience with LLMs and evaluation pipelines, and a rigorous, experiment-driven mindset."),
  job("job_design", "Product Designer", "Design", "Remote · EU", JobStatus.OPEN, 21,
    "Craft delightful, accessible experiences across the platform. Systems thinker, strong visual craft, fluent in Figma and prototyping. Bonus: motion design."),
  job("job_sales", "Enterprise Account Executive", "Sales", "Austin, TX", JobStatus.OPEN, 4,
    "Drive enterprise revenue for a category-defining product. 5+ years closing six-figure SaaS deals, consultative seller, comfortable with technical buyers."),
  job("job_ops", "Revenue Operations Lead", "Operations", "Remote · US", JobStatus.DRAFT, 2,
    "Own the systems and metrics that power go-to-market. Salesforce, analytics, and a love of clean pipelines."),
  job("job_cs", "Customer Success Manager", "Customer Success", "Remote · US", JobStatus.DRAFT, 1,
    "Be the trusted partner for our growth customers. Drive adoption, retention, and expansion across a portfolio of accounts."),
  job("job_devrel", "Developer Advocate", "Marketing", "Remote · US", JobStatus.CLOSED, 60,
    "Tell the Hiring OS story to a technical audience. Content, talks, and community."),
];

interface CandidateSeed {
  candidate: Candidate;
  jobId: string;
  status: string;
  score: number | null;
  source: string;
  appliedDaysAgo: number;
}

const FIRST = ["Ethan", "Mia", "Liam", "Ava", "Noah", "Isla", "Lucas", "Zoe", "Kai", "Nina", "Omar", "Lena", "Raj", "Yuki", "Pablo", "Aria", "Sven", "Maya", "Leo", "Tara", "Idris", "Chloe", "Hugo", "Ingrid"];
const LAST = ["Patel", "Nguyen", "Garcia", "Kim", "Müller", "Rossi", "Silva", "Haddad", "Okafor", "Andersson", "Costa", "Ivanova", "Tanaka", "Mbeki", "Fischer", "Lopez", "Novak", "Cohen", "Reddy", "Olsen", "Diaz", "Schmidt", "Park", "Volkov"];

function makeCandidate(i: number): Candidate {
  const name = `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`;
  const handle = name.toLowerCase().replace(/[^a-z]/g, ".");
  return {
    id: `cand_${i}`,
    name,
    email: `${handle}@example.com`,
    phone: i % 3 === 0 ? `+1 (415) 555-0${100 + i}` : null,
    location: ["San Francisco, CA", "Remote · US", "New York, NY", "Berlin, DE", "Austin, TX", "London, UK"][i % 6],
    created_at: daysAgo(40 - i),
  };
}

const STATUS_CYCLE = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.APPLIED,
  ApplicationStatus.SCREENING,
  ApplicationStatus.SCREENING,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.HIRED,
  ApplicationStatus.REJECTED,
];
const SOURCES = ["LinkedIn", "Referral", "Indeed", "AI Sourcing", "Direct", "GitHub"];
const OPEN_JOBS = JOBS.filter((j) => j.status === JobStatus.OPEN);

const candidateSeeds: CandidateSeed[] = Array.from({ length: 24 }, (_, i) => {
  const status = STATUS_CYCLE[i % STATUS_CYCLE.length];
  const hasScore = status !== ApplicationStatus.APPLIED;
  const baseScore = 92 - (i % 7) * 6 - (status === ApplicationStatus.REJECTED ? 30 : 0);
  return {
    candidate: makeCandidate(i),
    jobId: OPEN_JOBS[i % OPEN_JOBS.length].id,
    status,
    score: hasScore ? Math.max(28, Math.min(98, baseScore)) : null,
    source: SOURCES[i % SOURCES.length],
    appliedDaysAgo: 1 + (i % 20),
  };
});

export const CANDIDATES: Candidate[] = candidateSeeds.map((s) => s.candidate);

export const APPLICATIONS: Application[] = candidateSeeds.map((s, i) => ({
  id: `app_${i}`,
  job_id: s.jobId,
  candidate_id: s.candidate.id,
  status: s.status,
  source: s.source,
  match_score: s.score,
  created_at: daysAgo(s.appliedDaysAgo),
  updated_at: daysAgo(Math.max(0, s.appliedDaysAgo - 1)),
}));

const STRENGTHS = [
  "Deep expertise directly relevant to the role's core stack",
  "Track record of shipping at scale in fast-moving teams",
  "Strong system-design and architectural reasoning",
  "Clear, evidence-led written communication",
  "Demonstrated ownership and end-to-end delivery",
];
const WEAKNESSES = [
  "Limited exposure to the specific domain",
  "Leadership experience is lighter than ideal",
  "Resume light on quantified impact",
];
const RISKS = [
  "May be over-qualified — confirm motivation and level fit",
  "Recent tenure is short — probe for context",
];
const QUESTIONS = [
  "Walk me through the hardest system you've designed and the trade-offs.",
  "Describe a time you disagreed with a decision — how did you handle it?",
  "How would you approach our event-driven architecture from day one?",
  "Tell me about a project you're most proud of and your specific contribution.",
];

function recommendationFor(score: number) {
  if (score >= 80) return "shortlist";
  if (score >= 55) return "maybe";
  return "reject";
}

export const EVALUATIONS: Record<string, AiEvaluation> = {};
APPLICATIONS.forEach((app, i) => {
  if (app.match_score === null) return;
  const score = app.match_score;
  EVALUATIONS[app.id] = {
    id: `eval_${i}`,
    application_id: app.id,
    score,
    recommendation: recommendationFor(score),
    summary:
      score >= 80
        ? "A strong, well-rounded candidate whose experience maps closely to the role. The background suggests they could ramp quickly and contribute at the expected level."
        : score >= 55
          ? "A promising candidate with relevant strengths but a few gaps worth probing in an interview before advancing."
          : "Significant gaps against the core requirements. Unlikely to be a fit at this level without substantial ramp.",
    strengths: STRENGTHS.slice(0, 3 + (i % 2)),
    weaknesses: WEAKNESSES.slice(0, 1 + (i % 2)),
    risks: RISKS.slice(0, 1 + (i % 2)),
    questions_to_ask: QUESTIONS.slice(0, 3 + (i % 2)),
    created_at: daysAgo(1),
  } as AiEvaluation;
});

export const RESUMES: Record<string, Resume> = {};
APPLICATIONS.forEach((app, i) => {
  if (i % 5 === 4) return; // a few have no resume yet
  RESUMES[app.id] = {
    id: `res_${i}`,
    application_id: app.id,
    file_url: `/mock/resumes/${app.candidate_id}.pdf`,
    raw_text: "Experienced professional with a strong background…",
    parsed_json: null,
    created_at: daysAgo(2),
  };
});

function interviewerSummary(id: string) {
  const m = TEAM.find((t) => t.id === id)!;
  return { id: m.id, name: m.name, email: m.email };
}

const interviewApps = APPLICATIONS.filter(
  (a) => a.status === ApplicationStatus.INTERVIEW || a.status === ApplicationStatus.OFFER
);

export const INTERVIEWS: Interview[] = interviewApps.slice(0, 8).map((app, i) => {
  const cand = CANDIDATES.find((c) => c.id === app.candidate_id)!;
  const jb = JOBS.find((j) => j.id === app.job_id)!;
  const future = i % 3 !== 0;
  const platforms = [InterviewPlatform.ZOOM, InterviewPlatform.GOOGLE_MEET, InterviewPlatform.ONSITE, InterviewPlatform.MICROSOFT_TEAMS];
  const platform = platforms[i % platforms.length];
  return {
    id: `int_${i}`,
    application_id: app.id,
    candidate_id: cand.id,
    candidate_name: cand.name,
    candidate_email: cand.email,
    job_id: jb.id,
    job_title: jb.title,
    stage: ["Technical Screen", "System Design", "Hiring Manager", "Final Panel", "Portfolio Review"][i % 5],
    scheduled_at: future ? daysFromNow(1 + (i % 6)) : daysAgo(2 + (i % 4)),
    duration_minutes: [45, 60, 60, 90][i % 4],
    timezone: "America/New_York",
    platform,
    location:
      platform === InterviewPlatform.ZOOM
        ? "https://zoom.us/j/000"
        : platform === InterviewPlatform.GOOGLE_MEET
          ? "https://meet.google.com/abc-defg-hij"
          : platform === InterviewPlatform.ONSITE
            ? "HQ · Room Aurora"
            : "https://teams.microsoft.com/l/meetup",
    status: future ? InterviewStatus.SCHEDULED : InterviewStatus.COMPLETED,
    notes: null,
    meeting_join_url:
      platform === InterviewPlatform.ZOOM || platform === InterviewPlatform.GOOGLE_MEET
        ? "https://meet.example.com/join"
        : null,
    meeting_host_url: null,
    meeting_external_id: null,
    interviewers: [interviewerSummary(TEAM[5 + (i % 3)].id), interviewerSummary(TEAM[3 + (i % 2)].id)],
    created_at: daysAgo(5),
    updated_at: daysAgo(1),
  };
});

export const SOURCING_RUNS: SourcingRun[] = [
  {
    id: "run_1",
    job_id: "job_be",
    threshold: 80,
    status: SourcingRunStatus.COMPLETED,
    total_candidates: 42,
    evaluated_count: 42,
    selected_count: 9,
    error: null,
    created_at: daysAgo(3),
    completed_at: daysAgo(3),
  },
  {
    id: "run_2",
    job_id: "job_ds",
    threshold: 85,
    status: SourcingRunStatus.RUNNING,
    total_candidates: 30,
    evaluated_count: 18,
    selected_count: 4,
    error: null,
    created_at: daysAgo(0),
    completed_at: null,
  },
  {
    id: "run_3",
    job_id: "job_fe",
    threshold: 78,
    status: SourcingRunStatus.COMPLETED,
    total_candidates: 36,
    evaluated_count: 36,
    selected_count: 12,
    error: null,
    created_at: daysAgo(8),
    completed_at: daysAgo(8),
  },
];

export const SOURCING_MATCHES: Record<string, SourcingMatch[]> = {
  run_1: Array.from({ length: 14 }, (_, i) => {
    const score = 95 - i * 4;
    return {
      id: `m1_${i}`,
      candidate_id: i % 2 === 0 ? `cand_${i}` : null,
      name: `${FIRST[(i + 3) % FIRST.length]} ${LAST[(i + 5) % LAST.length]}`,
      email: `talent.${i}@example.com`,
      source: i % 2 === 0 ? "internal" : "github",
      score,
      recommendation: recommendationFor(score),
      summary: "Strong signal on backend depth and distributed-systems experience.",
      profile_url: i % 2 === 0 ? null : `https://github.com/dev${i}`,
      selected: score >= 80,
      created_at: daysAgo(3),
    };
  }),
};

export const SESSIONS: UserSession[] = [
  { id: "sess_1", device_label: "MacBook Pro · Chrome", location: "San Francisco, USA", ip_address: "73.222.10.4", created_at: daysAgo(5), last_active_at: daysAgo(0), is_current: true },
  { id: "sess_2", device_label: "iPhone 15 Pro · Safari", location: "San Francisco, USA", ip_address: "73.222.10.9", created_at: daysAgo(12), last_active_at: daysAgo(1), is_current: false },
  { id: "sess_3", device_label: "Windows · Edge", location: "Austin, USA", ip_address: "24.18.55.2", created_at: daysAgo(20), last_active_at: daysAgo(6), is_current: false },
];
