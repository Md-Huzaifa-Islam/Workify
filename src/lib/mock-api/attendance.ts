import { ATTENDANCE_RECORDS, EMPLOYEES } from "@/lib/mock/seed";
import { delay, paginate, searchItems } from "@/lib/mock-api/client";
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
  await delay();
  const today = new Date().toISOString().slice(0, 10);
  let items: AttendanceRow[] = ATTENDANCE_RECORDS.filter(
    (a) => a.companyId === companyId && a.date === today,
  ).map((a) => {
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
  await delay(250);
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = ATTENDANCE_RECORDS.filter((a) => a.companyId === companyId && a.date === today);
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyTrend = dayLabels.map((day, i) => {
    const records = ATTENDANCE_RECORDS.filter(
      (a, idx) => a.companyId === companyId && idx % 7 === i,
    );
    return {
      day,
      present: records.filter((r) => r.status === "present" || r.status === "late").length,
      absent: records.filter((r) => r.status === "absent").length,
    };
  });
  return {
    present: todayRecords.filter((a) => a.status === "present").length,
    late: todayRecords.filter((a) => a.status === "late").length,
    absent: todayRecords.filter((a) => a.status === "absent").length,
    leave: todayRecords.filter((a) => a.status === "leave").length,
    total: todayRecords.length,
    weeklyTrend,
  };
}
