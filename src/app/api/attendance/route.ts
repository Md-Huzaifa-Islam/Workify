import { NextRequest, NextResponse } from "next/server";
import { ATTENDANCE_RECORDS, EMPLOYEES } from "@/lib/mock/seed";
import { cached, entityTag } from "@/lib/server/cache";
import { delay, paginate, parseQueryParams, searchItems } from "@/lib/server/query-utils";

const TAG = entityTag("attendance");

const getTodayAttendance = cached(
  "attendance-today",
  30,
  [TAG],
  async (companyId: string, paramsJson: string) => {
    await delay();
    const params = JSON.parse(paramsJson) as ReturnType<typeof parseQueryParams>;
    const today = new Date().toISOString().slice(0, 10);
    let items = ATTENDANCE_RECORDS.filter((a) => a.companyId === companyId && a.date === today).map((a) => {
      const employee = EMPLOYEES.find((e) => e.id === a.employeeId);
      return {
        ...a,
        employeeName: employee?.name ?? "Unknown",
        employeeAvatar: employee?.avatarUrl ?? "",
        employeeRole: employee?.role ?? "",
      };
    });
    if (params.filters?.status) {
      items = items.filter((a) => a.status === params.filters?.status);
    }
    items = searchItems(items, params.search, ["employeeName"]);
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
  return NextResponse.json(await getTodayAttendance(companyId, JSON.stringify(params)));
}
