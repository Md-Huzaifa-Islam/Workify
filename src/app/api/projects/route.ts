import { NextRequest, NextResponse } from "next/server";
import { DEPARTMENTS, EMPLOYEES, PROJECTS, TASKS } from "@/lib/mock/seed";
import { cached, entityTag, revalidate } from "@/lib/server/cache";
import { delay, paginate, parseQueryParams, searchItems, sortItems } from "@/lib/server/query-utils";
import type { Priority, Project } from "@/types";

const TAG = entityTag("projects");

function enrichProject(p: Project) {
  const owner = EMPLOYEES.find((e) => e.id === p.ownerId);
  const dept = DEPARTMENTS.find((d) => d.id === p.departmentId);
  const members = p.memberIds
    .map((id) => EMPLOYEES.find((e) => e.id === id))
    .filter((e): e is (typeof EMPLOYEES)[number] => Boolean(e))
    .map((e) => ({ id: e.id, name: e.name, avatarUrl: e.avatarUrl }));
  return {
    ...p,
    ownerName: owner?.name ?? "Unknown",
    ownerAvatar: owner?.avatarUrl ?? "",
    departmentName: dept?.name ?? "Unknown",
    taskCount: TASKS.filter((t) => t.projectId === p.id).length,
    members,
  };
}

const getProjectsList = cached(
  "projects-list",
  15,
  [TAG],
  async (companyId: string, paramsJson: string) => {
    await delay();
    const params = JSON.parse(paramsJson) as ReturnType<typeof parseQueryParams>;
    let items = PROJECTS.filter((p) => p.companyId === companyId).map(enrichProject);
    if (params.filters?.status) {
      items = items.filter((p) => p.status === params.filters?.status);
    }
    items = searchItems(items, params.search, ["name", "description"]);
    items = sortItems(items, params.sortBy, params.sortDir);
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
  return NextResponse.json(await getProjectsList(companyId, JSON.stringify(params)));
}

const COLOR_POOL = ["#6366f1", "#0ea5e9", "#d946ef", "#f59e0b", "#10b981", "#ef4444"];

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    companyId: string;
    ownerId: string;
    name: string;
    description: string;
    departmentId: string;
    priority: Priority;
    dueDate: string;
    budget: number;
  };
  await delay(300);
  const project: Project = {
    id: `project_${body.companyId}_${crypto.randomUUID()}`,
    companyId: body.companyId,
    departmentId: body.departmentId,
    name: body.name,
    description: body.description,
    status: "planning",
    progress: 0,
    priority: body.priority,
    ownerId: body.ownerId,
    memberIds: [body.ownerId],
    startDate: new Date().toISOString(),
    dueDate: body.dueDate,
    budget: body.budget,
    spent: 0,
    color: COLOR_POOL[PROJECTS.length % COLOR_POOL.length],
  };
  PROJECTS.push(project);
  revalidate(TAG);
  return NextResponse.json(project, { status: 201 });
}
