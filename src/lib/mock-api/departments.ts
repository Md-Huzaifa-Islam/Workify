import { apiGet, apiPost } from "@/lib/mock-api/http";
import type { Department, Team } from "@/types";

export interface DepartmentRow extends Department {
  headName: string | null;
  headAvatar: string | null;
  projectCount: number;
  teamCount: number;
}

export async function listDepartments(companyId: string): Promise<DepartmentRow[]> {
  return apiGet<DepartmentRow[]>("/api/departments", companyId);
}

export interface CreateDepartmentInput {
  name: string;
  budget: number;
}

export async function createDepartment(companyId: string, input: CreateDepartmentInput): Promise<Department> {
  return apiPost<Department>("/api/departments", { companyId, ...input });
}

export interface TeamRow extends Team {
  departmentName: string;
  leadName: string;
  leadAvatar: string;
  members: { id: string; name: string; avatarUrl: string }[];
}

export async function listTeams(companyId: string): Promise<TeamRow[]> {
  return apiGet<TeamRow[]>("/api/teams", companyId);
}

export interface CreateTeamInput {
  name: string;
  departmentId: string;
  leadId: string;
  description: string;
}

export async function createTeam(companyId: string, input: CreateTeamInput): Promise<Team> {
  return apiPost<Team>("/api/teams", { companyId, ...input });
}
