import { DEPARTMENTS, EMPLOYEES, PROJECTS, TEAMS } from "@/lib/mock/seed";
import { delay } from "@/lib/mock-api/client";
import type { Department, Team } from "@/types";

export interface DepartmentRow extends Department {
  headName: string | null;
  headAvatar: string | null;
  projectCount: number;
  teamCount: number;
}

export async function listDepartments(companyId: string): Promise<DepartmentRow[]> {
  await delay(200);
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
}

export interface TeamRow extends Team {
  departmentName: string;
  leadName: string;
  leadAvatar: string;
  members: { id: string; name: string; avatarUrl: string }[];
}

export async function listTeams(companyId: string): Promise<TeamRow[]> {
  await delay(200);
  return TEAMS.filter((t) => t.companyId === companyId).map((t) => {
    const dept = DEPARTMENTS.find((d) => d.id === t.departmentId);
    const lead = EMPLOYEES.find((e) => e.id === t.leadId);
    const members = t.memberIds
      .map((id) => EMPLOYEES.find((e) => e.id === id))
      .filter((e): e is (typeof EMPLOYEES)[number] => Boolean(e))
      .map((e) => ({ id: e.id, name: e.name, avatarUrl: e.avatarUrl }));
    return {
      ...t,
      departmentName: dept?.name ?? "Unknown",
      leadName: lead?.name ?? "Unknown",
      leadAvatar: lead?.avatarUrl ?? "",
      members,
    };
  });
}

export interface CreateDepartmentInput {
  name: string;
  budget: number;
}

const DEPARTMENT_COLOR_POOL = ["#6366f1", "#0ea5e9", "#d946ef", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#14b8a6"];

export async function createDepartment(
  companyId: string,
  input: CreateDepartmentInput,
): Promise<Department> {
  await delay(400);
  const department: Department = {
    id: `dept_${companyId}_${crypto.randomUUID()}`,
    companyId,
    name: input.name,
    headId: null,
    employeeCount: 0,
    budget: input.budget,
    color: DEPARTMENT_COLOR_POOL[DEPARTMENTS.length % DEPARTMENT_COLOR_POOL.length],
  };
  DEPARTMENTS.push(department);
  return department;
}

export interface CreateTeamInput {
  name: string;
  departmentId: string;
  leadId: string;
  description: string;
}

export async function createTeam(companyId: string, input: CreateTeamInput): Promise<Team> {
  await delay(400);
  const team: Team = {
    id: `team_${input.departmentId}_${crypto.randomUUID()}`,
    companyId,
    departmentId: input.departmentId,
    name: input.name,
    leadId: input.leadId,
    memberIds: [input.leadId],
    description: input.description,
  };
  TEAMS.push(team);
  return team;
}
