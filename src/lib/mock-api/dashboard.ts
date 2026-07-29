import { apiGet } from "@/lib/mock-api/http";

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
  return apiGet<DashboardStats>("/api/dashboard/stats", companyId);
}

export async function getDashboardCharts(companyId: string): Promise<DashboardCharts> {
  return apiGet<DashboardCharts>("/api/dashboard/charts", companyId);
}

export async function getActivityFeed(companyId: string): Promise<ActivityFeedItem[]> {
  return apiGet<ActivityFeedItem[]>("/api/dashboard/activity", companyId);
}

export async function getUpcomingDeadlines(companyId: string): Promise<UpcomingDeadline[]> {
  return apiGet<UpcomingDeadline[]>("/api/dashboard/deadlines", companyId);
}
