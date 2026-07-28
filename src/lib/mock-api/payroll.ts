import { EMPLOYEES, PAYROLL_RUNS } from "@/lib/mock/seed";
import { delay, paginate, searchItems, sortItems } from "@/lib/mock-api/client";
import type { PaginatedResult, PayrollRun, QueryParams } from "@/types";

export interface PayrollRow extends PayrollRun {
  employeeName: string;
  employeeAvatar: string;
  employeeRole: string;
}

export async function listPayrollRuns(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<PayrollRow>> {
  await delay();
  let items: PayrollRow[] = PAYROLL_RUNS.filter((p) => p.companyId === companyId).map((p) => {
    const employee = EMPLOYEES.find((e) => e.id === p.employeeId);
    return {
      ...p,
      employeeName: employee?.name ?? "Unknown",
      employeeAvatar: employee?.avatarUrl ?? "",
      employeeRole: employee?.role ?? "",
    };
  });
  if (params.filters?.period) {
    items = items.filter((p) => p.period === params.filters?.period);
  }
  if (params.filters?.status) {
    items = items.filter((p) => p.status === params.filters?.status);
  }
  items = searchItems(items, params.search, ["employeeName"]);
  items = sortItems(items, params.sortBy, params.sortDir);
  return paginate(items, params);
}

export interface PayrollSummary {
  periods: string[];
  currentPeriod: string;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  statusCounts: Record<string, number>;
}

export async function getPayrollSummary(companyId: string): Promise<PayrollSummary> {
  await delay(250);
  const runs = PAYROLL_RUNS.filter((p) => p.companyId === companyId);
  const periods = Array.from(new Set(runs.map((r) => r.period)));
  const currentPeriod = periods[0] ?? "";
  const currentRuns = runs.filter((r) => r.period === currentPeriod);
  return {
    periods,
    currentPeriod,
    totalGross: currentRuns.reduce((sum, r) => sum + r.grossPay, 0),
    totalNet: currentRuns.reduce((sum, r) => sum + r.netPay, 0),
    totalDeductions: currentRuns.reduce((sum, r) => sum + r.deductions, 0),
    employeeCount: currentRuns.length,
    statusCounts: currentRuns.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {}),
  };
}
