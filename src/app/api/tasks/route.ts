import { NextRequest, NextResponse } from "next/server";
import { EMPLOYEES, PROJECTS, TASKS } from "@/lib/mock/seed";
import { cached, entityTag, revalidate } from "@/lib/server/cache";
import { delay } from "@/lib/server/query-utils";
import type { Priority, Task } from "@/types";

const TAG = entityTag("tasks");

const getTaskBoard = cached("task-board", 10, [TAG], async (companyId: string) => {
  await delay();
  return TASKS.filter((t) => t.companyId === companyId).map((t) => {
    const assignee = EMPLOYEES.find((e) => e.id === t.assigneeId);
    const project = PROJECTS.find((p) => p.id === t.projectId);
    return {
      ...t,
      assigneeName: assignee?.name ?? null,
      assigneeAvatar: assignee?.avatarUrl ?? null,
      projectName: project?.name ?? "Unknown",
      projectColor: project?.color ?? "#6366f1",
    };
  });
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }
  return NextResponse.json(await getTaskBoard(companyId));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    companyId: string;
    reporterId: string;
    title: string;
    projectId: string;
    assigneeId: string | null;
    priority: Priority;
    dueDate: string | null;
  };
  await delay(250);
  const task: Task = {
    id: `task_${body.projectId}_${crypto.randomUUID()}`,
    projectId: body.projectId,
    companyId: body.companyId,
    title: body.title,
    description: "",
    status: "todo",
    priority: body.priority,
    assigneeId: body.assigneeId,
    reporterId: body.reporterId,
    labels: [],
    dueDate: body.dueDate,
    createdAt: new Date().toISOString(),
    commentCount: 0,
    attachmentCount: 0,
    subtaskTotal: 0,
    subtaskDone: 0,
  };
  TASKS.push(task);
  revalidate(TAG);
  revalidate(entityTag("projects"));
  return NextResponse.json(task, { status: 201 });
}
