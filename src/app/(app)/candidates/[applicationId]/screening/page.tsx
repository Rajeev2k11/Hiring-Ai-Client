"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Bot, Lightbulb, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ScoreRing } from "@/components/shared/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCandidate } from "@/hooks/useCandidates";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  "Thanks for joining this screening! To start — can you walk me through a project you're most proud of and your specific contribution?",
  "Great. How do you approach breaking down an ambiguous problem into something shippable?",
  "Tell me about a time you disagreed with a teammate on an approach. How did you resolve it?",
  "How do you balance speed and quality when timelines are tight?",
  "Last one — what are you looking for in your next role, and why now?",
];

const OBSERVATIONS = [
  "Strong ownership over the end-to-end lifecycle and clear communication.",
  "Structured, first-principles problem decomposition.",
  "High emotional intelligence and collaborative instincts.",
  "Pragmatic about trade-offs without sacrificing craft.",
  "Motivations align well with the role and team.",
];

interface Msg {
  role: "assistant" | "candidate";
  text: string;
}

export default function ScreeningPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const { data: candidate } = useCandidate(applicationId);

  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", text: QUESTIONS[0] }]);
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(62);
  const [obs, setObs] = useState(OBSERVATIONS[0]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const done = step >= QUESTIONS.length;

  const send = () => {
    const value = input.trim();
    if (!value || done) return;
    const next = step; // index of next question
    setMessages((m) => [...m, { role: "candidate", text: value }]);
    setInput("");
    setScore((s) => Math.min(96, s + 7 + Math.round(Math.random() * 4)));
    setObs(OBSERVATIONS[Math.min(next, OBSERVATIONS.length - 1)]);

    setTimeout(() => {
      if (next < QUESTIONS.length) {
        setMessages((m) => [...m, { role: "assistant", text: QUESTIONS[next] }]);
        setStep(next + 1);
      }
      requestAnimationFrame(() =>
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
      );
    }, 500);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8">
      <Link
        href={`/candidates/${applicationId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to profile
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-electric-soft">
            <Sparkles className="size-4" /> AI Candidate Screening
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">
            {candidate?.job_title ?? "Role"} · {candidate?.name ?? "Candidate"}
          </h1>
        </div>
        <span className="text-sm font-medium text-electric-soft">
          Step {Math.min(step, QUESTIONS.length)} of {QUESTIONS.length}
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary/60">
        <div
          className="h-full rounded-full bg-brand-gradient transition-all duration-500"
          style={{ width: `${(Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Chat */}
        <div className="flex h-[560px] flex-col rounded-2xl border border-border/70 bg-card/40">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-3", m.role === "candidate" && "flex-row-reverse")}>
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                    m.role === "assistant" ? "bg-brand-gradient text-white" : "bg-secondary text-foreground"
                  )}
                >
                  {m.role === "assistant" ? <Bot className="size-4" /> : "🙂"}
                </span>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "assistant"
                      ? "border border-border/60 bg-secondary/40 text-foreground/90"
                      : "bg-brand-gradient text-white"
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {done && (
              <div className="rounded-xl border border-success/30 bg-success/10 p-4 text-sm text-emerald-300">
                Screening complete. The candidate scored <strong>{score}/100</strong>. You can
                add these observations to the interview notes.
              </div>
            )}
          </div>
          <div className="border-t border-border/60 p-4">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={done}
                placeholder={done ? "Screening complete" : "Type the candidate's response…"}
                className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />
              <Button size="icon-sm" variant="brand" onClick={send} disabled={done}>
                <Send className="size-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Press Enter to send · responses are scored live</p>
          </div>
        </div>

        {/* Live score + observation */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-electric-soft">Real-time score</p>
            <div className="mt-4 flex items-center gap-4">
              <ScoreRing score={score} size={64} strokeWidth={5} />
              <div>
                <p className="font-display text-base font-semibold">
                  {score >= 80 ? "High potential" : score >= 60 ? "Promising" : "Developing"}
                </p>
                <p className="text-xs text-muted-foreground">Matches {Math.round((score / 100) * 12)}/12 core skills</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="electric">UX Architecture</Badge>
              <Badge tone="warning">Problem Solving</Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-plasma/20 bg-plasma/5 p-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-plasma-soft">
              <Lightbulb className="size-4" /> AI Observation
            </p>
            <p className="mt-2 text-sm italic leading-relaxed text-foreground/85">"{obs}"</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => toast.success("Added to interview notes")}
            >
              Add to interview notes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
