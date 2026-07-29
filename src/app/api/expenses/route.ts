import { NextRequest, NextResponse } from "next/server";
import { EMPLOYEES, EXPENSE_REQUESTS } from "@/lib/mock/seed";
import { cached, entityTag, revalidate } from "@/lib/server/cache";
import { delay, paginate, parseQueryParams, searchItems, sortItems } from "@/lib/server/query-utils";
import type { ExpenseRequest } from "@/types";

const TAG = entityTag("expenses");

const getExpensesList = cached(
  "expenses-list",
  10,
  [TAG],
  async (companyId: string, paramsJson: string) => {
    await delay();
    const params = JSON.parse(paramsJson) as ReturnType<typeof parseQueryParams>;
    let items = EXPENSE_REQUESTS.filter((e) => e.companyId === companyId).map((e) => {
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
  },
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  const params = parseQueryParams(searchParams);
  return NextResponse.json(await getExpensesList(companyId, JSON.stringify(params)));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    companyId: string;
    employeeId: string;
    category: string;
    description: string;
    amount: number;
  };
  await delay(250);
  const expense: ExpenseRequest = {
    id: `expense_${body.employeeId}_${crypto.randomUUID()}`,
    companyId: body.companyId,
    employeeId: body.employeeId,
    category: body.category,
    description: body.description,
    amount: body.amount,
    currency: "USD",
    status: "pending",
    submittedAt: new Date().toISOString(),
    receiptUrl: null,
  };
  EXPENSE_REQUESTS.push(expense);
  revalidate(TAG);
  return NextResponse.json(expense, { status: 201 });
}
