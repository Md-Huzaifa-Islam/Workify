import { NextRequest, NextResponse } from "next/server";
import { EMPLOYEES, LEAVE_REQUESTS } from "@/lib/mock/seed";
import { cached, entityTag } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const getBalances = cached("leave-balances", 15, [entityTag("leave")], async (companyId: string) => {
  await delay();
  const employees = EMPLOYEES.filter((e) => e.companyId === companyId).slice(0, 8);
  return employees.map((e) => {
    const used = LEAVE_REQUESTS.filter(
      (l) => l.employeeId === e.id && l.status === "approved",
    ).reduce((sum, l) => sum + l.days, 0);
    return { employeeId: e.id, employeeName: e.name, avatarUrl: e.avatarUrl, allocated: 24, used };
  });
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getBalances(companyId));
}
