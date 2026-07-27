import {
  ACTIVITY_LOG,
  ATTENDANCE_RECORDS,
  DEPARTMENTS,
  EMPLOYEES,
  EXPENSE_REQUESTS,
  INVOICES,
  LEAVE_REQUESTS,
  PAYROLL_RUNS,
  PROJECTS,
  TASKS,
} from "@/lib/mock/seed";
import { delay } from "@/lib/mock-api/client";

export interface DashboardStats {
  employeeCount: number;
  employeeGrowthPct: number;
  presentToday: number;
  presentTodayPct: number;
  pendingApprovals: number;
  activeProjects: number;
  monthlyRevenue: number;
  revenueGrowthPct: number;
  monthlyExpenses: number;
  upcomingPayroll: number;
  upcomingPayrollDate: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardCharts {
  weeklyProductivity: { day: string; completed: number; created: number }[];
  departmentPerformance: { department: string; score: number }[];
  taskCompletion: { name: string; value: number }[];
  monthlyExpenses: { month: string; amount: number }[];
  payrollTrend: { month: string; amount: number }[];
}

export interface ActivityFeedItem {
  id: string;
  actorName: string;
  actorAvatar: string;
  action: string;
  target: string;
  createdAt: string;
}

export interface UpcomingDeadline {
  id: string;
  name: string;
  dueDate: string;
  progress: number;
  priority: string;
}

export async function getDashboardStats(companyId: string): Promise<DashboardStats> {
  await delay(300);
  const employees = EMPLOYEES.filter((e) => e.companyId === companyId);
  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = ATTENDANCE_RECORDS.filter(
    (a) => a.companyId === companyId && a.date === today,
  );
  const present = todayAttendance.filter((a) => a.status === "present" || a.status === "late").length;
  const pendingExpenses = EXPENSE_REQUESTS.filter(
    (e) => e.companyId === companyId && e.status === "pending",
  ).length;
  const pendingLeave = LEAVE_REQUESTS.filter(
    (l) => l.companyId === companyId && l.status === "pending",
  ).length;
  const activeProjects = PROJECTS.filter(
    (p) => p.companyId === companyId && p.status === "active",
  ).length;
  const revenue = INVOICES.filter((i) => i.companyId === companyId && i.status === "paid").reduce(
    (sum, i) => sum + i.amount,
    0,
  );
  const expenses = EXPENSE_REQUESTS.filter(
    (e) => e.companyId === companyId && e.status === "approved",
  ).reduce((sum, e) => sum + e.amount, 0);
  const draftPayroll = PAYROLL_RUNS.filter(
    (p) => p.companyId === companyId && p.status !== "paid",
  ).reduce((sum, p) => sum + p.netPay, 0);

  return {
    employeeCount: employees.length,
    employeeGrowthPct: 4.2,
    presentToday: present,
    presentTodayPct: todayAttendance.length ? Math.round((present / todayAttendance.length) * 100) : 0,
    pendingApprovals: pendingExpenses + pendingLeave,
    activeProjects,
    monthlyRevenue: revenue,
    revenueGrowthPct: 8.6,
    monthlyExpenses: expenses,
    upcomingPayroll: draftPayroll,
    upcomingPayrollDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
  };
}

export async function getDashboardCharts(companyId: string): Promise<DashboardCharts> {
  await delay(350);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyProductivity = days.map((day, i) => ({
    day,
    completed: 12 + ((i * 7) % 18),
    created: 8 + ((i * 5) % 14),
  }));

  const depts = DEPARTMENTS.filter((d) => d.companyId === companyId);
  const departmentPerformance = depts.map((d) => ({
    department: d.name,
    score: 60 + (d.employeeCount * 7) % 38,
  }));

  const companyTasks = TASKS.filter((t) => t.companyId === companyId);
  const statusCounts = {
    todo: companyTasks.filter((t) => t.status === "todo").length,
    in_progress: companyTasks.filter((t) => t.status === "in_progress").length,
    review: companyTasks.filter((t) => t.status === "review").length,
    done: companyTasks.filter((t) => t.status === "done").length,
  };
  const taskCompletion = [
    { name: "Todo", value: statusCounts.todo },
    { name: "In Progress", value: statusCounts.in_progress },
    { name: "Review", value: statusCounts.review },
    { name: "Done", value: statusCounts.done },
  ];

  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const monthlyExpenses = months.map((month, i) => ({
    month,
    amount: 42_000 + ((i * 3700) % 21_000),
  }));
  const payrollTrend = months.map((month, i) => ({
    month,
    amount: 180_000 + ((i * 9200) % 40_000),
  }));

  return { weeklyProductivity, departmentPerformance, taskCompletion, monthlyExpenses, payrollTrend };
}

export async function getActivityFeed(companyId: string): Promise<ActivityFeedItem[]> {
  await delay(250);
  return ACTIVITY_LOG.filter((a) => a.companyId === companyId)
    .slice(0, 12)
    .map((entry) => {
      const actor = EMPLOYEES.find((e) => e.id === entry.actorId);
      return {
        id: entry.id,
        actorName: actor?.name ?? "Unknown",
        actorAvatar: actor?.avatarUrl ?? "",
        action: entry.action,
        target: entry.target,
        createdAt: entry.createdAt,
      };
    });
}

export async function getUpcomingDeadlines(companyId: string): Promise<UpcomingDeadline[]> {
  await delay(250);
  return PROJECTS.filter((p) => p.companyId === companyId && p.status === "active")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)
    .map((p) => ({ id: p.id, name: p.name, dueDate: p.dueDate, progress: p.progress, priority: p.priority }));
}
