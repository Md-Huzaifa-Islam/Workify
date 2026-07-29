import { apiGet, apiPost } from "@/lib/mock-api/http";
import type { PaginatedResult, Priority, Project, QueryParams, Task } from "@/types";

export interface ProjectRow extends Project {
  ownerName: string;
  ownerAvatar: string;
  departmentName: string;
  taskCount: number;
  members: { id: string; name: string; avatarUrl: string }[];
}

export async function listProjects(
  companyId: string,
  params: QueryParams = {},
): Promise<PaginatedResult<ProjectRow>> {
  return apiGet<PaginatedResult<ProjectRow>>("/api/projects", companyId, params);
}

export interface CreateProjectInput {
  name: string;
  description: string;
  departmentId: string;
  priority: Priority;
  dueDate: string;
  budget: number;
}

export async function createProject(
  companyId: string,
  ownerId: string,
  input: CreateProjectInput,
): Promise<Project> {
  return apiPost<Project>("/api/projects", { companyId, ownerId, ...input });
}

export interface TaskRow extends Task {
  assigneeName: string | null;
  assigneeAvatar: string | null;
  projectName: string;
  projectColor: string;
}

export async function listTaskBoard(companyId: string): Promise<TaskRow[]> {
  return apiGet<TaskRow[]>("/api/tasks", companyId);
}

export interface CreateTaskInput {
  title: string;
  projectId: string;
  assigneeId: string | null;
  priority: Priority;
  dueDate: string | null;
}

export async function createTask(
  companyId: string,
  reporterId: string,
  input: CreateTaskInput,
): Promise<Task> {
  return apiPost<Task>("/api/tasks", { companyId, reporterId, ...input });
}
