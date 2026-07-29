import { NextRequest, NextResponse } from "next/server";
import {
  ATTENDANCE_RECORDS,
  EMPLOYEES,
  EXPENSE_REQUESTS,
  INVOICES,
  LEAVE_REQUESTS,
  PAYROLL_RUNS,
  PROJECTS,
} from "@/lib/mock/seed";
import { cached } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const getStats = cached("dashboard-stats", 20, ["entity:dashboard"], async (companyId: string) => {
  await delay(150);
  const employees = EMPLOYEES.filter((e) => e.companyId === companyId);
  const today = new Date().toISOString().slice(0, 10);
  const todayAttendance = ATTENDANCE_RECORDS.filter((a) => a.companyId === companyId && a.date === today);
  const present = todayAttendance.filter((a) => a.status === "present" || a.status === "late").length;
  const pendingExpenses = EXPENSE_REQUESTS.filter(
    (e) => e.companyId === companyId && e.status === "pending",
  ).length;
  const pendingLeave = LEAVE_REQUESTS.filter(
    (l) => l.companyId === companyId && l.status === "pending",
  ).length;
  const activeProjects = PROJECTS.filter((p) => p.companyId === companyId && p.status === "active").length;
  const revenue = INVOICES.filter((i) => i.companyId === companyId && i.status === "paid").reduce(
    (sum, i) => sum + i.amount,
    0,
  );
  const expenses = EXPENSE_REQUESTS.filter((e) => e.companyId === companyId && e.status === "approved").reduce(
    (sum, e) => sum + e.amount,
    0,
  );
  const draftPayroll = PAYROLL_RUNS.filter((p) => p.companyId === companyId && p.status !== "paid").reduce(
    (sum, p) => sum + p.netPay,
    0,
  );

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
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getStats(companyId));
}
