import { NextRequest, NextResponse } from "next/server";
import { DEPARTMENTS, EMPLOYEES, PROJECTS, TEAMS } from "@/lib/mock/seed";
import { cached, entityTag, revalidate } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";
import type { Department } from "@/types";

const TAG = entityTag("departments");

const getDepartmentsList = cached("departments-list", 60, [TAG], async (companyId: string) => {
  await delay();
  return DEPARTMENTS.filter((d) => d.companyId === companyId).map((d) => {
    const head = EMPLOYEES.find((e) => e.id === d.headId);
    return {
      ...d,
      headName: head?.name ?? null,
      headAvatar: head?.avatarUrl ?? null,
      projectCount: PROJECTS.filter((p) => p.departmentId === d.id).length,
      teamCount: TEAMS.filter((t) => t.departmentId === d.id).length,
    };
  });
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getDepartmentsList(companyId));
}

const COLOR_POOL = ["#6366f1", "#0ea5e9", "#d946ef", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#14b8a6"];

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { companyId: string; name: string; budget: number };
  await delay(250);
  const department: Department = {
    id: `dept_${body.companyId}_${crypto.randomUUID()}`,
    companyId: body.companyId,
    name: body.name,
    headId: null,
    employeeCount: 0,
    budget: body.budget,
    color: COLOR_POOL[DEPARTMENTS.length % COLOR_POOL.length],
  };
  DEPARTMENTS.push(department);
  revalidate(TAG);
  return NextResponse.json(department, { status: 201 });
}
