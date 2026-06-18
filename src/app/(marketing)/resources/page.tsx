import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  GitBranch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Badge } from "@/components/ui/badge";
import { CtaSection } from "@/components/marketing/sections/CtaSection";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Guides, product updates, and engineering notes from the team building the future of hiring.",
};

const POSTS = [
  {
    category: "Playbook",
    title: "How autonomous sourcing actually works",
    excerpt:
      "A look under the hood at how the Sourcing Agent finds, ranks, and shortlists talent across providers.",
    date: "Jun 2026",
    read: "8 min",
    accent: "electric",
  },
  {
    category: "Research",
    title: "The science of evidence-based screening",
    excerpt:
      "Why explainable match scores beat gut-feel — and how we keep AI evaluation fair and auditable.",
    date: "May 2026",
    read: "11 min",
    accent: "plasma",
  },
  {
    category: "Guide",
    title: "Migrating from a legacy ATS in a weekend",
    excerpt:
      "A step-by-step migration plan to move your pipeline, jobs, and history into Hiring OS.",
    date: "May 2026",
    read: "6 min",
    accent: "aurora",
  },
];

const CHANGELOG = [
  { version: "v2.4", title: "Compliance Agent (beta)", note: "Bias monitoring and an exportable audit trail across every decision.", date: "Jun 12" },
  { version: "v2.3", title: "Interview Agent panel matching", note: "Optimal-slot scheduling across the full panel with auto meeting links.", date: "May 28" },
  { version: "v2.2", title: "Source quality analytics", note: "See which sources convert and their average AI match score.", date: "May 9" },
];

const accentText: Record<string, string> = {
  electric: "text-electric-soft",
  plasma: "text-plasma-soft",
  aurora: "text-cyan-300",
};

const HUB = [
  { icon: BookOpen, title: "Documentation", desc: "Guides and API reference.", id: "docs" },
  { icon: ShieldCheck, title: "Security", desc: "SOC 2, GDPR, and our trust center.", id: "security" },
  { icon: Sparkles, title: "About us", desc: "The team and mission behind Hiring OS.", id: "about" },
  { icon: FileText, title: "Careers", desc: "Help build the future of hiring.", id: "careers" },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={
          <>
            Ideas for the teams{" "}
            <span className="text-gradient-brand">redefining hiring</span>
          </>
        }
        description="Playbooks, research, and product updates from the team building autonomous recruiting."
      />

      {/* Blog */}
      <section id="blog" className="py-12">
        <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-3">
            {POSTS.map((post, i) => (
              <Reveal key={post.title} index={i}>
                <article className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card/70">
                  <div className="flex items-center justify-between">
                    <Badge tone="outline">{post.category}</Badge>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </div>
                  <h3 className={`mt-4 font-display text-lg font-semibold leading-snug text-foreground`}>
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center gap-2 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                    <span className={accentText[post.accent]}>●</span>
                    {post.date} · {post.read} read
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Changelog */}
      <section id="changelog" className="py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow="Changelog"
            title="Shipping every week"
            description="A steady cadence of new agents, integrations, and refinements."
          />
          <div className="mt-12 space-y-4">
            {CHANGELOG.map((entry, i) => (
              <Reveal key={entry.version} index={i}>
                <div className="flex gap-5 rounded-2xl border border-border/70 bg-card/40 p-5">
                  <div className="flex w-14 shrink-0 flex-col items-center">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-electric-soft">
                      <GitBranch className="size-4" />
                    </span>
                    <span className="mt-2 font-mono text-[11px] text-muted-foreground">
                      {entry.date}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-base font-semibold">
                        {entry.title}
                      </h3>
                      <Badge tone="electric">{entry.version}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{entry.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hub */}
      <section className="py-12">
        <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HUB.map((item, i) => (
              <Reveal key={item.title} index={i}>
                <Link
                  href={`#${item.id}`}
                  id={item.id}
                  className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card/40 p-6 transition-all duration-300 hover:border-border hover:bg-card/70 scroll-mt-28"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-electric-soft">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
