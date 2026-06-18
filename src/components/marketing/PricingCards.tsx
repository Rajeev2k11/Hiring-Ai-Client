"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Reveal } from "@/components/shared/Reveal";
import { PRICING_TIERS } from "@/constants/pricing";
import { cn } from "@/lib/utils";

export function PricingCards() {
  const [yearly, setYearly] = useState(true);

  return (
    <div>
      <div className="flex items-center justify-center gap-3">
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            !yearly ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Monthly
        </span>
        <Switch checked={yearly} onCheckedChange={setYearly} aria-label="Toggle billing" />
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            yearly ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Yearly
        </span>
        <span className="rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs font-medium text-emerald-300">
          Save 20%
        </span>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3">
        {PRICING_TIERS.map((tier, i) => {
          const price = yearly ? tier.priceYearly : tier.priceMonthly;
          return (
            <Reveal key={tier.id} index={i}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-300",
                  tier.highlight
                    ? "border-electric/40 bg-card/70 shadow-glow"
                    : "border-border/70 bg-card/40 hover:border-border hover:bg-card/60"
                )}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white shadow-glow">
                    <Sparkles className="size-3" /> Most popular
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-1.5 min-h-[40px] text-sm text-muted-foreground">
                  {tier.blurb}
                </p>

                <div className="mt-5 flex items-end gap-1">
                  {price === null ? (
                    <span className="font-display text-4xl font-bold">Custom</span>
                  ) : (
                    <>
                      <span className="font-display text-4xl font-bold">${price}</span>
                      <span className="mb-1.5 text-sm text-muted-foreground">
                        /mo{yearly ? " · billed yearly" : ""}
                      </span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{tier.seats}</p>

                <Button
                  asChild
                  variant={tier.highlight ? "brand" : "outline"}
                  className="mt-6 w-full"
                >
                  <Link href={tier.ctaHref}>{tier.cta}</Link>
                </Button>

                <ul className="mt-7 space-y-3 border-t border-border/50 pt-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-electric-soft" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
