import { NextRequest, NextResponse } from "next/server";
import { EXPENSE_REQUESTS } from "@/lib/mock/seed";
import { entityTag, revalidate } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";
import type { ApprovalStatus } from "@/types";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { status: ApprovalStatus };
  await delay(200);
  const expense = EXPENSE_REQUESTS.find((e) => e.id === id);
  if (!expense) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }
  expense.status = body.status;
  revalidate(entityTag("expenses"));
  return NextResponse.json(expense);
}
