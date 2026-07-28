import { EMPLOYEES, LEAVE_REQUESTS } from "@/lib/mock/seed";
import { delay, paginate, sortItems } from "@/lib/mock-api/client";
import type { LeaveRequest, PaginatedResult, QueryParams } from "@/types";

export interface LeaveRequestWithEmployee extends LeaveRequest {
  employeeName: string;
  employeeAvatar: string;
  employeeDepartmentId: string;
}

function withEmployee(request: LeaveRequest): LeaveRequestWithEmployee {
  const employee = EMPLOYEES.find((e) => e.id === request.employeeId);
  return {
    ...request,
    employeeName: employee?.name ?? "Unknown",
    employeeAvatar: employee?.avatarUrl ?? "",
    employeeDepartmentId: employee?.departmentId ?? "",
  };
}

export async function listLeaveRequests(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<LeaveRequestWithEmployee>> {
  await delay();
  let items = LEAVE_REQUESTS.filter((l) => l.companyId === companyId).map(withEmployee);
  if (params.filters?.status) {
    items = items.filter((l) => l.status === params.filters?.status);
  }
  if (params.filters?.type) {
    items = items.filter((l) => l.type === params.filters?.type);
  }
  items = sortItems(items, params.sortBy ?? "requestedAt", params.sortDir ?? "desc");
  return paginate(items, params);
}

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  avatarUrl: string;
  allocated: number;
  used: number;
}

export async function getLeaveBalances(companyId: string): Promise<LeaveBalance[]> {
  await delay(250);
  const employees = EMPLOYEES.filter((e) => e.companyId === companyId).slice(0, 8);
  return employees.map((e) => {
    const used = LEAVE_REQUESTS.filter(
      (l) => l.employeeId === e.id && l.status === "approved",
    ).reduce((sum, l) => sum + l.days, 0);
    return { employeeId: e.id, employeeName: e.name, avatarUrl: e.avatarUrl, allocated: 24, used };
  });
}
