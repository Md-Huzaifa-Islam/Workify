import { apiGet, apiPatch, apiPost } from "@/lib/mock-api/http";
import type { ApprovalStatus, ExpenseRequest, PaginatedResult, QueryParams } from "@/types";

export interface ExpenseRow extends ExpenseRequest {
  employeeName: string;
  employeeAvatar: string;
}

export async function listExpenseRequests(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<ExpenseRow>> {
  return apiGet<PaginatedResult<ExpenseRow>>("/api/expenses", companyId, params);
}

export interface ExpenseSummary {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  byCategory: { category: string; amount: number }[];
}

export async function getExpenseSummary(companyId: string): Promise<ExpenseSummary> {
  return apiGet<ExpenseSummary>("/api/expenses/summary", companyId);
}

export interface CreateExpenseInput {
  category: string;
  description: string;
  amount: number;
}

export async function createExpenseRequest(
  companyId: string,
  employeeId: string,
  input: CreateExpenseInput,
): Promise<ExpenseRequest> {
  return apiPost<ExpenseRequest>("/api/expenses", { companyId, employeeId, ...input });
}

export async function updateExpenseStatus(id: string, status: ApprovalStatus): Promise<ExpenseRequest> {
  return apiPatch<ExpenseRequest>(`/api/expenses/${id}`, { status });
}
