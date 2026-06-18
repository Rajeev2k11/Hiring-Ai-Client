import { TRUST_LOGOS } from "@/constants/marketing";

export function LogoCloud() {
  return (
    <section className="relative border-y border-border/50 bg-card/20 py-12">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Trusted by modern talent teams at category-defining companies
        </p>
        <div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
          {TRUST_LOGOS.map((logo) => (
            <div
              key={logo}
              className="flex items-center justify-center font-display text-lg font-bold tracking-tight text-muted-foreground/55 grayscale transition-all duration-300 hover:text-foreground/90 hover:grayscale-0"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
