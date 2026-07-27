import { PROJECTS, TASKS } from "@/lib/mock/seed";
import { delay, paginate, searchItems, sortItems } from "@/lib/mock-api/client";
import type { PaginatedResult, Project, QueryParams, Task } from "@/types";

export async function listProjects(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<Project>> {
  await delay();
  let items = PROJECTS.filter((p) => p.companyId === companyId);
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
