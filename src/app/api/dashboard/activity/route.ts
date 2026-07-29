import { NextRequest, NextResponse } from "next/server";
import { ACTIVITY_LOG, EMPLOYEES } from "@/lib/mock/seed";
import { cached } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const getActivity = cached("dashboard-activity", 20, ["entity:dashboard"], async (companyId: string) => {
  await delay(150);
  return ACTIVITY_LOG.filter((a) => a.companyId === companyId)
    .slice(0, 12)
    .map((entry) => {
      const actor = EMPLOYEES.find((e) => e.id === entry.actorId);
      return {
        id: entry.id,
        actorName: actor?.name ?? "Unknown",
        actorAvatar: actor?.avatarUrl ?? "",
        action: entry.action,
        target: entry.target,
        createdAt: entry.createdAt,
      };
    });
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getActivity(companyId));
}
