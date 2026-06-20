"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, MapPin } from "lucide-react";

import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { usePortalJobs } from "@/hooks/usePortal";

export default function PortalJobsPage() {
  const { data: jobs, isLoading } = usePortalJobs();

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-8">
      <PageHeader title="Browse Jobs" description="Open roles matched to your profile by AI." />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)
        ) : !jobs || jobs.length === 0 ? (
          <EmptyState icon={Briefcase} title="No open roles right now" description="Check back soon — new roles are added often." className="sm:col-span-2" />
        ) : (
          jobs.map((j) => (
            <Link
              key={j.id}
              href={`/portal/jobs/${j.id}`}
              className="group flex flex-col rounded-2xl border border-border/70 bg-card/40 p-6 transition-all hover:-translate-y-1 hover:border-electric/40 hover:bg-card/60"
            >
              <div>
                <h3 className="font-display text-lg font-semibold">{j.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" /> {j.location ?? "Remote"} · {j.department ?? "—"}
                </p>
              </div>
              <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted-foreground">{j.description}</p>
              <div className="mt-4 flex items-center justify-end">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-electric-soft">
                  View role <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
