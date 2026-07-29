import { EMPLOYEES, EXPENSE_REQUESTS } from "@/lib/mock/seed";
import { delay, paginate, searchItems, sortItems } from "@/lib/mock-api/client";
import type { ExpenseRequest, PaginatedResult, QueryParams } from "@/types";

export interface ExpenseRow extends ExpenseRequest {
  employeeName: string;
  employeeAvatar: string;
}

export async function listExpenseRequests(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<ExpenseRow>> {
  await delay();
  let items: ExpenseRow[] = EXPENSE_REQUESTS.filter((e) => e.companyId === companyId).map((e) => {
    const employee = EMPLOYEES.find((emp) => emp.id === e.employeeId);
    return { ...e, employeeName: employee?.name ?? "Unknown", employeeAvatar: employee?.avatarUrl ?? "" };
  });
  if (params.filters?.status) {
    items = items.filter((e) => e.status === params.filters?.status);
  }
  if (params.filters?.category) {
    items = items.filter((e) => e.category === params.filters?.category);
  }
  items = searchItems(items, params.search, ["employeeName", "description", "category"]);
  items = sortItems(items, params.sortBy ?? "submittedAt", params.sortDir ?? "desc");
  return paginate(items, params);
}

export interface ExpenseSummary {
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
  byCategory: { category: string; amount: number }[];
}

export async function getExpenseSummary(companyId: string): Promise<ExpenseSummary> {
  await delay(250);
  const items = EXPENSE_REQUESTS.filter((e) => e.companyId === companyId);
  const byCategoryMap = new Map<string, number>();
  for (const item of items) {
    byCategoryMap.set(item.category, (byCategoryMap.get(item.category) ?? 0) + item.amount);
  }
  return {
    totalPending: items.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0),
    totalApproved: items.filter((e) => e.status === "approved").reduce((s, e) => s + e.amount, 0),
    totalRejected: items.filter((e) => e.status === "rejected").reduce((s, e) => s + e.amount, 0),
    byCategory: Array.from(byCategoryMap.entries()).map(([category, amount]) => ({ category, amount })),
  };
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
  await delay(400);
  const expense: ExpenseRequest = {
    id: `expense_${employeeId}_${crypto.randomUUID()}`,
    companyId,
    employeeId,
    category: input.category,
    description: input.description,
    amount: input.amount,
    currency: "USD",
    status: "pending",
    submittedAt: new Date().toISOString(),
    receiptUrl: null,
  };
  EXPENSE_REQUESTS.push(expense);
  return expense;
}
