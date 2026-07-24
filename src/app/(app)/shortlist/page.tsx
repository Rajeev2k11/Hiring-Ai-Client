"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, ExternalLink, Mail, Briefcase, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { StatusBadge } from "@/components/app/StatusBadge";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useShortlist } from "@/hooks/useMatching";
import { MATCH_STATUS_META, RECOMMENDATION_META } from "@/constants/status";
import { cn } from "@/lib/utils";
import type { ShortlistItem } from "@/types";

const TABS = [
  { label: "Saved", value: "SAVED" },
  { label: "Contacted", value: "CONTACTED" },
];

export default function ShortlistPage() {
  const [status, setStatus] = useState("SAVED");
  const { data: items, isLoading } = useShortlist(status);

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-8">
      <PageHeader
        eyebrow="Talent"
        title="Shortlist"
        description="Every candidate you've saved or contacted — across all your jobs, in one place."
        actions={
          <div className="flex gap-1.5">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setStatus(t.value)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  status === t.value
                    ? "border-electric/50 bg-electric/10 text-electric-soft"
                    : "border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : !items?.length ? (
          <EmptyState
            icon={Bookmark}
            title={status === "SAVED" ? "No saved candidates yet" : "No contacted candidates yet"}
            description="Open a job's AI Match, then Save or Contact candidates — they'll collect here across all your jobs."
          />
        ) : (
          items.map((it) => <ShortlistCard key={it.id} item={it} />)
        )}
      </div>
    </div>
  );
}

function ShortlistCard({ item }: { item: ShortlistItem }) {
  const rec = item.recommendation?.toLowerCase();
  const external = !item.candidate_id;

  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-4 transition-colors hover:border-electric/30">
      <div className="flex items-start gap-4">
        <ScoreRing score={item.score} size={48} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <UserAvatar seed={item.candidate_id ?? item.name} name={item.name} size={28} className="border border-border/60" />
            <span className="font-semibold">{item.name}</span>
            {rec && RECOMMENDATION_META[rec] && (
              <StatusBadge value={rec} meta={RECOMMENDATION_META} />
            )}
            <StatusBadge value={item.status} meta={MATCH_STATUS_META} />
            {external ? (
              <Badge tone="plasma">Discovered · {item.source}</Badge>
            ) : (
              <Badge tone="neutral">{item.source}</Badge>
            )}
          </div>

          {/* Job context — the whole point of the cross-job shortlist */}
          <Link
            href={`/jobs/${item.job_id}/matches`}
            className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Briefcase className="size-3" /> Saved for{" "}
            <span className="font-medium text-foreground/80">{item.job_title}</span>
          </Link>

          {item.summary && (
            <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{item.summary}</p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            {item.email && (
              <a
                href={`mailto:${item.email}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-electric-soft hover:underline"
              >
                <Mail className="size-3" /> {item.email}
              </a>
            )}
            {item.profile_url && (
              <a
                href={item.profile_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-electric-soft hover:underline"
              >
                <ExternalLink className="size-3" /> Profile
              </a>
            )}
          </div>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href={`/jobs/${item.job_id}/matches`}>Open</Link>
        </Button>
      </div>
    </div>
  );
}
