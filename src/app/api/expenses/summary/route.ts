import { NextRequest, NextResponse } from "next/server";
import { EXPENSE_REQUESTS } from "@/lib/mock/seed";
import { cached, entityTag } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const getSummary = cached("expense-summary", 10, [entityTag("expenses")], async (companyId: string) => {
  await delay();
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
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getSummary(companyId));
}
