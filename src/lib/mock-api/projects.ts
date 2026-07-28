import { DEPARTMENTS, EMPLOYEES, PROJECTS, TASKS } from "@/lib/mock/seed";
import { delay, paginate, searchItems, sortItems } from "@/lib/mock-api/client";
import type { PaginatedResult, Project, QueryParams, Task } from "@/types";

export interface ProjectRow extends Project {
  ownerName: string;
  ownerAvatar: string;
  departmentName: string;
  taskCount: number;
  members: { id: string; name: string; avatarUrl: string }[];
}

function enrichProject(p: Project): ProjectRow {
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

export async function listProjects(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<ProjectRow>> {
  await delay();
  let items = PROJECTS.filter((p) => p.companyId === companyId).map(enrichProject);
  if (params.filters?.status) {
    items = items.filter((p) => p.status === params.filters?.status);
  }
  items = searchItems(items, params.search, ["name", "description"]);
  items = sortItems(items, params.sortBy, params.sortDir);
  return paginate(items, params);
}

export async function getProject(id: string): Promise<Project | null> {
  await delay(200);
  return PROJECTS.find((p) => p.id === id) ?? null;
}

export async function listTasksByProject(projectId: string): Promise<Task[]> {
  await delay(250);
  return TASKS.filter((t) => t.projectId === projectId);
}

export async function listTasksByCompany(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<Task>> {
  await delay();
  let items = TASKS.filter((t) => t.companyId === companyId);
  if (params.filters?.status) {
    items = items.filter((t) => t.status === params.filters?.status);
  }
  if (params.filters?.priority) {
    items = items.filter((t) => t.priority === params.filters?.priority);
  }
  items = searchItems(items, params.search, ["title", "description"]);
  items = sortItems(items, params.sortBy, params.sortDir);
  return paginate(items, params);
}

export interface TaskRow extends Task {
  assigneeName: string | null;
  assigneeAvatar: string | null;
  projectName: string;
  projectColor: string;
}

export async function listTaskBoard(companyId: string): Promise<TaskRow[]> {
  await delay(300);
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
}
