import { NextRequest, NextResponse } from "next/server";
import { PAYROLL_RUNS } from "@/lib/mock/seed";
import { cached, entityTag } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const getSummary = cached("payroll-summary", 60, [entityTag("payroll")], async (companyId: string) => {
  await delay();
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
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getSummary(companyId));
}
