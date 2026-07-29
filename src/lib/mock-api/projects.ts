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

export interface CreateProjectInput {
  name: string;
  description: string;
  departmentId: string;
  priority: Project["priority"];
  dueDate: string;
  budget: number;
}

const PROJECT_COLOR_POOL = ["#6366f1", "#0ea5e9", "#d946ef", "#f59e0b", "#10b981", "#ef4444"];

export async function createProject(
  companyId: string,
  ownerId: string,
  input: CreateProjectInput,
): Promise<Project> {
  await delay(400);
  const project: Project = {
    id: `project_${companyId}_${crypto.randomUUID()}`,
    companyId,
    departmentId: input.departmentId,
    name: input.name,
    description: input.description,
    status: "planning",
    progress: 0,
    priority: input.priority,
    ownerId,
    memberIds: [ownerId],
    startDate: new Date().toISOString(),
    dueDate: input.dueDate,
    budget: input.budget,
    spent: 0,
    color: PROJECT_COLOR_POOL[PROJECTS.length % PROJECT_COLOR_POOL.length],
  };
  PROJECTS.push(project);
  return project;
}

export interface CreateTaskInput {
  title: string;
  projectId: string;
  assigneeId: string | null;
  priority: Task["priority"];
  dueDate: string | null;
}

export async function createTask(
  companyId: string,
  reporterId: string,
  input: CreateTaskInput,
): Promise<Task> {
  await delay(350);
  const task: Task = {
    id: `task_${input.projectId}_${crypto.randomUUID()}`,
    projectId: input.projectId,
    companyId,
    title: input.title,
    description: "",
    status: "todo",
    priority: input.priority,
    assigneeId: input.assigneeId,
    reporterId,
    labels: [],
    dueDate: input.dueDate,
    createdAt: new Date().toISOString(),
    commentCount: 0,
    attachmentCount: 0,
    subtaskTotal: 0,
    subtaskDone: 0,
  };
  TASKS.push(task);
  return task;
}
