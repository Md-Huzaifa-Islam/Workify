import { NextRequest, NextResponse } from "next/server";
import { PROJECTS } from "@/lib/mock/seed";
import { cached } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";

const getDeadlines = cached("dashboard-deadlines", 20, ["entity:dashboard"], async (companyId: string) => {
  await delay(150);
  return PROJECTS.filter((p) => p.companyId === companyId && p.status === "active")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)
    .map((p) => ({ id: p.id, name: p.name, dueDate: p.dueDate, progress: p.progress, priority: p.priority }));
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getDeadlines(companyId));
}
