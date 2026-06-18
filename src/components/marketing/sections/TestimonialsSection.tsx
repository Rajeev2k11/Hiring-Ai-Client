import { SectionHeading } from "@/components/shared/SectionHeading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TESTIMONIALS } from "@/constants/marketing";
import { ACCENT } from "@/lib/accent";
import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  return (
    <section id="customers" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <SectionHeading
          eyebrow="Wall of love"
          title={
            <>
              Loved by the teams building{" "}
              <span className="text-gradient-brand">what's next</span>
            </>
          }
          description="Recruiters, hiring managers, and people leaders who replaced their stack with Hiring OS."
        />

        <div className="mt-16 columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5">
          {TESTIMONIALS.map((t) => {
            const accent = ACCENT[t.accent];
            return (
              <figure
                key={t.name}
                className="break-inside-avoid rounded-2xl border border-border/70 bg-card/40 p-6 transition-colors duration-300 hover:bg-card/70"
              >
                <blockquote className="text-[15px] leading-relaxed text-foreground/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={t.image} alt={t.name} loading="lazy" />
                    <AvatarFallback className={cn(accent.bg, accent.text)}>
                      {initials(t.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.title} · {t.company}
                    </div>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
