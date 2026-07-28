"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  FolderKanban,
  ReceiptText,
  UsersRound,
  Wallet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const FEATURES = [
  {
    icon: FolderKanban,
    title: "Projects & tasks",
    description: "Kanban boards and timelines that keep every team aligned.",
  },
  {
    icon: UsersRound,
    title: "People & teams",
    description: "One source of truth for departments, teams, and profiles.",
  },
  {
    icon: Wallet,
    title: "Payroll & billing",
    description: "Run payroll and manage subscriptions without leaving the app.",
  },
  {
    icon: ReceiptText,
    title: "Approvals",
    description: "One inbox for every leave and expense request.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance",
    description: "Live check-ins and attendance trends for every employee.",
  },
  {
    icon: Bot,
    title: "AI assistant",
    description: "Ask questions about your workspace, get grounded answers.",
  },
];

const FADE_UP = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Zap className="size-4" strokeWidth={2.5} />
      </div>
      <span className="font-heading text-base font-semibold tracking-tight">Workify</span>
    </Link>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-md supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" render={<Link href="/dashboard" />}>
              Sign in
            </Button>
            <Button size="sm" className="gap-1.5" render={<Link href="/dashboard" />}>
              Get started
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden px-4 pt-20 pb-24 md:px-6 md:pt-28">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <motion.div
            initial="hidden"
            animate="show"
            variants={FADE_UP}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <Badge variant="secondary" className="mb-5 gap-1.5 font-normal">
              <Zap className="size-3 text-primary" />
              Now with an AI workspace assistant
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Run your whole company from one workspace
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              People, projects, payroll, and approvals — all in one place, so your
              team spends less time switching tools and more time doing the work.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" className="gap-1.5 px-5" render={<Link href="/dashboard" />}>
                Explore the dashboard
                <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" size="lg" className="px-5" render={<Link href="/dashboard" />}>
                View live demo
              </Button>
            </div>
          </motion.div>
        </section>

        <section className="border-t px-4 py-20 md:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={FADE_UP}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
                  className="rounded-2xl border bg-card p-6"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="size-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 font-medium">{feature.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t px-4 py-20 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={FADE_UP}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl rounded-2xl border bg-card px-6 py-12 text-center"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Ready to see it in action?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground text-pretty">
              Jump straight into the dashboard — no sign-up required for this demo.
            </p>
            <Button size="lg" className="mt-6 gap-1.5 px-5" render={<Link href="/dashboard" />}>
              Open the dashboard
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>
        </section>
      </main>

      <footer className="border-t px-4 py-8 md:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} Workify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
