import { NextRequest, NextResponse } from "next/server";
import { EMPLOYEES, LEAVE_REQUESTS } from "@/lib/mock/seed";
import { cached, entityTag, revalidate } from "@/lib/server/cache";
import { delay, paginate, parseQueryParams, sortItems } from "@/lib/server/query-utils";
import type { LeaveRequest } from "@/types";

const TAG = entityTag("leave");

const getLeaveList = cached(
  "leave-list",
  10,
  [TAG],
  async (companyId: string, paramsJson: string) => {
    await delay();
    const params = JSON.parse(paramsJson) as ReturnType<typeof parseQueryParams>;
    let items = LEAVE_REQUESTS.filter((l) => l.companyId === companyId).map((l) => {
      const employee = EMPLOYEES.find((e) => e.id === l.employeeId);
      return {
        ...l,
        employeeName: employee?.name ?? "Unknown",
        employeeAvatar: employee?.avatarUrl ?? "",
        employeeDepartmentId: employee?.departmentId ?? "",
      };
    });
    if (params.filters?.status) {
      items = items.filter((l) => l.status === params.filters?.status);
    }
    if (params.filters?.type) {
      items = items.filter((l) => l.type === params.filters?.type);
    }
    items = sortItems(items, params.sortBy ?? "requestedAt", params.sortDir ?? "desc");
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
  return NextResponse.json(await getLeaveList(companyId, JSON.stringify(params)));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    companyId: string;
    employeeId: string;
    type: LeaveRequest["type"];
    startDate: string;
    endDate: string;
    reason: string;
  };
  await delay(250);
  const start = new Date(body.startDate);
  const end = new Date(body.endDate);
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const leave: LeaveRequest = {
    id: `leave_${body.employeeId}_${crypto.randomUUID()}`,
    companyId: body.companyId,
    employeeId: body.employeeId,
    type: body.type,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    days,
    reason: body.reason,
    status: "pending",
    requestedAt: new Date().toISOString(),
  };
  LEAVE_REQUESTS.push(leave);
  revalidate(TAG);
  return NextResponse.json(leave, { status: 201 });
}
