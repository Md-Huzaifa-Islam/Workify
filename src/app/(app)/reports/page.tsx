"use client";

import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { getDashboardCharts, getDashboardStats } from "@/lib/mock-api/dashboard";
import { getExpenseSummary } from "@/lib/mock-api/expenses";
import { getPayrollSummary } from "@/lib/mock-api/payroll";
import { useWorkspaceStore } from "@/lib/store/workspace-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductivityChart } from "@/components/dashboard/charts/productivity-chart";
import { DepartmentPerformanceChart } from "@/components/dashboard/charts/department-performance-chart";
import { TaskCompletionChart } from "@/components/dashboard/charts/task-completion-chart";
import { ExpensesChart } from "@/components/dashboard/charts/expenses-chart";
import { PayrollTrendChart } from "@/components/dashboard/charts/payroll-trend-chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

const categoryConfig = {
  amount: { label: "Amount", color: "var(--chart-2)" },
} satisfies ChartConfig;

export default function ReportsPage() {
  const companyId = useWorkspaceStore((s) => s.companyId);

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats", companyId],
    queryFn: () => getDashboardStats(companyId),
  });
  const { data: charts } = useQuery({
    queryKey: ["dashboard-charts", companyId],
    queryFn: () => getDashboardCharts(companyId),
  });
  const { data: expenseSummary } = useQuery({
    queryKey: ["expense-summary", companyId],
    queryFn: () => getExpenseSummary(companyId),
  });
  const { data: payrollSummary } = useQuery({
    queryKey: ["payroll-summary", companyId],
    queryFn: () => getPayrollSummary(companyId),
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Reports"
        description="Cross-functional dashboards for headcount, finance, and productivity."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="size-3.5" />
            Export report
          </Button>
        }
      />

      <Tabs defaultValue="productivity">
        <TabsList>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="headcount">Headcount</TabsTrigger>
        </TabsList>

        <TabsContent value="productivity" className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Weekly productivity</CardTitle>
              </CardHeader>
              <CardContent>
                {charts ? (
                  <ProductivityChart data={charts.weeklyProductivity} />
                ) : (
                  <div className="h-64 animate-pulse rounded-lg bg-muted" />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Task completion</CardTitle>
              </CardHeader>
              <CardContent>
                {charts ? (
                  <TaskCompletionChart data={charts.taskCompletion} />
                ) : (
                  <div className="h-64 animate-pulse rounded-lg bg-muted" />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Monthly expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {charts ? (
                  <ExpensesChart data={charts.monthlyExpenses} />
                ) : (
                  <div className="h-56 animate-pulse rounded-lg bg-muted" />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payroll trend</CardTitle>
              </CardHeader>
              <CardContent>
                {charts ? (
                  <PayrollTrendChart data={charts.payrollTrend} />
                ) : (
                  <div className="h-56 animate-pulse rounded-lg bg-muted" />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expenses by category</CardTitle>
              </CardHeader>
              <CardContent>
                {expenseSummary ? (
                  <ChartContainer config={categoryConfig} className="aspect-auto h-56 w-full">
                    <BarChart data={expenseSummary.byCategory}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-56 animate-pulse rounded-lg bg-muted" />
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Monthly revenue</p>
                <p className="text-2xl font-semibold">{money(stats?.monthlyRevenue ?? 0)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Monthly expenses</p>
                <p className="text-2xl font-semibold">{money(stats?.monthlyExpenses ?? 0)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Payroll (this cycle)</p>
                <p className="text-2xl font-semibold">{money(payrollSummary?.totalNet ?? 0)}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="headcount" className="mt-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Department performance</CardTitle>
              </CardHeader>
              <CardContent>
                {charts ? (
                  <DepartmentPerformanceChart data={charts.departmentPerformance} />
                ) : (
                  <div className="h-64 animate-pulse rounded-lg bg-muted" />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="grid grid-cols-2 gap-4 p-5">
                <div>
                  <p className="text-sm text-muted-foreground">Total employees</p>
                  <p className="text-2xl font-semibold">{stats?.employeeCount ?? 0}</p>
                  <p className="text-xs text-success">+{stats?.employeeGrowthPct ?? 0}% vs last month</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Present today</p>
                  <p className="text-2xl font-semibold">{stats?.presentToday ?? 0}</p>
                  <p className="text-xs text-muted-foreground">{stats?.presentTodayPct ?? 0}% attendance rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
