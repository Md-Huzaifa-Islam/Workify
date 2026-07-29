import { NextRequest, NextResponse } from "next/server";
import { ATTENDANCE_RECORDS } from "@/lib/mock/seed";
import { cached, entityTag } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const getSummary = cached("attendance-summary", 30, [entityTag("attendance")], async (companyId: string) => {
  await delay();
  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = ATTENDANCE_RECORDS.filter((a) => a.companyId === companyId && a.date === today);
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyTrend = dayLabels.map((day, i) => {
    const records = ATTENDANCE_RECORDS.filter((a, idx) => a.companyId === companyId && idx % 7 === i);
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
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getSummary(companyId));
}
