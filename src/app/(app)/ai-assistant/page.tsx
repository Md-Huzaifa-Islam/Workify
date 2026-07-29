"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUp, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { EntityAvatar } from "@/components/shared/entity-avatar";
import { getCurrentUser } from "@/lib/mock-api/auth";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Summarize this week's attendance trends",
  "Which projects are over budget?",
  "Draft a leave approval email",
  "What's our headcount growth this quarter?",
];

const CANNED_REPLIES: Record<string, string> = {
  default:
    "Here's a quick summary based on your workspace data: engineering has the highest active headcount, three expense requests are pending over 5 days, and two projects are trending over budget. Want me to dig into any of these?",
};

function reply(prompt: string) {
  const lower = prompt.toLowerCase();
  if (lower.includes("attendance")) {
    return "Attendance has been steady at ~92% this week, with a small dip on Friday across the Support team. Late check-ins are concentrated in the Engineering department.";
  }
  if (lower.includes("budget")) {
    return "2 projects are currently over budget: Nebula Migration (114% of budget spent) and Vertex Launch (108%). I'd recommend reviewing vendor costs on both.";
  }
  if (lower.includes("leave") || lower.includes("email")) {
    return "Draft:\n\nHi [Name],\n\nYour leave request has been approved for the requested dates. Please make sure to hand off any pending tasks before you're out. Enjoy your time off!\n\nBest,\n[Manager]";
  }
  if (lower.includes("headcount")) {
    return "Headcount is up 4.2% this quarter, driven mostly by hiring in Engineering and Customer Success.";
  }
  return CANNED_REPLIES.default;
}

export default function AiAssistantPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const { data: user } = useQuery({
    queryKey: ["current-user", companyId],
    queryFn: () => getCurrentUser(companyId),
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Workify AI Assistant. I can answer questions about your team, projects, and finances using live workspace data. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: reply(trimmed) },
      ]);
      setTyping(false);
    }, 900);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="size-4.5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">AI Assistant</h1>
          <p className="text-xs text-muted-foreground">Answers grounded in your workspace data</p>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
            >
              {m.role === "assistant" ? (
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-3.5" />
                </div>
              ) : (
                <EntityAvatar name={user?.name ?? "You"} src={user?.avatarUrl} size="sm" />
              )}
              <div
                className={cn(
                  "max-w-[80%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground",
                )}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
          {typing ? (
            <div className="flex items-center gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="size-3.5" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-muted px-3.5 py-2.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t p-3">
          {messages.length <= 1 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about your team, projects, or finances..."
              className="max-h-32 min-h-9 flex-1 resize-none"
              rows={1}
            />
            <Button size="icon" onClick={() => send(input)} disabled={!input.trim()}>
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
