import { NextRequest, NextResponse } from "next/server";
import { EMPLOYEES, PAYROLL_RUNS } from "@/lib/mock/seed";
import { cached, entityTag } from "@/lib/server/cache";
import { delay, paginate, parseQueryParams, searchItems, sortItems } from "@/lib/server/query-utils";

const TAG = entityTag("payroll");

const getPayrollRuns = cached(
  "payroll-runs",
  60,
  [TAG],
  async (companyId: string, paramsJson: string) => {
    await delay();
    const params = JSON.parse(paramsJson) as ReturnType<typeof parseQueryParams>;
    let items = PAYROLL_RUNS.filter((p) => p.companyId === companyId).map((p) => {
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
  },
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  const params = parseQueryParams(searchParams);
  return NextResponse.json(await getPayrollRuns(companyId, JSON.stringify(params)));
}
