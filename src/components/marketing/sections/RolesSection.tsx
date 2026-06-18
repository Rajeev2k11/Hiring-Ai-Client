import {
  Building2,
  ClipboardCheck,
  ShieldCheck,
  UserCog,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

interface Role {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ROLES: Role[] = [
  {
    icon: ShieldCheck,
    title: "Super Admin",
    description:
      "Platform-wide oversight — tenants, security posture, usage, and global configuration.",
  },
  {
    icon: Building2,
    title: "Company Owner",
    description:
      "Full control of the org: team, billing, integrations, and AI agent configuration.",
  },
  {
    icon: UserCog,
    title: "Hiring Manager",
    description:
      "Own your reqs, review AI-ranked shortlists, and make decisions with full context.",
  },
  {
    icon: Users,
    title: "Recruiter",
    description:
      "Run the entire pipeline with agents handling sourcing, screening, and scheduling.",
  },
  {
    icon: ClipboardCheck,
    title: "Interviewer",
    description:
      "Structured interview kits, scorecards, and calibrated feedback — zero prep required.",
  },
  {
    icon: UserRound,
    title: "Candidate",
    description:
      "A fast, transparent, respectful experience from application to offer.",
  },
];

export function RolesSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <SectionHeading
          eyebrow="Built for everyone in hiring"
          title="One platform, every role"
          description="Tailored experiences for everyone who touches a hire — from the platform admin to the candidate."
        />
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role, i) => (
            <Reveal key={role.title} index={i % 3}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-border/70 bg-card/40 p-6 transition-colors hover:bg-card/70">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-electric-soft">
                  <role.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {role.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
