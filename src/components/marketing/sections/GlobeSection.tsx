import { LazyGlobe } from "@/components/three/lazy";
import { Reveal } from "@/components/shared/Reveal";

const COUNTRIES = [
  { flag: "🇮🇳", country: "India", city: "New Delhi · Bengaluru" },
  { flag: "🇦🇪", country: "UAE", city: "Dubai" },
  { flag: "🇬🇧", country: "United Kingdom", city: "London" },
  { flag: "🇸🇬", country: "Singapore", city: "Singapore" },
  { flag: "🇺🇸", country: "United States", city: "San Francisco · New York" },
  { flag: "🇩🇪", country: "Germany", city: "Berlin" },
  { flag: "🇦🇺", country: "Australia", city: "Sydney" },
];

export function GlobeSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 py-20 lg:py-28">
      <div className="absolute inset-0 bg-aurora-radial opacity-50" />
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal className="order-2 lg:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-electric-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live worldwide
          </span>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Hiring teams on{" "}
            <span className="text-gradient-brand">five continents</span>
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Hiring OS powers recruiting around the clock. Here's where teams are
            building right now.
          </p>

          <div className="mt-7 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {COUNTRIES.map((c) => (
              <div
                key={c.country}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-3.5 py-2.5"
              >
                <span className="text-lg">{c.flag}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.country}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{c.city}</p>
                </div>
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success shadow-[0_0_8px_2px_hsl(var(--success)/0.6)]" />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="order-1 flex justify-center lg:order-2">
          <LazyGlobe />
        </Reveal>
      </div>
    </section>
  );
}
