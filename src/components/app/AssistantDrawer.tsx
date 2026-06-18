"use client";

import { useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Msg {
  role: "assistant" | "user";
  text: string;
}

const SUGGESTIONS = [
  "Summarize my top candidates this week",
  "Which roles are at risk of stalling?",
  "Draft an outreach message for a backend engineer",
  "What's my offer acceptance rate?",
];

const CANNED: Record<string, string> = {
  default:
    "Here's what I'm seeing across your pipeline. (This is a preview — in the live build I'll pull this from your real data and the agent layer.)",
};

export function AssistantDrawer() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi — I'm your Hiring OS assistant. Ask me about candidates, roles, or pipeline health, or pick a suggestion below.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: value },
      { role: "assistant", text: CANNED.default },
    ]);
    setInput("");
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-xl border border-electric/30 bg-electric/10 px-3 py-2 text-sm font-medium text-electric-soft transition-colors hover:bg-electric/20">
          <Sparkles className="size-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="border-b border-border/60 p-5">
          <SheetTitle className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-white">
              <Sparkles className="size-4" />
            </span>
            Hiring OS Assistant
          </SheetTitle>
          <SheetDescription>Your always-on hiring copilot</SheetDescription>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-brand-gradient text-white"
                    : "border border-border/60 bg-secondary/40 text-foreground/90"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}

          {messages.length <= 1 && (
            <div className="space-y-2 pt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="flex w-full items-center gap-2 rounded-xl border border-border/60 bg-secondary/30 px-3.5 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:border-electric/40 hover:text-foreground"
                >
                  <Sparkles className="size-3.5 shrink-0 text-electric-soft" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border/60 p-4"
        >
          <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-1.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="icon-sm" variant="brand">
              <Send className="size-4" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
