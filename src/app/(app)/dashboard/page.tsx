"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Banknote,
  CalendarCheck,
  DollarSign,
  FolderKanban,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import {
  getDashboardCharts,
  getDashboardStats,
  getActivityFeed,
  getUpcomingDeadlines,
} from "@/lib/mock-api/dashboard";
import { getCurrentUser } from "@/lib/mock-api/auth";
import { getCompany } from "@/lib/mock-api/companies";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { ProductivityChart } from "@/components/dashboard/charts/productivity-chart";
import { DepartmentPerformanceChart } from "@/components/dashboard/charts/department-performance-chart";
import { TaskCompletionChart } from "@/components/dashboard/charts/task-completion-chart";
import { ExpensesChart } from "@/components/dashboard/charts/expenses-chart";
import { PayrollTrendChart } from "@/components/dashboard/charts/payroll-trend-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function useGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);
  const greeting = useGreeting();

  const { data: user } = useQuery({
    queryKey: ["current-user", companyId],
    queryFn: () => getCurrentUser(companyId),
  });
  const { data: company } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getCompany(companyId),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats", companyId],
    queryFn: () => getDashboardStats(companyId),
  });
  const { data: charts, isLoading: chartsLoading } = useQuery({
    queryKey: ["dashboard-charts", companyId],
    queryFn: () => getDashboardCharts(companyId),
  });
  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ["dashboard-activity", companyId],
    queryFn: () => getActivityFeed(companyId),
  });
  const { data: deadlines, isLoading: deadlinesLoading } = useQuery({
    queryKey: ["dashboard-deadlines", companyId],
    queryFn: () => getUpcomingDeadlines(companyId),
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card px-5 py-6 sm:px-7 sm:py-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {greeting}
              {user ? `, ${user.name.split(" ")[0]}` : ""}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {company ? `${company.name} overview` : "Dashboard"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Here&apos;s how things are looking across your workspace today,{" "}
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.
            </p>
          </div>
          <Button className="gap-1.5" render={<Link href="/reports" />}>
            View full report
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="Employees"
          icon={Users}
          loading={statsLoading}
          value={String(stats?.employeeCount ?? 0)}
          deltaPct={stats?.employeeGrowthPct}
        />
        <StatCard
          index={1}
          label="Present today"
          icon={CalendarCheck}
          loading={statsLoading}
          value={`${stats?.presentToday ?? 0}`}
          hint={`${stats?.presentTodayPct ?? 0}% attendance rate`}
        />
        <StatCard
          index={2}
          label="Pending approvals"
          icon={Banknote}
          loading={statsLoading}
          value={String(stats?.pendingApprovals ?? 0)}
          hint="Expenses & leave requests"
        />
        <StatCard
          index={3}
          label="Active projects"
          icon={FolderKanban}
          loading={statsLoading}
          value={String(stats?.activeProjects ?? 0)}
          hint="In progress right now"
        />
        <StatCard
          index={4}
          label="Monthly revenue"
          icon={DollarSign}
          loading={statsLoading}
          value={money(stats?.monthlyRevenue ?? 0)}
          deltaPct={stats?.revenueGrowthPct}
        />
        <StatCard
          index={5}
          label="Monthly expenses"
          icon={Wallet}
          loading={statsLoading}
          value={money(stats?.monthlyExpenses ?? 0)}
          hint="Approved this month"
        />
        <StatCard
          index={6}
          label="Upcoming payroll"
          icon={Wallet}
          loading={statsLoading}
          value={money(stats?.upcomingPayroll ?? 0)}
          hint="Processing this cycle"
        />
        <div className="hidden xl:block">
          <AiInsightsCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:hidden">
        <AiInsightsCard />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Weekly productivity</CardTitle>
          </CardHeader>
          <CardContent>
            {chartsLoading || !charts ? (
              <div className="h-64 animate-pulse rounded-lg bg-muted" />
            ) : (
              <ProductivityChart data={charts.weeklyProductivity} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Task completion</CardTitle>
          </CardHeader>
          <CardContent>
            {chartsLoading || !charts ? (
              <div className="h-64 animate-pulse rounded-lg bg-muted" />
            ) : (
              <TaskCompletionChart data={charts.taskCompletion} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Department performance</CardTitle>
          </CardHeader>
          <CardContent>
            {chartsLoading || !charts ? (
              <div className="h-64 animate-pulse rounded-lg bg-muted" />
            ) : (
              <DepartmentPerformanceChart data={charts.departmentPerformance} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {chartsLoading || !charts ? (
              <div className="h-56 animate-pulse rounded-lg bg-muted" />
            ) : (
              <ExpensesChart data={charts.monthlyExpenses} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payroll trend</CardTitle>
          </CardHeader>
          <CardContent>
            {chartsLoading || !charts ? (
              <div className="h-56 animate-pulse rounded-lg bg-muted" />
            ) : (
              <PayrollTrendChart data={charts.payrollTrend} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityFeed items={activity} loading={activityLoading} />
        <UpcomingDeadlines items={deadlines} loading={deadlinesLoading} />
      </div>
    </div>
  );
}
