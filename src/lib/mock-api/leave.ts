import { apiGet, apiPatch, apiPost } from "@/lib/mock-api/http";
import type { ApprovalStatus, LeaveRequest, PaginatedResult, QueryParams } from "@/types";

export interface LeaveRequestWithEmployee extends LeaveRequest {
  employeeName: string;
  employeeAvatar: string;
  employeeDepartmentId: string;
}

export async function listLeaveRequests(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<LeaveRequestWithEmployee>> {
  return apiGet<PaginatedResult<LeaveRequestWithEmployee>>("/api/leave", companyId, params);
}

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  avatarUrl: string;
  allocated: number;
  used: number;
}

export async function getLeaveBalances(companyId: string): Promise<LeaveBalance[]> {
  return apiGet<LeaveBalance[]>("/api/leave/balances", companyId);
}

export interface CreateLeaveInput {
  type: LeaveRequest["type"];
  startDate: string;
  endDate: string;
  reason: string;
}

export async function createLeaveRequest(
  companyId: string,
  employeeId: string,
  input: CreateLeaveInput,
): Promise<LeaveRequest> {
  return apiPost<LeaveRequest>("/api/leave", { companyId, employeeId, ...input });
}

export async function updateLeaveStatus(id: string, status: ApprovalStatus): Promise<LeaveRequest> {
  return apiPatch<LeaveRequest>(`/api/leave/${id}`, { status });
}
