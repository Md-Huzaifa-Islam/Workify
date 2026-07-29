import { apiGet } from "@/lib/mock-api/http";
import type { AttendanceRecord, PaginatedResult, QueryParams } from "@/types";

export interface AttendanceRow extends AttendanceRecord {
  employeeName: string;
  employeeAvatar: string;
  employeeRole: string;
}

export async function listTodayAttendance(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<AttendanceRow>> {
  return apiGet<PaginatedResult<AttendanceRow>>("/api/attendance", companyId, params);
}

export interface AttendanceSummary {
  present: number;
  late: number;
  absent: number;
  leave: number;
  total: number;
  weeklyTrend: { day: string; present: number; absent: number }[];
}

export async function getAttendanceSummary(companyId: string): Promise<AttendanceSummary> {
  return apiGet<AttendanceSummary>("/api/attendance/summary", companyId);
}
