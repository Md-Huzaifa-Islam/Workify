import { apiGet } from "@/lib/mock-api/http";
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
  return apiGet<PaginatedResult<PayrollRow>>("/api/payroll", companyId, params);
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
  return apiGet<PayrollSummary>("/api/payroll/summary", companyId);
}
