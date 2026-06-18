import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileSearch,
  LayoutDashboard,
  Radar,
  type LucideIcon,
} from "lucide-react";

import { PageHero } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { RolesSection } from "@/components/marketing/sections/RolesSection";
import { CtaSection } from "@/components/marketing/sections/CtaSection";
import { ACCENT } from "@/lib/accent";
import type { Accent } from "@/constants/marketing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Explore the Hiring OS platform — command center, autonomous sourcing, AI screening, and analytics.",
};

interface Area {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  accent: Accent;
  image: string;
}

const AREAS: Area[] = [
  {
    icon: LayoutDashboard,
    title: "AI Command Center",
    description: "Orchestrate all nine agents and your whole org from one fast cockpit.",
    href: "/solutions/command-center",
    accent: "electric",
    image: "https://picsum.photos/seed/hiringos-cc-card/800/500",
  },
  {
    icon: Radar,
    title: "Autonomous Sourcing",
    description: "Find, rank, and shortlist qualified talent automatically — 24/7.",
    href: "/solutions/sourcing",
    accent: "plasma",
    image: "https://picsum.photos/seed/hiringos-src-card/800/500",
  },
  {
    icon: FileSearch,
    title: "AI Screening & Scoring",
    description: "Explainable 0–100 evaluations with strengths, risks, and questions.",
    href: "/solutions/screening",
    accent: "electric",
    image: "https://picsum.photos/seed/hiringos-scr-card/800/500",
  },
  {
    icon: BarChart3,
    title: "Hiring Analytics",
    description: "Funnel, source quality, and offer acceptance — from real data.",
    href: "/solutions/analytics",
    accent: "aurora",
    image: "https://picsum.photos/seed/hiringos-ana-card/800/500",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="The platform"
        title={
          <>
            One platform.{" "}
            <span className="text-gradient-brand">Four superpowers.</span>
          </>
        }
        description="From the first req to the signed offer, Hiring OS unifies your pipeline, your agents, and your team. Explore each part of the platform."
      />

      <section className="pb-8">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {AREAS.map((area, i) => {
              const a = ACCENT[area.accent];
              return (
                <Reveal key={area.title} index={i % 2}>
                  <Link
                    href={area.href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/40 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card/60"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={area.image}
                        alt={area.title}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                      <span className={cn("absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-xl border backdrop-blur", a.iconWrap)}>
                        <area.icon className="size-5" />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-xl font-semibold">{area.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {area.description}
                      </p>
                      <span className={cn("mt-4 inline-flex items-center gap-1 text-sm font-medium", a.text)}>
                        Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <RolesSection />
      <CtaSection />
    </>
  );
}
