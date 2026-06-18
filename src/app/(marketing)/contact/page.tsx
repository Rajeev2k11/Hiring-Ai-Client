import type { Metadata } from "next";
import { Building2, Mail, MessageSquare } from "lucide-react";

import { AuroraBackground } from "@/components/shared/AuroraBackground";
import { ContactForm } from "@/components/marketing/ContactForm";
import { GlobeSection } from "@/components/marketing/sections/GlobeSection";
import { BRAND } from "@/constants/brand";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Hiring OS team — sales, support, and partnerships.",
};

const METHODS = [
  {
    icon: Mail,
    title: "Email us",
    value: BRAND.email,
    sub: "We reply within a few hours",
  },
  {
    icon: MessageSquare,
    title: "Sales",
    value: "Talk to an expert",
    sub: "Tailored to your hiring goals",
  },
  {
    icon: Building2,
    title: "Office",
    value: "San Francisco, CA",
    sub: "Remote-first, globally distributed",
  },
];

export default function ContactPage() {
  return (
    <>
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44">
      <AuroraBackground intensity="subtle" />
      <div className="relative mx-auto grid max-w-[1200px] items-start gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="lg:pt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-electric-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-electric shadow-glow" />
            Contact
          </span>
          <h1 className="mt-5 text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Let's talk hiring
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            Whether you're evaluating Hiring OS or already a customer, we're here
            to help. Reach out and we'll get back fast.
          </p>

          <div className="mt-10 space-y-3">
            {METHODS.map((m) => (
              <div
                key={m.title}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/40 p-4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-electric-soft">
                  <m.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{m.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.title} · {m.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
      <GlobeSection />
    </>
  );
}
