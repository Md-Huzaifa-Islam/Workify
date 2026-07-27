"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, TriangleAlert, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const INSIGHTS = [
  {
    icon: TrendingUp,
    text: "Project velocity is up 12% this week, led by the Engineering department.",
  },
  {
    icon: TriangleAlert,
    text: "3 expense requests have been pending approval for over 5 days.",
  },
  {
    icon: Users,
    text: "Attendance dipped on Friday — consider checking in with the Support team.",
  },
];

export function AiInsightsCard() {
  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/10 blur-3xl" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {INSIGHTS.map((insight, i) => (
          <motion.div
            key={insight.text}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="flex items-start gap-2.5 rounded-lg border bg-background/60 p-3"
          >
            <insight.icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm leading-snug text-foreground/90">{insight.text}</p>
          </motion.div>
        ))}
        <Button variant="ghost" size="sm" className="w-full justify-between text-primary hover:text-primary">
          Ask the AI Assistant
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
